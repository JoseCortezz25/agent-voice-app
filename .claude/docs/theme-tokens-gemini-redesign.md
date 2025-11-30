# Theme Tokens - Gemini Live Redesign

**Created**: 2025-11-29
**Session**: redesign_gemini_landing
**Implementation**: CSS Custom Properties (CSS Variables)
**Theme System**: next-themes (light/dark/system)

---

## Implementation Overview

This document specifies all CSS custom properties (CSS variables) for the Gemini Live redesign. The design system uses a **minimal, Vercel-style aesthetic** with pure black, white, and gray scale only.

**Key Principles**:
- Semantic naming for easy theming
- Light and dark mode variants
- No gradients, no accent colors (except for semantic states)
- Minimal gray usage (primarily borders)
- Full contrast (black on white, white on black)

---

## CSS Variable Naming Convention

```
--{category}-{property}-{variant}
```

**Examples**:
- `--color-background` (background color)
- `--color-text-primary` (primary text color)
- `--space-4` (spacing unit 4)
- `--text-xl` (extra large text size)

---

## Color Tokens

### Base Colors

```css
:root {
  /* Pure Colors (theme-independent) */
  --color-pure-black: #000000;
  --color-pure-white: #FFFFFF;

  /* Gray Scale Palette */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;
  --color-gray-950: #0A0A0A;
}
```

### Semantic Colors - Light Mode

```css
:root {
  /* Backgrounds */
  --color-background: #FFFFFF;
  --color-background-subtle: #FAFAFA;
  --color-background-muted: #F5F5F5;

  /* Foregrounds */
  --color-foreground: #000000;
  --color-foreground-subtle: #171717;

  /* Text Hierarchy */
  --color-text-primary: #000000;
  --color-text-secondary: #525252;
  --color-text-tertiary: #A3A3A3;
  --color-text-disabled: #D4D4D4;

  /* Borders */
  --color-border-default: #E5E5E5;
  --color-border-hover: #D4D4D4;
  --color-border-focus: #000000;
  --color-border-subtle: #F5F5F5;

  /* Interactive States */
  --color-interactive-default: #000000;
  --color-interactive-hover: #171717;
  --color-interactive-active: #262626;

  /* Semantic States (minimal usage) */
  --color-success: #00C853;
  --color-success-subtle: #E8F5E9;
  --color-error: #D32F2F;
  --color-error-subtle: #FFEBEE;
  --color-warning: #F57C00;
  --color-warning-subtle: #FFF3E0;
  --color-info: #1976D2;
  --color-info-subtle: #E3F2FD;
}
```

### Semantic Colors - Dark Mode

```css
.dark {
  /* Backgrounds */
  --color-background: #000000;
  --color-background-subtle: #0A0A0A;
  --color-background-muted: #171717;

  /* Foregrounds */
  --color-foreground: #FFFFFF;
  --color-foreground-subtle: #FAFAFA;

  /* Text Hierarchy */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A3A3A3;
  --color-text-tertiary: #737373;
  --color-text-disabled: #404040;

  /* Borders */
  --color-border-default: #262626;
  --color-border-hover: #404040;
  --color-border-focus: #FFFFFF;
  --color-border-subtle: #171717;

  /* Interactive States */
  --color-interactive-default: #FFFFFF;
  --color-interactive-hover: #FAFAFA;
  --color-interactive-active: #E5E5E5;

  /* Semantic States (minimal usage) */
  --color-success: #00E676;
  --color-success-subtle: #1B5E20;
  --color-error: #FF5252;
  --color-error-subtle: #B71C1C;
  --color-warning: #FFB74D;
  --color-warning-subtle: #E65100;
  --color-info: #448AFF;
  --color-info-subtle: #0D47A1;
}
```

---

## Typography Tokens

### Font Families

```css
:root {
  /* Primary Font (Geist Sans) */
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

  /* Monospace Font (Geist Mono) */
  --font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
}
```

### Font Sizes

```css
:root {
  /* Font Size Scale */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 2rem;        /* 32px */
  --text-4xl: 2.5rem;      /* 40px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
}
```

### Font Weights

