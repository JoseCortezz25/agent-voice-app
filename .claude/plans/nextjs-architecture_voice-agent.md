# Voice Agent Platform - Next.js 15 Implementation Plan

**Created**: 2025-11-18
**Type**: Next.js Architecture
**Complexity**: High
**Tech Stack**: Next.js 15, React 19, App Router, TypeScript

## 1. Feature Overview

**Feature**: Dual Voice Agent Integration Platform
**Integrations**:
1. White Library (chat-based voice with pre-built UI)
2. Gemini Live API (real-time voice with custom UI)

**User Flows**:
- Flow 1: Users interact with chat-based voice agent via White Library UI (HTTP webhook)
- Flow 2: Users engage in real-time voice conversations via Gemini Live (WebSocket)

## 2. Routing Structure

### Route Groups Organization

We use route groups to organize the two distinct integrations without affecting URL structure.

```
src/app/
├── layout.tsx                      # Root layout (Server Component)
├── page.tsx                        # Landing page (Server Component)
├── not-found.tsx                   # 404 page
├── error.tsx                       # Global error boundary
│
├── (chat-voice)/                   # Route group for White Library
│   ├── layout.tsx                  # Shared layout for chat pages
│   └── white-library/
│       ├── page.tsx                # /white-library (Client Component)
│       ├── loading.tsx             # Loading state
│       └── error.tsx               # Error boundary
│
├── (live-voice)/                   # Route group for Gemini Live
│   ├── layout.tsx                  # Shared layout for live voice
│   └── gemini-live/
│       ├── page.tsx                # /gemini-live (Client Component)
│       ├── loading.tsx             # Loading state
│       └── error.tsx               # Error boundary
│
└── api/                            # API routes
    ├── chat-webhook/
    │   └── route.ts                # POST /api/chat-webhook (White Library)
    └── health/
        └── route.ts                # GET /api/health (Health check)
```

### New Routes to Create

#### Route: `/white-library`

**File**: `src/app/(chat-voice)/white-library/page.tsx`
**Type**: Client Component (requires White Library UI)
**Purpose**: Chat-based voice agent page with White Library pre-built UI
**Dynamic**: No

**Layout Needed**: Yes
- File: `src/app/(chat-voice)/layout.tsx`
- Purpose: Shared layout for chat-based voice pages (header, navigation)

**Route Group**: `(chat-voice)`
**Why**: Organizes chat-based voice features separately from live voice, shared layout without URL pollution

**Component Type**: Client Component
**Why Client Component**:
- Uses White Library ChatPage component (third-party client library)
- Manages chat UI state
- Requires browser APIs for audio recording

**Data Flow**:
```
User types/records message
       ↓
White Library ChatPage (Client Component)
       ↓
HTTP POST to /api/chat-webhook
       ↓
Server Action processes request
       ↓
JSON response back to White Library
       ↓
White Library updates UI automatically
```

---

#### Route: `/gemini-live`

**File**: `src/app/(live-voice)/gemini-live/page.tsx`
**Type**: Client Component (requires WebSocket + Web Audio API)
**Purpose**: Real-time voice conversation with Gemini Live API
**Dynamic**: No

**Layout Needed**: Yes
- File: `src/app/(live-voice)/layout.tsx`
- Purpose: Shared layout for live voice pages

**Route Group**: `(live-voice)`
**Why**: Separates real-time voice features from chat-based, shared layout

**Component Type**: Client Component
**Why Client Component**:
- WebSocket connection (browser-only)
- Web Audio API for audio capture/playback
- Real-time state management
- MediaStream API for microphone access

**Data Flow**:
```
User speaks (microphone)
       ↓
Web Audio API capture (Client)
       ↓
Encode to Base64/PCM
       ↓
WebSocket send to Gemini Live API
       ↓
WebSocket receive streamed audio
       ↓
Decode and playback via Web Audio API
```

---

#### Route: `/` (Landing Page)

**File**: `src/app/page.tsx`
**Type**: Server Component
**Purpose**: Landing page with navigation to both integrations
**Dynamic**: No

