import { ReactNode } from "react";

interface DocsLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function DocsLayout({ sidebar, header, children }: DocsLayoutProps) {
  return (
    // h-dvh (dynamic viewport height) instead of h-screen so the shell matches the
    // *visible* area on mobile. With h-screen (100vh) the shell is taller than the
    // viewport on phones, letting the whole page (header included) scroll away.
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {header}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar manages its own responsive behavior:
            fixed slide-in drawer on mobile, static column on desktop */}
        {sidebar}
        <main className="min-w-0 flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
