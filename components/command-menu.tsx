"use client";

import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/skills";

export function CommandTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-border/60 border border-border rounded-lg transition-colors"
    >
      <Search className="w-3.5 h-3.5" />
      <span>Search skills...</span>
      <kbd className="ml-3 text-xs bg-background border border-border rounded px-1.5 py-0.5 font-mono leading-none">
        ⌘K
      </kbd>
    </button>
  );
}

export default function CommandMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = useCallback(
    (category: string, slug: string) => {
      setOpen(false);
      router.push(`/skills/${category}/${slug}`);
    },
    [router]
  );

  return (
    <>
      <CommandTrigger onClick={() => setOpen(true)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <Command loop>
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Search skills..."
                  className="flex-1 py-4 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Results */}
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
                  No skills found.
                </Command.Empty>

                {categories.map((cat) => (
                  <Command.Group key={cat.name} heading={cat.displayName}>
                    {cat.skills.map((skill) => (
                      <Command.Item
                        key={`${cat.name}/${skill.slug}`}
                        value={`${skill.title} ${skill.description} ${skill.tags.join(" ")}`}
                        onSelect={() => handleSelect(cat.name, skill.slug)}
                        className="flex items-start gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">{skill.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{skill.description}</div>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
