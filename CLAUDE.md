# F-Flow Card — istruzioni per Claude

Card Lovelace per Home Assistant (fork di k-flow-card), distribuita con HACS. Il proprietario parla italiano: rispondi in italiano.

## Struttura
- `dist/f-flow-card.js` — tutto il codice (editor `FFlowCardEditor` + card `FFlowCard`). Nessuna build.
- `tools/screenshots/` — `demo.html` (card vera con `hass` finto) e `shoot.js` (genera le foto del README in `docs/images/`).
- `.github/workflows/hacs.yml` — validazione HACS. `.github/workflows/release.yml` — crea la release `vX.Y.Z` quando cambia `FFC_VERSION` su `main`.

## Regole a ogni nuova funzione o versione
1. **Aumenta la versione** in `const FFC_VERSION = 'x.y.z'` in cima a `dist/f-flow-card.js` e aggiungi le note nel blocco di commenti "Changes vX.Y.Z" subito sotto. Senza questo HACS non propone l'aggiornamento.
2. **Aggiorna il README** in modo completo, non solo il registro delle modifiche:
   - numero di versione in alto, nella sezione "Aggiornamenti" e nell'ultima riga;
   - sezione dedicata alla nuova funzione con istruzioni passo passo per l'editor visuale;
   - righe nel "Riferimento delle opzioni" per ogni nuova chiave YAML;
   - "Esempio completo", "Risoluzione dei problemi" e "Logica dei colori" se toccati;
   - voce nel "Registro delle modifiche".
3. **Rigenera le foto**: aggiorna `tools/screenshots/demo.html` (dati e scene) se la novità non si vede, poi `node tools/screenshots/shoot.js` (se `require('playwright')` non si risolve, usa `NODE_PATH=$(npm root -g)`), controlla le immagini e committa `docs/images/`. Se servono nuove icone `mdi:` nella demo, aggiungile a `tools/screenshots/icons.json`.
4. Nuove opzioni: aggiungile a `getStubConfig()` e all'editor; i testi visibili all'utente sono in italiano, i commenti nel codice in inglese.
5. Le nuove funzioni devono essere facoltative o non rompere le configurazioni esistenti.
6. Lavora su un branch, apri una PR verso `main` (via `gh api` REST) e lascia il merge al proprietario.
