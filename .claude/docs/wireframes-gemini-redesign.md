# Wireframes - Gemini Live Redesign

**Created**: 2025-11-29
**Session**: redesign_gemini_landing
**Pages**: 4 main pages (Landing, Conversation List, Voice Config, Active Chat)
**Layout Approach**: Mobile-first, ultra-minimalist, Vercel-style

---

## Design Approach

All wireframes follow Vercel's minimalist aesthetic:
- Generous whitespace (breathing room)
- Large, bold typography for hierarchy
- Clean 1px borders for structure
- Minimal chrome (no unnecessary decoration)
- Clear focus on content and user actions

---

## Page 1: Landing Page (/)

### Purpose
Informative landing page showcasing Gemini Live voice agent functionality. Persuades visitors to try the product.

### User Flow
1. User arrives at landing page
2. Reads hero message and value proposition
3. Scrolls through features section
4. Views testimonials for social proof
5. Clicks CTA button → Redirects to Conversation List page

### Layout Structure

#### Mobile (< 640px)

```
┌────────────────────────────────────────┐
│                                        │
│  [Logo/Title]        [Theme Toggle]    │  ← Header (fixed, minimal)
│                                        │
└────────────────────────────────────────┘
│                                        │
│            HERO SECTION                │
│                                        │
│   Crea tus agentes y                   │  ← Heading (48px, bold, black)
│   conversa con ellos                   │
│                                        │
│   Créalos, customízalos y              │  ← Subheading (18px, gray-500)
│   habla con ellos                      │
│                                        │
│                                        │
│   ┌────────────────────────────┐      │
│   │      Probar                │      │  ← Primary CTA button
│   └────────────────────────────┘      │
│                                        │
├────────────────────────────────────────┤  ← 1px border separator
│                                        │
│         FEATURES SECTION               │
│                                        │
│   ┌────────────────────────────────┐  │
│   │  Tiempo real                   │  │  ← Feature card 1
│   │                                │  │
│   │  Conversaciones instantáneas   │  │
│   │  con respuestas en vivo        │  │
│   └────────────────────────────────┘  │
│                                        │
│   ┌────────────────────────────────┐  │
│   │  Múltiples voces               │  │  ← Feature card 2
│   │                                │  │
│   │  Elige entre 5 voces únicas   │  │
│   │  para tu asistente             │  │
│   └────────────────────────────────┘  │
│                                        │
│   ┌────────────────────────────────┐  │
│   │  System prompts                │  │  ← Feature card 3
│   │                                │  │
│   │  Personaliza el comportamiento │  │
│   │  con instrucciones customizadas│  │
│   └────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤  ← 1px border separator
│                                        │
│       TESTIMONIALS SECTION             │
│                                        │
│   "Simple y efectivo. Perfecto        │  ← Testimonial 1
│    para probar conversaciones          │
│    de voz con IA"                      │
│   — María G.                           │
│                                        │
│   ┌──────────────────────────────┐    │  ← Testimonial card border
│   │ "La personalización con       │    │
│   │  system prompts es increíble" │    │  ← Testimonial 2
│   │  — Carlos R.                  │    │
│   └──────────────────────────────┘    │
│                                        │
├────────────────────────────────────────┤  ← 1px border separator
│                                        │
│         FINAL CTA SECTION              │
│                                        │
│   ¿Listo para comenzar?                │  ← CTA heading (32px)
│                                        │
│   ┌────────────────────────────┐      │
│   │   Comenzar ahora           │      │  ← Primary button → /voice/conversations
│   └────────────────────────────┘      │
│                                        │
└────────────────────────────────────────┘
│                                        │
│           FOOTER                       │  ← Minimal footer (optional)
│                                        │
└────────────────────────────────────────┘
```

#### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [Agent Voice]                                      [Theme Toggle]   │  ← Header (minimal, fixed)
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
│                                                                      │
│                         HERO SECTION                                 │  ← 128px vertical padding
│                                                                      │
│                  Crea tus agentes y                                  │  ← Heading (72px, bold, centered)
│                  conversa con ellos                                  │
│                                                                      │
│         Créalos, customízalos y habla con ellos                      │  ← Subheading (20px, gray-500)
│                                                                      │
│                                                                      │
│                    ┌──────────────────┐                             │
│                    │     Probar       │                             │  ← Primary CTA (centered)
│                    └──────────────────┘                             │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤  ← 1px border separator
│                                                                      │
│                      FEATURES SECTION                                │  ← 96px vertical padding
│                                                                      │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │  ← 3-column grid
│   │                │  │                │  │                │      │
│   │  Tiempo real   │  │ Múltiples voces│  │ System prompts │      │
│   │                │  │                │  │                │      │
│   │ Conversaciones │  │ Elige entre 5  │  │ Personaliza el │      │
│   │ instantáneas   │  │ voces únicas   │  │ comportamiento │      │
│   │ con respuestas │  │ para tu        │  │ con prompts    │      │
│   │ en vivo        │  │ asistente      │  │ customizados   │      │
│   │                │  │                │  │                │      │
│   └────────────────┘  └────────────────┘  └────────────────┘      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤  ← 1px border separator
│                                                                      │
│                    TESTIMONIALS SECTION                              │  ← 96px vertical padding
│                                                                      │
│   ┌──────────────────────────────┐  ┌──────────────────────────────┐│  ← 2-column grid
│   │                              │  │                              ││
│   │ "Simple y efectivo.          │  │ "La personalización con      ││
│   │  Perfecto para probar        │  │  system prompts es           ││
│   │  conversaciones de voz       │  │  increíble. Puedo crear      ││
│   │  con IA"                     │  │  agentes únicos"             ││
│   │                              │  │                              ││
│   │ — María G.                   │  │ — Carlos R.                  ││
│   │                              │  │                              ││
│   └──────────────────────────────┘  └──────────────────────────────┘│
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤  ← 1px border separator
│                                                                      │
│                      FINAL CTA SECTION                               │  ← 96px vertical padding
│                                                                      │
│                   ¿Listo para comenzar?                              │  ← CTA heading (48px, centered)
│                                                                      │
│                    ┌──────────────────┐                             │
│                    │ Comenzar ahora   │                             │  ← Primary button (centered)
│                    └──────────────────┘                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
│                                                                      │
│                          FOOTER                                      │  ← Minimal (48px padding)
│                  Agent Voice © 2025                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Header**:
- Logo/title: "Agent Voice" (text-based, 20px)
- Theme toggle: Icon button (moon/sun)
- Height: 64px
- Border bottom: 1px solid gray-200
- Position: Fixed (sticky on scroll)

**Hero Section**:
- Heading: 48px (mobile) → 72px (desktop), font-weight 700
- Subheading: 18px (mobile) → 20px (desktop), gray-500
- CTA button: 44px height, primary style, centered
- Vertical padding: 64px (mobile) → 128px (desktop)
- Max-width: 720px, centered

**Features Section**:
- Heading: "Características" (optional, 32px)
- Grid: 1 column (mobile) → 3 columns (desktop)
- Card border: 1px solid gray-200
- Card padding: 24px
- Card border-radius: 8px
- Gap between cards: 16px (mobile) → 24px (desktop)
- Vertical padding: 64px (mobile) → 96px (desktop)

**Testimonials Section**:
- Grid: 1 column (mobile) → 2 columns (desktop)
- Card border: 1px solid gray-200
- Card padding: 24px
- Card border-radius: 8px
- Quote text: 16px
- Author: 14px, gray-500
- Vertical padding: 64px (mobile) → 96px (desktop)

**Final CTA Section**:
- Heading: 32px (mobile) → 48px (desktop), centered
- Button: Primary style, centered
- Vertical padding: 64px (mobile) → 96px (desktop)

**Footer** (optional):
- Simple copyright text
- Centered
- Padding: 32px
- Border top: 1px solid gray-200

### Interaction States

**CTA Button Hover**:
- Opacity: 0.9
- Transform: translateY(-1px)
- Transition: 150ms

**Feature Card Hover**:
- Border color: gray-300
- Transition: 150ms

**Theme Toggle**:
- Smooth transition between light/dark (200ms)
- Icon rotates on click

---

## Page 2: Conversation List Page (/voice/conversations)

