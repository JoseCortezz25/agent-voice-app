# Voice Agent Platform - UX/UI Design Plan

**Created**: 2025-11-18
**Complexity**: High
**User Impact**: Critical

---

## 1. User Context

### User Goals

**Primary Goal**: Users want to interact with AI agents through natural voice conversations

**Secondary Goals**:
- Access conversation history across sessions
- Switch between chat-based and real-time voice modes
- Customize voice agent personality and behavior
- Manage API keys and settings
- Monitor usage and session costs

**Success Criteria**:
- Users can successfully start a voice conversation within 3 clicks
- Voice latency feels natural (under 1 second for real-time mode)
- Users understand the difference between chat and real-time voice modes
- Microphone permission flow is clear and non-intimidating
- Users can easily stop/pause/resume voice conversations

---

### User Personas

**Primary Persona**: Tech-savvy developer/professional
- **Context**: Testing voice AI integrations, building prototypes
- **Environment**: Desktop/laptop with headset or built-in mic
- **Pain Points**:
  - Confusing permission dialogs
  - Unclear connection states
  - No visual feedback during voice conversations
  - Difficulty distinguishing when AI is speaking vs listening

**Secondary Persona**: Non-technical user exploring AI
- **Context**: Curious about voice AI capabilities
- **Environment**: Mobile device or desktop with basic audio setup
- **Pain Points**:
  - Technical jargon intimidating
  - Unclear what each integration does
  - Fear of "breaking something"
  - Need clear guidance on when to speak

---

### User Journeys

**Journey 1: White Library Chat-Based Voice**
```
Home Page → Select "Chat Voice Mode" → Grant Mic Permission →
Chat Interface Loads → Click Mic Button → Record Message →
Release Button → See Transcription → Receive AI Response (text + audio) →
Continue Conversation
```

**Journey 2: Gemini Live Real-Time Voice**
```
Home Page → Select "Real-Time Voice" → Grant Mic Permission →
Enter API Key (if needed) → Click "Connect" → Connection Status →
Click "Start Speaking" → Speak Naturally → See Audio Visualizer →
Hear AI Response in Real-Time → Continue Natural Conversation →
Click "Stop" → End Session
```

**Journey 3: Session History Review**
```
Home Page → Click "History" → See List of Sessions →
Filter by Date/Type → Click Session → Review Conversation →
Option to Continue Session
```

---

## 2. Interface Architecture

### Information Hierarchy

**Level 1 - Primary** (Always visible):
- Current mode selection (Chat vs Real-Time)
- Connection status indicator
- Microphone control (talk/stop)
- Current conversation display

**Level 2 - Secondary** (Contextual):
- Audio visualizer (when speaking/listening)
- Session timer
- Message history
- Voice settings toggle

**Level 3 - Tertiary** (On-demand):
- Settings panel (API keys, voice preferences)
- Session history archive
- Help/documentation
- Debug information

---

### Layout Strategy

**Structure**: Single-page application with tabbed navigation

**Grid System**: 12-column responsive grid
- Desktop: Sidebar navigation + main content area
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation + full-screen content

**Spacing**: Comfortable density
- Base unit: 8px
- Component spacing: 16px (2 units)
- Section spacing: 32px (4 units)
- Page margins: 24px mobile, 48px desktop

**Breakpoints**:
- Mobile: < 640px - Single column, bottom nav, full-screen voice interface
- Tablet: 640px - 1024px - Two column, collapsible sidebar
- Desktop: > 1024px - Three column layout with persistent sidebar

---

### Visual Hierarchy

**Focal Point**: Microphone control button (center of interface)

**Visual Flow**:
1. Top: Mode selector and status indicators
2. Center: Large mic button with visual feedback
3. Middle: Conversation display / audio visualizer
4. Bottom: Secondary controls and settings access

**Grouping**:
- Connection controls clustered top-right
- Voice controls center stage
- Conversation history in scrollable panel
- Settings tucked in accessible drawer

**Contrast**:
- Primary action (mic button): High contrast, large size
- Secondary actions: Medium contrast, standard size
- Tertiary actions: Low contrast, icon-only

---

## 3. Interaction Design

### Primary Actions

**Action 1**: Start Voice Conversation
- **Type**: Primary
- **Location**: Center of viewport (Desktop), Bottom center (Mobile)
- **Visual**: Large circular button, 80px diameter (desktop), 64px (mobile)
- **States**:
  - Default: Blue gradient, mic icon, subtle pulse animation
  - Hover: Scale 1.05, brighter gradient
  - Active: Red gradient, recording animation
  - Disabled: Gray, opacity 0.5, no interaction
- **Feedback**:
  - Click: Haptic feedback (mobile), sound cue
  - Recording: Pulsing red ring, waveform animation
  - Processing: Spinner overlay

**Action 2**: Stop/Pause Conversation
- **Type**: Primary (when active)
- **Location**: Same position as start button
- **Visual**: Transform animation from mic to stop icon
- **States**:
  - Hover: Scale 1.05
  - Active: Immediate stop with fade-out animation
- **Feedback**: Visual confirmation message, audio stops immediately

**Action 3**: Switch Integration Mode
- **Type**: Secondary
- **Location**: Top center or tab bar
- **Visual**: Segmented control or tabs
- **States**:
  - Selected: Filled background, white text
  - Unselected: Transparent, gray text
  - Hover: Light background
- **Feedback**: Smooth transition animation between modes

---

### Secondary Actions

**Action**: View Session History
- **Type**: Tertiary
- **Location**: Sidebar navigation or top-right icon
- **Visual**: Icon button with badge showing count

**Action**: Open Settings
- **Type**: Tertiary
- **Location**: Top-right corner
- **Visual**: Gear icon, opens drawer/modal

**Action**: Copy/Share Conversation
- **Type**: Secondary
- **Location**: Conversation panel header
- **Visual**: Icon buttons in action bar

---

### Micro-interactions

**Hover Effects**:
- Buttons: Subtle scale transform (1.02), brightness increase
- Cards: Shadow elevation from 2px to 8px
- Icons: Color shift to primary accent

**Focus States** (Accessibility):
- Keyboard focus: 2px solid ring, primary color
- Skip to main content link for screen readers
- Focus trap in modals/drawers

**Loading States**:
- Initial load: Skeleton screens for conversation display
- Message sending: Shimmer animation in message bubble
- AI thinking: Typing indicator with animated dots
- Connection: Spinner with status text

**Transitions**:
- Page transitions: 200ms ease-in-out
- Modal/drawer: 300ms slide-in from right/bottom
- Mic button state change: 150ms transform
- Audio visualizer: Real-time (60fps)

