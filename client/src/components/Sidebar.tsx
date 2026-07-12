import {
  ChevronDown,
  Filter,
  Folder,
  FolderOpen,
  Code2,
  Palette,
  Braces,
  LayoutTemplate,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getDifficultyRating,
  getDifficultyTextColor,
  type DifficultyFilter,
} from "@/utils/difficulty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  currentLang: "html" | "css" | "js" | "templates";
  onLangChange: (lang: "html" | "css" | "js" | "templates") => void;
  groupedContent: Record<string, any[]>;
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  filterBy: DifficultyFilter;
  onFilterChange: (filter: DifficultyFilter) => void;
  highlightDifficulty: boolean;
  onHighlightDifficultyChange: (value: boolean) => void;
  getReadProgress: (id: string) => number;
}

const LANG_OPTIONS = [
  { value: "html", label: "HTML", icon: Code2 },
  { value: "css", label: "CSS", icon: Palette },
  { value: "js", label: "JavaScript", icon: Braces },
  { value: "templates", label: "Templates", icon: LayoutTemplate },
] as const;

const FILTER_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: "alphabetical", label: "Alphabetical" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function Sidebar({
  currentLang,
  onLangChange,
  groupedContent,
  selectedItem,
  onSelectItem,
  sidebarOpen,
  onToggleSidebar,
  filterBy,
  onFilterChange,
  highlightDifficulty,
  onHighlightDifficultyChange,
  getReadProgress,
}: SidebarProps) {
  const objectKeys = Object.keys(groupedContent);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(objectKeys.length > 0 ? [objectKeys[0]] : [])
  );

  useEffect(() => {
    if (selectedItem) {
      for (const [cat, items] of Object.entries(groupedContent)) {
        if (items.some((item) => `${item.lang}-${item.cat}-${item.shortcut}` === selectedItem)) {
          setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            newSet.add(cat);
            return newSet;
          });
          break;
        }
      }
    }
  }, [selectedItem, groupedContent]);

  useEffect(() => {
    if (objectKeys.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set([objectKeys[0]]));
    }
  }, [objectKeys, expandedCategories.size]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const showColoredNames = highlightDifficulty || filterBy !== "alphabetical";
  const showDots = filterBy === "alphabetical" && !highlightDifficulty;
  const currentLangMeta = LANG_OPTIONS.find((l) => l.value === currentLang);
  const LangIcon = currentLangMeta?.icon ?? Code2;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={onToggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card transition-transform duration-300 ease-out md:relative md:z-0 md:w-72 md:max-w-none md:flex-shrink-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          {/* Language dropdown */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Language
            </label>
            <Select value={currentLang} onValueChange={(v) => onLangChange(v as typeof currentLang)}>
              <SelectTrigger className="w-full bg-secondary/40 border-border text-foreground transition-colors hover:bg-secondary/60">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <LangIcon size={16} className="text-accent" />
                    {currentLangMeta?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                {LANG_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value} className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Icon size={16} />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter dropdown */}
          <div className="mb-5">
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Filter size={14} className="text-accent" />
              Filter
            </label>
            <Select value={filterBy} onValueChange={(v) => onFilterChange(v as DifficultyFilter)}>
              <SelectTrigger className="w-full bg-secondary/40 border-border text-foreground transition-colors hover:bg-secondary/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                {FILTER_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value} className="cursor-pointer">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Highlight difficulty toggle */}
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 transition-colors hover:bg-secondary/50">
            <div className="flex items-center gap-2 min-w-0">
              <Eye size={15} className="flex-shrink-0 text-accent" />
              <Label
                htmlFor="highlight-difficulty"
                className="cursor-pointer text-xs font-semibold leading-tight text-foreground"
              >
                Highlight difficulty
              </Label>
            </div>
            <Switch
              id="highlight-difficulty"
              checked={highlightDifficulty}
              onCheckedChange={onHighlightDifficultyChange}
            />
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <span className="h-4 w-1 rounded-full bg-accent" />
            {currentLangMeta?.label} Reference
          </div>

          <div className="space-y-2">
            {Object.entries(groupedContent).map(([cat, items]) => {
              if (items.length === 0) return null;
              const isExpanded = expandedCategories.has(cat);
              return (
                <div
                  key={cat}
                  className="rounded-xl border border-border/60 bg-secondary/20 overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleCategory(cat)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-accent/10 ${
                      isExpanded
                        ? "bg-accent/5 text-foreground border-b border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isExpanded ? (
                        <FolderOpen size={16} className="text-accent flex-shrink-0" />
                      ) : (
                        <Folder size={16} className="flex-shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate">{cat}</span>
                      <span className="text-[10px] font-bold text-muted-foreground">{items.length}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-foreground" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="bg-background/60 dark:bg-background/40 px-2 py-2 space-y-0.5 animate-in slide-in-from-top-2 fade-in duration-200">
                      {items.map((item) => {
                        const itemId = `${item.lang}-${item.cat}-${item.shortcut}`;
                        const isActive = selectedItem === itemId;
                        const rating = getDifficultyRating(item);
                        const readPercent = getReadProgress(itemId);
                        const isRead = readPercent >= 100;

                        const nameClass = isActive
                          ? "text-accent-foreground font-semibold"
                          : showColoredNames
                            ? `${getDifficultyTextColor(rating.label)} font-medium`
                            : "text-muted-foreground group-hover:text-foreground";

                        return (
                          <button
                            key={itemId}
                            onClick={() => onSelectItem(itemId)}
                            className={`group flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-accent shadow-sm"
                                : "hover:bg-secondary/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`truncate font-mono text-[13px] tracking-tight transition-colors duration-200 ${nameClass}`}>
                                {item.shortcut}
                              </span>
                              {showDots && (
                                <span
                                  title={`Difficulty: ${rating.label}`}
                                  className={`flex h-2 w-2 flex-shrink-0 rounded-full transition-transform duration-200 ${
                                    isActive ? "scale-110" : "group-hover:scale-125"
                                  } ${
                                    rating.label === "Easy"
                                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                      : rating.label === "Medium"
                                        ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                                        : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                                  }`}
                                />
                              )}
                            </div>
                            <div
                              className="read-progress-track h-0.5 w-full overflow-hidden rounded-full bg-border/80"
                              role="progressbar"
                              aria-valuenow={readPercent}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Read progress for ${item.shortcut}`}
                            >
                              <div
                                className={`read-progress-fill h-full rounded-full transition-all duration-500 ease-out ${
                                  isRead ? "bg-emerald-500" : "bg-accent/70"
                                }`}
                                style={{ width: `${readPercent}%` }}
                              />
                            </div>
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
