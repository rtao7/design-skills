"use client";

import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";
import type { Category, Skill } from "@/lib/skills";
import SkillViewer from "@/components/skill-viewer";

// Color palette per category name (falls back to blue)
const FOLDER_COLORS: Record<
  string,
  { top: string; bottom: string; shadow: string }
> = {
  design: { top: "#74B3F5", bottom: "#3A7BD5", shadow: "#2A5BA5" },
  product: { top: "#72C97A", bottom: "#3A9E45", shadow: "#2A7A33" },
  research: { top: "#F5A96B", bottom: "#D96F2A", shadow: "#B05520" },
  handoff: { top: "#C8C0B8", bottom: "#9A9088", shadow: "#7A7068" },
  strategy: { top: "#5CCEC9", bottom: "#2A9E99", shadow: "#1A7A76" },
  ux: { top: "#F57474", bottom: "#D93A3A", shadow: "#B02A2A" },
};
const DEFAULT_COLOR = { top: "#74B3F5", bottom: "#3A7BD5", shadow: "#2A5BA5" };

const CATEGORY_ORDER = ["product", "design"];

const PLACEHOLDER_FOLDERS = [
  { name: "handoff", displayName: "Handoff", comingSoon: true },
];

// Skill folder SVG and animation
function FolderShape({ isSelected }: { isSelected: boolean }) {
  return (
    <svg
      width="60"
      height="50"
      viewBox="0 0 60 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <path
        d="M2 0.5H20.3057C21.0388 0.5 21.6644 1.0299 21.7852 1.75293L22.2285 4.41113C22.4295 5.61652 23.4723 6.5 24.6943 6.5H58C58.8284 6.5 59.5 7.17157 59.5 8V48C59.5 48.8284 58.8284 49.5 58 49.5H2C1.17157 49.5 0.5 48.8284 0.5 48V2C0.500001 1.17157 1.17157 0.5 2 0.5Z"
        fill="#F39965"
        stroke="#FF6822"
      />
      <g visibility={isSelected ? "visible" : "hidden"}>
        <rect
          x="11"
          y="-4"
          width="46"
          height="36"
          rx="1.5"
          fill="white"
          stroke="#FF6822"
          style={{
            opacity: isSelected ? 1 : 0,
            transform: isSelected
              ? "rotate(2deg) translateX(4px)"
              : "rotate(5deg) translateY(6px)",
            transition: "opacity 0.2s ease 0ms, transform 0.2s ease 0ms",
          }}
        />
        <rect
          x="-3"
          y="5"
          width="46"
          height="36"
          rx="1.5"
          fill="white"
          stroke="#FF6822"
          style={{
            opacity: isSelected ? 1 : 0,
            transform: isSelected
              ? "rotate(-16deg) translateX(-5px)"
              : "rotate(-16deg) translateY(6px)",
            transition: "opacity 0.2s ease 30ms, transform 0.2s ease 30ms",
          }}
        />
        <rect
          x="18"
          y="0"
          width="46"
          height="36"
          rx="1.5"
          fill="white"
          stroke="#FF6822"
          style={{
            opacity: isSelected ? 1 : 0,
            transform: isSelected
              ? "rotate(10deg)"
              : "rotate(10deg) translateY(6px)",
            transition: "opacity 0.2s ease 60ms, transform 0.2s ease 60ms",
          }}
        />
      </g>

      <path
        d="M2.00293 10.5H58.0029C58.8314 10.5 59.5029 11.1716 59.5029 12V48C59.5029 48.8284 58.8314 49.5 58.0029 49.5H2.00293C1.1745 49.5 0.50293 48.8284 0.50293 48V12C0.50293 11.1716 1.1745 10.5 2.00293 10.5Z"
        fill="#FFE7D7"
        stroke="#FF6822"
      />
    </svg>
  );
}

export default function SkillBrowser({
  categories,
}: {
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories.find((c) => c.name === "product") ?? categories[0] ?? null,
  );
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  function selectCategory(cat: Category) {
    setSelectedCategory(cat);
    setSelectedSkill(null);
  }

  const sortedCategories = [
    ...(CATEGORY_ORDER.map((name) =>
      categories.find((c) => c.name === name),
    ).filter(Boolean) as Category[]),
    ...categories.filter((c) => !CATEGORY_ORDER.includes(c.name)),
  ];

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden border-t border-border bg-background">
      {/* Column 1 — Folder Stack */}
      <div className="w-48 shrink-0 border-r border-border overflow-y-auto bg-[#F4F2EE]">
        <div className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest border-b border-border">
          Categories
        </div>
        <div className="flex flex-col gap-2 p-4">
          {/* Real categories */}
          {sortedCategories.map((cat) => {
            const isSelected = selectedCategory?.name === cat.name;
            const colors = FOLDER_COLORS[cat.name] ?? DEFAULT_COLOR;
            return (
              <button
                key={cat.name}
                onClick={() => selectCategory(cat)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-150 ${
                  isSelected
                    ? "bg-white/80 ring-2 ring-accent/40 shadow-sm"
                    : "hover:bg-white/60"
                }`}
              >
                <FolderShape isSelected={isSelected} />
                <div className="text-center leading-tight">
                  <div
                    className={`text-xs font-medium ${isSelected ? "text-accent" : "text-foreground"}`}
                  >
                    {cat.displayName}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {cat.skills.length}{" "}
                    {cat.skills.length === 1 ? "skill" : "skills"}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Placeholder folders */}
          {PLACEHOLDER_FOLDERS.map((placeholder) => {
            const colors = FOLDER_COLORS[placeholder.name] ?? DEFAULT_COLOR;
            return (
              <div
                key={placeholder.name}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl opacity-60 cursor-default"
              >
                <FolderShape isSelected={false} />
                <div className="text-center leading-tight">
                  <div className="text-xs font-medium text-foreground">
                    {placeholder.displayName}
                  </div>
                  <div className="text-[10px] text-accent/80 font-medium">
                    Coming soon
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2 — Skills */}
      <div className="w-64 shrink-0 border-r border-border overflow-y-auto">
        {selectedCategory ? (
          <>
            <div className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-widest border-b border-border">
              Skills
            </div>
            {selectedCategory.skills.map((skill) => {
              const isSelected =
                selectedSkill?.slug === skill.slug &&
                selectedSkill?.category === skill.category;
              return (
                <button
                  key={skill.slug}
                  onClick={() => setSelectedSkill(skill)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                    isSelected
                      ? "bg-accent text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 shrink-0 ${isSelected ? "" : "text-muted-foreground"}`}
                  />
                  <span className="flex-1 truncate">{skill.title}</span>
                  {isSelected && (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a category
          </div>
        )}
      </div>

      {/* Column 3 — Detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedSkill ? (
          <div className="p-8 md:p-12 max-w-full">
            <div className="mb-8 pb-6">
              <h1 className="text-3xl font-semibold text-foreground mb-2 leading-tight font-serif">
                {selectedSkill.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {selectedSkill.description}
              </p>
              {selectedSkill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.tags.map((tag) => (
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
            <SkillViewer
              skill={{
                raw: selectedSkill.raw,
                body: selectedSkill.body,
                slug: selectedSkill.slug,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <FileText className="w-8 h-8 opacity-30" />
            <p className="text-sm">Select a skill to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
