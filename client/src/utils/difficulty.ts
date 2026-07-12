export interface DifficultyRating {
  score: number;
  label: "Easy" | "Medium" | "Hard";
  color: string;
}

export type DifficultyFilter = "alphabetical" | "easy" | "medium" | "hard";

export function getDifficultyTextColor(label: DifficultyRating["label"]): string {
  if (label === "Easy") return "text-emerald-500";
  if (label === "Medium") return "text-orange-500";
  return "text-rose-500";
}

export function matchesDifficultyFilter(
  label: DifficultyRating["label"],
  filter: DifficultyFilter
): boolean {
  if (filter === "alphabetical") return true;
  return label.toLowerCase() === filter;
}

export function getDifficultyRating(item: { lang: string; cat: string; shortcut: string }): DifficultyRating {
  const lang = item.lang.toLowerCase();
  const cat = item.cat.toLowerCase();
  const shortcut = item.shortcut.replace(/[<>`]/g, "").trim().toLowerCase();

  // Score scales from 1 (easiest) to 5 (hardest)
  let score = 2.0; // Default to Medium (2.0)

  if (lang === "html") {
    // Basic structural, block elements, text tags
    if (["p", "h1", "h2", "h3", "h4", "h5", "h6", "b", "i", "span", "br", "hr", "strong", "em", "small", "code"].includes(shortcut)) {
      score = 1.0;
    } else if (["div", "a", "img", "ul", "ol", "li", "pre", "header", "footer", "nav", "main", "section", "article"].includes(shortcut)) {
      score = 1.5;
    } else if (["table", "tr", "td", "th", "thead", "tbody", "form", "input", "button", "label", "select", "option", "textarea"].includes(shortcut)) {
      score = 2.5;
    } else if (cat.includes("meta") || ["html", "head", "body", "meta", "link", "title", "script", "style"].includes(shortcut)) {
      score = 3.0;
    } else if (["iframe", "canvas", "svg", "audio", "video", "picture", "source"].includes(shortcut)) {
      score = 4.2;
    } else if (shortcut.includes("emmet") || cat.includes("emmet")) {
      score = 3.5;
    }
  } else if (lang === "css") {
    if (cat.includes("basic") || ["color", "background-color", "font-size", "font-weight", "text-align", "margin", "padding", "border", "width", "height"].includes(shortcut)) {
      score = 1.2;
    } else if (cat.includes("flex") || ["display", "position", "top", "right", "bottom", "left", "z-index", "overflow", "float"].includes(shortcut)) {
      score = 2.8;
    } else if (cat.includes("grid") || ["grid-template-columns", "grid-template-rows", "grid-gap"].includes(shortcut)) {
      score = 3.8;
    } else if (cat.includes("animation") || cat.includes("transform") || ["@keyframes", "transform", "transition", "animation", "clip-path", "filter"].includes(shortcut)) {
      score = 4.5;
    } else if (cat.includes("pseudo") || cat.includes("responsive") || shortcut.startsWith("@media")) {
      score = 3.5;
    } else {
      score = 2.2;
    }
  } else if (lang === "js") {
    if (cat.includes("variable") || ["let", "const", "var", "console.log"].includes(shortcut)) {
      score = 1.5;
    } else if (cat.includes("control") || ["if", "else", "switch", "for", "while"].includes(shortcut)) {
      score = 2.5;
    } else if (cat.includes("array") || cat.includes("string") || ["map", "filter", "reduce", "find", "forEach", "push", "pop"].includes(shortcut)) {
      score = 3.5;
    } else if (cat.includes("dom") || ["document.getelementbyid", "queryselector", "addeventlistener"].includes(shortcut)) {
      score = 3.8;
    } else if (cat.includes("async") || ["fetch", "promise", "async", "await", "then", "catch"].includes(shortcut)) {
      score = 4.8;
    } else {
      score = 3.2;
    }
  }

  // Map to distinct classes
  if (score < 2.0) {
    return { score, label: "Easy", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" };
  } else if (score < 3.8) {
    return { score, label: "Medium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" };
  } else {
    return { score, label: "Hard", color: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20" };
  }
}
