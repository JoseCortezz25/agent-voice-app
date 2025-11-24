# Gemini Live Voice Agent - Wireframes & Visual Mockups

**Companion to**: `ux-gemini-live-conversations-plan.md`
**Created**: 2025-11-21

This document provides ASCII wireframes and detailed visual descriptions for the Gemini Live Voice Agent interface.

---

## Page 1: Conversations List (Home)

### Desktop View (> 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  Your Conversations                  [New Conversation]  │   │
│  │  Continue a previous conversation or start a new one     │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ How do I improve my public speaking?          [🗑️]      │   │
│  │ You: "I want to get better at..."                        │   │
│  │ 15 messages • 2 hours ago                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ What are the benefits of meditation?          [🗑️]      │   │
│  │ Gemini: "Meditation has numerous benefits..."           │   │
│  │ 8 messages • Yesterday                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Tell me about quantum computing                [🗑️]      │   │
│  │ You: "Can you explain quantum computing in..."           │   │
│  │ 23 messages • 3 days ago                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Details**:
- **Container**: Centered, max-width 768px, padding 32px
- **Header**:
  - Title: "Your Conversations" (h1, 32px, bold)
  - Subtitle: "Continue a previous conversation or start a new one" (16px, muted)
  - Button: "New Conversation" (primary, elevated, right-aligned)
- **Conversation Cards**:
  - Background: `bg-card` (elevated surface)
  - Padding: 16px
  - Border-radius: 12px
  - Shadow: `shadow-sm` default, `shadow-md` on hover
  - Hover: Slight scale (1.01x), deeper shadow
  - Delete button: Ghost, red tint, appears on hover
- **Card Content**:
  - Line 1: Conversation title (truncated from first message) - 18px, semibold
  - Line 2: Message preview (2 lines max, truncated) - 14px, muted
  - Line 3: Metadata (message count, timestamp) - 12px, very muted, flex-end
- **Spacing**: 12px gap between cards

### Mobile View (< 640px)

```
┌───────────────────────────┐
│                           │
│  Your Conversations       │
│  Continue or start new    │
│                           │
├───────────────────────────┤
│ ┌─────────────────────┐   │
│ │ How do I improve... │   │
│ │ You: "I want to..." │   │
│ │ 15 msg • 2 hrs ago  │   │
│ └─────────────────────┘   │
│                           │
│ ┌─────────────────────┐   │
│ │ What are benefits...│   │
│ │ Gemini: "Meditati...│   │
│ │ 8 msg • Yesterday   │   │
│ └─────────────────────┘   │
│                           │
│ ┌─────────────────────┐   │
│ │ Tell me about qua...│   │
│ │ You: "Can you exp...│   │
│ │ 23 msg • 3 days ago │   │
│ └─────────────────────┘   │
│                           │
│                       ╔═╗ │
│                       ║+║ │ ← FAB (Floating Action Button)
│                       ╚═╝ │
│                           │
└───────────────────────────┘
```

**Visual Details**:
- **Layout**: Full-width, no side padding for cards
- **Header**: Compact, 16px padding
- **FAB**: Fixed bottom-right, 56x56px, primary color, elevated shadow
- **Cards**: Full-width, 12px vertical padding, 16px horizontal
- **Delete**: Swipe-to-reveal or always-visible trash icon on right

### Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                           🎤                                     │
│                                                                 │
│                  No conversations yet                           │
│                                                                 │
│     Start your first voice conversation with Gemini AI          │
│                                                                 │
│                  [New Conversation]                             │
│                                                                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Details**:
- **Icon**: Large microphone icon (64px), muted color
- **Title**: "No conversations yet" (24px, semibold)
- **Description**: Encouraging message (16px, muted)
- **Button**: Large "New Conversation" (primary, elevated)
- **Layout**: Centered vertically and horizontally

---

## Page 2: Active Conversation (Not Connected)

### Desktop View

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  Gemini Live Voice                      [Disconnect] ●   │   │
│  │  ───────────────────────────────────────────────────     │   │
│  │                                                           │   │
│  │                                                           │   │
│  │         Connect to Gemini Live API to start a             │   │
│  │              voice conversation                           │   │
│  │                                                           │   │
│  │                    [Connect]                              │   │
│  │                                                           │   │
│  │                                                           │   │
│  │                                                           │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Details**:
- **Header**:
  - Title: "Gemini Live Voice" (left)
  - Connection status badge: "● Disconnected" (gray, right)
  - Disconnect button: Disabled/hidden when not connected
