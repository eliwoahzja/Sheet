import re

file_path = "README.md"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Rocket Emoji image
content = re.sub(r'<img src="https://raw\.githubusercontent\.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel[^"]+" width="40" />',
                 '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="40" align="absmiddle" />', content)

# Replace 💡
content = content.replace("💡 ", '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" width="22" align="absmiddle" /> ')

# Replace Open Book
content = re.sub(r'<img src="https://raw\.githubusercontent\.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book\.png" width="35" />',
                 '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/markdown/markdown-original.svg" width="35" align="absmiddle" />', content)

# Replace 🚀
content = content.replace("🚀 ", '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg" width="22" align="absmiddle" /> ')

# Replace 🎓
content = content.replace("🎓 ", '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" width="22" align="absmiddle" /> ')

# Replace Wrench
content = re.sub(r'<img src="https://raw\.githubusercontent\.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wrench\.png" width="35" />',
                 '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" width="40" align="absmiddle" />', content)

# Replace Books
content = re.sub(r'<img src="https://raw\.githubusercontent\.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books\.png" width="35" />',
                 '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="35" align="absmiddle" />', content)

# Replace 🤝
content = content.replace("🤝 ", '<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="35" align="absmiddle" /> ')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Icons replaced successfully.")
