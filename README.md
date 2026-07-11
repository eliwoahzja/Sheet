# Eli Shh Docs - Comprehensive Web Developer Reference

A sophisticated, multi-language web developer documentation site covering HTML, CSS, and JavaScript with a minimalist editorial aesthetic inspired by Mimo Code docs.

## Features

### Core Functionality
- **Sidebar Navigation** - Language tabs (HTML, CSS, JS) with collapsible categories for easy browsing
- **Global Search** - Cross-language search functionality to find any element, property, or method instantly
- **Individual Doc Pages** - Comprehensive documentation for each reference with dedicated sections:
  1. **Where to put it** - Which file type and location the code belongs in
  2. **What it does** - Detailed explanation of functionality
  3. **Syntax & Usage** - Code syntax with highlighting
  4. **Static Example Reference** - Full code example with one-click copy button
  5. **Live Preview** - An editable mini code editor (CodeMirror, VS Code theme) next to a sandboxed output pane -- CSS animations/transitions actually play, JS snippets actually run, and edits update the preview instantly
  6. **Real-world Use Case** - Practical application scenarios
  7. **Step-by-Step Integration Guide** - Numbered instructions for adding it to a real project
  8. **Limitations & Pitfalls** - Common mistakes and gotchas
  9. **Editor Shortcuts** - How to trigger/expand the item in both **VS Code** and **Notepad++**
- **Syntax Highlighting** - Professional code highlighting using Prism.js
- **Copy Buttons** - One-click copy functionality on all code blocks
- **Theme Toggle** - Dark/light mode support, and the Live Preview output pane matches the current theme
- **Difficulty Ratings** - Easy/Medium/Hard badges and sidebar sorting by difficulty
- **On-this-page Navigation** - Anchor links to all sections for easy navigation on long pages
- **Responsive Design** - Mobile-first design with collapsible sidebar for small screens

### Content
- **Extensive References**
  - HTML: elements (incl. `<li>`), global/ARIA/media/iframe/form attributes, entities, Emmet shortcuts, and plugin guides
  - CSS: properties, vendor-prefixed properties (`-webkit-`/`-moz-`/`-ms-`), animation sub-properties, transform/filter functions, modern selectors (`:is()`, `:has()`, `:where()`), `@container`/`@supports`, and Emmet abbreviations
  - JS: array/string/object/math/DOM methods, control flow, generators & symbols, private class fields, closures & other core patterns, Date/RegExp/URL basics, and more
- **Enriched Content** - Each reference includes detailed descriptions, syntax examples, real-world use cases, and per-editor shortcut guidance
- **Plugin Install Guides** - Step-by-step "Plugins" category walking through installing editor plugins (e.g. Emmet for Notepad++) with zero installer and zero admin rights, for users on locked-down machines
- **Searchable** - All content is fully searchable across all three languages

