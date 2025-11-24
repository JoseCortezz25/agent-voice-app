import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import type { LiveSendRealtimeInputParameters, Session } from '@google/genai';
import {
  createPcmBlob,
  base64ToBytes,
  decodeAudioData
} from '../utils/audio-utils';
import type { VoiceName } from '../types';

// Constants
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

type ExtendedWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const getAudioContextConstructor = (): typeof AudioContext => {
  if (typeof window === 'undefined') {
    throw new Error(
      'AudioContext is not available in a non-browser environment.'
    );
  }

  const extendedWindow = window as ExtendedWindow;
  const AudioContextCtor =
    extendedWindow.AudioContext ?? extendedWindow.webkitAudioContext;

  if (!AudioContextCtor) {
    throw new Error('AudioContext is not supported in this browser.');
  }

  return AudioContextCtor;
};

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

interface GeminiLiveConfig {
  voiceName?: VoiceName;
  systemPrompt?: string;
  model?: string;
  conversationId?: string;
}

interface UseGeminiLiveReturn {
  status: ConnectionStatus;
  isMuted: boolean;
  volumeLevel: number;
  connect: (config?: GeminiLiveConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  toggleMute: () => void;
  error: string | null;
}

export function useGeminiLive(): UseGeminiLiveReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs to hold mutable instances without triggering re-renders
  const sessionPromiseRef = useRef<Promise<Session> | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isMutedRef = useRef(false); // Ref for synchronous access in audio processor
  const isCleaningUpRef = useRef(false); // Prevent reconnection during cleanup

  // Sync ref with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const cleanup = useCallback(async () => {
    isCleaningUpRef.current = true;
    console.log('Cleanup starting...');

    // 1. Close Session (if possible)
    if (sessionPromiseRef.current) {
      try {
        const session = await sessionPromiseRef.current;
        // The SDK might expose close on the session object
        if (session.close) {
          session.close();
        }
      } catch (e) {
        console.warn('Error closing session', e);
      }
      sessionPromiseRef.current = null;
    }

