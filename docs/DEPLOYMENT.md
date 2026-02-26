# Deployment Guide

## Kde beží aplikácia

| Časť | Platforma | URL |
|------|-----------|-----|
| Frontend (React SPA) | **GitHub Pages** | https://pjetko-dotcom.github.io/matica-ro-c-k/ |
| Backend (REST API) | **Render.com** (free tier) | https://matica-rock-backend.onrender.com |

> **GitHub Pages** servuje statické súbory z `gh-pages` branche. **Render.com** spúšťa Node.js/Express server definovaný v `api-server/server.ts` podľa `render.yaml`.

---

## Štandardný workflow pre nasadenie zmien

**Po každých zmenách v kóde:**

```bash
# 1. Urob zmeny v App.tsx, components, styles, atď.
#    (skúsuj lokálne: npm run dev)

# 2. Commitni zmeny
git add .
git commit -m "feat: describe your change"

# 3. Build pre production
npm run build

# 4. Push na GitHub Pages
git push origin main
git subtree push --prefix dist origin gh-pages

# Hotovo! Aplikácia je dostupná na:
# https://pjetko-dotcom.github.io/matica-ro-c-k/
```

**Pozor:** Nikdy nemaž lokálne súbory pri switchovaní branches! Git to odíde samo.

---

## GitHub Pages (Frontend)

Aplikácia je nasadená na GitHub Pages na adrese: **https://pjetko-dotcom.github.io/matica-ro-c-k/**

### Ako funguje

1. **`main` branch** – obsahuje zdrojový kód (App.tsx, components, utils, atď.)
2. **`gh-pages` branch** – obsahuje iba skompilované súbory z `dist/` zložky

GitHub Pages automaticky servuje obsah z `gh-pages` vetvy.

### Vite konfigurácia pre GitHub Pages

V `vite.config.ts` je nastavená `base` cesta zodpovedajúca názvu repozitára:

```ts
base: '/matica-ro-c-k/',
```

Bez tohto nastavenia by CSS a JS súbory nenašli správne cesty po nasadení.

### Deploy process

#### 1. Lokálne zmeny

```bash
npm run dev  # Test na localhost:3000
```

#### 2. Build

```bash
npm run build
# Výstup: dist/ zložka s index.html a assets/
```

#### 3. Commitni zdrojový kód

```bash
git add .
git commit -m "feat: popis zmeny"
git push origin main
```

#### 4. Deploy na GitHub Pages

```bash
# Možnosť A: git subtree (odporúčané)
git subtree push --prefix dist origin gh-pages

# Možnosť B: manuálne (ak subtree nefunguje)
git checkout --orphan gh-pages
git rm -rf .
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force
Remove-Item "dist" -Recurse -Force
git add .
git commit -m "Deploy to GitHub Pages"
git push -f origin gh-pages
git checkout main
```

---

## Render.com (Backend)

Backend je definovaný cez `render.yaml` v koreni repozitára. Render.com ho číta automaticky pri pripojení repozitára.

### `render.yaml`

```yaml
services:
  - type: web
    name: matica-rock-backend
    runtime: node
    buildCommand: cd api-server && npm install
    startCommand: cd api-server && npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### Čo robí backend

- `buildCommand`: nainštaluje závislosti v `api-server/`
- `startCommand`: spustí Express server (`api-server/server.ts`)
- Server počúva na porte z `process.env.PORT` (Render.com ho nastavuje automaticky)
- Dáta ukladá na disk do `api-server/data/{code}.json`

### Upozornenie – cold start

Render.com free tier "zaspieva" (uspí server) po **15 minútach nečinnosti**. Pri prvom requeste po pauze môže byť oneskorenie **20–60 sekúnd**. Toto je normálne správanie free tieru.

---

## CI/CD (budúcnosť)

Možné nastaviť **GitHub Actions** pre automatický deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Troubleshooting

**Problém:** GitHub Pages ukazuje iba pozadie, žiadny obsah

**Riešenie:**
1. Skontroluj, či `gh-pages` branch má len `index.html` a `assets/` zložku
2. Refreshni cache: Ctrl+Shift+R
3. Čakaj 1–2 minúty na rebuild
4. Skontroluj v Chrome DevTools console

**Problém:** CSS/JS nenájdu cestu

**Riešenie:** Skontroluj `vite.config.ts` – `base: '/matica-ro-c-k/'` musí zodpovedať názvu repozitára

**Problém:** Cloud sync nefunguje / timeout

**Riešenie:** Backend je pravdepodobne zaspatý (cold start). Počkaj 30–60 sekúnd a skús znova.

---

## Verzie nasadenia

| Verzia | Dátum | Zmeny |
|--------|-------|-------|
| 1.0.0 | 10.2.2026 | Initial GitHub Pages deployment |
| 1.1.0 | 26.2.2026 | Aktualizácia dokumentácie, pridanie Render.com sekcie |
