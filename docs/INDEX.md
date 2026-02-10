# 📚 Matica RO(C)K - Dokumentácia

Vitaj v dokumentácii! Tu nájdeš všetko čo potrebuješ na začiatok, vývoj a deployment.

## 🚀 Rýchly Úvod

**Čo to je?** Scout staff timetable planner - aplikácia na plánovanie harmonogramu skautských táborov.

**Kde to vidieť?** https://pjetko-dotcom.github.io/matica-ro-c-k/

**Ako to spustim?**
```bash
npm install
npm run dev
# http://localhost:3000
```

---

## 📖 Dokumentácia podľa Cieľu

### 👨‍💼 Pre Vedúcich/Správcov
- [README.md](../README.md) - Čo je to Matica RO(C)K
- [CHANGELOG.md](CHANGELOG.md) - Čo sa zmenilo

### 👨‍💻 Pre Vývojárov
- [DEVELOPMENT.md](DEVELOPMENT.md) - Lokálny setup a development
- [architecture.md](architecture.md) - Technická štruktúra
- [DEPLOYMENT.md](DEPLOYMENT.md) - Ako nasadiť na GitHub Pages

### 🤝 Pre Prispievateľov
- [CONTRIBUTING.md](CONTRIBUTING.md) - Ako prispievať
- [architecture.md](architecture.md) - Ako funguje code

---

## 📁 Štruktúra Dokumentácie

| Súbor | Určenie |
|-------|---------|
| [INDEX.md](INDEX.md) | 👈 Táto stránka - Navigácia |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup, project structure, development tips |
| [DEPLOYMENT.md](DEPLOYMENT.md) | GitHub Pages deployment process |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Ako prispievať do projektu |
| [architecture.md](architecture.md) | Technická architektúra, dátové modely |
| [CHANGELOG.md](CHANGELOG.md) | História verzií a zmien |
| [README.md](../README.md) | Úvodný README v root |

---

## 🛠️ Základné Príkazy

```bash
# Development
npm run dev           # Spusti dev server na localhost:3000

# Production
npm run build         # Skompiluj na dist/
npm run preview       # Preview production build

# Git
git checkout main     # Prepni na main vetvu
npm run build         # Build pred deployom
git add .
git commit -m "Feature"
git push origin main
```

---

## ❓ FAQ

**Q: Ako sa zmení farba pozadia?**
A: V [index.html](../index.html) - hľadaj `background-color: #d9e8d6;`

**Q: Ako sa zmení ikona?**
A: V [App.tsx](../App.tsx) - hľadaj emoji 🪨 alebo `fa-gem`

**Q: Kde sú dáta uložené?**
A: V localStorage s kľúčom `scout_timetable_nature_v8`

**Q: Ako sa nasadí na GitHub?**
A: Pozri [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🔗 Užitočné Odkazy

- **Repo:** https://github.com/pjetko-dotcom/matica-ro-c-k
- **Live:** https://pjetko-dotcom.github.io/matica-ro-c-k/
- **Issues:** https://github.com/pjetko-dotcom/matica-ro-c-k/issues

---

## 📞 Kontakt

Otvor [GitHub Issue](https://github.com/pjetko-dotcom/matica-ro-c-k/issues) s otázkou.

---

**Šťastný vývoj!** 🚀
