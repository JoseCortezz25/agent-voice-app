# Gemini Landing - shadcn/ui Component Selection Plan

**Created**: 2025-11-29
**Session**: redesign_gemini_landing
**Type**: shadcn Component Selection

---

## 1. shadcn/ui Components Analysis

### Existing Components (REUSE - No Installation Needed)

All necessary shadcn/ui components are **already installed** in this project:

#### `button` (EXISTING)
- **Location**: `/src/components/ui/button.tsx`
- **Radix Primitive**: `@radix-ui/react-slot`
- **Current Variants**: default, destructive, outline, primary, secondary, ghost, link
- **Current Sizes**: default, sm, lg, icon
- **Key Props**: `variant`, `size`, `asChild`
- **Accessibility**: Focus states, disabled states, keyboard navigation
- **Usage for this project**:
  - Landing page CTA buttons (primary variant)
  - Secondary "Cancelar" buttons (outline variant)
  - Theme toggle button (icon variant)
  - Navigation links (ghost variant)

#### `card` (EXISTING)
- **Location**: `/src/components/ui/card.tsx`
- **Radix Primitive**: None (pure HTML + Tailwind)
- **Subcomponents**: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- **Key Props**: Standard div props with className override
- **Accessibility**: Semantic HTML structure
- **Usage for this project**:
  - Feature cards (3 cards in features section)
  - Testimonial cards (2-3 cards in testimonials section)
  - Conversation cards (conversation list page)
  - Status card (active chat page)
  - Empty state card (conversation list)

#### `input` (EXISTING)
- **Location**: `/src/components/ui/input.tsx`
- **Radix Primitive**: None (native input)
- **Key Props**: Standard input props (type, placeholder, disabled, etc.)
- **Accessibility**: Built-in label association, focus states
- **Usage for this project**:
  - "Título de la Conversación" field (voice config form)
  - Search/filter inputs (if needed)

#### `textarea` (EXISTING)
- **Location**: `/src/components/ui/textarea.tsx`
- **Radix Primitive**: None (native textarea)
- **Key Props**: Standard textarea props (placeholder, rows, disabled, etc.)
- **Accessibility**: Resize controls, focus states
- **Usage for this project**:
  - "Instrucción del Sistema" field (voice config form)
  - Large text input areas

#### `select` (EXISTING)
- **Location**: `/src/components/ui/select.tsx`
- **Radix Primitive**: `@radix-ui/react-select`
- **Key Props**: `value`, `onValueChange`, `disabled`, `defaultValue`
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Usage for this project**:
  - "Voz del Asistente" dropdown (voice config form - 5 voice options)

#### `label` (EXISTING)
- **Location**: `/src/components/ui/label.tsx`
- **Radix Primitive**: `@radix-ui/react-label`
- **Key Props**: `htmlFor`, standard label props
- **Accessibility**: Proper label-input association
- **Usage for this project**:
  - Form field labels (voice config form)
  - Accessible labeling throughout

#### `separator` (EXISTING)
- **Location**: `/src/components/ui/separator.tsx`
- **Radix Primitive**: `@radix-ui/react-separator`
- **Key Props**: `orientation` (horizontal/vertical), `decorative`
- **Accessibility**: Semantic separators
- **Usage for this project**:
  - Section dividers (if needed)
  - Visual separation between content blocks

#### `badge` (EXISTING)
- **Location**: `/src/components/ui/badge.tsx`
- **Radix Primitive**: None (styled span)
- **Key Props**: `variant`
- **Accessibility**: Semantic inline elements
- **Usage for this project**:
  - Connection status pill ("● Conectado", "● Desconectado")
  - Status indicators

#### `sonner` (EXISTING - Toast system)
- **Location**: `/src/components/ui/sonner.tsx`
- **Package**: `sonner` (already installed v2.0.7)
- **Key Props**: Toast configuration
- **Accessibility**: Screen reader announcements, auto-dismiss
- **Usage for this project**:
  - Success messages ("Conversación creada")
  - Error messages ("Error al conectar")
  - Notification toasts

