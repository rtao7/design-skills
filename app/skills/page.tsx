import { getAllCategories } from '@/lib/skills';
import { SkillsFeed } from '@/components/cards/SkillsFeed';

export const metadata = {
  title: 'Skills — dskill',
  description: 'Curated AI skills for designers.',
};

export default async function SkillsPage() {
  const categories = await getAllCategories();

  const totalCount = categories.reduce(
    (sum, cat) =>
      sum + cat.skills.length + cat.folders.reduce((s, f) => s + f.skills.length, 0),
    0,
  );

  return (
    <div
      style={{
        padding: '36px 32px',
        maxWidth: '900px',
      }}
    >
      <SkillsFeed categories={categories} totalCount={totalCount} />
    </div>
  );
}
