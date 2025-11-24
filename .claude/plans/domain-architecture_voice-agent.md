# Voice Agent Platform - Domain Architecture Plan

**Created**: 2025-11-18
**Complexity**: High
**Architecture Pattern**: Screaming Architecture + Atomic Design

---

## 1. Overview

The Voice Agent platform is built on three core domains:

1. **chat-agent**: White Library integration (HTTP-based webhook pattern)
2. **live-voice-agent**: Gemini Live API integration (WebSocket real-time pattern)
3. **session-management**: Common session and history logic

Each domain is independently deployable while sharing common session infrastructure.

---

## 2. Architecture Principles

### Key Constraints (from critical-constraints.md)

- ✅ React Server Components by default
- ✅ Server Actions for all mutations
- ✅ React Query for server state (backend data)
- ✅ Zustand ONLY for UI/client state (NOT backend data)
- ✅ Custom hooks for business logic extraction
- ✅ Zod schemas for all validation
- ✅ Mandatory session validation in all Server Actions
- ✅ Dependency rules: No circular imports, follow layer hierarchy

### Domain Dependency Graph

```
┌────────────────────────────────────────────────────┐
│            App (Next.js Routes)                    │
│  ├── app/chat/page.tsx (uses chat-agent)           │
│  ├── app/voice/page.tsx (uses live-voice-agent)    │
│  └── app/history/page.tsx (uses session-mgmt)      │
└────────────────────────────────────────────────────┘
              │                    │                    │
              ▼                    ▼                    ▼
    ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐
    │  chat-agent     │  │ live-voice-agent │  │ session-mgmt │
    │  (domain)       │  │  (domain)        │  │ (shared)     │
    └─────────────────┘  └──────────────────┘  └─────────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
              ▼                                         ▼
    ┌──────────────────────┐            ┌──────────────────────┐
    │  components/ (UI)    │            │  lib/ (infrastructure)│
    │  ├── atoms/          │            │  ├── auth.ts         │
    │  ├── molecules/      │            │  ├── db.ts           │
    │  └── organisms/      │            │  └── api-client.ts   │
    └──────────────────────┘            └──────────────────────┘
              │                                     │
              └─────────────────┬───────────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │  utils/      │
                        │  (pure)      │
                        └──────────────┘
```

---

## 3. Chat Agent Domain

**Location**: `src/domains/chat-agent/`
**Pattern**: HTTP webhook with White Library pre-built UI
**Integration**: White Library React component + Server Action webhook

### 3.1 Domain Structure

```
src/domains/chat-agent/
├── components/
│   ├── atoms/
│   │   └── chat-indicator.tsx          # Recording/listening indicator
│   └── organisms/
│       └── white-chat-container.tsx    # Main White Library component wrapper
│
├── hooks/
│   ├── use-chat-config.ts              # Chat config + theme setup
│   ├── use-chat-message-handler.ts     # Process incoming messages
│   └── use-chat-session.ts             # Session management
│
├── stores/
│   └── chat-ui-store.ts                # UI state ONLY (not messages)
│
├── services/
│   └── gemini-service.ts               # Gemini API integration
│
├── actions.ts                          # Server Actions (webhook handlers)
├── schema.ts                           # Zod validation schemas
├── types.ts                            # TypeScript interfaces
└── errors.ts                           # Custom error classes
```

### 3.2 Core Entity: ChatSession

**Purpose**: Represents an active chat conversation in White Library

```typescript
// src/domains/chat-agent/types.ts
export interface ChatSession {
  id: string;
  userId: string;

  // Chat metadata
  title: string;
  startedAt: Date;
  updatedAt: Date;

  // Configuration
  modelConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
  };

  // Status
  status: 'active' | 'paused' | 'ended';
  isArchived: boolean;

  // Metrics
  messageCount: number;
  totalTokensUsed: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;

  // Content (multiple fields = multiple messages in White Library)
  role: 'user' | 'assistant';
  content: Record<string, string>; // e.g., { "Part1": "...", "Part2": "..." }

  // Audio for voice messages
  audioUrl?: string; // For audio messages
  transcription?: string; // User's speech-to-text

  // Metadata
  createdAt: Date;
  tokensUsed: number;
}

export interface ChatWebhookPayload {
  sessionId: string;
  message: string;
  type: 'text' | 'audio';
  audioBlob?: Blob; // Only for audio type
  timestamp: Date;
}

export interface ChatWebhookResponse {
  [key: string]: string; // Multiple fields render as multiple messages
}
```

### 3.3 Validation Schemas

```typescript
// src/domains/chat-agent/schema.ts
import { z } from 'zod';

export const chatSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().min(1).max(200),
  startedAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['active', 'paused', 'ended']),
  isArchived: z.boolean(),
  messageCount: z.number().int().positive(),
  totalTokensUsed: z.number().int().nonnegative()
});

export const createChatSessionSchema = chatSessionSchema.omit({
  id: true,
  startedAt: true,
  updatedAt: true,
  messageCount: true,
  totalTokensUsed: true
});

export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.record(z.string()),
  audioUrl: z.string().optional(),
  transcription: z.string().optional(),
  createdAt: z.date(),
  tokensUsed: z.number().int().nonnegative()
});

export const webhookPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1),
  type: z.enum(['text', 'audio']),
  timestamp: z.date()
});

export type ChatSession = z.infer<typeof chatSessionSchema>;
export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
```

### 3.4 Server Actions (Webhook Handlers)

