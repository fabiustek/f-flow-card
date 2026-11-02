# f-flow-card

**Card personalizzata per Home Assistant con i flussi energetici in tempo reale** — fork di [k-flow-card](https://github.com/thekhan1122/k-flow-card) di Khan Automation (thekhan1122), con licenza MIT.
`f-flow-card.js` · Unified Edition · grafico dei consumi, utilizzatori, ventilazione inverter, interfaccia in italiano **V1.4.0**

<img width="1708" height="2520" alt="IMG_20260513_114249" src="https://github.com/user-attachments/assets/e4c54570-5b9e-43c4-9326-b44d4105a5d1" />
<img width="1108" height="1688" alt="IMG_20260516_011350" src="https://github.com/user-attachments/assets/6914d4ab-daa6-432a-983d-6abac15a1cac" />
<img width="1114" height="1744" alt="IMG_20260516_011300" src="https://github.com/user-attachments/assets/ce97703f-ed71-4ab9-a79d-8d7cf3bcd3f6" />

> Le immagini qui sopra vengono dal progetto originale e mostrano l'interfaccia in inglese.

---

## Panoramica

`f-flow-card` è una card Lovelace per Home Assistant che disegna un diagramma animato e in tempo reale dei flussi di energia di un impianto fotovoltaico con accumulo. È nata per inverter GoodWe con batterie gestite da JK BMS, ma funziona con qualsiasi integrazione che esponga sensori di potenza ed energia (ad esempio Sigenergy). Tutto è contenuto in un unico file JavaScript, senza dipendenze.

La card unisce un'area SVG con i flussi (arco del sole, percorsi animati, inverter, batteria, rete, casa, auto elettrica) a un pannello HTML con i dati della batteria. Tutto si aggiorna in tempo reale tramite l'oggetto `hass` standard.

---

## Funzionalità

- Percorsi animati dei flussi (fotovoltaico → inverter → batteria / rete / casa / auto)
- Posizione del sole in tempo reale lungo un arco, basata su `sun.sun`; luna di notte
- Colore della batteria in base al SOC, con indicatori di carica e scarica
- Supporto per due batterie (principale e secondaria)
- Nodo per auto elettrica / wallbox con stato, SOC e tempo alla carica completa
- Stringhe FV aggiuntive (FV3 / FV4) con un unico interruttore
- Riquadri batteria: temperatura celle, temperatura BMS, tensione cella min/max, scarica, produzione FV totale
- Riquadro autonomia: tempo residuo in scarica o tempo alla carica completa
- Layout in stile Sigenergy (facoltativo): indicatore IN RETE / FUORI RETE, modalità EMS, immagine dell'inverter, barra fonti energia, pannello autonomia, 6 riquadri giornalieri
- Sezione **Utilizzatori**: quanti elettrodomestici vuoi, con icona, colore e un disco stile contatore Ferraris che gira più o meno veloce in base al consumo
- **Grafico dei consumi** delle ultime 24 ore: un'area colorata per ogni utilizzatore, dallo storico di Home Assistant
- Sezione **Ventilazione inverter** compatta, con i livelli termici (idle → critical), temperature, PWM, giri medi e ventole animate
- Traliccio della rete luminoso disegnato in SVG: rosso quando prelevi, verde quando immetti
- Batteria a segmenti moderna (oppure quella classica)
- Editor visuale completo, diviso in sezioni: non serve scrivere YAML
- Etichette ed entità personalizzabili per i 6 riquadri statistici
- Tema scuro, adatto anche al telefono

---

## Installazione

### Metodo 1 — HACS (consigliato)

1. In HACS vai su **⋮ → Repository personalizzati** (Custom repositories).
2. Incolla `https://github.com/fabiustek/f-flow-card` (senza `.git`).
3. Categoria: **Dashboard** (nelle versioni meno recenti di HACS si chiama **Lovelace** o **Plugin**).
4. Cerca **f-flow-card** e premi **Scarica**: la risorsa viene registrata automaticamente.
5. Ricarica il browser forzando l'aggiornamento (`Ctrl + Shift + R` / `Cmd + Shift + R`).
6. Aggiungi la card a una dashboard e configurala con l'editor visuale.

> HACS registra la risorsa da solo e installa anche le icone (`grid-icon.png`, `home-icon.png`, `ev-charger-icon.png`) nel percorso giusto.

---

### Metodo 2 — Manuale

1. Copia il contenuto della cartella `dist/` (il file `f-flow-card.js` e le tre icone PNG) in:
   ```
   /config/www/community/f-flow-card/
   ```
   La card cerca le icone in `/local/community/f-flow-card/`, quindi la cartella deve chiamarsi così.

2. Registra la risorsa:
   *(Impostazioni → Plance → Risorse → Aggiungi risorsa)*
   ```yaml
   url: /local/community/f-flow-card/f-flow-card.js
   type: module
   ```

3. Aggiungi la card a una dashboard:
   ```yaml
   type: custom:f-flow-card
   ```

4. Configura le entità con l'editor visuale.

---

## Layout in stile Sigenergy (v1.2.0)

Tutte queste opzioni sono facoltative: se non le attivi, la card ha l'aspetto classico. Le trovi anche nell'editor visuale, nella sezione **🎨 Layout e intestazione**.

| Opzione | Tipo | Descrizione |
|---|---|---|
| `card_title` | testo | Titolo nell'intestazione (predefinito `Flusso Energia`) |
| `grid_status_entity` | entità | Mostra l'indicatore **IN RETE / FUORI RETE** nell'intestazione |
| `ems_mode_entity` | entità | Mostra la **Modalità EMS** sotto il titolo |
| `inverter_image` | URL | Immagine al posto del riquadro INV disegnato (es. `/local/sigenergy-inverter.png`) |
| `_show_energy_supply` | booleano | Barra delle fonti: Solare / Carica / Scarica / Rete |
| `_show_backup_panel` | booleano | Pannello con autonomia e kWh residui |
| `_daily_tiles_extended` | booleano | 6 riquadri giornalieri (FV, carica, scarica, prelievo, immissione, consumo) |
| `_show_battery_stats` | booleano | Imposta `false` per nascondere i riquadri JK BMS (predefinito `true`) |
| `battery_style` | testo | `modern` (batteria a segmenti, predefinita) oppure `classic` |
| `grid_icon_style` | testo | `modern` (traliccio luminoso, predefinito) oppure `classic` (immagine PNG) |

Le righe FV1 / FV2 spariscono da sole se `pv1_power` / `pv2_power` sono vuoti.

L'indicatore dello stato rete riconosce stati come `on grid`, `connected`, `on` (→ **IN RETE**) e `off grid`, `island`, `disconnected`, `backup` (→ **FUORI RETE**). Qualsiasi altro stato viene mostrato così com'è.

```yaml
type: custom:f-flow-card
card_title: Sigenergy System
inverter_name: Sigen
grid_status_entity: sensor.sigen_grid_status
ems_mode_entity: select.sigen_ems_work_mode
inverter_image: /local/sigenergy-inverter.png
pv1_power: ""
pv2_power: ""
_show_energy_supply: true
_show_backup_panel: true
_daily_tiles_extended: true
_show_battery_stats: false
battery_cap_unit: kwh
battery_full_wh: 48
```

> I nomi delle entità nell'esempio sono indicativi: scegli quelli del tuo impianto con l'editor visuale.

---

## Utilizzatori (v1.3.0)

Mostra un riquadro per ogni elettrodomestico. Nell'editor: sezione **🔌 Utilizzatori** → **＋ Attiva** → **＋ Aggiungi utilizzatore**. Per ogni utilizzatore scegli nome, sensore di potenza (W o kW), icona (qualsiasi icona `mdi:`), colore e la soglia oltre la quale il riquadro si illumina. Con ▲ ▼ cambi l'ordine, con ✕ lo togli. Toccando un riquadro nella card si apre la scheda dell'entità.

Sotto ogni riquadro c'è un piccolo **disco contatore** (come i vecchi contatori Ferraris): la tacca colorata gira più veloce quando il consumo sale e si ferma a 0 W. Con `consumers_meter_speed` regoli la velocità di tutti i dischi.

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_consumers` | `false` | Mostra la sezione |
| `consumers_title` | `Utilizzatori` | Titolo della sezione |
| `consumers_meter_speed` | `1` | Velocità dei dischi (0.1–5) |
| `consumers` | `[]` | Elenco: `name`, `entity`, `icon`, `color`, `threshold` (W, predefinita 50), `chart` (`false` per escluderlo dal grafico) |
| `consumers_chart` | `true` | Mostra il grafico dei consumi |
| `consumers_chart_hours` | `24` | Ore mostrate (1–72) |
| `consumers_chart_total` | `true` | Linea tratteggiata con il consumo totale (sensore `consump`) |

### Grafico dei consumi (v1.4.0)

Sotto i riquadri c'è un grafico ad aree sovrapposte: ogni utilizzatore ha il suo colore, così vedi subito **cosa ha consumato e quando**. I dati arrivano dallo storico di Home Assistant (recorder), con una media ogni 5 minuti, e si aggiornano ogni 5 minuti. La linea tratteggiata è il consumo totale della casa: lo spazio tra le aree e la linea è il consumo non misurato. Passando il dito o il mouse sul grafico vedi i valori di ogni utilizzatore in quell'orario. Sotto il grafico ci sono i kWh consumati da ciascuno nel periodo.

> Se tra gli utilizzatori hai anche il totale della casa (es. "Casa"), togli la spunta **Mostra nel grafico**: altrimenti verrebbe contato due volte.

```yaml
_show_consumers: true
consumers:
  - name: Lavatrice
    entity: sensor.lavatrice_power
    icon: mdi:washing-machine
    color: "#a78bfa"
  - name: Cucina
    entity: sensor.cucina_power
    icon: mdi:chef-hat
    threshold: 200
```

---

## Ventilazione inverter (v1.3.0)

Per chi ha una ventilazione ausiliaria dell'inverter. Nell'editor: sezione **🌀 Ventilazione inverter** → **＋ Attiva**. Tutti i sensori sono facoltativi: la sezione mostra solo quello che configuri.

| Chiave | Descrizione |
|---|---|
| `_show_ventilation` | Mostra la sezione |
| `vent_title` | Titolo (predefinito `Ventilazione inverter`) |
| `vent_state_entity` | Stato termico del controller: `idle`, `cool`, `low`, `medium`, `high`, `very high`, `critical` |
| `vent_status_entity` | Descrizione dello stato (es. "Sistema in attesa") |
| `vent_ambient_temp` | Temperatura ambiente |
| `vent_pwm` | PWM delle ventole (%) |
| `vent_rpm_avg` | RPM medio; se vuoto è la media delle ventole |
| `vent_inv_temp` | Temperatura inverter; se vuota usa `inv_temp` |
| `vent_dc_temp` | Temperatura DC |
| `vent_fans` | Elenco ventole: `name`, `entity` (rpm) |

Ogni livello termico ha colore, testo e velocità della ventola principale:

| Stato | Badge | Testo | Effetto |
|---|---|---|---|
| `idle` | Inattiva | Sistema in attesa | ventola barrata, ferma |
| `cool` | Minima | Ventilazione minima attiva | azzurro, pulsazione lenta |
| `low` | Bassa | Raffreddamento leggero | blu, pulsazione lenta |
| `medium` | Media | Raffreddamento bilanciato | indaco |
| `high` | Alta | Ventilazione sostenuta | viola |
| `very high` | Molto alta | Ventilazione intensa | viola acceso, pulsazione veloce |
| `critical` | Critica | Temperatura critica, massima ventilazione | magenta, triangolo di avviso |

Le piccole ventole girano in proporzione ai loro giri reali. Se lo stato ha un valore diverso da quelli dell'elenco, la card lo mostra così com'è. Se non c'è un sensore di stato, la ventilazione è considerata accesa quando gli rpm sono sopra zero.

```yaml
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

## Aggiornamenti automatici con HACS

Ogni volta che su `main` cambia la versione nel file `dist/f-flow-card.js` (costante `FFC_VERSION`), un'azione di GitHub crea da sola la release corrispondente (es. `v1.3.0`). HACS controlla le release e ti propone l'aggiornamento in Home Assistant. Puoi vedere la versione installata nella console del browser: compare la scritta `F-FLOW-CARD v1.3.0`.

---

## Riferimento della configurazione

Tutte le opzioni si impostano dall'editor visuale. Qui sotto trovi le chiavi YAML corrispondenti, utili per la configurazione manuale.

### Generale / Fotovoltaico

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `inverter_name` | `''` | Nome mostrato nel riquadro dell'inverter e nel titolo dei riquadri giornalieri |
| `pv1_power` | `sensor.goodwe_pv1_power` | Potenza stringa FV 1 (W) |
| `pv2_power` | `sensor.goodwe_pv2_power` | Potenza stringa FV 2 (W) |
| `pv3_power` | `''` | Stringa FV 3 — facoltativa, si attiva con "Stringhe FV aggiuntive" |
| `pv4_power` | `''` | Stringa FV 4 — facoltativa, si attiva con "Stringhe FV aggiuntive" |
| `pv_total_power` | `sensor.goodwe_pv_power` | Potenza FV totale (W) |
| `pv_max_power` | `7500` | Potenza FV massima, per la scala della barra (W) |
| `inverter_max_power` | `6000` | Potenza massima dell'inverter, per la scala della barra (W) |
| `today_pv` | `sensor.goodwe_today_s_pv_generation` | Produzione FV di oggi (kWh) |
| `total_pv_gen_entity` | `sensor.goodwe_total_pv_generation` | Produzione FV totale (kWh) |
| `inv_temp` | `sensor.goodwe_inverter_temperature_module` | Temperatura dell'inverter |
| `today_batt_chg` | `sensor.goodwe_today_battery_charge` | Carica della batteria di oggi (kWh) |
| `today_load` | `sensor.goodwe_today_load` | Consumo di oggi (kWh) |
| `sun` | `sun.sun` | Entità del sole per la posizione sull'arco |

### Rete

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `grid_active_power` | `sensor.goodwe_active_power` | Potenza attiva della rete (W) |
| `grid_import_energy` | `sensor.goodwe_today_energy_import` | Energia prelevata oggi (kWh) |
| `grid_export_energy` | `''` | Energia immessa oggi (kWh) — facoltativa |
| `grid_power_alt` | `sensor.grid_phase_a_power` | Sensore di potenza rete alternativo |
| `invert_grid_power` | `false` | Inverte il segno — attivalo se positivo = immissione |
| `consump` | `sensor.goodwe_house_consumption` | Consumo della casa (W) |

### Batteria principale

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_battery` | `true` | Mostra la batteria principale |
| `battery_soc` | `sensor.jk_soc` | Stato di carica (%) |
| `battery_power` | `sensor.jk_power` | Potenza (W) |
| `battery_current` | `sensor.jk_current` | Corrente (A) |
| `battery_voltage` | `sensor.jk_voltage` | Tensione (V) |
| `battery_temp1` | `sensor.jk_temp1` | Sonda temperatura celle 1 |
| `battery_temp2` | `sensor.jk_temp2` | Sonda temperatura celle 2 |
| `battery_mos` | `sensor.jk_mos` | Temperatura MOS del BMS |
| `battery_min_cell` | `sensor.jk_cellmin` | Tensione cella minima |
| `battery_max_cell` | `sensor.jk_cellmax` | Tensione cella massima |
| `batt_dis` | `sensor.goodwe_today_battery_discharge` | Scarica di oggi (kWh) |
| `battery_cap_unit` | `ah` | Unità della capacità: `ah` oppure `kwh` |
| `battery_full_ah` | `0` | Capacità della batteria (Ah), usata se `battery_cap_unit: ah` |
| `battery_full_wh` | `0` | Capacità della batteria **in kWh**, usata se `battery_cap_unit: kwh` |
| `goodwe_battery_soc` | `sensor.goodwe_battery_state_of_charge` | SOC di riserva |
| `goodwe_battery_curr` | `sensor.goodwe_battery_current` | Corrente di riserva |
| `invert_battery_power` | `false` | Inverte il segno — attivalo se positivo = scarica |

### Batteria secondaria

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_battery2` | `false` | Attiva la batteria secondaria |
| `battery2_soc` | `''` | SOC (%) |
| `battery2_power` | `''` | Potenza (W) |
| `battery2_current` | `''` | Corrente (A) |
| `battery2_voltage` | `''` | Tensione (V) |
| `battery2_mos` | `''` | Temperatura del BMS |
| `battery2_full_ah` | `0` | Capacità (Ah), se diversa dalla batteria 1 |
| `battery2_full_wh` | `0` | Capacità (kWh), se diversa dalla batteria 1 |

### Auto elettrica / Wallbox

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_show_ev` | `false` | Attiva la sezione auto elettrica |
| `charger_state` | `''` | Stato della wallbox (testo: `charging`, `completed`, ecc.) |
| `charger_power` | `''` | Potenza della wallbox (W) |
| `charger_current` | `''` | Corrente della wallbox (A) |
| `charger_soc` | `''` | SOC della batteria dell'auto (%) |
| `charger_eta` | `''` | Minuti alla carica completa — facoltativo |
| `charger_battery_capacity_wh` | `''` | Capacità della batteria dell'auto (Wh) |

### Etichette

| Chiave | Predefinito | Descrizione |
|---|---|---|
| `_labels_custom_entities` | `false` | Attiva la sezione Etichette |
| `label_cell_temp_minmax` | `TEMP CELLE MIN/MAX` | Etichetta del riquadro temperatura celle |
| `label_bms_temp` | `TEMP BMS` | Etichetta del riquadro temperatura BMS |
| `label_min_cell` | `Cella Min` | Etichetta del riquadro tensione cella minima |
| `label_max_cell` | `Cella Max` | Etichetta del riquadro tensione cella massima |
| `label_batt_dis` | `Scarica Batt.` | Etichetta del riquadro scarica batteria |
| `label_total_pv_gen` | `PRODUZIONE FV TOT.` | Etichetta del riquadro produzione FV totale |
| `label_endurance` | `AUTONOMIA` | Etichetta del riquadro autonomia |
| `label_entity_cell_temp` | `''` | Entità alternativa per il riquadro temperatura celle |
| `label_entity_bms_temp` | `''` | Entità alternativa per il riquadro temperatura BMS |
| `label_entity_min_cell` | `''` | Entità alternativa per il riquadro cella minima |
| `label_entity_max_cell` | `''` | Entità alternativa per il riquadro cella massima |
| `label_entity_batt_dis` | `''` | Entità alternativa per il riquadro scarica batteria |

> **Regola per le entità alternative:** nella sezione Etichette, la scelta dell'entità si sblocca solo dopo aver cambiato il testo dell'etichetta rispetto a quello predefinito. Da quel momento il sensore corrispondente nella sezione Batteria viene bloccato con la scritta "Sostituito dalla sezione Etichette", per evitare duplicati.

> **Se aggiorni da k-flow-card:** le etichette predefinite ora sono in italiano. Se nella tua configurazione sono salvate quelle inglesi (es. `CELL TEMP MIN/MAX`), la card le considera personalizzate. Cancellale dal YAML per tornare a quelle predefinite.

---

## Sezioni dell'editor visuale

| Sezione | Interruttore | Contenuto |
|---|---|---|
| Generale | — | Nome inverter, capacità batteria (Ah/kWh), potenze massime |
| Layout e intestazione | — | Titolo, stato rete, modalità EMS, immagine inverter, opzioni stile Sigenergy |
| Etichette | `＋ Attiva` | Rinomina i riquadri; entità alternative riga per riga |
| Fotovoltaico | — | Entità FV1, FV2 |
| Stringhe FV aggiuntive | `＋ Attiva` | FV3, FV4 |
| Altri dati fotovoltaico | — | Totali, temperatura inverter, dati di oggi, consumo casa |
| Rete | — | Potenza rete, prelievo e immissione |
| Batteria principale | `＋ Attiva` | Tutti i dati del BMS |
| Batteria secondaria | `＋ Attiva` | Secondo pacco batterie |
| Auto elettrica / Wallbox | `＋ Attiva` | Stato wallbox, SOC, tempo alla carica completa |

---

## Logica dei colori

| Valore | Soglie |
|---|---|
| **SOC** | ≤25% rosso · ≤50% arancione · ≤75% blu · >75% verde |
| **Temperatura celle** | ≤15°C blu · ≤35°C verde · ≤45°C arancione · >45°C rosso |
| **Tensione celle** | <3,0 V rosso · <3,1 V arancione · <3,4 V giallo · ≤3,65 V verde · >3,65 V rosso |
| **Temperatura inverter / ambiente** | ≤25°C verde · ≤45°C arancione · >45°C rosso |

---

## Registro delle modifiche

### v1.4.0
- Nuovo **grafico dei consumi** delle ultime 24 ore (regolabile fino a 72), ad aree colorate per utilizzatore, con linea del totale casa, dettaglio al tocco e kWh per utilizzatore.
- Nuovo **traliccio della rete** luminoso in SVG che cambia colore con prelievo e immissione; l'immagine vecchia resta disponibile.
- **Ventilazione inverter** ridisegnata: più compatta, nello stile della card, con i livelli termici idle → critical.

### v1.3.0
- Nuova sezione **Utilizzatori** con icone, colori e dischi stile contatore Ferraris.
- Nuova sezione **Ventilazione inverter** con stato, temperature, PWM, rpm e ventole animate.
- Nuova batteria a segmenti; quella classica resta disponibile (`battery_style: classic`).
- La casa non è più tagliata dalla barra FV/POT; badge e alone della batteria non sono più tagliati a sinistra.
- Versione mostrata nella console del browser; release GitHub create automaticamente per gli aggiornamenti HACS.

### v1.2.0 (f-flow-card)
- Progetto rinominato in **f-flow-card** (`type: custom:f-flow-card`).
- Interfaccia della card ed editor visuale tradotti in italiano; orari nel formato 24 ore.
- Layout in stile Sigenergy, tutto facoltativo: titolo personalizzato, indicatore IN RETE / FUORI RETE, modalità EMS, immagine dell'inverter, barra fonti energia, pannello autonomia, 6 riquadri giornalieri, possibilità di nascondere i riquadri JK BMS.
- Lo stato della batteria (CARICA / SCARICA / RIPOSO) ora compare sotto l'icona della batteria.
- Le righe FV1 / FV2 spariscono se le entità non sono configurate.

### Versioni precedenti (k-flow-card originale)

Le versioni seguenti appartengono al progetto originale; la loro numerazione interna (v4–v7) è precedente all'attuale numerazione 1.x.

#### v7.4.0
- **Sezione Etichette con interruttore nell'intestazione**, come per batteria secondaria, FV aggiuntivo e auto elettrica. Il contenuto è nascosto quando è disattivata.
- **Sblocco riga per riga:** la scelta dell'entità di ogni riga si attiva solo quando il testo di quella riga è diverso da quello predefinito.
- **Blocco riga per riga** dei sensori corrispondenti nelle sezioni Batteria e Altri dati fotovoltaico.
- `_updateDynamic` riorganizzato con gli helper `_rowActive`, `_readNum`, `_readStr`.
- L'editor si aggiorna subito quando cambi una delle 6 etichette.

#### v7.3.0
- Editor delle etichette ridotto alle 6 righe corrispondenti alla griglia 2×3 dei riquadri.
- La tensione della batteria non viene mai bloccata.
- Con un'entità alternativa, il riquadro temperatura celle mostra un solo valore.
- Riquadro autonomia a tutta larghezza, compatto in altezza.
- Rimosse chiavi di configurazione inutilizzate.

#### v7.2.x
- Riquadro autonomia ridisegnato su una sola riga.
- Introdotta la sezione Etichette, con 6 riquadri personalizzabili e il velo di blocco sui sensori della batteria.

#### v7.1.x
- Supporto per la **doppia batteria**, con SOC, potenza, corrente, tensione e temperatura BMS indipendenti.
- Corrente e potenza della batteria spostate fuori dall'icona.

#### v7.0.x
- Aggiunto il nodo **auto elettrica / wallbox** con percorso animato, SOC e tempo alla carica completa.
- Stati della wallbox: `charging`, `completed`, `finished`, `disconnected`.

#### v6.x
- Stringhe FV3 e FV4 riunite sotto un unico interruttore.
- Aggiunti i limiti di sistema (capacità batteria, potenza max inverter e FV), poi spostati nella sezione Generale.

#### v5.x
- Introdotto l'arco del sole, che segue l'elevazione reale di `sun.sun`.
- Percorsi animati al posto delle linee dritte; layout con inverter al centro, batteria a sinistra, rete a destra e casa in basso.
- Parte statica costruita una sola volta in `_buildStaticSVG()`, aggiornamenti in `_updateDynamic()`.

#### v4.x e precedenti
- Struttura iniziale della card con GoodWe e JK BMS, editor visuale e colori per SOC, temperature e tensioni.
- Primo calcolo dell'autonomia.

---

## Struttura del file

```
f-flow-card.js
│
├── class FFlowCardEditor   (editor visuale)
│   ├── _render()           costruisce le sezioni dell'editor
│   ├── makeSection()       sezione richiudibile con interruttore facoltativo
│   ├── picker()            scelta di un'entità (ha-selector)
│   ├── textField()         campo di testo
│   ├── numberField()       campo numerico
│   ├── switchRow()         interruttore (per esempio per invertire i segni)
│   ├── labelRow()          campo etichetta + scelta entità che si sblocca
│   └── pickerMaybeDisabled() scelta entità con velo di blocco
│
└── class FFlowCard         (card principale, shadow DOM)
    ├── setConfig()         unisce la configurazione ai valori predefiniti e costruisce la parte statica
    ├── _buildStaticSVG()   disegna l'SVG e il pannello HTML (una volta per configurazione)
    ├── _updateDynamic()    aggiorna valori, colori e animazioni a ogni aggiornamento di hass
    ├── _val()              lettura sicura di un valore numerico
    ├── _strVal()           lettura sicura di un valore testuale
    ├── _socColor()         SOC → colore
    ├── _cellTempColor()    temperatura → colore
    ├── _cellVoltColor()    tensione cella → colore
    ├── _tempColor()        temperatura generica → colore
    ├── _remCapColor()      capacità residua → colore
    └── _fmtTill()          ore → "Fino a lun 18:30"
```

---

## Note

- Il progetto originale è stato provato su Home Assistant OS con l'integrazione GoodWe ET/ES e il BMS JK via Bluetooth.
- La card usa lo shadow DOM: il CSS dei temi non la modifica. I colori sono fissi o dipendono dai valori delle entità.
- Le chiavi che iniziano con `_` (es. `_show_battery`) sono interruttori dell'editor: controllano cosa si vede, ma vengono salvate nel YAML della card.
- I commenti nel codice sono rimasti in inglese.

---

## Risoluzione dei problemi

### La card non compare / "Custom element doesn't exist"

- Controlla che la risorsa sia registrata in **Impostazioni → Plance → Risorse**. Deve esserci `/hacsfiles/f-flow-card/f-flow-card.js` (HACS) oppure `/local/community/f-flow-card/f-flow-card.js` (manuale), di tipo `Modulo JavaScript`.
- Ricarica il browser forzando l'aggiornamento: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac).
- Nell'app per telefono svuota la cache, oppure chiudi l'app e riaprila.
- Se aggiorni da k-flow-card, cambia `type: custom:k-flow-card` in `type: custom:f-flow-card`.

---

### L'editor visuale è vuoto o non si carica

- Apri gli strumenti per sviluppatori del browser (`F12`) → scheda Console, e cerca errori in rosso che citano `f-flow-card`.
- Controlla che non ci siano risorse duplicate di `f-flow-card.js` in Risorse.

---

### Le entità mostrano `--` o non si aggiornano

- In **Strumenti per sviluppatori → Stati** controlla che l'entità esista e abbia un valore numerico valido (non `unavailable` o `unknown`).
- Gli ID delle entità distinguono maiuscole e minuscole: controlla che non ci siano errori di battitura.
- La card ignora di proposito gli stati `unavailable` e `unknown`: il riquadro mostra `--` finché l'entità non torna valida.

---

### Le animazioni dei flussi non si vedono

- Per l'arco del sole serve l'entità `sun.sun`. Se manca, il sole non si muove ma il resto della card funziona.
- Un percorso si anima solo quando la potenza corrispondente è maggiore di zero.
- Se tutti i flussi sono fermi, controlla che le entità dell'inverter restituiscano valori aggiornati.

---

### Le icone di rete, casa o auto non si vedono

- La card cerca le icone in `/local/community/f-flow-card/`. Con HACS è automatico; con l'installazione manuale copia le tre PNG in `/config/www/community/f-flow-card/`.

---

### Manca la sezione batteria

- La batteria principale richiede `_show_battery: true`. Nell'editor premi **＋ Attiva** accanto a **Batteria principale**.
- Batteria secondaria, auto elettrica, stringhe FV aggiuntive ed etichette hanno ciascuna il proprio **＋ Attiva** e sono nascoste di default.

---

### Il riquadro autonomia mostra `--` o un tempo sbagliato

- Per il calcolo serve la capacità della batteria (sezione **Generale**, in Ah o in kWh) e un sensore di potenza della batteria valido.
- Se la batteria non si sta né caricando né scaricando, il riquadro mostra `--` perché non è possibile fare una stima.
- In modalità Ah serve anche la tensione della batteria.

---

### Nella sezione Etichette la scelta delle entità è grigia

- Prima attiva la sezione Etichette con **＋ Attiva** nell'intestazione.
- Poi ogni scelta di entità si sblocca **solo dopo aver cambiato il testo dell'etichetta** di quella riga. Per esempio, per sbloccare la temperatura celle cambia `TEMP CELLE MIN/MAX` in qualsiasi altro testo.

---

### Dopo un aggiornamento con HACS la card è rovinata

1. Ricarica il browser forzando l'aggiornamento (`Ctrl + Shift + R`).
2. Se non basta, in **Impostazioni → Plance → Risorse** elimina la voce di f-flow-card e riavvia Home Assistant: HACS la registrerà di nuovo.
3. Ricarica di nuovo il browser.

---

### Segnalare un problema

Apri una issue su [GitHub](https://github.com/fabiustek/f-flow-card/issues) e includi:
- versione di Home Assistant
- versione di f-flow-card
- eventuali errori nella console del browser (screenshot o testo)
- la parte rilevante del YAML della card

---

*f-flow-card · fork di k-flow-card (Khan Automation) · Ultimo aggiornamento: v1.4.0*