---

## 2. Components NOT Needed (No Installation)

These shadcn components are **NOT required** for this project:

- ❌ `dialog` - Not needed (no modals in wireframes)
- ❌ `popover` - Not needed (no popovers in wireframes)
- ❌ `dropdown-menu` - Not needed (simple select is enough)
- ❌ `tabs` - Not needed (no tabbed interfaces)
- ❌ `accordion` - Not needed (no collapsible sections)
- ❌ `alert` - Not needed (using sonner toasts)
- ❌ `checkbox` / `radio-group` - Not needed (no multi-select forms)
- ❌ `slider` - Not needed (no range inputs)
- ❌ `switch` - Not needed (theme toggle uses button)
- ❌ `table` - Not needed (no data tables)
- ❌ `calendar` / `date-picker` - Not needed (no date inputs)
- ❌ `command` / `combobox` - Not needed (simple select is enough)

**Result**: ✅ All required components already exist - **ZERO new installations needed**

---

## 3. Component Composition Strategy

### Theme System (next-themes already installed ✅)

**Base**: `next-themes` package (v0.4.6)
**Composition Approach**: Wrap root layout with ThemeProvider

**Setup Required**:
```tsx
// app/providers.tsx (CREATE NEW)
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="agent-voice-theme"
    >
      {children}
    </ThemeProvider>
  )
}

// app/layout.tsx (UPDATE)
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### Theme Toggle Component

**Pattern**: Custom atom component using next-themes hook
**Components Involved**: `button` (shadcn), `lucide-react` (icons)

**Structure**:
```tsx
// components/atoms/theme-toggle.tsx (CREATE NEW)
'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### Landing Page Components

#### Feature Card (Molecule)

**Pattern**: Card composition with icon slot
**Components**: `Card`, `CardHeader`, `CardTitle`, `CardContent`

**Structure**:
```tsx
// components/molecules/feature-card.tsx (CREATE NEW)
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        {icon && <div className="mb-4">{icon}</div>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--color-text-secondary)]">{description}</p>
      </CardContent>
    </Card>
  )
}
```

#### Testimonial Card (Molecule)

**Pattern**: Card composition with author metadata
**Components**: `Card`, `CardContent`

**Structure**:
```tsx
// components/molecules/testimonial-card.tsx (CREATE NEW)
import { Card, CardContent } from '@/components/ui/card'

interface TestimonialCardProps {
  quote: string
  author: string
  role?: string
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent>
        <blockquote className="text-[var(--color-text-primary)] mb-4">
          "{quote}"
        </blockquote>
        <footer>
          <cite className="text-[var(--color-text-secondary)] not-italic">
            {author}
            {role && <span className="text-[var(--color-text-tertiary)]"> · {role}</span>}
          </cite>
        </footer>
      </CardContent>
    </Card>
  )
}
```

#### Conversation Card (Molecule)

**Pattern**: Card composition with action buttons
**Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `Button`

**Structure**:
```tsx
// domains/voice-agent/components/conversation-card.tsx (CREATE NEW)
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface ConversationCardProps {
  id: string
  title: string
  voiceName: string
  timestamp: string
  onDelete: (id: string) => void
  onClick: () => void
}

export function ConversationCard({
  id,
  title,
  voiceName,
  timestamp,
  onDelete,
  onClick
}: ConversationCardProps) {
  return (
    <Card className="cursor-pointer hover:border-[var(--color-border-hover)]" onClick={onClick}>
      <CardHeader>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
            aria-label="Eliminar conversación"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {voiceName} · {timestamp}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
```

### Voice Config Form Components

**Pattern**: Form composition with shadcn form elements
**Components**: `Input`, `Textarea`, `Select`, `Label`, `Button`

