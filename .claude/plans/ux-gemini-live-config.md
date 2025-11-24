# Gemini Live Configuration Flow - UX/UI Design Plan

**Created**: 2025-11-23
**Session**: `gemini_live_config`
**Complexity**: High
**User Impact**: Critical

## 1. User & Brand Context

### User Goals
- **Primary Goal**: Quickly configure and start a voice conversation with Gemini AI
- **Secondary Goals**:
  - Customize voice personality and system instructions for different use cases
  - Resume previous conversations with the same settings
  - Understand connection status and audio activity in real-time
- **Success Criteria**:
  - User can start a conversation in under 10 seconds
  - Configuration options are clear and don't overwhelm
  - Real-time feedback prevents confusion about system state

### User Personas
- **Primary**: Knowledge workers, students, and casual users seeking hands-free AI assistance
- **Context**: Using voice while multitasking (cooking, exercising), practicing language, brainstorming ideas, or quick information lookup
- **Pain Points**:
  - Uncertainty whether microphone is active
  - Unclear when AI is "thinking" vs ready to respond
  - Loss of conversation context when switching between sessions
  - Configuration steps add friction before actual conversation

### User Journey

**Journey 1: New User - First Conversation**
1. Landing on `/gemini-live` → See empty state with clear "New Conversation" CTA
2. Click "New Conversation" → Navigate to `/gemini-live/new`
3. Configuration form loads → Pre-filled with sensible defaults (voice: Puck, friendly system prompt)
4. Review defaults → Edit system prompt if desired → Select preferred voice
5. Click "Start Conversation" → Navigate to `/gemini-live/[sessionId]`
6. Session page loads → Automatic connection attempt → Status shows "Connecting..."
7. Connected → Microphone activates → Visual feedback shows listening state
8. User speaks → Real-time transcript appears → AI responds with audio + text
9. Conversation continues → User clicks "Disconnect" → Saved to IndexedDB → Return to landing

**Journey 2: Returning User - Resume Conversation**
1. Landing on `/gemini-live` → See list of previous conversations
2. Click conversation card → Navigate to `/gemini-live/[sessionId]`
3. Session page loads with history → Click "Connect" → Resume conversation
4. Continue from where they left off

**Journey 3: Power User - Multiple Configurations**
1. Create conversation with "Casual Assistant" personality
2. Create second conversation with "Professional Writer" personality
3. Switch between conversations based on task context
4. Each retains its own voice and system prompt settings

### Brand & Style Intake

**Brand Keywords**:
- Warm, human, approachable, conversational
- Reliable, clear, trustworthy
- Calm, focused, unobtrusive
- Tech-forward but friendly

**User Preferences** (from intake):
- **Aesthetic**: Warm & Human (soft colors, rounded corners, approachable)
- **Motion**: Calm & Minimal (subtle fades, gentle transitions)
- **Layout**: Chat-like (familiar messaging interface)
- **Color**: Deep Blue Tech (dark navy background, electric blue accents, cyan active states)

**Design Inspiration**:
- WhatsApp/Telegram chat interface (familiarity)
- Linear app (clean, minimal, purposeful motion)
- Vercel design system (sophisticated dark mode)
- Voice recorder apps (clear audio status indicators)

**Typography Strategy**:
- **Primary**: Geist Sans (already in project) - clean, modern, highly legible
- **Accent**: Geist Mono (for session IDs, technical details)
- **Usage**: Geist Sans for all body, headings, and UI text

