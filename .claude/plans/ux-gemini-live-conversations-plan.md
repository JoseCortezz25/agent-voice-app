# Gemini Live Voice Agent - UX/UI Design Plan

**Created**: 2025-11-21
**Session**: N/A (Direct request)
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### User Goals
- **Primary Goal**: Engage in natural voice conversations with Gemini AI assistant across multiple sessions
- **Secondary Goals**:
  - Review past conversation history
  - Understand what is being said in real-time (transcription)
  - Manage and organize multiple conversation sessions
  - Know when the system is listening, processing, or speaking
- **Success Criteria**:
  - Users can seamlessly start, pause, and end voice conversations
  - Users can navigate between conversation list and active sessions without losing context
  - Real-time feedback makes users feel confident the system is working
  - Conversation history persists and is easily accessible

### User Personas
- **Primary**: Individuals seeking hands-free AI assistance
- **Context**: Using voice for brainstorming, learning, conversation practice, or getting information while multitasking
- **Pain Points**:
  - Uncertainty about whether the system is listening
  - Loss of conversation history between sessions
  - No visual feedback during audio-only interaction
  - Unclear when to speak vs when to wait

### User Journey

**Journey 1: Starting a New Conversation**
1. Home page (Conversations List) → Click "New Conversation" → Active Conversation page loads
2. Active Conversation → Click "Connect" button → WebSocket establishes → Status shows "Connected"
3. Connected state → Click/tap microphone button → Begin speaking → See real-time transcription
4. Assistant responds → See assistant's response in transcript → Audio plays with visualizer
5. Conversation continues → Click "Disconnect" → Return to Home with conversation saved

**Journey 2: Resuming Past Conversation**
1. Home page → Browse conversation list → Click on past conversation
2. Active Conversation loads → See previous message history → Click "Connect" to resume
3. Continue conversation as in Journey 1

**Journey 3: Managing Conversations**
1. Home page → See list of conversations with metadata
2. Identify unwanted conversation → Click delete icon → Confirm → Conversation removed
3. Sort/filter conversations by date → Find specific conversation

## 2. Interface Architecture

### Information Hierarchy

**Page 1 - Conversations List (Home)**
1. **Primary**: List of conversations (most recent first)
2. **Secondary**: New conversation action (prominent CTA)
3. **Tertiary**: Page header, empty state messaging

**Page 2 - Active Conversation**
1. **Primary**: Live transcription display (user + assistant messages)
2. **Secondary**: Voice control buttons (mute, disconnect)
3. **Tertiary**: Connection status, audio visualizer, session metadata

### Layout Strategy

**Page 1 - Conversations List**
- **Structure**: Full page with header + scrollable list
- **Grid**: Single column on mobile, potential 2-column on large desktop
- **Spacing**: Comfortable (allows easy touch targets)
- **Breakpoints**:
  - Mobile (< 640px): Single column, full-width cards, bottom sticky FAB for "New Conversation"
  - Tablet (640px - 1024px): Single column with more padding, conversation cards slightly wider
  - Desktop (> 1024px): Centered container (max-width: 768px), larger touch targets

**Page 2 - Active Conversation**
- **Structure**: Fixed header (controls) + scrollable message area + fixed footer
- **Grid**: Flexbox vertical layout
- **Spacing**: Compact for messages, spacious for controls
- **Breakpoints**:
  - Mobile (< 640px): Full-screen experience, controls at bottom, compact message bubbles
  - Tablet (640px - 1024px): Similar layout with more breathing room
  - Desktop (> 1024px): Centered card (max-width: 896px), larger control buttons

### Visual Hierarchy
- **Focal Point**:
  - Home: "New Conversation" button + most recent conversation
  - Active: Voice control buttons (mic/mute/disconnect)
- **Visual Flow**:
  - Home: Top-to-bottom (header → action → list)
  - Active: Bottom-to-top (controls → messages scroll up)
- **Grouping**:
  - Conversations grouped by visual cards
  - Messages grouped by role (user vs assistant)
  - Controls grouped in fixed panel
- **Contrast**:
  - User messages vs assistant messages (subtle background difference)
  - Active state vs inactive state (color + animation)
  - Primary actions (mute/disconnect) vs secondary info

## 3. Interaction Design

### Primary Actions

**Page 1 - Conversations List**
- **Action**: "New Conversation"
  - **Type**: Primary
  - **Location**: Top-right on desktop, bottom-right FAB on mobile
  - **State**:
    - Default: Primary color, elevated shadow
    - Hover: Slightly larger scale (1.02x), deeper shadow
    - Active: Scale down (0.98x)
    - Disabled: N/A (always enabled)
  - **Feedback**: Navigation to Active Conversation page

- **Action**: "Delete Conversation"
  - **Type**: Tertiary (destructive)
  - **Location**: Right side of each conversation card
  - **State**:
    - Default: Ghost button with destructive color (red)
    - Hover: Background appears with destructive tint
    - Active: Deeper destructive color
    - Disabled: N/A
  - **Feedback**: Confirmation dialog → Remove from list with slide-out animation

