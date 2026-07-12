# -*- coding: utf-8 -*-
"""
Replaces the three "Ultimate Reference" tables in README.md with fully
exhaustive versions covering (almost) every HTML element, CSS property,
and JavaScript built-in / method. Also renames the "Category" column
to "Output / Usage Example".

Run once from the repo root: python expand_ultimate_tables.py
"""
import re
import sys

FILE_PATH = "README.md"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# ---------------------------------------------------------------------------
# HTML — every standard element
# ---------------------------------------------------------------------------
html_rows = [
    ("<!DOCTYPE html>", "Document", "Declares the document type and HTML version.", "`<!DOCTYPE html>`"),
    ("<html>", "Document", "The root element of an HTML page.", "`<html lang=\"en\">...</html>`"),
    ("<head>", "Document", "Contains meta-information, title, and links.", "`<head><title>Page</title></head>`"),
    ("<body>", "Document", "Contains the visible page content.", "`<body>...</body>`"),
    ("<title>", "Document", "Sets the title of the document.", "`<title>My Site</title>`"),
    ("<meta>", "Document", "Defines metadata (charset, viewport, SEO).", "`<meta charset=\"UTF-8\">`"),
    ("<link>", "Document", "Links to external resources (CSS, icons).", "`<link rel=\"stylesheet\" href=\"style.css\">`"),
    ("<style>", "Document", "Contains internal CSS.", "`<style>body{color:red;}</style>`"),
    ("<script>", "Scripting", "Embeds or links client-side JavaScript.", "`<script src=\"app.js\"></script>`"),
    ("<noscript>", "Scripting", "Fallback content if JS is disabled.", "`<noscript>Enable JS</noscript>`"),
    ("<base>", "Document", "Sets the base URL for all relative links.", "`<base href=\"https://site.com/\">`"),
    ("<h1>–<h6>", "Text", "Headings, most (1) to least (6) important.", "`<h1>Title</h1>`"),
    ("<p>", "Text", "Defines a paragraph.", "`<p>Some text.</p>`"),
    ("<a>", "Text", "Defines a hyperlink.", "`<a href=\"/about\">About</a>`"),
    ("<br>", "Text", "Inserts a single line break.", "`Line one<br>Line two`"),
    ("<hr>", "Text", "Thematic break (horizontal line).", "`<hr>`"),
    ("<strong>", "Text", "Important text (usually bold).", "`<strong>Warning!</strong>`"),
    ("<b>", "Text", "Bold text with no extra semantic weight.", "`<b>Bold</b>`"),
    ("<em>", "Text", "Emphasized text (usually italic).", "`<em>really</em>`"),
    ("<i>", "Text", "Italic text with no extra semantic weight.", "`<i>Latin term</i>`"),
    ("<u>", "Text", "Underlined text (stylistic, non-hyperlink).", "`<u>Note</u>`"),
    ("<s>", "Text", "Strikethrough text (no longer accurate/relevant).", "`<s>$40</s> $20`"),
    ("<small>", "Text", "Side-comments / fine print.", "`<small>Terms apply</small>`"),
    ("<mark>", "Text", "Highlighted/marked text.", "`<mark>search term</mark>`"),
    ("<sub>", "Text", "Subscript text.", "`H<sub>2</sub>O`"),
    ("<sup>", "Text", "Superscript text.", "`x<sup>2</sup>`"),
    ("<del>", "Text", "Deleted/removed text (with strikethrough).", "`<del>old price</del>`"),
    ("<ins>", "Text", "Inserted/underlined text.", "`<ins>new text</ins>`"),
    ("<abbr>", "Text", "Abbreviation with a tooltip on hover.", "`<abbr title=\"HyperText Markup Language\">HTML</abbr>`"),
    ("<cite>", "Text", "Reference to a creative work's title.", "`<cite>The Odyssey</cite>`"),
    ("<q>", "Text", "Short inline quotation.", "`<q>To be or not to be</q>`"),
    ("<blockquote>", "Text", "Long, block-level quotation.", "`<blockquote>...</blockquote>`"),
    ("<code>", "Text", "Inline snippet of computer code.", "`<code>let x = 1;</code>`"),
    ("<pre>", "Text", "Preformatted text (preserves whitespace).", "`<pre>  indented</pre>`"),
    ("<kbd>", "Text", "Represents keyboard input.", "`Press <kbd>Ctrl</kbd>+<kbd>C</kbd>`"),
    ("<samp>", "Text", "Sample program output.", "`<samp>404 Not Found</samp>`"),
    ("<var>", "Text", "Variable name in a mathematical expression/code.", "`<var>x</var> = 5`"),
    ("<time>", "Text", "Machine-readable date/time.", "`<time datetime=\"2025-01-01\">Jan 1</time>`"),
    ("<wbr>", "Text", "Optional line-break opportunity in a long word.", "`Super<wbr>califragilistic`"),
    ("<span>", "Text", "Generic inline container for phrasing content.", "`<span class=\"tag\">New</span>`"),
    ("<ul>", "Lists", "Unordered (bulleted) list.", "`<ul><li>Milk</li></ul>`"),
    ("<ol>", "Lists", "Ordered (numbered) list.", "`<ol><li>Step 1</li></ol>`"),
    ("<li>", "Lists", "A single list item.", "`<li>Item</li>`"),
    ("<dl>", "Lists", "Description list.", "`<dl><dt>Term</dt><dd>Def</dd></dl>`"),
    ("<dt>", "Lists", "Term in a description list.", "`<dt>HTML</dt>`"),
    ("<dd>", "Lists", "Description of a term in a `<dl>`.", "`<dd>Markup language</dd>`"),
    ("<div>", "Layout", "Generic block-level container.", "`<div class=\"card\">...</div>`"),
    ("<header>", "Semantic", "Introductory content for a page/section.", "`<header><nav>...</nav></header>`"),
    ("<footer>", "Semantic", "Footer for a document or section.", "`<footer>&copy; 2025</footer>`"),
    ("<main>", "Semantic", "The primary content of the document.", "`<main>...</main>`"),
    ("<section>", "Semantic", "A standalone thematic grouping of content.", "`<section id=\"pricing\">...</section>`"),
    ("<article>", "Semantic", "Independent, self-contained content.", "`<article>Blog post</article>`"),
    ("<aside>", "Semantic", "Content tangentially related to the main content.", "`<aside>Related links</aside>`"),
    ("<nav>", "Semantic", "A block of navigation links.", "`<nav><a href=\"/\">Home</a></nav>`"),
    ("<figure>", "Semantic", "Groups media with an optional caption.", "`<figure><img><figcaption>...</figcaption></figure>`"),
    ("<figcaption>", "Semantic", "Caption for a `<figure>`.", "`<figcaption>A cat</figcaption>`"),
    ("<details>", "Semantic", "A disclosure widget the user can toggle open/closed.", "`<details><summary>More</summary>...</details>`"),
    ("<summary>", "Semantic", "Visible heading for a `<details>` element.", "`<summary>Click to expand</summary>`"),
    ("<dialog>", "Semantic", "A dialog box or modal window.", "`<dialog open>Hello</dialog>`"),
    ("<address>", "Semantic", "Contact information for the author/owner.", "`<address>contact@site.com</address>`"),
    ("<img>", "Media", "Embeds an image.", "`<img src=\"cat.jpg\" alt=\"Cat\">`"),
    ("<picture>", "Media", "Container for multiple image sources (responsive).", "`<picture><source><img></picture>`"),
    ("<audio>", "Media", "Embeds sound content.", "`<audio src=\"song.mp3\" controls></audio>`"),
    ("<video>", "Media", "Embeds a video or movie.", "`<video src=\"clip.mp4\" controls></video>`"),
    ("<source>", "Media", "Specifies media resources for `<video>/<audio>/<picture>`.", "`<source src=\"a.webp\" type=\"image/webp\">`"),
    ("<track>", "Media", "Text tracks (subtitles/captions) for media.", "`<track src=\"subs.vtt\" kind=\"subtitles\">`"),
    ("<iframe>", "Media", "Embeds another HTML page within the page.", "`<iframe src=\"https://maps.google.com\"></iframe>`"),
    ("<embed>", "Media", "Embeds external content via a plugin.", "`<embed src=\"file.pdf\">`"),
    ("<object>", "Media", "Embeds an external resource (PDF, plugin, etc).", "`<object data=\"file.pdf\"></object>`"),
    ("<canvas>", "Media", "Draws graphics via JavaScript.", "`<canvas id=\"chart\"></canvas>`"),
    ("<svg>", "Media", "Embeds scalable vector graphics.", "`<svg><circle r=\"5\"/></svg>`"),
    ("<map>", "Media", "Defines a client-side image map.", "`<map name=\"m\"><area></map>`"),
    ("<area>", "Media", "A clickable region inside an image map.", "`<area shape=\"rect\" coords=\"0,0,50,50\">`"),
    ("<table>", "Tables", "Defines an HTML table.", "`<table>...</table>`"),
    ("<caption>", "Tables", "Title/caption for a table.", "`<caption>Sales Data</caption>`"),
    ("<thead>", "Tables", "Groups the header content of a table.", "`<thead><tr><th>Name</th></tr></thead>`"),
    ("<tbody>", "Tables", "Groups the body content of a table.", "`<tbody><tr><td>1</td></tr></tbody>`"),
    ("<tfoot>", "Tables", "Groups the footer content of a table.", "`<tfoot><tr><td>Total</td></tr></tfoot>`"),
    ("<tr>", "Tables", "A row in a table.", "`<tr><td>Cell</td></tr>`"),
    ("<th>", "Tables", "A header cell in a table.", "`<th>Column Title</th>`"),
    ("<td>", "Tables", "A standard data cell in a table.", "`<td>Value</td>`"),
    ("<colgroup>", "Tables", "Groups columns for formatting.", "`<colgroup><col span=\"2\"></colgroup>`"),
    ("<col>", "Tables", "Defines column properties inside a `<colgroup>`.", "`<col style=\"background:#eee\">`"),
    ("<form>", "Forms", "An HTML form for user input.", "`<form action=\"/submit\" method=\"POST\">...</form>`"),
    ("<input>", "Forms", "An interactive input control.", "`<input type=\"email\" name=\"email\">`"),
    ("<textarea>", "Forms", "A multiline text input control.", "`<textarea rows=\"4\"></textarea>`"),
    ("<button>", "Forms", "A clickable button.", "`<button type=\"submit\">Send</button>`"),
    ("<select>", "Forms", "A drop-down list.", "`<select><option>A</option></select>`"),
    ("<option>", "Forms", "A choice inside a `<select>`.", "`<option value=\"us\">USA</option>`"),
    ("<optgroup>", "Forms", "Groups related `<option>`s in a `<select>`.", "`<optgroup label=\"Fruits\">...</optgroup>`"),
    ("<label>", "Forms", "A label for a form control.", "`<label for=\"email\">Email</label>`"),
    ("<fieldset>", "Forms", "Groups related form controls.", "`<fieldset><legend>Payment</legend></fieldset>`"),
    ("<legend>", "Forms", "Caption for a `<fieldset>`.", "`<legend>Shipping</legend>`"),
    ("<datalist>", "Forms", "Predefined autocomplete options for an `<input>`.", "`<datalist id=\"cities\"><option>NYC</option></datalist>`"),
    ("<output>", "Forms", "Displays the result of a calculation.", "`<output name=\"result\">42</output>`"),
    ("<progress>", "Forms", "Displays completion progress of a task.", "`<progress value=\"70\" max=\"100\"></progress>`"),
    ("<meter>", "Forms", "Displays a scalar value within a known range.", "`<meter value=\"6\" max=\"10\"></meter>`"),
    ("<template>", "Scripting", "Holds client-side content not rendered on load.", "`<template id=\"row\">...</template>`"),
    ("<slot>", "Scripting", "Placeholder in a Web Component for content injection.", "`<slot name=\"title\"></slot>`"),
    ("<data>", "Text", "Links content with a machine-readable value.", "`<data value=\"21053\">Product 21053</data>`"),
    ("<ruby>/<rt>/<rp>", "Text", "Annotates East Asian typography (pronunciation).", "`<ruby>漢<rt>kan</rt></ruby>`"),
    ("<bdi>/<bdo>", "Text", "Isolates or overrides text directionality.", "`<bdo dir=\"rtl\">Hello</bdo>`"),
]

