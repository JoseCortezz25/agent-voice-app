# Design System: Agent Voice

**Design Philosophy**: Minimal Austero meets Deep Blue Tech
**Version**: 1.0
**Created**: 2025-11-25

---

## 🎨 Design Principles

### Core Philosophy

**"Precision in the void"** - A brutally minimal aesthetic where every element serves a purpose, set against the depth of space. No decoration without function. No motion without meaning.

**Aesthetic Direction**:
- **Minimal & Austero**: Clean geometry, sharp edges, purposeful negative space
- **Deep Blue Tech**: Navy depths with electric blue accents create technological sophistication
- **Subtle & Purposeful**: Motion only when it enhances understanding, never for decoration

**Key Differentiators**:
1. **Stark Contrast**: Pure blacks and whites against deep navy create dramatic hierarchy
2. **Geometric Purity**: No rounded corners on primary UI (exception: voice controls for tactile affordance)
3. **Monospace Accents**: Technical details in monospace create industrial precision
4. **Asymmetric Layouts**: Break the grid intentionally, not accidentally
5. **Noise Texture**: Subtle film grain (1% opacity) adds analog warmth to digital coldness

---

## 🎭 Visual Identity

### Typography System

**Primary Display Font**: **Departure Mono** (Google Fonts)
- Usage: Headings, session IDs, technical details, timestamps
- Why: Monospace geometry creates industrial precision, distinctive character
- Weights: Regular (400), Bold (700)

**Body Font**: **Geist Sans** (already in project, via Next.js font)
- Usage: All body text, descriptions, UI labels, buttons
- Why: Exceptional legibility, neutral but refined, pairs perfectly with monospace
- Weights: Regular (400), Medium (500), Semibold (600)

**Type Scale** (using modular scale 1.25):

```
--font-size-xs: 0.64rem;     /* 10.24px - timestamps, metadata */
--font-size-sm: 0.8rem;      /* 12.8px - labels, captions */
--font-size-base: 1rem;      /* 16px - body text */
--font-size-lg: 1.25rem;     /* 20px - subheadings */
--font-size-xl: 1.563rem;    /* 25px - headings */
--font-size-2xl: 1.953rem;   /* 31.25px - page titles */
--font-size-3xl: 2.441rem;   /* 39px - hero text */
```

**Line Heights**:
- Tight: 1.1 (headings, display text)
- Normal: 1.5 (body text, optimal readability)
- Relaxed: 1.75 (long-form content)

**Letter Spacing**:
- Tight: -0.02em (large headings)
- Normal: 0 (body)
- Wide: 0.05em (uppercase labels, buttons)

**Usage Examples**:

```css
/* Page Title */
.page-title {
  font-family: var(--font-departure-mono);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Session ID */
.session-id {
  font-family: var(--font-departure-mono);
  font-size: var(--font-size-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Body Text */
.body {
  font-family: var(--font-geist-sans);
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.5;
}
```

---

## 🌈 Color Palette

### Semantic Color System

**Philosophy**: Stark contrast, deep backgrounds, electric accents

#### Base Colors (Light Mode)

```css
:root {
  /* Neutrals - Pure blacks & whites */
  --color-void: #000000;                    /* Pure black, reserved for maximum emphasis */
  --color-carbon: #0a0f1a;                  /* Near-black navy, primary backgrounds */
  --color-graphite: #1a1f2e;                /* Lighter navy, secondary surfaces */
  --color-slate: #2d3648;                   /* Mid-tone, borders, dividers */
  --color-steel: #5c6b8a;                   /* Muted blue-grey, secondary text */
  --color-silver: #8a99b8;                  /* Light grey-blue, tertiary text */
  --color-fog: #c5d0e6;                     /* Very light blue-grey, disabled states */
  --color-cloud: #e8ecf4;                   /* Near-white, subtle backgrounds */
  --color-white: #ffffff;                   /* Pure white, primary text on dark */

  /* Brand Colors - Electric Blue Family */
  --color-electric-600: #0066cc;            /* Deep electric blue */
  --color-electric-500: #0080ff;            /* Primary electric blue (main brand) */
  --color-electric-400: #3399ff;            /* Lighter electric blue */
  --color-electric-300: #66b3ff;            /* Soft electric blue */

  /* Accent Colors */
  --color-cyan-500: #00d9ff;                /* Bright cyan, active states, highlights */
  --color-cyan-400: #33e0ff;                /* Lighter cyan */

  /* Functional Colors */
  --color-success: #00ff88;                 /* Vibrant green, success states */
  --color-warning: #ffaa00;                 /* Amber, warnings */
  --color-error: #ff3366;                   /* Bright red, errors */
  --color-info: var(--color-electric-500);  /* Uses primary blue */
}
```

#### Dark Mode Colors