**Page 2 - Active Conversation**
- **Action**: "Connect" (initial)
  - **Type**: Primary
  - **Location**: Center of screen when disconnected
  - **State**:
    - Default: Large primary button
    - Hover: Glow effect
    - Active: Loading spinner inside button
    - Disabled: While connecting (shows spinner)
  - **Feedback**: WebSocket connection → Status updates → UI transitions to voice controls

- **Action**: "Mute/Unmute Microphone"
  - **Type**: Primary
  - **Location**: Center-bottom of screen (main control)
  - **State**:
    - Default (Unmuted): Primary color, microphone icon, pulsing ring
    - Hover: Slight scale up (1.05x)
    - Active (Muted): Destructive color, muted icon, no pulse
    - Disabled: Grayed out when not connected
  - **Feedback**:
    - Unmuted → Real-time transcription appears, visualizer animates
    - Muted → Transcription pauses, visualizer stops

- **Action**: "Disconnect/Exit"
  - **Type**: Secondary (destructive)
  - **Location**: Top-right corner
  - **State**:
    - Default: Ghost/outline button
    - Hover: Background appears
    - Active: Deeper color
    - Disabled: N/A
  - **Feedback**: Disconnects WebSocket → Saves conversation → Returns to Home

### Secondary Actions
- **Action**: "Resume Conversation" (from Home)
  - **Type**: Secondary
  - **Location**: Click anywhere on conversation card
  - **Feedback**: Navigate to Active Conversation with history loaded

- **Action**: "Scroll to Latest" (in Active Conversation)
  - **Type**: Tertiary
  - **Location**: Bottom-right when scrolled up
  - **Feedback**: Smooth scroll to most recent message

### Micro-interactions

**Hover Effects**:
- Conversation cards: Subtle elevation increase (shadow from 2 → 4)
- Buttons: Scale transform (1.02x) + shadow deepens
- Delete icon: Color transitions to destructive red

**Focus States**:
- Visible 2px outline in primary color
- Tab order: New Conversation → Conversation cards (top to bottom) → Delete buttons
- Active Conversation tab order: Connect → Mute → Disconnect → Scroll area → Scroll to bottom

**Loading States**:
- Initial page load: Skeleton cards for conversations
- WebSocket connecting: Spinner inside Connect button
- Message sending: Optimistic UI (message appears immediately with loading indicator)
- Assistant responding: Typing indicator with animated dots

**Transitions**:
- Page navigation: Fade (150ms) + slight slide up (200ms)
- Message appearance: Slide up (200ms) + fade in (150ms)
- Delete animation: Slide right (300ms) + fade out (200ms)
- Mute toggle: Color transition (200ms) + icon morph (150ms)

**Success/Error**:
- Connection success: Green badge on status + brief check icon animation
- Connection error: Red badge on status + error toast (bottom-center)
- Message sent: Brief checkmark in message bubble
- Deletion success: Toast notification (2s duration)

### User Input

**Voice Input** (Primary):
- **Input Type**: Audio stream (browser MediaRecorder API)
- **Validation**: Permission check on first use
- **Error Messages**:
  - "Microphone access denied. Please allow microphone permissions."
  - "No microphone found. Please connect a microphone."
- **Placeholder/Helper**: "Tap the microphone to start speaking" (when disconnected)

**Text Input** (Future consideration):
- **Input Type**: Text field (fallback for accessibility)
- **Validation**: On submit (non-empty)
- **Error Messages**: "Message cannot be empty"
- **Placeholder/Helper**: "Type your message..." (if implemented)

## 4. Component Selection

### shadcn/ui Components Needed

**Page 1 - Conversations List**:
- **Card**: Conversation list items with hover/focus states
- **Button**: "New Conversation" CTA, delete actions
- **Badge**: Date/time indicators, message count
- **Separator**: Between conversation groups (if grouped by date)

**Page 2 - Active Conversation**:
- **Card**: Container for entire conversation view
- **Button**: Connect, Disconnect, Mute controls
- **Separator**: Visual dividers in UI
- **Sonner (toast)**: Error messages, success confirmations

**Shared**:
- **Button**: All interactive actions
- **Badge**: Status indicators (connected, disconnected, error)

**Note**: Coordinate with shadcn-builder agent for these existing components. Verify all are already installed via components.json.

### Custom Components Needed

**Atoms** (in `/domains/live-voice-agent/components/atoms/`):
- **mic-button.tsx**: Already exists ✅
- **audio-visualizer.tsx**: Already exists ✅
- **connection-status.tsx**: Already exists ✅
- **message-bubble.tsx**: NEW - Display individual message with role indicator
- **timestamp-badge.tsx**: NEW - Display formatted timestamps
- **empty-state.tsx**: NEW - Show when no conversations exist

**Molecules** (in `/domains/live-voice-agent/components/molecules/`):
- **voice-controls.tsx**: Already exists ✅ (may need enhancement)
- **conversation-card.tsx**: NEW - Individual conversation item in list
- **conversation-header.tsx**: NEW - Header with connection status + disconnect
- **message-group.tsx**: NEW - Group messages by role with timestamp
- **transcription-display.tsx**: NEW - Real-time scrolling transcript area

