# Gemini Live Redesign - Roadmap Implementation Plan

**Created**: 2025-11-29
**Session**: redesign_gemini_landing
**Complexity**: High

## 1. Request Overview

**What**: Complete redesign of the Gemini Live voice agent application with a Vercel-style minimalist aesthetic, new landing page, dark/light mode support, and technical cleanup.

**Why**:
- Improve user experience with modern, clean design
- Increase SEO and recognition with better URL structure
- Reduce technical debt by removing unused code and consolidating voice agent implementations
- Provide compelling landing page that showcases the Gemini Live functionality

**Primary stakeholders**:
- End users (improved UX/UI)
- Development team (cleaner codebase)
- Business (better SEO and user engagement)

---

## 2. Clarifying Questions

### 2.1 Design & Branding
1. **Color Palette**: Do you want to follow Vercel's exact color scheme (black/white with subtle grays) or would you prefer to maintain some brand identity with custom colors? Should we keep the cyan accent color currently used?

2. **Typography**: Should we use Vercel's Geist font family, or do you have a preferred font stack? (Current implementation uses CSS variables for fonts)

3. **Logo/Brand**: Do you have a logo or brand name for this application, or should we create a minimal text-based logo?

### 2.2 Landing Page Content
4. **Hero Section**: What is the primary value proposition you want to communicate? (e.g., "Real-time voice conversations powered by Gemini AI")

5. **Features Section**: Which Gemini Live features should we highlight? (e.g., real-time transcription, multiple voices, low latency, custom system prompts)

6. **Demo/CTA**: Should we include:
   - Live demo/preview on landing page?
   - Immediate "Try Now" CTA that creates a conversation?
   - Video/animation demonstration?

7. **Social Proof**: Do you want testimonials, usage statistics, or other trust indicators?

### 2.3 URL Structure
8. **Proposed URL Structure** - Please confirm or provide feedback:
   - Current: `/gemini-live` (landing) → `/gemini-live/new` (config) → `/gemini-live/[sessionId]` (active)
   - **Proposed Option A** (SEO-friendly):
     - `/` (new landing page)
     - `/start` or `/new` (configuration)
     - `/session/[sessionId]` or `/chat/[sessionId]` (active conversation)
   - **Proposed Option B** (Product-focused):
     - `/` (new landing page)
     - `/voice/start` (configuration)
     - `/voice/[sessionId]` (active conversation)
   - **Your preference?**

### 2.4 Technical Cleanup
9. **File Deletion Confirmation**: I've identified these files that appear to be duplicates or unused:
   - `/app/page.tsx` (simple conversations list - superseded by `/gemini-live/page.tsx`)
   - `/app/conversation/*` (old conversation routes - confirm these are unused?)
   - Should we keep or remove these?

10. **Dark Mode Preference**: Should dark mode be:
    - System preference by default (auto-detect)
    - Dark by default with toggle?
    - Light by default with toggle?

### 2.5 Features & Scope
11. **Session Management**: Should the landing page include:
    - Recent conversations list (current behavior)?
    - Just a CTA to start new conversation?
    - Dashboard with statistics?

12. **Authentication**: Is this application public or will it require authentication in the future? (Affects design decisions)

---

## 3. Confirmed Scope & Success Criteria

### In-Scope
- Complete visual redesign with Vercel-inspired minimalist aesthetic
- Dark mode and light mode support with smooth transitions
- New compelling landing page for Gemini Live
- URL structure optimization (pending clarification above)
- Technical cleanup: remove duplicate/unused files
- Component library updates using shadcn/ui
- Responsive design (mobile-first approach)
- Accessibility improvements (ARIA labels, keyboard navigation)

### Out-of-Scope / Deferred
- Authentication system (not mentioned in requirements)
- Additional voice agent implementations (focusing only on Gemini Live)
- Backend API changes (keeping existing Gemini Live integration)
- Real-time transcription display (unless specified in clarifying questions)
- Analytics/tracking implementation

### Success Metrics

**Qualitative Checkpoints**:
- Clean, minimalist design matching Vercel aesthetic
- Smooth dark/light mode transitions without flicker
- Improved information architecture and navigation
- Compelling landing page that clearly communicates value proposition
- No visual complexity or unnecessary UI elements
- All critical constraints followed (RSC, named exports, domain structure)

