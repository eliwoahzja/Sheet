import { Copy, Check, Terminal } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import OnThisPageNav from "@/components/OnThisPageNav";
import LivePreview from "@/components/LivePreview";

interface DocPageProps {
  content: {
    lang: string;
    cat: string;
    shortcut: string;
    desc: string;
    example: string;
    syntax?: string;
    whatItDoes?: string;
    useCase?: string;
    shortcuts?: {
      vscode: string;
      notepadpp: string;
    };
    guide?: {
      title: string;
      detail: string;
    }[];
    guideNote?: string;
  };
}

const CODE_BG = "#282c34";
const CODE_BAR_BG = "#21252b";

function prismLanguage(lang: string) {
  if (lang === "html") return "markup";
  if (lang === "css") return "css";
  if (lang === "js") return "javascript";
  return "text";
}

function CodeBlock({
  code,
  language,
  label,
  copyable = false,
}: {
  code: string;
  language: string;
  label: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden border border-border shadow-sm ring-1 ring-black/5">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b border-black/30"
        style={{ backgroundColor: CODE_BAR_BG }}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-xs font-mono text-white/50">
          <Terminal size={12} />
          {label}
        </span>
        {copyable && (
          <button
            onClick={copy}
            className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#27c93f]" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem 1.25rem",
          background: CODE_BG,
          fontSize: "0.85rem",
          lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace" } }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function Section({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function DocPage({ content }: DocPageProps) {
  const language = prismLanguage(content.lang);

  return (
    <article key={content.shortcut} className="flex gap-8">
      <div className="min-w-0 flex-1 space-y-8">
        {/* Header */}
        <Section>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wide">
              {content.lang}
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              {content.cat}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words">
            {content.shortcut}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {content.desc}
          </p>
        </Section>

        <div className="divider-line" />

        {/* What it does */}
        <Section delay={60}>
          <h2 id="what-it-does" className="text-2xl sm:text-3xl font-bold">
            What it does
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {content.whatItDoes ||
              `The ${content.shortcut} is used to ${content.desc.toLowerCase()}`}
          </p>
        </Section>

        {/* Syntax / Usage */}
        <Section delay={120}>
          <h2 id="syntax-usage" className="text-2xl sm:text-3xl font-bold">
            Syntax &amp; Usage
          </h2>
          <CodeBlock
            code={content.syntax || content.example.split("\n")[0]}
            language={language}
            label={`${content.lang}.snippet`}
          />
        </Section>

        {/* Code Example */}
        <Section delay={180}>
          <h2 id="example" className="text-2xl sm:text-3xl font-bold">
            Example
          </h2>
          <CodeBlock
            code={content.example}
            language={language}
            label={`example.${content.lang === "js" ? "js" : content.lang === "css" ? "css" : "html"}`}
            copyable
          />
        </Section>

        {/* Live Preview */}
        <Section delay={210}>
          <h2 id="live-preview" className="text-2xl sm:text-3xl font-bold">
            Live Preview
          </h2>
          <LivePreview lang={content.lang} example={content.example} />
        </Section>

        {/* Real-world Use Case */}
        <Section delay={240}>
          <h2 id="real-world-use-case" className="text-2xl sm:text-3xl font-bold">
            Real-world Use Case
          </h2>
          <div className="p-5 sm:p-6 rounded-xl bg-secondary/50 border border-border">
            <p className="text-base sm:text-lg leading-relaxed">
              {content.useCase ||
                `In a real-world application, you would use ${content.shortcut} when you need to implement ${content.desc.toLowerCase()} This is particularly useful in modern web development for creating responsive and accessible user interfaces.`}
            </p>
          </div>
        </Section>

        {/* Step-by-step Guide */}
        {content.guide && content.guide.length > 0 && (
          <>
            <div className="divider-line" />
            <Section delay={100}>
              <h2 id="step-by-step-guide" className="text-2xl sm:text-3xl font-bold">
                Step-by-Step Guide
              </h2>
              <ol className="space-y-3 sm:space-y-4">
                {content.guide.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 sm:gap-4 p-4 rounded-xl border border-border bg-secondary/30 transition-all duration-300 hover:border-accent/40 hover:bg-secondary/60 hover:shadow-sm animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                    style={{ animationDelay: `${150 + i * 70}ms` }}
                  >
                    <span className="flex-none flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              {content.guideNote && (
                <div className="p-4 rounded-xl border border-accent/30 bg-accent/10 text-sm leading-relaxed">
                  <span className="font-semibold">Note: </span>
                  {content.guideNote}
                </div>
              )}
            </Section>
          </>
        )}

        {/* Editor Shortcuts */}
        {content.shortcuts && (
          <Section delay={100}>
            <h2 id="editor-shortcuts" className="text-2xl sm:text-3xl font-bold">
              Editor Shortcuts
            </h2>
            <p className="text-muted-foreground">
              How to trigger or expand{" "}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-secondary">
                {content.shortcut}
              </code>{" "}
              in popular code editors.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl border border-border bg-secondary/30 space-y-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40">
                <h3
                  id="vs-code"
                  className="font-semibold text-sm uppercase tracking-wide text-muted-foreground"
                >
                  VS Code
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  {content.shortcuts.vscode}
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-secondary/30 space-y-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40">
                <h3
                  id="notepad"
                  className="font-semibold text-sm uppercase tracking-wide text-muted-foreground"
                >
                  Notepad++
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  {content.shortcuts.notepadpp}
                </p>
              </div>
            </div>
          </Section>
        )}

        <div className="divider-line" />

        {/* Additional Info */}
        <div
          className="grid gap-6 pt-2 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
          style={{ animationDelay: "80ms" }}
        >
          <div className="space-y-2">
            <h3
              id="additional-info"
              className="font-semibold text-sm uppercase text-muted-foreground"
            >
              Category
            </h3>
            <p className="text-lg">{content.cat}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Language
            </h3>
            <p className="text-lg uppercase">{content.lang}</p>
          </div>
        </div>
      </div>

      <OnThisPageNav />
    </article>
  );
}
