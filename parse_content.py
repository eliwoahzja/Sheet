import json
import re

def generate_what_it_does(item):
    # Simple generation based on description
    if item["lang"] == "html":
        return f"The `{item["shortcut"]}` element is used to {item["desc"].lower().replace(".", "")}."
    elif item["lang"] == "css":
        return f"The `{item["shortcut"]}` property is used to {item["desc"].lower().replace(".", "")}."
    elif item["lang"] == "js":
        return f"The `{item["shortcut"]}` method/feature is used to {item["desc"].lower().replace(".", "")}."
    return item["desc"]

def generate_syntax(item):
    # Attempt to extract syntax from shortcut or example
    if item["lang"] == "html":
        if item["shortcut"].startswith("`<") and item["shortcut"].endswith(">`"): # e.g., `<body>`
            return item["shortcut"].strip("`")
        elif item["example"].startswith("`<") and item["example"].endswith(">`"): # e.g., `<a href=""></a>`
            return item["example"].strip("`")
        else:
            return item["shortcut"]
    elif item["lang"] == "css":
        if ":" in item["shortcut"] and ";" in item["shortcut"]:
            return item["shortcut"]
        elif ":" in item["example"] and ";" in item["example"]:
            return item["example"].split("\n")[0] # Take first line as syntax
        else:
            return f"{item["shortcut"]}: value;"
    elif item["lang"] == "js":
        if "(" in item["shortcut"] and ")" in item["shortcut"]:
            return item["shortcut"]
        elif "(" in item["example"] and ")" in item["example"]:
            return item["example"].split("\n")[0]
        else:
            return f"{item["shortcut"]}()"
    return item["shortcut"]

def generate_use_case(item):
    # Generate a more detailed use case
    if item["lang"] == "html":
        if item["cat"] == "Elements":
            return f"You would use the `{item["shortcut"]}` element to structure the main content of your webpage, ensuring semantic correctness and accessibility. For example, a blog post could be wrapped in an `<article>` tag, or a navigation bar in a `<nav>` tag."
        elif item["cat"] == "Attributes":
            return f"The `{item["shortcut"]}` attribute is crucial for providing additional information or functionality to HTML elements. For instance, `href` for links, `src` for images, or `alt` for accessibility in images."
        elif "Emmet" in item["cat"]:
            return f"Emmet abbreviations like `{item["shortcut"]}` are incredibly useful for rapidly writing HTML boilerplate. They allow developers to type short, CSS-like expressions that expand into full HTML snippets, significantly speeding up development time."
        elif item["cat"] == "Entities":
            return f"HTML entities like `{item["shortcut"]}` are essential for displaying special characters that might otherwise be interpreted as HTML code or are not easily typed on a keyboard. For example, `&amp;nbsp;` for a non-breaking space or `&amp;copy;` for the copyright symbol."
    elif item["lang"] == "css":
        if item["cat"] == "Layout":
            return f"Using `{item["shortcut"]}` is fundamental for controlling the positioning and arrangement of elements on a webpage. For example, `display: flex;` or `display: grid;` are used to create responsive and complex layouts."
        elif item["cat"] == "Typography":
            return f"Typography properties like `{item["shortcut"]}` are used to style text, controlling its appearance, size, and flow. This is vital for readability and maintaining a consistent visual hierarchy across the site."
        elif item["cat"] == "Animation":
            return f"CSS animations, often defined with `{item["shortcut"]}`, bring dynamic and interactive elements to web interfaces. They enhance user experience by providing visual feedback and engaging transitions without relying on JavaScript."
        elif item["cat"] == "Responsive":
            return f"Media queries, using `{item["shortcut"]}`, are the cornerstone of responsive web design. They allow styles to be applied conditionally based on device characteristics like screen width, ensuring optimal viewing across a wide range of devices."
        elif "Emmet" in item["cat"]:
            return f"Emmet for CSS, such as `{item["shortcut"]}`, streamlines the process of writing CSS rules. By expanding short abbreviations into full property-value pairs, it helps developers write stylesheets more efficiently and with fewer errors."
    elif item["lang"] == "js":
        if item["cat"] == "ES6+":
            return f"ES6+ features like `{item["shortcut"]}` introduce modern syntax and powerful capabilities to JavaScript, making code more readable, efficient, and maintainable. For example, arrow functions for concise syntax or `async/await` for asynchronous operations."
        elif item["cat"] == "Array Methods":
            return f"Array methods such as `{item["shortcut"]}` provide powerful and concise ways to manipulate and iterate over arrays. They are indispensable for data processing, filtering, and transformation in JavaScript applications."
        elif item["cat"] == "String Methods":
            return f"String methods like `{item["shortcut"]}` are frequently used for text manipulation, parsing, and formatting. They are essential for handling user input, displaying dynamic content, and integrating with APIs."
        elif item["cat"] == "DOM Manipulation":
            return f"DOM manipulation techniques, often involving `{item["shortcut"]}`, are central to creating interactive web pages. They allow JavaScript to dynamically change the content, structure, and style of a document in response to user actions or data updates."
    return f"In a real-world application, you would use {item["shortcut"]} when you need to implement {item["desc"].lower()}. This is particularly useful in modern web development for creating responsive and accessible user interfaces."