```typescript
// src/domains/chat-agent/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { webhookPayloadSchema } from './schema';
import { processTextMessage, processAudioMessage } from './services/gemini-service';
import { revalidatePath } from 'next/cache';

/**
 * Process text message from White Library webhook
 * Called when user sends text message via White Library
 */
export async function processChatMessage(
  sessionId: string,
  message: string
) {
  // ✅ 1. Session validation (MANDATORY)
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // ✅ 2. Input validation
  const validated = webhookPayloadSchema.safeParse({
    sessionId,
    message,
    type: 'text',
    timestamp: new Date()
  });

  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid input',
      details: validated.error.errors
    };
  }

  // ✅ 3. Verify session ownership
  const chatSession = await db.chatSession.findUnique({
    where: { id: sessionId }
  });

  if (!chatSession || chatSession.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  // ✅ 4. Process message with Gemini
  try {
    const response = await processTextMessage(message, chatSession);

    // ✅ 5. Save to database
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: { text: message },
        tokensUsed: 0
      }
    });

    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: response,
        tokensUsed: 0
      }
    });

    // ✅ 6. Invalidate cache
    revalidatePath(`/chat/${sessionId}`);

    // Return in White Library format: multiple fields = multiple messages
    return {
      success: true,
      ...response
    };
  } catch (error) {
    console.error('Chat message processing failed:', error);
    return {
      success: false,
      error: 'Failed to process message'
    };
  }
}

/**
 * Process audio message from White Library webhook
 * Called when user sends audio message via White Library
 */
export async function processAudioMessage(
  sessionId: string,
  audioBlob: Blob
) {
  // ✅ 1. Session validation
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // ✅ 2. Verify session ownership
  const chatSession = await db.chatSession.findUnique({
    where: { id: sessionId }
  });

  if (!chatSession || chatSession.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  try {
    // ✅ 3. Convert audio to text (speech-to-text)
    const transcription = await processAudioMessage(audioBlob);

    // ✅ 4. Process text through Gemini
    const response = await processTextMessage(transcription, chatSession);

    // ✅ 5. Save messages
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: { transcription },
        audioUrl: await uploadAudio(audioBlob),
        tokensUsed: 0
      }
    });

    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: response,
        tokensUsed: 0
      }
    });

    revalidatePath(`/chat/${sessionId}`);

    return {
      success: true,
      transcription,
      ...response
    };
  } catch (error) {
    console.error('Audio processing failed:', error);
    return {
      success: false,
      error: 'Failed to process audio'
    };
  }
}

/**
 * Create new chat session
 */
export async function createChatSession(title: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const chatSession = await db.chatSession.create({
      data: {
        userId: session.user.id,
        title,
        status: 'active'
      }
    });

    revalidatePath('/chat');

    return { success: true, session: chatSession };
  } catch (error) {
    console.error('Failed to create chat session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

/**
 * End chat session
 */
export async function endChatSession(sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const chatSession = await db.chatSession.findUnique({
    where: { id: sessionId }
  });

  if (!chatSession || chatSession.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  try {
    await db.chatSession.update({
      where: { id: sessionId },
      data: { status: 'ended' }
    });

    revalidatePath(`/chat/${sessionId}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to end session' };
  }
}
```

### 3.5 Custom Hooks

```typescript
// src/domains/chat-agent/hooks/use-chat-config.ts
'use client';

import { defaultChatConfig, defaultChatTheme } from 'white-library';
import type { ChatConfig, ChatTheme } from 'white-library';

export function useChatConfig() {
  const config: ChatConfig = {
    ...defaultChatConfig,
    agentUrl: '/api/chat-webhook', // Server Action endpoint
    texts: {
      headerTitle: 'Chat with AI',
      inputPlaceholder: 'Type your message or record...',
      recordingText: 'Recording...',
      listeningText: 'Listening...',
      sendButton: 'Send',
      clearButton: 'Clear'
    },
    behavior: {
      autoScroll: true,
      showTypingIndicator: true,
      enableAudio: true,
      enableTextToSpeech: true,
      maxMessageLength: 5000,
      recordingTimeLimit: 60000 // 60 seconds
    },
    appearance: {
      useSystemTheme: false,
      roundCorners: true,
      animationsEnabled: true
    }
  };

  const theme: ChatTheme = {
    ...defaultChatTheme,
    header: {
      ...defaultChatTheme.header,
      backgroundColor: '#2563eb',
      titleColor: '#ffffff',
      borderRadius: 8
    },
    bubbles: {
      ...defaultChatTheme.bubbles,
      user: {
        ...defaultChatTheme.bubbles?.user,
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 12
      },
      assistant: {
        ...defaultChatTheme.bubbles?.assistant,
        backgroundColor: '#f3f4f6',
        textColor: '#111827',
        borderRadius: 12
      }
    },
    input: {
      ...defaultChatTheme.input,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      textColor: '#111827'
    }
  };

  return { config, theme };
}

// src/domains/chat-agent/hooks/use-chat-session.ts
'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createChatSession,
  endChatSession
} from '../actions';

export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    }
  });
}

export function useEndChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => endChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    }
  });
}
```

### 3.6 UI State Store

```typescript
// src/domains/chat-agent/stores/chat-ui-store.ts
'use client';

import { create } from 'zustand';

interface ChatUIStore {
  // UI state ONLY (NOT messages - White Library manages those)
  isThemeDark: boolean;
  isFullscreen: boolean;
  showChatHistory: boolean;
  selectedSessionId: string | null;

  // Actions
  toggleTheme: () => void;
  toggleFullscreen: () => void;
  toggleChatHistory: () => void;
  setSelectedSession: (id: string | null) => void;
}

