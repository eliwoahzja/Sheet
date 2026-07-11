import { Play, RotateCw, Eye } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Renders a live, sandboxed preview of a documentation example so that CSS
 * animations/transitions actually play and JS snippets actually run.
 *
 * - CSS: applies the example to a demo element inside an <iframe>. Animation,
 *   transition and transform examples are auto-played on a loop; full rules
 *   (selectors) are applied to a small scaffold.
 * - JS: runs the snippet inside a sandboxed iframe and prints console output
 *   plus the value of the final expression.
 * - HTML: renders the markup (scripts disabled).
 *
 * The iframe uses `sandbox` without `allow-same-origin`, so the code runs in an
 * isolated origin and cannot touch the parent app.
 */

const escapeForScript = (s: string) =>
  JSON.stringify(s).replace(/<\/(script)/gi, "<\\/$1").replace(/</g, "\\u003c");

const BASE_CSS = `
  html,body{height:100%;margin:0;box-sizing:border-box;}
  *,*::before,*::after{box-sizing:border-box;}
  body{display:grid;place-items:center;gap:14px;padding:20px;
    background:#f4f1ec;color:#1f1a17;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  .demo{width:110px;height:110px;border-radius:16px;
    background:linear-gradient(135deg,#7c5cff,#4aa3ff);color:#fff;
    display:grid;place-items:center;font-weight:700;font-size:14px;}
  .scaffold{width:100%;max-width:360px;text-align:left;}
  .scaffold h3{margin:.2em 0;}
  .scaffold ul{padding-left:1.1rem;}
  .scaffold a{color:#2965f1;}
  .scaffold button{padding:.4rem .8rem;border-radius:8px;border:1px solid #ccc;background:#fff;}
  .scaffold input{padding:.4rem .6rem;border-radius:8px;border:1px solid #ccc;width:100%;margin-top:.4rem;}
`;

const TOGGLE_SCRIPT = `<script>
  var d=document.querySelector('.demo');
  if(d){setInterval(function(){d.classList.toggle('play');},1300);}
<\/script>`;

function buildCssDoc(example: string): string {
  const kf = example.match(/@keyframes\s+([A-Za-z_][\w-]*)/);
  const isRule = example.includes("{");
  let styles = "";
  let scaffold = `<div class="demo">Demo</div>`;
  let script = "";

  if (kf) {
    styles = `${example}\n.demo{animation:${kf[1]} 1.8s ease-in-out infinite alternate;}`;
  } else if (isRule) {
    styles = example;
    scaffold = `<div class="scaffold">
      <h3>Heading</h3>
      <p>A paragraph with a <a href="#">sample link</a> and some text.</p>
      <ul><li>First item</li><li>Second item</li><li>Third item</li></ul>
      <button>Button</button>
      <input placeholder="Input field" />
    </div>`;
  } else if (/(^|[\s;{])transition\s*:/.test(example)) {
    styles = `.demo{${example}}
      .demo.play{transform:scale(1.2) rotate(6deg);
        background:linear-gradient(135deg,#ff7a59,#ffb703);
        box-shadow:0 14px 34px rgba(0,0,0,.25);opacity:.9;border-radius:50%;}`;
    script = TOGGLE_SCRIPT;
  } else if (/(^|[\s;{])transform\s*:/.test(example)) {
    styles = `.demo{transition:transform .9s ease;} .demo.play{${example}}`;
    script = TOGGLE_SCRIPT;
  } else {
    styles = `.demo{${example}}`;
  }

  return `<!doctype html><html><head><style>${BASE_CSS}\n${styles}</style></head><body>${scaffold}${script}</body></html>`;
}

function buildHtmlDoc(example: string): string {
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:20px;box-sizing:border-box;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      color:#1f1a17;background:#fff;}
    img{max-width:100%;}
  </style></head><body>${example}</body></html>`;
}

function buildJsDoc(example: string): string {
  const code = escapeForScript(example);
  return `<!doctype html><html><head><style>
    html,body{margin:0;height:100%;}
    body{background:#282c34;color:#e6e6e6;margin:0;padding:14px;
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
        var __code=${code};
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

export default function LivePreview({ lang, example }: LivePreviewProps) {
  const [nonce, setNonce] = useState(0);

  const srcDoc = useMemo(() => {
    if (lang === "css") return buildCssDoc(example);
    if (lang === "js") return buildJsDoc(example);
    return buildHtmlDoc(example);
  }, [lang, example]);

  const isJs = lang === "js";
  // HTML preview: fully sandboxed (no scripts). CSS/JS need scripts to
  // animate / run, but never same-origin, so they stay isolated.
  const sandbox = lang === "html" ? "" : "allow-scripts";

  const subtitle =
    lang === "css"
      ? "Styles applied to a live element — animations & transitions play automatically."
      : lang === "js"
        ? "Runs the snippet in a sandbox and prints console output & the final value."
        : "Rendered output of the markup.";

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
        <Eye size={14} className="text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Live Preview
        </span>
        <button
          onClick={() => setNonce((n) => n + 1)}
          className="ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent/10 active:scale-95"
          title={isJs ? "Run again" : "Replay"}
        >
          {isJs ? <Play size={13} /> : <RotateCw size={13} />}
          {isJs ? "Run" : "Replay"}
        </button>
      </div>
      <iframe
        key={nonce}
        title="Live preview"
        sandbox={sandbox}
        srcDoc={srcDoc}
        className={`w-full border-0 ${isJs ? "h-56 bg-[#282c34]" : "h-64 bg-white sm:h-72"}`}
        loading="lazy"
      />
      <p className="border-t border-border bg-secondary/30 px-4 py-2 text-xs text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
