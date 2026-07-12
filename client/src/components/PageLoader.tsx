import { useEffect, useState } from "react";

interface PageLoaderProps {
  show: boolean;
}

export default function PageLoader({ show }: PageLoaderProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`page-loader ${show ? "" : "page-loader--hidden"}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="loader-ring" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="loader-text">Loading docs…</p>
    </div>
  );
}
