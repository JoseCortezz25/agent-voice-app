# Gemini Live Voice Agent - Enhanced Domain Architecture Plan

**Created**: 2025-11-21
**Domain**: live-voice-agent
**Complexity**: High

---

## 1. Business Context

### Problem Statement

The current Gemini Live implementation is stateless and single-session. Users cannot:
- Persist conversations for later review
- Create multiple separate conversations
- Customize system prompts and voice settings per conversation
- Resume conversations with full history
- Configure voice behavior (voice selection, temperature)
- View real-time transcripts during conversations

### Business Goals

- **Primary Goal**: Enable persistent, resumable voice conversations with full history and customization
- **Secondary Goals**:
  - Support multiple concurrent conversation management
  - Provide real-time transcription feedback
  - Allow configuration persistence per conversation
  - Handle graceful interruption and barge-in

### Success Metrics

- Users can create, list, and resume conversations
- Conversations persist with all metadata, messages, and config
- Real-time transcripts display during active sessions
- Audio playback is gapless and handles interruptions
- Configuration survives session lifecycle

### User Stories

**User Story 1**: As a user, I want to start a new conversation and resume it later without losing context

Acceptance Criteria:
- [ ] Create conversation with title, system prompt, voice config
- [ ] List all saved conversations
- [ ] Resume conversation and see full message history
- [ ] Config (voice, temperature) loads from conversation

**User Story 2**: As a user, I want to customize my AI voice and response behavior

Acceptance Criteria:
- [ ] Select voice from available options (Puck, Charon, Kore, Fenrir, Aoede)
- [ ] Adjust temperature (0.0-2.0)
- [ ] Set custom system prompt
- [ ] Changes persist with conversation

**User Story 3**: As a user, I want to see real-time transcripts of both user and AI speech

Acceptance Criteria:
- [ ] User's speech appears in real-time as it's recognized
- [ ] AI's speech appears as it's spoken
- [ ] Transcripts are accurate and low-latency
- [ ] Transcripts save to conversation history

**User Story 4**: As a user, I want to interrupt the AI and immediately start speaking

Acceptance Criteria:
- [ ] Barge-in works without waiting for AI to finish
- [ ] Previous AI audio playback stops smoothly
- [ ] User can start speaking while AI is talking

---

## 2. Domain Model

### Core Entity: `Conversation`

**Purpose**: Represents a persistent voice conversation session with full history, configuration, and metadata

**TypeScript Interface**:

```typescript
// src/domains/live-voice-agent/types.ts
export interface Conversation {
  id: string; // UUID
  title: string;
  systemPrompt: string; // Custom instructions for the AI
  config: ConversationConfig;
  messages: Message[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  messageCount: number;
  totalDuration: number; // seconds

  // Status tracking
  isArchived: boolean;
}

export interface ConversationConfig {
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede';
  temperature: number; // 0.0 - 2.0
  model: string; // 'gemini-2.0-flash-exp'
  language: string; // ISO 639-1: 'en'
  audioFormat: 'linear16' | 'opus'; // Fixed to linear16 for now
  sampleRate: 16000 | 24000;
}

export interface Message {
  id: string; // UUID
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  type: 'audio' | 'text'; // Content type
  content: string | ArrayBuffer; // Text or base64-encoded audio
  transcript?: string; // Human-readable transcription (for audio)
  timestamp: Date;

  // Message metadata
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  duration?: number; // Audio duration in seconds
  audioMimeType?: string; // e.g., 'audio/pcm'
  confidence?: number; // Speech recognition confidence (0-1)
  isInterrupted?: boolean; // Whether this was cut off
  latency?: number; // Response latency in ms
}
```

### Related Entities

- **VoiceSession**: Active runtime session (in-memory, managed by Zustand)
- **AudioChunk**: Individual audio packets during streaming (transient)
- **ConnectionState**: WebSocket connection metadata (in-memory)

### Value Objects

```typescript
export interface ConversationListItem {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt?: Date;
  voiceName: string;
  isArchived: boolean;
}

export interface TranscriptUpdate {
  role: 'user' | 'assistant';
  text: string;
  isInterim: boolean; // Is this a partial/interim result?
  confidence?: number;
}
```

---

## 3. Business Rules

### Validation Rules

1. **Conversation Title Required**:
   - Condition: When creating a conversation
   - Action: Title must be 1-200 characters
   - Error: "Conversation title is required and must be 1-200 characters"

