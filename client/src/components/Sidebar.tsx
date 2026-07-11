import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentLang: "html" | "css" | "js";
  onLangChange: (lang: "html" | "css" | "js") => void;
  groupedContent: Record<string, any[]>;
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
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
          <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl bg-secondary/60 p-1.5">
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
                        return (
                          <button
                            key={itemId}
                            onClick={() => onSelectItem(itemId)}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-mono transition-all duration-150 ${
                              isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "text-muted-foreground hover:translate-x-0.5 hover:text-foreground hover:bg-accent/10"
                            }`}
                          >
                            <span className="truncate">{item.shortcut}</span>
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
