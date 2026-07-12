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
  ArrowUpRight,
  User,
  LayoutTemplate,
  Sparkles,
  BookOpen,
  Layers,
  Zap,
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
  { label: string; icon: typeof Code2; blurb: string; accent: string; ring: string; solid: string }
> = {
  html: {
    label: "HTML",
    icon: Code2,
    blurb: "Elements, attributes, entities & Emmet",
    accent: "text-[#e34f26]",
    ring: "group-hover:border-[#e34f26]/50",
    solid: "#e34f26",
  },
  css: {
    label: "CSS",
    icon: Palette,
    blurb: "Properties, selectors, tricks & layout",
    accent: "text-[#2965f1]",
    ring: "group-hover:border-[#2965f1]/50",
    solid: "#2965f1",
  },
  js: {
    label: "JavaScript",
    icon: Braces,
    blurb: "Methods, ES6+, DOM & control flow",
    accent: "text-[#f7df1e]",
    ring: "group-hover:border-[#d9c400]/50",
    solid: "#d9c400",
  },
  templates: {
    label: "Templates",
    icon: LayoutTemplate,
    blurb: "5,000+ ready-to-use blocks",
    accent: "text-zinc-300",
    ring: "hover:border-zinc-600",
    solid: "#a1a1aa",
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
                src="/logo.jpg"
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
        <div className="mx-auto max-w-4xl space-y-20 py-6">
          {/* ───────────────── Hero ───────────────── */}
          <section className="relative space-y-7 overflow-hidden">
            <div className="absolute -top-10 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-60 dark:opacity-30 pointer-events-none" />
            <div className="absolute -top-6 right-8 h-28 w-28 rounded-full bg-chart-2/10 blur-3xl opacity-50 dark:opacity-25 pointer-events-none" />

            <div className="relative inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground backdrop-blur-sm">
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Reference Documentation · v2.0
            </div>

            <h2 className="relative text-4xl font-bold tracking-tight text-foreground sm:text-[3.4rem] sm:leading-[1.05]">
              Eli Shh Docs
              <span className="block mt-2 text-base font-medium text-muted-foreground tracking-normal sm:text-lg">
                Minimal, high-quality docs for the modern web.
              </span>
            </h2>

            <p className="relative max-w-2xl text-base text-muted-foreground leading-relaxed">
              Coverage for HTML, CSS, and JavaScript — plus{" "}
              <strong className="text-foreground">
                {structuredContent.filter((i) => i.lang === "templates").length.toLocaleString()}+
              </strong>{" "}
              ready-to-use templates. Search anything, or pick a track below to start.
            </p>

            {/* Stat row */}
            <div className="relative grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-3">
              {[
                { label: "Languages", value: "3", icon: BookOpen },
                { label: "Templates", value: `${Math.round(structuredContent.filter((i) => i.lang === "templates").length / 100) / 10}k+`, icon: Layers },
                { label: "Live previews", value: "on", icon: Zap },
                { label: "Offline search", value: "on", icon: Sparkles },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2.5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon size={15} />
                    </span>
                    <div className="leading-tight">
                      <div className="text-sm font-semibold text-foreground">{s.value}</div>
                      <div className="text-[11px] text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ───────────────── Language cards ───────────────── */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Browse by language
              </h3>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Click a card to open →
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["html", "css", "js", "templates"] as const).map((lang, index) => {
                const meta = LANG_META[lang];
                const Icon = meta.icon;
                const count = structuredContent.filter((item) => item.lang === lang).length;
                return (
                  <button
                    key={lang}
                    onClick={() => setLocation(`/${lang}`)}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/50"
                  >
                    {/* Top accent bar that grows on hover */}
                    <span
                      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: meta.solid }}
                    />
                    <div className="p-6">
                      <div className="mb-6 flex items-start justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                          style={{
                            color: meta.solid,
                            backgroundColor: `color-mix(in srgb, ${meta.solid} 14%, transparent)`,
                          }}
                        >
                          <Icon size={24} />
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="text-muted-foreground opacity-0 -translate-x-1 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary"
                        />
                      </div>
                      <div className="mb-1 flex items-baseline gap-2">
                        <p className="text-xl font-bold tracking-tight text-foreground">{meta.label}</p>
                        <p className="text-xs font-medium text-muted-foreground">{count.toLocaleString()} entries</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{meta.blurb}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ───────────────── Changelog ───────────────── */}
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  !
                </span>
                Changelog
              </h3>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <div className="relative space-y-1 pl-3">
              {/* vertical rail */}
              <div className="absolute left-[5px] top-1.5 bottom-2 w-px bg-border" />
              {[
                {
                  badge: "Latest",
                  when: "Today",
                  latest: true,
                  title: "AI Chatbot — Code Editor & File Upload",
                  body: "AI replies now render in a styled code editor with syntax highlighting and a one-click Copy button. You can also attach images and files directly in the chat — the AI can read and analyse them.",
                },
                {
                  when: "Today",
                  title: "Profile Popup — Brand Colors & Social Links",
                  body: "The About popup now links your real Telegram (@kishshiii) and Facebook (itsurboyelifr) profiles, each styled with their official brand color and a left accent bar.",
                },
                {
                  when: "Earlier today",
                  title: "Home — Premium Card Grid & Dark/Light Toggle",
                  body: "Language cards redesigned with hover lift, icon badges, and smooth animations. Added a working theme toggle in the header so you can switch between dark and light mode.",
                },
                {
                  when: "v1.2",
                  title: "5,000+ Templates Added",
                  body: "Expanded the Templates section with thousands of ready-to-use UI blocks. Each entry includes a live preview, difficulty rating, and read-progress tracking in the sidebar.",
                },
              ].map((e, i) => (
                <div key={i} className="group relative pl-6 pb-5">
                  <span
                    className={
                      "absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-125 " +
                      (e.latest ? "bg-primary ring-4 ring-primary/15" : "bg-border")
                    }
                  />
                  <div className="mb-1 flex items-center gap-2">
                    {e.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {e.badge}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{e.when}</span>
                  </div>
                  <h4 className="mb-1 font-semibold text-foreground">{e.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{e.body}</p>
                </div>
              ))}

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
