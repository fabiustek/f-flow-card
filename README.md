# F-Flow Card

**Card per Home Assistant con i flussi energetici in tempo reale**: fotovoltaico, batteria, rete, casa, utilizzatori e ventilazione dell'inverter, tutto in un'unica card animata, con interfaccia in italiano.

[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
[![Release](https://img.shields.io/github/v/release/fabiustek/f-flow-card)](https://github.com/fabiustek/f-flow-card/releases)

Versione attuale: **v1.9.0** · Fork di [k-flow-card](https://github.com/thekhan1122/k-flow-card) di Khan Automation (thekhan1122), licenza MIT.

<p align="center">
  <img src="docs/images/card-overview.png" alt="F-Flow Card con tutte le sezioni attive" width="480">
</p>

> Le immagini di questa pagina sono generate dalla card vera con dati di esempio (`tools/screenshots/`) e vengono aggiornate a ogni versione.

---

## Indice

- [Cosa fa](#cosa-fa)
- [Installazione](#installazione)
- [Primi passi](#primi-passi)
- [Le sezioni della card](#le-sezioni-della-card)
  - [Flussi di energia](#flussi-di-energia)
  - [Casa a due falde](#casa-a-due-falde)
  - [Commutazione IN RETE / FUORI RETE](#commutazione-in-rete--fuori-rete)
  - [Riquadri giornalieri](#riquadri-giornalieri)
  - [Utilizzatori](#utilizzatori)
  - [Grafico dei consumi](#grafico-dei-consumi)
  - [Ventilazione inverter](#ventilazione-inverter)
  - [Statistiche](#statistiche)
  - [Videocamera](#videocamera)
  - [Cielo di notte e meteo](#cielo-di-notte-e-meteo)
  - [Statistiche batteria (JK BMS)](#statistiche-batteria-jk-bms)
  - [Auto elettrica / Wallbox](#auto-elettrica--wallbox)
  - [Da telefono](#da-telefono)
  - [Sezioni richiudibili](#sezioni-richiudibili)
- [Esempio completo](#esempio-completo)
- [Riferimento delle opzioni](#riferimento-delle-opzioni)
- [Logica dei colori](#logica-dei-colori)
- [Aggiornamenti](#aggiornamenti)
- [Risoluzione dei problemi](#risoluzione-dei-problemi)
- [Registro delle modifiche](#registro-delle-modifiche)
- [Per chi sviluppa](#per-chi-sviluppa)

---

## Cosa fa

- **Flussi animati** a curve morbide con linee tratteggiate sottili e luminose: fotovoltaico → inverter → batteria / rete / casa / auto, con velocità e colori che seguono la potenza
- **Sole e luna** che si muovono su un arco in base all'ora reale (`sun.sun`), con alba e tramonto; di notte **cielo stellato** con stelle cadenti
- **Meteo animato** nel cielo: nuvole, pioggia, temporale, neve, nebbia e vento dalla tua entità `weather.*`
- **Batteria a segmenti** colorata in base al SOC, con scia che sale in carica e scende in scarica
- **Traliccio luminoso**: rosso quando prelevi, verde quando immetti, barrato quando sei fuori rete
- **Casa a due falde** con FV1 a sinistra e FV2 a destra, ognuna illuminata dalla propria produzione
- **Commutazione IN RETE / FUORI RETE** dalla card: tieni premuto, conferma, fatto
- **Utilizzatori** con icona, colore e un disco stile contatore Ferraris che gira in base al consumo
- **Grafico dei consumi** delle ultime 24 ore: chi ha consumato e quando
- **Statistiche**: produzione FV di oggi per stringa con la stima, consumi della casa con i picchi, batteria nelle 24 ore
- **Videocamera** in diretta con le frecce per muovere una telecamera ONVIF
- **Ventilazione inverter** con livelli termici, temperature, PWM e ventole animate
- **Autonomia** fino a un SOC minimo a scelta (es. 20%) e **tempo alla ricarica**, energia residua, barra delle fonti di energia, modalità EMS
- **Wallbox e auto** disegnate accanto alla casa, con stato, potenza, SOC dell'auto e tempo alla carica completa
- **Leggibile anche da telefono**: se la card è stretta, i riquadri vanno su 3 colonne e le etichette si ingrandiscono
- **Sezioni richiudibili** (Inverter, Utilizzatori, Ventilazione) con riepilogo su una riga e flag 📌 per tenerle sempre aperte
- Supporto per **due batterie** e **stringhe FV aggiuntive** (FV3 sulla falda sinistra, FV4 sulla destra)
- **Editor visuale** completo in italiano: non serve scrivere YAML
- Un solo file JavaScript, nessuna dipendenza

Funziona con qualsiasi integrazione che esponga sensori di potenza ed energia: nata per GoodWe + JK BMS, usata con Deye e Sigenergy.

---

## Installazione

### Con HACS (consigliato)

1. In Home Assistant apri **HACS**, premi **⋮** in alto a destra → **Repository personalizzati**.
2. Incolla `https://github.com/fabiustek/f-flow-card`, categoria **Dashboard**, poi **Aggiungi**.
3. Cerca **F-Flow Card** in HACS e premi **Scarica**.
4. Ricarica il browser forzando l'aggiornamento: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac). Nell'app per telefono, chiudila e riaprila.

HACS registra la risorsa da solo e ti avvisa quando esce una nuova versione.

### Manuale

1. Copia il contenuto della cartella `dist/` (`f-flow-card.js` e le icone PNG) in `/config/www/community/f-flow-card/`.
2. In **Impostazioni → Plance → ⋮ → Risorse → Aggiungi risorsa** inserisci:
   ```yaml
   url: /local/community/f-flow-card/f-flow-card.js
   type: module
   ```
3. Ricarica il browser.

---

## Primi passi

1. Apri una plancia, premi **Modifica** → **Aggiungi card** e cerca **F-Flow Card** (oppure usa una card manuale con `type: custom:f-flow-card`).
2. Nell'editor visuale apri le sezioni una alla volta e scegli i tuoi sensori:
   - **⚙️ Generale**: nome dell'inverter, capacità della batteria (in Ah o kWh), potenze massime.
   - **☀️ Fotovoltaico** e **☀️ Altri dati fotovoltaico**: potenze delle stringhe, totale, produzione e consumo di oggi.
   - **🔌 Rete**: potenza della rete, energia prelevata e immessa.
   - **🔋 Batteria principale**: SOC, potenza, corrente, tensione.
3. Se un valore va al contrario (per esempio la batteria risulta in scarica mentre si carica), usa l'interruttore **Inverti segno** nella sezione della rete o della batteria.
4. Attiva le sezioni che ti servono: **🎨 Layout e intestazione**, **🔌 Utilizzatori**, **🌀 Ventilazione inverter**, **🚗 Auto elettrica / Wallbox**.

Tutte le funzioni aggiuntive sono facoltative: se non le attivi, non compaiono.

---

## Le sezioni della card

### Flussi di energia

<p align="center"><img src="docs/images/flow.png" alt="Area dei flussi di energia" width="480"></p>

- **In alto**: titolo, indicatore **IN RETE / FUORI RETE** e chip della **modalità EMS** (se configurati).
- **Arco del sole**: alba, mezzogiorno e tramonto di oggi; l'etichetta gialla mostra la produzione fotovoltaica totale.
- **Batteria** a sinistra: SOC, tensione, potenza e corrente, stato **CARICA / SCARICA / RIPOSO**. La scia bianca nella batteria sale quando si carica e scende quando si scarica.
- **Pannello autonomia** sotto la batteria, allineato al badge:
  - in **scarica** mostra **AUTONOMIA**: il tempo che resta fino al **SOC minimo** che scegli (es. "2h 36m · fino al 20%");
  - in **carica** mostra **TEMPO ALLA RICARICA**: il tempo per arrivare al **SOC obiettivo** (es. "fino al 100%");
  - a riposo mostra "batteria a riposo". Sotto c'è l'**energia residua** in kWh.
- **Flussi**: curve morbide con linee tratteggiate sottili e luminose che scorrono nella direzione dell'energia, più veloci quando la potenza sale. Il flusso della batteria è sempre blu, come la batteria.
- **Inverter** al centro: temperatura e percentuale di carico. Si può sostituire con una foto (`inverter_image`).
- **Rete** a destra: potenza istantanea, energia prelevata (▼) e immessa (▲) oggi. Sotto, la barra **Fonti energia** mostra in proporzione solare, carica, scarica e rete.
- **Barre FV / POT**: produzione rispetto alla potenza massima dell'impianto e potenza della batteria rispetto a quella dell'inverter.

Nella sezione **🎨 Layout e intestazione** puoi cambiare titolo, attivare la barra delle fonti, il pannello autonomia, l'immagine dell'inverter e tornare alle icone classiche (batteria, rete, casa).

**Autonomia fino a un SOC minimo** (sezione **⚙️ Generale**):
1. **SOC minimo per l'autonomia** (`battery_reserve_soc`): per esempio `20` se l'inverter non scarica la batteria sotto il 20%. L'autonomia viene calcolata solo sull'energia sopra quella soglia. Con `0` (predefinito) arriva fino a batteria vuota.
2. **SOC obiettivo per il tempo alla ricarica** (`battery_target_soc`): per esempio `100`, oppure `90` se carichi fino al 90%.
3. Serve anche la **capacità della batteria** nella stessa sezione.

Esempio: SOC 45%, soglia 20%, batteria da 16 kWh, scarica a 1533 W → 25% di 16 kWh = 4 kWh utilizzabili → **2h 36m**.

### Casa a due falde

La casa ha due falde di pannelli: **FV1 sulla sinistra** e **FV2 sulla destra**. Quando una stringa produce, la sua **falda diventa gialla** (come il flusso dal sole all'inverter) e i pannelli si illuminano tanto più quanto più produce; nome e potenza sono scritti in alto, accanto alla falda. Sotto la casa c'è il consumo istantaneo, e l'**anello alla base gira più veloce quanto più la casa consuma** (fermo sotto i 10 W). La casa (con il flusso che arriva dall'inverter, l'anello e il valore del consumo) prende il **colore delle fonti che la alimentano, mescolate in proporzione**: **giallo** per il solare, **blu** per la batteria, **rosso** per la rete. Per esempio, se la casa prende il 60% dal solare e il 40% dalla rete diventa arancione; metà solare e metà batteria dà un verde chiaro. La quota solare è la produzione FV che resta dopo la carica della batteria e l'immissione in rete. Le finestre si accendono quando c'è consumo.

**Stringhe aggiuntive FV3 e FV4**: attivale nella sezione **☀️ Stringhe FV aggiuntive** (＋ Attiva). **FV3** compare sotto FV1, sul lato della falda sinistra; **FV4** sotto FV2, sul lato della falda destra. Ogni falda si illumina con la somma delle sue stringhe (sinistra FV1 + FV3, destra FV2 + FV4). Con l'icona casa classica, FV3 e FV4 restano nella colonna di sinistra.

Se nel tuo impianto le stringhe sono al contrario, basta scambiare i sensori FV1 e FV2 nella sezione **☀️ Fotovoltaico**. Lì puoi anche dare il **nome che vuoi** a ogni falda/stringa, in base al tuo impianto (per esempio l'orientamento o "Garage"): compare accanto alla casa e nelle statistiche. Se lasci il campo vuoto resta **FV1**, **FV2**… Per tornare all'immagine vecchia: **Icona casa classica** (`home_icon_style: classic`).

### Commutazione IN RETE / FUORI RETE

<p align="center"><img src="docs/images/grid-switch.png" alt="Richiesta di conferma per passare fuori rete" width="480"></p>

Se l'impianto può staccarsi e riattaccarsi alla rete (per esempio con un modulo di sgancio e riaggancio), puoi comandarlo dalla card.

**Configurazione** (sezione **🎨 Layout e intestazione**):

| Opzione | Esempio | Cosa fa |
|---|---|---|
| Stato rete (`grid_status_entity`) | `binary_sensor.deye_grid` | `on` = in rete, `off` = fuori rete |
| Comando per passare FUORI RETE (`grid_switch_to_off`) | `switch.studio_off_grid` | Viene attivato per staccarsi |
| Comando per tornare IN RETE (`grid_switch_to_on`) | `switch.studio_on_grid` | Viene attivato per riattaccarsi |
| Chiedi conferma (`grid_switch_confirm`) | `true` | Mostra la richiesta di conferma |

**Come si usa:**
1. **Tieni premuto** per circa un secondo l'indicatore **IN RETE / FUORI RETE** in alto, oppure il traliccio. Una barra si riempie mentre tieni premuto. Un tocco breve non fa nulla, così non si commuta per sbaglio.
2. Compare la richiesta di conferma: **Procedi** oppure **Annulla**.
3. Con **Procedi** la card attiva l'entità giusta (`switch.turn_on` per gli switch, `button.press` per i pulsanti, `script.turn_on` per gli script).
4. Finché lo stato non cambia, l'indicatore mostra **COMMUTAZIONE…**. Fuori rete il traliccio diventa grigio e barrato.

Con il mouse, passando sopra l'indicatore compare il suggerimento ("Tieni premuto per passare FUORI RETE").

### Riquadri giornalieri

Sotto i flussi ci sono i totali di oggi. Con **6 riquadri giornalieri** attivo (`_daily_tiles_extended`) vedi: produzione FV, carica batteria, scarica batteria, prelievo dalla rete, immissione e consumo. Altrimenti la versione da 4 riquadri mostra anche l'energia residua della batteria. Il titolo della sezione usa il **nome dell'inverter** (es. "Deye Inverter").

### Utilizzatori

<p align="center"><img src="docs/images/consumers-chart.png" alt="Utilizzatori e grafico dei consumi" width="480"></p>

Un riquadro per ogni elettrodomestico, quanti ne vuoi.

1. Sezione **🔌 Utilizzatori** → **＋ Attiva** → **＋ Aggiungi utilizzatore**.
2. Per ognuno scegli **nome**, **sensore di potenza** (W o kW), **icona** (qualsiasi icona `mdi:`, con ricerca), **colore** e **soglia "acceso"** (predefinita 50 W).
3. Clicca sul nome di un utilizzatore per aprirlo o chiuderlo; con **▲ ▼** cambi l'ordine, con **✕** lo togli.

Nella card:
- Quando il consumo supera la soglia, il riquadro si illumina del suo colore.
- Sotto ogni riquadro c'è un **disco contatore** stile Ferraris: la tacca gira più veloce quando il consumo sale e si ferma a 0 W. La velocità di tutti i dischi si regola con **Velocità dischi contatore**.
- Toccando un riquadro si apre la scheda dell'entità.

### Grafico dei consumi

<p align="center"><img src="docs/images/chart-tooltip.png" alt="Dettaglio del grafico dei consumi" width="480"></p>

Sotto gli utilizzatori c'è il grafico dei consumi. Ogni utilizzatore è un'**area del suo colore**, impilata sulle altre: si vede subito **cosa ha consumato e quando**.

- **Periodo a vista**: con i pulsanti **1h · 4h · 8h · 12h · 24h** in alto a destra del grafico cambi il periodo con un tocco. La scelta viene ricordata su quel dispositivo. Il valore di **Ore mostrate all'apertura** nell'editor (predefinito 24) vale finché non premi un pulsante.
- Con periodi brevi il grafico è più dettagliato: una media al minuto per 1 ora, ogni 2 minuti fino a 4 ore, ogni 4 minuti fino a 8 ore, poi ogni 5 minuti.
- **Legenda**: per un grafico più compatto togli la spunta **Legenda sotto il grafico** nella sezione **🔌 Utilizzatori** dell'editor. Il totale "misurato X di Y kWh" resta visibile.

- I dati arrivano dallo **storico di Home Assistant** (recorder) e si aggiornano ogni 5 minuti.
- La **linea tratteggiata** è il consumo totale della casa (sensore **Consumo casa**): lo spazio tra le aree e la linea è il consumo non misurato.
- **Tocca il grafico** (o passaci sopra col mouse) per vedere l'orario e i watt di ogni utilizzatore, dal più alto al più basso.
- Sotto il grafico, la legenda riporta i **kWh** di ciascuno nel periodo; in alto, "misurato X di Y kWh".

> Se tra gli utilizzatori hai anche il totale della casa (es. "Casa"), apri il suo elemento nell'editor e togli la spunta **Mostra nel grafico**, altrimenti verrebbe contato due volte.

### Ventilazione inverter

<p align="center"><img src="docs/images/ventilation.png" alt="Sezione ventilazione inverter" width="480"></p>

Per chi ha una ventilazione ausiliaria dell'inverter. Sezione **🌀 Ventilazione inverter** → **＋ Attiva**. Tutti i sensori sono facoltativi.

| Campo | Esempio |
|---|---|
| Stato termico | `sensor.controller_fan_inverter_controller_fan_inverter_thermal_state` |
| Descrizione stato | vuoto = testo automatico dal livello |
| Temperatura ambiente | `sensor.clima_studio_room_temperature` |
| PWM ventole | `sensor.controller_fan_inverter_controller_fan_inverter_pwm_percentage` |
| RPM medio | vuoto = media delle ventole |
| Temperatura inverter | `sensor.deye_temperature` (vuoto = quella della sezione FV) |
| Temperatura DC | `sensor.deye_dc_temperature` |
| Ventole (＋ Aggiungi ventola) | nome + sensore rpm, es. `..._fan_1_rpm` |

Ogni livello termico ha il suo colore, testo e velocità della ventola principale; le piccole ventole girano in base ai loro giri reali.

| Stato | Badge | Testo |
|---|---|---|
| `idle` | Inattiva | Sistema in attesa (ventola barrata, ferma) |
| `cool` | Minima | Ventilazione minima attiva |
| `low` | Bassa | Raffreddamento leggero |
| `medium` | Media | Raffreddamento bilanciato |
| `high` | Alta | Ventilazione sostenuta |
| `very high` | Molto alta | Ventilazione intensa |
| `critical` | Critica | Temperatura critica, massima ventilazione (triangolo di avviso) |

Se lo stato ha un valore diverso, la card lo mostra così com'è.

### Statistiche

<p align="center"><img src="docs/images/statistics.png" alt="Sezione statistiche: produzione FV, consumi casa, batteria" width="480"></p>

Sezione **📈 Statistiche** → **＋ Attiva**. Ci sono tre grafici, ognuno attivabile o disattivabile; i dati arrivano dallo storico di Home Assistant e si aggiornano ogni 5 minuti. Toccando un grafico (o passandoci sopra col mouse) compare il dettaglio di quell'orario. Come le altre sezioni, si può chiudere e ha il flag 📌.

**1. Produzione FV oggi**
- Una barra per ogni ora della giornata, da mezzanotte a mezzanotte; ogni barra è divisa per stringa con colori fissi: **FV1 arancione, FV2 blu, FV3 viola, FV4 verde**. L'altezza è l'energia prodotta in quell'ora (kWh).
- La linea rossa tratteggiata indica **adesso**.
- **Stima**: scegli il tuo sensore in **Sensore di stima produzione**. La card lo usa così:
  - se il sensore ha la previsione nelle **attributi** (Solcast `detailedForecast` / `detailedHourly`, oppure un attributo `watts` come Forecast.Solar), disegna la curva tratteggiata della stima per **tutta la giornata**, anche le ore future, e mostra il totale stimato;
  - se è un sensore di **potenza** (W o kW, es. "Forecast +1h"), disegna la curva dal suo storico fino ad adesso;
  - se è un sensore di **energia** (kWh), mostra solo il totale stimato in alto.
- In alto: kWh prodotti oggi e stima; sotto: kWh per stringa.

**2. Consumi casa · ultime 24 ore**
- Usa il sensore **Consumo casa**. La linea e l'area cambiano colore con la potenza: **verde** sotto 1 kW, **giallo** intorno a 2,5 kW, **rosso** da 4 kW in su.
- Il **picco** è segnato con un cerchio e il valore; sotto c'è l'orario del picco. In alto: kWh consumati nelle 24 ore e potenza media.

**3. Batteria · ultime 24 ore**
- Area **blu** sopra lo zero quando la batteria si carica, **arancione** sotto lo zero quando si scarica; la linea bianca è il **SOC** (scala in % a destra).
- In alto: SOC minimo e massimo; sotto: kWh caricati e scaricati.

### Videocamera

<p align="center"><img src="docs/images/camera.png" alt="Sezione videocamera con le frecce di movimento" width="480"></p>

Sezione **📹 Videocamera** → **＋ Attiva**:
1. **Videocamera**: scegli la tua entità `camera.*`. Il video in diretta usa il lettore di Home Assistant (lo stesso delle card ufficiali: HLS, WebRTC o MJPEG, in base a cosa supporta la videocamera).
2. Se il video non parte, o per consumare meno dati, attiva **Solo immagine**: la card mostra un'immagine aggiornata ogni 10 secondi.
3. **Frecce ▲ ▼ ◀ ▶**: per ognuna scegli l'entità che muove la telecamera in quella direzione (pulsanti, script o switch dell'integrazione ONVIF). Facoltativo: **Posizione iniziale** per il pulsante centrale.

Nella card le frecce compaiono sopra il video, in basso a destra. **Un tocco** manda un comando (un passo di movimento); **tenendo premuto** il comando si ripete ogni mezzo secondo finché non lasci. La card usa `button.press` per i pulsanti, `script.turn_on` / `switch.turn_on` per script e switch. Compaiono solo le frecce configurate.

### Cielo di notte e meteo

<p align="center"><img src="docs/images/sky-night.png" alt="Cielo stellato di notte" width="480"><br><img src="docs/images/sky-storm.png" alt="Temporale con pioggia e nuvole" width="480"></p>

- **Di notte** (dal tramonto all'alba, da `sun.sun`) il cielo si riempie di **stelle** che brillano, con una **stella cadente** ogni tanto. Non serve configurare nulla.
- **Meteo**: in **🎨 Layout e intestazione** scegli la tua entità **Meteo** (`weather.*`, per esempio quella di Met.no o di OpenWeatherMap). Il cielo si anima in base alle condizioni:

| Condizione | Animazione |
|---|---|
| sereno (`sunny`, `clear-night`) | cielo libero (stelle di notte) |
| poco nuvoloso (`partlycloudy`) | due nuvole che passano; stelle un po' velate |
| nuvoloso (`cloudy`) | più nuvole; il sole si attenua, le stelle quasi spariscono |
| pioggia (`rainy`) / acquazzone (`pouring`) | nuvole scure e gocce (più fitte con l'acquazzone) |
| temporale (`lightning`, `lightning-rainy`) | nuvole scure, lampi e fulmini (con pioggia se `lightning-rainy`) |
| neve (`snowy`), neve e pioggia, grandine | fiocchi che scendono ondeggiando |
| nebbia (`fog`) | banchi di nebbia che scorrono |
| vento (`windy`) | folate che attraversano il cielo |

### Statistiche batteria (JK BMS)

<p align="center"><img src="docs/images/card-bms.png" alt="Card con le statistiche della batteria JK BMS" width="480"></p>

Con **Riquadri statistiche batteria** attivo (predefinito) compaiono: temperatura celle min/max, temperatura BMS, produzione FV totale, tensione cella minima e massima, scarica di oggi e il riquadro **autonomia** con l'orario stimato ("Fino a lun 21:45"). Le etichette si possono rinominare nella sezione **🏷️ Etichette**, che permette anche di mostrare un'altra entità al posto di quella predefinita.

### Auto elettrica / Wallbox

<p align="center"><img src="docs/images/wallbox.png" alt="Wallbox e auto in carica" width="480"></p>

A destra della casa, staccate dalle stringhe FV2/FV4, compaiono la **colonnina** e l'**auto**. Quando l'auto si carica, un flusso va dalla casa alla colonnina e il cavo si anima. Sopra l'auto ci sono la potenza di ricarica, lo stato, il SOC dell'auto (anche come barra sotto l'auto), la corrente e il tempo alla carica completa.

**Configurazione** (sezione **🚗 Auto elettrica / Wallbox** → **＋ Attiva**):
1. **Potenza wallbox**: il sensore di potenza della wallbox o della presa (W o kW). È l'unico campo necessario.
2. **Stato wallbox** (facoltativo): se lo lasci vuoto, la card considera l'auto **in carica** quando la potenza supera 50 W.
3. **SOC batteria auto** (facoltativo): per esempio il livello batteria dall'integrazione della tua auto.
4. **Corrente wallbox** e **Tempo alla carica completa** (facoltativi).
5. **Capacità batteria auto** in Wh (facoltativa): se non hai un sensore del tempo residuo, la card lo stima da capacità, SOC e potenza. Per esempio 43,2 kWh → `43200`.

Stati riconosciuti (non importano maiuscole e minuscole):

| Stato della wallbox | Nella card | Colore |
|---|---|---|
| contiene `charging`, `ricarica`, `in carica` | IN CARICA | azzurro |
| contiene `complete`, `finished`, `full` | CARICA COMPLETA | verde |
| contiene `connected`, `plugged`, `waiting`, `paused`, `ready` | COLLEGATA | giallo |
| altro (es. `disconnected`, `idle`) | SCOLLEGATA | grigio |
| nessuno stato configurato e potenza ≤ 50 W | IN ATTESA | grigio |

### Sezioni richiudibili

<p align="center"><img src="docs/images/sections-closed.png" alt="Sezioni chiuse con riepilogo e flag per tenerle aperte" width="480"></p>

Le sezioni **Inverter** (riquadri giornalieri), **Utilizzatori** e **Ventilazione inverter** si aprono e si chiudono toccando il titolo. Da chiuse occupano una sola riga, con un riepilogo:
- **Inverter**: produzione FV e consumo di oggi.
- **Utilizzatori**: potenza totale degli utilizzatori e quanti sono accesi.
- **Ventilazione**: livello termico e giri medi, con il colore del livello.

Il flag **📌** a destra decide come si presenta la sezione quando apri o ricarichi la pagina:
- **📌 spuntato**: la sezione si apre **sempre aperta** (bloccata aperta).
- **📌 senza spunta**: puoi aprirla quando vuoi, ma a ogni ricaricamento della pagina la trovi **chiusa**.

Di partenza tutte le sezioni hanno il flag spuntato, quindi la card si presenta come prima finché non togli la spunta. Il flag e la scelta delle ore del grafico vengono salvati **sul dispositivo** (nel browser o nell'app): sul telefono e sul computer puoi avere impostazioni diverse.

### Da telefono

<p align="center"><img src="docs/images/phone.png" alt="La card in una colonna stretta, come da telefono" width="340"></p>

La card si adatta alla **propria larghezza**, non a quella dello schermo: se è stretta (sotto 440 px, come su un telefono o in una colonna stretta della plancia), i 6 riquadri giornalieri vanno su 3 colonne e le etichette del disegno (orari, autonomia, FV1/FV2, wallbox…) diventano più grandi.

---

## Esempio completo

La configurazione della demo nelle immagini, con nomi di entità di esempio:

```yaml
type: custom:f-flow-card
card_title: Flusso Energia
inverter_name: Deye

# Fotovoltaico e casa
pv_total_power: sensor.pv_power
pv1_power: sensor.pv1_power
pv2_power: sensor.pv2_power
consump: sensor.load_power
inv_temp: sensor.inverter_temp
today_pv: sensor.today_pv
today_load: sensor.today_load
pv_max_power: 6000
inverter_max_power: 6000

# Rete
grid_active_power: sensor.grid_power
grid_import_energy: sensor.today_import
grid_export_energy: sensor.today_export
grid_status_entity: binary_sensor.deye_grid
grid_switch_to_off: switch.studio_off_grid
grid_switch_to_on: switch.studio_on_grid
ems_mode_entity: select.ems_mode

# Batteria
battery_soc: sensor.battery_soc
battery_power: sensor.battery_power
battery_current: sensor.battery_current
battery_voltage: sensor.battery_voltage
today_batt_chg: sensor.today_batt_chg
batt_dis: sensor.today_batt_dis
battery_cap_unit: kwh
battery_full_wh: 16
battery_reserve_soc: 20
battery_target_soc: 100

# Layout
_show_energy_supply: true
_show_backup_panel: true
_daily_tiles_extended: true
_show_battery_stats: false

# Wallbox e auto
_show_ev: true
charger_power: sensor.wallbox_power
charger_soc: sensor.auto_livello_batteria
charger_battery_capacity_wh: 43200

# Utilizzatori e grafico
_show_consumers: true
consumers:
  - name: Boiler
    entity: sensor.boiler_power
    icon: mdi:water-boiler
    color: "#f85149"
  - name: Lavatrice
    entity: sensor.lavatrice_power
    icon: mdi:washing-machine
    color: "#a78bfa"
  - name: Cucina
    entity: sensor.cucina_power
    icon: mdi:chef-hat
    color: "#facc15"
    threshold: 200

# Ventilazione inverter
_show_ventilation: true
vent_state_entity: sensor.controller_fan_inverter_controller_fan_inverter_thermal_state
vent_ambient_temp: sensor.clima_studio_room_temperature
vent_pwm: sensor.controller_fan_inverter_controller_fan_inverter_pwm_percentage
vent_inv_temp: sensor.deye_temperature
vent_dc_temp: sensor.deye_dc_temperature
vent_fans:
  - name: FAN1
    entity: sensor.controller_fan_inverter_controller_fan_inverter_fan_1_rpm
  - name: FAN2
    entity: sensor.controller_fan_inverter_controller_fan_inverter_fan_2_rpm
  - name: FAN3
    entity: sensor.controller_fan_inverter_controller_fan_inverter_fan_3_rpm
```

---

## Riferimento delle opzioni

Tutte le opzioni si impostano dall'editor visuale; qui trovi le chiavi YAML corrispondenti. Le chiavi che iniziano con `_` sono interruttori che mostrano o nascondono parti della card.

### Generale e layout

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `card_title` | `Flusso Energia` | Titolo nell'intestazione |
| `inverter_name` | `''` | Nome nel riquadro dell'inverter e nel titolo dei riquadri giornalieri |
| `inverter_image` | `''` | URL di un'immagine al posto del riquadro INV (es. `/local/inverter.png`) |
| `ems_mode_entity` | `''` | Modalità EMS mostrata sotto il titolo |
| `weather_entity` | `''` | Entità meteo per le animazioni del cielo |
| `battery_cap_unit` | `ah` | Unità della capacità batteria: `ah` o `kwh` |
| `battery_full_ah` | `0` | Capacità in Ah (se `ah`) |
| `battery_full_wh` | `0` | Capacità **in kWh** (se `kwh`) |
| `battery_reserve_soc` | `0` | SOC minimo (%) fino a cui calcolare l'autonomia |
| `battery_target_soc` | `100` | SOC obiettivo (%) per il tempo alla ricarica |
| `pv_max_power` | `7500` | Potenza massima dell'impianto FV (W) |
| `inverter_max_power` | `6000` | Potenza massima dell'inverter (W) |
| `_show_energy_supply` | `false` | Barra delle fonti di energia |
| `_show_backup_panel` | `false` | Pannello autonomia ed energia residua |
| `_daily_tiles_extended` | `false` | 6 riquadri giornalieri invece di 4 |
| `_show_battery_stats` | `true` | Riquadri statistiche batteria (JK BMS) |
| `battery_style` | `modern` | `modern` (a segmenti) o `classic` |
| `grid_icon_style` | `modern` | `modern` (traliccio luminoso) o `classic` (immagine) |
| `home_icon_style` | `modern` | `modern` (casa a due falde) o `classic` (immagine) |
| `sun` | `sun.sun` | Entità del sole |

### Fotovoltaico e casa

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `pv1_power` / `pv2_power` | sensori GoodWe | Potenza delle stringhe FV1 (falda sinistra) e FV2 (falda destra) |
| `pv1_name` … `pv4_name` | `''` | Nome libero delle falde/stringhe; se vuoto `FV1`, `FV2`… |
| `_show_pv_extra` | `false` | Mostra le stringhe FV3 e FV4 |
| `pv3_power` / `pv4_power` | `''` | Potenza delle stringhe FV3 (sotto FV1, falda sinistra) e FV4 (sotto FV2, falda destra) |
| `pv_total_power` | `sensor.goodwe_pv_power` | Potenza FV totale (se vuota: somma delle stringhe) |
| `today_pv` | `sensor.goodwe_today_s_pv_generation` | Produzione di oggi (kWh) |
| `total_pv_gen_entity` | `sensor.goodwe_total_pv_generation` | Produzione totale (kWh) |
| `inv_temp` | `sensor.goodwe_inverter_temperature_module` | Temperatura dell'inverter |
| `consump` | `sensor.goodwe_house_consumption` | Consumo della casa (W) |
| `today_load` | `sensor.goodwe_today_load` | Consumo di oggi (kWh) |

### Rete

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `grid_active_power` | `sensor.goodwe_active_power` | Potenza della rete (W) |
| `grid_power_alt` | `sensor.grid_phase_a_power` | Sensore alternativo se il primo non è disponibile |
| `invert_grid_power` | `false` | Inverte il segno (se positivo = immissione) |
| `grid_import_energy` | `sensor.goodwe_today_energy_import` | Energia prelevata oggi (kWh) |
| `grid_export_energy` | `''` | Energia immessa oggi (kWh) |
| `grid_status_entity` | `''` | Stato IN RETE / FUORI RETE |
| `grid_switch_to_off` | `''` | Entità da attivare per passare fuori rete |
| `grid_switch_to_on` | `''` | Entità da attivare per tornare in rete |
| `grid_switch_confirm` | `true` | Chiede conferma prima di commutare |

### Batterie

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_battery` | `true` | Mostra la batteria principale |
| `battery_soc` | `sensor.jk_soc` | Stato di carica (%) |
| `battery_power` | `sensor.jk_power` | Potenza (W) |
| `battery_current` | `sensor.jk_current` | Corrente (A) |
| `battery_voltage` | `sensor.jk_voltage` | Tensione (V) |
| `invert_battery_power` | `false` | Inverte il segno (se positivo = scarica) |
| `today_batt_chg` | `sensor.goodwe_today_battery_charge` | Carica di oggi (kWh) |
| `batt_dis` | `sensor.goodwe_today_battery_discharge` | Scarica di oggi (kWh) |
| `battery_temp1` / `battery_temp2` | `sensor.jk_temp1` / `sensor.jk_temp2` | Sonde temperatura celle |
| `battery_mos` | `sensor.jk_mos` | Temperatura del BMS |
| `battery_min_cell` / `battery_max_cell` | `sensor.jk_cellmin` / `sensor.jk_cellmax` | Tensione cella minima e massima |
| `goodwe_battery_soc` / `goodwe_battery_curr` | sensori GoodWe | SOC e corrente di riserva |
| `_show_battery2` | `false` | Attiva la batteria secondaria |
| `battery2_soc`, `battery2_power`, `battery2_current`, `battery2_voltage`, `battery2_mos` | `''` | Sensori della batteria secondaria |
| `battery2_full_ah` / `battery2_full_wh` | `0` | Capacità della batteria 2, se diversa dalla 1 |

### Utilizzatori e grafico

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_consumers` | `false` | Mostra la sezione |
| `consumers_title` | `Utilizzatori` | Titolo della sezione |
| `consumers_meter_speed` | `1` | Velocità dei dischi contatore (0.1–5) |
| `consumers` | `[]` | Elenco con `name`, `entity`, `icon`, `color`, `threshold` (W), `chart` (`false` per escluderlo dal grafico) |
| `consumers_chart` | `true` | Mostra il grafico dei consumi |
| `consumers_chart_hours` | `24` | Ore mostrate all'apertura (1–72); poi si cambiano con i pulsanti sul grafico |
| `consumers_chart_legend` | `true` | Legenda sotto il grafico (`false` per un grafico più compatto) |
| `consumers_chart_total` | `true` | Linea tratteggiata del consumo totale (`consump`) |

### Statistiche

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_stats` | `false` | Mostra la sezione Statistiche |
| `stats_pv` | `true` | Grafico produzione FV di oggi |
| `stats_forecast_entity` | `''` | Sensore di stima produzione (Solcast, Forecast.Solar, potenza o energia) |
| `stats_load` | `true` | Grafico consumi casa ultime 24 ore (sensore `consump`) |
| `stats_battery` | `true` | Grafico batteria ultime 24 ore (`battery_power`, `battery_soc`) |

### Videocamera

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_camera` | `false` | Mostra la sezione |
| `camera_title` | `Videocamera` | Titolo della sezione |
| `camera_entity` | `''` | Entità `camera.*` |
| `camera_mode` | `live` | `live` (video in diretta) o `snapshot` (immagine ogni 10 s) |
| `ptz_up` / `ptz_down` / `ptz_left` / `ptz_right` | `''` | Entità da attivare per ogni freccia |
| `ptz_home` | `''` | Entità per la posizione iniziale (pulsante centrale) |

### Ventilazione inverter

| Chiave | Descrizione |
|---|---|
| `_show_ventilation` | Mostra la sezione |
| `vent_title` | Titolo (predefinito `Ventilazione inverter`) |
| `vent_state_entity` | Stato termico: `idle`, `cool`, `low`, `medium`, `high`, `very high`, `critical` |
| `vent_status_entity` | Descrizione dello stato (se vuota: testo automatico) |
| `vent_ambient_temp` | Temperatura ambiente |
| `vent_pwm` | PWM delle ventole (%) |
| `vent_rpm_avg` | RPM medio (se vuoto: media delle ventole) |
| `vent_inv_temp` | Temperatura inverter (se vuota: `inv_temp`) |
| `vent_dc_temp` | Temperatura DC |
| `vent_fans` | Elenco ventole con `name` e `entity` (rpm) |

### Auto elettrica / Wallbox

| Chiave | Descrizione |
|---|---|
| `_show_ev` | Mostra la sezione |
| `charger_power` | Potenza della wallbox (W o kW) — **necessario** |
| `charger_state` | Stato (`charging`, `completed`, `connected`…). Facoltativo: se vuoto, "in carica" quando la potenza supera 50 W |
| `charger_current` | Corrente (A) |
| `charger_soc` | SOC della batteria dell'auto (%) |
| `charger_eta` | Minuti alla carica completa (facoltativo) |
| `charger_battery_capacity_wh` | Capacità della batteria dell'auto (Wh), per stimare il tempo |

### Etichette

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_labels_custom_entities` | `false` | Attiva la sezione Etichette |
| `label_cell_temp_minmax` | `TEMP CELLE MIN/MAX` | Etichetta temperatura celle |
| `label_bms_temp` | `TEMP BMS` | Etichetta temperatura BMS |
| `label_min_cell` / `label_max_cell` | `Cella Min` / `Cella Max` | Etichette tensione celle |
| `label_batt_dis` | `Scarica Batt.` | Etichetta scarica batteria |
| `label_total_pv_gen` | `PRODUZIONE FV TOT.` | Etichetta produzione FV totale |
| `label_endurance` | `AUTONOMIA` | Etichetta autonomia |
| `label_entity_*` | `''` | Entità alternativa per il riquadro corrispondente |

Nella sezione Etichette la scelta di un'entità alternativa si sblocca solo dopo aver cambiato il testo dell'etichetta; il sensore corrispondente nella sezione Batteria viene allora bloccato, per evitare doppioni.

---

## Logica dei colori

| Elemento | Colori |
|---|---|
| **Batteria (SOC)** | ≤20% rosso · ≤40% arancione · ≤75% verde · >75% azzurro |
| **Rete** | rosso prelievo · verde immissione · grigio a riposo · barrato fuori rete |
| **Casa e flusso verso la casa** | miscela in proporzione delle fonti: giallo solare · blu batteria · rosso rete (es. solare + rete = arancione) |
| **Temperatura celle** | ≤15°C blu · ≤35°C verde · ≤45°C arancione · >45°C rosso |
| **Tensione celle** | <3,0 V rosso · <3,1 V arancione · <3,4 V giallo · ≤3,65 V verde · >3,65 V rosso |
| **Ventilazione** | da grigio (idle) ad azzurro, blu, indaco, viola, fino a magenta (critical) |
| **Flusso batteria** | sempre blu; la direzione dei trattini indica carica o scarica |
| **Statistiche** | FV1 arancione · FV2 blu · FV3 viola · FV4 verde · consumi verde → giallo → rosso · batteria blu carica / arancione scarica |
| **Wallbox e auto** | azzurro in carica · verde carica completa · giallo collegata · grigio scollegata / in attesa |

---

## Aggiornamenti

A ogni nuova versione viene creata automaticamente una **release** su GitHub e HACS ti propone l'aggiornamento in Home Assistant. Dopo l'aggiornamento ricarica il browser con `Ctrl + Shift + R`.

Per sapere quale versione stai usando, apri la console del browser (`F12`): compare la scritta **F-FLOW-CARD v1.9.0**.

---

## Risoluzione dei problemi

**La card non compare o dice "Custom element doesn't exist"**
- Controlla in **Impostazioni → Plance → Risorse** che ci sia `/hacsfiles/f-flow-card/f-flow-card.js` (HACS) o `/local/community/f-flow-card/f-flow-card.js` (manuale), tipo **Modulo JavaScript**.
- Ricarica con `Ctrl + Shift + R`; nell'app per telefono svuota la cache o chiudi e riapri l'app.
- Se arrivi da k-flow-card, cambia `type: custom:k-flow-card` in `type: custom:f-flow-card`.

**Un valore mostra `--`**
- In **Strumenti per sviluppatori → Stati** controlla che l'entità esista e abbia un valore numerico (non `unavailable` o `unknown`). La card mostra `--` finché l'entità non torna valida.

**Un flusso va al contrario**
- Usa **Inverti segno** nella sezione Rete o Batteria.

**Il grafico dei consumi dice "Storico non disponibile"**
- Il grafico usa lo storico di Home Assistant: i sensori degli utilizzatori non devono essere esclusi dal `recorder`. Lo storico parte da quando il sensore esiste, quindi i primi giorni il grafico può essere vuoto in parte.

**La commutazione IN RETE / FUORI RETE non fa nulla**
- Servono sia **Stato rete** sia almeno uno dei due **Comandi**. Bisogna **tenere premuto** circa un secondo: il tocco breve è ignorato di proposito. Se lo stato rete è sconosciuto, la card non commuta.

**La wallbox mostra `--` o resta grigia**
- Controlla il sensore **Potenza wallbox**: è l'unico necessario. Senza **Stato wallbox**, la card mostra "IN CARICA" solo quando la potenza supera 50 W, altrimenti "IN ATTESA".
- Se hai configurato lo stato ma il valore non è tra quelli riconosciuti (vedi [Auto elettrica / Wallbox](#auto-elettrica--wallbox)), la card mostra "SCOLLEGATA": in quel caso lascia vuoto lo stato.

**Una sezione si apre sempre chiusa (o sempre aperta)**
- Dipende dal flag **📌** accanto al titolo della sezione: spuntato = sempre aperta, senza spunta = chiusa a ogni ricaricamento. Il flag è salvato su ogni dispositivo separatamente; in una finestra in incognito non viene ricordato.

**I testi sono troppo piccoli**
- Dalla v1.6.0 i caratteri sono più grandi e, quando la card è stretta, le etichette del disegno si ingrandiscono da sole. Se usi una plancia a più colonne, una colonna più larga rende tutto più leggibile.

**Le icone degli utilizzatori non si vedono**
- Usa nomi di icone `mdi:` validi (es. `mdi:washing-machine`); nell'editor puoi cercarle per nome.

**L'autonomia mostra `--`**
- Serve la capacità della batteria nella sezione **⚙️ Generale** e un sensore di potenza della batteria valido. Se la batteria è a riposo non c'è una stima ("batteria a riposo").

**La videocamera resta nera o dice "Videocamera non disponibile"**
- Controlla che l'entità `camera.*` funzioni in una card "Immagine" di Home Assistant. Se il video in diretta non parte, attiva **Solo immagine** nella sezione Videocamera.

**Le frecce della videocamera non muovono nulla**
- Ogni freccia deve essere collegata a un'entità che si può "premere" o accendere (pulsante, script, switch). Prova l'entità da **Strumenti per sviluppatori → Azioni**: se lì la telecamera si muove, funziona anche dalla card.

**Il meteo non si anima**
- Serve un'entità `weather.*` in **🎨 Layout e intestazione**. Lo stato deve essere uno di quelli standard di Home Assistant (es. `rainy`, `cloudy`); con stati diversi il cielo resta sereno.

**Le statistiche dicono "Storico non disponibile" o la stima non compare**
- I grafici usano lo storico di Home Assistant: i sensori non devono essere esclusi dal `recorder`.
- Per la curva della stima su tutta la giornata serve un sensore con la previsione negli attributi (es. Solcast "Forecast Today"). Con un sensore di energia (kWh) la card mostra solo il totale stimato.

**L'autonomia sembra troppo lunga o troppo corta**
- Controlla **SOC minimo per l'autonomia** in **⚙️ Generale**: deve corrispondere alla soglia sotto cui il tuo inverter non scarica la batteria. Se il SOC è già sotto la soglia, l'autonomia è 0.

**In carica o in scarica, la scia della batteria va nel verso sbagliato**
- La direzione segue il segno della potenza della batteria: se anche il badge CARICA/SCARICA è invertito, attiva **Inverti segno potenza batteria** nella sezione **🔋 Batteria principale**.

**Segnalare un problema**
- Apri una issue su [GitHub](https://github.com/fabiustek/f-flow-card/issues) con versione di Home Assistant, versione della card, eventuali errori della console del browser e la parte di YAML interessata.

---

## Registro delle modifiche

### v1.9.0
- **Cielo di notte** con stelle che brillano e stelle cadenti.
- **Meteo animato** nel cielo (nuvole, pioggia, acquazzone, temporale con fulmini, neve, nebbia, vento) dall'entità `weather.*`.
- Nuova sezione **📹 Videocamera**: video in diretta (o immagine ogni 10 s) con le frecce per muovere una telecamera ONVIF; tocco = un passo, tenere premuto = movimento continuo.
- Le **falde** diventano gialle quando le loro stringhe producono; nomi e potenze di FV1/FV2 più in alto e vicini alle falde.
- **Colore della casa in base alle fonti**: flusso inverter → casa, casa, anello e consumo prendono una miscela di giallo (solare), blu (batteria) e rosso (rete) nella proporzione in cui ciascuna fonte alimenta la casa.

### v1.8.0
- Nuova sezione **📈 Statistiche** con tre grafici: produzione FV di oggi a barre orarie per stringa con la curva della stima, consumi della casa nelle 24 ore colorati per intensità con il picco evidenziato, batteria nelle 24 ore (carica, scarica e SOC).
- **Nomi delle stringhe a scelta** (se vuoti restano FV1, FV2…) accanto alla casa e nelle statistiche.
- **Linee dei flussi più sottili**, come quella dal sole all'inverter; il flusso della batteria è sempre **blu**.

### v1.7.1
- I flussi tornano a **linee tratteggiate** invece dei pallini, mantenendo curve morbide e bagliore.

### v1.7.0
- **Autonomia fino a un SOC minimo** (`battery_reserve_soc`) e **tempo alla ricarica** fino a un SOC obiettivo (`battery_target_soc`); l'etichetta passa da AUTONOMIA a TEMPO ALLA RICARICA in base alla direzione della batteria.
- **Flussi più morbidi**: curve invece di angoli e particelle luminose (batteria, rete, casa, wallbox).
- La **scia nella batteria** sale in carica e scende in scarica.
- **Wallbox e auto** più piccole e staccate da FV2, con le informazioni subito sopra l'auto.
- **FV3 e FV4** accanto alla casa, sotto FV1 e FV2; ogni falda si illumina con le sue stringhe.
- **Anello sotto la casa** che gira alla velocità del consumo.
- Testi del pannello autonomia allineati al badge CARICA/SCARICA.
- Corretto: dopo una modifica della configurazione la scia sole → inverter e la barra FV restavano vuote finché la produzione non cambiava.

### v1.6.0
- **Wallbox rifatta**: potenza, SOC e corrente si vedono sempre; senza sensore di stato la card capisce dalla potenza quando l'auto è in carica; più stati riconosciuti (collegata, in pausa…).
- Nuove icone **colonnina + auto** disegnate in SVG accanto alla casa, colorate in base allo stato, con flusso dalla casa, cavo animato e barra del SOC.
- **Caratteri più grandi** in tutta la card; quando la card è stretta (telefono) i riquadri vanno su 3 colonne e le etichette si ingrandiscono.
- Nell'editor i campi delle entità non mostrano più l'asterisco "obbligatorio".
- **Sezioni richiudibili** Inverter, Utilizzatori e Ventilazione, con riepilogo su una riga e flag 📌 per tenerle aperte anche dopo il ricaricamento.
- **Grafico dei consumi**: pulsanti 1h · 4h · 8h · 12h · 24h per cambiare periodo a vista (più dettaglio sui periodi brevi) e opzione per nascondere la legenda.

### v1.5.0
- **Commutazione IN RETE / FUORI RETE** dalla card: tieni premuto l'indicatore o il traliccio, conferma, e la card attiva lo switch giusto. "COMMUTAZIONE…" in attesa del cambio di stato; traliccio barrato fuori rete.
- **Casa a due falde**: FV1 sulla falda sinistra, FV2 sulla destra, ognuna illuminata dalla propria produzione.

### v1.4.0
- **Grafico dei consumi** delle ultime 24 ore (fino a 72), ad aree colorate per utilizzatore, con linea del totale casa, dettaglio al tocco e kWh per utilizzatore.
- **Traliccio luminoso** in SVG che cambia colore con prelievo e immissione.
- **Ventilazione inverter** ridisegnata, compatta, con i livelli termici idle → critical.

### v1.3.0
- Sezione **Utilizzatori** con icone, colori e dischi stile contatore Ferraris.
- Prima versione della sezione **Ventilazione inverter**.
- Nuova **batteria a segmenti**; correzioni della casa tagliata e del bordo sinistro.
- Versione nella console e **release automatiche** per gli aggiornamenti HACS.

### v1.2.0
- Progetto rinominato in **f-flow-card** e tradotto in **italiano** (orari nel formato 24 ore).
- Opzioni di layout: titolo, indicatore IN RETE / FUORI RETE, modalità EMS, immagine dell'inverter, barra fonti energia, pannello autonomia, 6 riquadri giornalieri.

### Versioni precedenti (k-flow-card originale)
- **v1.1.x**: correzioni (animazioni dei flussi, capacità della seconda batteria, valori `--` per sensori non disponibili, frecce di prelievo/immissione).
- **v1.0.x**: editor con capacità in Ah/kWh, sezione Etichette con entità alternative, posizione del sole basata su alba e tramonto reali, luna di notte.
- In precedenza: doppia batteria, auto elettrica, stringhe FV3/FV4, arco del sole e prima struttura della card per GoodWe + JK BMS.

---

## Per chi sviluppa

- Il codice è tutto in `dist/f-flow-card.js`: `FFlowCardEditor` (editor visuale) e `FFlowCard` (la card). La parte statica si costruisce in `_buildStaticSVG()` a ogni cambio di configurazione; i valori si aggiornano in `_updateDynamic()` e `_updateExtraSections()` a ogni aggiornamento di `hass`.
- La versione è nella costante `FFC_VERSION` in cima al file. Quando cambia su `main`, l'azione `.github/workflows/release.yml` crea la release `vX.Y.Z` che HACS usa per gli aggiornamenti.
- Le immagini del README si rigenerano con:
  ```bash
  node tools/screenshots/shoot.js
  ```
  Lo script apre `tools/screenshots/demo.html` (la card vera con dati di esempio) in Chromium tramite Playwright e salva le foto in `docs/images/`. Va lanciato a ogni nuova versione.
- I commenti nel codice sono in inglese; tutto ciò che vede l'utente è in italiano.

---

*F-Flow Card · fork di k-flow-card (Khan Automation) · licenza MIT · aggiornato alla v1.9.0*
