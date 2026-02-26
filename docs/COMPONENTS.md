# Popis komponentov

## Prehľad

| Súbor | Typ | Popis |
|-------|-----|-------|
| `App.tsx` | Hlavný komponent | Orchestrátor – spravuje celý stav aplikácie |
| `components/Modal.tsx` | UI wrapper | Modálny dialóg s backdrop blur efektom |
| `components/EventForm.tsx` | Formulár | Pridanie / úprava eventu |
| `components/PostponeForm.tsx` | Formulár | Posun začiatku eventu |

---

## `App.tsx`

Hlavný a jediný stavový komponent aplikácie. Všetky ostatné komponenty sú bezstavové a komunikujú cez props.

### State

| Premenná | Typ | Popis |
|----------|-----|-------|
| `days` | `DaySchedule[]` | Zoznam dní s eventmi – hlavný dátový stav |
| `campCode` | `string` | Kód tábora pre cloud sync |
| `isSyncing` | `boolean` | Indikátor prebiehajúcej sync operácie |
| `expandedEventId` | `string \| null` | ID eventu s rozbalenými akciami |
| `currentTime` | `Date` | Aktuálny čas (aktualizovaný každú 1 sekundu) |
| `viewMode` | `'grid' \| 'live'` | Aktívny pohľad |
| `isEventModalOpen` | `boolean` | Viditeľnosť EventForm modálu |
| `isPostponeModalOpen` | `boolean` | Viditeľnosť PostponeForm modálu |
| `editingEvent` | `{dayId, event} \| null` | Event práve upravovaný (null = nový) |
| `targetDayId` | `string \| null` | Deň, do ktorého sa pridáva/upravuje event |
| `postponingInfo` | `{dayId, eventId} \| null` | Identifikátor eventu na posun |

### Kľúčové funkcie

| Funkcia | Popis |
|---------|-------|
| `saveToCloud()` | POST request na Render.com backend s celým plánom |
| `loadFromCloud()` | GET request z Render.com backendu, parsuje DaySchedule[] |
| `handleAddDay()` | Pridá nový prázdny deň |
| `handleRemoveDay(dayId)` | Zmaže deň po potvrdení (confirm dialog) |
| `handleAddOrEditEvent(data)` | Pridá alebo upraví event v dni `targetDayId` |
| `handleMoveEvent(dayId, eventId, dir)` | Zamení obsah eventu so susedným (zachová časy) |
| `handleDeleteEvent(dayId, eventId)` | Zmaže event |
| `handlePostpone(minutes, type)` | Posunie event o N minút (SINGLE alebo CASCADE) |
| `isCurrentEvent(ev, dayDate)` | Vráti true ak je event aktuálne prebiehajúci |
| `getCategoryStyles(cat, active)` | Vráti Tailwind triedy pre danú kategóriu |

### Computed (useMemo)

| Premenná | Popis |
|----------|-------|
| `currentActiveActivity` | Práve prebiehajúci event dnes (`null` ak žiadny) |
| `nextActivity` | Najbližší nadchádzajúci event dnes |
| `progressPercent` | Percento dokončenia aktuálneho eventu (0–100) |

### View mody

#### Grid mode (`viewMode === 'grid'`)
- Zobrazuje všetky dni vertikálne so všetkými eventmi
- Každý event má farebnú indikačnú lištu podľa kategórie
- Prebiehajúci event je zvýraznený s progress barom
- Kliknutím na event sa rozbalí panel akcií (Posun / Upraviť / Zmazať)
- Drag-and-drop nahradzujú šípky hore/dole (presun zachová časy, vymení obsah)

#### Live mode (`viewMode === 'live'`)
- Kiosk/tablet pohľad pre promítanie počas programu
- Zobrazuje aktuálny event vo veľkom s SVG kruhovým odpočtom
- Ak nic neprebieha, zobrazí sa "Voľný čas / Prázdny papier" info

---

## `components/Modal.tsx`

Jednoduchý wrapper pre modálne dialógy.

### Props

| Prop | Typ | Popis |
|------|-----|-------|
| `isOpen` | `boolean` | Viditeľnosť modálu |
| `onClose` | `() => void` | Callback pre zavretie |
| `title` | `string` | Nadpis v hlavičke modálu |
| `children` | `ReactNode` | Obsah modálu |

### Správanie
- Keď `isOpen === false`, komponent nič nevyrenderuje (`return null`)
- Pozadie je polopriesvitné s backdrop blur efektom
- Modálne okno má maximálnu šírku `max-w-2xl`

---

## `components/EventForm.tsx`

Formulár pre vytvorenie alebo úpravu skautského eventu.

### Props

| Prop | Typ | Popis |
|------|-----|-------|
| `event` | `ScoutEvent \| null` | Ak null, ide o nový event; inak úprava |
| `defaultStartTime` | `string` | Predvolený čas začiatku pre nový event |
| `onSubmit` | `(data: Omit<ScoutEvent, 'id'>) => void` | Callback po odoslaní |
| `onCancel` | `() => void` | Callback pre zrušenie |

### Polia formulára

| Pole | Popis |
|------|-------|
| Názov | Textové pole pre názov aktivity |
| Začiatok | Čas začiatku (HH:mm); zmena automaticky prepočíta koniec (+60 min) |
| Koniec | Čas konca (HH:mm) |
| Kategória | Radio výber: Prednáška / Program / Jedlo / Ostatné |
| Zodpovedný | Voliteľné meno vedúceho |
| Tieň | Voliteľné meno asistenta/pozorovateľa |

---

## `components/PostponeForm.tsx`

Formulár pre posun eventu v čase.

### Props

| Prop | Typ | Popis |
|------|-----|-------|
| `onPostpone` | `(minutes: number, type: PostponeType) => void` | Callback po potvrdení |
| `onCancel` | `() => void` | Callback pre zrušenie |

### Polia formulára

| Pole | Popis |
|------|-------|
| Počet minút | Rýchle tlačidlá: +5, +10, +15, +30 |
| Dosah zmeny | `SINGLE` – iba tento event / `CASCADE` – celý zvyšok dňa |

### `CASCADE` logika (v `App.tsx`)
Pri kaskádovom posune sa posunú všetky eventy v danom dni, ktorých `startTime >= startTime` posunutého eventu.

---

## `utils/time.ts`

Modul čisto funkcionálnych pomocných funkcií pre prácu s časom. Neobsahuje žiadny stav ani React.

```
export const timeToMinutes(time, handleMidnight?)
export const addMinutes(time, minutes)
export const subtractMinutes(time, minutes)
export const getDuration(start, end)
export const compareTimes(a, b)
export const isDateToday(dateStr)
export const getRemainingSeconds(endTimeStr)
export const formatRemainingTime(totalSeconds)
```

Funkcia `isDateToday` rozoznáva deň podľa:
1. Slovenského názvu dňa (Pondelok, Utorok, ... Nedeľa)
2. Formátu DD.MM (napr. `26.02`)
