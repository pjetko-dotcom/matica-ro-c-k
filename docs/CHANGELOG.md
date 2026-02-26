# Changelog

Všetky významné zmeny v tomto projekte sú dokumentované v tomto súbore.

## [2.0.0] - 2026-02-26

### Changed
- 🚀 Migrácia hostingu z **GitHub Pages + render.com** na **WebSupport.sk** shared hosting
- 🔗 Nová URL aplikácie: `https://fourseasons.sk/matica-ro(c)k/`
- 🔄 `SYNC_API_BASE` zmenený na `https://fourseasons.sk/matica-ro(c)k/api/sync.php?code=`
- ⚙️ `vite.config.ts` – `base` zmenený z `/matica-ro-c-k/` na `/matica-ro(c)k/`

### Added
- 🐘 `public/api/sync.php` – PHP backend náhrada za Express/Node.js server na render.com
  - Ukladanie harmonogramov ako `api/data/{kod}.json` súbory na serveri
  - Podpora GET (načítanie) a POST (zápis) s CORS hlavičkami
  - Validácia a sanitizácia kódu matice
  - Zamknutý zápis súborov (`LOCK_EX`) pre bezpečnosť
- 📄 `public/.htaccess` – Apache konfigurácia pre WebSupport
  - React SPA routing (všetky cesty → `index.html`)
  - GZIP kompresia pre JS/CSS/JSON
  - Cache hlavičky (1 rok pre assets s hashom, no-cache pre `index.html`)
  - Bezpečnostné hlavičky (`X-Content-Type-Options`, `X-Frame-Options`)
  - `Options -Indexes` – zakáže výpis priečinkov

### Removed
- ❌ Závislosť na **render.com** backend (cold start problém odstránený)
- ❌ `render.yaml` (už nie je potrebný)

### Technical
- Deploy workflow zmenený: `npm run build` → FTP upload `dist/` na WebSupport
- PHP súbory v `public/` sa automaticky skopírujú do `dist/` pri Vite builde

---

## [1.0.0] - 2026-02-10

### Added
- ✨ Initial GitHub Pages deployment
- 🪨 Rock/Stone emoji logo
- 🍃 Leaf SVG pattern background
- 🌙 Full Dark Mode support with toggle button
- 📱 Responsive design for desktop and tablet
- 🎨 Light forest green color scheme (#d9e8d6)
- 📊 Scout staff timetable planner with day/event management
- 💾 LocalStorage persistence (key: `scout_timetable_nature_v8`)
- 🔗 Cloud sync ready (KVDB endpoint configured)
- ⏱️ Time management utilities (add, edit, remove events)
- 🎭 Glass-morphism UI effects

### Fixed
- 🐛 Dark mode text contrast issues
- 🐛 Delete "Nový deň" functionality with localStorage force update
- 🐛 CSS text visibility in dark mode (#e0e8e0 for text)

### Changed
- 🔄 Background pattern from diamond/wavy lines to leaf SVG
- 🔄 Logo icon from mountain → cube → gem → **stone emoji**
- 🔄 Updated README with current project info

### Technical Stack
- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS (CDN)
- Font Awesome 6.4.0

### Deployment
- GitHub Pages: https://pjetko-dotcom.github.io/matica-ro-c-k/
- Repository: https://github.com/pjetko-dotcom/matica-ro-c-k
- Default branch: `main`
- GitHub Pages source: `gh-pages` branch

---

## Formát

Zmeny sú zoskupené do sekcií:
- **Added** - Nové funkcie
- **Changed** - Zmeny v existujúcej funkcionalite
- **Fixed** - Opravené bugs
- **Removed** - Odstránené funkcie
- **Deprecated** - Funckcie budú čoskoro odstránené

