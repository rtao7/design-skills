import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import type { Category } from "@/lib/skills";
import Logo from "@/public/logo.svg";
import Image from "next/image";

export default function Nav({ categories = [] }: { categories?: Category[] }) {
  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link
            href="/"
            className="text-sm font-semibold text-foreground shrink-0"
          >
            Designer Skills
          </Link>
          <span className="text-border hidden sm:block">|</span>
          <p className="text-sm text-muted-foreground hidden sm:block truncate">
            A small library of Agent skills for designers
          </p>
        </div>

        <div className="shrink-0">
          <CommandMenu categories={categories} />
        </div>
      </div>
    </nav>
  );
}
