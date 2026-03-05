param(
  [Parameter(Mandatory = $true)]
  [string]$SiteSlug,

  [Parameter(Mandatory = $true)]
  [string]$BrandName,

  [Parameter(Mandatory = $false)]
  [string]$PrimaryColor = "#0ea5e9",

  [Parameter(Mandatory = $false)]
  [string]$SecondaryColor = "#22c55e",

  [Parameter(Mandatory = $false)]
  [string]$Description = "Calculadoras e artigos do site"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$siteRoot = Join-Path $root "sites\$SiteSlug"

if (Test-Path $siteRoot) {
  throw "O site '$SiteSlug' já existe em $siteRoot"
}

$dirs = @(
  "$siteRoot\artigos",
  "$siteRoot\calculadoras",
  "$siteRoot\config",
  "$siteRoot\css",
  "$siteRoot\js"
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$theme = @"
@import url('../../../shared/css/base.css');
@import url('../../../shared/css/compliance.css');

:root {
  --primary: $PrimaryColor;
  --secondary: $SecondaryColor;
}
"@
Set-Content -Path "$siteRoot\css\theme.css" -Value $theme -Encoding UTF8

$complianceTemplatePath = Join-Path $root "shared\templates\compliance.js"
if (Test-Path $complianceTemplatePath) {
  Copy-Item -Path $complianceTemplatePath -Destination "$siteRoot\js\compliance.js" -Force
}

$calcJs = @"
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const valor1 = Number(document.getElementById('valor1').value || 0);
    const valor2 = Number(document.getElementById('valor2').value || 0);
    const resultado = valor1 + valor2;

    document.getElementById('resultado').textContent =
      'Resultado: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado);
  });
});
"@
Set-Content -Path "$siteRoot\js\calculadora.js" -Value $calcJs -Encoding UTF8

$index = @"
<!doctype html>
<html lang='pt-BR'>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>$BrandName</title>
  <meta name='description' content='$Description' />
  <meta name='adsense-client' content='ca-pub-0000000000000000' />
  <link rel='stylesheet' href='./css/theme.css' />
  <script defer src='./js/compliance.js'></script>
</head>
<body>
  <header>
    <div class='container topbar'>
      <a class='brand' href='./index.html'>$BrandName</a>
      <nav>
        <a href='./calculadoras/index.html'>Calculadoras</a>
        <a href='./artigos/index.html'>Artigos</a>
      </nav>
    </div>
  </header>

  <main class='container hero'>
    <h1>$BrandName</h1>
    <p>$Description</p>
    <div class='grid'>
      <a class='card' href='./calculadoras/simulador-principal.html'>
        <h3>Simulador Principal</h3>
        <p>Primeira calculadora do site.</p>
      </a>
      <a class='card' href='./artigos/guia-basico.html'>
        <h3>Guia Básico</h3>
        <p>Primeiro artigo otimizado para SEO.</p>
      </a>
    </div>
  </main>
</body>
</html>
"@
Set-Content -Path "$siteRoot\index.html" -Value $index -Encoding UTF8

$calcIndex = @"
<!doctype html>
<html lang='pt-BR'>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Calculadoras - $BrandName</title>
  <meta name='adsense-client' content='ca-pub-0000000000000000' />
  <link rel='stylesheet' href='../css/theme.css' />
  <script defer src='../js/compliance.js'></script>
</head>
<body>
  <main class='container hero'>
    <h1>Calculadoras</h1>
    <div class='grid'>
      <a class='card' href='./simulador-principal.html'>
        <h3>Simulador Principal</h3>
        <p>Ajuste a fórmula conforme o nicho.</p>
      </a>
    </div>
  </main>
</body>
</html>
"@
Set-Content -Path "$siteRoot\calculadoras\index.html" -Value $calcIndex -Encoding UTF8

$calcPage = @"
<!doctype html>
<html lang='pt-BR'>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Simulador Principal - $BrandName</title>
  <meta name='adsense-client' content='ca-pub-0000000000000000' />
  <link rel='stylesheet' href='../css/theme.css' />
  <script defer src='../js/compliance.js'></script>
  <script defer src='../js/calculadora.js'></script>
</head>
<body>
  <main class='container hero'>
    <h1>Simulador Principal</h1>
    <section class='card'>
      <div class='field'>
        <label for='valor1'>Valor 1</label>
        <input id='valor1' type='number' step='0.01' min='0' />
      </div>
      <div class='field'>
        <label for='valor2'>Valor 2</label>
        <input id='valor2' type='number' step='0.01' min='0' />
      </div>
      <button class='btn' id='calcularBtn'>Calcular</button>
      <p class='result' id='resultado'></p>
    </section>
  </main>
</body>
</html>
"@
Set-Content -Path "$siteRoot\calculadoras\simulador-principal.html" -Value $calcPage -Encoding UTF8