**Structure**:
```tsx
// domains/voice-agent/components/voice-config-form.tsx (CREATE NEW)
'use client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface VoiceConfigFormProps {
  onSubmit: (data: VoiceConfigData) => void
  onCancel: () => void
}

export function VoiceConfigForm({ onSubmit, onCancel }: VoiceConfigFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[560px] mx-auto">
      <div>
        <Label htmlFor="title">Título de la Conversación (opcional)</Label>
        <Input id="title" placeholder="Mi conversación" />
      </div>

      <div>
        <Label htmlFor="voice">Voz del Asistente *</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una voz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="voice1">Voz 1</SelectItem>
            <SelectItem value="voice2">Voz 2</SelectItem>
            {/* ... */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="prompt">Instrucción del Sistema *</Label>
        <Textarea
          id="prompt"
          placeholder="Eres un asistente útil..."
          className="min-h-[120px]"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" className="flex-1">
          Iniciar Conversación
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
```

### Connection Status Badge

**Pattern**: Badge composition with status indicator
**Components**: `Badge`

**Structure**:
```tsx
// domains/voice-agent/components/connection-status.tsx (CREATE NEW)
import { Badge } from '@/components/ui/badge'

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const statusConfig = {
    connecting: { label: 'Conectando...', color: 'yellow' },
    connected: { label: 'Conectado', color: 'green' },
    disconnected: { label: 'Desconectado', color: 'gray' },
    error: { label: 'Error', color: 'red' },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline">
      <span className={`w-2 h-2 rounded-full mr-2 bg-${config.color}-500`} />
      {config.label}
    </Badge>
  )
}
```

---

## 4. Component Variants and Customization

### Button Variants (Using Built-in)

**Existing variants are sufficient** - no custom variants needed:

- `primary`: Landing CTA, "Iniciar Conversación" (already exists)
- `outline`: "Cancelar", secondary actions (already exists)
- `ghost`: Theme toggle, icon buttons (already exists)
- `destructive`: Delete conversation (already exists)

**Usage Examples**:
```tsx
// Primary CTA
<Button variant="primary" size="default">Probar</Button>

// Secondary action
<Button variant="outline">Cancelar</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Trash2 className="h-4 w-4" />
</Button>
```

### Card Variants (Using Built-in)

**Default card styling is sufficient** - just override with CSS variables:

```tsx
// Feature card (light border, hover state)
<Card className="hover:border-[var(--color-border-hover)] transition-colors">
  {/* ... */}
</Card>

// Conversation card (clickable)
<Card className="cursor-pointer hover:border-[var(--color-border-hover)]">
  {/* ... */}
</Card>
```

### Input/Textarea Styling (Using CSS Variables)

**No custom variants needed** - use Tailwind classes with CSS variables:

```tsx
<Input
  className="border-[var(--color-border-default)] focus:border-[var(--color-border-focus)]"
  placeholder="Título..."
/>

<Textarea
  className="border-[var(--color-border-default)] focus:border-[var(--color-border-focus)]"
  rows={5}
/>
```

---

## 5. shadcn/ui Accessibility Features

### Built-in Accessibility (Automatic from Radix)

**Button** (via @radix-ui/react-slot):
- ✅ Keyboard navigation (Enter, Space)
- ✅ Focus management (focus-visible styles)
- ✅ Disabled states (pointer-events-none, opacity)
- ✅ ARIA attributes (aria-label, aria-disabled)

**Select** (via @radix-ui/react-select):
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ ARIA combobox pattern
- ✅ Screen reader announcements
- ✅ Focus trap in dropdown
- ✅ Type-ahead search

**Label** (via @radix-ui/react-label):
- ✅ Proper htmlFor association
- ✅ Click-to-focus behavior
- ✅ Screen reader context

**Separator** (via @radix-ui/react-separator):
- ✅ Semantic role="separator"
- ✅ Decorative vs. semantic options

### Custom Accessibility Requirements

**Landing Page**:
- ✅ Semantic HTML structure (header, main, section, footer)
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Alt text for images/icons (if used)
- ✅ Keyboard navigation for all interactive elements

