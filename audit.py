import re

with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()
with open('sw.js', 'r', encoding='utf-8') as f:
    sw = f.read()
with open('manifest.json', 'r', encoding='utf-8') as f:
    mf = f.read()
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

print('=== INDEX.HTML ===')
print('1. serviceWorker registration:', 'navigator.serviceWorker.register' in idx)
print('2. manifest link:', 'rel="manifest"' in idx)
print('3. beforeinstallprompt:', 'beforeinstallprompt' in idx)
print('4. .prompt() call:', '.prompt()' in idx)
print('5. btn-install-pwa exists:', 'btn-install-pwa' in idx)
print('6. btn-login-install-pwa exists:', 'btn-login-install-pwa' in idx)
declared = idx.count('const isStandalone')
print('7. isStandalone declared:', declared, 'times')
print('8. deferredPrompt:', 'deferredPrompt' in idx)

print('\n=== SW.JS ===')
print('9. ASSETS_TO_CACHE:', 'ASSETS_TO_CACHE' in sw)
print('10. icon-192 in SW:', 'icon-192.png' in sw)

print('\n=== MANIFEST.JSON ===')
print('10. scope:', 'scope' in mf)
print('12. icons:', 'icons' in mf)
icon_matches = re.findall(r'"src":\s*"([^"]+)"', mf)
print('13. icon src matches:', len(icon_matches))
for m in icon_matches:
    print('    -', m)

print('\n=== CSS BUTTON DISPLAY ===')
cssLines = css.split('\n')
for i, line in enumerate(cssLines, 1):
    if 'btn-install' in line.lower() or 'btn-login' in line.lower() or '.auth-modal' in line.lower() or 'display: none' in line.lower() or 'display: block' in line.lower():
        print(f'{i}: {line.strip()}')