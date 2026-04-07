import os
import re

def update_html(file_path, depth):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
    
    # Check if already updated to avoid duplication
    if "base.css" in content and "compliance.css" in content:
        return
    
    prefix = '../' * depth
    
    # 1. Add Preconnects
    preconnects = """  <!-- Preconnect to external domains -->
  <link rel='preconnect' href='https://www.googletagmanager.com' />
  <link rel='preconnect' href='https://www.google-analytics.com' />\n"""
    
    if "googletagmanager.com" not in content:
        # Insert after the first </script> tag
        content = re.sub(r'</script>', '</script>\n' + preconnects.strip(), content, count=1)

    # 2. Add Logo Dimensions
    # Replace the existing brand-logo img tag with one that has dimensions
    content = re.sub(r'<img class=[\'"]brand-logo[\'"] src=[\'"].*?logo\.svg[\'"] alt=[\'"]Custo de Carro[\'"] />', 
                     f'<img class="brand-logo" src="{prefix}assets/logo.svg" alt="Custo de Carro" width="250" height="58" />', 
                     content)

    # 3. Parallel CSS loading
    css_block = f"""  <!-- Parallel CSS loading -->
  <link rel='preload' href='{prefix}css/base.css' as='style' />
  <link rel='stylesheet' href='{prefix}css/base.css' />
  <link rel='stylesheet' href='{prefix}css/compliance.css' />
  <link rel='stylesheet' href='{prefix}css/theme.css' />"""
    
    # Replace theme.css link with the new block
    content = re.sub(r'<link rel=[\'"]stylesheet[\'"] href=[\'"].*?theme\.css[\'"] />', css_block.strip(), content)
    
    # 4. Remove any existing preloads for theme.css (to avoid duplication/waste)
    content = re.sub(r'<link rel=[\'"]preload[\'"] href=[\'"].*?theme\.css[\'"] as=[\'"]style[\'"] />\n?', '', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {file_path}")

base_dir = r"C:\xampp\htdocs\microsites\sites\custodecarro.com"

# Root HTML files
for f in ['sobre.html', 'contato.html', 'politica-de-privacidade.html', 'obrigado-contato.html']:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        update_html(path, 0)

# Folder HTML files
for folder in ['artigos', 'calculadoras']:
    dir_path = os.path.join(base_dir, folder)
    if not os.path.exists(dir_path): continue
    for f in os.listdir(dir_path):
        if f.endswith('.html') and f != 'index.html':
            update_html(os.path.join(dir_path, f), 1)
