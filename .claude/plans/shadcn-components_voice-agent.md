# Voice Agent Platform - shadcn/ui Component Selection Plan

**Created**: 2025-11-18
**Type**: shadcn Component Selection
**Platform**: Voice Agent (White Library + Gemini Live)

---

## 1. shadcn/ui Components Required

### Existing Components (Already Installed)

**Location**: `/src/components/ui/`

#### `button`
- **Purpose**: Microphone controls, voice actions, form submissions
- **Radix Primitive**: `@radix-ui/react-slot`
- **Key Props**: `variant`, `size`, `asChild`
- **Accessibility**: Keyboard navigation, focus states, ARIA labels
- **Variants Available**: default, destructive, outline, secondary, ghost, link
- **Sizes Available**: default, sm, lg, icon

#### `input`
- **Purpose**: Text input for settings, configuration forms
- **Radix Primitive**: Native HTML input with styling
- **Key Props**: `type`, `disabled`, `placeholder`
- **Accessibility**: Label association, error announcements

#### `select`
- **Purpose**: Dropdown selections for model choice, audio device selection
- **Radix Primitive**: `@radix-ui/react-select`
- **Key Props**: `value`, `onValueChange`, `disabled`
- **Accessibility**: Keyboard navigation, ARIA announcements, screen reader support

