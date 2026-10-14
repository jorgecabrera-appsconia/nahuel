with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

marker = "<!-- Lógica del botón de instalación en login -->"
marker_idx = content.find(marker)

if marker_idx != -1:
    after_marker = content[marker_idx:]
    close_idx = after_marker.find("</script>")
    if close_idx != -1:
        login_script = after_marker[:close_idx + len("</script>")]
        
        if "const isStandalone" in login_script:
            fixed_login_script = login_script.replace(
                "const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;",
                "// Usa la variable isStandalone del script principal PWA"
            )
            
            import re
            fixed_login_script = re.sub(r'^\s*$\n', '\n', fixed_login_script)
            
            new_content = content.replace(login_script, fixed_login_script)
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Fixed - removed duplicate isStandalone from login script")
        else:
            print("The login script doesn't have the duplicate declaration")
    else:
        print("Could not find closing </script> after marker")
else:
    print("Marker not found")