# Gemini Live Implementation Roadmap

**Based on**: Reference implementation analysis
**Current State**: Basic WebSocket + Audio working
**Goal**: Add persistence, transcriptions, and UI for conversations

---

## Key Differences Analysis

### Reference Implementation Uses:
- `@google/genai` SDK with direct callbacks
- IndexedDB helper functions (db.ts)
- Audio utility functions (audioUtils.ts)
- Single hook managing everything (useGeminiLive)
- Direct AudioContext at 16kHz (no manual downsampling needed)

### Our Current Implementation Has:
- Service Layer pattern (WebSocketClient, AudioProcessor classes)
- `@google/generative-ai` SDK
- No IndexedDB yet
- No audio utils yet
- Separated concerns (services, hooks, stores)

### Decision: **Hybrid Approach**
Keep our Service Layer but add missing pieces from reference:
- Add IndexedDB helpers
- Add audio utils
- Enhance useGeminiLive hook
- Switch to `@google/genai` SDK (better for Live API)

---

## Phase 1: Foundation (Week 1)

### 1.1 Switch SDK
- [ ] Install `@google/genai` package
- [ ] Remove `@google/generative-ai`
- [ ] Update imports across codebase

**Why**: `@google/genai` has native Live API support with callbacks

### 1.2 Create Audio Utils
**File**: `src/domains/live-voice-agent/utils/audio-utils.ts`

```typescript
// Based on reference implementation
export function base64ToBytes(base64: string): Uint8Array;
export function createPcmBlob(float32Array: Float32Array): { mimeType: string; data: string };
export function decodeAudioData(audioData: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer>;
```

- [ ] Implement `base64ToBytes` - Convert base64 → Uint8Array
- [ ] Implement `createPcmBlob` - Float32 → Int16 PCM → base64
- [ ] Implement `decodeAudioData` - Bytes → AudioBuffer
- [ ] Test each function independently

### 1.3 Create IndexedDB Layer
**File**: `src/domains/live-voice-agent/utils/db.ts`

**Schema**:
```typescript
DB_NAME: 'GeminiVoiceAssistantDB'
DB_VERSION: 2

stores:
  - sessions: { id, title, config, lastMessageAt }
  - messages: { id, sessionId, role, text, timestamp }
```

**Functions**:
- [ ] `initDB()` - Open/upgrade database
- [ ] `createSession(id, title, config)` - Create session
- [ ] `getSession(id)` - Get single session
- [ ] `getAllSessions()` - List all sessions
- [ ] `saveMessage(message)` - Save message
- [ ] `getMessagesBySession(sessionId)` - Load history
- [ ] `deleteSession(id)` - Delete session + messages

**Types**:
```typescript
interface SessionConfig {
  voice: VoiceName;
  systemInstruction: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
```

---

## Phase 2: Enhanced Audio Processing (Week 2)

### 2.1 Update AudioProcessor
**File**: `src/domains/live-voice-agent/services/audio-processor.ts`

**Changes**:
- [ ] Remove manual downsampling (use AudioContext at 16kHz directly)
- [ ] Replace PCM encoding with `createPcmBlob` util
- [ ] Use `decodeAudioData` util for playback
- [ ] Add `nextStartTime` scheduling for gapless playback
- [ ] Add `activeSources` Set for interruption handling
- [ ] Add `interruptPlayback()` method

**New Interface**:
```typescript
class AudioProcessor {
  private nextStartTime: number = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  async startCapture(onAudioData: (pcmBlob: { mimeType: string; data: string }) => void);
  async playAudioChunk(base64Audio: string): Promise<void>; // Uses nextStartTime
  interruptPlayback(): void; // Stops all active sources
}
```

### 2.2 Simplify WebSocketClient (or Remove)
**Decision**: The reference uses SDK callbacks directly. We can:

**Option A**: Keep WebSocketClient as thin wrapper
**Option B**: Remove it and use SDK callbacks directly in hook (simpler, like reference)

