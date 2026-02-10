# Deployment Guide

## GitHub Pages Deployment

Aplikácia je nasadená na GitHub Pages na adrese: **https://pjetko-dotcom.github.io/matica-ro-c-k/**

### Ako funguje

1. **main** branch - obsahuje source code (App.tsx, components, utils, atď.)
2. **gh-pages** branch - obsahuje iba skompilovane súbory z `dist/` zložky

GitHub Pages automaticky servuje obsah z `gh-pages` vetvi.

### Deploy Process

#### 1. Lokálne zmeny

```bash
# Sprav zmeny v App.tsx, components, atď.
npm run dev  # Test na localhost:3000
```

#### 2. Build

```bash
# Skompiluj aplikáciu
npm run build

# Výstup: dist/ zložka s index.html a assets/
```

#### 3. Git workflow

```bash
# Commitni zmeny v main
git add .
git commit -m "Feature: Add something cool"
git push origin main
```

#### 4. Deploy na GitHub Pages

```bash
# Prejdi na main
git checkout main

# Vytvor orphan gh-pages vetev (alebo aktualizuj existujúcu)
git checkout --orphan gh-pages

# Vymaž všetko
git rm -rf .

# Kopíruj dist súbory
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force
Remove-Item "dist" -Recurse -Force

# Commitni
git add .
git commit -m "Deploy to GitHub Pages"

# Pushni s force
git push -f origin gh-pages

# Vráť sa na main
git checkout main
```

**Alebo jednoduchší spôsob:**

```bash
# Ak máš gh-pages vetev, len aktualizuj dist na nej:
git checkout gh-pages
git merge main --no-commit --no-ff
git rm -rf .
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force
git add .
git commit -m "Rebuild and deploy"
git push origin gh-pages
git checkout main
```

### CI/CD (budúcnosť)

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
          node-version: '18'
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Troubleshooting

**Problem:** GitHub Pages ukazuje iba pozadie, žiadny obsah

**Solution:**
1. Skontroluj, či `gh-pages` branch má len `index.html` a `assets/` zložku
2. Refreshni cache: Ctrl+Shift+R
3. Čakaj 1-2 minúty na rebuild
4. Skontroluj v Chrome DevTools console na chyby

**Problem:** CSS/JS nevie nájsť

**Solution:** 
- Skontroluj [vite.config.ts](../vite.config.ts) - `base: '/matica-ro-c-k/'` musí byť správny

### Tabuľka Verzií

| Verzia | Dátum | Zmeny |
|--------|-------|-------|
| 1.0.0 | 10.2.2026 | Initial GitHub Pages deployment |