**Organisms** (in `/domains/live-voice-agent/components/organisms/`):
- **live-voice-session.tsx**: Already exists ✅ (needs major refactor)
- **conversations-list.tsx**: NEW - Full page component with list + empty state
- **active-conversation-view.tsx**: NEW - Full conversation interface with controls

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/domains/live-voice-agent/live-voice-agent.text-map.ts` (NEW FILE)

**Keys to Define**:

**Headings**:
- `conversationsList.title`: "Your Conversations"
- `activeConversation.title`: "Gemini Live Voice"
- `emptyState.title`: "No conversations yet"

**Body**:
- `conversationsList.description`: "Continue a previous conversation or start a new one"
- `emptyState.description`: "Start your first voice conversation with Gemini AI assistant"
- `activeConversation.disconnected`: "Connect to Gemini Live API to start a voice conversation"
- `transcription.userSpeaking`: "You said..."
- `transcription.assistantSpeaking`: "Gemini responded..."

**Actions**:
- `actions.newConversation`: "New Conversation"
- `actions.connect`: "Connect"
- `actions.disconnect`: "Disconnect"
- `actions.mute`: "Mute"
- `actions.unmute`: "Unmute"
- `actions.delete`: "Delete"
- `actions.cancel`: "Cancel"
- `actions.confirm`: "Confirm"

**Feedback**:
- `feedback.connected`: "Connected to Gemini Live"
- `feedback.disconnected`: "Disconnected from Gemini Live"
- `feedback.connectionFailed`: "Failed to connect. Please try again."
- `feedback.conversationDeleted`: "Conversation deleted"
- `feedback.micPermissionDenied`: "Microphone access denied. Please allow microphone permissions in your browser settings."
- `feedback.micNotFound`: "No microphone found. Please connect a microphone and try again."

**Placeholders**:
- `placeholders.searchConversations`: "Search conversations..." (future)
- `placeholders.tapToSpeak`: "Tap the microphone to start speaking"

**Help Text**:
- `help.connectionStatus.connected`: "Connected and ready"
- `help.connectionStatus.connecting`: "Establishing connection..."
- `help.connectionStatus.disconnected`: "Not connected"
- `help.connectionStatus.error`: "Connection error"
- `help.muteButton`: "Toggle microphone on/off without disconnecting"
- `help.disconnectButton`: "End session and return to conversations list"

**Confirmation Dialogs**:
- `confirmations.deleteConversation.title`: "Delete conversation?"
- `confirmations.deleteConversation.description`: "This action cannot be undone. The conversation history will be permanently deleted."

**Tone**: Friendly, conversational, encouraging
**Voice**: Active voice, 2nd person ("You said...", "Start speaking")

### Microcopy

**Empty States**:
- Conversations List (no conversations): "You haven't started any conversations yet. Tap 'New Conversation' to begin chatting with Gemini AI."
- Active Conversation (not connected): "Ready to chat? Click 'Connect' to start your conversation with Gemini."

**Error States**:
- WebSocket connection failed: "We couldn't connect to Gemini. Please check your internet connection and try again."
- Microphone error: "We couldn't access your microphone. Make sure you've allowed microphone permissions."
- Session expired: "Your session has expired. Please reconnect to continue."

**Success States**:
- Connection established: "You're connected! Start speaking to chat with Gemini."
- Conversation saved: "Your conversation has been saved."
- Message sent: ✓ (checkmark in bubble)

**Loading States**:
- Connecting: "Connecting to Gemini..."
- Loading conversations: "Loading your conversations..."
- Assistant thinking: "Gemini is thinking..." (typing indicator)

## 6. Accessibility Design

### Semantic Structure

**Page 1 - Conversations List**:
- **Landmarks**:
  - `<header>`: Page title and description
  - `<main>`: Conversation list
  - `<nav>`: If pagination or filtering added
- **Headings**:
  - `h1`: "Your Conversations"
  - `h2`: Individual conversation titles (truncated first message)
- **Lists**:
  - `<ul>` for conversation list
  - `<li>` for each conversation card

**Page 2 - Active Conversation**:
- **Landmarks**:
  - `<header>`: Connection status + controls
  - `<main>`: Message transcript area
  - `<footer>`: Voice controls (mute/disconnect)
- **Headings**:
  - `h1`: "Gemini Live Voice"
  - Hidden heading for transcript: "Conversation Transcript"
- **Lists**:
  - `<ol>` for message list (ordered by time)
  - `<li>` for each message

### Keyboard Navigation

**Page 1 - Conversations List**:
- **Tab Order**:
  1. "New Conversation" button
  2. First conversation card
  3. Delete button for first conversation
  4. Second conversation card
  5. Delete button for second conversation
  6. (Continue pattern)
- **Shortcuts**:
  - `Enter/Space` on conversation card: Open conversation
  - `Enter/Space` on delete: Trigger delete confirmation
  - `Escape`: Close confirmation dialog
- **Focus Management**: After deleting, focus moves to next conversation in list (or "New Conversation" if list becomes empty)

**Page 2 - Active Conversation**:
- **Tab Order**:
  1. Disconnect button (top-right)
  2. Mute/Unmute button (center)
  3. Message transcript area (scrollable, can focus for screen reader)
  4. "Scroll to bottom" button (if visible)
- **Shortcuts**:
  - `Space`: Toggle mute/unmute when mute button focused
  - `Escape`: Disconnect and return to home
  - `Ctrl/Cmd + Enter`: Submit message (if text input added)
- **Focus Management**:
  - On page load: Focus on "Connect" button
  - After connecting: Focus on "Mute" button
  - After disconnecting: Return to conversations list with focus on this conversation
- **Escape Hatch**: Disconnect button always accessible via keyboard

### Screen Reader Experience

**ARIA Labels**:
- Mute button: `aria-label="Mute microphone"` / `aria-label="Unmute microphone"`
- Disconnect button: `aria-label="Disconnect and return to conversations"`
- Connection status: `aria-label="Connection status: Connected"` (dynamic)
- Audio visualizer: `aria-label="Audio activity indicator"`
- Delete button: `aria-label="Delete conversation from [date]"`

**ARIA Descriptions**:
- Mute button: `aria-describedby="mute-help-text"` → "Toggle microphone on/off without ending the session"
- Conversation card: `aria-describedby="conversation-preview-{id}"` → Includes message count, date, preview

**Live Regions**:
- Transcription area: `aria-live="polite"` → Announces new messages as they appear
- Connection status: `aria-live="assertive"` → Immediately announces connection changes
- Error messages: `aria-live="assertive"` → Critical errors announced immediately
- Toast notifications: Built into Sonner component

**Hidden Content**:
- Visually hidden text for context: `<span class="sr-only">You said:</span>` before user messages
- Skip to content link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`

