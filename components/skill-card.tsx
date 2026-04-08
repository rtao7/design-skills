import Link from "next/link";
import type { Skill } from "@/lib/skills";

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link
      href={`/skills/${skill.category}/${skill.slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:border-foreground/20 hover:shadow-md transition-all duration-200"
    >
      <h3 className="font-display font-semibold text-foreground text-lg mb-2 group-hover:text-accent transition-colors leading-snug">
        {skill.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {skill.description}
      </p>
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
    </Link>
  );
}