**Success/Error Feedback**:
- Success: Green checkmark toast, 3s duration, slide-in from top
- Error: Red alert banner, persistent until dismissed, shake animation
- Warning: Yellow toast, 5s duration

---

### User Input

**Input 1**: Voice Recording (White Library)
- **Type**: Audio capture via button press-and-hold
- **Validation**: Real-time (max 60 seconds)
- **Error Messages**:
  - "Recording too short" (under 1 second)
  - "Recording limit reached" (60 seconds)
  - "Microphone access denied" with permission guide
- **Placeholder/Helper**: "Hold to record, release to send"

**Input 2**: Real-Time Voice Stream (Gemini Live)
- **Type**: Continuous audio stream
- **Validation**: Connection status check before streaming
- **Error Messages**:
  - "No microphone detected"
  - "Connection lost - reconnecting"
  - "API quota exceeded"
- **Helper**: Voice Activity Detection indicator

**Input 3**: API Key Entry
- **Type**: Password field with visibility toggle
- **Validation**: On blur + on submit
- **Error Messages**:
  - "Invalid API key format"
  - "API key authentication failed"
- **Placeholder**: "sk-..."

**Input 4**: Voice Settings
- **Type**: Dropdown selects + sliders
- **Validation**: Immediate preview
- **Options**:
  - Voice selection: Dropdown with audio samples
  - Speed: Slider (0.5x - 2x)
  - Pitch: Slider (-2 to +2)

---

## 4. Component Selection

### shadcn/ui Components Needed

**Core UI Components**:
- **Button**: Primary mic button, secondary actions, icon buttons
- **Card**: Session history cards, settings panels
- **Dialog**: API key setup, help modals, error dialogs
- **Drawer**: Settings panel (mobile), session history drawer
- **Tabs**: Integration mode switcher (Chat vs Real-Time)
- **Badge**: Connection status, notification counts
- **Toast**: Success/error/warning notifications
- **Skeleton**: Loading states for conversation
- **Slider**: Volume control, speed/pitch adjustments
- **Select**: Voice selection dropdown
- **Input**: API key field, search history
- **Switch**: Toggle settings (auto-scroll, notifications)
- **Separator**: Section dividers
- **Avatar**: User/AI message indicators
- **ScrollArea**: Conversation history, session list

**Form Components**:
- **Form**: Settings form wrapper
- **Label**: Form field labels
- **FormField**: Reusable form field composition
- **FormMessage**: Error/helper text

**Feedback Components**:
- **Alert**: Error banners, warning messages
- **Progress**: Connection progress, upload progress
- **Spinner**: Loading states (custom or from shadcn)

**Total shadcn Components**: 22

---

### Custom Components Needed

**Why Custom**: Highly specialized voice interaction needs

**Voice-Specific Components**:
1. **AudioVisualizer** (Gemini Live) - Real-time waveform/frequency bars
2. **RecordingIndicator** (White Library) - Animated recording state
3. **VoiceActivityIndicator** - Visual feedback for voice detection
4. **ConnectionStatusPill** - Live WebSocket connection status
5. **ConversationBubble** - Chat-style message with audio playback
6. **SessionTimeline** - Visual representation of conversation flow

**Component Breakdown** (see Section 5 for Atomic Design)

---

## 5. Atomic Design Breakdown

### Atoms (12 total)

#### Global Atoms (/components/atoms/)
1. **mic-button-icon.tsx** - Animated microphone SVG icon
2. **waveform-bar.tsx** - Single bar for audio visualizer
3. **connection-dot.tsx** - Colored status indicator dot
4. **recording-pulse.tsx** - Pulsing animation ring
5. **play-pause-toggle.tsx** - Audio playback control icon

#### Domain Atoms (/domains/chat-agent/components/atoms/)
6. **recording-indicator.tsx** - Animated "recording" text with pulse
7. **audio-level-meter.tsx** - Simple volume level bar
8. **message-timestamp.tsx** - Formatted time display

#### Domain Atoms (/domains/live-voice-agent/components/atoms/)
9. **voice-activity-dot.tsx** - VAD status indicator
10. **connection-status-badge.tsx** - WebSocket connection state
11. **session-timer.tsx** - Live session duration display
12. **audio-bar.tsx** - Single frequency bar for visualizer

---

### Molecules (8 total)

#### Domain Molecules (/domains/chat-agent/components/molecules/)
1. **chat-message-bubble.tsx**
   - Composition: Avatar + Text + Timestamp + Audio Player
   - Purpose: Display single chat message with audio

2. **recording-controls.tsx**
   - Composition: RecordingIndicator + MicButton + AudioLevelMeter
   - Purpose: White Library voice recording interface

3. **chat-theme-selector.tsx**
   - Composition: Label + Color Pickers + Preview
   - Purpose: Customize White Library theme

#### Domain Molecules (/domains/live-voice-agent/components/molecules/)
4. **voice-controls.tsx**
   - Composition: MicButton + ConnectionStatusBadge + SessionTimer
   - Purpose: Primary controls for Gemini Live

5. **audio-visualizer.tsx**
   - Composition: Multiple WaveformBar components
   - Purpose: Real-time audio visualization

6. **conversation-status.tsx**
   - Composition: VoiceActivityDot + Status Text + Connection Indicator
   - Purpose: Show who's speaking and connection health

#### Shared Molecules (/components/molecules/)
7. **mode-switcher.tsx**
   - Composition: Tabs (shadcn) + Icons + Labels
   - Purpose: Switch between Chat and Real-Time modes

8. **api-key-input.tsx**
   - Composition: Input + Button (visibility toggle) + Validation
   - Purpose: Secure API key entry

---

### Organisms (6 total)

#### Domain Organisms (/domains/chat-agent/components/organisms/)
1. **white-chat-container.tsx**
   - Composition: ChatPage (from white-library) + custom theme config
   - Purpose: Full White Library integration with theme customization
   - Size: Full viewport height
   - Children: Managed by White Library (messages, input, header)

2. **chat-settings-panel.tsx**
   - Composition: ChatThemeSelector + Voice Settings + Behavior Toggles
   - Purpose: Configure White Library appearance and behavior
   - Layout: Drawer or sidebar panel

#### Domain Organisms (/domains/live-voice-agent/components/organisms/)
3. **live-voice-session.tsx**
   - Composition: VoiceControls + AudioVisualizer + ConversationStatus
   - Purpose: Main real-time voice interface
   - Size: Full viewport, centered mic button
   - States: Idle, Connecting, Active, Paused, Error

4. **gemini-live-settings.tsx**
   - Composition: API Key Input + Voice Selection + Audio Settings
   - Purpose: Configure Gemini Live connection and preferences
   - Layout: Modal or drawer

