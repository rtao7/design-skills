# Requirements: Home Page + NewsCard Improvements

## Context

This document specifies two related workstreams:
1. **NewsCard enrichment** — add thumbnail, likes, share, and content-type pill to `NewsCard`
2. **Home page restructure** — add a context bar, skills spotlight strip, and sticky source filter above the existing news feed

Both are scoped to existing infrastructure. No new libraries needed.

---

## Part 1 — NewsCard enrichment

### 1.1 Relevant files

| File | Change type |
|---|---|
| `lib/types.ts` | Add `likes` field to `NewsItem` |
| `lib/news.ts` | Select `likes` column from Supabase |
| `app/api/news/[id]/like/route.ts` | New — POST/DELETE API route |
| `components/cards/NewsCard.tsx` | Rebuild layout |
| `components/cards/NewsCardSkeleton.tsx` | Add thumbnail skeleton row |
| `components/ui/LikeButton.tsx` | New component |
| `components/ui/ShareButton.tsx` | New component |

### 1.2 Database migration

Run in Supabase SQL editor:

```sql
ALTER TABLE news_items
  ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;
```

No RLS changes needed. The increment is done server-side via the service role key.

### 1.3 Type update — `lib/types.ts`

Add `likes` to `NewsItem`:

```ts
export type NewsItem = {
  id: string;
  type: 'news';
  title: string;
  url: string;
  source: string;
  sourceFavicon?: string;
  description?: string;
  thumbnail?: string;
  publishedAt: string;
  tags: string[];
  origin: 'manual' | 'rss';
  likes: number; // ← ADD THIS
};
```

### 1.4 Data fetching — `lib/news.ts`

Update the `select` string in both `getApprovedNews` and `getNewsBySource` to include `likes`:

```ts
.select('id, title, url, source, source_favicon, description, thumbnail, published_at, tags, origin, likes')
```

Update `SupabaseNewsRow` type:

```ts
type SupabaseNewsRow = {
  // ...existing fields...
  likes: number;
};
```

Update `toNewsItem` mapper:

```ts
function toNewsItem(row: SupabaseNewsRow): NewsItem {
  return {
    // ...existing fields...
    likes: row.likes,
  };
}
```

### 1.5 API route — `app/api/news/[id]/like/route.ts`

New file. Handles like (POST) and unlike (DELETE). Uses `supabaseAdmin` to bypass RLS. Increments/decrements atomically.

```ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('news_items')
    .update({ likes: supabaseAdmin.rpc('increment', { row_id: id }) })
    .eq('id', id)
    .select('likes')
    .single();

  // Use raw SQL increment to avoid race conditions
  const { data: result, error: err } = await supabaseAdmin.rpc('increment_news_likes', { news_id: id });

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ likes: result });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: result, error: err } = await supabaseAdmin.rpc('decrement_news_likes', { news_id: id });

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ likes: result });
}
```

Also add these Postgres functions in Supabase:

```sql
-- Atomic increment, returns new likes count
CREATE OR REPLACE FUNCTION increment_news_likes(news_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE news_items SET likes = likes + 1 WHERE id = news_id RETURNING likes;
$$;

-- Atomic decrement (floor at 0), returns new likes count
CREATE OR REPLACE FUNCTION decrement_news_likes(news_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE news_items SET likes = GREATEST(likes - 1, 0) WHERE id = news_id RETURNING likes;
$$;
```

### 1.6 New component — `components/ui/LikeButton.tsx`

Adapt the existing `UpvoteButton` pattern but for news likes. Uses a heart icon instead of chevron. localStorage key is `dskill:news-likes` (separate from `dskill:upvotes` used by community posts).

**Behaviour:**
- Optimistic UI: click immediately updates local count + state
- Calls `POST /api/news/[id]/like` on like, `DELETE /api/news/[id]/like` on unlike
- If API fails, reverts to previous state
- localStorage persists liked state across sessions to avoid requiring auth

```tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type LikeButtonProps = {
  newsId: string;
  initialCount: number;
};

const STORAGE_KEY = 'dskill:news-likes';

function getLikedItems(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

function setLikedItem(newsId: string, liked: boolean) {
  const items = getLikedItems();
  if (liked) items[newsId] = true;
  else delete items[newsId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function LikeButton({ newsId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(() => getLikedItems()[newsId] ?? false);
  const [count, setCount] = useState(initialCount);

  async function handleClick() {
    const next = !liked;
    // Optimistic update
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setLikedItem(newsId, next);

    try {
      const method = next ? 'POST' : 'DELETE';
      const res = await fetch(`/api/news/${newsId}/like`, { method });
      if (!res.ok) throw new Error();
      const { likes } = await res.json();
      setCount(likes); // sync with server truth
    } catch {
      // Revert on failure
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
      setLikedItem(newsId, !next);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? 'Unlike' : 'Like'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: liked ? 'rgba(248,113,113,0.12)' : 'transparent',
        border: '1px solid',
        borderColor: liked ? 'rgba(248,113,113,0.35)' : 'var(--color-border-subtle)',
        color: liked ? 'var(--color-accent-red)' : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: liked ? 500 : 400,
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Heart
        size={13}
        fill={liked ? 'currentColor' : 'none'}
        style={{ transition: 'transform var(--transition-fast)', transform: liked ? 'scale(1.15)' : 'scale(1)' }}
      />
      <span>{count}</span>
    </button>
  );
}
```

### 1.7 New component — `components/ui/ShareButton.tsx`

Uses `navigator.share()` on mobile (native OS share sheet). Falls back to `navigator.clipboard.writeText()` on desktop with a transient "Copied!" label swap (resets after 1.5s). No backend needed.

```tsx
'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

type ShareButtonProps = {
  url: string;
  title: string;
};

export function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled — do nothing
        return;
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available — silently fail
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: 'transparent',
        border: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}
```

### 1.8 Rebuild `components/cards/NewsCard.tsx`

**New layout (top to bottom):**

```
┌─────────────────────────────────────────┐
│  [Thumbnail image — 16:9, lazy loaded]  │
│  ┌─────────────────────────────────┐    │
│  │ [favicon] Source name · 3h ago  │ ← badge overlaid on image bottom-left
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────│
│  [Type pill]  e.g. "Article" / "Launch" │ ← meta row
│                                         │
│  Title — bold, 2-line clamp, clickable  │
│                                         │
│  Description — 2-line clamp, muted      │
│                                         │
│  [tag] [tag]                            │
│─────────────────────────────────────────│
│  [↗ Read]  [♥ 24]  [⤴ Share]    [⌂ Save] │ ← actions row
└─────────────────────────────────────────┘
```

**Implementation rules:**

1. **Thumbnail**
   - Render if `item.thumbnail` is truthy. Skip if falsy (no placeholder image — just start at the body).
   - `<img>` with `loading="lazy"` and `style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}`
   - On image error (`onError`), hide the image container entirely (set display none on the parent div)
   - Source badge overlaid at bottom-left of thumbnail: `position: absolute`, `bottom: 8px, left: 8px`
   - Badge: dark semi-transparent pill (`background: rgba(0,0,0,0.55)`, `backdropFilter: 'blur(6px)'`), contains `sourceFavicon` img (14×14, `borderRadius: '3px'`) + source name in white, 11px
   - The thumbnail container must be `position: relative` and `overflow: hidden`

2. **Source/time row when no thumbnail**
   - Same as current: `sourceFavicon` img (14×14) + source name + `·` + timeAgo
   - Only shown when `!item.thumbnail` — otherwise source is on the image overlay

