#!/usr/bin/env python3
"""
Second-pass expansion of client/src/data/structured_content.json, closing
concrete coverage gaps identified after the v1 pass (expand_content.py):

- HTML: the <li> element was missing entirely; several common global/element
  attributes (ARIA, media, iframe, form-related) were not yet covered.
- CSS: vendor-prefixed properties (-webkit-/-moz-/-ms-) were almost entirely
  absent (only ::-webkit-scrollbar existed), animation sub-properties beyond
  the shorthand were missing, CSS filter() and transform() functions were not
  documented individually, and several modern layout/selector features
  (:is(), :where(), :has(), @container, @supports, clamp/min/max, logical
  properties, scroll-snap, etc.) had no entries.
- JS: whole feature areas were missing -- generators, Symbol/Proxy/Reflect/
  WeakMap/WeakSet, private class fields & static members, getters/setters,
  tagged templates, default/rest parameters, Date/RegExp/URL basics,
  dynamic import(), and core patterns like closures/hoisting/IIFE/event
  delegation.

This script is idempotent: it re-uses expand_content.py's helper functions so
every new entry gets the same style of factual editor Shortcuts, and it skips
any (lang, cat, shortcut) key that already exists.
"""
import json

from expand_content import (
    DATA_PATH,
    make_item,
    load_existing,
    key_of,
    html_element_shortcuts,
    html_attr_shortcuts,
    css_property_shortcuts,
    css_selector_shortcuts,
    emmet_abbrev_self_shortcuts,
    js_shortcuts_for,
    js_builtin_shortcuts,
)

# ---------------------------------------------------------------------------
# HTML: missing element + attributes
# ---------------------------------------------------------------------------

HTML_ELEMENTS_V2 = [
    ("<li>", "A single item within an <ol>, <ul>, or <menu> list.", "<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>"),
]

HTML_ATTRIBUTES_V2 = [
    ("aria-hidden", "Hides decorative/duplicate content from assistive technology while keeping it visible.", "<i class=\"icon\" aria-hidden=\"true\"></i>", None),
    ("aria-expanded", "Indicates whether a collapsible element (menu, accordion) is currently expanded.", "<button aria-expanded=\"false\">Menu</button>", None),
    ("aria-current", "Marks the current item within a set, e.g. the active page in navigation.", "<a href=\"/\" aria-current=\"page\">Home</a>", None),
    ("aria-live", "Announces dynamic content changes to screen readers without moving focus.", "<div aria-live=\"polite\">3 new messages</div>", None),
    ("aria-describedby", "Points to the id of an element that provides extra descriptive text.", "<input aria-describedby=\"hint\">\n<span id=\"hint\">8+ characters</span>", None),
    ("aria-checked", "Indicates the checked state of a checkbox/radio/switch-like widget.", "<div role=\"checkbox\" aria-checked=\"true\"></div>", None),
    ("inputmode", "Hints which virtual keyboard to show for a text input (e.g. numeric, email).", "<input inputmode=\"numeric\">", None),
    ("enterkeyhint", "Hints what label/icon to show on a virtual keyboard's Enter key.", "<input enterkeyhint=\"send\">", None),
    ("popover", "Marks an element as a native popover, shown/hidden via the Popover API.", "<div popover id=\"tip\">Hello</div>", None),
    ("inert", "Makes an element (and its subtree) non-interactive and unfocusable.", "<div inert>Background content</div>", None),
    ("controls", "Shows the browser's built-in playback controls for audio/video.", "<video controls src=\"movie.mp4\"></video>", None),
    ("autoplay", "Starts audio/video playback automatically as soon as possible.", "<video autoplay muted src=\"loop.mp4\"></video>", None),
    ("loop", "Restarts audio/video playback from the start when it finishes.", "<audio loop src=\"song.mp3\"></audio>", None),
    ("muted", "Silences audio/video by default on page load.", "<video muted autoplay src=\"bg.mp4\"></video>", None),
    ("poster", "An image shown before a video starts playing.", "<video poster=\"thumb.jpg\" src=\"movie.mp4\"></video>", None),
    ("preload", "Hints how much of a media file to preload: none, metadata, or auto.", "<video preload=\"metadata\" src=\"movie.mp4\"></video>", None),
    ("sandbox", "Restricts what an embedded <iframe> is allowed to do.", "<iframe sandbox=\"allow-scripts\" src=\"widget.html\"></iframe>", None),
    ("allow", "Grants an <iframe> permission to use browser features like camera or fullscreen.", "<iframe allow=\"fullscreen\" src=\"video.html\"></iframe>", None),
    ("allowfullscreen", "Lets an embedded <iframe> request fullscreen mode.", "<iframe allowfullscreen src=\"player.html\"></iframe>", None),
    ("referrerpolicy", "Controls how much referrer information is sent when fetching a resource.", "<img referrerpolicy=\"no-referrer\" src=\"x.jpg\">", None),
    ("fetchpriority", "Hints the relative loading priority of an image/script/link.", "<img fetchpriority=\"high\" src=\"hero.jpg\">", None),
    ("decoding", "Hints whether an image should decode synchronously or asynchronously.", "<img decoding=\"async\" src=\"photo.jpg\">", None),
    ("scope", "On a <th>, defines whether it headers a row, column, or group of cells.", "<th scope=\"col\">Name</th>", None),
    ("datetime", "Machine-readable date/time value for <time>, <ins>, or <del>.", "<time datetime=\"2026-07-11\">July 11</time>", None),
    ("reversed", "Displays an ordered list in descending order.", "<ol reversed><li>Third</li><li>Second</li><li>First</li></ol>", None),
    ("start", "Sets the starting number of an ordered list.", "<ol start=\"5\"><li>Five</li><li>Six</li></ol>", None),
    ("usemap", "Associates an <img> with a <map> of clickable areas.", "<img src=\"map.png\" usemap=\"#worldmap\">", None),
    ("wrap", "Controls whether a <textarea>'s text wraps when submitted: soft or hard.", "<textarea wrap=\"hard\"></textarea>", None),
    ("formaction", "Overrides a submit button's form action URL for that click only.", "<button formaction=\"/preview\">Preview</button>", None),
    ("list", "Associates an <input> with a <datalist> of suggested values.", "<input list=\"browsers\">\n<datalist id=\"browsers\"><option value=\"Chrome\"></datalist>", None),
]

