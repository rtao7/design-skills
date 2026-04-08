import { getAllCategories } from "@/lib/skills";
import Nav from "@/components/nav";
import SkillBrowser from "@/components/skill-browser";
import Computer from "@/components/decorations/computer";

export const metadata = {
  title: "Design Skills — AI Skills for Designers",
  description:
    "A curated registry of AI skills that help UX and product designers automate their workflows.",
};

export default async function Home() {
  const categories = await getAllCategories();
  return (
    <div>
      <div className="flex flex-col h-fit bg-background overflow-hidden">
        <Nav categories={categories} />
        <div className="flex flex-col mt-0 md:m-6 rounded-lg h-[90vh] shadow-lg border border-border bg-background overflow-hidden">
          <SkillBrowser categories={categories} />
        </div>
      </div>
    </div>
  );
}