export const useChatUIStore = create<ChatUIStore>((set) => ({
  isThemeDark: false,
  isFullscreen: false,
  showChatHistory: true,
  selectedSessionId: null,

  toggleTheme: () => set(state => ({ isThemeDark: !state.isThemeDark })),
  toggleFullscreen: () => set(state => ({ isFullscreen: !state.isFullscreen })),
  toggleChatHistory: () => set(state => ({ showChatHistory: !state.showChatHistory })),
  setSelectedSession: (id) => set({ selectedSessionId: id })
}));
```

### 3.7 White Library Container Component

```typescript
// src/domains/chat-agent/components/organisms/white-chat-container.tsx
'use client';

import { ChatPage } from 'white-library';
import { useChatConfig } from '../../hooks/use-chat-config';
import { useChatUIStore } from '../../stores/chat-ui-store';

interface WhiteChatContainerProps {
  sessionId: string;
  userId: string;
}

export function WhiteChatContainer({
  sessionId,
  userId
}: WhiteChatContainerProps) {
  const { config, theme } = useChatConfig();
  const { isFullscreen } = useChatUIStore();

  // Override config with session-specific data
  const sessionConfig = {
    ...config,
    agentUrl: `/api/chat-webhook?sessionId=${sessionId}&userId=${userId}`
  };

  return (
    <div
      style={{
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ChatPage
        theme={theme}
        config={sessionConfig}
        initialSessionId={sessionId}
      />
    </div>
  );
}
```

---

## 4. Live Voice Agent Domain

**Location**: `src/domains/live-voice-agent/`
**Pattern**: WebSocket real-time streaming with custom UI
**Integration**: Gemini Live API + Web Audio API + Custom hooks

### 4.1 Domain Structure

```
src/domains/live-voice-agent/
├── components/
│   ├── atoms/
│   │   ├── voice-indicator.tsx         # Recording/processing indicator
│   │   ├── connection-status.tsx       # Connection status badge
│   │   └── volume-meter.tsx            # Audio level visualization
│   │
│   └── organisms/
│       └── live-voice-session.tsx      # Main voice session interface
│
├── hooks/
│   ├── use-gemini-live.ts              # Main orchestration hook
│   ├── use-audio-stream.ts             # Audio capture/playback
│   ├── use-voice-activity.ts           # Voice activity detection
│   └── use-connection-state.ts         # WebSocket state management
│
├── stores/
│   ├── voice-session-store.ts          # Session state
│   ├── audio-buffer-store.ts           # Audio buffer management
│   └── connection-store.ts             # WebSocket connection state
│
├── services/
│   ├── websocket-client.ts             # Gemini Live WebSocket wrapper
│   ├── audio-processor.ts              # Web Audio API wrapper
│   ├── vad-detector.ts                 # Voice Activity Detection
│   └── audio-encoder.ts                # PCM encoding/decoding
│
├── actions.ts                          # Server Actions (optional)
├── schema.ts                           # Zod validation
├── types.ts                            # TypeScript interfaces
└── errors.ts                           # Custom error classes
```

### 4.2 Core Entities: VoiceSession & AudioBuffer

```typescript
// src/domains/live-voice-agent/types.ts
export interface VoiceSession {
  id: string;
  userId: string;

  // Connection metadata
  startedAt: Date;
  endedAt?: Date;
  duration: number; // milliseconds

  // Status
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'ended';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';

  // Configuration
  model: string;
  voice: string;
  language: string;

  // Metrics
  bytesReceived: number;
  bytesSent: number;
  messagesCount: number;
  averageLatency: number; // milliseconds
}

export interface AudioBuffer {
  id: string;
  sessionId: string;

  // Content
  data: ArrayBuffer;
  mimeType: 'audio/pcm' | 'audio/wav' | 'audio/opus';
  sampleRate: number;

  // Direction
  direction: 'incoming' | 'outgoing';
  timestamp: Date;

  // Metadata
  duration: number; // milliseconds
  size: number; // bytes
}

export interface GeminiLiveConfig {
  apiKey: string;
  model: string; // e.g., 'gemini-2.0-flash-exp'
  voice: string; // e.g., 'Puck', 'Breeze', 'Charon'
  generationConfig: {
    responseModalities: string[];
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: string;
        };
      };
    };
  };
}

export interface WebSocketMessage {
  setup?: any;
  clientContent?: any;
  realtimeInput?: {
    mediaChunks: Array<{
      mimeType: string;
      data: string; // base64
    }>;
  };
  serverContent?: any;
}

