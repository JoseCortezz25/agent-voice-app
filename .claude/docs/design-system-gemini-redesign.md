# Design System - Gemini Live Redesign

**Created**: 2025-11-29
**Session**: redesign_gemini_landing
**Design Philosophy**: Vercel-style minimalism with distinctive personality
**Aesthetic Direction**: Ultra-refined minimalism with subtle sophistication

---

## Design Philosophy

This design system embraces **refined minimalism** inspired by Vercel's aesthetic while establishing a unique voice through typography, motion, and spatial composition. The goal is to create a distinctive, memorable experience that avoids generic "AI slop" aesthetics.

**Core Principles**:
- **Clarity through reduction**: Remove everything unnecessary
- **Confident simplicity**: Bold, large typography on generous whitespace
- **Functional beauty**: Every element serves a purpose
- **Restrained elegance**: Sophistication through precision, not decoration
- **Hierarchy through scale**: Size and spacing create visual order

**Differentiation**: While inspired by Vercel, this system distinguishes itself through:
- Unique Geist typography application with distinctive scale ratios
- Extremely minimal gray usage (borders only)
- No gradients - pure solid colors
- Ultra-clean spatial composition with generous breathing room
- Purposeful motion with staggered reveals

---

## Color System

### Philosophy
Extreme minimalism with pure black, pure white, and gray ONLY for borders. No gradients, no accent colors, no visual noise.

### Light Mode Palette

```css
/* Core Colors */
--color-background: #FFFFFF;          /* Pure white background */
--color-foreground: #000000;          /* Pure black text */

/* Gray Scale (minimal usage - borders only) */
--color-gray-50: #FAFAFA;             /* Subtle background variation */
--color-gray-100: #F5F5F5;            /* Card backgrounds (very subtle) */
--color-gray-200: #E5E5E5;            /* Primary borders */
--color-gray-300: #D4D4D4;            /* Hover borders */
--color-gray-400: #A3A3A3;            /* Secondary text (use sparingly) */
--color-gray-500: #737373;            /* Tertiary text (use sparingly) */

/* Semantic Colors (minimal usage) */
--color-text-primary: #000000;        /* Headings, primary text */
--color-text-secondary: #737373;      /* Captions, secondary text */
--color-text-tertiary: #A3A3A3;       /* Disabled, placeholder text */

/* Border System */
--color-border-default: #E5E5E5;      /* Default 1px borders */
--color-border-hover: #D4D4D4;        /* Hover state borders */
--color-border-focus: #000000;        /* Focus state borders */
```

### Dark Mode Palette

```css
/* Core Colors */
--color-background: #000000;          /* Pure black background */
--color-foreground: #FFFFFF;          /* Pure white text */

/* Gray Scale (minimal usage - borders only) */
--color-gray-900: #0A0A0A;            /* Subtle background variation */
--color-gray-800: #141414;            /* Card backgrounds (very subtle) */
--color-gray-700: #262626;            /* Primary borders */
--color-gray-600: #404040;            /* Hover borders */
--color-gray-500: #737373;            /* Secondary text (use sparingly) */
--color-gray-400: #A3A3A3;            /* Tertiary text (use sparingly) */

/* Semantic Colors (minimal usage) */
--color-text-primary: #FFFFFF;        /* Headings, primary text */
--color-text-secondary: #A3A3A3;      /* Captions, secondary text */
--color-text-tertiary: #737373;       /* Disabled, placeholder text */

/* Border System */
--color-border-default: #262626;      /* Default 1px borders */
--color-border-hover: #404040;        /* Hover state borders */
--color-border-focus: #FFFFFF;        /* Focus state borders */
```

### Usage Guidelines

**DO**:
- Use pure black/white for maximum contrast
- Use gray ONLY for borders (1px solid)
- Use gray sparingly for secondary text when necessary
- Maintain strict color discipline

**DON'T**:
- Use gradients (forbidden)
- Use accent colors (cyan, purple, etc.)
- Use gray for backgrounds excessively
- Use colors for decoration

---

## Typography System

