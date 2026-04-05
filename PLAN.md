# Plan: Designer Skills Web App

## Context
Building a new Next.js web app at `/Users/ruitao/Desktop/projects/designer-skills` (empty directory). The app lets designers browse Agent Skills — markdown files that automate UX/product design workflows. Skills are organized by category folder on the filesystem.

---

## Tech Stack — and Why

### Next.js (App Router)
Next.js is a framework built on top of React. We use it because it can **pre-render pages at build time** — meaning when a user visits `/skills/research/competitive-analysis`, the HTML is already generated and just served instantly. No waiting for JavaScript to fetch data. This also means the app works even if JavaScript is slow or disabled.

The "App Router" is Next.js's modern routing system where each folder inside `src/app/` becomes a URL path. So `src/app/skills/[category]/[slug]/page.tsx` automatically becomes the URL `/skills/research/competitive-analysis`.

### TypeScript
JavaScript with type-checking. When you write `skill.title`, TypeScript will yell at you if `title` doesn't exist on the skill object. Prevents a whole class of bugs where you access the wrong property name.

### Tailwind CSS v4
A utility-first CSS framework — instead of writing `.card { padding: 16px; }` in a separate CSS file, you write `className="p-4"` directly in your component. Keeps styles co-located with the component they affect. v4 is the latest version and is configured entirely in CSS (no `tailwind.config.js` file).

### gray-matter
A tiny library that parses YAML frontmatter out of markdown files. Frontmatter is the metadata block at the top of a `.md` file:
```
---
title: Competitive Analysis
description: Automates research for product designers
tags: [research, strategy]
---
# Actual content starts here...
```
`gray-matter` splits this into `{ data: { title, description, tags }, content: "# Actual content..." }`. We use `data` for the card/metadata display and `content` for rendering the markdown body.

### react-markdown + remark-gfm
`react-markdown` converts a markdown string into React JSX — headings become `<h1>`, lists become `<ul>`, code blocks become `<pre><code>`, etc. `remark-gfm` is a plugin that adds GitHub-flavored markdown support (tables, checkboxes, strikethrough).

### lucide-react
Icon library. Clean SVG icons (Download, Copy, Check, ChevronRight) as React components.

### shadcn/ui
A collection of pre-built, styled UI components (Button, Badge, Card, etc.) that get copied directly into your project. You own the code, so you can edit anything. Installed via CLI: `npx shadcn@latest add button`. Built on top of Radix UI primitives, which means all the accessibility (ARIA, keyboard navigation) is handled automatically. Perfect for a design tool showcase — polished UI fast, fully customizable.

---

## File Structure — and Why It's Organized This Way

```
designer-skills/
├── skills/                          # Raw markdown content lives here
│   ├── product/
│   │   ├── feature-story-writer.md
│   │   └── pm-thinking-coach.md
│   └── design/
│       └── product-design-critiquer.md
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── skills/[category]/[slug]/page.tsx
│   │
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── skill-card.tsx
│   │   ├── skill-viewer.tsx
│   │   └── ui/
│   │       ├── badge.tsx
│   │       └── button.tsx
│   │
│   └── lib/
│       ├── skills.ts
│       └── utils.ts
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

**Why `skills/` sits at the project root, not inside `src/`?**
It keeps content and code cleanly separated. The `src/` folder is for application code (components, pages, logic). The `skills/` folder is your content database — markdown files that a non-developer could theoretically edit without touching any code. When the app builds, it reads from `skills/` using Node.js file system APIs.

**Why `[category]` and `[slug]` in the URL path?**
Square brackets in Next.js = dynamic segments. `[category]` captures whatever folder name is there (`research`, `handoff`, `product`) and `[slug]` captures the filename (`competitive-analysis`). The app uses these to look up the right `.md` file at build time.

**Why separate `lib/skills.ts` from the page components?**
Single responsibility. The page component's job is to render UI. The `lib/skills.ts` file's job is to read files and parse markdown. If we ever change how skills are stored (say, switching to a database later), we only update one file — not every page.

---

## Key Implementation Details

### `src/lib/skills.ts` — The Data Pipeline

This is the most important file. It owns all filesystem access.

```ts
type SkillFrontmatter = {
  title: string;
  description: string;
  tags?: string[];       // optional — not all skills need tags
  author?: string;
  createdAt?: string;
}

type Skill = SkillFrontmatter & {
  category: string;   // e.g. "research" — derived from folder name
  slug: string;       // e.g. "competitive-analysis" — derived from filename
  raw: string;        // full file content including frontmatter (for "Raw" tab + download)
  body: string;       // content after gray-matter strips frontmatter (for "Rendered" tab)
}

type Category = {
  name: string;         // raw folder name: "design-thinking"
  displayName: string;  // formatted: "Design Thinking"
  skills: Skill[];
}
```

Three functions the app uses:
- `getAllCategories()` — reads the `skills/` directory, loops over each folder, reads every `.md` file inside it, parses frontmatter. Used on the home page.
- `getSkill(category, slug)` — reads one specific file. Returns `null` if the file doesn't exist (so the page can show a 404).
- `getAllSkillPaths()` — returns all `{ category, slug }` pairs. Used by Next.js to know which pages to pre-generate at build time.

**Why async functions with `fs/promises`?**
Node.js is single-threaded. If we use synchronous file reads (`fs.readFileSync`), the entire server is blocked while reading files — nothing else can run. `fs/promises` lets us read files without blocking, using `async/await`.

### `src/app/page.tsx` — Home Page (Server Component)

A React Server Component. This means it runs on the server (or at build time) and generates plain HTML. It has no interactive state — it just calls `getAllCategories()` and renders the results.

Structure:
1. `<Nav />` at the top
2. Hero: app name + a short tagline
3. Category jump-links: pill buttons that scroll to `#research`, `#handoff`, etc.
4. For each category: a heading + a 3-column responsive grid of `<SkillCard />` components

