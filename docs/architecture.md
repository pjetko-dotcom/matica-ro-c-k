# Technická Architektúra

## Dátový Model
Aplikácia pracuje s rozhraním `ScoutEvent`:
```typescript
interface ScoutEvent {
  id: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  title: string;
  category: ActivityType;
  responsible?: string; // Meno zodpovednej osoby
  shadow?: string;      // Meno "tieňa" (asistenta)
}
```

## Komponentová Štruktúra
- **App.tsx**: Hlavný orchestrátor, spravuje globálny stav (pole dní a eventov), view-modely a synchronizáciu.
- **Timetable (Grid Mode)**: Vykresľuje vizuálnu časovú os s kategóriami a menami zodpovedných.
- **Live Mode**: Širokouhlý komponent pre kiosk/tablet zobrazenie s odpočítavaním a detailmi o vedení bloku.
- **EventForm / PostponeForm**: Špecializované formuláre pre správu času a detailov.
- **Modal**: Glassmorphism obal pre fokusované interakcie, rozšírený pre lepšiu prácu s formulármi.

## Synchronizácia (KVDB)
Pre cloudovú synchronizáciu využívame `kvdb.io`. 
- **Endpoint**: `https://kvdb.io/T8pWfWw5bVpLpQYjYnNqfR/[campCode]`
- Dáta sa posielajú ako JSON string celého poľa `DaySchedule[]`.
- Pri každej zmene sa lokálne ukladá do `localStorage` (offline safety).

## UI Stack
- **Typografia**: Georama (Google Fonts).
- **Styling**: Tailwind CSS pre utility-first prístup.
- **Vizuálne efekty**: 
  - Backdrop filters pre sklenený efekt.
  - SVG Circular Progress pre vizualizáciu času v Live móde.
  - Custom SVG Noise Filter pre prémiovú textúru pozadia.

## Časové Utility
Všetka logika prepočtov sa nachádza v `utils/time.ts`, čo zaručuje, že prepočty ako `08:50 + 15m = 09:05` sú konzistentné naprieč celou aplikáciou.
