# Gemini Live Configuration Flow - Next.js Implementation Plan

**Created**: 2025-11-23
**Session**: `gemini_live_config`
**Type**: Next.js Architecture
**Complexity**: High

## 1. Feature Overview

**Feature**: Gemini Live Voice Configuration and Real-time Session Management
**User Flow**: Landing → Configuration Form → Active Real-time Session
**Route**: `/gemini-live/*`

### User Journey
1. User lands on `/gemini-live` (conversations list)
2. Clicks "New Conversation" → redirects to `/gemini-live/new` (configuration form)
3. Configures voice and system prompt → saves to IndexedDB
4. Redirects to `/gemini-live/[sessionId]` (active session)
5. Real-time session loads config from IndexedDB and initializes Gemini Live API
6. User can return to list and resume sessions from IndexedDB

## 2. Routing Structure

### Current Route Group

**Route Group**: `(live-voice)` (already exists)
**Purpose**: Organization for voice-related pages without affecting URL structure
**Location**: `src/app/(live-voice)/`

### Routes Analysis

#### Route 1: `/gemini-live` (Landing Page)

**File**: `src/app/(live-voice)/gemini-live/page.tsx`
**Type**: ❌ Client Component (currently - NEEDS REFACTOR)
**Purpose**: Display list of saved conversations from IndexedDB
**Dynamic**: No

**Current Issues**:
- Using Client Component for entire page (inefficient)
- Direct IndexedDB access in component (violates repository pattern)
- Hard-coded Spanish text (needs externalization)

**Recommended Architecture**:
- Convert to Server Component wrapper
- Client Component only for `ConversationsList` (interactive)
- Data fetching through repository pattern (even for client-side IndexedDB)

**Layout Needed**: No (uses root layout)

---

#### Route 2: `/gemini-live/new` (Configuration Form)

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`
**Type**: ❌ Client Component (correct - needs interactivity)
**Purpose**: Configure new conversation (voice, system prompt)
**Dynamic**: No

**Current Issues**:
- Missing conversation creation logic (console.log placeholder)
- No validation schema (should use zod)
- Hard-coded Spanish text
- No error handling
- No loading states during creation

**Component Type**: Client Component (CORRECT - needs form state)

**Layout Needed**: No (uses root layout)

---

#### Route 3: `/gemini-live/[sessionId]` (Active Session)

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`
**Type**: ❌ Client Component (correct - needs real-time connection)
**Purpose**: Active voice conversation with real-time audio streaming
**Dynamic**: Yes (dynamic segment: `[sessionId]`)

**Current Issues**:
- Not loading conversation config from IndexedDB
- Not passing config to `use-gemini-live` hook
- Hard-coded connection status (should use real hook)
- No conversation persistence during session
- Missing error boundary
- No loading state while loading conversation

**Component Type**: Client Component (CORRECT - needs WebSocket/audio)

**Layout Needed**: No (uses root layout)

**Route Protection**: None needed (no auth) - but should validate sessionId exists

---

### Route Group Structure (Current)

```
app/
├── layout.tsx                              # Root layout (Server Component)
├── page.tsx                                # Home (Server Component) - shows ConversationsList
│
└── (live-voice)/                           # Route group (no URL segment)
    └── gemini-live/
        ├── page.tsx                        # /gemini-live (Client - NEEDS REFACTOR)
        ├── new/
        │   └── page.tsx                    # /gemini-live/new (Client - correct)
        └── [sessionId]/
            └── page.tsx                    # /gemini-live/[sessionId] (Client - correct)
```

## 3. Server Component Architecture

### Problem: Current Implementation is Too Client-Heavy

**Issue**: Pages that could be Server Components are Client Components, loading all state management client-side unnecessarily.

**Solution**: Strategic Server/Client Component split

### Home Page (Root) - Server Component Strategy

**File**: `src/app/page.tsx`
**Current**: Server Component showing `<ConversationsList />` (correct)

**Recommendation**: Keep as Server Component
- NO data fetching here (IndexedDB is client-side only)
- Simply renders Client Component `ConversationsList`

```typescript
// ✅ Server Component (already correct)
import { ConversationsList } from '@/domains/voice-agent/components/organisms/conversations-list';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <ConversationsList />
    </main>
  );
}
```

**Why Server Component**:
- No data fetching needed
- Static page structure
- Client Component handles interactive list

---

### Landing Page - Hybrid Strategy

**File**: `src/app/(live-voice)/gemini-live/page.tsx`
**Current**: Client Component (entire page)
**Recommended**: Server Component wrapper + Client Component for interactive parts

**New Architecture**:

```typescript
// ✅ Server Component wrapper
import { GeminiLiveConversations } from './_components/gemini-live-conversations';

export default function GeminiLivePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        {/* ✅ Client Component for interactive list */}
        <GeminiLiveConversations />
      </div>
    </div>
  );
}
```

**Why Server Component Wrapper**:
- Page shell can be static
- Only interactive list needs client-side state
- Better performance (less JS shipped)

---

### Configuration Form - Client Component

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`
**Current**: ❌ Client Component (correct type, but needs improvements)
**Recommended**: Keep as Client Component (MUST be client for form state)

**Why Client Component**:
- [x] Uses useState for form fields
- [x] Browser APIs (navigation after submit)
- [x] Event handlers (onChange, onClick)
- [x] IndexedDB write operations

**Improvements Needed**:
- Add zod validation schema
- Implement actual conversation creation
- Add loading/error states
- Integrate with repository pattern

**Note**: This page MUST remain a Client Component.

---

### Active Session - Client Component

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`
**Current**: ❌ Client Component (correct type, but incomplete)
**Recommended**: Keep as Client Component (MUST be client for real-time)

**Why Client Component**:
- [x] Uses `use-gemini-live` hook (WebSocket/audio)
- [x] Browser APIs (microphone access)
- [x] Real-time state updates
- [x] Event handlers (mic toggle, disconnect)

**Improvements Needed**:
- Load conversation from IndexedDB using sessionId
- Pass config to `use-gemini-live` hook
- Handle loading/error states
- Persist messages during session

**Note**: This page MUST remain a Client Component.

## 4. Data Fetching Strategy

### Challenge: IndexedDB is Client-Side Only

**Problem**: IndexedDB is a browser API, so we CANNOT use Server Components for data fetching from IndexedDB.

**Solution**: Client Component data fetching pattern

### Client Component Fetch Pattern

**Landing Page** (`/gemini-live`):
```typescript
'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/domains/voice-agent/stores/conversation.store';
import { conversationRepository } from '@/domains/voice-agent/repositories/conversation.repository';

export function GeminiLiveConversations() {
  const { conversations, setConversations } = useConversationStore();

  useEffect(() => {
    // ✅ Load conversations on mount
    const loadConversations = async () => {
      try {
        const allConversations = await conversationRepository.getAll();
        setConversations(allConversations);
      } catch (error) {
        console.error('Failed to load conversations', error);
      }
    };

    loadConversations();
  }, [setConversations]);

  // Render list...
}
```

