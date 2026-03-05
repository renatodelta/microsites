# Quickstart

## 1) Entrar no projeto

```powershell
cd c:\xampp\htdocs\microsites
```

## 2) Criar novo microsite

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-site.ps1 -SiteSlug "meudominio.com" -BrandName "Minha Marca" -PrimaryColor "#0ea5e9" -SecondaryColor "#22c55e" -Description "Calculadoras e artigos da marca"
```

## 3) Versionar

```powershell
git add .
git commit -m "estrutura inicial de microsites"
```

## 4) Publicação

- Publique cada pasta em `sites/<dominio>` no destino correspondente do domínio.
- Exemplo: `sites/calculadoradeenergia.com` no host do `calculadoradeenergia.com`.
