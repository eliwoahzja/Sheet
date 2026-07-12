import re
import sys

file_path = "README.md"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

html_ultimate_table = """
#### 📖 The Ultimate HTML Elements Reference Table

Here is a massive reference table containing almost every essential HTML element you will ever use, categorized for easy reading.

| Element | Category | What it does | Example Use Case |
|---------|----------|--------------|------------------|
| `<html>` | Document | The root element of an HTML page. | Wraps all other content. |
| `<head>` | Document | Contains meta-information, title, and links. | Storing CSS links and page title. |
| `<body>` | Document | Contains the visible page content. | Everything the user actually sees. |
| `<title>` | Document | Sets the title of the document. | Shows in the browser tab. |
| `<meta>` | Document | Defines metadata (character set, viewport). | SEO and mobile responsiveness. |
| `<link>` | Document | Links to external resources (like CSS). | Linking a stylesheet. |
| `<style>`| Document | Contains internal CSS. | Styling a single page without an external file. |
| `<script>`| Scripting| Embeds client-side JavaScript. | Adding interactivity to the page. |
| `<h1>` to `<h6>` | Text | Headings, from most important (1) to least (6). | Titles and subtitles of articles. |
| `<p>` | Text | Defines a paragraph. | Regular blocks of text. |
| `<a>` | Text | Defines a hyperlink. | Linking to other websites or pages. |
| `<br>` | Text | Inserts a single line break. | Forcing text to the next line. |
| `<hr>` | Text | Defines a thematic break (horizontal line). | Separating sections visually. |
| `<strong>`| Text | Defines important text (usually bold). | Highlighting a warning. |
| `<em>` | Text | Defines emphasized text (usually italic). | Emphasizing a specific word. |
| `<span>` | Text | Generic inline container for phrasing content. | Styling a single word in a paragraph. |
| `<ul>` | Lists | Defines an unordered (bulleted) list. | A grocery list. |
| `<ol>` | Lists | Defines an ordered (numbered) list. | Step-by-step instructions. |
| `<li>` | Lists | Defines a list item. | The actual items inside a `ul` or `ol`. |
| `<div>` | Layout | Generic block-level container. | Grouping elements for CSS Flexbox/Grid. |
| `<header>`| Semantic | Defines a header for a document or section. | The top navigation bar area. |
| `<footer>`| Semantic | Defines a footer for a document or section. | Copyright info at the bottom. |
| `<main>` | Semantic | Specifies the main content of a document. | The primary article or app interface. |
| `<section>`| Semantic| Defines a section in a document. | Grouping related content together. |
| `<article>`| Semantic| Defines an independent, self-contained content. | A blog post or news story. |
| `<aside>` | Semantic | Defines content aside from the page content. | A sidebar with ads or related links. |
| `<nav>` | Semantic | Defines navigation links. | The main menu of the website. |
| `<img>` | Media | Embeds an image. | Displaying a photo or logo. |
| `<audio>` | Media | Embeds sound content. | Playing background music or a podcast. |
| `<video>` | Media | Embeds a video or movie. | Showing a trailer or tutorial video. |
| `<iframe>`| Media | Embeds another HTML page within the current page. | Embedding a YouTube video or Google Map. |
| `<table>` | Tables | Defines an HTML table. | Displaying spreadsheet-like data. |
| `<tr>` | Tables | Defines a row in a table. | A single horizontal row of data. |
| `<th>` | Tables | Defines a header cell in a table. | Column titles (usually bold and centered). |
| `<td>` | Tables | Defines a standard data cell in a table. | The actual data inside the table. |
| `<form>` | Forms | Defines an HTML form for user input. | A login or registration form. |
| `<input>` | Forms | Defines an input control. | Text boxes, checkboxes, radio buttons. |
| `<textarea>`| Forms| Defines a multiline input control. | A comment box or message field. |
| `<button>`| Forms | Defines a clickable button. | A submit or checkout button. |
| `<select>`| Forms | Defines a drop-down list. | Selecting a country from a list. |
| `<option>`| Forms | Defines an option in a drop-down list. | The actual choices in the `<select>`. |
| `<label>` | Forms | Defines a label for an `<input>` element. | Text describing what to type in a box. |

"""

