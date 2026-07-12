import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MousePointerClick,
  FileCode,
  Grid,
  Palette,
  LayoutGrid,
  Braces,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Code,
  Flame,
  BookOpen,
  HelpCircle,
  Clock,
  Terminal
} from "lucide-react";
import { getDifficultyRating } from "@/utils/difficulty";

interface TemplateItem {
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
}

interface TemplatesDashboardProps {
  templates: TemplateItem[];
  onSelectTemplate: (template: TemplateItem) => void;
}

const CATEGORY_META: Record<
  string,
  { icon: typeof Grid; color: string; bg: string; text: string }
> = {
  Animations: { icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  "Inputs & Forms": { icon: FileCode, color: "text-rose-500", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  Forms: { icon: FileCode, color: "text-rose-500", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  "HTML Patterns": { icon: Grid, color: "text-amber-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  "CSS Gradients": { icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
  Gradients: { icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
  "CSS Layouts": { icon: LayoutGrid, color: "text-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
  "CSS Effects": { icon: Sparkles, color: "text-teal-500", bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
  "CSS Variables": { icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  "JS Utilities": { icon: Braces, color: "text-amber-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  "JavaScript / Utility": { icon: Braces, color: "text-amber-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  "JS DOM": { icon: Terminal, color: "text-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  "React Patterns": { icon: Zap, color: "text-sky-500", bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  Algorithms: { icon: Braces, color: "text-violet-500", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  Buttons: { icon: MousePointerClick, color: "text-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  "UI Components": { icon: Grid, color: "text-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  Cards: { icon: Grid, color: "text-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  Navigation: { icon: LayoutGrid, color: "text-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
  Dashboards: { icon: Grid, color: "text-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
};

export default function TemplatesDashboard({ templates, onSelectTemplate }: TemplatesDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"curated" | "az" | "easy" | "hard">("curated");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const itemsPerPage = 12;

  // 1. Calculate Categories and their counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    templates.forEach((t) => {
      counts[t.cat] = (counts[t.cat] || 0) + 1;
      total++;
    });
    return {
      All: total,
      ...counts,
    };
  }, [templates]);

  // 2. Filter & Sort Templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((t) => t.cat === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.shortcut.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.example.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "curated") {
        // Show templates with explicit "guide" first (curated ones)
        const aCurated = a.id?.includes("curated") || (a.guide && a.guide.length > 0) ? 1 : 0;
        const bCurated = b.id?.includes("curated") || (b.guide && b.guide.length > 0) ? 1 : 0;
        if (aCurated !== bCurated) {
          return bCurated - aCurated;
        }
        return a.shortcut.localeCompare(b.shortcut);
      } else if (sortBy === "az") {
        return a.shortcut.localeCompare(b.shortcut);
      } else {
        const ratingA = getDifficultyRating(a);
        const ratingB = getDifficultyRating(b);
        return sortBy === "easy" ? ratingA.score - ratingB.score : ratingB.score - ratingA.score;
      }
    });

    return result;
  }, [templates, selectedCategory, searchQuery, sortBy]);

  // Reset page when category or search changes
  useMemo(() => {
    setCurrentPage(1);
    setExpandedPreviewId(null);
  }, [selectedCategory, searchQuery, sortBy]);

  // 3. Paginate
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const handleCopy = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCatMeta = (cat: string) => {
    return CATEGORY_META[cat] || { icon: Grid, color: "text-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="space-y-8">
      {/* Templates Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 via-background to-background p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Sparkles size={13} />
            Massive Template Hub — {templates.length} ready designs
          </span>
          <h2 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl tracking-tight">
            Production-Ready Templates
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Discover a comprehensive catalog of modular layouts, interactive widgets, polished animations, CSS trick setups, and robust utility algorithms. Tap to copy immediately, edit in the live sandbox, or follow step-by-step guides.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search templates by title, description or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10"
          />
        </div>

        {/* Sorting Dropdown & controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none transition-colors hover:border-purple-500/30 focus:border-purple-500"
          >
            <option value="curated">★ Curated First</option>
            <option value="az">Alphabetical A-Z</option>
            <option value="easy">Difficulty (Easiest)</option>
            <option value="hard">Difficulty (Hardest)</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex gap-2">
          {Object.entries(categoriesWithCounts).map(([cat, count]) => {
            const isSelected = selectedCategory === cat;
            const catMeta = getCatMeta(cat);
            const CatIcon = catMeta.icon;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? "border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/20"
                    : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat !== "All" && <CatIcon size={13} className={isSelected ? "text-white" : catMeta.color} />}
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-secondary-foreground/10 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Template Cards */}
      <AnimatePresence mode="wait">
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl"
          >
            <HelpCircle size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold text-foreground">No templates match search criteria</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Try adjusting your query, clearing filters, or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-purple-500 text-white px-5 py-2 text-xs font-semibold hover:bg-purple-600 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${selectedCategory}-${searchQuery}-${sortBy}-${currentPage}`}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedTemplates.map((template, index) => {
              const uniqueId = template.id || `template-${template.cat}-${template.shortcut}`;
              const isCurated = template.id?.includes("curated") || (template.guide && template.guide.length > 0);
              const catMeta = getCatMeta(template.cat);
              const CatIcon = catMeta.icon;
              const difficulty = getDifficultyRating(template);
              const isExpanded = expandedPreviewId === uniqueId;

              return (
                <motion.div
                  variants={itemVariants}
                  key={uniqueId}
                  onClick={() => onSelectTemplate(template)}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-500/40 cursor-pointer ${
                    isCurated ? "ring-1 ring-purple-500/10" : ""
                  }`}
                >
                  {isCurated && (
                    <div className="absolute top-0 right-0 rounded-bl-xl bg-purple-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-sm">
                      <Sparkles size={10} />
                      Curated
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Category Label and Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${catMeta.bg} ${catMeta.text} border-transparent`}>
                        <CatIcon size={11} />
                        {template.cat}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${difficulty.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          difficulty.label === "Easy" ? "bg-emerald-500" : difficulty.label === "Medium" ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        <span>{difficulty.label}</span>
                      </span>
                    </div>

                    {/* Template Name and Description */}
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-base font-bold tracking-tight text-foreground group-hover:text-purple-500 transition-colors">
                        {template.shortcut}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {template.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions and Quick Toggle */}
                  <div className="mt-5 space-y-3">
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-secondary/50 p-3 text-left overflow-x-auto text-[11px] font-mono leading-relaxed"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-2 text-muted-foreground text-[10px] uppercase font-bold border-b border-border/40 pb-1.5">
                          <span>Snippet Preview</span>
                          <button
                            onClick={(e) => handleCopy(uniqueId, template.example, e)}
                            className="text-purple-500 hover:text-purple-600 transition-colors flex items-center gap-1"
                          >
                            {copiedId === uniqueId ? <Check size={11} /> : <Copy size={11} />}
                            {copiedId === uniqueId ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="text-foreground max-h-36 overflow-y-auto no-scrollbar whitespace-pre-wrap">{template.example}</pre>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPreviewId(isExpanded ? null : uniqueId);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/30 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                      >
                        <Code size={13} className="text-purple-500" />
                        <span>{isExpanded ? "Hide Preview" : "Code View"}</span>
                      </button>

                      <button
                        onClick={(e) => handleCopy(uniqueId, template.example, e)}
                        className="rounded-xl border border-border bg-secondary/30 p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="Copy Template"
                      >
                        {copiedId === uniqueId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>

                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="rounded-xl bg-purple-500 hover:bg-purple-600 p-2 text-white transition-all group-hover:scale-105"
                        title="View Full Integration Guide"
                      >
                        <BookOpen size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
            <strong className="text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredTemplates.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filteredTemplates.length}</strong> templates
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Render a compact set of page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Sliding window of pages
              let pageNum = i + 1;
              if (currentPage > 3 && totalPages > 5) {
                if (currentPage + 2 <= totalPages) {
                  pageNum = currentPage - 3 + i + 1;
                } else {
                  pageNum = totalPages - 5 + i + 1;
                }
              }
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-purple-500 text-white shadow-md shadow-purple-500/10"
                      : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