### Font Family
**Primary Typeface**: Geist (Vercel's font family)
**Fallback Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif`

```css
/* Font Family Variables */
--font-geist-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-geist-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

**Usage**:
- **Geist Sans**: All UI text (headings, body, buttons, labels)
- **Geist Mono**: Code snippets, technical details (if needed)

**Implementation**: Use Next.js `localFont` for self-hosted Geist fonts

### Type Scale

Ultra-refined scale with generous sizing for headings, creating dramatic hierarchy.

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - captions, metadata */
--text-sm: 0.875rem;     /* 14px - secondary text, labels */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - large body text */
--text-xl: 1.25rem;      /* 20px - subheadings */
--text-2xl: 1.5rem;      /* 24px - section titles */
--text-3xl: 2rem;        /* 32px - page headings */
--text-4xl: 2.5rem;      /* 40px - hero headings (mobile) */
--text-5xl: 3rem;        /* 48px - hero headings (tablet) */
--text-6xl: 3.75rem;     /* 60px - hero headings (desktop) */
--text-7xl: 4.5rem;      /* 72px - landing hero (desktop) */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.2;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Labels, subtle emphasis */
--font-semibold: 600;    /* Buttons, strong emphasis */
--font-bold: 700;        /* Headings */

/* Letter Spacing */
--tracking-tighter: -0.05em;  /* Large headings */
--tracking-tight: -0.025em;   /* Medium headings */
--tracking-normal: 0;         /* Body text */
--tracking-wide: 0.025em;     /* Captions, labels */
```

### Typography Hierarchy

**Display (Hero Headings)**:
- Size: 48px (mobile) → 72px (desktop)
- Weight: 700 (bold)
- Line Height: 1.1
- Letter Spacing: -0.05em
- Usage: Landing page hero, major statements

**Heading 1**:
- Size: 32px (mobile) → 48px (desktop)
- Weight: 700 (bold)
- Line Height: 1.2
- Letter Spacing: -0.025em
- Usage: Page titles

**Heading 2**:
- Size: 24px (mobile) → 32px (desktop)
- Weight: 600 (semibold)
- Line Height: 1.3
- Letter Spacing: -0.025em
- Usage: Section headings

**Heading 3**:
- Size: 20px
- Weight: 600 (semibold)
- Line Height: 1.4
- Letter Spacing: 0
- Usage: Component headings

**Body**:
- Size: 16px (mobile) → 18px (desktop)
- Weight: 400 (normal)
- Line Height: 1.5
- Letter Spacing: 0
- Usage: Paragraphs, content

**Caption**:
- Size: 14px
- Weight: 400 (normal)
- Line Height: 1.5
- Letter Spacing: 0.025em
- Usage: Secondary info, metadata

**Label**:
- Size: 14px
- Weight: 500 (medium)
- Line Height: 1.5
- Letter Spacing: 0
- Usage: Form labels, UI labels

---

## Spacing System

### Scale
Consistent 4px base unit with generous spacing for breathing room.

```css
/* Spacing Variables */
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

/* Section Padding */
--section-padding-sm: 3rem;    /* 48px - mobile */
--section-padding-md: 4rem;    /* 64px - tablet */
--section-padding-lg: 6rem;    /* 96px - desktop */
--section-padding-xl: 8rem;    /* 128px - large desktop */

/* Container Max Width */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

### Usage Guidelines

**Vertical Rhythm**:
- Small components: 8px - 16px
- Medium components: 24px - 32px
- Large components: 48px - 64px
- Sections: 64px - 128px

**Horizontal Spacing**:
- Tight: 8px - 12px (buttons, inline elements)
- Normal: 16px - 24px (cards, components)
- Relaxed: 32px - 48px (page margins)
- Generous: 64px+ (hero sections)

---

## Layout System

### Containers

```css
/* Container System */
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);  /* 16px mobile */
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container {
    padding-left: var(--space-6);  /* 24px tablet */
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--space-8);  /* 32px desktop */
    padding-right: var(--space-8);
  }
}
```

### Grid System

Simple, flexible grid for content organization.

```css
/* Grid Variables */
--grid-gap-sm: var(--space-4);   /* 16px */
--grid-gap-md: var(--space-6);   /* 24px */
--grid-gap-lg: var(--space-8);   /* 32px */
--grid-gap-xl: var(--space-12);  /* 48px */
```

**Common Patterns**:
- Hero sections: Single column, centered
- Features: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Testimonials: 1 column (mobile) → 2 columns (tablet)
- Forms: Single column, max-width 480px

---

## Border & Radius System

### Borders

Extremely minimal - 1px solid borders only.

```css
/* Border Width */
--border-width: 1px;

/* Border Radius (minimal) */
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - subtle rounding */
--radius-md: 0.5rem;     /* 8px - default for cards */
--radius-lg: 0.75rem;    /* 12px - larger components */
--radius-full: 9999px;   /* Pills, circular */
```

**Usage**:
- Cards: 8px border radius
- Buttons: 8px border radius
- Inputs: 6px border radius
- Most elements: 1px solid border in gray

**Philosophy**: Borders define structure, not decoration. Use sparingly.

---

## Shadow & Elevation System

### Philosophy
Shadows are extremely subtle. Vercel style prefers flat design with borders over heavy shadows.

```css
/* Shadow System (very subtle) */
--shadow-none: none;
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08);

/* Focus Ring */
--ring-width: 2px;
--ring-offset: 2px;
--ring-color: var(--color-foreground);
```

**Usage**:
- Most components: No shadow (use borders)
- Popovers/Modals: shadow-sm or shadow-md
- Dropdowns: shadow-md
- Focus states: 2px outline with offset

**Dark Mode Adjustments**:
```css
/* Dark mode shadows (if needed) */
--shadow-xs-dark: 0 1px 2px rgba(255, 255, 255, 0.05);
--shadow-sm-dark: 0 1px 3px rgba(255, 255, 255, 0.08);
```

---

## Motion & Animation System

### Philosophy
Purposeful, high-impact animations with staggered reveals. CSS-first approach prioritizing page load choreography over scattered micro-interactions.

### Duration & Easing

```css
/* Duration */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
--ease-smooth: cubic-bezier(0.45, 0.05, 0.55, 0.95);
```

### Signature Animations

**Page Load Choreography**:
```css
/* Staggered fade-in reveal */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-heading {
  animation: fadeInUp var(--duration-slow) var(--ease-out);
}

.hero-subheading {
  animation: fadeInUp var(--duration-slow) var(--ease-out);
  animation-delay: 150ms;
}

.hero-cta {
  animation: fadeInUp var(--duration-slow) var(--ease-out);
  animation-delay: 300ms;
}
```

**Micro-interactions**:
```css
/* Button hover */
.button {
  transition: all var(--duration-fast) var(--ease-out);
}

.button:hover {
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}

/* Border expansion on focus */
.input:focus {
  border-color: var(--color-border-focus);
  transition: border-color var(--duration-fast) var(--ease-out);
}

/* Smooth theme transition */
* {
  transition: background-color var(--duration-normal) var(--ease-out),
              color var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}
```

### Reduced Motion

Respect user preferences:
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

## Component Specifications

### Buttons

**Primary Button** (Black on white, White on black):
```css
.button-primary {
  padding: 0 var(--space-6);        /* 24px horizontal */
  height: 44px;                      /* Touch-friendly */
  font-size: var(--text-base);       /* 16px */
  font-weight: var(--font-semibold); /* 600 */
  border-radius: var(--radius-md);   /* 8px */
  border: 1px solid transparent;

  /* Light mode */
  background: var(--color-foreground);
  color: var(--color-background);

  /* Hover */
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* Active */
  &:active {
    transform: translateY(0);
  }

  /* Focus */
  &:focus-visible {
    outline: 2px solid var(--color-foreground);
    outline-offset: 2px;
  }

  transition: all var(--duration-fast) var(--ease-out);
}
```

**Secondary Button** (Outline):
```css
.button-secondary {
  padding: 0 var(--space-6);
  height: 44px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
  background: transparent;
  color: var(--color-foreground);

  &:hover {
    border-color: var(--color-border-hover);
    background: var(--color-gray-50); /* Light mode */
  }

  transition: all var(--duration-fast) var(--ease-out);
}
```

### Cards

```css
.card {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);  /* 8px */
  padding: var(--space-6);          /* 24px */
  background: var(--color-background);

  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-border-hover);
  }
}
```

### Inputs

```css
.input {
  height: 44px;
  padding: 0 var(--space-4);        /* 16px horizontal */
  font-size: var(--text-base);      /* 16px */
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);  /* 6px */
  background: var(--color-background);
  color: var(--color-foreground);

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-border-focus);
  }

  transition: border-color var(--duration-fast) var(--ease-out);
}
```

### Textarea

```css
.textarea {
  min-height: 120px;
  padding: var(--space-3) var(--space-4);  /* 12px vertical, 16px horizontal */
  font-size: var(--text-base);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-foreground);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-border-focus);
  }

  transition: border-color var(--duration-fast) var(--ease-out);
}
```

---

## Responsive Breakpoints

Mobile-first approach:

```css
/* Breakpoints */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 768px;   /* Small laptops */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
```

**Usage Pattern**:
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

## Accessibility Standards

**WCAG 2.1 AA Compliance** (minimum):

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- Pure black on white: 21:1 (maximum contrast)
- Gray text on white: Use gray-500 (#737373) minimum for AA compliance

### Focus States
- Always visible (2px outline)
- High contrast (black or white)
- 2px offset for clarity

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip links for main content
- Escape key closes modals/popovers

### Screen Readers
- Semantic HTML (header, nav, main, section, footer)
- ARIA labels where needed
- Live regions for dynamic content
- Descriptive link text

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between targets (8px minimum)

---

## Theme Implementation

### next-themes Integration

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
    >
      {children}
    </ThemeProvider>
  );
}
```

### CSS Variables per Theme

```css
/* globals.css */
:root {
  /* Light mode (default) */
  --color-background: #FFFFFF;
  --color-foreground: #000000;
  --color-border-default: #E5E5E5;
  /* ... rest of light mode tokens */
}