def parse_data_js(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    shortcuts = []
    pattern = re.compile(r"{\s*lang:\s*\"(.*?)\",\s*cat:\s*\"(.*?)\",\s*shortcut:\s*\"(.*?)\",\s*desc:\s*\"(.*?)\",\s*example:\s*\"(.*?)\"\s*}")

    for match in pattern.finditer(content):
        lang, cat, shortcut, desc, example = match.groups()
        example = example.replace("\\n", "\n").replace("\\\"", "\"")
        item = {
            'lang': lang,
            'cat': cat,
            'shortcut': shortcut,
            'desc': desc,
            'example': example
        }
        item["whatItDoes"] = generate_what_it_does(item)
        item["syntax"] = generate_syntax(item)
        item["useCase"] = generate_use_case(item)
        shortcuts.append(item)
    return shortcuts

def parse_readme_md(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    html_data = []
    css_data = []
    js_data = []

    table_regex = re.compile(r'\|\s*Abbreviation\s*\|\s*Output\s*\|\s*What it actually does\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)')
    
    html_basic_elements_match = re.search(r'#### Basic Elements \(What they actually do\)\s*\n' + table_regex.pattern, content)
    if html_basic_elements_match:
        table_content = html_basic_elements_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'html',
                    'cat': 'Elements',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_attributes_match = re.search(r'#### With Attributes\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_attributes_match:
        table_content = html_attributes_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Attributes',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'HTML attribute related shortcut'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_operators_match = re.search(r'#### Child & Sibling Operators\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_operators_match:
        table_content = html_operators_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet Operators',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Emmet child or sibling operator'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_multiplication_match = re.search(r'#### Multiplication & Numbering\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_multiplication_match:
        table_content = html_multiplication_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet Multiplication',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Emmet multiplication and numbering'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_grouping_match = re.search(r'#### Grouping\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_grouping_match:
        table_content = html_grouping_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet Grouping',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Emmet grouping operators'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_text_content_match = re.search(r'#### Text Content\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_text_content_match:
        table_content = html_text_content_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet Text Content',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Emmet text content generation'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_id_class_match = re.search(r'#### ID and CLASS\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_id_class_match:
        table_content = html_id_class_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet ID/Class',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Emmet ID and Class attributes'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_complete_examples_match = re.search(r'#### Complete Examples\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\n\|---+\|---+\|\n((?:\|.*\|.*\|\n)+)', content)
    if html_complete_examples_match:
        table_content = html_complete_examples_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 2:
                item = {
                    'lang': 'html',
                    'cat': 'Emmet Examples',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': 'Complete Emmet examples'
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    html_entity_shortcuts_match = re.search(r'### HTML Entity Shortcuts\s*\n\|\s*Entity\s*\|\s*Character\s*\|\s*Use\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if html_entity_shortcuts_match:
        table_content = html_entity_shortcuts_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'html',
                    'cat': 'Entities',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                html_data.append(item)

    css_tricks_match = re.search(r'### CSS Tricks\s*\n\|\s*Property\s*\|\s*Description\s*\|\s*Example\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if css_tricks_match:
        table_content = css_tricks_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'css',
                    'cat': 'Tricks',
                    'shortcut': parts[0],
                    'desc': parts[1],
                    'example': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                css_data.append(item)

    css_emmet_match = re.search(r'### Emmet CSS\s*\n\|\s*Abbreviation\s*\|\s*Output\s*\|\s*Description\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if css_emmet_match:
        table_content = css_emmet_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'css',
                    'cat': 'Emmet',
                    'shortcut': parts[0],
                    'example': parts[1],
                    'desc': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                css_data.append(item)

    js_es6_match = re.search(r'### ES6\+ Syntax\s*\n\|\s*Feature\s*\|\s*Description\s*\|\s*Example\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if js_es6_match:
        table_content = js_es6_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'js',
                    'cat': 'ES6+',
                    'shortcut': parts[0],
                    'desc': parts[1],
                    'example': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                js_data.append(item)

    js_array_match = re.search(r'### Array Methods\s*\n\|\s*Method\s*\|\s*Description\s*\|\s*Example\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if js_array_match:
        table_content = js_array_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'js',
                    'cat': 'Array Methods',
                    'shortcut': parts[0],
                    'desc': parts[1],
                    'example': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                js_data.append(item)

    js_string_match = re.search(r'### String Methods\s*\n\|\s*Method\s*\|\s*Description\s*\|\s*Example\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if js_string_match:
        table_content = js_string_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'js',
                    'cat': 'String Methods',
                    'shortcut': parts[0],
                    'desc': parts[1],
                    'example': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                js_data.append(item)

    js_dom_match = re.search(r'### DOM Manipulation\s*\n\|\s*Method\s*\|\s*Description\s*\|\s*Example\s*\|\n\|---+\|---+\|---+\|\n((?:\|.*\|.*\|.*\|\n)+)', content)
    if js_dom_match:
        table_content = js_dom_match.group(1)
        for line in table_content.strip().split('\n'):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) == 3:
                item = {
                    'lang': 'js',
                    'cat': 'DOM Manipulation',
                    'shortcut': parts[0],
                    'desc': parts[1],
                    'example': parts[2]
                }
                item["whatItDoes"] = generate_what_it_does(item)
                item["syntax"] = generate_syntax(item)
                item["useCase"] = generate_use_case(item)
                js_data.append(item)

    return html_data, css_data, js_data


if __name__ == '__main__':
    data_js_path = '/home/ubuntu/sheet_repo/data.js'
    readme_md_path = '/home/ubuntu/sheet_repo/README.md'

    shortcuts_from_js = parse_data_js(data_js_path)
    html_from_md, css_from_md, js_from_md = parse_readme_md(readme_md_path)

    all_data = {}

    for item in shortcuts_from_js:
        key = (item['lang'], item['cat'], item['shortcut'])
        all_data[key] = item

    for item in html_from_md + css_from_md + js_from_md:
        key = (item['lang'], item['cat'], item['shortcut'])
        if key not in all_data:
            all_data[key] = item
        else:
            if not all_data[key].get('desc') and item.get('desc'):
                all_data[key]['desc'] = item['desc']
            if not all_data[key].get('example') and item.get('example'):
                all_data[key]['example'] = item['example']
            # Merge newly generated fields if they don't exist
            if not all_data[key].get('whatItDoes') and item.get('whatItDoes'):
                all_data[key]['whatItDoes'] = item['whatItDoes']
            if not all_data[key].get('syntax') and item.get('syntax'):
                all_data[key]['syntax'] = item['syntax']
            if not all_data[key].get('useCase') and item.get('useCase'):
                all_data[key]['useCase'] = item['useCase']

    final_data = sorted(list(all_data.values()), key=lambda x: (x['lang'], x['cat'], x['shortcut']))

    output_path = '/home/ubuntu/dev-docs/structured_content.json'
    with open(output_path, 'w') as f:
        json.dump(final_data, f, indent=2)

    print(f"Structured content saved to {output_path}")
