# Development Guide

## Setup

### Prerequisites
- Node.js 18+
- Git
- VS Code (alebo iný editor)

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/pjetko-dotcom/matica-ro-c-k.git
cd matica-ro-c-k

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# Otvor http://localhost:3000
```

## Project Structure

```
matica-ro(c)k/
├── src/
│   ├── App.tsx              # Hlavná komponenta
│   ├── index.tsx            # Entry point
│   ├── types.ts             # TypeScript definície
│   └── utils/
│       └── time.ts          # Časové utility
├── components/
│   ├── EventForm.tsx        # Form na editáciu eventov
│   ├── Modal.tsx            # Modálne okno
│   └── PostponeForm.tsx     # Form na posunúť event
├── docs/
│   ├── DEVELOPMENT.md       # Tento súbor
│   ├── DEPLOYMENT.md        # Deployment inštrukcie
│   ├── architecture.md      # Technická architektúra
│   └── README.md            # Docs home
├── index.html               # HTML template (Tailwind CDN)
├── vite.config.ts           # Vite konfigurácia
├── tsconfig.json            # TypeScript konfigurácia
└── package.json             # Dependencies
```

## Key Files

### App.tsx
- Hlavný orchestrátor aplikácie
- Spravuje state: dni, eventy, dark mode
- Funkcie: `handleAddDay`, `handleRemoveDay`, `handleAddEvent`, `handleEditEvent`
- localStorage key: `scout_timetable_nature_v8`

### types.ts
```typescript
interface ScoutEvent {
  id: string;
  startTime: string;    // "HH:mm"
  endTime: string;
  title: string;
  category: ActivityType;
  responsible?: string;
  shadow?: string;
}

interface DaySchedule {
  id: string;
  date: string;         // "Pondelok", "Utorok", etc.
  events: ScoutEvent[];
  isCollapsed: boolean;
}
```

### index.html
- **Tailwind CDN** na styling
- **Font Awesome 6.4.0** na ikony
- **Custom CSS** pre dark mode, pozadie, efekty
- **Google Fonts** - Georama font

## Development Tips

### Hot Module Replacement (HMR)
Vite automaticky reloaduje zmeny v prehliadači. Stačí uložiť súbor.

### Dark Mode Testing
- Dark mode je uložený v localStorage
- Kľúč: `scout_dark_mode`
- Hodnota: `'true'` alebo `'false'`

### Debugging
```typescript
// Console logs
console.log('Event added:', event);

// React DevTools
// https://chrome.google.com/webstore/detail/react-developer-tools
```

### localStorage Testing
```javascript
// Vymaž all data
localStorage.clear()

// Alebo konkrétne
localStorage.removeItem('scout_timetable_nature_v8')
localStorage.removeItem('scout_dark_mode')

// View all
Object.keys(localStorage)
```

## Common Tasks

### Zmena Farby Pozadia
[index.html](../index.html) - hľadaj `background-color: #d9e8d6;`

### Zmena Ikony
[App.tsx](../App.tsx) - hľadaj `fa-gem` alebo emoji v header

### Zmena Font
[index.html](../index.html) - `font-family: 'Georama'`

### Prídaj Nový Category
1. Edituj [types.ts](../types.ts) - `enum ActivityType`
2. Prídaj farbu v [App.tsx](../App.tsx) - `getCategoryColor()`

## Build & Deployment

```bash
# Production build
npm run build

# Výstup v dist/ zložke

# Preview production build
npm run preview

# Deploy na GitHub
npm run build
git add dist/
git commit -m "Build"
git push

# Deploy na GitHub Pages
# Pozri DEPLOYMENT.md
```

## Useful Links

- [Tailwind Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Vite Docs](https://vitejs.dev)
- [Font Awesome](https://fontawesome.com/icons)

## TODO / Future Features

- [ ] Cloud sync na KVDB
- [ ] Export do PDF
- [ ] Mobilný responsívny dizajn
- [ ] Undo/Redo
- [ ] Print režim
- [ ] Multi-language (SK/CZ/EN)

