import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOCIALS = [
  { name: "Instagram", handle: "@Elihateslies", link: "https://instagram.com/Elihateslies", color: "#E1306C" },
  { name: "Telegram", handle: "@kishshiii", link: "https://t.me/kishshiii", color: "#24A1DE" },
  { name: "X", handle: "@Demorgavon", link: "https://x.com/Demorgavon", color: "currentColor" },
  { name: "Facebook", handle: "itsurboyelifr", link: "https://www.facebook.com/itsurboyelifr", color: "#1877F2" },
];

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  // Esc-to-close, only while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-md"
            aria-label="Close"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card text-card-foreground shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)]"
          >
            {/* Header band with avatar */}
            <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/15 via-accent/40 to-primary/10">
              <div
                className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 30%, color-mix(in oklch, var(--primary) 22%, transparent) 0, transparent 38%), radial-gradient(circle at 78% 60%, color-mix(in oklch, var(--primary) 14%, transparent) 0, transparent 45%)",
                }}
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Avatar + title */}
            <div className="px-6 sm:px-7 pb-5 -mt-10 relative">
              <div className="mb-4 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-secondary text-3xl font-bold text-foreground shadow-sm">
                  E
                </div>
                <span className="rounded-full border border-border/60 bg-secondary/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  v2.0
                </span>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-1.5">
                About
              </p>
              <h3 className="text-2xl font-semibold tracking-tight mb-1.5">Eli Shh Docs</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Built by Eli (Jm). A minimal reference for web development — docs, live previews, and 5,000+ templates.
              </p>
            </div>

            {/* Connect section */}
            <div className="px-6 sm:px-7 pb-3">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Connect
                </p>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <ul className="space-y-2">
                {SOCIALS.map((s, i) => (
                  <li key={s.name}>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 px-3.5 py-2.5 transition-all duration-200 hover:bg-secondary/50 hover:border-border hover:translate-x-0.5"
                    >
                      {/* Left brand accent bar */}
                      <span
                        className="h-7 w-1 rounded-full transition-all duration-200 group-hover:h-9"
                        style={{ backgroundColor: s.color !== "currentColor" ? s.color : "var(--muted-foreground)" }}
                      />
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors"
                        style={{
                          color: s.color !== "currentColor" ? s.color : "var(--muted-foreground)",
                          backgroundColor:
                            s.color !== "currentColor"
                              ? `color-mix(in srgb, ${s.color} 14%, transparent)`
                              : "var(--secondary)",
                        }}
                      >
                        {s.name.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {s.name}
                        </span>
                        <span
                          className="block truncate text-sm font-medium"
                          style={{ color: s.color !== "currentColor" ? s.color : "var(--foreground)" }}
                        >
                          {s.handle}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy(s.handle, i);
                        }}
                        className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                        aria-label={`Copy ${s.handle}`}
                      >
                        {copied === i ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer + CTA */}
            <div className="px-6 sm:px-7 pt-2 pb-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.985]"
              >
                Continue to docs
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground/80">
                Tip: press <kbd className="rounded border border-border bg-secondary px-1 py-0.5 text-[10px] font-semibold">Esc</kbd> or click outside to close.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
