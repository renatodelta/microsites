
$folderPath = "c:\xampp\htdocs\microsites\sites\custodecarro.com\artigos"
$files = Get-ChildItem -Path $folderPath -Filter "*.html" -Recurse

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
    "Ã " = "à"
    "Ã€" = "À"
    "Ã·" = "÷"
    "Ã—" = "×"
    "Â©" = "©"
    "Ã‰" = "É"
    "Ã–" = "Ö"
    "Ãœ" = "Ü"
    "Ã¢" = "â"
    "ÃŽ" = "Î"
    "Ãƒ" = "Ã"
    "Ãµ" = "õ"
    "Â"  = "" # Often a residual BOM or spacer
    "â€”" = "—"
    "â€“" = "–"
    "â€œ" = "“"
    "â€" = "”"
    "Ã " = "à "
    "ðŸ‘‰" = "👉"
    "Ã…" = "… "
}

foreach ($file in $files) {
    Write-Host "Repairing file: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw -Encoding utf8
    
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    
    # Final surgical cleanups for common words
    $content = $content -replace "VocÃª", "Você"
    $content = $content -replace "vocÃª", "você"
    $content = $content -replace "combustÃ­vel", "combustível"
    $content = $content -replace "mÃªs", "mês"
    $content = $content -replace "mÃ©dio", "médio"
    $content = $content -replace "automÃ³vel", "automóvel"
    $content = $content -replace "veÃ­culo", "veículo"
    $content = $content -replace "PolÃ­tica", "Política"
    $content = $content -replace "Privacidade", "Privacidade"
    $content = $content -replace "Â©", "©"
    
    # Re-save as UTF-8 without BOM if possible (Set-Content uses BOM usually, but browser handles it)
    $content | Set-Content $file.FullName -NoNewline -Encoding utf8
}

Write-Host "Accentuation repair complete for all articles."