- **Content**: Centered message + large Connect button
- **Button**: Primary, large (48px height), centered

---

## Page 2: Active Conversation (Connected - Muted)

### Desktop View

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Gemini Live Voice            ● Connected   [Disconnect] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ You                                    2:34 PM    │    │   │
│  │  │ How do I improve my public speaking skills?      │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │              ┌────────────────────────────────────┐       │   │
│  │              │ Gemini                    2:34 PM  │       │   │
│  │              │ Great question! Public speaking... │       │   │
│  │              │ Here are some key tips: ...        │       │   │
│  │              └────────────────────────────────────┘       │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ You                                    2:35 PM    │    │   │
│  │  │ Can you elaborate on the first point?           │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │              ┌────────────────────────────────────┐       │   │
│  │              │ Gemini [typing...]                 │       │   │
│  │              └────────────────────────────────────┘       │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                         ┌─────┐                                 │
│                         │ 🔇  │  ← Muted (red, no pulse)        │
│                         └─────┘                                 │
│                      Tap to unmute                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Details**:
- **Header**:
  - Connection status: "● Connected" (green badge)
  - Disconnect button: Visible, outline style
- **Message Area**:
  - Scrollable (fills space between header and controls)
  - User messages: Left-aligned, `bg-muted`
  - Assistant messages: Right-aligned, `bg-card` (slightly different)
  - Each message: role label, timestamp, content
  - Typing indicator: Animated dots for assistant
- **Controls**:
  - Mute button: Large (112x112px), centered, bottom
  - Muted state: Red/destructive color, mic-off icon, no animation
  - Helper text: "Tap to unmute" below button

---

## Page 2: Active Conversation (Connected - Listening)

### Desktop View

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Gemini Live Voice            ● Connected   [Disconnect] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ You                                    2:34 PM    │    │   │
│  │  │ How do I improve my public speaking skills?      │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │              ┌────────────────────────────────────┐       │   │
│  │              │ Gemini                    2:34 PM  │       │   │
│  │              │ Great question! Public speaking... │       │   │
│  │              └────────────────────────────────────┘       │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ You [speaking...]                     2:35 PM    │    │   │
│  │  │ Can you tell me more about the body l...          │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                        ╔═════╗                                  │
│                        ║ 🎤  ║  ← Active (pulsing ring)         │
│                        ╚═════╝                                  │
│                     ▂ ▄ ▆ █ ▆ ▄ ▂  ← Audio visualizer          │
│                      Listening...                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Details**:
- **Mute Button**:
  - Active state: Primary color, mic icon
  - Pulsing ring animation (subtle, 2s duration)
  - Size: 112x112px on desktop, 96x96px on tablet, 80x80px on mobile
- **Audio Visualizer**:
  - Below button
  - 7-9 bars animating with audio input
  - Bars: 4px wide, variable height (8px to 32px)
  - Animation: Synchronized with actual audio levels
- **Real-time Transcription**:
  - Latest user message shows "[speaking...]" indicator
  - Text updates in real-time as speech recognition processes
  - Subtle pulse on message bubble during active speech

### Mobile View (< 640px)

```
┌───────────────────────────┐
│ Gemini Live   [✕]        │
│ ● Connected               │
├───────────────────────────┤
│                           │
│ ┌───────────────────────┐ │
│ │ You          2:34 PM  │ │
│ │ How do I improve my...│ │
│ └───────────────────────┘ │
│                           │
│     ┌─────────────────┐   │
│     │ Gemini  2:34 PM │   │
│     │ Great question! │   │
│     │ Public speaki...│   │
│     └─────────────────┘   │
│                           │
│ ┌───────────────────────┐ │
│ │ You [speaking...]    │ │
│ │ Can you tell me mo...│ │
│ └───────────────────────┘ │
│                           │
│                           │
│          Auto-scroll ↓    │
├───────────────────────────┤
│         ┌───────┐         │
│         │  🎤   │         │
│         └───────┘         │
│        ▂ ▄ ▆ █ ▆ ▄ ▂      │
│       Listening...        │
└───────────────────────────┘
```

**Visual Details**:
- **Header**: Compact, title + status + disconnect (icon only)
- **Message Area**: Most of screen height, scrollable
- **Controls**: Fixed bottom panel (96px height)
- **Button**: Centered, 80x80px
- **Visualizer**: Smaller bars, below button
- **Auto-scroll indicator**: Shown when user scrolls up, tapping scrolls to bottom