html_ultimate_table = "\n#### 📖 The Ultimate HTML Elements Reference Table (Every Element)\n\n" \
    "Here is a massive reference table containing every standard HTML element you will ever use.\n\n" \
    "| Element | What it does | Output / Usage Example |\n" \
    "|---------|--------------|------------------------|\n"
for el, cat, desc, ex in html_rows:
    html_ultimate_table += f"| `{el.strip('`')}` | {desc} | {ex} |\n"

# ---------------------------------------------------------------------------
# CSS — every commonly used property
# ---------------------------------------------------------------------------
css_rows = [
    ("color", "Typography", "Sets the color of text.", "`color: #ff0000;` → red text"),
    ("font-family", "Typography", "Specifies the font for text.", "`font-family: 'Inter', sans-serif;`"),
    ("font-size", "Typography", "Sets the size of the font.", "`font-size: 1.5rem;` → 24px"),
    ("font-weight", "Typography", "Sets the thickness of characters.", "`font-weight: 700;` → bold"),
    ("font-style", "Typography", "Sets italic/normal/oblique style.", "`font-style: italic;`"),
    ("text-align", "Typography", "Horizontal alignment of text.", "`text-align: center;`"),
    ("line-height", "Typography", "Sets the space between lines of text.", "`line-height: 1.6;`"),
    ("text-decoration", "Typography", "Adds decoration (underline, etc).", "`text-decoration: underline;`"),
    ("text-transform", "Typography", "Changes text casing.", "`text-transform: uppercase;` → HELLO"),
    ("letter-spacing", "Typography", "Sets spacing between characters.", "`letter-spacing: 0.05em;`"),
    ("white-space", "Typography", "Controls whitespace/wrapping behavior.", "`white-space: nowrap;`"),
    ("text-overflow", "Typography", "Handles overflowing inline text.", "`text-overflow: ellipsis;` → Hello…"),
    ("text-shadow", "Typography", "Adds a shadow to text.", "`text-shadow: 1px 1px 2px #000;`"),
    ("width", "Box Model", "Sets the width of an element.", "`width: 100%;`"),
    ("height", "Box Model", "Sets the height of an element.", "`height: 100vh;` → full viewport height"),
    ("padding", "Box Model", "Space *inside* an element's border.", "`padding: 10px 20px;`"),
    ("margin", "Box Model", "Space *outside* an element's border.", "`margin: 0 auto;` → horizontal centering"),
    ("border", "Box Model", "Sets border width, style, and color.", "`border: 1px solid #333;`"),
    ("border-radius", "Box Model", "Rounds the corners of an element.", "`border-radius: 50%;` → circle"),
    ("box-sizing", "Box Model", "Defines how width/height are calculated.", "`box-sizing: border-box;`"),
    ("outline", "Box Model", "Draws a line outside the border (no space added).", "`outline: 2px dashed blue;`"),
    ("display", "Layout", "Specifies the display behavior of an element.", "`display: flex;`"),
    ("position", "Layout", "Specifies the positioning method used.", "`position: sticky;`"),
    ("top / right / bottom / left", "Layout", "Offsets for positioned elements.", "`top: 0; left: 0;`"),
    ("z-index", "Layout", "Stack order of an element.", "`z-index: 999;` → renders on top"),
    ("float", "Layout", "Floats an element left or right.", "`float: left;`"),
    ("clear", "Layout", "Stops an element from wrapping around floats.", "`clear: both;`"),
    ("overflow", "Layout", "What happens if content overflows the box.", "`overflow: hidden;`"),
    ("visibility", "Layout", "Hides an element while it still takes up space.", "`visibility: hidden;`"),
    ("flex-direction", "Flexbox", "Direction flex items are placed.", "`flex-direction: column;`"),
    ("justify-content", "Flexbox", "Aligns flex items on the main axis.", "`justify-content: space-between;`"),
    ("align-items", "Flexbox", "Aligns flex items on the cross axis.", "`align-items: center;`"),
    ("align-content", "Flexbox", "Aligns wrapped flex lines.", "`align-content: space-around;`"),
    ("flex-wrap", "Flexbox", "Whether flex items wrap onto new lines.", "`flex-wrap: wrap;`"),
    ("flex", "Flexbox", "Shorthand for grow/shrink/basis.", "`flex: 1;` → fills available space"),
    ("gap", "Flexbox/Grid", "Sets the gap between rows and columns.", "`gap: 1rem;`"),
    ("grid-template-columns", "Grid", "Size and number of grid columns.", "`grid-template-columns: repeat(3, 1fr);`"),
    ("grid-template-rows", "Grid", "Size and number of grid rows.", "`grid-template-rows: auto 1fr;`"),
    ("grid-column / grid-row", "Grid", "Placement of an item within the grid.", "`grid-column: 1 / 3;` → spans 2 columns"),
    ("grid-area", "Grid", "Names/places an item using template areas.", "`grid-area: header;`"),
    ("place-items", "Grid", "Shorthand for align-items + justify-items.", "`place-items: center;`"),
    ("background-color", "Background", "Sets the background color of an element.", "`background-color: #f5f5f5;`"),
    ("background-image", "Background", "Sets one or more background images.", "`background-image: url('bg.jpg');`"),
    ("background-size", "Background", "Specifies the size of the background image.", "`background-size: cover;`"),
    ("background-position", "Background", "Positions a background image.", "`background-position: center;`"),
    ("background-repeat", "Background", "Whether a background image repeats.", "`background-repeat: no-repeat;`"),
    ("box-shadow", "Effects", "Attaches one or more shadows to an element.", "`box-shadow: 0 4px 8px rgba(0,0,0,.1);`"),
    ("opacity", "Effects", "Sets the opacity level for an element.", "`opacity: 0.5;` → 50% transparent"),
    ("filter", "Effects", "Applies graphical effects like blur or grayscale.", "`filter: blur(4px);`"),
    ("backdrop-filter", "Effects", "Applies effects to the area behind an element.", "`backdrop-filter: blur(10px);` → glassmorphism"),
    ("clip-path", "Effects", "Clips an element into a custom shape.", "`clip-path: circle(50%);`"),
    ("mix-blend-mode", "Effects", "Blends an element with what's behind it.", "`mix-blend-mode: multiply;`"),
    ("transition", "Animations", "Shorthand for all transition properties.", "`transition: all 0.3s ease;`"),
    ("transform", "Animations", "Applies a 2D/3D transformation.", "`transform: scale(1.1) rotate(5deg);`"),
    ("animation", "Animations", "Shorthand for CSS animations.", "`animation: slideIn 2s infinite;`"),
    ("@keyframes", "Animations", "Defines the steps of a CSS animation.", "`@keyframes slideIn { from{} to{} }`"),
    ("cursor", "Interaction", "Specifies the mouse cursor to be displayed.", "`cursor: pointer;`"),
    ("pointer-events", "Interaction", "Controls whether an element responds to pointer events.", "`pointer-events: none;`"),
    ("user-select", "Interaction", "Controls whether text can be selected.", "`user-select: none;`"),
    ("scroll-behavior", "Interaction", "Smooth vs instant scrolling.", "`scroll-behavior: smooth;`"),
    ("object-fit", "Media", "How an image/video fills its box.", "`object-fit: cover;`"),
    ("aspect-ratio", "Media", "Forces a preferred width-to-height ratio.", "`aspect-ratio: 16 / 9;`"),
    ("list-style", "Lists", "Shorthand for list marker type/position/image.", "`list-style: none;`"),
    ("vertical-align", "Layout", "Vertical alignment of inline/table-cell elements.", "`vertical-align: middle;`"),
    ("content", "Generated Content", "Inserts generated content (with ::before/::after).", "`content: '★';`"),
    (":root / --var", "Variables", "Defines/uses CSS custom properties.", "`--brand: #6c5ce7;` then `color: var(--brand);`"),
    ("@media", "Responsive", "Applies styles conditionally (e.g. screen width).", "`@media (max-width: 768px) { ... }`"),
    ("@supports", "Responsive", "Applies styles only if a feature is supported.", "`@supports (display: grid) { ... }`"),
]

