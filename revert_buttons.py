import os
import re

def revert_buttons_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<LiquidButton' not in content:
        return
    
    # Remove import
    content = re.sub(r"import\s*\{\s*LiquidButton\s*\}\s*from\s*['\"].*liquid-glass-button['\"];?\n?", "", content)
    
    # Replace <LiquidButton with <button
    content = content.replace('<LiquidButton', '<button')
    content = content.replace('</LiquidButton>', '</button>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    src_dir = 'c:/Users/hardi/OneDrive/Documents/hackronyx/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') and 'liquid-glass-button' not in file:
                filepath = os.path.join(root, file).replace('\\', '/')
                revert_buttons_in_file(filepath)

if __name__ == '__main__':
    main()