**Cache Strategy**:
- IndexedDB acts as persistent cache
- No `force-cache` or `no-store` (client-side storage)
- Zustand provides in-memory cache for UI

---

**Configuration Form** (`/gemini-live/new`):
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { conversationRepository } from '@/domains/voice-agent/repositories/conversation.repository';
import { createConversationSchema } from '@/domains/voice-agent/schema';

export default function NewConversationPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      // ✅ Create conversation via repository
      const conversation = await conversationRepository.create({
        title: 'New Conversation',
        systemPrompt,
        config: { voiceName, temperature: 0.7, ... }
      });

      // ✅ Redirect to active session
      router.push(`/gemini-live/${conversation.id}`);
    } catch (error) {
      // Handle error
    } finally {
      setCreating(false);
    }
  };

  // Render form...
}
```

**Note**: No Server Action needed (IndexedDB is client-side only)

---

**Active Session** (`/gemini-live/[sessionId]`):
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { conversationRepository } from '@/domains/voice-agent/repositories/conversation.repository';
import { useGeminiLive } from '@/domains/voice-agent/hooks/use-gemini-live';

export default function ActiveConversationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load conversation config on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const conv = await conversationRepository.getById(sessionId);
        setConversation(conv);
      } catch (error) {
        // Handle not found
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [sessionId]);

  // ✅ Initialize Gemini Live with config
  const { status, connect, disconnect, ... } = useGeminiLive({
    voiceName: conversation?.config.voiceName,
    systemPrompt: conversation?.systemPrompt,
    conversationId: sessionId
  });

  useEffect(() => {
    if (conversation && status === 'disconnected') {
      connect();
    }
  }, [conversation, status, connect]);

  // Render session UI...
}
```

**Data Flow**:
1. Load conversation from IndexedDB
2. Pass config to `use-gemini-live` hook
3. Hook connects to Gemini Live API with config
4. Messages persisted to IndexedDB during session

## 5. Component Placement Strategy

### Route-Specific Components (Private)

**Location**: `src/app/(live-voice)/gemini-live/_components/`

**Purpose**: Components used ONLY within gemini-live routes

**Examples**:
- `gemini-live-conversations.tsx` (Client Component - list with actions)
- `conversation-item.tsx` (Client Component - interactive card)
- `session-header.tsx` (Server or Client - page header)

**Rule**: These are page-implementation details, not reusable domain logic.

---

### Domain Components (Reusable)

**Location**: `src/domains/voice-agent/components/`

**Purpose**: Reusable components following Atomic Design

**Current Structure**:
```
src/domains/voice-agent/components/
├── atoms/
│   ├── audio-visualizer.tsx       (Client - canvas/audio)
│   ├── connection-status.tsx      (Server or Client - badge)
│   └── mic-button.tsx             (Client - interactive)
│
├── molecules/
│   ├── conversation-card.tsx      (Client - interactive)
│   └── voice-controls.tsx         (Client - buttons)
│
└── organisms/
    ├── conversations-list.tsx     (Client - full list)
    └── live-voice-session.tsx     (Client - full session UI)
```

**Classification**:
- **atoms/audio-visualizer.tsx**: ❌ Client (uses canvas, audio context)
- **atoms/connection-status.tsx**: ✅ Server (just displays status badge)
- **atoms/mic-button.tsx**: ❌ Client (onClick handler)
- **molecules/conversation-card.tsx**: ❌ Client (onClick, hover states)
- **molecules/voice-controls.tsx**: ❌ Client (multiple buttons with handlers)
- **organisms/conversations-list.tsx**: ❌ Client (loads data, interactive)
- **organisms/live-voice-session.tsx**: ❌ Client (real-time audio)

---

### Rule of Thumb

**Server Components** (can be in domain/components):
- Pure presentational (no interactivity)
- Static content (badges, labels, icons)
- Layout wrappers

**Client Components** (domain/components or page/_components):
- Any interactivity (onClick, onChange, etc.)
- Browser APIs (audio, canvas, localStorage, IndexedDB)
- Hooks (useState, useEffect, custom hooks)
- Real-time updates (WebSocket, audio streaming)

## 6. Navigation Flow and Redirects

### Navigation Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       User Navigation Flow                       │
└─────────────────────────────────────────────────────────────────┘

   [/] (Home)
     │
     ├─ Shows ConversationsList (from /domains)
     │    │
     │    ├─ Empty: "Create First Conversation" button
     │    │    └──> router.push('/gemini-live/new')
     │    │
     │    └─ Has conversations: Click conversation card
     │         └──> router.push(`/gemini-live/${conversationId}`)
     │

   [/gemini-live] (Landing - same as home, but explicit route)
     │
     ├─ "Nueva Conversación" button
     │    └──> router.push('/gemini-live/new')
     │
     └─ Click conversation card
          └──> router.push(`/gemini-live/${conversationId}`)

   [/gemini-live/new] (Configuration)
     │
     ├─ "Cancelar" button
     │    └──> router.back()
     │
     └─ "Iniciar Conversación" button
          │
          ├─ Create conversation in IndexedDB
          ├─ Get new conversation.id
          └──> router.push(`/gemini-live/${conversation.id}`)

   [/gemini-live/[sessionId]] (Active Session)
     │
     ├─ Back arrow button
     │    └──> router.push('/gemini-live')
     │
     ├─ "Cerrar Sesión" button
     │    ├─ disconnect()
     │    └──> router.push('/gemini-live')
     │
     └─ Auto-connect on mount
          └─ useGeminiLive({ voiceName, systemPrompt, ... })
```

### Redirect Logic

#### From Configuration Form → Active Session

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`

```typescript
const handleCreate = async () => {
  setCreating(true);
  try {
    // Validate
    const validated = createConversationSchema.parse({
      systemPrompt,
      voiceName
    });

    // Create in IndexedDB
    const conversation = await conversationRepository.create({
      title: `Conversation ${new Date().toLocaleString()}`,
      systemPrompt: validated.systemPrompt,
      config: {
        voiceName: validated.voiceName,
        temperature: 0.7,
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        language: 'es',
        audioFormat: 'linear16',
        sampleRate: 16000
      }
    });

    // ✅ Redirect to active session
    router.push(`/gemini-live/${conversation.id}`);
  } catch (error) {
    setError(error.message);
  } finally {
    setCreating(false);
  }
};
```

**Redirect Type**: `router.push()` (programmatic navigation)
**Why**: After successful creation, navigate to new session

---

#### From Active Session → Landing

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

