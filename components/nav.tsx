import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import type { Category } from "@/lib/skills";
import Logo from "@/public/logo.svg";
import Image from "next/image";

export default function Nav({ categories = [] }: { categories?: Category[] }) {
  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* <Image src={Logo} alt="Logo" width={24} height={24} /> */}
          <Link href="/" className="text-sm font-semibold text-foreground">
            Designer Skills
          </Link>
          <span className="text-border">|</span>
          <p className="text-sm text-muted-foreground">
            A small library of Agent skills for designers
          </p>
        </div>
        <CommandMenu categories={categories} />
      </div>
    </nav>
  );
}