export interface AudioMetrics {
  volumeLevel: number; // 0-1
  isVoiceActive: boolean;
  noiseLevel: number; // 0-1
  frequencyBand: 'low' | 'mid' | 'high' | 'full';
}
```

### 4.3 Service Layer - WebSocket Client

```typescript
// src/domains/live-voice-agent/services/websocket-client.ts
export class GeminiLiveWebSocketClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private model: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  // Event handlers
  onMessage?: (message: any) => void;
  onAudioReceived?: (audioData: ArrayBuffer) => void;
  onConnectionOpen?: () => void;
  onConnectionClose?: () => void;
  onError?: (error: any) => void;

  constructor(apiKey: string, model: string = 'gemini-2.0-flash-exp') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.sendSetupMessage();
          this.onConnectionOpen?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          this.handleError(error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          this.onConnectionClose?.();
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        this.handleError(error);
        reject(error);
      }
    });
  }

  private sendSetupMessage(): void {
    const setupMessage: WebSocketMessage = {
      setup: {
        model: `models/${this.model}`,
        generation_config: {
          response_modalities: ['AUDIO'],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: 'Puck'
              }
            }
          }
        }
      }
    };

    this.ws?.send(JSON.stringify(setupMessage));
  }

  sendAudio(audioData: ArrayBuffer): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready');
      return;
    }

    const base64Audio = this.arrayBufferToBase64(audioData);

    const message: WebSocketMessage = {
      realtime_input: {
        media_chunks: [
          {
            mime_type: 'audio/pcm',
            data: base64Audio
          }
        ]
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  private handleMessage(message: any): void {
    this.onMessage?.(message);

    if (message.serverContent?.modelTurn?.parts) {
      const parts = message.serverContent.modelTurn.parts;

      for (const part of parts) {
        if (part.inlineData?.mimeType === 'audio/pcm') {
          const audioData = this.base64ToArrayBuffer(part.inlineData.data);
          this.onAudioReceived?.(audioData);
        }
      }
    }
  }

  private handleError(error: any): void {
    console.error('WebSocket error:', error);
    this.onError?.(error);
  }

  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      console.error('Reconnect failed:', error);
    }
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
```

### 4.4 Service Layer - Audio Processor

```typescript
// src/domains/live-voice-agent/services/audio-processor.ts
export class AudioProcessor {
  private audioContext: AudioContext;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000
    });
  }

  async startCapture(
    onAudioData: (data: ArrayBuffer) => void,
    onMetrics?: (metrics: AudioMetrics) => void
  ): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create analyser for metrics
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      // Create script processor for audio capture
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.scriptProcessor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const pcmData = this.float32ToPCM16(inputData);
        onAudioData(pcmData.buffer);

        // Calculate metrics if callback provided
        if (onMetrics && this.analyser) {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(dataArray);

          const metrics = this.calculateAudioMetrics(dataArray);
          onMetrics(metrics);
        }
      };

      source.connect(this.analyser);
      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone permission denied by user');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone device found');
        }
      }
      throw error;
    }
  }

  stopCapture(): void {
    this.scriptProcessor?.disconnect();
    this.analyser?.disconnect();
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.mediaStream = null;
  }

  async playAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  private float32ToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
  }

  private calculateAudioMetrics(frequencyData: Uint8Array): AudioMetrics {
    const sum = frequencyData.reduce((acc, val) => acc + val, 0);
    const average = sum / frequencyData.length;
    const volumeLevel = average / 255;

    // Determine frequency band
    let frequencyBand: 'low' | 'mid' | 'high' | 'full' = 'full';
    const thresholdLow = 50;
    const thresholdHigh = 150;

    if (volumeLevel > 0.3) {
      const lowFreq = frequencyData.slice(0, frequencyData.length / 3).reduce((a, b) => a + b) / (frequencyData.length / 3);
      const midFreq = frequencyData.slice(frequencyData.length / 3, (frequencyData.length * 2) / 3).reduce((a, b) => a + b) / (frequencyData.length / 3);
      const highFreq = frequencyData.slice((frequencyData.length * 2) / 3).reduce((a, b) => a + b) / (frequencyData.length / 3);

      if (lowFreq > midFreq && lowFreq > highFreq) frequencyBand = 'low';
      else if (midFreq > lowFreq && midFreq > highFreq) frequencyBand = 'mid';
      else frequencyBand = 'high';
    }

    return {
      volumeLevel: Math.min(1, volumeLevel),
      isVoiceActive: volumeLevel > 0.1,
      noiseLevel: Math.max(0, volumeLevel - 0.3),
      frequencyBand
    };
  }
}
```

### 4.5 Custom Hooks - Main Orchestration

```typescript
// src/domains/live-voice-agent/hooks/use-gemini-live.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GeminiLiveWebSocketClient } from '../services/websocket-client';
import { AudioProcessor } from '../services/audio-processor';
import { useVoiceSessionStore } from '../stores/voice-session-store';
import { useAudioBufferStore } from '../stores/audio-buffer-store';

