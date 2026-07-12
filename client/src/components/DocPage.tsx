import { Copy, Sparkles, Check, Terminal, AlertTriangle, Info, HelpCircle, FileCode, CheckCircle2, ChevronRight, Chrome, Compass, Link2 } from "lucide-react";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import OnThisPageNav from "@/components/OnThisPageNav";
import { getDifficultyRating } from "@/utils/difficulty";
import LivePreview from "@/components/LivePreview";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "@/contexts/ThemeContext";

interface DocPageProps {
  content: {
    id?: string;
    lang: string;
    cat: string;
    category?: string;
    shortcut: string;
    desc: string;
    example: string;
    syntax?: string;
    whatItDoes?: string;
    useCase?: string;
    relatedIds?: string[];
    validParents?: string[];
    validChildren?: string[];
    browserSupport?: {
      chrome?: boolean;
      firefox?: boolean;
      safari?: boolean;
      edge?: boolean;
    };
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-3 ${className}`}
    >
      {children}
    </motion.div>
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
            {content.browserSupport && (
              <span className="ml-auto flex items-center gap-2">
                {content.browserSupport.chrome && <span title="Chrome Supported"><Chrome size={16} className="text-muted-foreground hover:text-foreground" /></span>}
                {content.browserSupport.firefox && <div className="text-muted-foreground hover:text-foreground font-bold text-xs w-4 text-center" title="Firefox Supported">fx</div>}
                {content.browserSupport.safari && <span title="Safari Supported"><Compass size={16} className="text-muted-foreground hover:text-foreground" /></span>}
                {content.browserSupport.edge && <div className="text-muted-foreground hover:text-foreground font-bold text-xs w-4 text-center" title="Edge Supported">e</div>}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words">
              {content.shortcut}
            </h1>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(content.shortcut.replace(/`/g, ''));
              }}
              className="group flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-3 py-1.5 rounded-md"
              title="Click to copy syntax"
            >
              <Copy size={14} className="group-hover:text-accent" />
              Copy Syntax
            </button>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mt-4">
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
            Live Preview Sandbox
          </h2>
          <LivePreview lang={content.lang} example={content.example} />
        </Section>

        {/* DOM Tree Constraints (Nesting) */}
        {(content.validParents?.length || content.validChildren?.length) ? (
          <Section delay={200}>
            <h2 id="nesting-rules" className="text-2xl sm:text-3xl font-bold text-foreground">
              DOM Nesting Rules
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Valid Parents</h3>
                <div className="flex flex-wrap gap-2">
                  {content.validParents && content.validParents.length > 0 ? content.validParents.map(parent => (
                    <span key={parent} className="px-2.5 py-1 bg-background border border-border rounded-md text-sm font-mono text-foreground hover:border-accent cursor-default transition-colors">
                      {parent}
                    </span>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">Any flow content</span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Valid Children</h3>
                <div className="flex flex-wrap gap-2">
                  {content.validChildren && content.validChildren.length > 0 ? content.validChildren.map(child => (
                    <span key={child} className="px-2.5 py-1 bg-background border border-border rounded-md text-sm font-mono text-foreground hover:border-accent cursor-default transition-colors">
                      {child}
                    </span>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">Any phrasing content</span>
                  )}
                </div>
              </div>
            </div>
          </Section>
        ) : null}

        {/* Related Entries */}
        {content.relatedIds && content.relatedIds.length > 0 && (
          <Section delay={205}>
            <h2 id="related-entries" className="text-2xl sm:text-3xl font-bold text-foreground">
              Related Entries
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.relatedIds.map(id => (
                <a key={id} href={`/?q=${id}`} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
                  {id}
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Links Demo */}
        <Section delay={210}>
          <h2 id="link-behavior-demo" className="text-2xl sm:text-3xl font-bold text-foreground">
            Link Behavior Demo
          </h2>
          <div className="flex gap-4">
            <a href="#header" className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              <Link2 size={16} />
              Internal Anchor Jump
            </a>
            <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
              <Link2 size={16} />
              External New Tab
            </a>
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
          <AiExplanation shortcut={content.shortcut} code={content.example} context={content.desc} />
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

        
        {/* Try It Yourself Section */}
        <Section delay={300}>
          <h2 id="practice" className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Try It Yourself (AI Checked)
          </h2>
          <div className="p-4 rounded-xl border border-border bg-secondary/10 space-y-4">
            <p className="text-sm text-muted-foreground">
              Write code below to practice <strong>{content.shortcut}</strong>. Our AI will evaluate it!
            </p>
            <PracticeArea shortcut={content.shortcut} desc={content.desc} lang={content.lang} />
          </div>
        </Section>

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



function PracticeArea({ shortcut, desc, lang }: { shortcut: string, desc: string, lang: string }) {
  const [code, setCode] = useState("");
  const { theme } = useTheme();
  const dark = theme === "dark";
  const evaluateMutation = trpc.docs.evaluate.useMutation();

  const langKey = (lang || "html").toLowerCase();
  const ext = langKey === "js" ? "js" : langKey === "css" ? "css" : "html";
  const cmExtensions = useMemo(() => {
    if (ext === "js") return [javascript()];
    if (ext === "css") return [css()];
    return [html()];
  }, [ext]);

  const handleCheck = () => {
    if (!code.trim()) return;
    evaluateMutation.mutate({
      userCode: code,
      goal: `Use ${shortcut} to ${desc}`
    });
  };

  return (
    <div className="space-y-4">
      {/* VS Code-style editor */}
      <div
        className="overflow-hidden rounded-xl border shadow-sm ring-1 ring-black/5"
        style={{ borderColor: dark ? "#3a3a3a" : "#e0e0e0" }}
      >
        {/* Title bar with traffic-light dots + filename tab */}
        <div
          className="flex items-center gap-3 px-3 py-2"
          style={{
            backgroundColor: dark ? "#323233" : "#f3f3f3",
            borderBottom: `1px solid ${dark ? "#252526" : "#e0e0e0"}`,
          }}
        >
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div
            className="flex items-center gap-1.5 rounded-t-md px-3 py-1 font-mono text-[11px]"
            style={{
              backgroundColor: dark ? "#1e1e1e" : "#ffffff",
              color: dark ? "#cccccc" : "#333333",
              marginBottom: "-8px",
            }}
          >
            <FileCode size={12} className="text-accent" />
            practice.{ext}
          </div>
        </div>
        {/* Editor surface */}
        <div style={{ backgroundColor: dark ? "#1e1e1e" : "#ffffff" }}>
          <CodeMirror
            value={code}
            onChange={(value) => setCode(value)}
            extensions={cmExtensions}
            theme={dark ? vscodeDark : vscodeLight}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              highlightActiveLine: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
            }}
            placeholder={`Write your ${ext.toUpperCase()} here…`}
            style={{ fontSize: "0.8rem" }}
            minHeight="160px"
            maxHeight="360px"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleCheck}
          disabled={evaluateMutation.isPending || !code.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          <Sparkles size={15} />
          {evaluateMutation.isPending ? "Checking..." : "Check with AI"}
        </button>
      </div>
      {evaluateMutation.data && (
        <div className={`p-4 rounded-md border ${evaluateMutation.data.isCorrect ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {evaluateMutation.data.isCorrect ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {evaluateMutation.data.isCorrect ? "Correct!" : "Needs Work"}
          </div>
          <p className="text-sm">{evaluateMutation.data.feedback}</p>
        </div>
      )}
    </div>
  );
}


function AiExplanation({ shortcut, code, context }: { shortcut: string, code: string, context: string }) {
  const explainMutation = trpc.docs.explain.useMutation();

  if (explainMutation.data) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-accent/30 bg-accent/5">
        <h3 className="font-bold mb-2 flex items-center gap-2 text-accent">
          <Sparkles size={16} /> AI Explanation
        </h3>
        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {explainMutation.data.explanation}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => explainMutation.mutate({ code, context: `Explain how ${shortcut} works.` })}
      disabled={explainMutation.isPending}
      className="mt-4 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50"
    >
      <Sparkles size={14} />
      {explainMutation.isPending ? "Generating Explanation..." : "Ask AI for Detailed Explanation"}
    </button>
  );
}
