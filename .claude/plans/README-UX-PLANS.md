# UX/UI Design Plans - Gemini Live Voice Agent

This directory contains comprehensive UX/UI design documentation for the enhanced Gemini Live voice agent feature.

## Documents

### 1. Main UX/UI Design Plan
**File**: `ux-gemini-live-conversations-plan.md`

Comprehensive design plan including:
- User context and personas
- User journeys and flows
- Interface architecture
- Component breakdown (Atomic Design)
- Content strategy and text maps
- Accessibility specifications (WCAG AA)
- Responsive design for all breakpoints
- Interaction patterns and micro-interactions
- Implementation coordination
- Success metrics

### 2. Visual Wireframes & Mockups
**File**: `ux-gemini-live-wireframes.md`

Detailed visual documentation including:
- ASCII wireframes for all pages/states
- Component hierarchy visualizations
- Interaction state diagrams
- Responsive breakpoint comparisons
- Accessibility feature demonstrations
- Color and theming specifications
- Animation specifications with CSS

## Feature Overview

**Two Main Pages**:

1. **Conversations List (Home)**
   - Browse past conversation history
   - Create new conversations
   - Delete unwanted conversations
   - Empty state for first-time users

2. **Active Conversation**
   - Real-time voice interaction with Gemini AI
   - Live transcription display (user + assistant)
   - Mute button (toggle mic without disconnecting)
   - Exit/disconnect button
   - Audio visualizer for feedback
   - Connection status indicator

## Key Design Principles

- **User-First**: All decisions driven by user needs
- **Accessibility Mandatory**: WCAG 2.1 AA minimum (AAA where possible)
- **Mobile-First**: Design for smallest screen first, scale up
- **Performance**: Consider UX impact of all interactions
- **Consistency**: Follow established patterns in codebase

## Next Steps for Implementation

### Phase 1: Foundation
1. Create text map (`live-voice-agent.text-map.ts`)
2. Set up data repositories (conversations, messages)
3. Build atomic components (message-bubble, timestamp-badge, empty-state)

### Phase 2: Core Features
4. Build conversation list organism
5. Build active conversation organism
6. Wire up WebSocket integration
7. Implement real-time transcription

### Phase 3: Polish
8. Add mute/unmute functionality
9. Implement conversation persistence
10. Add delete functionality
11. Refine animations and transitions

### Phase 4: Accessibility & Testing
12. Keyboard navigation testing
13. Screen reader testing
14. Visual accessibility audit
15. Cross-device testing

## Collaboration Required

### shadcn-builder Agent
- Verify shadcn/ui components available (Card, Button, Badge, Separator, Sonner)
- Confirm component variants needed
- Check toast action button support

### domain-architect Agent
- Design conversation and message entities
- Create repository pattern for data access
- Define schema validation (Zod)
- Determine persistence strategy (IndexedDB vs server-side)

### Parent Agent
- Execute implementation step-by-step
- Coordinate between specialized agents
- Ensure architectural constraints followed

## Files to be Created

### Components (Atomic Design)
```
src/domains/live-voice-agent/components/
├── atoms/
│   ├── message-bubble.tsx (NEW)
│   ├── timestamp-badge.tsx (NEW)
│   └── empty-state.tsx (NEW)
├── molecules/
│   ├── conversation-card.tsx (NEW)
│   ├── conversation-header.tsx (NEW)
│   └── transcription-display.tsx (NEW)
└── organisms/
    ├── conversations-list.tsx (NEW)
    └── active-conversation-view.tsx (NEW - refactor from live-voice-session.tsx)
```

### Text Maps
```
src/domains/live-voice-agent/
└── live-voice-agent.text-map.ts (NEW)
```

### Data Layer
```
src/domains/live-voice-agent/
├── repositories/
│   ├── conversation-repository.ts (NEW)
│   └── message-repository.ts (NEW)
└── schemas/
    ├── conversation-schema.ts (NEW)
    └── message-schema.ts (NEW)
```

### Pages (Next.js App Router)
```
src/app/(voice)/
├── layout.tsx (NEW)
├── conversations/
│   └── page.tsx (NEW)
└── conversation/
    └── [id]/
        └── page.tsx (NEW)
```

### Styles
```
src/styles/domains/live-voice-agent/
├── conversations-list.css (NEW)
├── active-conversation.css (NEW)
└── message-bubble.css (NEW)
```

## Success Criteria

**Usability**:
- > 95% can start new conversation without help
- > 90% can resume past conversation
- > 98% can mute/unmute during conversation

**Accessibility**:
- 100% keyboard-navigable
- 100% WCAG AA compliant
- Screen reader comprehension > 90%

**Performance**:
- Conversations List load < 2s on 3G
- Mute button response < 100ms
- Transcription lag < 300ms

## Questions for Clarification

1. **Data Persistence**: Client-only (IndexedDB) or server-side with auth?
2. **Authentication**: Required for saving conversations?
3. **Retention Policy**: How long to keep conversations?
4. **Multi-device Sync**: Future consideration or MVP scope?

---

**Design Complete** - Ready for implementation coordination!
