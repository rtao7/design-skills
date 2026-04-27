import { getApprovedNews } from '@/lib/news';
import { NewsFeed } from '@/components/cards/NewsFeed';

export const revalidate = 3600;

export const metadata = {
  title: 'Design News — dskill',
  description: 'Curated design news from the best publications.',
};

export default async function HomePage() {
  const items = await getApprovedNews(30);

  return (
    <main style={{ padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Design News
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
            marginBottom: 0,
          }}
        >
          {items.length} stories
        </p>
      </div>

      <NewsFeed items={items} />
    </main>
  );
}