**Quantitative Checkpoints**:
- Lighthouse Performance Score: 90+
- Lighthouse Accessibility Score: 95+
- Zero critical console errors
- Dark/light mode transition time: <200ms
- Mobile responsiveness: all breakpoints working
- Reduced bundle size (remove unused code)
- File count reduction: 20%+ (cleanup target)

---

## 4. Roadmap Phases (with owners)

### Phase 1 - Discovery & Planning (Owner: Strategic PM)
**Duration**: 1 session
**Deliverables**:
- Comprehensive roadmap document (this file)
- Clarifying questions answered by user
- File deletion list confirmed
- URL structure finalized
- Landing page content outline approved

**Success Criteria**:
- All clarifying questions answered
- User approval on proposed changes
- Clear understanding of design direction

---

### Phase 2 - Design System & UX Architecture (Owner: UX/UI Designer)
**Duration**: 2-3 sessions
**Deliverables**:
- Design system documentation including:
  - Color palette (dark/light mode tokens)
  - Typography scale
  - Spacing system
  - Component variants
  - Animation/transition guidelines
- Wireframes for:
  - New landing page (hero, features, CTA sections)
  - Configuration page (redesigned)
  - Active session page (redesigned)
- Theme switching strategy (system/manual)
- Accessibility checklist

**Success Criteria**:
- Complete design tokens for dark/light modes
- Wireframes approved by user
- Design system follows Vercel aesthetic
- Mobile-first responsive breakpoints defined
- Accessibility standards documented

**Dependencies**:
- Phase 1 must be complete (clarifying questions answered)

---

### Phase 3 - Component Library & Theme System (Owner: shadcn Builder)
**Duration**: 2-3 sessions
**Deliverables**:
- Updated shadcn/ui components with theme support:
  - Button variants (primary, secondary, ghost)
  - Input/Textarea with dark mode
  - Select/Dropdown with dark mode
  - Card components
  - Navigation components
- Theme provider setup:
  - Context for theme state
  - CSS variables for light/dark
  - Theme toggle component
- Landing page components:
  - Hero section
  - Features grid
  - CTA sections
  - Footer

**Success Criteria**:
- All components support dark/light mode
- Theme switching works without flicker
- Components follow design system tokens
- Storybook documentation updated
- Zero visual regressions

**Dependencies**:
- Phase 2 complete (design system defined)
- Design tokens available

---

### Phase 4 - Next.js Architecture & Routing (Owner: Next.js Builder)
**Duration**: 2-3 sessions
**Deliverables**:
- New URL structure implementation:
  - Root route: landing page
  - Start/configuration route
  - Session route with improved naming
- Page implementations:
  - New landing page (Server Component)
  - Redesigned configuration page
  - Redesigned active session page
- Layout updates:
  - Root layout with theme provider
  - Navigation/header component
  - Footer component
- Redirects from old URLs to new URLs
- Metadata optimization for SEO

**Success Criteria**:
- All routes working with new structure
- Old URLs redirect properly
- Server Components used by default
- Proper Suspense boundaries
- Metadata configured for SEO
- Mobile-responsive layouts

**Dependencies**:
- Phase 3 complete (components ready)
- URL structure finalized from Phase 1

---

### Phase 5 - Domain Integration & Cleanup (Owner: Domain Architect)
**Duration**: 1-2 sessions
**Deliverables**:
- voice-agent domain updates:
  - Text maps updated for new copy
  - Hooks updated for theme support
  - Stores updated if needed
- File cleanup execution:
  - Remove `/app/conversation/*` routes
  - Remove duplicate `/app/page.tsx`
  - Remove any unused components
  - Remove unused dependencies
- Repository pattern verification:
  - Ensure all data access uses repository pattern
  - No direct DB imports in components

**Success Criteria**:
- All text externalized in text maps
- No hardcoded strings in components
- Repository pattern followed
- Unused files deleted
- Domain structure clean and organized

**Dependencies**:
- Phase 4 complete (new routes working)
- File deletion list confirmed in Phase 1

---

### Phase 6 - Validation & Quality Assurance (Owner: Code Reviewer + QA)
**Duration**: 1-2 sessions
**Deliverables**:
- Code review report:
  - Critical constraints verification
  - Architecture patterns compliance
  - Performance audit