3. **Type pill** (always shown)
   - Derive from `item.tags`: if any tag matches `['launch', 'product launch', 'new product']` → "Launch" (green accent). If any tag matches `['tool', 'plugin', 'figma plugin']` → "Tool" (blue accent). If any tag matches `['video']` → "Video" (red accent). Default fallback → "Article" (muted/subtle).
   - Use `var(--color-accent-secondary)` for Launch, `var(--color-accent-blue)` for Tool, `var(--color-accent-red)` for Video.
   - Style: `fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 'var(--radius-pill)'`

4. **Title**
   - `<a href={item.url} target="_blank" rel="noopener noreferrer">`
   - `fontSize: '14px', fontWeight: 600, lineHeight: 1.4`
   - `-webkit-line-clamp: 2`

5. **Description**
   - Only render if `item.description` is truthy
   - `fontSize: '12px', lineHeight: 1.55, -webkit-line-clamp: 2`

6. **Tags**
   - Render up to 3 tags max (slice `item.tags` to first 3)
   - Same pill style as current

7. **Actions row** — left to right:
   - `<a>` Read button (existing style, `ExternalLink` icon, links to `item.url`)
   - `<LikeButton newsId={item.id} initialCount={item.likes} />`
   - `<ShareButton url={item.url} title={item.title} />`
   - `marginLeft: 'auto'` spacer before the last item
   - `<SaveButton itemId={\`news:${item.id}\`} />`

8. **Hover state on card**
   - Keep existing hover: `borderColor` → `var(--color-border-default)`, `background` → `var(--color-bg-elevated)`

### 1.9 Update `components/cards/NewsCardSkeleton.tsx`

Add a thumbnail skeleton at the top (before the existing body content):

```tsx
{/* Thumbnail skeleton */}
<div
  className="skeleton-pulse"
  style={{ width: '100%', aspectRatio: '16/9', borderRadius: 0, borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', background: 'var(--color-bg-elevated)' }}
/>
```

Also add two extra skeleton rows in the actions section for the new like and share buttons.

---

## Part 2 — Home page restructure

### 2.1 Relevant files

| File | Change type |
|---|---|
| `app/page.tsx` | Rebuild with 4 sections |
| `components/home/ContextBar.tsx` | New server component |
| `components/home/SkillsSpotlight.tsx` | New server component |
| `components/home/StickyFilterBar.tsx` | Extract from NewsFeed, make sticky |
| `components/cards/NewsFeed.tsx` | Remove filter bar (moved to StickyFilterBar), accept `source` prop |

### 2.2 Section 1 — Context bar (`components/home/ContextBar.tsx`)

Server component. No interactivity.

**Renders:**
- Left: greeting ("Good morning" / "Good afternoon" / "Good evening" based on `new Date().getHours()`) + today's date formatted as e.g. "Wednesday, 29 April"
- Right: two count chips:
  - `{items.length} stories` — passed as a prop from the page (count of news items loaded)
  - `{skillCount} skills` — passed as a prop from the page (total skill count from `getAllCategories()`)

**Props:**
```ts
type ContextBarProps = {
  newsCount: number;
  skillCount: number;
};
```

**Styling:** Flex row, `justifyContent: 'space-between'`, `alignItems: 'center'`, `marginBottom: '24px'`.

Count chips: `fontSize: '12px'`, `padding: '3px 10px'`, `borderRadius: 'var(--radius-pill)'`, `border: '1px solid var(--color-border-subtle)'`, `color: 'var(--color-text-secondary)'`.

### 2.3 Section 2 — Skills spotlight (`components/home/SkillsSpotlight.tsx`)

Server component. Fetches skills via existing `getAllCategories()` from `lib/skills.ts`.

**Behaviour:**
- Flattens all categories to a single array of skills
- Sorts by newest (if skills have a date field — otherwise use the order returned)
- Takes the first 6
- Renders them in a horizontal scroll container using the existing `<SkillCard />` component

