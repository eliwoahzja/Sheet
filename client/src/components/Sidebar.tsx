import { ChevronDown, SlidersHorizontal, ArrowUpDown, TrendingUp, Flame } from "lucide-react";
import { useState } from "react";
import { getDifficultyRating } from "@/utils/difficulty";

interface SidebarProps {
  currentLang: "html" | "css" | "js";
  onLangChange: (lang: "html" | "css" | "js") => void;
  groupedContent: Record<string, any[]>;
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  sortBy: "alphabetical" | "easiest" | "hardest";
  onSortChange: (sortBy: "alphabetical" | "easiest" | "hardest") => void;
}

const LANG_LABELS = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
};

export default function Sidebar({
  currentLang,
  onLangChange,
  groupedContent,
  selectedItem,
  onSelectItem,
  sidebarOpen,
  onToggleSidebar,
  sortBy,
  onSortChange,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(groupedContent))
  );

  const toggleCategory = (cat: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(cat)) {
      newExpanded.delete(cat);
    } else {
      newExpanded.add(cat);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-out md:relative md:z-0 md:w-64 md:max-w-none md:flex-shrink-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4">
          {/* Language tabs */}
          <div className="mb-4 grid grid-cols-3 gap-1.5 rounded-xl bg-secondary/60 p-1.5">
            {(["html", "css", "js"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLangChange(lang)}
                className={`rounded-lg px-2 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                  currentLang === lang
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Sort Selection Custom Segment Controller */}
          <div className="mb-5 px-1">
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <SlidersHorizontal size={10} className="text-accent" />
              <span>Sort sequence</span>
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary/50 p-1 border border-border/50">
              <button
                type="button"
                onClick={() => onSortChange("alphabetical")}
                className={`flex flex-col items-center justify-center rounded-md py-2 px-1 text-[9px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  sortBy === "alphabetical"
                    ? "bg-accent text-accent-foreground shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                }`}
                title="Sort alphabetically A to Z"
              >
                <ArrowUpDown size={13} className="mb-1 opacity-90" />
                <span>A - Z</span>
              </button>
              <button
                type="button"
                onClick={() => onSortChange("easiest")}
                className={`flex flex-col items-center justify-center rounded-md py-2 px-1 text-[9px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  sortBy === "easiest"
                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/10 shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                }`}
                title="Sort from easiest to hardest"
              >
                <TrendingUp size={13} className="mb-1 opacity-90" />
                <span>Easy</span>
              </button>
              <button
                type="button"
                onClick={() => onSortChange("hardest")}
                className={`flex flex-col items-center justify-center rounded-md py-2 px-1 text-[9px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  sortBy === "hardest"
                    ? "bg-rose-500/15 text-rose-500 border border-rose-500/10 shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                }`}
                title="Sort from hardest to easiest"
              >
                <Flame size={13} className="mb-1 opacity-90" />
                <span>Hard</span>
              </button>
            </div>
          </div>

          <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {LANG_LABELS[currentLang]} reference
          </p>

          {/* Categories */}
          <div className="space-y-1">
            {Object.entries(groupedContent).map(([cat, items]) => {
              const isExpanded = expandedCategories.has(cat);
              return (
                <div key={cat}>
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent/10"
                  >
                    <span className="truncate">{cat}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {items.map((item) => {
                        const itemId = `${item.lang}-${item.cat}-${item.shortcut}`;
                        const isActive = selectedItem === itemId;
                        const rating = getDifficultyRating(item);
                        return (
                          <button
                            key={itemId}
                            onClick={() => onSelectItem(itemId)}
                            className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-xs font-mono transition-all duration-150 ${
                              isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "text-muted-foreground hover:translate-x-0.5 hover:text-foreground hover:bg-accent/10"
                            }`}
                          >
                            <span className="truncate">{item.shortcut}</span>
                            <span
                              title={`Difficulty: ${rating.label}`}
                              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                                rating.label === "Easy"
                                  ? "bg-emerald-500/80"
                                  : rating.label === "Medium"
                                    ? "bg-amber-500/80"
                                    : "bg-rose-500/80"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
