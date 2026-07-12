import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, ArrowRight, Loader2, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import DisclaimerModal from "@/components/DisclaimerModal";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showAbout, setShowAbout] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(0);
  const userRef = useRef<HTMLInputElement>(null);

  // Focus the username field once the About modal is dismissed.
  useEffect(() => {
    if (!showAbout) userRef.current?.focus();
  }, [showAbout]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(false);
    // Small delay so the spinner reads as a real "sign in" beat.
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) {
        setError(true);
        setShake((s) => s + 1);
        setPassword("");
        setSubmitting(false);
      }
      // On success the AuthProvider flips isAuthenticated and App swaps to docs.
    }, 450);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated gradient background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -left-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(91,110,245,0.35), transparent 60%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(193,53,132,0.30), transparent 60%)" }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Theme toggle */}
      {toggleTheme && (
        <button
          onClick={toggleTheme}
          className="absolute right-5 top-5 z-10 rounded-full border border-border/60 bg-card/60 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      )}

      {/* Login card */}
      <motion.div
        key={shake}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={
          error
            ? { opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -8, 8, -4, 0] }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        {/* Gradient header band — matches the About popup */}
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/40 to-primary/10" />
          <div
            className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 30%, color-mix(in oklch, var(--primary) 22%, transparent) 0, transparent 38%), radial-gradient(circle at 78% 60%, color-mix(in oklch, var(--primary) 14%, transparent) 0, transparent 45%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Avatar + brand */}
        <div className="relative px-7 pb-5 -mt-10">
          <div className="mb-5 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 }}
              className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card bg-secondary text-2xl font-bold text-foreground shadow-md"
            >
              E
            </motion.div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-0.5">
              Welcome back
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Eli Shh Docs</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Username
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 px-3.5 py-2.5 transition-colors focus-within:border-primary/40 focus-within:bg-secondary/30">
                <User size={15} className="flex-shrink-0 text-muted-foreground" />
                <input
                  ref={userRef}
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter username"
                  autoCapitalize="none"
                  autoComplete="username"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 px-3.5 py-2.5 transition-colors focus-within:border-primary/40 focus-within:bg-secondary/30">
                <Lock size={15} className="flex-shrink-0 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-center text-xs font-medium text-rose-500"
                >
                  Incorrect username or password.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.985] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
            Access is restricted. Contact the maintainer if you need credentials.
          </p>
        </div>
      </motion.div>

      {/* About / Connect modal shown first; "Continue to docs" reveals the form. */}
      <DisclaimerModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        ctaLabel="Continue to docs"
        onContinue={() => setShowAbout(false)}
      />
    </div>
  );
}
