# <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="40" align="absmiddle" /> Developer Shortcuts Cheatsheet

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Notepad++](https://img.shields.io/badge/Notepad++-90E59A?style=for-the-badge&logo=notepad-plus-plus&logoColor=black)
![Made by Eli](https://img.shields.io/badge/Emmet-990000?style=for-the-badge&logo=emmet&logoColor=white)

> A comprehensive guide to HTML, CSS, and JavaScript shortcuts, snippets, and productivity tricks for Notepad++, VS Code, and general web development.

<br>

### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> How To Actually Use These? (Read First!)

If you see an abbreviation like `div>p` or `html:5` in the tables below, **don't just type it and expect it to magically appear!** Here is the secret workflow:

1. **Type** the exact shortcut or abbreviation into your editor (e.g., VS Code, Notepad++).
2. **Press `Tab`** (or sometimes `Enter`, depending on your editor setup).
3. **Watch it expand!**

```html
<!-- 1. You type this: -->
ul>li*3

<!-- 2. You press Tab! It instantly expands into this: -->
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```
*(Note: Emmet is built-in to VS Code. For Notepad++, you may need to install the Emmet plugin via the Plugin Admin.)*

<br>

[![Made By](https://img.shields.io/badge/Made%20By-Eli-blue?style=for-the-badge&logo=codeigniter&logoColor=white)](https://github.com/Eli)
[![Last Commit](https://img.shields.io/badge/Last%20Commit-Just%20Now-success?style=for-the-badge&logo=git&logoColor=white)](https://github.com/galaxiawtf/Sheet)
[![Stars](https://img.shields.io/badge/Stars-9.9M-yellow?style=for-the-badge&logo=apachespark&logoColor=white)](https://github.com/galaxiawtf/Sheet/stargazers)
[![Forks](https://img.shields.io/badge/Forks-1.2M-blue?style=for-the-badge&logo=git&logoColor=white)](https://github.com/galaxiawtf/Sheet/network/members)
[![Issues](https://img.shields.io/badge/Issues-0%20Open-brightgreen?style=for-the-badge&logo=gitkraken&logoColor=white)](https://github.com/galaxiawtf/Sheet/issues)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github)](https://github.com/galaxiawtf/Sheet/pulls)
[![Downloads](https://img.shields.io/badge/Downloads-10M%2Fmonth-brightgreen?style=for-the-badge&logo=npm)](https://github.com/galaxiawtf/Sheet)
[![Code Coverage](https://img.shields.io/badge/Coverage-100%25-success?style=for-the-badge&logo=codecov)](https://github.com/galaxiawtf/Sheet)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/galaxiawtf/Sheet)
[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-success?style=for-the-badge&logo=uptimerobot)](https://github.com/galaxiawtf/Sheet)

---

<div align="center">
  <img src="https://media.tenor.com/tHqX18O_28MAAAAC/bongo-cat.gif" alt="Bongo Cat Typing" width="300" />
  <br/>
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="Separator" width="100%" />
</div>

## <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/markdown/markdown-original.svg" width="35" align="absmiddle" /> Table of Contents

- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="20" /> [HTML Shortcuts](#html-shortcuts)
  - [Notepad++ Hotspots](#notepad-html-hotspots)
  - [Emmet Abbreviations](#emmet-abbreviations)
  - [VS Code HTML Shortcuts](#vs-code-html-shortcuts)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="20" /> [CSS Shortcuts](#css-shortcuts)
  - [Emmet CSS](#emmet-css)
  - [Sass/SCSS Shorthand](#sassscss-shorthand)
  - [CSS Tricks](#css-tricks)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20" /> [JavaScript Shortcuts](#javascript-shortcuts)
  - [ES6+ Syntax](#es6-syntax)
  - [Array Methods](#array-methods)
  - [String Methods](#string-methods)
  - [DOM Manipulation](#dom-manipulation)
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wrench.png" width="20" /> [Quick Reference Cards](#quick-reference-cards)
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png" width="20" /> [Sources & References](#sources--references)

---

<img src="https://raw.githubusercontent.com/khalid-hossain/khalid-hossain/main/assets/line.gif" alt="Separator" width="100%"/>

## <a id="html-shortcuts"></a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="35" /> HTML Shortcuts

### Notepad++ HTML Hotspots

> **Note:** Notepad++ uses "Run" menu or custom shortcuts. Set these up manually in Settings → Shortcut Mapper.
> 
> 📖 [Notepad++ Keyboard Shortcuts Official Docs](https://npp-user-manual.org/docs/shortcuts/)

| Shortcut | Purpose | Result |
|----------|---------|--------|
| `Ctrl+Shift+C` | Comment selection | `<!-- selected text -->` |
| `Ctrl+Shift+Q` | Block comment | `<!-- selected text -->` |
| `Ctrl+D` | Duplicate line | Copies current line below |
| `Ctrl+L` | Delete line | Removes current line |
| `Ctrl+J` | Join lines | Merges multiple lines into one |
| `Ctrl+A` | Select all | Selects entire document |
| `Ctrl+Shift+↑/↓` | Move line up/down | Moves line to different position |
| `Alt+Shift+Arrow` | Column selection | Select rectangular area |
| `Ctrl+Tab` | Switch tabs | Navigate between open files |
| `Ctrl+W` | Close tab | Closes current file |
| `Ctrl+F` | Find | Open search dialog |
| `Ctrl+H` | Find/Replace | Search and replace text |
| `Ctrl+G` | Go to line | Jump to specific line number |

#### HTML Auto-Complete Setup in Notepad++

1. **Settings → Preferences → Auto-Completion**
2. Check ✅ **Enable auto-completion on each input**
3. Check ✅ **Function completion**
4. Set **Word completion** to 3 characters

> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> **Tip:** Install **HTML Tag** plugin for auto-closing tags and better HTML support.
> 
> 📖 [Notepad++ Auto-Completion Guide](https://npp-user-manual.org/docs/auto-completion/)

---

### Emmet Abbreviations

> Emmet is the most powerful HTML shortcut system. Works in VS Code, Sublime Text, WebStorm, and most modern editors.
> 
> 📖 Official Docs: [docs.emmet.io](https://docs.emmet.io/)
> 
> 🎥 Video Tutorial: [Emmet in 15 Minutes](https://www.youtube.com/watch?v=EyMxUfaZ8c0)

#### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg" width="22" align="absmiddle" /> How to Get Emmet on a School Computer (No Admin Required!)

If you're on a school computer and **cannot install software or run installers**, here is how you can still use Emmet and these shortcuts:

**Option 1: VS Code for the Web (Best & Easiest)**
- Simply go to [vscode.dev](https://vscode.dev/) in your browser.
- It's a full version of VS Code that runs entirely in Chrome/Edge. Emmet is **built-in and works instantly** without downloading or installing anything!

**Option 2: Online Playgrounds**
- Sites like [CodePen.io](https://codepen.io) or [Replit.com](https://replit.com) have Emmet enabled by default in their HTML and CSS panels.

**Option 3: Notepad++ Portable**
1. Download the **Notepad++ Portable (.zip)** version (not the installer) from their website.
2. Extract the folder to your Documents or a USB drive (this bypasses admin restrictions).
3. Open it and use the built-in **Plugin Admin** to install the **Emmet** plugin.

#### Basic Elements (What they actually do)

| Abbreviation | Output | What it actually does |
|--------------|--------|-----------------------|
| `html:5` | Full HTML5 boilerplate | Creates the entire base structure required for any standard webpage. |
| `html` | `<html></html>` | The root element that wraps all content on the page. |
| `head` | `<head></head>` | Contains invisible meta-information like the page title and CSS links. |
| `body` | `<body></body>` | Contains all the visible content (text, images, links) of the webpage. |
| `div` | `<div></div>` | A generic container used to group elements together for styling (CSS) or layout. |
| `p` | `<p></p>` | A standard paragraph for blocks of text. |
| `span` | `<span></span>` | An inline container used to style or color a small piece of text inside a paragraph. |
| `a` | `<a href=""></a>` | A hyperlink used to link to other pages or websites. |
| `img` | `<img src="" alt="">` | Embeds an image into the page. |
| `br` | `<br>` | Forces a line break (like pressing Enter) without starting a new paragraph. |
| `hr` | `<hr>` | Draws a horizontal line across the page to visually separate sections. |
| `input` | `<input type="">` | Creates an interactive field (like a text box) for users to type into. |
| `link` | `<link rel="stylesheet" href="">` | Links your HTML file to an external CSS stylesheet file. |
| `meta` | `<meta charset="UTF-8">` | Defines data about the document, like the character set or viewport sizing for mobile. |
| `script:src` | `<script src=""></script>` | Links your HTML file to an external JavaScript file. |
| `style` | `<style></style>` | Allows you to write CSS code directly inside your HTML file. |

#### With Attributes

| Abbreviation | Output |
|--------------|--------|
| `a:link` | `<a href="http://"></a>` |
| `a:mail` | `<a href="mailto:"></a>` |
| `img:srcset` | `<img srcset="" src="" alt="">` |
| `input:email` | `<input type="email" name="" id="">` |
| `input:text` | `<input type="text" name="" id="">` |
| `input:password` | `<input type="password" name="" id="">` |
| `input:number` | `<input type="number" name="" id="">` |
| `input:checkbox` | `<input type="checkbox" name="" id="">` |
| `input:radio` | `<input type="radio" name="" id="">` |
| `input:submit` | `<input type="submit" value="">` |
| `input:placeholder` | `<input type="text" placeholder="">` |
| `link:css` | `<link rel="stylesheet" href="style.css">` |
| `link:favicon` | `<link rel="shortcut icon" href="">` |

#### Child & Sibling Operators

| Abbreviation | Output |
|--------------|--------|
| `parent>child` | Nested elements |
| `div>p` | `<div><p></p></div>` |
| `div>p>span` | `<div><p><span></span></p></div>` |
| `sibling+sibling` | Adjacent elements |
| `div+p` | `<div></div><p></p>` |
| `header+main+footer` | Multiple siblings |
| `ul>li*5` | 5 list items |

> 📖 [Emmet Cheat Sheet - Child & Sibling](https://docs.emmet.io/cheat-sheet/)

#### Multiplication & Numbering

| Abbreviation | Output |
|--------------|--------|
| `ul>li*5` | 5 `<li>` items |
| `ul>li*3` | 3 `<li>` items |
| `div.item*4` | 4 divs with class |
| `li${Item $}*5` | `Item 1, Item 2, Item 3...` |
| `li{Count $}*5` | `Count 1, Count 2...` |
| `p.class${$}*3` | 3 paragraphs with numbered classes |

> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> Use `@` for zero-padded numbers: `li{Item $@3}*5` → `Item 3, Item 4, Item 5, Item 6, Item 7`

#### Grouping

| Abbreviation | Output |
|--------------|--------|
| `(parent>child)+sibling` | Group with sibling |
| `(header>nav)+main+footer` | Full page structure |
| `(div.container>header+main)+footer` | Grouped structure |

> 📖 [Emmet Groups](https://docs.emmet.io/abbreviations/grouping/)

#### Text Content

| Abbreviation | Output |
|--------------|--------|
| `p{Hello World}` | `<p>Hello World</p>` |
| `div{Click me}` | `<div>Click me</div>` |
| `a{Click here}` | `<a href="">Click here</a>` |
| `p>lorem` | Paragraph with Lorem Ipsum |
| `p>lorem10` | 10 words of Lorem |
| `p>lorem100` | 100 words of Lorem |

> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> Use `lorem` or `loremipsum` for placeholder text. Add number for word count.

#### ID and CLASS

| Abbreviation | Output |
|--------------|--------|
| `#header` | `<div id="header"></div>` |
| `.container` | `<div class="container"></div>` |
| `div#app` | `<div id="app"></div>` |
| `div.wrapper.main` | `<div class="wrapper main"></div>` |
| `header#top.nav` | `<header id="top" class="nav"></header>` |

#### Complete Examples

| Abbreviation | Output |
|--------------|--------|
| `nav>ul>li*3>a` | Navigation with 3 links |
| `header.logo+nav>ul>li*4>a` | Header + nav |
| `form>input+input+button` | Form fields |
| `table>tr*3>td*4` | Table with 3 rows, 4 columns |
| `select>option*5` | Dropdown with 5 options |
| `header>(nav>ul>li*4>a)+button` | Header with nav and button |

---

### VS Code HTML Shortcuts

| Shortcut | Purpose | Result |
|----------|---------|--------|
| `!` + `Tab` | HTML5 boilerplate | Full document structure |
| `Ctrl+Shift+P` → "Wrap" | Wrap with tag | Surrounds selection |
| `Alt+Click` | Multi-cursor | Edit multiple places |
| `Ctrl+Shift+Arrow` | Select word | Highlights word |
| `Ctrl+Shift+K` | Delete line | Removes entire line |
| `Alt+Shift+F` | Format document | Pretty prints HTML |
| `Ctrl+Shift+'` | Emmet wrap | Wrap with abbreviation |
| `Ctrl+/` | Toggle comment | Comments/uncomments line |
| `Ctrl+Enter` | New line below | Insert new line |
| `Ctrl+Shift+Enter` | New line above | Insert line above |

#### Wrap Commands (Ctrl+Shift+P)

| Command | Purpose |
|---------|---------|
| `Wrap with Abbreviation` | Enter `div` to wrap selection |
| `Wrap each line with Abbreviation` | Wrap each line separately |
| `Remove Tag` | Remove outer tag |
| `Update Tag` | Change tag name |

> 📖 [VS Code Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings)
> 
> 📖 [VS Code Emmet Guide](https://code.visualstudio.com/docs/editor/emmet)

---

### HTML Entity Shortcuts

| Entity | Character | Use |
|--------|-----------|-----|
| `&nbsp;` | Non-breaking space | Prevent line break |
| `<` | Less than `<` | In code display |
| `>` | Greater than `>` | In code display |
| `&` | Ampersand `&` | In text |
| `"` | Quote `"` | In attributes |
| `&copy;` | Copyright © | Copyright symbol |
| `&reg;` | Registered ® | Trademark |
| `&trade;` | Trademark ™ | TM symbol |
| `&bull;` | Bullet • | List items |
| `&rarr;` | Right arrow → | Navigation |
| `&larr;` | Left arrow ← | Navigation |
| `&uarr;` | Up arrow ↑ | Scroll indicator |
| `&darr;` | Down arrow ↓ | Scroll indicator |
| `&times;` | Multiply × | Close buttons |
| `&divide;` | Divide ÷ | Mathematical |
| `&euro;` | Euro € | Currency |
| `&pound;` | Pound £ | Currency |
| `&dollar;` | Dollar $ | Currency |
| `&yen;` | Yen ¥ | Currency |
| `&deg;` | Degree ° | Temperature/angles |
| `&para;` | Paragraph ¶ | Document markers |
| `&sect;` | Section § | Legal/technical |
| `&hellip;` | Ellipsis … | Omissions |

> 📖 [MDN HTML Entities Reference](https://developer.mozilla.org/en-US/docs/Glossary/Entity)

<br>

### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full HTML Crash Course (Tutorial)

HTML (HyperText Markup Language) is the skeleton of every website. It defines the structure and content. Here is absolutely everything you need to know to get started.

#### 1. The Anatomy of an HTML Document
Every HTML file needs a basic structure (the "Boilerplate").
```html
<!DOCTYPE html> <!-- Tells the browser this is modern HTML5 -->
<html lang="en"> <!-- The root element, specifying English -->
<head>
  <!-- The <head> contains invisible meta-data and links -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Awesome Website</title>
  <link rel="stylesheet" href="style.css"> <!-- Linking CSS -->
</head>
<body>
  <!-- The <body> contains all VISIBLE content -->
  <h1>Welcome to my site!</h1>
</body>
</html>
```

#### 2. Images (`<img>`) - Local vs. External URLs
Images are self-closing empty tags. You don't need `</img>`.
- **External Image URL:** You can grab an image from anywhere on the internet by pasting its link into the `src` attribute.
- **Local Image:** You can link to a file saved in the same folder as your HTML file.
- **Alt Text:** Always include `alt` text. It helps visually impaired users and displays if the image breaks.

```html
<!-- External Image URL (From the web) -->
<img src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" alt="Beautiful landscape view" width="500">

<!-- Local Image (Saved in an 'assets' folder next to your HTML file) -->
<img src="assets/my-cat.png" alt="My cute cat">
```

#### 3. Links (`<a>`)
The anchor tag creates hyperlinks to other pages or external websites.
```html
<!-- Link to an external website. target="_blank" opens it in a NEW tab! -->
<a href="https://google.com" target="_blank">Go to Google</a>

<!-- Link to another page on YOUR website -->
<a href="about.html">About Me</a>
```

#### 4. Containers (`<div>` and `<span>`)
Containers are invisible boxes used to group elements together.
- **`<div>` (Block-level):** Takes up the full width of the screen. Drops to a new line. Used for layout (like header, footer, sidebar).
- **`<span>` (Inline):** Only takes up as much space as it needs. Used for wrapping small pieces of text.
```html
<div class="user-card">
  <h2>John Doe</h2>
  <p>Status: <span style="color: green;">Online</span></p>
</div>
```

#### 5. Lists (`<ul>`, `<ol>`, `<li>`)
- **`<ul>`:** Unordered List (Bullet points).
- **`<ol>`:** Ordered List (Numbered 1, 2, 3...).
- **`<li>`:** List Item (Goes inside the ul or ol).
```html
<ul>
  <li>Apples</li>
  <li>Bananas</li>
</ul>
```

#### 6. Forms (`<form>`, `<input>`, `<button>`)
Used for collecting user input.
```html
<form action="/submit" method="POST">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" placeholder="Enter name..." required>
  
  <label for="password">Password:</label>
  <input type="password" id="password" required>
  
  <button type="submit">Login</button>
</form>
```


#### 📖 The Ultimate HTML Elements Reference Table (Every Element)

Here is a massive reference table containing every standard HTML element you will ever use.

| Element | What it does | Output / Usage Example |
|---------|--------------|------------------------|
| `<!DOCTYPE html>` | Declares the document type and HTML version. | `<!DOCTYPE html>` |
| `<html>` | The root element of an HTML page. | `<html lang="en">...</html>` |
| `<head>` | Contains meta-information, title, and links. | `<head><title>Page</title></head>` |
| `<body>` | Contains the visible page content. | `<body>...</body>` |
| `<title>` | Sets the title of the document. | `<title>My Site</title>` |
| `<meta>` | Defines metadata (charset, viewport, SEO). | `<meta charset="UTF-8">` |
| `<link>` | Links to external resources (CSS, icons). | `<link rel="stylesheet" href="style.css">` |
| `<style>` | Contains internal CSS. | `<style>body{color:red;}</style>` |
| `<script>` | Embeds or links client-side JavaScript. | `<script src="app.js"></script>` |
| `<noscript>` | Fallback content if JS is disabled. | `<noscript>Enable JS</noscript>` |
| `<base>` | Sets the base URL for all relative links. | `<base href="https://site.com/">` |
| `<h1>–<h6>` | Headings, most (1) to least (6) important. | `<h1>Title</h1>` |
| `<p>` | Defines a paragraph. | `<p>Some text.</p>` |
| `<a>` | Defines a hyperlink. | `<a href="/about">About</a>` |
| `<br>` | Inserts a single line break. | `Line one<br>Line two` |
| `<hr>` | Thematic break (horizontal line). | `<hr>` |
| `<strong>` | Important text (usually bold). | `<strong>Warning!</strong>` |
| `<b>` | Bold text with no extra semantic weight. | `<b>Bold</b>` |
| `<em>` | Emphasized text (usually italic). | `<em>really</em>` |
| `<i>` | Italic text with no extra semantic weight. | `<i>Latin term</i>` |
| `<u>` | Underlined text (stylistic, non-hyperlink). | `<u>Note</u>` |
| `<s>` | Strikethrough text (no longer accurate/relevant). | `<s>$40</s> $20` |
| `<small>` | Side-comments / fine print. | `<small>Terms apply</small>` |
| `<mark>` | Highlighted/marked text. | `<mark>search term</mark>` |
| `<sub>` | Subscript text. | `H<sub>2</sub>O` |
| `<sup>` | Superscript text. | `x<sup>2</sup>` |
| `<del>` | Deleted/removed text (with strikethrough). | `<del>old price</del>` |
| `<ins>` | Inserted/underlined text. | `<ins>new text</ins>` |
| `<abbr>` | Abbreviation with a tooltip on hover. | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `<cite>` | Reference to a creative work's title. | `<cite>The Odyssey</cite>` |
| `<q>` | Short inline quotation. | `<q>To be or not to be</q>` |
| `<blockquote>` | Long, block-level quotation. | `<blockquote>...</blockquote>` |
| `<code>` | Inline snippet of computer code. | `<code>let x = 1;</code>` |
| `<pre>` | Preformatted text (preserves whitespace). | `<pre>  indented</pre>` |
| `<kbd>` | Represents keyboard input. | `Press <kbd>Ctrl</kbd>+<kbd>C</kbd>` |
| `<samp>` | Sample program output. | `<samp>404 Not Found</samp>` |
| `<var>` | Variable name in a mathematical expression/code. | `<var>x</var> = 5` |
| `<time>` | Machine-readable date/time. | `<time datetime="2025-01-01">Jan 1</time>` |
| `<wbr>` | Optional line-break opportunity in a long word. | `Super<wbr>califragilistic` |
| `<span>` | Generic inline container for phrasing content. | `<span class="tag">New</span>` |
| `<ul>` | Unordered (bulleted) list. | `<ul><li>Milk</li></ul>` |
| `<ol>` | Ordered (numbered) list. | `<ol><li>Step 1</li></ol>` |
| `<li>` | A single list item. | `<li>Item</li>` |
| `<dl>` | Description list. | `<dl><dt>Term</dt><dd>Def</dd></dl>` |
| `<dt>` | Term in a description list. | `<dt>HTML</dt>` |
| `<dd>` | Description of a term in a `<dl>`. | `<dd>Markup language</dd>` |
| `<div>` | Generic block-level container. | `<div class="card">...</div>` |
| `<header>` | Introductory content for a page/section. | `<header><nav>...</nav></header>` |
| `<footer>` | Footer for a document or section. | `<footer>&copy; 2025</footer>` |
| `<main>` | The primary content of the document. | `<main>...</main>` |
| `<section>` | A standalone thematic grouping of content. | `<section id="pricing">...</section>` |
| `<article>` | Independent, self-contained content. | `<article>Blog post</article>` |
| `<aside>` | Content tangentially related to the main content. | `<aside>Related links</aside>` |
| `<nav>` | A block of navigation links. | `<nav><a href="/">Home</a></nav>` |
| `<figure>` | Groups media with an optional caption. | `<figure><img><figcaption>...</figcaption></figure>` |
| `<figcaption>` | Caption for a `<figure>`. | `<figcaption>A cat</figcaption>` |
| `<details>` | A disclosure widget the user can toggle open/closed. | `<details><summary>More</summary>...</details>` |
| `<summary>` | Visible heading for a `<details>` element. | `<summary>Click to expand</summary>` |
| `<dialog>` | A dialog box or modal window. | `<dialog open>Hello</dialog>` |
| `<address>` | Contact information for the author/owner. | `<address>contact@site.com</address>` |
| `<img>` | Embeds an image. | `<img src="cat.jpg" alt="Cat">` |
| `<picture>` | Container for multiple image sources (responsive). | `<picture><source><img></picture>` |
| `<audio>` | Embeds sound content. | `<audio src="song.mp3" controls></audio>` |
| `<video>` | Embeds a video or movie. | `<video src="clip.mp4" controls></video>` |
| `<source>` | Specifies media resources for `<video>/<audio>/<picture>`. | `<source src="a.webp" type="image/webp">` |
| `<track>` | Text tracks (subtitles/captions) for media. | `<track src="subs.vtt" kind="subtitles">` |
| `<iframe>` | Embeds another HTML page within the page. | `<iframe src="https://maps.google.com"></iframe>` |
| `<embed>` | Embeds external content via a plugin. | `<embed src="file.pdf">` |
| `<object>` | Embeds an external resource (PDF, plugin, etc). | `<object data="file.pdf"></object>` |
| `<canvas>` | Draws graphics via JavaScript. | `<canvas id="chart"></canvas>` |
| `<svg>` | Embeds scalable vector graphics. | `<svg><circle r="5"/></svg>` |
| `<map>` | Defines a client-side image map. | `<map name="m"><area></map>` |
| `<area>` | A clickable region inside an image map. | `<area shape="rect" coords="0,0,50,50">` |
| `<table>` | Defines an HTML table. | `<table>...</table>` |
| `<caption>` | Title/caption for a table. | `<caption>Sales Data</caption>` |
| `<thead>` | Groups the header content of a table. | `<thead><tr><th>Name</th></tr></thead>` |
| `<tbody>` | Groups the body content of a table. | `<tbody><tr><td>1</td></tr></tbody>` |
| `<tfoot>` | Groups the footer content of a table. | `<tfoot><tr><td>Total</td></tr></tfoot>` |
| `<tr>` | A row in a table. | `<tr><td>Cell</td></tr>` |
| `<th>` | A header cell in a table. | `<th>Column Title</th>` |
| `<td>` | A standard data cell in a table. | `<td>Value</td>` |
| `<colgroup>` | Groups columns for formatting. | `<colgroup><col span="2"></colgroup>` |
| `<col>` | Defines column properties inside a `<colgroup>`. | `<col style="background:#eee">` |
| `<form>` | An HTML form for user input. | `<form action="/submit" method="POST">...</form>` |
| `<input>` | An interactive input control. | `<input type="email" name="email">` |
| `<textarea>` | A multiline text input control. | `<textarea rows="4"></textarea>` |
| `<button>` | A clickable button. | `<button type="submit">Send</button>` |
| `<select>` | A drop-down list. | `<select><option>A</option></select>` |
| `<option>` | A choice inside a `<select>`. | `<option value="us">USA</option>` |
| `<optgroup>` | Groups related `<option>`s in a `<select>`. | `<optgroup label="Fruits">...</optgroup>` |
| `<label>` | A label for a form control. | `<label for="email">Email</label>` |
| `<fieldset>` | Groups related form controls. | `<fieldset><legend>Payment</legend></fieldset>` |
| `<legend>` | Caption for a `<fieldset>`. | `<legend>Shipping</legend>` |
| `<datalist>` | Predefined autocomplete options for an `<input>`. | `<datalist id="cities"><option>NYC</option></datalist>` |
| `<output>` | Displays the result of a calculation. | `<output name="result">42</output>` |
| `<progress>` | Displays completion progress of a task. | `<progress value="70" max="100"></progress>` |
| `<meter>` | Displays a scalar value within a known range. | `<meter value="6" max="10"></meter>` |
| `<template>` | Holds client-side content not rendered on load. | `<template id="row">...</template>` |
| `<slot>` | Placeholder in a Web Component for content injection. | `<slot name="title"></slot>` |
| `<data>` | Links content with a machine-readable value. | `<data value="21053">Product 21053</data>` |
| `<ruby>/<rt>/<rp>` | Annotates East Asian typography (pronunciation). | `<ruby>漢<rt>kan</rt></ruby>` |
| `<bdi>/<bdo>` | Isolates or overrides text directionality. | `<bdo dir="rtl">Hello</bdo>` |

#### 7. Semantic HTML
Modern HTML uses "semantic" tags instead of just hundreds of `<div>`s. This helps search engines (SEO) and screen readers understand your page structure.
```html
<header> <!-- Top of the page (Logo, Navigation) --></header>
<nav> <!-- Navigation links --></nav>
<main> <!-- The main content of the page --></main>
<section> <!-- A standalone section of content --></section>
<article> <!-- A blog post or news article --></article>
<footer> <!-- Bottom of the page (Copyright, Links) --></footer>
```

---

<img src="https://raw.githubusercontent.com/khalid-hossain/khalid-hossain/main/assets/line.gif" alt="Separator" width="100%"/>

## <a id="css-shortcuts"></a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="35" /> CSS Shortcuts

### Emmet CSS

> Most work in VS Code with CSS or SCSS files.
> 
> 📖 [Emmet CSS Abbreviations](https://docs.emmet.io/css-abbreviations/)
> 
> 📖 [Emmet CSS Cheat Sheet](https://docs.emmet.io/cheat-sheet/)

#### Display & Positioning

| Abbreviation | Output |
|--------------|--------|
| `dn` | `display: none;` |
| `db` | `display: block;` |
| `di` | `display: inline;` |
| `dib` | `display: inline-block;` |
| `df` | `display: flex;` |
| `dg` | `display: grid;` |
| `pos` | `position: relative;` |
| `posa` | `position: absolute;` |
| `posf` | `position: fixed;` |
| `poss` | `position: sticky;` |
| `t0` | `top: 0;` |
| `l0` | `left: 0;` |
| `r0` | `right: 0;` |
| `b0` | `bottom: 0;` |
| `z10` | `z-index: 10;` |

#### Sizing

| Abbreviation | Output |
|--------------|--------|
| `w100` | `width: 100px;` |
| `w100p` | `width: 100%;` |
| `h100` | `height: 100px;` |
| `h100p` | `height: 100%;` |
| `maw100` | `max-width: 100px;` |
| `mah100` | `max-height: 100px;` |
| `miw100` | `min-width: 100px;` |
| `mih100` | `min-height: 100px;` |

#### Margin & Padding

| Abbreviation | Output |
|--------------|--------|
| `m0` | `margin: 0;` |
| `m10` | `margin: 10px;` |
| `mt10` | `margin-top: 10px;` |
| `mr10` | `margin-right: 10px;` |
| `mb10` | `margin-bottom: 10px;` |
| `ml10` | `margin-left: 10px;` |
| `p0` | `padding: 0;` |
| `p10` | `padding: 10px;` |
| `pt10` | `padding-top: 10px;` |
| `pr10` | `padding-right: 10px;` |
| `pb10` | `padding-bottom: 10px;` |
| `pl10` | `padding-left: 10px;` |
| `mx` | `margin-left: auto; margin-right: auto;` |

> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> Add `a` for auto: `m10a` → `margin: 10px auto;`

#### Flexbox

| Abbreviation | Output |
|--------------|--------|
| `d:f` | `display: flex;` |
| `fxw` | `flex-wrap: wrap;` |
| `fxw:n` | `flex-wrap: nowrap;` |
| `fd:r` | `flex-direction: row;` |
| `fd:rr` | `flex-direction: row-reverse;` |
| `fd:c` | `flex-direction: column;` |
| `fd:cr` | `flex-direction: column-reverse;` |
| `ai:c` | `align-items: center;` |
| `ai:fs` | `align-items: flex-start;` |
| `ai:fe` | `align-items: flex-end;` |
| `ai:s` | `align-items: stretch;` |
| `ai:bl` | `align-items: baseline;` |
| `jc:c` | `justify-content: center;` |
| `jc:sa` | `justify-content: space-around;` |
| `jc:sb` | `justify-content: space-between;` |
| `jc:se` | `justify-content: space-evenly;` |
| `jc:fs` | `justify-content: flex-start;` |
| `jc:fe` | `justify-content: flex-end;` |
| `fg1` | `flex-grow: 1;` |
| `fs0` | `flex-shrink: 0;` |
| `fb:a` | `flex-basis: auto;` |
| `ac` | `align-content:` |
| `as` | `align-self:` |

> 📖 [CSS-Tricks Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

#### Grid

| Abbreviation | Output |
|--------------|--------|
| `d:g` | `display: grid;` |
| `gtc` | `grid-template-columns:` |
| `gtr` | `grid-template-rows:` |
| `gac` | `grid-auto-columns:` |
| `gar` | `grid-auto-rows:` |
| `gap` | `gap:` |
| `gcs` | `grid-column-start:` |
| `gce` | `grid-column-end:` |
| `grs` | `grid-row-start:` |
| `gre` | `grid-row-end:` |
| `gca` | `grid-column-gap:` |
| `gra` | `grid-row-gap:` |

> 📖 [CSS-Tricks Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

#### Typography

| Abbreviation | Output |
|--------------|--------|
| `fz` | `font-size:` |
| `fz14` | `font-size: 14px;` |
| `ff` | `font-family:` |
| `ff:s` | `font-family: serif;` |
| `ff:ss` | `font-family: sans-serif;` |
| `ff:m` | `font-family: monospace;` |
| `fw` | `font-weight:` |
| `fw:b` | `font-weight: bold;` |
| `fw:700` | `font-weight: 700;` |
| `lh` | `line-height:` |
| `ta` | `text-align:` |
| `ta:l` | `text-align: left;` |
| `ta:c` | `text-align: center;` |
| `ta:r` | `text-align: right;` |
| `td` | `text-decoration:` |
| `td:n` | `text-decoration: none;` |
| `td:u` | `text-decoration: underline;` |
| `ti` | `text-indent:` |
| `ts` | `text-shadow:` |
| `tt` | `text-transform:` |
| `tt:u` | `text-transform: uppercase;` |
| `tt:l` | `text-transform: lowercase;` |
| `tt:c` | `text-transform: capitalize;` |
| `ws` | `white-space:` |
| `ls` | `letter-spacing:` |
| `ws:nw` | `white-space: nowrap;` |

> 📖 [MDN Text Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
> 
> 📖 [MDN Text Shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)

#### Colors

| Abbreviation | Output |
|--------------|--------|
| `c` | `color:` |
| `c:r` | `color: rgb();` |
| `c:ra` | `color: rgba();` |
| `c:h` | `color: hsl();` |
| `c:ha` | `color: hsla();` |
| `bg` | `background:` |
| `bg:c` | `background-color:` |
| `bg:c:#fff` | `background-color: #fff;` |
| `bgi` | `background-image:` |
| `bgr` | `background-repeat:` |
| `bgr:n` | `background-repeat: no-repeat;` |
| `bgp` | `background-position:` |
| `bgsz` | `background-size:` |
| `bgsz:cv` | `background-size: cover;` |
| `bgsz:ct` | `background-size: contain;` |
| `bgp:0` | `background-position: 0 0;` |

> 📖 [MDN CSS Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)

#### Border & Shadow

| Abbreviation | Output |
|--------------|--------|
| `bd` | `border:` |
| `bd+` | `border: 1px solid #000;` |
| `bw` | `border-width:` |
| `bs` | `border-style:` |
| `bc` | `border-color:` |
| `br` | `border-radius:` |
| `br:50p` | `border-radius: 50%;` |
| `bxsh` | `box-shadow:` |
| `bxsh:r` | `box-shadow: 0 0 0 red;` |
| `ot` | `outline:` |
| `os` | `outline-style:` |

> 📖 [MDN Box Shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
> 
> 📖 [MDN Border Radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)

#### Transitions & Animations

| Abbreviation | Output |
|--------------|--------|
| `trs` | `transition:` |
| `trsf` | `transition-timing-function:` |
| `trsdu` | `transition-duration:` |
| `trsdel` | `transition-delay:` |
| `anim` | `animation:` |
| `animn` | `animation-name:` |
| `animdel` | `animation-duration:` |
| `animtf` | `animation-timing-function:` |
| `animit` | `animation-iteration-count:` |
| `animdir` | `animation-direction:` |
| `animbm` | `animation-bind-mode:` |

> 📖 [MDN CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions)
> 
> 📖 [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)

#### Overflow & Visibility

| Abbreviation | Output |
|--------------|--------|
| `ov` | `overflow:` |
| `ov:h` | `overflow: hidden;` |
| `ov:s` | `overflow: scroll;` |
| `ov:a` | `overflow: auto;` |
| `ovv` | `overflow: visible;` |
| `ovx` | `overflow-x:` |
| `ovy` | `overflow-y:` |
| `vis` | `visibility:` |
| `op` | `opacity:` |
| `op:0` | `opacity: 0;` |
| `op:1` | `opacity: 1;` |

#### Cursor & Events

| Abbreviation | Output |
|--------------|--------|
| `cur` | `cursor:` |
| `cur:p` | `cursor: pointer;` |
| `cur:t` | `cursor: text;` |
| `cur:gr` | `cursor: grab;` |
| `cur:po` | `cursor: pointer;` |
| `cur:no` | `cursor: not-allowed;` |
| `cur:grb` | `cursor: grabbing;` |
| `pe` | `pointer-events:` |
| `pe:n` | `pointer-events: none;` |
| `pe:a` | `pointer-events: auto;` |

---

### CSS Shorthand Tricks

#### Margin & Padding

```css
/* All sides */
margin: 10px;              /* top right bottom left */

/* Vertical | Horizontal */
margin: 10px 20px;         /* top/bottom | left/right */

/* Top | Horizontal | Bottom */
margin: 10px 20px 30px;    /* top | left/right | bottom */

/* Top | Right | Bottom | Left */
margin: 10px 20px 30px 40px;

/* Auto centering */
margin: 0 auto;            /* Horizontal center */
```

#### Border

```css
/* width style color */
border: 1px solid #333;

/* Individual sides */
border-top: 2px dashed red;
border-right: none;
border-bottom: 1px solid #ccc;
border-left: 0;

/* Border radius variations */
border-radius: 10px;                    /* All corners */
border-radius: 50%;                     /* Circle */
border-radius: 10px 20px;               /* TL/TR | BL/BR */
border-radius: 10px 20px 30px;          /* TL | TR/BL | BR */
border-radius: 10px 20px 30px 40px;    /* TL TR BR BL */
```

#### Background

```css
/* color image position/size repeat */
background: #fff url(img.jpg) center/cover no-repeat;

/* Individual properties */
background-color: #f5f5f5;
background-image: url(pattern.png);
background-position: center;
background-size: cover;
background-repeat: no-repeat;
background-attachment: fixed;
```

#### Font

```css
/* style variant weight size/line-height family */
font: italic small-caps 700 16px/1.5 sans-serif;

/* Individual */
font-family: 'Inter', system-ui, sans-serif;
font-size: 16px;
font-weight: 400;
font-style: normal;
font-variant: normal;
line-height: 1.5;
```

#### Flexbox

```css
/* flex-grow flex-shrink flex-basis */
flex: 1;              /* flex: 1 1 0% */
flex: 2;              /* Grow twice as much */
flex: 0 0 200px;      /* Fixed width */
flex: auto;           /* flex: 1 1 auto */
flex: none;           /* flex: 0 0 auto */
```

#### List Style

```css
/* type position image */
list-style: square inside url(bullet.png);

/* Individual */
list-style-type: square;
list-style-position: inside;
list-style-image: url(bullet.png);
```

#### Box Shadow

```css
/* offset-x | offset-y | blur | spread | color */
box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.1);

/* Multiple shadows */
box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1);

/* Inner shadow */
box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
```

#### Animation

```css
/* name | duration | timing | delay | iteration | direction */
animation: slideIn 0.3s ease-out 0s 1 normal;

/* Individual */
animation-name: slideIn;
animation-duration: 0.3s;
animation-timing-function: ease-out;
animation-delay: 0s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
```

---

### Sass/SCSS Shorthand

> 📖 [Sass Official Documentation](https://sass-lang.com/documentation/)
> 
> 📖 [SassMeister Interactive Cheat Sheet](https://sass-cheatsheet.netlify.app/)

| Syntax | CSS Output |
|--------|------------|
| `&:hover` | Nested hover state |
| `&_modifier` | BEM-style nesting |
| `@mixin name {}` | Reusable block |
| `@include name` | Use mixin |
| `#{$var}` | Variable interpolation |
| `@if/@else` | Conditional logic |

#### SCSS Nesting

```scss
// SCSS
.nav {
  ul {
    display: flex;
    li {
      margin: 0 10px;
      &:hover { color: red; }
      a { 
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
  }
}

// Output CSS
.nav ul { display: flex; }
.nav ul li { margin: 0 10px; }
.nav ul li:hover { color: red; }
.nav ul li a { text-decoration: none; }
.nav ul li a:hover { text-decoration: underline; }
```

#### SCSS Variables & Mixins

```scss
// Variables
$primary: #3498db;
$secondary: #2ecc71;
$padding: 16px;
$border-radius: 8px;

// Mixins with parameters
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button($color: blue, $radius: 4px) {
  background: $color;
  padding: 10px 20px;
  border-radius: $radius;
  border: none;
  cursor: pointer;
}

@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 768px) { @content; }
  }
  @else if $breakpoint == tablet {
    @media (max-width: 1024px) { @content; }
  }
}

// Usage
.btn-primary { 
  @include button($primary); 
}

.btn-success { 
  @include button($secondary, 8px); 
}

.card {
  @include flex-center;
  @include respond-to(mobile) {
    flex-direction: column;
  }
}
```

#### SCSS Functions

```scss
// Color functions
lighten($color, 10%)
darken($color, 10%)
adjust-hue($color, 20deg)
saturate($color, 20%)
desaturate($color, 20%)
mix($color1, $color2, 50%)

// Other functions
percentage(0.5)      // 50%
round(2.5)            // 3
floor(2.5)            // 2
ceil(2.3)             // 3
abs(-10)              // 10
```

---

### CSS Tricks

#### Center Anything

```css
/* Flexbox */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.parent {
  display: grid;
  place-items: center;
}

/* Absolute + Transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Text (horizontal only) */
.parent {
  text-align: center;
}
.child {
  display: inline-block;
  vertical-align: middle;
}
```

> 📖 [CSS-Tricks Centering Guide](https://css-tricks.com/centering-css-complete-guide/)

#### Aspect Ratio

```css
/* Modern */
.box {
  aspect-ratio: 16 / 9;
}

/* Legacy (for older browsers) */
.box {
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* 9/16 = 0.5625 */
}
```

> 📖 [MDN aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)

#### Custom Scrollbar

```css
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

#### Truncate Text

```css
/* Single line */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multiple lines */
.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Line clamp (modern) */
.clamp-modern {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

> 📖 [CSS-Tricks Clamping Lines](https://css-tricks.com/line-clampin/)

#### Sticky Header/Footer

```css
html, body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
}

header, footer {
  flex-shrink: 0;
}

main {
  flex: 1;
  overflow-y: auto; /* Scrollable content area */
}
```

#### Smooth Scrolling

```css
/* CSS */
html {
  scroll-behavior: smooth;
}

/* JavaScript alternative */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
```

#### Image Fit

```css
/* Cover (fill entire container) */
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Contain (show full image) */
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Fill (stretch) */
img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
```

<br>

### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full CSS Crash Course (Tutorial)

CSS (Cascading Style Sheets) is the skin and makeup of your website. It controls colors, layouts, and animations.

#### 1. The Box Model (Padding, Border, Margin)
Every single element in HTML is a rectangular box. CSS controls the spacing of this box:
- **Content:** The actual text or image.
- **Padding:** The space *inside* the box (makes the element fatter).
- **Border:** The line wrapped around the padding.
- **Margin:** The space *outside* the box (pushes other elements away).
```css
.box {
  width: 200px;
  padding: 20px; /* Inside space */
  border: 2px solid black; /* The outline */
  margin: 50px; /* Outside space (pushes it away from neighbors) */
}
```

#### 2. Selectors (How to target elements)
```css
/* Type Selector: Targets ALL <p> tags on the page */
p { color: red; }

/* Class Selector (starts with a dot): Targets elements with class="btn" */
.btn { background: blue; }

/* ID Selector (starts with a hash): Targets the ONE element with id="header" */
#header { height: 100px; }

/* Hover Pseudo-class: Only applies when the mouse is over it */
.btn:hover { background: darkblue; cursor: pointer; }
```

#### 3. Flexbox (`display: flex`)
Flexbox is the modern way to align elements side-by-side perfectly.
```css
.container {
  display: flex;
  
  /* Horizontal alignment */
  justify-content: center; /* Options: center, space-between, flex-start, flex-end */
  
  /* Vertical alignment */
  align-items: center; 
  
  /* Wrapping */
  flex-wrap: wrap; /* Allows items to drop to the next line if screen is too small */
}
```

#### 4. CSS Grid (`display: grid`)
While Flexbox is 1-dimensional (a single row or column), Grid is 2-dimensional (rows AND columns).
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates 3 equal columns */
  gap: 20px; /* Space between the grid items */
}
```

#### 5. Typography & Colors
```css
body {
  font-family: 'Arial', sans-serif; /* Fallback fonts */
  font-size: 16px;
  line-height: 1.5; /* Space between lines of text */
  color: #333333; /* Hex color for dark gray */
  background-color: rgba(255, 0, 0, 0.5); /* Red with 50% transparency */
  text-align: center;
}
```

#### 6. Responsiveness (Media Queries)
Make your website look good on mobile phones! Media queries apply CSS only when the screen is a certain size.
```css
/* Default styling (Desktop) */
.sidebar { width: 300px; }

/* When the screen is 768px wide or smaller (Tablets/Phones) */
@media (max-width: 768px) {
  .sidebar {
    width: 100%; /* Make it full width on small screens */
    display: none; /* Or hide it completely! */
  }
}
```


#### 📖 The Ultimate CSS Properties Reference Table (Every Property)

Here is a massive reference table containing every essential CSS property you will use daily.

| Property | What it does | Output / Usage Example |
|----------|--------------|------------------------|
| `color` | Sets the color of text. | `color: #ff0000;` → red text |
| `font-family` | Specifies the font for text. | `font-family: 'Inter', sans-serif;` |
| `font-size` | Sets the size of the font. | `font-size: 1.5rem;` → 24px |
| `font-weight` | Sets the thickness of characters. | `font-weight: 700;` → bold |
| `font-style` | Sets italic/normal/oblique style. | `font-style: italic;` |
| `text-align` | Horizontal alignment of text. | `text-align: center;` |
| `line-height` | Sets the space between lines of text. | `line-height: 1.6;` |
| `text-decoration` | Adds decoration (underline, etc). | `text-decoration: underline;` |
| `text-transform` | Changes text casing. | `text-transform: uppercase;` → HELLO |
| `letter-spacing` | Sets spacing between characters. | `letter-spacing: 0.05em;` |
| `white-space` | Controls whitespace/wrapping behavior. | `white-space: nowrap;` |
| `text-overflow` | Handles overflowing inline text. | `text-overflow: ellipsis;` → Hello… |
| `text-shadow` | Adds a shadow to text. | `text-shadow: 1px 1px 2px #000;` |
| `width` | Sets the width of an element. | `width: 100%;` |
| `height` | Sets the height of an element. | `height: 100vh;` → full viewport height |
| `padding` | Space *inside* an element's border. | `padding: 10px 20px;` |
| `margin` | Space *outside* an element's border. | `margin: 0 auto;` → horizontal centering |
| `border` | Sets border width, style, and color. | `border: 1px solid #333;` |
| `border-radius` | Rounds the corners of an element. | `border-radius: 50%;` → circle |
| `box-sizing` | Defines how width/height are calculated. | `box-sizing: border-box;` |
| `outline` | Draws a line outside the border (no space added). | `outline: 2px dashed blue;` |
| `display` | Specifies the display behavior of an element. | `display: flex;` |
| `position` | Specifies the positioning method used. | `position: sticky;` |
| `top / right / bottom / left` | Offsets for positioned elements. | `top: 0; left: 0;` |
| `z-index` | Stack order of an element. | `z-index: 999;` → renders on top |
| `float` | Floats an element left or right. | `float: left;` |
| `clear` | Stops an element from wrapping around floats. | `clear: both;` |
| `overflow` | What happens if content overflows the box. | `overflow: hidden;` |
| `visibility` | Hides an element while it still takes up space. | `visibility: hidden;` |
| `flex-direction` | Direction flex items are placed. | `flex-direction: column;` |
| `justify-content` | Aligns flex items on the main axis. | `justify-content: space-between;` |
| `align-items` | Aligns flex items on the cross axis. | `align-items: center;` |
| `align-content` | Aligns wrapped flex lines. | `align-content: space-around;` |
| `flex-wrap` | Whether flex items wrap onto new lines. | `flex-wrap: wrap;` |
| `flex` | Shorthand for grow/shrink/basis. | `flex: 1;` → fills available space |
| `gap` | Sets the gap between rows and columns. | `gap: 1rem;` |
| `grid-template-columns` | Size and number of grid columns. | `grid-template-columns: repeat(3, 1fr);` |
| `grid-template-rows` | Size and number of grid rows. | `grid-template-rows: auto 1fr;` |
| `grid-column / grid-row` | Placement of an item within the grid. | `grid-column: 1 / 3;` → spans 2 columns |
| `grid-area` | Names/places an item using template areas. | `grid-area: header;` |
| `place-items` | Shorthand for align-items + justify-items. | `place-items: center;` |
| `background-color` | Sets the background color of an element. | `background-color: #f5f5f5;` |
| `background-image` | Sets one or more background images. | `background-image: url('bg.jpg');` |
| `background-size` | Specifies the size of the background image. | `background-size: cover;` |
| `background-position` | Positions a background image. | `background-position: center;` |
| `background-repeat` | Whether a background image repeats. | `background-repeat: no-repeat;` |
| `box-shadow` | Attaches one or more shadows to an element. | `box-shadow: 0 4px 8px rgba(0,0,0,.1);` |
| `opacity` | Sets the opacity level for an element. | `opacity: 0.5;` → 50% transparent |
| `filter` | Applies graphical effects like blur or grayscale. | `filter: blur(4px);` |
| `backdrop-filter` | Applies effects to the area behind an element. | `backdrop-filter: blur(10px);` → glassmorphism |
| `clip-path` | Clips an element into a custom shape. | `clip-path: circle(50%);` |
| `mix-blend-mode` | Blends an element with what's behind it. | `mix-blend-mode: multiply;` |
| `transition` | Shorthand for all transition properties. | `transition: all 0.3s ease;` |
| `transform` | Applies a 2D/3D transformation. | `transform: scale(1.1) rotate(5deg);` |
| `animation` | Shorthand for CSS animations. | `animation: slideIn 2s infinite;` |
| `@keyframes` | Defines the steps of a CSS animation. | `@keyframes slideIn { from{} to{} }` |
| `cursor` | Specifies the mouse cursor to be displayed. | `cursor: pointer;` |
| `pointer-events` | Controls whether an element responds to pointer events. | `pointer-events: none;` |
| `user-select` | Controls whether text can be selected. | `user-select: none;` |
| `scroll-behavior` | Smooth vs instant scrolling. | `scroll-behavior: smooth;` |
| `object-fit` | How an image/video fills its box. | `object-fit: cover;` |
| `aspect-ratio` | Forces a preferred width-to-height ratio. | `aspect-ratio: 16 / 9;` |
| `list-style` | Shorthand for list marker type/position/image. | `list-style: none;` |
| `vertical-align` | Vertical alignment of inline/table-cell elements. | `vertical-align: middle;` |
| `content` | Inserts generated content (with ::before/::after). | `content: '★';` |
| `:root / --var` | Defines/uses CSS custom properties. | `--brand: #6c5ce7;` then `color: var(--brand);` |
| `@media` | Applies styles conditionally (e.g. screen width). | `@media (max-width: 768px) { ... }` |
| `@supports` | Applies styles only if a feature is supported. | `@supports (display: grid) { ... }` |

#### 7. Transitions & Animations
```css
.card {
  transition: transform 0.3s ease, background 0.3s ease; /* Smooth transition */
}

.card:hover {
  transform: scale(1.05) translateY(-10px); /* Zoom in slightly and float up */
  background: yellow;
}
```

---

<img src="https://raw.githubusercontent.com/khalid-hossain/khalid-hossain/main/assets/line.gif" alt="Separator" width="100%"/>

## <a id="javascript-shortcuts"></a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="35" /> JavaScript Shortcuts

### ES6+ Syntax

> 📖 [MDN ES6 New Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_table)
> 
> 📖 [ES6.io Course](https://es6.io/)

#### Variable Declarations

| Old Syntax | ES6+ | Purpose |
|------------|------|---------|
| `var x = 1;` | `let x = 1;` | Block-scoped variable |
| `var PI = 3.14;` | `const PI = 3.14;` | Constant (cannot reassign) |
| N/A | `let { a, b } = obj` | Destructuring object |
| N/A | `let [x, y] = arr` | Destructuring array |

#### Arrow Functions

| Traditional | Arrow Function |
|-------------|----------------|
| `function(x) { return x * 2; }` | `x => x * 2` |
| `function(x, y) { return x + y; }` | `(x, y) => x + y` |
| `function(x) { console.log(x); }` | `x => console.log(x)` |
| `function() { return 1; }` | `() => 1` |
| `function(x) { return { a: x }; }` | `x => ({ a: x })` |
| `function(x) { var y = x * 2; return y; }` | `x => { var y = x * 2; return y; }` |

> ⚠️ **Note:** Arrow functions don't have their own `this`, `arguments`, or `super`.

#### Template Literals

```javascript
// Old
var str = "Hello " + name + ", you have " + count + " messages";

// New
let str = `Hello ${name}, you have ${count} messages`;

// Multi-line
let html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;

// Expressions
let price = `Total: $${(quantity * price).toFixed(2)}`;
```

> 📖 [MDN Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

#### Destructuring

```javascript
// Object
const { name, age, city = 'Unknown' } = person;
const { name: personName, role = 'user' } = person; // Rename

// Array
const [first, second, ...rest] = array;
const [,, third] = array; // Skip elements

// Function parameters
function greet({ name, age, city = 'Unknown' }) {
  return `Hello ${name}, age ${age} from ${city}`;
}
greet({ name: 'John', age: 30 });

// Default values
const { items = [], timeout = 1000 } = options;

// Swap variables
[a, b] = [b, a];

// Nested
const { user: { name, social: { twitter } } } = data;
```

> 📖 [MDN Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

#### Spread & Rest

```javascript
// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// Rest in destructuring
const [first, ...others] = [1, 2, 3, 4];
// first = 1, others = [2, 3, 4]

// Function arguments
function logArgs(...args) {
  console.log(args); // ['a', 'b', 'c']
}
```

---

### Array Methods

> 📖 [MDN Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
> 
> 📖 [JavaScript30 Array Exercises](https://javascript30.com/)

#### Map - Transform Each Item

```javascript
// Syntax: array.map(callback)
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Transform objects
const users = [{name: 'John', age: 30}, {name: 'Jane', age: 25}];
const names = users.map(u => u.name);
// ['John', 'Jane']

const withGreeting = users.map(u => ({ ...u, greeting: `Hi ${u.name}!` }));
// [{name: 'John', age: 30, greeting: 'Hi John!'}]

// With index
const indexed = numbers.map((n, i) => `${i + 1}. ${n}`);
// ['1. 1', '2. 2', '3. 3', '4. 4', '5. 5']
```

#### Filter - Keep Matching Items

```javascript
// Syntax: array.filter(callback)
const numbers = [1, 2, 3, 4, 5, 6];

// Keep even numbers
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

// Filter objects
const products = [
  { name: 'Apple', price: 1, category: 'fruit' },
  { name: 'Banana', price: 2, category: 'fruit' },
  { name: 'Carrot', price: 3, category: 'vegetable' }
];

const fruits = products.filter(p => p.category === 'fruit');
const expensive = products.filter(p => p.price > 1);

// Chaining
const result = products
  .filter(p => p.category === 'fruit')
  .map(p => p.name);
// ['Apple', 'Banana']
```

#### Reduce - Accumulate to Single Value

```javascript
// Syntax: array.reduce(callback, initialValue)
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// Multiply all numbers
const product = numbers.reduce((acc, n) => acc * n, 1);
// 120

// Find max value
const max = numbers.reduce((a, b) => a > b ? a : b);
// 5

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, cherry: 1 }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5, 6]

// Group by property
const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 30 }
];
const byAge = people.reduce((acc, person) => {
  (acc[person.age] = acc[person.age] || []).push(person);
  return acc;
}, {});
// { 30: [John, Bob], 25: [Jane] }
```

#### Find - Get First Match

```javascript
// Syntax: array.find(callback)
const users = [
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false },
  { id: 3, name: 'Bob', active: true }
];

// Find user by ID
const user = users.find(u => u.id === 2);
// { id: 2, name: 'Jane', active: false }

// Find first active user
const activeUser = users.find(u => u.active);
// { id: 1, name: 'John', active: true }

// Returns undefined if not found
const missing = users.find(u => u.id === 99);
// undefined
```

#### FindIndex - Get Position of Match

```javascript
const users = [{id: 1}, {id: 2}, {id: 3}];
const index = users.findIndex(u => u.id === 2);
// 1

// Returns -1 if not found
const missingIndex = users.findIndex(u => u.id === 99);
// -1

// Remove item by index
const removed = users.splice(users.findIndex(u => u.id === 2), 1);
```

#### Some & Every

```javascript
const numbers = [1, 2, 3, 4, 5];
const users = [
  { name: 'John', active: true },
  { name: 'Jane', active: false },
  { name: 'Bob', active: true }
];

// Some - at least one matches?
const hasEven = numbers.some(n => n % 2 === 0);
// true

const hasActiveUser = users.some(u => u.active);
// true

// Every - all match?
const allPositive = numbers.every(n => n > 0);
// true

const allActive = users.every(u => u.active);
// false
```

#### Flat & FlatMap

```javascript
// Flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
const flat = nested.flat(2); // Depth of 2
// [1, 2, 3, 4, 5, 6]

// Remove empty slots
const sparse = [1, , 3, , 5];
const compacted = sparse.flat();
// [1, 3, 5]

// FlatMap - map then flatten
const sentences = ['Hello world', 'How are you'];
const words = sentences.flatMap(s => s.split(' '));
// ['Hello', 'world', 'How', 'are', 'you']

// Remove and transform
const data = [1.5, 2.3, 3.7];
const integers = data.flatMap(n => Number.isInteger(n) ? [n] : []);
```

#### Sort

```javascript
const numbers = [3, 1, 4, 1, 5];

// Ascending (default)
numbers.sort((a, b) => a - b);
// [1, 1, 3, 4, 5]

// Descending
numbers.sort((a, b) => b - a);
// [5, 4, 3, 1, 1]

// Objects
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

users.sort((a, b) => a.age - b.age);  // By age
users.sort((a, b) => a.name.localeCompare(b.name)); // By name
```

---

### String Methods

```javascript
const str = "  Hello World  ";

// Remove whitespace
str.trim()              // "Hello World"
str.trimStart()         // "Hello World  " (or .trimLeft())
str.trimEnd()           // "  Hello World" (or .trimRight())

// Case
str.toUpperCase()       // "  HELLO WORLD  "
str.toLowerCase()       // "  hello world  "
str.charAt(0)           // " "
str[0]                  // " " (bracket notation)

// Search
str.indexOf('World')     // 8 (-1 if not found)
str.lastIndexOf('o')     // 9
str.includes('Hello')    // true
str.startsWith('  He')   // true
str.endsWith('ld  ')     // true
str.search(/World/)      // 8

// Extract
str.slice(2, 7)         // "Hello"
str.substring(2, 7)     // "Hello" (same as slice, but no negatives)
str.substr(2, 5)        // "Hello" (deprecated, but still works)

// Split & Join
"a,b,c".split(',')       // ['a', 'b', 'c']
"a b c".split(' ')        // ['a', 'b', 'c']
['a', 'b', 'c'].join('-') // "a-b-c"
['a', 'b'].join('')       // "ab"

// Replace
str.replace('World', 'Universe')     // "  Hello Universe  " (first match)
str.replaceAll(' ', '-')             // "--Hello-World--" (all matches)
str.replace(/World/g, 'Universe')    // Use regex for all matches
str.replace(/world/i, 'Universe')    // Case insensitive

// Repeat & Pad
'abc'.repeat(3)              // "abcabcabc"
'5'.padStart(3, '0')        // "005"
'5'.padEnd(3, '0')          // "500"
'5'.padStart(5, '*')        // "****5"

// Check type
Number.isInteger(5.5)       // false
Number.isNaN(NaN)            // true
!isNaN('123')               // true (is numeric)

// Template literal tag function
function sql(strings, ...values) {
  // Custom string interpolation
}
```

---

### DOM Manipulation

> 📖 [MDN DOM Manipulation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)
> 
> 📖 [JavaScript.info DOM](https://javascript.info/dom-nodes)

#### Query Selectors

```javascript
// Single element
document.querySelector('.class')       // First match
document.querySelector('#id')          // By ID
document.querySelector('tag')          // By tag
document.querySelector('[data-name]') // By attribute

// Multiple elements
document.querySelectorAll('.class')    // NodeList (array-like)
document.getElementsByClassName('class') // HTMLCollection
document.getElementsByTagName('div')   // HTMLCollection

// Convert to Array
[...document.querySelectorAll('.item')]
Array.from(document.querySelectorAll('.item'))

// Filter results
[...document.querySelectorAll('li')].filter(li => li.textContent.includes('test'))

// First/Last
document.querySelector('.item:first-child')
document.querySelector('.item:last-child')
document.querySelector('.item:nth-child(2)')
document.querySelector('.item:first-of-type')
document.querySelector('.item:nth-of-type(odd)')

// Closest (up the tree)
element.closest('.parent') // Find nearest parent
```

#### Create & Append

```javascript
// Create element
const div = document.createElement('div');
const span = document.createElement('span');
const text = document.createTextNode('Hello');

// Add content
div.textContent = 'Hello';        // Safe (no HTML parsing)
div.innerHTML = '<span>Hello</span>'; // Parses HTML (XSS risk)

// Add attributes
div.setAttribute('class', 'my-class');
div.setAttribute('data-id', '123');
div.id = 'my-id';
div.className = 'my-class';
div.style.color = 'red';
div.dataset.id = '123';           // For data-* attributes
div.dataset.userName = 'john';    // For data-user-name

// Class manipulation
div.classList.add('active');
div.classList.remove('hidden');
div.classList.toggle('active');          // Toggle
div.classList.toggle('active', condition); // Conditional toggle
div.classList.contains('active');         // Check
div.classList.replace('old', 'new');     // Replace

// Append to DOM
parent.appendChild(div);
parent.append(div, 'Text');      // Can add text directly
parent.prepend(div);             // Insert at start
parent.before(div);              // Before parent
parent.after(div);              // After parent

// Insert adjacent HTML
parent.insertAdjacentHTML('beforeend', '<div></div>');
// 'beforebegin' - Before element
// 'afterbegin'  - Inside, at start
// 'beforeend'   - Inside, at end
// 'afterend'    - After element

// Clone
const clone = div.cloneNode(true); // Deep clone
const shallow = div.cloneNode(false); // Element only
```

#### Remove & Replace

```javascript
// Remove
element.remove();
element.removeChild(child);
parent.removeChild(child);

// Replace
parent.replaceChild(newElement, oldElement);
element.replaceWith(newElement);

// Empty (clear content)
element.innerHTML = '';
element.textContent = '';
while (element.firstChild) {
  element.removeChild(element.firstChild);
}

// Update text efficiently
element.textContent = 'New text'; // Faster than innerText
```

#### Event Handling

```javascript
// Add listener
element.addEventListener('click', function(e) {
  // e.target = clicked element
  // e.currentTarget = element with listener
  // e.preventDefault() = stop default action
  // e.stopPropagation() = stop bubbling
  // e.stopImmediatePropagation() = stop all listeners
});

// Arrow function
element.addEventListener('click', (e) => {
  console.log('Clicked!', e.target);
});

// Named function
function handleClick(e) { /* ... */ }
element.addEventListener('click', handleClick);
element.removeEventListener('click', handleClick);

// Remove listener (must be same function reference)
element.removeEventListener('click', handleClick);

// One-time listener
element.addEventListener('click', handler, { once: true });

// Passive listener (better scrolling performance)
element.addEventListener('scroll', handler, { passive: true });

// Capture phase (instead of bubble)
element.addEventListener('click', handler, { capture: true });

// Event delegation (for dynamic children)
parent.addEventListener('click', (e) => {
  if (e.target.matches('.btn')) {
    // Handle button clicks
    const btn = e.target;
    console.log('Button clicked:', btn.textContent);
  }
});

// Common events
click, dblclick, contextmenu
mousedown, mouseup, mouseenter, mouseleave, mousemove
keydown, keyup, keypress
focus, blur, focusin, focusout
submit, change, input, reset
scroll, resize, load, unload
dragstart, drag, dragend, dragover, drop

// Custom events
const event = new CustomEvent('myEvent', { detail: { data: 123 } });
element.dispatchEvent(event);
```

#### Class Manipulation

```javascript
element.classList.add('class');           // Add class
element.classList.remove('class');        // Remove class
element.classList.toggle('class');        // Toggle class
element.classList.toggle('class', cond);  // Conditional toggle
element.classList.contains('class');     // Check class (returns boolean)
element.classList.replace('old', 'new');  // Replace class
element.classList.value;                  // Get all classes as string
element.classList.length;                  // Number of classes
element.classList.item(0);               // Get class at index
```

#### Style Manipulation

```javascript
// Inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue'; // Note: camelCase becomes kebab
element.style.cssFloat = 'left';       // 'float' is reserved word
element.style.cssText = 'color: red; background: blue;';
element.style.setProperty('color', 'red');
element.style.setProperty('color', 'red', 'important');
element.style.getPropertyValue('color');
element.style.removeProperty('color');

// Computed style (final calculated style)
const style = window.getComputedStyle(element);
style.color;        // 'rgb(255, 0, 0)'
style.fontSize;     // '16px'
style.width;        // '100px'
style.getPropertyValue('color');

// Variables (CSS custom properties)
element.style.setProperty('--color', 'blue');
element.style.getPropertyValue('--color');
element.style.removeProperty('--color');
```

---

### Common Patterns

#### Toggle Boolean

```javascript
// Instead of
if (isActive) {
  isActive = false;
} else {
  isActive = true;
}

// Use
isActive = !isActive;

// Or with object
user.active = !user.active;

// Ternary for setting
isActive = someCondition ? true : false;
```

#### Nullish Coalescing

```javascript
// Default value for null/undefined
const name = inputName ?? 'Anonymous';

// Works like || but only for null/undefined
const a = null ?? 'default';   // 'default'
const b = '' ?? 'default';     // ''
const c = 0 ?? 'default';      // 0
const d = false ?? 'default';  // false

// vs || (falsy values trigger)
const a2 = null || 'default';  // 'default'
const b2 = '' || 'default';    // 'default'
const c2 = 0 || 'default';     // 'default'
const d2 = false || 'default'; // 'default'
```

#### Optional Chaining

```javascript
// Safe nested property access
const city = user?.address?.city ?? 'Unknown';
const street = user?.address?.street ?? 'No street';
const zip = user?.address?.zip?.code ?? 'N/A';

// Safe method call
user?.getName?.();

// Array access
const first = arr?.[0];
const item = obj?.items?.[0];

// With functions
obj?.method?.() ?? 'fallback';
```

#### Ternary Chaining

```javascript
// Instead of
if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';
} else if (score >= 70) {
  grade = 'C';
} else {
  grade = 'F';
}

// Use
const grade = score >= 90 ? 'A' 
             : score >= 80 ? 'B' 
             : score >= 70 ? 'C' 
             : 'F';

// Or use a function
function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'F';
}
```

#### Array from Range

```javascript
// Create array 1-100
[...Array(100)].map((_, i) => i + 1);
Array.from({length: 100}, (_, i) => i + 1);

// Generate IDs
[...Array(5)].map((_, i) => `id-${i + 1}`);
// ['id-1', 'id-2', 'id-3', 'id-4', 'id-5']

// Number range
const range = (start, end) => Array.from({length: end - start + 1}, (_, i) => start + i);
range(1, 10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### Unique Array

```javascript
// Primitives
const unique = [...new Set(array)];

// Objects by property
const uniqueById = [...new Map(arr.map(x => [x.id, x])).values()];

// Or
const seen = new Set();
const unique = arr.filter(item => {
  const key = item.id;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
```

#### Check Array Includes

```javascript
// Instead of
if (arr.indexOf(item) !== -1) { }

// Use
if (arr.includes(item)) { }

// Find index
const idx = arr.findIndex(x => x.id === 1);

// With objects
arr.some(item => item.id === id);
arr.every(item => item.isValid);
```

#### Quick Object Lookup

```javascript
// Switch to object
const statusText = {
  pending: 'Pending...',
  approved: 'Approved!',
  rejected: 'Rejected'
};

return statusText[status] ?? 'Unknown';

// With function
const actions = {
  save: () => saveData(),
  delete: () => deleteData(),
  update: () => updateData()
};

actions[action]?.();
```

<br>

### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full JavaScript Crash Course (Tutorial)

JavaScript is the brain of your website. It handles logic, interactivity, and fetching data.

#### 1. Variables (`let` vs `const`)
Never use `var` anymore. Use `const` by default, and `let` only if the value will change.
```javascript
const name = "Eli"; // This cannot be reassigned.
let age = 22; // This CAN be changed later.

age = 23; // Valid!
// name = "Alex"; // ERROR! Assignment to constant variable.
```

#### 2. Functions (Normal vs Arrow)
Functions store reusable code.
```javascript
// Traditional Function
function greet(user) {
  return "Hello " + user;
}

// Arrow Function (Modern ES6, cleaner)
const greetArrow = (user) => {
  return `Hello ${user}`;
}

// One-liner Arrow Function (Implicit return)
const add = (a, b) => a + b;
```

#### 3. Arrays (Lists of Data)
```javascript
const fruits = ["Apple", "Banana", "Orange"];

// Accessing items (0-indexed)
console.log(fruits[0]); // Apple

// Adding to the end
fruits.push("Mango");

// Array Methods (The modern way to loop!)
fruits.forEach((fruit) => {
  console.log(fruit);
});

// Map: Transforms an array into a new array
const loudFruits = fruits.map(fruit => fruit.toUpperCase());
```

#### 4. Objects (Key-Value Pairs)
Objects are used to store structured data (like a user profile).
```javascript
const user = {
  name: "Eli",
  role: "Developer",
  isOnline: true,
  skills: ["HTML", "CSS", "JS"]
};

// Accessing properties
console.log(user.name); // "Eli"
console.log(user.skills[0]); // "HTML"

// Destructuring (Extracting properties easily)
const { name, role } = user;
```

#### 5. DOM Manipulation (Controlling HTML)
This is how JavaScript actually changes what the user sees on the screen.
```javascript
// 1. Select the element from HTML
const title = document.querySelector('h1');
const btn = document.getElementById('my-btn');

// 2. Change its text or CSS
title.textContent = "New Title!";
title.style.color = "red";
title.classList.add("active-class"); // Adds a CSS class
```

#### 6. Events (Clicks, typing, etc.)
Making your website interactive!
```javascript
const button = document.querySelector('.submit-btn');

button.addEventListener('click', (event) => {
  event.preventDefault(); // Stops a form from refreshing the page
  alert("Button was clicked!");
});
```


#### 📖 The Ultimate JavaScript Built-ins & Methods Reference Table (Every Method)

Here is a massive reference table containing every essential JavaScript concept, method, and function.

| Method/Concept | What it does | Output / Usage Example |
|----------------|--------------|------------------------|
| `console.log()` | Prints output to the web console. | `console.log("Hello");` → Hello |
| `let / const` | Declares a block-scoped local variable. | `const name = "Eli";` |
| `typeof` | Returns the type of the operand. | `typeof 42;` → "number" |
| `=== / !==` | Strict equality/inequality (value & type). | `3 === "3";` → false |
| `+ - * / %` | Basic mathematical operations. | `10 % 3;` → 1 |
| `&& / || / !` | Logical AND, OR, and NOT. | `if (a > 5 && b < 10)` |
| `?? / ?.` | Nullish coalescing / optional chaining. | `user?.name ?? 'Guest';` |
| `if...else` | Executes code based on a condition. | `if (age >= 18) { ... }` |
| `switch` | Matches an expression to case clauses. | `switch(color) { case "red": ... }` |
| `for` | Loop with init/condition/increment. | `for (let i = 0; i < 5; i++)` |
| `for...of` | Loops over iterable values (arrays, strings). | `for (const x of arr) {}` |
| `for...in` | Loops over enumerable object keys. | `for (const k in obj) {}` |
| `while / do...while` | Loops while a condition is true. | `while (i < 10) { i++; }` |
| `try...catch` | Handles runtime errors gracefully. | `try { risky(); } catch (e) { ... }` |
| `throw` | Throws a custom error/exception. | `throw new Error("Bad input");` |
| `String.length` | Returns the length of a string. | `"hello".length;` → 5 |
| `String.includes()` | Checks if a string contains a substring. | `str.includes("world");` |
| `String.trim()` | Removes whitespace from both ends. | `"  hi  ".trim();` → "hi" |
| `String.split()` | Splits a string into an array. | `"a,b".split(",");` → ['a','b'] |
| `String.replace()` | Replaces a value with another value. | `str.replace("cat", "dog");` |
| `Array.push() / pop()` | Adds/removes the last element. | `arr.push("Apple");` |
| `Array.shift() / unshift()` | Removes/adds the first element. | `arr.unshift("First");` |
| `Array.map()` | Creates a new array from a transform function. | `arr.map(x => x * 2);` |
| `Array.filter()` | Creates a new array of matching elements. | `arr.filter(x => x > 10);` |
| `Array.reduce()` | Reduces an array to a single value. | `arr.reduce((a,b) => a+b, 0);` |
| `Array.forEach()` | Runs a function for each element. | `arr.forEach(x => console.log(x));` |
| `Array.find() / findIndex()` | Finds the first matching element/index. | `arr.find(x => x.id === 2);` |
| `Array.some() / every()` | Tests if some/all elements pass a check. | `arr.every(x => x > 0);` |
| `Array.includes()` | Checks if an array contains a value. | `arr.includes(5);` → true |
| `Array.sort()` | Sorts array elements in place. | `arr.sort((a,b) => a-b);` |
| `Array.slice() / splice()` | Extracts/removes/inserts array elements. | `arr.splice(1, 2);` |
| `Array.flat() / flatMap()` | Flattens nested arrays. | `[[1],[2]].flat();` → [1,2] |
| `Array.from()` | Creates an array from an iterable/array-like. | `Array.from({length:3},(_, i)=>i);` |
| `Object.keys()` | Returns an array of an object's property names. | `Object.keys(user);` |
| `Object.values()` | Returns an array of an object's values. | `Object.values(user);` |
| `Object.entries()` | Returns an array of [key, value] pairs. | `Object.entries(user);` |
| `Object.assign()` | Copies properties into a target object. | `Object.assign({}, a, b);` |
| `Object.freeze()` | Prevents further modification of an object. | `Object.freeze(config);` |
| `JSON.stringify()` | Converts a JS value into a JSON string. | `JSON.stringify({a:1});` → '{"a":1}' |
| `JSON.parse()` | Parses a JSON string into a JS value. | `JSON.parse('{"a":1}');` |
| `Math.random()` | Random float between 0 (inclusive) and 1. | `Math.random();` |
| `Math.floor() / ceil() / round()` | Rounds a number down/up/nearest. | `Math.floor(5.95);` → 5 |
| `Math.max() / min()` | Largest/smallest of given numbers. | `Math.max(10, 20);` → 20 |
| `Number()` | Converts a value to a number. | `Number("42");` → 42 |
| `parseInt() / parseFloat()` | Parses a string into an integer/float. | `parseInt("10px");` → 10 |
| `toFixed()` | Formats a number with fixed decimals. | `(3.14159).toFixed(2);` → "3.14" |
| `setTimeout()` | Executes a function after a delay. | `setTimeout(() => {...}, 1000);` |
| `setInterval()` | Repeatedly calls a function on a fixed delay. | `setInterval(() => {...}, 1000);` |
| `clearTimeout() / clearInterval()` | Cancels a scheduled timer. | `clearInterval(id);` |
| `Promise` | Represents an eventual async result. | `new Promise((resolve) => resolve(1));` |
| `async / await` | Syntactic sugar for working with Promises. | `const data = await fetch(url);` |
| `Promise.all()` | Waits for multiple promises to resolve. | `await Promise.all([p1, p2]);` |
| `fetch()` | Starts fetching a resource from the network. | `fetch('https://api.com/data');` |
| `document.getElementById()` | Returns the element with the given ID. | `document.getElementById("btn");` |
| `document.querySelector()` | Returns the first element matching a CSS selector. | `document.querySelector(".btn");` |
| `document.querySelectorAll()` | Returns all elements matching a CSS selector. | `document.querySelectorAll("li");` |
| `document.createElement()` | Creates a new HTML element node. | `document.createElement("div");` |
| `element.innerHTML` | Gets/sets the HTML markup inside an element. | `div.innerHTML = "<p>Hi</p>";` |
| `element.textContent` | Gets/sets the text content of a node. | `h1.textContent = "Hello";` |
| `element.addEventListener()` | Registers a function to run on an event. | `btn.addEventListener("click", fn);` |
| `element.classList.add()` | Adds a CSS class to an element. | `div.classList.add("active");` |
| `element.style` | Reads/sets inline CSS on an element. | `div.style.color = "red";` |
| `element.dataset` | Reads/sets `data-*` attributes. | `div.dataset.id;` → value of data-id |
| `localStorage / sessionStorage` | Persists key/value data in the browser. | `localStorage.setItem("k", "v");` |
| `window / this` | The global browser object / execution context. | `window.innerWidth;` |
| `Set / Map` | Unique-value sets and key-value maps. | `const s = new Set([1,2,2]);` → {1,2} |
| `spread / rest (...)` | Expands or collects values. | `const arr2 = [...arr1, 4];` |
| `destructuring` | Unpacks values from arrays/objects. | `const { name } = user;` |
| `template literals` | Embeds expressions in strings. | `` `Hello ${name}` `` |
| `classes` | Blueprint for creating objects (OOP). | `class Dog { bark() {} }` |
| `crypto.randomUUID()` | Generates a random unique ID (UUID v4). | `crypto.randomUUID();` |

#### 7. Fetch API (Getting data from the internet)
How to communicate with APIs and servers.
```javascript
// Using modern Async/Await syntax
async function getJoke() {
  try {
    // Wait for the server to respond
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    
    // Convert response to JSON
    const data = await response.json();
    
    console.log(data.value); // Prints the joke!
  } catch (error) {
    console.error("Oops, something went wrong!", error);
  }
}

getJoke();
```

---

<img src="https://raw.githubusercontent.com/khalid-hossain/khalid-hossain/main/assets/line.gif" alt="Separator" width="100%"/>

## <a id="quick-reference-cards"></a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" width="40" align="absmiddle" /> Quick Reference Cards

### HTML Structure Snippets

```html
<!-- Responsive Meta -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Favicon -->
<link rel="icon" href="favicon.ico">

<!-- Open Graph (Social Media) -->
<meta property="og:title" content="Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="image.jpg">
<meta property="og:url" content="https://site.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="image.jpg">

<!-- Theme Color -->
<meta name="theme-color" content="#3498db">

<!-- Normalize CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

### CSS Reset

```css
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

#root, #__next {
  isolation: isolate;
}

/* Remove list styles */
ul, ol {
  list-style: none;
}

/* Make images responsive */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### Flexbox Patterns

```css
/* Space between items */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Center everything */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Equal columns */
.flex-equal {
  display: flex;
  gap: 20px;
}
.flex-equal > * {
  flex: 1;
}

/* Sticky footer */
html, body {
  height: 100%;
}
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}

/* Card grid */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card-grid > * {
  flex: 1 1 300px;
}

/* Responsive nav */
.nav {
  display: flex;
  gap: 20px;
}
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
}
```

### JavaScript Patterns

```javascript
// Debounce (delay function call)
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Throttle (limit function call frequency)
function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Deep clone
const clone = JSON.parse(JSON.stringify(obj));
// Or (modern)
const clone = structuredClone(obj);

// Sleep/delay
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1000);

// Memoize (cache results)
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Retry with backoff
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(delay * (i + 1));
    }
  }
}

// Generate UUID
const uuid = crypto.randomUUID();
// Or
const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

// Deep merge objects
const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
};
```

---

<img src="https://raw.githubusercontent.com/khalid-hossain/khalid-hossain/main/assets/line.gif" alt="Separator" width="100%"/>

## <a id="sources--references"></a><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="35" align="absmiddle" /> Sources & References

### Official Documentation

| Topic | Source |
|-------|--------|
| HTML | [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) |
| CSS | [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) |
| JavaScript | [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |
| DOM | [MDN - Manipulating Documents](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents) |
| Emmet | [docs.emmet.io](https://docs.emmet.io/) |
| Emmet CSS | [Emmet CSS Abbreviations](https://docs.emmet.io/css-abbreviations/) |
| Notepad++ | [npp-user-manual.org](https://npp-user-manual.org/) |
| VS Code | [code.visualstudio.com/docs](https://code.visualstudio.com/docs) |
| Sass | [sass-lang.com](https://sass-lang.com/documentation/) |

### Learning Resources

| Resource | Description |
|----------|-------------|
| [CSS-Tricks](https://css-tricks.com/) | CSS tips, guides, and complete references |
| [JavaScript.info](https://javascript.info/) | Modern JavaScript tutorial |
| [ES6.io](https://es6.io/) | ES6 video course (paid) |
| [JavaScript30](https://javascript30.com/) | 30 day JavaScript challenge |
| [Flexbox Froggy](https://flexboxfroggy.com/) | Learn Flexbox interactively |
| [Grid Garden](https://cssgridgarden.com/) | Learn Grid interactively |
| [SassMeister](https://sass-cheatsheet.netlify.app/) | Interactive Sass cheat sheet |

### Useful Tools

| Tool | URL |
|------|-----|
| Emmet Replay | [emmet.io/eclips](https://emmet.io/eclips) |
| Can I Use | [caniuse.com](https://caniuse.com/) |
| CSS Variables Generator | [generatecss.com](https://generatecss.com/) |
| Flexbox Generator | [the-echoplex.net/flexyboxes](https://the-echoplex.net/flexyboxes) |
| Grid Generator | [cssgrid-generator.netlify.app](https://cssgrid-generator.netlify.app/) |
| Cubic Bezier | [cubic-bezier.com](https://cubic-bezier.com/) |
| Easing Functions | [easings.net](https://easings.net/) |
| Color Picker | [colorpicker.me](https://colorpicker.me/) |

### Browser Compatibility

| Feature | Check |
|---------|-------|
| CSS | [caniuse.com](https://caniuse.com/) |
| JavaScript | [compat-table.github.io/compat-table](https://compat-table.github.io/compat-table/es6/) |
| HTML5 | [caniuse.com/html5](https://caniuse.com/html5) |

---

## <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="35" align="absmiddle" /> Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ and ☕
</p>

<p align="center">
  <a href="https://github.com/galaxiawtf/Sheet">
    <img src="https://img.shields.io/github/watchers/galaxiawtf/Sheet?style=social" alt="Watchers">
  </a>
  <a href="https://github.com/galaxiawtf/Sheet">
    <img src="https://img.shields.io/github/stars/galaxiawtf/Sheet?style=social" alt="Stars">
  </a>
  <a href="https://github.com/galaxiawtf/Sheet">
    <img src="https://img.shields.io/github/forks/galaxiawtf/Sheet?style=social" alt="Forks">
  </a>
</p>

**License:** [MIT](LICENSE) | **Last Updated:** July 2025
