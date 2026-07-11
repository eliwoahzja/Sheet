import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Code2,
  Palette,
  Braces,
  ArrowRight,
  Sparkles,
  MousePointerClick,
  SunMoon,
  Copy,
  History,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import DocsLayout from "@/components/DocsLayout";
import Sidebar from "@/components/Sidebar";
import DocPage from "@/components/DocPage";
import rawStructuredContent from "@/data/structured_content.json";
import { getDifficultyRating } from "@/utils/difficulty";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"
]);

// Preprocess and clean the structured content dynamically to format shortcuts,
// map categories, and ensure missing standard elements like <head> are correctly displayed
const structuredContent = (() => {
  const processed = rawStructuredContent.map((item) => {
    if (item.lang === "html" && item.cat === "Elements") {
      let shortcut = item.shortcut;
      
      // Clean up backticked shortcuts
      if (shortcut.startsWith("`") && shortcut.endsWith("`")) {
        const tag = shortcut.slice(1, -1);
        if (tag === "html:5") {
          shortcut = "html:5";
        } else if (tag === "script:src") {
          shortcut = '<script src="...">';
        } else {
          shortcut = `<${tag}>`;
        }
      }
      
      // Extract the tag name to determine if it's void/self-closing (empty)
      const cleanTag = shortcut.replace(/[<>`]/g, "").split(/[ +>:]/)[0];
      const isSelfClosing = VOID_TAGS.has(cleanTag.toLowerCase());
      
      return {
        ...item,
        shortcut,
        cat: isSelfClosing ? "Elements (Self-Closing / Empty)" : "Elements (Container)"
      };
    }
    return item;
  });

  // Filter out duplicates that might occur after mapping backticks
  const seenKeys = new Set<string>();
  return processed.filter((item) => {
    const key = `${item.lang}-${item.cat}-${item.shortcut}`;
    if (seenKeys.has(key)) {
      return false;
    }
    seenKeys.add(key);
    return true;
  });
})();

const SPECIAL_SHORTCUT_MAP: Record<string, string> = {
  "&": "ampersand",
  "<": "less-than",
  ">": "greater-than",
  "=== / !==": "strict-equality",
  "&&  /  ||": "logical-operators",
  "?? nullish coalescing": "nullish-coalescing",
  "&copy;": "copy",
  "&nbsp;": "nbsp",
  "&rarr;": "rarr",
};

export function getCategorySlug(cat: string): string {
  return cat.toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, "") // remove parentheticals
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getShortcutSlug(shortcut: string): string {
  let s = shortcut.replace(/`/g, "").trim();
  if (SPECIAL_SHORTCUT_MAP[s]) return SPECIAL_SHORTCUT_MAP[s];
  return s.toLowerCase()
    .replace(/[<>` &;()]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LANG_META: Record<
  string,
  { label: string; icon: typeof Code2; blurb: string; accent: string; ring: string }
> = {
  html: {
    label: "HTML",
    icon: Code2,
    blurb: "Elements, attributes, entities & Emmet",
    accent: "text-[#e34f26]",
    ring: "group-hover:border-[#e34f26]/50",
  },
  css: {
    label: "CSS",
    icon: Palette,
    blurb: "Properties, selectors, tricks & layout",
    accent: "text-[#2965f1]",
    ring: "group-hover:border-[#2965f1]/50",
  },
  js: {
    label: "JavaScript",
    icon: Braces,
    blurb: "Methods, ES6+, DOM & control flow",
    accent: "text-[#f7df1e]",
    ring: "group-hover:border-[#d9c400]/50",
  },
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"html" | "css" | "js">("html");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"alphabetical" | "easiest" | "hardest">("alphabetical");

  useEffect(() => {
    const pathParts = location.split("/").filter(Boolean);
    if (pathParts.length === 3) {
      const [lang, catSlug, shortcutSlug] = pathParts;
      const found = structuredContent.find(
        (item) =>
          item.lang === lang &&
          getCategorySlug(item.cat) === catSlug &&
          getShortcutSlug(item.shortcut) === shortcutSlug
      );
      if (found) {
        setSelectedItem(`${found.lang}-${found.cat}-${found.shortcut}`);
        setCurrentLang(lang as "html" | "css" | "js");
      } else {
        setSelectedItem(null);
      }
    } else if (pathParts.length === 1) {
      setCurrentLang(pathParts[0] as "html" | "css" | "js");
      setSelectedItem(null);
    } else {
      setSelectedItem(null);
      setCurrentLang("html");
    }
  }, [location]);

  const { theme, toggleTheme } = useTheme();

  const langContent = useMemo(
    () => structuredContent.filter((item) => item.lang === currentLang),
    [currentLang]
  );

  const groupedContent = useMemo(() => {
    const groups: Record<string, typeof structuredContent> = {};
    langContent.forEach((item) => {
      if (!groups[item.cat]) groups[item.cat] = [];
      groups[item.cat].push(item);
    });
    // Sort shortcuts inside each category according to user select option
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => {
        if (sortBy === "alphabetical") {
          return a.shortcut.localeCompare(b.shortcut, undefined, { sensitivity: "base" });
        } else {
          const ratingA = getDifficultyRating(a);
          const ratingB = getDifficultyRating(b);
          if (sortBy === "easiest") {
            return ratingA.score !== ratingB.score
              ? ratingA.score - ratingB.score
              : a.shortcut.localeCompare(b.shortcut, undefined, { sensitivity: "base" });
          } else {
            return ratingA.score !== ratingB.score
              ? ratingB.score - ratingA.score
              : a.shortcut.localeCompare(b.shortcut, undefined, { sensitivity: "base" });
          }
        }
      });
    });
    return groups;
  }, [langContent, sortBy]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return structuredContent.filter(
      (item: any) =>
        item.shortcut.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedContent = useMemo(() => {
    if (!selectedItem) return null;
    return structuredContent.find(
      (item: any) => `${item.lang}-${item.cat}-${item.shortcut}` === selectedItem
    );
  }, [selectedItem]);

  return (
    <DocsLayout
      sidebar={
        <Sidebar
          currentLang={currentLang}
          onLangChange={(lang: "html" | "css" | "js") => {
            setLocation(`/${lang}`);
            setSidebarOpen(false);
          }}
          groupedContent={groupedContent}
          selectedItem={selectedItem}
          onSelectItem={(id: string) => {
            const found = structuredContent.find(
              (item: any) => `${item.lang}-${item.cat}-${item.shortcut}` === id
            );
            if (found) {
              const catSlug = getCategorySlug(found.cat);
              const shortcutSlug = getShortcutSlug(found.shortcut);
              setLocation(`/${found.lang}/${catSlug}/${shortcutSlug}`);
            }
            setSidebarOpen(false);
          }}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      }
      header={
        <header className="z-40 flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex-shrink-0 rounded-lg p-2 text-foreground transition-colors hover:bg-accent/10 active:scale-95"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={() => setLocation("/")}
              className="flex flex-shrink-0 items-center gap-2"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-serif text-lg font-bold">
                E
              </span>
              <h1 className="hidden text-base font-bold tracking-tight min-[400px]:block sm:text-xl">
                Eli Shh Docs
              </h1>
            </button>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background/70 py-2 pl-10 pr-3 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={toggleTheme}
                className="flex-shrink-0 rounded-lg p-2 text-foreground transition-colors hover:bg-accent/10 active:scale-95"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>
      }
    >
      {selectedContent ? (
        <DocPage content={selectedContent} />
      ) : searchQuery.trim() && searchResults.length === 0 ? (
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div>
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold">No Results Found</h2>
            <p className="text-lg text-muted-foreground">
              No documentation found for <strong>"{searchQuery}"</strong>. Try a
              different search term or browse by language.
            </p>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:opacity-90 active:scale-95"
          >
            Clear Search
          </button>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="mb-1 text-2xl sm:text-3xl font-bold">Search Results</h2>
            <p className="text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
              <strong>"{searchQuery}"</strong>
            </p>
          </div>
          <div className="grid gap-3">
            {searchResults.slice(0, 60).map((item: any, i: number) => (
              <button
                key={`${item.lang}-${item.cat}-${item.shortcut}`}
                onClick={() =>
                  setLocation(
                    `/${item.lang}/${item.cat}/${encodeURIComponent(item.shortcut)}`
                  )
                }
                className="group text-left rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold uppercase text-accent-foreground">
                    {item.lang}
                  </span>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {item.cat}
                  </span>
                </div>
                <code className="mb-1 block font-mono text-base sm:text-lg font-semibold break-words">
                  {item.shortcut}
                </code>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-14">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/60 via-background to-background p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles size={13} className="text-accent" />
                {structuredContent.length}+ curated references
              </span>
              <h2 className="mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl text-balance">
                Welcome to Eli Shh Docs
              </h2>
              <p className="text-lg text-muted-foreground sm:text-xl">
                A comprehensive, fast reference for HTML, CSS, and JavaScript —
                complete with Emmet shortcuts and per-editor tips. Explore the
                sidebar or search to get started.
              </p>
            </div>
          </div>

          {/* Language cards */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {(["html", "css", "js"] as const).map((lang, i) => {
              const meta = LANG_META[lang];
              const Icon = meta.icon;
              const count = structuredContent.filter(
                (item: any) => item.lang === lang
              ).length;
              return (
                <button
                  key={lang}
                  onClick={() => setLocation(`/${lang}`)}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${meta.ring} animate-in fade-in slide-in-from-bottom-4 fill-mode-both`}
                  style={{ animationDelay: `${100 + i * 90}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform duration-300 group-hover:scale-110">
                      <Icon size={24} className={meta.accent} />
                    </span>
                    <ArrowRight
                      size={20}
                      className="text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                    />
                  </div>
                  <h3 className="mb-1 text-2xl font-bold">{meta.label}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{meta.blurb}</p>
                  <span className="text-sm font-semibold text-foreground">
                    {count} references
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bento-style Grid: Quick Tips & Changelogs */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Quick Tips Column (5/12 cols) */}
            <div className="space-y-5 lg:col-span-5">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-accent" />
                <span>Quick Tips</span>
              </h3>
              <div className="grid gap-4">
                {[
                  {
                    icon: Search,
                    text: "Use the search bar to find any HTML element, CSS property, or JS method across all languages instantly.",
                  },
                  {
                    icon: MousePointerClick,
                    text: "Click any item in the sidebar to open detailed docs with syntax, examples, and editor shortcuts.",
                  },
                  {
                    icon: SunMoon,
                    text: "Toggle light/dark mode from the top-right — your preference is saved automatically.",
                  },
                  {
                    icon: Copy,
                    text: "Every code example has a one-click copy button so you can grab snippets fast.",
                  },
                ].map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/40 hover:shadow-sm animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                      style={{ animationDelay: `${150 + i * 70}ms` }}
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon size={18} />
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {tip.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Changelog Column (7/12 cols) */}
            <div className="space-y-5 lg:col-span-7">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <History size={20} className="text-accent" />
                <span>What's New & Changelogs</span>
              </h3>
              
              <div className="rounded-2xl border border-border bg-card/50 p-5 space-y-6 overflow-hidden">
                {/* Timeline entries */}
                <div className="relative border-l border-border pl-5 ml-2.5 space-y-6">
                  {/* Item 1 */}
                  <div className="relative">
                    {/* Circle node on the line */}
                    <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent ring-4 ring-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-foreground">v1.2.0 (Latest Update)</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">New Features</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Released on July 11, 2026</p>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside mt-2 pl-1 leading-relaxed">
                        <li>
                          <strong className="text-foreground">Live Emmet Simulator:</strong> Built an interactive playground inside docs pages where you can type abbreviations (like <code className="font-mono text-[11px] text-accent font-semibold px-1 py-0.5 bg-accent/5 rounded">ul&gt;li*4</code>) and instantly expand them with <kbd className="font-mono text-[10px] bg-secondary border border-border px-1 rounded font-bold text-foreground">Tab</kbd> or a click to preview code and live renders.
                        </li>
                        <li>
                          <strong className="text-foreground">Difficulty Sorting:</strong> Sort elements in the sidebar from <span className="font-semibold text-emerald-500">Easiest to Hardest</span> or <span className="font-semibold text-rose-500">Hardest to Easiest</span>, simplifying structured learning pathways.
                        </li>
                        <li>
                          <strong className="text-foreground">Difficulty Tags:</strong> Dynamic levels (Easy, Medium, Hard) mapped to all HTML tags, CSS rules, and JS concepts.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-muted border border-border ring-4 ring-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-foreground">v1.1.0</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">Enhancement</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Released on July 11, 2026</p>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside mt-2 pl-1 leading-relaxed">
                        <li>
                          <strong className="text-foreground">Placement Guidelines:</strong> Highly precise contextual rules detailing where tags, properties, or scripts belong in files.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-muted border border-border ring-4 ring-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-foreground">v1.0.0</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider">Initial Release</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Released on July 11, 2026</p>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside mt-2 pl-1 leading-relaxed">
                        <li>
                          <strong className="text-foreground">Interactive Cheat Sheets:</strong> Fast, searchable cheat sheets for HTML, CSS, and JS.
                        </li>
                        <li>
                          <strong className="text-foreground">Instant Search:</strong> Full-text indexing across tags, titles, methods, and examples.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DocsLayout>
  );
}
