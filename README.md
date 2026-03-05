# Hub de Microsites de Calculadoras

Este repositório concentra múltiplos microsites com o mesmo padrão de layout, SEO e estrutura, mudando apenas:

- Paleta de cores
- Nome/marca
- Conteúdo de artigos
- Conteúdo e regras das calculadoras

## Estrutura

- `shared/`: base comum (CSS, JS, templates)
- `sites/`: cada microsite em uma pasta própria
- `scripts/new-site.ps1`: gerador de novo microsite

## Sites criados

- `sites/calculadoradeenergia.com`
- `sites/custodecarro.com`
- `sites/simuladorcontadeluz.com`

## Como criar um novo site

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-site.ps1 -SiteSlug "novosite.com" -BrandName "Novo Site" -PrimaryColor "#0ea5e9" -SecondaryColor "#22c55e"
```

## Deploy

Cada pasta em `sites/<dominio>` pode ser publicada de forma independente (Apache/Nginx/Cloudflare Pages/Netlify/Vercel).
