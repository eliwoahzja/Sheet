import { useMemo } from "react";
import { useParams } from "wouter";
import DocPage from "@/components/DocPage";
import structuredContent from "@/data/structured_content.json";
import NotFound from "./NotFound";

export default function DocPageWrapper() {
  const params = useParams();
  const { lang, cat, shortcut } = params;

  const selectedContent = useMemo(() => {
    if (!lang || !cat || !shortcut) return null;
    return structuredContent.find(
      (item: any) =>
        item.lang === lang &&
        item.cat === cat &&
        item.shortcut === decodeURIComponent(shortcut)
    );
  }, [lang, cat, shortcut]);

  if (!selectedContent) {
    return <NotFound />;
  }

  return <DocPage content={selectedContent} />;
}