---

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add slider
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add form
```

#### `badge` (NEW)
- **Purpose**: Connection status indicators (connected, disconnected, listening, speaking)
- **Radix Primitive**: Native div with CVA variants
- **Key Props**: `variant`
- **Accessibility**: ARIA live regions for status changes
- **Use Case**: Voice session status, WebSocket connection state

#### `alert` (NEW)
- **Purpose**: Error messages, warnings, connection issues
- **Radix Primitive**: Native div with semantic structure
- **Key Props**: `variant` (default, destructive)
- **Accessibility**: ARIA role="alert" for screen readers
- **Use Case**: WebSocket errors, microphone permission denials, API errors

#### `dialog` (NEW)
- **Purpose**: Settings panel, configuration modals, error details
- **Radix Primitive**: `@radix-ui/react-dialog`
- **Key Props**: `open`, `onOpenChange`, `modal`
- **Accessibility**: Focus trap, escape key, ARIA modal
- **Use Case**: Voice settings (API keys, model selection, audio device)

#### `toast` (NEW)
- **Purpose**: Temporary notifications (session started, connection lost, error occurred)
- **Radix Primitive**: `@radix-ui/react-toast`
- **Key Props**: `title`, `description`, `variant`, `duration`
- **Accessibility**: ARIA live region, dismissible
- **Use Case**: Non-blocking notifications for voice events

#### `switch` (NEW)
- **Purpose**: Toggle features (auto-reconnect, VAD, echo cancellation)
- **Radix Primitive**: `@radix-ui/react-switch`
- **Key Props**: `checked`, `onCheckedChange`, `disabled`
- **Accessibility**: Keyboard toggle, ARIA switch role
- **Use Case**: Voice settings toggles

#### `card` (NEW)
- **Purpose**: Session information containers, voice controls panel
- **Radix Primitive**: Native div with semantic structure
- **Key Props**: N/A (composition component)
- **Accessibility**: Semantic HTML structure
- **Use Case**: Voice session display, control panels

#### `scroll-area` (NEW)
- **Purpose**: Scrollable transcript display, message history
- **Radix Primitive**: `@radix-ui/react-scroll-area`
- **Key Props**: `type`, `scrollHideDelay`
- **Accessibility**: Keyboard scrolling, focus management
- **Use Case**: Live transcript, conversation history

#### `skeleton` (NEW)
- **Purpose**: Loading states for voice session initialization
- **Radix Primitive**: Native div with animation
- **Key Props**: `className` (for custom dimensions)
- **Accessibility**: ARIA busy state
- **Use Case**: Loading audio devices, initializing WebSocket

#### `separator` (NEW)
- **Purpose**: Visual separation between sections (White Library vs Gemini Live)
- **Radix Primitive**: `@radix-ui/react-separator`
- **Key Props**: `orientation`, `decorative`
- **Accessibility**: ARIA separator role
- **Use Case**: Section dividers in settings, UI layout

#### `tabs` (NEW)
- **Purpose**: Navigation between White Library and Gemini Live interfaces
- **Radix Primitive**: `@radix-ui/react-tabs`
- **Key Props**: `value`, `onValueChange`, `defaultValue`
- **Accessibility**: Keyboard navigation (arrow keys), ARIA tabs
- **Use Case**: Main navigation for voice agent modes

#### `label` (NEW)
- **Purpose**: Form labels for accessibility
- **Radix Primitive**: `@radix-ui/react-label`
- **Key Props**: `htmlFor`
- **Accessibility**: Proper label association
- **Use Case**: Settings form fields

#### `slider` (NEW)
- **Purpose**: Volume control, audio gain adjustment
- **Radix Primitive**: `@radix-ui/react-slider`
- **Key Props**: `value`, `onValueChange`, `min`, `max`, `step`
- **Accessibility**: Keyboard control (arrow keys), ARIA slider
- **Use Case**: Audio settings (volume, gain, threshold)

#### `tooltip` (NEW)
- **Purpose**: Contextual help for voice controls
- **Radix Primitive**: `@radix-ui/react-tooltip`
- **Key Props**: `content`, `side`, `delayDuration`
- **Accessibility**: Focus/hover triggered, ARIA describedby
- **Use Case**: Button explanations, status indicators

#### `form` (NEW)
- **Purpose**: Settings form with validation (React Hook Form integration)
- **Radix Primitive**: React Hook Form + Radix Label
- **Key Props**: Context-based (useFormContext)
- **Accessibility**: Error announcements, field validation
- **Use Case**: Voice configuration forms

---

## 2. Component Composition Strategy

### Gemini Live Voice Interface

#### Primary Composition: Voice Control Panel

**Base Components**: `card`, `button`, `badge`, `tooltip`
**Composition Approach**: Card container with status badge and control buttons

**Example Structure**:
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Atom: mic-button.tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="default" size="icon" onClick={handleMicToggle}>
      {isListening ? <MicOff /> : <Mic />}
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>{isListening ? 'Stop listening' : 'Start listening'}</p>
  </TooltipContent>
</Tooltip>

// Molecule: voice-controls.tsx
<Card>
  <CardHeader>
    <CardTitle>Voice Session</CardTitle>
    <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
      {connectionStatus}
    </Badge>
  </CardHeader>
  <CardContent>
    <div className="flex gap-2">
      <MicButton />
      <Button variant="outline">Settings</Button>
    </div>
  </CardContent>
</Card>
```

### Settings Panel Composition

**Pattern**: Dialog with Form
**Components**: `dialog`, `form`, `input`, `switch`, `select`, `label`, `button`
**Structure**:
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Voice Settings</DialogTitle>
    </DialogHeader>
    <Form {...form}>
      <FormField name="apiKey">
        <FormItem>
          <FormLabel>Gemini API Key</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Enter API key" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="model">
        <FormItem>
          <FormLabel>Model</FormLabel>
          <FormControl>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-2.5-flash-native-audio">Gemini 2.5 Flash</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="autoReconnect">
        <FormItem>
          <FormLabel>Auto Reconnect</FormLabel>
          <FormControl>
            <Switch />
          </FormControl>
        </FormItem>
      </FormField>
    </Form>
  </DialogContent>
</Dialog>
```

### Notification System Composition

**Pattern**: Toast Notifications
**Components**: `toast`
**Structure**:
```typescript
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// In voice hook
const { toast } = useToast()

// Connection established
toast({
  title: "Connected",
  description: "Voice session started successfully",
  variant: "default"
})

