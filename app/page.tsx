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
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <div className="flex flex-col h-screen bg-background snap-start">
        <Nav categories={categories} />
        <div className="flex flex-1 overflow-hidden">
          {/* Left — headline */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-12 flex-1 gap-8">
            <div className="flex flex-col gap-2">
              <h1 className=" text-6xl leading-[0.9] text-foreground">
                Agent Skills
              </h1>
              <p className="text-[clamp(1.5rem,3.5vw,3rem)] leading-tight font-light text-foreground/60 tracking-tight">
                for designers to build
                <br />
                with AI.
              </p>
            </div>

            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A curated library of prompts and skills for UX, product, and
              digital designers — ready to drop into your AI agent of choice.
            </p>

            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll to browse</span>
            </div>
          </div>

          {/* Right — decorative grid */}
          <div className="hidden md:flex flex-col justify-center items-center w-[40%] shrink-0 relative overflow-hidden border-l border-border">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6 p-12">
              {categories.map((cat, i) => (
                <div
                  key={cat.name}
                  className="w-full max-w-[260px] bg-background/80 backdrop-blur-sm border border-border rounded-xl px-5 py-4 shadow-sm"
                  style={{
                    transform: i % 2 === 0 ? "rotate(-1deg)" : "rotate(1deg)",
                  }}
                >
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    {cat.displayName}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {cat.skills.slice(0, 3).map((skill) => (
                      <div key={skill.slug} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                        <span className="text-sm text-foreground truncate">
                          {skill.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen snap-start flex flex-col md:p-6">
        <div className="flex-1 rounded-lg shadow-lg border border-border bg-background overflow-hidden">
          <SkillBrowser categories={categories} />
        </div>
      </div>
    </div>
  );
}