**Layout:**
- Header row: `<h2>Skills</h2>` left, `<a href="/skills">Browse all →</a>` right
- Scroll container: `display: 'flex'`, `gap: '12px'`, `overflowX: 'auto'`, `paddingBottom: '8px'`, `scrollbarWidth: 'none'` (hide scrollbar on Firefox), `msOverflowStyle: 'none'` (IE), and a CSS rule `&::-webkit-scrollbar { display: none }` on the element

**Note:** `SkillCard` is a client component and works fine inside a server component via props.

### 2.4 Section 3 — Sticky filter bar

**Extract** the source filter pills out of `components/cards/NewsFeed.tsx` into a new `components/home/StickyFilterBar.tsx` client component.

`StickyFilterBar` receives `sources: string[]` and `active: string` and `onSelect: (source: string) => void` as props.

**Make it sticky:**
```tsx
style={{
  position: 'sticky',
  top: 'var(--topbar-height)',  // 52px — defined in tokens.css
  zIndex: 10,
  background: 'var(--color-bg-base)',
  paddingTop: '8px',
  paddingBottom: '8px',
  marginBottom: '16px',
  borderBottom: '1px solid var(--color-border-subtle)',
}}
```

`NewsFeed.tsx` should be updated to lift the `active` state up to the page level (or keep it in `NewsFeed` and just use `StickyFilterBar` internally — either approach is fine, but the filter bar must be visually sticky).

### 2.5 Section 4 — News feed

No structural changes to `NewsFeed.tsx` logic. The feed itself stays the same grid.

**Add a view toggle** (grid / list) to `NewsFeed.tsx`:
- Grid: `repeat(auto-fill, minmax(300px, 1fr))` — current layout
- List: single column, `maxWidth: '680px'`
- Toggle state persisted in localStorage key `dskill:news-view` (values: `'grid'` | `'list'`)
- Toggle rendered as two icon buttons in the top-right of the feed header row (use `LayoutGrid` and `List` from `lucide-react`)

### 2.6 Rebuild `app/page.tsx`

```tsx
import { getAllCategories } from '@/lib/skills';
import { getApprovedNews } from '@/lib/news';
import { ContextBar } from '@/components/home/ContextBar';
import { SkillsSpotlight } from '@/components/home/SkillsSpotlight';
import { NewsFeed } from '@/components/cards/NewsFeed';

export const revalidate = 3600;

export const metadata = {
  title: 'Home — dskill',
  description: 'Curated design news, skills, and tools for product designers.',
};

export default async function HomePage() {
  const [categories, items] = await Promise.all([
    getAllCategories(),
    getApprovedNews(30),
  ]);

  const allSkills = categories.flatMap((cat) => [
    ...cat.skills,
    ...cat.folders.flatMap((f) => f.skills),
  ]);

  return (
    <main style={{ padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)' }}>
      <ContextBar newsCount={items.length} skillCount={allSkills.length} />
      <SkillsSpotlight skills={allSkills.slice(0, 6)} />
      <div style={{ marginTop: '32px' }}>
        <NewsFeed items={items} />
      </div>
    </main>
  );
}
```

---

## Part 3 — Acceptance criteria

### NewsCard
- [ ] Thumbnail renders when `item.thumbnail` is set; card starts at title when not set
- [ ] Broken image URLs silently hide the thumbnail container (no broken image icon)
- [ ] Source badge overlays bottom-left of thumbnail image
- [ ] Type pill shows correct label and color for Launch / Tool / Video / Article
- [ ] Like button shows correct initial count from DB
- [ ] Clicking like increments count immediately (optimistic), syncs with server
- [ ] Clicking a liked item decrements (toggle behaviour)
- [ ] Like state persists on page refresh (localStorage)
- [ ] Share on mobile triggers `navigator.share()` native sheet
- [ ] Share on desktop copies URL to clipboard and shows "Copied!" for 1.5s
- [ ] Save button behaviour unchanged from current