### Design
- **Editorial Aesthetic** - Playfair Display serif headlines with minimalist cream background (#F5F1ED)
- **High-contrast Typography** - Professional, magazine-style visual hierarchy
- **Generous Spacing** - Asymmetrical balance with fine geometric lines
- **Accessible** - WCAG-compliant color contrast and keyboard navigation

## Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm 10.15.1 or higher

### Installation

```bash
# Clone the repository
gh repo clone galaxiawtf/sheet dev-docs
cd dev-docs

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the project
pnpm build

# Start the production server
pnpm start
```

## Project Structure

```
dev-docs/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocsLayout.tsx       # Main layout wrapper
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── DocPage.tsx          # Individual documentation page
│   │   │   ├── OnThisPageNav.tsx    # On-page anchor navigation
│   │   │   └── ...                  # Other UI components
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page with search
│   │   │   ├── DocPageWrapper.tsx   # Dynamic doc page router
│   │   │   └── NotFound.tsx         # 404 page
│   │   ├── data/
│   │   │   └── structured_content.json  # All reference content
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx     # Dark/light theme management
│   │   ├── App.tsx                  # Route definitions
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   └── index.html
├── server/
│   └── routers.ts                   # Backend API routes (if needed)
├── drizzle/
│   └── schema.ts                    # Database schema (if needed)
├── parse_content.py                 # Python script to generate content JSON
├── structured_content.json          # Generated content file
└── package.json
```

## Usage

### Browsing Documentation

1. **Home Page** - Start at the landing page to see reference counts for each language
2. **Select Language** - Click on HTML, CSS, or JavaScript cards to view that language's references
3. **Browse Sidebar** - Expand categories to see all available references
4. **Click Reference** - Select any item to view its full documentation page

### Searching

1. **Use the Search Bar** - Type any element, property, or method name
2. **View Results** - Search results display across all languages
3. **Click Result** - Select a result to view its documentation

### Copying Code

1. **Hover Over Code Block** - A copy button appears in the top-right corner
2. **Click Copy** - The code is copied to your clipboard
3. **Paste** - Use the code in your project

### Theme Toggle

- Click the moon/sun icon in the top-right corner to switch between light and dark modes
- Your preference is saved in localStorage

## Content Structure

Each documentation page includes:

| Section | Purpose |
|---------|---------|
| **Name** | The element, property, or method name with language/category badges |
| **Brief Summary** | Quick 1-2 sentence overview |
| **What it does** | Detailed explanation of functionality and use |
| **Syntax & Usage** | Code syntax with highlighting |
| **Example** | Full, practical code example |
| **Real-world Use Case** | Practical application scenario in web development |
| **Editor Shortcuts** | How to type/expand the reference in VS Code (Emmet, IntelliSense, built-in snippets) and in Notepad++ (Emmet plugin, Word Completion, or manual entry) |
| **Step-by-Step Guide** (Plugins category only) | Numbered install steps for getting editor plugins working, including no-installer/no-admin-rights instructions |

## Technologies Used

- **Frontend Framework** - React 19 with TypeScript
- **Styling** - Tailwind CSS 4 with custom editorial design
- **Routing** - Wouter (lightweight router)
- **Code Highlighting** - Prism.js with react-syntax-highlighter
- **Build Tool** - Vite
- **Backend** - Express.js (optional, for future features)
- **Database** - MySQL/TiDB (optional, for future features)

## Customization

### Adding New References

1. Edit `parse_content.py` to add new entries to the source data
2. Run the parser: `python3 parse_content.py`
3. Copy the output to `client/src/data/structured_content.json`
4. Restart the development server

`expand_content.py` was used to bulk-add the full HTML element/attribute/entity
set, additional CSS properties/selectors, additional JS built-ins, and the
per-entry `shortcuts` (VS Code + Notepad++) field to every reference. Re-run it
after adding new curated tables at the top of that file if you want to extend
coverage further; it's idempotent and won't duplicate existing entries.

`expand_content_v2.py` is a second-pass expansion that closed further gaps
(vendor-prefixed CSS properties, animation sub-properties, transform/filter
functions, modern selectors and layout features, the missing `<li>` element,
more HTML attributes, and JS generators/symbols/private fields/patterns). It
imports and reuses `expand_content.py`'s shortcut-generating helpers, and is
also idempotent -- add new tables to it (or a `expand_content_v3.py` following
the same pattern) and re-run to extend coverage even further.

`generate_templates_v3.cjs` adds curated, fully working Templates entries
(Animations, Buttons, Inputs & Forms, UI Components), each with a detailed
step-by-step tutorial rendered in the doc page's integration guide section.
Run it with `node generate_templates_v3.cjs`; it's idempotent — add new
`addTemplate(...)` calls at the top and re-run to extend the set.

### Changing Colors

Edit `client/src/index.css` to modify:
- Background color (currently `#F5F1ED`)
- Text colors
- Accent colors
- Theme colors for dark mode

### Modifying Typography

Edit `client/index.html` to change Google Fonts imports, or modify `client/src/index.css` to adjust font sizes and weights.

## Performance

- **Optimized Search** - O(n) search with instant results
- **Code Splitting** - Lazy-loaded routes for faster initial load
- **Responsive Images** - Optimized for all screen sizes
- **Syntax Highlighting** - Efficient client-side highlighting

## Accessibility

- ✅ Keyboard navigation support
- ✅ High contrast text (#F5F1ED background with dark foreground)
- ✅ Semantic HTML structure
- ✅ Mobile-friendly touch targets
- ✅ Responsive sidebar navigation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Origin

This project was built by reworking the incomplete [galaxiawtf/sheet](https://github.com/galaxiawtf/sheet) repository into a comprehensive, production-ready documentation site. The original content was parsed, enriched, and transformed into a modern web application with a sophisticated editorial design.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

Created as a comprehensive learning resource for web developers.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainer.

---

**Last Updated:** July 2026

**Version:** 1.0.0

**Status:** Complete and Tested ✅