#### Domain Organisms (/domains/session-management/components/organisms/)
5. **session-history-list.tsx**
   - Composition: SearchBar + FilterTabs + SessionCards (scrollable)
   - Purpose: Browse and search past conversations
   - Features: Infinite scroll, date grouping

6. **session-detail-viewer.tsx**
   - Composition: SessionHeader + ConversationBubbles + ActionBar
   - Purpose: Review full conversation from a session
   - Features: Play audio, copy transcript, continue conversation

---

### Layout (3 total)

#### Layouts (/components/layout/)
1. **voice-app-layout.tsx**
   - Composition: Header + Sidebar + Main Content + ModeSwitcher
   - Purpose: Main application shell
   - Responsive: Sidebar collapses on mobile, bottom nav appears

2. **voice-session-layout.tsx**
   - Composition: Status Bar + Voice Interface + Quick Settings
   - Purpose: Focused layout during active voice session
   - Features: Minimal distractions, fullscreen option

3. **settings-drawer-layout.tsx**
   - Composition: Drawer + Tabs + Form Sections
   - Purpose: Slide-in settings panel
   - Features: Persistent, can be open during session

---

## 6. User Flows & Wireframes

### Flow 1: White Library Chat Voice Session

```
┌─────────────────────────────────────────────────────────┐
│                    CHAT VOICE MODE                      │
│  [Chat Mode] [Real-Time Mode]         🔌 Connected  ⚙️  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Voice Assistant                             📱×  │ │
│  ├───────────────────────────────────────────────────┤ │
│  │                                                   │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │ 👤 Hello, can you help me?               │    │ │
│  │  │    🔊 [Audio waveform]         10:23 AM  │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  │                                                   │ │
│  │    ┌──────────────────────────────────────────┐  │ │
│  │    │ 🤖 Of course! How can I assist you?     │  │ │
│  │    │    🔊 [Audio waveform]       10:23 AM   │  │ │
│  │    └──────────────────────────────────────────┘  │ │
│  │                                                   │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │ 👤 [Listening...]                        │    │ │
│  │  │    🎤 Recording... 0:03                   │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  │                                                   │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  [Type message...]                     🎤  ➤    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│                         ⏺️                              │
│                   Hold to Record                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Steps**:
1. User navigates to Chat Mode tab
2. White Library ChatPage component loads with custom theme
3. User presses and holds large mic button (bottom center)
4. Recording indicator appears with timer
5. User speaks message
6. User releases button → audio sent to webhook
7. Transcription appears in chat bubble
8. AI response received → new bubble with text + audio waveform
9. User can click waveform to replay audio

---

### Flow 2: Gemini Live Real-Time Voice Session

```
┌─────────────────────────────────────────────────────────┐
│                  REAL-TIME VOICE MODE                   │
│  [Chat Mode] [Real-Time Mode]         🔴 LIVE      ⚙️  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Connection: Active  •  Duration: 02:34        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│                                                         │
│                  🟢 AI is speaking                      │
│                                                         │
│              ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                    │
│              │█│█│▓│░│▓│█│░│▓│█│░│  ← Audio Visualizer │
│              └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                    │
│                                                         │
│                                                         │
│                      ⏹️                                 │
│                  Stop Session                           │
│                                                         │
│                                                         │
│  Recent exchanges:                                      │
│  ┌────────────────────────────────────────────────┐    │
│  │ You: "What's the weather?"              02:32  │    │
│  │ AI: "It's sunny, 72°F in your area"    02:33  │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Steps**:
1. User selects Real-Time Mode tab
2. If no API key saved, modal prompts for entry
3. User clicks "Connect to Gemini Live"
4. Connection status changes: Idle → Connecting → Connected
5. Large "Start Speaking" button appears center screen
6. User clicks button → WebSocket begins streaming
7. Audio visualizer activates (real-time waveform)
8. Voice Activity Detection shows who's speaking
9. Conversation transcript appears below visualizer
10. User can pause/resume or stop entirely

---

### Flow 3: Error Handling - Microphone Permission Denied

