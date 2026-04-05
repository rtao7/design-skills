import { notFound } from "next/navigation";
import { getAllSkillPaths, getSkill } from "@/lib/skills";
import Nav from "@/components/nav";
import Breadcrumb from "@/components/breadcrumb";
import SkillViewer from "@/components/skill-viewer";

export async function generateStaticParams() {
  return getAllSkillPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const skill = await getSkill(category, slug);
  if (!skill) return {};
  return {
    title: `${skill.title} — Design Skills`,
    description: skill.description,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const skill = await getSkill(category, slug);
  if (!skill) notFound();

  const displayCategory = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Breadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: displayCategory, href: `/#${category}` },
              { label: skill.title },
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-8 pb-8 border-b border-border">
          <h1 className="font-display text-4xl font-semibold text-foreground mb-3 leading-tight">
            {skill.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-5">
            {skill.description}
          </p>
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Viewer */}
        <SkillViewer
          skill={{ raw: skill.raw, body: skill.body, slug: skill.slug }}
        />
      </main>
    </div>
  );
}
