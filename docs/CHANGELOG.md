# Changelog

Všetky významné zmeny v tomto projekte sú dokumentované v tomto súbore.

## [1.0.0] - 2026-04-22

### Added
- 🎉 **Prvá stabilná verzia 1.0.0**
  - Aplikácia je teraz považovaná za stabilnú a pripravenú na produkčné použitie
  - Aktualizácia všetkých závislostí na najnovšie verzie
  - Optimalizácia výkonu a stability

### Changed
- 📦 Aktualizácia verzie v package.json z 0.0.0 na 1.0.0
- 🎨 Aktualizácia **Font Awesome** na verziu 7.2.0 (oprava v changelogu)

---

## [2.2.0] - 2026-04-22

### Changed
- 🎨 Aktualizácia **Font Awesome** z verzie 6.4.0 na **7.2.0**
  - Najnovšia stabilná verzia s vylepšeniami výkonu a novými ikonami
  - Aktualizovaný CDN link na oficiálny Font Awesome CDN v index.html

---

## [2.1.0] - 2026-02-27

### Added
- 🗜️ Manuálny collapse headera – tlačidlo ^ v pravom rohu hlavičky
  - Po kliknutí skryje sync panel, legendu kategórií a prepínač Matica/Práve prebieha
  - Stav sa pamätá v localStorage (pretrváva medzi načítaniami stránky)
  - Plynulá CSS animácia (max-height transition 300ms)
  - V live režime zostane viditeľný čas aj po collapse
  - Riešenie pre mobile landscape, kde header zaberá väčšinu výšky displeja

### Changed
- Ikona a-chevron-up sa otočí o 180° keď je header collapsed (vizuálna spätná väzba)

---

## [2.0.0] - 2026-02-26

### Changed
- 🚀 Migrácia hostingu z **GitHub Pages + render.com** na **WebSupport.sk** shared hosting
- 🔗 Nová URL aplikácie: https://fourseasons.sk/matica-ro(c)k/
- 🔄 SYNC_API_BASE zmenený na https://fourseasons.sk/matica-ro(c)k/api/sync.php?code=
- ⚙️ ite.config.ts – ase zmenený z /matica-ro-c-k/ na /matica-ro(c)k/

### Added
- 🐘 public/api/sync.php – PHP backend náhrada za Express/Node.js server na render.com
  - Ukladanie harmonogramov ako pi/data/{kod}.json súbory na serveri
  - Podpora GET (načítanie) a POST (zápis) s CORS hlavičkami
  - Validácia a sanitizácia kódu matice
  - Zamknutý zápis súborov (LOCK_EX) pre bezpečnosť
- 📄 public/.htaccess – Apache konfigurácia pre WebSupport
  - React SPA routing (všetky cesty → index.html)
  - GZIP kompresia pre JS/CSS/JSON
  - Cache hlavičky (1 rok pre assets s hashom, no-cache pre index.html)
  - Bezpečnostné hlavičky (X-Content-Type-Options, X-Frame-Options)
  - Options -Indexes – zakáže výpis priečinkov

### Removed
- ❌ Závislosť na **render.com** backend (cold start problém odstránený)
- ❌ ender.yaml (už nie je potrebný)

### Technical
- Deploy workflow zmenený: 
pm run build → FTP upload dist/ na WebSupport
- PHP súbory v public/ sa automaticky skopírujú do dist/ pri Vite builde

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
- 💾 LocalStorage persistence (key: scout_timetable_nature_v8)
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
- Default branch: main
- GitHub Pages source: gh-pages branch

---

## Formát

Zmeny sú zoskupené do sekcií:
- **Added** - Nové funkcie
- **Changed** - Zmeny v existujúcej funkcionalite
- **Fixed** - Opravené bugs
- **Removed** - Odstránené funkcie
- **Deprecated** - Funkcie budú čoskoro odstránené
