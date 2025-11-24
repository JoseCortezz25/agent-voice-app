# Gemini Live Conversations - Next.js Implementation Plan

**Created**: 2025-11-21
**Session**: N/A (Direct request)
**Type**: Next.js Architecture
**Complexity**: Medium

## 1. Feature Overview

**Feature**: Multi-conversation support for Gemini Live voice agent
**User Flow**:
1. User lands on home page showing list of past conversations
2. User can create new conversation or select existing one
3. User enters active conversation page with real-time voice interaction
4. User can navigate back to list, preserving conversation history

**Primary Routes**:
- `/` (conversations list)
- `/conversation/[id]` (active conversation)

## 2. Routing Structure

### New Routes to Create

#### Route: `/` (Home - Conversations List)

**File**: `app/page.tsx` (REPLACE existing Next.js welcome page)
**Type**: Client Component (needs IndexedDB - browser API)
**Purpose**: Display list of saved conversations from IndexedDB
**Dynamic**: No

**Layout Needed**: No (uses root layout)
**Route Group**: None (replaces default home page)

**Why Client Component**:
- IndexedDB is client-side only (browser API)
- No server-side data fetching possible
- Real-time updates to conversation list
- Browser storage access required

#### Route: `/conversation/new` (New Conversation)

**File**: `app/conversation/new/page.tsx`
**Type**: Client Component (WebSocket + IndexedDB)
**Purpose**: Initialize new voice conversation session
**Dynamic**: No (static "new" segment)

**Layout Needed**: Yes (shared with conversation/[id])
**Route Group**: Keep existing `(live-voice)` or create new `(conversations)`

**Why Client Component**:
- Real-time WebSocket connection
- Audio processing (browser MediaStream API)
- IndexedDB for saving conversation
- Client-side state management (Zustand stores)

#### Route: `/conversation/[id]` (Existing Conversation)

**File**: `app/conversation/[id]/page.tsx`
**Type**: Client Component (WebSocket + IndexedDB)
**Purpose**: Load and continue existing conversation
**Dynamic**: Yes (dynamic segment: `[id]` - conversation UUID)

**Layout Needed**: Yes (shared conversation layout)
**Route Group**: Same as `/conversation/new`

**Why Client Component**:
- Same as `/conversation/new`
- Additionally: Load conversation history from IndexedDB
- Resume session state

### Existing Routes to Modify

#### Route: `/gemini-live` (Deprecated)

**File**: `app/(live-voice)/gemini-live/page.tsx`
**Change**: DEPRECATE or REDIRECT to `/conversation/new`
**Reason**: Replaced by new conversation-based routing

**Options**:
1. Delete the file entirely
2. Add redirect: `redirect('/conversation/new')`
3. Keep as standalone demo page

**Recommendation**: Option 2 - Add redirect for backward compatibility

## 3. Server Component Architecture

### Page Component (Client Component - Browser APIs Required)

**File**: `app/page.tsx`
**Component Type**: ❌ Client Component (MUST use "use client")

```typescript
'use client';

import { Suspense } from 'react';
import { ConversationsList } from '@/domains/live-voice-agent/components/organisms/conversations-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Voice Conversations</h1>
        <p className="text-muted-foreground">
          Your conversation history with Gemini Live
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <ConversationsList />
      </Suspense>
    </div>
  );
}
```

**Data Fetching**: ❌ No server fetch (IndexedDB is client-side only)
**Why Client Component**: IndexedDB access, browser storage, real-time updates

### Client Components (all require "use client")

#### 1. ConversationsList Component

