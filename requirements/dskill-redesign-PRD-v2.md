# dskill.dev — Platform PRD v2
**For Claude Code** | Stack: Next.js + React | Reference: daily.dev dashboard
*Supersedes v1 — full platform expansion*

---

## 1. Product Vision

dskill.dev is expanding from a skills library into the **daily destination for designers** — a single place to discover AI skills, curated tools and resources, design news, and community picks.

The platform has four content pillars:

| Pillar | Status | Description |
|---|---|---|
| **Skills** | ✅ Live | Curated AI agent skills and prompts for designers |
| **Resources** | 🔜 Coming | Tools, articles, Figma plugins, UI inspiration |
| **News & Trends** | 🔜 Coming | Design news from manual curation + RSS feeds |
| **Community** | 🔜 Coming | Admin-curated posts with upvotes |

**Launch strategy:** Ship the full platform shell now. Skills section is fully functional. All other sections show polished "Coming soon" states — not dead ends, but invitations.

---

## 2. Information Architecture

### Sidebar Navigation

```
┌──────────────────────┐
│  dskill              │  ← wordmark logo
├──────────────────────┤
│  🏠  Home            │  ← defaults to Skills feed
│                      │
│  DISCOVER            │  ← section label
│  ⚡  Skills          │  ← active / live
│  🗂️  Resources       │  ← coming soon
│  📰  News            │  ← coming soon
│  🔥  Community       │  ← coming soon
│                      │
│  LIBRARY             │  ← section label
│  ⭐  Saved           │
│                      │
│  FILTER              │  ← section label (context-sensitive)
│  ● All               │
│  ● Product      (5)  │
│  ● Design       (1)  │
│  ● Handoff       —   │
│  ● Presentation  —   │
└──────────────────────┘
```

**Nav item states:**
- **Active:** `bg: var(--color-bg-elevated)`, left border `2px solid var(--color-accent-primary)`
- **Coming soon:** muted text, lock or clock icon, non-clickable — clicking opens a tooltip "Coming soon"
- **Filter section:** only visible when on a filterable page (Skills, Resources)

---

## 3. Design System

### Color Tokens

```css
:root {
  /* Backgrounds */
  --color-bg-base:     #0E1015;
  --color-bg-surface:  #1C1E26;
  --color-bg-elevated: #252830;
  --color-bg-overlay:  rgba(0, 0, 0, 0.7);

  /* Borders */
  --color-border-subtle:  #2A2D3A;
  --color-border-default: #363945;
  --color-border-focus:   #7B61FF;

  /* Text */
  --color-text-primary:   #F0F2F5;
  --color-text-secondary: #8B90A0;
  --color-text-muted:     #555A6B;

  /* Accents */
  --color-accent-primary:   #7B61FF;   /* purple  — CTAs, active states */
  --color-accent-secondary: #3DD68C;   /* green   — success, copy confirm */
  --color-accent-warm:      #F59E0B;   /* amber   — Product / Tools */
  --color-accent-blue:      #38BDF8;   /* blue    — Design / Articles */
  --color-accent-pink:      #F472B6;   /* pink    — Inspiration */
  --color-accent-teal:      #2DD4BF;   /* teal    — Figma / Plugins */
  --color-accent-red:       #F87171;   /* red     — Handoff */
  --color-upvote-active:    #F59E0B;   /* amber   — upvoted state */

  /* Radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-card: 10px;
  --radius-pill: 100px;

  /* Shadows */
  --shadow-card-hover: 0 0 0 1px var(--color-accent-primary),
                       0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-panel:      -8px 0 32px rgba(0, 0, 0, 0.5);
  --shadow-modal:      0 24px 64px rgba(0, 0, 0, 0.6);

  /* Motion */
  --transition-fast:   120ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   300ms ease;
}
```

### Typography

```css
/* Fonts: Geist (body) + Geist Mono (skill names, code) */
/* Install via next/font/google or @vercel/font */

--font-sans: 'Geist', system-ui, sans-serif;
--font-mono: 'Geist Mono', monospace;

/* Scale */
--text-xs:   11px / 1.4;
--text-sm:   13px / 1.5;
--text-base: 15px / 1.6;
--text-lg:   18px / 1.5;
--text-xl:   24px / 1.3;
--text-2xl:  32px / 1.2;

/* Weights: 400 normal, 500 medium, 600 semibold, 700 bold */
```