```typescript
const handleExit = async () => {
  try {
    // 1. Disconnect Gemini Live session
    await disconnect();

    // 2. Save final state to IndexedDB (if needed)
    await conversationRepository.update(sessionId, {
      updatedAt: new Date(),
      messageCount: messages.length
    });

    // 3. Navigate back
    router.push('/gemini-live');
  } catch (error) {
    console.error('Error exiting session', error);
    // Still navigate even if error
    router.push('/gemini-live');
  }
};
```

**Redirect Type**: `router.push()` (after cleanup)
**Why**: Clean disconnect before navigation

---

#### Cancel from Configuration Form → Back

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`

```typescript
<Button
  variant="outline"
  onClick={() => router.back()}
  disabled={creating}
>
  Cancelar
</Button>
```

**Redirect Type**: `router.back()` (browser history)
**Why**: User cancelled, return to previous page

---

#### Invalid Session ID → Not Found

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

```typescript
useEffect(() => {
  const loadConversation = async () => {
    try {
      const conv = await conversationRepository.getById(sessionId);

      if (!conv) {
        // ✅ Session not found
        router.replace('/gemini-live');
        toast.error('Conversation not found');
        return;
      }

      setConversation(conv);
    } catch (error) {
      router.replace('/gemini-live');
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  loadConversation();
}, [sessionId, router]);
```

**Redirect Type**: `router.replace()` (no history entry)
**Why**: Invalid URL, don't add to history

## 7. Loading and Error States

### Loading UI Strategy

**Problem**: All pages are Client Components, so we CANNOT use `loading.tsx` (Server Component only feature).

**Solution**: Client-side loading states with conditional rendering.

---

#### Landing Page Loading

**File**: `src/app/(live-voice)/gemini-live/page.tsx` (Client Component)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GeminiLivePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load conversations...
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-32 w-full mb-3" />
        <Skeleton className="h-32 w-full mb-3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Normal render...
}
```

**Why not loading.tsx**: Client Component page cannot use loading.tsx (Server Component feature).

---

#### Configuration Form Loading

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`

**Loading State**: During conversation creation

```typescript
const [creating, setCreating] = useState(false);

<Button
  onClick={handleCreate}
  disabled={creating || !systemInstruction.trim()}
>
  {creating ? 'Creando...' : 'Iniciar Conversación'}
</Button>
```

**Why inline**: Form submission loading, not page loading.

---

#### Active Session Loading

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

**Two Loading States**:
1. Loading conversation from IndexedDB
2. Connecting to Gemini Live API

```typescript
const [loadingConversation, setLoadingConversation] = useState(true);
const { status } = useGeminiLive(...);

if (loadingConversation) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="p-6">
        <p className="text-muted-foreground">Loading conversation...</p>
      </Card>
    </div>
  );
}

if (status === 'connecting') {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="p-6">
        <p className="text-muted-foreground">Connecting to Gemini Live...</p>
      </Card>
    </div>
  );
}
```

**Two-phase loading**:
1. Load conversation config (IndexedDB)
2. Connect to Gemini Live API (WebSocket)

---

### Error Handling Strategy

**Problem**: Client Components cannot use `error.tsx` (Server Component error boundary).

**Solution**: Client-side error handling with toast notifications and error states.

---

#### Landing Page Errors

```typescript
'use client';

import { toast } from 'sonner';

export default function GeminiLivePage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const conversations = await conversationRepository.getAll();
        setConversations(conversations);
      } catch (err) {
        setError('Failed to load conversations');
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // Normal render...
}
```

---

#### Configuration Form Errors

```typescript
const [error, setError] = useState<string | null>(null);

const handleCreate = async () => {
  setError(null); // Clear previous errors
  setCreating(true);

  try {
    // Validate
    const validated = createConversationSchema.parse({
      systemPrompt,
      voiceName
    });

    // Create
    const conversation = await conversationRepository.create({...});
    router.push(`/gemini-live/${conversation.id}`);
  } catch (err) {
    if (err instanceof z.ZodError) {
      setError(err.errors[0].message);
    } else {
      setError('Failed to create conversation');
    }
    toast.error(error);
  } finally {
    setCreating(false);
  }
};

// In render:
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

---

#### Active Session Errors

**Multiple Error Sources**:
1. Conversation not found
2. IndexedDB error
3. Gemini Live connection error
4. Microphone permission denied

```typescript
const { status, error: geminiError, connect } = useGeminiLive({...});

// Handle conversation load error
useEffect(() => {
  const loadConversation = async () => {
    try {
      const conv = await conversationRepository.getById(sessionId);
      if (!conv) {
        toast.error('Conversation not found');
        router.replace('/gemini-live');
        return;
      }
      setConversation(conv);
    } catch (err) {
      toast.error('Failed to load conversation');
      router.replace('/gemini-live');
    }
  };
  loadConversation();
}, [sessionId]);

// Handle Gemini Live errors
useEffect(() => {
  if (status === 'error') {
    toast.error(geminiError || 'Connection failed');
  }
}, [status, geminiError]);

// In render:
{status === 'error' && (
  <Alert variant="destructive">
    <AlertDescription>
      {geminiError || 'Connection error'}
    </AlertDescription>
    <Button onClick={() => connect()}>Retry</Button>
  </Alert>
)}
```

**Error Boundary Note**: Since these are Client Components, add a route-level error boundary manually if needed:

```typescript
'use client';

import { Component, ReactNode } from 'react';

class SessionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ActiveConversationPage() {
  return (
    <SessionErrorBoundary>
      {/* Page content */}
    </SessionErrorBoundary>
  );
}
```

## 8. Hook Modifications: `use-gemini-live`

### Current Implementation Issues

**File**: `src/domains/voice-agent/hooks/use-gemini-live.tsx`

**Problems**:
1. Hard-coded voice name: `'Kore'` (line 267)
2. No system prompt support
3. No conversation persistence
4. No configuration from props

---

### New Hook Interface

**Required Props**:

```typescript
export interface UseGeminiLiveConfig {
  voiceName: VoiceName;
  systemPrompt?: string;
  conversationId?: string; // For persistence
  temperature?: number;
  onTranscriptUpdate?: (update: TranscriptUpdate) => void;
  onMessageSaved?: (message: Message) => void;
}

export interface UseGeminiLiveReturn {
  status: ConnectionStatus;
  isMuted: boolean;
  volumeLevel: number;
  transcripts: TranscriptUpdate[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  toggleMute: () => void;
  error: string | null;
}

export function useGeminiLive(config: UseGeminiLiveConfig): UseGeminiLiveReturn {
  // Implementation...
}
```

---

### Hook Changes Needed

#### 1. Accept Configuration Props