2. **System Prompt Optional but Bounded**:
   - Condition: Custom system prompts
   - Action: Max 2000 characters
   - Error: "System prompt cannot exceed 2000 characters"

3. **Temperature Range**:
   - Condition: When setting conversation temperature
   - Action: Must be between 0.0 and 2.0
   - Error: "Temperature must be between 0.0 and 2.0"

4. **Voice Name Valid**:
   - Condition: When selecting voice
   - Action: Must be one of: Puck, Charon, Kore, Fenrir, Aoede
   - Error: "Invalid voice selection"

5. **Message Content Not Empty**:
   - Condition: When storing a message
   - Action: Content must not be empty (audio has length > 0, text not blank)
   - Error: "Message content cannot be empty"

6. **Unique Message ID**:
   - Condition: When creating a message
   - Action: ID must be UUID and unique within conversation
   - Error: "Duplicate message ID"

### Invariants

- A conversation can only have messages that belong to it (conversationId match)
- A conversation always has at least valid config
- Message timestamps must be in chronological order within conversation
- Message roles follow pattern: system (optional, at start) → (user/assistant alternating)
- Archived conversations cannot receive new messages
- Total conversation duration is sum of all audio message durations

### Business Constraints

- **Single User Context**: No authentication needed, browser-local storage
- **Client-Side Only**: IndexedDB for persistence, no backend
- **One Active Session**: Only one voice session can be active at a time
- **Audio Encoding**: Conversations use linear16 PCM encoding (16kHz)
- **Message Immutability**: Once stored, messages cannot be edited (append-only)

---

## 4. Zod Validation Schemas

### Conversation Schema

```typescript
// src/domains/live-voice-agent/schema.ts
import { z } from 'zod';

// Enum for voice names
export const voiceNameSchema = z.enum([
  'Puck',
  'Charon',
  'Kore',
  'Fenrir',
  'Aoede'
] as const);

// Config schema
export const conversationConfigSchema = z.object({
  voiceName: voiceNameSchema,
  temperature: z.number().min(0).max(2),
  model: z.string().startsWith('gemini-').default('gemini-2.0-flash-exp'),
  language: z.string().length(2).default('en'),
  audioFormat: z.enum(['linear16', 'opus']).default('linear16'),
  sampleRate: z.enum([16000, 24000] as const).default(16000)
});

// Message metadata schema
export const messageMetadataSchema = z.object({
  duration: z.number().nonnegative().optional(),
  audioMimeType: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  isInterrupted: z.boolean().optional(),
  latency: z.number().nonnegative().optional()
});

// Message schema
export const messageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  type: z.enum(['audio', 'text']),
  content: z.union([
    z.string().min(1),
    z.instanceof(ArrayBuffer).refine(ab => ab.byteLength > 0, {
      message: 'Audio content cannot be empty'
    })
  ]),
  transcript: z.string().optional(),
  timestamp: z.date(),
  metadata: messageMetadataSchema.optional()
});

// Conversation schema
export const conversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  systemPrompt: z.string().max(2000).default(''),
  config: conversationConfigSchema,
  messages: z.array(messageSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastMessageAt: z.date().optional(),
  messageCount: z.number().int().nonnegative(),
  totalDuration: z.number().nonnegative(),
  isArchived: z.boolean().default(false)
});

// For creating a conversation (omit id, timestamps, messages)
export const createConversationSchema = conversationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
  messages: true,
  messageCount: true,
  totalDuration: true
});

// For updating conversation (most fields optional)
export const updateConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  systemPrompt: z.string().max(2000).optional(),
  config: conversationConfigSchema.partial().optional(),
  isArchived: z.boolean().optional()
});

// For creating a message
export const createMessageSchema = messageSchema.omit({
  id: true,
  timestamp: true
});

// Transcript update schema (real-time updates)
export const transcriptUpdateSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  isInterim: z.boolean(),
  confidence: z.number().min(0).max(1).optional()
});

// Type exports
export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationConfig = z.infer<typeof conversationConfigSchema>;
export type Message = z.infer<typeof messageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type TranscriptUpdate = z.infer<typeof transcriptUpdateSchema>;

// Default values
export const DEFAULT_CONVERSATION_CONFIG: ConversationConfig = {
  voiceName: 'Puck',
  temperature: 1.0,
  model: 'gemini-2.0-flash-exp',
  language: 'en',
  audioFormat: 'linear16',
  sampleRate: 16000
};
```