**File**: `@/domains/live-voice-agent/components/organisms/conversations-list.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useEffect } from 'react';
import { useConversationsStore } from '@/domains/live-voice-agent/stores/conversations-store';
import { ConversationCard } from '../molecules/conversation-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ConversationsList() {
  const router = useRouter();
  const { conversations, isLoading, loadConversations, deleteConversation } =
    useConversationsStore();

  useEffect(() => {
    loadConversations(); // Load from IndexedDB on mount
  }, [loadConversations]);

  const handleNewConversation = () => {
    router.push('/conversation/new');
  };

  if (isLoading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Conversations</h2>
        <Button onClick={handleNewConversation}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {conversations.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No conversations yet. Start a new one!
          </p>
        ) : (
          conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onDelete={deleteConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

**Why Client Component**:
- IndexedDB access (browser API)
- Zustand store integration
- useRouter for navigation
- useEffect for data loading

#### 2. Active Conversation Page

**File**: `app/conversation/[id]/page.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LiveVoiceSession } from '@/domains/live-voice-agent/components/organisms/live-voice-session';
import { useConversationsStore } from '@/domains/live-voice-agent/stores/conversations-store';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const { loadConversation, currentConversation } = useConversationsStore();

  useEffect(() => {
    if (conversationId && conversationId !== 'new') {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Configuration Error
          </h1>
          <p className="text-muted-foreground">
            NEXT_PUBLIC_GEMINI_API_KEY not set
          </p>
        </div>
      </div>
    );
  }

  return (
    <LiveVoiceSession
      conversationId={conversationId}
      initialConversation={currentConversation}
      apiKey={apiKey}
      model="gemini-2.0-flash-exp"
      voiceName="Puck"
    />
  );
}
```

**Why Client Component**:
- useParams for dynamic route access
- IndexedDB conversation loading
- Real-time WebSocket session
- Browser audio APIs

## 4. Layouts and Templates

### Root Layout (NO modifications needed)

**File**: `app/layout.tsx`
**Changes**: None - already configured correctly
**Current State**: Server Component with fonts, Toaster, and global styles

### Conversation Layout (NEW)

**File**: `app/conversation/layout.tsx`
**Purpose**: Shared layout for both `new` and `[id]` conversation pages
**Type**: Client Component (navigation controls need interactivity)

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Conversations
          </Button>
          <h1 className="text-lg font-semibold">Gemini Live</h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Why Client Component**: Needs useRouter for navigation

## 5. Loading and Error States

### Loading UI for Home Page

**File**: `app/loading.tsx`
**Purpose**: Streaming loading state for conversations list

```typescript
// Server Component
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-6 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
```

**When shown**: While page.tsx is loading (automatic with Suspense)

### Loading UI for Conversation

**File**: `app/conversation/loading.tsx`
**Purpose**: Loading state while conversation initializes

```typescript
// Server Component
import { Skeleton } from '@/components/ui/skeleton';

export default function ConversationLoading() {
  return (
    <div className="flex min-h-screen flex-col p-4">
      <Skeleton className="mb-4 h-16 w-full" />
      <Skeleton className="flex-1" />
    </div>
  );
}
```

### Error Boundary for Home

**File**: `app/error.tsx`
**Purpose**: Catch and handle errors in conversations list

```typescript
'use client'; // Must be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Conversations list error:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-4 text-muted-foreground">
          Failed to load conversations. Please try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
```

### Error Boundary for Conversation

**File**: `app/conversation/error.tsx`
**Purpose**: Catch conversation session errors

```typescript
'use client'; // Must be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ConversationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Conversation error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Session Error</h2>
        <p className="mb-4 text-muted-foreground">
          Failed to initialize conversation. Please try again.
        </p>
        <div className="flex gap-4">
          <Button onClick={reset}>Retry</Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 6. Data Fetching Strategy

### IndexedDB Client-Side Fetch (Only Option)

**NO Server Component Fetch**: IndexedDB is browser-only API

```typescript
// domains/live-voice-agent/stores/conversations-store.ts
'use client';

import { create } from 'zustand';
import { ConversationRepository } from '../repositories/conversation-repository';

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  turns: ConversationTurn[];
}

interface ConversationsState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  loadConversations: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  createConversation: () => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversation: (id: string, data: Partial<Conversation>) => Promise<void>;
}

const repository = new ConversationRepository();

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,

  loadConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await repository.findAll();
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  loadConversation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await repository.findById(id);
      set({ currentConversation: conversation, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  createConversation: async () => {
    const id = crypto.randomUUID();
    const newConversation: Conversation = {
      id,
      title: `Conversation ${new Date().toLocaleDateString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      turns: [],
    };

    await repository.create(newConversation);
    set(state => ({
      conversations: [newConversation, ...state.conversations]
    }));

    return id;
  },

  deleteConversation: async (id: string) => {
    await repository.delete(id);
    set(state => ({
      conversations: state.conversations.filter(c => c.id !== id)
    }));
  },

  updateConversation: async (id: string, data: Partial<Conversation>) => {
    await repository.update(id, data);
    set(state => ({
      conversations: state.conversations.map(c =>
        c.id === id ? { ...c, ...data } : c
      )
    }));
  },
}));
```

**Cache Strategy**: None (client-side storage, always fresh from IndexedDB)

## 7. Server Actions Integration

**NOT APPLICABLE**: This feature uses only client-side storage (IndexedDB)

No server mutations needed. All CRUD operations happen in browser:
- Create conversation → IndexedDB
- Read conversations → IndexedDB
- Update conversation → IndexedDB
- Delete conversation → IndexedDB

**Future Enhancement**: If backend persistence is needed later:
- Add Server Actions in `domains/live-voice-agent/actions.ts`
- Sync IndexedDB with backend database
- Use Server Actions for cloud backup/restore

## 8. Middleware for Route Protection

**NOT NEEDED**: No authentication required for this feature

All routes are public. Conversations stored locally in browser.

**Future Enhancement**: If user accounts added:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Future: Check if user is authenticated
  // For now: Allow all access
  return NextResponse.next();
}

export const config = {
  matcher: ['/conversation/:path*'],
};
```

