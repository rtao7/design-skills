import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import type { Category } from "@/lib/skills";

export default function Nav({ categories = [] }: { categories?: Category[] }) {
  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-foreground">
            Design Skills
          </Link>
          <span className="text-border">|</span>
          <p className="text-sm text-muted-foreground">
            AI skills to automate your design workflow
          </p>
        </div>
        <CommandMenu categories={categories} />
      </div>
    </nav>
  );
}