**Color Direction**:
- **Dominant**: Deep navy background (#0a0f1a, oklch 0.12 0.02 240)
- **Accent Primary**: Electric blue (#0ea5e9, cyan-500 equivalent)
- **Accent Secondary**: Soft cyan for active states (#06b6d4)
- **Warmth**: Subtle warm gradient overlays (blue → purple) for conversation bubbles
- **Light Mode**: Maintain warmth with off-white backgrounds, muted blue accents

**Motion Appetite**: Calm & Minimal
- Page transitions: Simple fade (150ms)
- Connection state: Gentle pulse on status indicator
- Audio activity: Smooth waveform animation (no jarring movements)
- Form interactions: Subtle scale on buttons (0.98x on active)
- NO: Elaborate entry animations, bouncing, spinning

**Texture/Backgrounds**:
- Subtle noise texture on dark background (1-2% opacity)
- Soft gradients for conversation message bubbles (not flat)
- Layered depth with elevation shadows (subtle)
- Glass-morphism for active conversation header (blur + transparency)

## 2. Interface Architecture

### Information Hierarchy

**Page 1 - Landing (`/gemini-live`)**
1. **Primary**: Conversation list (if exists) OR empty state with CTA
2. **Secondary**: "New Conversation" button (always visible)
3. **Tertiary**: Page title, conversation metadata (date, message count)

**Page 2 - Configuration (`/gemini-live/new`)**
1. **Primary**: System instruction textarea (most important customization)
2. **Secondary**: Voice selection dropdown
3. **Tertiary**: Helper text, default indicators, action buttons

**Page 3 - Active Session (`/gemini-live/[sessionId]`)**
1. **Primary**: Real-time transcript (message bubbles)
2. **Secondary**: Voice controls (mute/disconnect)
3. **Tertiary**: Connection status, audio visualizer, session metadata

### Layout Strategy

**Page 1 - Landing**
- **Structure**: Full page with centered content container
- **Grid**: Single column, max-width 768px
- **Spacing**: Comfortable (16px between cards)
- **Breakpoints**:
  - Mobile (< 640px): Full-width cards, bottom-right FAB for "New Conversation"
  - Tablet (640px - 1024px): Centered container, cards with hover states
  - Desktop (> 1024px): Max-width container, larger touch targets

**Page 2 - Configuration**
- **Structure**: Centered card (max-width 640px), vertically centered on page
- **Grid**: Single column form layout
- **Spacing**: Comfortable between fields (24px)
- **Breakpoints**:
  - Mobile (< 640px): Card with minimal side padding (16px)
  - Tablet/Desktop: Card with generous padding (32px), centered on viewport

**Page 3 - Active Session**
- **Structure**: Fixed header + scrollable content + fixed footer (chat-like)
- **Grid**: Flexbox vertical layout
- **Spacing**: Compact for messages (8px), spacious for controls (32px)
- **Breakpoints**:
  - Mobile (< 640px): Full-screen, controls at bottom
  - Tablet (640px - 1024px): Centered card with breathing room
  - Desktop (> 1024px): Max-width 896px, sidebar potential for future features

### Visual Hierarchy

**Landing Page Focal Points**:
- First: "New Conversation" button (primary CTA)
- Second: Most recent conversation card (if exists)
- Third: Empty state illustration + message (if no conversations)

**Configuration Page Focal Points**:
- First: System instruction textarea (largest, most important)
- Second: "Start Conversation" button (primary action)
- Third: Voice selection (secondary customization)

**Active Session Focal Points**:
- First: Latest message in transcript (auto-scroll to bottom)
- Second: Microphone/mute button (main control)
- Third: Connection status (always visible but not dominant)

**Visual Flow**:
- Landing: Top-to-bottom (title → action → list)
- Configuration: Center-out (form centered, eyes drawn to textarea)
- Active Session: Bottom-to-top (conversation flows upward, newest at bottom)

**Grouping**:
- Conversations grouped by cards with clear boundaries
- Messages grouped by role (user vs assistant) with alternating alignment
- Controls grouped in fixed panels (header/footer)

**Contrast**:
- User messages: Align right, blue gradient background
- Assistant messages: Align left, muted gradient background
- Active state vs inactive: Color saturation + subtle glow
- Primary actions vs secondary: Fill vs outline buttons

## 3. Interaction Design

### Primary Actions

**Page 1 - Landing**

**Action**: "New Conversation"
- **Type**: Primary
- **Location**:
  - Mobile: Bottom-right FAB (floating action button)
  - Desktop: Top-right of container
- **State**:
  - Default: Electric blue (#0ea5e9), elevated shadow, rounded-full on mobile
  - Hover: Scale 1.02x, deeper shadow, slight glow
  - Active: Scale 0.98x
  - Disabled: N/A (always enabled)
- **Feedback**: Instant navigation to `/gemini-live/new`

**Action**: "Resume Conversation" (card click)
- **Type**: Secondary (implicit)
- **Location**: Entire conversation card is clickable
- **State**:
  - Default: Muted background, subtle border
  - Hover: Background lightens, border color intensifies, shadow increases
  - Active: Scale 0.99x
  - Disabled: N/A
- **Feedback**: Navigate to `/gemini-live/[sessionId]`

**Action**: "Delete Conversation"
- **Type**: Tertiary (destructive)
- **Location**: Right side of card (ghost button)
- **State**:
  - Default: Hidden until card hover (desktop) or always visible (mobile)
  - Hover: Red background appears
  - Active: Deeper red
  - Disabled: N/A
- **Feedback**: Confirmation toast → Delete from IndexedDB → Remove card with slide-out animation

**Page 2 - Configuration**

**Action**: "Start Conversation"
- **Type**: Primary
- **Location**: Bottom-right of form card
- **State**:
  - Default: Electric blue, large size (lg), full-width on mobile
  - Hover: Glow effect, scale 1.02x
  - Active: Scale 0.98x, brief spinner
  - Disabled: When system instruction is empty (grayed out)
- **Feedback**: Create conversation in IndexedDB → Navigate to session page → Auto-connect

**Action**: "Cancel"
- **Type**: Secondary
- **Location**: Bottom-left of form card
- **State**:
  - Default: Outline/ghost button
  - Hover: Background appears subtly
  - Active: Background darker
  - Disabled: N/A
- **Feedback**: Navigate back to landing page (no save)

**Page 3 - Active Session**

**Action**: "Mute/Unmute Microphone"
- **Type**: Primary
- **Location**: Center-bottom (fixed footer on mobile, within card on desktop)
- **State**:
  - Default (Unmuted): Electric blue, pulsing ring animation (subtle), mic icon
  - Hover: Scale 1.05x
  - Active (Muted): Red/destructive color, mic-off icon, no pulse
  - Disabled: Grayed out when not connected
- **Feedback**:
  - Unmuted: Audio visualizer animates, transcript updates in real-time
  - Muted: Visualizer stops, toast "Microphone muted"

**Action**: "Disconnect"
- **Type**: Secondary (end session)
- **Location**: Top-right of header
- **State**:
  - Default: Ghost/outline button, "X" or "End" icon
  - Hover: Background appears
  - Active: Deeper color
  - Disabled: N/A
- **Feedback**: Disconnect WebSocket → Save conversation → Navigate to landing

### Secondary Actions

**Action**: "Scroll to Bottom" (Active Session)
- **Type**: Tertiary
- **Location**: Bottom-right corner (appears when scrolled up)
- **State**:
  - Default: Small circular button with down-arrow icon
  - Hover: Slight scale increase
  - Active: Scale down
  - Disabled: Hidden when already at bottom
- **Feedback**: Smooth scroll to latest message

### Micro-interactions

**Hover Effects**:
- Conversation cards: Elevation increase (shadow-sm → shadow-md), border color intensifies
- Buttons: Scale 1.02x, shadow deepens by 2px
- Delete icon: Color shift to destructive red (200ms transition)
- Form inputs: Border color shifts to primary (150ms)

**Focus States**:
- 2px outline in electric blue (#0ea5e9)
- Offset by 2px for clarity
- Visible on all interactive elements
- Tab order: Logical top-to-bottom, left-to-right

**Loading States**:
- Page load: Skeleton cards (3-5) with pulse animation
- Connection: Spinner inside status badge, "Connecting..." text
- Message sending: Optimistic UI (message appears with subtle spinner)
- AI response: Typing indicator (three animated dots)

**Transitions**:
- Page navigation: Fade out (100ms) → Fade in (150ms)
- Message appearance: Slide up 8px + fade in (200ms)
- Delete animation: Slide right 200px + fade out (300ms)
- Mute toggle: Color transition (200ms) + icon morph (150ms)
- Status badge: Color fade (150ms)

**Success/Error**:
- Connection success: Green checkmark in status badge (brief flash animation)
- Connection error: Red X in status badge + error toast
- Message sent: Checkmark appears in user bubble (fade in)
- Deletion: Toast "Conversation deleted" (2s duration)

### User Input

**Voice Input** (Primary):
- **Input Type**: Audio stream via MediaRecorder API
- **Validation**: Microphone permission check on first connection
- **Error Messages**:
  - "Microphone access denied. Please allow microphone permissions in browser settings."
  - "No microphone found. Please connect a microphone and try again."
- **Helper Text**: "Speak naturally - Gemini will respond when you finish"

**Text Input - System Instruction** (Configuration):
- **Input Type**: Textarea (multiline text)
- **Validation**: Non-empty (minimum 1 character)
- **Error Messages**: "System instruction cannot be empty"
- **Placeholder**: "Describe how the assistant should behave..."
- **Helper Text**: "Define the personality and expertise of your assistant"
- **Default Value**: "You are a helpful, friendly voice assistant. Respond conversationally and concisely."

**Select Input - Voice** (Configuration):
- **Input Type**: Dropdown select (shadcn Select component)
- **Validation**: N/A (always has a selected value)
- **Options**: Puck, Charon, Kore, Fenrir, Aoede
- **Helper Text**: "Choose the voice your assistant will use"
- **Default Value**: "Puck"

## 4. Component Selection

### shadcn/ui Components Needed

**Already Available**:
- **Card**: Conversation cards, configuration form container
- **Button**: All actions (primary, secondary, tertiary)
- **Separator**: Visual dividers in UI
- **Label**: Form field labels
- **Textarea**: System instruction input
- **Select**: Voice selection dropdown
- **Badge**: Connection status, metadata indicators
- **Sonner (toast)**: Success/error notifications

**Note**: All components above are already installed. Coordinate with shadcn-builder agent to verify current configuration and ensure variants (button sizes, card styles) are available.

### Custom Components Needed

**Atoms** (`/src/domains/voice-agent/components/atoms/`):
- **mic-button.tsx**: ✅ Already exists
- **audio-visualizer.tsx**: ✅ Already exists
- **connection-status.tsx**: ✅ Already exists
- **message-bubble.tsx**: NEW - Individual chat message with gradient background
- **empty-state.tsx**: NEW - Illustration + text for zero conversations
- **loading-skeleton-card.tsx**: NEW - Skeleton loader for conversation cards

**Molecules** (`/src/domains/voice-agent/components/molecules/`):
- **conversation-card.tsx**: ✅ Already exists (review for consistency)
- **voice-controls.tsx**: ✅ Already exists (may need enhancement)
- **configuration-form.tsx**: NEW - System prompt + voice selection form
- **session-header.tsx**: NEW - Connection status + disconnect button
- **transcript-message.tsx**: NEW - Message with role indicator, timestamp, alignment

**Organisms** (`/src/domains/voice-agent/components/organisms/`):
- **conversations-list.tsx**: ✅ Already exists
- **live-voice-session.tsx**: ✅ Already exists (needs refactor for config flow)
- **configuration-wizard.tsx**: NEW - Full configuration form organism
- **active-conversation-view.tsx**: NEW - Complete session interface

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/domains/voice-agent/voice-agent.text-map.ts` (NEW FILE)

**Keys to Define**:

**Headings**:
- `landing.title`: "Your Voice Conversations"
- `landing.subtitle`: "Continue a conversation or start a new one"
- `config.title`: "Configure Your Assistant"
- `config.subtitle`: "Set up voice and personality"
- `session.title`: "Gemini Live Voice"
- `emptyState.title`: "No conversations yet"

**Body**:
- `emptyState.description`: "Start your first voice conversation with Gemini AI. Choose a voice, set a personality, and begin speaking naturally."
- `config.systemPromptLabel`: "System Instruction"
- `config.systemPromptHelper`: "Describe how your assistant should behave, its expertise, and communication style"
- `config.voiceLabel`: "Assistant Voice"
- `config.voiceHelper`: "Select the voice Gemini will use to respond"
- `session.listeningPrompt`: "Speak naturally - Gemini is listening"
- `session.mutedPrompt`: "Microphone is muted - unmute to continue"

**Actions**:
- `actions.newConversation`: "New Conversation"
- `actions.startConversation`: "Start Conversation"
- `actions.cancel`: "Cancel"
- `actions.connect`: "Connect"
- `actions.disconnect`: "Disconnect"
- `actions.mute`: "Mute"
- `actions.unmute`: "Unmute"
- `actions.delete`: "Delete"
- `actions.scrollToBottom`: "Scroll to latest"

**Feedback**:
- `feedback.connected`: "Connected - start speaking"
- `feedback.connecting`: "Connecting to Gemini Live..."
- `feedback.disconnected`: "Disconnected"
- `feedback.connectionFailed`: "Connection failed. Please check your API key and try again."
- `feedback.conversationCreated`: "Conversation created"
- `feedback.conversationDeleted`: "Conversation deleted"
- `feedback.micPermissionDenied`: "Microphone access denied. Please allow permissions in your browser settings."
- `feedback.micNotFound`: "No microphone detected. Please connect a microphone."
- `feedback.aiThinking`: "Gemini is thinking..."

**Placeholders**:
- `placeholders.systemPrompt`: "You are a helpful, friendly voice assistant. Respond conversationally and concisely."
- `placeholders.searchConversations`: "Search conversations..." (future)

**Help Text**:
- `help.connectionStatus.connected`: "Connected and ready"
- `help.connectionStatus.connecting`: "Establishing connection..."
- `help.connectionStatus.disconnected`: "Not connected"
- `help.connectionStatus.error`: "Connection error"

**Confirmations**:
- `confirmations.deleteConversation.title`: "Delete this conversation?"
- `confirmations.deleteConversation.description`: "This action cannot be undone. The conversation history will be permanently removed."
- `confirmations.deleteConversation.confirm`: "Delete"
- `confirmations.deleteConversation.cancel`: "Cancel"

**Tone**: Friendly, conversational, encouraging
**Voice**: Active, second person ("Start speaking", "Your assistant")

### Microcopy

**Empty States**:
- No conversations: "You haven't started any conversations yet. Create your first one to begin chatting with Gemini AI through natural voice interaction."
- No connection: "Ready to chat? Click 'Connect' to establish a voice connection with Gemini."

**Error States**:
- WebSocket failed: "We couldn't connect to Gemini. Please check your internet connection and try again."
- Microphone error: "We couldn't access your microphone. Make sure you've allowed microphone permissions."
- Session expired: "Your session has expired. Please reconnect to continue the conversation."
- Invalid API key: "Invalid API key. Please check your environment configuration."

**Success States**:
- Connection established: "You're connected! Gemini is listening - start speaking whenever you're ready."
- Conversation saved: "Your conversation has been saved and will appear in your list."
- Message sent: ✓ (checkmark icon only)

**Loading States**:
- Connecting: "Connecting to Gemini Live API..."
- Loading conversations: "Loading your conversations..."
- AI responding: "Gemini is thinking..." (with animated dots)
- Creating conversation: "Creating your conversation..."

## 6. Accessibility Design

### Semantic Structure

**Landing Page**:
- **Landmarks**:
  - `<header>`: Page title and "New Conversation" button
  - `<main>`: Conversation list or empty state
- **Headings**:
  - `h1`: "Your Voice Conversations"
  - `h2`: "Recent Conversations" (if grouped)
  - Hidden `h2` for screen readers: "Conversation from [date]"
- **Lists**:
  - `<ul>` for conversation list
  - `<li>` for each card

**Configuration Page**:
- **Landmarks**:
  - `<main>`: Configuration form card
  - `<form>`: Semantic form element
- **Headings**:
  - `h1`: "Configure Your Assistant"
- **Form Structure**:
  - Proper `<label>` for each input
  - `aria-describedby` linking to helper text

**Active Session Page**:
- **Landmarks**:
  - `<header>`: Connection status + disconnect
  - `<main>`: Message transcript
  - `<footer>`: Voice controls
- **Headings**:
  - `h1`: "Gemini Live Voice"
  - Hidden heading: "Conversation Transcript"
- **Lists**:
  - `<ol>` for messages (ordered by time)
  - `<li>` for each message

### Keyboard Navigation

**Landing Page**:
- **Tab Order**:
  1. "New Conversation" button
  2. First conversation card
  3. Delete button for first conversation
  4. Second conversation card
  5. (Continue pattern)
- **Shortcuts**:
  - `Enter/Space` on card: Open conversation
  - `Enter/Space` on delete: Trigger confirmation
  - `Escape`: Close confirmation dialog
- **Focus Management**: After delete, focus moves to next card

**Configuration Page**:
- **Tab Order**:
  1. System instruction textarea
  2. Voice selection dropdown
  3. Cancel button
  4. Start Conversation button
- **Shortcuts**:
  - `Enter` in textarea: Insert newline (not submit)
  - `Ctrl/Cmd + Enter`: Submit form
  - `Escape`: Cancel and return to landing
- **Focus Management**: On page load, focus on textarea

**Active Session Page**:
- **Tab Order**:
  1. Disconnect button (header)
  2. Mute/Unmute button (main control)
  3. Scroll to bottom button (if visible)
  4. Transcript area (for screen reader navigation)
- **Shortcuts**:
  - `Space`: Toggle mute when mute button focused
  - `Escape`: Disconnect and return to landing
- **Focus Management**:
  - On load: Focus on "Connect" button
  - After connect: Focus on "Mute" button
  - After disconnect: Return to landing with focus on this conversation
- **Escape Hatch**: Disconnect button always accessible

### Screen Reader Experience

**ARIA Labels**:
- Mute button: `aria-label="Mute microphone"` / `aria-label="Unmute microphone"`
- Disconnect button: `aria-label="Disconnect and return to conversation list"`
- Connection status: `aria-label="Connection status: Connected"` (dynamic)
- Delete button: `aria-label="Delete conversation from [date]"`
- Audio visualizer: `aria-label="Audio activity indicator"` `aria-hidden="true"` (decorative)
- New conversation FAB: `aria-label="Create new conversation"`

**ARIA Descriptions**:
- System instruction textarea: `aria-describedby="system-prompt-helper"`
- Voice select: `aria-describedby="voice-helper"`
- Conversation card: `aria-describedby="conversation-preview-{id}"` (includes date, message count)

**Live Regions**:
- Transcript area: `aria-live="polite"` → Announces new messages
- Connection status: `aria-live="assertive"` → Immediately announces connection changes
- Error toasts: `aria-live="assertive"` → Critical errors announced
- Success toasts: `aria-live="polite"` → Non-critical success messages

**Hidden Content**:
- Visually hidden role indicators: `<span class="sr-only">You said:</span>`
- Skip to main content: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`

### Visual Accessibility

**Color Contrast** (WCAG AA minimum, AAA target):
- Body text (16px): Minimum 4.5:1
  - Light mode: `oklch(0.147 0.004 49.25)` on `oklch(1 0 0)` = ~19:1 ✅ AAA
  - Dark mode: `oklch(0.985 0.001 106.423)` on `oklch(0.147 0.004 49.25)` = ~18:1 ✅ AAA
- Large text/headings (18px+): Minimum 3:1
  - All headings exceed 7:1 ✅ AAA
- Interactive elements: Minimum 3:1 for borders/focus
  - Electric blue accent on dark: ~8:1 ✅ AAA
  - Destructive red on dark: ~6:1 ✅ AA

**Color Independence**:
- Connection status: Not solely color-based
  - Connected: Green + "Connected" text + checkmark icon
  - Error: Red + "Error" text + X icon
  - Connecting: Blue + "Connecting..." text + spinner
- User vs AI messages: Different alignment + role label + background
- Mute state: Icon change (mic → mic-off) + color + text label

**Text Size**:
- Minimum body: 16px (1rem)
- Headings: 20px-32px range
- Metadata/timestamps: 14px minimum (secondary info)
- Button labels: 16px minimum

**Touch Targets** (WCAG AAA: 44x44px minimum):
- Mute button: 80x80px (large, easy to tap)
- Conversation cards: Full width, minimum 72px height
- Delete buttons: 44x44px minimum
- Disconnect button: 48x48px
- New conversation FAB: 56x56px

**Motion** (Respect `prefers-reduced-motion`):
```css
@media (prefers-reduced-motion: reduce) {
  .pulse-animation,
  .audio-visualizer,
  .message-slide-animation {
    animation: none !important;
  }

  .transition-transform {
    transition: none !important;
  }

  /* Keep essential feedback only */
  .button-state {
    transition: background-color 0.1s ease, color 0.1s ease;
  }
}
```

## 7. Responsive Design

### Mobile (< 640px)

**Landing Page**:
- **Layout**: Full-width cards, minimal side padding (16px)
- **Navigation**: Fixed FAB bottom-right (56px diameter)
- **Actions**: Delete button always visible on card right
- **Content**:
  - Conversation preview: 2 lines max (truncated)
  - Metadata: Date/time badge only (hide message count)
  - Touch targets: 72px minimum height per card

**Configuration Page**:
- **Layout**: Full viewport height, centered card
- **Form**:
  - System prompt: 6 rows, full-width
  - Voice select: Full-width dropdown
  - Buttons: Stacked vertically, full-width
- **Spacing**: 16px padding, 24px gap between fields

**Active Session**:
- **Layout**: Full-screen (100vh), no side padding
- **Header**: Fixed at top (connection status + disconnect)
- **Footer**: Fixed at bottom (mute button centered)
- **Transcript**: Scrollable between header/footer
- **Message Bubbles**: Max-width 85%, alternating alignment
- **Typography**: 14px for messages, 16px for controls

### Tablet (640px - 1024px)

**Landing Page**:
- **Layout**: Centered container, max-width 640px
- **Navigation**: "New Conversation" button in top-right (not FAB)
- **Actions**: Delete appears on hover (or always on touch)
- **Content**:
  - Conversation preview: 3 lines max
  - Show both date and message count
  - Cards: 80px minimum height

**Configuration Page**:
- **Layout**: Centered card, max-width 640px
- **Form**: Same as mobile but with horizontal button layout
- **Spacing**: 24px padding, 32px gap between fields

**Active Session**:
- **Layout**: Centered card, max-width 768px
- **Header/Footer**: Within card boundaries (not full-width)
- **Message Bubbles**: Max-width 75%
- **Typography**: 16px for messages

### Desktop (> 1024px)

**Landing Page**:
- **Layout**: Centered container, max-width 768px
- **Navigation**: Header with button + potential search (future)
- **Actions**: Delete appears on card hover only
- **Content**:
  - Full preview: 4 lines max
  - Hover states with elevation
  - Keyboard shortcuts visible on tooltip
- **Additional**: Potential grid view for many conversations (future)

**Configuration Page**:
- **Layout**: Centered card, max-width 640px, vertically centered
- **Form**: Same layout as tablet
- **Hover States**: Button tooltips, input focus glows

**Active Session**:
- **Layout**: Centered card, max-width 896px
- **Header/Footer**: Within card, generous padding
- **Message Bubbles**: Max-width 65% (clearer separation)
- **Typography**: 16px for messages
- **Additional**:
  - Hover tooltips on all controls
  - Right-click context menu on messages (copy, etc.)
  - Keyboard shortcut hints

## 8. States & Feedback

### Loading States

**Landing Page Load**:
- **Skeleton**:
  - 5 skeleton cards with pulse animation
  - Each: Rectangle (title area), line (preview), badge (date)
  - Fade in when data loads
- **Duration**: Until IndexedDB fetch completes
- **Fallback**: If > 5s, show "Loading is taking longer than expected..."

**Configuration Page Load**:
- **Skeleton**: None (instant render with defaults)
- **Form Ready**: Immediate focus on textarea

**Active Session Load**:
- **Skeleton** (if resuming):
  - 3-5 alternating message bubbles (shimmer effect)
  - Connection status shows "Loading..."
- **New Session**: Empty transcript, "Not connected" status

**Action Feedback - Start Conversation**:
- **Button State**:
  - Text: "Start Conversation" → "Creating..."
  - Spinner appears inside button
  - Button disabled
- **Duration**: ~200-500ms (IndexedDB write + navigation)

**Action Feedback - Connect**:
- **Status Badge**: "Disconnected" → "Connecting..." (with spinner)
- **Duration**: 1-3 seconds typical
- **Success**: Badge turns green, checkmark icon, toast notification
- **Error**: Badge turns red, X icon, error toast with retry button

**Optimistic Updates**:
- User message: Appears immediately when user stops speaking
- Shows subtle spinner or "Sending..." indicator
- Confirmed with checkmark when successfully sent

### Error States

**Configuration Page Errors**:
- **Empty System Prompt**:
  - Border turns red
  - Error message below: "System instruction cannot be empty"
  - "Start Conversation" button remains disabled
  - Recovery: Type any character

**Active Session Errors**:

**WebSocket Connection Failed**:
- **UI**: Status badge red "Error"
- **Toast**: "Failed to connect to Gemini. Please try again."
- **Actions**:
  - "Retry" button in toast
  - "Disconnect" to return to landing
- **Recovery**: Click retry or check API key

**Microphone Permission Denied**:
- **UI**: Modal dialog center-screen
- **Message**: "Microphone access denied. Please allow microphone permissions in your browser settings."
- **Actions**:
  - "Open Settings" (browser-specific, may not work)
  - "Dismiss"
- **Recovery**: User grants permission → retry connection

**Microphone Not Found**:
- **UI**: Modal dialog
- **Message**: "No microphone detected. Please connect a microphone and try again."
- **Actions**: "Retry", "Dismiss"
- **Recovery**: Connect mic → click retry

**Session Expired**:
- **UI**: Status "Error", auto-disconnect after 3s
- **Toast**: "Your session has expired. Please reconnect."
- **Actions**: Auto-return to landing
- **Recovery**: Resume conversation → connect again

**Network Error During Conversation**:
- **UI**: Toast warning "Connection unstable"
- **Behavior**: Attempt reconnection (3 tries)
- **Actions**: "Disconnect" option in toast
- **Recovery**: Automatic if network returns

### Empty States

**Landing - No Conversations**:
- **Visual**:
  - Centered microphone icon (120px, electric blue)
  - Text centered below icon
- **Message**:
  - Heading: "No conversations yet"
  - Body: "Start your first voice conversation with Gemini AI. Choose a voice, set a personality, and begin speaking naturally."
- **CTA**: Large "New Conversation" button below text
- **Tone**: Encouraging, inviting

**Active Session - Not Connected**:
- **Visual**: Large "Connect" button centered
- **Message**: "Connect to Gemini Live API to start your voice conversation"
- **Guidance**: Small helper text: "You'll be able to speak naturally and receive audio responses"
- **CTA**: Blue "Connect" button

### Success States

**Connection Established**:
- **Visual**: Status badge green with checkmark
- **Toast**: "Connected - start speaking" (2s duration)
- **Animation**: Brief checkmark icon pulse
- **Next**: Mute button subtly pulses to indicate "ready"

**Message Sent Successfully**:
- **Visual**: Small checkmark in user's message bubble
- **Animation**: Fade in (200ms)
- **No Toast**: Inline feedback sufficient

**Conversation Created**:
- **Visual**: None visible (automatic)
- **Toast**: "Conversation created" (1.5s, subtle)
- **Behavior**: Immediate navigation to session page

**Conversation Deleted**:
- **Visual**: Card slides right + fades (300ms)
- **Toast**: "Conversation deleted" (2s, with potential "Undo" - future)
- **Animation**: Remaining cards slide up to fill gap
- **Focus**: Moves to next card

## 9. User Flow Diagram

```
┌─────────────────────────────────────────┐
│  LANDING PAGE (/gemini-live)            │
│  - Show conversation list OR empty state│
└───────────┬─────────────────────────────┘
            │
            ├──[Has Conversations]──┐
            │                       │
            │                       ▼
            │              ┌────────────────────┐
            │              │ CONVERSATION LIST  │
            │              │ - Cards with meta  │
            │              └─────┬──────────────┘
            │                    │
            │                    ├──[Click Card]──────┐
            │                    │                    │
            │                    │                    ▼
            │                    │         ┌────────────────────────┐
            │                    │         │ ACTIVE SESSION         │
            │                    │         │ (/gemini-live/[id])    │
            │                    │         │ WITH HISTORY           │
            │                    │         └────┬───────────────────┘
            │                    │              │
            │                    │              └──[Resume flow]
            │                    │
            │                    └──[Click Delete]───┐
            │                                        │
            │                                        ▼
            │                             ┌──────────────────┐
            │                             │ CONFIRM DIALOG   │
            │                             └─────┬────────────┘
            │                                   │
            │                                   ├──[Cancel]──→[Close]
            │                                   │
            │                                   └──[Confirm]─→[Delete + Toast]
            │
            ├──[No Conversations]───┐
            │                       │
            │                       ▼
            │              ┌────────────────┐
            │              │ EMPTY STATE    │
            │              │ - CTA visible  │
            │              └─────┬──────────┘
            │                    │
            │                    │
            └───[Click "New Conversation"]───┐
                                             │
                                             ▼
                                  ┌──────────────────────────┐
                                  │ CONFIGURATION PAGE       │
                                  │ (/gemini-live/new)       │
                                  │ - System prompt textarea │
                                  │ - Voice selection        │
                                  └─────┬────────────────────┘
                                        │
                                        ├──[Click Cancel]──→[Back to Landing]
                                        │
                                        └──[Click "Start Conversation"]
                                                   │
                                                   ▼
                                        ┌──────────────────────┐
                                        │ Create in IndexedDB  │
                                        │ Generate session ID  │
                                        └─────┬────────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────────┐
                                  │ ACTIVE SESSION (NEW)       │
                                  │ (/gemini-live/[sessionId]) │
                                  └─────┬──────────────────────┘
                                        │
                                        │ [Auto-connect attempt]
                                        │
                                        ▼
                                  ┌────────────────┐
                                  │ CONNECTING...  │
                                  └─────┬──────────┘
                                        │
                                        ├──[Success]───┐
                                        │              │
                                        │              ▼
                                        │    ┌─────────────────────┐
                                        │    │ CONNECTED STATE     │
                                        │    │ - Mic auto-active   │
                                        │    └─────┬───────────────┘
                                        │          │
                                        │          ▼
                                        │    ┌─────────────────┐
                                        │    │ USER SPEAKS     │
                                        │    └─────┬───────────┘
                                        │          │
                                        │          ▼
                                        │    ┌──────────────────────┐
                                        │    │ TRANSCRIPT UPDATES   │
                                        │    │ (real-time)          │
                                        │    └─────┬────────────────┘
                                        │          │
                                        │          ▼
                                        │    ┌──────────────────────┐
                                        │    │ AI RESPONDS          │
                                        │    │ - Audio plays        │
                                        │    │ - Transcript shows   │
                                        │    └─────┬────────────────┘
                                        │          │
                                        │          ▼
                                        │    ┌──────────────────────┐
                                        │    │ CONVERSATION         │
                                        │    │ CONTINUES...         │
                                        │    └─────┬────────────────┘
                                        │          │
                                        │          ├──[Mute]──→[Mic Muted (still connected)]
                                        │          │
                                        │          └──[Disconnect]───┐
                                        │                            │
                                        │                            ▼
                                        │                 ┌────────────────────┐
                                        │                 │ SAVE TO INDEXEDDB  │
                                        │                 │ CLOSE WEBSOCKET    │
                                        │                 └─────┬──────────────┘
                                        │                       │
                                        │                       ▼
                                        │              [Return to Landing Page]
                                        │
                                        └──[Error]────┐
                                                      │
                                                      ▼
                                            ┌──────────────────┐
                                            │ ERROR STATE      │
                                            │ - Status badge   │
                                            │ - Error toast    │
                                            └─────┬────────────┘
                                                  │
                                                  ├──[Retry]──→[Connecting...]
                                                  │
                                                  └──[Disconnect]──→[Back to Landing]
```

## 10. Design Specifications & Style Guide

### Spacing Scale

**Tight** (4px, 8px):
- **When**: Icon-to-text in buttons, badge internal padding
- **Example**: `gap-1` (4px), `gap-2` (8px)

**Normal** (12px, 16px, 24px) - DEFAULT:
- **When**: Component padding, between sections, card gaps
- **Example**: Card padding `p-4` (16px), gap between cards `gap-3` (12px)

**Relaxed** (32px, 48px, 64px):
- **When**: Page margins, major section separation
- **Example**: Container padding `px-8` (32px), section gap `gap-12` (48px)

### Typography (Style Guide)

**Primary Typeface**: Geist Sans (already in project)
- **Usage**: All UI text, headings, body, buttons
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Licensing**: Open source (Vercel)

**Secondary Typeface**: Geist Mono
- **Usage**: Session IDs, technical details, timestamps
- **Weights**: 400 (regular), 500 (medium)

**Headings**:
- `h1`: 32px (2rem), font-weight 700, line-height 1.2
  - **Usage**: Page titles
- `h2`: 24px (1.5rem), font-weight 600, line-height 1.3
  - **Usage**: Section titles
- `h3`: 20px (1.25rem), font-weight 600, line-height 1.4
  - **Usage**: Card titles, conversation titles

**Body**:
- Default: 16px (1rem), font-weight 400, line-height 1.5
- Small: 14px (0.875rem), font-weight 400, line-height 1.4
  - **Usage**: Metadata, timestamps, helper text
- Large: 18px (1.125rem), font-weight 400, line-height 1.6
  - **Usage**: Message transcripts (important readability)

**Labels**:
- Buttons: 16px, font-weight 500
- Form labels: 14px, font-weight 500
- Badges: 12px (0.75rem), font-weight 600, uppercase

### Color System (Define CSS Variables)

**Custom Variables** (add to globals.css):

```css
:root {
  /* Base (Light Mode) */
  --color-bg: oklch(1 0 0); /* Pure white */
  --color-bg-alt: oklch(0.98 0.002 240); /* Slight blue tint */
  --color-fg: oklch(0.147 0.004 49.25); /* Near black */
  --color-muted: oklch(0.553 0.013 58.071); /* Medium gray */

  /* Accent - Electric Blue */
  --color-primary: oklch(0.6 0.18 240); /* Electric blue #0ea5e9 equivalent */
  --color-primary-contrast: oklch(1 0 0); /* White text on blue */

  /* Accent - Cyan Active */
  --color-accent: oklch(0.65 0.15 200); /* Soft cyan #06b6d4 equivalent */

  /* Semantic */
  --color-success: oklch(0.6 0.15 145); /* Green */
  --color-warning: oklch(0.7 0.15 85); /* Amber */
  --color-error: oklch(0.6 0.2 30); /* Red */

  /* Gradients */
  --gradient-user-message: linear-gradient(135deg,
    oklch(0.6 0.18 240) 0%,
    oklch(0.65 0.15 260) 100%
  ); /* Blue to purple */

  --gradient-ai-message: linear-gradient(135deg,
    oklch(0.9 0.01 240) 0%,
    oklch(0.92 0.01 260) 100%
  ); /* Light blue to light purple */
}

.dark {
  /* Base (Dark Mode) */
  --color-bg: oklch(0.12 0.02 240); /* Deep navy #0a0f1a */
  --color-bg-alt: oklch(0.18 0.02 240); /* Slightly lighter navy */
  --color-fg: oklch(0.985 0.001 106.423); /* Off-white */
  --color-muted: oklch(0.6 0.01 240); /* Muted blue-gray */

  /* Accent - Electric Blue (brighter in dark mode) */
  --color-primary: oklch(0.65 0.2 230); /* Bright electric blue */
  --color-primary-contrast: oklch(0.12 0.02 240); /* Dark text on blue */

  /* Accent - Cyan Active */
  --color-accent: oklch(0.7 0.18 200); /* Bright cyan */

  /* Semantic */
  --color-success: oklch(0.65 0.18 145); /* Bright green */
  --color-warning: oklch(0.75 0.18 85); /* Bright amber */
  --color-error: oklch(0.65 0.22 30); /* Bright red */

  /* Gradients */
  --gradient-user-message: linear-gradient(135deg,
    oklch(0.35 0.12 240) 0%,
    oklch(0.4 0.1 260) 100%
  ); /* Dark blue to dark purple */

  --gradient-ai-message: linear-gradient(135deg,
    oklch(0.2 0.04 240) 0%,
    oklch(0.22 0.04 260) 100%
  ); /* Very dark blue to very dark purple */
}
```

**Palette Notes**:
- **Dominant**: Deep navy creates calm, focused environment
- **Accent**: Electric blue provides energy without being harsh
- **Gradients**: Subtle blue-to-purple for depth and warmth
- **Warmth**: Purple undertones add human touch to tech feel

### Motion Principles

**Signature Animation**: Page Load Choreography
- Landing page: Fade in (200ms) + cards stagger up (50ms delay each)
- Configuration: Card scales up from 0.95 to 1 (300ms) + fade in
- Active session: Connection status pulse (1s loop, subtle)
- **Implementation**: CSS animations, no JavaScript

**Micro-interactions**:
- Button hover: Scale 1.02x (150ms ease-out)
- Button active: Scale 0.98x (100ms ease-in)
- Toast enter: Slide up 16px + fade in (200ms)
- Message appear: Slide up 8px + fade in (200ms), stagger 50ms
- Delete card: Slide right 200px (300ms) + fade out (200ms)

**Signature Detail**: Audio Visualizer
- Smooth waveform bars (CSS-only if possible)
- 60fps target with `will-change: transform`
- Bars scale based on audio amplitude
- Color: Electric blue with subtle glow

**Implementation Guidelines**:
- **CSS-first**: Use CSS transitions/animations for 90% of motion
- **Motion library**: Only for complex audio visualizer (if needed)
- **Budget**: Max 3 simultaneous animations on screen
- **Respect**: `prefers-reduced-motion` disables all decorative animations

### Background & Depth

**Techniques**:

**Noise Texture** (dark mode):
```css
.bg-texture {
  background-image:
    url('data:image/svg+xml,...'), /* 1-2% opacity noise */
    linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
}
```

**Layered Gradients** (message bubbles):
- User messages: Blue-to-purple gradient (warm, personal)
- AI messages: Muted blue gradient (calm, informative)
- Both with subtle shadow for depth

**Glass-morphism** (active session header):
```css
.session-header {
  background: oklch(0.12 0.02 240 / 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid oklch(1 0 0 / 0.1);
}
```

**Elevation Shadows**:
- Level 1: `shadow-sm` (conversation cards)
- Level 2: `shadow-md` (hover states)
- Level 3: `shadow-lg` (FAB, modals)
- Colors: Use blue-tinted shadows in dark mode for consistency

**Light/Dark Variants**:
- Light mode: Crisp shadows, higher contrast
- Dark mode: Softer glows, blue-tinted shadows
- Both: Maintain same visual hierarchy

## 11. Performance Considerations

**Critical Path**:
1. Load React bundle (~200KB gzipped target)
2. Fetch conversations from IndexedDB (parallel with render)
3. Render skeleton immediately (<100ms)
4. Hydrate with data when ready

**Lazy Loading**:
- Audio visualizer: Load after connection established
- WebSocket client: Load only on Active Session page
- Message history: Virtualize if > 50 messages (react-window)

**Code Splitting**:
- Landing page: Separate bundle
- Configuration page: Separate bundle
- Active session page: Separate bundle (largest, only loaded when needed)

**Animation Budget**:
- **High Priority** (60fps):
  - Audio visualizer
  - Scroll performance
  - Mute button transitions
- **Medium Priority** (30fps acceptable):
  - Message slide animations
  - Card hover effects
- **Low Priority** (can disable):
  - Page transition effects
  - Pulse animations
  - Decorative gradients

**Bundle Size Target**:
- Initial load: <250KB JS gzipped
- Per-page bundles: <50KB each
- Shared components: ~100KB (shadcn + utilities)

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- **Verify**: All components installed (Card, Button, Separator, Label, Textarea, Select, Badge, Sonner)
- **Provide**: Button variants (sizes: sm, default, lg, icon)
- **Provide**: Card with hover states
- **Question**: Sonner toast action buttons available?

**domain-architect**:
- **Provide**: Data structure needs:
  - `Conversation` entity (already defined in types.ts)
  - `Message` entity (already defined in types.ts)
  - Repository pattern for IndexedDB operations
- **Provide**: Repository methods:
  - `conversationRepository.findAll()`
  - `conversationRepository.findById(id)`
  - `conversationRepository.create(input)`
  - `conversationRepository.update(id, input)`
  - `conversationRepository.delete(id)`
  - `messageRepository.create(input)`
  - `messageRepository.findByConversationId(id)`

**Parent (Orchestrator)**:
- **Execute**: Step-by-step implementation
- **Test**: Accessibility at each phase
- **Verify**: Performance benchmarks

### Files Impacted

**New Files**:

**Components**:
- `/src/domains/voice-agent/components/atoms/message-bubble.tsx`
- `/src/domains/voice-agent/components/atoms/empty-state.tsx`
- `/src/domains/voice-agent/components/atoms/loading-skeleton-card.tsx`
- `/src/domains/voice-agent/components/molecules/configuration-form.tsx`
- `/src/domains/voice-agent/components/molecules/session-header.tsx`
- `/src/domains/voice-agent/components/molecules/transcript-message.tsx`
- `/src/domains/voice-agent/components/organisms/configuration-wizard.tsx`
- `/src/domains/voice-agent/components/organisms/active-conversation-view.tsx`

**Text Maps**:
- `/src/domains/voice-agent/voice-agent.text-map.ts`

**Repositories**:
- `/src/domains/voice-agent/repositories/conversation.repository.ts`
- `/src/domains/voice-agent/repositories/message.repository.ts`

**Styles**:
- `/src/styles/domains/voice-agent/message-bubble.css`
- `/src/styles/domains/voice-agent/audio-visualizer.css`

**Modified Files**:
- `/src/app/(live-voice)/gemini-live/page.tsx` - Landing page (improve UI)
- `/src/app/(live-voice)/gemini-live/new/page.tsx` - Configuration page (wire up form)
- `/src/app/(live-voice)/gemini-live/[sessionId]/page.tsx` - Active session (complete implementation)
- `/src/domains/voice-agent/components/organisms/live-voice-session.tsx` - Refactor to use config
- `/src/domains/voice-agent/hooks/use-gemini-live.tsx` - Accept config parameters
- `/src/domains/voice-agent/stores/conversation.store.ts` - Enhance with repository pattern
- `/src/app/globals.css` - Add custom color variables

## 13. Important Notes

⚠️ **User testing recommended**: High-impact feature with complex interactions
- Test with first-time voice assistant users
- Test with keyboard-only users
- Test with screen reader users (NVDA, JAWS, VoiceOver)
- Test on actual mobile devices (not just emulators)

⚠️ **Accessibility is mandatory**:
- Keyboard navigation must be flawless (primary interaction method)
- Screen reader announcements for real-time transcript critical
- Color-independent status indicators non-negotiable
- Touch targets must meet 44x44px minimum (WCAG AAA)
- `prefers-reduced-motion` must be respected

💡 **Mobile-first**:
- Design for phone usage first (most common for voice)
- Optimize for one-handed use (bottom controls, large targets)
- Test in landscape orientation
- Consider PWA for full-screen experience

💡 **Content before chrome**:
- Transcript is the star - UI should fade into background
- Minimal chrome when conversation is active
- Only show metadata on hover/interaction
- Let the conversation breathe

📝 **Iterate**:
- Start with MVP (basic config → session → transcript)
- Add features incrementally (search, filters, advanced settings)
- Gather user feedback early and often
- Be willing to remove features that don't serve users

🎨 **Consistency**:
- Follow existing Geist Sans typography
- Use shadcn components for all UI primitives
- Maintain design system color variables
- Match dark mode aesthetic across app

## 14. Success Metrics

**Usability**:
- Task completion rate:
  - Start new conversation without help: >95%
  - Configure voice and system prompt: >90%
  - Resume past conversation: >92%
- **Method**: Moderated user testing (8-10 participants)

**Efficiency**:
- Task completion time:
  - Landing → configuration → active session: <10 seconds
  - Configuration → speaking: <5 seconds
  - Resume conversation: <3 seconds
- **Method**: Analytics tracking + user testing

**Satisfaction**:
- User feedback scores:
  - Overall satisfaction: >4.2/5 stars
  - Configuration clarity: >90% "very clear"
  - Real-time feedback: >85% "helpful"
- **Method**: Post-session surveys

**Accessibility**:
- Audit compliance:
  - Keyboard navigation: 100% tasks completable
  - Screen reader: >90% information correctly conveyed
  - Color contrast: 100% WCAG AA (target AAA)
  - Touch targets: 100% meet 44x44px
- **Method**: Automated (axe DevTools, Lighthouse) + manual testing

**Performance**:
- Load and interaction metrics:
  - Landing page load: <2s on 3G
  - Configuration page load: <1.5s
  - Active session connection: <3s
  - Mute button response: <100ms perceived
- **Method**: Lighthouse, WebPageTest, RUM tools

**Reliability**:
- Error rates:
  - WebSocket connection success: >95%
  - Conversation save success: >99%
  - Microphone permission grant: >80% on first ask
- **Method**: Error logging, analytics

---

## Appendix: Session Context Integration

**Session File**: `.claude/tasks/context_session_gemini_live_config.md`

**This UX Plan Addresses**:
1. ✅ User flow from landing → config → session
2. ✅ Loading states, transitions, feedback at each step
3. ✅ Error handling UX with clear recovery paths
4. ✅ Transition animations (calm & minimal per user preference)
5. ✅ Mobile-first responsive strategy across all breakpoints
6. ✅ Accessibility checklist (WCAG AA minimum, AAA target)

**Ready for Implementation**:
- Parent agent can execute step-by-step
- Domain architect can build repository layer
- shadcn-builder can verify component availability
- All UX decisions documented and justified

---

**UX/UI Design Plan Complete** ✅

This plan provides comprehensive guidance for implementing the Gemini Live conversation configuration flow with:
- User-centered design based on actual user preferences
- Warm & human aesthetic with deep blue tech palette
- Calm & minimal motion philosophy
- Chat-like familiar interface
- Complete accessibility specifications
- Mobile-first responsive layouts
- Clear implementation roadmap
- Success metrics for validation

Generated with Claude Code - UX/UI Designer Agent