---

## Component Hierarchy Visualization

### Page 1: Conversations List

```
[ConversationsListPage]
├── [Header]
│   ├── [Heading] "Your Conversations"
│   ├── [Description] "Continue a previous..."
│   └── [Button] "New Conversation"
│
├── [ConversationsList] (or EmptyState)
│   ├── [ConversationCard] (repeatable)
│   │   ├── [CardTitle] (from first message)
│   │   ├── [MessagePreview]
│   │   ├── [ConversationMeta]
│   │   │   ├── [MessageCountBadge]
│   │   │   └── [TimestampBadge]
│   │   └── [DeleteButton]
│   │
│   ├── [ConversationCard]
│   └── [ConversationCard]
│
└── [FAB] "New Conversation" (mobile only)
```

### Page 2: Active Conversation

```
[ActiveConversationPage]
├── [ConversationHeader]
│   ├── [Heading] "Gemini Live Voice"
│   ├── [ConnectionStatus]
│   │   └── [Badge] "● Connected"
│   └── [DisconnectButton]
│
├── [TranscriptionDisplay] (scrollable)
│   ├── [MessageGroup] (user)
│   │   ├── [RoleLabel] "You"
│   │   ├── [MessageBubble]
│   │   │   └── [Text] content
│   │   └── [TimestampBadge]
│   │
│   ├── [MessageGroup] (assistant)
│   │   ├── [RoleLabel] "Gemini"
│   │   ├── [MessageBubble]
│   │   │   └── [Text] content
│   │   └── [TimestampBadge]
│   │
│   └── [TypingIndicator] (conditional)
│
├── [ScrollToBottomButton] (conditional)
│
└── [VoiceControls]
    ├── [MicButton]
    │   └── [Icon] (mic or mic-off)
    ├── [AudioVisualizer] (conditional)
    └── [StatusText] "Listening..." / "Tap to unmute"
```

---

## Interaction States Visualization

### Mute Button States

```
[Default - Unmuted]
┌─────────────────┐
│   ╔═══════╗     │
│   ║  🎤   ║     │  ← Primary color
│   ╚═══════╝     │  ← Pulsing ring (2s)
│                 │
│  ▂ ▄ ▆ █ ▆ ▄ ▂  │  ← Active visualizer
│  Listening...   │
└─────────────────┘

[Hover]
┌─────────────────┐
│   ╔═══════╗     │
│   ║  🎤   ║     │  ← Slightly larger (1.05x)
│   ╚═══════╝     │  ← Deeper shadow
└─────────────────┘

[Active - Muted]
┌─────────────────┐
│   ┌───────┐     │
│   │  🔇   │     │  ← Destructive color (red)
│   └───────┘     │  ← No pulse
│                 │
│                 │  ← No visualizer
│ Tap to unmute   │
└─────────────────┘

[Disabled - Not Connected]
┌─────────────────┐
│   ┌───────┐     │
│   │  🎤   │     │  ← Muted/gray color
│   └───────┘     │  ← No interaction
│                 │
│  Not connected  │
└─────────────────┘
```

### Connection Status Badge States

```
[Disconnected]
● Disconnected  ← Gray badge

[Connecting]
⟳ Connecting...  ← Yellow badge, spinner icon

[Connected]
● Connected  ← Green badge, checkmark (brief animation on connect)

[Error]
⚠ Error  ← Red badge, alert icon
```

### Conversation Card States

```
[Default]
┌───────────────────────────────────┐
│ Conversation Title                │
│ Message preview text...           │
│ 15 messages • 2 hours ago         │
└───────────────────────────────────┘
  ↑ shadow-sm

[Hover]
┌───────────────────────────────────┐
│ Conversation Title         [🗑️]  │  ← Delete appears
│ Message preview text...           │
│ 15 messages • 2 hours ago         │
└───────────────────────────────────┘
  ↑ shadow-md, scale 1.01x

[Focus]
┌───────────────────────────────────┐
│ Conversation Title         [🗑️]  │
│ Message preview text...           │
│ 15 messages • 2 hours ago         │
└───────────────────────────────────┘
  ↑ 2px primary color outline

[Deleting]
     ┌────────────────────────────┐
     │ Conversation Title    [🗑️]│  ← Sliding right + fading
     │ Message preview...        │
     └────────────────────────────┘
```