### Purpose
Shows list of existing conversations. If none exist, prompts user to create first conversation.

### User Flow
1. User clicks CTA from landing page
2. Arrives at conversation list
3. **If NO conversations**: Sees empty state with "Crear primera conversación" button
4. **If conversations exist**: Sees list of conversation cards
5. Clicks "Nueva Conversación" or card
6. **Nueva Conversación** → `/voice/start`
7. **Existing card** → `/voice/[id]`

### Layout Structure

#### Mobile (< 640px)

```
┌────────────────────────────────────────┐
│                                        │
│  [Agent Voice]       [Theme Toggle]    │  ← Header (minimal)
│                                        │
└────────────────────────────────────────┘
│                                        │
│  ┌─────────┐   Conversaciones          │  ← Page heading + button
│  │← Inicio │                           │
│  └─────────┘                           │
│                                        │
│              ┌────────────────────┐    │
│              │ Nueva Conversación │    │  ← Create new button (primary)
│              └────────────────────┘    │
│                                        │
├────────────────────────────────────────┤  ← 1px border
│                                        │
│  EMPTY STATE (if no conversations)     │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │   No hay conversaciones todavía  │ │  ← Empty state card
│  │                                  │ │
│  │   Crea tu primera conversación   │ │
│  │   con el asistente de voz        │ │
│  │                                  │ │
│  │   ┌────────────────────────────┐ │ │
│  │   │ Crear primera conversación │ │ │  ← Primary CTA
│  │   └────────────────────────────┘ │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  CONVERSATION LIST (if conversations)  │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Mi conversación con Gemini       │ │  ← Conversation card 1
│  │                                  │ │
│  │ Voz: Puck                        │ │  ← Metadata (14px, gray)
│  │ Hace 2 horas                     │ │
│  │                                  │ │
│  │             [Eliminar]           │ │  ← Delete button (subtle)
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Asistente personalizado          │ │  ← Conversation card 2
│  │                                  │ │
│  │ Voz: Aoede                       │ │
│  │ Hace 1 día                       │ │
│  │                                  │ │
│  │             [Eliminar]           │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Chat de prueba                   │ │  ← Conversation card 3
│  │                                  │ │
│  │ Voz: Kore                        │ │
│  │ Hace 3 días                      │ │
│  │                                  │ │
│  │             [Eliminar]           │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

#### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [Agent Voice]                                      [Theme Toggle]   │  ← Header (minimal)
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
│                                                                      │
│  ┌─────────┐   Conversaciones              ┌──────────────────────┐ │
│  │← Inicio │                                │ Nueva Conversación   │ │
│  └─────────┘                                └──────────────────────┘ │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤  ← 1px border
│                                                                      │
│  EMPTY STATE (if no conversations)                                  │
│                                                                      │
│        ┌────────────────────────────────────────────────┐           │
│        │                                                │           │
│        │     No hay conversaciones todavía              │           │  ← Empty state (centered)
│        │                                                │           │
│        │     Crea tu primera conversación con el        │           │
│        │     asistente de voz                           │           │
│        │                                                │           │
│        │        ┌────────────────────────────┐          │           │
│        │        │ Crear primera conversación │          │           │
│        │        └────────────────────────────┘          │           │
│        │                                                │           │
│        └────────────────────────────────────────────────┘           │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CONVERSATION LIST (if conversations exist)                          │
│                                                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │  ← 2-column grid
│  │                          │  │                          │        │
│  │ Mi conversación con      │  │ Asistente personalizado  │        │
│  │ Gemini                   │  │                          │        │
│  │                          │  │                          │        │
│  │ Voz: Puck                │  │ Voz: Aoede               │        │
│  │ Hace 2 horas             │  │ Hace 1 día               │        │
│  │                          │  │                          │        │
│  │         [Eliminar]       │  │         [Eliminar]       │        │
│  │                          │  │                          │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │                          │  │                          │        │
│  │ Chat de prueba           │  │ (empty slot)             │        │
│  │                          │  │                          │        │
│  │ Voz: Kore                │  │                          │        │
│  │ Hace 3 días              │  │                          │        │
│  │                          │  │                          │        │
│  │         [Eliminar]       │  │                          │        │
│  │                          │  │                          │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Header**:
- Same as landing page
- Back button: "← Inicio" (links to `/`)
- Page title: "Conversaciones" (24px)
- "Nueva Conversación" button: Primary style (top-right)

**Empty State**:
- Card border: 1px solid gray-200
- Card padding: 48px
- Border-radius: 8px
- Heading: 24px, font-weight 600
- Description: 16px, gray-500
- CTA button: Primary style, centered
- Max-width: 480px, centered on page

**Conversation Card**:
- Border: 1px solid gray-200
- Border-radius: 8px
- Padding: 24px
- Title: 18px, font-weight 600
- Metadata: 14px, gray-500
- Delete button: Secondary style, small, right-aligned
- Hover: Border color changes to gray-300, cursor pointer
- Click: Navigate to `/voice/[id]`

**List Layout**:
- Mobile: Single column, 16px gap
- Desktop: 2-column grid, 24px gap
- Container max-width: 1024px

### Interaction States

**Conversation Card Hover**:
- Border color: gray-300
- Subtle lift: translateY(-2px)
- Transition: 150ms

**Delete Button**:
- Confirm dialog before deletion
- Toast notification on success

---

## Page 3: Voice Config/Start Page (/voice/start)

### Purpose
Form to configure new conversation before starting. User selects voice, provides system prompt, and names the conversation.

### User Flow
1. User clicks "Nueva Conversación" from conversation list
2. Fills out configuration form:
   - Conversation title (optional but recommended)
   - Voice selection (required)
   - System prompt (required, with default)
3. Clicks "Iniciar Conversación"
4. System creates conversation record
5. Redirects to `/voice/[id]` (active chat page)

### Layout Structure

#### Mobile (< 640px)

```
┌────────────────────────────────────────┐
│                                        │
│  [Agent Voice]       [Theme Toggle]    │  ← Header
│                                        │
└────────────────────────────────────────┘
│                                        │
│  ┌──────────────┐  Nueva Conversación  │  ← Page heading
│  │← Conversaciones│                    │
│  └──────────────┘                      │
│                                        │
│  Configura tu asistente de voz         │  ← Subtitle (16px, gray)
│  antes de comenzar                     │
│                                        │
├────────────────────────────────────────┤  ← 1px border
│                                        │
│  CONFIGURATION FORM                    │
│                                        │
│  Título de la Conversación             │  ← Label (14px, medium)
│  ┌──────────────────────────────────┐ │
│  │ Mi conversación con Gemini       │ │  ← Input field
│  └──────────────────────────────────┘ │
│  Un nombre descriptivo                 │  ← Hint text (12px, gray)
│                                        │
│                                        │
│  Voz del Asistente *                   │  ← Label (required)
│  ┌──────────────────────────────────┐ │
│  │ Selecciona una voz           ▼   │ │  ← Select dropdown
│  └──────────────────────────────────┘ │
│  Selecciona la voz que usará           │  ← Hint text
│  el asistente                          │
│                                        │
│                                        │
│  Instrucción del Sistema *             │  ← Label (required)
│  ┌──────────────────────────────────┐ │
│  │ Eres un asistente de voz         │ │  ← Textarea (120px min height)
│  │ amigable y útil. Responde de     │ │
│  │ manera concisa y conversacional. │ │
│  │                                  │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│  Define la personalidad y el           │  ← Hint text
│  comportamiento del asistente          │
│                                        │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │     Iniciar Conversación         │ │  ← Primary button (full width)
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │         Cancelar                 │ │  ← Secondary button (full width)
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

#### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [Agent Voice]                                      [Theme Toggle]   │  ← Header
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
│                                                                      │
│  ┌──────────────┐         Nueva Conversación                        │  ← Page heading (32px)
│  │← Conversaciones│                                                  │
│  └──────────────┘                                                    │
│                                                                      │
│         Configura tu asistente de voz antes de comenzar             │  ← Subtitle (18px, gray)
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤  ← 1px border
│                                                                      │
│                    CONFIGURATION FORM                                │
│                                                                      │
│             ┌────────────────────────────────────────┐              │  ← Form max-width: 560px, centered
│             │                                        │              │
│             │  Título de la Conversación             │              │  ← Label (14px, medium)
│             │  ┌──────────────────────────────────┐ │              │
│             │  │ Mi conversación con Gemini       │ │              │  ← Input field (44px height)
│             │  └──────────────────────────────────┘ │              │
│             │  Un nombre descriptivo                │              │  ← Hint (12px, gray-500)
│             │                                        │              │
│             │                                        │              │
│             │  Voz del Asistente *                   │              │  ← Label (required)
│             │  ┌──────────────────────────────────┐ │              │
│             │  │ Selecciona una voz           ▼   │ │              │  ← Select dropdown
│             │  └──────────────────────────────────┘ │              │
│             │  Selecciona la voz que usará el       │              │  ← Hint
│             │  asistente                            │              │
│             │                                        │              │
│             │                                        │              │
│             │  Instrucción del Sistema *             │              │  ← Label (required)
│             │  ┌──────────────────────────────────┐ │              │
│             │  │ Eres un asistente de voz         │ │              │  ← Textarea (140px min)
│             │  │ amigable y útil. Responde de     │ │              │
│             │  │ manera concisa y conversacional. │ │              │
│             │  │                                  │ │              │
│             │  │                                  │ │              │
│             │  └──────────────────────────────────┘ │              │
│             │  Define la personalidad y el          │              │  ← Hint
│             │  comportamiento del asistente         │              │
│             │                                        │              │
│             │                                        │              │
│             │  ┌────────────────┐ ┌──────────────┐ │              │
│             │  │ Iniciar        │ │  Cancelar    │ │              │  ← Button group (inline)
│             │  │ Conversación   │ │              │ │
│             │  └────────────────┘ └──────────────┘ │              │
│             │                                        │              │
│             └────────────────────────────────────────┘              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Header**:
- Same minimal header
- Back button: "← Conversaciones" (links to `/voice/conversations`)
- Page title: "Nueva Conversación" (24px mobile, 32px desktop)
- Subtitle: 16px (mobile), 18px (desktop), gray-500