**Component Type**: Server Component (default)
**Why Server Component**:
- Static content
- SEO important
- No interactivity needed
- Can add metadata easily

---

#### API Route: `/api/chat-webhook`

**File**: `src/app/api/chat-webhook/route.ts`
**Type**: Next.js Route Handler
**Purpose**: Webhook endpoint for White Library integration
**Methods**: POST

**Request Types**:
1. JSON (text messages)
2. multipart/form-data (audio messages)

**Response Format**:
```json
{
  "Part1": "First message bubble",
  "Part2": "Second message bubble"
}
```

**Error Handling**:
- 400: Invalid content type
- 500: Server processing error

---

#### API Route: `/api/health`

**File**: `src/app/api/health/route.ts`
**Type**: Next.js Route Handler
**Purpose**: Health check endpoint
**Methods**: GET

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T..."
}
```

---

### Existing Routes to Modify

#### Route: `/`
**File**: `src/app/page.tsx`
**Change**: Replace default Next.js landing with Voice Agent platform landing page

**New Content**:
- Hero section
- Feature cards for both integrations
- Navigation buttons to /white-library and /gemini-live

---

## 3. Server Component Architecture

### Root Layout (Server Component)

**File**: `src/app/layout.tsx`
**Component Type**: Server Component (NO "use client")

```typescript
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Voice Agent Platform',
  description: 'Dual voice agent integration with White Library and Gemini Live API',
  openGraph: {
    title: 'Voice Agent Platform',
    description: 'Chat-based and real-time voice AI integrations',
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Data Fetching**: None (static layout)
**Why Server Component**: SEO, metadata, no interactivity needed

---

### Landing Page (Server Component)

**File**: `src/app/page.tsx`
**Component Type**: Server Component (NO "use client")

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Voice Agent Platform
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Experience two powerful voice AI integrations
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* White Library Card */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">
            White Library Chat
          </h2>
          <p className="text-gray-600 mb-4">
            Chat-based voice agent with pre-built UI components
          </p>
          <ul className="mb-6 space-y-2">
            <li>- Text and voice messages</li>
            <li>- Built-in UI components</li>
            <li>- HTTP webhook integration</li>
          </ul>
          <Link href="/white-library">
            <Button>Try White Library</Button>
          </Link>
        </div>

        {/* Gemini Live Card */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">
            Gemini Live Voice
          </h2>
          <p className="text-gray-600 mb-4">
            Real-time voice conversations with Gemini Live API
          </p>
          <ul className="mb-6 space-y-2">
            <li>- Real-time streaming</li>
            <li>- Low latency conversations</li>
            <li>- WebSocket connection</li>
          </ul>
          <Link href="/gemini-live">
            <Button>Try Gemini Live</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Data Fetching**: None (static page)
**Why Server Component**: SEO, static content, no interactivity

---

## 4. Client Components Strategy

### White Library Page (Client Component)

**File**: `src/app/(chat-voice)/white-library/page.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { Suspense } from 'react';
import { WhiteChatContainer } from '@/domains/chat-agent/components/organisms/white-chat-container';
import { Skeleton } from '@/components/ui/skeleton';

export default function WhiteLibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        White Library Chat Agent
      </h1>

      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <WhiteChatContainer />
      </Suspense>
    </div>
  );
}
```

**Why Client Component**:
- Uses White Library ChatPage (third-party client component)
- Browser audio recording APIs
- State managed by White Library stores

**Domain Components Used**:
- `WhiteChatContainer` from `@/domains/chat-agent/components/organisms/`

---

### Gemini Live Page (Client Component)

**File**: `src/app/(live-voice)/gemini-live/page.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { Suspense } from 'react';
import { LiveVoiceSession } from '@/domains/live-voice-agent/components/organisms/live-voice-session';
import { Skeleton } from '@/components/ui/skeleton';

export default function GeminiLivePage() {
  // Get API key from environment (client-side safe)
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Gemini Live Voice Agent
      </h1>

      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <LiveVoiceSession apiKey={apiKey} />
      </Suspense>
    </div>
  );
}
```

**Why Client Component**:
- WebSocket connection (browser-only)
- Web Audio API (browser-only)
- MediaStream API for microphone
- Real-time state updates

**Domain Components Used**:
- `LiveVoiceSession` from `@/domains/live-voice-agent/components/organisms/`

---

## 5. Layouts and Templates

### Root Layout

**File**: `src/app/layout.tsx`
**Type**: Server Component
**Changes**: Update metadata for Voice Agent platform

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: 'Voice Agent Platform',
  description: 'Dual voice agent integration with White Library and Gemini Live API',
  keywords: ['voice ai', 'gemini', 'chat', 'real-time voice'],
  openGraph: {
    title: 'Voice Agent Platform',
    description: 'Chat-based and real-time voice AI integrations',
    type: 'website',
  }
};
```

---

### Chat Voice Layout

**File**: `src/app/(chat-voice)/layout.tsx`
**Type**: Server Component
**Purpose**: Shared layout for chat-based voice pages

```typescript
import { ReactNode } from 'react';
import Link from 'next/link';

export default function ChatVoiceLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Voice Agent Platform
          </Link>
          <nav className="flex gap-4">
            <Link href="/white-library" className="hover:underline">
              White Library
            </Link>
            <Link href="/gemini-live" className="hover:underline">
              Gemini Live
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-gray-50 py-4 text-center text-sm text-gray-600">
        Voice Agent Platform - Powered by White Library
      </footer>
    </div>
  );
}
```

---

### Live Voice Layout

**File**: `src/app/(live-voice)/layout.tsx`
**Type**: Server Component
**Purpose**: Shared layout for live voice pages

```typescript
import { ReactNode } from 'react';
import Link from 'next/link';