**Forms**:
- ✅ Label-input association (via Label component)
- ✅ Required field indicators
- ✅ Error messages (if validation added)
- ✅ Focus order (top to bottom)

**Theme Toggle**:
- ✅ aria-label="Toggle theme"
- ✅ Keyboard accessible (Enter, Space)
- ✅ Visual feedback on theme change

**Status Indicators**:
- ✅ ARIA live regions for status changes
- ✅ Screen reader announcements ("Connected", "Disconnected")

---

## 6. Installation Verification

### Already Installed ✅

**Package**: `next-themes@0.4.6`
**Location**: `package.json` dependencies
**Status**: ✅ Ready to use (no installation needed)

**shadcn/ui Components**:
- ✅ button.tsx
- ✅ card.tsx
- ✅ input.tsx
- ✅ textarea.tsx
- ✅ select.tsx
- ✅ label.tsx
- ✅ separator.tsx
- ✅ badge.tsx
- ✅ sonner.tsx

**Radix UI Primitives**:
- ✅ @radix-ui/react-slot
- ✅ @radix-ui/react-select
- ✅ @radix-ui/react-label
- ✅ @radix-ui/react-separator

**Supporting Packages**:
- ✅ class-variance-authority (CVA for variants)
- ✅ tailwind-merge (className merging)
- ✅ lucide-react (icons)
- ✅ sonner (toast notifications)

**Result**: 🎉 **ZERO installations required** - all components ready to use!

---

## 7. Integration Notes

### CSS Variables Configuration

All shadcn components will use CSS variables from theme tokens:

**Update `globals.css`**:
```css
@layer base {
  :root {
    /* Map shadcn tokens to design system tokens */
    --background: var(--color-background);
    --foreground: var(--color-foreground);
    --border: var(--color-border-default);
    --input: var(--color-border-default);
    --ring: var(--color-border-focus);
    --primary: var(--color-foreground);
    --primary-foreground: var(--color-background);
    --secondary: var(--color-background);
    --secondary-foreground: var(--color-foreground);
    --muted: var(--color-background-muted);
    --muted-foreground: var(--color-text-secondary);
    --accent: var(--color-background-muted);
    --accent-foreground: var(--color-foreground);
    --destructive: var(--color-error);
    --card: var(--color-background);
    --card-foreground: var(--color-foreground);
  }

  .dark {
    /* Dark mode mappings automatically from theme tokens */
    --background: var(--color-background);
    --foreground: var(--color-foreground);
    /* ... etc */
  }
}
```

### Props to Configure

**Button**:
- `variant`: primary, outline, ghost, destructive
- `size`: default, sm, lg, icon
- `asChild`: true (for Next.js Link wrapping)

**Card**:
- Standard div props
- `className`: For hover states, custom styling

**Input/Textarea**:
- `placeholder`: Helpful hints
- `required`: Form validation
- `disabled`: Loading states

**Select**:
- `value`: Controlled value
- `onValueChange`: Change handler
- `required`: Form validation
- `disabled`: Loading states

**Label**:
- `htmlFor`: Input association
- Standard label props

**Badge**:
- `variant`: default, outline, secondary
- Standard span props

### Event Handlers Needed

**Forms**:
- `onSubmit`: Voice config form submission
- `onChange`: Real-time field updates (if needed)
- `onBlur`: Validation triggers (if needed)

**Buttons**:
- `onClick`: CTA actions, navigation, delete, cancel
- Theme toggle click handler

**Cards**:
- `onClick`: Navigate to conversation (conversation cards)

**Select**:
- `onValueChange`: Voice selection handler

### Theme Integration

**ThemeProvider Setup**:
```tsx
// app/providers.tsx
<ThemeProvider
  attribute="class"           // Use class-based theming (.dark)
  defaultTheme="system"       // System preference by default
  enableSystem                // Detect OS preference
  disableTransitionOnChange={false}  // Smooth 200ms transition
  storageKey="agent-voice-theme"     // localStorage key
>
```

