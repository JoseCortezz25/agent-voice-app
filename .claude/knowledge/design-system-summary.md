# Design System - Quick Reference

**Project**: Agent Voice
**Style**: Minimal Austero + Deep Blue Tech
**Version**: 1.0

---

## 🎨 Color Palette (Quick Access)

### Primary Colors
```css
--color-carbon: #0a0f1a;      /* Main background */
--color-graphite: #1a1f2e;    /* Cards, panels */
--color-slate: #2d3648;       /* Borders, dividers */
--color-white: #ffffff;       /* Primary text */
```

### Interactive
```css
--color-electric-500: #0080ff;  /* Primary actions */
--color-cyan-500: #00d9ff;      /* Active states */
```

### Functional
```css
--color-success: #00ff88;
--color-error: #ff3366;
--color-warning: #ffaa00;
```

---

## 📝 Typography

### Fonts
- **Display/Headings**: JetBrains Mono (monospace) - `var(--font-departure-mono)`
- **Body Text**: Geist Sans - `var(--font-geist-sans)`
- **Code**: Geist Mono - `var(--font-geist-mono)`

### Sizes (Modular Scale 1.25)
```css
--font-size-xs: 0.64rem;   /* 10px */
--font-size-sm: 0.8rem;    /* 13px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.25rem;   /* 20px */
--font-size-xl: 1.563rem;  /* 25px */
--font-size-2xl: 1.953rem; /* 31px */
--font-size-3xl: 2.441rem; /* 39px */
```

---

## 📏 Spacing (8px base)

```css
--space-2: 0.5rem;   /* 8px - tight */
--space-3: 0.75rem;  /* 12px - comfortable */
--space-4: 1rem;     /* 16px - standard */
--space-6: 1.5rem;   /* 24px - large */
--space-8: 2rem;     /* 32px - sections */
--space-12: 3rem;    /* 48px - page margins */
```

**Usage**:
- Component padding: `--space-3` to `--space-4`
- Between components: `--space-6` to `--space-8`
- Page sections: `--space-12`

---

## 🔲 Border Radius

```css
--radius-none: 0;        /* Default - sharp corners */
--radius-full: 9999px;   /* Circular buttons, badges */
```

**Philosophy**: Sharp edges everywhere EXCEPT voice controls (circular for tactile affordance)

---

## 🎬 Animation

### Durations
```css
--duration-fast: 150ms;    /* Quick transitions */
--duration-normal: 250ms;  /* Standard */
--duration-slow: 400ms;    /* Deliberate */
```

### Easings
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);       /* Default */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);   /* Mechanical */
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1); /* Organic */
```

---

## 🧩 Component Patterns

### Voice Button
- Size: 80x80px
- Shape: Circle (`border-radius: 50%`)
- Default: Electric blue background
- Active: Cyan background + pulsing ring
- Disabled: Grey, 60% opacity

### Cards
- Background: `--color-graphite`
- Border: 1px solid `--color-slate`
- Border Radius: 0 (sharp)
- Hover: Border → electric blue
- Padding: `--space-4`

### Inputs
- Height: 40px
- Background: `--color-graphite`
- Border: 1px solid `--color-slate`
- Border Radius: 0 (sharp)
- Focus: Border → electric blue + glow

### Badges
- Shape: Pill (`border-radius: full`)
- Height: 24px
- Padding: `--space-2` horizontal
- Font: Uppercase, `--font-size-xs`

---

## 🎯 Semantic Tokens

### Backgrounds
```css
--bg-primary: var(--color-carbon);
--bg-secondary: var(--color-graphite);
--bg-tertiary: var(--color-slate);
```

### Text
```css
--text-primary: var(--color-white);
--text-secondary: var(--color-silver);
--text-tertiary: var(--color-steel);
```

### Interactive
```css
--interactive-primary: var(--color-electric-500);
--interactive-hover: var(--color-electric-400);
--interactive-active: var(--color-cyan-500);
```

### Borders
```css
--border-subtle: var(--color-slate);
--border-focus: var(--color-electric-500);
--border-active: var(--color-cyan-500);
```

---

## ✅ Usage Examples

### Button (Primary)
```tsx
<button className="h-10 px-4 rounded-none bg-interactive-primary text-white border-0 hover:bg-interactive-hover active:bg-interactive-active transition-colors duration-fast">
  Action
</button>
```

### Card
```tsx
<div className="bg-bg-secondary border border-border-subtle rounded-none p-4 hover:border-border-focus transition-colors duration-fast">
  {children}
</div>
```

### Heading
```tsx
<h1 className="font-[family-name:var(--font-departure-mono)] text-2xl font-bold tracking-tight">
  Title
</h1>
```

### Input
```tsx
<input
  type="text"
  className="h-10 px-3 rounded-none bg-bg-secondary border border-border-subtle text-text-primary focus:border-border-focus focus:outline-none focus:shadow-[var(--glow-electric)] transition-all duration-fast"
/>
```

---

## ♿ Accessibility Checklist

- [ ] All text meets WCAG AAA contrast (7:1)
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation functional (Tab, Enter, Space, Escape)
- [ ] ARIA labels on icon-only buttons
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets minimum 44x44px
- [ ] Screen reader announcements for status changes

---

## 📱 Responsive Breakpoints

```css
--breakpoint-sm: 640px;    /* Small tablets */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Laptops */
--breakpoint-xl: 1280px;   /* Desktops */
```

**Mobile-first approach**: Start with mobile, enhance for larger screens

---

## 🚀 Quick Start

1. All design tokens are in `globals.css`
2. Use Tailwind classes with custom properties:
   ```tsx
   className="bg-[var(--bg-primary)] text-[var(--text-primary)]"
   ```
3. Headings automatically use display font (JetBrains Mono)
4. Body text uses Geist Sans by default
5. Noise texture overlay applied globally

---

## 📚 Full Documentation

See `.claude/knowledge/design-system.md` for complete specifications, component anatomy, and implementation guidelines.