### Category → Color Map

```ts
export const CATEGORY_COLORS = {
  Product:      { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  Design:       { bg: 'rgba(56,189,248,0.12)',  text: '#38BDF8', dot: '#38BDF8' },
  Handoff:      { bg: 'rgba(248,113,113,0.12)', text: '#F87171', dot: '#F87171' },
  Presentation: { bg: 'rgba(139,144,160,0.10)', text: '#8B90A0', dot: '#8B90A0' },
  // Resources
  Tool:         { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  Article:      { bg: 'rgba(56,189,248,0.12)',  text: '#38BDF8', dot: '#38BDF8' },
  Plugin:       { bg: 'rgba(45,212,191,0.12)',  text: '#2DD4BF', dot: '#2DD4BF' },
  Inspiration:  { bg: 'rgba(244,114,182,0.12)', text: '#F472B6', dot: '#F472B6' },
} as const;
```

---

## 4. Data Models

Define these in `/lib/types.ts`. These shape the entire platform.

```ts
// Content pillar types
export type ContentType = 'skill' | 'resource' | 'news' | 'community';

// Skill (existing — do not change underlying data, only add type field)
export type Skill = {
  id: string;
  type: 'skill';
  name: string;                  // monospace display name
  category: 'Product' | 'Design' | 'Handoff' | 'Presentation';
  description: string;           // 1–2 sentence summary
  tags: string[];
  content: string;               // full markdown
  status: 'live' | 'coming-soon';
};

// Resource (new)
export type Resource = {
  id: string;
  type: 'resource';
  title: string;
  url: string;
  resourceType: 'Tool' | 'Article' | 'Plugin' | 'Inspiration';
  description: string;
  tags: string[];
  thumbnail?: string;            // optional OG image URL
  source?: string;               // e.g. "Figma Community"
  publishedAt: string;           // ISO date
  status: 'live' | 'coming-soon';
};

// News item (new)
export type NewsItem = {
  id: string;
  type: 'news';
  title: string;
  url: string;
  source: string;                // e.g. "Designer News", "Sidebar"
  sourceFavicon?: string;
  description?: string;
  thumbnail?: string;
  publishedAt: string;
  tags: string[];
  origin: 'manual' | 'rss';
};

// Community post (new)
export type CommunityPost = {
  id: string;
  type: 'community';
  title: string;
  url?: string;                  // optional — can be text-only
  description: string;
  author: string;                // admin name / handle
  authorAvatar?: string;
  upvotes: number;
  userHasUpvoted?: boolean;      // client-side state
  tags: string[];
  publishedAt: string;
};

// Unified feed item
export type FeedItem = Skill | Resource | NewsItem | CommunityPost;
```

---

## 5. Pages & Layouts

### 5.1 App Shell (All Pages)

