# Business Rules

**Domain business logic, validations, and rules for the Voice Agent platform.**

---

## 1. Domain Overview

This application is a **Real-time Voice Agent Platform** that enables conversational AI interactions through voice and text. The platform supports two integration approaches:

1. **White Library Integration**: Using `white-library` npm package for chat UI with audio recording/playback via MediaRecorder API, connected to a webhook backend
2. **Native Gemini Live API Integration**: Direct WebSocket connection to Google's Gemini 2.0 Live API for low-level, real-time bidirectional audio streaming

### Integration Strategy Comparison

| Feature | White Library | Gemini Live (Native) |
|---------|--------------|----------------------|
| **Audio Capture** | MediaRecorder API → Blob → multipart/form-data | MediaStream → WebSocket streaming |
| **Audio Format** | OGG (default) | Linear16 PCM / Opus |
| **Communication** | HTTP POST to webhook | WebSocket bidirectional |
| **UI Components** | Pre-built chat UI | Custom UI required |
| **Use Case** | Chat-based voice messages | Real-time voice conversations |
| **Latency** | Higher (request/response) | Lower (streaming) |
| **Complexity** | Low (turnkey solution) | High (custom implementation) |

---

## 2. Core Domains

### 2.1 Chat Agent Domain (`domains/chat-agent/`)

**Responsibility**: Chat-based voice messaging using White Library, message handling, and webhook communication.

**Business Rules**:

#### White Library Integration Rules

- **BR-CA-001**: `agentUrl` webhook endpoint MUST be configured in ChatConfig
- **BR-CA-002**: Session management MUST use White Library's built-in `sessionId` (2h expiration by default)
- **BR-CA-003**: Audio recording MUST use MediaRecorder API (handled by White Library)
- **BR-CA-004**: Audio format is OGG by default (MediaRecorder output)
- **BR-CA-005**: Chat UI MUST use White Library's `ChatPage` component or compose custom UI with `ChatInput`, `ChatHeader`, `ChatMessage`

#### Message Handling Rules

- **BR-CA-006**: Text messages MUST be sent as POST JSON: `{ message: string, sessionId: string, type: 'text' }`
- **BR-CA-007**: Audio messages MUST be sent as multipart/form-data: `{ audio: Blob, sessionId: string, type: 'audio' }`
- **BR-CA-008**: Backend responses with multiple fields MUST be rendered as separate assistant messages
- **BR-CA-009**: Backend responses with `Informe` field MUST trigger special notification flow
- **BR-CA-010**: Maximum message length MUST be enforced via `config.behavior.maxMessageLength`

#### Audio Recording Rules (White Library)

- **BR-CA-011**: Recording time limit MUST be configurable via `config.behavior.recordingTimeLimit`
- **BR-CA-012**: Audio recording state MUST show visual feedback (`config.texts.recordingText`, `listeningText`)
- **BR-CA-013**: Users MUST be able to cancel recording before sending
- **BR-CA-014**: Audio playback controls MUST use White Library's built-in player (play/pause buttons)

### 2.2 Live Voice Agent Domain (`domains/live-voice-agent/`)

**Responsibility**: Real-time bidirectional voice streaming using Gemini Live API, low-latency conversations.

**Business Rules**:

#### Audio Streaming Rules (Gemini Live)

- **BR-LVA-001**: Audio streams MUST use WebSocket connections for bi-directional real-time communication
- **BR-LVA-002**: Audio format MUST be compatible with Gemini Live API requirements:
  - Format: Linear16 PCM or Opus
  - Sample rate: 16kHz or 24kHz
  - Channels: Mono (1 channel)
- **BR-LVA-003**: Audio chunks MUST be sent in appropriately sized packets (recommended: 100-200ms chunks)
- **BR-LVA-004**: Voice activity detection (VAD) MUST be implemented to detect speech start/end
- **BR-LVA-005**: Audio playback MUST start immediately upon receiving first audio chunk (streaming playback)

#### Conversation Management Rules