- Testing checklist execution:
  - Cross-browser testing (Chrome, Safari, Firefox)
  - Mobile device testing (iOS, Android)
  - Dark/light mode testing
  - Accessibility audit (screen readers, keyboard nav)
  - Performance testing (Lighthouse)
- Bug fixes and optimizations
- Final user acceptance testing

**Success Criteria**:
- All critical constraints followed
- Zero TypeScript errors
- Lighthouse scores meet targets
- No console errors
- Accessibility standards met
- User approval for launch

**Dependencies**:
- Phase 5 complete (all implementation done)

---

## 5. Directives to Agents

### 5.1 UX/UI Designer
**Directive**: Create comprehensive design system and wireframes for Gemini Live redesign

**Specific Tasks**:
1. Research Vercel's design language and extract key principles:
   - Minimalist aesthetic (lots of whitespace)
   - Typography hierarchy (large, clear headings)
   - Subtle shadows and borders
   - Clean color palette (primarily monochrome with accent)

2. Create design token system:
   - Color palette: light mode (white/gray) + dark mode (black/dark gray)
   - Accent colors: determine if keeping cyan or switching
   - Typography scale: heading sizes, body text, captions
   - Spacing scale: consistent spacing units
   - Border radius: sharp vs subtle rounding
   - Shadow system: elevation levels

3. Design landing page wireframes with sections:
   - **Hero**: Large headline, subtitle, primary CTA
   - **Features**: 3-4 key features with icons/visuals
   - **Demo**: Interactive preview or video
   - **Benefits**: Why use Gemini Live
   - **Footer**: Links, credits, theme toggle

4. Design configuration page:
   - Simplified form layout
   - Clear visual hierarchy
   - Inline help text
   - Voice selection with preview

5. Design active session page:
   - Minimal chrome (focus on content)
   - Clear connection status
   - Prominent mic controls
   - Clean transcript display (if included)

**Deliverables**:
- Design system documentation (`.claude/docs/design-system-gemini-redesign.md`)
- Wireframes (can be markdown/text-based descriptions)
- Component specifications
- Accessibility guidelines

**UX Acceptance Criteria**:
- Designs follow Vercel aesthetic principles
- Dark/light mode color tokens defined
- Mobile-first responsive approach
- Clear user flows for all journeys
- Accessibility considerations documented

---

### 5.2 shadcn Builder
**Directive**: Implement theme system and component library for Gemini Live redesign

**Specific Tasks**:
1. Set up theme infrastructure:
   - Install/configure `next-themes` for theme provider
   - Create CSS variable system for light/dark modes
   - Create theme toggle component
   - Ensure no flicker on page load (proper SSR)

2. Update shadcn/ui components for theme support:
   - Review current components in `/components/ui/`
   - Add dark mode variants using CSS variables
   - Ensure consistent styling with design tokens
   - Test all interactive states (hover, focus, active)

3. Create new landing page components:
   - **atoms**: theme-toggle-button, feature-icon, stat-display
   - **molecules**: feature-card, hero-section, cta-block
   - **organisms**: features-grid, landing-hero, landing-footer
   - All components must support dark/light mode

4. Update existing voice agent components:
   - Redesign mic-button with new aesthetic
   - Redesign connection-status indicator
   - Redesign conversation-card for landing
   - Update voice-controls styling

5. Create Storybook stories for all new components

**Deliverables**:
- Theme provider configured in root layout
- Theme toggle component (header/footer)
- All shadcn/ui components themed
- New landing page components
- Updated voice agent components
- Storybook documentation

**Technical Requirements**:
- Use CSS variables (not hardcoded colors)
- Follow critical constraint #10 (@apply for repetition)
- Named exports only (no default exports)
- Proper TypeScript types for all props
- Accessibility attributes (ARIA labels)

**Files to Create/Modify**:
- `/components/atoms/theme-toggle.tsx`
- `/components/molecules/feature-card.tsx`
- `/components/organisms/landing-hero.tsx`
- `/components/organisms/features-grid.tsx`
- `/styles/components/atoms/theme-toggle.css` (if needed)
- `/lib/theme-provider.tsx` (or similar)

---

### 5.3 Next.js Builder
**Directive**: Implement new routing structure and page layouts for Gemini Live redesign

