with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Problem 1: Remove duplicate SW registration script (lines 1210-1220 area)
# The duplicate section starts with "<!-- PWA Service Worker Registration -->"
marker1 = "<!-- PWA Service Worker Registration -->"
marker1_idx = content.find(marker1)

if marker1_idx != -1:
    after_marker = content[marker1_idx:]
    close_idx = after_marker.find("</script>")
    if close_idx != -1:
        duplicate_section = after_marker[:close_idx + len("</script>")]
        content = content.replace(duplicate_section, "")
        print("Removed duplicate SW registration script")

# Problem 2: Remove broken content after </body>
body_idx = content.rfind("</body>")
if body_idx != -1:
    content = content[:body_idx] + "</body>"
    print("Removed content after </body>")

# Write the fixed content
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Index.html fixed successfully")