css_ultimate_table = """
#### 📖 The Ultimate CSS Properties Reference Table

Here is a massive reference table containing the most essential CSS properties you will use daily.

| Property | Category | What it does | Example Value |
|----------|----------|--------------|---------------|
| `color` | Typography | Sets the color of text. | `red`, `#ff0000`, `rgb(255,0,0)` |
| `font-family` | Typography | Specifies the font for text. | `'Arial', sans-serif` |
| `font-size` | Typography | Sets the size of the font. | `16px`, `1.5rem`, `2em` |
| `font-weight` | Typography | Sets the thickness of characters. | `bold`, `400`, `700` |
| `text-align` | Typography | Specifies the horizontal alignment of text. | `center`, `left`, `right`, `justify` |
| `line-height` | Typography | Sets the space between lines of text. | `1.5`, `24px` |
| `text-decoration` | Typography| Specifies the decoration added to text. | `none`, `underline`, `line-through` |
| `width` | Box Model | Sets the width of an element. | `100%`, `500px`, `auto` |
| `height` | Box Model | Sets the height of an element. | `100vh`, `300px`, `auto` |
| `padding` | Box Model | Generates space *inside* an element's border. | `10px 20px`, `5%` |
| `margin` | Box Model | Generates space *outside* an element's border. | `0 auto`, `20px` |
| `border` | Box Model | Sets the border width, style, and color. | `1px solid black` |
| `border-radius` | Box Model | Rounds the corners of an element's outer border. | `5px`, `50%` (for circles) |
| `box-sizing` | Box Model | Defines how width and height are calculated. | `border-box` (includes padding/border) |
| `display` | Layout | Specifies the display behavior of an element. | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Layout | Specifies the type of positioning method used. | `relative`, `absolute`, `fixed`, `sticky` |
| `top`, `right`, `bottom`, `left` | Layout | Specifies the position for positioned elements. | `0`, `50px` |
| `z-index` | Layout | Specifies the stack order of an element. | `1`, `999` (higher is on top) |
| `flex-direction`| Flexbox | Specifies the direction of flex items. | `row`, `column` |
| `justify-content`| Flexbox | Aligns flex items horizontally (main axis). | `center`, `space-between` |
| `align-items` | Flexbox | Aligns flex items vertically (cross axis). | `center`, `stretch` |
| `gap` | Flexbox/Grid| Sets the gap between rows and columns. | `20px`, `1rem` |
| `grid-template-columns`| Grid | Specifies the size and number of columns. | `repeat(3, 1fr)`, `200px auto` |
| `background-color`| Background| Sets the background color of an element. | `#ffffff`, `rgba(0,0,0,0.5)` |
| `background-image`| Background| Sets one or more background images. | `url('image.jpg')` |
| `background-size`| Background| Specifies the size of the background image. | `cover`, `contain` |
| `box-shadow` | Effects | Attaches one or more shadows to an element. | `0 4px 8px rgba(0,0,0,0.1)` |
| `opacity` | Effects | Sets the opacity level for an element. | `0.5`, `1` |
| `transition` | Animations| A shorthand property for all transition properties.| `all 0.3s ease` |
| `transform` | Animations| Applies a 2D or 3D transformation to an element. | `scale(1.1)`, `rotate(45deg)` |
| `animation` | Animations| A shorthand property for CSS animations. | `slideIn 2s infinite` |
| `cursor` | Interaction| Specifies the mouse cursor to be displayed. | `pointer`, `not-allowed` |
| `overflow` | Layout | Specifies what happens if content overflows the box.| `hidden`, `scroll`, `auto` |

"""