```
┌─────────────────────────────────────────────────────────┐
│                    VOICE INTERFACE                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ⚠️  Microphone Access Required                 │   │
│  │                                                 │   │
│  │  This application needs microphone access to    │   │
│  │  enable voice conversations.                    │   │
│  │                                                 │   │
│  │  Steps to grant access:                         │   │
│  │  1. Click the 🔒 icon in your browser's         │   │
│  │     address bar                                 │   │
│  │  2. Set "Microphone" to "Allow"                 │   │
│  │  3. Refresh this page                           │   │
│  │                                                 │   │
│  │  [Open Browser Settings]  [Refresh Page]        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Recovery Path**: Clear instructions, direct links to fix the issue

---

### Flow 4: Loading States

**Initial Load**:
```
┌─────────────────────────────────────────────────────────┐
│  [████████░░] Loading Voice Interface...                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Skeleton              │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓                                  │   │
│  │                                                 │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                         │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Connecting to Gemini Live**:
```
┌─────────────────────────────────────────────────────────┐
│              🔄 Connecting to Gemini Live...            │
│              [████████████░░░░░░] 60%                   │
│                                                         │
│              Establishing secure connection...          │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Responsive Design

### Mobile (< 640px)

**Layout Changes**:
- Vertical stack: Status bar → Main interface → Bottom nav
- Full-screen voice interface (no sidebar)
- Bottom sheet for settings (slides up from bottom)
- Large touch targets (minimum 44x44px)

**Navigation**:
- Bottom navigation bar with 4 tabs:
  - 🏠 Home
  - 💬 Chat Mode
  - 🎙️ Real-Time
  - ⏱️ History
- Hamburger menu for settings and help

**Mic Button**:
- Positioned bottom-center, 64px diameter
- Fixed position, always accessible
- Palm rejection: Ignore accidental touches

**Conversation Display**:
- Full width message bubbles
- Simplified audio visualizer (fewer bars)
- Auto-scroll to latest message

**Priority Adjustments**:
- Hide session timer (show on tap)
- Collapse connection details to icon
- Minimize header height

---

### Tablet (640px - 1024px)

**Layout Changes**:
- Two-column: Collapsible sidebar + main content
- Sidebar toggle button (hamburger icon)
- Sidebar width: 280px when open
- Main content: Remaining width

**Voice Interface**:
- Mic button: 72px diameter, center-aligned
- Audio visualizer: Medium density (20 bars)
- Conversation bubbles: Max width 600px, centered

**Settings**:
- Drawer slides from right (360px width)
- Can remain open during session on landscape

**Gestures**:
- Swipe from left edge: Open sidebar
- Swipe from right edge: Open settings
- Tap outside: Close overlays

---

### Desktop (> 1024px)

**Layout**:
- Three-column layout:
  - Left sidebar: Navigation + session history (280px)
  - Main content: Voice interface (flex, 600-800px max)
  - Right panel: Settings/details (320px, optional)

**Voice Interface**:
- Mic button: 80px diameter, vertically centered
- Audio visualizer: Full density (40+ bars)
- Conversation display: Card layout, max 700px wide
- Hover states: All interactive elements

**Navigation**:
- Persistent left sidebar
- Keyboard shortcuts:
  - Space: Start/stop recording
  - Esc: Close modals
  - Cmd/Ctrl + K: Focus search
  - Cmd/Ctrl + ,: Open settings

**Multi-tasking**:
- Can view settings + active session simultaneously
- Picture-in-picture mode for voice session
- Notifications don't interrupt session

---

## 8. States & Feedback

### Loading States

**Initial Page Load**:
- Skeleton screens for:
  - Conversation history list
  - Settings panel
  - Mode switcher
- Progressive enhancement: Show interface, then load data

**White Library Integration Load**:
- Skeleton chat interface
- Shimmer animation on message placeholders
- "Loading chat..." text with spinner

**Gemini Live Connection**:
- Status progression:
  1. "Initializing..." (0-20%)
  2. "Connecting to server..." (20-60%)
  3. "Establishing audio stream..." (60-90%)
  4. "Ready!" (100%)
- Progress bar with percentage
- Cancel button available during connection

**Audio Processing**:
- Spinner overlay on mic button
- "Processing..." status text
- Disable mic button during processing

**Optimistic Updates**:
- User message appears immediately in chat
- AI response placeholder with typing indicator
- If error, replace placeholder with retry option

---

### Error States

**Validation Errors** (Inline):
- API Key Field:
  - "Invalid format - must start with 'sk-'"
  - Red border, error icon, helper text below
  - Fix button: "Generate new key"

**System Errors** (Toast):
- Microphone Access Denied:
  - Toast: "Microphone access required"
  - Action buttons: "Enable Access" + "Learn More"
  - Persistent until resolved

- WebSocket Connection Failed:
  - Alert banner: "Connection lost. Attempting to reconnect..."
  - Countdown: "Retry in 5 seconds"
  - Manual retry button

- API Quota Exceeded:
  - Error dialog (modal):
    - "API quota limit reached"
    - Explanation + solution
    - "Upgrade Plan" + "View Usage" buttons

**Recovery Actions**:
- Every error has clear next step
- "Try Again" buttons prominently displayed
- Alternative paths offered (e.g., switch to Chat Mode if Real-Time fails)

---

### Empty States

**No Session History**:
- Illustration: Microphone with sparkles
- Heading: "No conversations yet"
- Subheading: "Start your first voice session to see your history here"
- CTA: Large "Start Conversation" button

**No Search Results**:
- Icon: Magnifying glass
- Text: "No sessions found for '{query}'"
- Suggestions:
  - "Try different keywords"
  - "Check date filters"
  - "Browse all sessions"
- CTA: "Clear filters"

**First-Time User (Onboarding)**:
- Welcome modal on first visit:
  - "Welcome to Voice Agent!"
  - 3-step visual guide:
    1. "Choose your mode" (Chat vs Real-Time)
    2. "Grant microphone access"
    3. "Start speaking!"
  - "Skip Tutorial" + "Next" buttons
- Tooltips on key interface elements
- Dismissible, doesn't reappear

---

### Success States

**Connection Established**:
- Toast: "Connected to Gemini Live!" with green checkmark
- Auto-dismiss after 2 seconds
- Status badge changes to green "Connected"

**Message Sent Successfully**:
- Immediate visual confirmation: Message appears in chat
- Subtle animation: Slide-in from bottom
- Checkmark icon fades in after 500ms

**Settings Saved**:
- Toast: "Settings saved" with checkmark
- Auto-dismiss after 2 seconds
- Visual feedback: Brief flash on saved fields

**Session Ended**:
- Summary card:
  - Duration
  - Message count
  - Option to review transcript
- "Start New Session" CTA

**Next Steps**:
- After session ends: Suggest related actions
  - "Review transcript"
  - "Share conversation"
  - "Start another session"

---

## 9. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       ENTRY POINT                           │
│                    (Home / Landing)                         │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────────┐
    │   Grant Mic Permission?   │
    └───┬───────────────────┬───┘
        │                   │
     Denied              Granted
        │                   │
        ▼                   ▼
┌───────────────┐   ┌────────────────────┐
│  Permission   │   │  Select Mode       │
│  Help Dialog  │   │  [Chat] [Live]     │
└───────────────┘   └────┬───────────┬───┘
                         │           │
                 Chat Mode         Live Mode
                         │           │
                         ▼           ▼
            ┌────────────────┐  ┌──────────────────┐
            │  White Library │  │  API Key Stored? │
            │  Chat Interface│  └────┬──────────┬──┘
            └────────┬───────┘       │          │
                     │             No          Yes
                     │               │          │
                     ▼               ▼          ▼
          ┌──────────────────┐  ┌────────┐  ┌────────────┐
          │ Hold Mic Button  │  │ Enter  │  │  Connect   │
          │ → Record → Send  │  │ API Key│  │  WebSocket │
          └────────┬─────────┘  └───┬────┘  └─────┬──────┘
                   │                 │             │
                   ▼                 │             ▼
          ┌──────────────────┐      │      ┌─────────────────┐
          │ Processing Audio │      │      │  Start Speaking │
          └────────┬─────────┘      │      └────────┬────────┘
                   │                 │               │
                   ▼                 │               ▼
          ┌──────────────────┐      │      ┌─────────────────┐
          │  AI Response     │      │      │  Real-Time Voice│
          │  (Text + Audio)  │      │      │  Conversation   │
          └────────┬─────────┘      │      └────────┬────────┘
                   │                 │               │
                   │                 │               │
        ┌──────────┴─────────┐       │     ┌─────────┴────────┐
        │                    │       │     │                  │
        ▼                    ▼       │     ▼                  ▼
┌───────────────┐    ┌──────────┐   │  ┌────────┐    ┌──────────────┐
│ Continue Chat │    │   View   │   │  │  Stop  │    │  Connection  │
│               │    │ History  │   └─►│ Session│    │  Error?      │
└───────────────┘    └──────────┘      └───┬────┘    └──────┬───────┘
        │                                  │                │
        │                                  ▼                ▼
        │                          ┌──────────────┐  ┌──────────────┐
        │                          │ Session      │  │  Reconnect   │
        │                          │ Summary      │  │  or Exit     │
        │                          └──────────────┘  └──────────────┘
        │                                  │
        └──────────────┬───────────────────┘
                       │
                       ▼
              ┌────────────────────┐
              │  Return to Home    │
              │  or Start New      │
              └────────────────────┘
```