# ---------------------------------------------------------------------------
# CSS: vendor prefixes, animation sub-properties, filter/transform functions,
# modern selectors, and layout features that were missing.
# ---------------------------------------------------------------------------

CSS_VENDOR_PREFIXES = [
    ("-webkit-appearance", "Removes/customizes native OS styling of form controls in WebKit/Blink browsers.", "-webkit-appearance: none;"),
    ("-webkit-line-clamp", "Truncates multi-line text with an ellipsis; requires display:-webkit-box in WebKit/Blink.", "display: -webkit-box;\n-webkit-line-clamp: 3;\n-webkit-box-orient: vertical;\noverflow: hidden;"),
    ("-webkit-backdrop-filter", "WebKit/Safari-specific prefix required for backdrop-filter to work on older Safari.", "-webkit-backdrop-filter: blur(10px);\nbackdrop-filter: blur(10px);"),
    ("-webkit-mask", "Applies a WebKit-prefixed mask image/gradient to an element (needed for older Safari).", "-webkit-mask-image: linear-gradient(black, transparent);"),
    ("-webkit-text-fill-color", "Sets the fill color of text, often combined with background-clip:text for gradient text.", "background: linear-gradient(90deg,#f06,#4af);\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;"),
    ("-webkit-user-select", "WebKit-prefixed way to disable/enable text selection (needed for older Safari/iOS).", "-webkit-user-select: none;\nuser-select: none;"),
    ("-webkit-tap-highlight-color", "Removes/customizes the gray flash shown when tapping links on mobile WebKit.", "-webkit-tap-highlight-color: transparent;"),
    ("-webkit-overflow-scrolling", "Enables momentum (inertial) scrolling on older iOS Safari.", "-webkit-overflow-scrolling: touch;"),
    ("-moz-appearance", "Firefox-prefixed way to remove native styling from form controls.", "-moz-appearance: none;"),
    ("-ms-overflow-style", "Legacy Internet Explorer/Edge property to hide the scrollbar.", "-ms-overflow-style: none;"),
]