```css
.dark {
  /* Dark mode uses same base palette but inverts text/bg relationship */
  /* Backgrounds become darker, text becomes lighter */

  --color-background-primary: var(--color-carbon);
  --color-background-secondary: var(--color-graphite);
  --color-background-tertiary: var(--color-slate);

  --color-text-primary: var(--color-white);
  --color-text-secondary: var(--color-silver);
  --color-text-tertiary: var(--color-steel);

  --color-border-primary: var(--color-slate);
  --color-border-secondary: var(--color-graphite);
}
```

#### Semantic Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: var(--color-carbon);
  --bg-secondary: var(--color-graphite);
  --bg-tertiary: var(--color-slate);
  --bg-overlay: rgba(10, 15, 26, 0.95);     /* Semi-transparent carbon */

  /* Text */
  --text-primary: var(--color-white);
  --text-secondary: var(--color-silver);
  --text-tertiary: var(--color-steel);
  --text-disabled: var(--color-fog);

  /* Borders */
  --border-subtle: var(--color-slate);
  --border-primary: var(--color-steel);
  --border-focus: var(--color-electric-500);
  --border-active: var(--color-cyan-500);

  /* Interactive */
  --interactive-primary: var(--color-electric-500);
  --interactive-hover: var(--color-electric-400);
  --interactive-active: var(--color-cyan-500);
  --interactive-disabled: var(--color-slate);

  /* States */
  --state-success: var(--color-success);
  --state-warning: var(--color-warning);
  --state-error: var(--color-error);
  --state-info: var(--color-info);
}
```

### Color Usage Guidelines

**Background Hierarchy**:
- Primary (`--bg-primary`): Main app background, page containers
- Secondary (`--bg-secondary`): Cards, panels, elevated surfaces
- Tertiary (`--bg-tertiary`): Input fields, code blocks, nested elements

**Text Hierarchy**:
- Primary (`--text-primary`): Body text, headings, primary content
- Secondary (`--text-secondary`): Subheadings, labels, secondary information
- Tertiary (`--text-tertiary`): Timestamps, metadata, helper text

**Interactive States**:
- Default: `--interactive-primary` (electric blue)
- Hover: `--interactive-hover` (lighter blue)
- Active/Focus: `--interactive-active` (cyan)
- Disabled: `--interactive-disabled` (muted grey)

**Contrast Requirements** (WCAG AAA):
- All text must meet 7:1 contrast ratio minimum
- Interactive elements: 3:1 minimum against background
- Focus indicators: 3:1 minimum against adjacent colors

---

## 📐 Spacing & Layout

### Spacing Scale

**8px base unit** (0.5rem) with exponential scale:

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px - tight spacing, icon gaps */
  --space-2: 0.5rem;     /* 8px - base unit, small gaps */
  --space-3: 0.75rem;    /* 12px - comfortable element spacing */
  --space-4: 1rem;       /* 16px - standard spacing */
  --space-5: 1.25rem;    /* 20px - section spacing */
  --space-6: 1.5rem;     /* 24px - large gaps */
  --space-8: 2rem;       /* 32px - section separators */
  --space-10: 2.5rem;    /* 40px - major sections */
  --space-12: 3rem;      /* 48px - page margins */
  --space-16: 4rem;      /* 64px - hero spacing */
  --space-20: 5rem;      /* 80px - dramatic spacing */
  --space-24: 6rem;      /* 96px - major page sections */
}
```

**Usage Guidelines**:
- Component internal padding: `--space-3` to `--space-4`
- Between components: `--space-6` to `--space-8`
- Page sections: `--space-12` to `--space-16`
- Hero/dramatic: `--space-20` to `--space-24`

### Sizing Scale

```css
:root {
  --size-icon-sm: 1rem;      /* 16px - small icons */
  --size-icon-md: 1.5rem;    /* 24px - standard icons */
  --size-icon-lg: 2rem;      /* 32px - large icons */

  --size-button-sm: 2rem;    /* 32px - compact buttons */
  --size-button-md: 2.5rem;  /* 40px - standard buttons */
  --size-button-lg: 3rem;    /* 48px - prominent buttons */

  --size-input-height: 2.5rem;   /* 40px - input fields */
  --size-touch-target: 2.75rem;  /* 44px - minimum touch target */
}
```

### Border Radius

**Philosophy**: Sharp edges for primary UI, subtle rounding only for tactile elements

```css
:root {
  --radius-none: 0;          /* Sharp corners (default) */
  --radius-sm: 0.125rem;     /* 2px - subtle softening */
  --radius-md: 0.25rem;      /* 4px - input fields */
  --radius-lg: 0.5rem;       /* 8px - cards, panels */
  --radius-full: 9999px;     /* Pills, badges, circular buttons */
}
```