### NewsCardSkeleton
- [ ] Has a thumbnail skeleton block at top with matching aspect ratio

### Home page
- [ ] Page loads with all 4 sections visible
- [ ] Context bar shows correct time-of-day greeting and live counts
- [ ] Skills strip renders up to 6 skill cards, scrolls horizontally
- [ ] Filter bar sticks to top of viewport when scrolling through the news feed
- [ ] Grid/list toggle works and persists across page reloads
- [ ] `Promise.all` on page fetch — both data calls run in parallel

---

## Part 4 — Thumbnail placeholder

When `item.thumbnail` is null/undefined, or when a real thumbnail `<img>` fires `onError`, show a styled placeholder instead of nothing. The placeholder must look intentional — not a broken state.

### 4.1 New component — `components/ui/ThumbnailPlaceholder.tsx`

Pure client component. Accepts `source: string` and derives all visual properties deterministically from it.

```tsx
'use client';

type ThumbnailPlaceholderProps = {
  source: string;
  sourceFavicon?: string;
};
```

### 4.2 Palette system

6 palettes, assigned by hashing the source name. Same source = same palette every time.

**Hash function** — simple, no library needed:

```ts
function hashSource(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}
```

**Palette table** — index = `hashSource(source) % 6`:

| Index | Name | Background gradient (dark) | Glow colour | Accent ring |
|---|---|---|---|---|
| 0 | Purple | `#1a1730 → #2d2550 → #1e1b3a` | `rgba(139,92,246,0.15)` | `rgba(139,92,246,0.2)` / text `rgba(167,139,250,0.8)` |
| 1 | Teal | `#0d1f1f → #0f3030 → #0d2020` | `rgba(45,212,191,0.12)` | `rgba(45,212,191,0.2)` / text `rgba(94,234,212,0.8)` |
| 2 | Amber | `#1f1508 → #2e1f0a → #1a1005` | `rgba(245,158,11,0.12)` | `rgba(245,158,11,0.2)` / text `rgba(252,211,77,0.8)` |
| 3 | Blue | `#080f1f → #0f1e3a → #080e1c` | `rgba(59,130,246,0.12)` | `rgba(59,130,246,0.2)` / text `rgba(96,165,250,0.8)` |
| 4 | Rose | `#1f0812 → #2e0f1c → #1a0810` | `rgba(244,63,94,0.12)` | `rgba(244,63,94,0.2)` / text `rgba(251,113,133,0.8)` |
| 5 | Green | `#071410 → #0d2018 → #081412` | `rgba(52,211,153,0.12)` | `rgba(52,211,153,0.2)` / text `rgba(110,231,183,0.8)` |

The gradient direction is always `135deg`.

### 4.3 Pattern overlay

Assign by `paletteIndex % 3`. Keeps variety without additional randomness.

| Value | Pattern | CSS |
|---|---|---|
| 0 | Grid lines | `background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px;` |
| 1 | Dots | `background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 18px 18px;` |
| 2 | Diagonal lines | `background-image: repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.025) 12px, rgba(255,255,255,0.025) 13px);` |

### 4.4 Initials derivation

```ts
function getInitials(source: string): string {
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
// "Figma Blog"            → "FB"
// "Nielsen Norman Group"  → "NN"
// "A List Apart"          → "AL"
// "CSS-Tricks"            → "C"  (single word)
// "UX Collective"         → "UX"
```

### 4.5 Component structure

```
┌──────────────────────────────────────────┐
│  [gradient bg — 135deg, palette colours] │
│  [pattern overlay — positioned absolute] │
│  [glow — radial gradient, absolute]      │
│                                          │
│         ┌──────────┐                     │
│         │    FB    │  ← initials circle  │
│         └──────────┘                     │
│         Figma Blog   ← source name text  │
│                                          │
│  ┌─────────────────────┐                 │
│  │ [fav]  Figma Blog   │ ← bottom badge  │
│  └─────────────────────┘                 │
└──────────────────────────────────────────┘
```