Each `<SkillCard />` is a link to `/skills/{category}/{slug}` showing the skill title, description (truncated), and tags.

### `src/app/skills/[category]/[slug]/page.tsx` — Detail Page

```ts
// Tells Next.js "build a static HTML page for every skill at build time"
export async function generateStaticParams() {
  return getAllSkillPaths();
  // Returns: [{ category: "research", slug: "competitive-analysis" }, ...]
}

// IMPORTANT: In Next.js 15+, params is a Promise — must be awaited
export default async function SkillPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const skill = await getSkill(category, slug);
  if (!skill) notFound();  // Shows the built-in 404 page
```

Why `generateStaticParams`? Without it, Next.js doesn't know about the skill pages ahead of time and would have to read the filesystem on every request. With it, all skill pages are pre-built as static HTML files — fast to serve, no runtime overhead.

### `src/components/skill-viewer.tsx` — The Interactive Part ("use client")

The only component that needs to be a client component (runs in the browser). Everything else can be server-rendered. It has two jobs:

1. **Toggle between Rendered and Raw views**
   - `mode: "rendered" | "raw"` state
   - Rendered: pass `body` to `<ReactMarkdown>` with Tailwind selector-chain styling
   - Raw: show `raw` in a `<pre>` block (monospace, scrollable)

2. **Copy and Download buttons**
   - Copy: `navigator.clipboard.writeText(raw)` → icon swaps to a checkmark for 1.5s
   - Download: Can't use a plain `<a href="..." download>` because the `.md` files are **not** in `public/` — the browser can't directly access them. Instead, we create a temporary URL from the file's text content:
     ```ts
     const blob = new Blob([raw], { type: "text/markdown" });
     const url = URL.createObjectURL(blob);  // creates a temporary browser URL
     const a = document.createElement("a");
     a.href = url; a.download = `${slug}.md`; a.click();
     URL.revokeObjectURL(url);  // clean up memory immediately after
     ```
     This is a common pattern for downloading generated content in the browser.

### `src/app/globals.css` — Design Tokens

Tailwind v4 uses CSS-first configuration. All design decisions live here as CSS variables:
```css
:root {
  --background: oklch(1 0 0);           /* white */
  --foreground: oklch(0.145 0 0);       /* near-black */
  --primary: oklch(0.205 0 0);          /* dark */
  --muted: oklch(0.97 0 0);             /* light gray backgrounds */
  --border: oklch(0.922 0 0);           /* subtle borders */
  --radius: 0.625rem;                   /* 10px base, all corners scale from this */
}
```

**Why oklch colors?** oklch is a perceptually uniform color space — `oklch(0.7 0.15 hue)` at different hue values looks equally vibrant, unlike hex colors where some hues appear brighter at the same "brightness" value. It makes building a consistent color system easier.

**Why CSS variables instead of hardcoding hex values in Tailwind classes?** Because to completely restyle the app, you only change the values in `:root {}` — every component that uses `bg-background`, `text-foreground`, `border-border`, etc. updates automatically. This is the "reskin later" strategy.

---

## Skills We're Seeding

The 3 real skills, organized into 2 category folders:

**`skills/product/`**
- `feature-story-writer.md` — Feature Story Writer
- `pm-thinking-coach.md` — PM Thinking Coach

**`skills/design/`**
- `product-design-critiquer.md` — Product Design Critiquer

Each file needs YAML frontmatter (title, description, tags) plus the skill's markdown body content.

---

## Gotchas (Things That Will Bite You If Forgotten)

1. **`await params`** — Next.js 16 changed `params` to be a Promise. Always `const { category, slug } = await params` before using them.
2. **No `tailwind.config.ts`** — Tailwind v4 is CSS-only. All theme customization goes in `globals.css` under `@theme inline { }`. A `tailwind.config.ts` file is silently ignored.
3. **Download via Blob** — `.md` files aren't in `public/`, so the browser can't fetch them directly. Use the Blob URL trick in the client component.
4. **Category + slug as unique key** — Two skills in different folders can have the same filename (e.g. `research/analysis.md` and `handoff/analysis.md`). Never use slug alone as a unique identifier — always combine `category + "/" + slug`.
5. **Async filesystem reads** — Use `fs/promises` (not `fs.readFileSync`) everywhere in `lib/skills.ts`.
6. **`react-markdown` is browser-only** — `SkillViewer` must be `"use client"`. The server page just fetches data and passes `raw` + `body` as props down to it.

---

## Verification Steps

1. `npm run dev` → home page shows all category sections, each with skill cards
2. Click a skill card → detail page loads with nicely formatted markdown
3. Toggle to "Raw" → shows raw source including frontmatter
4. Click Copy → clipboard has the raw markdown content, icon flips to a checkmark
5. Click Download → `.md` file downloads in the browser
6. Breadcrumb: Home > Product > Feature Story Writer (with working links)
7. `npm run build` → all pages pre-generate with no TypeScript or build errors
