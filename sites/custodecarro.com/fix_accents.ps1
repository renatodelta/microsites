$files = Get-ChildItem -Path . -Include *.html,*.xml,*.txt -Recurse

$replacements = @{
    "Ã¡" = "á"
    "Ã " = "à"
    "Ã¢" = "â"
    "Ã£" = "ã"
    "Ã©" = "é"
    "Ã¨" = "è"
    "Ãª" = "ê"
    "Ã­" = "í"
    "Ã¬" = "ì"
    "Ã®" = "î"
    "Ã³" = "ó"
    "Ã²" = "ò"
    "Ã´" = "ô"
    "Ãµ" = "õ"
    "Ãº" = "ú"
    "Ã¹" = "ù"
    "Ã»" = "û"
    "Ã§" = "ç"
    "Ã" = "Á"
    "Ã€" = "À"
    "Ã‚" = "Â"
    "Ãƒ" = "Ã"
    "Ã‰" = "É"
    "Ãˆ" = "È"
    "ÃŠ" = "Ê"
    "Ã" = "Í"
    "ÃŒ" = "Ì"
    "ÃŽ" = "Î"
    "Ã“" = "Ó"
    "Ã’" = "Ò"
    "Ã”" = "Ô"
    "Ã•" = "Õ"
    "Ãš" = "Ú"
    "Ã™" = "Ù"
    "Ã›" = "Û"
    "Ã‡" = "Ç"
    "Â©" = "©"
    "Â°" = "°"
    "Âª" = "ª"
    "Âº" = "º"
    "PolÃ­tica" = "Política"
    "AnÃ¡lise" = "Análise"
    "manutenÃ§Ã£o" = "manutenção"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $changed = $false
    
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $replacements[$key])
            $changed = $true
        }
    }
    
    if ($changed) {
        # Using [System.IO.File]::WriteAllText to ensure no BOM if needed, 
        # but let's try UTF8 without BOM logic or just explicit UTF8
        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Fixed: $($file.FullName)"
    }
}