export function useGeminiLive(apiKey: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioMetrics, setAudioMetrics] = useState({
    volumeLevel: 0,
    isVoiceActive: false
  });

  const wsClient = useRef<GeminiLiveWebSocketClient | null>(null);
  const audioProcessor = useRef<AudioProcessor | null>(null);

  const { startSession, endSession, setStatus } = useVoiceSessionStore();
  const { addBuffer } = useAudioBufferStore();

  // Connect to Gemini Live
  const connect = useCallback(async () => {
    try {
      setError(null);
      wsClient.current = new GeminiLiveWebSocketClient(apiKey);
      audioProcessor.current = new AudioProcessor();

      // Handle incoming audio from Gemini
      wsClient.current.onAudioReceived = async (audioData) => {
        await audioProcessor.current?.playAudio(audioData);
        addBuffer({
          data: audioData,
          direction: 'incoming',
          mimeType: 'audio/pcm'
        });
      };

      wsClient.current.onConnectionOpen = () => {
        setIsConnected(true);
        setStatus('active');
      };

      wsClient.current.onConnectionClose = () => {
        setIsConnected(false);
        setStatus('ended');
      };

      wsClient.current.onError = (error) => {
        setError(error.message || 'Connection error');
        setStatus('idle');
      };

      await wsClient.current.connect();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMsg);
      setIsConnected(false);
    }
  }, [apiKey, setStatus, addBuffer]);

  // Start capturing audio
  const startVoiceCapture = useCallback(async () => {
    try {
      if (!audioProcessor.current) {
        throw new Error('Audio processor not initialized');
      }

      await audioProcessor.current.startCapture(
        (audioData) => {
          // Send to Gemini Live
          wsClient.current?.sendAudio(audioData);

          // Store for history
          addBuffer({
            data: audioData,
            direction: 'outgoing',
            mimeType: 'audio/pcm'
          });
        },
        (metrics) => {
          setAudioMetrics({
            volumeLevel: metrics.volumeLevel,
            isVoiceActive: metrics.isVoiceActive
          });
        }
      );

      setIsCapturing(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start capture';
      setError(errorMsg);
    }
  }, [addBuffer]);

  // Stop capturing audio
  const stopVoiceCapture = useCallback(() => {
    audioProcessor.current?.stopCapture();
    setIsCapturing(false);
  }, []);

  // Disconnect from Gemini Live
  const disconnect = useCallback(() => {
    stopVoiceCapture();
    wsClient.current?.disconnect();
    setIsConnected(false);
    endSession();
  }, [stopVoiceCapture, endSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    isConnected,
    isCapturing,
    error,
    audioMetrics,

    // Actions
    connect,
    disconnect,
    startVoiceCapture,
    stopVoiceCapture
  };
}
```

### 4.6 Zustand Stores

```typescript
// src/domains/live-voice-agent/stores/voice-session-store.ts
'use client';

import { create } from 'zustand';
import type { VoiceSession } from '../types';

interface VoiceSessionStore {
  sessions: Map<string, VoiceSession>;
  currentSessionId: string | null;

  // Actions
  startSession: (config: Partial<VoiceSession>) => void;
  endSession: () => void;
  setStatus: (status: VoiceSession['status']) => void;
  setConnectionStatus: (status: VoiceSession['connectionStatus']) => void;
  updateMetrics: (metrics: Partial<VoiceSession>) => void;
}

export const useVoiceSessionStore = create<VoiceSessionStore>((set) => ({
  sessions: new Map(),
  currentSessionId: null,

  startSession: (config) => {
    const sessionId = `session-${Date.now()}`;
    const session: VoiceSession = {
      id: sessionId,
      userId: config.userId || '',
      startedAt: new Date(),
      duration: 0,
      status: 'idle',
      connectionStatus: 'disconnected',
      model: config.model || 'gemini-2.0-flash-exp',
      voice: config.voice || 'Puck',
      language: config.language || 'en',
      bytesReceived: 0,
      bytesSent: 0,
      messagesCount: 0,
      averageLatency: 0
    };

    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, session);
      return {
        sessions: newSessions,
        currentSessionId: sessionId
      };
    });
  },

  endSession: () => {
    set((state) => {
      if (state.currentSessionId) {
        const session = state.sessions.get(state.currentSessionId);
        if (session) {
          session.endedAt = new Date();
          session.duration = Date.now() - session.startedAt.getTime();
          session.status = 'ended';
        }
      }
      return { currentSessionId: null };
    });
  },

  setStatus: (status) => {
    set((state) => {
      if (state.currentSessionId) {
        const session = state.sessions.get(state.currentSessionId);
        if (session) {
          session.status = status;
        }
      }
      return state;
    });
  },

  setConnectionStatus: (connectionStatus) => {
    set((state) => {
      if (state.currentSessionId) {
        const session = state.sessions.get(state.currentSessionId);
        if (session) {
          session.connectionStatus = connectionStatus;
        }
      }
      return state;
    });
  },

  updateMetrics: (metrics) => {
    set((state) => {
      if (state.currentSessionId) {
        const session = state.sessions.get(state.currentSessionId);
        if (session) {
          Object.assign(session, metrics);
        }
      }
      return state;
    });
  }
}));

// src/domains/live-voice-agent/stores/audio-buffer-store.ts
'use client';

import { create } from 'zustand';

interface AudioBufferEntry {
  id: string;
  data: ArrayBuffer;
  direction: 'incoming' | 'outgoing';
  mimeType: string;
  timestamp: Date;
}

interface AudioBufferStore {
  buffers: AudioBufferEntry[];

  // Actions
  addBuffer: (buffer: Omit<AudioBufferEntry, 'id' | 'timestamp'>) => void;
  clearBuffers: () => void;
  getBuffers: (direction?: 'incoming' | 'outgoing') => AudioBufferEntry[];
}