// Connection lost
toast({
  title: "Connection Lost",
  description: "Attempting to reconnect...",
  variant: "destructive",
  action: <ToastAction altText="Retry">Retry</ToastAction>
})
```

### Navigation Composition

**Pattern**: Tabs for Voice Mode Selection
**Components**: `tabs`
**Structure**:
```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="white-library">
  <TabsList>
    <TabsTrigger value="white-library">Chat Voice</TabsTrigger>
    <TabsTrigger value="gemini-live">Live Voice</TabsTrigger>
  </TabsList>

  <TabsContent value="white-library">
    {/* White Library integration */}
    <WhiteChatPage />
  </TabsContent>

  <TabsContent value="gemini-live">
    {/* Gemini Live custom UI */}
    <LiveVoiceSession />
  </TabsContent>
</Tabs>
```

### Session Display Composition

**Pattern**: Card with ScrollArea for Transcript
**Components**: `card`, `scroll-area`, `separator`
**Structure**:
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

<Card>
  <CardHeader>
    <CardTitle>Live Transcript</CardTitle>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[400px]">
      {messages.map((msg, idx) => (
        <div key={idx}>
          <p className={msg.role === 'user' ? 'text-blue-600' : 'text-gray-900'}>
            <strong>{msg.role}:</strong> {msg.text}
          </p>
          {idx < messages.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </ScrollArea>
  </CardContent>
</Card>
```

### Audio Controls Composition

**Pattern**: Slider for Volume Control
**Components**: `slider`, `label`, `card`
**Structure**:
```typescript
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label>Microphone Volume</Label>
  <Slider
    value={[volume]}
    onValueChange={(val) => setVolume(val[0])}
    min={0}
    max={100}
    step={1}
  />
  <p className="text-sm text-gray-500">{volume}%</p>
</div>
```

---

## 3. Component Variants and Customization

### Button Variants for Voice Controls

**Component**: `button`
**Available Variants**:
- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: default, sm, lg, icon

**Usage Examples**:
```typescript
// Primary microphone button
<Button variant="default" size="icon">
  <Mic />
</Button>

// Stop/disconnect button
<Button variant="destructive" size="default">
  Disconnect
</Button>

// Settings button
<Button variant="outline" size="sm">
  <Settings className="mr-2 h-4 w-4" />
  Settings
</Button>

// Mute button (ghost for subtle action)
<Button variant="ghost" size="icon">
  <MicOff />
</Button>
```

### Badge Variants for Connection States

**Component**: `badge`
**Available Variants**:
- `variant`: default, secondary, destructive, outline

**Voice State Mapping**:
```typescript
// Connection states
const connectionBadge = {
  connected: <Badge variant="default">Connected</Badge>,
  disconnected: <Badge variant="destructive">Disconnected</Badge>,
  connecting: <Badge variant="secondary">Connecting...</Badge>
}

// Voice activity states
const voiceStateBadge = {
  idle: <Badge variant="outline">Idle</Badge>,
  listening: <Badge variant="default">Listening</Badge>,
  speaking: <Badge variant="secondary">Speaking</Badge>
}
```

### Alert Variants for Error Types

**Component**: `alert`
**Available Variants**:
- `variant`: default, destructive

**Error Type Mapping**:
```typescript
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

// WebSocket error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Connection Failed</AlertTitle>
  <AlertDescription>
    Unable to connect to Gemini Live. Check your API key and network.
  </AlertDescription>
</Alert>

// Microphone permission
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Microphone Access Denied</AlertTitle>
  <AlertDescription>
    Please allow microphone access to use voice features.
  </AlertDescription>
</Alert>

// Informational
<Alert variant="default">
  <Info className="h-4 w-4" />
  <AlertTitle>Session Started</AlertTitle>
  <AlertDescription>
    Your voice session is active. Speak to interact.
  </AlertDescription>
</Alert>
```

### Custom Variants for Voice UI

