import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import type { Category } from "@/lib/skills";
import Logo from "@/public/logo.svg";
import Image from "next/image";

import { GeistPixelSquare } from "geist/font/pixel";
import { Button } from "./ui/button";

export default function Nav({
  categories = [],
  dark = false,
}: {
  categories?: Category[];
  dark?: boolean;
}) {
  return (
    <nav
      className={`border-b border-border sticky top-0 z-20 backdrop-blur-sm ${dark ? "bg-foreground/95" : "bg-background/95"}`}
    >
      <div className="p-6 py-3 h-14 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link
            href="/"
            className={`flex text-xl gap-4 items-center text font-bold shrink-0 ${dark ? "text-white" : "text-foreground"} ${GeistPixelSquare.className}`}
          >
            Design Skills
          </Link>
        </div>

        <div className={`flex  gap-4 shrink-0 ${GeistPixelSquare.className}`}>
          <CommandMenu categories={categories} />
          <Button>Join waitlist</Button>
        </div>
      </div>
    </nav>
  );
}
