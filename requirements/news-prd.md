# dskill.dev — News Section PRD
**For Claude Code** | Extends PRD v2
*Homepage becomes news feed. Skills moves to /skills.*

---

## 1. What's Changing

| Before | After |
|---|---|
| `/` → Skills feed | `/` → News feed |
| `/skills` → didn't exist | `/skills` → Skills feed |
| News → coming soon | News → fully live |
| Data → flat files | News data → Supabase |

Everything else stays the same. This is an additive change.

---

## 2. New Dependencies

```bash
npm install @supabase/supabase-js
npm install rss-parser
```

---

## 3. Supabase Setup

### 3.1 Environment Variables

Add to `.env.local` and Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_random_secret_string
```

`SUPABASE_SERVICE_ROLE_KEY` is used server-side only (cron job).
`CRON_SECRET` protects the cron endpoint from unauthorized calls.

### 3.2 Supabase Client

Create `/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side only — for cron job
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 3.3 Database Table

Run this SQL in Supabase dashboard → SQL Editor:

```sql
create table news_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null unique,
  source text not null,
  source_favicon text,
  description text,
  thumbnail text,
  published_at timestamptz,
  tags text[] default '{}',
  origin text default 'rss' check (origin in ('rss', 'manual')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Index for fast homepage queries
create index news_items_status_idx on news_items(status);
create index news_items_published_idx on news_items(published_at desc);

-- Enable Row Level Security
alter table news_items enable row level security;

-- Public can only read approved items
create policy "Public reads approved news"
  on news_items for select
  using (status = 'approved');

-- Service role has full access (for cron job)
-- This is automatic for service_role key
```

---

## 4. RSS Sources

```ts
// /lib/rss-sources.ts

export const RSS_SOURCES = [
  {
    name: 'Designer News',
    url: 'https://www.designernews.co/?format=rss',
    favicon: 'https://www.designernews.co/favicon.ico',
    defaultTags: ['design', 'news'],
  },
  {
    name: 'Sidebar.io',
    url: 'https://sidebar.io/feed.xml',
    favicon: 'https://sidebar.io/favicon.ico',
    defaultTags: ['design', 'curated'],
  },
  {
    name: 'UX Collective',
    url: 'https://uxdesign.cc/feed',
    favicon: 'https://uxdesign.cc/favicon.ico',
    defaultTags: ['ux', 'article'],
  },
  {
    name: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
    favicon: 'https://www.smashingmagazine.com/favicon.ico',
    defaultTags: ['design', 'development'],
  },
]
```

---

## 5. Cron Job (RSS Fetcher)

### 5.1 API Route

Create `/app/api/cron/fetch-news/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabaseAdmin } from '@/lib/supabase'
import { RSS_SOURCES } from '@/lib/rss-sources'

const parser = new Parser()

export async function GET(req: NextRequest) {
  // Auth check — Vercel sends this header automatically
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { inserted: 0, skipped: 0, errors: [] as string[] }

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url)

      for (const item of feed.items.slice(0, 20)) {
        if (!item.title || !item.link) continue

        const { error } = await supabaseAdmin
          .from('news_items')
          .upsert(
            {
              title: item.title,
              url: item.link,
              source: source.name,
              source_favicon: source.favicon,
              description: item.contentSnippet?.slice(0, 300) || null,
              published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
              tags: source.defaultTags,
              origin: 'rss',
              status: 'pending',
            },
            {
              onConflict: 'url',   // skip duplicates
              ignoreDuplicates: true,
            }
          )

        if (error) {
          results.errors.push(`${source.name}: ${error.message}`)
        } else {
          results.inserted++
        }
      }
    } catch (err) {
      results.errors.push(`${source.name}: fetch failed`)
    }
  }

  return NextResponse.json(results)
}
```

### 5.2 Vercel Cron Config

Create `/vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 8 * * *"
    }
  ]
}
```

`0 8 * * *` = runs every day at 8:00 AM UTC.

---