CSS_ANIMATION_SUBPROPS = [
    ("Animation", "animation-delay", "Sets a wait time before an animation starts.", "animation-delay: 0.5s;"),
    ("Animation", "animation-duration", "Sets how long one animation cycle takes.", "animation-duration: 2s;"),
    ("Animation", "animation-timing-function", "Sets the animation's acceleration curve (ease, linear, cubic-bezier...).", "animation-timing-function: ease-in-out;"),
    ("Animation", "animation-iteration-count", "Sets how many times an animation repeats (or infinite).", "animation-iteration-count: infinite;"),
    ("Animation", "animation-direction", "Sets whether an animation plays forward, backward, or alternates.", "animation-direction: alternate;"),
    ("Animation", "animation-fill-mode", "Controls the styles applied before/after an animation runs.", "animation-fill-mode: forwards;"),
    ("Animation", "animation-play-state", "Pauses or resumes a running animation.", "animation-play-state: paused;"),
    ("Animation", "will-change", "Hints to the browser which property will change, to optimize rendering ahead of time.", "will-change: transform, opacity;"),
    ("Animation", "transition-property", "Sets which CSS property(ies) a transition applies to.", "transition-property: transform, opacity;"),
    ("Animation", "transition-delay", "Sets a wait time before a transition starts.", "transition-delay: 0.2s;"),
]

CSS_TRANSFORM_FUNCTIONS = [
    ("Animation", "rotate3d()", "Rotates an element in 3D space around an arbitrary axis.", "transform: rotate3d(1, 1, 0, 45deg);"),
    ("Animation", "scale3d()", "Scales an element independently on the x, y, and z axes.", "transform: scale3d(1.2, 1.2, 1);"),
    ("Animation", "translate3d()", "Moves an element in 3D space; often GPU-accelerated for smoother animation.", "transform: translate3d(0, -10px, 0);"),
    ("Animation", "perspective()", "Sets the distance from the viewer, affecting how 3D transforms appear.", "transform: perspective(500px) rotateY(20deg);"),
    ("Animation", "matrix()", "Applies a 2D transformation directly via a 6-value transformation matrix.", "transform: matrix(1, 0, 0, 1, 20, 10);"),
    ("Animation", "skew()", "Skews (shears) an element along the X and/or Y axis.", "transform: skew(10deg, 2deg);"),
]

CSS_FILTER_FUNCTIONS = [
    ("Effects", "brightness()", "Adjusts the brightness of an element (1 = normal, 0 = black).", "filter: brightness(1.2);"),
    ("Effects", "contrast()", "Adjusts the contrast of an element.", "filter: contrast(1.4);"),
    ("Effects", "grayscale()", "Converts an element to grayscale (0 = normal, 1 = fully gray).", "filter: grayscale(1);"),
    ("Effects", "blur()", "Applies a Gaussian blur to an element.", "filter: blur(4px);"),
    ("Effects", "hue-rotate()", "Rotates the hues of an element's colors around the color wheel.", "filter: hue-rotate(90deg);"),
    ("Effects", "drop-shadow()", "Applies a shadow that follows an element's alpha shape (unlike box-shadow).", "filter: drop-shadow(0 4px 6px rgba(0,0,0,.3));"),
    ("Effects", "invert()", "Inverts the colors of an element.", "filter: invert(1);"),
    ("Effects", "saturate()", "Adjusts color saturation of an element.", "filter: saturate(1.8);"),
    ("Effects", "sepia()", "Applies a sepia (vintage brown) tone to an element.", "filter: sepia(0.6);"),
]

CSS_MODERN_SELECTORS = [
    (":is()", "Matches any selector in a list, reducing repetition in complex selectors.", "is(header, footer) a { color: teal; }"),
    (":where()", "Like :is(), but always contributes zero specificity -- easy to override.", "where(.card, .panel) p { margin: 0; }"),
    (":has()", "Matches an element only if it contains a descendant matching the given selector.", "card:has(img) { padding-top: 0; }"),
    (":target", "Matches the element whose id matches the URL's current fragment (#id).", "#section1:target { background: yellow; }"),
    (":empty", "Matches elements that have no children (including no text).", "p:empty { display: none; }"),
    (":disabled", "Matches form elements that are currently disabled.", "input:disabled { opacity: 0.5; }"),
    (":checked", "Matches a checkbox, radio, or option that is currently checked/selected.", "input:checked + label { font-weight: bold; }"),
]

