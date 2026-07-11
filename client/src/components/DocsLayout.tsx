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
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:overflow-y-auto">
          {sidebar}
        </aside>
        <main className="flex-1 overflow-y-auto flex">
          <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
