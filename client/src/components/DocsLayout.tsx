import { ReactNode } from "react";

interface DocsLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function DocsLayout({ sidebar, header, children }: DocsLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {header}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar manages its own responsive behavior:
            fixed slide-in drawer on mobile, static column on desktop */}
        {sidebar}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