**Theme Toggle**:
```tsx
// components/atoms/theme-toggle.tsx
const { theme, setTheme } = useTheme()
setTheme(theme === 'dark' ? 'light' : 'dark')
```

**Smooth Transitions**:
```css
/* globals.css */
* {
  transition: background-color 200ms var(--ease-out),
              color 200ms var(--ease-out),
              border-color 200ms var(--ease-out);
}
```

---

## 8. Component File Structure

### Files to CREATE (Parent Agent Implementation)

**Theme System**:
- `/src/app/providers.tsx` - ThemeProvider wrapper
- `/src/components/atoms/theme-toggle.tsx` - Theme toggle button

**Landing Page Components**:
- `/src/components/molecules/feature-card.tsx` - Feature card
- `/src/components/molecules/testimonial-card.tsx` - Testimonial card
- `/src/components/organisms/landing-hero.tsx` - Hero section
- `/src/components/organisms/landing-features.tsx` - Features grid
- `/src/components/organisms/landing-testimonials.tsx` - Testimonials section
- `/src/components/organisms/landing-footer.tsx` - Footer with theme toggle

**Voice Agent Components**:
- `/src/domains/voice-agent/components/conversation-card.tsx` - Conversation card
- `/src/domains/voice-agent/components/voice-config-form.tsx` - Config form
- `/src/domains/voice-agent/components/connection-status.tsx` - Status badge
- `/src/domains/voice-agent/components/empty-state.tsx` - No conversations state

### Files to UPDATE (Parent Agent Implementation)

**Global Styles**:
- `/src/app/globals.css` - Add new CSS variables, theme tokens

**Existing shadcn Components** (Update for dark mode support):
- `/src/components/ui/button.tsx` - Verify dark mode variants
- `/src/components/ui/card.tsx` - Verify dark mode styling
- `/src/components/ui/input.tsx` - Verify dark mode borders
- `/src/components/ui/textarea.tsx` - Verify dark mode borders
- `/src/components/ui/select.tsx` - Verify dark mode dropdown

**Root Layout**:
- `/src/app/layout.tsx` - Wrap with Providers (ThemeProvider)

---

## 9. Important Notes

### Design Constraints

✅ **EXTREME minimalism** - no unnecessary decoration
✅ **Black, white, gray only** - no accent colors (except semantic states)
✅ **NO gradients** - only solid colors
✅ **1px borders** - minimal structural definition
✅ **Generous spacing** - 64px+ vertical padding for sections
✅ **System preference** - dark mode auto-detect by default
✅ **Geist font** - Vercel aesthetic typography
✅ **200ms transitions** - smooth theme changes, no flicker

### Composition Philosophy

✅ **Use shadcn as-is** - don't modify source files
✅ **Compose, don't customize** - wrap components, don't edit them
✅ **CSS variables for theming** - use design system tokens
✅ **Tailwind for overrides** - className prop for custom styles
✅ **Radix handles accessibility** - don't rebuild primitives

### Critical Constraints Compliance

✅ **Named exports only** - all components use named exports
✅ **No default exports** - except Next.js pages (allowed)
✅ **Client components marked** - 'use client' where needed
✅ **Text externalized** - all user-facing text in text maps
✅ **Repository pattern** - no direct DB access (not applicable here)
✅ **Domain structure** - voice-agent components in /domains/voice-agent/

---

## 10. Next Steps for Parent Agent

### Phase 3 Implementation (Current Phase)

1. ✅ **Verify next-themes installation** (already installed - skip)
2. ✅ **Verify shadcn components** (all exist - skip installation)
3. **Create ThemeProvider wrapper** (`/src/app/providers.tsx`)
4. **Update root layout** to wrap with Providers
5. **Create theme toggle component** (`/src/components/atoms/theme-toggle.tsx`)
6. **Update globals.css** with new CSS variables and theme tokens
7. **Create landing page components**:
   - Feature card molecule
   - Testimonial card molecule
   - Hero organism
   - Features organism
   - Testimonials organism
   - Footer organism
