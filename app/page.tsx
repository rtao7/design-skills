import { getApprovedNews } from '@/lib/news';
import { getAllCategories } from '@/lib/skills';
import { NewsFeed } from '@/components/cards/NewsFeed';
import { ContextBar } from '@/components/home/ContextBar';

export const revalidate = 3600;

export const metadata = {
  title: 'Design News — dskill',
  description: 'Curated design news from the best publications.',
};

export default async function HomePage() {
  const [categories, items] = await Promise.all([
    getAllCategories(),
    getApprovedNews(30),
  ]);

  const skillCount = categories.flatMap((cat) => [
    ...cat.skills,
    ...cat.folders.flatMap((f) => f.skills),
  ]).length;

  return (
    <main style={{ padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)' }}>
      <ContextBar newsCount={items.length} skillCount={skillCount} />
      <NewsFeed items={items} />
    </main>
  );
}
