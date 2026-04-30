import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabaseAdmin } from '@/lib/supabase'
import { RSS_SOURCES } from '@/lib/rss-sources'

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
          null

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