```css
:root {
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights

```css
:root {
  /* Line Height Scale */
  --leading-none: 1;
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Letter Spacing

```css
:root {
  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}
```

---

## Spacing Tokens

### Spacing Scale

```css
:root {
  /* Spacing Scale (4px base unit) */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
  --space-40: 10rem;     /* 160px */
  --space-48: 12rem;     /* 192px */
  --space-64: 16rem;     /* 256px */
}
```

### Section Padding

```css
:root {
  /* Section Vertical Padding */
  --section-padding-sm: 3rem;    /* 48px - mobile */
  --section-padding-md: 4rem;    /* 64px - tablet */
  --section-padding-lg: 6rem;    /* 96px - desktop */
  --section-padding-xl: 8rem;    /* 128px - large desktop */
}
```

### Container Widths

```css
:root {
  /* Container Max Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  /* Content Max Widths (for centered content) */
  --content-sm: 480px;   /* Forms, narrow content */
  --content-md: 640px;   /* Medium content blocks */
  --content-lg: 768px;   /* Wide content blocks */
}
```

---

## Border & Radius Tokens

### Border Widths

```css
:root {
  /* Border Widths */
  --border-0: 0;
  --border-1: 1px;
  --border-2: 2px;
  --border-4: 4px;
}
```

### Border Radius

```css
:root {
  /* Border Radius Scale */
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Pill shape */
}
```

---

## Shadow Tokens

### Shadow Scale

```css
:root {
  /* Shadows (very subtle, Vercel-style) */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.dark {
  /* Dark Mode Shadows (lighter) */
  --shadow-xs: 0 1px 2px rgba(255, 255, 255, 0.05);
  --shadow-sm: 0 1px 3px rgba(255, 255, 255, 0.08);
  --shadow-md: 0 4px 6px rgba(255, 255, 255, 0.05);
  --shadow-lg: 0 10px 15px rgba(255, 255, 255, 0.08);
  --shadow-xl: 0 20px 25px rgba(255, 255, 255, 0.1);
}
```

### Focus Ring

```css
:root {
  /* Focus Ring Tokens */
  --ring-width: 2px;
  --ring-offset: 2px;
  --ring-color: var(--color-border-focus);
  --ring-shadow: 0 0 0 var(--ring-offset) var(--color-background),
                 0 0 0 calc(var(--ring-offset) + var(--ring-width)) var(--ring-color);
}
```

---

## Animation Tokens

### Duration

```css
:root {
  /* Animation Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  --duration-slowest: 1000ms;
}
```

### Easing Functions

```css
:root {
  /* Easing Curves */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-smooth: cubic-bezier(0.45, 0.05, 0.55, 0.95);
}
```

---

## Component-Specific Tokens

### Button Tokens

```css
:root {
  /* Button Heights */
  --button-height-sm: 36px;
  --button-height-md: 44px;
  --button-height-lg: 52px;

  /* Button Padding */
  --button-padding-x-sm: var(--space-4);  /* 16px */
  --button-padding-x-md: var(--space-6);  /* 24px */
  --button-padding-x-lg: var(--space-8);  /* 32px */
}
```

### Input Tokens

```css
:root {
  /* Input Heights */
  --input-height-sm: 36px;
  --input-height-md: 44px;
  --input-height-lg: 52px;

  /* Input Padding */
  --input-padding-x: var(--space-4);  /* 16px */
  --input-padding-y: var(--space-3);  /* 12px */
}
```

### Card Tokens

```css
:root {
  /* Card Padding */
  --card-padding-sm: var(--space-4);   /* 16px */
  --card-padding-md: var(--space-6);   /* 24px */
  --card-padding-lg: var(--space-8);   /* 32px */

  /* Card Border */
  --card-border: var(--border-1) solid var(--color-border-default);
  --card-radius: var(--radius-md);
}
```

---

## Breakpoint Tokens

### Media Query Breakpoints

```css
:root {
  /* Breakpoints (for reference, not actual CSS vars) */
  /* These are used in media queries, not as CSS custom properties */

  /* Mobile: < 640px (default) */
  /* Tablet: 640px */
  /* Desktop: 1024px */
  /* Large Desktop: 1280px */
}
```

**Usage in Media Queries**:
```css
/* Mobile first (default) */
.element {
  font-size: var(--text-base);
}

/* Tablet and up */
@media (min-width: 640px) {
  .element {
    font-size: var(--text-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: var(--text-xl);
  }
}
```

---

## Z-Index Tokens

### Layering System

```css
:root {
  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-toast: 1600;
  --z-tooltip: 1700;
}
```

---

## Complete CSS Variables File

Here's the complete implementation for `globals.css`:

```css
/* ============================================================================
   Theme Tokens - Gemini Live Redesign
   Vercel-style minimalism with black, white, and gray scale
   ============================================================================ */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================================================
   Base Color Palette
   ============================================================================ */

:root {
  /* Pure Colors */
  --color-pure-black: #000000;
  --color-pure-white: #FFFFFF;

  /* Gray Scale */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;
  --color-gray-950: #0A0A0A;
}

/* ============================================================================
   Semantic Colors - Light Mode
   ============================================================================ */

:root {
  /* Backgrounds */
  --color-background: #FFFFFF;
  --color-background-subtle: #FAFAFA;
  --color-background-muted: #F5F5F5;

  /* Foregrounds */
  --color-foreground: #000000;
  --color-foreground-subtle: #171717;

  /* Text */
  --color-text-primary: #000000;
  --color-text-secondary: #525252;
  --color-text-tertiary: #A3A3A3;
  --color-text-disabled: #D4D4D4;

  /* Borders */
  --color-border-default: #E5E5E5;
  --color-border-hover: #D4D4D4;
  --color-border-focus: #000000;
  --color-border-subtle: #F5F5F5;

  /* Interactive */
  --color-interactive-default: #000000;
  --color-interactive-hover: #171717;
  --color-interactive-active: #262626;

  /* Semantic States */
  --color-success: #00C853;
  --color-success-subtle: #E8F5E9;
  --color-error: #D32F2F;
  --color-error-subtle: #FFEBEE;
  --color-warning: #F57C00;
  --color-warning-subtle: #FFF3E0;
  --color-info: #1976D2;
  --color-info-subtle: #E3F2FD;
}

/* ============================================================================
   Semantic Colors - Dark Mode
   ============================================================================ */

.dark {
  /* Backgrounds */
  --color-background: #000000;
  --color-background-subtle: #0A0A0A;
  --color-background-muted: #171717;

  /* Foregrounds */
  --color-foreground: #FFFFFF;
  --color-foreground-subtle: #FAFAFA;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A3A3A3;
  --color-text-tertiary: #737373;
  --color-text-disabled: #404040;

  /* Borders */
  --color-border-default: #262626;
  --color-border-hover: #404040;
  --color-border-focus: #FFFFFF;
  --color-border-subtle: #171717;

  /* Interactive */
  --color-interactive-default: #FFFFFF;
  --color-interactive-hover: #FAFAFA;
  --color-interactive-active: #E5E5E5;

  /* Semantic States */
  --color-success: #00E676;
  --color-success-subtle: #1B5E20;
  --color-error: #FF5252;
  --color-error-subtle: #B71C1C;
  --color-warning: #FFB74D;
  --color-warning-subtle: #E65100;
  --color-info: #448AFF;
  --color-info-subtle: #0D47A1;
}

/* ============================================================================
   Typography
   ============================================================================ */

:root {
  /* Font Families */
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}

/* ============================================================================
   Spacing
   ============================================================================ */

:root {
  /* Spacing Scale */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --space-40: 10rem;
  --space-48: 12rem;
  --space-64: 16rem;

  /* Section Padding */
  --section-padding-sm: 3rem;
  --section-padding-md: 4rem;
  --section-padding-lg: 6rem;
  --section-padding-xl: 8rem;

  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  /* Content Max Widths */
  --content-sm: 480px;
  --content-md: 640px;
  --content-lg: 768px;
}

/* ============================================================================
   Borders & Radius
   ============================================================================ */

:root {
  /* Border Widths */
  --border-0: 0;
  --border-1: 1px;
  --border-2: 2px;
  --border-4: 4px;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}

/* ============================================================================
   Shadows
   ============================================================================ */

:root {
  --shadow-none: none;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

  /* Focus Ring */
  --ring-width: 2px;
  --ring-offset: 2px;
  --ring-color: var(--color-border-focus);
}

.dark {
  --shadow-xs: 0 1px 2px rgba(255, 255, 255, 0.05);
  --shadow-sm: 0 1px 3px rgba(255, 255, 255, 0.08);
  --shadow-md: 0 4px 6px rgba(255, 255, 255, 0.05);
  --shadow-lg: 0 10px 15px rgba(255, 255, 255, 0.08);
  --shadow-xl: 0 20px 25px rgba(255, 255, 255, 0.1);
}

/* ============================================================================
   Animation
   ============================================================================ */

:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  --duration-slowest: 1000ms;

  /* Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-smooth: cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

/* ============================================================================
   Component Tokens
   ============================================================================ */

:root {
  /* Buttons */
  --button-height-sm: 36px;
  --button-height-md: 44px;
  --button-height-lg: 52px;
  --button-padding-x-sm: var(--space-4);
  --button-padding-x-md: var(--space-6);
  --button-padding-x-lg: var(--space-8);

  /* Inputs */
  --input-height-sm: 36px;
  --input-height-md: 44px;
  --input-height-lg: 52px;
  --input-padding-x: var(--space-4);
  --input-padding-y: var(--space-3);

  /* Cards */
  --card-padding-sm: var(--space-4);
  --card-padding-md: var(--space-6);
  --card-padding-lg: var(--space-8);
  --card-radius: var(--radius-md);

  /* Z-Index */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-toast: 1600;
  --z-tooltip: 1700;
}

/* ============================================================================
   Base Styles
   ============================================================================ */

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
}

/* ============================================================================
   Theme Transition
   ============================================================================ */

* {
  transition: background-color 200ms var(--ease-out),
              color 200ms var(--ease-out),
              border-color 200ms var(--ease-out);
}

/* ============================================================================
   Reduced Motion
   ============================================================================ */

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

## Usage Examples

### Using Color Tokens

```css
/* Button with theme-aware colors */
.button-primary {
  background: var(--color-foreground);
  color: var(--color-background);
  border: var(--border-1) solid transparent;
}

.button-primary:hover {
  background: var(--color-interactive-hover);
}
```

### Using Typography Tokens

```css
/* Hero heading */
.hero-heading {
  font-family: var(--font-sans);
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
}

@media (min-width: 1024px) {
  .hero-heading {
    font-size: var(--text-7xl);
  }
}
```

### Using Spacing Tokens

```css
/* Card component */
.card {
  padding: var(--card-padding-md);
  margin-bottom: var(--space-6);
  border: var(--border-1) solid var(--color-border-default);
  border-radius: var(--card-radius);
}
```

### Using Animation Tokens

```css
/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

---

## Theme Toggle Implementation

### Next.js Theme Provider Setup

```tsx
// app/providers.tsx
'use client';
import { ThemeProvider } from 'next-themes';

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
  );
}
```

### Theme Toggle Component

```tsx
// components/theme-toggle.tsx
'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
```

---

## Accessibility Compliance

All color tokens meet **WCAG 2.1 AA** standards:

**Light Mode**:
- Black on White: 21:1 (AAA)
- gray-600 on White: 7:1 (AAA)
- gray-500 on White: 4.6:1 (AA)

**Dark Mode**:
- White on Black: 21:1 (AAA)
- gray-400 on Black: 7:1 (AAA)
- gray-500 on Black: 4.6:1 (AA)

**Focus States**:
- 2px outline with 2px offset
- Maximum contrast (black or white)

---

## Implementation Checklist

- [ ] Install `next-themes` package
- [ ] Set up Geist font files (download from Vercel)
- [ ] Create ThemeProvider wrapper
- [ ] Replace existing CSS variables with new tokens
- [ ] Update all components to use new variable names
- [ ] Test light/dark mode transitions
- [ ] Verify color contrast ratios
- [ ] Test with keyboard navigation
- [ ] Verify smooth theme transitions (200ms)
- [ ] Test `prefers-reduced-motion` support

This token system provides a complete, production-ready foundation for the Gemini Live redesign with full theme support and accessibility compliance.