**Specific Tasks**:
1. Implement new URL structure (based on Phase 1 decision):
   - Create new route structure in `/app/`
   - Set up proper layouts for each route
   - Configure metadata for SEO
   - Create redirects from old URLs

2. Build landing page (`/app/page.tsx`):
   - Server Component by default
   - Suspense boundaries for any async data
   - Hero section with CTA
   - Features section
   - Benefits section
   - Footer with theme toggle

3. Redesign configuration page:
   - Client Component (form interactivity)
   - Use React Hook Form + Zod validation
   - Improved UX with inline validation
   - Voice preview functionality
   - Route to new session URL structure

4. Redesign active session page:
   - Client Component (WebSocket/audio)
   - Use existing `use-gemini-live` hook
   - New visual design from UX/UI phase
   - Proper loading and error states
   - Connection status display

5. Root layout updates:
   - Wrap with theme provider
   - Add navigation if needed
   - Proper metadata configuration
   - Font loading optimization

**Deliverables**:
- New route structure implemented
- Landing page (Server Component)
- Configuration page (Client Component)
- Active session page (Client Component)
- Root layout with theme provider
- Redirects configured
- Metadata optimized

**Technical Requirements**:
- Follow critical constraint #1 (RSC by default)
- Follow critical constraint #3 (Suspense for async)
- Follow critical constraint #9 (React Hook Form for complex forms)
- Named exports for all components
- Proper error boundaries
- Mobile-responsive (Tailwind mobile-first)

**Files to Create/Modify**:
- `/app/page.tsx` (new landing page)
- `/app/layout.tsx` (add theme provider)
- `/app/start/page.tsx` or `/app/new/page.tsx` (based on URL decision)
- `/app/session/[sessionId]/page.tsx` or similar (based on URL decision)
- `/middleware.ts` (if redirects needed)

**Dependencies**:
- Phase 3 complete (components available)
- URL structure decided in Phase 1

---

### 5.4 Domain Architect
**Directive**: Update voice-agent domain and execute technical cleanup

**Specific Tasks**:
1. Update voice-agent text maps:
   - Create new text entries for landing page
   - Update existing text for new design
   - Ensure all user-facing text is externalized
   - Consider bilingual support (currently Spanish)

2. Review and update domain structure:
   - Verify repository pattern usage
   - Check that no business logic is in components
   - Ensure hooks are properly organized
   - Validate schema definitions

3. Execute file cleanup:
   - Delete `/app/conversation/` directory (if confirmed unused)
   - Remove old `/app/page.tsx` after landing page is implemented
   - Remove unused components from domain
   - Remove unused dependencies from package.json
   - Update imports across codebase

4. Update stores if needed:
   - Review conversation store for theme support
   - Ensure Zustand is only used for UI state (not server state)

5. Domain integrity verification:
   - All text in text maps (no hardcoded strings)
   - Business logic in hooks/actions only
   - Repository pattern followed
   - Proper type safety throughout

**Deliverables**:
- Updated text maps with new landing page copy
- Cleaned up domain structure
- File deletion execution log
- Dependency cleanup in package.json
- Domain verification report

**Technical Requirements**:
- Follow critical constraint #5 (domain-based organization)
- Follow critical constraint #7 (state management strategy)
- Follow critical constraint #11 (business logic in hooks)
- No hardcoded strings (all in text maps)
- Repository pattern for all data access

**Files to Create/Modify**:
- `/domains/voice-agent/text-maps/gemini-live.text-map.ts` (update)
- `/domains/voice-agent/text-maps/landing-page.text-map.ts` (new, if separate)
- Delete: `/app/conversation/` (entire directory, if confirmed)
- Delete: old `/app/page.tsx`
- `package.json` (remove unused deps)

**Dependencies**:
- Phase 4 complete (new routes working)
- File deletion approval from Phase 1

---

### 5.5 Code Reviewer (QA + Validation)
**Directive**: Validate implementation quality and ensure compliance with all constraints

**Specific Tasks**:
1. Critical constraints verification:
   - Verify RSC usage (Server Components by default)
   - Verify Server Actions for mutations
   - Verify Suspense boundaries
   - Verify named exports (no default exports)
   - Verify domain-based organization
   - Verify naming conventions
   - Verify state management strategy
   - Verify form implementation (React Hook Form)
   - Verify styling patterns (@apply usage)
   - Verify business logic in hooks
   - Create compliance report