js_ultimate_table = """
#### 📖 The Ultimate JavaScript Built-ins & Methods Reference Table

Here is a massive reference table containing the most essential JavaScript concepts, methods, and functions.

| Method/Concept | Category | What it does | Example / Syntax |
|----------------|----------|--------------|------------------|
| `console.log()` | Debugging | Prints output to the web console. | `console.log("Hello");` |
| `let` / `const` | Variables | Declares a block-scoped local variable. | `const name = "Eli";` |
| `typeof` | Operators | Returns a string indicating the type of the operand. | `typeof 42; // "number"` |
| `===` / `!==` | Operators | Strict equality/inequality (checks value & type). | `3 === "3"; // false` |
| `+`, `-`, `*`, `/` | Operators | Basic mathematical operations. | `let sum = 10 + 5;` |
| `&&`, `\|\|`, `!` | Operators | Logical AND, OR, and NOT. | `if (a > 5 && b < 10)` |
| `if...else` | Control Flow| Executes code if a specified condition is true. | `if (age >= 18) { ... }` |
| `switch` | Control Flow| Evaluates an expression, matching it to case clauses.| `switch(color) { case "red": ... }` |
| `for` loop | Control Flow| Creates a loop consisting of three optional expressions.| `for (let i = 0; i < 5; i++)` |
| `while` loop | Control Flow| Creates a loop that executes as long as condition is true.| `while (i < 10) { ... }` |
| `String.length` | Strings | Returns the length of a string. | `"hello".length; // 5` |
| `String.includes()`| Strings | Determines whether a string contains another string. | `str.includes("world");` |
| `String.toUpperCase()`| Strings| Converts the string to uppercase letters. | `str.toUpperCase();` |
| `String.replace()`| Strings | Replaces a specified value with another value. | `str.replace("cat", "dog");` |
| `Array.push()` | Arrays | Adds one or more elements to the end of an array. | `arr.push("Apple");` |
| `Array.pop()` | Arrays | Removes the last element from an array. | `arr.pop();` |
| `Array.map()` | Arrays | Creates a new array populated with the results of a function.| `arr.map(x => x * 2);` |
| `Array.filter()` | Arrays | Creates a new array with elements that pass a test. | `arr.filter(x => x > 10);` |
| `Array.forEach()`| Arrays | Executes a provided function once for each element. | `arr.forEach(x => console.log(x));` |
| `Array.reduce()` | Arrays | Executes a reducer function resulting in a single value.| `arr.reduce((sum, x) => sum + x, 0);` |
| `Object.keys()` | Objects | Returns an array of a given object's property names. | `Object.keys(user);` |
| `Object.values()`| Objects | Returns an array of a given object's property values. | `Object.values(user);` |
| `JSON.stringify()`| JSON | Converts a JavaScript object into a JSON string. | `JSON.stringify({a: 1});` |
| `JSON.parse()` | JSON | Parses a JSON string, constructing the JS object. | `JSON.parse('{"a":1}');` |
| `Math.random()` | Math | Returns a floating-point, pseudo-random number between 0 & 1.| `Math.random();` |
| `Math.floor()` | Math | Returns the largest integer less than or equal to a number.| `Math.floor(5.95); // 5` |
| `Math.max()` / `.min()`| Math | Returns the largest/smallest of zero or more numbers. | `Math.max(10, 20); // 20` |
| `setTimeout()` | Timing | Executes a function after a specified delay. | `setTimeout(() => {...}, 1000);` |
| `setInterval()` | Timing | Repeatedly calls a function with a fixed time delay. | `setInterval(() => {...}, 1000);` |
| `document.getElementById()`| DOM | Returns the element that has the ID attribute. | `document.getElementById("btn");` |
| `document.querySelector()`| DOM | Returns the first element that matches a CSS selector. | `document.querySelector(".btn");` |
| `element.innerHTML`| DOM | Gets or sets the HTML markup contained within the element.| `div.innerHTML = "<p>Hi</p>";` |
| `element.textContent`| DOM| Gets or sets the text content of a node and its descendants.| `h1.textContent = "Hello";` |
| `element.addEventListener()`| DOM| Sets up a function that will be called when an event happens.| `btn.addEventListener("click", ...);` |
| `element.classList.add()`| DOM | Adds a CSS class to an element. | `div.classList.add("active");` |
| `fetch()` | Network | Starts the process of fetching a resource from the network.| `fetch('https://api.com/data');` |

"""

# Append tables to the end of their respective crash courses.
# The HTML one goes right before `---` before CSS section.
content = content.replace("#### 7. Semantic HTML", html_ultimate_table + "\n#### 7. Semantic HTML")
content = content.replace("#### 7. Transitions & Animations", css_ultimate_table + "\n#### 7. Transitions & Animations")
content = content.replace("#### 7. Fetch API (Getting data from the internet)", js_ultimate_table + "\n#### 7. Fetch API (Getting data from the internet)")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Ultimate Tables added successfully!")
