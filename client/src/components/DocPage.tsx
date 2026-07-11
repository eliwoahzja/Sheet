import { Copy, Check, Terminal, AlertTriangle, Info, HelpCircle, FileCode, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import OnThisPageNav from "@/components/OnThisPageNav";
import { getDifficultyRating } from "@/utils/difficulty";
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

// Generates dynamic answers for where to put code, step-by-step integration guides, and limitations
interface InfoExplanation {
  whereToPut: { fileType: string; location: string; detail: string };
  guide: { title: string; detail: string }[];
  limitations: string[];
}

function getDynamicDetails(lang: string, cat: string, shortcut: string, desc: string): InfoExplanation {
  const isHtml = lang === "html";
  const isCss = lang === "css";
  const isEmmet = cat.toLowerCase().includes("emmet");
  const cleanShortcut = shortcut.replace(/[<>`]/g, "").trim();

  if (isEmmet) {
    const fileType = "Text Editor Code View (.html, .css, .jsx)";
    const location = "Directly inside your active source file (Not in raw website HTML)";
    const detail = `Emmet is an editor shorthand utility. You type the abbreviation (e.g. \`${cleanShortcut}\`) in your code editor, then expand it. You do NOT upload raw abbreviations into your final website pages.`;

    const guide = [
      {
        title: "1. Type the Abbreviation",
        detail: `Open your code editor (like VS Code) and open an HTML file. Type the abbreviation \`${cleanShortcut}\` exactly as shown. Do not add spaces inside the abbreviation.`
      },
      {
        title: "2. Press the Activation Key (Usually Tab)",
        detail: "Immediately after typing, press the Tab key (or select the suggestion from the editor's autocomplete popup). If you type a space or move your cursor, you must move it back to the end and press Ctrl+Space to trigger."
      },
      {
        title: "3. See it Expand Instantly",
        detail: "The abbreviation is replaced on-the-fly with fully structured, indentation-correct, clean HTML or CSS code blocks. Now you can fill in your content inside the generated tags!"
      }
    ];

    const limitations = [
      "Will NOT expand automatically by just typing the characters. You MUST press the [Tab] key or press Enter on the suggestion pop-up.",
      "Does NOT work in the final browser or production website code. It is exclusively an editor extension to help write code faster.",
      "Spaces are forbidden within the abbreviation. For example, typing 'ul > li' (with spaces) will break expansion in many editors. Always type 'ul>li' without spaces.",
      "If the autocomplete pop-up disappears, you can force it to reappear in VS Code by pressing Ctrl + Space."
    ];

    return { whereToPut: { fileType, location, detail }, guide, limitations };
  }

  if (isHtml) {
    const isRootOrMeta = ["html", "head", "body", "title", "meta", "link", "style", "script"].includes(cleanShortcut.toLowerCase()) || cat.includes("Meta");
    const fileType = "HTML document (.html)";
    const location = isRootOrMeta ? "Inside the <head> tag or at document root" : "Inside the <body> tag container";
    const detail = isRootOrMeta 
      ? `This is a fundamental configuration or metadata tag. It must be declared in the document header (\`<head>\`) or used as the global outer boundary of your HTML file structure.`
      : `This is a visible layout element. Insert this tag inside the body container (\`<body>...</body>\`). It can contain text, formatting, or be nested inside containers like \`<div>\` or \`<section>\`.`;
    
    const guide = [
      {
        title: "Initialize HTML file",
        detail: "Create or open an HTML file (e.g. `index.html`). Type `html:5` and press Tab to populate a clean standard HTML boilerplate if starting fresh."
      },
      {
        title: `Declare the ${shortcut} code`,
        detail: isRootOrMeta 
          ? `Insert the tag within the \`<head>\` structure, assigning essential properties or links.`
          : `Insert the opening tag, input your nested content or text, and complete it with the correct closing tag within the \`<body>\` content flow.`
      },
      {
        title: "Refresh & Verify",
        detail: "Save the document and double-click the file to render and preview it in any web browser."
      }
    ];

    const limitations = [
      isRootOrMeta 
        ? "Not intended for physical text or visual element lay-outs. Content inside these tags will not be rendered visually."
        : `Must be nested properly within the \`<body>\`. Do not add closing tags to empty/void tags (e.g. \`<img>\`, \`<input>\`), and ensure containers have exact closing pairs.`,
      "Relies heavily on browser defaults; visual styling must be customized using CSS for design consistency."
    ];

    return { whereToPut: { fileType, location, detail }, guide, limitations };
  }

  if (isCss) {
    const fileType = "CSS stylesheet (.css) or HTML <style> tag";
    const location = "Inside a CSS rule block { ... }";
    const detail = `Add this attribute directly inside a selector block targeting your components (e.g. \`.btn { ... }\` or \`#header { ... }\`). Ensure the stylesheet is linked inside your HTML header via \`<link>\`.`;

    const guide = [
      {
        title: "Define your CSS Selector",
        detail: "In your stylesheet, write a selector pointing to your element (such as `.card-container` or `button`)."
      },
      {
        title: "Write style declarations",
        detail: `Inside the selector's braces \`{ ... }\`, write \`${cleanShortcut}\` followed by a valid size, color, or keyword parameter.`
      },
      {
        title: "Validate stylesheet binding",
        detail: "Make sure your HTML includes a link to this CSS file, save, and reload. Use browser inspection (F12) to ensure the properties aren't overwritten."
      }
    ];

    const limitations = [
      "Can be easily overridden by rules with higher CSS specificity or declarations marked with !important.",
      "Requires precise, valid unit designations (e.g., px, rem, %, s, deg) - omitting units will cause the rule to be ignored completely.",
      "Some layout properties might not be supported equally on ancient browsers without layout vendor prefixes."
    ];

    return { whereToPut: { fileType, location, detail }, guide, limitations };
  }

  // JS
  const fileType = "JavaScript file (.js) or HTML <script> tag";
  const location = "Within execution context / script scope";
  const detail = `Write this logic inside a standard script file (e.g. \`main.js\`) or inside an HTML \`<script>\` tag. Load it at the end of your HTML \`<body>\` or with the \`defer\` attribute to prevent blockages.`;

  const guide = [
    {
      title: "Set execution trigger",
      detail: "Select where the snippet should run—instantly upon page initialization, inside an event handler, or when a function is called."
    },
    {
      title: "Call the function / property",
      detail: `Incorporate \`${cleanShortcut}\` into your code. Assign the returned outputs to variables (e.g. \`const output = ...\`) to read or display later.`
    },
    {
      title: "Inspect in Console",
      detail: "Run the page, open your browser's Developer Tools (F12), click on the 'Console' tab, and inspect console logs or values."
    }
  ];

  const limitations = [
    "Executing DOM manipulation methods before the elements are mounted will return null or throw a TypeError.",
    "Will trigger a ReferenceError if executed in backend-only scopes (like Node.js) where client-side browser bindings (such as window or document) are unavailable.",
    "Requires proper scoping and error handling to avoid breaking subsequent execution scripts if an error occurs."
  ];

  return { whereToPut: { fileType, location, detail }, guide, limitations };
}

export default function DocPage({ content }: DocPageProps) {
  const language = prismLanguage(content.lang);

  // Retrieve smart custom dynamic guides, placements, and constraints
  const details = useMemo(() => {
    return getDynamicDetails(content.lang, content.cat, content.shortcut, content.desc);
  }, [content.lang, content.cat, content.shortcut, content.desc]);

  const rating = useMemo(() => {
    return getDifficultyRating(content);
  }, [content]);

  const steps = content.guide && content.guide.length > 0 ? content.guide : details.guide;

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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${rating.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                rating.label === "Easy"
                  ? "bg-emerald-500"
                  : rating.label === "Medium"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`} />
              <span>{rating.label} Level</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words">
            {content.shortcut}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {content.desc}
          </p>
        </Section>

        {/* Where to Put It (Placement Instructions) */}
        <Section delay={40}>
          <h2 id="where-to-put" className="text-2xl sm:text-3xl font-bold text-foreground">
            Where to put it
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl border border-border bg-secondary/20 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Document File</span>
                <p className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                  <FileCode size={16} className="text-accent" />
                  {details.whereToPut.fileType}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-secondary/20 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recommended Scope / Target</span>
                <p className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                  <Info size={16} className="text-accent" />
                  {details.whereToPut.location}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-sm text-foreground/90 leading-relaxed flex gap-2.5">
            <HelpCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold">Contextual Guideline: </span>
              {details.whereToPut.detail}
            </p>
          </div>
        </Section>

        <div className="divider-line" />

        {/* What it does */}
        <Section delay={60}>
          <h2 id="what-it-does" className="text-2xl sm:text-3xl font-bold text-foreground">
            What it does
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
            {content.whatItDoes ||
              `The ${content.shortcut} is used to ${content.desc.toLowerCase()}`}
          </p>
        </Section>

        {/* Syntax / Usage */}
        <Section delay={140}>
          <h2 id="syntax-usage" className="text-2xl sm:text-3xl font-bold text-foreground">
            Syntax &amp; Usage
          </h2>
          <CodeBlock
            code={content.syntax || content.example.split("\n")[0]}
            language={language}
            label={`${content.lang}.snippet`}
          />
        </Section>

        {/* Static Reference Code Example */}
        <Section delay={180}>
          <h2 id="example" className="text-2xl sm:text-3xl font-bold text-foreground">
            Static Example Reference
          </h2>
          <CodeBlock
            code={content.example}
            language={language}
            label={`example.${content.lang === "js" ? "js" : content.lang === "css" ? "css" : "html"}`}
            copyable
          />
        </Section>

        {/* Live Preview */}
        <Section delay={190}>
          <h2 id="live-preview" className="text-2xl sm:text-3xl font-bold text-foreground">
            Live Preview
          </h2>
          <LivePreview lang={content.lang} example={content.example} />
        </Section>

        {/* Real-world Use Case */}
        <Section delay={200}>
          <h2 id="real-world-use-case" className="text-2xl sm:text-3xl font-bold text-foreground">
            Real-world Use Case
          </h2>
          <div className="p-5 sm:p-6 rounded-xl bg-secondary/50 border border-border">
            <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
              {content.useCase ||
                `In a real-world application, you would use ${content.shortcut} when you need to implement ${content.desc.toLowerCase()} This is particularly useful in modern web development for creating responsive and accessible user interfaces.`}
            </p>
          </div>
        </Section>

        {/* Step-by-step Guide */}
        <Section delay={220}>
          <h2 id="step-by-step-guide" className="text-2xl sm:text-3xl font-bold text-foreground">
            Step-by-Step Integration Guide
          </h2>
          <ol className="space-y-3 sm:space-y-4">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 sm:gap-4 p-4 rounded-xl border border-border bg-secondary/30 transition-all duration-300 hover:border-accent/40 hover:bg-secondary/60 hover:shadow-sm animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${240 + i * 70}ms` }}
              >
                <span className="flex-none flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {content.guideNote && (
            <div className="p-4 rounded-xl border border-accent/30 bg-accent/10 text-sm leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">Note: </span>
              {content.guideNote}
            </div>
          )}
        </Section>

        {/* Common Limitations & Pitfalls */}
        <Section delay={260}>
          <h2 id="limitations-pitfalls" className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-foreground">
            <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
            Limitations &amp; Pitfalls
          </h2>
          <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3.5">
            {details.limitations.map((lim, idx) => (
              <div key={idx} className="flex gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 className="text-amber-500/70 flex-shrink-0 mt-0.5" size={16} />
                <p>{lim}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Editor Shortcuts */}
        {content.shortcuts && (
          <Section delay={280}>
            <h2 id="editor-shortcuts" className="text-2xl sm:text-3xl font-bold text-foreground">
              Editor Shortcuts
            </h2>
            <p className="text-muted-foreground text-sm">
              How to trigger or expand{" "}
              <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-secondary">
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
                <p className="text-sm leading-relaxed text-foreground/80">
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
                <p className="text-sm leading-relaxed text-foreground/80">
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
          style={{ animationDelay: "300ms" }}
        >
          <div className="space-y-2">
            <h3
              id="additional-info"
              className="font-semibold text-sm uppercase text-muted-foreground"
            >
              Category
            </h3>
            <p className="text-lg text-foreground">{content.cat}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Language
            </h3>
            <p className="text-lg uppercase text-foreground">{content.lang}</p>
          </div>
        </div>
      </div>

      <OnThisPageNav />
    </article>
  );
}