### Visual Accessibility

**Color Contrast**:
- Text/background: Minimum 4.5:1 for normal text (WCAG AA)
- Large text (headings): Minimum 3:1 (WCAG AA)
- Interactive elements: Minimum 3:1 for borders/icons (WCAG AA)
- Example: User message bubble (bg: gray-100, text: gray-900) = 18:1 ✅
- Example: Primary button (bg: primary-600, text: white) = 7:1 ✅

**Color Independence**:
- Connection status: Don't rely solely on color
  - Connected: Green + "Connected" text + checkmark icon
  - Error: Red + "Error" text + alert icon
  - Connecting: Yellow + "Connecting" text + spinner
- User vs Assistant messages: Different background + role label ("You" vs "Gemini")
- Mute state: Not just red/green - icon changes (mic vs mic-off)

**Text Size**:
- Minimum body text: 16px (1rem)
- Conversation titles: 18px (1.125rem)
- Timestamps/metadata: 14px (0.875rem) - acceptable for secondary info
- Button labels: 16px minimum

**Touch Targets**:
- Minimum: 44x44px (WCAG AAA)
- Mute button: 80x80px (large, easy to tap)
- Conversation cards: Full width, minimum 64px height
- Delete buttons: 44x44px minimum
- Disconnect button: 48x48px