**Tailwind Customization** (if needed beyond shadcn):
```css
/* Voice state color scheme */
.voice-idle {
  @apply bg-gray-100 text-gray-700;
}

.voice-listening {
  @apply bg-blue-100 text-blue-700 animate-pulse;
}

.voice-speaking {
  @apply bg-green-100 text-green-700;
}

.voice-error {
  @apply bg-red-100 text-red-700;
}

/* Audio visualizer animation */
.audio-wave {
  @apply animate-pulse;
}
```

**Animation Classes for Audio Visualizations**:
- Use Tailwind `animate-pulse` for listening state
- Use Tailwind `animate-spin` for loading states
- Consider custom `@keyframes` for waveform animations

---

## 4. White Library Integration

### Minimal shadcn Overlap Strategy

**White Library Provides**:
- `ChatPage` (full chat UI)
- `ChatInput` (message input with MediaRecorder)
- `ChatHeader` (chat header)
- `ChatMessage` (message bubbles)
- Built-in session management
- Audio recording/playback

**shadcn Components to Use Alongside White Library**:

#### `dialog` - Settings Panel
**Use Case**: Configuration for White Library webhook URL, theme settings
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button variant="ghost" size="icon">
      <Settings />
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Chat Voice Settings</DialogTitle>
    </DialogHeader>
    <Form>
      <FormField name="webhookUrl">
        <FormLabel>Webhook URL</FormLabel>
        <Input placeholder="https://api.example.com/webhook" />
      </FormField>
    </Form>
  </DialogContent>
</Dialog>
```

#### `toast` - Notifications
**Use Case**: Session expiration warnings, upload errors
```typescript
// Session expiring soon (White Library 2h limit)
toast({
  title: "Session Expiring",
  description: "Your chat session will expire in 10 minutes",
  variant: "default"
})
```

#### `tabs` - Navigation Between Voice Modes
**Use Case**: Switch between White Library and Gemini Live
```typescript
<Tabs defaultValue="chat-voice">
  <TabsList>
    <TabsTrigger value="chat-voice">Chat Voice</TabsTrigger>
    <TabsTrigger value="live-voice">Live Voice</TabsTrigger>
  </TabsList>

  <TabsContent value="chat-voice">
    <WhiteLibraryChatPage />
  </TabsContent>

  <TabsContent value="live-voice">
    <GeminiLiveSession />
  </TabsContent>
</Tabs>
```

#### `separator` - Visual Separation
**Use Case**: Separate White Library UI from settings/controls
```typescript
<div>
  <WhiteLibraryChatPage />
  <Separator className="my-4" />
  <VoiceSettings />
</div>
```

---

## 5. Shared Components Across Voice Modes

### Navigation Components

#### `tabs` - Main Voice Mode Navigation
**Purpose**: Switch between White Library (chat-based) and Gemini Live (streaming)
**Usage**:
```typescript
<Tabs defaultValue="white-library">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="white-library">
      <MessageSquare className="mr-2 h-4 w-4" />
      Chat Voice
    </TabsTrigger>
    <TabsTrigger value="gemini-live">
      <Mic className="mr-2 h-4 w-4" />
      Live Voice
    </TabsTrigger>
  </TabsList>
</Tabs>
```

### Layout Components

#### `card` - Container for Both Voice UIs
**Purpose**: Consistent layout for voice interfaces
```typescript
// White Library container
<Card>
  <CardHeader>
    <CardTitle>Voice Chat</CardTitle>
  </CardHeader>
  <CardContent>
    <WhiteLibraryChatPage />
  </CardContent>
</Card>

// Gemini Live container
<Card>
  <CardHeader>
    <CardTitle>Live Voice Session</CardTitle>
    <Badge variant={status}>...</Badge>
  </CardHeader>
  <CardContent>
    <LiveVoiceSession />
  </CardContent>
</Card>
```

#### `separator` - Section Dividers
**Purpose**: Separate settings, controls, transcript sections
```typescript
<div>
  <VoiceControls />
  <Separator className="my-4" />
  <TranscriptDisplay />
  <Separator className="my-4" />
  <VoiceSettings />