**Recommended**: **Option B** - Follow reference pattern for simplicity

- [ ] Remove `websocket-client.ts`
- [ ] Move WebSocket logic into `useGeminiLive` hook directly
- [ ] Use `@google/genai` callbacks: onopen, onmessage, onclose, onerror

---

## Phase 3: Enhanced Hook (Week 3)

### 3.1 Refactor useGeminiLive
**File**: `src/domains/live-voice-agent/hooks/use-gemini-live.ts`

**Based on reference implementation pattern**:

```typescript
interface UseGeminiLiveProps {
  apiKey: string;
  voiceName: VoiceName;
  systemInstruction: string;
  existingSessionId?: string; // Resume session
}

interface UseGeminiLiveReturn {
  // Actions
  connect: (props: UseGeminiLiveProps) => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
  loadSessionHistory: (sessionId: string) => Promise<void>;

  // State
  isMuted: boolean;
  status: ConnectionStatus;
  userTranscript: string;      // Live accumulator
  aiTranscript: string;         // Live accumulator
  history: ChatMessage[];       // Persisted messages
  currentSessionId: string | null;
}
```

**Implementation Steps**:
- [ ] Add refs for audio contexts (input 16kHz, output 24kHz)
- [ ] Add refs for media stream, processor, source
- [ ] Add refs for accumulation (currentInputRef, currentOutputRef)
- [ ] Add refs for mute state and session ID
- [ ] Implement `connect()` with Gemini SDK
  - Create session if new, load history if existing
  - Setup audio capture with ScriptProcessor
  - Setup SDK callbacks (onopen, onmessage, onclose, onerror)
- [ ] Handle `inputTranscription` - accumulate to userTranscript
- [ ] Handle `outputTranscription` - accumulate to aiTranscript
- [ ] Handle `turnComplete` - save messages to IndexedDB
- [ ] Handle audio chunks - play with gapless scheduling
- [ ] Handle `interrupted` - stop all audio sources
- [ ] Implement `disconnect()` - cleanup everything
- [ ] Implement `toggleMute()` - set ref flag
- [ ] Implement `loadSessionHistory()` - load from IndexedDB

---

## Phase 4: UI Components (Week 4)

### 4.1 Conversations List Page
**File**: `src/app/page.tsx` (replace home)

**Components needed**:
- [ ] `ConversationsList` organism
- [ ] `ConversationCard` molecule
- [ ] Empty state component
- [ ] Loading state

**Data flow**:
```typescript
useEffect(() => {
  const sessions = await getAllSessions();
  setSessions(sessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt));
}, []);
```

**Features**:
- [ ] Display list of sessions
- [ ] "New Conversation" button → navigate to `/conversation/new`
- [ ] Click session → navigate to `/conversation/[id]`
- [ ] Delete button (with confirmation)

### 4.2 New Conversation Setup
**File**: `src/app/conversation/new/page.tsx`

**Form**:
- [ ] System instruction textarea
- [ ] Voice selection dropdown (Puck, Charon, Kore, Fenrir, Aoede)
- [ ] "Start Conversation" button

**On submit**:
```typescript
const sessionId = generateId();
await createSession(sessionId, `Conversation ${new Date().toLocaleString()}`, {
  voice: selectedVoice,
  systemInstruction
});
router.push(`/conversation/${sessionId}`);
```

### 4.3 Active Conversation Page
**File**: `src/app/conversation/[id]/page.tsx`