---

## Responsive Breakpoint Comparison

### Conversations List

```
MOBILE (< 640px)          TABLET (640-1024px)       DESKTOP (> 1024px)
┌─────────────────┐       ┌────────────────────┐    ┌──────────────────┐
│ Conversations   │       │   Conversations    │    │  Conversations   │
├─────────────────┤       │   [New Convo] ──→  │    │  [New Convo] ──→ │
│ ┌─────────────┐ │       ├────────────────────┤    ├──────────────────┤
│ │ Title       │ │       │ ┌────────────────┐ │    │ ┌──────────────┐ │
│ │ Preview...  │ │       │ │ Title          │ │    │ │ Title        │ │
│ │ meta        │ │       │ │ Preview text...│ │    │ │ Preview...   │ │
│ └─────────────┘ │       │ │ meta      [🗑️] │ │    │ │ meta    [🗑️] │ │
│                 │       │ └────────────────┘ │    │ └──────────────┘ │
│ ┌─────────────┐ │       │                    │    │                  │
│ │ Title       │ │       │ ┌────────────────┐ │    │ ┌──────────────┐ │
│ └─────────────┘ │       │ │ Title          │ │    │ │ Title        │ │
│            ╔═╗  │       │ └────────────────┘ │    │ └──────────────┘ │
│            ║+║  │       └────────────────────┘    └──────────────────┘
│            ╚═╝  │         ↑ Padding: 32px           ↑ Max-width: 768px
└─────────────────┘           Cards: 80px min-h          Centered
  ↑ FAB bottom-right          Delete on hover
    Full-width cards
```

### Active Conversation

```
MOBILE (< 640px)          TABLET (640-1024px)       DESKTOP (> 1024px)
┌─────────────────┐       ┌────────────────────┐    ┌──────────────────┐
│ Voice      [✕]  │       │ Voice     ● [Disc] │    │ Voice   ● [Disc] │
├─────────────────┤       ├────────────────────┤    ├──────────────────┤
│                 │       │                    │    │                  │
│ ┌─────────────┐ │       │  ┌───────────────┐ │    │  ┌─────────────┐ │
│ │ You: ...    │ │       │  │ You: ...      │ │    │  │ You: ...    │ │
│ └─────────────┘ │       │  └───────────────┘ │    │  └─────────────┘ │
│   ┌───────────┐ │       │    ┌─────────────┐ │    │    ┌───────────┐ │
│   │ AI: ...   │ │       │    │ AI: ...     │ │    │    │ AI: ...   │ │
│   └───────────┘ │       │    └─────────────┘ │    │    └───────────┘ │
│                 │       │                    │    │                  │
├─────────────────┤       ├────────────────────┤    ├──────────────────┤
│   ┌───────┐    │       │     ┌───────┐      │    │      ┌───────┐   │
│   │  🎤   │    │       │     │  🎤   │      │    │      │  🎤   │   │
│   └───────┘    │       │     └───────┘      │    │      └───────┘   │
│  ▂ ▄ ▆ █ ▆ ▄   │       │   ▂ ▄ ▆ █ ▆ ▄ ▂   │    │   ▂ ▄ ▆ █ ▆ ▄ ▂  │
└─────────────────┘       └────────────────────┘    └──────────────────┘
  ↑ Button: 80px            ↑ Button: 96px           ↑ Button: 112px
    Full-screen               Padded sides              Max-width: 896px
    Compact messages          Comfortable spacing       Spacious layout
```

---

## Accessibility Features Visualization

### Keyboard Navigation Flow

```
[Conversations List Page]

Tab 1: [New Conversation] Button
  ↓
Tab 2: [Conversation Card 1] (entire card focusable)
  ↓
Tab 3: [Delete Button] for Card 1
  ↓
Tab 4: [Conversation Card 2]
  ↓
Tab 5: [Delete Button] for Card 2
  ↓
... (continues)

  Enter/Space on Card → Navigate to Active Conversation
  Enter/Space on Delete → Show confirmation dialog

[Active Conversation Page]

Tab 1: [Disconnect] Button (top-right)
  ↓
Tab 2: [Mute/Unmute] Button (main control)
  ↓
Tab 3: [Message Area] (scrollable, can receive focus for screen reader)
  ↓
Tab 4: [Scroll to Bottom] Button (if visible)

  Space on Mute → Toggle mute
  Escape → Disconnect and return to home
```