export default function LiveVoiceLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Voice Agent Platform
          </Link>
          <nav className="flex gap-4">
            <Link href="/white-library" className="hover:underline">
              White Library
            </Link>
            <Link href="/gemini-live" className="hover:underline">
              Gemini Live
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-gray-50 py-4 text-center text-sm text-gray-600">
        Voice Agent Platform - Powered by Gemini Live API
      </footer>
    </div>
  );
}
```

---

## 6. Loading and Error States

### White Library Loading State

**File**: `src/app/(chat-voice)/white-library/loading.tsx`
**Type**: Server Component

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export default function WhiteLibraryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="w-full h-[600px]" />
    </div>
  );
}
```

**When shown**: While page.tsx is loading (automatic with Suspense)

---

### White Library Error Boundary

**File**: `src/app/(chat-voice)/white-library/error.tsx`
**Type**: Client Component (MUST be)

```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function WhiteLibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('White Library page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6">
        Failed to load White Library chat agent.
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
```

---

### Gemini Live Loading State

**File**: `src/app/(live-voice)/gemini-live/loading.tsx`
**Type**: Server Component

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export default function GeminiLiveLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="w-full h-[600px]" />
    </div>
  );
}
```

---

### Gemini Live Error Boundary

**File**: `src/app/(live-voice)/gemini-live/error.tsx`
**Type**: Client Component (MUST be)

```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GeminiLiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Gemini Live page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6">
        Failed to load Gemini Live voice agent.
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
```

---

### Global Not Found Page

**File**: `src/app/not-found.tsx`
**Type**: Server Component

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
```

---

## 7. API Routes Implementation

### Chat Webhook Route Handler