2. Code quality review:
   - TypeScript errors: zero tolerance
   - ESLint errors: zero tolerance
   - Console errors: zero tolerance
   - Unused imports: clean up
   - Dead code: remove
   - Proper error handling

3. Performance audit:
   - Run Lighthouse on all pages
   - Check bundle size
   - Identify code-splitting opportunities
   - Review image optimization
   - Check font loading strategy

4. Accessibility audit:
   - Keyboard navigation working
   - Screen reader testing
   - Color contrast ratios (WCAG AA minimum)
   - ARIA labels present
   - Focus indicators visible
   - No accessibility violations

5. Cross-browser/device testing:
   - Chrome (desktop/mobile)
   - Safari (desktop/mobile)
   - Firefox (desktop)
   - Responsive breakpoints (mobile, tablet, desktop)
   - Dark/light mode on all browsers

6. User acceptance testing preparation:
   - Create testing checklist
   - Document known issues
   - Prepare demo environment

**Deliverables**:
- Critical constraints compliance report
- Code quality audit report
- Performance audit results (Lighthouse scores)
- Accessibility audit report
- Cross-browser testing report
- User acceptance testing checklist
- Bug/issue tracking list
- Final approval or remediation list

**Technical Requirements**:
- Must verify ALL critical constraints
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Zero TypeScript errors
- Zero console errors in production

**Files to Create**:
- `.claude/reports/code-review-gemini-redesign.md`
- `.claude/reports/performance-audit-gemini-redesign.md`
- `.claude/reports/accessibility-audit-gemini-redesign.md`

**Dependencies**:
- Phase 5 complete (all implementation finished)

---

## 6. Cross-Agent Dependencies & Handoffs

### Dependency Map

```
Phase 1 (PM)
    ↓ [Clarifying questions answered, design direction confirmed]
Phase 2 (UX/UI Designer)
    ↓ [Design system + wireframes]
Phase 3 (shadcn Builder)
    ↓ [Components ready]
Phase 4 (Next.js Builder)
    ↓ [Pages implemented]
Phase 5 (Domain Architect)
    ↓ [Cleanup + domain updates]
Phase 6 (Code Reviewer)
    ↓ [Final validation]
LAUNCH
```

### Critical Handoff Points

1. **PM → UX/UI Designer**
   - Artifact: Answered clarifying questions document
   - Due: Before Phase 2 starts
   - Required: URL structure decision, design direction, content outline

2. **UX/UI Designer → shadcn Builder**
   - Artifact: Design system documentation + wireframes
   - Due: Before Phase 3 starts
   - Required: Color tokens, typography scale, component specs, spacing system

3. **shadcn Builder → Next.js Builder**
   - Artifact: Complete component library with theme support
   - Due: Before Phase 4 starts
   - Required: All components working, Storybook docs, theme provider setup

4. **Next.js Builder → Domain Architect**
   - Artifact: Working application with new routes
   - Due: Before Phase 5 starts
   - Required: All pages functional, old routes still accessible (for comparison)

5. **Domain Architect → Code Reviewer**
   - Artifact: Cleaned up codebase
   - Due: Before Phase 6 starts
   - Required: Files deleted, text maps updated, domain integrity verified

---

## 7. Files to Create

### Design & Planning (Phase 2)
- `.claude/docs/design-system-gemini-redesign.md` - Complete design system
- `.claude/docs/landing-page-wireframes.md` - Landing page structure
- `.claude/docs/theme-tokens.md` - Color, typography, spacing tokens

### Components (Phase 3)
- `/src/components/atoms/theme-toggle.tsx` - Theme switcher
- `/src/components/molecules/feature-card.tsx` - Landing page feature card
- `/src/components/organisms/landing-hero.tsx` - Hero section
- `/src/components/organisms/features-grid.tsx` - Features section
- `/src/components/organisms/landing-footer.tsx` - Footer with links
- `/src/lib/theme-provider.tsx` - Theme context provider
- `/src/styles/components/atoms/theme-toggle.css` - Theme toggle styles (if needed)

