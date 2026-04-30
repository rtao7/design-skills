import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function scrapeOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dskill-bot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:url["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all rows with no thumbnail (any status)
  const { data: rows, error } = await supabaseAdmin
    .from('news_items')
    .select('id, url')
    .is('thumbnail', null)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!rows?.length) return NextResponse.json({ updated: 0, failed: 0 })

  const results = { updated: 0, failed: 0 }

  // Scrape concurrently in batches of 5 to avoid hammering sites
  const BATCH = 5
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async (row) => {
        const thumbnail = await scrapeOgImage(row.url)
        if (!thumbnail) { results.failed++; return }

        const { error: updateErr } = await supabaseAdmin
          .from('news_items')
          .update({ thumbnail })
          .eq('id', row.id)

        if (updateErr) results.failed++
        else results.updated++
      })
    )
  }

  return NextResponse.json({ total: rows.length, ...results })
}