**File**: `src/app/api/chat-webhook/route.ts`
**Type**: Next.js Route Handler
**Purpose**: Process White Library webhook requests

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  processChatMessage,
  processAudioMessage
} from '@/domains/chat-agent/actions';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');

    // Handle JSON text messages
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      const { message, sessionId, type } = body;

      // Validate required fields
      if (!message || !sessionId) {
        return NextResponse.json(
          { error: 'Missing required fields: message, sessionId' },
          { status: 400 }
        );
      }

      const response = await processChatMessage(message, sessionId);
      return NextResponse.json(response);
    }

    // Handle multipart/form-data audio messages
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const audioBlob = formData.get('audio') as Blob;
      const sessionId = formData.get('sessionId') as string;

      if (!audioBlob || !sessionId) {
        return NextResponse.json(
          { error: 'Missing required fields: audio, sessionId' },
          { status: 400 }
        );
      }

      const response = await processAudioMessage(audioBlob, sessionId);
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: 'Invalid content type. Expected application/json or multipart/form-data' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Method not allowed for GET, PUT, DELETE, etc.
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
```

**Request Validation**:
- Content-Type header check
- Required field validation
- Error handling with appropriate status codes

**Response Format**:
```json
{
  "Part1": "First response message",
  "Part2": "Second response message"
}
```

---

### Health Check Route

**File**: `src/app/api/health/route.ts`
**Type**: Next.js Route Handler
**Purpose**: Health check endpoint for monitoring

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'voice-agent-platform',
    integrations: {
      whiteLibrary: 'available',
      geminiLive: 'available'
    }
  });
}

export const dynamic = 'force-dynamic';
```

---

## 8. Middleware (Optional)

**File**: `src/middleware.ts`
**Purpose**: Request validation, API key checking (if needed)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS for API routes (if needed for external access)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Why Middleware**:
- Add security headers globally
- Enable CORS for API routes if needed
- Request logging (optional)

**Note**: Authentication not needed for this platform (public access)

---

## 9. Environment Variables

### Required Environment Variables

**File**: `.env.local` (create this file)

```bash
# Gemini Live API (for real-time voice)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: White Library webhook URL (if using remote processing)
# NEXT_PUBLIC_WHITE_LIBRARY_WEBHOOK_URL=/api/chat-webhook

# Optional: Development mode
NODE_ENV=development
```

**Security Considerations**:

1. **Client-side Variables** (NEXT_PUBLIC_*):
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Exposed to browser for WebSocket connection
   - Safe to expose because Gemini Live requires browser WebSocket connection
   - Consider domain restrictions in Gemini API Console

2. **Server-side Variables**:
   - Any sensitive keys for backend processing should NOT have NEXT_PUBLIC_ prefix
   - Only accessible in Server Components and API routes

**File**: `.env.example` (commit to repo)

```bash
# Copy this file to .env.local and fill in the values

# Gemini Live API Key (required for real-time voice)
NEXT_PUBLIC_GEMINI_API_KEY=

# Node environment
NODE_ENV=development
```

---