---

## 10. Design Specifications

### Spacing Scale

**Tight** (4px increments):
- Icon padding: 4px
- Badge text padding: 4px 8px
- Inline form field gaps: 8px

**Normal** (8px base, 16px standard):
- Button padding: 12px 24px
- Card padding: 16px
- Component margins: 16px
- Input field padding: 12px 16px

**Relaxed** (24px+):
- Section spacing: 32px
- Page margins: 24px (mobile), 48px (desktop)
- Voice interface top/bottom space: 48px

---

### Typography

**Headings**:
- H1: 32px (mobile) / 40px (desktop), font-weight 700, line-height 1.2
- H2: 24px (mobile) / 32px (desktop), font-weight 600, line-height 1.3
- H3: 20px (mobile) / 24px (desktop), font-weight 600, line-height 1.4

**Body**:
- Body Large: 18px, font-weight 400, line-height 1.6
- Body: 16px, font-weight 400, line-height 1.5
- Body Small: 14px, font-weight 400, line-height 1.5

**Labels/UI**:
- Button Text: 16px, font-weight 500
- Label: 14px, font-weight 500, letter-spacing 0.01em
- Caption: 12px, font-weight 400, line-height 1.4

**Monospace** (for API keys, code):
- 14px, font-family: 'Monaco', 'Menlo', monospace

---

### Color Usage

**Primary** (Blue):
- Main actions: #2563eb (blue-600)
- Hover: #1d4ed8 (blue-700)
- Active: #1e40af (blue-800)
- Usage: Mic button, primary CTAs, links

**Secondary** (Gray):
- Secondary actions: #6b7280 (gray-500)
- Disabled: #9ca3af (gray-400)
- Usage: Cancel buttons, secondary CTAs

**Accent** (Purple):
- Real-Time mode: #8b5cf6 (purple-500)
- Hover: #7c3aed (purple-600)
- Usage: Mode indicator, Gemini Live branding

**Semantic Colors**:
- Success: #10b981 (green-500) - Connected status, success messages
- Warning: #f59e0b (amber-500) - Warning alerts, quota warnings
- Error: #ef4444 (red-500) - Errors, disconnected status
- Info: #3b82f6 (blue-500) - Info messages, help tooltips

**Recording State**:
- Recording Active: #ef4444 (red-500) - Pulsing red
- Listening (VAD): #10b981 (green-500) - AI listening indicator
- Processing: #f59e0b (amber-500) - Processing state

**Backgrounds**:
- App Background: #f9fafb (gray-50)
- Card Background: #ffffff (white)
- Sidebar Background: #f3f4f6 (gray-100)
- Input Background: #f9fafb (gray-50)

**Text**:
- Primary Text: #111827 (gray-900)
- Secondary Text: #6b7280 (gray-500)
- Disabled Text: #9ca3af (gray-400)
- Link Text: #2563eb (blue-600)

---

## 11. Performance Considerations

**Critical Path** (Load First):
1. App shell (layout, navigation)
2. Mode selector
3. Microphone permission check
4. Connection status display

**Lazy Loading**:
- Session history: Load on tab open
- Settings panel: Load on drawer open
- Audio visualizer: Initialize only when needed
- White Library components: Dynamic import

**Image Optimization**:
- Icons: SVG format, inline where possible
- Avatars: WebP format, lazy load
- Illustrations: SVG animations

**Animation Budget**:
- Max simultaneous animations: 3
- Audio visualizer: Optimize to 60fps using Canvas/WebGL
- Reduce motion: Respect `prefers-reduced-motion`
- Disable non-essential animations on low-end devices

**Audio Performance**:
- Web Audio API for playback (low latency)
- Audio buffer pooling for Gemini Live
- Throttle visualizer updates to 30fps on mobile

**Network Optimization**:
- WebSocket connection pooling
- Compress audio streams
- Retry logic with exponential backoff
- Cache session history locally

---

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder Agent**:
- Provide list of 22 shadcn components needed (see Section 4)
- Request customization requirements:
  - Button: Larger primary variant (80px circular)
  - Toast: Custom positions (top-center for errors)
  - Drawer: Bottom drawer variant for mobile
  - Badge: Pulsing variant for "live" status

**domain-architect Agent**:
- Data structure for session storage:
  - Session ID, timestamp, mode type
  - Conversation messages with audio URLs
  - User settings and preferences
- API for session CRUD operations
- WebSocket message schema for Gemini Live

**nextjs-builder Agent**:
- Route structure:
  - `/` - Home page with mode selector
  - `/chat` - White Library integration
  - `/live` - Gemini Live integration
  - `/history` - Session history
  - `/settings` - Settings page
- API routes:
  - `/api/chat-webhook` - White Library webhook
  - `/api/sessions` - Session CRUD
  - `/api/settings` - User preferences

**Parent Agent** (Implementation Sequence):
1. Set up basic layout and navigation
2. Implement White Library integration
3. Build Gemini Live WebSocket client
4. Create session management
5. Add settings and preferences
6. Implement responsive design
7. Add accessibility features
8. Performance optimization

---

### Files Impacted

**Components** (Custom):
```
/components/atoms/
  - mic-button-icon.tsx
  - waveform-bar.tsx
  - connection-dot.tsx
  - recording-pulse.tsx
  - play-pause-toggle.tsx

/components/molecules/
  - mode-switcher.tsx
  - api-key-input.tsx

/components/layout/
  - voice-app-layout.tsx
  - voice-session-layout.tsx
  - settings-drawer-layout.tsx

/domains/chat-agent/components/
  atoms/
    - recording-indicator.tsx
    - audio-level-meter.tsx
    - message-timestamp.tsx
  molecules/
    - chat-message-bubble.tsx
    - recording-controls.tsx
    - chat-theme-selector.tsx
  organisms/
    - white-chat-container.tsx
    - chat-settings-panel.tsx

/domains/live-voice-agent/components/
  atoms/
    - voice-activity-dot.tsx
    - connection-status-badge.tsx
    - session-timer.tsx
    - audio-bar.tsx
  molecules/
    - voice-controls.tsx
    - audio-visualizer.tsx
    - conversation-status.tsx
  organisms/
    - live-voice-session.tsx
    - gemini-live-settings.tsx

/domains/session-management/components/
  organisms/
    - session-history-list.tsx
    - session-detail-viewer.tsx
```

