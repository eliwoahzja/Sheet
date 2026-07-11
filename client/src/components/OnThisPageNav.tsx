import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function OnThisPageNav() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const docContent = document.querySelector('article');
    if (!docContent) return;

    const extractedHeadings: Heading[] = [];
    docContent.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
      extractedHeadings.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      });
    });
    setHeadings(extractedHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1,
      }
    );

    extractedHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      extractedHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden lg:block sticky top-20 right-0 w-64 pl-8 py-4 text-sm">
      <h4 className="font-semibold mb-3 text-muted-foreground">On this page</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${heading.id}`}
              className={`block transition-colors hover:text-foreground ${
                activeId === heading.id ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
