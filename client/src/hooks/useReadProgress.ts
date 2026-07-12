import { useCallback, useState } from "react";

const STORAGE_KEY = "eli-shh-docs-read";

function loadReadMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveReadMap(map: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function useReadProgress() {
  const [readMap, setReadMap] = useState<Record<string, number>>(loadReadMap);

  const getProgress = useCallback(
    (id: string) => readMap[id] ?? 0,
    [readMap]
  );

  const setProgress = useCallback((id: string, percent: number) => {
    const next = Math.max(0, Math.min(100, Math.round(percent)));
    setReadMap((prev) => {
      const current = prev[id] ?? 0;
      if (next <= current) return prev;
      const updated = { ...prev, [id]: next };
      saveReadMap(updated);
      return updated;
    });
  }, []);

  const toggleRead = useCallback((id: string) => {
    setReadMap((prev) => {
      const current = prev[id] ?? 0;
      const next = current >= 100 ? 0 : 100;
      const updated = { ...prev, [id]: next };
      saveReadMap(updated);
      return updated;
    });
  }, []);

  return { getProgress, setProgress, toggleRead, readMap };
}
