import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Filter,
  Menu,
  X,
  Code2,
  Palette,
  Braces,
  ArrowRight,
  User,
  LayoutTemplate,
} from "lucide-react";
import DocsLayout from "@/components/DocsLayout";
import Sidebar from "@/components/Sidebar";
import DocPage from "@/components/DocPage";
import TemplatesDashboard from "@/components/TemplatesDashboard";
import DisclaimerModal from "@/components/DisclaimerModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import rawStructuredContent from "@/data/structured_content.json";
import templatesCatalog from "@/data/templates_catalog.json";
import { getDifficultyRating, matchesDifficultyFilter, type DifficultyFilter } from "@/utils/difficulty";
import { useReadProgress } from "@/hooks/useReadProgress";
import { useDocScrollProgress } from "@/hooks/useDocScrollProgress";
import PageLoader from "@/components/PageLoader";

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
  const deduped = processed.filter((item) => {
    const key = `${item.lang}-${item.cat}-${item.shortcut}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const nonTemplates = deduped.filter((item) => item.lang !== "templates");
  const curatedTemplates = deduped.filter(
    (item) =>
      item.lang === "templates" &&
      ((item as { guide?: unknown[] }).guide?.length || item.id?.includes("curated"))
  );
  const curatedKeys = new Set(curatedTemplates.map((t) => `${t.cat}::${t.shortcut}`));
  const catalogOnly = (templatesCatalog as typeof deduped).filter(
    (t) => !curatedKeys.has(`${t.cat}::${t.shortcut}`)
  );

  return [...nonTemplates, ...curatedTemplates, ...catalogOnly];
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
  templates: {
    label: "Templates",
    icon: LayoutTemplate,
    blurb: "5,000+ ready-to-use blocks",
    accent: "text-zinc-300",
    ring: "hover:border-zinc-600",
  },
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"html" | "css" | "js" | "templates">("html");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    html: true,
    css: true,
    js: true,
    templates: true,
  });
  const [location, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<DifficultyFilter>("alphabetical");
  const [highlightDifficulty, setHighlightDifficulty] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const { getProgress, setProgress } = useReadProgress();

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 320);
    return () => clearTimeout(timer);
  }, [location]);

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
        setCurrentLang(lang as "html" | "css" | "js" | "templates");
      } else {
        setSelectedItem(null);
      }
    } else if (pathParts.length === 1) {
      setCurrentLang(pathParts[0] as "html" | "css" | "js" | "templates");
      setSelectedItem(null);
    } else {
      setSelectedItem(null);
      setCurrentLang("html");
    }
  }, [location]);

  const langContent = useMemo(
    () => structuredContent.filter((item) => item.lang === currentLang),
    [currentLang]
  );

  const groupedContent = useMemo(() => {
    const groups: Record<string, typeof structuredContent> = {};
    langContent.forEach((item) => {
      const rating = getDifficultyRating(item);
      if (!matchesDifficultyFilter(rating.label, sortBy)) return;
      if (!groups[item.cat]) groups[item.cat] = [];
      groups[item.cat].push(item);
    });
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) =>
        a.shortcut.localeCompare(b.shortcut, undefined, { sensitivity: "base" })
      );
    });
    return groups;
  }, [langContent, sortBy]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return structuredContent.filter((item: any) => {
      // Apply filters
      if (item.lang === "html" && !searchFilters.html) return false;
      if (item.lang === "css" && !searchFilters.css) return false;
      if (item.lang === "js" && !searchFilters.js) return false;
      if (item.lang === "templates" && !searchFilters.templates) return false;
      
      return (
        item.shortcut.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, searchFilters]);

  const selectedContent = useMemo(() => {
    if (!selectedItem) return null;
    return structuredContent.find(
      (item: any) => `${item.lang}-${item.cat}-${item.shortcut}` === selectedItem
    );
  }, [selectedItem]);

  useDocScrollProgress(selectedItem, setProgress);

  useEffect(() => {
    if (selectedItem) {
      setProgress(selectedItem, 15);
    }
  }, [selectedItem, setProgress]);

  return (
    <>
      <PageLoader show={pageLoading || routeLoading} />
      <DocsLayout
      sidebar={
        <Sidebar
          currentLang={currentLang}
          onLangChange={(lang: "html" | "css" | "js" | "templates") => {
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
          filterBy={sortBy}
          onFilterChange={setSortBy}
          highlightDifficulty={highlightDifficulty}
          onHighlightDifficultyChange={setHighlightDifficulty}
          getReadProgress={getProgress}
        />
      }
      header={
        <header className="z-40 flex-shrink-0 border-b border-border/40 bg-background">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex-shrink-0 rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <button onClick={() => setLocation("/")} className="flex items-center gap-2.5 group">
              <img
                src="/anime-logo.jpg"
                alt="Eli Shh Docs"
                className="h-8 w-8 rounded-lg object-cover transition-transform group-hover:scale-105"
              />
              <span className="hidden text-sm font-bold tracking-tight text-foreground min-[400px]:block">
                Eli Shh Docs
              </span>
            </button>

            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="relative min-w-0 flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-border/60 bg-input/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]" aria-label="Filter search">
                    <Filter size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 border-border/60 bg-popover">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Scope</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={searchFilters.html} onCheckedChange={(c) => setSearchFilters((p) => ({ ...p, html: c }))}>HTML</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={searchFilters.css} onCheckedChange={(c) => setSearchFilters((p) => ({ ...p, css: c }))}>CSS</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={searchFilters.js} onCheckedChange={(c) => setSearchFilters((p) => ({ ...p, js: c }))}>JavaScript</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={searchFilters.templates} onCheckedChange={(c) => setSearchFilters((p) => ({ ...p, templates: c }))}>Templates</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}
              <button
                onClick={() => setShowDisclaimer(true)}
                className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                aria-label="About"
              >
                <User size={16} />
              </button>
            </div>
          </div>
        </header>
      }
    >
      {searchQuery.trim() ? (
        searchResults.length === 0 ? (
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
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="mb-1 text-2xl sm:text-3xl font-bold">Search Results</h2>
              <p className="text-muted-foreground">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
                <strong>"{searchQuery}"</strong>
              </p>
            </div>
            <div className="grid gap-3">
              {searchResults.slice(0, 60).map((item: any, i: number) => {
                const catSlug = getCategorySlug(item.cat);
                const shortcutSlug = getShortcutSlug(item.shortcut);
                return (
                  <button
                    key={`${item.lang}-${item.cat}-${item.shortcut}`}
                    onClick={() => {
                      setLocation(`/${item.lang}/${catSlug}/${shortcutSlug}`);
                      setSearchQuery("");
                    }}
                    className="group text-left rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 fill-mode-both cursor-pointer"
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
                );
              })}
            </div>
          </div>
        )
      ) : selectedContent ? (
        <DocPage content={selectedContent} />
      ) : currentLang === "templates" ? (
        <TemplatesDashboard
          templates={langContent}
          onSelectTemplate={(item) => {
            const catSlug = getCategorySlug(item.cat);
            const shortcutSlug = getShortcutSlug(item.shortcut);
            setLocation(`/templates/${catSlug}/${shortcutSlug}`);
          }}
        />
      ) : (
        <div className="mx-auto max-w-3xl space-y-16 py-4">
          <section className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground backdrop-blur-sm">
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Reference Documentation
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Eli Shh Docs
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              Minimal, high-quality documentation for HTML, CSS, JavaScript, and {structuredContent.filter((i) => i.lang === "templates").length.toLocaleString()}+ templates.
              Search for anything or select a category below to get started.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {(["html", "css", "js", "templates"] as const).map((lang, index) => {
              const meta = LANG_META[lang];
              const Icon = meta.icon;
              const count = structuredContent.filter((item) => item.lang === lang).length;
              return (
                <button
                  key={lang}
                  onClick={() => setLocation(`/${lang}`)}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-accent/50"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={24} />
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground opacity-0 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-foreground mb-1">{meta.label}</p>
                    <p className="text-sm font-medium text-muted-foreground">{count.toLocaleString()} entries</p>
                  </div>
                </button>
              );
            })}
          </section>

          <section className="space-y-6 pt-10">
            <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">!</span>
              Changelog
            </h3>
            <div className="space-y-4">

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1" />
                  <div className="w-px flex-1 bg-border min-h-[40px]" />
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Latest</span>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">AI Chatbot — Code Editor &amp; File Upload</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">AI replies now render in a styled code editor with syntax highlighting and a one-click Copy button. You can also attach images and files directly in the chat — the AI can read and analyse them.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-border mt-1" />
                  <div className="w-px flex-1 bg-border min-h-[40px]" />
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">Profile Popup — Brand Colors &amp; Social Links</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">The About popup now links your real Telegram (@kishshiii) and Facebook (itsurboyelifr) profiles, each styled with their official brand color and a left accent bar.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-border mt-1" />
                  <div className="w-px flex-1 bg-border min-h-[40px]" />
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Earlier today</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">Home — Premium Card Grid &amp; Dark/Light Toggle</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Language cards redesigned with hover lift, icon badges, and smooth animations. Added a working theme toggle in the header so you can switch between dark and light mode.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-border mt-1" />
                </div>
                <div className="pb-2 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">v1.2</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">5,000+ Templates Added</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Expanded the Templates section with thousands of ready-to-use UI blocks. Each entry includes a live preview, difficulty rating, and read-progress tracking in the sidebar.</p>
                </div>
              </div>

            </div>
          </section>
        </div>
      )}
    </DocsLayout>
    <DisclaimerModal
      isOpen={showDisclaimer && selectedItem === null && !searchQuery.trim()}
      onClose={() => setShowDisclaimer(false)}
    />
  </>
);
}
