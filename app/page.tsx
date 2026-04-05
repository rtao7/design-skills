import { getAllCategories } from "@/lib/skills";
import Nav from "@/components/nav";
import SkillBrowser from "@/components/skill-browser";

export const metadata = {
  title: "Design Skills — AI Skills for Designers",
  description:
    "A curated registry of AI skills that help UX and product designers automate their workflows.",
};

export default async function Home() {
  const categories = await getAllCategories();
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Nav categories={categories} />
      <SkillBrowser categories={categories} />
    </div>
  );
}