```
┌─────────────────────────────────────────────────────┐
│  TopBar: Logo | Search ⌘K | [Sign in]               │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  <Page Content>                          │
│ 240px    │                                          │
│ fixed    │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

### 5.2 Home / Skills Page (`/` or `/skills`)

Primary landing page. Full skills feed.

```
┌─────────────────────────────────────────────┐
│  Hero: "AI Skills for Designers"            │
│  Subtitle + skills count badge              │
├────────────────────────┬────────────────────┤
│  Skill Card            │  Skill Card        │
│  [Category] ↗          │  [Category] ↗      │
│  name                  │  name              │
│  description...        │  description...    │
│  [tag][tag]            │  [tag][tag]        │
│  [Copy][Download][↗]   │  [Copy][Download]  │
├────────────────────────┼────────────────────┤
│  Skill Card            │  Skill Card        │
└────────────────────────┴────────────────────┘
```

Feed header options (tabs or toggle): `All` | `Product` | `Design` | `Handoff`

---

### 5.3 Resources Page (`/resources`) — Coming Soon

Full page "coming soon" state. Not a 404. Feels intentional.

```
┌──────────────────────────────────────────────┐
│                                              │
│   🗂️                                         │
│                                              │
│   Resources are coming                       │  ← heading
│                                              │
│   Tools, articles, Figma plugins, and UI     │  ← body text, muted
│   inspiration — all in one place.            │
│                                              │
│   [Notify me →]   or   [← Back to Skills]   │
│                                              │
└──────────────────────────────────────────────┘
```

Layout hint: 3 "ghost cards" blurred/dimmed behind the message — gives visual sense of what's coming.

---

### 5.4 News Page (`/news`) — Coming Soon

Same treatment as Resources. Ghost news cards dimmed behind.

```
│   📰                                         │
│   Design news is on its way                  │
│   Curated picks + RSS feeds from the         │
│   best design publications.                  │
│   [Notify me →]                              │
```

---

### 5.5 Community Page (`/community`) — Coming Soon

```
│   🔥                                         │
│   Community launches soon                    │
│   Designer picks, upvoted by the community.  │
│   [Notify me →]                              │
```

---

### 5.6 Saved / Collections Page (`/saved`)

Shows bookmarked items across all content types. Initially empty.

```
│   ⭐                                         │
│   Nothing saved yet                          │
│   Browse skills and save what you'll         │
│   want to come back to.                      │
│   [Browse Skills →]                          │
```

When items exist: same card grid, with mixed content types rendered appropriately.

---

## 6. Component Inventory

### 6.1 Layout Components (`/components/layout/`)

| Component | Description |
|---|---|
| `AppShell.tsx` | TopBar + Sidebar + content slot + optional DetailPanel |
| `TopBar.tsx` | Logo, search trigger `⌘K`, right slot (sign in / avatar) |
| `Sidebar.tsx` | Nav links + section labels + category filter |
| `NavItem.tsx` | Single sidebar nav item (active, default, coming-soon states) |
| `SectionLabel.tsx` | Uppercase muted section heading |

### 6.2 Card Components (`/components/cards/`)

| Component | Used For | Key Props |
|---|---|---|
| `SkillCard.tsx` | Skills feed | name, category, description, tags, content |
| `ResourceCard.tsx` | Resources feed | title, url, resourceType, thumbnail |
| `NewsCard.tsx` | News feed | title, source, sourceFavicon, publishedAt |
| `CommunityCard.tsx` | Community feed | title, description, upvotes, author |
| `FeedCard.tsx` | Unified wrapper | Renders correct card by `item.type` |

### 6.3 UI Primitives (`/components/ui/`)

| Component | Description |
|---|---|
| `CategoryBadge.tsx` | Color-coded pill (Product, Design, etc.) |
| `ResourceTypeBadge.tsx` | Tool / Article / Plugin / Inspiration badge |
| `TagBadge.tsx` | Muted gray pill for tags |
| `CopyButton.tsx` | Clipboard copy + 2s success flash |
| `ActionButton.tsx` | Ghost button: icon + label |
| `UpvoteButton.tsx` | Upvote with count + amber active state |
| `SaveButton.tsx` | Bookmark toggle |
| `ComingSoonState.tsx` | Full-page coming soon (icon, heading, body, CTAs, ghost cards) |
| `EmptyState.tsx` | Empty section (icon, heading, body, single CTA) |

### 6.4 Overlay Components (`/components/overlays/`)

| Component | Description |
|---|---|
| `DetailPanel.tsx` | Right slide-over for skill preview |
| `CommandPalette.tsx` | `⌘K` global search overlay |

---

## 7. Card Designs

### 7.1 SkillCard

```
┌──────────────────────────────────────────────┐
│  [Product]                         [↗ Open]  │
│                                              │
│  feature-story-writer                        │  ← Geist Mono, semibold
│                                              │
│  Turn a validated direction into stories     │  ← 2-line clamp
│  a designer can actually design from.        │
│                                              │
│  ─────────────────────────────────────────   │
│  [user-stories]  [handoff]  [product]        │
│                                              │
│  [📋 Copy]  [⬇ Download]  [👁 Preview]      │
└──────────────────────────────────────────────┘
```

### 7.2 ResourceCard

```
┌──────────────────────────────────────────────┐
│  [thumbnail image — 16:9, rounded top]       │
├──────────────────────────────────────────────┤
│  [Tool]                         [↗]          │
│                                              │
│  Figma Variables Manager                     │  ← Geist Sans, semibold
│  Manage your variables library               │  ← 2-line clamp
│  the way you actually think.                 │
│                                              │
│  figma.com  ·  Mar 2025                      │  ← source + date, muted
│                                              │
│  [⭐ Save]                                   │
└──────────────────────────────────────────────┘
```

### 7.3 NewsCard

```
┌──────────────────────────────────────────────┐
│  [favicon] Designer News        Apr 2025     │  ← source row
│                                              │
│  The New Typography: Variable Fonts          │  ← title, 2-line clamp
│  Are Changing How We Design Type             │
│                                              │
│  How type designers are rethinking           │  ← description, muted
│  scale and weight...                         │
│                                              │
│  [design] [typography] [trends]              │
│                                              │
│  [↗ Read]  [⭐ Save]                         │
└──────────────────────────────────────────────┘
```

### 7.4 CommunityCard

```
┌──────────────────────────────────────────────┐
│  [avatar] dskill team            Apr 2025    │  ← author row
│                                              │
│  This Figma plugin changed how our           │  ← title/description
│  whole team does handoff. Worth trying.      │
│                                              │
│  [design] [figma] [handoff]                  │
│                                              │
│  [▲ 42]  [↗ View]  [⭐ Save]                │  ← upvote + actions
└──────────────────────────────────────────────┘
```

**Upvote button states:**
- Default: `▲ 42` — muted text, transparent bg
- Hover: amber text, subtle amber bg
- Active/voted: `▲ 43` — amber text + bg, filled

---

## 8. Detail Panel (Slide-Over)

Triggered by "Preview" on SkillCard. Right panel, 480px wide.

```
┌──── Feed (dimmed) ────────┬──── Detail Panel ───────┐
│                           │  ✕                      │
│  [cards at 60% opacity]   │  feature-story-writer   │
│                           │  [Product]              │
│                           │                         │
│                           │  [📋 Copy] [⬇ Download] │
│                           │  ─────────────────────  │
│                           │  [Rendered Markdown]    │
│                           │  (scrollable)           │
│                           │                         │
└───────────────────────────┴─────────────────────────┘
```

- Slide in: `translateX(100%)` → `translateX(0)`, `300ms ease`
- Close: `Esc` key or `✕` button
- Feed dims to `opacity: 0.4` when panel is open

---

## 9. Command Palette (`⌘K`)

Global. Searches across all content types (future-proof from day one).

```
┌──────────────────────────────────────────┐
│  🔍  Search everything...               │
├──────────────────────────────────────────┤
│  SKILLS                                  │
│  ⚡ feature-story-writer    [Product]    │
│  ⚡ design-critique         [Design]     │
├──────────────────────────────────────────┤
│  RESOURCES                    Coming soon│
├──────────────────────────────────────────┤
│  NEWS                         Coming soon│
└──────────────────────────────────────────┘
```

- Sections shown only if content exists for that type
- Coming soon sections shown collapsed/muted as future hint
- Keyboard: `↑↓` navigate, `Enter` open, `Esc` close
- Opens detail panel for skills; new tab for external links

---

## 10. Coming Soon Page State

Reusable `<ComingSoonState>` component. Used for Resources, News, Community pages.

**Props:**
```ts
type ComingSoonStateProps = {
  icon: string;           // emoji
  heading: string;
  body: string;
  ghostCardCount?: number; // default 4 — blurred cards behind
  ctaLabel?: string;
  ctaHref?: string;
  backLabel?: string;
  backHref?: string;
};
```

**Ghost cards:** render 4 skeleton cards at `opacity: 0.15`, `filter: blur(2px)`, non-interactive, behind the message. Creates visual anticipation without showing real content.

**"Notify me" CTA:** links to a simple form (Tally, Typeform, or mailto — your choice). Claude Code should make it a prop so you can swap later.

---

## 11. File Structure

```
/app
  /page.tsx                    ← redirect to /skills or render SkillsPage
  /skills/page.tsx             ← Skills feed (primary)
  /resources/page.tsx          ← Coming soon
  /news/page.tsx               ← Coming soon
  /community/page.tsx          ← Coming soon
  /saved/page.tsx              ← Saved items (empty state)
  /layout.tsx                  ← AppShell wrapper