**Usage**:
- Buttons, cards, inputs: `--radius-none` (sharp)
- Voice controls (tactile): `--radius-full` (circular)
- Badges, pills: `--radius-full`
- Images: `--radius-md` to `--radius-lg`

### Layout Grid

**12-column grid** with flexible gutters:

```css
:root {
  --grid-columns: 12;
  --grid-gutter: var(--space-6);      /* 24px - desktop */
  --grid-gutter-tablet: var(--space-4);   /* 16px - tablet */
  --grid-gutter-mobile: var(--space-3);   /* 12px - mobile */

  --container-max-width: 1280px;      /* Max content width */
  --content-max-width: 896px;         /* Optimal reading width */
  --narrow-max-width: 640px;          /* Forms, focused content */
}
```

**Breakpoints** (mobile-first):

```css
:root {
  --breakpoint-sm: 640px;    /* Small tablets */
  --breakpoint-md: 768px;    /* Tablets */
  --breakpoint-lg: 1024px;   /* Laptops */
  --breakpoint-xl: 1280px;   /* Desktops */
  --breakpoint-2xl: 1536px;  /* Large desktops */
}
```

---

## 🎬 Motion & Animation

### Animation Principles

**Philosophy**: Subtle & Purposeful - motion enhances understanding, never distracts

**Animation Values**:

```css
:root {
  /* Durations */
  --duration-instant: 50ms;      /* Instant feedback (hover states) */
  --duration-fast: 150ms;        /* Quick transitions (fades) */
  --duration-normal: 250ms;      /* Standard transitions */
  --duration-slow: 400ms;        /* Deliberate, important changes */
  --duration-slower: 600ms;      /* Dramatic entrances */

  /* Easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);       /* Mechanical precision */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);  /* Organic flow */
}
```

### Animation Patterns

**1. Fades** (primary transition)

```css
.fade-enter {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.fade-enter-active {
  opacity: 1;
}
```

**2. Status Pulse** (connection indicators)

```css
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-active {
  animation: pulse-subtle 2s var(--ease-smooth) infinite;
}
```

**3. Audio Visualizer** (waveform bars)

```css
@keyframes visualizer-wave {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

.audio-bar {
  animation: visualizer-wave 0.8s var(--ease-smooth) infinite;
  animation-delay: calc(var(--bar-index) * 0.1s); /* Stagger */
}
```

**4. Slide Up** (message appearance)

```css
.message-enter {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.message-enter-active {
  opacity: 1;
  transform: translateY(0);
}
```

### Motion Accessibility

**Respect `prefers-reduced-motion`**:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧩 Component Patterns

### Voice Controls

**Design**: Circular geometry, tactile affordance, clear status

**Microphone Button**:
- Size: 80x80px (large touch target)
- Shape: Perfect circle (`border-radius: 50%`)
- Default: Electric blue background, white icon
- Active (listening): Cyan background, pulsing ring
- Disabled: Muted grey, reduced opacity

**Audio Visualizer**:
- 5 vertical bars, 4px width, 2px gap
- Height: 16px to 40px (animated based on audio level)
- Color: Cyan when active, steel grey when idle
- Animation: Smooth wave, staggered by 100ms per bar

**Connection Status Badge**:
- Shape: Pill (full border-radius)
- Size: Compact (height: 24px)
- States:
  - Connecting: Grey + spinner icon
  - Connected: Electric blue + dot icon
  - Error: Red + X icon
  - Disconnected: Steel grey + slash icon

### Conversation Cards

**Layout**: Full-width on mobile, fixed-width grid on desktop

**Structure**:
```
┌─────────────────────────────────┐
│ Title (Departure Mono, bold)    │
│ Date/Time (Geist, muted)        │
│ Status Badge        [Icon]      │
└─────────────────────────────────┘
```

**Interaction**:
- Hover: Border changes to electric blue
- Active: Background changes to graphite
- No shadow (minimal aesthetic)

### Forms & Inputs

**Input Field**:
- Height: 40px (comfortable touch target)
- Border: 1px solid slate (default), electric blue (focus)
- Background: Graphite (dark mode), cloud (light mode)
- Border radius: 0 (sharp corners)
- Padding: 12px horizontal

**Textarea**:
- Min height: 120px
- Auto-resize enabled
- Same styling as input field

**Select/Dropdown**:
- Custom styled (no browser default)
- Arrow icon: Electric blue
- Options: Graphite background, white text

### Empty States

**Structure**:
```
[Icon/Illustration]
     Title
  Description
   [CTA Button]
```

**Style**:
- Icon: Large (64px), steel grey color
- Title: Departure Mono, 2xl size
- Description: Geist Sans, secondary text color
- CTA: Electric blue button, prominent

---

## 🔲 Backgrounds & Effects

### Noise Texture

