"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download } from "lucide-react";

type Props = {
  skill: {
    raw: string;
    body: string;
    slug: string;
  };
};

export default function SkillViewer({ skill }: Props) {
  const [mode, setMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(skill.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([skill.raw], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="shadow-[0_0_0_1px_rgba(0,0,0,0.1)] rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 md:px-3 md:py-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setMode("rendered")}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              mode === "rendered"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setMode("raw")}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              mode === "raw"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Markdown
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === "rendered" ? (
        <div className="px-6 py-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-base font-semibold mt-6 mb-2 text-foreground first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold mt-5 mb-2 text-foreground uppercase tracking-wide">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-4 mb-1.5 text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-foreground/75 leading-relaxed mb-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 mb-3 space-y-1 text-foreground/75 text-sm">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 mb-3 space-y-1 text-foreground/75 text-sm">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-accent pl-3 my-3 italic text-muted-foreground text-sm">
                  {children}
                </blockquote>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted rounded-xl p-5 overflow-x-auto my-4 text-sm font-mono leading-relaxed">
                  {children}
                </pre>
              ),
              code: ({ className, children }) => {
                const isBlock = !!className;
                return isBlock ? (
                  <code className={className}>{children}</code>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                );
              },
              hr: () => <hr className="border-border my-6" />,
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
            }}
          >
            {skill.body}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="bg-muted rounded-xl m-4 p-5 overflow-x-auto text-sm font-mono leading-relaxed text-foreground/80 whitespace-pre-wrap">
          {skill.raw}
        </pre>
      )}
    </div>
  );
}