---

## 5. Use Cases / Business Operations

### Use Case 1: Create New Conversation

**Actor**: User
**Pre-conditions**: User has accessed app
**Post-conditions**: New conversation created in IndexedDB, ready to use

**Business Logic Steps**:

1. Validate input using `createConversationSchema`
2. Check title is unique (within user's conversations)
3. Generate UUID for conversation
4. Initialize empty messages array
5. Set timestamps to current time
6. Store in IndexedDB via ConversationRepository
7. Return created conversation

**Implementation Location**: `src/domains/live-voice-agent/repositories/conversation-repository.ts`

### Use Case 2: List Conversations

**Actor**: User
**Pre-conditions**: Conversation repository initialized
**Post-conditions**: List of conversations returned (sorted by lastMessageAt)

**Business Logic Steps**:

1. Query IndexedDB for all conversations
2. Filter out archived (or include if requested)
3. Map to ConversationListItem (lightweight)
4. Sort by lastMessageAt (newest first)
5. Return paginated results

### Use Case 3: Resume Conversation

**Actor**: User selecting existing conversation
**Pre-conditions**: Conversation exists in IndexedDB
**Post-conditions**: Conversation loaded, ready for new session

**Business Logic Steps**:

1. Validate conversation ID
2. Load conversation from IndexedDB (including all messages)
3. Load config from conversation
4. Initialize new VoiceSession with loaded config
5. Return conversation with history

### Use Case 4: Add Message to Conversation

**Actor**: WebSocket handler (AI message) or voice capture handler (user message)
**Pre-conditions**: Conversation is active, message validated
**Post-conditions**: Message stored in IndexedDB and conversation updated

**Business Logic Steps**:

1. Validate message using `createMessageSchema`
2. Generate UUID for message
3. Set timestamp to current time
4. Verify conversation exists and not archived
5. Store message in IndexedDB
6. Update conversation's updatedAt, lastMessageAt, messageCount
7. If audio, add duration to totalDuration
8. Update local state (Zustand store)

### Use Case 5: Update Conversation Config

**Actor**: User changes voice/temperature during session
**Pre-conditions**: Conversation exists, session may or may not be active
**Post-conditions**: Config updated in IndexedDB and VoiceSession

**Business Logic Steps**:

1. Validate input using `updateConversationSchema`
2. Load current conversation from IndexedDB
3. Merge new config with existing
4. Validate merged config
5. If session active: send config update to Gemini API
6. Store updated conversation
7. Update local state

### Use Case 6: Update Transcripts in Real-Time

**Actor**: WebSocket message handler
**Pre-conditions**: Message being streamed from Gemini API
**Post-conditions**: Transcript appears in UI, saved to message when complete

**Business Logic Steps**:

1. Receive transcript update from WebSocket
2. Validate using `transcriptUpdateSchema`
3. If interim: update local state only (no persistence)
4. If final (isInterim=false):
   - Add transcript to corresponding message
   - Store in IndexedDB
   - Update conversation updatedAt
5. Emit transcript update event for UI

### Use Case 7: Handle Audio Downsampling & Encoding

**Actor**: Audio processor during voice capture
**Pre-conditions**: Raw audio from microphone
**Post-conditions**: PCM Int16, 16kHz mono ready for Gemini API

**Business Logic Steps**:

1. Capture audio at native sample rate
2. Downsample to 16kHz using resampler (if needed)
3. Convert Float32 PCM to Int16 PCM
4. Chunk into 100ms segments
5. Base64 encode chunks
6. Send to WebSocket

**Implementation Location**: `src/domains/live-voice-agent/services/audio-processor.ts`

### Use Case 8: Handle Gapless Playback & Interruption

**Actor**: Audio processor / WebSocket handler
**Pre-conditions**: AI audio streaming from API
**Post-conditions**: Smooth playback or interrupted gracefully

**Business Logic Steps**:

1. Receive audio chunks from WebSocket
2. Queue chunks in audio playback buffer
3. Schedule playback with exact timing
4. If user speaks (or barge-in detected):
   - Stop current playback
   - Clear buffer
   - Resume user capture
   - Create "interrupted" message metadata
5. Resume playback when user stops

---

## 6. Repository Pattern for Data Access

### ConversationRepository (IndexedDB)

**Purpose**: Abstracts all conversation/message persistence

**Interface**:

```typescript
// src/domains/live-voice-agent/repositories/conversation-repository.ts
export interface IConversationRepository {
  // Conversation CRUD
  createConversation(input: CreateConversationInput): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | null>;
  listConversations(filter?: { archived?: boolean }): Promise<ConversationListItem[]>;
  updateConversation(id: string, input: UpdateConversationInput): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;

  // Message operations
  addMessage(conversationId: string, input: CreateMessageInput): Promise<Message>;
  getMessage(conversationId: string, messageId: string): Promise<Message | null>;
  getMessages(conversationId: string): Promise<Message[]>;
  updateMessageTranscript(conversationId: string, messageId: string, transcript: string): Promise<void>;

  // Bulk operations
  deleteAllConversations(): Promise<void>;
}

export class ConversationRepository implements IConversationRepository {
  private db: IDBDatabase;

  // All methods use IndexedDB with error handling
}
```

### IndexedDB Schema

```typescript
// Object stores
export const DB_NAME = 'gemini-live-agent';
export const DB_VERSION = 1;

export const OBJECT_STORES = {
  CONVERSATIONS: {
    name: 'conversations',
    keyPath: 'id',
    indexes: [
      { name: 'createdAt', keyPath: 'createdAt' },
      { name: 'lastMessageAt', keyPath: 'lastMessageAt' },
      { name: 'isArchived', keyPath: 'isArchived' }
    ]
  },
  MESSAGES: {
    name: 'messages',
    keyPath: 'id',
    indexes: [
      { name: 'conversationId', keyPath: 'conversationId' },
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  }
};

// Storage structure:
// conversations/
//   {
//     id: uuid,
//     title: string,
//     systemPrompt: string,
//     config: { voiceName, temperature, ... },
//     createdAt: timestamp,
//     updatedAt: timestamp,
//     lastMessageAt: timestamp,
//     messageCount: number,
//     totalDuration: number,
//     isArchived: boolean
//   }

// messages/
//   {
//     id: uuid,
//     conversationId: uuid (FK),
//     role: 'user' | 'assistant' | 'system',
//     type: 'audio' | 'text',
//     content: string | base64-audio,
//     transcript: string?,
//     timestamp: timestamp,
//     metadata: { duration?, confidence?, isInterrupted?, ... }
//   }
```

---

## 7. Service Layer Updates

### Enhanced Audio Processor

**File**: `src/domains/live-voice-agent/services/audio-processor.ts`

**Enhancements**:

```typescript
export interface IAudioProcessor extends IAudioProcessor {
  // Existing methods
  startCapture(onAudioData: (data: ArrayBuffer) => void): Promise<void>;
  stopCapture(): void;
  playAudio(audioData: ArrayBuffer): Promise<void>;
  pause(): void;
  resume(): void;

  // NEW: Downsampling & encoding
  downsample(audioData: AudioBuffer, targetRate: number): AudioBuffer;
  encodeFloat32ToInt16(float32Array: Float32Array): Int16Array;

  // NEW: Gapless playback scheduling
  scheduleAudioPlayback(audioData: ArrayBuffer, playAt?: number): void;
  clearAudioBuffer(): void;

  // NEW: Interruption handling
  getIsPlaying(): boolean;
  interruptPlayback(): void;

  // NEW: Transcription hooks
  onUserTranscript?: (transcript: string, isInterim: boolean) => void;
  onAITranscript?: (transcript: string, isInterim: boolean) => void;
}

// Key implementation details:
// - Use AudioContext for precise scheduling
// - Implement circular buffer for gapless playback
// - Handle sample rate conversion with Web Audio API
// - Detect barge-in via voice activity detection
```

### WebSocket Client Enhancement

**File**: `src/domains/live-voice-agent/services/websocket-client.ts`

**Enhancements**:

```typescript
export interface IWebSocketClient extends IWebSocketClient {
  // Existing callbacks
  onAudioReceived?: (audioData: ArrayBuffer) => void;
  onError?: (error: VoiceAgentError) => void;

  // NEW: Real-time transcript callbacks
  onUserTranscriptUpdate?: (update: TranscriptUpdate) => void;
  onAITranscriptUpdate?: (update: TranscriptUpdate) => void;

  // NEW: Configuration update
  updateSessionConfig(config: Partial<ConversationConfig>): void;

  // NEW: Turn completion signal
  onTurnComplete?: (role: 'user' | 'assistant') => void;
}

// Key implementation details:
// - Parse transcript events from Gemini streaming responses
// - Emit transcript updates with interim/final status
// - Handle server-sent events for config updates
```

---

## 8. Store Updates (Zustand)

### VoiceSessionStore Enhancement

**File**: `src/domains/live-voice-agent/stores/voice-session-store.ts`

```typescript
interface EnhancedVoiceSessionState {
  // Existing
  session: VoiceSession | null;
  isActive: boolean;

  // NEW: Current transcripts
  userTranscript: TranscriptUpdate[];
  aiTranscript: TranscriptUpdate[];

  // NEW: Current turn tracking
  currentUserTurnText: string; // Building up user's current text
  currentAITurnText: string;   // Building up AI's current response

  // NEW: Message references
  pendingMessages: Map<string, Message>; // Not yet persisted

  // Existing actions
  startSession: (...) => void;
  updateStatus: (...) => void;
  endSession: (...) => void;

  // NEW: Transcript actions
  addUserTranscript: (update: TranscriptUpdate) => void;
  addAITranscript: (update: TranscriptUpdate) => void;
  clearTranscripts: () => void;

  // NEW: Turn actions
  addPendingMessage: (message: Message) => void;
  removePendingMessage: (messageId: string) => void;

  // NEW: Active conversation
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
}
```

**Purpose**: Voice-specific session state (UI state only, NOT persisted)

### New Store: Conversation UI Store

**File**: `src/domains/live-voice-agent/stores/conversation-ui-store.ts` (if needed)

```typescript
interface ConversationUIState {
  // Sidebar/list state
  selectedConversationId: string | null;
  showConversationList: boolean;

  // Config panel state
  isConfigPanelOpen: boolean;
  tempConfig: Partial<ConversationConfig> | null; // Unsaved changes

  // Actions
  selectConversation: (id: string) => void;
  toggleConversationList: () => void;
  openConfigPanel: (currentConfig: ConversationConfig) => void;
  closeConfigPanel: (save: boolean) => void;
  updateTempConfig: (config: Partial<ConversationConfig>) => void;
}
```

**Purpose**: UI state for conversation management (NOT backend data)

---

## 9. Custom Hooks (Business Logic)

### Hook 1: `useConversationPersistence`

**File**: `src/domains/live-voice-agent/hooks/use-conversation-persistence.ts`
**Purpose**: Handle conversation CRUD with IndexedDB

```typescript
export function useConversationPersistence() {
  const repository = useConversationRepository();

  return {
    // Read operations (use React Query)
    conversations: useQuery({
      queryKey: ['conversations'],
      queryFn: () => repository.listConversations()
    }),

    getConversation: useQuery({
      queryKey: ['conversation', id],
      queryFn: () => repository.getConversation(id),
      enabled: !!id
    }),

    // Write operations (useMutation)
    createConversation: useMutation({
      mutationFn: (input: CreateConversationInput) =>
        repository.createConversation(input),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    }),

    updateConversation: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateConversationInput }) =>
        repository.updateConversation(id, input),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    }),

    deleteConversation: useMutation({
      mutationFn: (id: string) => repository.deleteConversation(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    })
  };
}
```

### Hook 2: `useConversationMessages`

**File**: `src/domains/live-voice-agent/hooks/use-conversation-messages.ts`
**Purpose**: Manage messages for active conversation

```typescript
export function useConversationMessages(conversationId: string | null) {
  const repository = useConversationRepository();

  // Load messages
  const messages = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => repository.getMessages(conversationId!),
    enabled: !!conversationId
  });

  // Add message (from user or AI)
  const addMessage = useMutation({
    mutationFn: (input: CreateMessageInput) =>
      repository.addMessage(conversationId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  // Update transcript (real-time)
  const updateTranscript = useMutation({
    mutationFn: ({ messageId, transcript }: { messageId: string; transcript: string }) =>
      repository.updateMessageTranscript(conversationId!, messageId, transcript),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    }
  });

  return { messages, addMessage, updateTranscript };
}
```

### Hook 3: `useGeminiLiveEnhanced`

**File**: `src/domains/live-voice-agent/hooks/use-gemini-live-enhanced.ts`
**Purpose**: Orchestrate full voice agent with persistence

```typescript
export function useGeminiLiveEnhanced(conversationId: string | null) {
  const { conversation } = useConversationPersistence();
  const { addMessage, updateTranscript } = useConversationMessages(conversationId);
  const { session, startSession, endSession } = useVoiceSessionStore();

  // Connect with loaded conversation config
  const connect = useCallback(async () => {
    if (!conversationId) return;

    const conv = await conversation.getConversation(conversationId);
    if (!conv) return;

    // Start session with conversation config
    startSession(crypto.randomUUID(), conv.config.model, {
      ...conv.config,
      systemPrompt: conv.systemPrompt
    });

    // Connect WebSocket with config
    // ... WebSocket setup with system prompt and config
  }, [conversationId]);

  // Handle incoming AI audio + transcripts
  const onAITranscript = useCallback((update: TranscriptUpdate) => {
    if (!conversationId) return;

    // Create or update AI message
    // Add transcript to message
    updateTranscript.mutate({ messageId, transcript });
  }, [conversationId]);

  // Handle user speech recognition
  const onUserTranscript = useCallback((update: TranscriptUpdate) => {
    if (!conversationId) return;

    // Store user transcriptions as they come in
    // Save final transcript to message
  }, [conversationId]);

  // Save turn on completion
  const onTurnComplete = useCallback(async (role: 'user' | 'assistant') => {
    // Turn is complete, messages should be finalized and persisted
    // Update conversation metadata
  }, [conversationId]);

  return {
    session,
    connect,
    startVoiceCapture,
    stopVoiceCapture,
    disconnect,
    // Transcript handlers
    onUserTranscript,
    onAITranscript,
    onTurnComplete
  };
}
```

### Hook 4: `useConversationConfig`

**File**: `src/domains/live-voice-agent/hooks/use-conversation-config.ts`
**Purpose**: Manage conversation configuration

```typescript
export function useConversationConfig(conversationId: string | null) {
  const { getConversation, updateConversation } = useConversationPersistence();
  const voiceSessionStore = useVoiceSessionStore();

  // Load current config
  const config = useMemo(() => {
    if (!conversationId) return null;
    return getConversation.data?.config ?? null;
  }, [conversationId, getConversation.data]);

  // Update config (persists and updates session)
  const updateConfig = useCallback(
    (newConfig: Partial<ConversationConfig>) => {
      if (!conversationId) return;

      updateConversation.mutate({
        id: conversationId,
        input: { config: newConfig }
      });

      // If session active, update it too
      if (voiceSessionStore.isActive) {
        // Notify WebSocket of config change
      }
    },
    [conversationId]
  );

  return { config, updateConfig, isLoading: getConversation.isLoading };
}
```

---

## 10. State Management Strategy

### Server State (Backend/IndexedDB Data)

**Tool**: React Query
**Location**: `src/domains/live-voice-agent/hooks/use-conversation-*.ts`
**Usage**: All conversation/message data from IndexedDB

```typescript
// ✅ CORRECT: React Query for IndexedDB-backed data
const { data: conversation } = useConversationPersistence();
const { data: messages } = useConversationMessages(conversationId);
```

### Client/UI State (Local Preferences)

**Tool**: Zustand
**Location**: `src/domains/live-voice-agent/stores/`
**Usage**: Active session state, current transcripts, UI toggles

```typescript
// ✅ CORRECT: Zustand for UI state only
const { session, userTranscript, aiTranscript } = useVoiceSessionStore();
const { selectedConversationId } = useConversationUIStore();
```

### Real-Time Streaming State

**Tool**: useState + callbacks
**Usage**: Currently streaming audio chunks, interim transcripts

```typescript
// ✅ CORRECT: useState for transient state
const [interimUserText, setInterimUserText] = useState('');
const [isStreaming, setIsStreaming] = useState(false);
```

---

## 11. Error Handling Strategy

### New Error Types

```typescript
// src/domains/live-voice-agent/errors.ts
export class ConversationNotFoundError extends Error {
  constructor(id: string) {
    super(`Conversation not found: ${id}`);
    this.name = 'ConversationNotFoundError';
  }
}

export class ConversationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversationValidationError';
  }
}

export class IndexedDBError extends Error {
  constructor(message: string) {
    super(`IndexedDB error: ${message}`);
    this.name = 'IndexedDBError';
  }
}

export class AudioEncodingError extends Error {
  constructor(message: string) {
    super(`Audio encoding failed: ${message}`);
    this.name = 'AudioEncodingError';
  }
}
```

### Error Handling in Repository

```typescript
export class ConversationRepository implements IConversationRepository {
  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    try {
      // Validate
      const validated = createConversationSchema.parse(input);

      // Check unique title
      const existing = await this.listConversations();
      if (existing.some(c => c.title === validated.title)) {
        throw new ConversationValidationError(
          'Conversation with this title already exists'
        );
      }

      // Create
      const conversation: Conversation = {
        id: crypto.randomUUID(),
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        messageCount: 0,
        totalDuration: 0
      };

      // Store
      await this.db
        .transaction(['conversations'], 'readwrite')
        .objectStore('conversations')
        .add(conversation);

      return conversation;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ConversationValidationError(
          `Validation failed: ${error.message}`
        );
      }
      if (error instanceof Error) throw error;
      throw new IndexedDBError('Failed to create conversation');
    }
  }
}
```

---

## 12. Files to Create

### Core Files

1. **`src/domains/live-voice-agent/repositories/conversation-repository.ts`**
   - ConversationRepository implementation
   - IConversationRepository interface
   - IndexedDB initialization

2. **`src/domains/live-voice-agent/repositories/index.ts`**
   - Export repository singleton

3. **`src/domains/live-voice-agent/errors.ts`**
   - Custom error classes

4. **`src/domains/live-voice-agent/hooks/use-conversation-persistence.ts`**
   - useConversationPersistence hook
   - React Query integration

5. **`src/domains/live-voice-agent/hooks/use-conversation-messages.ts`**
   - useConversationMessages hook

6. **`src/domains/live-voice-agent/hooks/use-gemini-live-enhanced.ts`**
   - Enhanced orchestration hook
   - Combines WebSocket + persistence

7. **`src/domains/live-voice-agent/hooks/use-conversation-config.ts`**
   - Configuration management hook

8. **`src/domains/live-voice-agent/stores/conversation-ui-store.ts`**
   - UI state store (if needed)

---

## 13. Files to Modify

### Enhanced Files

1. **`src/domains/live-voice-agent/types.ts`**
   - Add Conversation, Message, ConversationConfig types
   - Add TranscriptUpdate, ConversationListItem types
   - Keep existing types for backward compatibility

2. **`src/domains/live-voice-agent/schema.ts`**
   - Add Conversation and Message schemas
   - Add validation for new types
   - Export zod-inferred types

3. **`src/domains/live-voice-agent/services/audio-processor.ts`**
   - Add downsample() method
   - Add encodeFloat32ToInt16() method
   - Add scheduleAudioPlayback() for gapless playback
   - Add interruptPlayback() for barge-in
   - Add transcript callback methods

4. **`src/domains/live-voice-agent/services/websocket-client.ts`**
   - Add onUserTranscriptUpdate callback
   - Add onAITranscriptUpdate callback
   - Add updateSessionConfig() method
   - Add onTurnComplete callback
   - Parse transcript events from Gemini API

5. **`src/domains/live-voice-agent/stores/voice-session-store.ts`**
   - Add userTranscript, aiTranscript arrays
   - Add activeConversationId
   - Add transcript action methods
   - Add pending message tracking

6. **`src/domains/live-voice-agent/hooks/use-gemini-live.ts`**
   - Refactor to use enhanced WebSocket callbacks
   - Integrate with conversation persistence
   - Add transcript handling

---

## 14. Implementation Steps

### Phase 1: Foundation (Persistence & Repository)

1. Create error types in `errors.ts`
2. Enhance types in `types.ts` (add Conversation, Message, TranscriptUpdate)
3. Create schemas in `schema.ts` (Conversation, Message validation)
4. Create `ConversationRepository` with IndexedDB backend
5. Test repository CRUD operations

### Phase 2: Audio & Streaming

6. Enhance `AudioProcessor` with downsampling & encoding
7. Add gapless playback scheduling
8. Add interruption/barge-in handling
9. Test audio processing pipeline

### Phase 3: Real-Time Transcripts

10. Enhance `WebSocketClient` with transcript callbacks
11. Update `VoiceSessionStore` with transcript arrays
12. Create `use-conversation-messages` hook with transcript updates
13. Test transcript parsing and storage

### Phase 4: Business Logic Hooks

14. Create `useConversationPersistence` with React Query
15. Create `useConversationMessages` hook
16. Create `useConversationConfig` hook
17. Create `useGeminiLiveEnhanced` orchestration hook

### Phase 5: Integration

18. Update existing `useGeminiLive` hook to use enhanced features
19. Create conversation UI store (if needed)
20. Test end-to-end flow: create → add messages → persist → resume
21. Test configuration persistence and application

### Phase 6: Testing

22. Unit tests for ConversationRepository
23. Integration tests for hooks
24. Audio processing tests
25. End-to-end conversation flow tests

---

## 15. Integration Notes

### Coordination with Other Agents

- **UX/UI Designer**: Provide conversation list UI, config panel, transcript display
- **Next.js Builder**: Provide page components using hooks
- **shadcn Builder**: Design conversation UI components

### Data Flow Diagram

```
User Action
    ↓
Hook (useGeminiLiveEnhanced, useConversationMessages)
    ↓
Repository (ConversationRepository)
    ↓
IndexedDB (Persistent Storage)
    ↓
React Query (Cache & Sync)
    ↓
Zustand Store (UI State)
    ↓
Component (Re-render)
```

### WebSocket → Persistence Flow

```
Gemini API (WebSocket)
    ↓ (audio chunk + transcript)
WebSocketClient (parse & emit callbacks)
    ↓
VoiceSessionStore (interim transcripts)
    ↓
useConversationMessages.addMessage()
    ↓
ConversationRepository.addMessage()
    ↓
IndexedDB (persist)
    ↓
React Query (cache updated)
    ↓
UI (transcript appears)
```

---

## 16. Key Design Decisions

### Why IndexedDB?

- Client-side only (no backend needed)
- Async API (non-blocking)
- Supports queries and indexing
- Large storage capacity (50MB+)
- Persistent across sessions

### Why React Query for Conversations?

- Automatic cache management
- Deduplication of requests
- Background refetching
- Error handling
- Optimistic updates support

### Why Zustand for Session State?

- Lightweight (no boilerplate)
- Real-time updates for active session
- Pure TypeScript (no decorators)
- Good for ephemeral state (transcripts, current turn)

### Why Repository Pattern?

- Abstracts data access (could swap IndexedDB for localStorage/backend later)
- Testable (can mock repository in tests)
- Single responsibility (repository only handles persistence)
- Follows architecture constraints

### Why Separate Conversation Config Type?

- Config is immutable per conversation
- Can be loaded once and cached
- Validated separately from messages
- Applied globally to session

---

## 17. Important Notes

**PERSISTENCE**:
- All mutations must persist to IndexedDB via repository
- Use React Query invalidation after persistence
- Cache stays in sync with IndexedDB

**SESSION LIFECYCLE**:
- One conversation can have multiple VoiceSessions
- Each session is ephemeral (starts fresh WebSocket)
- Session ends → message history preserved → can resume later

**AUDIO QUALITY**:
- Always downsample to 16kHz before sending to Gemini
- Use linear16 PCM encoding (not opus) for compatibility
- Implement circular buffer for gapless playback

**REAL-TIME TRANSCRIPTS**:
- Interim transcripts update UI but don't persist immediately
- Final transcripts saved to message when turn completes
- Both user and AI transcripts captured

**BARGE-IN/INTERRUPTION**:
- Stop audio playback immediately
- Clear audio buffer
- Resume user capture
- Mark interrupted message with metadata

**RECOVERY**:
- If WebSocket fails mid-session: messages persist
- Resume conversation: reload full history
- Config survives disconnect
- User-generated messages stay even if AI response fails

---

## 18. Testing Considerations

### Repository Tests

```typescript
describe('ConversationRepository', () => {
  it('should create conversation with valid input');
  it('should validate conversation title uniqueness');
  it('should list conversations sorted by lastMessageAt');
  it('should persist messages and update conversation stats');
  it('should handle IndexedDB errors gracefully');
});
```

### Hook Tests

```typescript
describe('useConversationPersistence', () => {
  it('should load conversations from IndexedDB');
  it('should create new conversation');
  it('should invalidate queries on update');
});

describe('useConversationMessages', () => {
  it('should add message and persist');
  it('should update transcript on final result');
});
```

### Audio Processing Tests

```typescript
describe('AudioProcessor', () => {
  it('should downsample audio correctly');
  it('should encode Float32 to Int16');
  it('should handle interruption');
});
```

---

## 19. Future Enhancements

- Export conversations (JSON, PDF)
- Search/filter conversations
- Conversation sharing (generate link)
- Offline support (sync when online)
- Voice activity detection optimization
- Conversation tagging/categorization
- Multi-user support (with auth)
- Backend sync (if needed later)