**Motion**:
- Respect `prefers-reduced-motion`:
  - Disable pulsing animations
  - Disable audio visualizer animations
  - Replace slide/fade transitions with instant changes
  - Keep only essential loading spinners (no decoration)

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .audio-visualizer,
  .message-slide-up {
    animation: none !important;
    transition: none !important;
  }

  /* Keep essential feedback, remove decoration */
  .button-hover {
    transition: background-color 0.1s ease;
  }
}
```

## 7. Responsive Design

### Mobile (< 640px)

**Conversations List**:
- **Layout**: Single column, full-width cards
- **Navigation**: Fixed header with "New Conversation" FAB (floating action button) bottom-right
- **Actions**: Swipe-to-delete on conversation cards (with confirmation)
- **Content**:
  - Show truncated conversation preview (2 lines max)
  - Show date/time badge
  - Show message count if > 0

**Active Conversation**:
- **Layout**: Full-screen experience (no padding on sides)
- **Controls**:
  - Fixed header (connection status + disconnect button)
  - Fixed footer (mute button centered)
  - Transcript scrolls between header/footer
- **Message Bubbles**: Max-width 85% screen width
- **Typography**: 14px for messages, 16px for controls

### Tablet (640px - 1024px)

**Conversations List**:
- **Layout**: Single column with side padding (32px)
- **Navigation**: Header with "New Conversation" button in top-right (not FAB)
- **Actions**: Delete button visible on hover (or always visible on touch devices)
- **Content**:
  - Show fuller conversation preview (3 lines max)
  - Larger touch targets (cards 80px min-height)

**Active Conversation**:
- **Layout**: Centered card with padding
- **Controls**: Slightly larger buttons (mute: 96x96px)
- **Message Bubbles**: Max-width 70% screen width
- **Typography**: 16px for messages

### Desktop (> 1024px)

**Conversations List**:
- **Layout**: Centered container (max-width: 768px)
- **Navigation**: Header with "New Conversation" button + potential search
- **Actions**: Delete button appears on card hover (ghost state)
- **Content**:
  - Show full conversation preview (4 lines max)
  - Hover states with elevation changes
- **Additional Features**:
  - Keyboard shortcuts visible on hover (tooltip)
  - Bulk selection for future multi-delete

**Active Conversation**:
- **Layout**: Centered card (max-width: 896px) with sidebar potential for future features
- **Controls**:
  - Hover states with tooltips
  - Mute button: 112x112px
  - Disconnect in top-right with label
- **Message Bubbles**: Max-width 60% screen width (clearer separation)
- **Typography**: 16px for messages
- **Additional Features**:
  - Keyboard shortcut hints on buttons
  - Right-click context menu on messages (copy, etc.)

## 8. States & Feedback

### Loading States

**Initial Load (Conversations List)**:
- **Skeleton**:
  - 5 skeleton conversation cards (pulse animation)
  - Each card shows: shimmer rectangle (title), shimmer line (preview), shimmer badge (date)
- **Duration**: Until data fetches from repository
- **Fallback**: After 10s, show "Taking longer than expected..." with retry button

**Initial Load (Active Conversation)**:
- **Skeleton**:
  - If resuming: Show skeleton message bubbles (3-5 alternating user/assistant)
  - If new: Show empty state immediately (no skeleton)
- **Duration**: Until conversation history fetches (if any)

**Action Feedback (Connect)**:
- **Button State**:
  - Text changes: "Connect" → "Connecting..."
  - Spinner appears inside button
  - Button disabled during connection
- **Progress**: Connection status badge updates: "Disconnected" → "Connecting..." → "Connected"
- **Duration**: 1-3 seconds typical

**Action Feedback (Mute Toggle)**:
- **Button State**:
  - Immediate visual change (color + icon)
  - Brief scale animation (0.95x → 1x, 150ms)
- **Feedback**: Audio visualizer starts/stops immediately

**Optimistic Updates**:
- User message: Appears immediately in transcript when speaking stops
- Shows subtle loading indicator (small spinner or "..." badge)
- Confirmed once sent to server (checkmark appears)

### Error States

**Validation Errors**:
- N/A for this feature (no user input validation)

**System Errors**:
- **WebSocket Connection Failed**:
  - **UI**: Connection status badge turns red "Error"
  - **Toast**: "Failed to connect to Gemini. Please try again."
  - **Action**: Retry button on connection status or in toast
  - **Recovery**: Click retry or disconnect to reset

- **Microphone Permission Denied**:
  - **UI**: Alert dialog appears center-screen
  - **Toast**: "Microphone access denied. Please allow microphone permissions."
  - **Action**: "Open Settings" button (browser-specific) + "Dismiss" button
  - **Recovery**: User grants permission → try connecting again

- **Microphone Not Found**:
  - **UI**: Alert dialog
  - **Toast**: "No microphone detected. Please connect a microphone."
  - **Action**: "Retry" button + "Dismiss" button
  - **Recovery**: User connects mic → retry

- **Session Expired**:
  - **UI**: Connection status shows "Error"
  - **Toast**: "Your session has expired. Please reconnect."
  - **Action**: Auto-disconnect → user returns to conversations list
  - **Recovery**: Resume conversation → connect again

**Recovery Paths**:
- All errors provide clear next steps
- Critical errors auto-disconnect and return to safe state (conversations list)
- Non-critical errors (temporary network issues) show retry option

### Empty States

**No Conversations Yet**:
- **Visual**: Centered illustration (microphone icon or simple graphic)
- **Message**:
  - Heading: "No conversations yet"
  - Body: "Start your first voice conversation with Gemini AI assistant"
- **CTA**: Large "New Conversation" button below message
- **Tone**: Encouraging, not discouraging

**No Results (Future - if search added)**:
- **Visual**: Search icon
- **Message**: "No conversations found"
- **Suggestion**: "Try adjusting your search terms"
- **Action**: "Clear search" button

**First Use (Active Conversation - Disconnected)**:
- **Visual**: Large "Connect" button centered
- **Message**: "Connect to Gemini Live API to start a voice conversation"
- **Guidance**: Small help text below: "You'll be able to speak naturally with Gemini AI"

### Success States

**Connection Established**:
- **Visual**: Connection status badge turns green with checkmark
- **Toast**: "You're connected! Start speaking to chat with Gemini." (3s duration)
- **Animation**: Brief checkmark icon animation in status badge
- **Next Steps**: Mute button pulses subtly to indicate "tap here to start"

**Message Sent Successfully**:
- **Visual**: Checkmark appears in user's message bubble
- **Animation**: Fade in (200ms)
- **No Toast**: Keep UI clean, inline feedback sufficient

**Conversation Saved**:
- **Visual**: No change (automatic save)
- **Toast**: (Only if user explicitly clicks "Save" - future feature)
- **Next Steps**: Navigate back to conversations list

**Conversation Deleted**:
- **Visual**: Card slides out and fades (300ms)
- **Toast**: "Conversation deleted" (2s duration, with "Undo" action - future)
- **Animation**: Remaining cards slide up to fill space
- **Next Steps**: Focus moves to next card

## 9. User Flow Diagram

```
[Page 1: Conversations List]
         |
         |--[Has Conversations]--→ [List Display]
         |                              |
         |                              |--[Click Card]--→ [Page 2: Active (with history)]
         |                              |
         |                              |--[Click Delete]--→ [Confirmation Dialog]
         |                                                         |
         |                                                         |--[Confirm]--→ [Delete + Toast]
         |                                                         |
         |                                                         |--[Cancel]--→ [Close Dialog]
         |
         |--[No Conversations]--→ [Empty State]
         |                              |
         |                              |
         |---[Click "New Conversation"]--→ [Page 2: Active (fresh)]
                                                  |
                                                  |
                                            [Not Connected]
                                                  |
                                                  |--[Click "Connect"]--→ [Connecting...]
                                                                               |
                                                                               |--[Success]--→ [Connected State]
                                                                               |                      |
                                                                               |                      |--[Tap Mute]--→ [Microphone Active]
                                                                               |                                            |
                                                                               |                                            |--[User Speaks]--→ [Transcription Appears]
                                                                               |                                            |                         |
                                                                               |                                            |                         |--[Assistant Responds]--→ [Audio Plays + Transcript]
                                                                               |                                            |                                                          |
                                                                               |                                            |                                                          |--[Conversation Continues]
                                                                               |                                            |                                                          |
                                                                               |                                            |--[Tap Mute]--→ [Microphone Muted (still connected)]
                                                                               |                                                                  |
                                                                               |                                                                  |--[Tap Disconnect]--→ [Save + Return to Page 1]
                                                                               |
                                                                               |--[Error]--→ [Error State + Toast]
                                                                                                   |
                                                                                                   |--[Retry]--→ [Connecting...]
                                                                                                   |
                                                                                                   |--[Dismiss]--→ [Return to Not Connected]
