import { Play, RotateCw, Eye, Code2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Renders a live, sandboxed, EDITABLE preview of a documentation example so
 * that CSS animations/transitions actually play and JS snippets actually run
 * -- plus a mini VS Code-style editor so the user can tweak the code and see
 * the preview update in real time.
 *
 * - CSS: applies the code to a demo element inside an <iframe>. Animation,
 *   transition and transform examples are auto-played on a loop; full rules
 *   (selectors) are applied to a small scaffold.
 * - JS: runs the code inside a sandboxed iframe and prints console output
 *   plus the value of the final expression.
 * - HTML: renders the markup (scripts disabled).
 *
 * The iframe uses `sandbox` without `allow-same-origin`, so the code runs in
 * an isolated origin and cannot touch the parent app. The preview iframe's
 * own document is themed dark/light to match the app so it never looks like
 * a jarring white box in dark mode.
 */

const escapeForScript = (s: string) =>
  JSON.stringify(s).replace(/<\/(script)/gi, "<\\/$1").replace(/</g, "\\u003c");

function baseCss(dark: boolean) {
  const bg = dark ? "#1e1e1e" : "#f4f1ec";
  const fg = dark ? "#e6e6e6" : "#1f1a17";
  const cardBorder = dark ? "#3a3a3a" : "#ccc";
  const cardBg = dark ? "#2a2a2a" : "#fff";
  const linkColor = dark ? "#6ea8fe" : "#2965f1";
  return `
    html,body{height:100%;margin:0;box-sizing:border-box;}
    *,*::before,*::after{box-sizing:border-box;}
    body{display:grid;place-items:center;gap:14px;padding:20px;
      background:${bg};color:${fg};
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
    .demo{width:110px;height:110px;border-radius:16px;
      background:linear-gradient(135deg,#7c5cff,#4aa3ff);color:#fff;
      display:grid;place-items:center;font-weight:700;font-size:14px;}
    .scaffold{width:100%;max-width:360px;text-align:left;}
    .scaffold h3{margin:.2em 0;}
    .scaffold ul{padding-left:1.1rem;}
    .scaffold a{color:${linkColor};}
    .scaffold button{padding:.4rem .8rem;border-radius:8px;border:1px solid ${cardBorder};background:${cardBg};color:${fg};}
    .scaffold input{padding:.4rem .6rem;border-radius:8px;border:1px solid ${cardBorder};width:100%;margin-top:.4rem;background:${cardBg};color:${fg};}
  `;
}

const TOGGLE_SCRIPT = `<script>
  var d=document.querySelector('.demo');
  if(d){setInterval(function(){d.classList.toggle('play');},1300);}
<\/script>`;

function buildCssDoc(code: string, dark: boolean): string {
  const kf = code.match(/@keyframes\s+([A-Za-z_][\w-]*)/);
  const isRule = code.includes("{");
  let styles = "";
  let scaffold = `<div class="demo">Demo</div>`;
  let script = "";

  if (kf) {
    styles = `${code}\n.demo{animation:${kf[1]} 1.8s ease-in-out infinite alternate;}`;
  } else if (isRule) {
    styles = code;
    scaffold = `<div class="scaffold">
      <h3>Heading</h3>
      <p>A paragraph with a <a href="#">sample link</a> and some text.</p>
      <ul><li>First item</li><li>Second item</li><li>Third item</li></ul>
      <button>Button</button>
      <input placeholder="Input field" />
    </div>`;
  } else if (/(^|[\s;{])transition\s*:/.test(code)) {
    styles = `.demo{${code}}
      .demo.play{transform:scale(1.2) rotate(6deg);
        background:linear-gradient(135deg,#ff7a59,#ffb703);
        box-shadow:0 14px 34px rgba(0,0,0,.35);opacity:.9;border-radius:50%;}`;
    script = TOGGLE_SCRIPT;
  } else if (/(^|[\s;{])(-webkit-|-moz-|-ms-|-o-)?transform\s*:/.test(code)) {
    styles = `.demo{transition:transform .9s ease;} .demo.play{${code}}`;
    script = TOGGLE_SCRIPT;
  } else if (/(^|[\s;{])(-webkit-)?animation\s*:/.test(code)) {
    styles = `.demo{${code}}`;
  } else {
    styles = `.demo{${code}}`;
  }

  return `<!doctype html><html><head><style>${baseCss(dark)}\n${styles}</style></head><body>${scaffold}${script}</body></html>`;
}

function buildHtmlDoc(code: string, dark: boolean): string {
  const bg = dark ? "#1e1e1e" : "#fff";
  const fg = dark ? "#e6e6e6" : "#1f1a17";
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:20px;box-sizing:border-box;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      color:${fg};background:${bg};}
    a{color:${dark ? "#6ea8fe" : "#2965f1"};}
    img{max-width:100%;}
  </style></head><body>${code}</body></html>`;
}

function buildJsDoc(code: string): string {
  const escaped = escapeForScript(code);
  return `<!doctype html><html><head><style>
    html,body{margin:0;height:100%;}
    body{background:#1e1e1e;color:#e6e6e6;margin:0;padding:14px;
      font-family:'Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.55;}
    .line{white-space:pre-wrap;word-break:break-word;}
    .log{color:#c8ccd4;} .err{color:#ff6b6b;} .res{color:#98c379;} .muted{color:#7f848e;font-style:italic;}
  </style></head><body><div id="out"></div>
  <script>
    (function(){
      var out=document.getElementById('out');
      function fmt(v){
        if(typeof v==='string')return v;
        if(typeof v==='function')return v.toString();
        if(v instanceof Error)return v.name+': '+v.message;
        try{return JSON.stringify(v);}catch(e){return String(v);}
      }
      function print(cls){var a=[].slice.call(arguments,1);
        var el=document.createElement('div');el.className='line '+cls;
        el.textContent=a.map(fmt).join(' ');out.appendChild(el);}
      var console={log:function(){print.apply(null,['log'].concat([].slice.call(arguments)));},
        info:function(){print.apply(null,['log'].concat([].slice.call(arguments)));},
        warn:function(){print.apply(null,['log','\u26a0'].concat([].slice.call(arguments)));},
        error:function(){print.apply(null,['err'].concat([].slice.call(arguments)));},
        table:function(){print.apply(null,['log'].concat([].slice.call(arguments)));}};
      try{
        var __code=${escaped};
        var __result=(0,eval)(__code);
        if(__result!==undefined){print('res','\u27f6 '+fmt(__result));}
      }catch(e){print('err','\u2716 '+(e&&e.message?e.message:e));}
      if(!out.children.length){print('muted','// ran with no output');}
    })();
  <\/script></body></html>`;
}

interface LivePreviewProps {
  lang: string;
  example: string;
}

function extFor(lang: string) {
  if (lang === "js") return "js";
  if (lang === "css") return "css";
  return "html";
}

export default function LivePreview({ lang, example }: LivePreviewProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [code, setCode] = useState(example);
  const [nonce, setNonce] = useState(0);

  // Reset the editable code whenever the underlying doc entry changes.
  useEffect(() => {
    setCode(example);
  }, [example]);

  const srcDoc = useMemo(() => {
    if (lang === "css") return buildCssDoc(code, dark);
    if (lang === "js") return buildJsDoc(code);
    return buildHtmlDoc(code, dark);
  }, [lang, code, dark]);

  const isJs = lang === "js";
  // HTML preview: fully sandboxed (no scripts). CSS/JS need scripts to
  // animate / run, but never same-origin, so they stay isolated.
  const sandbox = lang === "html" ? "" : "allow-scripts";

  const extension = useMemo(() => {
    if (lang === "js") return [javascript()];
    if (lang === "css") return [css()];
    return [html()];
  }, [lang]);

  const subtitle =
    lang === "css"
      ? "Edit the CSS on the left -- animations & transitions play automatically on the right."
      : lang === "js"
        ? "Edit the JS on the left, then Run to see console output & the final value."
        : "Edit the markup on the left to update the rendered output on the right.";

  const reset = () => setCode(example);
  const rerun = () => setNonce((n) => n + 1);

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
        <Eye size={14} className="text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Live Preview
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {code !== example && (
            <button
              onClick={reset}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/10 active:scale-95"
              title="Reset to original example"
            >
              Reset
            </button>
          )}
          <button
            onClick={rerun}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent/10 active:scale-95"
            title={isJs ? "Run again" : "Replay"}
          >
            {isJs ? <Play size={13} /> : <RotateCw size={13} />}
            {isJs ? "Run" : "Replay"}
          </button>
        </div>
      </div>

      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-y-0 md:divide-x">
        {/* Mini editor */}
        <div className="flex flex-col">
          <div
            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono"
            style={{
              backgroundColor: dark ? "#252526" : "#f3f3f3",
              color: dark ? "#9d9d9d" : "#616161",
              borderBottom: `1px solid ${dark ? "#3a3a3a" : "#e0e0e0"}`,
            }}
          >
            <Code2 size={12} />
            editable.{extFor(lang)}
          </div>
          <div className="flex-1 overflow-auto" style={{ backgroundColor: dark ? "#1e1e1e" : "#ffffff" }}>
            <CodeMirror
              value={code}
              onChange={(value) => setCode(value)}
              extensions={extension}
              theme={dark ? vscodeDark : vscodeLight}
              basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
              style={{ fontSize: "0.8rem", height: "100%" }}
              height="240px"
            />
          </div>
        </div>

        {/* Rendered / executed output */}
        <div className="flex flex-col">
          <div
            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono"
            style={{
              backgroundColor: dark ? "#252526" : "#f3f3f3",
              color: dark ? "#9d9d9d" : "#616161",
              borderBottom: `1px solid ${dark ? "#3a3a3a" : "#e0e0e0"}`,
            }}
          >
            <Eye size={12} />
            output
          </div>
          <iframe
            key={`${nonce}-${dark}`}
            title="Live preview"
            sandbox={sandbox}
            srcDoc={srcDoc}
            className="h-[240px] w-full border-0"
            style={{ backgroundColor: isJs ? "#1e1e1e" : dark ? "#1e1e1e" : "#ffffff" }}
            loading="lazy"
          />
        </div>
      </div>

      <p className="border-t border-border bg-secondary/30 px-4 py-2 text-xs text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