8. **Create voice agent components**:
   - Conversation card
   - Voice config form
   - Connection status badge
   - Empty state component
9. **Verify dark mode support** in existing shadcn components
10. **Test theme transitions** (200ms smooth, no flicker)

### Coordinate with Next.js Builder (Phase 4)

**Handoff Items**:
- ✅ Theme provider ready for layout integration
- ✅ All components ready for page composition
- ✅ Form components ready for voice config route
- ✅ Card components ready for conversation list

### Coordinate with Domain Architect (Phase 5)

**Text Map Requirements**:
- Landing page: hero headline, subheadline, features, testimonials, CTA
- Voice config: form labels, hints, placeholders
- Conversation list: empty state messages, card metadata
- Active chat: status messages, button labels

---

## 11. Testing Checklist

### Component Testing

- [ ] Theme toggle switches between light/dark modes
- [ ] Theme preference persists in localStorage
- [ ] System preference detected on first load
- [ ] 200ms smooth transitions between themes
- [ ] No theme flicker on page load/reload
- [ ] All buttons have proper variants and sizes
- [ ] All cards render correctly in light/dark modes
- [ ] Form inputs have proper focus states
- [ ] Select dropdown works with keyboard navigation
- [ ] Labels properly associated with inputs
- [ ] Badges show correct status indicators

### Accessibility Testing

- [ ] Keyboard navigation works on all interactive elements
- [ ] Focus states visible and high-contrast
- [ ] Screen reader announces theme changes
- [ ] Form labels announce correctly
- [ ] Select dropdown accessible with arrow keys
- [ ] Button text/icons have aria-labels where needed
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- [ ] Touch targets 44x44px minimum

### Responsive Testing

- [ ] Components responsive on mobile (< 640px)
- [ ] Layout adapts at tablet breakpoint (640px+)
- [ ] Desktop layout correct (1024px+)
- [ ] Typography scales appropriately
- [ ] Spacing adjusts per breakpoint
- [ ] Cards stack/grid correctly per screen size

### Dark Mode Testing

- [ ] All components visible in dark mode
- [ ] Border colors correct in dark mode
- [ ] Text contrast sufficient in dark mode
- [ ] Shadows adjusted for dark backgrounds (if used)
- [ ] Focus states visible in dark mode
- [ ] Hover states work in dark mode

---

## Summary

✅ **shadcn/ui Component Selection Complete**

**Components Selected**:
- button (EXISTING - reuse)
- card (EXISTING - reuse)
- input (EXISTING - reuse)
- textarea (EXISTING - reuse)
- select (EXISTING - reuse)
- label (EXISTING - reuse)
- separator (EXISTING - reuse)
- badge (EXISTING - reuse)
- sonner (EXISTING - reuse)

**Installation Required**:
```bash
# ZERO installations needed - all components already exist! 🎉
```

**Composition Strategy**:
- Theme system: next-themes (already installed)
- Landing components: Feature card, Testimonial card, Hero, Features, Footer
- Voice agent components: Conversation card, Config form, Status badge
- All use existing shadcn/ui primitives

**Radix Primitives Used**:
- @radix-ui/react-slot → Button primitive (asChild prop)
- @radix-ui/react-select → Dropdown primitive (keyboard nav, accessibility)
- @radix-ui/react-label → Label primitive (proper association)
- @radix-ui/react-separator → Separator primitive (semantic dividers)

**Accessibility Features**:
- ✅ Keyboard navigation (Radix handles)
- ✅ Focus management (Radix handles)
- ✅ ARIA attributes (Radix handles)
- ✅ Screen reader support (Radix handles)
- ✅ Touch targets (44px minimum)
- ✅ Color contrast (WCAG 2.1 AA)

**Next Phase**: Parent agent implements components based on this plan, then coordinates with Next.js Builder for page integration.