</div>
```

### Form Components for Settings

#### `form` + `input` + `label` + `switch` + `select`
**Purpose**: Unified settings panel for both voice modes
```typescript
<Form {...form}>
  {/* Shared: API Key */}
  <FormField name="geminiApiKey">
    <FormLabel>Gemini API Key</FormLabel>
    <Input type="password" />
  </FormField>

  {/* Gemini Live specific: Model selection */}
  <FormField name="model">
    <FormLabel>Model</FormLabel>
    <Select>...</Select>
  </FormField>

  {/* White Library specific: Webhook URL */}
  <FormField name="webhookUrl">
    <FormLabel>Webhook URL</FormLabel>
    <Input type="url" />
  </FormField>

  {/* Shared: Auto-reconnect */}
  <FormField name="autoReconnect">
    <FormLabel>Auto Reconnect</FormLabel>
    <Switch />
  </FormField>
</Form>
```

### Feedback Components

#### `toast` - Global Notifications
**Purpose**: Notifications for both voice systems
```typescript
// White Library: Upload complete
toast({
  title: "Voice Message Sent",
  description: "Your audio message was delivered"
})

// Gemini Live: Connection status
toast({
  title: "Connected to Gemini Live",
  description: "Voice session is now active"
})
```

#### `alert` - Error Display
**Purpose**: Error messages for both systems
```typescript
// White Library: Webhook error
<Alert variant="destructive">
  <AlertTitle>Upload Failed</AlertTitle>
  <AlertDescription>Could not send voice message to webhook</AlertDescription>
</Alert>

// Gemini Live: WebSocket error
<Alert variant="destructive">
  <AlertTitle>Connection Failed</AlertTitle>
  <AlertDescription>Could not establish WebSocket connection</AlertDescription>