CSS_MODERN_FEATURES = [
    ("Layout", "@container", "Defines a container query context so children can respond to the container's size.", "@container (min-width: 400px) {\n  .card { flex-direction: row; }\n}"),
    ("Layout", "container-type", "Opts an element in as a query container for @container rules.", "container-type: inline-size;"),
    ("Responsive", "@supports", "Applies CSS rules only if the browser supports a given feature.", "@supports (display: grid) {\n  .layout { display: grid; }\n}"),
    ("Variables", "@property", "Registers a custom property with a type, initial value, and inheritance behavior.", "@property --angle {\n  syntax: '<angle>';\n  initial-value: 0deg;\n  inherits: false;\n}"),
    ("Layout", "clamp()", "Clamps a value between a minimum and maximum, scaling with a preferred value.", "font-size: clamp(1rem, 2vw, 1.5rem);"),
    ("Layout", "min()", "Uses the smallest of a list of values.", "width: min(90%, 600px);"),
    ("Layout", "max()", "Uses the largest of a list of values.", "padding: max(16px, 5%);"),
    ("Layout", "calc()", "Performs calculations mixing different units, e.g. percentages and pixels.", "width: calc(100% - 40px);"),
    ("Grid", "subgrid", "Lets a nested grid inherit the row/column tracks of its parent grid.", "grid-template-columns: subgrid;"),
    ("Visual", "mix-blend-mode", "Sets how an element's content blends with content behind it.", "mix-blend-mode: multiply;"),
    ("Visual", "isolation", "Creates a new stacking context, isolating blend modes to within an element.", "isolation: isolate;"),
    ("Visual", "accent-color", "Sets the accent color used by native form controls (checkboxes, radios, etc.).", "accent-color: #7c5cff;"),
    ("Visual", "caret-color", "Sets the color of the text input cursor (caret).", "caret-color: #ff5f56;"),
    ("Layout", "scroll-snap-type", "Enables scroll snapping on a scroll container along an axis.", "scroll-snap-type: x mandatory;"),
    ("Layout", "scroll-snap-align", "Sets where a child snaps to within its scroll-snap container.", "scroll-snap-align: center;"),
    ("Typography", "text-wrap", "Controls text wrapping behavior, e.g. balance for even line lengths in headings.", "text-wrap: balance;"),
    ("Typography", "hyphens", "Enables automatic hyphenation of text at line breaks.", "hyphens: auto;"),
    ("Layout", "writing-mode", "Sets whether text flows horizontally or vertically.", "writing-mode: vertical-rl;"),
    ("Box Model", "all", "Resets every property on an element to a given value (initial/inherit/unset).", "all: unset;"),
]

# ---------------------------------------------------------------------------
# JS: missing language features & core patterns
# ---------------------------------------------------------------------------

JS_GENERATORS_ITERATORS = [
    ("function*()", "Defines a generator function that can pause/resume execution using yield.", "function* range(n) {\n  for (let i = 0; i < n; i++) yield i;\n}"),
    ("yield", "Pauses a generator function and returns a value to the caller.", "function* gen() {\n  const x = yield 1;\n  yield x + 1;\n}"),
    ("Symbol()", "Creates a unique, immutable primitive value often used as an object key.", "const id = Symbol('id');\nobj[id] = 42;"),
    ("Symbol.iterator", "Defines how an object behaves when iterated with for...of or spread.", "obj[Symbol.iterator] = function* () { yield 1; yield 2; };"),
]

JS_ADVANCED_OBJECTS = [
    ("new Proxy()", "Wraps an object to intercept and customize fundamental operations like get/set.", "const p = new Proxy(target, {\n  get(obj, key) { return key in obj ? obj[key] : 'N/A'; }\n});"),
    ("Reflect.get()", "Performs a default object operation (like get) in a way that pairs with Proxy traps.", "Reflect.get(obj, 'name');"),
    ("new WeakMap()", "A Map whose keys must be objects and are garbage-collected when unreferenced.", "const cache = new WeakMap();\ncache.set(el, data);"),
    ("new WeakSet()", "A Set of objects that doesn't prevent its members from being garbage-collected.", "const seen = new WeakSet();\nseen.add(el);"),
    ("Object.getPrototypeOf()", "Returns the prototype (internal [[Prototype]]) of an object.", "Object.getPrototypeOf([]) === Array.prototype;"),
    ("Object.defineProperty()", "Precisely defines a new property or modifies an existing one on an object.", "Object.defineProperty(obj, 'id', { value: 1, writable: false });"),
]

JS_CLASSES_ADVANCED = [
    ("class getter/setter", "Defines computed properties on a class using get/set accessor methods.", "class Circle {\n  get area() { return Math.PI * this.r ** 2; }\n}"),
    ("private field (#field)", "Declares a class field that is only accessible from within the class.", "class Counter {\n  #count = 0;\n  increment() { this.#count++; }\n}"),
    ("static method", "Defines a method that belongs to the class itself, not its instances.", "class MathUtils {\n  static double(n) { return n * 2; }\n}"),
    ("extends / super", "Creates a subclass and calls the parent class's constructor/methods.", "class Dog extends Animal {\n  constructor(name) { super(name); }\n}"),
]