## 9. Metadata and SEO

### Static Metadata for Home

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice Conversations | Gemini Live',
  description: 'Your conversation history with Gemini 2.0 Live API',
  openGraph: {
    title: 'Voice Conversations | Gemini Live',
    description: 'Real-time voice conversations powered by Gemini AI',
  },
};
```

### Dynamic Metadata for Conversation

```typescript
// app/conversation/[id]/page.tsx
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const conversationId = params.id;

  if (conversationId === 'new') {
    return {
      title: 'New Conversation | Gemini Live',
      description: 'Start a new voice conversation with Gemini AI',
    };
  }

  // For existing conversations
  // Note: Can't fetch from IndexedDB server-side
  // So we use generic metadata
  return {
    title: 'Voice Conversation | Gemini Live',
    description: 'Continue your voice conversation with Gemini AI',
  };
}
```

**Limitation**: Cannot load conversation title from IndexedDB for metadata (server-side vs client-side)

**Solution**: Use generic metadata or add backend sync later

## 10. Route Groups and Organization

### Current Structure

```
app/
├── (live-voice)/          # Existing route group (DEPRECATE)
│   └── gemini-live/
│       └── page.tsx       # OLD: Redirect to /conversation/new
```

### NEW Recommended Structure

```
app/
├── layout.tsx             # Root layout (Server Component)
├── page.tsx               # NEW: Conversations list (Client Component)
├── loading.tsx            # NEW: Loading state for home
├── error.tsx              # NEW: Error boundary for home
│
├── conversation/          # Conversation routes
│   ├── layout.tsx         # NEW: Shared conversation layout (Client)
│   ├── loading.tsx        # NEW: Loading state for conversations
│   ├── error.tsx          # NEW: Error boundary for conversations
│   │
│   ├── new/
│   │   └── page.tsx       # NEW: New conversation (Client Component)
│   │
│   └── [id]/
│       └── page.tsx       # NEW: Existing conversation (Client Component)
│
└── (live-voice)/          # DEPRECATED (optional: keep or remove)
    └── gemini-live/
        └── page.tsx       # REDIRECT to /conversation/new
```

### Why No Route Group for Conversations?

**Reason**: Route groups add no value here
- No shared layout beyond what `conversation/layout.tsx` provides
- URL should show `/conversation/[id]` clearly
- No need to hide "conversation" segment

**Route groups would only add**: Unnecessary complexity

## 11. Files to Create

### `app/page.tsx` (REPLACE existing)
**Purpose**: Conversations list home page
**Type**: Client Component (IndexedDB access)
**Exports**: `default export function HomePage()`
**Metadata**: Yes (static)

### `app/loading.tsx` (NEW)
**Purpose**: Loading state for home page
**Type**: Server Component
**Exports**: `default export function Loading()`

### `app/error.tsx` (NEW)
**Purpose**: Error boundary for home page
**Type**: Client Component (must be)
**Exports**: `default export function Error()`

### `app/conversation/layout.tsx` (NEW)
**Purpose**: Shared layout for conversation pages
**Type**: Client Component (navigation needs interactivity)
**Exports**: `default export function ConversationLayout()`

### `app/conversation/loading.tsx` (NEW)
**Purpose**: Loading state for conversations
**Type**: Server Component
**Exports**: `default export function ConversationLoading()`

### `app/conversation/error.tsx` (NEW)
**Purpose**: Error boundary for conversations
**Type**: Client Component (must be)
**Exports**: `default export function ConversationError()`

### `app/conversation/new/page.tsx` (NEW)
**Purpose**: New conversation page
**Type**: Client Component (WebSocket + IndexedDB)
**Exports**: `default export function NewConversationPage()`

### `app/conversation/[id]/page.tsx` (NEW)
**Purpose**: Existing conversation page
**Type**: Client Component (WebSocket + IndexedDB)
**Exports**: `default export function ConversationPage()`
**Metadata**: Yes (dynamic - but limited by IndexedDB)

### `domains/live-voice-agent/stores/conversations-store.ts` (NEW)
**Purpose**: Zustand store for conversations state
**Type**: Client-side store
**Exports**: `export const useConversationsStore`

### `domains/live-voice-agent/repositories/conversation-repository.ts` (NEW)
**Purpose**: IndexedDB repository for CRUD operations
**Type**: Client-side repository
**Exports**: `export class ConversationRepository`

### `domains/live-voice-agent/components/organisms/conversations-list.tsx` (NEW)
**Purpose**: Conversations list component
**Type**: Client Component
**Exports**: `export function ConversationsList()`

### `domains/live-voice-agent/components/molecules/conversation-card.tsx` (NEW)
**Purpose**: Individual conversation card
**Type**: Client Component
**Exports**: `export function ConversationCard()`

## 12. Files to Modify

### `app/(live-voice)/gemini-live/page.tsx`
**Change**: Add redirect to new route
```typescript
import { redirect } from 'next/navigation';