**Text Maps**:
```
/domains/chat-agent/chat-agent.text-map.ts
/domains/live-voice-agent/live-voice.text-map.ts
/domains/session-management/sessions.text-map.ts
/components/layout/navigation.text-map.ts
/lib/errors.text-map.ts
```

**Styles** (CSS):
```
/styles/domains/chat-agent/
  - white-chat-container.css
  - recording-controls.css

/styles/domains/live-voice-agent/
  - audio-visualizer.css
  - voice-controls.css
  - live-session.css

/styles/components/
  - voice-app-layout.css
  - mode-switcher.css

/styles/animations/
  - pulse.css (recording pulse)
  - waveform.css (audio visualizer)
  - connection-status.css (status transitions)
```

---

## 13. Text Map Requirements

### /domains/chat-agent/chat-agent.text-map.ts

**Purpose**: All user-facing text for White Library integration

```typescript
export const chatAgentText = {
  // Header
  headerTitle: "Voice Chat Assistant",
  headerSubtitle: "Chat with AI using voice or text",

  // Input placeholder
  inputPlaceholder: "Type your message or hold mic to record...",
  inputPlaceholderMobile: "Tap mic to record",

  // Recording states
  recordingText: "Recording...",
  listeningText: "Listening...",
  processingText: "Processing your message...",

  // Buttons
  recordButton: "Hold to Record",
  sendButton: "Send",
  cancelButton: "Cancel",

  // Audio playback
  playAudio: "Play audio",
  pauseAudio: "Pause audio",
  audioError: "Unable to play audio",

  // Errors
  micPermissionDenied: "Microphone access required to use voice features",
  recordingTooShort: "Recording too short. Please speak for at least 1 second.",
  recordingLimitReached: "Recording limit reached (60 seconds)",
  connectionError: "Connection error. Please try again.",

  // Empty states
  noMessages: "Start a conversation by sending a message or recording your voice",

  // Settings
  themeCustomization: "Customize Chat Theme",
  voiceSettings: "Voice Settings",
  autoPlayResponses: "Auto-play AI responses",
  showTimestamps: "Show message timestamps",
}
```

---

### /domains/live-voice-agent/live-voice.text-map.ts

**Purpose**: All user-facing text for Gemini Live integration

```typescript
export const liveVoiceText = {
  // Connection
  connectionIdle: "Not connected",
  connectionConnecting: "Connecting to Gemini Live...",
  connectionActive: "Connected",
  connectionError: "Connection failed",
  connectionLost: "Connection lost. Reconnecting...",

  // Session states
  sessionIdle: "Ready to start",
  sessionActive: "Live conversation",
  sessionPaused: "Paused",
  sessionEnded: "Session ended",

  // Actions
  connectButton: "Connect to Gemini Live",
  disconnectButton: "Disconnect",
  startSpeakingButton: "Start Speaking",
  stopSpeakingButton: "Stop Speaking",
  pauseButton: "Pause",
  resumeButton: "Resume",

  // Voice activity
  youAreSpeaking: "You're speaking",
  aiIsSpeaking: "AI is speaking",
  silence: "Silence detected",

  // Session info
  sessionDuration: "Duration",
  sessionTimer: "{minutes}:{seconds}",

  // Errors
  apiKeyRequired: "API key required to use Gemini Live",
  apiKeyInvalid: "Invalid API key. Please check and try again.",
  apiQuotaExceeded: "API quota limit reached. Please upgrade your plan.",
  noMicrophone: "No microphone detected. Please connect a microphone.",
  websocketError: "WebSocket connection error",

  // Settings
  apiKeyLabel: "Gemini API Key",
  apiKeyPlaceholder: "sk-...",
  voiceSelection: "Select Voice",
  speechSpeed: "Speech Speed",
  audioPitch: "Audio Pitch",

  // Empty states
  noApiKey: "Add your Gemini API key to start using real-time voice",
  setupRequired: "Initial setup required",

  // Success
  connected: "Connected to Gemini Live!",
  disconnected: "Disconnected successfully",

  // Session summary
  sessionSummary: "Session Summary",
  totalDuration: "Total Duration",
  totalExchanges: "Exchanges",
}
```

---

### /domains/session-management/sessions.text-map.ts

**Purpose**: All text for session history and management

```typescript
export const sessionsText = {
  // Page title
  pageTitle: "Session History",
  pageDescription: "Browse and review your past conversations",

  // Search
  searchPlaceholder: "Search sessions...",
  filterByDate: "Filter by Date",
  filterByMode: "Filter by Mode",

  // Filters
  filterAll: "All Sessions",
  filterChat: "Chat Mode",
  filterLive: "Real-Time",
  filterToday: "Today",
  filterWeek: "This Week",
  filterMonth: "This Month",

  // Session card
  sessionDate: "Date",
  sessionMode: "Mode",
  sessionDuration: "Duration",
  sessionMessages: "{count} messages",

  // Actions
  viewDetails: "View Details",
  continueSession: "Continue",
  deleteSession: "Delete",
  shareSession: "Share",
  exportTranscript: "Export Transcript",

  // Empty states
  noSessions: "No conversations yet",
  noSessionsDescription: "Start your first voice session to see your history here",
  noSearchResults: "No sessions found for '{query}'",
  tryDifferentSearch: "Try different keywords or adjust your filters",

  // Confirmation
  deleteConfirm: "Delete this session?",
  deleteWarning: "This action cannot be undone.",
  deleteSuccess: "Session deleted successfully",

  // Detail view
  transcriptTitle: "Conversation Transcript",
  playbackSpeed: "Playback Speed",
  downloadAudio: "Download Audio",
  copyTranscript: "Copy Transcript",

  // Errors
  loadError: "Unable to load sessions. Please try again.",
  deleteError: "Failed to delete session. Please try again.",
}
```

---

### /components/layout/navigation.text-map.ts

**Purpose**: Navigation and global UI text

```typescript
export const navigationText = {
  // Main navigation
  home: "Home",
  chatMode: "Chat Voice",
  liveMode: "Real-Time",
  history: "History",
  settings: "Settings",
  help: "Help",

  // Mode switcher
  selectMode: "Select Mode",
  chatModeDescription: "Chat with voice messages",
  liveModeDescription: "Real-time voice conversation",

  // Settings
  settingsTitle: "Settings",
  accountSettings: "Account",
  voicePreferences: "Voice Preferences",
  apiKeys: "API Keys",
  appearance: "Appearance",
  accessibility: "Accessibility",
  about: "About",

  // User menu
  profile: "Profile",
  signOut: "Sign Out",

  // Accessibility
  skipToContent: "Skip to main content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  toggleSidebar: "Toggle sidebar",
}
```

---

### /lib/errors.text-map.ts

