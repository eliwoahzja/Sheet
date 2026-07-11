#!/usr/bin/env python3
"""
Expands client/src/data/structured_content.json with comprehensive HTML / CSS / JS
reference coverage, and adds a `shortcuts` field (vscode + notepadpp) to every
entry describing how to trigger/expand it in VS Code and Notepad++.

Facts used (not fabricated):
- VS Code Emmet: abbreviations are shown in the suggestion list as you type and
  expand on Enter/Tab; Tab-only expansion requires "emmet.triggerExpansionOnTab": true.
  Source: https://code.visualstudio.com/docs/editor/emmet
- Emmet HTML/CSS abbreviation tables: https://github.com/emmetio/emmet (src/snippets/*.json)
- VS Code ships built-in JS snippets (Insert Snippet / IntelliSense) with fixed
  prefixes such as for, forof, forin, forawaitof, function, ifelse, switch,
  while, dowhile, trycatch, class, ctor, import, log/warn/error, throw, new,
  settimeout, setinterval, newpromise, "async function", "async arrow function".
  Source: vscode/extensions/javascript/snippets/javascript.code-snippets
- Notepad++ ships no built-in IntelliSense or Emmet support. Emmet requires the
  third-party "Emmet" plugin (Plugin Manager), and its Expand Abbreviation
  command has NO default keybinding -- it must be mapped manually via
  Settings > Shortcut Mapper > Plugin Commands (commonly bound to Ctrl+Alt+Enter
  or remapped to Tab). Source: https://github.com/AncientIs/npp
  Notepad++'s only native completion aids are Word Completion (Ctrl+Enter) and
  Function Completion, which merely autocomplete words already present in the
  open document(s) -- they do not know HTML tags, CSS properties or JS methods.
"""
import json
import copy

DATA_PATH = "client/src/data/structured_content.json"

# ---------------------------------------------------------------------------
# Real Emmet reference tables (trimmed to what we use below)
# ---------------------------------------------------------------------------

EMMET_HTML_ALIAS = {
    "blockquote": "bq", "figure": "fig", "figcaption": "figc", "picture": "pic",
    "iframe": "ifr", "embed": "emb", "object": "obj", "caption": "cap",
    "colgroup": "colg", "fieldset": "fst", "button": "btn", "optgroup": "optg",
    "textarea": "tarea", "legend": "leg", "section": "sect", "article": "art",
    "header": "hdr", "footer": "ftr", "address": "adr", "strong": "str",
    "progress": "prog", "main": "mn", "template": "tem", "datalist": "datal",
    "keygen": "kg", "output": "out", "details": "det", "summary": "sum",
    "command": "cmd", "dialog": "dlg",
}

# property-name -> shortest known Emmet CSS abbreviation (subset of emmetio/emmet css.json)
EMMET_CSS_ABBR = {
    "display": "d", "position": "pos", "top": "t", "right": "r", "bottom": "b",
    "left": "l", "float": "fl", "clear": "cl", "z-index": "z", "overflow": "ov",
    "overflow-x": "ovx", "overflow-y": "ovy", "visibility": "v",
    "width": "w", "height": "h", "min-width": "miw", "min-height": "mih",
    "max-width": "maw", "max-height": "mah", "margin": "m", "margin-top": "mt",
    "margin-right": "mr", "margin-bottom": "mb", "margin-left": "ml",
    "padding": "p", "padding-top": "pt", "padding-right": "pr",
    "padding-bottom": "pb", "padding-left": "pl", "box-sizing": "bxsz",
    "color": "c", "background": "bg", "background-color": "bgc",
    "background-image": "bgi", "background-position": "bgp",
    "background-repeat": "bgr", "background-size": "bgsz", "opacity": "op",
    "border": "bd", "border-radius": "bdrs", "border-color": "bdc",
    "border-style": "bds", "border-width": "bdw", "outline": "ol",
    "font": "f", "font-family": "ff", "font-size": "fsz", "font-weight": "fw",
    "font-style": "fs", "font-variant": "fv", "line-height": "lh",
    "letter-spacing": "lts", "text-align": "ta", "text-decoration": "td",
    "text-indent": "ti", "text-transform": "tt", "white-space": "whs",
    "vertical-align": "va", "flex": "fx", "flex-direction": "fxd",
    "flex-wrap": "fxw", "flex-grow": "fxg", "flex-shrink": "fxsh",
    "flex-basis": "fxb", "align-items": "ai", "align-content": "ac",
    "align-self": "as", "justify-content": "jc", "justify-items": "ji",
    "justify-self": "js", "order": "ord", "grid-template-columns": "gtc",
    "grid-template-rows": "gtr", "grid-template-areas": "gta",
    "grid-column": "gc", "grid-row": "gr", "grid-gap": "gg",
    "grid-area": "ga", "gap": "g", "row-gap": "rg", "column-gap": "cg",
    "transition": "trs", "transition-property": "trsp",
    "transition-duration": "trsdu", "transition-delay": "trsde",
    "transition-timing-function": "trstf", "animation": "anim",
    "animation-name": "animn", "animation-duration": "animdur",
    "animation-iteration-count": "animic", "animation-direction": "animdir",
    "transform": "trf", "transform-origin": "trfo", "cursor": "cur",
    "list-style": "lis", "list-style-type": "list",
    "list-style-position": "lisp", "resize": "rsz", "user-select": "us",
    "content": "cnt", "quotes": "q", "box-shadow": "bxsh",
    "text-shadow": "tsh", "text-overflow": "tov", "word-break": "wob",
    "word-spacing": "wos", "word-wrap": "wow", "table-layout": "tbl",
    "border-collapse": "bdcl", "border-spacing": "bdsp",
    "backface-visibility": "bfv", "counter-reset": "cor",
    "counter-increment": "coi", "aspect-ratio": "ar",
}

# JS "shortcut" keywords -> real, built-in VS Code JS snippet prefix
# (vscode/extensions/javascript/snippets/javascript.code-snippets)
VSCODE_JS_SNIPPETS = {
    "for loop": "for", "for...of": "forof", "for...in": "forin",
    "for await...of": "forawaitof", "for-await-of": "forawaitof",
    "function declaration": "function", "function": "function",
    "if statement": "if", "if / else": "ifelse", "if/else": "ifelse",
    "switch statement": "switch", "switch": "switch",
    "while loop": "while", "while": "while",
    "do...while": "dowhile", "do while": "dowhile",
    "try / catch": "trycatch", "try...catch": "trycatch", "try/catch": "trycatch",
    "class": "class", "class declaration": "class",
    "constructor": "ctor", "import": "import", "import statement": "import",
    "console.log": "log", "console.warn": "warn", "console.error": "error",
    "throw": "throw", "throw statement": "throw",
    "new": "new", "new instance": "new",
    "settimeout()": "settimeout", "setTimeout()": "settimeout",
    "setinterval()": "setinterval", "setInterval()": "setinterval",
    "new promise()": "newpromise", "new Promise()": "newpromise",
    "async function": "async function",
    "async arrow function": "async arrow function",
    "foreach arrow": "foreach =>", "arr.foreach()": "foreach =>",
}


