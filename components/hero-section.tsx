export default function HeroSection() {
  return (
    <div className="flex flex-col justify-between flex-1 px-6 md:px-12 py-10">

      {/* Top-right headline */}
      <div className="flex justify-end">
        <div className="text-right">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,6rem)] leading-[1] font-normal text-foreground tracking-tight">
            Agent Skills
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            A curated library of AI skills for{" "}
            <span className="text-accent">designers.</span>
          </p>
        </div>
      </div>

      {/* Bottom-left hint */}
      <div className="flex items-center gap-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-foreground animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll to browse</span>
      </div>

    </div>
  );
}
