import os
import re

def replace_buttons_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<button' not in content:
        return
    
    # Calculate depth
    src_idx = filepath.find('/src/')
    if src_idx == -1:
        return
    
    rel_path = filepath[src_idx + 5:] # 'pages/Dashboard.tsx'
    slashes = rel_path.count('/')
    
    if slashes == 0:
        import_path = './components/ui/liquid-glass-button'
    else:
        import_path = '../' * slashes + 'components/ui/liquid-glass-button'
    
    if 'liquid-glass-button' not in content and 'components/ui/liquid-glass-button' not in filepath and 'CookieConsent' not in filepath:
        imports = re.findall(r'^import .*;?$', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, f"{last_import}\nimport {{ LiquidButton }} from '{import_path}';")
        else:
            content = f"import {{ LiquidButton }} from '{import_path}';\n{content}"
            
    content = content.replace('<button', '<LiquidButton')
    content = content.replace('</button>', '</LiquidButton>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    src_dir = 'c:/Users/hardi/OneDrive/Documents/hackronyx/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') and 'liquid-glass-button' not in file and file != 'CookieConsent.tsx':
                filepath = os.path.join(root, file).replace('\\', '/')
                replace_buttons_in_file(filepath)

if __name__ == '__main__':
    main()