## 6. Data Fetching

Create `/lib/news.ts`:

```ts
import { supabase } from './supabase'
import { NewsItem } from './types'

// Homepage feed — approved only
export async function getApprovedNews(limit = 30): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as NewsItem[]
}

// For filtering by source
export async function getNewsBySource(
  source: string,
  limit = 20
): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('status', 'approved')
    .eq('source', source)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as NewsItem[]
}
```

---

## 7. Pages

### 7.1 Homepage (`/app/page.tsx`)

Homepage becomes the news feed. This replaces the current skills redirect.

```
┌─────────────────────────────────────────────┐
│  Header: "Design News"                      │
│  [All] [Designer News] [Sidebar] [UX Coll.] │  ← source filter tabs
├────────────────────┬────────────────────────┤
│  NewsCard          │  NewsCard              │
│  [source favicon]  │  [source favicon]      │
│  Title             │  Title                 │
│  description...    │  description...        │
│  [tag][tag]        │  [tag][tag]            │
│  [↗ Read][⭐ Save] │  [↗ Read][⭐ Save]    │
├────────────────────┼────────────────────────┤
│  NewsCard          │  NewsCard              │
└────────────────────┴────────────────────────┘
```

Page is a **server component** — fetches data at request time (ISR, revalidate every hour).

```ts
export const revalidate = 3600 // re-render page every hour
```

### 7.2 Skills Page (`/app/skills/page.tsx`)

Move existing homepage skills feed here. No changes to the feed itself — just a new route.

### 7.3 `/app/news/page.tsx`

Redirect to `/` — news IS the homepage now.

```ts
import { redirect } from 'next/navigation'
export default function NewsPage() {
  redirect('/')
}
```

---

## 8. NewsCard Component (update existing)

The `NewsCard` component already exists from Phase 2. Update it to handle real data:

```
┌──────────────────────────────────────────────┐
│  [favicon 16px] Designer News  ·  2 days ago │  ← source row
│                                              │
│  The New Typography: Variable Fonts Are      │  ← title, 2-line clamp
│  Changing How We Design Type                 │     font-weight: 600
│                                              │
│  How type designers are rethinking scale     │  ← description, muted
│  and weight for digital screens...           │     3-line clamp
│                                              │
│  [design] [typography]                       │  ← tags
│                                              │
│  [↗ Read]          [⭐ Save]                 │  ← actions
└──────────────────────────────────────────────┘
```

**"X days ago" formatting:** use a `timeAgo(date)` utility — don't show raw timestamps.

```ts
// /lib/utils.ts — add this function
export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
```

---

## 9. Sidebar Updates

Update the sidebar nav to reflect the new IA:

```
│  🏠  Home            │  ← now points to / (news feed)
│                      │
│  DISCOVER            │
│  ⚡  Skills          │  ← now points to /skills
│  🗂️  Resources       │  ← still coming soon
│  🔥  Community       │  ← still coming soon
│                      │
│  LIBRARY             │
│  ⭐  Saved           │
│                      │
│  SOURCES             │  ← new section, news page only
│  ●  All              │
│  ●  Designer News    │
│  ●  Sidebar.io       │
│  ●  UX Collective    │
│  ●  Smashing Mag     │
```

The SOURCES section is **context-sensitive** — only visible when on the homepage/news feed. Same pattern as the category filter on the skills page.

---

## 10. Your Approval Workflow

No admin page needed. Here's your daily process:

1. Go to [supabase.com](https://supabase.com) → your project → Table Editor → `news_items`
2. Filter by `status = pending`
3. For each story: click the `status` cell → change to `approved` or `rejected`
4. Stories marked `approved` appear on the homepage within 1 hour (ISR revalidation)

**Pro tip:** Bookmark the Supabase table filtered view. Takes 2 minutes per day.

---

## 11. File Changes Summary

### New Files
```
/app/api/cron/fetch-news/route.ts   ← RSS fetcher
/lib/supabase.ts                    ← Supabase client
/lib/rss-sources.ts                 ← RSS source config
/lib/news.ts                        ← News data fetching
/vercel.json                        ← Cron schedule
```

### Modified Files
```
/app/page.tsx                       ← Now renders news feed
/app/skills/page.tsx                ← New file (moved from /)
/app/news/page.tsx                  ← Redirect to /
/components/layout/Sidebar.tsx      ← Add SOURCES section
/components/cards/NewsCard.tsx      ← Wire to real data
/lib/types.ts                       ← NewsItem already defined
/lib/utils.ts                       ← Add timeAgo()
```

### Do Not Touch
```
/lib/skills.ts
/components/cards/SkillCard.tsx
/styles/tokens.css
```

---

## 12. Implementation Phases

### Phase A — Supabase Setup
1. Create Supabase project at supabase.com
2. Run SQL from Section 3.3 to create table
3. Copy env variables to `.env.local`
4. Create `/lib/supabase.ts`
5. Create `/lib/rss-sources.ts`

✅ **Checkpoint:** `supabase.from('news_items').select('*')` returns empty array, no error.

---

### Phase B — RSS Cron Job
1. Install `rss-parser`: `npm install rss-parser`
2. Create `/app/api/cron/fetch-news/route.ts`
3. Create `/vercel.json` with cron schedule
4. Add `CRON_SECRET` to `.env.local`
5. Test manually: `curl http://localhost:3000/api/cron/fetch-news -H "Authorization: Bearer YOUR_SECRET"`
6. Check Supabase table — rows should appear with `status: pending`

✅ **Checkpoint:** Running cron manually populates the `news_items` table with pending stories.

---

### Phase C — Approval & Homepage
1. Manually approve 6–10 stories in Supabase table editor
2. Create `/lib/news.ts` with `getApprovedNews()`
3. Rewrite `/app/page.tsx` to fetch and render approved news
4. Add `export const revalidate = 3600`
5. Move skills feed to `/app/skills/page.tsx`
6. Add redirect in `/app/news/page.tsx`

✅ **Checkpoint:** Homepage shows approved news stories. `/skills` shows skills feed.

---

### Phase D — UI Polish
1. Update `NewsCard` with `timeAgo()` formatting
2. Add source filter tabs to homepage
3. Update Sidebar with SOURCES section (context-sensitive)
4. Add skeleton loading state for news feed
5. Update sidebar Home link → `/`, Skills link → `/skills`

✅ **Checkpoint:** Filter tabs work. Sidebar shows sources on homepage only. Cards show "2d ago" format.

---

## 13. Claude Code Starting Prompt

```
We're adding a News section to dskill.dev. Follow the 
News PRD (dskill-news-PRD.md) exactly.

The homepage (/) becomes the news feed.
Skills moves to /skills.
News data lives in Supabase.
RSS fetches daily via Vercel cron.

DO NOT TOUCH:
- /lib/skills.ts
- /components/cards/SkillCard.tsx
- /styles/tokens.css
- Any existing Phase 1–7 work unless explicitly listed 
  in the "Modified Files" section of the PRD

Build in order: Phase A → B → C → D
Stop after each phase and confirm before continuing.
Show your plan before making any changes.

Start with Phase A.
```

---

## 14. Success Criteria

- [ ] Supabase table exists and RSS cron populates it with pending stories
- [ ] Approving a story in Supabase makes it appear on the homepage within 1 hour
- [ ] Homepage shows news feed, not skills
- [ ] `/skills` shows the skills feed correctly
- [ ] Source filter tabs work on the homepage
- [ ] Sidebar SOURCES section appears on homepage only
- [ ] NewsCard shows favicon, source name, timeAgo, title, description, tags
- [ ] Cron runs automatically every day at 8AM UTC via Vercel
- [ ] No regressions in skills, saved, or coming soon pages

---

*News Section PRD — dskill.dev*
*Stack: Next.js + Supabase + Vercel Cron*
