Add-Type -AssemblyName System.Drawing;
$src = [System.Drawing.Image]::FromFile("images/icon.png");

// Generar icon-512.png
$dst512 = New-Object System.Drawing.Bitmap 512, 512;
$gfx512 = [System.Drawing.Graphics]::FromImage($dst512);
$gfx512.CompositingQuality = [System.Drawing.CompositingQuality]::HighQuality;
$gfx512.SmoothingMode = [System.Drawing.SmoothingMode]::HighQuality;
$gfx512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
$gfx512.DrawImage($src, 0, 0, 512, 512);
$dst512.Save("images/icon-512.png");
$dst512.Dispose();
$gfx512.Dispose();

// Generar icon-192.png
$dst192 = New-Object System.Drawing.Bitmap 192, 192;
$gfx192 = [System.Drawing.Graphics]::FromImage($dst192);
$gfx192.CompositingQuality = [System.Drawing.CompositingQuality]::HighQuality;
$gfx192.SmoothingMode = [System.Drawing.SmoothingMode]::HighQuality;
$gfx192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
$gfx192.DrawImage($src, 0, 0, 192, 192);
$dst192.Save("images/icon-192.png");
$dst192.Dispose();
$gfx192.Dispose();

// Generar apple-touch-icon.png (180x180)
$dstApple = New-Object System.Drawing.Bitmap 180, 180;
$gfxApple = [System.Drawing.Graphics]::FromImage($dstApple);
$gfxApple.CompositingQuality = [System.Drawing.CompositingQuality]::HighQuality;
$gfxApple.SmoothingMode = [System.Drawing.SmoothingMode]::HighQuality;
$gfxApple.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
$gfxApple.DrawImage($src, 0, 0, 180, 180);
$dstApple.Save("images/apple-touch-icon.png");
$dstApple.Dispose();
$gfxApple.Dispose();

// Generar icon-maskable-512.png (512x512 con margen para máscara)
// Dibujar centrado dejando margen de 80px en cada lado
$dstMask = New-Object System.Drawing.Bitmap 512, 512;
$gfxMask = [System.Drawing.Graphics]::FromImage($dstMask);
$gfxMask.CompositingQuality = [System.Drawing.CompositingQuality]::HighQuality;
$gfxMask.SmoothingMode = [System.Drawing.SmoothingMode]::HighQuality;
$gfxMask.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
$gfxMask.Clear([System.Drawing.Color]::Transparent);
$gfxMask.DrawImage($src, 80, 80, 352, 352); # Área central de 352x352 dentro de 512x512
$dstMask.Save("images/icon-maskable-512.png");
$dstMask.Dispose();
$gfxMask.Dispose();

Write-Host "¡Todos los íconos generados exitosamente!";