    // 2. Stop Microphone Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 3. Disconnect Audio Nodes
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // 4. Close Audio Contexts
    if (inputContextRef.current) {
      await inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      // Stop all currently playing sources
      sourcesRef.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          console.error('Error stopping source', e);
        }
      });
      sourcesRef.current.clear();

      await outputContextRef.current.close();
      outputContextRef.current = null;
    }

    setStatus('disconnected');
    setVolumeLevel(0);
    isCleaningUpRef.current = false; // Reset flag after cleanup completes
    console.log('Cleanup completed');
  }, []);

  const connect = useCallback(
    async (config?: GeminiLiveConfig) => {
      try {
        // Prevent connection if cleanup is in progress
        if (isCleaningUpRef.current) {
          console.log('Prevented connection during cleanup');
          return;
        }

        if (status === 'connected' || status === 'connecting') return;

        setStatus('connecting');
        setError(null);
        isCleaningUpRef.current = false; // Reset cleanup flag

        // Use provided config or defaults
        const voiceName = config?.voiceName || 'Puck';
        const systemInstruction =
          config?.systemPrompt || 'You are a helpful voice assistant.';
        const modelName =
          config?.model || 'gemini-2.5-flash-native-audio-preview-09-2025';

        // Initialize GoogleGenAI
        const ai = new GoogleGenAI({
          apiKey: GEMINI_API_KEY
        });

        // Initialize Audio Contexts
        // Input: 16kHz for Gemini
        const AudioContextConstructor = getAudioContextConstructor();
        const inputCtx = new AudioContextConstructor({
          sampleRate: INPUT_SAMPLE_RATE
        });
        // Output: 24kHz from Gemini
        const outputCtx = new AudioContextConstructor({
          sampleRate: OUTPUT_SAMPLE_RATE
        });

        inputContextRef.current = inputCtx;
        outputContextRef.current = outputCtx;
        nextStartTimeRef.current = 0;

        // Get Microphone Access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        streamRef.current = stream;

        // Setup Input Pipeline (Mic -> ScriptProcessor)
        const source = inputCtx.createMediaStreamSource(stream);
        inputSourceRef.current = source;

        // Buffer size 4096 gives decent latency/performance balance
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = e => {
          // Calculate volume for visualizer
          const inputData = e.inputBuffer.getChannelData(0);

          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          // Normalize roughly 0-1 for visualizer
          const vol = Math.min(1, rms * 5);
          setVolumeLevel(vol);

          // If muted, do not send data
          if (isMutedRef.current) return;

          const pcmBlob = createPcmBlob(inputData);

          // Send to Gemini
          if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => {
              // Basic error handling for send
              try {
                const realtimeInput: LiveSendRealtimeInputParameters = {
                  media: pcmBlob
                };
                session.sendRealtimeInput(realtimeInput);
              } catch (err) {
                console.error('Error sending input', err);
              }
            });
          }
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);

        // Connect to Gemini Live API
        const sessionPromise = ai.live.connect({
          model: modelName,
          callbacks: {
            onopen: () => {
              console.log('Gemini Live Session Opened');
              setStatus('connected');
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Output Audio
              const base64Audio =
                message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

              if (base64Audio && outputContextRef.current) {
                try {
                  const ctx = outputContextRef.current;
                  const audioData = base64ToBytes(base64Audio);
                  const audioBuffer = await decodeAudioData(
                    audioData,
                    ctx,
                    OUTPUT_SAMPLE_RATE,
                    1
                  );

                  // Schedule playback
                  // Ensure we don't schedule in the past
                  const now = ctx.currentTime;
                  // If nextStartTime is way behind (lag), reset it to now
                  if (nextStartTimeRef.current < now) {
                    nextStartTimeRef.current = now;
                  }

                  const bufferSource = ctx.createBufferSource();
                  bufferSource.buffer = audioBuffer;

                  // Simple visualizer update for output (overrides input volume if AI is speaking)
                  // In a real app we might mix them or distinguish them.
                  // Here we just let the input processor drive the visualizer
                  // unless we want to visualize the AI specifically.
                  // Let's stick to input volume for the 'mic' indicator,
                  // but maybe we can trigger a separate state for 'AI Speaking'.

                  const gainNode = ctx.createGain();
                  // volume control could go here

                  bufferSource.connect(gainNode);
                  gainNode.connect(ctx.destination);

                  bufferSource.start(nextStartTimeRef.current);
                  nextStartTimeRef.current += audioBuffer.duration;

                  sourcesRef.current.add(bufferSource);
                  bufferSource.onended = () => {
                    sourcesRef.current.delete(bufferSource);
                  };
                } catch (decodeErr) {
                  console.error('Audio decode error', decodeErr);
                }
              }

              // Handle Interruption
              if (message.serverContent?.interrupted) {
                console.log('Interrupted by user');
                // Stop all currently pending/playing audio
                sourcesRef.current.forEach(src => {
                  try {
                    src.stop();
                  } catch (e) {
                    console.error('Error stopping source', e);
                  }
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => {
              console.log('Session Closed');
              cleanup();
            },
            onerror: err => {
              console.error('Session Error', err);
              setError('Connection error occurred.');
              cleanup();
            }
          },
          config: {
            systemInstruction: { parts: [{ text: systemInstruction }] },
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } }
            }
          }
        });

        sessionPromiseRef.current = sessionPromise;
      } catch (err) {
        if (err instanceof Error) {
          console.error('Connection failed', err.message);
          setError(err.message);
          cleanup();
        }
        console.error('Connection failed', err);
        setError('Failed to connect.');
        cleanup();
      }
    },
    [status, cleanup]
  );

  const disconnect = useCallback(async () => {
    await cleanup();
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Cleanup on unmount - always cleanup regardless of status
  useEffect(() => {
    return () => {
      // Force cleanup when hook is unmounted
      console.log('useGeminiLive unmounting, cleaning up...');
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isMuted,
    volumeLevel,
    connect,
    disconnect,
    toggleMute,
    error
  };
}
