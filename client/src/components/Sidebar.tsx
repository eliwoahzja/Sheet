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
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-border bg-background transition-transform duration-300 md:relative md:z-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4">
          {/* Language tabs */}
          <div className="mb-6 space-y-2">
            {(["html", "css", "js"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLangChange(lang)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentLang === lang
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {Object.entries(groupedContent).map(([cat, items]) => (
              <div key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  {cat}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedCategories.has(cat) ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
                {expandedCategories.has(cat) && (
                  <div className="ml-2 space-y-1 border-l border-border pl-2">
                    {items.map((item) => {
                      const itemId = `${item.lang}-${item.cat}-${item.shortcut}`;
                      return (
                        <button
                          key={itemId}
                          onClick={() => onSelectItem(itemId)}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                            selectedItem === itemId
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                        >
                          {item.shortcut}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