### Pages & Routes (Phase 4)
- `/src/app/page.tsx` - NEW landing page (replaces old)
- `/src/app/start/page.tsx` - Configuration page (or /new based on decision)
- `/src/app/session/[sessionId]/page.tsx` - Active session (or /chat/[id] based on decision)
- `/src/app/layout.tsx` - UPDATE with theme provider
- `/src/middleware.ts` - UPDATE with redirects (if needed)

### Domain Updates (Phase 5)
- `/src/domains/voice-agent/text-maps/landing-page.text-map.ts` - Landing page text
- Update: `/src/domains/voice-agent/text-maps/gemini-live.text-map.ts` - Updated text

### Reports (Phase 6)
- `.claude/reports/code-review-gemini-redesign.md` - Code review results
- `.claude/reports/performance-audit-gemini-redesign.md` - Lighthouse results
- `.claude/reports/accessibility-audit-gemini-redesign.md` - A11y audit
- `.claude/reports/user-acceptance-testing.md` - UAT checklist

---

## 8. Files to Delete (Pending Confirmation)

### Confirmed for Deletion (after Phase 4 complete)
- `/src/app/conversation/` - Entire directory (old conversation routes)
- Current `/src/app/page.tsx` - Simple conversations list (after new landing page is live)

### To Investigate
- Check if there are any imports referencing `/app/conversation/*` routes
- Verify no deep links or bookmarks users might have
- Ensure no shared components between old/new implementation

### Dependency Cleanup
- Run `pnpm audit` to find unused dependencies
- Remove any packages only used by deleted files

---

## 9. Implementation Steps Summary

### Step-by-Step Execution Plan

1. **Session with User**: Review this roadmap and get answers to all clarifying questions (Section 2)

2. **UX/UI Designer Session**:
   - Create design system documentation
   - Create wireframes for all pages
   - Define theme tokens (colors, typography, spacing)
   - Get user approval on designs

3. **shadcn Builder Session**:
   - Set up theme infrastructure (next-themes)
   - Create/update components with dark/light support
   - Build landing page components
   - Update voice agent components styling
   - Create Storybook documentation

4. **Next.js Builder Session**:
   - Implement new URL structure
   - Build landing page (Server Component)
   - Redesign configuration page (Client Component)
   - Redesign active session page (Client Component)
   - Update root layout with theme provider
   - Configure redirects and metadata

5. **Domain Architect Session**:
   - Update text maps with new copy
   - Verify repository pattern usage
   - Execute file cleanup
   - Remove unused dependencies
   - Validate domain integrity

6. **Code Reviewer Session**:
   - Run all audits (performance, accessibility, code quality)
   - Verify critical constraints compliance
   - Cross-browser/device testing
   - Create bug/issue list
   - Get user acceptance approval

7. **Final Session**: Bug fixes and launch preparation

---

## 10. Risk Assessment & Mitigation

### High-Risk Areas

1. **Theme Switching Flicker**
   - **Risk**: Dark/light mode transition causes flash of unstyled content
   - **Mitigation**: Use next-themes with proper SSR configuration, test thoroughly

2. **URL Structure Changes**
   - **Risk**: Breaking existing bookmarks or shared links
   - **Mitigation**: Implement proper redirects, communicate changes to users

3. **File Deletion**
   - **Risk**: Accidentally deleting files still in use
   - **Mitigation**: Grep codebase for all imports, keep backup, test thoroughly

4. **Mobile Responsiveness**
   - **Risk**: Design looks good on desktop but broken on mobile
   - **Mitigation**: Mobile-first approach, test on real devices, use Chrome DevTools

5. **Accessibility Regressions**
   - **Risk**: New design breaks keyboard navigation or screen readers
   - **Mitigation**: Accessibility audit in Phase 6, use semantic HTML, ARIA labels

### Medium-Risk Areas

1. **Performance Degradation**: New components increase bundle size
   - Mitigation: Code-splitting, lazy loading, bundle analysis

2. **Design Scope Creep**: User requests additional design changes mid-implementation
   - Mitigation: Get approval on wireframes before coding, clear change process

3. **Cross-Browser Issues**: Design works in Chrome but breaks in Safari
   - Mitigation: Cross-browser testing in Phase 6, use standard CSS

---

## 11. Success Criteria Summary

### Design Success
- Minimalist Vercel-style aesthetic achieved
- Dark/light mode working flawlessly
- Responsive across all breakpoints
- Compelling landing page with clear value proposition
- User approval on final design