/components
  /layout
    AppShell.tsx
    TopBar.tsx
    Sidebar.tsx
    NavItem.tsx
    SectionLabel.tsx
  /cards
    SkillCard.tsx
    ResourceCard.tsx
    NewsCard.tsx
    CommunityCard.tsx
    FeedCard.tsx               ← unified renderer
  /ui
    CategoryBadge.tsx
    ResourceTypeBadge.tsx
    TagBadge.tsx
    CopyButton.tsx
    ActionButton.tsx
    UpvoteButton.tsx
    SaveButton.tsx
    ComingSoonState.tsx
    EmptyState.tsx
  /overlays
    DetailPanel.tsx
    CommandPalette.tsx

/lib
  types.ts                     ← All data model types (new)
  constants.ts                 ← CATEGORY_COLORS map + nav config
  skills.ts                    ← EXISTING — do not modify
  utils.ts                     ← EXISTING — do not modify

/styles
  tokens.css                   ← All CSS custom properties
  globals.css                  ← Base reset + font setup
```

---

## 12. Implementation Phases

### Phase 1 — Foundation & Shell
**Goal:** Dark shell running. All routes exist. Sidebar navigation works.

1. Create `/styles/tokens.css` with all design tokens
2. Update `globals.css` — dark base, font setup (Geist + Geist Mono)
3. Create `/lib/types.ts` with all data models
4. Create `/lib/constants.ts` with `CATEGORY_COLORS` and nav config
5. Build `SectionLabel`, `NavItem`, `Sidebar`, `TopBar`, `AppShell`
6. Create all route files (`/skills`, `/resources`, `/news`, `/community`, `/saved`)
7. Wrap layout in `AppShell`
8. Wire sidebar nav — active states, coming-soon states

✅ **Checkpoint:** App loads dark. All routes work. Sidebar shows correct active/coming-soon states.

---

### Phase 2 — Skills Feed
**Goal:** The core experience looks great.

1. Build `CategoryBadge`, `TagBadge`, `ActionButton`, `CopyButton`
2. Build `SkillCard` composing all above
3. Build 2-col grid layout on `/skills`
4. Wire existing skills data into `SkillCard`
5. Add category tab filter (`All` | `Product` | `Design` | ...)
6. Add card hover animation

✅ **Checkpoint:** Skills feed renders all cards with badges, tags, actions. Filter tabs work.

---

### Phase 3 — Detail Panel
**Goal:** Preview skill without leaving the feed.

1. Build `DetailPanel` with slide animation + backdrop
2. Wire "Preview" button on `SkillCard` → open panel
3. Render existing markdown content inside panel
4. Add `Esc` key handler + close button
5. Dim feed when panel is open

✅ **Checkpoint:** Click Preview → panel slides in → markdown renders → Esc closes.

---

### Phase 4 — Command Palette
**Goal:** `⌘K` search works globally.

1. Build `CommandPalette` overlay
2. Global `keydown` listener for `⌘K` / `Ctrl+K`
3. Filter skills by name, description, tags
4. Keyboard navigation (`↑↓`, `Enter`, `Esc`)
5. Section grouping (SKILLS / future RESOURCES / NEWS)
6. Show recent (last 3 viewed) when no query

✅ **Checkpoint:** `⌘K` opens palette, type to filter, keyboard-navigate, Enter opens detail.

---

### Phase 5 — Coming Soon Pages
**Goal:** Resources, News, Community feel like real pages — not broken routes.

1. Build `ComingSoonState` component with ghost cards
2. Apply to `/resources`, `/news`, `/community`
3. Build `EmptyState` component
4. Apply to `/saved`
5. Wire "Notify me" CTA (prop-based URL, placeholder for now)

✅ **Checkpoint:** Each coming soon page renders with ghost cards, icon, copy, CTAs.

---

### Phase 6 — Upvote System (Community prep)
**Goal:** Upvote UI ready for when Community launches.

1. Build `UpvoteButton` with default / hover / active states
2. Build `SaveButton` with toggle state
3. Build `CommunityCard` (even if page is coming soon — component is ready)
4. Store upvote state in `localStorage` (temporary, until backend exists)
5. Optimistic UI: count updates immediately on click

✅ **Checkpoint:** `UpvoteButton` toggles correctly. `SaveButton` persists across refresh.

---

### Phase 7 — Polish & Responsive
**Goal:** Production-ready on all screen sizes.

1. Mobile (`< 768px`): collapse sidebar → bottom nav bar (4 icons: Skills, Resources, News, Community)
2. Tablet (`768px–1024px`): sidebar collapses to icon-only (56px)
3. Desktop (`> 1024px`): full sidebar (240px)
4. Card grid: 1-col mobile → 2-col tablet+ 
5. Add loading skeleton for cards (CSS pulse animation)
6. Page transitions (CSS or Framer Motion)
7. Accessibility: focus rings, `aria-label` on all icon buttons, keyboard trap in overlays
8. `<head>` meta: title, description, og:image per page

✅ **Checkpoint:** Resize window — layout adapts. Lighthouse A11y > 90. No regressions.

---

## 13. Claude Code Starting Prompt

Paste this when starting Claude Code:

---

```
You are rebuilding dskill.dev — a Next.js + React platform for designers.