```typescript
export function useGeminiLive({
  voiceName,
  systemPrompt,
  conversationId,
  temperature = 0.7,
  onTranscriptUpdate,
  onMessageSaved
}: UseGeminiLiveConfig): UseGeminiLiveReturn {

  const [transcripts, setTranscripts] = useState<TranscriptUpdate[]>([]);

  // Use voiceName from props instead of hard-coded
  const sessionPromise = ai.live.connect({
    model: MODEL_NAME,
    callbacks: { /* ... */ },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName // ✅ From props, not hard-coded
          }
        }
      },
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      generationConfig: {
        temperature
      }
    }
  });
}
```

---

#### 2. Add Transcript Tracking

```typescript
const [transcripts, setTranscripts] = useState<TranscriptUpdate[]>([]);

callbacks: {
  onmessage: async (message: LiveServerMessage) => {
    // Handle audio output (existing code)...

    // ✅ NEW: Handle text transcripts
    const textContent = message.serverContent?.modelTurn?.parts?.find(p => p.text);
    if (textContent?.text) {
      const transcript: TranscriptUpdate = {
        role: 'assistant',
        text: textContent.text,
        isInterim: !message.serverContent?.turnComplete,
        confidence: 1.0
      };

      setTranscripts(prev => [...prev, transcript]);

      if (onTranscriptUpdate) {
        onTranscriptUpdate(transcript);
      }
    }

    // ✅ NEW: Save complete messages to IndexedDB
    if (message.serverContent?.turnComplete && conversationId) {
      const messageToSave: Message = {
        conversationId,
        role: 'assistant',
        type: 'text',
        content: textContent?.text || '',
        transcript: textContent?.text,
        metadata: {
          latency: Date.now() - lastInputTimeRef.current
        }
      };

      // Save via repository
      const saved = await messageRepository.create(messageToSave);

      if (onMessageSaved) {
        onMessageSaved(saved);
      }
    }
  }
}
```

---

#### 3. Add User Input Tracking

```typescript
// Track when user speaks (for persistence)
const lastInputTimeRef = useRef<number>(Date.now());

processor.onaudioprocess = e => {
  // Existing volume calculation...

  if (isMutedRef.current) return;

  const pcmBlob = createPcmBlob(inputData);

  lastInputTimeRef.current = Date.now(); // ✅ Track input time

  // Send to Gemini...
};
```

---

#### 4. Return Transcripts

```typescript
return {
  status,
  isMuted,
  volumeLevel,
  transcripts, // ✅ NEW
  connect,
  disconnect,
  toggleMute,
  error
};
```

---

### Usage in Active Session Page

```typescript
const {
  status,
  isMuted,
  volumeLevel,
  transcripts,
  connect,
  disconnect,
  toggleMute,
  error
} = useGeminiLive({
  voiceName: conversation?.config.voiceName ?? 'Puck',
  systemPrompt: conversation?.systemPrompt,
  conversationId: sessionId,
  temperature: conversation?.config.temperature ?? 0.7,
  onTranscriptUpdate: (update) => {
    console.log('New transcript:', update);
  },
  onMessageSaved: async (message) => {
    // Update conversation metadata
    await conversationRepository.update(sessionId, {
      updatedAt: new Date(),
      messageCount: conversation.messageCount + 1,
      lastMessageAt: new Date()
    });
  }
});
```

## 9. Props Interfaces for Pages/Components

### Landing Page

**File**: `src/app/(live-voice)/gemini-live/page.tsx`

**No props** (page component)

**Internal State**:
```typescript
interface GeminiLivePageState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
}
```

---

### Configuration Form

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`

**No props** (page component)

**Internal State**:
```typescript
interface NewConversationPageState {
  systemInstruction: string;
  voiceName: VoiceName;
  creating: boolean;
  error: string | null;
}
```

---

### Active Session

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

**Props**: From Next.js (params)
```typescript
interface ActiveConversationPageProps {
  params: {
    sessionId: string;
  };
}

export default function ActiveConversationPage({ params }: ActiveConversationPageProps) {
  const { sessionId } = params;
  // ...
}
```

**Internal State**:
```typescript
interface ActiveConversationPageState {
  conversation: Conversation | null;
  loadingConversation: boolean;
  error: string | null;
}
```

---

### ConversationsList Component

**File**: `src/domains/voice-agent/components/organisms/conversations-list.tsx`

**Props**:
```typescript
interface ConversationsListProps {
  onConversationClick?: (conversationId: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (conversationId: string) => void;
  emptyStateMessage?: string;
  className?: string;
}
```

**Usage**:
```typescript
<ConversationsList
  onConversationClick={(id) => router.push(`/gemini-live/${id}`)}
  onNewConversation={() => router.push('/gemini-live/new')}
  onDeleteConversation={async (id) => {
    await conversationRepository.delete(id);
    // Reload list
  }}
/>
```

---

### ConversationCard Component

**File**: `src/domains/voice-agent/components/molecules/conversation-card.tsx`

**Props**:
```typescript
interface ConversationCardProps {
  conversation: ConversationListItem;
  onClick?: (conversationId: string) => void;
  onDelete?: (conversationId: string) => void;
  className?: string;
}
```

---

### LiveVoiceSession Component

**File**: `src/domains/voice-agent/components/organisms/live-voice-session.tsx`

**Props**:
```typescript
interface LiveVoiceSessionProps {
  conversation: Conversation;
  onExit: () => void;
  onError?: (error: string) => void;
  className?: string;
}
```

**Usage**:
```typescript
<LiveVoiceSession
  conversation={conversation}
  onExit={handleExit}
  onError={(error) => toast.error(error)}
/>
```

---

### VoiceControls Component

**File**: `src/domains/voice-agent/components/molecules/voice-controls.tsx`

**Props**:
```typescript
interface VoiceControlsProps {
  isMuted: boolean;
  isConnected: boolean;
  onToggleMute: () => void;
  onDisconnect: () => void;
  className?: string;
}
```

---

### AudioVisualizer Component

**File**: `src/domains/voice-agent/components/atoms/audio-visualizer.tsx`

**Props**:
```typescript
interface AudioVisualizerProps {
  volumeLevel: number; // 0-1
  isActive: boolean;
  variant?: 'bars' | 'wave' | 'circle';
  color?: string;
  className?: string;
}
```

---

### ConnectionStatus Component

**File**: `src/domains/voice-agent/components/atoms/connection-status.tsx`

**Props**:
```typescript
interface ConnectionStatusProps {
  status: ConnectionStatus;
  showLabel?: boolean;
  className?: string;
}
```

## 10. Repository Pattern Integration

### Problem: Direct IndexedDB Access

**Current Code** (WRONG):
```typescript
// ❌ Direct localforage in component
await localforage.iterate((value: Conversation) => {
  conversations.push(value);
});
```

**Critical Constraint**: ALL data access must go through repository layer.

---

### Repository Interface

**File**: `src/domains/voice-agent/repositories/conversation.repository.ts`

```typescript
export interface IConversationRepository {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  create(input: CreateConversationInput): Promise<Conversation>;
  update(id: string, input: UpdateConversationInput): Promise<Conversation>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Conversation[]>;
}
```

---

### Implementation (IndexedDB)

```typescript
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, CreateConversationInput, UpdateConversationInput } from '../types';