</Alert>
```

#### `skeleton` - Loading States
**Purpose**: Loading for both voice systems
```typescript
// White Library: Loading chat history
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-[200px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-[400px] w-full" />
  </CardContent>
</Card>

// Gemini Live: Initializing audio
<div className="space-y-2">
  <Skeleton className="h-4 w-[150px]" />
  <Skeleton className="h-10 w-full" />
</div>
```

---

## 6. shadcn/ui Accessibility Features

### Built-in Accessibility from Radix Primitives

**Radix UI provides automatic accessibility** for all shadcn components:

#### Keyboard Navigation
- **Dialog**: `Escape` to close, focus trap inside modal
- **Select**: Arrow keys to navigate options, `Enter` to select
- **Switch**: `Space` to toggle
- **Slider**: Arrow keys to adjust value
- **Tabs**: Arrow keys to switch tabs

#### ARIA Attributes
- **Dialog**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Alert**: `role="alert"` for screen reader announcements
- **Badge**: `aria-live="polite"` for status changes
- **Toast**: `aria-live="assertive"` for important notifications
- **Switch**: `role="switch"`, `aria-checked`

#### Focus Management
- **Dialog**: Traps focus inside modal, restores focus on close
- **Popover**: Manages focus between trigger and content
- **Tooltip**: Focus/hover triggers with keyboard support

#### Screen Reader Support
- **Form**: Proper label associations via `htmlFor`
- **Select**: Announces selected option
- **Alert**: Announces error messages
- **Toast**: Announces notifications

### Accessibility Requirements for Voice UI

**Note**: Pass to UX designer for full accessibility plan. shadcn handles primitives.

#### Voice-Specific Accessibility Needs

**Labels for Voice Controls**:
```typescript
<Button aria-label="Start listening" onClick={handleMicToggle}>
  <Mic />
</Button>

<Badge aria-label={`Connection status: ${status}`}>
  {status}
</Badge>
```

**Live Regions for Voice States**:
```typescript
<div aria-live="polite" aria-atomic="true">
  {isListening && "Now listening..."}
  {isSpeaking && "AI is speaking..."}
</div>
```

**Descriptions for Audio Controls**:
```typescript
<Slider
  aria-label="Microphone volume"
  aria-valuetext={`${volume} percent`}
  value={[volume]}
/>
```

**Error Announcements**:
```typescript
<Alert variant="destructive" role="alert">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Microphone access denied</AlertDescription>
</Alert>
```

**Keyboard Shortcuts**:
- Coordinate with UX designer for voice-specific shortcuts
- Example: `Space` to toggle microphone, `Escape` to stop session

---

## 7. Installation Verification

After running installation commands, verify:

### 1. Components Exist
```bash
ls -la /home/ajosecortes/development/freelancer/agent-voice/src/components/ui/
```

**Expected files**:
- ✅ `button.tsx` (already exists)
- ✅ `input.tsx` (already exists)
- ✅ `select.tsx` (already exists)
- 🆕 `badge.tsx`
- 🆕 `alert.tsx`
- 🆕 `dialog.tsx`
- 🆕 `toast.tsx`
- 🆕 `toaster.tsx` (added with toast)
- 🆕 `use-toast.ts` (hook added with toast)
- 🆕 `switch.tsx`
- 🆕 `card.tsx`
- 🆕 `scroll-area.tsx`
- 🆕 `skeleton.tsx`
- 🆕 `separator.tsx`
- 🆕 `tabs.tsx`
- 🆕 `label.tsx`
- 🆕 `slider.tsx`
- 🆕 `tooltip.tsx`
- 🆕 `form.tsx`

### 2. Dependencies Installed
```bash
grep -E "radix-ui|class-variance-authority" /home/ajosecortes/development/freelancer/agent-voice/package.json
```

**Expected dependencies**:
- `@radix-ui/react-dialog`
- `@radix-ui/react-toast`
- `@radix-ui/react-switch`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-separator`
- `@radix-ui/react-tabs`
- `@radix-ui/react-label`
- `@radix-ui/react-slider`
- `@radix-ui/react-tooltip`

### 3. Types Available
```typescript
// Test imports in a TypeScript file
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
// ... should have TypeScript autocomplete
```

### 4. Imports Work
```typescript
// Verify no TypeScript errors
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { Dialog } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip } from "@/components/ui/tooltip"
import { Form } from "@/components/ui/form"
```

---

## 8. Integration Notes

### Props to Configure

#### `button` - Voice Controls
- `variant`: "default" (primary mic), "destructive" (disconnect), "outline" (settings)
- `size`: "icon" (mic button), "default" (text buttons)
- `onClick`: Voice action handlers
- `disabled`: When session is disconnected
- `aria-label`: Accessibility labels

#### `badge` - Status Indicators
- `variant`: "default" (connected), "destructive" (error), "secondary" (processing)
- `children`: Status text

#### `dialog` - Settings Panel
- `open`: Controlled state
- `onOpenChange`: Handler for open/close
- `modal`: true (trap focus)

#### `toast` - Notifications
- `title`: Notification title
- `description`: Notification message
- `variant`: "default" or "destructive"
- `duration`: Auto-dismiss time (ms)
- `action`: Optional action button

#### `switch` - Settings Toggles
- `checked`: Boolean state
- `onCheckedChange`: Toggle handler
- `disabled`: When option is unavailable

#### `select` - Dropdowns
- `value`: Selected value
- `onValueChange`: Selection handler
- `disabled`: When options are loading

#### `slider` - Audio Controls
- `value`: Array with current value
- `onValueChange`: Handler for value changes
- `min`, `max`, `step`: Range configuration

#### `tabs` - Navigation
- `value`: Active tab
- `onValueChange`: Tab switch handler
- `defaultValue`: Initial tab

### Event Handlers Needed

#### Voice Session Events
- `onMicToggle`: Start/stop microphone
- `onConnect`: Establish WebSocket connection
- `onDisconnect`: Close WebSocket connection
- `onError`: Handle connection/microphone errors
- `onVoiceStart`: User starts speaking
- `onVoiceEnd`: User stops speaking
- `onAIStart`: AI starts speaking
- `onAIEnd`: AI stops speaking

#### Settings Events
- `onSettingsOpen`: Open settings dialog
- `onSettingsClose`: Close settings dialog
- `onSettingsSave`: Save settings to store
- `onModelChange`: Change Gemini model
- `onDeviceChange`: Change audio input device
- `onVolumeChange`: Adjust microphone volume

#### Form Events
- `onSubmit`: Settings form submission (React Hook Form)
- `onChange`: Individual field changes
- `onBlur`: Field validation triggers

### Styling Considerations

#### Tailwind Classes
```typescript
// Voice control panel layout
<div className="flex flex-col gap-4 p-6">
  <div className="flex items-center justify-between">
    {/* Header with badge */}
  </div>
  <div className="flex gap-2">
    {/* Button group */}
  </div>
</div>

// Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* White Library */}
  {/* Gemini Live */}
</div>
```

#### CSS Variables (Theming)
shadcn uses CSS variables defined in `globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  /* ... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

**Voice-specific colors** (add to CSS variables if needed):
```css
:root {
  --voice-idle: 240 5% 64%;
  --voice-listening: 221 83% 53%;
  --voice-speaking: 142 76% 36%;
  --voice-error: 0 84% 60%;
}
```

#### Dark Mode
**Automatic with shadcn**: Components support dark mode via CSS variables
```typescript
// Toggle dark mode (use next-themes)
import { useTheme } from "next-themes"

const { theme, setTheme } = useTheme()

<Switch
  checked={theme === "dark"}
  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
/>
```

---

## 9. Important Notes

### Critical Rules

- **NEVER modify shadcn source files** in `@/components/ui/`
- **Composition over modification**: Wrap components, don't edit them
- **Check registry first**: Component might already exist (button, input, select already installed)
- **Use variants**: Don't create new components for style changes
- **Coordinate with UX designer**: For full component architecture and custom designs

### Best Practices

#### Component Organization
```
src/
├── components/
│   ├── ui/                    # shadcn components (immutable)
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── atoms/                 # Project-specific atoms
│   │   ├── mic-button.tsx     # Wraps ui/button
│   │   └── status-badge.tsx   # Wraps ui/badge
│   ├── molecules/
│   │   ├── voice-controls.tsx # Composes atoms
│   │   └── settings-form.tsx
│   └── organisms/
│       ├── live-voice-session.tsx
│       └── white-chat-wrapper.tsx
```

#### Composition Pattern
```typescript
// DON'T: Modify shadcn component
// ❌ src/components/ui/button.tsx
export function Button({ ... }) {
  // Added custom voice logic - WRONG!
}

// DO: Compose shadcn component
// ✅ src/components/atoms/mic-button.tsx
import { Button } from "@/components/ui/button"

export function MicButton({ isListening, onToggle }) {
  return (
    <Button
      variant={isListening ? "destructive" : "default"}
      size="icon"
      onClick={onToggle}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <MicOff /> : <Mic />}
    </Button>
  )
}
```

#### Variant Extension (if needed)
```typescript
// If shadcn variants aren't enough, use CVA in parent component
// ✅ src/components/atoms/voice-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cva } from "class-variance-authority"