JS_FUNCTION_FEATURES = [
    ("default parameters", "Assigns a fallback value to a function parameter when no argument is passed.", "function greet(name = 'Guest') {\n  return `Hi ${name}`;\n}"),
    ("rest parameters", "Collects any remaining arguments into a real array parameter.", "function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}"),
    ("tagged template", "Passes a template literal's parts to a custom function for processing.", "function highlight(strings, ...values) {\n  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');\n}\nhighlight`Hello ${name}!`;"),
    ("IIFE", "An Immediately Invoked Function Expression, used to run code in its own scope right away.", "(function () {\n  console.log('runs immediately');\n})();"),
    ("closures", "A function that remembers variables from the scope it was created in.", "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}"),
]

JS_BUILTINS_MORE = [
    ("Date.now()", "Returns the current time as milliseconds since the Unix epoch.", "const start = Date.now();"),
    ("new Date().toISOString()", "Formats a Date as an ISO 8601 string, useful for APIs and storage.", "new Date().toISOString(); // '2026-07-11T12:00:00.000Z'"),
    ("regex.test()", "Checks whether a string matches a regular expression, returning true/false.", "/^\\d+$/.test('123'); // true"),
    ("regex.exec()", "Executes a regex search and returns match details, or null.", "/(\\d+)-(\\d+)/.exec('10-20'); // ['10-20','10','20']"),
    ("new URL()", "Parses a URL string into its component parts (host, pathname, searchParams...).", "const u = new URL('https://example.com/p?x=1');\nu.searchParams.get('x'); // '1'"),
    ("new URLSearchParams()", "Parses and builds URL query strings.", "const params = new URLSearchParams('a=1&b=2');\nparams.get('a'); // '1'"),
    ("sessionStorage", "Stores key-value data in the browser for the duration of the page session.", "sessionStorage.setItem('draft', text);"),
    ("import() (dynamic)", "Loads a module asynchronously at runtime, returning a Promise.", "const mod = await import('./chart.js');"),
    ("queueMicrotask()", "Schedules a callback to run in the microtask queue, before the next event loop tick.", "queueMicrotask(() => console.log('after current task'));"),
    ("requestAnimationFrame()", "Schedules a callback to run before the browser's next repaint.", "requestAnimationFrame(() => { el.style.left = pos + 'px'; });"),
]

JS_PATTERNS_MORE = [
    ("hoisting", "JavaScript's behavior of moving variable/function declarations to the top of their scope.", "console.log(x); // undefined, not an error\nvar x = 5;"),
    ("event delegation", "Attaching one listener to a parent to handle events from its current and future children.", "list.addEventListener('click', (e) => {\n  if (e.target.matches('li')) select(e.target);\n});"),
    ("computed property names", "Uses a dynamic expression as an object key when creating an object literal.", "const key = 'score';\nconst obj = { [key]: 100 };"),
    ("nested destructuring", "Extracts values from nested objects/arrays in a single statement.", "const { user: { name, address: { city } } } = data;"),
]

# ---------------------------------------------------------------------------
# Shortcut helpers for the new tables above
# ---------------------------------------------------------------------------

