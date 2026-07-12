import { useEffect, useRef } from "react";

export function useDocScrollProgress(
  itemId: string | null,
  onProgress: (id: string, percent: number) => void
) {
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!itemId) return;

    const main = document.querySelector("main.overflow-y-auto");
    if (!main) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = main;
      const maxScroll = scrollHeight - clientHeight;
      const percent = maxScroll <= 0 ? 100 : Math.round((scrollTop / maxScroll) * 100);
      onProgressRef.current(itemId, Math.max(25, percent));
      if (percent >= 95) onProgressRef.current(itemId, 100);
    };

    update();
    main.addEventListener("scroll", update, { passive: true });
    return () => main.removeEventListener("scroll", update);
  }, [itemId]);
}