export const useAudioBufferStore = create<AudioBufferStore>((set, get) => ({
  buffers: [],

  addBuffer: (buffer) => {
    const entry: AudioBufferEntry = {
      id: `buffer-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      ...buffer
    };

    set((state) => ({
      buffers: [...state.buffers, entry]
    }));
  },

  clearBuffers: () => {
    set({ buffers: [] });
  },

  getBuffers: (direction) => {
    const { buffers } = get();
    return direction ? buffers.filter(b => b.direction === direction) : buffers;
  }
}));
```

### 4.7 Live Voice Session Component

```typescript
// src/domains/live-voice-agent/components/organisms/live-voice-session.tsx
'use client';

import { useGeminiLive } from '../../hooks/use-gemini-live';
import { VoiceIndicator } from '../atoms/voice-indicator';
import { ConnectionStatus } from '../atoms/connection-status';
import { VolumeMeter } from '../atoms/volume-meter';

interface LiveVoiceSessionProps {
  apiKey: string;
  userId: string;
}

export function LiveVoiceSession({ apiKey, userId }: LiveVoiceSessionProps) {
  const {
    isConnected,
    isCapturing,
    error,
    audioMetrics,
    connect,
    disconnect,
    startVoiceCapture,
    stopVoiceCapture
  } = useGeminiLive(apiKey);

  return (
    <div className="live-voice-session">
      <div className="flex items-center justify-between mb-4">
        <h2>Live Voice Session</h2>
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {!isConnected ? (
        <button onClick={connect} className="btn-primary">
          Connect to Gemini Live
        </button>
      ) : (
        <div className="space-y-4">
          <VolumeMeter
            level={audioMetrics.volumeLevel}
            isActive={audioMetrics.isVoiceActive}
          />

          {!isCapturing ? (
            <button onClick={startVoiceCapture} className="btn-primary">
              Start Speaking
            </button>
          ) : (
            <div>
              <button onClick={stopVoiceCapture} className="btn-secondary">
                Stop Speaking
              </button>
              <VoiceIndicator isActive={isCapturing} />
            </div>
          )}

          <button onClick={disconnect} className="btn-outline">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Session Management Domain

**Location**: `src/domains/session-management/`
**Pattern**: Shared session infrastructure
**Integration**: Database + React Query + Server Actions

### 5.1 Domain Structure

```
src/domains/session-management/
├── components/
│   └── organisms/
│       └── session-history.tsx         # Display session history
│
├── hooks/
│   ├── use-session-history.ts          # Fetch sessions
│   ├── use-session-details.ts          # Get session with messages
│   └── use-session-export.ts           # Export session data
│
├── actions.ts                          # CRUD for sessions
├── schema.ts                           # Validation schemas
├── types.ts                            # TypeScript interfaces
└── errors.ts                           # Custom errors
```

### 5.2 Core Entities

```typescript
// src/domains/session-management/types.ts
export interface BaseSession {
  id: string;
  userId: string;

  // Metadata
  title: string;
  description?: string;
  type: 'chat' | 'voice';
  startedAt: Date;
  endedAt?: Date;
  updatedAt: Date;

  // Organization
  isArchived: boolean;
  tags: string[];

  // Statistics
  messageCount: number;
  duration: number; // seconds
}

export interface SessionMessage {
  id: string;
  sessionId: string;

  // Content
  role: 'user' | 'assistant';
  content: string;

  // Metadata
  createdAt: Date;
  tokensUsed?: number;
}

export interface SessionExport {
  session: BaseSession;
  messages: SessionMessage[];
  exportedAt: Date;
  format: 'json' | 'markdown' | 'pdf';
}
```

### 5.3 Server Actions

```typescript
// src/domains/session-management/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Get all sessions for current user
 */
export async function getUserSessions(
  filter?: {
    type?: 'chat' | 'voice';
    isArchived?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const sessions = await db.session.findMany({
    where: {
      userId: session.user.id,
      type: filter?.type,
      isArchived: filter?.isArchived
    },
    orderBy: { updatedAt: 'desc' },
    take: filter?.limit ?? 10,
    skip: filter?.offset ?? 0
  });

  return sessions;
}

/**
 * Get single session with all messages
 */
export async function getSessionDetails(sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const sessionData = await db.session.findUnique({
    where: { id: sessionId }
  });

  if (!sessionData || sessionData.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  const messages = await db.sessionMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' }
  });

  return { ...sessionData, messages };
}

/**
 * Archive session
 */
export async function archiveSession(sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const sessionData = await db.session.findUnique({
    where: { id: sessionId }
  });

  if (!sessionData || sessionData.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  await db.session.update({
    where: { id: sessionId },
    data: { isArchived: true }
  });

  revalidatePath('/history');
  return { success: true };
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const sessionData = await db.session.findUnique({
    where: { id: sessionId }
  });

  if (!sessionData || sessionData.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  // Delete messages first
  await db.sessionMessage.deleteMany({
    where: { sessionId }
  });

  // Delete session
  await db.session.delete({
    where: { id: sessionId }
  });

  revalidatePath('/history');
  return { success: true };
}

/**
 * Export session
 */
export async function exportSession(
  sessionId: string,
  format: 'json' | 'markdown' | 'pdf' = 'json'
) {
  const sessionData = await getSessionDetails(sessionId);

  const exportData: SessionExport = {
    session: sessionData,
    messages: sessionData.messages,
    exportedAt: new Date(),
    format
  };

  return exportData;
}
```

### 5.4 Custom Hooks

```typescript
// src/domains/session-management/hooks/use-session-history.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserSessions } from '../actions';

export function useSessionHistory(filter?: Parameters<typeof getUserSessions>[0]) {
  return useQuery({
    queryKey: ['sessions', filter],
    queryFn: () => getUserSessions(filter),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// src/domains/session-management/hooks/use-session-details.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getSessionDetails } from '../actions';

export function useSessionDetails(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSessionDetails(sessionId),
    staleTime: 1 * 60 * 1000 // 1 minute
  });
}
```

---

## 6. Data Flow Diagrams

### 6.1 White Library (Chat Agent) Flow

```
User Interface (White Library Component)
          │
          │ (Text or Audio Input)
          ▼
    ┌──────────────┐
    │ White Library│ (Manages: messages, sessionId, UI state)
    │ useChatStore │
    └──────────────┘
          │
          │ HTTP POST with message/audio
          ▼
    ┌──────────────────┐
    │  Next.js API     │
    │  /api/chat-webhook
    └──────────────────┘
          │
          │ Server Action: processChatMessage()
          ▼
    ┌──────────────────────────┐
    │ 1. Session validation    │
    │ 2. Input validation      │
    │ 3. Permission check      │
    │ 4. Gemini API call       │
    │ 5. Save to database      │
    │ 6. Return response       │
    └──────────────────────────┘
          │
          │ JSON Response { Part1: "", Part2: "" }
          ▼
    ┌──────────────────┐
    │ White Library    │ (Renders multiple messages)
    │ Chat Display     │
    └──────────────────┘
          │
          ▼
    User sees response
```

**Key Points**:
- White Library manages its own state and UI
- Server Action only handles business logic
- Multiple response fields render as multiple messages
- Audio handled as Blob in multipart/form-data

---

### 6.2 Gemini Live (Voice Agent) Flow

```
User clicks "Start Speaking"
          │
          ▼
  ┌─────────────────────────────┐
  │ useGeminiLive() hook        │
  │ (orchestration)             │
  └─────────────────────────────┘
          │
          ├─────────────────────────────┐
          │                             │
          ▼                             ▼
    ┌──────────────┐           ┌────────────────┐
    │ Audio        │           │ WebSocket      │
    │ Processor    │           │ Client         │
    │ (Service)    │           │ (Service)      │
    └──────────────┘           └────────────────┘
          │                             │
          │ getUserMedia()              │ connect()
          │ startCapture()              │ sendSetupMessage()
          │                             │
          ▼                             ▼
    ┌──────────────────┐       ┌───────────────────┐
    │ MediaStream      │       │ Gemini Live API   │
    │ (microphone)     │       │ (WebSocket)       │
    └──────────────────┘       └───────────────────┘
          │                             │
          │ PCM Audio Chunks            │ Incoming Audio
          ├──────────────────────────►  │
          │                             │
          │ ◄──────────────────────────┤
          │  Base64 Audio Data          │
          │                             │
          ▼                             ▼
    ┌──────────────┐           ┌────────────────┐
    │ Play Audio   │           │ Store in       │
    │ (Web Audio   │           │ Audio Buffer   │
    │ API)         │           │ Store (Zustand)│
    └──────────────┘           └────────────────┘
          │                             │
          ▼                             ▼
    Speaker Output            Metrics & Session State
```

**Key Points**:
- Real-time bidirectional streaming
- Service classes handle complex browser APIs
- Custom hooks orchestrate services
- Zustand stores manage UI state
- No database needed for real-time flow

---

## 7. Business Rules & Validation

### Chat Agent Rules

1. **Session Ownership**: Only session owner can send messages
2. **Rate Limiting**: Max 60 messages per minute per session
3. **Timeout**: Sessions auto-end after 30 minutes of inactivity
4. **Message Limits**: Max 5000 characters per message
5. **Audio Duration**: Max 60 seconds per audio message
6. **Archive Immutability**: Archived sessions cannot be modified

### Live Voice Agent Rules

1. **Connection Limit**: Max 1 concurrent voice session per user
2. **Session Duration**: Max 1 hour continuous session
3. **Auto-reconnect**: Attempt 3 reconnections with exponential backoff
4. **Audio Format**: PCM 16kHz mono only
5. **Voice Inactivity**: End session if no speech detected for 5 minutes
6. **Microphone Access**: Require user permission before capture

### Session Management Rules

1. **Data Retention**: Keep sessions for 90 days, then archive
2. **Export Limit**: Max 50 concurrent exports per user
3. **Archive Duration**: Keep archives for 1 year
4. **Concurrent Sessions**: Max 10 concurrent sessions per user
5. **Storage Quota**: 1GB per user

---

## 8. Error Handling Strategy

### Chat Agent Errors

```typescript
// src/domains/chat-agent/errors.ts
export class ChatSessionNotFoundError extends Error {
  name = 'ChatSessionNotFoundError';
}

export class ChatSessionExpiredError extends Error {
  name = 'ChatSessionExpiredError';
}

export class MessageTooLongError extends Error {
  name = 'MessageTooLongError';
  constructor() {
    super('Message exceeds 5000 character limit');
  }
}

export class RateLimitExceededError extends Error {
  name = 'RateLimitExceededError';
}
```

### Live Voice Agent Errors

```typescript
// src/domains/live-voice-agent/errors.ts
export class MicrophoneAccessDeniedError extends Error {
  name = 'MicrophoneAccessDeniedError';
  constructor() {
    super('User denied microphone access');
  }
}

export class WebSocketConnectionError extends Error {
  name = 'WebSocketConnectionError';
}

export class AudioProcessingError extends Error {
  name = 'AudioProcessingError';
}

export class SessionAlreadyActiveError extends Error {
  name = 'SessionAlreadyActiveError';
  constructor() {
    super('User already has an active voice session');
  }
}
```

---

## 9. Implementation Timeline

### Phase 1: Foundation (Week 1)

- [ ] Create domain directories and file structure
- [ ] Define all TypeScript types and interfaces
- [ ] Create Zod validation schemas
- [ ] Implement error classes

### Phase 2: Chat Agent (Week 2)

- [ ] Implement Gemini service layer
- [ ] Create Server Actions for webhook handlers
- [ ] Build White Library wrapper component
- [ ] Implement custom hooks (useChatConfig, useChatSession)
- [ ] Create Zustand store for UI state
- [ ] Build chat history components

### Phase 3: Live Voice Agent (Week 3-4)

- [ ] Implement WebSocket service layer
- [ ] Implement Audio processor service
- [ ] Create useGeminiLive orchestration hook
- [ ] Implement Zustand stores (voice-session, audio-buffer)
- [ ] Build live voice UI components
- [ ] Add voice activity detection
- [ ] Add audio metrics visualization

### Phase 4: Session Management (Week 5)

- [ ] Create database schema for sessions
- [ ] Implement Server Actions (CRUD)
- [ ] Build React Query hooks
- [ ] Create session history components
- [ ] Implement export functionality
- [ ] Add filtering and search

### Phase 5: Integration & Testing (Week 6)

- [ ] API route setup (/api/chat-webhook)
- [ ] End-to-end testing
- [ ] Error handling verification
- [ ] Performance optimization
- [ ] Documentation

---

## 10. Key Dependencies

### External Libraries

- **White Library**: Chat UI component library
- **Gemini API**: AI model and Live WebSocket API
- **React Query**: Server state management
- **Zustand**: Client state management
- **Zod**: Validation schemas
- **Next.js 15**: Framework and Server Actions
- **Web Audio API**: Audio capture and playback
- **WebSocket API**: Real-time communication

### Internal Dependencies

```
app/
├── Depends on: chat-agent, live-voice-agent, session-management, components, lib

chat-agent/
├── Depends on: session-management, components, lib, utils

live-voice-agent/
├── Depends on: session-management, components, lib, utils

session-management/
├── Depends on: lib, utils

components/
├── Depends on: lib, utils (NEVER domains)

lib/
├── Depends on: utils

utils/
├── Depends on: NOTHING
```

---

## 11. Testing Strategy

### Unit Tests

- Validation schemas with Zod
- Business rule enforcement
- Error handling
- Service layer methods

### Integration Tests

- Server Actions with auth context
- Database operations
- API webhook endpoints
- WebSocket connections

### E2E Tests

- Chat flow: send message → receive response
- Voice flow: connect → record → receive audio
- Session management: create → archive → delete
- Export functionality

---

## 12. Deployment Considerations

### Environment Variables

```
# Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-2.0-flash-exp

# Database
DATABASE_URL=xxx

# Auth
AUTH_SECRET=xxx

# Feature Flags
ENABLE_CHAT_AGENT=true
ENABLE_VOICE_AGENT=true
MAX_SESSIONS_PER_USER=10
```

### Performance Optimization

- **Chunking**: Stream audio in 4KB chunks
- **Caching**: React Query cache for session history
- **Lazy Loading**: Load session details on demand
- **Debouncing**: Debounce audio metrics updates
- **Code Splitting**: Lazy load live-voice-agent on demand

### Security Considerations

- ✅ Validate all user input with Zod
- ✅ Check session ownership in Server Actions
- ✅ Use HTTPS for WebSocket (wss://)
- ✅ Implement rate limiting
- ✅ Encrypt sensitive data at rest
- ✅ Never expose API keys to client
- ✅ Validate API key server-side only

---

## 13. Files to Create

### Immediate (Foundation)

- `src/domains/chat-agent/types.ts`
- `src/domains/chat-agent/schema.ts`
- `src/domains/chat-agent/errors.ts`
- `src/domains/live-voice-agent/types.ts`
- `src/domains/live-voice-agent/schema.ts`
- `src/domains/live-voice-agent/errors.ts`
- `src/domains/session-management/types.ts`
- `src/domains/session-management/schema.ts`

### Core Implementation

- `src/domains/chat-agent/actions.ts`
- `src/domains/chat-agent/hooks/use-chat-config.ts`
- `src/domains/chat-agent/hooks/use-chat-session.ts`
- `src/domains/chat-agent/stores/chat-ui-store.ts`
- `src/domains/chat-agent/services/gemini-service.ts`
- `src/domains/chat-agent/components/organisms/white-chat-container.tsx`

- `src/domains/live-voice-agent/actions.ts`
- `src/domains/live-voice-agent/services/websocket-client.ts`
- `src/domains/live-voice-agent/services/audio-processor.ts`
- `src/domains/live-voice-agent/hooks/use-gemini-live.ts`
- `src/domains/live-voice-agent/hooks/use-audio-stream.ts`
- `src/domains/live-voice-agent/stores/voice-session-store.ts`
- `src/domains/live-voice-agent/stores/audio-buffer-store.ts`
- `src/domains/live-voice-agent/components/organisms/live-voice-session.tsx`

- `src/domains/session-management/actions.ts`
- `src/domains/session-management/hooks/use-session-history.ts`
- `src/domains/session-management/hooks/use-session-details.ts`
- `src/domains/session-management/components/organisms/session-history.tsx`

### Integration

- `src/app/api/chat-webhook/route.ts`
- `src/app/chat/page.tsx`
- `src/app/voice/page.tsx`
- `src/app/history/page.tsx`

---

## 14. Success Criteria

✓ **Chat Agent**:
- User can send text message and receive AI response
- User can record audio and receive transcription + response
- Session history is persisted
- White Library UI renders correctly

✓ **Live Voice Agent**:
- User can connect to Gemini Live
- Real-time audio streaming works
- Voice output plays automatically
- Connection handles reconnection gracefully

✓ **Session Management**:
- Sessions are created/archived/deleted
- Session history is queryable
- Export functionality works
- Filtering and search work

✓ **Overall**:
- All Server Actions validate session
- All inputs validated with Zod
- No hardcoded text (use config/messages.ts)
- Error handling is comprehensive
- Performance is acceptable (<500ms response time)

---

## 15. Related Documentation

- `.claude/knowledge/critical-constraints.md` - Non-negotiable rules
- `.claude/knowledge/architecture-patterns.md` - Complete architecture guide
- `.claude/knowledge/business-rules.md` - Domain business rules
- `.claude/knowledge/file-structure.md` - Naming conventions
- `.claude/knowledge/tech-stack.md` - Technology stack details

---

**Status**: ✅ Ready for Implementation

This plan provides a complete blueprint for the Voice Agent platform. Parent agent should follow the Phase 1-5 timeline and leverage the code examples provided for each domain.
