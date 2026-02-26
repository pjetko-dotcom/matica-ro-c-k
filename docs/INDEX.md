# Matica RO(C)K – Dokumentácia

Vitaj v dokumentácii! Tu nájdeš všetko čo potrebuješ na začiatok, vývoj a deployment.

## Rýchly úvod

**Čo to je?** Webová aplikácia pre skautov na plánovanie harmonogramu tábora s live kiosk modom a cloud synchronizáciou.

**Frontend:** https://pjetko-dotcom.github.io/matica-ro-c-k/ (GitHub Pages)  
**Backend API:** https://matica-rock-backend.onrender.com (Render.com)

**Ako spustiť lokálne:**
```bash
npm install
npm run dev
# http://localhost:3000
```

---

## Dokumentácia podľa cieľu

### Pre vedúcich / správcov
- [README.md](../README.md) – Čo je to Matica RO(C)K
- [CHANGELOG.md](CHANGELOG.md) – Čo sa zmenilo

### Pre vývojárov
- [DEVELOPMENT.md](DEVELOPMENT.md) – Lokálny setup a development
- [architecture.md](architecture.md) – Technická architektúra, dátové modely, deployment diagram
- [COMPONENTS.md](COMPONENTS.md) – Popis všetkých komponentov, state, props
- [API.md](API.md) – REST API endpointy, Render.com backend, porovnanie s Vercel variantom
- [DEPLOYMENT.md](DEPLOYMENT.md) – Nasadenie na GitHub Pages + Render.com

### Pre prispievateľov
- [CONTRIBUTING.md](CONTRIBUTING.md) – Ako prispievať

---

## Štruktúra dokumentácie

| Súbor | Popis |
|-------|-------|
| [INDEX.md](INDEX.md) | Táto stránka – navigácia |
| [architecture.md](architecture.md) | Architektúra systému, dátové modely, UI stack |
| [COMPONENTS.md](COMPONENTS.md) | Detailný popis komponentov, state, funkcie |
| [API.md](API.md) | REST API dokumentácia, backend na Render.com |
| [DEPLOYMENT.md](DEPLOYMENT.md) | GitHub Pages + Render.com deployment guide |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup, project structure, development tips |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Ako prispievať do projektu |
| [CHANGELOG.md](CHANGELOG.md) | História verzií a zmien |
| [README.md](../README.md) | Úvodný README v root |

---## 🛠️ Základné Príkazy

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