## 10. File Structure Summary

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (Server Component)
│   ├── page.tsx                            # Landing page (Server Component)
│   ├── not-found.tsx                       # 404 page (Server Component)
│   ├── error.tsx                           # Global error boundary (Client)
│   │
│   ├── (chat-voice)/                       # Route group for White Library
│   │   ├── layout.tsx                      # Chat layout (Server Component)
│   │   └── white-library/
│   │       ├── page.tsx                    # White Library page (Client)
│   │       ├── loading.tsx                 # Loading state
│   │       └── error.tsx                   # Error boundary (Client)
│   │
│   ├── (live-voice)/                       # Route group for Gemini Live
│   │   ├── layout.tsx                      # Live voice layout (Server)
│   │   └── gemini-live/
│   │       ├── page.tsx                    # Gemini Live page (Client)
│   │       ├── loading.tsx                 # Loading state
│   │       └── error.tsx                   # Error boundary (Client)
│   │
│   └── api/                                # API routes
│       ├── chat-webhook/
│       │   └── route.ts                    # White Library webhook
│       └── health/
│           └── route.ts                    # Health check
│
├── domains/                                # Business logic (created by domain architect)
│   ├── chat-agent/                         # White Library domain
│   │   ├── components/
│   │   │   └── organisms/
│   │   │       └── white-chat-container.tsx
│   │   ├── hooks/
│   │   │   └── use-chat-config.ts
│   │   └── actions.ts                      # Server Actions
│   │
│   └── live-voice-agent/                   # Gemini Live domain
│       ├── components/
│       │   └── organisms/
│       │       └── live-voice-session.tsx
│       ├── hooks/
│       │   ├── use-gemini-live.ts
│       │   └── use-audio-stream.ts
│       ├── services/
│       │   ├── websocket-client.ts
│       │   └── audio-processor.ts
│       ├── stores/
│       │   └── voice-session-store.ts
│       └── types.ts
│
├── components/                             # Reusable UI components
│   ├── ui/                                 # shadcn components
│   │   ├── button.tsx
│   │   └── skeleton.tsx
│   └── layout/
│       └── navigation.tsx
│
├── lib/
│   └── utils.ts
│
└── middleware.ts                           # Global middleware
```

---

## 11. Component Architecture Decision Tree

### When to Use Server Component vs Client Component

**Server Component (default)**:
- Landing page (/)
- Layouts
- Loading states
- Static content pages
- SEO-critical pages

**Client Component (only when necessary)**:
- White Library page (/white-library) - uses third-party client library
- Gemini Live page (/gemini-live) - uses WebSocket + Web Audio API
- Error boundaries (required by Next.js)
- Components using browser APIs
- Components with user interaction state

**Rule of Thumb**:
- Start with Server Component
- Add "use client" ONLY when you need:
  - Browser APIs (WebSocket, Web Audio, MediaStream)
  - Third-party client libraries
  - useState, useEffect, event handlers

---

## 12. Data Fetching Strategy

### Server Component Fetch (White Library Webhook)

**Server Action** (not direct fetch in component):

```typescript
// domains/chat-agent/actions.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processChatMessage(message: string, sessionId: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // White Library format: multiple fields = multiple messages
    return {
      Response: text,
    };
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      Error: 'Failed to process your message. Please try again.',
    };
  }
}

export async function processAudioMessage(audioBlob: Blob, sessionId: string) {
  try {
    // Convert OGG to text (speech-to-text)
    // This would use a speech-to-text service
    const transcription = 'User audio transcription here';

    // Process with AI
    const response = await processChatMessage(transcription, sessionId);

    return {
      Transcription: transcription,
      ...response,
    };
  } catch (error) {
    console.error('Error processing audio message:', error);
    return {
      Error: 'Failed to process audio. Please try again.',
    };
  }
}
```

**Cache Strategy**: `no-store` (dynamic, real-time responses)

---

### Client Component State (Gemini Live)

**Custom Hook** with WebSocket:

```typescript
// domains/live-voice-agent/hooks/use-gemini-live.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import { GeminiLiveWebSocketClient } from '../services/websocket-client';
import { AudioProcessor } from '../services/audio-processor';

