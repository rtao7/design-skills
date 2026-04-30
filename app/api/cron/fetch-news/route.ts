import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabaseAdmin } from '@/lib/supabase'
import { RSS_SOURCES } from '@/lib/rss-sources'

async function scrapeOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dskill-bot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()

    const patterns = [
      // og:image (property attr first or second)
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      // og:image:url
      /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:url["']/i,
      // twitter:image (name attr)
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      // twitter:image:src
      /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image:src["']/i,
    ]

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match?.[1]) return match[1]
    }
    return null
  } catch {
    return null
  }
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
    ],
  },
})

export async function GET(req: NextRequest) {
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

        const thumbnail =
          (item as any).mediaContent?.$.url ||
          (item as any).mediaThumbnail?.$.url ||
          item.enclosure?.url ||
          await scrapeOgImage(item.link)

        const { error } = await supabaseAdmin
          .from('news_items')
          .upsert(
            {
              title: item.title,
              url: item.link,
              source: source.name,
              source_favicon: source.favicon,
              description: item.contentSnippet?.slice(0, 300) || null,
              thumbnail,
              published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
              tags: source.defaultTags,
              origin: 'rss',
              status: 'pending',
            },
            {
              onConflict: 'url',
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
