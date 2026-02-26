# API dokumentácia

## Backend: Render.com

Backend je Node.js/Express server nasadený na **Render.com** (free tier).

- **Base URL:** `https://matica-rock-backend.onrender.com`
- **Súbor:** `api-server/server.ts`
- **Runtime:** Node.js (ESM modul, spúšťaný cez `tsx`)
- **Port:** `process.env.PORT` (nastavuje Render.com automaticky; fallback `3001` pre lokálny vývoj)

### Závislosti

| Balíček | Verzia | Popis |
|---------|--------|-------|
| `express` | ^4.18.2 | HTTP framework |
| `cors` | ^2.8.5 | CORS middleware (povolí všetky origins `*`) |
| `tsx` | ^4.7.0 | TypeScript runner (namiesto kompilácie) |

### Úložisko dát

Dáta sa ukladajú ako JSON súbory na disk:

```
api-server/
└── data/
    ├── ALFA.json
    ├── BETA.json
    └── ...
```

Každý súbor zodpovedá jednému kódu tábora a obsahuje celé pole `DaySchedule[]`.

> **Obmedzenie:** Render.com free tier používa **ephemeral filesystem** – pri každom redeploy sa disk vymaže. Dáta sú teda dočasné. Pre produkčné použitie odporúčame integráciu s perzistentnou databázou (napr. Render PostgreSQL alebo Redis).

---

## Endpointy

### `GET /health`

Health check endpoint – overí, že server beží.

**Odpoveď:**
```json
{ "status": "ok" }
```

---

### `POST /api/sync/:code`

Uloží harmonogram tábora pod daným kódom.

**URL parameter:**

| Parameter | Typ | Popis |
|-----------|-----|-------|
| `code` | `string` | Kód tábora (min. 2 znaky; povolené: `a-z A-Z 0-9 _ -`) |

**Request body:** `Content-Type: application/json`

```json
[
  {
    "id": "day-friday",
    "date": "Piatok",
    "isCollapsed": false,
    "events": [
      {
        "id": "f1",
        "startTime": "07:00",
        "endTime": "07:15",
        "title": "Budíček",
        "category": "ostatné",
        "responsible": "Peter",
        "shadow": "Jana"
      }
    ]
  }
]
```

**Odpovede:**

| Status | Body | Popis |
|--------|------|-------|
| `200` | `{ "success": true, "message": "Dáta uložené" }` | OK |
| `400` | `{ "error": "Kód musí mať minimálne 2 znaky" }` | Príliš krátky kód |
| `500` | `{ "error": "Chyba pri ukladaní" }` | Chyba servera |

**Sanitizácia kódu:** Zo `code` sa odstránia všetky znaky okrem `[a-zA-Z0-9_-]`.

---

### `GET /api/sync/:code`

Načíta uložený harmonogram pre daný kód.

**URL parameter:**

| Parameter | Typ | Popis |
|-----------|-----|-------|
| `code` | `string` | Kód tábora |

**Odpovede:**

| Status | Body | Popis |
|--------|------|-------|
| `200` | `DaySchedule[]` (JSON pole) | OK – vracia celý plán |
| `400` | `{ "error": "Kód je povinný" }` | Chýbajúci kód |
| `404` | `{ "error": "Nič sa nenašlo" }` | Kód neexistuje |
| `500` | `{ "error": "Chyba pri sťahovaní" }` | Chyba servera |

---

## Frontend volania API (`App.tsx`)

Konštanta v `App.tsx`:
```ts
const SYNC_API_BASE = 'https://matica-rock-backend.onrender.com/api/sync/';
```

### `saveToCloud()`

```ts
fetch(`${SYNC_API_BASE}${campCode}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(days),
})
```

### `loadFromCloud()`

```ts
fetch(`${SYNC_API_BASE}${campCode}`)
```

Frontend parsuje odpoveď ako:
1. Priame pole (`Array.isArray(responseData)`)
2. KVDB-style objekt s `value` stringom (pôvodný Vercel formát)
3. Ľubovoľný objekt

---

## Nepoužívaný handler: `api/sync.ts` (Vercel)

V repozitári existuje aj súbor `api/sync.ts`, ktorý predstavuje **pôvodnú implementáciu** pre **Vercel serverless functions** s **Vercel KV** (Redis-kompatibilné úložisko).

```ts
// api/sync.ts
import { kv } from '@vercel/kv';
// ...
await kv.set(`matica-${code}`, JSON.stringify(data), { ex: 7 * 24 * 60 * 60 });
```

Tento súbor je **momentálne neaktívny** – aplikácia ho nepoužíva. Frontend vždy komunikuje s Render.com backendom.

### Porovnanie implementácií

| Aspekt | `api/sync.ts` (Vercel – nepoužíva sa) | `api-server/server.ts` (Render.com – aktívny) |
|--------|---------------------------------------|-----------------------------------------------|
| Platforma | Vercel | Render.com |
| Úložisko | Vercel KV (Redis, TTL 7 dní) | Súbory na disku |
| Perzistencia | Áno (TTL 7 dní) | Ephemeral (maže sa pri redeploy) |
| Typ | Serverless function | Dlhobežiaci Express server |
| Stav | Nepoužíva sa | Aktívny |

---

## Lokálny vývoj backendu

```bash
cd api-server
npm install
npm run dev   # tsx watch server.ts – reštartuje pri zmene

# Server beží na http://localhost:3001
# GET  http://localhost:3001/health
# GET  http://localhost:3001/api/sync/TEST
# POST http://localhost:3001/api/sync/TEST
```
