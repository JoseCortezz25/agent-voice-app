/**
 * Types for Gemini Live API integration
 * Real-time voice streaming with WebSocket
 */

// ============================================================================
// Core Domain Types
// ============================================================================

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede';

export interface ConversationConfig {
  voiceName: VoiceName;
  temperature: number; // 0.0 - 2.0
  model: string; // 'gemini-2.0-flash-exp'
  language: string; // ISO 639-1: 'en'
  audioFormat: 'linear16' | 'opus'; // Fixed to linear16 for now
  sampleRate: 16000 | 24000;
}

export interface MessageMetadata {
  duration?: number; // Audio duration in seconds
  audioMimeType?: string; // e.g., 'audio/pcm'
  confidence?: number; // Speech recognition confidence (0-1)
  isInterrupted?: boolean; // Whether this was cut off
  latency?: number; // Response latency in ms
}

export interface Message {
  id: string; // UUID
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  type: 'audio' | 'text'; // Content type
  content: string | ArrayBuffer; // Text or base64-encoded audio (for audio type)
  transcript?: string; // Human-readable transcription (for audio)
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface Conversation {
  id: string; // UUID
  title: string;
  systemPrompt: string; // Custom instructions for the AI
  config: ConversationConfig;
  messages: Message[];

  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  messageCount: number;
  totalDuration: number; // seconds

  isArchived: boolean;
}

export interface ConversationListItem {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt?: Date;
  voiceName?: string;
  isArchived: boolean;
}

// ============================================================================
// Input/Update Types for Repository
// ============================================================================

export type CreateConversationInput = Omit<
  Conversation,
  | 'id'
  | 'messages'
  | 'createdAt'
  | 'updatedAt'
  | 'messageCount'
  | 'totalDuration'
  | 'isArchived'
> & {
  isArchived?: boolean; // Allow optional initial archiving
};
export type UpdateConversationInput = Partial<
  Omit<Conversation, 'id' | 'messages' | 'createdAt' | 'updatedAt'>
>;
export type CreateMessageInput = Omit<Message, 'id' | 'timestamp'>;

export interface TranscriptUpdate {
  role: 'user' | 'assistant';
  text: string;
  isInterim: boolean; // Is this a partial/interim result?
  confidence?: number;
}

// ============================================================================
// Connection Status & Session (Existing, adapted for new types)
// ============================================================================

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type VoiceSessionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'active'
  | 'paused'
  | 'ended'
  | 'error';

export interface VoiceSession {
  id: string;
  userId?: string;
  status: VoiceSessionStatus;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in seconds
  model: string;
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  audioFormat: 'linear16' | 'opus';
  sampleRate: 16000 | 24000;
  language: string; // ISO 639-1 code (e.g., 'en', 'es')
  voiceName: string; // Gemini voice (e.g., 'Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede')
  connectionType: 'websocket';
  totalTurns?: number;
  errorCount?: number;
}

// ============================================================================
// WebSocket Types
// ============================================================================

export type WebSocketStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'ready'
  | 'error';

export interface ConnectionState {
  status: WebSocketStatus;
  error?: Error;
  lastPing?: Date;
  lastPong?: Date;
  reconnectAttempts: number;
}

export interface WebSocketConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

// ============================================================================
// Gemini Live API Message Types (Keep existing as they define wire format)
// ============================================================================

export interface GeminiSetupMessage {
  setup: {
    model: string;
    generation_config?: {
      response_modalities?: ('AUDIO' | 'TEXT')[];
      speech_config?: {
        voice_config?: {
          prebuilt_voice_config?: {
            voice_name: string;
          };
        };
      };
    };
  };
}

export interface GeminiAudioInput {
  realtime_input: {
    media_chunks: Array<{
      mime_type: 'audio/pcm';
      data: string; // base64 encoded
    }>;
  };
}

export interface GeminiTextInput {
  client_content: {
    turns: Array<{
      role: 'user';
      parts: Array<{
        text: string;
      }>;
    }>;
    turn_complete: boolean;
  };
}

export interface GeminiServerContent {
  serverContent?: {
    modelTurn?: {
      parts: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string; // base64
        };
      }>;
    };
    turnComplete?: boolean;
  };
  setupComplete?: object;
}

export type GeminiMessage =
  | GeminiSetupMessage
  | GeminiAudioInput
  | GeminiTextInput
  | GeminiServerContent;

// ============================================================================
// Audio Types (Keep existing)
// ============================================================================

export interface AudioChunk {
  data: ArrayBuffer;
  timestamp: number;
  sequenceNumber: number;
}

export interface AudioConfig {
  sampleRate: 16000 | 24000;
  channels: 1; // mono
  encoding: 'linear16' | 'opus';
  chunkSize: number; // in milliseconds
}

export interface VADConfig {
  enabled: boolean;
  speechStartThreshold: number; // dB
  speechEndThreshold: number; // dB
  silenceDuration: number; // ms
}

// ============================================================================
// Error Types (Keep existing)
// ============================================================================

export type VoiceAgentErrorCode =
  | 'WEBSOCKET_CONNECTION_FAILED'
  | 'WEBSOCKET_DISCONNECTED'
  | 'WEBSOCKET_ERROR'
  | 'AUDIO_PERMISSION_DENIED'
  | 'AUDIO_DEVICE_NOT_FOUND'
  | 'AUDIO_PROCESSING_ERROR'
  | 'AUDIO_CAPTURE_FAILED'
  | 'AUDIO_PLAYBACK_FAILED'
  | 'INVALID_API_KEY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SESSION_EXPIRED'
  | 'SESSION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface VoiceAgentError {
  code: VoiceAgentErrorCode;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// ============================================================================
// Service Interfaces (Keep existing, will be modified later)
// ============================================================================

export interface IAudioProcessor {
  startCapture(onAudioData: (data: ArrayBuffer) => void): Promise<void>;
  stopCapture(): void;
  playAudio(audioData: ArrayBuffer): Promise<void>;
  pause(): void;
  resume(): void;
  getVolume(): number;
  setVolume(volume: number): void;
}

export interface IWebSocketClient {
  connect(): Promise<void>;
  disconnect(): void;
  sendAudio(audioData: ArrayBuffer): void;
  sendText(message: string): void;
  onAudioReceived?: (audioData: ArrayBuffer) => void;
  onTextReceived?: (text: string) => void;
  onError?: (error: VoiceAgentError) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
}

export interface IVADDetector {
  start(audioStream: MediaStream): void;
  stop(): void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  configure(config: VADConfig): void;
}