**Layout**:
```
┌────────────────────────────────────┐
│ [← Back]  Conversación  [Mute]    │ Header
├────────────────────────────────────┤
│                                    │
│     Audio Visualizer (orb)         │
│                                    │
├────────────────────────────────────┤
│  Live Transcripts (if any):        │
│  Usuario: [userTranscript]         │
│  IA: [aiTranscript]                │
├────────────────────────────────────┤
│  Message History:                  │
│  ┌──────────────────────────────┐  │
│  │ User: Hola                   │  │
│  │ AI: Hola, ¿en qué puedo...  │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**Components**:
- [ ] Header with back button, title, mute button
- [ ] Audio visualizer (reuse existing or create orb)
- [ ] Live transcript display (userTranscript + aiTranscript)
- [ ] Message history scrollable list
- [ ] Auto-scroll to bottom on new messages

**Hook usage**:
```typescript
const { id } = useParams();
const {
  connect,
  disconnect,
  toggleMute,
  isMuted,
  status,
  userTranscript,
  aiTranscript,
  history,
  currentSessionId
} = useGeminiLive();

useEffect(() => {
  connect({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    voiceName: 'Puck', // Load from session config
    systemInstruction: '', // Load from session config
    existingSessionId: id
  });

  return () => disconnect();
}, [id]);
```

---

## Phase 5: Polish & Testing (Week 5)

### 5.1 Error Handling
- [ ] Network errors → show toast
- [ ] Microphone permission denied → clear error message
- [ ] Session not found → redirect to home
- [ ] IndexedDB errors → fallback or alert

### 5.2 Loading States
- [ ] Show loading while connecting
- [ ] Show loading while loading session history
- [ ] Skeleton for conversation list

### 5.3 Empty States
- [ ] No conversations yet → "Create your first conversation"
- [ ] No messages in conversation → "Start speaking..."

### 5.4 Accessibility
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader labels for all buttons
- [ ] Live regions for transcripts
- [ ] Focus management on navigation

### 5.5 Responsive Design
- [ ] Mobile: Full-screen conversation
- [ ] Tablet: Side-by-side if space allows
- [ ] Desktop: Optimal layout

### 5.6 Testing
- [ ] Create conversation → verify in IndexedDB
- [ ] Speak → verify transcript appears
- [ ] Turn complete → verify messages saved
- [ ] Resume conversation → verify history loads
- [ ] Delete conversation → verify removed from DB
- [ ] Mute → verify no audio sent
- [ ] Interrupt → verify audio stops

---

## Implementation Checklist

### Week 1: Foundation
- [ ] Install @google/genai
- [ ] Remove @google/generative-ai
- [ ] Create audio-utils.ts
- [ ] Create db.ts with IndexedDB helpers
- [ ] Test DB operations independently

### Week 2: Audio
- [ ] Refactor AudioProcessor (gapless playback, interruption)
- [ ] Remove or simplify WebSocketClient
- [ ] Test audio scheduling

### Week 3: Hook
- [ ] Refactor useGeminiLive (follow reference pattern)
- [ ] Add transcription handling
- [ ] Add persistence on turnComplete
- [ ] Add resume session logic
- [ ] Test full voice flow

### Week 4: UI
- [ ] Create home page (conversations list)
- [ ] Create new conversation page
- [ ] Create active conversation page
- [ ] Test navigation between pages

### Week 5: Polish
- [ ] Add error handling everywhere
- [ ] Add loading states
- [ ] Add empty states
- [ ] Accessibility audit
- [ ] Responsive design
- [ ] End-to-end testing

---

## Key Decisions Made

1. **SDK Choice**: Switch to `@google/genai` (better Live API support)
2. **Architecture**: Hybrid - keep some Service Layer but simplify with direct callbacks
3. **Persistence**: IndexedDB client-side only (like reference)
4. **Audio**: Use AudioContext at 16kHz directly (no manual downsampling)
5. **Transcripts**: Ephemeral accumulators + persisted on turnComplete
6. **Resume**: Load full history from IndexedDB, display in UI

---

## Next Immediate Steps

1. Create `audio-utils.ts` with 3 helper functions
2. Create `db.ts` with IndexedDB schema + CRUD
3. Test both independently before integrating
4. Then move to audio processor updates
5. Then refactor hook

**Ready to start implementation?** 🚀