.dark {
  /* Dark mode */
  --color-background: #000000;
  --color-foreground: #FFFFFF;
  --color-border-default: #262626;
  /* ... rest of dark mode tokens */
}
```

### Smooth Theme Transition
Transition duration: 200ms (fast but smooth, no flicker)

```css
* {
  transition: background-color 200ms ease-out,
              color 200ms ease-out,
              border-color 200ms ease-out;
}
```

---

## Background & Depth Strategy

### Philosophy
Flat design with subtle texture. No heavy backgrounds or visual noise.

**Techniques**:
- Pure solid colors (black or white)
- Subtle gray variations for depth (gray-50 vs white in light mode)
- 1px borders for structure definition
- Minimal shadows (only for elevation hierarchy)

**Context-Specific**:
- Landing hero: Pure white (light) or pure black (dark)
- Cards: Subtle gray-50 background (light) or gray-900 (dark) - optional
- Sections: Alternate between pure background and subtle variation

**NO**:
- Gradients (forbidden)
- Heavy textures
- Decorative patterns
- Background images

---

## Design Quality Checklist

Before implementation, verify:

- [ ] Pure black (#000000) and white (#FFFFFF) for primary colors
- [ ] Gray used ONLY for borders and sparingly for secondary text
- [ ] No gradients anywhere
- [ ] Geist font family loaded and applied
- [ ] Typography scale follows exact specifications
- [ ] Generous whitespace in all sections (64px+ vertical padding)
- [ ] 1px solid borders for all structural elements
- [ ] Minimal shadow usage (borders preferred)
- [ ] 8px border radius for cards/buttons
- [ ] 44px minimum height for buttons/inputs
- [ ] Staggered page load animations implemented
- [ ] Smooth theme transitions (200ms)
- [ ] Mobile-first responsive approach
- [ ] WCAG 2.1 AA color contrast ratios
- [ ] Focus states visible and high-contrast
- [ ] Keyboard navigation functional
- [ ] prefers-reduced-motion respected

---

## Design System Usage Notes

**For Developers**:
1. Always use CSS variables for colors, spacing, typography
2. Never hardcode values that exist as tokens
3. Follow mobile-first responsive patterns
4. Test both light and dark modes
5. Verify accessibility with keyboard-only navigation
6. Run contrast ratio checks on all text

**For Designers**:
1. Maintain extreme discipline with color usage
2. Embrace whitespace - more is better
3. Use scale to create hierarchy (not color or decoration)
4. Every element should justify its existence
5. When in doubt, remove rather than add

**Key Differentiators from Generic Design**:
- Geist typography creates unique voice
- Extreme color restraint (no gradients, minimal gray)
- Generous spacing creates breathing room
- Purposeful motion with staggered reveals
- Flat design with 1px borders (not heavy shadows)

This design system creates a distinctive, refined aesthetic that feels professional, modern, and intentional while avoiding generic AI design patterns.