**Form Container**:
- Max-width: 560px (centered on desktop)
- Full-width on mobile
- Padding: 24px
- Background: Transparent (no card border for clean look)

**Form Fields**:
- **Title Input**:
  - Label: 14px, font-weight 500
  - Input: 44px height, 16px text
  - Placeholder: "Mi conversación con Gemini"
  - Hint text: 12px, gray-500
  - Optional field

- **Voice Select**:
  - Label: 14px, font-weight 500, "required" indicator (*)
  - Select: 44px height, 16px text
  - Options: Puck, Charon, Kore, Fenrir, Aoede
  - Hint text: 12px, gray-500
  - Required field

- **System Prompt Textarea**:
  - Label: 14px, font-weight 500, "required" indicator (*)
  - Textarea: Min-height 120px (mobile), 140px (desktop)
  - Default value: "Eres un asistente de voz amigable y útil..."
  - Hint text: 12px, gray-500
  - Required field

**Buttons**:
- Mobile: Stacked (full-width), 16px gap
- Desktop: Inline (side-by-side), 12px gap
- Primary: "Iniciar Conversación" (44px height)
- Secondary: "Cancelar" (44px height, outline style)

**Spacing**:
- Between form fields: 24px
- After each hint text: 24px
- Before buttons: 32px

### Interaction States

**Form Validation**:
- Required fields show error border (red) if empty on submit
- Inline validation on blur for better UX
- Error messages appear below fields (14px, red)

**Button States**:
- Primary button disabled until required fields filled
- Loading state: "Creando..." text with spinner
- Success: Toast notification + redirect

**Voice Select**:
- Dropdown opens with 5 voice options
- Each option shows voice name only
- Selected voice highlighted

---

## Page 4: Active Chat Page (/voice/[id])

### Purpose
Real-time voice conversation interface. Minimal chrome to focus on conversation. Shows connection status, microphone controls, and conversation info.

### User Flow
1. User creates conversation OR clicks existing conversation
2. Page loads conversation config
3. Auto-connects to Gemini Live API
4. User sees connection status
5. User can mute/unmute microphone
6. User speaks to have conversation
7. User can disconnect and return to conversation list

