import { Copy, Check, Terminal, Play, AlertTriangle, Info, HelpCircle, RefreshCw, FileCode, CheckCircle2, Sparkles, Keyboard, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import OnThisPageNav from "@/components/OnThisPageNav";

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

// Simple, robust Emmet expansion engine for educational simulation
function parseEmmet(abbrev: string): string {
  const s = abbrev.trim();
  if (s === "html:5") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
  }

  // Helper to parse a single element with classes, IDs and curly brace text contents.
  function parseSingleNode(token: string, index: number = 1): { tag: string; attrs: string[]; content: string; isSelfClosing: boolean } {
    let cleanToken = token.trim();
    
    // Extract text content inside curly braces: e.g. {Item $}
    let content = "";
    const textMatch = cleanToken.match(/\{([^}]+)\}/);
    if (textMatch) {
      content = textMatch[1].replace(/\$/g, String(index));
      cleanToken = cleanToken.replace(/\{[^}]+\}/, "");
    }

    // Default tag is div if starting with . or #
    let tag = "div";
    let id = "";
    const classes: string[] = [];

    const parts = cleanToken.split(/(?=[.#])/);
    if (parts[0] && !parts[0].startsWith(".") && !parts[0].startsWith("#")) {
      tag = parts[0];
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith(".")) {
        classes.push(part.slice(1));
      } else if (part.startsWith("#")) {
        id = part.slice(1);
      }
    }

    const attrs: string[] = [];
    if (id) attrs.push(`id="${id}"`);
    if (classes.length > 0) attrs.push(`class="${classes.join(" ")}"`);

    // Add smart attribute defaults for popular Emmet elements
    if (tag === "a") attrs.push('href="#"');
    if (tag === "img") attrs.push('src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400" alt="Placeholder image" class="rounded-lg shadow"');
    if (tag === "input") attrs.push('type="text" placeholder="Enter text..." class="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-background rounded-lg text-sm text-foreground"');
    if (tag === "button") attrs.push('class="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold transition-all hover:opacity-90 hover:shadow-sm"');
    if (tag === "form") attrs.push('action="" class="space-y-3 p-4 bg-secondary/35 rounded-xl border border-border"');

    const VOID_TAGS = new Set(["img", "input", "br", "hr", "meta", "link"]);
    const isSelfClosing = VOID_TAGS.has(tag.toLowerCase());

    return { tag, attrs, content, isSelfClosing };
  }

  // Recursive expansion builder
  function expandNode(expr: string, countIndex: number = 1): string {
    const cleanExpr = expr.trim();
    if (!cleanExpr) return "";

    // Sibling splitting (brace-aware split to avoid splitting inside {})
    const siblings: string[] = [];
    let current = "";
    let braceCount = 0;
    for (let i = 0; i < cleanExpr.length; i++) {
      const char = cleanExpr[i];
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
      if (char === "+" && braceCount === 0) {
        siblings.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    siblings.push(current);

    if (siblings.length > 1) {
      return siblings.map(sibling => expandNode(sibling, countIndex)).join("\n");
    }

    // Child nesting split '>'
    const childIndex = cleanExpr.indexOf(">");
    if (childIndex !== -1) {
      const parentExpr = cleanExpr.slice(0, childIndex).trim();
      const childExpr = cleanExpr.slice(childIndex + 1).trim();

      // Parent multiplication: e.g. li*3>a
      const multMatch = parentExpr.match(/^(.*?)\*(\d+)$/);
      if (multMatch) {
        const base = multMatch[1];
        const count = parseInt(multMatch[2], 10);
        let result = "";
        for (let idx = 1; idx <= count; idx++) {
          const { tag, attrs, content, isSelfClosing } = parseSingleNode(base, idx);
          const childExpanded = expandNode(childExpr, idx);
          const formattedChild = childExpanded.split("\n").map(line => "  " + line).join("\n");
          
          if (isSelfClosing) {
            result += "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + " />\n";
          } else {
            const inner = content ? (formattedChild ? content + "\n" + formattedChild : content) : formattedChild;
            result += "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + ">\n" + inner + "\n</" + tag + ">\n";
          }
        }
        return result.trim();
      } else {
        const { tag, attrs, content, isSelfClosing } = parseSingleNode(parentExpr, countIndex);
        const childExpanded = expandNode(childExpr, countIndex);
        const formattedChild = childExpanded.split("\n").map(line => "  " + line).join("\n");

        if (isSelfClosing) {
          return "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + " />";
        } else {
          const inner = content ? (formattedChild ? content + "\n" + formattedChild : content) : formattedChild;
          return "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + ">\n" + inner + "\n</" + tag + ">";
        }
      }
    }

    // Multiplication on single node: e.g. li*5
    const multMatch = cleanExpr.match(/^(.*?)\*(\d+)$/);
    if (multMatch) {
      const base = multMatch[1];
      const count = parseInt(multMatch[2], 10);
      let result = "";
      for (let idx = 1; idx <= count; idx++) {
        const { tag, attrs, content, isSelfClosing } = parseSingleNode(base, idx);
        if (isSelfClosing) {
          result += "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + " />\n";
        } else {
          result += "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + ">" + content + "</" + tag + ">\n";
        }
      }
      return result.trim();
    }

    // Lorem ipsum generator: e.g. lorem20
    if (cleanExpr.toLowerCase().startsWith("lorem")) {
      const countMatch = cleanExpr.match(/^lorem(\d+)$/i);
      const wordCount = countMatch ? parseInt(countMatch[1], 10) : 10;
      const loremWords = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
      let sentence = "";
      for (let i = 0; i < wordCount; i++) {
        sentence += loremWords[i % loremWords.length] + " ";
      }
      return sentence.trim() + ".";
    }

    // Normal tag
    const { tag, attrs, content, isSelfClosing } = parseSingleNode(cleanExpr, countIndex);
    if (isSelfClosing) {
      return "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + " />";
    } else {
      return "<" + tag + (attrs.length ? " " + attrs.join(" ") : "") + ">" + content + "</" + tag + ">";
    }
  }

  try {
    return expandNode(s);
  } catch (e) {
    return `<!-- Dynamic Emmet Parser: Syntax issue in "${abbrev}" -->`;
  }
}

// Live Sandbox / Interactive Code Runner / Emmet Simulator
function InteractiveSandbox({
  lang,
  initialCode,
  shortcut,
  cat,
}: {
  lang: string;
  initialCode: string;
  shortcut: string;
  cat: string;
}) {
  const isEmmet = cat.toLowerCase().includes("emmet");

  // State for normal editor
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<string[]>([]);

  // State for Emmet Simulator
  const [emmetAbbrev, setEmmetAbbrev] = useState(shortcut);
  const [emmetExpanded, setEmmetExpanded] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(true);

  // Update editor state when selecting a different element/doc item
  useEffect(() => {
    setCode(initialCode);
    setLogs([]);
    setEmmetAbbrev(shortcut);
    setEmmetExpanded("");
    setIsExpanded(false);
    setSuggestionOpen(true);
  }, [initialCode, shortcut]);

  const runJSCode = () => {
    if (lang !== "js") return;

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(
          args
            .map((arg) => {
              if (typeof arg === "object") {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(" ")
        );
      },
      error: (...args: any[]) => {
        capturedLogs.push("🔴 Error: " + args.join(" "));
      },
      warn: (...args: any[]) => {
        capturedLogs.push("⚠️ Warning: " + args.join(" "));
      },
    };

    try {
      // Create safe scoped container for basic JS run execution
      const fn = new Function(
        "console",
        `
        try {
          ${code}
        } catch (err) {
          console.error(err.message);
        }
        `
      );
      fn(customConsole);
    } catch (err: any) {
      capturedLogs.push("🔴 Syntax Error: " + err.message);
    }

    if (capturedLogs.length === 0) {
      capturedLogs.push("// Code executed successfully with no console output.");
    }
    setLogs(capturedLogs);
  };

  // Run JS code automatically when code or method changes
  useEffect(() => {
    if (lang === "js") {
      runJSCode();
    }
  }, [code, lang]);

  const resetCode = () => {
    if (isEmmet) {
      setEmmetAbbrev(shortcut);
      setEmmetExpanded("");
      setIsExpanded(false);
      setSuggestionOpen(true);
    } else {
      setCode(initialCode);
      setLogs([]);
    }
  };

  const triggerEmmetExpansion = () => {
    const result = parseEmmet(emmetAbbrev);
    setEmmetExpanded(result);
    setIsExpanded(true);
    setSuggestionOpen(false);
    
    // Add a fun splash expansion animation
    setAnimationClass("scale-95 opacity-50");
    setTimeout(() => {
      setAnimationClass("scale-100 opacity-100 transition-all duration-300 ease-out");
    }, 80);
  };

  const handleEmmetKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      triggerEmmetExpansion();
    }
  };

  const iframeSrcDoc = useMemo(() => {
    if (isEmmet) {
      const activeCode = isExpanded ? emmetExpanded : "";
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                padding: 1.25rem;
                margin: 0;
                background-color: transparent;
              }
            </style>
          </head>
          <body class="text-slate-800 dark:text-slate-100">
            ${activeCode || `<div class="flex flex-col items-center justify-center h-[200px] text-slate-400 text-sm font-medium italic gap-2"><svg class="w-8 h-8 opacity-40 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Type abbreviation left and press [Tab] key or click Expand...</div>`}
          </body>
        </html>
      `;
    }

    if (lang === "html") {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                padding: 1.25rem;
                margin: 0;
                background-color: transparent;
              }
            </style>
          </head>
          <body class="text-slate-800 dark:text-slate-100">
            ${code}
          </body>
        </html>
      `;
    }
    if (lang === "css") {
      const styleContent = code.includes("{") ? code : `.preview-box { ${code} }`;
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: transparent;
                font-family: system-ui, -apple-system, sans-serif;
                overflow: hidden;
              }
              .preview-box {
                width: 140px;
                height: 140px;
                background: #3b82f6;
                border-radius: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                font-size: 0.875rem;
                box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
                transition: all 0.3s ease;
                text-align: center;
                padding: 10px;
              }
              ${styleContent}
            </style>
          </head>
          <body>
            <div class="preview-box">
              Styled Box
            </div>
          </body>
        </html>
      `;
    }
    return "";
  }, [code, lang, isEmmet, isExpanded, emmetExpanded]);

  if (isEmmet) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col my-6">
        {/* Simulator Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold tracking-wider">Editor Mode</span>
              Live Emmet Simulator
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetCode}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/15 transition-all"
            >
              <RefreshCw size={12} />
              Reset Abbreviation
            </button>
          </div>
        </div>

        {/* Outer Split Pane Container */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[350px]">
          {/* Left Panel: Simulated Editor Input */}
          <div className="flex flex-col h-full bg-slate-950 text-white p-5 relative overflow-hidden">
            {/* Window controls decoration */}
            <div className="flex items-center gap-1.5 mb-4 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-mono ml-2">editor.html — Emmet Workspace</span>
            </div>

            {/* Instruction Card */}
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-400" />
                <span>⚡ How to expand this shortcut:</span>
              </p>
              Emmet acts as a text speed-up inside code editors. Type it inside your editor file, and press the <span className="font-bold text-white px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 select-all font-mono">Tab</span> key to expand it. Try it in the box below!
            </div>

            {/* Input Arena */}
            <div className="space-y-3 flex-1 flex flex-col justify-center relative z-10">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Type Abbreviation Below:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={emmetAbbrev}
                    onChange={(e) => {
                      setEmmetAbbrev(e.target.value);
                      setIsExpanded(false);
                      setSuggestionOpen(true);
                    }}
                    onKeyDown={handleEmmetKeyDown}
                    className="w-full bg-black/60 border border-slate-700 rounded-lg px-3.5 py-2.5 font-mono text-sm font-semibold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="e.g., ul>li*4"
                  />
                  
                  {/* Autocomplete popup suggestion style */}
                  {suggestionOpen && emmetAbbrev.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs z-50 animate-in fade-in slide-in-from-top-1">
                      <div 
                        onClick={triggerEmmetExpansion}
                        className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-800 cursor-pointer text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase font-bold font-mono">Emmet</span>
                          <span className="font-mono text-emerald-400 font-semibold">{emmetAbbrev}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] flex items-center gap-1.5">
                          Press <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-white text-[10px] font-mono">Tab ↹</kbd> or Click to Expand
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <button
                  onClick={triggerEmmetExpansion}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-accent-foreground font-bold text-xs transition-all hover:opacity-95 hover:shadow active:scale-98 cursor-pointer"
                >
                  <Zap size={14} />
                  Expand Shortcut [Tab]
                </button>
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-700 hover:bg-white/5 font-semibold text-xs transition-all cursor-pointer text-slate-300"
                  >
                    <RefreshCw size={12} />
                    Revert to Shortcut
                  </button>
                )}
              </div>
            </div>

            {/* Render Raw Code Output Block once expanded */}
            {isExpanded && (
              <div className={`mt-5 flex-1 flex flex-col min-h-[140px] animate-in fade-in duration-300 ${animationClass}`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Generated Expanded HTML Output:</span>
                <div className="flex-1 bg-black/40 border border-slate-800 rounded-lg p-3 overflow-auto font-mono text-xs leading-relaxed max-h-[140px] text-sky-300 select-all">
                  <pre className="whitespace-pre-wrap">{emmetExpanded}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Render View */}
          <div className="flex flex-col h-full overflow-hidden bg-slate-900">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/25">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Browser Render Preview</span>
              {isExpanded && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-pulse">
                  <CheckCircle2 size={12} /> Expanded Code Active!
                </span>
              )}
            </div>

            <div className="flex-1 p-4 bg-white/5 dark:bg-black/15">
              <iframe
                srcDoc={iframeSrcDoc}
                title="Visual Sandbox Output"
                sandbox="allow-scripts"
                className="w-full h-full min-h-[260px] border-0 bg-white dark:bg-slate-950 rounded-xl shadow-inner overflow-auto transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for non-Emmet items (HTML / CSS / JS)
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col my-6">
      {/* Tab/Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-semibold text-sm text-foreground">Interactive Practice Sandbox</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/15 transition-all"
          >
            <RefreshCw size={12} />
            Reset Example
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border h-[320px]">
        {/* Code Input */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-muted/15">
            <span className="text-xs font-mono text-muted-foreground">Modify and edit below</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/70 px-1.5 py-0.5 rounded bg-secondary">{lang}</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-xs leading-relaxed bg-black/5 dark:bg-black/25 focus:outline-none resize-none border-0 font-medium text-foreground"
            style={{ fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, monospace" }}
          />
        </div>

        {/* Live Preview/Console output */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-950 text-white">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/10 bg-black/45">
            <span className="text-xs font-semibold text-white/80">
              {lang === "js" ? "Simulated Developer Console" : "Live Rendered Output"}
            </span>
            {lang === "js" && (
              <button
                onClick={runJSCode}
                className="flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-2.5 py-0.5 text-xs font-bold transition-all shadow-sm"
              >
                <Play size={10} />
                Run Snippet
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 flex flex-col">
            {lang === "js" ? (
              <div className="font-mono text-xs space-y-1 text-emerald-400 select-text leading-relaxed">
                {logs.map((log, i) => (
                  <pre key={i} className="whitespace-pre-wrap break-all">
                    {log}
                  </pre>
                ))}
              </div>
            ) : (
              <iframe
                srcDoc={iframeSrcDoc}
                title="Visual Sandbox Output"
                sandbox="allow-scripts"
                className="w-full h-full border-0 bg-white dark:bg-slate-900 rounded-lg shadow-inner overflow-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocPage({ content }: DocPageProps) {
  const language = prismLanguage(content.lang);

  // Retrieve smart custom dynamic guides, placements, and constraints
  const details = useMemo(() => {
    return getDynamicDetails(content.lang, content.cat, content.shortcut, content.desc);
  }, [content.lang, content.cat, content.shortcut, content.desc]);

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

        {/* Interactive Live Sandbox (Crucial fix for output testing) */}
        <Section delay={100}>
          <h2 id="practice-sandbox" className="text-2xl sm:text-3xl font-bold text-foreground">
            Live Preview &amp; Sandbox Tests
          </h2>
          <p className="text-sm text-muted-foreground">
            Test custom values and run sample inputs in real-time below:
          </p>
          <InteractiveSandbox
            lang={content.lang}
            initialCode={content.example}
            shortcut={content.shortcut}
            cat={content.cat}
          />
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

