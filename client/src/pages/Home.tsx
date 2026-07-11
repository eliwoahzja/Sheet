import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import DocsLayout from "@/components/DocsLayout";
import Sidebar from "@/components/Sidebar";
import DocPage from "@/components/DocPage";
import structuredContent from "@/data/structured_content.json";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"html" | "css" | "js">("html");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    // Parse current URL to set selected item if directly navigated
    const pathParts = location.split("/").filter(Boolean);
    if (pathParts.length === 3) {
      const [lang, cat, shortcut] = pathParts;
      setSelectedItem(`${lang}-${cat}-${decodeURIComponent(shortcut)}`);
      setCurrentLang(lang as "html" | "css" | "js");
    } else if (pathParts.length === 1) {
      setCurrentLang(pathParts[0] as "html" | "css" | "js");
      setSelectedItem(null);
    } else {
      setSelectedItem(null);
      setCurrentLang("html"); // Default to HTML if no specific language in URL
    }
  }, [location]);
  const { theme, toggleTheme } = useTheme();

  // Filter content by language
  const langContent = useMemo(
    () => structuredContent.filter((item) => item.lang === currentLang),
    [currentLang]
  );

  // Group content by category
  const groupedContent = useMemo(() => {
    const groups: Record<string, typeof structuredContent> = {};
    langContent.forEach((item) => {
      if (!groups[item.cat]) {
        groups[item.cat] = [];
      }
      groups[item.cat].push(item);
    });
    return groups;
  }, [langContent]);

  // Search functionality
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
            const [lang, cat, shortcut] = id.split("-");
            setLocation(`/${lang}/${cat}/${encodeURIComponent(shortcut)}`);
            setSidebarOpen(false);
          }}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      }
      header={
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-accent rounded-lg flex-shrink-0"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">Dev Docs</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-1 sm:flex-none">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex-shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg flex-shrink-0"
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
        <div className="space-y-8 max-w-2xl">
          <div>
            <h2 className="text-4xl font-bold mb-4">No Results Found</h2>
            <p className="text-lg text-muted-foreground">
              No documentation found for <strong>"{searchQuery}"</strong>. Try a different search term or browse by language.
            </p>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-semibold"
          >
            Clear Search
          </button>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Search Results</h2>
            <p className="text-muted-foreground">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="grid gap-4">
            {searchResults.map((item: any) => (
              <button
                key={`${item.lang}-${item.cat}-${item.shortcut}`}
                onClick={() => setLocation(`/${item.lang}/${item.cat}/${encodeURIComponent(item.shortcut)}`)}
                className="text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 bg-muted rounded">
                    {item.lang}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 bg-muted rounded">
                    {item.cat}
                  </span>
                </div>
                <code className="text-lg font-mono font-semibold block mb-1">{item.shortcut}</code>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12 max-w-4xl">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Welcome to Dev Docs</h2>
            <p className="text-xl text-muted-foreground">
              A comprehensive reference for HTML, CSS, and JavaScript. Explore the sidebar or search to get started.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {["html", "css", "js"].map((lang: any) => {
              const count = structuredContent.filter((item: any) => item.lang === lang).length;
              return (
                <button
                  key={lang}
                  onClick={() => {
                    setLocation(`/${lang}`);
                  }}
                  className="p-6 rounded-lg border border-border hover:bg-accent hover:border-accent transition-colors text-left group"
                >
                  <h3 className="text-2xl font-bold uppercase mb-2 group-hover:text-accent-foreground transition-colors">{lang}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">{count} references</p>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold">Quick Tips</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">•</span>
                <span>Use the search bar to find any HTML element, CSS property, or JavaScript method across all languages.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">•</span>
                <span>Click on any item in the sidebar to view detailed documentation with code examples.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">•</span>
                <span>Use the theme toggle in the top-right to switch between light and dark modes.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">•</span>
                <span>All code examples include a copy button for quick access to the code.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </DocsLayout>
  );
}