**Purpose**: Global error messages

```typescript
export const errorText = {
  // Permission errors
  micPermissionTitle: "Microphone Access Required",
  micPermissionDescription: "This application needs microphone access to enable voice conversations.",
  micPermissionSteps: [
    "Click the 🔒 icon in your browser's address bar",
    "Set 'Microphone' to 'Allow'",
    "Refresh this page",
  ],
  enableAccess: "Enable Access",
  learnMore: "Learn More",

  // Network errors
  networkError: "Network connection error",
  networkErrorDescription: "Please check your internet connection and try again.",
  retry: "Retry",

  // API errors
  apiError: "API request failed",
  apiErrorDescription: "Something went wrong. Please try again later.",
  apiKeyError: "Invalid API key",
  apiKeyErrorDescription: "Please check your API key and try again.",
  quotaError: "API quota exceeded",
  quotaErrorDescription: "You've reached your API usage limit.",

  // Generic errors
  unknownError: "Something went wrong",
  unknownErrorDescription: "An unexpected error occurred. Please try again.",
  refreshPage: "Refresh Page",
  contactSupport: "Contact Support",

  // Timeout errors
  connectionTimeout: "Connection timeout",
  connectionTimeoutDescription: "The connection took too long. Please try again.",
}
```

---

## 14. Important Notes

### User Testing Recommended
- High-impact feature with complex user flows
- Test microphone permission flow on multiple browsers
- Validate real-time voice latency with users
- A/B test mic button placement and size
- Usability test with screen reader users

### Accessibility is Mandatory
- WCAG 2.1 AA compliance required
- Keyboard navigation for all actions (Space to record/stop)
- Screen reader announcements for status changes
- Captions/transcripts for audio content
- Alternative input methods (text fallback if voice fails)
- No color-only indicators (use icons + color)

### Mobile-First Implementation
- Design for touch first, then scale to mouse/keyboard
- Test on actual devices, not just browser resize
- Consider mobile data usage (audio streaming)
- Optimize battery usage during active sessions
- Handle interruptions (phone calls, notifications)

### Content Before Chrome
- Conversation content is primary
- UI controls should not distract from conversation
- Minimize chrome during active session
- Focus mode option for distraction-free experience

### Iterate and Improve
- Design is never "done"
- Collect user feedback continuously
- Monitor analytics: Click patterns, drop-off points
- Iterate based on real usage data

### Consistency with Existing Patterns
- Follow shadcn/ui design tokens
- Match existing color palette and typography
- Reuse existing components where possible
- Maintain consistent spacing and layout

---

## 15. Success Metrics

### Usability Metrics
- **Task Completion Rate**: >95% of users successfully start a voice session
- **Time to First Interaction**: <30 seconds from landing to first voice message
- **Error Rate**: <5% of sessions encounter critical errors
- **Permission Grant Rate**: >80% of users grant microphone access on first prompt

### Efficiency Metrics
- **Voice Latency** (Gemini Live): <800ms end-to-end
- **Processing Time** (White Library): <2 seconds from recording end to AI response
- **Session Duration**: Average >3 minutes (indicates engagement)
- **Repeat Usage**: >40% of users return for second session within 7 days

### Satisfaction Metrics
- **User Satisfaction Score**: >4.0/5.0
- **Net Promoter Score**: >50
- **Feature Discovery**: >70% of users try both Chat and Real-Time modes
- **Settings Usage**: >30% of users customize voice settings

### Accessibility Metrics
- **Screen Reader Success Rate**: 100% of key flows navigable
- **Keyboard-Only Navigation**: 100% of actions accessible
- **Color Contrast**: WCAG AAA for all text (ratio >7:1)
- **Focus Indicators**: Visible on all interactive elements

### Performance Metrics
- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Audio Visualizer FPS**: Maintain 60fps on desktop, 30fps on mobile
- **WebSocket Reconnection**: <5 seconds

---

## 16. Accessibility Deep Dive

### Keyboard Navigation Map

**Global Shortcuts**:
- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Space`: Toggle mic (start/stop recording)
- `Esc`: Close modals, drawers, cancel recording
- `Cmd/Ctrl + K`: Focus search
- `Cmd/Ctrl + ,`: Open settings
- `Cmd/Ctrl + H`: Open help
- `Cmd/Ctrl + /`: Show keyboard shortcuts reference

**Focus Order** (Tab sequence):
1. Skip to main content link
2. Logo / Home link
3. Mode switcher tabs
4. Connection status
5. Settings button
6. Main mic button
7. Session controls (if active)
8. Conversation area (scrollable)
9. History sidebar (if open)

**Focus Trap**:
- Modals: Focus trapped within modal, Esc to close
- Drawers: Focus trapped while open
- Return focus to trigger element on close

---

### Screen Reader Experience

**ARIA Labels** (Comprehensive):
```html
<!-- Mic Button -->
<button
  aria-label="Start voice recording. Hold to record, release to send"
  aria-pressed="false"
  aria-describedby="mic-status">

<div id="mic-status" role="status" aria-live="polite">
  Ready to record
</div>

<!-- Connection Status -->
<div
  role="status"
  aria-live="polite"
  aria-label="Connection status: Connected to Gemini Live">

<!-- Audio Visualizer -->
<div
  role="img"
  aria-label="Audio visualizer showing voice activity">

<!-- Session Timer -->
<div
  role="timer"
  aria-live="off"
  aria-label="Session duration: 2 minutes 34 seconds">
```

**Live Regions** (Dynamic Updates):
- Connection status changes: `aria-live="polite"`
- Error messages: `aria-live="assertive"`
- AI response received: `aria-live="polite"`
- Recording status: `aria-live="polite"`

**Hidden Content** (Visually Hidden but Accessible):
```html
<span class="sr-only">
  Recording in progress. 15 seconds elapsed.
</span>
```

---

### Visual Accessibility

**Color Contrast Ratios**:
- Primary text on background: 13.5:1 (AAA)
- Secondary text on background: 7.2:1 (AAA)
- Button text on primary color: 4.8:1 (AA Large)
- Link text on background: 8.1:1 (AAA)
- Error text on background: 9.3:1 (AAA)

**Color Independence**:
- Recording state: Red color + pulsing animation + "Recording" text
- Connected state: Green dot + "Connected" text + checkmark icon
- Error state: Red border + error icon + error message text
- Never rely on color alone

**Text Size Scaling**:
- Minimum body text: 16px (1rem)
- UI scales proportionally with browser zoom
- Test up to 200% zoom without horizontal scroll

**Touch Targets**:
- Minimum: 44x44px (WCAG 2.1)
- Primary mic button: 64px mobile, 80px desktop
- Secondary buttons: 44x44px minimum
- Adequate spacing between targets (8px minimum)

---

### Motion and Animation

**Respect `prefers-reduced-motion`**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  /* Disable non-essential animations */
  .recording-pulse,
  .waveform-animation {
    animation: none;
  }

  /* Keep essential feedback with reduced motion */
  .mic-button:active {
    transform: scale(0.98); /* Instant, no transition */
  }
}
```