- **BR-VA-006**: Each conversation session MUST have a unique session ID
- **BR-VA-007**: Conversation context MUST persist for the duration of the session
- **BR-VA-008**: Maximum conversation duration is 60 minutes (configurable)
- **BR-VA-009**: Inactive sessions (no audio for 5 minutes) MUST be automatically terminated
- **BR-VA-010**: All conversations MUST be logged for analytics and debugging

#### Error Handling Rules

- **BR-VA-011**: Connection failures MUST trigger automatic reconnection (max 3 attempts)
- **BR-VA-012**: Audio processing errors MUST NOT crash the entire session
- **BR-VA-013**: Network latency > 500ms MUST trigger a user notification
- **BR-VA-014**: API quota exceeded errors MUST gracefully inform the user

**Entities**:

```typescript
// domains/voice-agent/types.ts

export interface VoiceSession {
  id: string;
  userId: string;
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error';
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in seconds
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  audioFormat: 'linear16' | 'opus';
  sampleRate: 16000 | 24000;
  language: string; // ISO 639-1 code
  model: string; // e.g., "gemini-2.0-flash-live"
  connectionType: 'native' | 'library';
}

export interface AudioChunk {
  data: ArrayBuffer | Blob;
  timestamp: number;
  sequenceNumber: number;
}

export interface ConversationTurn {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  type: 'audio' | 'text' | 'multimodal';
  content: string | ArrayBuffer;
  timestamp: Date;
  metadata?: TurnMetadata;
}

export interface TurnMetadata {
  duration?: number; // for audio turns
  interrupted?: boolean;
  confidence?: number; // speech recognition confidence
}
```

---

### 2.2 Real-time Connection Domain (`domains/realtime-connection/`)

**Responsibility**: Manage WebSocket connections, handle protocol-specific logic for Gemini Live API.

**Business Rules**:

#### Connection Lifecycle Rules

- **BR-RC-001**: WebSocket connection MUST be established before any audio can be streamed
- **BR-RC-002**: Connection state MUST be tracked: `disconnected` → `connecting` → `connected` → `ready` → `disconnected`
- **BR-RC-003**: Authentication token MUST be included in connection headers (API key)
- **BR-RC-004**: Connection MUST support graceful shutdown with proper cleanup
- **BR-RC-005**: Ping/pong heartbeat MUST be sent every 30 seconds to keep connection alive

#### Protocol Rules (Gemini Live API)

- **BR-RC-006**: Initial setup message MUST include model configuration
- **BR-RC-007**: Message format MUST follow Gemini Live API protocol:
  ```json
  {
    "setup": {
      "model": "models/gemini-2.0-flash-exp",
      "generation_config": {
        "response_modalities": ["AUDIO"],
        "speech_config": {
          "voice_config": { "prebuilt_voice_config": { "voice_name": "Puck" } }
        }
      }
    }
  }
  ```
- **BR-RC-008**: Audio data MUST be base64-encoded when sent over WebSocket
- **BR-RC-009**: Server messages MUST be parsed and routed to appropriate handlers
- **BR-RC-010**: Interruption messages MUST immediately halt current audio playback

**Entities**:

```typescript
// domains/realtime-connection/types.ts

export interface ConnectionConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface WebSocketMessage {
  type: 'setup' | 'audio' | 'text' | 'interrupt' | 'error' | 'metadata';
  data: unknown;
  timestamp: number;
}

export interface ConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'ready' | 'error';
  error?: Error;
  lastPing?: Date;
  lastPong?: Date;
  reconnectAttempts: number;
}
```

---

### 2.3 Audio Processing Domain (`domains/audio-processing/`)

**Responsibility**: Handle audio capture, encoding, decoding, and playback.

**Business Rules**:

#### Audio Capture Rules

- **BR-AP-001**: Microphone permission MUST be requested before starting session
- **BR-AP-002**: Audio capture MUST use Web Audio API or MediaRecorder API
- **BR-AP-003**: Audio MUST be captured at the required sample rate (16kHz or 24kHz)
- **BR-AP-004**: Captured audio MUST be converted to the required format (Linear16 PCM or Opus)
- **BR-AP-005**: Audio capture MUST support pause/resume functionality

#### Audio Playback Rules

