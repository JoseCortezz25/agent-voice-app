# Session Context: White Library Integration (Chat Agent)

**Session ID**: white_library
**Created**: 2025-11-19
**Type**: Feature Implementation
**Status**: In Progress

---

## Session Goal

Implement White Library integration for chat-based voice agent following the domain architecture plan defined in `.claude/plans/domain-architecture_voice-agent.md` (Section 3).

---

## Implementation Scope

### Domain: chat-agent

**Pattern**: HTTP webhook with White Library pre-built UI
**Integration**: White Library React component + Server Action webhook + Gemini API

### Key Features

1. Text-based chat with AI (Gemini API)
2. Voice message recording and playback
3. Audio transcription (speech-to-text)
4. Session persistence
5. White Library UI theming and configuration

---

## Phase 1: Foundation Setup

**Tasks**:
- [x] Create session context file
- [ ] Install white-library npm package
- [ ] Create domain directory structure: `src/domains/chat-agent/`
- [ ] Define TypeScript types (`types.ts`)
- [ ] Create Zod validation schemas (`schema.ts`)
- [ ] Create custom error classes (`errors.ts`)

---

## Phase 2: Core Implementation

**Tasks**:
- [ ] Implement Gemini service for text processing (`services/gemini-service.ts`)
- [ ] Create Server Actions for webhook handlers (`actions.ts`)
- [ ] Implement custom hooks:
  - `hooks/use-chat-config.ts` - White Library configuration
  - `hooks/use-chat-session.ts` - Session management
- [ ] Create Zustand store for UI state (`stores/chat-ui-store.ts`)

---

## Phase 3: UI Components

**Tasks**:
- [ ] Create White Library wrapper component (`components/organisms/white-chat-container.tsx`)
- [ ] Create chat indicator atom (`components/atoms/chat-indicator.tsx`)
- [ ] Create Next.js page route (`app/(chat-agent)/chat/page.tsx`)

---

## Phase 4: Integration

**Tasks**:
- [ ] Create API webhook route (`app/api/chat-webhook/route.ts`)
- [ ] Test end-to-end flow
- [ ] Add error handling and generic error messages
- [ ] Update documentation

---

## Technical Decisions

### White Library Configuration

**Webhook URL**: `/api/chat-webhook?sessionId={id}&userId={userId}`
**Response Format**: Multiple fields = multiple messages in White Library
```json
{
  "Part1": "First response message",
  "Part2": "Second response message"
}
```

### State Management Strategy

- **White Library**: Manages its own message state and UI
- **Zustand**: Only for app UI state (theme, fullscreen, selected session)
- **React Query**: For fetching session history (server state)
- **Server Actions**: All mutations (create session, process message)

### No Auth Implementation

Per user request: "No es encesario usuarios ni auth"
- Remove all auth checks from Server Actions
- Remove user validation
- Session ownership not enforced (single-user app)

---

## Key Constraints Applied

1. ✅ **No hardcoded strings**: All text externalized to configuration
2. ✅ **Zod validation**: All inputs validated
3. ✅ **Server Actions**: All mutations via Server Actions
4. ✅ **Generic error messages**: Never expose technical errors to UI
5. ✅ **Atomic Design**: Components follow atoms/molecules/organisms structure

---

## Dependencies

### External
- `white-library` - Chat UI component library
- `@google/generative-ai` - Gemini SDK (already installed)
- `zustand` - State management (already installed)

### Internal
- Gemini API key from environment variable
- Error mapping utility pattern (reuse from live-voice-agent)

---

## Progress Log

### 2025-11-19 - Session Started
- Created session context file
- Reviewed domain architecture plan
- Prepared implementation checklist

---

## Next Steps

1. Install white-library package
2. Create domain directory structure
3. Define types and schemas
4. Implement Server Actions for webhook handling

---

## References

- Plan: `.claude/plans/domain-architecture_voice-agent.md` (Section 3, lines 73-616)
- Business Rules: `.claude/knowledge/business-rules.md` (BR-CA-001 to BR-CA-014)
- Architecture Patterns: `.claude/knowledge/architecture-patterns.md` (Section 8)
