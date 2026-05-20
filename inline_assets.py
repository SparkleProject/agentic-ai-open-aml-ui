import re
import os

DIST_DIR = 'dist'
INDEX_FILE = os.path.join(DIST_DIR, 'index.html')
OUT_DIR = '/Users/ericlin/.gemini/antigravity/brain/db02728a-e788-4cc3-b8c0-2e1e39df4d0d/browser'
OUT_FILE = os.path.join(OUT_DIR, 'kyc.html')

os.makedirs(OUT_DIR, exist_ok=True)

with open(INDEX_FILE, 'r') as f:
    html = f.read()

# Find JS
js_match = re.search(r'<script type="module" crossorigin src="/assets/(index-[^.]+\.js)"></script>', html)
if js_match:
    js_filename = js_match.group(1)
    with open(os.path.join(DIST_DIR, 'assets', js_filename), 'r') as f:
        js_content = f.read()
    
    # Replace <script> with inline <script>
    # Note: escape </script> inside JS if necessary, but generally Vite output is safe or we can just drop it in.
    js_content = js_content.replace('</script>', '<\\/script>')
    inline_js = f'<script type="module">\n{js_content}\n</script>'
    html = html.replace(js_match.group(0), inline_js)

# Find CSS
css_match = re.search(r'<link rel="stylesheet" crossorigin href="/assets/(index-[^.]+\.css)">', html)
if css_match:
    css_filename = css_match.group(1)
    with open(os.path.join(DIST_DIR, 'assets', css_filename), 'r') as f:
        css_content = f.read()
    
    inline_css = f'<style>\n{css_content}\n</style>'
    html = html.replace(css_match.group(0), inline_css)

with open(OUT_FILE, 'w') as f:
    f.write(html)

print(f"Successfully generated {OUT_FILE}")
