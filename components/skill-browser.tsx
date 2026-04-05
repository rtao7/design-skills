"use client";

import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";
import type { Category, Skill } from "@/lib/skills";
import SkillViewer from "@/components/skill-viewer";

// Color palette per category name (falls back to blue)
const FOLDER_COLORS: Record<string, { top: string; bottom: string; shadow: string }> = {
  design:   { top: "#74B3F5", bottom: "#3A7BD5", shadow: "#2A5BA5" },
  product:  { top: "#72C97A", bottom: "#3A9E45", shadow: "#2A7A33" },
  research: { top: "#F5A96B", bottom: "#D96F2A", shadow: "#B05520" },
  handoff:  { top: "#C8C0B8", bottom: "#9A9088", shadow: "#7A7068" },
  strategy: { top: "#5CCEC9", bottom: "#2A9E99", shadow: "#1A7A76" },
  ux:       { top: "#F57474", bottom: "#D93A3A", shadow: "#B02A2A" },
};
const DEFAULT_COLOR = { top: "#74B3F5", bottom: "#3A7BD5", shadow: "#2A5BA5" };

const CATEGORY_ORDER = ["product", "design"];

const PLACEHOLDER_FOLDERS = [
  { name: "handoff", displayName: "Handoff", comingSoon: true },
];

function FolderShape({
  id,
  colors,
  isSelected,
}: {
  id: string;
  colors: { top: string; bottom: string; shadow: string };
  isSelected: boolean;
}) {
  const gradId = `fg-${id}`;
  const shadowId = `fs-${id}`;
  const shineId = `fsh-${id}`;

  return (
    <svg
      width="72"
      height="58"
      viewBox="0 0 72 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: isSelected ? `drop-shadow(0 4px 8px ${colors.shadow}88)` : "drop-shadow(0 2px 4px rgba(0,0,0,0.18))" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
        <linearGradient id={shadowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main folder body — tab + body as one path */}
      {/* Tab is top-left ~40% width, body is full width below y=12 */}
      <path
        d="M 5,58 Q 0,58 0,53 L 0,5 Q 0,0 5,0 L 26,0 Q 30,0 31,5 L 31,12 L 67,12 Q 72,12 72,17 L 72,53 Q 72,58 67,58 Z"
        fill={`url(#${gradId})`}
      />

      {/* Depth shadow overlay */}
      <path
        d="M 5,58 Q 0,58 0,53 L 0,5 Q 0,0 5,0 L 26,0 Q 30,0 31,5 L 31,12 L 67,12 Q 72,12 72,17 L 72,53 Q 72,58 67,58 Z"
        fill={`url(#${shadowId})`}
      />

      {/* Shine highlight on tab */}
      <path
        d="M 4,1 L 27,1 Q 29,1 30,3 L 30,7 Q 20,5 4,6 Z"
        fill="white"
        fillOpacity="0.35"
      />

      {/* Shine highlight on body top */}
      <rect
        x="1" y="13" width="70" height="10"
        rx="1"
        fill={`url(#${shineId})`}
      />

      {/* Subtle inner bottom shadow */}
      <rect
        x="1" y="50" width="70" height="7"
        rx="0"
        fill="black"
        fillOpacity="0.07"
      />

      {/* Fold line — horizontal crease between tab and body */}
      <line
        x1="31" y1="12" x2="72" y2="12"
        stroke="black"
        strokeOpacity="0.1"
        strokeWidth="1"
      />

      {/* Left edge highlight */}
      <line
        x1="1" y1="5" x2="1" y2="53"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function SkillBrowser({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories.find((c) => c.name === "product") ?? categories[0] ?? null
  );
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  function selectCategory(cat: Category) {
    setSelectedCategory(cat);
    setSelectedSkill(null);
  }

  const sortedCategories = [
    ...CATEGORY_ORDER.map((name) => categories.find((c) => c.name === name)).filter(Boolean) as Category[],
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
                <FolderShape id={cat.name} colors={colors} isSelected={isSelected} />
                <div className="text-center leading-tight">
                  <div className={`text-xs font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                    {cat.displayName}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {cat.skills.length} {cat.skills.length === 1 ? "skill" : "skills"}
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
                <FolderShape id={placeholder.name} colors={colors} isSelected={false} />
                <div className="text-center leading-tight">
                  <div className="text-xs font-medium text-foreground">{placeholder.displayName}</div>
                  <div className="text-[10px] text-accent/80 font-medium">Coming soon</div>
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
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
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
          <div className="p-8 max-w-2xl">
            <div className="mb-8 pb-6 border-b border-border">
              <h1 className="text-2xl font-semibold text-foreground mb-2 leading-tight">
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
