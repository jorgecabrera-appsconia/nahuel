import re

with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()
with open('sw.js', 'r', encoding='utf-8') as f:
    sw = f.read()
with open('manifest.json', 'r', encoding='utf-8') as f:
    mf = f.read()

print('=== index.html ===')
print('serviceWorker register:', 'navigator.serviceWorker.register' in idx)
print('manifest link:', 'rel="manifest"' in idx)
print('beforeinstallprompt:', 'beforeinstallprompt' in idx)
print('.prompt() :', '.prompt()' in idx)

print('\n=== sw.js ===')
print('ASSETS_TO_CACHE:', 'ASSETS_TO_CACHE' in sw)
print('icon-192 in sw:', 'icon-192.png' in sw)

print('\n=== manifest.json ===')
print('scope:', 'scope' in mf)
print('icons:', 'icons' in mf)
icon_matches = re.findall(r'"src":\s*"([^"]+)"', mf)
print('icon src matches:', len(icon_matches))
for m in icon_matches:
    print(' -', m)