### Layout Structure

#### Mobile (< 640px)

```
┌────────────────────────────────────────┐
│                                        │
│  [← Back]  Mi conversación con Gemini  │  ← Header (conversation title)
│                                        │
│            [● Conectado]               │  ← Connection status (right side)
│                                        │
└────────────────────────────────────────┘  ← 1px border bottom
│                                        │
│                                        │
│                                        │
│          MAIN CONTENT AREA             │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │    Conversación en Vivo          │ │  ← Status card
│  │                                  │ │
│  │    Voz: Puck                     │ │  ← Voice info (14px, gray)
│  │                                  │ │
│  │    Habla para comenzar la        │ │  ← Instruction (16px)
│  │    conversación                  │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │  ← Controls card
│  │   ┌────────────────────────┐    │ │
│  │   │  [🎤] Silenciar        │    │ │  ← Mute/unmute button
│  │   └────────────────────────┘    │ │
│  │                                  │ │
│  │   ┌────────────────────────┐    │ │
│  │   │  Cerrar Sesión         │    │ │  ← Disconnect button
│  │   └────────────────────────┘    │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

#### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [← Back]   Mi conversación con Gemini            [● Conectado]     │  ← Header (minimal)
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘  ← 1px border bottom
│                                                                      │
│                                                                      │
│                       MAIN CONTENT AREA                              │  ← Max-width: 720px, centered
│                                                                      │
│         ┌────────────────────────────────────────────┐              │
│         │                                            │              │
│         │        Conversación en Vivo                │              │  ← Status card
│         │                                            │              │
│         │        Voz: Puck                           │              │  ← Voice info
│         │                                            │              │
│         │        Habla para comenzar la conversación │              │  ← Instruction
│         │                                            │              │
│         └────────────────────────────────────────────┘              │
│                                                                      │
│                                                                      │
│         ┌────────────────────────────────────────────┐              │
│         │                                            │              │  ← Controls card
│         │    ┌──────────────┐  ┌──────────────┐    │              │
│         │    │ [🎤] Silenciar│  │Cerrar Sesión │    │              │  ← Button group (inline)
│         │    └──────────────┘  └──────────────┘    │              │
│         │                                            │              │
│         └────────────────────────────────────────────┘              │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Header**:
- Back button: "← Back" icon (left, links to `/voice/conversations`)
- Conversation title: 18px, font-weight 600 (truncate if long)
- Connection status: Right-aligned pill
  - "● Conectado" (green dot + text) when connected
  - "○ Conectando..." (gray dot + text) when connecting
  - "○ Desconectado" (red dot + text) when disconnected
  - "⚠ Error" when error
- Height: 64px
- Border-bottom: 1px solid gray-200

**Main Content**:
- Max-width: 720px, centered
- Vertical padding: 48px (mobile) → 64px (desktop)
- Horizontal padding: 16px (mobile) → 24px (desktop)

**Status Card**:
- Border: 1px solid gray-200
- Border-radius: 8px
- Padding: 24px
- Text alignment: Center
- Heading: 20px, font-weight 600
- Voice info: 14px, gray-500
- Instruction: 16px, gray-700
- Margin-bottom: 24px

**Controls Card**:
- Border: 1px solid gray-200
- Border-radius: 8px
- Padding: 24px
- Buttons:
  - Mobile: Stacked (full-width), 12px gap
  - Desktop: Inline (centered, side-by-side), 12px gap
  - Mute button: 44px height, changes color when muted
    - Active (unmuted): Black background, white text
    - Muted: Red background, white text
  - Disconnect button: 44px height, secondary style (outline)

**Connection Status Pill**:
- Border-radius: 9999px (pill shape)
- Padding: 4px 12px
- Font-size: 14px
- Status indicator dot: 8px diameter
- Colors:
  - Connected: Green (#00ff88)
  - Connecting: Gray (#737373)
  - Disconnected: Red (#ff4757)
  - Error: Orange/Yellow (#ffd93d)

### Interaction States

**Connecting State**:
- Status card shows: "Conectando al asistente..."
- Mute button disabled
- Disconnect button disabled
- Loading spinner visible

**Connected State**:
- Status card shows conversation instructions
- Mute button enabled (toggles between mute/unmute)
- Disconnect button enabled
- Connection status: "● Conectado"

**Muted State**:
- Mute button shows: "🎤 Activar Micrófono"
- Mute button background: Red
- Status card instruction: "Micrófono silenciado"

**Error State**:
- Status card shows error message
- Retry button appears
- Connection status: "⚠ Error"

**Disconnecting**:
- Both buttons disabled
- Shows "Desconectando..." text
- Redirect to conversation list after disconnect

### Error Handling

**Configuration Not Found**:
- Toast error: "No se encontró la configuración"
- Auto-redirect to conversation list

**Connection Failed**:
- Error card displayed with message
- Retry button available
- Back button to return to list

**Microphone Permission Denied**:
- Alert dialog explaining permission needed
- Instructions to enable microphone

---

## User Flow Diagram

Complete flow across all 4 pages:

```
     Landing Page (/)
           │
           │ [Click "Probar" or "Comenzar"]
           ↓
  Conversation List (/voice/conversations)
           │
           ├──→ [No conversations]
           │         │
           │         │ [Click "Crear primera conversación"]
           │         ↓
           │    Voice Config (/voice/start)
           │         │
           │         │ [Fill form + Click "Iniciar"]
           │         ↓
           │    Active Chat (/voice/[new-id])
           │
           └──→ [Has conversations]
                     │
                     ├──→ [Click "Nueva Conversación"]
                     │         │
                     │         ↓
                     │    Voice Config (/voice/start)
                     │         │
                     │         │ [Fill form + Click "Iniciar"]
                     │         ↓
                     │    Active Chat (/voice/[new-id])
                     │
                     └──→ [Click existing conversation card]
                               │
                               ↓
                          Active Chat (/voice/[id])
                               │
                               │ [Click "Cerrar Sesión"]
                               ↓
                          Conversation List (/voice/conversations)