const voiceBadgeVariants = cva("", {
  variants: {
    voiceState: {
      idle: "bg-gray-100 text-gray-700",
      listening: "bg-blue-100 text-blue-700 animate-pulse",
      speaking: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700"
    }
  }
})

export function VoiceBadge({ voiceState }) {
  return (
    <Badge className={voiceBadgeVariants({ voiceState })}>
      {voiceState}
    </Badge>
  )
}
```

### Performance Considerations

#### Lazy Loading Components
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const GeminiLiveSession = dynamic(
  () => import('@/components/organisms/live-voice-session'),
  { loading: () => <Skeleton className="h-[600px]" /> }
)
```

#### Memoization
```typescript
// Memoize expensive compositions
import { memo } from 'react'

export const VoiceControls = memo(({ status, onAction }) => {
  return (
    <Card>...</Card>
  )
})
```

---

## 10. Next Steps for Parent Agent

### 1. Run Installation Commands
```bash
cd /home/ajosecortes/development/freelancer/agent-voice

pnpm dlx shadcn@latest add badge alert dialog toast switch card scroll-area skeleton separator tabs label slider tooltip form
```

### 2. Verify Components
```bash
# Check components were installed
ls -la src/components/ui/

# Check dependencies
grep "@radix-ui" package.json
```