css_ultimate_table = "\n#### 📖 The Ultimate CSS Properties Reference Table (Every Property)\n\n" \
    "Here is a massive reference table containing every essential CSS property you will use daily.\n\n" \
    "| Property | What it does | Output / Usage Example |\n" \
    "|----------|--------------|------------------------|\n"
for prop, cat, desc, ex in css_rows:
    css_ultimate_table += f"| `{prop}` | {desc} | {ex} |\n"

# ---------------------------------------------------------------------------
# JavaScript — every commonly used built-in / method
# ---------------------------------------------------------------------------
js_rows = [
    ("console.log()", "Debugging", "Prints output to the web console.", "`console.log(\"Hello\");` → Hello"),
    ("let / const", "Variables", "Declares a block-scoped local variable.", "`const name = \"Eli\";`"),
    ("typeof", "Operators", "Returns the type of the operand.", "`typeof 42;` → \"number\""),
    ("=== / !==", "Operators", "Strict equality/inequality (value & type).", "`3 === \"3\";` → false"),
    ("+ - * / %", "Operators", "Basic mathematical operations.", "`10 % 3;` → 1"),
    ("&& / || / !", "Operators", "Logical AND, OR, and NOT.", "`if (a > 5 && b < 10)`"),
    ("?? / ?.", "Operators", "Nullish coalescing / optional chaining.", "`user?.name ?? 'Guest';`"),
    ("if...else", "Control Flow", "Executes code based on a condition.", "`if (age >= 18) { ... }`"),
    ("switch", "Control Flow", "Matches an expression to case clauses.", "`switch(color) { case \"red\": ... }`"),
    ("for", "Control Flow", "Loop with init/condition/increment.", "`for (let i = 0; i < 5; i++)`"),
    ("for...of", "Control Flow", "Loops over iterable values (arrays, strings).", "`for (const x of arr) {}`"),
    ("for...in", "Control Flow", "Loops over enumerable object keys.", "`for (const k in obj) {}`"),
    ("while / do...while", "Control Flow", "Loops while a condition is true.", "`while (i < 10) { i++; }`"),
    ("try...catch", "Error Handling", "Handles runtime errors gracefully.", "`try { risky(); } catch (e) { ... }`"),
    ("throw", "Error Handling", "Throws a custom error/exception.", "`throw new Error(\"Bad input\");`"),
    ("String.length", "Strings", "Returns the length of a string.", "`\"hello\".length;` → 5"),
    ("String.includes()", "Strings", "Checks if a string contains a substring.", "`str.includes(\"world\");`"),
    ("String.trim()", "Strings", "Removes whitespace from both ends.", "`\"  hi  \".trim();` → \"hi\""),
    ("String.split()", "Strings", "Splits a string into an array.", "`\"a,b\".split(\",\");` → ['a','b']"),
    ("String.replace()", "Strings", "Replaces a value with another value.", "`str.replace(\"cat\", \"dog\");`"),
    ("Array.push() / pop()", "Arrays", "Adds/removes the last element.", "`arr.push(\"Apple\");`"),
    ("Array.shift() / unshift()", "Arrays", "Removes/adds the first element.", "`arr.unshift(\"First\");`"),
    ("Array.map()", "Arrays", "Creates a new array from a transform function.", "`arr.map(x => x * 2);`"),
    ("Array.filter()", "Arrays", "Creates a new array of matching elements.", "`arr.filter(x => x > 10);`"),
    ("Array.reduce()", "Arrays", "Reduces an array to a single value.", "`arr.reduce((a,b) => a+b, 0);`"),
    ("Array.forEach()", "Arrays", "Runs a function for each element.", "`arr.forEach(x => console.log(x));`"),
    ("Array.find() / findIndex()", "Arrays", "Finds the first matching element/index.", "`arr.find(x => x.id === 2);`"),
    ("Array.some() / every()", "Arrays", "Tests if some/all elements pass a check.", "`arr.every(x => x > 0);`"),
    ("Array.includes()", "Arrays", "Checks if an array contains a value.", "`arr.includes(5);` → true"),
    ("Array.sort()", "Arrays", "Sorts array elements in place.", "`arr.sort((a,b) => a-b);`"),
    ("Array.slice() / splice()", "Arrays", "Extracts/removes/inserts array elements.", "`arr.splice(1, 2);`"),
    ("Array.flat() / flatMap()", "Arrays", "Flattens nested arrays.", "`[[1],[2]].flat();` → [1,2]"),
    ("Array.from()", "Arrays", "Creates an array from an iterable/array-like.", "`Array.from({length:3},(_, i)=>i);`"),
    ("Object.keys()", "Objects", "Returns an array of an object's property names.", "`Object.keys(user);`"),
    ("Object.values()", "Objects", "Returns an array of an object's values.", "`Object.values(user);`"),
    ("Object.entries()", "Objects", "Returns an array of [key, value] pairs.", "`Object.entries(user);`"),
    ("Object.assign()", "Objects", "Copies properties into a target object.", "`Object.assign({}, a, b);`"),
    ("Object.freeze()", "Objects", "Prevents further modification of an object.", "`Object.freeze(config);`"),
    ("JSON.stringify()", "JSON", "Converts a JS value into a JSON string.", "`JSON.stringify({a:1});` → '{\"a\":1}'"),
    ("JSON.parse()", "JSON", "Parses a JSON string into a JS value.", "`JSON.parse('{\"a\":1}');`"),
    ("Math.random()", "Math", "Random float between 0 (inclusive) and 1.", "`Math.random();`"),
    ("Math.floor() / ceil() / round()", "Math", "Rounds a number down/up/nearest.", "`Math.floor(5.95);` → 5"),
    ("Math.max() / min()", "Math", "Largest/smallest of given numbers.", "`Math.max(10, 20);` → 20"),
    ("Number()", "Numbers", "Converts a value to a number.", "`Number(\"42\");` → 42"),
    ("parseInt() / parseFloat()", "Numbers", "Parses a string into an integer/float.", "`parseInt(\"10px\");` → 10"),
    ("toFixed()", "Numbers", "Formats a number with fixed decimals.", "`(3.14159).toFixed(2);` → \"3.14\""),
    ("setTimeout()", "Timing", "Executes a function after a delay.", "`setTimeout(() => {...}, 1000);`"),
    ("setInterval()", "Timing", "Repeatedly calls a function on a fixed delay.", "`setInterval(() => {...}, 1000);`"),
    ("clearTimeout() / clearInterval()", "Timing", "Cancels a scheduled timer.", "`clearInterval(id);`"),
    ("Promise", "Async", "Represents an eventual async result.", "`new Promise((resolve) => resolve(1));`"),
    ("async / await", "Async", "Syntactic sugar for working with Promises.", "`const data = await fetch(url);`"),
    ("Promise.all()", "Async", "Waits for multiple promises to resolve.", "`await Promise.all([p1, p2]);`"),
    ("fetch()", "Network", "Starts fetching a resource from the network.", "`fetch('https://api.com/data');`"),
    ("document.getElementById()", "DOM", "Returns the element with the given ID.", "`document.getElementById(\"btn\");`"),
    ("document.querySelector()", "DOM", "Returns the first element matching a CSS selector.", "`document.querySelector(\".btn\");`"),
    ("document.querySelectorAll()", "DOM", "Returns all elements matching a CSS selector.", "`document.querySelectorAll(\"li\");`"),
    ("document.createElement()", "DOM", "Creates a new HTML element node.", "`document.createElement(\"div\");`"),
    ("element.innerHTML", "DOM", "Gets/sets the HTML markup inside an element.", "`div.innerHTML = \"<p>Hi</p>\";`"),
    ("element.textContent", "DOM", "Gets/sets the text content of a node.", "`h1.textContent = \"Hello\";`"),
    ("element.addEventListener()", "DOM", "Registers a function to run on an event.", "`btn.addEventListener(\"click\", fn);`"),
    ("element.classList.add()", "DOM", "Adds a CSS class to an element.", "`div.classList.add(\"active\");`"),
    ("element.style", "DOM", "Reads/sets inline CSS on an element.", "`div.style.color = \"red\";`"),
    ("element.dataset", "DOM", "Reads/sets `data-*` attributes.", "`div.dataset.id;` → value of data-id"),
    ("localStorage / sessionStorage", "Storage", "Persists key/value data in the browser.", "`localStorage.setItem(\"k\", \"v\");`"),
    ("window / this", "Global", "The global browser object / execution context.", "`window.innerWidth;`"),
    ("Set / Map", "Collections", "Unique-value sets and key-value maps.", "`const s = new Set([1,2,2]);` → {1,2}"),
    ("spread / rest (...)", "Syntax", "Expands or collects values.", "`const arr2 = [...arr1, 4];`"),
    ("destructuring", "Syntax", "Unpacks values from arrays/objects.", "`const { name } = user;`"),
    ("template literals", "Syntax", "Embeds expressions in strings.", "`` `Hello ${name}` ``"),
    ("classes", "Syntax", "Blueprint for creating objects (OOP).", "`class Dog { bark() {} }`"),
    ("crypto.randomUUID()", "Utility", "Generates a random unique ID (UUID v4).", "`crypto.randomUUID();`"),
]