### Technical Success
- All critical constraints followed
- Zero TypeScript errors
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Zero console errors
- Clean, organized codebase
- 20%+ file count reduction

### User Experience Success
- Clear user journey (landing → config → session)
- Fast page loads (<2s initial load)
- Smooth theme transitions (<200ms)
- Intuitive navigation
- Mobile-friendly experience
- Accessible to all users

---

## 12. Timeline Estimate

**Total Estimated Time**: 10-15 sessions

- Phase 1 (PM): 1 session - CURRENT
- Phase 2 (UX/UI): 2-3 sessions
- Phase 3 (shadcn): 2-3 sessions
- Phase 4 (Next.js): 2-3 sessions
- Phase 5 (Domain): 1-2 sessions
- Phase 6 (QA): 1-2 sessions
- Bug fixes: 1 session

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

---

## 13. Next Steps for Parent Agent

1. **Present this roadmap to user** and get answers to all clarifying questions in Section 2
2. **Get user approval** on:
   - Overall approach and phasing
   - Proposed URL structure
   - File deletion list
   - Timeline estimate
3. **Document answers** in this file or session context
4. **Invoke UX/UI Designer** agent to begin Phase 2 once all questions are answered
5. **Monitor progress** and coordinate handoffs between agents
6. **Execute implementation** phase by phase according to this roadmap

---

## Appendix A: Current State Analysis

### Current URL Structure
- Landing: `/gemini-live` (conversations list)
- New conversation config: `/gemini-live/new`
- Active session: `/gemini-live/[sessionId]`
- Old routes (unused?): `/conversation/new`, `/conversation/[id]`
- Root: `/` (simple conversations list)

### Current File Structure
```
/src/app/
├── page.tsx (simple conversations list)
├── layout.tsx
├── (live-voice)/
│   └── gemini-live/
│       ├── page.tsx (conversations list - main landing)
│       ├── new/page.tsx (configuration)
│       └── [sessionId]/page.tsx (active session)
└── conversation/ (APPEARS UNUSED - to delete)
    ├── new/page.tsx
    └── [id]/page.tsx
```

### Current Domain Structure
```
/src/domains/voice-agent/
├── components/ (atoms, molecules, organisms)
├── hooks/ (use-gemini-live.tsx)
├── repositories/ (conversation, message)
├── stores/ (conversation.store.ts)
├── text-maps/ (gemini-live.text-map.ts)
├── utils/ (audio-utils, error-messages)
├── schema.ts
└── types.ts
```

### Current Component Library
- Using shadcn/ui components
- Custom voice agent components (mic-button, connection-status, etc.)
- Some components have custom styling with CSS variables
- Mix of design patterns (some Vercel-style, some custom)

### Current Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand (conversation store)
- React Hook Form (in some forms)
- Zod (validation)

---

## Appendix B: Design Inspiration References

### Vercel Aesthetic Principles
1. **Minimalism**: Lots of whitespace, few visual elements
2. **Typography**: Large, bold headings with clear hierarchy
3. **Color**: Primarily black/white with subtle grays, minimal accent colors
4. **Borders**: Subtle 1px borders, no heavy shadows
5. **Animations**: Subtle, smooth transitions
6. **Layout**: Wide max-width containers, generous padding
7. **Components**: Simple, functional, no unnecessary decoration

### Example Vercel Pages to Study
- vercel.com (homepage)
- vercel.com/templates
- ui.shadcn.com (similar aesthetic)

### Design Elements to Incorporate
- Large hero headlines (60-80px font size)
- Subtle gradient backgrounds
- Card-based layouts with borders
- Monospace fonts for technical elements
- Smooth hover states
- Clean navigation (minimal items)
- Footer with multiple columns

---

## Appendix C: Accessibility Checklist

### WCAG 2.1 AA Compliance
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard accessible
- Focus indicators visible
- ARIA labels for icon buttons
- Alt text for images
- Semantic HTML (headings, landmarks)
- Skip to main content link
- Form labels properly associated
- Error messages clear and helpful
- No keyboard traps

### Testing Tools
- Lighthouse accessibility audit
- axe DevTools
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation testing

---

**End of Roadmap**

**This roadmap is a living document and may be updated as clarifying questions are answered and requirements are refined.**