class ConversationRepository implements IConversationRepository {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'voice-agent',
      storeName: 'conversations',
      description: 'Stores voice conversations'
    });
  }

  async getAll(): Promise<Conversation[]> {
    const conversations: Conversation[] = [];

    await this.store.iterate((value: Conversation) => {
      conversations.push(value);
    });

    // Sort by updatedAt descending
    return conversations.sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async getById(id: string): Promise<Conversation | null> {
    const conversation = await this.store.getItem<Conversation>(id);
    return conversation || null;
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    const now = new Date();
    const conversation: Conversation = {
      id: uuidv4(),
      ...input,
      messages: [],
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      totalDuration: 0,
      isArchived: input.isArchived ?? false
    };

    await this.store.setItem(conversation.id, conversation);
    return conversation;
  }

  async update(id: string, input: UpdateConversationInput): Promise<Conversation> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Conversation ${id} not found`);
    }

    const updated: Conversation = {
      ...existing,
      ...input,
      updatedAt: new Date()
    };

    await this.store.setItem(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.store.removeItem(id);
  }

  async search(query: string): Promise<Conversation[]> {
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return all.filter(conv =>
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.systemPrompt.toLowerCase().includes(lowerQuery)
    );
  }
}

export const conversationRepository = new ConversationRepository();
```

---

### Message Repository (Optional but Recommended)

**File**: `src/domains/voice-agent/repositories/message.repository.ts`

```typescript
export interface IMessageRepository {
  create(input: CreateMessageInput): Promise<Message>;
  getByConversation(conversationId: string): Promise<Message[]>;
  deleteByConversation(conversationId: string): Promise<void>;
}

class MessageRepository implements IMessageRepository {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'voice-agent',
      storeName: 'messages',
      description: 'Stores conversation messages'
    });
  }

  async create(input: CreateMessageInput): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      ...input,
      timestamp: new Date()
    };

    // Store with composite key: conversationId:messageId
    const key = `${input.conversationId}:${message.id}`;
    await this.store.setItem(key, message);

    return message;
  }

  async getByConversation(conversationId: string): Promise<Message[]> {
    const messages: Message[] = [];

    await this.store.iterate((value: Message, key) => {
      if (key.startsWith(`${conversationId}:`)) {
        messages.push(value);
      }
    });

    // Sort by timestamp
    return messages.sort((a, b) =>
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    const keys: string[] = [];

    await this.store.iterate((value, key) => {
      if (key.startsWith(`${conversationId}:`)) {
        keys.push(key);
      }
    });

    await Promise.all(keys.map(key => this.store.removeItem(key)));
  }
}

export const messageRepository = new MessageRepository();
```

---

### Usage in Components

**ALWAYS use repository, NEVER direct IndexedDB**:

```typescript
// ✅ CORRECT
import { conversationRepository } from '@/domains/voice-agent/repositories/conversation.repository';

const conversations = await conversationRepository.getAll();

// ❌ WRONG
import localforage from 'localforage';
await localforage.iterate(...);
```

## 11. Validation Schemas (zod)

### Conversation Creation Schema

**File**: `src/domains/voice-agent/schema.ts`

```typescript
import { z } from 'zod';
import type { VoiceName } from './types';

export const voiceNameSchema = z.enum(['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede']);

export const conversationConfigSchema = z.object({
  voiceName: voiceNameSchema,
  temperature: z.number().min(0).max(2).default(0.7),
  model: z.string().default('gemini-2.5-flash-native-audio-preview-09-2025'),
  language: z.string().default('es'),
  audioFormat: z.enum(['linear16', 'opus']).default('linear16'),
  sampleRate: z.enum([16000, 24000]).default(16000)
});

export const createConversationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters').max(2000),
  voiceName: voiceNameSchema,
  temperature: z.number().min(0).max(2).optional().default(0.7)
});

export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
```

---

### Usage in Configuration Form

```typescript
'use client';

import { useState } from 'react';
import { createConversationSchema, type CreateConversationFormData } from '@/domains/voice-agent/schema';

export default function NewConversationPage() {
  const [systemInstruction, setSystemInstruction] = useState('...');
  const [voiceName, setVoiceName] = useState<VoiceName>('Puck');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    setErrors({});

    try {
      // ✅ Validate
      const validated = createConversationSchema.parse({
        title: `Conversation ${new Date().toLocaleString()}`,
        systemPrompt: systemInstruction,
        voiceName,
        temperature: 0.7
      });

      // Create...
      const conversation = await conversationRepository.create({
        title: validated.title,
        systemPrompt: validated.systemPrompt,
        config: {
          voiceName: validated.voiceName,
          temperature: validated.temperature,
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          language: 'es',
          audioFormat: 'linear16',
          sampleRate: 16000
        }
      });

      router.push(`/gemini-live/${conversation.id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  // In render:
  <Textarea
    value={systemInstruction}
    onChange={e => setSystemInstruction(e.target.value)}
    className={errors.systemPrompt ? 'border-destructive' : ''}
  />
  {errors.systemPrompt && (
    <p className="text-destructive text-sm">{errors.systemPrompt}</p>
  )}
}
```

## 12. Text Externalization

### Problem: Hard-coded Spanish Text

**Current Code** (WRONG):
```typescript
<h1>Gemini Live Voice</h1>
<Button>Nueva Conversación</Button>
<p>No hay conversaciones todavía</p>
```

**Critical Constraint**: ALL user-facing text must be externalized.

---

### Text Map Structure

**File**: `src/domains/voice-agent/text-maps/gemini-live.text-map.ts`

```typescript
export const geminiLiveTextMap = {
  landing: {
    title: 'Gemini Live Voice',
    newConversationButton: 'Nueva Conversación',
    emptyStateTitle: 'No hay conversaciones todavía',
    emptyStateDescription: 'Crea tu primera conversación con el asistente de voz',
    emptyStateButton: 'Crear Primera Conversación',
    loadingConversations: 'Cargando conversaciones...',
    errorLoadingConversations: 'Error al cargar conversaciones'
  },
  configuration: {
    pageTitle: 'Nueva Conversación',
    pageDescription: 'Configura tu asistente de voz antes de comenzar',
    systemPromptLabel: 'Instrucción del Sistema',
    systemPromptPlaceholder: 'Describe cómo debe comportarse el asistente...',
    systemPromptHelp: 'Define la personalidad y el comportamiento del asistente',
    voiceLabel: 'Voz del Asistente',
    voiceHelp: 'Selecciona la voz que usará el asistente',
    cancelButton: 'Cancelar',
    startButton: 'Iniciar Conversación',
    creatingButton: 'Creando...',
    errorCreating: 'Error al crear conversación'
  },
  session: {
    title: 'Conversación en Vivo',
    connecting: 'Conectando al asistente de voz...',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    error: 'Error de conexión',
    muteButton: 'Silenciar Micrófono',
    unmuteButton: 'Activar Micrófono',
    endSessionButton: 'Cerrar Sesión',
    transcriptTitle: 'Transcripción en Vivo',
    userLabel: 'Tú:',
    assistantLabel: 'Asistente:',
    loadingConversation: 'Cargando conversación...',
    conversationNotFound: 'Conversación no encontrada'
  },
  voices: {
    Puck: 'Puck',
    Charon: 'Charon',
    Kore: 'Kore',
    Fenrir: 'Fenrir',
    Aoede: 'Aoede'
  }
} as const;
```

---

### Usage in Components

```typescript
import { geminiLiveTextMap } from '@/domains/voice-agent/text-maps/gemini-live.text-map';

export default function GeminiLivePage() {
  const text = geminiLiveTextMap.landing;

  return (
    <div>
      <h1>{text.title}</h1>
      <Button>{text.newConversationButton}</Button>

      {conversations.length === 0 && (
        <Card>
          <h2>{text.emptyStateTitle}</h2>
          <p>{text.emptyStateDescription}</p>
          <Button>{text.emptyStateButton}</Button>
        </Card>
      )}
    </div>
  );
}
```

---

### Type-Safe Text Access

```typescript
// ✅ Type-safe
const text = geminiLiveTextMap.landing.title; // OK

// ❌ Type error
const text = geminiLiveTextMap.landing.invalidKey; // Error
```

## 13. Files to Create

### New Files

#### 1. `src/domains/voice-agent/repositories/conversation.repository.ts`
**Purpose**: Repository for conversation CRUD operations
**Exports**: `conversationRepository`, `IConversationRepository`

---

#### 2. `src/domains/voice-agent/repositories/message.repository.ts`
**Purpose**: Repository for message CRUD operations
**Exports**: `messageRepository`, `IMessageRepository`

---

#### 3. `src/domains/voice-agent/text-maps/gemini-live.text-map.ts`
**Purpose**: Externalized text for all gemini-live pages
**Exports**: `geminiLiveTextMap`

---

#### 4. `src/app/(live-voice)/gemini-live/_components/gemini-live-conversations.tsx`
**Purpose**: Client Component for conversations list (extracted from page)
**Type**: Client Component
**Exports**: `GeminiLiveConversations` (named export)

---

#### 5. `src/app/(live-voice)/gemini-live/loading.tsx` (Optional - if refactor to Server Component)
**Purpose**: Loading UI for gemini-live route
**Type**: Server Component
**Exports**: `default export function Loading()`

**NOTE**: Only create if landing page is refactored to Server Component.

---

#### 6. `src/app/(live-voice)/gemini-live/error.tsx` (Optional - if refactor to Server Component)
**Purpose**: Error boundary for gemini-live route
**Type**: Client Component (must be)
**Exports**: `default export function Error()`

**NOTE**: Only create if landing page is refactored to Server Component.

## 14. Files to Modify

### 1. `src/domains/voice-agent/hooks/use-gemini-live.tsx`

**Changes**:
- Accept config props: `{ voiceName, systemPrompt, conversationId, ... }`
- Remove hard-coded voice name `'Kore'`
- Add transcript tracking
- Add message persistence via repository
- Return transcripts array

**Lines to Change**:
- Line 32: Add config parameter to function signature
- Line 267: Replace hard-coded `'Kore'` with `config.voiceName`
- Add system prompt to config
- Add transcript state and tracking

---

### 2. `src/app/(live-voice)/gemini-live/page.tsx`

**Changes**:
- Replace direct IndexedDB with repository
- Externalize Spanish text to text map
- Add proper error handling
- Add loading states
- Fix navigation (router.push paths)

**Lines to Change**:
- Line 18-29: Replace localforage.iterate with `conversationRepository.getAll()`
- Line 41-43: Replace hard-coded text with `geminiLiveTextMap.landing.*`
- Line 49-59: Replace hard-coded text in empty state
- Line 57: Fix navigation path to `/gemini-live/new`

---

### 3. `src/app/(live-voice)/gemini-live/new/page.tsx`

**Changes**:
- Add conversation creation logic (replace console.log)
- Add zod validation
- Add error handling
- Externalize Spanish text
- Integrate with repository

**Lines to Change**:
- Line 101: Replace `console.log('start')` with actual creation logic
- Add validation with `createConversationSchema`
- Add error state and display
- Replace all hard-coded Spanish text

---

### 4. `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

**Changes**:
- Load conversation from IndexedDB via repository
- Pass config to `use-gemini-live` hook
- Add proper connection logic
- Add loading/error states
- Externalize text

**Lines to Change**:
- Add conversation loading on mount
- Line 24: Replace hard-coded status with real hook
- Pass conversation config to hook
- Add auto-connect on mount
- Add transcripts display
- Replace all hard-coded Spanish text

---

### 5. `src/domains/voice-agent/stores/conversation.store.ts`

**Changes**:
- Remove direct localforage usage
- Keep only in-memory state for UI
- Repository handles persistence

**Lines to Change**:
- Line 23-28: Remove `localforage.setItem()` from `createConversation`
- Line 34: Remove `localforage.removeItem()` from `deleteConversation`
- Store only manages UI state, repository handles persistence

---

### 6. `src/domains/voice-agent/schema.ts`

**Changes**:
- Add conversation creation validation schema
- Add voice name enum schema

**Add**:
- `voiceNameSchema`
- `conversationConfigSchema`
- `createConversationSchema`

---

### 7. `src/domains/voice-agent/types.ts`

**Changes** (if needed):
- Ensure `CreateConversationInput` type exists
- Ensure `UpdateConversationInput` type exists
- Ensure `VoiceName` type is exported

**Already exists** (no changes needed if types are complete)

## 15. Implementation Steps

### Phase 1: Repository Setup

1. Create `conversation.repository.ts`
2. Create `message.repository.ts`
3. Create text map `gemini-live.text-map.ts`
4. Add validation schemas to `schema.ts`

---

### Phase 2: Hook Enhancement

5. Modify `use-gemini-live` to accept config props
6. Remove hard-coded voice name
7. Add transcript tracking
8. Add message persistence callbacks

---

### Phase 3: Configuration Form

9. Modify `/gemini-live/new/page.tsx`
10. Add conversation creation logic
11. Add validation with zod
12. Add error handling
13. Integrate with repository
14. Externalize text

---

### Phase 4: Active Session

15. Modify `/gemini-live/[sessionId]/page.tsx`
16. Add conversation loading from IndexedDB
17. Pass config to hook
18. Add auto-connect logic
19. Add transcript display
20. Add error/loading states
21. Externalize text

---

### Phase 5: Landing Page

22. Modify `/gemini-live/page.tsx`
23. Replace direct IndexedDB with repository
24. Externalize text
25. Add error/loading states
26. Fix navigation paths

---

### Phase 6: Store Cleanup

27. Modify `conversation.store.ts`
28. Remove direct IndexedDB operations
29. Keep only UI state management

---

### Phase 7: Testing

30. Test conversation creation flow
31. Test active session with config
32. Test conversation loading
33. Test error states
34. Test loading states
35. Test navigation flow

## 16. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Complete Data Flow                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Step 1: Landing Page (/gemini-live)                                 │
└─────────────────────────────────────────────────────────────────────┘

  User visits /gemini-live
       │
       ├──> Page Component (Client) renders
       │
       ├──> useEffect runs on mount
       │         │
       │         ├──> conversationRepository.getAll()
       │         │         │
       │         │         └──> IndexedDB (localforage.iterate)
       │         │                   │
       │         │                   └──> Returns Conversation[]
       │         │
       │         └──> setConversations(conversations)
       │                   │
       │                   └──> Zustand store (UI state)
       │
       └──> Renders ConversationsList
              │
              ├─ Empty: Show "Create First Conversation"
              │    └──> onClick: router.push('/gemini-live/new')
              │
              └─ Has conversations: Show cards
                   └──> onClick: router.push(`/gemini-live/${id}`)

┌─────────────────────────────────────────────────────────────────────┐
│ Step 2: Configuration Form (/gemini-live/new)                       │
└─────────────────────────────────────────────────────────────────────┘

  User clicks "New Conversation"
       │
       └──> Navigates to /gemini-live/new
              │
              ├──> Page renders form
              │     ├─ systemPrompt: useState
              │     ├─ voiceName: useState
              │     └─ creating: useState
              │
              ├──> User fills form
              │
              └──> User clicks "Iniciar Conversación"
                     │
                     ├──> Validate with zod
                     │      │
                     │      └──> createConversationSchema.parse(...)
                     │
                     ├──> conversationRepository.create({
                     │      title: "...",
                     │      systemPrompt,
                     │      config: { voiceName, temperature, ... }
                     │    })
                     │         │
                     │         ├──> Generate UUID
                     │         ├──> Create Conversation object
                     │         ├──> localforage.setItem(id, conversation)
                     │         └──> Return Conversation
                     │
                     └──> router.push(`/gemini-live/${conversation.id}`)

┌─────────────────────────────────────────────────────────────────────┐
│ Step 3: Active Session (/gemini-live/[sessionId])                   │
└─────────────────────────────────────────────────────────────────────┘

  User navigates to /gemini-live/[sessionId]
       │
       ├──> Page Component renders
       │
       ├──> useEffect (load conversation)
       │         │
       │         ├──> conversationRepository.getById(sessionId)
       │         │         │
       │         │         └──> IndexedDB (localforage.getItem)
       │         │                   │
       │         │                   ├──> Found: Return Conversation
       │         │                   └──> Not found: Return null
       │         │
       │         ├──> If not found:
       │         │      ├─ toast.error("Conversation not found")
       │         │      └─ router.replace('/gemini-live')
       │         │
       │         └──> setConversation(conversation)
       │
       ├──> useGeminiLive({
       │      voiceName: conversation.config.voiceName,
       │      systemPrompt: conversation.systemPrompt,
       │      conversationId: sessionId,
       │      onMessageSaved: async (message) => {
       │        await conversationRepository.update(sessionId, {
       │          messageCount: conversation.messageCount + 1,
       │          lastMessageAt: new Date()
       │        })
       │      }
       │    })
       │         │
       │         ├──> Hook initializes
       │         │
       │         ├──> connect() called (useEffect)
       │         │      │
       │         │      ├──> Initialize Audio Contexts
       │         │      ├──> Request microphone access
       │         │      ├──> Connect to Gemini Live API
       │         │      │      │
       │         │      │      └──> ai.live.connect({
       │         │      │            config: {
       │         │      │              voiceConfig: { voiceName },
       │         │      │              systemInstruction: { text: systemPrompt }
       │         │      │            }
       │         │      │          })
       │         │      │
       │         │      └──> setStatus('connected')
       │         │
       │         ├──> Audio input (microphone)
       │         │      │
       │         │      ├──> processor.onaudioprocess
       │         │      ├──> createPcmBlob(audioData)
       │         │      ├──> session.sendRealtimeInput({ media: pcmBlob })
       │         │      └──> Sent to Gemini Live API
       │         │
       │         ├──> Audio output (Gemini response)
       │         │      │
       │         │      ├──> onmessage(serverMessage)
       │         │      ├──> Extract base64 audio
       │         │      ├──> Decode audio buffer
       │         │      └──> Play through speakers
       │         │
       │         └──> Transcript tracking
       │                │
       │                ├──> Extract text from serverMessage
       │                ├──> Create TranscriptUpdate
       │                ├──> onTranscriptUpdate(transcript)
       │                └──> Display in UI
       │
       └──> User speaks → Gemini responds → Transcripts update → Loop

┌─────────────────────────────────────────────────────────────────────┐
│ Step 4: Message Persistence (During Session)                        │
└─────────────────────────────────────────────────────────────────────┘

  Gemini completes turn (turnComplete: true)
       │
       ├──> onMessageSaved callback
       │         │
       │         ├──> messageRepository.create({
       │         │      conversationId,
       │         │      role: 'assistant',
       │         │      content: textContent,
       │         │      transcript: textContent,
       │         │      metadata: { latency, ... }
       │         │    })
       │         │         │
       │         │         ├──> Generate message UUID
       │         │         ├──> Create Message object
       │         │         ├──> localforage.setItem(`${conversationId}:${messageId}`, message)
       │         │         └──> Return Message
       │         │
       │         └──> conversationRepository.update(conversationId, {
       │                messageCount: conversation.messageCount + 1,
       │                lastMessageAt: new Date()
       │              })
       │
       └──> Message persisted to IndexedDB

┌─────────────────────────────────────────────────────────────────────┐
│ Step 5: Exit Session                                                │
└─────────────────────────────────────────────────────────────────────┘

  User clicks "Cerrar Sesión"
       │
       ├──> disconnect()
       │      │
       │      ├──> Close Gemini session
       │      ├──> Stop microphone
       │      ├──> Close audio contexts
       │      └──> setStatus('disconnected')
       │
       ├──> conversationRepository.update(conversationId, {
       │      updatedAt: new Date()
       │    })
       │
       └──> router.push('/gemini-live')
              │
              └──> Back to landing page (loop to Step 1)
```

## 17. Performance Considerations

### Client-Side Data Loading

**Challenge**: All data fetching is client-side (IndexedDB), so no Server Component benefits.

**Optimizations**:

1. **Lazy Loading Conversations**:
   ```typescript
   // Don't load all conversations at once
   const [visibleConversations, setVisibleConversations] = useState<Conversation[]>([]);
   const [hasMore, setHasMore] = useState(true);

   const loadMore = async () => {
     const next = await conversationRepository.getAll({
       limit: 20,
       offset: visibleConversations.length
     });
     setVisibleConversations([...visibleConversations, ...next]);
   };
   ```

2. **Memoization**:
   ```typescript
   import { useMemo } from 'react';

   const sortedConversations = useMemo(() => {
     return conversations.sort((a, b) =>
       b.updatedAt.getTime() - a.updatedAt.getTime()
     );
   }, [conversations]);
   ```

3. **Virtual Scrolling** (for large lists):
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';

   const virtualizer = useVirtualizer({
     count: conversations.length,
     getScrollElement: () => parentRef.current,
     estimateSize: () => 100,
   });
   ```

---

### Audio Streaming Performance

**Already optimized in `use-gemini-live`**:
- Buffer size: 4096 (good latency/performance balance)
- Sample rate: 16kHz input, 24kHz output (optimal for Gemini)
- Audio scheduling: Prevents gaps in playback

**Additional optimizations**:
- Use `nextStartTimeRef` for smooth audio queue
- Stop interrupted audio immediately (no wasted playback)

---

### Code Splitting

**Strategy**:
- Audio-heavy components already client-side (automatic code split)
- Domain components are tree-shaken (only used components bundled)

**Bundle Analysis**:
```bash
npm run build
npm run analyze
```

## 18. Metadata and SEO

### Root Layout Metadata

**File**: `src/app/layout.tsx`

**Current** (already good):
```typescript
export const metadata: Metadata = {
  title: 'Voice Agent | Gemini Live',
  description: 'Real-time voice conversations powered by Gemini 2.0 Live API'
};
```

---

### Page-Specific Metadata

**Problem**: Client Components cannot export metadata.

**Solution**: Use Next.js `<Metadata>` component or update root layout.

---

#### Landing Page Metadata

**File**: `src/app/(live-voice)/gemini-live/page.tsx`

**Option 1**: Client Component (current) - cannot export metadata
**Option 2**: Refactor to Server Component - can export metadata

**If refactored to Server Component**:
```typescript
// ✅ Server Component
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversations | Gemini Live',
  description: 'Manage your voice conversations with Gemini 2.0 Live API',
};
```

**If stays Client Component**: No metadata possible (use root layout).

---

#### Configuration Form Metadata

**File**: `src/app/(live-voice)/gemini-live/new/page.tsx`

**Client Component** (cannot export metadata)

**Workaround**: Use dynamic title in root layout or accept default.

---

#### Active Session Metadata

**File**: `src/app/(live-voice)/gemini-live/[sessionId]/page.tsx`

**Client Component** (cannot export metadata)

**Dynamic metadata not possible** for Client Components.

---

### SEO Consideration

**Note**: These pages are application pages (not public content), so SEO is not critical.

**If SEO needed**: Refactor landing page to Server Component to export metadata.

## 19. Important Notes

**Critical Constraints Applied**:

✅ **Repository Pattern**: All IndexedDB access through repositories
✅ **Text Externalization**: All UI text in text maps
✅ **Component Placement**: Domain components follow Atomic Design
✅ **Named Exports**: Domain components use named exports (pages use default)

**Next.js 15 Patterns Applied**:

✅ **Server Components by default**: Pages use Server wrapper when possible
✅ **Client Components for interactivity**: Only when needed (forms, real-time)
✅ **No Suspense needed**: Client-side data loading (no async Server Components)
✅ **Client-side error handling**: Toast + error states (no error.tsx for Client Components)
✅ **Client-side loading**: Conditional rendering (no loading.tsx for Client Components)

**Architecture Decisions**:

✅ **Route Group**: `(live-voice)` for organization
✅ **No Middleware**: No authentication (public app)
✅ **No Server Actions**: IndexedDB is client-side only
✅ **Zustand for UI state**: In-memory cache
✅ **IndexedDB for persistence**: Offline-first architecture

## 20. Migration Path (Optional Future Enhancement)

### Current Architecture
- Client Components for all pages
- IndexedDB for persistence
- No server-side data

### Future Migration (if needed)
1. Add authentication (Clerk/NextAuth)
2. Add server-side database (Supabase/Vercel Postgres)
3. Migrate conversations to server (API routes)
4. Keep IndexedDB as offline cache
5. Sync IndexedDB ↔ Server (online/offline)
6. Refactor pages to Server Components (where possible)

**When to migrate**:
- Multi-device sync needed
- User authentication needed
- Analytics/usage tracking needed
- Conversations need to persist beyond browser storage

## 21. Coordination with Other Agents

### Domain Architect
**Receives**: Repository interfaces, domain types, validation schemas
**Provides**:
- `IConversationRepository`
- `IMessageRepository`
- `CreateConversationInput`
- `createConversationSchema`

**Integration Point**: Repositories and types defined by Domain Architect, used by Next.js pages.

---

### UX Designer
**Receives**: Page flow requirements, navigation patterns
**Provides**: User flow diagram, component hierarchy
**Already Done**: UX wireframes exist (check `.claude/plans/ux-gemini-live-wireframes.md`)

**Integration Point**: Pages implement UX designer's flow.

---

### shadcn Builder
**Receives**: Component requirements (form, cards, buttons)
**Provides**: shadcn component selection
**Already Used**: Button, Card, Textarea, Select, Separator, Sonner

**Integration Point**: Pages use shadcn components selected by shadcn Builder.

---

## 22. Conclusion

**Architecture Summary**:

1. **Route Structure**: `(live-voice)` route group with 3 pages
2. **Component Strategy**: Client Components for all interactive pages
3. **Data Flow**: IndexedDB → Repository → Zustand → Components
4. **Navigation**: Programmatic routing with `router.push()`
5. **Loading/Error**: Client-side state (no loading.tsx/error.tsx)
6. **Persistence**: Offline-first with IndexedDB via repositories
7. **Real-time**: `use-gemini-live` hook with config props
8. **Validation**: zod schemas for forms
9. **Text**: Externalized to text maps

**Next Steps for Implementation**:
1. Create repositories (conversation, message)
2. Create text maps
3. Modify `use-gemini-live` hook
4. Update configuration form
5. Update active session page
6. Update landing page
7. Clean up store (remove direct IndexedDB)
8. Test complete flow

**Complexity**: High (real-time audio + offline persistence + complex data flow)
**Estimated Effort**: 2-3 days for complete implementation
**Risk**: Hook modifications (ensure audio pipeline stability)

---

**Plan Complete** ✅