- **BR-AP-006**: Audio playback MUST use Web Audio API for low-latency streaming
- **BR-AP-007**: Playback buffer MUST maintain 100-300ms of audio to prevent stuttering
- **BR-AP-008**: User MUST be able to interrupt AI speech at any time
- **BR-AP-009**: Volume control MUST be available (0-100%)
- **BR-AP-010**: Playback MUST handle base64-decoded audio from server

#### Voice Activity Detection Rules

- **BR-AP-011**: VAD MUST detect speech start within 100ms
- **BR-AP-012**: VAD MUST detect speech end with 500ms silence threshold
- **BR-AP-013**: Background noise MUST NOT trigger false VAD positives
- **BR-AP-014**: VAD configuration MUST be adjustable per session

**Entities**:

```typescript
// domains/audio-processing/types.ts

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

export interface AudioProcessor {
  capture(): AsyncIterableIterator<AudioChunk>;
  play(chunk: AudioChunk): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
}
```

---

### 2.4 Session Management Domain (`domains/session-management/`)

**Responsibility**: Manage user sessions, conversation history, and analytics.

**Business Rules**:

#### Session Lifecycle Rules

- **BR-SM-001**: Users MUST be authenticated before starting a voice session
- **BR-SM-002**: Each user can have a maximum of 1 active session at a time
- **BR-SM-003**: Session history MUST be stored for at least 30 days
- **BR-SM-004**: Users MUST be able to view their conversation history
- **BR-SM-005**: Sessions MUST be associated with a specific user account

#### Analytics Rules

- **BR-SM-006**: Total session duration MUST be tracked
- **BR-SM-007**: Average response latency MUST be calculated
- **BR-SM-008**: Number of conversation turns MUST be logged
- **BR-SM-009**: Audio quality metrics MUST be recorded (if available)
- **BR-SM-010**: Error rates MUST be tracked per session

**Entities**:

```typescript
// domains/session-management/types.ts

export interface SessionRecord {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  turnCount: number;
  status: 'active' | 'completed' | 'error';
  analytics: SessionAnalytics;
}

export interface SessionAnalytics {
  avgLatency: number; // ms
  totalAudioDuration: number; // seconds
  errorCount: number;
  interruptionCount: number;
  qualityScore?: number; // 0-100
}
```

---

### 2.5 Integration Type Domain (`domains/integration-type/`)

**Responsibility**: Support for both native Gemini Live API and library-abstracted integrations.

**Business Rules**:

#### Native Integration Rules

- **BR-IT-001**: Native integration MUST use WebSocket directly to Gemini Live API endpoint
- **BR-IT-002**: Native integration MUST handle all protocol details manually
- **BR-IT-003**: API key MUST be stored securely (environment variables, never in client code)
- **BR-IT-004**: Native integration provides maximum flexibility and control

#### Library Integration Rules

- **BR-IT-005**: Library integration MUST support at least one abstraction library (LiveKit, Pipecat, or similar)
- **BR-IT-006**: Library configuration MUST be provider-agnostic
- **BR-IT-007**: Library integration MUST expose same interface as native integration
- **BR-IT-008**: Users MUST be able to switch between integration types without code changes

**Entities**:

```typescript
// domains/integration-type/types.ts

export type IntegrationType = 'native' | 'livekit' | 'pipecat' | 'custom';

export interface IntegrationConfig {
  type: IntegrationType;
  apiKey: string;
  endpoint?: string; // for custom integrations
  options?: Record<string, unknown>;
}

export interface VoiceAgentAdapter {
  connect(config: IntegrationConfig): Promise<void>;
  disconnect(): Promise<void>;
  sendAudio(chunk: AudioChunk): Promise<void>;
  sendText(message: string): Promise<void>;
  onAudioReceived(callback: (chunk: AudioChunk) => void): void;
  onTextReceived(callback: (text: string) => void): void;
  onError(callback: (error: Error) => void): void;
}
```

---

## 3. Cross-Domain Business Rules

### Performance Rules