### Screen Reader Announcements

```
[Connection Flow]
1. User clicks "Connect"
   Screen reader: "Connecting to Gemini Live"

2. Connection establishes
   Screen reader: "Connected. You can now start speaking."

3. User unmutes (starts speaking)
   Screen reader: "Microphone active. Listening."

4. User message appears
   Screen reader: "You said: How do I improve my public speaking?"

5. Assistant responds
   Screen reader: "Gemini responded: Great question! Public speaking..."

6. User mutes
   Screen reader: "Microphone muted"

7. User disconnects
   Screen reader: "Disconnected from Gemini Live. Returning to conversations."
```

### Focus Indicators

```
[Button Focus]
┌──────────────────────────┐
│    New Conversation      │
│  ┌────────────────────┐  │
│  │                    │  │  ← 2px primary color outline
│  │  [Button Content]  │  │  ← Visible 3px offset
│  │                    │  │
│  └────────────────────┘  │
└──────────────────────────┘

[Card Focus]
┌──────────────────────────────────┐
│  Conversation Title              │
│  Message preview...       [🗑️]  │  ← 2px primary outline
│  15 messages • 2 hours ago       │     around entire card
└──────────────────────────────────┘
```

---

## Color & Theming Reference

### Dark Theme Colors (Primary)

```
BACKGROUNDS:
- Page background: #0a0a0a (near-black)
- Card surface: #1a1a1a (dark gray)
- User message: #262626 (muted gray)
- Assistant message: #1a1a1a (same as card)

TEXT:
- Primary: #fafafa (near-white)
- Secondary: #a3a3a3 (medium gray)
- Tertiary: #737373 (muted gray)

SEMANTIC:
- Primary (Active): #3b82f6 (blue)
- Success (Connected): #22c55e (green)
- Warning (Connecting): #f59e0b (amber)
- Error (Disconnected): #ef4444 (red)
- Destructive (Delete/Muted): #dc2626 (deep red)

SHADOWS:
- sm: 0 1px 2px rgba(0,0,0,0.3)
- md: 0 4px 6px rgba(0,0,0,0.4)
- lg: 0 10px 15px rgba(0,0,0,0.5)
- xl: 0 20px 25px rgba(0,0,0,0.6)
```

### Component Color Mapping

```
[Connection Status Badge]
● Disconnected → text-gray-400 bg-gray-800
⟳ Connecting → text-amber-400 bg-amber-950
● Connected → text-green-400 bg-green-950
⚠ Error → text-red-400 bg-red-950

[Mute Button]
Unmuted → bg-primary-600 text-white (pulsing ring: primary-400)
Muted → bg-destructive text-white
Disabled → bg-gray-700 text-gray-500

[Message Bubbles]
User → bg-muted (gray-100 dark:gray-800)
Assistant → bg-card border-l-4 border-primary-500

[Buttons]
Primary → bg-primary-600 hover:bg-primary-700 text-white
Secondary → border border-input hover:bg-accent
Destructive → bg-destructive hover:bg-destructive/90 text-white
Ghost → hover:bg-accent
```

---

## Animation Specifications

### Pulsing Ring (Mute Button Active)

```css
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.mic-button-active {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Audio Visualizer Bars

```css
@keyframes visualizer-bar {
  0%, 100% {
    height: 8px;
  }
  50% {
    height: 32px;
  }
}

.visualizer-bar {
  width: 4px;
  background: currentColor;
  border-radius: 2px;
  animation: visualizer-bar 0.6s ease-in-out infinite;
}

.visualizer-bar:nth-child(1) { animation-delay: 0s; }
.visualizer-bar:nth-child(2) { animation-delay: 0.1s; }
.visualizer-bar:nth-child(3) { animation-delay: 0.2s; }
/* ... etc */
```

### Message Slide-In

```css
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-appear {
  animation: slide-up-fade 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Card Hover Scale

```css
.conversation-card {
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.conversation-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
}
```

### Delete Slide-Out

```css
@keyframes slide-right-fade {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.conversation-deleting {
  animation: slide-right-fade 300ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
```

---

## Summary

This wireframe document provides:
- ASCII wireframes for all major pages and states
- Component hierarchy breakdowns
- Interaction state visualizations
- Responsive layout comparisons
- Accessibility feature demonstrations
- Color and animation specifications

Use this document alongside `ux-gemini-live-conversations-plan.md` for complete implementation guidance.