```

---

## Responsive Strategy

All pages follow mobile-first approach:

**Mobile (< 640px)**:
- Single column layouts
- Stacked buttons (full-width)
- Reduced padding (16px)
- Smaller typography
- Navigation: Back buttons

**Tablet (640px - 1024px)**:
- 2-column grids where appropriate
- Inline buttons (not full-width)
- Increased padding (24px)
- Medium typography
- Same navigation

**Desktop (> 1024px)**:
- 2-3 column grids
- Centered content (max-width containers)
- Generous padding (32px - 64px)
- Large typography for headings
- Same navigation

---

## Accessibility Considerations

All wireframes incorporate:

**Keyboard Navigation**:
- Tab order follows visual flow
- Focus states visible (2px outline)
- Skip links for main content
- Escape closes modals/dropdowns

**Screen Reader**:
- Semantic HTML (header, nav, main, section)
- ARIA labels for icon buttons
- Live regions for status changes
- Descriptive link text

**Touch Targets**:
- Minimum 44x44px for all interactive elements
- Adequate spacing between targets (8px+)

**Color Contrast**:
- Black on white: 21:1 (maximum)
- Gray text: Minimum 4.5:1 ratio
- Status colors distinguishable without color

**Visual Hierarchy**:
- Clear heading structure (h1 → h2 → h3)
- Size and spacing create natural reading flow
- Important actions visually prominent

---

## Design Quality Notes

**Consistency**:
- Card borders: Always 1px solid gray-200
- Border radius: Always 8px for cards/buttons
- Button height: Always 44px
- Spacing scale: 4px increments
- Typography: Geist font throughout

**Minimalism**:
- No unnecessary decoration
- Generous whitespace
- Clear visual hierarchy through scale
- Limited color palette (black, white, gray)

**User-Focused**:
- Clear CTAs at every step
- Helpful hint text for form fields
- Loading states prevent confusion
- Error states guide recovery
- Empty states encourage action

**Performance**:
- Minimal components per page
- Fast load times (no heavy assets)
- Smooth transitions (200ms max)
- Responsive images (if added)

This wireframe specification provides complete layout guidance for all 4 pages following Vercel's minimalist aesthetic while maintaining functionality and accessibility.
