import re
import sys

file_path = "README.md"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

# HTML Tutorial Content
html_tutorial = """### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full HTML Crash Course (Tutorial)

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
"""

css_tutorial = """### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full CSS Crash Course (Tutorial)

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
"""

js_tutorial = """### <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> Full JavaScript Crash Course (Tutorial)

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
"""

# We need to replace the old Deep Dives.
# The old HTML deep dive starts with `### <img src="..." width="22" align="absmiddle" /> Deep Dive: HTML Elements Explained (Tutorial)`
# and ends right before the `---` and separator image.

def replace_section(content, header_regex, new_content):
    # Regex to find the deep dive section up until the next `---`
    pattern = re.compile(header_regex + r'.*?(?=---)', re.DOTALL)
    if not pattern.search(content):
        print(f"Could not find section for regex: {header_regex}")
        return content
    return pattern.sub(new_content + "\n", content)

content = replace_section(content, r'### <img[^>]+> Deep Dive: HTML Elements Explained \(Tutorial\)', html_tutorial)
content = replace_section(content, r'### <img[^>]+> Deep Dive: Essential CSS Concepts \(Tutorial\)', css_tutorial)
content = replace_section(content, r'### <img[^>]+> Deep Dive: Essential JavaScript Concepts \(Tutorial\)', js_tutorial)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Tutorials expanded successfully!")