- **BR-PERF-001**: End-to-end latency (user speech → AI response start) MUST be < 1000ms (target: 500ms)
- **BR-PERF-002**: Audio playback MUST start within 200ms of receiving first chunk
- **BR-PERF-003**: WebSocket reconnection MUST complete within 3 seconds
- **BR-PERF-004**: UI MUST remain responsive during audio processing (use Web Workers)

### Security Rules

- **BR-SEC-001**: API keys MUST NEVER be exposed to client-side code
- **BR-SEC-002**: All WebSocket connections MUST use WSS (secure WebSocket)
- **BR-SEC-003**: Audio data MUST be transmitted over encrypted connections
- **BR-SEC-004**: Session tokens MUST expire after 24 hours
- **BR-SEC-005**: User conversations MUST be encrypted at rest

### Quality Rules

- **BR-QUAL-001**: Audio quality MUST be maintained at minimum 16kHz sample rate
- **BR-QUAL-002**: Packet loss > 5% MUST trigger quality degradation notification
- **BR-QUAL-003**: Echo cancellation MUST be enabled when available
- **BR-QUAL-004**: Noise suppression SHOULD be applied to user audio

---

## 4. Validation Rules

### Input Validation

```typescript
// domains/voice-agent/schema.ts
import { z } from 'zod';

export const sessionConfigSchema = z.object({
  userId: z.string().uuid(),
  language: z.string().length(2), // ISO 639-1
  model: z.string().startsWith('gemini-'),
  audioFormat: z.enum(['linear16', 'opus']),
  sampleRate: z.enum([16000, 24000]),
  integrationType: z.enum(['native', 'livekit', 'pipecat', 'custom'])
});

export const audioChunkSchema = z.object({
  data: z.instanceof(ArrayBuffer).or(z.instanceof(Blob)),
  timestamp: z.number().positive(),
  sequenceNumber: z.number().int().nonnegative()
});
```

---

## 5. State Transitions

### Voice Session State Machine

```
[idle] → (user starts) → [connecting]
[connecting] → (connection success) → [active]
[connecting] → (connection failure) → [error]
[active] → (user pauses) → [paused]
[paused] → (user resumes) → [active]
[active] → (user ends) → [ended]
[active] → (timeout/error) → [ended]
[error] → (user retries) → [connecting]
```

### WebSocket Connection State Machine

```
[disconnected] → (connect called) → [connecting]
[connecting] → (connection established) → [connected]
[connected] → (setup complete) → [ready]
[ready] → (disconnect called) → [disconnected]
[ready] → (error occurred) → [error]
[error] → (retry) → [connecting]
[*] → (fatal error) → [disconnected]
```

---

## 6. Business Constraints

### Rate Limits

- **Maximum concurrent sessions per user**: 1
- **Maximum session duration**: 60 minutes
- **Minimum time between sessions**: 1 second
- **Maximum audio chunk size**: 64KB
- **Maximum reconnection attempts**: 3

### Quotas (based on Gemini API limits)

- **API calls per day**: Depends on API tier
- **Concurrent WebSocket connections**: Depends on API tier
- **Audio input per session**: Unlimited (within session duration)
- **Audio output per session**: Unlimited (within session duration)

---

## 7. Use Cases

### UC-1: Start Voice Conversation (Native Integration)

**Actors**: User, System, Gemini Live API

**Preconditions**:
- User is authenticated
- User has granted microphone permission
- API key is configured

**Flow**:
1. User clicks "Start Conversation"
2. System creates new session
3. System establishes WebSocket connection to Gemini Live API
4. System sends setup message with model config
5. System starts audio capture
6. User speaks
7. System streams audio chunks to API
8. API responds with audio chunks
9. System plays audio response
10. Conversation continues...

**Postconditions**:
- Active session exists
- Audio streaming is bidirectional
- Session is logged

---

## Summary

This Voice Agent platform focuses on:

1. **Real-time Performance**: Sub-second latency for natural conversations
2. **Flexibility**: Support for both native and library-abstracted integrations
3. **Reliability**: Robust error handling and reconnection logic
4. **Security**: Encrypted connections and secure API key management
5. **Quality**: High-fidelity audio processing and streaming
6. **Scalability**: Efficient resource usage and session management