def css_vendor_prefix_shortcuts(prop):
    base = prop.lstrip("-").split("-", 1)[-1] if prop.startswith("-webkit-") or prop.startswith("-moz-") or prop.startswith("-ms-") else prop
    vscode = (
        "VS Code's CSS IntelliSense lists vendor-prefixed properties like `%s` in "
        "the completion popup alongside the unprefixed version -- start typing and "
        "select it, or use an Autoprefixer/PostCSS build step so you only have to "
        "write the standard property." % prop
    )
    notepadpp = (
        "Notepad++ has no CSS property IntelliSense, vendor-prefixed or otherwise. "
        "Type `%s` manually (Word Completion via Ctrl+Enter can finish it once it "
        "has appeared earlier in the document)." % prop
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def css_function_shortcuts(fn):
    vscode = (
        "Inside a property value, start typing `%s` -- VS Code's CSS IntelliSense "
        "will suggest it as a value completion; press Enter/Tab to accept." % fn
    )
    notepadpp = (
        "Notepad++ has no CSS value IntelliSense; type `%s` manually inside the "
        "property value." % fn
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


def css_atrule_shortcuts(rule):
    vscode = (
        "Type `%s` at the top level of a stylesheet -- VS Code's CSS language "
        "service recognizes at-rules and will suggest them; press Enter/Tab to "
        "accept, then Ctrl+Space inside the block for further suggestions." % rule
    )
    notepadpp = (
        "Notepad++ has no CSS at-rule IntelliSense; type `%s { }` manually." % rule
    )
    return {"vscode": vscode, "notepadpp": notepadpp}


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build_v2_items(existing_keys):
    items = []

    def add(item, key):
        if key in existing_keys:
            return
        items.append(item)
        existing_keys.add(key)

    for tag, desc, example in HTML_ELEMENTS_V2:
        key = ("html", "Elements", tag)
        add(make_item("html", "Elements", tag, desc, example, shortcuts=html_element_shortcuts(tag)), key)

    for attr, desc, example, emmet in HTML_ATTRIBUTES_V2:
        key = ("html", "Attributes", attr)
        add(make_item("html", "Attributes", attr, desc, example, shortcuts=html_attr_shortcuts(attr, emmet)), key)

    for prop, desc, example in CSS_VENDOR_PREFIXES:
        key = ("css", "Vendor Prefixes", prop)
        add(make_item("css", "Vendor Prefixes", prop, desc, example,
                       use_case=(f"`{prop}` is needed for consistent behavior across older WebKit/Blink/Gecko "
                                  "browsers before a CSS feature became fully standardized -- modern build "
                                  "tools like Autoprefixer usually add these automatically from the standard property."),
                       shortcuts=css_vendor_prefix_shortcuts(prop)), key)

    for cat, prop, desc, example in CSS_ANIMATION_SUBPROPS:
        key = ("css", cat, prop)
        add(make_item("css", cat, prop, desc, example, shortcuts=css_vendor_prefix_shortcuts(prop) if prop.startswith("-") else {
            "vscode": f"Start typing `{prop}` in a CSS rule -- VS Code's native CSS IntelliSense will suggest it; press Enter/Tab to accept.",
            "notepadpp": f"Notepad++ has no CSS property IntelliSense. Type `{prop}` manually.",
        }), key)

    for cat, fn, desc, example in CSS_TRANSFORM_FUNCTIONS + CSS_FILTER_FUNCTIONS:
        key = ("css", cat, fn)
        add(make_item("css", cat, fn, desc, example, shortcuts=css_function_shortcuts(fn)), key)

    for sel, desc, example in CSS_MODERN_SELECTORS:
        key = ("css", "Selectors", sel)
        add(make_item("css", "Selectors", sel, desc, example, shortcuts=css_selector_shortcuts(sel)), key)

    for cat, feat, desc, example in CSS_MODERN_FEATURES:
        key = ("css", cat, feat)
        if feat.startswith("@"):
            shortcuts = css_atrule_shortcuts(feat)
        elif feat.endswith("()"):
            shortcuts = css_function_shortcuts(feat)
        else:
            shortcuts = {
                "vscode": f"Start typing `{feat}` in a CSS rule -- VS Code's native CSS IntelliSense will suggest it; press Enter/Tab to accept.",
                "notepadpp": f"Notepad++ has no CSS property IntelliSense. Type `{feat}` manually.",
            }
        add(make_item("css", cat, feat, desc, example, shortcuts=shortcuts), key)

    js_groups = [
        ("Generators & Symbols", JS_GENERATORS_ITERATORS),
        ("Advanced Objects", JS_ADVANCED_OBJECTS),
        ("Classes", JS_CLASSES_ADVANCED),
        ("Functions & Classes", JS_FUNCTION_FEATURES),
        ("Built-ins", JS_BUILTINS_MORE),
        ("Patterns", JS_PATTERNS_MORE),
    ]
    for cat, entries in js_groups:
        for shortcut, desc, example in entries:
            key = ("js", cat, shortcut)
            add(make_item("js", cat, shortcut, desc, example, shortcuts=js_shortcuts_for(shortcut, cat)), key)

    return items


def main():
    existing = load_existing()
    existing_keys = set(key_of(i) for i in existing)

    new_items = build_v2_items(existing_keys)
    all_items = existing + new_items
    all_items.sort(key=lambda x: (x["lang"], x["cat"], x["shortcut"]))

    with open(DATA_PATH, "w") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Existing entries: {len(existing)}")
    print(f"New v2 entries added: {len(new_items)}")
    print(f"Total entries: {len(all_items)}")


if __name__ == "__main__":
    main()
