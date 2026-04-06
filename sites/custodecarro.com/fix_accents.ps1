
$filePath = "c:\xampp\htdocs\microsites\sites\custodecarro.com\artigos\quanto-gasto-de-gasolina-por-mes.html"
$content = Get-Content $filePath -Raw -Encoding utf8

$replacements = @{
    "Ãª" = "ê"
    "Ã´" = "ô"
    "Ã§" = "ç"
    "Ã£" = "ã"
    "Ã©" = "é"
    "Ã¡" = "á"
    "Ã­" = "í"
    "Ãº" = "ú"
    "Ã³" = "ó"
    "Ã"  = "à" # fallback for lone Ã
    "Ã·" = "÷"
    "Ã—" = "×"
    "Ãº" = "ú"
    "Ã¹" = "ù"
    "Ã¬" = "ì"
    "Ã²" = "ò"
    "Ã " = "à "
    "Â©" = "©"
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Final specific cleanups for "vocÃª" "direÃ§Ã£o" etc if any residuals remain
$content = $content -replace "vocÃª", "você"
$content = $content -replace "VocÃª", "Você"
$content = $content -replace "Ã©", "é"
$content = $content -replace "Ã¡", "á"
$content = $content -replace "Ã³", "ó"
$content = $content -replace "Ã­", "í"
$content = $content -replace "Ãº", "ú"
$content = $content -replace "Ã§", "ç"
$content = $content -replace "Ã£", "ã"
$content = $content -replace "â\?\?", "—"

$content | Set-Content $filePath -NoNewline -Encoding utf8