$articleIndex = @"
<!doctype html>
<html lang='pt-BR'>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Artigos - $BrandName</title>
  <meta name='description' content='Artigos do $BrandName com foco em educação e decisões práticas.' />
  <meta name='robots' content='index, follow, max-image-preview:large' />
  <link rel='canonical' href='https://$SiteSlug/artigos/index.html' />
  <meta property='og:locale' content='pt_BR' />
  <meta property='og:type' content='website' />
  <meta property='og:site_name' content='$BrandName' />
  <meta property='og:title' content='Artigos - $BrandName' />
  <meta property='og:description' content='Artigos do $BrandName com foco em educação e decisões práticas.' />
  <meta property='og:url' content='https://$SiteSlug/artigos/index.html' />
  <meta name='twitter:card' content='summary_large_image' />
  <meta name='twitter:title' content='Artigos - $BrandName' />
  <meta name='twitter:description' content='Artigos do $BrandName com foco em educação e decisões práticas.' />
  <meta name='adsense-client' content='ca-pub-0000000000000000' />
  <link rel='stylesheet' href='../css/theme.css' />
  <script defer src='../js/compliance.js'></script>
</head>
<body>
  <main class='container hero'>
    <h1>Artigos</h1>
    <div class='grid'>
      <a class='card' href='./guia-basico.html'>
        <h3>Guia Básico</h3>
        <p>Artigo inicial.</p>
      </a>
    </div>
  </main>
</body>
</html>
"@
Set-Content -Path "$siteRoot\artigos\index.html" -Value $articleIndex -Encoding UTF8

$article = @"
<!doctype html>
<html lang='pt-BR'>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Guia Básico - $BrandName</title>
  <meta name='description' content='Guia básico do $BrandName com orientações práticas.' />
  <meta name='robots' content='index, follow, max-image-preview:large' />
  <link rel='canonical' href='https://$SiteSlug/artigos/guia-basico.html' />
  <meta property='og:locale' content='pt_BR' />
  <meta property='og:type' content='article' />
  <meta property='og:site_name' content='$BrandName' />
  <meta property='og:title' content='Guia Básico - $BrandName' />
  <meta property='og:description' content='Guia básico do $BrandName com orientações práticas.' />
  <meta property='og:url' content='https://$SiteSlug/artigos/guia-basico.html' />
  <meta name='twitter:card' content='summary_large_image' />
  <meta name='twitter:title' content='Guia Básico - $BrandName' />
  <meta name='twitter:description' content='Guia básico do $BrandName com orientações práticas.' />
  <meta name='adsense-client' content='ca-pub-0000000000000000' />

  <script type='application/ld+json'>
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Guia Básico - $BrandName",
      "description": "Guia básico do $BrandName com orientações práticas.",
      "inLanguage": "pt-BR",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://$SiteSlug/artigos/guia-basico.html"
      },
      "author": {
        "@type": "Organization",
        "name": "$BrandName"
      },
      "publisher": {
        "@type": "Organization",
        "name": "$BrandName"
      },
      "datePublished": "2026-03-03",
      "dateModified": "2026-03-03"
    }
  </script>
  <link rel='stylesheet' href='../css/theme.css' />
  <script defer src='../js/compliance.js'></script>
</head>
<body>
  <main class='container hero'>
    <article class='card'>
      <h1>Guia Básico</h1>
      <p>Modelo inicial para artigos do site.</p>

      <script type='application/json' class='seo-backend'>
        {
          "palavraChaveFoco": "palavra-chave foco",
          "tituloSEO": "Título SEO com até 60 caracteres",
          "metaDescription": "Meta description entre 140 e 155 caracteres com benefício claro e palavra-chave principal.",
          "slugSugerido": "slug-seo-sugerido",
          "variacoesSemanticas": [
            "variação semântica 1",
            "variação semântica 2",
            "variação semântica 3"
          ]
        }
      </script>
    </article>
  </main>
</body>
</html>
"@
Set-Content -Path "$siteRoot\artigos\guia-basico.html" -Value $article -Encoding UTF8

$robots = @"
User-agent: *
Allow: /
Sitemap: https://$SiteSlug/sitemap.xml
"@
Set-Content -Path "$siteRoot\robots.txt" -Value $robots -Encoding UTF8

$sitemap = @"
<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
  <url><loc>https://$SiteSlug/</loc></url>
  <url><loc>https://$SiteSlug/calculadoras/index.html</loc></url>
  <url><loc>https://$SiteSlug/artigos/index.html</loc></url>
</urlset>
"@
Set-Content -Path "$siteRoot\sitemap.xml" -Value $sitemap -Encoding UTF8

$config = @"
{
  "siteSlug": "$SiteSlug",
  "brandName": "$BrandName",
  "palette": {
    "primary": "$PrimaryColor",
    "secondary": "$SecondaryColor"
  },
  "description": "$Description"
}
"@
Set-Content -Path "$siteRoot\config\site.json" -Value $config -Encoding UTF8

Write-Host "Site criado com sucesso em: $siteRoot" -ForegroundColor Green