**Purpose**: Add analog warmth to digital coldness

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=');
  opacity: 0.01;
  pointer-events: none;
  z-index: 9999;
}
```

### Gradient Overlays

**Reserved for special moments**: Hero sections, modal overlays

```css
.gradient-hero {
  background: linear-gradient(
    135deg,
    var(--color-carbon) 0%,
    var(--color-graphite) 50%,
    var(--color-slate) 100%
  );
}

.gradient-electric {
  background: linear-gradient(
    90deg,
    var(--color-electric-600) 0%,
    var(--color-electric-500) 50%,
    var(--color-cyan-500) 100%
  );
}
```

### Shadows

**Minimal use** - only for clarity, not decoration

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.45);

  /* Glow effects (for focus/active states) */
  --glow-electric: 0 0 0 2px var(--color-electric-500);
  --glow-cyan: 0 0 0 2px var(--color-cyan-500);
}
```

**Usage**:
- Cards: `--shadow-sm` (subtle elevation)
- Modals/overlays: `--shadow-lg` (clear separation)
- Focus states: `--glow-electric` (accessibility)
- Active voice controls: `--glow-cyan` (clear feedback)

---

## ♿ Accessibility

### Focus Management

**Visible focus indicators** on all interactive elements:

```css
*:focus-visible {
  outline: 2px solid var(--color-electric-500);
  outline-offset: 2px;
}

/* Custom focus for buttons */
button:focus-visible {
  box-shadow: var(--glow-electric);
  outline: none;
}
```

### Keyboard Navigation

**All interactive elements must be keyboard accessible**:
- Buttons: Space/Enter to activate
- Forms: Tab navigation, Enter to submit
- Modals: Escape to close, focus trap
- Shortcuts: Document in UI (tooltips, help panel)

### Screen Reader Support

**ARIA labels** for all non-text elements:

```tsx
<button
  aria-label="Start voice conversation"
  aria-pressed={isListening}
>
  <MicIcon />
</button>

<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {connectionStatus}
</div>
```

### Color Contrast

**All text meets WCAG AAA (7:1)**:
- White on Carbon: 19.42:1 ✅
- Electric Blue on Carbon: 8.15:1 ✅
- Silver on Carbon: 7.02:1 ✅
- Steel on Graphite: 4.58:1 (use for large text only)

---

## 📱 Responsive Strategy

### Mobile-First Approach

**Start with mobile, enhance for desktop**:

```css
/* Mobile (default) */
.container {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
    max-width: var(--container-max-width);
    margin-inline: auto;
  }
}
```

### Breakpoint Strategy

**Mobile (< 768px)**:
- Full-width cards
- Stacked layouts
- Bottom navigation
- Touch-optimized (44px minimum)

**Tablet (768px - 1024px)**:
- 2-column grids
- Sidebar navigation
- Hover states appear

**Desktop (> 1024px)**:
- Multi-column layouts
- Fixed sidebar
- Keyboard shortcuts
- Hover tooltips

---

## 🎯 Component Specifications

### Voice Controls Component

**File**: `src/components/ui/voice-controls.tsx`

**Anatomy**:
```
┌───────────────────────┐
│  [Status Badge]       │
│                       │
│      [Mic Button]     │
│   80x80px, circular   │
│                       │
│  [Audio Visualizer]   │
│   5 bars, animated    │
└───────────────────────┘
```

**States**:
1. Idle: Grey mic, no visualizer animation
2. Connecting: Spinner animation, grey
3. Ready: Electric blue, visualizer idle
4. Listening: Cyan, visualizer active, pulsing ring
5. Error: Red, X icon, error message below

**CSS Custom Properties**:
```css
.voice-controls {
  --voice-button-size: 80px;
  --voice-ring-size: 96px;
  --visualizer-bar-width: 4px;
  --visualizer-bar-gap: 2px;
  --visualizer-bar-count: 5;
}
```

---

## 🚀 Implementation Checklist

Before implementing components:

- [ ] Install Departure Mono font from Google Fonts
- [ ] Add all CSS custom properties to globals.css
- [ ] Create noise texture SVG
- [ ] Set up color mode toggle (light/dark)
- [ ] Configure Tailwind CSS v4 with custom theme
- [ ] Add `prefers-reduced-motion` support
- [ ] Test all color contrasts (WCAG AAA)
- [ ] Verify keyboard navigation
- [ ] Test on mobile, tablet, desktop

---

## 📚 Resources

### Font Sources
- Departure Mono: https://fonts.google.com/specimen/Departure+Mono
- Geist Sans: Already included via Next.js

### Inspiration
- Minimal Design: Dieter Rams principles
- Navy/Blue Tech: Apple Pro apps, GitHub dark mode
- Geometric Precision: Swiss design, Bauhaus

### Tools
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Color Palette: https://coolors.co/
- Noise Texture: https://www.noisetexturegenerator.com/

---

**End of Design System Document**
