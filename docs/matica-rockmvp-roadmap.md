# Matica Rock Roadmap

## Prehľad projektu
Nástroj pre personál skautských táborov na dynamickú správu harmonogramu. Na rozdiel od bežných kalendárov je stavaný na "organizovaný chaos" táborov.

## Aktuálny Stav (v8.2)
- [x] **Matica View (Timetable)**: Čistý zoznam aktivít na plynulej časovej osi s proporcionálnou výškou.
- [x] **Vizuálna Mierka**: Implementovaná mierka 2.5px/min pre lepšiu intuíciu dĺžky programu.
- [x] **Event Management**: Kompletný CRUD systém so špecifickými kategóriami.
- [x] **Zodpovední a Tieňovanie**: Pridané polia pre mená vedúcich priamo v blokoch aktivít.
- [x] **Logika Posunu**: 
    - [x] **Single**: Posun len jedného bloku.
    - [x] **Cascade**: Posun vybranej aktivity A VŠETKÝCH nasledujúcich.
- [x] **Moderný Redizajn**: Glassmorphism, Georama font, Kruhový Progress v Live režime.
- [x] **Polished Live Mode**: Širokouhlý (max-w-6xl) a kompaktný dizajn pre lepšie vyplnenie obrazovky, zobrazenie zodpovedných osôb.
- [x] **Cloud Sync**: Synchronizácia cez unikátny "KÓD MATICE" pomocou KVDB API.

## Budúce Plány
### Fáza 5: Export a Reporty
- [ ] **Export do PDF/Obrázka**: Rýchle zdieľanie cez WhatsApp/Slack.
- [ ] **Print View**: Optimalizácia pre tlač na A4.

### Fáza 6: Rozšírené Plánovanie
- [ ] **Detekcia Konfliktov**: Vizuálne varovanie pri prekrytí aktivít.
- [ ] **Šablóny**: Preddefinované rozvrhy (napr. "Daždivý deň", "Príchodový deň").

## Architektonické Rozhodnutia
1. **HH:mm Formát**: Používame stringovú reprezentáciu času pre maximálnu jednoduchosť manuálneho zadávania v teréne.
2. **Kaskádová logika**: Aplikácia iteruje cez zoradené pole eventov a aplikuje časovú deltu na každý blok začínajúci po spúšťacom bode.
3. **Zodpovední**: Implementované ako voliteľné textové polia pre rýchlu vizuálnu identifikáciu "kto čo robí".
