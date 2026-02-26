# Technická Architektúra

## Prehľad systému

**Matica Ro(c)k** je webová aplikácia pre správu harmonogramu skautského tábora. Funguje ako SPA (Single Page Application) nasadená na **GitHub Pages** s oddeleným backendom na **Render.com**.

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (GitHub Pages)                 │
│           https://pjetko-dotcom.github.io/matica-ro-c-k/    │
│                                                             │
│   React 19 + TypeScript + Vite + Tailwind CSS               │
│   Lokálne úložisko: localStorage (kľúč: scout_timetable_nature_v8)│
└────────────────────────────┬────────────────────────────────┘
                             │ REST API (fetch)
                             │ POST /api/sync/:code
                             │ GET  /api/sync/:code
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Render.com)                        │
│          https://matica-rock-backend.onrender.com            │
│                                                             │
│   Node.js + Express + TypeScript                            │
│   Úložisko: JSON súbory na disku (api-server/data/)         │
└─────────────────────────────────────────────────────────────┘
```

> **Poznámka:** V repozitári existuje aj `api/sync.ts` – pôvodný handler pre **Vercel + Vercel KV**. Tento súbor je nepoužívaný; aktuálny backend beží výhradne cez `api-server/server.ts` na Render.com.

---

## Dátový model

### `ActivityType` (enum)
| Hodnota | Popis |
|---------|-------|
| `prednáška` | Prednáška / vzdelávacia aktivita |
| `program` | Program / hra |
| `jedlo` | Jedlo |
| `ostatné` | Ostatné |

### `ScoutEvent` (interface)
```typescript
interface ScoutEvent {
  id: string;           // unikátne ID (timestamp alebo predefinované)
  startTime: string;    // "HH:mm"
  endTime: string;      // "HH:mm"
  title: string;        // názov aktivity
  category: ActivityType;
  responsible?: string; // meno zodpovednej osoby
  shadow?: string;      // meno "tieňa" (asistenta/pozorovateľa)
}
```

### `DaySchedule` (interface)
```typescript
interface DaySchedule {
  id: string;            // napr. "day-friday"
  date: string;          // zobrazovaný názov dňa (editovateľný)
  events: ScoutEvent[];
  isCollapsed?: boolean; // stav zbalenia v UI
}
```

### `PostponeType` (enum)
| Hodnota | Popis |
|---------|-------|
| `SINGLE` | Posunie iba vybraný event |
| `CASCADE` | Posunie vybraný event aj všetky nasledujúce v ten istý deň |

---

## Komponentová štruktúra

```
App.tsx                         ← hlavný orchestrátor
├── components/Modal.tsx        ← modal wrapper (glassmorphism)
├── components/EventForm.tsx    ← formulár pre pridanie/úpravu eventu
└── components/PostponeForm.tsx ← formulár pre posun času eventu
```

### `App.tsx`
Jadro aplikácie. Spravuje:
- **Globálny stav** – pole `DaySchedule[]` (dni + eventy)
- **Perzistenciu** – automatické ukladanie do `localStorage` pri každej zmene stavu
- **Synchronizáciu** – `saveToCloud()` / `loadFromCloud()` cez Render.com API
- **Dva view-mody**: `grid` (harmonogram) a `live` (kiosk zobrazenie)
- **Real-time hodinky** – `setInterval` každú 1 sekundu pre odpočet zostávajúceho času
- **Logiku editácie** – pridanie, úprava, zmazanie, presun eventov

### `Modal.tsx`
Jednoduchý obal pre modálne dialógy s backdrop blur efektom.

### `EventForm.tsx`
Formulár pre vytvorenie alebo úpravu eventu. Automaticky prepočíta `endTime` (+60 min) pri zmene `startTime`.

### `PostponeForm.tsx`
Formulár pre výber počtu minút (+5, +10, +15, +30) a typu posunu (`SINGLE` / `CASCADE`).

---

## Synchronizácia (Cloud Sync)

Frontend komunikuje s backendom pomocou `campCode` – krátkeho kódu tábora (napr. `"ALFA"`).

| Operácia | Metóda | URL |
|----------|--------|-----|
| Uložiť plán | `POST` | `https://matica-rock-backend.onrender.com/api/sync/{campCode}` |
| Načítať plán | `GET` | `https://matica-rock-backend.onrender.com/api/sync/{campCode}` |

- **Body:** celé pole `DaySchedule[]` serializované ako JSON
- **Kód tábora** sa ukladá do `localStorage` pod kľúčom `scout_camp_code`
- Backend sanitizuje kód cez regex `[^a-zA-Z0-9_-]` a ukladá dáta do súboru `api-server/data/{code}.json`

> **Upozornenie:** Render.com free tier "zaspieva" po 15 minútach nečinnosti. Pri prvom requeste po pauze môže backend reagovať s oneskorením ~30 s (cold start).

---

## Lokálna perzistencia

| Kľúč v localStorage | Obsah |
|--------------------|-------|
| `scout_timetable_nature_v8` | celý stav harmonogramu (`DaySchedule[]`) |
| `scout_camp_code` | naposledy použitý kód tábora |

---

## Inicializačné dáta

Pri prvom spustení (prázdny localStorage) sa načítajú predpripravené dáta `INITIAL_DATA` z `App.tsx`:
- **Piatok:** 5 eventov (Budíček → Obed)
- **Sobota:** 6 eventov vrátane "Tvorba hry (Ubuntu)" a "BRNO (Vlasáč)"
- **Nedeľa:** 4 eventy (Budíček → Príprava družinoviek)

---

## UI Stack

| Vrstva | Technológia |
|--------|------------|
| Framework | React 19 (StrictMode) |
| Jazyk | TypeScript 5.8 |
| Bundler | Vite 6.2 |
| Štýlovanie | Tailwind CSS (CDN v `index.html`) |
| Ikony | Font Awesome 6 (CDN) |
| Animácie | Native CSS (`animate-in`, `zoom-in-95`, `fade-in`) |
| Progress | SVG Circular Progress (inline, 100×100 viewBox) |
| Vizuálny efekt | Backdrop blur (glassmorphism hlavička) |

---

## Časové utility (`utils/time.ts`)

Všetka logika práce s časom sa nachádza v jednom module, čo zaručuje konzistentnosť naprieč celou aplikáciou.

| Funkcia | Popis |
|---------|-------|
| `timeToMinutes(time, handleMidnight?)` | Konvertuje `"HH:mm"` na minúty od polnoci |
| `addMinutes(time, minutes)` | Pridá minúty k `"HH:mm"` reťazcu |
| `subtractMinutes(time, minutes)` | Odčíta minúty |
| `getDuration(start, end)` | Vypočíta trvanie v minútach |
| `compareTimes(a, b)` | Porovná dva časy (pre triedenie) |
| `isDateToday(dateStr)` | Zistí, či je dátum/názov dňa dnes (slovenský formát aj DD.MM) |
| `getRemainingSeconds(endTime)` | Zostatok sekúnd do konca eventu |
| `formatRemainingTime(seconds)` | Formátuje `MM:SS` |