CONTEXT:
- Currently a skills library. Expanding to also include Resources, News, and Community.
- Resources, News, Community sections ship as "coming soon" — not built yet, just shells.
- Skills section is the only live content and the primary focus.

DO NOT TOUCH:
- /lib/skills.ts or any existing data fetching logic
- Existing routing structure (extend it, don't change it)
- Markdown rendering logic

DESIGN REFERENCE: daily.dev dashboard
- Dark mode (#0E1015 background)
- Card-based 2-column grid
- Fixed 240px left sidebar
- Subtle 1px borders
- Dense, professional aesthetic

FONTS: Geist (body) + Geist Mono (skill names only)
TOKENS: Create /styles/tokens.css in Phase 1 — all values in the PRD
COMPONENTS: All new components in /components/ per structure in PRD

BUILD IN ORDER — one phase at a time, commit after each:
Phase 1: Shell & navigation
Phase 2: Skills feed cards
Phase 3: Detail slide-over panel
Phase 4: ⌘K command palette
Phase 5: Coming soon pages
Phase 6: Upvote + save buttons
Phase 7: Responsive + polish

Full spec is in dskill-redesign-PRD-v2.md. Follow it exactly.
Ask before modifying any existing data or logic files.
Start with Phase 1 only.
```

---

## 14. Success Criteria

### Launch Ready When:
- [ ] Dark shell loads with sidebar, all nav items correct (active / coming-soon)
- [ ] Skills feed renders all cards with category badges, tags, and action buttons
- [ ] Copy button works + shows 2s success state
- [ ] Preview opens slide-over panel with markdown content
- [ ] `⌘K` opens command palette, filters skills, keyboard-navigable
- [ ] `/resources`, `/news`, `/community` show polished coming soon states with ghost cards
- [ ] `/saved` shows empty state with CTA back to skills
- [ ] Responsive: bottom nav on mobile, icon sidebar on tablet, full sidebar on desktop
- [ ] No regressions in existing skill data or functionality

### Future-Ready When (not blocking launch):
- [ ] `ResourceCard`, `NewsCard`, `CommunityCard` components exist but unused
- [ ] `UpvoteButton` works with localStorage state
- [ ] `FeedCard` unified renderer supports all 4 content types
- [ ] Data models in `/lib/types.ts` cover all 4 content types

---

*PRD Version 2.0 — dskill.dev Platform Expansion*
*Stack: Next.js + React | Fonts: Geist + Geist Mono | Reference: daily.dev*
