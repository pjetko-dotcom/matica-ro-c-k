# Deployment Guide

## Kde beží aplikácia

| Časť | Platforma | URL |
|------|-----------|-----|
| Frontend (React SPA) | **WebSupport.sk** shared hosting | https://fourseasons.sk/matica-ro(c)k/ |
| Backend (Sync API) | **WebSupport.sk** – PHP na tom istom serveri | https://fourseasons.sk/matica-ro(c)k/api/sync.php |
| Dátové súbory | Na serveri v `api/data/{kod}.json` | – |

> Celá aplikácia beží na jednom mieste – žiadny separátny backend server. PHP skript `public/api/sync.php` sa postará o čítanie a zápis JSON súborov priamo na hostingu.

---

## Architektúra (po migrácii na WebSupport)

```
Prehliadač (React SPA)
    │
    ├─ GET/POST ──► fourseasons.sk/matica-ro(c)k/api/sync.php?code={kod}
    │                         │
    │                         ▼
    │               PHP číta/zapisuje súbor
    │               api/data/{kod}.json  na serveri
    │
    └─ Statické súbory (JS, CSS, HTML) – servíruje Apache
```

**Výhody oproti predchádzajúcemu riešeniu (render.com):**

| | render.com (staré) | WebSupport PHP (nové) |
|-|--------------------|----------------------|
| Cold start oneskorenie | 🔴 20–60 sekúnd | ✅ Žiadny |
| Platforma | Node.js / Express | PHP 8.x |
| Hosting front + back | ❌ Dve miesta | ✅ Jedno miesto |
| Deploy | git subtree + Render | FTP upload `dist/` |

---

## Štruktúra projektu po builde

```
dist/                        ← celý obsah tohto priečinka nahráš na server
├── index.html
├── .htaccess                ← Apache SPA routing (skopírovaný z public/)
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── api/
    └── sync.php             ← PHP backend (skopírovaný z public/api/)
        └── data/            ← priečinok sa vytvorí automaticky pri prvom uložení
            ├── ststevo2026.json
            └── letny-tabor.json
```

---

## Štandardný workflow pre nasadenie zmien

```bash
# 1. Urob zmeny v kóde (lokálne testovanie)
npm run dev

# 2. Build pre production
npm run build
# ► Výstup: dist/ zložka

# 3. Commitni zmeny v gite
git add .
git commit -m "feat: popis zmeny"
git push origin main

# 4. Upload dist/ na server cez FTP/SFTP
#    Cieľový priečinok: public_html/matica-ro(c)k/
#    (alebo podľa konfigurácie webhosting účtu)
```

---

## WebSupport.sk – FTP deployment

### Prvý deployment (nastavenie)

1. **Prihlás sa do WebSupport klientskeho centra** → Hosting → FTP účty
2. Pripoj sa FTP klientom (napr. FileZilla):
   - Host: `ftp.fourseasons.sk`
   - Meno/heslo: z klientskeho centra
3. Naviguj do `public_html/` (alebo koreňový priečinok domény)
4. **Vytvor priečinok** `matica-ro(c)k/`
5. **Nahraj celý obsah** `dist/` do tohto priečinka

```
public_html/
└── matica-ro(c)k/     ← tu nahráš obsah dist/
    ├── index.html
    ├── .htaccess
    ├── assets/
    └── api/
        └── sync.php
```

### Nasledujúce deploymenty (update)

```bash
npm run build
# Potom cez FileZilla: nahráš obsah dist/ (prepíšeš existujúce súbory)
# POZOR: neprepíšeš api/data/ – JSON súbory ostanú zachované
```

### Oprávnenia priečinkov

Ak PHP nemôže zapisovať do `api/data/`:

```bash
# Cez SSH (ak WebSupport dáva SSH prístup) alebo cez File Manager v klientskom centre:
chmod 755 public_html/matica-ro(c)k/api/data/
```

WebSupport štandardne povoluje zápis PHP skriptom do ich vlastného adresára – `api/data/` sa vytvorí automaticky pri prvom `POST` requeste.

---

## PHP Sync API (`public/api/sync.php`)

### Endpoint

```
GET  https://fourseasons.sk/matica-ro(c)k/api/sync.php?code={kod}
POST https://fourseasons.sk/matica-ro(c)k/api/sync.php?code={kod}
```

### Ukladanie

- Každý kód matice = jeden JSON súbor: `api/data/{kod}.json`
- Príklady: `ststevo2026.json`, `zimny-tabor.json`, `letny-tabor.json`
- Súbory ostávajú na serveri natrvalo (žiadna automatická expirácia)

### Bezpečnosť

- Kód sa sanitizuje: `preg_replace('/[^a-zA-Z0-9_-]/', '', $code)`
- Minimálna dĺžka kódu: 2 znaky
- Súbory sú uložené MIMO `public_html/` webroot alebo v priečinku bez directory listing (`Options -Indexes` v `.htaccess`)

---

## Vite konfigurácia

V `vite.config.ts` je nastavená `base` cesta zodpovedajúca umiestneniu na serveri:

```ts
base: '/matica-ro(c)k/',
```

Bez tohto nastavenia by JS a CSS súbory nenašli správne cesty.

---

## Troubleshooting

**Problém:** Stránka sa načíta, ale pri refreshi URL (napr. `/matica-ro(c)k/nejaka-cesta`) zobrazí 404

**Riešenie:** Skontroluj, či `.htaccess` je správne nahraný a `mod_rewrite` je povolený. WebSupport shared hosting má `mod_rewrite` zapnutý štandardne.

---

**Problém:** CSS a JS sa nenačítajú (404 na `/assets/...`)

**Riešenie:** Skontroluj `vite.config.ts` – `base: '/matica-ro(c)k/'` musí zodpovedať skutočnému priečinku na serveri.

---

**Problém:** Cloud sync (Uložiť / Načítať) vracia chybu

**Riešenie:**
1. Otvor `https://fourseasons.sk/matica-ro(c)k/api/sync.php?code=test` v prehliadači – mal by vrátiť `{"error":"Nič sa nenašlo pre kód: test"}` (to je správne)
2. Ak vráti 500 – skontroluj oprávnenia priečinka `api/data/` (chmod 755)
3. Ak vráti 404 – skontroluj, či je `sync.php` nahraný na správne miesto

---

**Problém:** `.htaccess` sa nenačítava (WebSupport ignoruje súbor)

**Riešenie:** V klientskom centre WebSupport skontroluj, či je pre doménu povolený `.htaccess` (štandardne áno na shared hostingu).

---

## Verzie nasadenia

| Verzia | Dátum | Zmeny |
|--------|-------|-------|
| 1.0.0 | 10.2.2026 | Initial GitHub Pages + render.com deployment |
| 1.1.0 | 26.2.2026 | Aktualizácia dokumentácie, pridanie Render.com sekcie |
| 2.0.0 | 26.2.2026 | Migrácia na WebSupport – PHP sync API, nová URL, `.htaccess` |
