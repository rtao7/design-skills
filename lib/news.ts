import { supabase } from './supabase'
import { NewsItem } from './types'

type SupabaseNewsRow = {
  id: string
  title: string
  url: string
  source: string
  source_favicon: string | null
  description: string | null
  thumbnail: string | null
  published_at: string
  tags: string[]
  origin: 'rss' | 'manual'
}

function toNewsItem(row: SupabaseNewsRow): NewsItem {
  return {
    id: row.id,
    type: 'news',
    title: row.title,
    url: row.url,
    source: row.source,
    sourceFavicon: row.source_favicon ?? undefined,
    description: row.description ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    publishedAt: row.published_at,
    tags: row.tags,
    origin: row.origin,
  }
}

export async function getApprovedNews(limit = 30): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news_items')
    .select('id, title, url, source, source_favicon, description, thumbnail, published_at, tags, origin')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as SupabaseNewsRow[]).map(toNewsItem)
}

export async function getNewsBySource(source: string, limit = 20): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news_items')
    .select('id, title, url, source, source_favicon, description, thumbnail, published_at, tags, origin')
    .eq('status', 'approved')
    .eq('source', source)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as SupabaseNewsRow[]).map(toNewsItem)
}