def html_element_shortcuts(tag):
    alias = EMMET_HTML_ALIAS.get(tag.strip("<>/"))
    tag_clean = tag.strip("<>/")
    if alias:
        vscode = (
            "Type `%s` (the Emmet alias) or the full tag name `%s`, then press Tab "
            "(with the VS Code setting \"emmet.triggerExpansionOnTab\": true) -- or "
            "pick the Emmet suggestion from the completion list and press Enter -- "
            "to expand it to `<%s></%s>`." % (alias, tag_clean, tag_clean, tag_clean)
        )
    else:
        vscode = (
            "Type `%s`, then press Tab (with \"emmet.triggerExpansionOnTab\": true "
            "enabled) or select the Emmet suggestion from the IntelliSense list and "
            "press Enter/Tab to expand it to `<%s></%s>`." % (tag_clean, tag_clean, tag_clean)
        )
    notepadpp = (
        "Notepad++ has no HTML IntelliSense by default. Install the third-party "
        "\"Emmet\" plugin (Plugins > Plugin Manager), then map a key to its "
        "\"Expand Abbreviation\" command under Settings > Shortcut Mapper > Plugin "
        "Commands (it has no default shortcut -- Ctrl+Alt+Enter or a remapped Tab "
        "are common choices). Type `%s%s` and press that key to expand it to "
        "`<%s></%s>`." % (alias + " or " if alias else "", tag_clean, tag_clean, tag_clean)
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def html_attr_shortcuts(attr, emmet_snippet=None):
    if emmet_snippet:
        vscode = (
            "Inside an opening tag, type the Emmet snippet `%s` and press Tab/Enter "
            "to insert the `%s` attribute with its expected values pre-filled, or "
            "just type `%s` and accept it from VS Code's native HTML attribute "
            "IntelliSense." % (emmet_snippet, attr, attr)
        )
    else:
        vscode = (
            "Inside an opening tag, start typing `%s` -- VS Code's built-in HTML "
            "IntelliSense will suggest it; press Enter/Tab to accept." % attr
        )
    notepadpp = (
        "Notepad++ has no built-in HTML attribute IntelliSense. Type `%s=\"\"` "
        "manually, or (with the Emmet plugin installed and an Expand Abbreviation "
        "key mapped) type `tag[%s]` and press that key to insert it." % (attr, attr)
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def html_entity_shortcuts(entity):
    vscode = (
        "Type `&` inside text content -- VS Code's HTML language suggestions will "
        "list matching entities (e.g. `%s`); select it and press Enter to insert it." % entity
    )
    notepadpp = (
        "Notepad++ has no entity autocomplete. Type `%s` out in full, or use "
        "Word Completion (Ctrl+Enter) once the entity has already appeared "
        "elsewhere in the open document." % entity
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def emmet_abbrev_self_shortcuts(abbr, lang="html"):
    abbr_clean = abbr.strip("`")
    vscode = (
        "Type `%s` in a %s file, then press Tab (with "
        "\"emmet.triggerExpansionOnTab\": true) or Enter on the Emmet suggestion "
        "to expand it in place." % (abbr_clean, "markup" if lang == "html" else "stylesheet")
    )
    notepadpp = (
        "With the third-party Emmet plugin installed and its \"Expand "
        "Abbreviation\" command mapped to a key (Settings > Shortcut Mapper > "
        "Plugin Commands -- no default binding exists), type `%s` and press that "
        "key to expand it." % abbr_clean
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def css_property_shortcuts(prop):
    abbr = EMMET_CSS_ABBR.get(prop)
    if abbr:
        vscode = (
            "Type the Emmet abbreviation `%s` in a CSS rule and press Tab/Enter to "
            "expand it to `%s: ;` with the cursor ready for a value, or just start "
            "typing `%s` and accept VS Code's native CSS IntelliSense "
            "suggestion." % (abbr, prop, prop)
        )
        notepadpp = (
            "With the Emmet plugin installed and its Expand Abbreviation key mapped "
            "(no default binding), type `%s` and press that key to expand it to "
            "`%s: ;`. Otherwise type the property manually -- Notepad++ has no "
            "native CSS property IntelliSense." % (abbr, prop)
        )
    else:
        vscode = (
            "Start typing `%s` in a CSS rule -- VS Code's native CSS IntelliSense "
            "will suggest the property; press Enter/Tab to accept it (Ctrl+Space "
            "to force the suggestion list)." % prop
        )
        notepadpp = (
            "Notepad++ has no CSS property IntelliSense. Type `%s` manually, or use "
            "Word Completion (Ctrl+Enter) once it has appeared earlier in the "
            "document." % prop
        )
    return {"vscode": vscode, "notepadpp": notepadpp}


def css_selector_shortcuts(sel):
    vscode = (
        "VS Code's CSS language service lists `%s` in the completion popup as you "
        "type inside a stylesheet; select it and press Enter. There is no Emmet "
        "shortcut for pseudo-selectors -- they are typed directly." % sel
    )
    notepadpp = (
        "Notepad++ has no CSS selector autocomplete; type `%s` manually." % sel
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def js_builtin_shortcuts(name):
    vscode = (
        "There is no Emmet-style abbreviation for `%s`. In VS Code, type the "
        "object/value followed by `.`, then choose `%s` from the IntelliSense "
        "suggestion list (powered by the built-in TypeScript/JavaScript language "
        "service) and press Enter/Tab to insert it." % (name, name)
    )
    notepadpp = (
        "Notepad++ has no JavaScript IntelliSense, so `%s` must be typed out in "
        "full. Word Completion (Ctrl+Enter) can finish it automatically once it "
        "has already been typed once elsewhere in the open document." % name
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def js_snippet_shortcuts(name, prefix):
    vscode = (
        "Type the built-in VS Code snippet prefix `%s` and press Tab/Enter on the "
        "suggestion to expand it into a full `%s` block with tab-stops for each "
        "part." % (prefix, name)
    )
    notepadpp = (
        "Notepad++ ships no snippet for this. You can create your own reusable "
        "snippet via Macro > Start/Stop Recording (assign it to a shortcut in "
        "the Macro menu), or simply type the `%s` construct manually." % name
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def js_shortcuts_for(shortcut, cat):
    key = shortcut.lower().strip()
    for label, prefix in VSCODE_JS_SNIPPETS.items():
        if label.split()[0].rstrip("()") in key or key in label:
            return js_snippet_shortcuts(shortcut, prefix)
    if cat in ("Control Flow", "Functions", "Classes", "Modules", "Error Handling"):
        # generic but honest fallback for constructs without an exact built-in prefix
        vscode = (
            "VS Code doesn't ship a single-word Emmet abbreviation for this "
            "construct. Start typing it (e.g. the first keyword) and accept the "
            "matching suggestion from IntelliSense, or use Insert Snippet "
            "(Ctrl+Shift+P > \"Insert Snippet\") if you've defined a custom one."
        )
        notepadpp = (
            "Notepad++ has no JavaScript snippets built in. Type the construct "
            "manually, or record it once as a Macro (Macro > Start Recording) and "
            "bind that macro to a shortcut for reuse."
        )
        return {"vscode": vscode, "notepadpp": notepadpp}
    return js_builtin_shortcuts(shortcut)


# ---------------------------------------------------------------------------
# Content generation helpers (mirrors the style of parse_content.py)
# ---------------------------------------------------------------------------

def make_item(lang, cat, shortcut, desc, example, what_it_does=None, syntax=None, use_case=None, shortcuts=None):
    item = {
        "lang": lang,
        "cat": cat,
        "shortcut": shortcut,
        "desc": desc,
        "example": example,
    }
    item["whatItDoes"] = what_it_does or desc
    item["syntax"] = syntax or example.split("\n")[0]
    item["useCase"] = use_case or desc
    if shortcuts:
        item["shortcuts"] = shortcuts
    return item


def load_existing():
    with open(DATA_PATH, "r") as f:
        return json.load(f)


def key_of(item):
    return (item["lang"], item["cat"], item["shortcut"])


# ---------------------------------------------------------------------------
# 1) HTML ELEMENTS -- full MDN element list, grouped by MDN category
#    (name, one-line description, example)
# ---------------------------------------------------------------------------

HTML_ELEMENTS = [
    ("<html>", "Root element wrapping the entire document.", "<html lang=\"en\">...</html>"),
    ("<base>", "Sets the base URL for all relative URLs in the document.", "<base href=\"https://example.com/\">"),
    ("<title>", "Sets the document title shown in the browser tab.", "<title>My Page</title>"),
    ("<address>", "Marks up contact information for a person, people, or organization.", "<address>Contact us at info@example.com</address>"),
    ("<footer>", "Footer for its nearest sectioning ancestor: author, copyright, related links.", "<footer>&copy; 2026 Company</footer>"),
    ("<h1>", "Top-level section heading.", "<h1>Page Title</h1>"),
    ("<h2>", "Second-level section heading.", "<h2>Section Title</h2>"),
    ("<h3>", "Third-level section heading.", "<h3>Subsection Title</h3>"),
    ("<h4>", "Fourth-level section heading.", "<h4>Minor Heading</h4>"),
    ("<h5>", "Fifth-level section heading.", "<h5>Small Heading</h5>"),
    ("<h6>", "Sixth (lowest) level section heading.", "<h6>Smallest Heading</h6>"),
    ("<hgroup>", "Groups a heading with related secondary content like a subtitle.", "<hgroup><h1>Title</h1><p>Subtitle</p></hgroup>"),
    ("<nav>", "Section containing primary navigation links.", "<nav><a href=\"/\">Home</a></nav>"),
    ("<search>", "Groups a set of form controls or content used for searching/filtering.", "<search><input type=\"search\"></search>"),
    ("<blockquote>", "Marks an extended quotation, usually rendered as an indented block.", "<blockquote cite=\"url\">Quoted text</blockquote>"),
    ("<dd>", "Provides the description/value for a preceding <dt> term.", "<dl><dt>HTML</dt><dd>HyperText Markup Language</dd></dl>"),
    ("<dl>", "A description list of term/description pairs.", "<dl><dt>Term</dt><dd>Definition</dd></dl>"),
    ("<dt>", "A term in a description list, followed by a <dd>.", "<dt>CSS</dt>"),
    ("<menu>", "Semantic alternative to <ul>, treated the same by browsers.", "<menu><li>Item</li></menu>"),
    ("<ol>", "An ordered (numbered) list.", "<ol><li>First</li><li>Second</li></ol>"),
    ("<pre>", "Preformatted text rendered exactly as written, in a monospace font.", "<pre>  indented\n  text</pre>"),
    ("<ul>", "An unordered (bulleted) list.", "<ul><li>Item one</li><li>Item two</li></ul>"),
    ("<abbr>", "Marks an abbreviation or acronym; use the title attribute for the full form.", "<abbr title=\"HyperText Markup Language\">HTML</abbr>"),
    ("<b>", "Draws attention to text without implying extra importance (use CSS font-weight for styling).", "<b>Keyword</b>"),
    ("<bdi>", "Isolates text whose directionality is unknown from the surrounding text.", "<bdi>اسم المستخدم</bdi>"),
    ("<bdo>", "Overrides the current text direction.", "<bdo dir=\"rtl\">Text</bdo>"),
    ("<cite>", "Marks the title of a referenced creative work.", "<cite>The Hobbit</cite>"),
    ("<code>", "Marks a short fragment of computer code, rendered in monospace.", "<code>const x = 1;</code>"),
    ("<data>", "Links content with a machine-readable value.", "<data value=\"21053\">Model 21053</data>"),
    ("<dfn>", "Marks the term being defined within a definition sentence.", "<dfn>DOM</dfn> is the Document Object Model."),
    ("<em>", "Marks stressed emphasis; can be nested for stronger emphasis.", "<em>really</em> important"),
    ("<i>", "Marks text in an alternate voice/mood, such as technical terms or foreign words.", "<i>lingua franca</i>"),
    ("<kbd>", "Marks textual user input from a keyboard or similar device.", "Press <kbd>Ctrl</kbd>+<kbd>C</kbd>"),
    ("<mark>", "Highlights text for reference or notation purposes.", "<mark>highlighted</mark> text"),
    ("<q>", "A short inline quotation, rendered with quotation marks.", "<q>To be or not to be</q>"),
    ("<rp>", "Provides fallback parentheses for ruby annotations in unsupported browsers.", "<ruby>漢<rp>(</rp><rt>Kan</rt><rp>)</rp></ruby>"),
    ("<rt>", "The pronunciation/translation text of a ruby annotation.", "<rt>Kan</rt>"),
    ("<ruby>", "Renders small annotations above/below base text, for East Asian typography.", "<ruby>漢<rt>Kan</rt></ruby>"),
    ("<s>", "Renders text with a strikethrough, indicating it is no longer relevant.", "<s>$50</s> $30"),
    ("<samp>", "Encloses sample output from a computer program.", "<samp>File not found</samp>"),
    ("<small>", "Represents side-comments and small print, rendered one size smaller.", "<small>Terms apply</small>"),
    ("<strong>", "Indicates strong importance; typically rendered bold.", "<strong>Warning:</strong> Do not proceed"),
    ("<sub>", "Renders text as subscript.", "H<sub>2</sub>O"),
    ("<sup>", "Renders text as superscript.", "x<sup>2</sup>"),
    ("<time>", "Represents a specific date/time, with an optional machine-readable datetime.", "<time datetime=\"2026-07-11\">July 11</time>"),
    ("<u>", "Renders an unarticulated, non-textual annotation, by default an underline.", "<u>Misspelled</u>"),
    ("<var>", "Represents the name of a variable in a mathematical or programming context.", "<var>x</var> = 5"),
    ("<wbr>", "Marks an optional line-break opportunity within text.", "supercalifragilistic<wbr>expialidocious"),
    ("<area>", "Defines a clickable region inside an <img> that uses a <map>.", "<area shape=\"rect\" coords=\"0,0,50,50\" href=\"#\">"),
    ("<audio>", "Embeds sound content with one or more sources.", "<audio controls src=\"song.mp3\"></audio>"),
    ("<map>", "Defines an image map used together with <area> elements.", "<map name=\"map\"><area ...></map>"),
    ("<track>", "Specifies timed text tracks (e.g. subtitles) for <audio>/<video>.", "<track src=\"subs.vtt\" kind=\"subtitles\">"),
    ("<video>", "Embeds a video player, with optional multiple <source> elements.", "<video controls src=\"movie.mp4\"></video>"),
    ("<embed>", "Embeds external content provided by a plugin or browser feature.", "<embed src=\"file.pdf\">"),
    ("<iframe>", "Embeds another HTML page as a nested browsing context.", "<iframe src=\"https://example.com\"></iframe>"),
    ("<object>", "Embeds an external resource treated as an image, nested browsing context, or plugin-handled content.", "<object data=\"file.pdf\" type=\"application/pdf\"></object>"),
    ("<source>", "Specifies alternative media resources for <picture>, <audio>, or <video>.", "<source srcset=\"img.webp\" type=\"image/webp\">"),
    ("<svg>", "Defines a coordinate system/viewport for embedding Scalable Vector Graphics.", "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\"/></svg>"),
    ("<math>", "Top-level element for embedding MathML content.", "<math><mi>x</mi></math>"),
    ("<canvas>", "A drawable region used with the Canvas API or WebGL for graphics/animation.", "<canvas id=\"c\" width=\"200\" height=\"100\"></canvas>"),
    ("<noscript>", "Content shown when scripting is disabled or unsupported.", "<noscript>Please enable JavaScript.</noscript>"),
    ("<del>", "Marks text that has been deleted from the document.", "<del>old price</del>"),
    ("<ins>", "Marks text that has been added to the document.", "<ins>new price</ins>"),
    ("<caption>", "Specifies the caption/title of a <table>.", "<table><caption>Sales</caption>...</table>"),
    ("<col>", "Defines properties for one or more columns in a <colgroup>.", "<colgroup><col span=\"2\"></colgroup>"),
    ("<colgroup>", "Defines a group of columns within a table.", "<colgroup><col></colgroup>"),
    ("<table>", "Represents tabular data as rows and columns of cells.", "<table><tr><td>1</td></tr></table>"),
    ("<tbody>", "Groups the main body rows of a table's data.", "<tbody><tr><td>Row</td></tr></tbody>"),
    ("<td>", "A single data cell within a table row.", "<td>Cell value</td>"),
    ("<tfoot>", "Groups the footer rows summarizing a table's columns.", "<tfoot><tr><td>Total</td></tr></tfoot>"),
    ("<th>", "A header cell within a table row.", "<th scope=\"col\">Name</th>"),
    ("<thead>", "Groups the header rows describing a table's columns.", "<thead><tr><th>Name</th></tr></thead>"),
    ("<tr>", "Defines a row of cells within a table.", "<tr><td>A</td><td>B</td></tr>"),
    ("<button>", "An interactive control that performs an action when activated.", "<button type=\"submit\">Send</button>"),
    ("<datalist>", "Holds a set of <option> elements suggested for an <input>.", "<datalist id=\"colors\"><option value=\"Red\"></datalist>"),
    ("<fieldset>", "Groups related form controls and labels together.", "<fieldset><legend>Contact</legend>...</fieldset>"),
    ("<form>", "A section containing interactive controls for submitting information.", "<form action=\"/submit\" method=\"post\">...</form>"),
    ("<label>", "A caption for an item in a user interface, associated with a form control.", "<label for=\"email\">Email</label>"),
    ("<legend>", "A caption for the content of its parent <fieldset>.", "<legend>Personal Info</legend>"),
    ("<meter>", "Represents a scalar value within a known range, like disk usage.", "<meter value=\"0.6\" min=\"0\" max=\"1\"></meter>"),
    ("<optgroup>", "Groups related <option> elements within a <select>.", "<optgroup label=\"Fruits\"><option>Apple</option></optgroup>"),
    ("<option>", "A single item within a <select>, <optgroup>, or <datalist>.", "<option value=\"1\">One</option>"),
    ("<output>", "Container for injecting the result of a calculation or user action.", "<output name=\"result\">42</output>"),
    ("<progress>", "Displays completion progress of a task as a progress bar.", "<progress value=\"70\" max=\"100\"></progress>"),
    ("<select>", "A control offering a menu of options to choose from.", "<select><option>One</option></select>"),
    ("<textarea>", "A multi-line plain-text editing control.", "<textarea rows=\"4\" cols=\"40\"></textarea>"),
    ("<details>", "Creates a disclosure widget that is toggled open/closed.", "<details><summary>More</summary>Hidden</details>"),
    ("<dialog>", "Represents a dialog box or other interactive component.", "<dialog open>Message</dialog>"),
    ("<summary>", "Provides the summary/label for a <details> disclosure box.", "<summary>Click to expand</summary>"),
    ("<slot>", "A placeholder inside a web component that can be filled with markup.", "<slot name=\"header\"></slot>"),
    ("<template>", "Holds HTML that isn't rendered immediately but can be cloned via JS.", "<template id=\"row\"><tr><td></td></tr></template>"),
]

# ---------------------------------------------------------------------------
# 2) HTML GLOBAL & ELEMENT-SPECIFIC ATTRIBUTES
# ---------------------------------------------------------------------------

HTML_ATTRIBUTES = [
    ("class", "Assigns one or more class names for CSS/JS targeting.", "<div class=\"card active\"></div>", None),
    ("id", "Assigns a unique identifier to an element.", "<div id=\"main\"></div>", None),
    ("style", "Applies inline CSS styles directly to an element.", "<p style=\"color:red\">Text</p>", None),
    ("title", "Provides advisory text shown as a tooltip on hover.", "<abbr title=\"World Health Organization\">WHO</abbr>", None),
    ("lang", "Declares the language of the element's content.", "<html lang=\"en\">", None),
    ("dir", "Sets text direction: ltr, rtl, or auto.", "<p dir=\"rtl\">مرحبا</p>", None),
    ("hidden", "Hides the element from rendering while keeping it in the DOM.", "<div hidden>Not shown</div>", None),
    ("tabindex", "Controls whether/how an element participates in keyboard tab order.", "<div tabindex=\"0\">Focusable</div>", None),
    ("contenteditable", "Makes the element's content directly editable by the user.", "<div contenteditable=\"true\">Edit me</div>", None),
    ("draggable", "Indicates whether the element can be dragged.", "<img draggable=\"true\" src=\"x.png\">", None),
    ("spellcheck", "Indicates whether spell-checking is enabled for the element.", "<textarea spellcheck=\"false\"></textarea>", None),
    ("data-*", "Stores custom private data on an element, readable via JS dataset.", "<li data-id=\"42\">Item</li>", None),
    ("accesskey", "Defines a keyboard shortcut to activate/focus the element.", "<button accesskey=\"s\">Save</button>", None),
    ("role", "Defines an explicit ARIA role for assistive technologies.", "<div role=\"button\">Click</div>", None),
    ("aria-label", "Provides an accessible name when visible text isn't sufficient.", "<button aria-label=\"Close\">&times;</button>", None),
    ("href", "The URL a hyperlink points to.", "<a href=\"https://example.com\">Link</a>", "a[href]"),
    ("target", "Where to open the linked document (e.g. _blank).", "<a href=\"url\" target=\"_blank\">Link</a>", None),
    ("rel", "Specifies the relationship between the current document and the linked resource.", "<link rel=\"stylesheet\" href=\"style.css\">", None),
    ("src", "The URL of embeddable content such as an image, script, or media file.", "<img src=\"photo.jpg\">", "img[src]"),
    ("alt", "Alternative text describing an image, for accessibility and fallback.", "<img src=\"cat.jpg\" alt=\"A sleeping cat\">", None),
    ("width", "Sets the intrinsic width for elements like img/canvas/video.", "<img src=\"x.jpg\" width=\"200\">", None),
    ("height", "Sets the intrinsic height for elements like img/canvas/video.", "<img src=\"x.jpg\" height=\"150\">", None),
    ("loading", "Controls whether an image/iframe loads lazily or eagerly.", "<img src=\"x.jpg\" loading=\"lazy\">", None),
    ("srcset", "Lists responsive image candidates for the browser to choose from.", "<img srcset=\"s.jpg 480w, l.jpg 800w\" src=\"l.jpg\">", "img:srcset"),
    ("sizes", "Describes the display size of an image for use with srcset.", "<img sizes=\"(max-width:600px) 480px\" srcset=\"...\">", None),
    ("type", "Specifies the type of an <input>, <button>, <script>, or <link>.", "<input type=\"email\">", None),
    ("name", "Identifies form controls when submitted, or names a frame/window.", "<input type=\"text\" name=\"username\">", None),
    ("value", "Sets the default/current value of a form control.", "<input type=\"text\" value=\"Hello\">", None),
    ("placeholder", "Shows hint text in an empty input/textarea.", "<input placeholder=\"Enter your name\">", "input:placeholder"),
    ("required", "Marks a form field as mandatory before submission.", "<input required>", None),
    ("disabled", "Disables a form control so it can't be interacted with.", "<button disabled>Can't click</button>", None),
    ("readonly", "Makes an input/textarea non-editable but still submittable.", "<input readonly value=\"Fixed\">", None),
    ("checked", "Marks a checkbox/radio as selected by default.", "<input type=\"checkbox\" checked>", None),
    ("multiple", "Allows multiple values in a file/email input or select.", "<input type=\"file\" multiple>", None),
    ("autofocus", "Automatically focuses the element when the page loads.", "<input autofocus>", None),
    ("autocomplete", "Hints whether the browser may auto-fill a field's value.", "<input autocomplete=\"off\">", None),
    ("pattern", "A regular expression the input's value must match to be valid.", "<input pattern=\"[0-9]{5}\">", None),
    ("min", "The minimum allowed value for a numeric/date/range input.", "<input type=\"number\" min=\"0\">", None),
    ("max", "The maximum allowed value for a numeric/date/range input.", "<input type=\"number\" max=\"100\">", None),
    ("step", "The interval of legal values for a numeric/range input.", "<input type=\"number\" step=\"5\">", None),
    ("maxlength", "The maximum number of characters allowed in an input/textarea.", "<input maxlength=\"20\">", None),
    ("for", "Associates a <label> with a form control by id.", "<label for=\"email\">Email</label>", None),
    ("action", "The URL a <form> submits its data to.", "<form action=\"/login\">", "form"),
    ("method", "The HTTP method (GET/POST) a form uses to submit.", "<form method=\"post\">", "form:post"),
    ("enctype", "The encoding type used when submitting a form via POST.", "<form enctype=\"multipart/form-data\">", None),
    ("colspan", "The number of columns a table cell should span.", "<td colspan=\"2\">Merged</td>", None),
    ("rowspan", "The number of rows a table cell should span.", "<td rowspan=\"2\">Tall cell</td>", None),
    ("charset", "Declares the character encoding of the document.", "<meta charset=\"UTF-8\">", "meta:utf"),
    ("content", "The value paired with a <meta> element's name/http-equiv.", "<meta name=\"description\" content=\"...\">", "meta:desc"),
    ("async", "Runs an external script asynchronously without blocking parsing.", "<script async src=\"a.js\"></script>", None),
    ("defer", "Runs a script only after the document has been parsed.", "<script defer src=\"a.js\"></script>", None),
    ("crossorigin", "Configures CORS requests for the element's fetched resource.", "<script crossorigin src=\"cdn.js\"></script>", None),
    ("integrity", "Provides a Subresource Integrity hash to verify a fetched resource.", "<script integrity=\"sha384-...\" src=\"cdn.js\"></script>", None),
    ("download", "Marks a hyperlink to be downloaded rather than navigated to.", "<a href=\"file.pdf\" download>Download</a>", None),
    ("open", "Indicates a <details>/<dialog> is currently visible/active.", "<details open>...</details>", None),
    ("novalidate", "Skips built-in form validation on submit.", "<form novalidate>", None),
]

# ---------------------------------------------------------------------------
# 3) HTML ENTITIES (additional, beyond the existing 26)
# ---------------------------------------------------------------------------

HTML_ENTITIES_EXTRA = [
    ("&mdash;", "Em dash —", "Long dash for breaks in thought"),
    ("&ndash;", "En dash –", "Ranges, e.g. 2020–2024"),
    ("&laquo;", "Left angle quote «", "European-style opening quote"),
    ("&raquo;", "Right angle quote »", "European-style closing quote"),
    ("&middot;", "Middle dot ·", "Separator in menus or lists"),
    ("&frac12;", "One half ½", "Fractions in text"),
    ("&frac14;", "One quarter ¼", "Fractions in text"),
    ("&sup2;", "Superscript two ²", "Squared units, e.g. m²"),
    ("&sup3;", "Superscript three ³", "Cubed units, e.g. m³"),
    ("&plusmn;", "Plus-minus ±", "Tolerances and ranges"),
    ("&infin;", "Infinity ∞", "Mathematical notation"),
    ("&spades;", "Spade suit ♠", "Card game symbols"),
    ("&hearts;", "Heart suit ♥", "Card game or favorite symbols"),
    ("&check;", "Check mark ✓", "Indicating success or completion"),
    ("&cross;", "Cross mark ✗", "Indicating failure or rejection"),
    ("&star;", "Star ★", "Ratings and favorites"),
]

# ---------------------------------------------------------------------------
# 4) CSS PROPERTIES -- comprehensive, categorized
# ---------------------------------------------------------------------------

CSS_PROPERTIES = [
    ("Box Model", "width", "Sets the content width of an element.", "width: 320px;"),
    ("Box Model", "height", "Sets the content height of an element.", "height: 200px;"),
    ("Box Model", "min-width", "Sets the minimum allowed width.", "min-width: 120px;"),
    ("Box Model", "max-width", "Sets the maximum allowed width.", "max-width: 100%;"),
    ("Box Model", "min-height", "Sets the minimum allowed height.", "min-height: 100vh;"),
    ("Box Model", "max-height", "Sets the maximum allowed height.", "max-height: 400px;"),
    ("Box Model", "margin", "Sets space outside an element's border on all sides.", "margin: 16px;"),
    ("Box Model", "padding", "Sets space inside an element's border, around its content.", "padding: 12px 20px;"),
    ("Box Model", "box-sizing", "Determines whether padding/border are included in width/height.", "box-sizing: border-box;"),
    ("Box Model", "outline", "Draws a line around an element outside its border, often for focus states.", "outline: 2px solid blue;"),
    ("Positioning", "position", "Sets how an element is positioned: static, relative, absolute, fixed, sticky.", "position: relative;"),
    ("Positioning", "top", "Offsets a positioned element from the top edge.", "top: 0;"),
    ("Positioning", "right", "Offsets a positioned element from the right edge.", "right: 0;"),
    ("Positioning", "bottom", "Offsets a positioned element from the bottom edge.", "bottom: 0;"),
    ("Positioning", "left", "Offsets a positioned element from the left edge.", "left: 0;"),
    ("Positioning", "z-index", "Controls the stacking order of positioned elements.", "z-index: 10;"),
    ("Positioning", "float", "Floats an element to the left or right of its container.", "float: left;"),
    ("Positioning", "clear", "Stops an element from wrapping around floated elements.", "clear: both;"),
    ("Display & Visibility", "display", "Sets how an element generates boxes: block, inline, flex, grid, none...", "display: flex;"),
    ("Display & Visibility", "visibility", "Hides an element while it still takes up layout space.", "visibility: hidden;"),
    ("Display & Visibility", "overflow", "Controls what happens to content that overflows its box.", "overflow: auto;"),
    ("Display & Visibility", "overflow-x", "Controls horizontal overflow behavior.", "overflow-x: hidden;"),
    ("Display & Visibility", "overflow-y", "Controls vertical overflow behavior.", "overflow-y: scroll;"),
    ("Flexbox", "flex-direction", "Sets the main axis direction of a flex container.", "flex-direction: column;"),
    ("Flexbox", "flex-wrap", "Controls whether flex items wrap onto multiple lines.", "flex-wrap: wrap;"),
    ("Flexbox", "flex-grow", "Sets how much a flex item grows relative to its siblings.", "flex-grow: 1;"),
    ("Flexbox", "flex-shrink", "Sets how much a flex item shrinks relative to its siblings.", "flex-shrink: 0;"),
    ("Flexbox", "flex-basis", "Sets the initial main size of a flex item.", "flex-basis: 200px;"),
    ("Flexbox", "align-items", "Aligns flex/grid items along the cross axis.", "align-items: center;"),
    ("Flexbox", "align-content", "Aligns flex lines within the container when there is extra space.", "align-content: space-between;"),
    ("Flexbox", "align-self", "Overrides align-items for a single flex/grid item.", "align-self: flex-end;"),
    ("Flexbox", "justify-content", "Aligns flex/grid items along the main axis.", "justify-content: space-between;"),
    ("Grid", "grid-template-columns", "Defines the size and number of grid columns.", "grid-template-columns: repeat(3, 1fr);"),
    ("Grid", "grid-template-rows", "Defines the size and number of grid rows.", "grid-template-rows: auto 1fr;"),
    ("Grid", "grid-template-areas", "Names grid regions for placing items by area name.", "grid-template-areas: \"header header\" \"sidebar main\";"),
    ("Grid", "grid-column", "Shorthand to place an item across grid columns.", "grid-column: 1 / 3;"),
    ("Grid", "grid-row", "Shorthand to place an item across grid rows.", "grid-row: 1 / 2;"),
    ("Grid", "grid-area", "Places an item into a named grid area.", "grid-area: header;"),
    ("Grid", "gap", "Sets spacing between grid/flex rows and columns.", "gap: 16px;"),
    ("Typography", "font-family", "Sets the typeface(s) used for text.", "font-family: 'Inter', sans-serif;"),
    ("Typography", "font-size", "Sets the size of text.", "font-size: 1.125rem;"),
    ("Typography", "font-weight", "Sets the thickness/boldness of text.", "font-weight: 600;"),
    ("Typography", "font-style", "Sets italic/oblique/normal text style.", "font-style: italic;"),
    ("Typography", "line-height", "Sets the height of a line of text.", "line-height: 1.5;"),
    ("Typography", "letter-spacing", "Adjusts spacing between characters.", "letter-spacing: 0.05em;"),
    ("Typography", "text-align", "Aligns text horizontally within its container.", "text-align: center;"),
    ("Typography", "text-decoration", "Adds/removes underline, overline, or strikethrough.", "text-decoration: underline;"),
    ("Typography", "text-indent", "Indents the first line of a text block.", "text-indent: 2em;"),
    ("Typography", "white-space", "Controls how whitespace and line breaks are handled.", "white-space: nowrap;"),
    ("Typography", "vertical-align", "Aligns inline/table-cell content vertically.", "vertical-align: middle;"),
    ("Visual", "color", "Sets the text (foreground) color.", "color: #1a1a1a;"),
    ("Visual", "background-color", "Sets the background color of an element.", "background-color: #f5f1ed;"),
    ("Visual", "background-image", "Sets one or more background images.", "background-image: url('bg.png');"),
    ("Visual", "background-position", "Positions a background image within its box.", "background-position: center;"),
    ("Visual", "background-repeat", "Controls how a background image repeats.", "background-repeat: no-repeat;"),
    ("Visual", "background-size", "Sizes a background image, e.g. cover or contain.", "background-size: cover;"),
    ("Visual", "opacity", "Sets the transparency of an element (0 to 1).", "opacity: 0.75;"),
    ("Visual", "border", "Shorthand for border-width, style, and color.", "border: 1px solid #ccc;"),
    ("Visual", "border-radius", "Rounds the corners of an element's box.", "border-radius: 8px;"),
    ("Visual", "cursor", "Sets the mouse cursor shown when hovering an element.", "cursor: pointer;"),
    ("Visual", "filter", "Applies graphical effects like blur or grayscale.", "filter: grayscale(1);"),
    ("Visual", "object-fit", "Controls how a replaced element (img/video) fits its box.", "object-fit: cover;"),
    ("Lists & Tables", "list-style", "Shorthand for list marker type, position, and image.", "list-style: none;"),
    ("Lists & Tables", "list-style-type", "Sets the marker shape/type for list items.", "list-style-type: square;"),
    ("Lists & Tables", "table-layout", "Sets the table layout algorithm: auto or fixed.", "table-layout: fixed;"),
    ("Lists & Tables", "border-collapse", "Merges or separates table cell borders.", "border-collapse: collapse;"),
]

# ---------------------------------------------------------------------------
# 5) CSS SELECTORS / PSEUDO-CLASSES (no Emmet mapping -- typed directly)
# ---------------------------------------------------------------------------

CSS_SELECTORS = [
    (":hover", "Matches an element while the pointer is hovering over it.", "a:hover { color: red; }"),
    (":focus", "Matches an element while it has keyboard focus.", "input:focus { outline: 2px solid blue; }"),
    (":focus-visible", "Matches focus only when it should be visibly indicated (e.g. keyboard nav).", ":focus-visible { outline: 2px solid; }"),
    (":active", "Matches an element while it is being activated/pressed.", "button:active { transform: scale(0.98); }"),
    (":first-child", "Matches an element that is the first child of its parent.", "li:first-child { font-weight: bold; }"),
    (":last-child", "Matches an element that is the last child of its parent.", "li:last-child { border: none; }"),
    (":nth-of-type()", "Matches elements based on their position among siblings of the same type.", "p:nth-of-type(2) { color: gray; }"),
    (":not()", "Excludes elements that match the given selector.", "li:not(.active) { opacity: 0.5; }"),
    ("::before", "Inserts generated content before an element's actual content.", ".icon::before { content: '★'; }"),
    ("::after", "Inserts generated content after an element's actual content.", ".tooltip::after { content: attr(data-tip); }"),
    ("::placeholder", "Styles the placeholder text of a form field.", "input::placeholder { color: #999; }"),
    (">  (child)", "Combinator matching direct children only.", "ul > li { list-style: none; }"),
    ("~ (general sibling)", "Combinator matching any later sibling that shares a parent.", "h2 ~ p { margin-top: 0; }"),
    ("+ (adjacent sibling)", "Combinator matching the element immediately following another.", "h2 + p { font-size: 1.1em; }"),
    ("[attr=value]", "Matches elements whose attribute equals a given value.", "input[type=\"email\"] { border-color: blue; }"),
]

# ---------------------------------------------------------------------------
# 6) MORE CSS/HTML EMMET SHORTCUTS (beyond what's already in the file)
# ---------------------------------------------------------------------------

MORE_HTML_EMMET = [
    ("!", "Full HTML5 boilerplate (shorthand for html:5).", "<!DOCTYPE html>\n<html lang=\"en\">\n<head>...</head>\n<body>...</body>\n</html>"),
    ("bq", "Alias that expands to <blockquote>.", "<blockquote></blockquote>"),
    ("fig", "Alias that expands to <figure>.", "<figure></figure>"),
    ("art", "Alias that expands to <article>.", "<article></article>"),
    ("hdr", "Alias that expands to <header>.", "<header></header>"),
    ("ftr", "Alias that expands to <footer>.", "<footer></footer>"),
    ("btn", "Alias that expands to <button>.", "<button></button>"),
    ("sect", "Alias that expands to <section>.", "<section></section>"),
    ("mn", "Alias that expands to <main>.", "<main></main>"),
    ("inp", "Shorthand for a named/id'd input: input[name=$ id=$].", "<input type=\"text\" name=\"\" id=\"\">"),
    ("img:s", "Responsive image with srcset, src, and alt.", "<img srcset=\"\" src=\"\" alt=\"\">"),
    ("bq.quote>p*2", "A blockquote with a class and two nested paragraphs.", "<blockquote class=\"quote\">\n  <p></p>\n  <p></p>\n</blockquote>"),
    ("dl>dt+dd*3", "A description list with 3 term/description pairs.", "<dl>\n  <dt></dt>\n  <dd></dd>\n  ...\n</dl>"),
    ("cc:ie", "Wraps content in an IE-only conditional comment.", "<!--[if IE]>content<![endif]-->"),
]

MORE_CSS_EMMET = [
    ("m0", "margin: 0;", "margin: 0;"),
    ("p0", "padding: 0;", "padding: 0;"),
    ("bxsz:bb", "box-sizing: border-box;", "box-sizing: border-box;"),
    ("ta:c", "text-align: center;", "text-align: center;"),
    ("fw:b", "font-weight: bold;", "font-weight: bold;"),
    ("pos:r", "position: relative;", "position: relative;"),
    ("pos:f", "position: fixed;", "position: fixed;"),
    ("trf:rx", "transform: rotate(angle);", "transform: rotate(45deg);"),
    ("wh:cover", "background-size: cover shorthand alias.", "background-size: cover;"),
    ("op:0", "opacity: 0;", "opacity: 0;"),
]

# ---------------------------------------------------------------------------
# 7) JAVASCRIPT -- comprehensive built-ins, grouped by category
# ---------------------------------------------------------------------------

JS_ARRAY_METHODS = [
    ("arr.push()", "Adds one or more items to the end of an array.", "const arr=[1,2]; arr.push(3); // [1,2,3]"),
    ("arr.pop()", "Removes and returns the last item of an array.", "[1,2,3].pop(); // 3"),
    ("arr.shift()", "Removes and returns the first item of an array.", "[1,2,3].shift(); // 1"),
    ("arr.unshift()", "Adds one or more items to the start of an array.", "[2,3].unshift(1); // [1,2,3]"),
    ("arr.slice()", "Returns a shallow copy of a portion of an array.", "[1,2,3,4].slice(1,3); // [2,3]"),
    ("arr.splice()", "Adds/removes items in place at a given index.", "const a=[1,2,3]; a.splice(1,1,'x'); // [1,'x',3]"),
    ("arr.concat()", "Merges two or more arrays into a new array.", "[1,2].concat([3,4]); // [1,2,3,4]"),
    ("arr.join()", "Joins all array items into a string with a separator.", "[1,2,3].join('-'); // '1-2-3'"),
    ("arr.flat()", "Flattens nested arrays up to the given depth.", "[1,[2,[3]]].flat(2); // [1,2,3]"),
    ("arr.flatMap()", "Maps then flattens the result by one level.", "[1,2].flatMap(n => [n, n*2]); // [1,2,2,4]"),
    ("arr.sort()", "Sorts array items in place.", "[3,1,2].sort((a,b) => a-b); // [1,2,3]"),
    ("arr.reverse()", "Reverses the order of array items in place.", "[1,2,3].reverse(); // [3,2,1]"),
    ("arr.indexOf()", "Returns the first index of a matching value, or -1.", "[1,2,3].indexOf(2); // 1"),
    ("arr.findIndex()", "Returns the index of the first matching item, or -1.", "[1,2,3].findIndex(n => n>1); // 1"),
    ("arr.includes()", "Checks whether an array contains a given value.", "[1,2,3].includes(2); // true"),
    ("arr.fill()", "Fills array elements with a static value.", "new Array(3).fill(0); // [0,0,0]"),
    ("arr.at()", "Returns the item at an index, supporting negative indices.", "[1,2,3].at(-1); // 3"),
    ("Array.isArray()", "Checks whether a value is an array.", "Array.isArray([1,2]); // true"),
    ("Array.from()", "Creates an array from an iterable or array-like value.", "Array.from('abc'); // ['a','b','c']"),
]

JS_STRING_METHODS = [
    ("str.slice()", "Extracts a section of a string as a new string.", "'hello'.slice(1,3); // 'el'"),
    ("str.split()", "Splits a string into an array of substrings.", "'a,b,c'.split(','); // ['a','b','c']"),
    ("str.trim()", "Removes whitespace from both ends of a string.", "'  hi  '.trim(); // 'hi'"),
    ("str.toUpperCase()", "Converts a string to upper case.", "'abc'.toUpperCase(); // 'ABC'"),
    ("str.toLowerCase()", "Converts a string to lower case.", "'ABC'.toLowerCase(); // 'abc'"),
    ("str.startsWith()", "Checks whether a string starts with a given substring.", "'hello'.startsWith('he'); // true"),
    ("str.endsWith()", "Checks whether a string ends with a given substring.", "'hello'.endsWith('lo'); // true"),
    ("str.repeat()", "Repeats a string a given number of times.", "'ab'.repeat(3); // 'ababab'"),
    ("str.charAt()", "Returns the character at a given index.", "'abc'.charAt(1); // 'b'"),
    ("str.indexOf()", "Returns the index of the first occurrence of a substring.", "'hello'.indexOf('l'); // 2"),
    ("str.match()", "Matches a string against a regular expression.", "'a1b2'.match(/\\d/g); // ['1','2']"),
    ("str.replace()", "Replaces the first (or all, with /g) match in a string.", "'foo bar'.replace('foo','baz'); // 'baz bar'"),
]

JS_OBJECT_METHODS = [
    ("Object.keys()", "Returns an array of an object's own enumerable keys.", "Object.keys({a:1,b:2}); // ['a','b']"),
    ("Object.values()", "Returns an array of an object's own enumerable values.", "Object.values({a:1,b:2}); // [1,2]"),
    ("Object.assign()", "Copies properties from source objects into a target.", "Object.assign({}, a, b);"),
    ("Object.freeze()", "Prevents an object from being modified.", "Object.freeze(config);"),
    ("Object.fromEntries()", "Builds an object from an array of [key, value] pairs.", "Object.fromEntries([['a',1]]); // {a:1}"),
    ("hasOwnProperty()", "Checks whether an object has its own (non-inherited) property.", "obj.hasOwnProperty('id');"),
]

JS_MATH_NUMBER = [
    ("Math.max()", "Returns the largest of the given numbers.", "Math.max(1,5,3); // 5"),
    ("Math.min()", "Returns the smallest of the given numbers.", "Math.min(1,5,3); // 1"),
    ("Math.round()", "Rounds a number to the nearest integer.", "Math.round(4.5); // 5"),
    ("Math.floor()", "Rounds a number down to the nearest integer.", "Math.floor(4.9); // 4"),
    ("Math.ceil()", "Rounds a number up to the nearest integer.", "Math.ceil(4.1); // 5"),
    ("Math.random()", "Returns a pseudo-random float between 0 (inclusive) and 1.", "Math.random();"),
    ("Math.abs()", "Returns the absolute value of a number.", "Math.abs(-7); // 7"),
    ("Number.parseInt()", "Parses a string and returns an integer.", "Number.parseInt('42px'); // 42"),
    ("Number.parseFloat()", "Parses a string and returns a floating point number.", "Number.parseFloat('3.14m'); // 3.14"),
    ("Number.isInteger()", "Checks whether a value is an integer.", "Number.isInteger(4); // true"),
    ("toFixed()", "Formats a number using fixed-point notation.", "(3.14159).toFixed(2); // '3.14'"),
]

JS_DOM_EXTRA = [
    ("querySelectorAll()", "Selects all matching elements as a static NodeList.", "document.querySelectorAll('.item');"),
    ("getElementById()", "Selects a single element by its id attribute.", "document.getElementById('app');"),
    ("createElement()", "Creates a new element node of the given tag.", "document.createElement('div');"),
    ("appendChild()", "Appends a node as the last child of a parent.", "parent.appendChild(child);"),
    ("removeChild()", "Removes a child node from its parent.", "parent.removeChild(child);"),
    ("setAttribute()", "Sets the value of an element's attribute.", "el.setAttribute('data-id', '42');"),
    ("removeEventListener()", "Removes a previously registered event listener.", "btn.removeEventListener('click', handler);"),
    ("preventDefault()", "Cancels the default action of an event.", "form.addEventListener('submit', e => e.preventDefault());"),
    ("stopPropagation()", "Stops an event from bubbling further up the DOM.", "el.addEventListener('click', e => e.stopPropagation());"),
    ("closest()", "Finds the nearest ancestor (or self) matching a selector.", "el.closest('.card');"),
]

JS_CONTROL_FLOW = [
    ("for loop", "Repeats a block a fixed number of times using a counter.", "for (let i=0; i<arr.length; i++) {\n  console.log(arr[i]);\n}"),
    ("for...of", "Iterates over the values of an iterable (arrays, strings, Maps...).", "for (const item of items) {\n  console.log(item);\n}"),
    ("for...in", "Iterates over the enumerable keys of an object.", "for (const key in obj) {\n  console.log(key);\n}"),
    ("while loop", "Repeats a block while a condition remains true.", "while (count < 5) {\n  count++;\n}"),
    ("do...while", "Runs a block once, then repeats while a condition is true.", "do {\n  count++;\n} while (count < 5);"),
    ("if / else", "Branches execution based on a condition.", "if (age >= 18) {\n  allow();\n} else {\n  deny();\n}"),
    ("switch statement", "Branches execution based on matching one of several values.", "switch (status) {\n  case 'ok': break;\n  default: break;\n}"),
    ("try / catch", "Runs code and handles any error it throws.", "try {\n  risky();\n} catch (err) {\n  console.error(err);\n}"),
]

JS_FUNCTIONS_CLASSES = [
    ("function declaration", "Defines a named, reusable block of code.", "function greet(name) {\n  return `Hi ${name}`;\n}"),
    ("class", "Defines a blueprint for creating objects with shared behavior.", "class User {\n  constructor(name) {\n    this.name = name;\n  }\n}"),
    ("constructor", "Special class method run when a new instance is created.", "constructor(name) {\n  this.name = name;\n}"),
    ("import statement", "Imports bindings exported from another module.", "import { add } from './math.js';"),
    ("export", "Exposes a value/function/class for use in other modules.", "export function add(a,b) { return a+b; }"),
    ("this", "References the current execution context object.", "class Timer {\n  start() { this.id = setInterval(...); }\n}"),
]

JS_OPERATORS = [
    ("=== / !==", "Strict equality/inequality without type coercion.", "1 === '1'; // false"),
    ("&&  /  ||", "Logical AND / OR, often used for guards and defaults.", "isValid && submit();\nname || 'Guest';"),
    ("typeof", "Returns a string describing a value's type.", "typeof 'hi'; // 'string'"),
    ("instanceof", "Checks whether an object is an instance of a class.", "err instanceof TypeError;"),
    ("ternary ?:", "Compact inline if/else expression.", "const label = isActive ? 'On' : 'Off';"),
]

JS_MISC = [
    ("Promise.race()", "Resolves/rejects as soon as the first promise settles.", "Promise.race([p1, p2]).then(first => ...);"),
    ("Promise.allSettled()", "Waits for all promises to settle, success or failure.", "const results = await Promise.allSettled([p1, p2]);"),
    ("new Map()", "Creates a key-value collection with any type of key.", "const m = new Map();\nm.set('a', 1);"),
    ("new Set()", "Creates a collection of unique values.", "const s = new Set([1,2,2,3]); // {1,2,3}"),
    ("fetch()", "Makes an HTTP request and returns a Promise for the response.", "const res = await fetch('/api/data');"),
    ("localStorage", "Stores key-value data in the browser persistently.", "localStorage.setItem('theme', 'dark');"),
    ("setTimeout()", "Runs a function once after a delay.", "setTimeout(() => alert('Hi'), 1000);"),
    ("setInterval()", "Repeatedly runs a function on a fixed delay.", "setInterval(() => tick(), 1000);"),
]


# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------

def build_new_items(existing_keys):
    new_items = []

    # HTML Elements
    for tag, desc, example in HTML_ELEMENTS:
        key = ("html", "Elements", tag)
        if key in existing_keys:
            continue
        item = make_item(
            "html", "Elements", tag, desc, example,
            what_it_does=f"The `{tag}` element is used to {desc.rstrip('.').lower()}.",
            use_case=(
                f"You would reach for `{tag}` when structuring semantic, accessible "
                f"HTML: {desc.lower()}"
            ),
            shortcuts=html_element_shortcuts(tag),
        )
        new_items.append(item)
        existing_keys.add(key)

    # HTML Attributes
    for attr, desc, example, emmet in HTML_ATTRIBUTES:
        key = ("html", "Attributes", attr)
        if key in existing_keys:
            continue
        item = make_item(
            "html", "Attributes", attr, desc, example,
            what_it_does=f"The `{attr}` attribute is used to {desc.rstrip('.').lower()}.",
            use_case=(
                f"The `{attr}` attribute is commonly used across real projects to "
                f"{desc.lower()}"
            ),
            shortcuts=html_attr_shortcuts(attr, emmet),
        )
        new_items.append(item)
        existing_keys.add(key)

    # HTML Entities (extra)
    for entity, example, desc in HTML_ENTITIES_EXTRA:
        key = ("html", "Entities", entity)
        if key in existing_keys:
            continue
        item = make_item(
            "html", "Entities", entity, desc, example,
            what_it_does=f"The `{entity}` entity is used to render {desc.lower()}",
            use_case=(
                "HTML entities like this are essential for displaying special "
                "characters that can't be typed directly or would otherwise be "
                "interpreted as markup."
            ),
            shortcuts=html_entity_shortcuts(entity),
        )
        new_items.append(item)
        existing_keys.add(key)

    # More HTML Emmet
    for abbr, desc, example in MORE_HTML_EMMET:
        key = ("html", "Emmet", abbr)
        if key in existing_keys:
            continue
        item = make_item(
            "html", "Emmet", abbr, desc, example,
            what_it_does=f"The Emmet abbreviation `{abbr}` expands to {desc.rstrip('.').lower()}.",
            use_case=(
                "Emmet abbreviations like this speed up writing HTML boilerplate "
                "dramatically compared to typing full tags by hand."
            ),
            shortcuts=emmet_abbrev_self_shortcuts(abbr, "html"),
        )
        new_items.append(item)
        existing_keys.add(key)

    # CSS Properties
    for cat, prop, desc, example in CSS_PROPERTIES:
        key = ("css", cat, prop)
        if key in existing_keys:
            continue
        item = make_item(
            "css", cat, prop, desc, example,
            what_it_does=f"The `{prop}` property is used to {desc.rstrip('.').lower()}.",
            use_case=(
                f"`{prop}` is a core CSS property used throughout real-world "
                f"stylesheets to {desc.lower()}"
            ),
            shortcuts=css_property_shortcuts(prop),
        )
        new_items.append(item)
        existing_keys.add(key)

    # CSS Selectors
    for sel, desc, example in CSS_SELECTORS:
        key = ("css", "Selectors", sel)
        if key in existing_keys:
            continue
        item = make_item(
            "css", "Selectors", sel, desc, example,
            what_it_does=f"The `{sel}` selector is used to {desc.rstrip('.').lower()}.",
            use_case=(
                f"`{sel}` is frequently used to target elements based on state, "
                f"structure, or relationship without adding extra classes."
            ),
            shortcuts=css_selector_shortcuts(sel),
        )
        new_items.append(item)
        existing_keys.add(key)

    # More CSS Emmet
    for abbr, desc, example in MORE_CSS_EMMET:
        key = ("css", "Emmet", abbr)
        if key in existing_keys:
            continue
        item = make_item(
            "css", "Emmet", abbr, desc, example,
            what_it_does=f"The Emmet abbreviation `{abbr}` expands to {desc.rstrip('.').lower()}.",
            use_case=(
                "Emmet CSS abbreviations like this help write stylesheets faster "
                "by expanding short mnemonics into full property/value pairs."
            ),
            shortcuts=emmet_abbrev_self_shortcuts(abbr, "css"),
        )
        new_items.append(item)
        existing_keys.add(key)

    # JS groups
    js_groups = [
        ("Arrays", JS_ARRAY_METHODS),
        ("Strings", JS_STRING_METHODS),
        ("Objects", JS_OBJECT_METHODS),
        ("Math & Numbers", JS_MATH_NUMBER),
        ("DOM", JS_DOM_EXTRA),
        ("Control Flow", JS_CONTROL_FLOW),
        ("Functions & Classes", JS_FUNCTIONS_CLASSES),
        ("Operators", JS_OPERATORS),
        ("Async & APIs", JS_MISC),
    ]
    for cat, entries in js_groups:
        for shortcut, desc, example in entries:
            key = ("js", cat, shortcut)
            if key in existing_keys:
                continue
            item = make_item(
                "js", cat, shortcut, desc, example,
                what_it_does=f"`{shortcut}` is used to {desc.rstrip('.').lower()}.",
                use_case=(
                    f"`{shortcut}` shows up constantly in real-world JavaScript "
                    f"code to {desc.lower()}"
                ),
                shortcuts=js_shortcuts_for(shortcut, cat),
            )
            new_items.append(item)
            existing_keys.add(key)

    return new_items


def attach_shortcuts_to_existing(items):
    """Add a factual `shortcuts` field to every pre-existing entry that doesn't
    already have one, based on its lang/cat/shortcut."""
    for item in items:
        if "shortcuts" in item:
            continue
        lang, cat, shortcut = item["lang"], item["cat"], item["shortcut"]
        if lang == "html":
            if cat == "Elements":
                tag = shortcut.strip("`")
                if not tag.startswith("<"):
                    tag = f"<{tag}>"
                item["shortcuts"] = html_element_shortcuts(tag)
            elif cat == "Attributes":
                item["shortcuts"] = html_attr_shortcuts(shortcut.strip("`"))
            elif cat == "Entities":
                item["shortcuts"] = html_entity_shortcuts(shortcut.strip("`"))
            elif cat.startswith("Emmet"):
                item["shortcuts"] = emmet_abbrev_self_shortcuts(shortcut, "html")
            elif cat == "Notepad++":
                item["shortcuts"] = {
                    "vscode": (
                        f"This is a Notepad++-specific shortcut (`{shortcut}`), so it has "
                        "no direct VS Code equivalent binding, though VS Code offers "
                        "similar functionality via its own Command Palette actions "
                        "and default keybindings."
                    ),
                    "notepadpp": f"Press `{shortcut}` directly in Notepad++ -- {item.get('desc','')}",
                }
            elif cat == "VS Code":
                item["shortcuts"] = {
                    "vscode": f"Press `{shortcut}` directly in VS Code -- {item.get('desc','')}",
                    "notepadpp": (
                        f"This is a VS Code-specific shortcut (`{shortcut}`), so it has no "
                        "direct Notepad++ equivalent. The closest built-in Notepad++ "
                        "features are its own Shortcut Mapper-assigned commands, which "
                        "must be configured separately (Settings > Shortcut Mapper)."
                    ),
                }
            else:
                item["shortcuts"] = html_builtin_fallback(shortcut)
        elif lang == "css":
            if cat == "Emmet":
                item["shortcuts"] = emmet_abbrev_self_shortcuts(shortcut, "css")
            elif cat == "Selectors":
                item["shortcuts"] = css_selector_shortcuts(shortcut)
            else:
                # Try to resolve to a bare property name for a real Emmet lookup
                prop_guess = shortcut.split(":")[0].split(" ")[0].strip()
                item["shortcuts"] = css_property_shortcuts(prop_guess)
        elif lang == "js":
            item["shortcuts"] = js_shortcuts_for(shortcut, cat)
    return items


def html_builtin_fallback(shortcut):
    vscode = (
        f"Start typing `{shortcut}` in an HTML file -- VS Code's built-in HTML "
        "language service will suggest it in the completion list; press Enter/Tab "
        "to accept."
    )
    notepadpp = (
        f"Notepad++ has no built-in HTML IntelliSense, so `{shortcut}` must be "
        "typed manually (Word Completion via Ctrl+Enter can finish it once it has "
        "appeared earlier in the document)."
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


# 8) PLUGINS -- step-by-step, no-installer / no-admin-password guides
# ---------------------------------------------------------------------------
# Facts used here (not fabricated):
# - Notepad++ official downloads page offers "Portable (zip)" / "Portable (7z)"
#   / "Mini-portable (7z)" builds for x64/x86/ARM64 alongside the Installer
#   (exe)/MSI -- these are plain archives, no installer executable, extractable
#   anywhere the user has write access. Source: notepad-plus-plus.org/downloads
# - Since Notepad++ v7.6.3, each plugin's DLL must live in its own subfolder:
#   <install-or-portable-dir>\plugins\<PluginName>\<PluginName>.dll (companion
#   files/folders go alongside it in that same subfolder).
#   Source: npp-usermanual (notepad-plus-plus/npp-usermanual) "plugins.md",
#   and community guide https://community.notepad-plus-plus.org/topic/17366
# - The community's own historical install guide for the Emmet plugin says to
#   download "emmet-npp.zip" (hosted on the npp-plugins SourceForge project),
#   create a "EmmetNPP" folder inside plugins, and copy EmmetNPP.dll plus its
#   companion files (_PyV8.pyd, PyV8.py, editor.js, npp_emmet.py, and an
#   "emmet" folder) into it -- this is a legacy plugin built on PythonScript's
#   bundled PyV8 JS engine, not the standalone Plugin-Manager-listed "Emmet"
#   entry. Source: community.notepad-plus-plus.org/topic/17366
# - The current, actively-maintained "Emmet" entry in the official Plugin List
#   (chcg/npp, formerly emmetio/npp) is normally installed via the built-in
#   Plugins Admin; as of this writing chcg/npp's GitHub Releases page has no
#   published release assets, so manual/offline installation of that specific
#   fork cannot be reliably instructed here -- the legacy emmet-npp.zip path
#   above is the one with a real, documented direct-download URL.
# - Expand Abbreviation has no default keybinding in the Emmet plugin; it must
#   be mapped manually under Settings > Shortcut Mapper > Plugin Commands.
#   Source: github.com/AncientIs/npp (Emmet plugin for Notepad++ README)
# - Plugins Admin (the built-in installer/updater) always writes into the
#   Notepad++ install directory and therefore needs write access to that
#   folder; running the portable ZIP/7z build side-steps this because the
#   user owns the entire extracted folder, including its plugins subfolder.
#   Source: community.notepad-plus-plus.org discussions on "Plugins Admin and
#   Notepad++ Portable" and superuser.com/questions/1262311
# - doLocalConf.xml / allowAppDataPlugins.xml are documented, real mechanisms
#   for redirecting where Notepad++ loads user plugins from when the install
#   directory itself isn't writable without admin rights.
#   Source: superuser.com/questions/1262311

PLUGIN_GUIDES = [
    {
        "lang": "html",
        "cat": "Plugins",
        "shortcut": "Install Emmet in Notepad++ (No Installer, No Admin)",
        "desc": (
            "A step-by-step way to get Emmet-style abbreviation expansion working "
            "in Notepad++ using only ZIP downloads -- no .exe installer and no "
            "administrator password required."
        ),
        "example": (
            "notepadpp-portable/\n"
            "  notepad++.exe\n"
            "  plugins/\n"
            "    EmmetNPP/\n"
            "      EmmetNPP.dll\n"
            "      _PyV8.pyd\n"
            "      PyV8.py\n"
            "      editor.js\n"
            "      npp_emmet.py\n"
            "      emmet/"
        ),
        "what_it_does": (
            "Walks through downloading a portable (ZIP) build of Notepad++ plus "
            "the Emmet plugin's files directly, and placing them in the correct "
            "folder structure by hand -- entirely without running an installer "
            "or needing admin/local-admin rights on the machine."
        ),
        "use_case": (
            "This is exactly what you need on a locked-down work or school "
            "computer where you can't run installers or don't have the admin "
            "password, but you still want Emmet-style HTML/CSS abbreviation "
            "expansion while coding in Notepad++."
        ),
        "guide": [
            {
                "title": "Download a portable build of Notepad++ (skip this if you already use one)",
                "detail": (
                    "Go to the official downloads page at "
                    "https://notepad-plus-plus.org/downloads/ and choose \"Portable "
                    "(zip)\" for your architecture (x64 is correct for almost all "
                    "modern PCs). This is a plain ZIP archive, not an installer -- "
                    "right-click it and choose \"Extract All\" to any folder you own "
                    "(Desktop, Documents, or even a USB stick). No admin rights are "
                    "needed because you're not writing to Program Files."
                ),
            },
            {
                "title": "Download the Emmet plugin files as a plain ZIP",
                "detail": (
                    "Skip Notepad++'s built-in Plugins Admin -- it installs into the "
                    "program's own folder and can fail without write access there. "
                    "Instead, download \"emmet-npp.zip\" directly from "
                    "https://sourceforge.net/projects/npp-plugins/files/Emmet/emmet-npp.zip/download "
                    "(this is the exact file referenced by the community's own "
                    "official installation guide on the Notepad++ forum). Extract it "
                    "to your Desktop -- it contains EmmetNPP.dll plus a few "
                    "companion files."
                ),
            },
            {
                "title": "Create the plugin's subfolder and copy the files in",
                "detail": (
                    "Since Notepad++ v7.6.3, every plugin must live in its own "
                    "subfolder named exactly after its DLL. Inside your portable "
                    "Notepad++ folder, open plugins\\ and create a new folder called "
                    "EmmetNPP. Copy EmmetNPP.dll into it, then copy the remaining "
                    "companion files from the extracted emmet-npp.zip -- _PyV8.pyd, "
                    "PyV8.py, editor.js, npp_emmet.py, and the emmet folder -- into "
                    "that same EmmetNPP folder."
                ),
            },
            {
                "title": "Launch your portable Notepad++ and confirm the plugin loaded",
                "detail": (
                    "Double-click notepad++.exe inside your portable folder (not any "
                    "Start Menu shortcut, which may point at a different, admin-only "
                    "installed copy). Open the Plugins menu -- you should now see an "
                    "Emmet entry. If it's missing, double-check the folder name and "
                    "file placement from step 3 match exactly."
                ),
            },
            {
                "title": "Map a keyboard shortcut for Expand Abbreviation",
                "detail": (
                    "The Emmet plugin ships with no default keybinding for its "
                    "\"Expand Abbreviation\" command. Go to Settings > Shortcut "
                    "Mapper > Plugin Commands tab, find \"Expand Abbreviation\", and "
                    "assign a key combination (Ctrl+Alt+Enter is a safe choice that "
                    "won't conflict with normal typing; some people remap Tab, but "
                    "that also affects normal indentation)."
                ),
            },
        ],
        "guideNote": (
            "This legacy Emmet plugin bundles an old embedded PyV8 JavaScript "
            "engine and hasn't been updated in years, so it may not load on the "
            "very newest Notepad++ builds -- make sure you download the ZIP that "
            "matches your Notepad++ bit-width (32-bit vs 64-bit). If it refuses to "
            "load at all, the same no-installer, drop-a-DLL-in-a-folder approach "
            "works for actively maintained snippet/tag-expansion plugins listed in "
            "Notepad++'s official Plugin List (for example WebEdit or FingerText2) "
            "-- download their ZIP release from GitHub, and repeat steps 3-5 with "
            "that plugin's own DLL and folder name instead."
        ),
        "shortcuts": {
            "vscode": (
                "Not applicable -- VS Code ships Emmet built in, so none of this "
                "manual plugin installation is needed there."
            ),
            "notepadpp": (
                "Follow the step-by-step guide above: download the portable "
                "Notepad++ ZIP and the emmet-npp.zip plugin package, extract both, "
                "and drop the plugin's DLL and companion files into "
                "plugins\\EmmetNPP\\ inside your portable Notepad++ folder."
            ),
        },
    },
]


def build_plugin_guide_items(existing_keys):
    items = []
    for g in PLUGIN_GUIDES:
        key = (g["lang"], g["cat"], g["shortcut"])
        if key in existing_keys:
            continue
        item = make_item(
            g["lang"], g["cat"], g["shortcut"], g["desc"], g["example"],
            what_it_does=g["what_it_does"],
            use_case=g["use_case"],
            shortcuts=g.get("shortcuts"),
        )
        item["guide"] = g["guide"]
        if g.get("guideNote"):
            item["guideNote"] = g["guideNote"]
        items.append(item)
        existing_keys.add(key)
    return items
def main():
    existing = load_existing()
    existing_keys = set(key_of(i) for i in existing)

    existing = attach_shortcuts_to_existing(existing)
    new_items = build_new_items(existing_keys)
    plugin_items = build_plugin_guide_items(existing_keys)

    all_items = existing + new_items + plugin_items
    all_items.sort(key=lambda x: (x["lang"], x["cat"], x["shortcut"]))

    with open(DATA_PATH, "w") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Existing entries: {len(existing)}")
    print(f"New entries added: {len(new_items)}")
    print(f"Plugin guide entries added: {len(plugin_items)}")
    print(f"Total entries: {len(all_items)}")


if __name__ == "__main__":
    main()



# ---------------------------------------------------------------------------
