# Dev Docs - Comprehensive Web Developer Reference

A sophisticated, multi-language web developer documentation site covering HTML, CSS, and JavaScript with a minimalist editorial aesthetic inspired by Mimo Code docs.

## Features

### Core Functionality
- **Sidebar Navigation** - Language tabs (HTML, CSS, JS) with collapsible categories for easy browsing
- **Global Search** - Cross-language search functionality to find any element, property, or method instantly
- **Individual Doc Pages** - Comprehensive documentation for each reference with five dedicated sections:
  1. **Brief Summary** - Quick overview of the element/property/method
  2. **What it does** - Detailed explanation of functionality
  3. **Syntax & Usage** - Code syntax with highlighting
  4. **Example** - Full code example with one-click copy button
  5. **Real-world Use Case** - Practical application scenarios
- **Syntax Highlighting** - Professional code highlighting using Prism.js
- **Copy Buttons** - One-click copy functionality on all code blocks
- **Theme Toggle** - Dark/light mode support
- **On-this-page Navigation** - Anchor links to all sections for easy navigation on long pages
- **Responsive Design** - Mobile-first design with collapsible sidebar for small screens

### Content
- **166 Total References**
  - 109 HTML elements, attributes, and Emmet shortcuts
  - 30 CSS properties, tricks, and Emmet abbreviations
  - 27 JavaScript methods, ES6+ features, and DOM manipulation techniques
- **Enriched Content** - Each reference includes detailed descriptions, syntax examples, and real-world use cases
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