```

## 10. Design Specifications

### Spacing Scale

**Tight** (4px, 8px):
- **When to use**: Between icon and text in buttons, between message bubbles and timestamps
- **Example**: Badge text padding, avatar-to-text gap

**Normal** (12px, 16px, 24px) - DEFAULT:
- **When to use**: Component internal padding, between sections
- **Example**: Card padding (16px), gap between conversation cards (12px), message bubble padding (12px)

**Relaxed** (32px, 48px, 64px):
- **When to use**: Page margins, section separations, large component spacing
- **Example**: Page container padding (32px on tablet+), space between header and content (48px)

### Typography

**Headings**:
- `h1`: 32px (2rem), font-weight: 700 (bold) - Page titles
- `h2`: 24px (1.5rem), font-weight: 600 (semibold) - Section titles
- `h3`: 20px (1.25rem), font-weight: 600 (semibold) - Card titles
- Line-height: 1.2 for all headings

**Body**:
- Default: 16px (1rem), font-weight: 400 (normal), line-height: 1.5
- Small: 14px (0.875rem), font-weight: 400, line-height: 1.4 (metadata, timestamps)
- Large: 18px (1.125rem), font-weight: 400, line-height: 1.6 (transcription)

**Labels**:
- Button labels: 16px (1rem), font-weight: 500 (medium)
- Form labels (future): 14px (0.875rem), font-weight: 500 (medium)
- Badge labels: 12px (0.75rem), font-weight: 600 (semibold)

### Color Usage

**Assuming Dark Theme with Tailwind CSS Variables**:

**Primary** (Voice/Active/Connected):
- **When to use**: Primary actions, active states, connection success
- **Examples**:
  - "New Conversation" button background
  - Mute button when active (listening)
  - Connection status badge when connected
  - Focus outlines

**Secondary** (Neutral/Inactive):
- **When to use**: Secondary actions, inactive states
- **Examples**:
  - Disconnect button (outline/ghost)
  - Muted state (but connected)
  - Inactive conversation cards

**Accent** (Call-to-Action):
- **When to use**: Highlight important actions, hover states
- **Examples**:
  - FAB "New Conversation" button glow
  - Hover state on primary buttons

**Semantic Colors**:
- **Success** (Green): Connection established, message sent successfully
- **Warning** (Yellow/Amber): Connection issues, reconnecting
- **Error** (Red/Destructive): Connection failed, microphone error, delete action
- **Info** (Blue): Help text, informational badges

**Background & Surface**:
- **Background**: `bg-background` (dark)
- **Card/Surface**: `bg-card` (slightly lighter than background)
- **User message bubble**: `bg-muted` (subtle gray)
- **Assistant message bubble**: `bg-card` (same as card or slightly different tint)

**Text**:
- **Primary text**: `text-foreground` (high contrast, white/near-white)
- **Secondary text**: `text-muted-foreground` (medium contrast, gray)
- **Tertiary text**: `text-muted-foreground opacity-70` (low contrast, timestamps)

### Shadow & Elevation

**Elevation Levels**:
- **Level 0** (Flat): Message bubbles, inline elements
- **Level 1** (Subtle): Conversation cards default state (`shadow-sm`)
- **Level 2** (Raised): Conversation cards hover state (`shadow-md`)
- **Level 3** (Floating): FAB, modals, dialogs (`shadow-lg`)
- **Level 4** (Modal): Confirmation dialogs, alerts (`shadow-xl`)

## 11. Performance Considerations

**Critical Path**:
- **Page 1 (Conversations List)**:
  1. Load React bundle
  2. Fetch conversation list from repository (parallel with render)
  3. Render skeleton immediately
  4. Hydrate with data when ready

- **Page 2 (Active Conversation)**:
  1. Load React bundle
  2. Initialize WebSocket connection (after user clicks "Connect")
  3. Load conversation history (if resuming) in parallel with WebSocket setup
  4. Show skeleton for history, show connecting state for WebSocket

**Lazy Loading**:
- Audio visualizer component: Load after connection established
- Conversation history: Virtualize if > 100 messages (use react-window or similar)
- Images/avatars (future): Lazy load with placeholder

**Image Optimization**:
- N/A for current design (no images except icons)
- If user avatars added: Use Next.js Image component with blur placeholder

**Animation Budget**:
- **High Priority** (60fps required):
  - Audio visualizer (real-time audio feedback)
  - Mute button state transitions
  - Scrolling in transcript area
- **Medium Priority** (30fps acceptable):
  - Message bubble animations (slide-up)
  - Card hover effects
  - Page transitions
- **Low Priority** (Can disable):
  - Pulsing animations on mute button
  - Decorative shadows
  - Background animations

**Bundle Size**:
- Code-split Active Conversation page from Conversations List
- Load Gemini WebSocket client only when needed (on Active Conversation page)
- Load audio processing libraries only after user grants mic permission

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- **Request**: Verify all shadcn components are installed (Card, Button, Badge, Separator, Sonner)
- **Provide**: Component variants needed (button sizes: sm, default, lg, icon; card with hover states)
- **Question**: Does Sonner toast support action buttons? (For "Undo" delete - future)

**domain-architect**:
- **Provide**: Data structure needs:
  - Conversation entity (id, title, createdAt, updatedAt, messageCount, preview)
  - Message entity (id, conversationId, role, content, timestamp, metadata)
  - Repository methods:
    - `conversationRepository.findAll()`
    - `conversationRepository.findById(id)`
    - `conversationRepository.create(data)`
    - `conversationRepository.delete(id)`
    - `messageRepository.create(data)`
    - `messageRepository.findByConversationId(conversationId)`
- **Question**: Where to persist conversation data? (IndexedDB for client-only? Or server-side with auth?)

**Parent (Orchestrator)**:
- **Provide**: Implementation sequence:
  1. Create text map file
  2. Create data repository (if needed)
  3. Build atoms (message-bubble, timestamp-badge, empty-state)
  4. Build molecules (conversation-card, conversation-header, transcription-display)
  5. Build organisms (conversations-list, active-conversation-view)
  6. Create pages/routes (home → conversations list, /conversation/[id] → active)
  7. Wire up WebSocket connection with UI states
  8. Test accessibility with keyboard and screen reader

### Files Impacted

**New Files**:

**Components**:
- `/src/domains/live-voice-agent/components/atoms/message-bubble.tsx`
- `/src/domains/live-voice-agent/components/atoms/timestamp-badge.tsx`
- `/src/domains/live-voice-agent/components/atoms/empty-state.tsx`
- `/src/domains/live-voice-agent/components/molecules/conversation-card.tsx`
- `/src/domains/live-voice-agent/components/molecules/conversation-header.tsx`
- `/src/domains/live-voice-agent/components/molecules/transcription-display.tsx`
- `/src/domains/live-voice-agent/components/organisms/conversations-list.tsx`
- `/src/domains/live-voice-agent/components/organisms/active-conversation-view.tsx`

**Text Maps**:
- `/src/domains/live-voice-agent/live-voice-agent.text-map.ts`

**Repository (if needed)**:
- `/src/domains/live-voice-agent/repositories/conversation-repository.ts`
- `/src/domains/live-voice-agent/repositories/message-repository.ts`

**Stores (Zustand - UI state)**:
- `/src/domains/live-voice-agent/stores/conversations-ui-store.ts` (filters, sort, selection)

**Schemas**:
- `/src/domains/live-voice-agent/schemas/conversation-schema.ts`
- `/src/domains/live-voice-agent/schemas/message-schema.ts`

**Pages (Next.js App Router)**:
- `/src/app/(voice)/conversations/page.tsx` (Conversations List)
- `/src/app/(voice)/conversation/[id]/page.tsx` (Active Conversation)
- `/src/app/(voice)/layout.tsx` (Shared layout for voice pages)

**Styles**:
- `/src/styles/domains/live-voice-agent/conversations-list.css`
- `/src/styles/domains/live-voice-agent/active-conversation.css`
- `/src/styles/domains/live-voice-agent/message-bubble.css`

**Modified Files**:
- `/src/domains/live-voice-agent/components/organisms/live-voice-session.tsx` (Major refactor → becomes active-conversation-view.tsx)
- `/src/domains/live-voice-agent/components/molecules/voice-controls.tsx` (Enhanced with mute toggle)
- `/src/domains/live-voice-agent/hooks/use-gemini-live.ts` (Add conversation persistence hooks)

## 13. Important Notes

⚠️ **User testing recommended**: Yes - This is a high-impact feature with complex real-time interactions. Test with:
- Users unfamiliar with voice assistants (first-time experience)
- Users with accessibility needs (keyboard-only, screen reader)
- Users on different devices (mobile, tablet, desktop)

⚠️ **Accessibility is mandatory**:
- Keyboard navigation must be flawless (voice interaction alternative)
- Screen reader announcements critical for live transcription
- Color-independent status indicators non-negotiable
- Touch targets must meet 44x44px minimum

💡 **Mobile-first**:
- Design for phone usage first (most common for voice)
- Optimize for one-handed use (large mute button, bottom controls)
- Consider landscape orientation for active conversations

💡 **Content before chrome**:
- Transcript is the star - controls should fade into background
- Minimal UI when conversation is active (immersive experience)
- Only show what's necessary (hide metadata/timestamps unless hovered)

📝 **Iterate**:
- Start with basic list + active conversation
- Add features incrementally (search, filters, bulk actions)
- Gather user feedback on transcription display preferences

🎨 **Consistency**:
- Reuse existing Button, Card, Badge components from shadcn
- Follow existing voice-session.tsx patterns where possible
- Match dark theme colors with site-wide palette

**Data Persistence Questions** (for domain-architect):
1. Where do conversations persist? (Client-only IndexedDB? Server-side DB?)
2. Do we need authentication to save conversations? (If yes, how?)
3. What's the conversation retention policy? (Delete after X days? Keep forever?)
4. How do we handle conversation sync across devices? (Future consideration)

## 14. Success Metrics

**Usability**:
- **Measurement**: Task completion rate
  - Can users start a new conversation without help? (Target: >95%)
  - Can users resume a past conversation? (Target: >90%)
  - Can users mute/unmute during conversation? (Target: >98%)
- **Method**: Moderated user testing sessions (5-10 participants)

**Efficiency**:
- **Measurement**: Task completion time
  - Time to start new conversation (Target: <5 seconds from home page)
  - Time to resume past conversation (Target: <3 seconds from clicking card)
  - Time to mute/unmute (Target: <1 second from intent)
- **Method**: Analytics tracking + user testing

**Satisfaction**:
- **Measurement**: User feedback surveys
  - Overall satisfaction (Target: >4/5 stars)
  - Clarity of connection status (Target: >90% "very clear")
  - Usefulness of real-time transcription (Target: >85% "very useful")
- **Method**: Post-session surveys, NPS score

**Accessibility**:
- **Measurement**: Accessibility audit results
  - Keyboard-only navigation success (Target: 100% tasks completable)
  - Screen reader comprehension (Target: >90% information correctly conveyed)
  - Color contrast compliance (Target: 100% WCAG AA)
  - Touch target compliance (Target: 100% meet 44x44px minimum)
- **Method**:
  - Automated testing (axe DevTools, Lighthouse)
  - Manual keyboard testing
  - Screen reader testing (NVDA, JAWS, VoiceOver)
  - User testing with assistive technology users

**Performance**:
- **Measurement**: Page load and interaction metrics
  - Conversations List load time (Target: <2s on 3G)
  - Active Conversation initial render (Target: <1.5s)
  - Mute button response time (Target: <100ms perceived latency)
  - Transcription display lag (Target: <300ms from audio stop)
- **Method**:
  - Lighthouse performance audit
  - Real User Monitoring (RUM) tools
  - Network throttling tests

**Reliability**:
- **Measurement**: Error rates and recovery
  - WebSocket connection success rate (Target: >95%)
  - Conversation save success rate (Target: >99%)
  - Microphone permission grant rate (Target: >80% on first ask)
- **Method**: Error logging, analytics tracking

---

## Next Steps for Implementation

### Phase 1: Foundation (Week 1)
1. **Create text map** (`live-voice-agent.text-map.ts`)
2. **Set up data layer** (repositories for conversations/messages)
3. **Build atomic components** (message-bubble, timestamp-badge, empty-state)
4. **Create basic pages structure** (conversations list page, active conversation page)

### Phase 2: Core Features (Week 2)
5. **Build conversation list organism** (with empty state, loading state)
6. **Build active conversation organism** (with connection states)
7. **Wire up WebSocket connection** (integrate with existing hooks)
8. **Implement real-time transcription display** (message streaming)

### Phase 3: Interactions & Polish (Week 3)
9. **Add mute/unmute functionality** (button states, visual feedback)
10. **Implement conversation persistence** (save/load conversations)
11. **Add delete functionality** (with confirmation dialog)
12. **Refine animations and transitions** (smooth, performant)

### Phase 4: Accessibility & Testing (Week 4)
13. **Keyboard navigation testing** (tab order, shortcuts, focus management)
14. **Screen reader testing** (ARIA labels, live regions, announcements)
15. **Visual accessibility audit** (contrast, touch targets, motion preferences)
16. **Cross-device testing** (mobile, tablet, desktop)
17. **Performance optimization** (lazy loading, code splitting, bundle size)

### Phase 5: Iteration (Ongoing)
18. **User testing sessions** (gather feedback)
19. **Analytics implementation** (track success metrics)
20. **Iterate based on findings** (adjust UI, fix pain points)
21. **Future enhancements** (search, filters, bulk actions, text input fallback)

---

**Design Plan Complete** ✅

This comprehensive UX/UI design plan provides:
- Clear user-centered design approach
- Detailed component breakdown following Atomic Design
- Complete accessibility specifications (WCAG AA minimum)
- Responsive layouts for all device sizes
- Comprehensive text content for text maps
- Interaction patterns and micro-interactions
- Performance considerations
- Implementation roadmap

**Ready for**:
- shadcn-builder to verify component availability
- domain-architect to design data layer
- Parent to execute step-by-step implementation