export default function GeminiLivePage() {
  redirect('/conversation/new');
}
```

### `domains/live-voice-agent/components/organisms/live-voice-session.tsx`
**Change**: Accept conversationId prop and integrate with conversations store
**New Props**:
```typescript
interface LiveVoiceSessionProps {
  conversationId: string;
  initialConversation?: Conversation | null;
  apiKey: string;
  model: string;
  voiceName: string;
}
```

## 13. Implementation Steps

1. Create conversations repository: `domains/live-voice-agent/repositories/conversation-repository.ts`
2. Create conversations store: `domains/live-voice-agent/stores/conversations-store.ts`
3. Create conversation card component: `domains/live-voice-agent/components/molecules/conversation-card.tsx`
4. Create conversations list component: `domains/live-voice-agent/components/organisms/conversations-list.tsx`
5. Replace `app/page.tsx` with conversations list page
6. Create `app/loading.tsx` for home loading state
7. Create `app/error.tsx` for home error boundary
8. Create `app/conversation/layout.tsx` for shared conversation layout
9. Create `app/conversation/loading.tsx` for conversation loading state
10. Create `app/conversation/error.tsx` for conversation error boundary
11. Create `app/conversation/new/page.tsx` for new conversations
12. Create `app/conversation/[id]/page.tsx` for existing conversations
13. Update `live-voice-session.tsx` to accept conversationId and integrate with store
14. Add redirect in `app/(live-voice)/gemini-live/page.tsx`
15. Test conversation creation and loading
16. Test navigation between list and conversation pages

## 14. Component Placement Strategy

### Client Components (all in this feature)
- **Route pages**: `app/page.tsx`, `app/conversation/*/page.tsx`
- **Route layouts**: `app/conversation/layout.tsx` (needs useRouter)
- **Domain components**: `domains/live-voice-agent/components/`
- **Domain stores**: `domains/live-voice-agent/stores/`
- **Domain repositories**: `domains/live-voice-agent/repositories/`

### Rule Application
- ALL components are Client Components (browser APIs required)
- Server Components ONLY for: loading.tsx skeletons
- Error boundaries MUST be Client Components (Next.js requirement)

## 15. Performance Considerations

### IndexedDB Optimization
- Lazy load conversations (don't load full history upfront)
- Use pagination for large conversation lists
- Cache conversation metadata separate from full turns
- Debounce auto-save during active conversation

### Code Splitting
- Conversations list and active session are separate routes (automatic split)
- Heavy audio processing components already lazy loaded
- IndexedDB repository is code-split per route

### Caching Strategy
- IndexedDB is client-side (no HTTP caching)
- Store conversation metadata in Zustand for quick access
- Only load full conversation when needed (on conversation page)

### Best Practices
```typescript
// Lazy load full conversation only when entering conversation page
const loadConversation = async (id: string) => {
  // Only load metadata for list
  const metadata = await repository.getMetadata(id);

  // Load full conversation only when viewing
  if (needsFullData) {
    const full = await repository.findById(id);
  }
};
```

## 16. Important Notes

**ALL components are Client Components** (IndexedDB + WebSocket + Audio APIs)
**NO Server Components for data fetching** (IndexedDB is client-only)
**NO Server Actions** (all mutations happen client-side)
**Suspense is used** but for UI loading states, not async data fetching
**Zustand for client state** (conversations list, current conversation)
**NO React Query needed** (no server state - everything is client IndexedDB)
**Loading states via loading.tsx** (automatic Next.js streaming)
**Error boundaries required** (catch IndexedDB/WebSocket errors)

**Critical Constraint Compliance**:
- ❌ Server Components: Not applicable (all browser APIs)
- ❌ Server Actions: Not applicable (client-side storage)
- ✅ Suspense: Used for loading states
- ✅ Named exports: All components (except page.tsx)
- ✅ Zustand for UI state: Conversations store
- ❌ React Query: Not needed (no server state)
- ✅ Error boundaries: All routes have error.tsx
- ✅ Loading states: All routes have loading.tsx

## 17. Coordination with Other Agents

### Domain Architect (Future)
- **Receives**: Conversation repository interface
- **Provides**: IndexedDB schema and CRUD operations
- **Integration**: ConversationRepository implementation

### UX Designer
- **Receives**: Route structure and navigation flow
- **Provides**: Conversations list and card UI design
- **Integration**: ConversationCard and ConversationsList components

### shadcn Builder (Future)
- **Receives**: UI component needs (cards, buttons, skeletons)
- **Uses**: shadcn Card, Button, Skeleton components

## 18. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Navigation Flow                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   app/page.tsx  │
                    │ (Conversations  │
                    │     List)       │
                    └─────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  ConversationsList Component            │
        │  - useConversationsStore()              │
        │  - loadConversations() on mount         │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  ConversationRepository                 │
        │  - findAll() from IndexedDB             │
        │  - Returns: Conversation[]              │
        └─────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
  ┌─────────────────┐              ┌─────────────────────┐
  │ Click "New"     │              │ Click conversation  │
  │ → /conversation │              │ → /conversation/[id]│
  │    /new         │              │                     │
  └─────────────────┘              └─────────────────────┘
            │                                   │
            └─────────────┬─────────────────────┘
                          ▼
        ┌───────────────────────────────────────────┐
        │  app/conversation/[id]/page.tsx           │
        │  - Get conversationId from params         │
        │  - loadConversation(id) if not "new"      │
        └───────────────────────────────────────────┘
                          │
                          ▼
        ┌───────────────────────────────────────────┐
        │  LiveVoiceSession Component               │
        │  - conversationId prop                    │
        │  - Load conversation turns from IndexedDB │
        │  - Connect WebSocket                      │
        │  - Start audio capture                    │
        │  - Save turns to IndexedDB on update      │
        └───────────────────────────────────────────┘
                          │
                          ▼
        ┌───────────────────────────────────────────┐
        │  Auto-save conversation                   │
        │  - updateConversation(id, { turns })      │
        │  - ConversationRepository.update()        │
        │  - Persist to IndexedDB                   │
        └───────────────────────────────────────────┘
```

## 19. IndexedDB Schema Design

```typescript
// domains/live-voice-agent/repositories/conversation-repository.ts

interface ConversationRecord {
  id: string; // Primary key (UUID)
  title: string;
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  turns: ConversationTurn[]; // Full conversation history
  metadata: {
    model: string;
    voiceName: string;
    totalDuration: number;
    turnCount: number;
  };
}

// IndexedDB Database Schema
const DB_NAME = 'gemini-live-conversations';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

// Indexes
- id (primary key)
- createdAt (for sorting)
- updatedAt (for sorting)
```

## 20. Future Enhancements

### Phase 2: Backend Sync (Optional)
- Add Server Actions for cloud backup
- Sync IndexedDB with PostgreSQL/MongoDB
- Enable cross-device conversation history
- Add user authentication

### Phase 3: Advanced Features
- Search conversations by content
- Tag/categorize conversations
- Export conversation transcripts
- Share conversations (public links)

### Phase 4: Real-time Collaboration
- Multiple users in same conversation
- Live transcription display
- Conversation branching/forking

## 21. Testing Considerations

### Unit Tests
- ConversationRepository CRUD operations
- useConversationsStore state mutations
- ConversationCard component rendering

### Integration Tests
- Full flow: Create → Save → Load → Delete
- Navigation between routes
- Error handling for IndexedDB failures

### E2E Tests
- User creates new conversation
- User selects existing conversation
- User deletes conversation
- Conversation persists after page refresh

---

**END OF PLAN**
