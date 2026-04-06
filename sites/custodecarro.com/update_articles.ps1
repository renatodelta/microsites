
$sitemapPath = "c:\xampp\htdocs\microsites\sites\custodecarro.com\sitemap.xml"
$articlesDir = "c:\xampp\htdocs\microsites\sites\custodecarro.com\artigos"
$imagesDirRelative = "./img"

[xml]$sitemap = Get-Content $sitemapPath
$urls = $sitemap.urlset.url | Where-Object { $_.loc -like "*artigos/*" -and $_.loc -notlike "*index.html" }

foreach ($url in $urls) {
    $loc = $url.loc
    $lastmod = $url.lastmod
    $fileName = Split-Path $loc -Leaf
    $filePath = Join-Path $articlesDir $fileName

    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Format date from YYYY-MM-DD to DD/MM/YYYY
        $dateParts = $lastmod -split "-"
        $formattedDate = "$($dateParts[2])/$($dateParts[1])/$($dateParts[0])"
        
        # Check if already has meta
        if ($content -notlike "*article-meta*") {
            # Inject meta and a generic image if not present
            # We'll use "quanto-custa-manter-um-carro-no-brasil.png" as the default high-quality image
            $defaultImg = "./img/quanto-custa-manter-um-carro-no-brasil.png"
            
            # Find the end of <h1> tag
            if ($content -match "(<h1.*?>.*?</h1>)") {
                $h1Tag = $matches[1]
                $replacement = "$h1Tag`n      <div class=`"article-meta`">$formattedDate</div>`n      <img src=`"$defaultImg`" alt=`"Artigo - Custo de Carro`" class=`"article-hero-img`" />"
                $newContent = $content -replace [regex]::Escape($h1Tag), $replacement
                $newContent | Set-Content $filePath -NoNewline -Encoding utf8
                Write-Host "Updated $fileName with date $formattedDate"
            }
        } else {
            Write-Host "Skipping $fileName - already updated"
        }
    }
}