js_ultimate_table = "\n#### 📖 The Ultimate JavaScript Built-ins & Methods Reference Table (Every Method)\n\n" \
    "Here is a massive reference table containing every essential JavaScript concept, method, and function.\n\n" \
    "| Method/Concept | What it does | Output / Usage Example |\n" \
    "|----------------|--------------|------------------------|\n"
for m, cat, desc, ex in js_rows:
    js_ultimate_table += f"| `{m}` | {desc} | {ex} |\n"

# ---------------------------------------------------------------------------
# Replace the old tables (bounded by their header line up to the line
# right before the next `#### 7.` heading) with the new expanded versions.
# ---------------------------------------------------------------------------
def replace_table(src, start_marker, end_marker, new_block):
    start = src.index(start_marker)
    end = src.index(end_marker, start)
    return src[:start] + new_block.strip("\n") + "\n\n" + src[end:]

content = replace_table(
    content,
    "#### 📖 The Ultimate HTML Elements Reference Table",
    "#### 7. Semantic HTML",
    html_ultimate_table,
)
content = replace_table(
    content,
    "#### 📖 The Ultimate CSS Properties Reference Table",
    "#### 7. Transitions & Animations",
    css_ultimate_table,
)
content = replace_table(
    content,
    "#### 📖 The Ultimate JavaScript Built-ins & Methods Reference Table",
    "#### 7. Fetch API (Getting data from the internet)",
    js_ultimate_table,
)

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Ultimate tables expanded and Category->Output/Usage columns already labeled correctly.")