export function useGeminiLive(apiKey: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const wsClient = useRef<GeminiLiveWebSocketClient | null>(null);
  const audioProcessor = useRef<AudioProcessor | null>(null);

  const connect = useCallback(async () => {
    wsClient.current = new GeminiLiveWebSocketClient(apiKey);
    audioProcessor.current = new AudioProcessor();

    wsClient.current.onAudioReceived = async (audioData) => {
      await audioProcessor.current?.playAudio(audioData);
    };

    await wsClient.current.connect();
    setIsConnected(true);
  }, [apiKey]);

  // More methods...

  return {
    isConnected,
    isCapturing,
    connect,
    // ...
  };
}
```

**Why Custom Hook**:
- Encapsulates complex WebSocket + Audio logic
- Reusable across components
- Separates concerns (hook orchestrates services)

---

## 13. Build and Deployment Considerations

### WebSocket Support Requirements

**Deployment Platforms**:

1. **Vercel** (Recommended):
   - Native WebSocket support
   - No additional configuration needed
   - Automatic HTTPS (required for microphone access)

2. **Netlify**:
   - WebSocket support via proxy
   - Requires `_redirects` configuration

3. **Self-hosted (Docker)**:
   - Ensure reverse proxy supports WebSocket (nginx, traefik)
   - Enable `Upgrade` and `Connection` headers

**Important**:
- Gemini Live WebSocket connection is CLIENT-TO-GEMINI (not through your server)
- White Library sends HTTP POST to your API route (standard Next.js support)

---

### Build Configuration

**File**: `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable experimental features if needed
  experimental: {
    // Add any experimental features
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### Environment-Specific Configuration

**Development** (.env.local):
```bash
NODE_ENV=development
NEXT_PUBLIC_GEMINI_API_KEY=your_dev_key
```

**Production** (set in deployment platform):
```bash
NODE_ENV=production
NEXT_PUBLIC_GEMINI_API_KEY=your_prod_key
```

**Deployment Checklist**:
- [ ] Set NEXT_PUBLIC_GEMINI_API_KEY in production environment
- [ ] Enable HTTPS (required for microphone access)
- [ ] Configure CORS headers if needed
- [ ] Test WebSocket connection in production
- [ ] Verify White Library webhook endpoint is accessible

---

### Performance Optimizations

**1. Code Splitting** (automatic):
- Client Components are automatically code-split
- White Library and Gemini Live are separate bundles

**2. Dynamic Imports** (if bundles are large):

```typescript
// app/(chat-voice)/white-library/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const WhiteChatContainer = dynamic(
  () => import('@/domains/chat-agent/components/organisms/white-chat-container')
    .then(mod => ({ default: mod.WhiteChatContainer })),
  {
    loading: () => <Skeleton className="w-full h-[600px]" />,
    ssr: false, // Disable SSR for client-only component
  }
);

export default function WhiteLibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">White Library Chat Agent</h1>
      <WhiteChatContainer />
    </div>
  );
}
```

**3. Image Optimization** (built-in):
- Use Next.js Image component for all images
- Automatic lazy loading

**4. Caching Strategy**:
- Landing page: Static (force-cache)
- API webhook: Dynamic (no-store)
- Layouts: Static when possible

---

## 14. Security Considerations

### API Key Security

**Client-side API Key** (NEXT_PUBLIC_GEMINI_API_KEY):
- **Exposed to browser** (necessary for WebSocket connection)
- **Mitigation**:
  1. Enable domain restrictions in Google Cloud Console
  2. Restrict API key to only Gemini Live API
  3. Set usage quotas to prevent abuse
  4. Monitor API usage regularly

**Alternative** (if API key exposure is unacceptable):
- Create proxy API route for WebSocket
- Server establishes WebSocket to Gemini
- Client connects to your server via WebSocket
- Server forwards messages between client and Gemini

**Example Proxy Architecture** (if needed):
```
Client (browser)
    ↓ WebSocket
Your Next.js API Route
    ↓ WebSocket (with API key)
Gemini Live API
```

---

### HTTPS Requirement

**Critical**: Microphone access requires HTTPS in production

**Development**:
- localhost works with HTTP
- Use `npm run dev` normally

**Production**:
- MUST deploy with HTTPS
- Vercel provides automatic HTTPS
- Self-hosted: configure SSL certificate

---

### Content Security Policy (CSP)

**File**: `src/middleware.ts`

Add CSP headers for additional security:

```typescript
response.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src 'self' wss://generativelanguage.googleapis.com; " +
  "media-src 'self' blob:; "
);
```

---

## 15. Testing Strategy

### Unit Tests (Jest + Testing Library)

**Test Server Actions**:
```typescript
// domains/chat-agent/__tests__/actions.test.ts
import { processChatMessage } from '../actions';

describe('processChatMessage', () => {
  it('should return response from AI', async () => {
    const result = await processChatMessage('Hello', 'session-123');
    expect(result).toHaveProperty('Response');
  });
});
```

**Test API Routes**:
```typescript
// app/api/chat-webhook/__tests__/route.test.ts
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/chat-webhook', () => {
  it('should return 400 for invalid content type', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat-webhook', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

---

## 16. Monitoring and Logging

### Error Tracking

**Integration with Sentry** (optional):

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

**Logging Strategy**:
- Console logs in development
- Structured logging in production
- Error tracking with Sentry (optional)

---

## 17. Important Notes

### Critical Requirements

1. **Server Components by Default**:
   - Only 2 pages need "use client": /white-library and /gemini-live
   - All layouts, loading states, and landing page are Server Components

2. **Suspense Boundaries**:
   - Wrap async components in Suspense
   - Provide meaningful loading fallbacks

3. **White Library Integration**:
   - Webhook must respond with multi-field JSON
   - Audio is sent as OGG Blob via multipart/form-data
   - Session management handled by White Library

4. **Gemini Live Integration**:
   - WebSocket connection is CLIENT-TO-GEMINI (not proxied)
   - API key exposed to browser (mitigate with domain restrictions)
   - Audio format: PCM 16kHz mono

5. **Route Groups**:
   - `(chat-voice)` and `(live-voice)` are organizational only
   - Do NOT appear in URL
   - Allow separate layouts without affecting routes

6. **Metadata for SEO**:
   - Add metadata to all public pages
   - Use generateMetadata for dynamic pages

---

## 18. Coordination with Other Agents

### Domain Architect

**Expects from Domain Architect**:
- `domains/chat-agent/` structure
  - Server Actions: processChatMessage, processAudioMessage
  - Hooks: use-chat-config
  - Components: WhiteChatContainer
  - Types: ChatMessage, ChatSession

- `domains/live-voice-agent/` structure
  - Services: GeminiLiveWebSocketClient, AudioProcessor
  - Hooks: useGeminiLive, useAudioStream
  - Components: LiveVoiceSession
  - Stores: useVoiceSessionStore
  - Types: VoiceSession, AudioChunk

**Provides to Domain Architect**:
- API route structure
- Page component requirements
- Environment variable needs

---

### UX Designer

**Expects from UX Designer**:
- Landing page design
- Layout design for both integrations
- Loading states design
- Error states design

**Provides to UX Designer**:
- Route structure
- Component hierarchy
- Integration requirements

---

### shadcn Builder

**Expects from shadcn Builder**:
- Button component
- Skeleton component
- Card component (for landing page)
- Input component (if needed)

**Provides to shadcn Builder**:
- Component usage requirements
- Styling constraints

---

## 19. Implementation Steps

### Phase 1: Basic Structure
1. Create route groups and layouts
2. Create landing page
3. Add loading and error states
4. Create not-found page
5. Update root layout metadata

### Phase 2: API Routes
1. Create /api/chat-webhook/route.ts
2. Create /api/health/route.ts
3. Add error handling
4. Add validation

### Phase 3: White Library Integration
1. Create White Library page (client component)
2. Domain architect creates chat-agent domain
3. Test webhook endpoint
4. Test audio processing

### Phase 4: Gemini Live Integration
1. Create Gemini Live page (client component)
2. Domain architect creates live-voice-agent domain
3. Test WebSocket connection
4. Test audio capture and playback

### Phase 5: Polish
1. Add middleware for security headers
2. Configure environment variables
3. Test all routes
4. Add metadata for SEO
5. Performance optimization

---

## 20. Deployment Checklist

Before deploying to production:

- [ ] Environment variables set in deployment platform
- [ ] HTTPS enabled (required for microphone)
- [ ] Gemini API key configured with domain restrictions
- [ ] CORS headers configured if needed
- [ ] Error tracking enabled (optional)
- [ ] Test WebSocket connection in production
- [ ] Test White Library webhook in production
- [ ] Verify loading and error states work
- [ ] Test on mobile devices
- [ ] Check SEO metadata
- [ ] Performance audit with Lighthouse

---

## Summary

This Next.js architecture plan provides:

- **Clear separation** between White Library (chat) and Gemini Live (real-time voice)
- **Optimal use of Server Components** (default) and Client Components (only when necessary)
- **Route groups** for clean organization without URL pollution
- **API routes** for White Library webhook integration
- **Environment variable strategy** for API key management
- **Error handling** at all levels (global, page, component)
- **Loading states** for better UX
- **Security considerations** for API key exposure
- **Deployment guidance** for WebSocket support

Next steps: Domain Architect creates business logic domains, UX Designer creates component designs, shadcn Builder selects UI components.
