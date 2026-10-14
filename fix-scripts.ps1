$file = "index.html"
$content = Get-Content -Path $file -Encoding UTF8

# Reemplazar el bloque antiguo por el nuevo
$oldBlock = @'
<!-- PWA Install Logic -->
<script>
    let deferredPrompt;
    const installContainer = document.getElementById('pwa-install-container');
    const installBtn = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installContainer) installContainer.style.display = 'block';
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('PWA installation accepted');
          }
          deferredPrompt = null;
          installContainer.style.display = 'none';
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      if (installContainer) installContainer.style.display = 'none';
      deferredPrompt = null;
      console.log('PWA installed successfully');
    });
  </script>
'@

$newBlock = @'
<!-- PWA Service Worker Registration -->
<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
          console.log('ServiceWorker registration successful with scope: ', reg.scope);
        }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  </script>

  <!-- PWA Install Logic -->
  <script>
    // Verificar si la app ya está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    
    // Ocultar botón de instalación si ya está en modo standalone
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) {
      installBtn.style.display = $isStandalone ? 'none' : 'inline-block';
    }
    
    let deferredPrompt;
    const installBtnEl = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      if ($isStandalone) return; // Ya instalada, no hacer nada
      e.preventDefault();
      deferredPrompt = e;
      if (installBtnEl) installBtnEl.style.display = 'inline-block';
    });

    if (installBtnEl) {
      installBtnEl.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('PWA installation accepted');
        }
        deferredPrompt = null;
        if (installBtnEl) installBtnEl.style.display = 'none';
      });
    }

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      console.log('PWA installed successfully');
      if (installBtnEl) installBtnEl.style.display = 'none';
    });
  </script>
'@

if ($content -match [Regex]::Escape($oldBlock)) {
    $content = $content -replace [Regex]::Escape($oldBlock), $newBlock
    $content | Set-Content -Path $file -Encoding UTF8
    Write-Host "Archivo index.html actualizado exitosamente"
} else {
    Write-Host "No se encontró el bloque antiguo para reemplazar"
}