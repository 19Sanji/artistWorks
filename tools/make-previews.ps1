# Готовит картинки для сайта. Исходники не изменяются и на сайт не попадают.
#   assets/thumbs/<slug>/<name>.jpg  — превью для сетки (ширина до 900 px)
#   assets/full/<slug>/<name>.jpg    — для лайтбокса (длинная сторона до 2400 px)
# Имена файлов приводятся к латинице, чтобы пути не ломались на хостинге.
# В конце выводит строки для списка CATEGORIES в index.html.
# Запуск из корня проекта:  pwsh tools/make-previews.ps1

Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$folders = [ordered]@{
  'Фон'                 = 'backgrounds'
  'персы'               = 'characters'
  'концепт'             = 'concept'
  'Книга'               = 'book'
  'Дополнительно'       = 'extra'
  'Дополнительно\Заказ' = 'extra'   # объединены в одну категорию «Личные заказы»
}

# Работы, убранные с сайта
$skip = @(
  '324136b6-2101-4d74-8050-10b9ef888330.png'
  '47c7ed88-591d-4685-a1cb-c841ca718d3b.jpeg'
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 86L

$translit = @{
  'а'='a';'б'='b';'в'='v';'г'='g';'д'='d';'е'='e';'ё'='e';'ж'='zh';'з'='z';'и'='i';'й'='y';'к'='k';'л'='l';'м'='m'
  'н'='n';'о'='o';'п'='p';'р'='r';'с'='s';'т'='t';'у'='u';'ф'='f';'х'='h';'ц'='ts';'ч'='ch';'ш'='sh';'щ'='sch'
  'ъ'='';'ы'='y';'ь'='';'э'='e';'ю'='yu';'я'='ya'
}
function Get-SafeName([string]$name) {
  $out = foreach ($ch in $name.ToLower().ToCharArray()) { $c = [string]$ch; if ($translit.ContainsKey($c)) { $translit[$c] } else { $c } }
  (-join $out) -replace '[^a-z0-9_-]+', '-'
}

function Save-Resized($img, [int]$w, [int]$h, $path) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::White)   # на случай прозрачности в PNG
  $g.DrawImage($img, 0, 0, $w, $h)
  New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
  $bmp.Save($path, $codec, $params)
  $g.Dispose(); $bmp.Dispose()
}

$lines = [ordered]@{}
foreach ($dir in $folders.Keys) {
  $slug = $folders[$dir]
  if (-not $lines.Contains($slug)) { $lines[$slug] = @() }
  foreach ($f in Get-ChildItem -LiteralPath $dir -File | Sort-Object Name) {
    if ($skip -contains $f.Name) { continue }
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    # EXIF-ориентация (фото с телефона)
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip('Rotate180FlipNone') }
        6 { $img.RotateFlip('Rotate90FlipNone') }
        8 { $img.RotateFlip('Rotate270FlipNone') }
      }
    }
    $W = $img.Width; $H = $img.Height
    $name = Get-SafeName ([IO.Path]::GetFileNameWithoutExtension($f.Name))

    $tw = [Math]::Min(900, $W); $th = [int][Math]::Round($H * $tw / $W)
    Save-Resized $img $tw $th "assets/thumbs/$slug/$name.jpg"

    $k = [Math]::Min([double]1, 2400.0 / [Math]::Max($W, $H))
    Save-Resized $img ([int]($W * $k)) ([int]($H * $k)) "assets/full/$slug/$name.jpg"

    $img.Dispose()
    $lines[$slug] += "      ['$name', $tw, $th],"
    Write-Host "$dir/$($f.Name) -> $slug/$name.jpg"
  }
}

Write-Host "`nСтроки для CATEGORIES в index.html (порядок задаётся вручную):"
foreach ($slug in $lines.Keys) { Write-Host "--- $slug"; $lines[$slug] | ForEach-Object { Write-Host $_ } }