**Initials circle:**
- `width: 36px, height: 36px, borderRadius: '50%'`
- `background: rgba(255,255,255,0.08)`
- `border: '1px solid {palette.ringBorder}'` (the ring accent colour from palette table)
- `color: {palette.ringText}` (the text accent colour from palette table)
- `fontSize: '13px', fontWeight: 600`

**Source name text below circle:**
- `fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em'`
- Max 20 chars — truncate with `…` if longer

**Source badge (bottom-left overlay):**
- Identical to the badge on real thumbnail images
- `position: 'absolute', bottom: 8, left: 8`
- `background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)'`
- `borderRadius: 'var(--radius-pill)', padding: '3px 10px 3px 7px'`
- Contains: `sourceFavicon` img (14×14, `borderRadius: 3px`) if available, else a single-letter div styled with palette accent colour, then the source name in white at 10px

**Full layout CSS:**
- Container: `position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden'`
- All layers (gradient bg, pattern, glow) use `position: absolute, inset: 0`
- Centre content: `position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'`

### 4.6 Integration in `NewsCard.tsx`

The thumbnail block in `NewsCard` should handle three states:

```tsx
// 1. Has thumbnail URL
// 2. Thumbnail URL failed to load (onError)  
// 3. No thumbnail URL at all

// State management
const [imgError, setImgError] = useState(false);
const showPlaceholder = !item.thumbnail || imgError;

// In JSX:
<div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0 /* top of card */ }}>
  {!showPlaceholder ? (
    <img
      src={item.thumbnail}
      alt=""
      loading="lazy"
      onError={() => setImgError(true)}
      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
    />
  ) : (
    <ThumbnailPlaceholder source={item.source} sourceFavicon={item.sourceFavicon} />
  )}
  {/* Source badge only shown here when real image is displayed — placeholder has its own badge */}
  {!showPlaceholder && (
    <div style={sourceBadgeStyle}>
      {item.sourceFavicon && <img src={item.sourceFavicon} width={14} height={14} style={{ borderRadius: 3 }} alt="" />}
      <span>{item.source}</span>
    </div>
  )}
</div>
```

Note: when the placeholder is shown, the source badge is rendered inside `ThumbnailPlaceholder` itself — don't double-render it.

### 4.7 Acceptance criteria

- [ ] Every news card with no thumbnail shows a placeholder (never a blank space or broken image)
- [ ] A real image that 404s falls back to the placeholder via `onError`
- [ ] Two cards from the same source always get the same palette and pattern
- [ ] Two cards from different sources are visually distinct (different palette)
- [ ] Initials circle, source name text, and source badge all render inside the placeholder
- [ ] The placeholder source badge looks identical in style to the badge on real images
- [ ] No animation on the placeholder (skeleton pulse is only for `NewsCardSkeleton`)

---

## Notes for Claude Code

- **Do not install new packages.** Every feature here uses what's already in the project.
- **Tokens to use:** All colours and spacing from `styles/tokens.css` and `app/globals.css`. Use `var(--color-*)` and `var(--radius-*)` throughout — no hardcoded hex values except in `LikeButton` for the red rgba values which don't have a token.
- **`--radius-lg`** in this codebase resolves to `var(--radius)` = `0.625rem` (from globals.css). Use `var(--radius-card)` (`10px`, from tokens.css) for card border radius to match `SkillCard`.
- **The app is dark-mode only.** `tokens.css` is the source of truth for bg/border/text colours. No light/dark branching needed.
- **Next.js 15+ params** — any dynamic route segment (`[id]`) must `await params` before destructuring.
- **`getAllCategories()`** returns `{ name, displayName, skills, folders: { name, skills }[] }[]`. Flatten with `categories.flatMap((cat) => [...cat.skills, ...cat.folders.flatMap(f => f.skills)])`.