**Essential vs Non-Essential Motion**:
- Essential: Recording indicator, connection status changes
- Non-Essential: Decorative pulses, parallax, hover effects
- Reduce non-essential, simplify essential

---

## 17. Recommendations Summary

### Component Architecture
- **Total Components**: 38 (22 shadcn + 16 custom)
- **Atomic Breakdown**:
  - 12 Atoms
  - 8 Molecules
  - 6 Organisms
  - 3 Layouts
- **Reusability**: 60% reusable across both integrations

### Text Map Entries
- **Total Text Keys**: Approximately 120 keys across 5 text maps
- **Domains**:
  - chat-agent.text-map.ts: ~35 keys
  - live-voice.text-map.ts: ~45 keys
  - sessions.text-map.ts: ~30 keys
  - navigation.text-map.ts: ~20 keys
  - errors.text-map.ts: ~25 keys

### User Flow Complexity
- **Primary Flow** (Chat Mode): 9 steps
- **Primary Flow** (Real-Time Mode): 10 steps
- **Alternative Flows**: 6 error/recovery flows
- **Decision Points**: 5 major (permission, mode, API key, etc.)

### Design Priorities
1. **Mobile-First**: Start with mobile layout, scale up
2. **Accessibility**: Build in from start, not retrofitted
3. **Performance**: Audio visualizer and real-time updates must be 60fps
4. **Clarity**: Every state must have clear visual + text feedback
5. **Error Recovery**: Every error must have clear path to fix

---

## 18. Next Steps for Implementation

### Phase 1: Foundation (Week 1)
1. Set up basic layout structure (voice-app-layout.tsx)
2. Implement mode switcher
3. Create text maps for all domains
4. Set up shadcn components (coordinate with shadcn-builder)

### Phase 2: White Library Integration (Week 2)
5. Integrate White Library ChatPage component
6. Implement theme customization hook
7. Create webhook endpoint for audio processing
8. Build recording controls and indicators

### Phase 3: Gemini Live Integration (Week 3)
9. Implement WebSocket client service
10. Build audio processor for Web Audio API
11. Create audio visualizer component
12. Implement voice controls and status indicators

### Phase 4: Session Management (Week 4)
13. Build session history list and detail views
14. Implement session storage and retrieval
15. Create session summary and export features

### Phase 5: Polish and Accessibility (Week 5)
16. Implement responsive design for all breakpoints
17. Add keyboard navigation and ARIA labels
18. Test with screen readers
19. Optimize performance (audio visualizer, animations)
20. User testing and iteration

---

## 19. Collaboration Needed

### shadcn-builder Agent
**Required Components**:
- Button, Card, Dialog, Drawer, Tabs, Badge, Toast, Skeleton
- Slider, Select, Input, Switch, Separator, Avatar, ScrollArea
- Form, Label, FormField, FormMessage, Alert, Progress, Spinner

**Customization Requests**:
- Button: Large circular variant (80px diameter)
- Toast: Top-center position option
- Drawer: Bottom drawer variant for mobile
- Badge: Pulsing animation variant for "live" status

### domain-architect Agent
**Data Structures Needed**:
```typescript
// Session entity
interface VoiceSession {
  id: string;
  userId: string;
  mode: 'chat' | 'realtime';
  startedAt: Date;
  endedAt: Date | null;
  duration: number; // seconds
  messageCount: number;
  transcript: ConversationMessage[];
}

// Message entity
interface ConversationMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

// User settings
interface VoiceSettings {
  userId: string;
  apiKey?: string; // encrypted
  preferredVoice: string;
  speechSpeed: number;
  audioPitch: number;
  autoPlayResponses: boolean;
  showTimestamps: boolean;
}
```

**Actions Needed**:
- Session CRUD (create, read, update, delete)
- Message storage and retrieval
- Settings persistence
- Audio file storage (S3 or similar)

### nextjs-builder Agent
**Routes to Create**:
- `/` - Landing page with mode selector
- `/chat` - White Library chat interface
- `/live` - Gemini Live real-time interface
- `/history` - Session history browser
- `/history/[sessionId]` - Individual session detail
- `/settings` - User settings page

**API Routes**:
- `POST /api/chat-webhook` - White Library webhook handler
- `GET /api/sessions` - Fetch user sessions
- `GET /api/sessions/[id]` - Fetch specific session
- `DELETE /api/sessions/[id]` - Delete session
- `POST /api/settings` - Save user settings
- `GET /api/settings` - Fetch user settings

---

## 20. Final Notes

### Design Philosophy Applied
- **Empathy**: Designed for users who may be intimidated by voice AI
- **Simplicity**: One primary action per mode (mic button)
- **Consistency**: Patterns repeat (status indicators, error handling)
- **Feedback**: Every action has immediate visual/audio confirmation
- **Accessibility**: Screen reader users have equivalent experience
- **Iteration**: Plan for continuous improvement based on feedback

### Critical Success Factors
1. **Microphone Permission UX**: Must be non-threatening, with clear guidance
2. **Real-Time Latency**: Must feel natural (<1 second round-trip)
3. **Visual Feedback**: Users must always know what's happening
4. **Error Recovery**: Clear paths to fix issues (no dead ends)
5. **Mobile Experience**: Touch interactions must feel natural

### Known Challenges
- **Browser Compatibility**: WebSocket + Web Audio API support varies
- **Mobile Microphone**: iOS Safari has unique permission quirks
- **Network Reliability**: WebSocket connections can drop
- **Audio Quality**: Background noise, echo cancellation
- **User Expectations**: Real-time voice may feel "too fast" for some users

### Mitigation Strategies
- Progressive enhancement: Fallback to text if voice fails
- Clear browser requirement messaging
- Robust error handling with retry logic
- User education: Tooltips, onboarding, help documentation
- Analytics to identify common failure points

---

**End of UX/UI Design Plan**

This plan provides a comprehensive blueprint for implementing the Voice Agent platform with two distinct user experiences (White Library and Gemini Live). All design decisions prioritize user needs, accessibility, and clear feedback mechanisms.

**Implementation Ready**: Yes
**Requires Review**: Parent agent should validate flows before shadcn-builder and domain-architect work begins
**Estimated Implementation Time**: 5 weeks with dedicated development team