### 3. Add Toaster to Layout
```typescript
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### 4. Coordinate with UX Designer
- Pass this plan to UX designer for full component architecture
- UX designer will create detailed designs for voice UI
- UX designer will define text maps for all UI strings
- UX designer will specify custom animations for audio visualizations

### 5. Implement Composition
- Create atoms using shadcn components (`mic-button.tsx`, `status-badge.tsx`)
- Create molecules composing atoms (`voice-controls.tsx`, `settings-form.tsx`)
- Create organisms for full features (`live-voice-session.tsx`)

### 6. Test Accessibility
- Test keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Test screen reader announcements
- Test focus management in dialogs
- Test ARIA live regions for voice state changes

### 7. Integration Testing
- Test White Library with shadcn navigation (Tabs)
- Test Gemini Live with shadcn controls
- Test settings persistence
- Test error handling with Alerts and Toasts

---

## Summary

**shadcn Components Selected**:
- **button** (EXISTING - reuse for voice controls)
- **input** (EXISTING - reuse for settings)
- **select** (EXISTING - reuse for model/device selection)
- **badge** (NEW - connection status)
- **alert** (NEW - error display)
- **dialog** (NEW - settings panel)
- **toast** (NEW - notifications)
- **switch** (NEW - feature toggles)
- **card** (NEW - layout containers)
- **scroll-area** (NEW - transcript display)
- **skeleton** (NEW - loading states)
- **separator** (NEW - section dividers)
- **tabs** (NEW - navigation)
- **label** (NEW - form labels)
- **slider** (NEW - volume controls)
- **tooltip** (NEW - help text)
- **form** (NEW - settings forms)

**Installation Required**:
```bash
pnpm dlx shadcn@latest add badge alert dialog toast switch card scroll-area skeleton separator tabs label slider tooltip form
```

**Composition Strategy**:
- Primary: Card + Button + Badge for voice controls
- Pattern: Dialog + Form for settings
- Pattern: Tabs for navigation between voice modes
- Pattern: Toast for notifications
- Pattern: ScrollArea + Card for transcript display

**Radix Primitives Used**:
- `@radix-ui/react-dialog` → provides focus trap, keyboard handling, ARIA modal
- `@radix-ui/react-toast` → provides ARIA live regions, auto-dismiss
- `@radix-ui/react-switch` → provides keyboard toggle, ARIA switch role
- `@radix-ui/react-scroll-area` → provides accessible scrolling
- `@radix-ui/react-separator` → provides ARIA separator role
- `@radix-ui/react-tabs` → provides keyboard navigation (arrow keys)
- `@radix-ui/react-label` → provides proper label association
- `@radix-ui/react-slider` → provides keyboard control (arrow keys)
- `@radix-ui/react-tooltip` → provides focus/hover triggers

**Key Integration Points**:
- White Library: Minimal shadcn (just Tabs, Dialog, Toast)
- Gemini Live: Full shadcn component suite
- Shared: Tabs navigation, Settings dialog, Toast notifications

**Accessibility Handled**:
- Keyboard navigation: automatic from Radix
- ARIA attributes: automatic from Radix
- Focus management: automatic from Radix
- Screen reader: announcements included

**Next Steps**:
1. Parent runs installation commands
2. UX designer creates full component architecture
3. Parent implements composition as specified
4. Test accessibility features
5. Integrate with voice domain logic
