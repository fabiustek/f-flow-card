// f-flow-card.js – Unified Edition v1.10.1
const FFC_VERSION = '1.10.1';
// Changes v1.10.1:
//   FIX  – Section title no longer reads "Inverter Inverter" when the inverter name already says Inverter.
//   FIX  – Classic house: FV1–FV4 labels moved below the autonomy panel (they overlapped "Energia residua").
//   FIX  – JK BMS tiles show "--" instead of 0.0 °C / 0.000 V when their sensors are missing.
// Changes v1.10.0:
//   NEW  – sections_order: the sections below the flow (JK BMS stats, Inverter, Consumers,
//           Ventilation, Statistics, Camera) can be reordered from the editor with ▲ ▼.
//   NEW  – ptz_camera: native ONVIF control — the arrows call onvif.ptz (pan/tilt, speed, distance,
//           ContinuousMove) on that camera, no per-arrow entities needed; optional home preset.
// Changes v1.9.1:
//   NEW  – dist/icon.png: card icon installed by HACS (/local/community/f-flow-card/icon.png), usable as
//           entity_picture of the HACS update entity (HACS only shows brand icons for integrations).
// Changes v1.9.0:
//   NEW  – Night sky: twinkling stars and a shooting star between sunset and sunrise.
//   NEW  – weather_entity: animated clouds, rain, downpour, snow, fog, wind and lightning in the
//           sky; stars fade and the sun dims behind clouds.
//   NEW  – Camera section (collapsible): live view through HA's ha-camera-stream (MJPEG proxy or
//           10 s snapshot fallback) with an on-video PTZ pad (up/down/left/right/home entities;
//           tap = one step, hold = repeat).
//   NEW  – Inverter→house flow, house, ring and load value coloured by a weighted mix of the sources
//           feeding the house (solar yellow, battery blue, grid red), e.g. 70 % solar + 30 % grid.
//   CHG  – Roof slopes turn PV-yellow while their strings produce; FV1/FV2 labels moved up, next to
//           their slopes.
// Changes v1.8.0:
//   NEW  – Statistics section (collapsible): today's PV as hourly stacked bars per string with an
//           optional forecast curve (Solcast/Forecast.Solar attributes or the sensor's history),
//           house load over 24 h coloured by power with the peak marked, battery charge/discharge
//           power and SOC over 24 h. Tooltips on tap/hover.
//   NEW  – pv1_name…pv4_name: string names on the house and in the statistics.
//   CHG  – Thinner flow lines (like the sun → inverter wave); battery flow always battery blue.
// Changes v1.7.1:
//   CHG  – Flows back to dashed lines (instead of round particles), keeping the smooth curves and glow.
// Changes v1.7.0:
//   NEW  – battery_reserve_soc / battery_target_soc: autonomy down to a reserve SOC and charge
//           time up to a target SOC; the panel label switches AUTONOMIA ↔ TEMPO ALLA RICARICA.
//   CHG  – Flows redrawn as smooth S-curves with glowing round particles (battery, grid, load, EV).
//   FIX  – Battery sheen runs upward while charging and downward while discharging (two fixed
//           SMIL animations toggled instead of mutating from/to at runtime).
//   CHG  – Wallbox and car smaller, moved away from FV2, info right above the car.
//   NEW  – FV3 / FV4 shown beside the house under FV1 / FV2; each slope glows with its strings.
//   NEW  – Ring under the house spins with the house load.
//   FIX  – Autonomy panel and battery badge left-aligned.
//   FIX  – Sun→inverter wave and PV blocks were blank after a config change until PV changed.
// Changes v1.6.0:
//   FIX  – EV / wallbox: values were shown only with a charger_state of "charging"/"completed";
//           now power, SOC and current are always shown and, without a state entity, charging is
//           inferred from the power (> 50 W). More state words recognised (connected, paused…).
//   NEW  – EV drawn in SVG (wallbox + car, neon style) to the right of the house, inside the card,
//           coloured by state, with house→wallbox flow, animated cable and car SOC bar.
//   CHG  – Larger fonts everywhere (SVG labels and HTML tiles) for readability on phones.
//   FIX  – Entity pickers in the editor no longer show the "required" asterisk.
//   NEW  – Collapsible Inverter / Consumers / Ventilation sections with a one-line summary and a
//           📌 pin (per browser, localStorage): pinned = open on load, unpinned = closed on load.
//   NEW  – Chart period buttons 1h · 4h · 8h · 12h · 24h (remembered per browser; finer buckets
//           for short periods) and consumers_chart_legend to hide the legend.
// Changes v1.5.0:
//   NEW  – On-grid / off-grid switching from the card: hold the grid pill or the tower, confirm,
//           and the card turns on grid_switch_to_off / grid_switch_to_on (switch, button, script…).
//           Pill shows "COMMUTAZIONE…" until the status entity changes; tower greys out off grid.
//   NEW  – Two-slope house drawn in SVG: FV1 panels on the left slope, FV2 on the right, each
//           glowing with its own production, values beside their slope; load value under the house.
//           The PNG house stays available with home_icon_style: classic.
// Changes v1.4.0:
//   NEW  – Consumption chart under the consumers: stacked areas per consumer over the last
//           24 h (configurable) from HA history, dashed house-total line, tooltip, kWh legend.
//   NEW  – Futuristic neon grid tower drawn in SVG (red import / green export / grey idle);
//           the PNG one stays available with grid_icon_style: classic.
//   CHG  – Ventilation section redesigned: compact, card-consistent, with the thermal levels
//           idle / cool / low / medium / high / very high / critical (colour, text, pulse, speed).
// Changes v1.3.0:
//   NEW  – Consumers section (Utilizzatori): any number of appliances with mdi icon, colour and
//           a Ferraris-style meter disc whose speed follows the measured power.
//   NEW  – Inverter ventilation section: state, status text, ambient/INV/DC temps, PWM,
//           average RPM and any number of fans; fan icons spin with their RPM.
//   NEW  – Modern segmented battery icon (single battery); classic one via battery_style: classic.
//   FIX  – House icon no longer clipped by the FV/POT bar (taller viewBox).
//   FIX  – Battery badge and battery glow no longer clipped on the left (left margin in viewBox).
//   NEW  – Version banner in the browser console; GitHub release created automatically per version.
// Changes v1.2.0 (Sigenergy-style layout options — all opt-in, default look unchanged):
//   NEW  – card_title: custom header title (default 'Energy Flow').
//   NEW  – grid_status_entity: ON GRID / OFF GRID pill in the header.
//   NEW  – ems_mode_entity: EMS mode chip under the header (e.g. "Self Consumption").
//   NEW  – Battery status badge (CHG / DISCHG / IDLE) under the battery icon.
//   NEW  – inverter_image: show an inverter picture instead of the drawn INV box.
//   NEW  – _show_energy_supply: stacked "Energy Supply" bar (Solar / Chg / Dis / Grid).
//   NEW  – _show_backup_panel: Backup Time + Remaining kWh panel in the flow area.
//   NEW  – _show_battery_stats: hide the JK BMS stat tiles (cell temp, cells, endurance).
//   NEW  – _daily_tiles_extended: 6 daily tiles (PV, Batt Chg, Batt Dis, Grid Imp, Grid Exp, Load).
//   NEW  – PV1/PV2 labels hidden when their entities are not configured.
//   NEW  – Card renamed to f-flow-card; whole UI and visual editor translated to Italian
//           (24 h clock, Italian weekday names). Code comments remain in English.
// Changes v1.1.0 (full audit pass):
//   FIX  – 8-digit hex #f39c4bff in svgPulseOrange → 6-digit #f5b06a.
//   FIX  – Grid idle color #3a3a3a (invisible on dark bg) → #8b949e.
//   FIX  – Duplicate label_total_pv_gen textField + total_pv_gen_entity picker removed from
//           solar_extras editor section (kept only in Labels section where they belong).
//   FIX  – Battery bolt opacity: always-true compound `battPwr > 10 && absPwr >= 10` → `battPwr > 10`.
//           Applied to both dual-battery bolts and single-battery bolt.
//   FIX  – flowBattIn/flowBattOut SVG dash animations were directionally swapped.
//           Charging (BattIn) must flow inverter→battery = right-to-left on path M59→205 = from=0 to=-24.
//           Discharging (BattOut) must flow battery→inverter = left-to-right = from=-24 to=0.
//   FIX  – Dual-battery totalRemAh: battery2 was always using battery1's fullAh.
//           Now uses battery2_full_ah (defaults to fullAh when not set).
//           Added battery2_full_ah field to editor Battery 2 section and stub config.
//   FIX  – _readNum() no longer accepts or uses a fallback value. Returns null when entity is
//           unavailable/unknown/missing. All 5 tile render blocks now show '--' instead of
//           silently falling back to the native battery sensor value.
//   FIX  – Remaining tile: shows ONLY Ah (integer, 3 chars) in Ah mode, ONLY kWh (2 dp) in kWh mode.
//           Previously both lines always showed regardless of configured unit.
//   FIX  – total_pv_gen tile: attributes now uses optional chain (?.); toFixed(2) for kWh values;
//           unavailable/unknown state now shows '--' not a stale number.
//   FIX  – Grid import/export display now prefixed with ▼/▲ direction arrows.
//   PROPOSAL – fullWh in Ah-mode still uses live voltage (_voltForCap). For endurance math this is
//           acceptable (endurance needs actual Wh at current voltage). Consider adding a nominal
//           voltage config field in a future version to fully decouple from live sensor.
//   - BUG: fullWh Ah-mode fallback was reading this.config.battery_voltage (an entity ID string)
//     instead of the live battVolt1 sensor value. Fixed to use _voltForCap = _n(this._val(...)).
//   - BUG: remColor used remCap1/(fullAh||1) which is always 0 in kWh mode → always red.
//     Fixed to use battSoc1 directly (0-100 %, works in both modes).
//   - BUG: _set() did not include label_entity_* keys in re-render trigger list, so the
//     state-preview badge in label rows never appeared after picking an entity. Fixed.
//   - WARNING: battery_full_wh numberField label was 'Battery Capacity (kWh)' AND unit arg
//     was 'kWh' → UI showed 'Battery Capacity (kWh)  (kWh)'. Fixed label to 'Battery Capacity'.
//   - WARNING: capGroupWrap had class='row' causing nested .row double-margin in editor. Removed.
//   - WARNING: General section defaulted to closed; important battery capacity fields hidden on
//     first open. General now defaults to open.
//   - WARNING: battery_full_wh and battery2_full_wh max raised from 500→9999 kWh.
//   - WARNING: toMin/toMin2 arrow param renamed from 's' (shadowed attrs) to 'ts'.
//   - WARNING: _fmtEndurance used h<=0 guard; a just-full battery (endHours=0) showed '--'.
//     Changed to h<0 so '0h 00m' shows correctly.
//   - STYLE: EV else-block indentation fixed for consistency.
// Changes v1.0.3:
//   - Editor restructured: General section now includes battery capacity (Ah/kWh radio toggle),
//     PV max power, and Inverter max power. System Limits section removed.
//   - Battery capacity: radio button selects Ah or kWh mode (battery_cap_unit).
//     default 0 for both fields; endurance math picks correct field based on unit selection.
//   - Labels section: entity pickers now show a state-text preview when an entity IS selected
//     (e.g. "charging", "on grid backup mode") so user knows what value the tile will show.
//   - Labels locking: ONLY rows where BOTH text AND entity are edited get locked in Battery section.
//     Rows where only label text changed (entity still empty) do NOT lock the Battery pickers.
//   - Sun alignment: nearestTime() now uses UTC-aware parsing; corrected the >18h flip logic.
//   - Moon: tMoon calculation made more robust (guards for SET > RISE wrap-around at midnight).
// Changes v1.0.2:
//   - Sun position: replaced azimuth-based t (wrong at non-equatorial locations) with
//     time-based t using today's actual rise/set, derived by correcting next_rising/
//     next_setting when they refer to tomorrow (>18 h away).
//   - Moon position: independent tMoon computed from elapsed night time — fixes the
//     broken (1-t) formula that was wrong when t was re-mapped for night azimuth.
//   - _val(): now accepts toWatts=true — auto-converts kW sensors to W. Applied to
//     all power entity reads (PV strings, pv_total, grid, load, battery, charger).
//   - _readNum(): guards unavailable/unknown state (was only checking !s).
//   - _fmtEndurance(): minutes now uses Math.floor to prevent showing 60m.
//   - gridImg glow: fixed filter condition to use Math.abs(gridActive) so grid export
//     also triggers the glow (was only triggering on import).
// Changes v1.0.1:
//   - Labels section: switchRow replaced by header chip (+ Enable / ✓ Enabled style).
//   - Per-row auto-enable: each entity picker unlocks only when its label text ≠ default.
//   - Corresponding Battery/Solar pickers lock per-row (not globally).
//   - _updateDynamic: clean _rowActive + _readNum/_readStr helpers.
//   - _set: re-renders on any of the 6 label text key changes.

// ═══════════════════════════════════════════════════════════════
// VISUAL EDITOR
// ═══════════════════════════════════════════════════════════════
class FFlowCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this._attached = false;
    this._rendered = false;
    this._ownChange = false;
  }

  connectedCallback() {
    this._attached = true;
    this._render();
  }

  setConfig(config) {
    this._config = { ...config };
    if (this._ownChange) return;
    if (this._attached) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered && this._attached) {
      this._render();
    } else {
      this.querySelectorAll('ha-selector').forEach(el => { el.hass = hass; });
    }
  }

  _fireChanged() {
    this._ownChange = true;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    }));
    Promise.resolve().then(() => { this._ownChange = false; });
  }

  _set(key, value) {
    if (key === 'battery_style_classic') { key = 'battery_style'; value = value ? 'classic' : 'modern'; }
    if (key === 'grid_icon_classic') { key = 'grid_icon_style'; value = value ? 'classic' : 'modern'; }
    if (key === 'home_icon_classic') { key = 'home_icon_style'; value = value ? 'classic' : 'modern'; }
    if (key === 'camera_snapshot') { key = 'camera_mode'; value = value ? 'snapshot' : 'live'; }
    if (this._config[key] === value) return;
    this._config = { ...this._config, [key]: value };
    this._fireChanged();
    if (key === '_show_battery' || key === '_show_battery2' || key === '_show_pv_extra' ||
        key === '_show_ev'      || key === 'battery_cap_unit' ||
        key === '_show_consumers' || key === '_show_ventilation' || key === '_show_stats' || key === '_show_camera' || key === '_labels_custom_entities' ||
        key === 'label_cell_temp_minmax' || key === 'label_bms_temp'         ||
        key === 'label_min_cell'         || key === 'label_max_cell'         ||
        key === 'label_batt_dis'         || key === 'label_total_pv_gen'     ||
        key === 'label_entity_cell_temp' || key === 'label_entity_bms_temp'  ||
        key === 'label_entity_min_cell'  || key === 'label_entity_max_cell'  ||
        key === 'label_entity_batt_dis'  || key === 'total_pv_gen_entity')
      this._render();
  }

  _render() {
    if (!this._hass) return;
    if (!this._sectionOpen) this._sectionOpen = {};
    const cfg = this._config;
    const showBatt1 = !!(cfg._show_battery !== false);
    const showBatt2 = !!(cfg._show_battery2);
    const showPVExtra = !!(cfg._show_pv_extra);
    const showEV = !!(cfg._show_ev);
    const capUnit = cfg.battery_cap_unit || 'ah'; // 'ah' or 'kwh'

    const style = `
      <style>
        :host { display: block; font-family: var(--paper-font-body1_-_font-family, inherit); }
        .section {
          margin-bottom: 16px;
          border: 1px solid var(--divider-color, rgba(0,0,0,.12));
          border-radius: 10px;
          overflow: hidden;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--secondary-background-color, rgba(0,0,0,.04));
          font-size: .82rem;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
          cursor: default;
        }
        .section-header.toggleable { cursor: pointer; user-select: none; }
        .section-header .toggle-chip {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .3px;
          text-transform: none;
          padding: 2px 10px 2px 6px;
          border-radius: 20px;
          background: var(--card-background-color, #fff);
          border: 1px solid var(--divider-color, rgba(0,0,0,.15));
          color: var(--primary-text-color);
          transition: background .15s;
        }
        .section-header .toggle-chip.on {
          background: var(--primary-color, #03a9f4);
          border-color: var(--primary-color, #03a9f4);
          color: #fff;
        }
        .section-body { padding: 12px 14px 4px; }
        .row {
          display: block;
          margin-bottom: 6px;
        }
        .row-label {
          display: block;
          font-size: .78rem;
          font-weight: 500;
          color: var(--primary-text-color);
          margin-bottom: 3px;
          padding-left: 2px;
          line-height: 1.3;
        }
        .row-label small {
          display: inline;
          font-size: .68rem;
          color: var(--secondary-text-color);
          margin-left: 5px;
        }
        .row-input { display: block; width: 100%; }
        ha-selector, ha-textfield { width: 100%; display: block; }
        ha-textfield { --mdc-shape-small: 6px; }
        .divider { height: 1px; background: var(--divider-color, rgba(0,0,0,.08)); margin: 4px 0 14px; }
      </style>
    `;

    const shell = document.createElement('div');
    shell.innerHTML = style;

    const makeSection = (sectionId, icon, title, rows, opts = {}) => {
      if (this._sectionOpen[sectionId] === undefined) this._sectionOpen[sectionId] = (sectionId === 'general');
      const isOpen = this._sectionOpen[sectionId];
      const sec = document.createElement('div');
      sec.className = 'section';
      const hdr = document.createElement('div');
      hdr.className = 'section-header toggleable';
      // Chevron — styled as a small disclosure button
      const chevron = document.createElement('span');
      chevron.textContent = isOpen ? '▼' : '▶';
      chevron.style.cssText = [
        'display:inline-flex',
        'align-items:center',
        'justify-content:center',
        'width:20px',
        'height:20px',
        'min-width:20px',
        'border-radius:5px',
        'background:var(--secondary-background-color,rgba(255,255,255,.07))',
        'border:1px solid var(--divider-color,rgba(255,255,255,.15))',
        'font-size:.7rem',
        'line-height:1',
        `color:${isOpen ? 'var(--primary-color,#03a9f4)' : 'var(--secondary-text-color,#aaa)'}`,
        'flex-shrink:0',
        'transition:color .15s,background .15s',
        'cursor:pointer',
        'user-select:none',
      ].join(';');
      hdr.appendChild(chevron);
      const titleSpan = document.createElement('span');
      titleSpan.textContent = `${icon} ${title}`;
      hdr.appendChild(titleSpan);
      // Click anywhere on header (except toggle-chip) to collapse/expand
      hdr.addEventListener('click', () => {
        this._sectionOpen[sectionId] = !this._sectionOpen[sectionId];
        this._render();
      });
      if (opts.toggleKey) {
        const chip = document.createElement('span');
        chip.className = 'toggle-chip' + (opts.toggleOn ? ' on' : '');
        chip.innerHTML = opts.toggleOn ? `✓ Attivo` : `＋ Attiva`;
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          this._set(opts.toggleKey, !opts.toggleOn);
        });
        hdr.appendChild(chip);
      }
      sec.appendChild(hdr);
      // Body visible when section is open AND content not suppressed by toggle
      const bodyVisible = isOpen && !opts.hidden;
      if (bodyVisible) {
        const body = document.createElement('div');
        body.className = 'section-body';
        rows.forEach(r => body.appendChild(r));
        sec.appendChild(body);
      }
      return sec;
    };

    const picker = (key, label, optional = false) => {
      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.style.marginBottom = '14px';
      const lbl = document.createElement('div');
      lbl.className = 'row-label';
      lbl.textContent = label;
      if (optional) {
        const sm = document.createElement('small');
        sm.textContent = 'facoltativo';
        lbl.appendChild(sm);
      }
      const inputWrap = document.createElement('div');
      inputWrap.className = 'row-input';
      const sel = document.createElement('ha-selector');
      sel.hass = this._hass;
      sel.selector = { entity: {} };
      sel.required = false;
      sel.value = cfg[key] || '';
      sel._configKey = key;
      sel.addEventListener('value-changed', (ev) => {
        ev.stopPropagation();
        this._set(key, ev.detail.value || '');
      });
      inputWrap.appendChild(sel);
      wrap.appendChild(lbl);
      wrap.appendChild(inputWrap);
      return wrap;
    };

    // Text field — native input, commits on blur/Enter only.
    // ha-selector(text) fires value-changed per keystroke → triggers setConfig → _render → destroys field.
    const textField = (key, label, placeholder = '') => {
      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.style.marginBottom = '14px';
      const fieldBox = document.createElement('div');
      fieldBox.style.cssText = `
        display:block; position:relative;
        border:1px solid var(--divider-color, rgba(0,0,0,.42));
        border-radius:4px;
        padding:6px 12px 6px;
        background:var(--input-fill-color, var(--secondary-background-color, rgba(0,0,0,.04)));
        box-sizing:border-box; width:100%;
        transition: border-color .15s;
      `;
      fieldBox.addEventListener('focusin',  () => { fieldBox.style.borderColor = 'var(--primary-color, #03a9f4)'; });
      fieldBox.addEventListener('focusout', () => { fieldBox.style.borderColor = 'var(--divider-color, rgba(0,0,0,.42))'; });
      const lbl = document.createElement('div');
      lbl.textContent = label;
      lbl.style.cssText = `font-size:.72rem; color:var(--secondary-text-color); margin-bottom:2px; line-height:1;`;
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = placeholder;
      input.value = cfg[key] !== undefined ? String(cfg[key]) : '';
      input.style.cssText = `
        display:block; width:100%; border:none; outline:none;
        background:transparent; color:var(--primary-text-color);
        font-size:.95rem; font-family:inherit; padding:0; box-sizing:border-box;
      `;
      // Commit ONLY on blur or Enter — prevents per-keystroke re-render
      const commit = (ev) => this._set(key, ev.target.value);
      input.addEventListener('change', commit);
      input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.target.blur(); });
      fieldBox.appendChild(lbl);
      fieldBox.appendChild(input);
      wrap.appendChild(fieldBox);
      return wrap;
    };

    // Number field — native input, commits on blur/Enter only (same reason as textField).
    const numberField = (key, label, min, max, step, unit = '') => {
      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.style.marginBottom = '14px';
      const fieldBox = document.createElement('div');
      fieldBox.style.cssText = `
        display:block; position:relative;
        border:1px solid var(--divider-color, rgba(0,0,0,.42));
        border-radius:4px;
        padding:6px 12px 6px;
        background:var(--input-fill-color, var(--secondary-background-color, rgba(0,0,0,.04)));
        box-sizing:border-box; width:100%;
        transition: border-color .15s;
      `;
      fieldBox.addEventListener('focusin',  () => { fieldBox.style.borderColor = 'var(--primary-color, #03a9f4)'; });
      fieldBox.addEventListener('focusout', () => { fieldBox.style.borderColor = 'var(--divider-color, rgba(0,0,0,.42))'; });
      const lbl = document.createElement('div');
      lbl.textContent = unit ? `${label}  (${unit})` : label;
      lbl.style.cssText = `font-size:.72rem; color:var(--secondary-text-color); margin-bottom:2px; line-height:1;`;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = String(min); input.max = String(max); input.step = String(step);
      input.value = cfg[key] !== undefined && cfg[key] !== '' ? String(cfg[key]) : '';
      input.style.cssText = `
        display:block; width:100%; border:none; outline:none;
        background:transparent; color:var(--primary-text-color);
        font-size:.95rem; font-family:inherit; padding:0; box-sizing:border-box;
      `;
      // Commit ONLY on blur or Enter — prevents per-keystroke re-render
      const commit = (ev) => {
        let v = parseFloat(ev.target.value);
        if (isNaN(v)) return;
        // Hard-clamp to declared range — browser max attr is advisory only
        v = Math.min(max, Math.max(min, v));
        // Round to step precision to avoid float noise
        if (step >= 1) v = Math.round(v);
        ev.target.value = String(v); // reflect clamped value back into field
        this._set(key, v);
      };
      // oninput: truncate while typing so user can't exceed max digit count
      input.addEventListener('input', () => {
        const raw = input.value.replace(/[^0-9.]/g, '');
        const v = parseFloat(raw);
        if (!isNaN(v) && v > max) input.value = String(max);
      });
      input.addEventListener('change', commit);
      input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.target.blur(); });
      fieldBox.appendChild(lbl);
      fieldBox.appendChild(input);
      wrap.appendChild(fieldBox);
      return wrap;
    };


    // Native CSS pill toggle
    const switchRow = (key, labelText, hintText = '', defaultOn = false) => {
      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.style.cssText = 'margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;';
      const left = document.createElement('div');
      left.style.flex = '1';
      const lbl = document.createElement('div');
      lbl.className = 'row-label';
      lbl.style.marginBottom = '2px';
      lbl.textContent = labelText;
      left.appendChild(lbl);
      if (hintText) {
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:.68rem;color:var(--secondary-text-color);line-height:1.4;';
        hint.textContent = hintText;
        left.appendChild(hint);
      }
      const pillLabel = document.createElement('label');
      pillLabel.style.cssText = 'position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0;cursor:pointer;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = key === 'battery_style_classic' ? cfg.battery_style === 'classic'
        : key === 'grid_icon_classic' ? cfg.grid_icon_style === 'classic'
        : key === 'home_icon_classic' ? cfg.home_icon_style === 'classic'
        : key === 'camera_snapshot' ? cfg.camera_mode === 'snapshot'
        : cfg[key] === undefined ? defaultOn : !!cfg[key];
      cb.style.cssText = 'opacity:0;width:0;height:0;position:absolute;';
      const track = document.createElement('span');
      const knob  = document.createElement('span');
      const sync = () => {
        track.style.cssText = 'position:absolute;inset:0;border-radius:11px;transition:background .2s;background:' +
          (cb.checked ? 'var(--primary-color,#03a9f4)' : 'var(--divider-color,rgba(0,0,0,.25))') + ';';
        knob.style.cssText  = 'position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;' +
          'box-shadow:0 1px 3px rgba(0,0,0,.35);transition:left .2s;left:' + (cb.checked ? '21px' : '3px') + ';';
      };
      sync();
      cb.addEventListener('change', () => { sync(); this._set(key, cb.checked); });
      pillLabel.appendChild(cb);
      pillLabel.appendChild(track);
      pillLabel.appendChild(knob);
      wrap.appendChild(left);
      wrap.appendChild(pillLabel);
      return wrap;
    };

    const divider = () => {
      const d = document.createElement('div');
      d.className = 'divider';
      return d;
    };

    // ═══ Build sections ═══

    // ── Battery capacity radio helper ──
    const battCapUnit = cfg.battery_cap_unit || 'ah';
    const battCapRadio = (() => {
      const outer = document.createElement('div');
      // Radio row
      const radioWrap = document.createElement('div');
      radioWrap.style.cssText = 'display:flex;gap:18px;margin-bottom:10px;';
      const rName = 'bcr_' + Math.random().toString(36).slice(2);
      ['ah', 'kwh'].forEach(unit => {
        const lbl = document.createElement('label');
        lbl.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:.82rem;cursor:pointer;color:var(--primary-text-color);';
        const rb = document.createElement('input');
        rb.type = 'radio'; rb.name = rName; rb.value = unit; rb.checked = battCapUnit === unit;
        rb.style.accentColor = 'var(--primary-color,#03a9f4)';
        rb.addEventListener('change', () => { if (rb.checked) this._set('battery_cap_unit', unit); });
        lbl.appendChild(rb);
        lbl.appendChild(document.createTextNode(unit === 'ah' ? 'Ah (ampere-ora)' : 'kWh'));
        radioWrap.appendChild(lbl);
      });
      outer.appendChild(radioWrap);
      // Show the relevant field
      if (battCapUnit === 'ah') {
        outer.appendChild(numberField('battery_full_ah', 'Capacità batteria', 0, 999, 1, 'Ah'));
      } else {
        outer.appendChild(numberField('battery_full_wh', 'Capacità batteria', 0, 999.99, 0.01, 'kWh'));
      }
      return outer;
    })();

    // Capacity group wrapper — plain div, not .row, to avoid nested margin-bottom doubling
    const capGroupWrap = document.createElement('div');
    capGroupWrap.style.marginBottom = '14px';
    const capGroupLbl = document.createElement('div');
    capGroupLbl.className = 'row-label';
    capGroupLbl.textContent = 'Capacità batteria';
    capGroupWrap.appendChild(capGroupLbl);
    capGroupWrap.appendChild(battCapRadio);

    shell.appendChild(makeSection('general', '⚙️', 'Generale', [
      textField('inverter_name', 'Nome inverter', 'es. Il mio inverter'),
      divider(),
      capGroupWrap,
      numberField('battery_reserve_soc', 'SOC minimo per l’autonomia (es. 20: autonomia fino al 20%)', 0, 95, 1, '%'),
      numberField('battery_target_soc', 'SOC obiettivo per il tempo alla ricarica (es. 100)', 5, 100, 1, '%'),
      divider(),
      numberField('pv_max_power',       'Potenza max impianto FV',    0, 30000, 100, 'W'),
      numberField('inverter_max_power', 'Potenza max inverter',    0, 20000, 100, 'W'),
    ]));

    // v1.10.0: order of the sections below the flow, moved with ▲ ▼
    const orderList = (() => {
      const wrap = document.createElement('div');
      wrap.style.marginBottom = '14px';
      const lbl = document.createElement('div');
      lbl.className = 'row-label';
      lbl.textContent = 'Ordine delle sezioni (sotto il disegno dei flussi)';
      wrap.appendChild(lbl);
      const names = Object.fromEntries(FFlowCard.SECTIONS);
      const order = FFlowCard.sectionOrder(cfg);
      order.forEach((k, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:5px 8px;margin-bottom:4px;border:1px solid var(--divider-color,rgba(0,0,0,.12));border-radius:8px;font-size:.82rem;color:var(--primary-text-color);';
        const t = document.createElement('span');
        t.style.flex = '1';
        t.textContent = (i + 1) + '. ' + names[k];
        row.appendChild(t);
        const mk = (label, title, dis, fn) => {
          const b = document.createElement('button');
          b.textContent = label; b.title = title; b.disabled = dis;
          b.style.cssText = 'border:1px solid var(--divider-color,rgba(0,0,0,.2));background:var(--card-background-color,#fff);color:var(--primary-text-color);border-radius:6px;padding:2px 8px;cursor:pointer;font-size:.8rem;opacity:' + (dis ? '.35' : '1');
          b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
          row.appendChild(b);
        };
        const move = (d) => { const a = [...order]; [a[i], a[i + d]] = [a[i + d], a[i]]; this._set('sections_order', a); this._render(); };
        mk('▲', 'Sposta su', i === 0, () => move(-1));
        mk('▼', 'Sposta giù', i === order.length - 1, () => move(1));
        wrap.appendChild(row);
      });
      const hint = document.createElement('div');
      hint.style.cssText = 'font-size:.68rem;color:var(--secondary-text-color);margin-top:2px;';
      hint.textContent = 'Le sezioni non attive non compaiono nella card, ma tengono il loro posto nell’ordine.';
      wrap.appendChild(hint);
      return wrap;
    })();

    shell.appendChild(makeSection('layout', '🎨', 'Layout e intestazione', [
      textField('card_title', 'Titolo della card', 'Flusso Energia'),
      picker('grid_status_entity', 'Stato rete (indicatore IN RETE / FUORI RETE, es. binary_sensor.deye_grid)', true),
      picker('grid_switch_to_off', 'Comando per passare FUORI RETE (es. switch.studio_off_grid)', true),
      picker('grid_switch_to_on',  'Comando per tornare IN RETE (es. switch.studio_on_grid)', true),
      switchRow('grid_switch_confirm', 'Chiedi conferma prima di commutare', 'Tieni premuto l’indicatore o il traliccio per commutare', true),
      picker('ems_mode_entity',    'Modalità EMS / di lavoro (sotto il titolo)', true),
      picker('weather_entity',     'Meteo (animazioni nel cielo: nuvole, pioggia, neve, temporale…)', true),
      textField('inverter_image', 'URL immagine inverter (sostituisce il riquadro INV)', '/local/sigenergy-inverter.png'),
      divider(),
      switchRow('_show_energy_supply',   'Barra fonti energia', 'Barra Solare / Carica / Scarica / Rete a destra'),
      switchRow('_show_backup_panel',    'Pannello autonomia', 'Autonomia e kWh residui nell’area del flusso'),
      switchRow('_daily_tiles_extended', '6 riquadri giornalieri', 'FV, carica, scarica, prelievo, immissione, consumo'),
      switchRow('home_icon_classic', 'Icona casa classica', 'Usa la vecchia immagine invece della casa a due falde con FV1 / FV2'),
      divider(),
      orderList,
      divider(),
      switchRow('grid_icon_classic', 'Icona rete classica', 'Usa la vecchia immagine del traliccio invece di quella luminosa'),
      switchRow('battery_style_classic', 'Batteria stile classico', 'Usa la vecchia icona della batteria invece di quella a segmenti'),
      switchRow('_show_battery_stats',   'Riquadri statistiche batteria', 'Temp. celle, temp. BMS, celle min/max, autonomia (JK BMS)', true),
    ]));

    // ── v1.3.0: generic list editor (consumers, fans) ──
    const listEditor = (listKey, fields, newItem, addLabel) => {
      const outer = document.createElement('div');
      const items = Array.isArray(cfg[listKey]) ? cfg[listKey] : [];
      const commit = (arr, rerender) => { this._set(listKey, arr); if (rerender) this._render(); };
      const cur = () => (Array.isArray(this._config[listKey]) ? this._config[listKey] : []);
      items.forEach((item, idx) => {
        const box = document.createElement('div');
        box.style.cssText = 'border:1px solid var(--divider-color,rgba(0,0,0,.12));border-radius:8px;padding:8px 10px ' + (this._openItems && this._openItems[listKey] === idx ? '0' : '8px') + ';margin-bottom:8px;';
        const head = document.createElement('div');
        head.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:.78rem;font-weight:700;color:var(--primary-text-color);';
        if (!this._openItems) this._openItems = {};
        const isOpen = this._openItems[listKey] === idx;
        const t = document.createElement('span'); t.style.cssText = 'flex:1;cursor:pointer;user-select:none;';
        t.textContent = `${isOpen ? '▾' : '▸'} ${idx + 1}. ${item.name || item.entity || 'Nuovo'}`;
        t.title = isOpen ? 'Chiudi' : 'Modifica';
        t.addEventListener('click', () => { this._openItems[listKey] = isOpen ? -1 : idx; this._render(); });
        head.appendChild(t);
        const btn = (label, title, fn, disabled) => {
          const b = document.createElement('button');
          b.textContent = label; b.title = title; b.disabled = !!disabled;
          b.style.cssText = 'border:1px solid var(--divider-color,rgba(0,0,0,.2));background:var(--card-background-color,#fff);color:var(--primary-text-color);border-radius:6px;padding:2px 8px;cursor:pointer;font-size:.8rem;opacity:' + (disabled ? '.35' : '1');
          b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
          head.appendChild(b);
        };
        btn('▲', 'Sposta su', () => { const a = [...cur()]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; commit(a, true); }, idx === 0);
        btn('▼', 'Sposta giù', () => { const a = [...cur()]; [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]]; commit(a, true); }, idx === items.length - 1);
        btn('✕', 'Rimuovi', () => { commit(cur().filter((_, j) => j !== idx), true); });
        box.appendChild(head);
        if (this._openItems[listKey] !== idx) { head.style.marginBottom = '0'; outer.appendChild(box); return; }
        const upd = (field, v) => { const a = cur().map((x, j) => j === idx ? { ...x, [field]: v } : x); commit(a, false); };
        fields.forEach(f => {
          const row = document.createElement('div');
          row.style.cssText = 'margin-bottom:10px;';
          const lbl = document.createElement('div');
          lbl.className = 'row-label'; lbl.textContent = f.label;
          row.appendChild(lbl);
          if (f.type === 'entity' || f.type === 'icon') {
            const sel = document.createElement('ha-selector');
            sel.hass = this._hass;
            sel.selector = f.type === 'entity' ? { entity: {} } : { icon: {} };
            sel.required = false;
            sel.value = item[f.key] || '';
            sel.addEventListener('value-changed', (ev) => { ev.stopPropagation(); upd(f.key, ev.detail.value || ''); });
            row.appendChild(sel);
          } else if (f.type === 'bool') {
            const lab = document.createElement('label');
            lab.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:.82rem;cursor:pointer;color:var(--primary-text-color);';
            const cb = document.createElement('input');
            cb.type = 'checkbox'; cb.checked = item[f.key] !== false;
            cb.style.accentColor = 'var(--primary-color,#03a9f4)';
            cb.addEventListener('change', () => upd(f.key, cb.checked));
            lab.appendChild(cb); lab.appendChild(document.createTextNode(f.text || 'Sì'));
            row.appendChild(lab);
          } else if (f.type === 'color') {
            const inp = document.createElement('input');
            inp.type = 'color'; inp.value = item[f.key] || FFlowCard.PALETTE[idx % FFlowCard.PALETTE.length];
            inp.style.cssText = 'width:60px;height:30px;border:none;background:none;cursor:pointer;padding:0;';
            inp.addEventListener('change', () => upd(f.key, inp.value));
            row.appendChild(inp);
          } else {
            const inp = document.createElement('input');
            inp.type = f.type === 'number' ? 'number' : 'text';
            inp.placeholder = f.placeholder || '';
            inp.value = item[f.key] !== undefined ? String(item[f.key]) : '';
            inp.style.cssText = 'display:block;width:100%;box-sizing:border-box;padding:7px 10px;border-radius:4px;border:1px solid var(--divider-color,rgba(0,0,0,.42));background:var(--input-fill-color,var(--secondary-background-color,rgba(0,0,0,.04)));color:var(--primary-text-color);font-size:.9rem;font-family:inherit;';
            inp.addEventListener('change', () => upd(f.key, f.type === 'number' ? (inp.value === '' ? '' : Number(inp.value)) : inp.value));
            inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') inp.blur(); });
            row.appendChild(inp);
          }
          box.appendChild(row);
        });
        outer.appendChild(box);
      });
      const add = document.createElement('button');
      add.textContent = addLabel;
      add.style.cssText = 'width:100%;padding:8px;margin-bottom:14px;border-radius:8px;border:1px dashed var(--primary-color,#03a9f4);background:transparent;color:var(--primary-color,#03a9f4);font-weight:600;cursor:pointer;';
      add.addEventListener('click', () => {
        const a = cur();
        if (!this._openItems) this._openItems = {};
        this._openItems[listKey] = a.length;
        commit([...a, newItem(a.length)], true);
      });
      outer.appendChild(add);
      return outer;
    };

    const showConsumers = !!cfg._show_consumers;
    shell.appendChild(makeSection('consumers', '🔌', 'Utilizzatori', [
      textField('consumers_title', 'Titolo sezione', 'Utilizzatori'),
      numberField('consumers_meter_speed', 'Velocità dischi contatore (1 = normale)', 0.1, 5, 0.1),
      switchRow('consumers_chart', 'Grafico dei consumi', 'Aree colorate per utilizzatore, dallo storico di Home Assistant', true),
      numberField('consumers_chart_hours', 'Ore mostrate all’apertura (poi si cambiano dai pulsanti 1h · 4h · 8h · 12h · 24h sul grafico)', 1, 72, 1, 'h'),
      switchRow('consumers_chart_total', 'Linea consumo totale casa', 'Tratteggiata, usa il sensore "Consumo casa"', true),
      switchRow('consumers_chart_legend', 'Legenda sotto il grafico', 'Togli la spunta per un grafico più compatto', true),
      divider(),
      listEditor('consumers', [
        { key: 'name', label: 'Nome', type: 'text', placeholder: 'es. Lavatrice' },
        { key: 'entity', label: 'Sensore di potenza (W o kW)', type: 'entity' },
        { key: 'icon', label: 'Icona', type: 'icon' },
        { key: 'color', label: 'Colore', type: 'color' },
        { key: 'threshold', label: 'Soglia "acceso" in W (predefinita 50)', type: 'number', placeholder: '50' },
        { key: 'chart', label: 'Grafico', type: 'bool', text: 'Mostra nel grafico dei consumi (togli la spunta per il totale casa)' },
      ], (n) => ({ name: '', entity: '', icon: 'mdi:power-plug', color: FFlowCard.PALETTE[n % FFlowCard.PALETTE.length] }), '＋ Aggiungi utilizzatore'),
    ], { toggleKey: '_show_consumers', toggleOn: showConsumers, hidden: !showConsumers }));

    const showCam = !!cfg._show_camera;
    shell.appendChild(makeSection('camera', '📹', 'Videocamera', [
      textField('camera_title', 'Titolo sezione', 'Videocamera'),
      picker('camera_entity', 'Videocamera (camera.*)'),
      switchRow('camera_snapshot', 'Solo immagine (aggiornata ogni 10 s)', 'Usala se il video in diretta non parte o per consumare meno dati'),
      divider(),
      picker('ptz_camera', 'Telecamera ONVIF da muovere (usa il servizio onvif.ptz: non servono entità per le frecce)', true),
      numberField('ptz_speed', 'Velocità movimento ONVIF', 0.1, 1, 0.1),
      numberField('ptz_distance', 'Durata/ampiezza di ogni passo ONVIF', 0.1, 1, 0.1),
      textField('ptz_home_preset', 'Preset ONVIF per il pulsante centrale (es. 1, facoltativo)', ''),
      divider(),
      picker('ptz_up',    'In alternativa: freccia ▲ su (pulsante, script o switch)', true),
      picker('ptz_down',  'Freccia ▼ giù', true),
      picker('ptz_left',  'Freccia ◀ sinistra', true),
      picker('ptz_right', 'Freccia ▶ destra', true),
      picker('ptz_home',  'Posizione iniziale (pulsante centrale)', true),
    ], { toggleKey: '_show_camera', toggleOn: showCam, hidden: !showCam }));

    const showStats = !!cfg._show_stats;
    shell.appendChild(makeSection('stats', '📈', 'Statistiche', [
      switchRow('stats_pv', 'Produzione FV di oggi', 'Barre orarie per stringa (colori: FV1 arancione, FV2 blu, FV3 viola, FV4 verde)', true),
      picker('stats_forecast_entity', 'Sensore di stima produzione (Solcast, Forecast.Solar…)', true),
      switchRow('stats_load', 'Consumi casa ultime 24 ore', 'Usa il sensore "Consumo casa"; picco evidenziato', true),
      switchRow('stats_battery', 'Batteria ultime 24 ore', 'Carica, scarica e SOC', true),
    ], { toggleKey: '_show_stats', toggleOn: showStats, hidden: !showStats }));

    const showVent = !!cfg._show_ventilation;
    shell.appendChild(makeSection('ventilation', '🌀', 'Ventilazione inverter', [
      textField('vent_title', 'Titolo', 'Ventilazione inverter'),
      picker('vent_state_entity',  'Stato termico (idle / cool / low / medium / high / very high / critical)', true),
      picker('vent_status_entity', 'Descrizione stato (se vuota: testo automatico dal livello)', true),
      picker('vent_ambient_temp',  'Temperatura ambiente', true),
      picker('vent_pwm',           'PWM ventole (%)', true),
      picker('vent_rpm_avg',       'RPM medio (se vuoto: media delle ventole)', true),
      picker('vent_inv_temp',      'Temperatura inverter (se vuoto: quella della sezione FV)', true),
      picker('vent_dc_temp',       'Temperatura DC', true),
      divider(),
      listEditor('vent_fans', [
        { key: 'name', label: 'Nome', type: 'text', placeholder: 'es. FAN1' },
        { key: 'entity', label: 'Sensore giri (rpm)', type: 'entity' },
      ], (n) => ({ name: 'FAN' + (n + 1), entity: '' }), '＋ Aggiungi ventola'),
    ], { toggleKey: '_show_ventilation', toggleOn: showVent, hidden: !showVent }));

    // ── Labels: global gate + per-row activation ──
    // Gate: section chip toggles _labels_custom_entities (body hidden when off).
    // Per-row: entity picker activates only when that row's label text differs from its default.
    const labelsEnabled = !!(cfg._labels_custom_entities);

    // Helper: entity picker that can be visually disabled
    const pickerMaybeDisabled = (key, label, disabled = false, optional = false) => {
      const wrap = picker(key, label, optional);
      if (disabled) {
        wrap.style.position = 'relative';
        const veil = document.createElement('div');
        veil.style.cssText = [
          'position:absolute', 'inset:0', 'border-radius:6px',
          'background:var(--secondary-background-color,rgba(0,0,0,.06))',
          'opacity:.55', 'pointer-events:all', 'cursor:not-allowed',
          'z-index:10',
        ].join(';');
        const note = document.createElement('div');
        note.style.cssText = [
          'position:absolute', 'inset:0', 'display:flex', 'align-items:center',
          'justify-content:center', 'font-size:.68rem', 'font-weight:600',
          'color:var(--secondary-text-color)', 'letter-spacing:.3px',
          'pointer-events:none', 'z-index:11',
        ].join(';');
        note.textContent = '⛔ Sostituito dalla sezione Etichette';
        wrap.appendChild(veil);
        wrap.appendChild(note);
      }
      return wrap;
    };

    // Per-row active (lock): true when global gate ON AND label text ≠ default AND entity is selected
    // Only lock Battery pickers if user has BOTH renamed the label AND picked a custom entity.
    const _labelChanged = (key, def) => labelsEnabled && (cfg[key] || def) !== def;
    const _labelLocked  = (textKey, def, entityKey) => _labelChanged(textKey, def) && !!(cfg[entityKey]);
    const cellTempActive   = _labelChanged('label_cell_temp_minmax', 'TEMP CELLE MIN/MAX');
    const bmsTempActive    = _labelChanged('label_bms_temp',         'TEMP BMS');
    const minCellActive    = _labelChanged('label_min_cell',         'Cella Min');
    const maxCellActive    = _labelChanged('label_max_cell',         'Cella Max');
    const battDisActive    = _labelChanged('label_batt_dis',         'Scarica Batt.');
    const totalPvGenActive = _labelChanged('label_total_pv_gen',     'PRODUZIONE FV TOT.');
    // Lock flags for Battery section pickers (stricter — requires entity also set)
    const cellTempLocked   = _labelLocked('label_cell_temp_minmax', 'TEMP CELLE MIN/MAX', 'label_entity_cell_temp');
    const bmsTempLocked    = _labelLocked('label_bms_temp',         'TEMP BMS',          'label_entity_bms_temp');
    const minCellLocked    = _labelLocked('label_min_cell',         'Cella Min',          'label_entity_min_cell');
    const maxCellLocked    = _labelLocked('label_max_cell',         'Cella Max',          'label_entity_max_cell');
    const battDisLocked    = _labelLocked('label_batt_dis',         'Scarica Batt.',         'label_entity_batt_dis');

    // Label rows — text field + entity picker with live state preview
    const labelRow = (textKey, textLabel, textPlaceholder, entityKey, active = false) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(textField(textKey, textLabel, textPlaceholder));
      const entityRow = document.createElement('div');
      entityRow.style.cssText = 'margin-top:-6px;margin-bottom:14px;';
      const entityLabel = document.createElement('div');
      entityLabel.style.cssText = 'font-size:.72rem;color:var(--secondary-text-color);padding:0 2px 3px;line-height:1;display:flex;align-items:center;gap:6px;';
      entityLabel.textContent = active ? 'Entità (sostituisce quella predefinita)' : 'Entità — modifica l’etichetta per sbloccare';
      // State preview badge — shows current entity state text (e.g. "charging", "on grid backup mode")
      const currentEntityId = cfg[entityKey];
      if (active && currentEntityId && this._hass && this._hass.states[currentEntityId]) {
        const stateVal = this._hass.states[currentEntityId].state;
        const badge = document.createElement('span');
        badge.textContent = stateVal;
        badge.style.cssText = [
          'font-size:.65rem', 'font-weight:700', 'letter-spacing:.3px',
          'padding:1px 7px', 'border-radius:20px',
          'background:var(--primary-color,#03a9f4)', 'color:#fff',
          'text-transform:capitalize', 'flex-shrink:0',
        ].join(';');
        entityLabel.appendChild(badge);
      }
      const sel = document.createElement('ha-selector');
      sel.hass = this._hass;
      sel.selector = { entity: {} };
      sel.required = false;
      sel.value = cfg[entityKey] || '';
      sel._configKey = entityKey;
      sel.style.cssText = 'width:100%;display:block;';
      if (!active) {
        sel.style.opacity = '0.4';
        sel.style.pointerEvents = 'none';
        sel.title = 'Modifica il testo dell’etichetta qui sopra per sbloccare la scelta dell’entità';
      }
      sel.addEventListener('value-changed', (ev) => {
        ev.stopPropagation();
        this._set(entityKey, ev.detail.value || '');
      });
      entityRow.appendChild(entityLabel);
      entityRow.appendChild(sel);
      const wrapper = document.createElement('div');
      wrapper.appendChild(frag);
      wrapper.appendChild(entityRow);
      return wrapper;
    };

    // Info banner
    const labelInfoBanner = (() => {
      const info = document.createElement('div');
      info.style.cssText = 'font-size:.72rem;line-height:1.5;color:var(--secondary-text-color);background:var(--secondary-background-color,rgba(0,0,0,.04));border:1px solid var(--divider-color,rgba(0,0,0,.10));border-radius:7px;padding:7px 10px;margin-bottom:10px;';
      info.innerHTML = '&#x1F4A1; <strong>Suggerimento:</strong> rinomina l’etichetta di un riquadro per poter scegliere un’entità diversa. Il sensore corrispondente nella sezione Batteria verrà bloccato automaticamente per evitare duplicati.';
      return info;
    })();

    shell.appendChild(makeSection('labels', '🏷️', 'Etichette', [
      labelInfoBanner,
      labelRow('label_cell_temp_minmax', 'Etichetta temp. celle min/max', 'TEMP CELLE MIN/MAX', 'label_entity_cell_temp', cellTempActive),
      labelRow('label_bms_temp',         'Etichetta temp. BMS',          'TEMP BMS',          'label_entity_bms_temp',  bmsTempActive),
      labelRow('label_min_cell',         'Etichetta cella min',          'Cella Min',          'label_entity_min_cell',  minCellActive),
      labelRow('label_max_cell',         'Etichetta cella max',          'Cella Max',          'label_entity_max_cell',  maxCellActive),
      labelRow('label_batt_dis',         'Etichetta scarica batteria',          'Scarica Batt.',         'label_entity_batt_dis',  battDisActive),
      labelRow('label_total_pv_gen',     'Etichetta produzione FV totale',      'PRODUZIONE FV TOT.',     'total_pv_gen_entity',    totalPvGenActive),
    ], { toggleKey: '_labels_custom_entities', toggleOn: labelsEnabled, hidden: !labelsEnabled }));

    shell.appendChild(makeSection('solar', '☀️', 'Fotovoltaico', [
      picker('pv1_power', 'Potenza FV1'),
      textField('pv1_name', 'Nome della falda sinistra / stringa FV1 (facoltativo: se vuoto resta "FV1")', 'FV1'),
      picker('pv2_power', 'Potenza FV2'),
      textField('pv2_name', 'Nome della falda destra / stringa FV2 (facoltativo: se vuoto resta "FV2")', 'FV2'),
    ]));

    shell.appendChild(makeSection('solar_extra', '☀️', 'Stringhe FV aggiuntive', [
      picker('pv3_power', 'Potenza FV3', true),
      textField('pv3_name', 'Nome stringa FV3 (facoltativo)', 'FV3'),
      picker('pv4_power', 'Potenza FV4', true),
      textField('pv4_name', 'Nome stringa FV4 (facoltativo)', 'FV4'),
    ], { toggleKey: '_show_pv_extra', toggleOn: showPVExtra, hidden: !showPVExtra }));

    shell.appendChild(makeSection('solar_extras', '☀️', 'Altri dati fotovoltaico', [
      picker('pv_total_power',  'Potenza FV totale',  true),
      divider(),
      picker('inv_temp',        'Temperatura inverter'),
      picker('today_pv',        'Produzione FV oggi'),
      picker('today_batt_chg',  'Carica batteria oggi'),
      picker('today_load',      'Consumo oggi'),
      picker('consump',         'Consumo casa'),
    ]));

    shell.appendChild(makeSection('grid', '🔌', 'Rete', [
      switchRow('invert_grid_power', '🔄 Inverti segno potenza rete', 'Attiva se positivo = immissione (es. GoodWe active_power)'),
      divider(),
      picker('grid_active_power',  'Potenza attiva rete'),
      picker('grid_import_energy', 'Energia prelevata dalla rete'),
      picker('grid_export_energy', 'Energia immessa in rete', true),
      picker('grid_power_alt',     'Sensore rete alternativo',    true),
    ]));

    shell.appendChild(makeSection('battery1', '🔋', 'Batteria principale', [
      switchRow('invert_battery_power', '🔄 Inverti segno potenza batteria', 'Attiva se positivo = in scarica'),
      divider(),
      picker('battery_soc',      'SOC batteria'),
      picker('battery_power',    'Potenza batteria'),
      picker('battery_current',  'Corrente batteria'),
      picker('battery_voltage',  'Tensione batteria'),
      pickerMaybeDisabled('battery_temp1',    'Temp. 1',           cellTempLocked),
      pickerMaybeDisabled('battery_temp2',    'Temp. 2',           cellTempLocked),
      pickerMaybeDisabled('battery_mos',      'Temp. BMS',         bmsTempLocked),
      pickerMaybeDisabled('battery_min_cell', 'Tensione cella min', minCellLocked),
      pickerMaybeDisabled('battery_max_cell', 'Tensione cella max', maxCellLocked),
      pickerMaybeDisabled('batt_dis',         'Scarica oggi',  battDisLocked),
      divider(),
      picker('goodwe_battery_soc',  'SOC di riserva',     true),
      picker('goodwe_battery_curr', 'Corrente di riserva', true),
    ], { toggleKey: '_show_battery', toggleOn: showBatt1, hidden: !showBatt1 }));

    shell.appendChild(makeSection('battery2', '🔋', 'Batteria secondaria', [
      switchRow('invert_battery_power', '🔄 Inverti segno potenza batteria', 'Condiviso con la principale'),
      divider(),
      picker('battery2_soc',      'SOC'),
      picker('battery2_power',    'Potenza'),
      picker('battery2_current',  'Corrente'),
      picker('battery2_voltage', 'Tensione'),
      pickerMaybeDisabled('battery2_mos',     'Temp. BMS', bmsTempLocked),
      divider(),
      numberField('battery2_full_ah', 'Capacità batteria 2 (se diversa dalla 1)', 0, 999, 1, 'Ah'),
      numberField('battery2_full_wh', 'Capacità batteria 2 (se diversa dalla 1)', 0, 999.99, 0.01, 'kWh'),
    ], { toggleKey: '_show_battery2', toggleOn: showBatt2, hidden: !showBatt2 }));

    shell.appendChild(makeSection('ev', '🚗', 'Auto elettrica / Wallbox', [
      picker('charger_power',           'Potenza wallbox (W o kW)'),
      picker('charger_state',           'Stato wallbox (se vuoto: "in carica" quando la potenza supera 50 W)', true),
      picker('charger_soc',             'SOC batteria auto (%)', true),
      picker('charger_current',         'Corrente wallbox (A)', true),
      picker('charger_eta',             'Tempo alla carica completa (min)', true),
      numberField('charger_battery_capacity_wh', 'Capacità batteria auto, per stimare il tempo (es. 43200 per 43,2 kWh)', 0, 200000, 1, 'Wh'),
    ], { toggleKey: '_show_ev', toggleOn: showEV, hidden: !showEV }));

    this.innerHTML = '';
    this.appendChild(shell);
    this._rendered = true; // Fix #2: mark rendered so hass setter stops triggering full DOM rebuilds
  }
}
customElements.define('f-flow-card-editor', FFlowCardEditor);

// ═══════════════════════════════════════════════════════════════
// MAIN CARD
// ═══════════════════════════════════════════════════════════════
class FFlowCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this.config = {};
    this._prevPvTotal = -1;
    this._prevSunPos = { bx: -1, by: -1 };
    this._prevPvBlocksTotal = -1; // Fix #11: guard for pvBlocks rebuild
    this.attachShadow({ mode: 'open' });
  }

  static get PALETTE() { return ['#f97316', '#29c4f6', '#f85149', '#22d3ee', '#a78bfa', '#84cc16', '#14b8a6', '#facc15', '#ec4899', '#3fb950']; }

  static getStubConfig() {
    return {
      pv1_power: 'sensor.goodwe_pv1_power',
      pv2_power: 'sensor.goodwe_pv2_power',
      pv3_power: '',
      pv4_power: '',
      pv_total_power: 'sensor.goodwe_pv_power',
      grid_active_power: 'sensor.goodwe_active_power',
      grid_import_energy: 'sensor.goodwe_today_energy_import',
      grid_export_energy: '',
      consump: 'sensor.goodwe_house_consumption',
      today_pv: 'sensor.goodwe_today_s_pv_generation',
      today_batt_chg: 'sensor.goodwe_today_battery_charge',
      today_load: 'sensor.goodwe_today_load',
      battery_soc: 'sensor.jk_soc',
      battery_power: 'sensor.jk_power',
      battery_current: 'sensor.jk_current',
      battery_voltage: 'sensor.jk_voltage',
      battery_temp1: 'sensor.jk_temp1',
      battery_temp2: 'sensor.jk_temp2',
      battery_mos: 'sensor.jk_mos',
      battery_min_cell: 'sensor.jk_cellmin',
      battery_max_cell: 'sensor.jk_cellmax',
      goodwe_battery_soc: 'sensor.goodwe_battery_state_of_charge',
      goodwe_battery_curr: 'sensor.goodwe_battery_current',
      inv_temp: 'sensor.goodwe_inverter_temperature_module',
      batt_dis: 'sensor.goodwe_today_battery_discharge',
      battery2_soc: '',
      battery2_power: '',
      battery2_current: '',
      battery2_voltage: '',
      battery2_mos: '',
      battery_full_ah: 0,
      battery_full_wh: 0,
      battery_cap_unit: 'ah',
      battery2_full_ah: 0,
      battery2_full_wh: 0,
      inverter_max_power: 6000,
      pv_max_power: 7500,
      charger_state: '',
      charger_current: '',
      charger_power: '',
      charger_soc: '',
      charger_eta: '',
      charger_battery_capacity_wh: '',
      sun: 'sun.sun',
      inverter_name: '',
      label_cell_temp_minmax: 'TEMP CELLE MIN/MAX',
      label_bms_temp: 'TEMP BMS',
      label_endurance: 'AUTONOMIA',
      label_min_cell: 'Cella Min',
      label_max_cell: 'Cella Max',
      label_batt_dis: 'Scarica Batt.',
      total_pv_gen_entity: 'sensor.goodwe_total_pv_generation',
      label_total_pv_gen: 'PRODUZIONE FV TOT.',
      label_entity_cell_temp: '',
      label_entity_bms_temp: '',
      label_entity_min_cell: '',
      label_entity_max_cell: '',
      label_entity_batt_dis: '',
      _labels_custom_entities: false,
      grid_power_alt: 'sensor.grid_phase_a_power',
      _show_battery: true,
      _show_battery2: false,
      invert_battery_power: false,
      invert_grid_power: false,
      _show_pv_extra: false,   // combined toggle
      _show_ev: false,
      card_title: '',
      grid_status_entity: '',
      ems_mode_entity: '',
      inverter_image: '',
      _show_energy_supply: false,
      _show_backup_panel: false,
      _show_battery_stats: true,
      _daily_tiles_extended: false,
      battery_style: 'modern',
      _show_consumers: false,
      consumers_title: 'Utilizzatori',
      consumers_meter_speed: 1,
      consumers: [],
      consumers_chart: true,
      consumers_chart_hours: 24,
      consumers_chart_total: true,
      consumers_chart_legend: true,
      grid_icon_style: 'modern',
      sections_order: ['bms', 'inv', 'cons', 'vent', 'stats', 'cam'],
      home_icon_style: 'modern',
      grid_switch_to_off: '',
      grid_switch_to_on: '',
      grid_switch_confirm: true,
      battery_reserve_soc: 0,
      battery_target_soc: 100,
      pv1_name: '', pv2_name: '', pv3_name: '', pv4_name: '',
      _show_stats: false,
      stats_forecast_entity: '',
      stats_pv: true,
      stats_load: true,
      stats_battery: true,
      weather_entity: '',
      _show_camera: false,
      camera_title: 'Videocamera',
      camera_entity: '',
      camera_mode: 'live',
      ptz_up: '', ptz_down: '', ptz_left: '', ptz_right: '', ptz_home: '',
      ptz_camera: '', ptz_speed: 1, ptz_distance: 0.3, ptz_move_mode: 'ContinuousMove', ptz_home_preset: '',
      _show_ventilation: false,
      vent_title: 'Ventilazione inverter',
      vent_state_entity: '',
      vent_status_entity: '',
      vent_ambient_temp: '',
      vent_pwm: '',
      vent_rpm_avg: '',
      vent_inv_temp: '',
      vent_dc_temp: '',
      vent_fans: [],
    };
  }

  getCardSize() { return 8 + (this.config._show_consumers ? 2 : 0) + (this.config._show_ventilation ? 3 : 0) + (this.config._show_stats ? 6 : 0) + (this.config._show_camera ? 4 : 0); }
  static getConfigElement() { return document.createElement('f-flow-card-editor'); }

  setConfig(config) {
    this.config = { ...FFlowCard.getStubConfig(), ...config };
    this._buildStaticSVG();
  }

  set hass(hass) { this._hass = hass; this._updateDynamic(); this._updateExtraSections(); }

  _val(eid, toWatts = false) {
    if (!eid) return null;
    const s = this._hass?.states?.[eid];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    const v = parseFloat(s.state);
    if (isNaN(v)) return null;
    if (toWatts) {
      const unit = (s.attributes?.unit_of_measurement || '').trim();
      if (unit === 'kW' || unit === 'kilowatt') return v * 1000;
    }
    return v;
  }

  _strVal(eid) {
    if (!eid) return '';
    const s = this._hass?.states?.[eid];
    return s ? String(s.state).toLowerCase() : '';
  }

  _socColor(p) { return p<=25?'#f85149':p<=50?'#f39c4b':p<=75?'#58a6ff':'#4CAF50'; }
  _cellTempColor(t) { return t<=15?'#58a6ff':t<=35?'#3fb950':t<=45?'#f0883e':'#f85149'; }
  _cellVoltColor(v) { if(v<=0.001)return'#8b949e'; if(v<3.0)return'#f85149'; if(v<3.1)return'#f39c4b'; if(v<3.4)return'#f4d03f'; if(v<=3.65)return'#3fb950'; return'#f85149'; }
  _tempColor(t) { return t<=25?'#3fb950':t<=45?'#f0883e':'#f85149'; }
  _remCapColor(p) { return p<=15?'#e34d4c':p<=30?'#f39c4b':p<=55?'#f4d03f':'#2ecc71'; }
  _fmtTime(h) { if(!isFinite(h)||h<=0) return'--';const hh=Math.floor(h),mm=Math.round((h-hh)*60);return hh+'h '+(mm<10?'0':'')+mm+'m'; }
  _fmtEndurance(h) {
    if (!isFinite(h) || h < 0) return '--';
    const days = Math.floor(h / 24), hrs = Math.floor(h % 24), mins = Math.floor((h - Math.floor(h)) * 60);
    if (days > 0) return days + 'd ' + hrs + 'h';
    return hrs + 'h ' + (mins < 10 ? '0' : '') + mins + 'm';
  }
  _fmtTill(h) {
    // Fix #15: h > 0 guard was too strict — h approaching 0 from positive side
    // (battery at 0%, tiny charge power) returned 'Till --' despite a valid ETA.
    // Use h < 0 to reject only truly invalid/negative values.
    if (!isFinite(h) || h < 0) return 'Fino a --';
    const target = new Date(Date.now() + h * 3600000);
    const day = ['dom','lun','mar','mer','gio','ven','sab'][target.getDay()];
    return 'Fino a ' + day + ' ' + target.getHours().toString().padStart(2,'0') + ':' + target.getMinutes().toString().padStart(2,'0');
  }

  _sunData() {
    const attrs = this._hass?.states[this.config.sun || 'sun.sun']?.attributes;
    // Sun position uses time-based t derived from today's ACTUAL rise/set times.
    // next_rising/next_setting flip to tomorrow after sunrise — we correct for this
    // by subtracting one day when the event is more than 18 h in the future.
    // elevation is used only for night detection and bell (arc height) — it is a
    // live real-time value and is never affected by the tomorrow-flip problem.
    let rise = '06:00', set = '18:00';
    let t = 0.5;
    let night = false;
    let bell = 0.5;

    // Return the nearest occurrence (today's) of an HA future-only ISO timestamp.
    // HA next_rising/next_setting are always in the future; after the event passes today
    // they flip to tomorrow. We detect this by checking if the event is > 18 h away —
    // if so, we step back one calendar day in LOCAL time (not UTC) to recover today's time.
    const nearestTime = iso => {
      if (!iso) return null;
      try {
        const future = new Date(iso);
        if ((future - Date.now()) > 18 * 3600000) {
          // Step back one day while preserving the exact local clock time
          future.setDate(future.getDate() - 1);
        }
        // Return local HH:MM (correct for user's timezone)
        return String(future.getHours()).padStart(2, '0') + ':' + String(future.getMinutes()).padStart(2, '0');
      } catch (e) { return null; }
    };

    if (attrs) {
      // Get today's actual rise / set for display labels AND position math
      rise = nearestTime(attrs.next_rising)  || rise;
      set  = nearestTime(attrs.next_setting) || set;

      const toMin = ts => { const p = ts.split(':').map(Number); return p[0] * 60 + p[1]; };
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const RISE = toMin(rise), SET = toMin(set);
      const dayLen = SET - RISE;

      // t: 0 = sunrise, 1 = sunset, clamped to [0,1]
      t = dayLen > 0 ? Math.max(0, Math.min(1, (nowMin - RISE) / dayLen)) : 0.5;

      // Night detection: prefer live elevation when available
      if (attrs.elevation != null) {
        night = parseFloat(attrs.elevation) < 0;
        // bell: how high the sun is (0 at horizon, 1 at max elevation)
        bell = Math.max(0, Math.sin(Math.max(0, parseFloat(attrs.elevation)) * Math.PI / 180));
      } else {
        night = nowMin < RISE || nowMin > SET;
        bell  = 1 - Math.pow(Math.abs(2 * t - 1), 1.5);
      }
    }

    // Sun position on the quadratic Bézier arc: left(35,78) → top(260,-45) → right(485,78)
    const bx = Math.round((1 - t) * (1 - t) * 35  + 2 * (1 - t) * t * 260 + t * t * 485);
    const by = Math.round((1 - t) * (1 - t) * 78  + 2 * (1 - t) * t * (-45) + t * t * 78);

    // Moon position: travels its own arc from right to left during night hours.
    // Uses an independent tMoon computed from elapsed night time — NOT (1-t),
    // which was wrong because t itself is re-mapped during night.
    let mx = 260, my = 72;
    if (night) {
      const toMin2 = ts => { const p = ts.split(':').map(Number); return p[0] * 60 + p[1]; };
      const RISE2 = toMin2(rise), SET2 = toMin2(set);
      const nowMin2 = new Date().getHours() * 60 + new Date().getMinutes();
      // Night length = 1440 - day length; guard against SET2 > RISE2 edge case
      const dayLen2 = SET2 > RISE2 ? SET2 - RISE2 : 0;
      const nightLen = Math.max(1, 1440 - dayLen2);
      // tMoon: 0 = just after sunset, 1 = just before sunrise
      // After midnight nowMin2 < SET2, so add 1440 to handle the wrap
      let tMoon = nowMin2 >= SET2
        ? (nowMin2 - SET2) / nightLen
        : (nowMin2 + 1440 - SET2) / nightLen;
      tMoon = Math.max(0, Math.min(1, tMoon));
      // Moon arc: right(485,78) → mid(260,158) → left(35,78) — dips below the horizon line
      mx = Math.round((1 - tMoon) * (1 - tMoon) * 485 + 2 * (1 - tMoon) * tMoon * 260 + tMoon * tMoon * 35);
      my = Math.round((1 - tMoon) * (1 - tMoon) * 78  + 2 * (1 - tMoon) * tMoon * 158  + tMoon * tMoon * 78);
    }
    return { rise, set, night, bell, bx, by, mx, my, t };
  }

  _battFill(soc){
    const ft=145,fb=263,fh=118;const fH=Math.round((soc||0)/100*fh),fY=fb-fH;let c,f,tc;
    if(soc<=20){c='#ff2200';f='url(#battGlowRed)';tc='#000';}else if(soc<=40){c='#f4d03f';f='url(#battGlowOrange)';tc='#000';}else if(soc<=75){c='#44ff00';f='url(#battGlowGreen)';tc='#fff';}else{c='#00d4ff';f='url(#battGlowCyan)';tc='#fff';}
    return{y:fY,height:fH,color:c,filter:fH>4?f:'none',textColor:tc};
  }

  _flowLevel(w,type){
    if(type==='solar'){if(w<200)return{dur:4,size:1.8,count:6};if(w<600)return{dur:3.2,size:2.2,count:12};if(w<1200)return{dur:2.7,size:2.5,count:20};if(w<2500)return{dur:2.4,size:2.8,count:30};if(w<4000)return{dur:1.8,size:3.2,count:42};if(w<6000)return{dur:1.2,size:3.5,count:55};return{dur:.9,size:3.8,count:65};}
    if(w<150)return{dur:4,size:1.8,count:4};if(w<500)return{dur:3.2,size:2.2,count:8};if(w<1000)return{dur:2.7,size:2.5,count:14};if(w<2000)return{dur:2.4,size:2.8,count:22};if(w<3000)return{dur:1.8,size:3.2,count:30};if(w<4500)return{dur:1.5,size:3.5,count:40};return{dur:.9,size:3.8,count:50};
  }

  _buildPvWaveHTML(bx,by,pvT){
    if(pvT<=10)return'';const fl=this._flowLevel(pvT,'solar');const sY=by+7;const pD='M '+bx.toFixed(1)+','+sY.toFixed(1)+' C '+bx.toFixed(1)+',85 260,5 260,155';const col='rgba(255,232,60,.95)',gc='rgba(255,190,20,.55)';const dD=(fl.dur*.8).toFixed(2),dL=(8+fl.size*1.5).toFixed(1),gL=(6+fl.size*1.2).toFixed(1),dT=(parseFloat(dL)+parseFloat(gL)).toFixed(1);let h='';h+='<path d="'+pD+'" fill="none" stroke="'+gc+'" stroke-width="6" stroke-dasharray="'+dL+' '+gL+'" stroke-linecap="round" opacity="0.25" filter="url(#arcSunF2)"><animate attributeName="stroke-dashoffset" from="'+dT+'" to="0" dur="'+dD+'s" repeatCount="indefinite" calcMode="linear"/></path>';h+='<path d="'+pD+'" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.8" stroke-dasharray="'+dL+' '+gL+'" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="'+dT+'" to="0" dur="'+dD+'s" repeatCount="indefinite" calcMode="linear"/></path>';h+='<path d="'+pD+'" fill="none" stroke="'+col+'" stroke-width="1.0" stroke-dasharray="'+dL+' '+gL+'" stroke-linecap="round" opacity="0.85"><animate attributeName="stroke-dashoffset" from="'+dT+'" to="0" dur="'+dD+'s" repeatCount="indefinite" calcMode="linear"/></path>';const wD=[{amp:6,dur:fl.dur*.9,ox:0,op:.9,sc:'rgba(255,255,255,0.92)',dLen:'3.0',dGap:'40.0'},{amp:10,dur:fl.dur*1.1,ox:3,op:.6,sc:col,dLen:'4.5',dGap:'50.0'}];const wc=Math.min(2,Math.max(1,Math.round(fl.count/5)));for(let wi=0;wi<wc;wi++){const w=wD[wi];const sC=Math.round(fl.count*.5),sD=w.dur.toFixed(2),sCy=(parseFloat(w.dLen)+parseFloat(w.dGap)).toFixed(1);for(let si=0;si<sC;si++){const fr=si/sC,ph=fr*Math.PI*2,sY2=(w.amp*Math.sin(ph+wi*1.1)).toFixed(1),sX=(w.ox+w.amp*.3*Math.cos(ph*.5)).toFixed(1),sDe=(fr*w.dur%w.dur).toFixed(3),sO=(w.op*(.5+.5*Math.abs(Math.sin(ph)))*.6).toFixed(2);h+='<g transform="translate('+sX+','+sY2+')"><path d="'+pD+'" fill="none" stroke="'+w.sc+'" stroke-width="1.2" stroke-dasharray="'+w.dLen+' '+w.dGap+'" stroke-linecap="round" opacity="'+sO+'"><animate attributeName="stroke-dashoffset" from="'+sCy+'" to="0" dur="'+sD+'s" begin="-'+sDe+'s" repeatCount="indefinite" calcMode="linear"/></path></g>';}}return h;
  }

  // ── v1.3.0: consumers (Utilizzatori) ─────────────────────────────
  _consumers() {
    const list = Array.isArray(this.config.consumers) ? this.config.consumers : [];
    return list.filter(c => c && c.entity);
  }

  // ── v1.10.0: user-defined order of the sections below the flow ──
  static get SECTIONS() {
    return [['bms', 'Statistiche batteria (JK BMS)'], ['inv', 'Inverter (riquadri giornalieri)'], ['cons', 'Utilizzatori e grafico'],
      ['vent', 'Ventilazione inverter'], ['stats', 'Statistiche'], ['cam', 'Videocamera']];
  }
  static sectionOrder(cfg) {
    const all = FFlowCard.SECTIONS.map(x => x[0]);
    const want = Array.isArray(cfg.sections_order) ? cfg.sections_order.filter(k => all.includes(k)) : [];
    return [...new Set([...want, ...all])];
  }
  _orderSections(chunks) {
    const strip = (h) => String(h || '').trim().replace(/^<div class="dv"><\/div>/, '').trim();
    return FFlowCard.sectionOrder(this.config).map(k => strip(chunks[k])).filter(Boolean).join('<div class="dv"></div>');
  }

  // ── v1.6.0: collapsible sections (Inverter / Utilizzatori / Ventilazione) ──
  // Pinned (📌) sections open on every load; unpinned ones start closed after a reload.
  // The pin is stored per browser in localStorage; the open/closed state survives re-renders.
  _lsKey(name) { return 'ffc:' + (this.config.card_title || 'Flusso Energia') + ':' + name; }
  _lsGet(name) { try { return localStorage.getItem(this._lsKey(name)); } catch (e) { return null; } }
  _lsSet(name, v) { try { localStorage.setItem(this._lsKey(name), v); } catch (e) { /* storage unavailable */ } }
  _secPinned(key) { const v = this._lsGet('pin:' + key); return v === null ? true : v === '1'; }
  _secIsOpen(key) {
    if (!this._secOpen) this._secOpen = {};
    if (this._secOpen[key] === undefined) this._secOpen[key] = this._secPinned(key);
    return this._secOpen[key];
  }
  _secHTML(key, titleHtml, bodyHtml) {
    const open = this._secIsOpen(key), pinned = this._secPinned(key);
    return `<div class="sec${open ? ' open' : ''}" data-sec="${key}">
      <div class="ct sec-h"><span class="chev">▸</span><span class="sec-t">${titleHtml}</span>
        <span class="sec-sum" id="sum_${key}"></span>
        <label class="pin${pinned ? ' on' : ''}" title="Tieni la sezione sempre aperta (anche dopo aver ricaricato la pagina)"><input type="checkbox"${pinned ? ' checked' : ''}><span>📌</span></label>
      </div>
      <div class="sec-b">${bodyHtml}</div>
    </div>`;
  }
  _bindSections() {
    this.shadowRoot.querySelectorAll('.sec[data-sec]').forEach(sec => {
      const key = sec.dataset.sec;
      const head = sec.querySelector('.sec-h');
      const pin = sec.querySelector('.pin');
      const cb = pin.querySelector('input');
      head.addEventListener('click', (e) => {
        if (pin.contains(e.target)) return;
        this._secOpen[key] = !sec.classList.contains('open');
        sec.classList.toggle('open', this._secOpen[key]);
        if (this._secOpen[key] && key === 'cons') this._renderChart();
        if (this._secOpen[key] && key === 'stats') this._renderStats();
      });
      cb.addEventListener('change', () => {
        this._lsSet('pin:' + key, cb.checked ? '1' : '0');
        pin.classList.toggle('on', cb.checked);
        if (cb.checked) { this._secOpen[key] = true; sec.classList.add('open'); }
      });
      pin.addEventListener('click', (e) => e.stopPropagation());
    });
  }

  _buildConsumersHTML(esc) {
    if (!this.config._show_consumers) return '';
    const list = this._consumers();
    const title = esc(this.config.consumers_title || 'Utilizzatori');
    const pal = FFlowCard.PALETTE;
    let h = `<div class="cons">`;
    if (!list.length) h += `<div style="grid-column:1/-1;font-size:.74rem;color:#8b949e;padding:6px 2px">Nessun utilizzatore: aggiungili dall'editor (sezione Utilizzatori).</div>`;
    list.forEach((c, i) => {
      const col = esc(c.color || pal[i % pal.length]);
      h += `<div class="cn" id="cn${i}" data-entity="${esc(c.entity)}" style="--c:${col}">
        <ha-icon icon="${esc(c.icon || 'mdi:power-plug')}"></ha-icon>
        <div class="nm">${esc(c.name || c.entity)}</div>
        <div class="pw" id="cnPw${i}">-- W</div>
        <div class="meter"><div class="mk" id="cnMk${i}"></div></div>
      </div>`;
    });
    h += '</div>';
    if (this._chartEnabled()) {
      const hrs = this._chartHours();
      const opts = [1, 4, 8, 12, 24];
      if (!opts.includes(hrs)) opts.push(hrs);
      opts.sort((a, b) => a - b);
      h += `<div class="cch">
        <div class="cch-h"><span id="cChartTitle">${this._chartTitle(hrs)}</span>
          <span class="hsel">${opts.map(o => `<button class="hb${o === hrs ? ' on' : ''}" data-h="${o}">${o}h</button>`).join('')}</span></div>
        <div class="cch-w" id="cChartWrap">
          <svg id="cChartSvg" viewBox="0 0 500 170" style="width:100%;display:block"></svg>
          <div class="cch-tip" id="cChartTip"></div>
        </div>
        ${this.config.consumers_chart_legend !== false ? '<div class="cch-leg" id="cChartLeg"></div>' : ''}
        <div class="cch-info" id="cChartInfo"></div>
      </div>`;
    }
    return '<div class="dv"></div>' + this._secHTML('cons', '🔌 ' + title, h);
  }

  // ── v1.4.0: 24 h consumption chart (HA recorder history) ─────────
  _chartEnabled() { return !!this.config._show_consumers && this.config.consumers_chart !== false; }
  _chartHours() {
    if (this._chartHoursSel === undefined) {
      const saved = Number(this._lsGet('chartHours'));
      this._chartHoursSel = saved > 0 ? saved : null;
    }
    return Math.max(1, Math.min(72, this._chartHoursSel || Number(this.config.consumers_chart_hours) || 24));
  }
  _chartTitle(h) { return h === 1 ? 'Consumi ultima ora' : `Consumi ultime ${h} ore`; }
  _bindChartHours() {
    const root = this.shadowRoot;
    root.querySelectorAll('.hb[data-h]').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const h = Number(b.dataset.h);
      this._chartHoursSel = h;
      this._lsSet('chartHours', String(h));
      root.querySelectorAll('.hb[data-h]').forEach(x => x.classList.toggle('on', x === b));
      const t = root.getElementById('cChartTitle'); if (t) t.textContent = this._chartTitle(h);
      this._hist = null;
      this._renderChart();
      this._maybeLoadHistory();
    }));
  }
  _chartIds() {
    const ids = this._consumers().filter(c => c.chart !== false).map(c => c.entity);
    if (this.config.consumers_chart_total !== false && this.config.consump) ids.push(this.config.consump);
    return [...new Set(ids)];
  }

  _maybeLoadHistory() {
    if (!this._chartEnabled() || !this._hass || typeof this._hass.callWS !== 'function') return;
    const ids = this._chartIds();
    const key = ids.join('|') + '#' + this._chartHours();
    const now = Date.now();
    if (this._histLoading) return;
    if (this._hist && this._hist.key === key && now - this._hist.fetched < 5 * 60000) return;
    if (!ids.length) return;
    this._histLoading = true;
    const hours = this._chartHours();
    const start = now - hours * 3600000;
    this._hass.callWS({
      type: 'history/history_during_period',
      start_time: new Date(start).toISOString(), end_time: new Date(now).toISOString(),
      entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false,
    }).then(res => {
      this._hist = { key, start, end: now, hours, raw: res || {}, fetched: Date.now() };
    }).catch(err => {
      this._hist = { key, error: String((err && err.message) || err), fetched: Date.now() };
    }).finally(() => { this._histLoading = false; this._renderChart(); });
  }

  // Time-weighted average power (W) per bucket from HA's state-change list
  _bucketize(points, eid, start, end, n, opts = {}) {
    const out = new Float64Array(n);
    if (!Array.isArray(points) || !points.length) return out;
    const unit = (this._hass?.states?.[eid]?.attributes?.unit_of_measurement || '').trim();
    const mul = (unit === 'kW' ? 1000 : 1) * (opts.mul || 1);
    const step = (end - start) / n;
    const pts = points.map(p => ({
      t: p.lu != null ? p.lu * 1000 : p.lc != null ? p.lc * 1000 : Date.parse(p.last_updated || p.last_changed || 0),
      v: parseFloat(p.s != null ? p.s : p.state),
    })).sort((a, b) => a.t - b.t);
    for (let k = 0; k < pts.length; k++) {
      const v = isFinite(pts[k].v) ? (opts.signed ? pts[k].v * mul : Math.max(0, pts[k].v * mul)) : 0;
      if (!v) continue;
      let a = Math.max(start, pts[k].t);
      const b = Math.min(opts.until || end, k + 1 < pts.length ? pts[k + 1].t : end);
      let i = Math.floor((a - start) / step);
      while (a < b && i < n) {
        const be = start + (i + 1) * step;
        const e = Math.min(b, be);
        if (i >= 0) out[i] += v * (e - a) / step;
        a = e; i++;
      }
    }
    return out;
  }

  _renderChart() {
    const root = this.shadowRoot;
    const svg = root.getElementById('cChartSvg');
    if (!svg) return;
    const info = root.getElementById('cChartInfo'), leg = root.getElementById('cChartLeg');
    const h = this._hist;
    const fmt = (v) => v >= 1000 ? (+(v / 1000).toFixed(2)).toString() + ' kW' : Math.round(v) + ' W';
    if (!h || h.error || !h.raw) {
      svg.innerHTML = `<text x="250" y="88" text-anchor="middle" font-size="13" fill="#8b949e">${h && h.error ? 'Storico non disponibile' : 'Caricamento storico…'}</text>`;
      this._chartData = null;
      const lg = root.getElementById('cChartLeg'); if (lg) lg.innerHTML = '';
      const inf = root.getElementById('cChartInfo'); if (inf) inf.textContent = '';
      return;
    }
    // bucket size: 1 min for 1 h, 2 min up to 4 h, 4 min up to 8 h, then 5 min
    const bMin = h.hours <= 1 ? 1 : h.hours <= 4 ? 2 : h.hours <= 8 ? 4 : 5;
    const N = Math.round(h.hours * 60 / bMin);
    const W = 500, H = 170, L = 50, R = 6, T = 8, B = 22, pw = W - L - R, ph = H - T - B;
    const pal = FFlowCard.PALETTE;
    const series = this._consumers().map((c, i) => ({ c, col: c.color || pal[i % pal.length] }))
      .filter(x => x.c.chart !== false)
      .map(x => ({ ...x, b: this._bucketize(h.raw[x.c.entity], x.c.entity, h.start, h.end, N) }));
    const totalId = this.config.consumers_chart_total !== false ? this.config.consump : '';
    const total = totalId && h.raw[totalId] ? this._bucketize(h.raw[totalId], totalId, h.start, h.end, N) : null;
    const cum = series.map(() => new Float64Array(N));
    let maxV = 0;
    for (let i = 0; i < N; i++) {
      let acc = 0;
      series.forEach((sr, k) => { acc += sr.b[i]; cum[k][i] = acc; });
      maxV = Math.max(maxV, acc, total ? total[i] : 0);
    }
    // round tick step (1/2/5 × 10^n) so the axis reads 0, 500 W, 1 kW, 1.5 kW…
    const niceStep = (v) => { if (v <= 0) return 25; const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
    const tick = niceStep(Math.max(100, maxV * 1.05) / 4);
    const nTicks = Math.max(1, Math.ceil(Math.max(100, maxV * 1.05) / tick));
    const yMax = tick * nTicks;
    const X = (i) => (L + (i / (N - 1)) * pw).toFixed(1);
    const Y = (v) => (T + ph - (Math.min(v, yMax) / yMax) * ph).toFixed(1);
    let g = '';
    for (let k = 0; k <= nTicks; k++) {
      const v = tick * k, yy = Y(v);
      g += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="#21262d" stroke-width="1"/>`;
      g += `<text x="${L - 4}" y="${(+yy + 3).toFixed(1)}" text-anchor="end" font-size="11" fill="#8b949e">${fmt(v)}</text>`;
    }
    // x labels every 15 min (1 h), 1 h (≤4 h), 2 h (≤12 h), 3 h (≤24 h), 6 h beyond
    const stepMin = h.hours <= 1 ? 15 : h.hours <= 4 ? 60 : h.hours <= 12 ? 120 : h.hours <= 24 ? 180 : 360;
    const first = new Date(h.start); first.setSeconds(0, 0); first.setMinutes(Math.ceil(first.getMinutes() / 15) * 15);
    for (let t = +first; t < h.end; t += 15 * 60000) {
      const d = new Date(t);
      if ((d.getHours() * 60 + d.getMinutes()) % stepMin) continue;
      const xx = (L + (t - h.start) / (h.end - h.start) * pw).toFixed(1);
      g += `<line x1="${xx}" x2="${xx}" y1="${T}" y2="${T + ph}" stroke="#21262d" stroke-width="1" stroke-dasharray="2 3"/>`;
      g += `<text x="${xx}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#8b949e">${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</text>`;
    }
    // stacked areas, bottom series first
    series.forEach((sr, k) => {
      const top = cum[k], bot = k ? cum[k - 1] : null;
      let d = 'M' + X(0) + ',' + Y(top[0]);
      for (let i = 1; i < N; i++) d += 'L' + X(i) + ',' + Y(top[i]);
      for (let i = N - 1; i >= 0; i--) d += 'L' + X(i) + ',' + Y(bot ? bot[i] : 0);
      g += `<path d="${d}Z" fill="${sr.col}" fill-opacity=".5" stroke="none"/>`;
      let ln = 'M' + X(0) + ',' + Y(top[0]);
      for (let i = 1; i < N; i++) ln += 'L' + X(i) + ',' + Y(top[i]);
      g += `<path d="${ln}" fill="none" stroke="${sr.col}" stroke-width="1.2" stroke-linejoin="round"/>`;
    });
    if (total) {
      let ln = 'M' + X(0) + ',' + Y(total[0]);
      for (let i = 1; i < N; i++) ln += 'L' + X(i) + ',' + Y(total[i]);
      g += `<path d="${ln}" fill="none" stroke="#e6edf3" stroke-width="1.2" stroke-dasharray="4 3" opacity=".75"/>`;
    }
    g += `<line id="cChartCursor" x1="0" x2="0" y1="${T}" y2="${T + ph}" stroke="#e6edf3" stroke-width="1" opacity="0"/>`;
    svg.innerHTML = g;
    // legend with energy over the window
    const hStep = h.hours / N;
    const kwh = (arr) => { let sum = 0; for (let i = 0; i < N; i++) sum += arr[i]; return sum * hStep / 1000; };
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    if (leg) {
      leg.innerHTML = series.map(sr => `<span><i style="background:${esc(sr.col)}"></i>${esc(sr.c.name || sr.c.entity)} <b>${kwh(sr.b).toFixed(2)} kWh</b></span>`).join('') +
        (total ? `<span><i class="tot"></i>Totale casa <b>${kwh(total).toFixed(2)} kWh</b></span>` : '');
    }
    if (info) {
      const meas = series.reduce((a, sr) => a + kwh(sr.b), 0);
      info.textContent = total ? `misurato ${meas.toFixed(1)} di ${kwh(total).toFixed(1)} kWh` : `${meas.toFixed(1)} kWh`;
    }
    this._chartData = { series, total, N, h, L, pw, W, fmt, esc };
    this._bindChartHover();
  }

  _bindChartHover() {
    const root = this.shadowRoot;
    const wrap = root.getElementById('cChartWrap');
    if (!wrap || wrap._bound) return;
    wrap._bound = true;
    const move = (ev) => {
      const cd = this._chartData; if (!cd) return;
      const svg = root.getElementById('cChartSvg'), tip = root.getElementById('cChartTip'), cur = root.getElementById('cChartCursor');
      const r = svg.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width * cd.W;
      if (px < cd.L || px > cd.L + cd.pw) { hide(); return; }
      const i = Math.max(0, Math.min(cd.N - 1, Math.round((px - cd.L) / cd.pw * (cd.N - 1))));
      const xx = cd.L + i / (cd.N - 1) * cd.pw;
      if (cur) { cur.setAttribute('x1', xx); cur.setAttribute('x2', xx); cur.setAttribute('opacity', '.6'); }
      const t0 = new Date(cd.h.start + i * (cd.h.end - cd.h.start) / cd.N);
      const hh = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      const rows = cd.series.map(sr => ({ n: sr.c.name || sr.c.entity, c: sr.col, v: sr.b[i] })).filter(x => x.v >= 1).sort((a, b) => b.v - a.v);
      let html = `<div class="tt">${hh(t0)}</div>`;
      if (cd.total) html += `<div><i class="tot"></i>Totale <b>${cd.fmt(cd.total[i])}</b></div>`;
      html += rows.length ? rows.map(x => `<div><i style="background:${cd.esc(x.c)}"></i>${cd.esc(x.n)} <b>${cd.fmt(x.v)}</b></div>`).join('') : '<div style="color:#8b949e">Nessun consumo misurato</div>';
      tip.innerHTML = html;
      tip.style.display = 'block';
      const frac = xx / cd.W;
      tip.style.left = frac > 0.6 ? '' : (frac * 100 + 2) + '%';
      tip.style.right = frac > 0.6 ? ((1 - frac) * 100 + 2) + '%' : '';
    };
    const hide = () => {
      const tip = root.getElementById('cChartTip'), cur = root.getElementById('cChartCursor');
      if (tip) tip.style.display = 'none';
      if (cur) cur.setAttribute('opacity', '0');
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerdown', move);
    wrap.addEventListener('pointerleave', hide);
  }


  // ── v1.8.0: statistics section (today's PV by string + forecast, house load 24 h, battery 24 h) ──
  static get PV_COLORS() { return ['#f39c4b', '#58a6ff', '#a78bfa', '#3fb950']; }
  _statsEnabled() { return !!this.config._show_stats; }
  _statsStrings() {
    const out = [];
    for (let i = 1; i <= 4; i++) {
      if (i > 2 && !this.config._show_pv_extra) break;
      const e = this.config['pv' + i + '_power'];
      if (e) out.push({ i, e, name: this.config['pv' + i + '_name'] || 'FV' + i, col: FFlowCard.PV_COLORS[i - 1] });
    }
    return out;
  }
  _statsIds() {
    const c = this.config, ids = this._statsStrings().map(x => x.e);
    if (c.pv_total_power) ids.push(c.pv_total_power);
    if (c.stats_forecast_entity) ids.push(c.stats_forecast_entity);
    if (c.consump) ids.push(c.consump);
    if (c.battery_soc) ids.push(c.battery_soc);
    if (c.battery_power) ids.push(c.battery_power);
    return [...new Set(ids.filter(Boolean))];
  }

  _buildStatsHTML(esc) {
    if (!this._statsEnabled()) return '';
    const box = (key, title) => `<div class="stc" id="stBox_${key}">
        <div class="cch-h"><span>${title}</span><span class="st-info" id="stInfo_${key}"></span></div>
        <div class="cch-w" id="stWrap_${key}">
          <svg id="stSvg_${key}" viewBox="0 0 500 170" style="width:100%;display:block"></svg>
          <div class="cch-tip" id="stTip_${key}"></div>
        </div>
        <div class="cch-leg" id="stLeg_${key}"></div>
      </div>`;
    let body = '';
    if (this.config.stats_pv !== false) body += box('pv', 'Produzione FV oggi');
    if (this.config.stats_load !== false) body += box('load', 'Consumi casa · ultime 24 ore');
    if (this.config.stats_battery !== false) body += box('batt', 'Batteria · ultime 24 ore');
    return '<div class="dv"></div>' + this._secHTML('stats', '📈 Statistiche', body || '<div class="st-info">Nessun grafico attivo: attivali dall’editor.</div>');
  }

  _maybeLoadStats() {
    if (!this._statsEnabled() || !this._hass || typeof this._hass.callWS !== 'function') return;
    const ids = this._statsIds();
    const key = ids.join('|');
    const now = Date.now();
    if (this._statsLoading || !ids.length) return;
    if (this._stats && this._stats.key === key && now - this._stats.fetched < 5 * 60000) return;
    this._statsLoading = true;
    const start = now - 24 * 3600000;
    this._hass.callWS({
      type: 'history/history_during_period',
      start_time: new Date(start).toISOString(), end_time: new Date(now).toISOString(),
      entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false,
    }).then(res => { this._stats = { key, start, end: now, raw: res || {}, fetched: Date.now() }; })
      .catch(err => { this._stats = { key, error: String((err && err.message) || err), fetched: Date.now() }; })
      .finally(() => { this._statsLoading = false; this._renderStats(); });
  }

  // shared chart pieces ------------------------------------------------------
  _niceStep(v) { if (v <= 0) return 1; const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; }
  _yAxis(minV, maxV, geo, fmt) {
    const { L, R, T, ph, W } = geo;
    const span = Math.max(maxV - minV, 1e-9);
    const step = this._niceStep(span * 1.05 / 4);
    const yMin = minV < 0 ? -step * Math.ceil(-minV * 1.05 / step) : 0;
    const yMax = step * Math.max(1, Math.ceil(maxV * 1.05 / step));
    const Y = (v) => +(T + ph - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * ph).toFixed(1);
    let g = '';
    for (let v = yMin; v <= yMax + step / 2; v += step) {
      const yy = Y(v);
      g += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="${Math.abs(v) < step / 2 && yMin < 0 ? '#30363d' : '#21262d'}" stroke-width="1"/>`;
      g += `<text x="${L - 4}" y="${(yy + 3.5).toFixed(1)}" text-anchor="end" font-size="11" fill="#8b949e">${fmt(v)}</text>`;
    }
    return { g, Y, yMin, yMax };
  }
  _timeAxis(start, end, geo, stepMin) {
    const { L, pw, T, ph, H } = geo;
    let g = '';
    const first = new Date(start); first.setSeconds(0, 0); first.setMinutes(Math.ceil(first.getMinutes() / 15) * 15);
    for (let t = +first; t <= end; t += 15 * 60000) {
      const d = new Date(t);
      if ((d.getHours() * 60 + d.getMinutes()) % stepMin) continue;
      const xx = (L + (t - start) / (end - start) * pw).toFixed(1);
      if (xx > L + pw - 14) continue;   // no clipped label at the right edge
      g += `<line x1="${xx}" x2="${xx}" y1="${T}" y2="${T + ph}" stroke="#21262d" stroke-width="1" stroke-dasharray="2 3"/>`;
      g += `<text x="${xx}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#8b949e">${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</text>`;
    }
    return g;
  }
  _bindStatHover(key) {
    const root = this.shadowRoot;
    const wrap = root.getElementById('stWrap_' + key);
    if (!wrap || wrap._bound) return;
    wrap._bound = true;
    const hide = () => {
      const tip = root.getElementById('stTip_' + key), cur = root.getElementById('stCur_' + key);
      if (tip) tip.style.display = 'none';
      if (cur) cur.setAttribute('opacity', '0');
    };
    const move = (ev) => {
      const cd = this._stData && this._stData[key]; if (!cd) return;
      const svg = root.getElementById('stSvg_' + key), tip = root.getElementById('stTip_' + key), cur = root.getElementById('stCur_' + key);
      const r = svg.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width * 500;
      if (px < cd.L || px > cd.L + cd.pw) { hide(); return; }
      const i = Math.max(0, Math.min(cd.N - 1, Math.floor((px - cd.L) / cd.pw * cd.N)));
      const xx = cd.L + (i + 0.5) / cd.N * cd.pw;
      if (cur) { cur.setAttribute('x1', xx); cur.setAttribute('x2', xx); cur.setAttribute('opacity', '.6'); }
      tip.innerHTML = cd.rows(i);
      tip.style.display = 'block';
      const frac = xx / 500;
      tip.style.left = frac > 0.6 ? '' : (frac * 100 + 2) + '%';
      tip.style.right = frac > 0.6 ? ((1 - frac) * 100 + 2) + '%' : '';
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerdown', move);
    wrap.addEventListener('pointerleave', hide);
  }

  // forecast for today, hourly average W: from Solcast/Forecast.Solar-like attributes, else from history
  _forecastHourly(dayStart, now) {
    const eid = this.config.stats_forecast_entity;
    const out = { hourly: null, totalKwh: null, fromHistory: false };
    if (!eid) return out;
    const st = this._hass && this._hass.states[eid];
    const at = (st && st.attributes) || {};
    const sum = new Array(24).fill(0), cnt = new Array(24).fill(0);
    const add = (t, w) => { const h = Math.floor((t - dayStart) / 3600000); if (h >= 0 && h < 24 && isFinite(w)) { sum[h] += w; cnt[h]++; } };
    const arr = at.detailedHourly || at.detailedForecast || at.forecast;
    if (Array.isArray(arr) && arr.length) {
      arr.forEach(it => {
        const t = Date.parse(it.period_start || it.datetime || it.period_end || it.time);
        const kw = it.pv_estimate != null ? Number(it.pv_estimate) * 1000 : it.pv_estimate50 != null ? Number(it.pv_estimate50) * 1000 : Number(it.power != null ? it.power : it.watts);
        add(t, kw);
      });
    } else if (at.watts && typeof at.watts === 'object') {
      Object.entries(at.watts).forEach(([k, w]) => add(Date.parse(k), Number(w)));
    }
    if (cnt.some(c => c > 0)) {
      out.hourly = sum.map((v, h) => cnt[h] ? v / cnt[h] : 0);
      out.totalKwh = out.hourly.reduce((a, b) => a + b, 0) / 1000;
    } else {
      const unit = ((st && st.attributes && st.attributes.unit_of_measurement) || '').trim();
      if (/wh$/i.test(unit)) {
        // energy sensor: only the total is meaningful
        const v = parseFloat(st.state);
        if (isFinite(v)) out.totalKwh = unit === 'Wh' ? v / 1000 : unit === 'MWh' ? v * 1000 : v;
      } else if (this._stats && this._stats.raw && this._stats.raw[eid]) {
        out.hourly = Array.from(this._bucketize(this._stats.raw[eid], eid, dayStart, dayStart + 24 * 3600000, 24, { until: now }));
        out.fromHistory = true;
      }
    }
    return out;
  }

  _renderStats() {
    const root = this.shadowRoot;
    if (!root.getElementById('stBox_pv') && !root.getElementById('stBox_load') && !root.getElementById('stBox_batt')) return;
    const st = this._stats;
    const msg = (key, txt) => { const svg = root.getElementById('stSvg_' + key); if (svg) svg.innerHTML = `<text x="250" y="88" text-anchor="middle" font-size="13" fill="#8b949e">${txt}</text>`; };
    if (!st || st.error || !st.raw) { ['pv', 'load', 'batt'].forEach(k => msg(k, st && st.error ? 'Storico non disponibile' : 'Caricamento storico…')); return; }
    if (!this._stData) this._stData = {};
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmtW = (v) => Math.abs(v) >= 1000 ? (+(v / 1000).toFixed(2)) + ' kW' : Math.round(v) + ' W';
    const hhmm = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
    const geo = { W: 500, H: 170, L: 50, R: 8, T: 10, B: 22 };
    geo.pw = geo.W - geo.L - geo.R; geo.ph = geo.H - geo.T - geo.B;
    const now = st.end;

    // 1) today's PV: hourly stacked bars per string (kWh per hour = average kW), forecast dashed
    if (root.getElementById('stBox_pv')) {
      const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
      const d0 = +dayStart, d1 = d0 + 24 * 3600000;
      let strings = this._statsStrings();
      if (!strings.length && this.config.pv_total_power) strings = [{ i: 0, e: this.config.pv_total_power, name: 'Totale', col: '#f4d03f' }];
      const ser = strings.map(x => ({ ...x, b: Array.from(this._bucketize(st.raw[x.e], x.e, d0, d1, 24, { until: now })) }));
      const fc = this._forecastHourly(d0, now);
      let maxV = 0;
      for (let h = 0; h < 24; h++) maxV = Math.max(maxV, ser.reduce((a, x) => a + x.b[h], 0), fc.hourly ? fc.hourly[h] : 0);
      const ax = this._yAxis(0, Math.max(maxV / 1000, 0.5), geo, (v) => (+v.toFixed(2)) + ' kWh');
      const Y = (w) => ax.Y(w / 1000);
      let g = ax.g + this._timeAxis(d0, d1, geo, 180);
      const bw = geo.pw / 24;
      for (let h = 0; h < 24; h++) {
        let acc = 0;
        ser.forEach(x => {
          const v = x.b[h]; if (v <= 0) return;
          const y1 = Y(acc), y2 = Y(acc + v);
          g += `<rect x="${(geo.L + h * bw + bw * 0.14).toFixed(1)}" y="${y2}" width="${(bw * 0.72).toFixed(1)}" height="${Math.max(0.5, y1 - y2).toFixed(1)}" rx="2" fill="${x.col}" fill-opacity=".8" stroke="${x.col}" stroke-width=".8"/>`;
          acc += v;
        });
      }
      if (fc.hourly) {
        let d = '';
        fc.hourly.forEach((w, h) => { d += (h ? 'L' : 'M') + (geo.L + (h + 0.5) * bw).toFixed(1) + ',' + Y(w); });
        g += `<path d="${d}" fill="none" stroke="#e6edf3" stroke-width="1.6" stroke-dasharray="5 4" opacity=".8" stroke-linejoin="round"/>`;
      }
      const nowX = (geo.L + (now - d0) / (d1 - d0) * geo.pw).toFixed(1);
      g += `<line x1="${nowX}" x2="${nowX}" y1="${geo.T}" y2="${geo.T + geo.ph}" stroke="#f85149" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
      g += `<text x="${nowX}" y="${geo.T + 9}" text-anchor="${nowX > 430 ? 'end' : 'start'}" dx="${nowX > 430 ? -3 : 3}" font-size="10" fill="#f85149">adesso</text>`;
      g += `<line id="stCur_pv" x1="0" x2="0" y1="${geo.T}" y2="${geo.T + geo.ph}" stroke="#e6edf3" stroke-width="1" opacity="0"/>`;
      root.getElementById('stSvg_pv').innerHTML = g;
      const kwh = (arr) => arr.reduce((a, b) => a + b, 0) / 1000;
      const tot = ser.reduce((a, x) => a + kwh(x.b), 0);
      const info = root.getElementById('stInfo_pv');
      if (info) info.textContent = tot.toFixed(1) + ' kWh' + (fc.totalKwh != null ? ' · stima ' + fc.totalKwh.toFixed(1) + ' kWh' : '');
      const leg = root.getElementById('stLeg_pv');
      if (leg) leg.innerHTML = ser.map(x => `<span><i style="background:${x.col}"></i>${esc(x.name)} <b>${kwh(x.b).toFixed(2)} kWh</b></span>`).join('')
        + (fc.hourly ? `<span><i class="tot"></i>Stima${fc.fromHistory ? '' : ' oggi'}${fc.totalKwh != null ? ' <b>' + fc.totalKwh.toFixed(1) + ' kWh</b>' : ''}</span>` : '');
      this._stData.pv = { N: 24, L: geo.L, pw: geo.pw, rows: (h) => {
        let html = `<div class="tt">${String(h).padStart(2, '0')}:00 – ${String(h + 1).padStart(2, '0')}:00</div>`;
        ser.forEach(x => { html += `<div><i style="background:${x.col}"></i>${esc(x.name)} <b>${(x.b[h] / 1000).toFixed(2)} kWh</b></div>`; });
        if (ser.length > 1) html += `<div>Totale <b>${(ser.reduce((a, x) => a + x.b[h], 0) / 1000).toFixed(2)} kWh</b></div>`;
        if (fc.hourly) html += `<div><i class="tot"></i>Stima <b>${(fc.hourly[h] / 1000).toFixed(2)} kWh</b></div>`;
        return html;
      } };
      this._bindStatHover('pv');
    }

    // 2) house load, last 24 h, coloured by power, peak marked
    if (root.getElementById('stBox_load') && this.config.consump) {
      const eid = this.config.consump, N = 288;
      const b = this._bucketize(st.raw[eid], eid, st.start, now, N);
      let peak = 0, pi = 0, sum = 0;
      for (let i = 0; i < N; i++) { sum += b[i]; if (b[i] > peak) { peak = b[i]; pi = i; } }
      const ax = this._yAxis(0, Math.max(peak, 500), geo, fmtW);
      const X = (i) => +(geo.L + (i + 0.5) / N * geo.pw).toFixed(1);
      // vertical gradient in absolute watts: green < 1 kW, yellow ~2.5 kW, red ≥ 4 kW
      const yAt = (w) => ax.Y(w);
      let g = `<defs><linearGradient id="stLoadGrad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${ax.Y(0)}" y2="${ax.Y(ax.yMax)}">
        <stop offset="0" stop-color="#3fb950"/><stop offset="${Math.min(1, 1000 / ax.yMax).toFixed(3)}" stop-color="#3fb950"/>
        <stop offset="${Math.min(1, 2500 / ax.yMax).toFixed(3)}" stop-color="#f4d03f"/><stop offset="${Math.min(1, 4000 / ax.yMax).toFixed(3)}" stop-color="#f85149"/><stop offset="1" stop-color="#f85149"/></linearGradient></defs>`;
      g += ax.g + this._timeAxis(st.start, now, geo, 180);
      let line = '';
      for (let i = 0; i < N; i++) line += (i ? 'L' : 'M') + X(i) + ',' + yAt(b[i]);
      g += `<path d="${line}L${X(N - 1)},${ax.Y(0)}L${X(0)},${ax.Y(0)}Z" fill="url(#stLoadGrad)" fill-opacity=".22"/>`;
      g += `<path d="${line}" fill="none" stroke="url(#stLoadGrad)" stroke-width="1.6" stroke-linejoin="round"/>`;
      if (peak > 0) {
        const px = X(pi), py = yAt(peak);
        g += `<circle cx="${px}" cy="${py}" r="3.5" fill="#0d1117" stroke="#58a6ff" stroke-width="2"/>`;
        const lx = Math.min(geo.W - geo.R - 4, Math.max(geo.L + 30, px));
        g += `<rect x="${lx - 30}" y="${Math.max(geo.T, py - 22)}" width="60" height="15" rx="4" fill="#1f6feb"/>`;
        g += `<text x="${lx}" y="${Math.max(geo.T, py - 22) + 11}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${fmtW(peak)}</text>`;
      }
      g += `<line id="stCur_load" x1="0" x2="0" y1="${geo.T}" y2="${geo.T + geo.ph}" stroke="#e6edf3" stroke-width="1" opacity="0"/>`;
      root.getElementById('stSvg_load').innerHTML = g;
      const kwh = sum * 24 / N / 1000;
      const info = root.getElementById('stInfo_load');
      if (info) info.textContent = `${kwh.toFixed(1)} kWh · media ${fmtW(sum / N)}`;
      const leg = root.getElementById('stLeg_load');
      const tPeak = st.start + (pi + 0.5) * (now - st.start) / N;
      if (leg) leg.innerHTML = `<span><i style="background:#58a6ff"></i>Picco <b>${fmtW(peak)}</b> alle ${hhmm(tPeak)}</span>
        <span><i style="background:#3fb950"></i>&lt; 1 kW</span><span><i style="background:#f4d03f"></i>~2,5 kW</span><span><i style="background:#f85149"></i>≥ 4 kW</span>`;
      this._stData.load = { N, L: geo.L, pw: geo.pw, rows: (i) => `<div class="tt">${hhmm(st.start + i * (now - st.start) / N)}</div><div>Consumo <b>${fmtW(b[i])}</b></div>` };
      this._bindStatHover('load');
    }

    // 3) battery, last 24 h: charge (+, blue) / discharge (−, orange) power and SOC line (right axis)
    if (root.getElementById('stBox_batt') && (this.config.battery_power || this.config.battery_soc)) {
      const N = 288, pe = this.config.battery_power, se = this.config.battery_soc;
      const p = pe ? this._bucketize(st.raw[pe], pe, st.start, now, N, { signed: true, mul: this.config.invert_battery_power ? -1 : 1 }) : new Float64Array(N);
      const soc = se ? this._bucketize(st.raw[se], se, st.start, now, N) : null;
      let mx = 100, mn = -100, chg = 0, dis = 0, sMin = 100, sMax = 0;
      for (let i = 0; i < N; i++) {
        mx = Math.max(mx, p[i]); mn = Math.min(mn, p[i]);
        if (p[i] > 0) chg += p[i]; else dis -= p[i];
        if (soc && soc[i] > 0) { sMin = Math.min(sMin, soc[i]); sMax = Math.max(sMax, soc[i]); }
      }
      const lim = Math.max(mx, -mn);
      if (soc) { geo.R = 34; geo.pw = geo.W - geo.L - geo.R; }   // room for the SOC axis on the right
      const ax = this._yAxis(-lim, lim, geo, fmtW);
      const X = (i) => +(geo.L + (i + 0.5) / N * geo.pw).toFixed(1);
      let g = ax.g + this._timeAxis(st.start, now, geo, 180);
      let up = '', dn = '';
      for (let i = 0; i < N; i++) { up += (i ? 'L' : 'M') + X(i) + ',' + ax.Y(Math.max(0, p[i])); dn += (i ? 'L' : 'M') + X(i) + ',' + ax.Y(Math.min(0, p[i])); }
      const z = ax.Y(0);
      g += `<path d="${up}L${X(N - 1)},${z}L${X(0)},${z}Z" fill="#00c8ff" fill-opacity=".35"/><path d="${up}" fill="none" stroke="#00c8ff" stroke-width="1.2"/>`;
      g += `<path d="${dn}L${X(N - 1)},${z}L${X(0)},${z}Z" fill="#f39c4b" fill-opacity=".35"/><path d="${dn}" fill="none" stroke="#f39c4b" stroke-width="1.2"/>`;
      if (soc) {
        const ys = (v) => +(geo.T + geo.ph - Math.max(0, Math.min(100, v)) / 100 * geo.ph).toFixed(1);
        let d = '', started = false;
        for (let i = 0; i < N; i++) { if (soc[i] <= 0) continue; d += (started ? 'L' : 'M') + X(i) + ',' + ys(soc[i]); started = true; }
        g += `<path d="${d}" fill="none" stroke="#e6edf3" stroke-width="1.6" stroke-linejoin="round"/>`;
        [0, 50, 100].forEach(v => { g += `<text x="${geo.W - 2}" y="${ys(v) + 3.5}" font-size="10" fill="#c9d1d9" text-anchor="end">${v}%</text>`; });
      }
      g += `<line id="stCur_batt" x1="0" x2="0" y1="${geo.T}" y2="${geo.T + geo.ph}" stroke="#e6edf3" stroke-width="1" opacity="0"/>`;
      root.getElementById('stSvg_batt').innerHTML = g;
      const kwhC = chg * 24 / N / 1000, kwhD = dis * 24 / N / 1000;
      const info = root.getElementById('stInfo_batt');
      if (info) info.textContent = soc && sMax > 0 ? `SOC min ${Math.round(sMin)}% · max ${Math.round(sMax)}%` : '';
      const leg = root.getElementById('stLeg_batt');
      if (leg) leg.innerHTML = `<span><i style="background:#00c8ff"></i>Carica <b>${kwhC.toFixed(2)} kWh</b></span><span><i style="background:#f39c4b"></i>Scarica <b>${kwhD.toFixed(2)} kWh</b></span>` + (soc ? '<span><i class="tot" style="border-top-style:solid"></i>SOC</span>' : '');
      this._stData.batt = { N, L: geo.L, pw: geo.pw, rows: (i) => `<div class="tt">${hhmm(st.start + i * (now - st.start) / N)}</div>`
        + `<div>${p[i] >= 0 ? 'Carica' : 'Scarica'} <b>${fmtW(Math.abs(p[i]))}</b></div>` + (soc ? `<div>SOC <b>${Math.round(soc[i])}%</b></div>` : '') };
      this._bindStatHover('batt');
    }
  }



  // ── v1.9.0: camera section with ONVIF/PTZ arrows ─────────────────────
  _cameraEnabled() { return !!(this.config._show_camera && this.config.camera_entity); }
  _buildCameraHTML(esc) {
    if (!this.config._show_camera) return '';
    const c = this.config;
    if (!c.camera_entity) return '<div class="dv"></div>' + this._secHTML('cam', '📹 ' + esc(c.camera_title || 'Videocamera'), '<div class="st-info">Scegli la videocamera nell’editor (sezione Videocamera).</div>');
    const onvif = !!c.ptz_camera;   // native onvif.ptz: no per-arrow entities needed
    const arrow = (dir, key, path) => (c[key] || (onvif && key !== 'ptz_home') || (onvif && key === 'ptz_home' && c.ptz_home_preset)) ? `<button class="pz ${dir}" data-ptz="${key}" title="${{ ptz_up: 'Su', ptz_down: 'Giù', ptz_left: 'Sinistra', ptz_right: 'Destra', ptz_home: 'Posizione iniziale' }[key]}">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="${path}" fill="currentColor"/></svg></button>` : '';
    const pad = (onvif || c.ptz_up || c.ptz_down || c.ptz_left || c.ptz_right || c.ptz_home) ? `<div class="ptz">
        ${arrow('up', 'ptz_up', 'M7.4 15.4 12 10.8l4.6 4.6L18 14l-6-6-6 6z')}
        ${arrow('down', 'ptz_down', 'M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z')}
        ${arrow('left', 'ptz_left', 'M15.4 16.6 10.8 12l4.6-4.6L14 6l-6 6 6 6z')}
        ${arrow('right', 'ptz_right', 'M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6z')}
        ${c.ptz_home || (onvif && c.ptz_home_preset) ? arrow('home', 'ptz_home', 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z') : '<span class="pz home dot"></span>'}
      </div>` : '';
    return '<div class="dv"></div>' + this._secHTML('cam', '📹 ' + esc(c.camera_title || 'Videocamera'), `
      <div class="cam" id="camBox">
        <div class="cam-v" id="camView"></div>
        <div class="cam-off" id="camOff">Videocamera non disponibile</div>
        ${pad}
      </div>`);
  }

  _bindCamera() {
    if (!this._cameraEnabled()) return;
    const root = this.shadowRoot;
    root.querySelectorAll('.pz[data-ptz]').forEach(btn => {
      let timer = null;
      const fire = () => this._ptz(btn.dataset.ptz);
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } btn.classList.remove('on'); };
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        btn.classList.add('on'); fire();
        if (btn.dataset.ptz !== 'ptz_home') timer = setInterval(fire, 450);   // hold = keep moving
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
      btn.addEventListener('contextmenu', e => e.preventDefault());
    });
    this._camEl = null; this._camToken = null;
    this._updateCamera();
  }

  _ptz(key) {
    if (!this._hass) return;
    const c = this.config;
    if (c.ptz_camera && !(key === 'ptz_home' && c.ptz_home && !c.ptz_home_preset)) {
      // ONVIF integration: onvif.ptz on the PTZ camera entity (same as a picture-glance call-service)
      const data = { entity_id: c.ptz_camera };
      if (key === 'ptz_home') { data.move_mode = 'GotoPreset'; data.preset = String(c.ptz_home_preset); }
      else {
        Object.assign(data, { ptz_left: { pan: 'LEFT' }, ptz_right: { pan: 'RIGHT' }, ptz_up: { tilt: 'UP' }, ptz_down: { tilt: 'DOWN' } }[key]);
        data.speed = Number(c.ptz_speed) || 1;
        data.distance = Number(c.ptz_distance) || 0.3;
        data.move_mode = c.ptz_move_mode || 'ContinuousMove';
      }
      this._hass.callService('onvif', 'ptz', data);
      return;
    }
    const eid = c[key];
    if (!eid) return;
    const domain = eid.split('.')[0];
    const service = (domain === 'button' || domain === 'input_button') ? 'press' : domain === 'automation' ? 'trigger' : 'turn_on';
    this._hass.callService(domain, service, { entity_id: eid });
  }

  _updateCamera() {
    if (!this._cameraEnabled() || !this._hass) return;
    const root = this.shadowRoot;
    const view = root.getElementById('camView'), off = root.getElementById('camOff');
    if (!view) return;
    const eid = this.config.camera_entity;
    const st = this._hass.states[eid];
    const ok = st && st.state !== 'unavailable';
    if (off) off.style.display = ok ? 'none' : 'flex';
    if (!ok) return;
    const snapshot = this.config.camera_mode === 'snapshot';
    if (!snapshot && customElements.get('ha-camera-stream')) {
      // Home Assistant's own player (HLS / WebRTC / MJPEG, whatever the camera supports)
      if (!this._camEl || this._camEl.tagName !== 'HA-CAMERA-STREAM') {
        view.innerHTML = '';
        this._camEl = document.createElement('ha-camera-stream');
        this._camEl.muted = true;
        this._camEl.controls = false;
        this._camEl.allowExoPlayer = true;
        view.appendChild(this._camEl);
      }
      this._camEl.hass = this._hass;
      if (this._camEl.stateObj !== st) this._camEl.stateObj = st;
      return;
    }
    // fallback: MJPEG proxy stream, or a snapshot refreshed every 10 s
    const token = st.attributes && st.attributes.access_token;
    if (!this._camEl || this._camEl.tagName !== 'IMG') {
      view.innerHTML = '';
      this._camEl = document.createElement('img');
      this._camEl.alt = '';
      this._camEl.addEventListener('error', () => { this._camToken = null; setTimeout(() => this._updateCamera(), 3000); });
      view.appendChild(this._camEl);
    }
    const now = Date.now();
    if (snapshot) {
      if (!this._camSnapAt || now - this._camSnapAt > 10000 || token !== this._camToken) {
        this._camSnapAt = now; this._camToken = token;
        this._camEl.src = `/api/camera_proxy/${eid}?token=${token}&t=${now}`;
      }
    } else if (token !== this._camToken && (!this._camEl.complete || this._camEl.naturalWidth === 0 || !this._camToken)) {
      this._camToken = token;
      this._camEl.src = `/api/camera_proxy_stream/${eid}?token=${token}`;
    }
  }

  // ── v1.9.0: night sky + weather animations (sky area y < 100) ─────────
  _buildSkySVG() {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const f = (v) => v.toFixed(1);
    // stars: twinkling dots, a few brighter four-point stars, one shooting star
    let stars = '';
    for (let i = 0; i < 46; i++) {
      const x = -10 + rnd() * 525, y = 4 + rnd() * 84, r = 0.5 + rnd() * 1.1;
      const d = (1.6 + rnd() * 3.4).toFixed(2), b = (rnd() * 4).toFixed(2), lo = (0.15 + rnd() * 0.3).toFixed(2);
      stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${r.toFixed(2)}" fill="#fff"><animate attributeName="opacity" values="${lo};1;${lo}" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></circle>`;
    }
    for (let i = 0; i < 5; i++) {
      const x = 10 + rnd() * 490, y = 8 + rnd() * 60, k = 2.6 + rnd() * 1.6;
      stars += `<path d="M${f(x)},${f(y - k)} L${f(x + k * .25)},${f(y - k * .25)} L${f(x + k)},${f(y)} L${f(x + k * .25)},${f(y + k * .25)} L${f(x)},${f(y + k)} L${f(x - k * .25)},${f(y + k * .25)} L${f(x - k)},${f(y)} L${f(x - k * .25)},${f(y - k * .25)} Z" fill="#dbe7ff">
        <animate attributeName="opacity" values=".35;1;.35" dur="${(2.5 + rnd() * 2).toFixed(2)}s" begin="-${(rnd() * 3).toFixed(2)}s" repeatCount="indefinite"/></path>`;
    }
    stars += `<line x1="0" y1="0" x2="34" y2="12" stroke="url(#shootGrad)" stroke-width="1.6" stroke-linecap="round" opacity="0">
      <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.86;.88;.94;1" dur="11s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="40,6;40,6;150,46;150,46" keyTimes="0;.86;.94;1" dur="11s" repeatCount="indefinite"/></line>`;
    // clouds
    const cloud = (cls, x, y, sc, dur, begin, fill) => `<g class="${cls}" opacity="0"><g>
      <animateTransform attributeName="transform" type="translate" from="-170 0" to="560 0" dur="${dur}s" begin="-${begin}s" repeatCount="indefinite"/>
      <path transform="translate(${x},${y}) scale(${sc})" d="M10,30 a14,14 0 0 1 4,-27 a19,19 0 0 1 34,-2 a15,15 0 0 1 20,15 a11,11 0 0 1 -2,22 H12 a10,10 0 0 1 -2,-8 Z" fill="${fill}"/></g></g>`;
    let clouds = '';
    [[0, 8, 1.1, 70, 5], [0, 32, .8, 55, 30], [0, 0, 1.35, 90, 60], [0, 24, 1, 62, 45]].forEach(([x, y, sc, d, b], i) => {
      clouds += cloud('wxCloud c' + i, x, y, sc, d, b, 'url(#cloudGrad)');
    });
    // rain, snow, fog, wind, lightning
    let rain = '';
    for (let i = 0; i < 42; i++) {
      const x = -10 + rnd() * 530, d = (0.55 + rnd() * 0.35).toFixed(2), b = (rnd() * 1).toFixed(2);
      rain += `<line class="${i < 22 ? 'rl' : 'rh'}" x1="${f(x)}" y1="0" x2="${f(x - 3)}" y2="10" stroke="#8ec5ff" stroke-width="1.1" stroke-linecap="round" opacity=".7">
        <animateTransform attributeName="transform" type="translate" from="0 20" to="-14 104" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></line>`;
    }
    let snow = '';
    for (let i = 0; i < 34; i++) {
      const x = -10 + rnd() * 530, d = (3 + rnd() * 3).toFixed(2), b = (rnd() * 5).toFixed(2), r = (1 + rnd() * 1.3).toFixed(2);
      snow += `<circle cx="${f(x)}" cy="0" r="${r}" fill="#fff" opacity=".85">
        <animateTransform attributeName="transform" type="translate" values="0 10;6 40;-4 70;3 104" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></circle>`;
    }
    let fog = '';
    [[22, 26, 0], [48, 38, 9], [72, 30, 4]].forEach(([y, d, b]) => {
      fog += `<rect x="-200" y="${y}" width="520" height="10" rx="5" fill="#c9d1d9" opacity=".16">
        <animateTransform attributeName="transform" type="translate" values="0 0;220 0;0 0" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></rect>`;
    });
    let wind = '';
    for (let i = 0; i < 9; i++) {
      const y = 10 + rnd() * 75, d = (1.6 + rnd() * 1.4).toFixed(2), b = (rnd() * 2).toFixed(2), w = 30 + rnd() * 50;
      wind += `<path d="M0,${f(y)} q${f(w / 2)},-5 ${f(w)},0" fill="none" stroke="#c9d1d9" stroke-width="1" stroke-linecap="round" opacity=".45">
        <animateTransform attributeName="transform" type="translate" from="-90 0" to="560 0" dur="${d}s" begin="-${b}s" repeatCount="indefinite"/></path>`;
    }
    const bolt = `<path d="M300,6 L286,40 L298,40 L284,78 L312,32 L300,32 L312,6 Z" fill="#fff6c2" opacity="0">
        <animate attributeName="opacity" values="0;0;1;0;1;0;0" keyTimes="0;.7;.72;.74;.76;.8;1" dur="5s" repeatCount="indefinite"/></path>
      <rect x="-16" y="0" width="536" height="100" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0;.22;0;.15;0;0" keyTimes="0;.7;.72;.74;.76;.8;1" dur="5s" repeatCount="indefinite"/></rect>`;
    return `<g clip-path="url(#skyClip)">
      <g id="skyStars" opacity="0" style="transition:opacity 2s">${stars}</g>
      <g id="wxFog" style="display:none">${fog}</g>
      <g id="wxClouds">${clouds}</g>
      <g id="wxRain" style="display:none">${rain}</g>
      <g id="wxSnow" style="display:none">${snow}</g>
      <g id="wxWind" style="display:none">${wind}</g>
      <g id="wxBolt" style="display:none">${bolt}</g>
    </g>`;
  }

  // Map the weather entity state to the sky layers
  _updateSky(sun) {
    const root = this.shadowRoot;
    const g = (id) => root.getElementById(id);
    if (!g('skyStars')) return;
    const wxRaw = this._strVal(this.config.weather_entity);
    const wx = wxRaw && wxRaw !== 'unavailable' && wxRaw !== 'unknown' ? wxRaw : '';
    const cloudy = { 'partlycloudy': 2, 'cloudy': 4, 'rainy': 4, 'pouring': 4, 'snowy': 3, 'snowy-rainy': 4, 'lightning': 4, 'lightning-rainy': 4, 'hail': 4, 'fog': 2, 'windy': 1, 'windy-variant': 3, 'exceptional': 3 };
    const nClouds = cloudy[wx] || 0;
    const dark = /rain|pouring|lightning|hail|snowy-rainy/.test(wx);
    const show = (id, on) => { const e = g(id); if (e) e.style.display = on ? '' : 'none'; };
    // stars: at night, hidden (or faint) when the sky is overcast
    const starOp = !sun.night ? 0 : nClouds >= 4 ? 0.12 : nClouds >= 2 ? 0.55 : 1;
    g('skyStars').setAttribute('opacity', String(starOp));
    root.querySelectorAll('.wxCloud').forEach((c, i) => {
      c.setAttribute('opacity', i < nClouds ? (dark ? '.95' : sun.night ? '.55' : '.8') : '0');
    });
    const cg = g('cloudGradTop'), cb = g('cloudGradBot');
    if (cg && cb) {
      cg.setAttribute('stop-color', dark ? '#5b6573' : sun.night ? '#3a4352' : '#e6edf3');
      cb.setAttribute('stop-color', dark ? '#2d333b' : sun.night ? '#1f2630' : '#9aa7b8');
    }
    show('wxRain', /rain|pouring|hail/.test(wx) || wx === 'lightning-rainy');
    root.querySelectorAll('#wxRain .rh').forEach(e => e.style.display = (wx === 'pouring' || wx === 'hail') ? '' : 'none');
    show('wxSnow', /snow|hail/.test(wx));
    show('wxFog', wx === 'fog');
    show('wxWind', /windy/.test(wx));
    show('wxBolt', /lightning/.test(wx));
    // the sun is dimmed behind clouds
    const sunG = g('arcSunGroup');
    if (sunG && !sun.night) sunG.setAttribute('opacity', nClouds >= 4 ? '.45' : nClouds >= 2 ? '.75' : '1');
  }

  // ── v1.3.0: inverter ventilation ─────────────────────────────────
  _fanSVG(id, size) {
    const blade = 'M0,-2.2 C2.6,-3.6 4.8,-8.6 1.2,-10.6 C-1.6,-9 -2.4,-5 0,-2.2Z';
    return `<svg width="${size}" height="${size}" viewBox="-12 -12 24 24"><g id="${id}">` +
      [0, 90, 180, 270].map(a => `<path d="${blade}" transform="rotate(${a})" fill="currentColor"/>`).join('') +
      `</g><circle r="2.2" fill="currentColor"/><circle r="1" fill="#0d1117"/></svg>`;
  }

  _ventFans() {
    const list = Array.isArray(this.config.vent_fans) ? this.config.vent_fans : [];
    return list.filter(f => f && f.entity);
  }

  // Thermal levels of the fan controller (same vocabulary as the ESPHome controller:
  // idle / cool / low / medium / high / very high / critical)
  static get VENT_LEVELS() {
    return {
      'idle':      { c: '#8b949e', l: 'Inattiva',   t: 'Sistema in attesa',                         sp: 0,    p: '' },
      'cool':      { c: '#38bdf8', l: 'Minima',     t: 'Ventilazione minima attiva',                sp: 0.5,  p: 'vpCool' },
      'low':       { c: '#60a5fa', l: 'Bassa',      t: 'Raffreddamento leggero',                    sp: 0.7,  p: 'vpCool' },
      'medium':    { c: '#818cf8', l: 'Media',      t: 'Raffreddamento bilanciato',                 sp: 0.9,  p: 'vpWarm' },
      'high':      { c: '#8b5cf6', l: 'Alta',       t: 'Ventilazione sostenuta',                    sp: 1.1,  p: 'vpWarm' },
      'very high': { c: '#a855f7', l: 'Molto alta', t: 'Ventilazione intensa',                      sp: 1.45, p: 'vpHot' },
      'critical':  { c: '#d61cff', l: 'Critica',    t: 'Temperatura critica, massima ventilazione', sp: 2,    p: 'vpHot' },
    };
  }

  _buildVentHTML(esc) {
    if (!this.config._show_ventilation) return '';
    const fans = this._ventFans();
    const kpi = (id, l) => `<div class="vk"><div class="v" id="${id}">--</div><div class="l">${l}</div></div>`;
    let fh = '';
    fans.forEach((f, i) => {
      fh += `<div class="vk"><div class="vfi" id="vfIco${i}">${this._fanSVG('vfRot' + i, 14)}<span class="v" id="vfVal${i}">--</span></div>
        <div class="l">${esc(f.name || 'FAN' + (i + 1))}</div></div>`;
    });
    return '<div class="dv"></div>' + this._secHTML('vent', '🌀 ' + esc(this.config.vent_title || 'Ventilazione inverter'), `
      <div class="vent" id="ventBox">
        <div class="vrow">
          <div class="vico" id="ventMainIco">${this._fanSVG('ventMainRot', 26)}
            <svg class="vslash" id="ventSlash" viewBox="0 0 26 26" width="26" height="26"><line x1="4" y1="22" x2="22" y2="4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
            <svg class="vslash" id="ventAlert" viewBox="0 0 26 26" width="26" height="26" style="display:none"><path d="M13 3 L24 22 H2 Z" fill="currentColor"/><rect x="12" y="9" width="2" height="7" fill="#0d1117"/><rect x="12" y="18" width="2" height="2" fill="#0d1117"/></svg>
          </div>
          <div class="vtxt"><div class="vsub" id="ventStatus">--</div><div class="vtmp" id="ventTemps"></div></div>
          <div class="vpill" id="ventState">--</div>
        </div>
        <div class="vgrid">
          ${kpi('ventAmb', 'Ambiente')}${kpi('ventPwm', 'PWM')}${kpi('ventRpm', 'RPM medio')}${fh}
        </div>
      </div>`);
  }

  _bindExtraSections() {
    this.shadowRoot.querySelectorAll('.cn[data-entity]').forEach(el => {
      el.addEventListener('click', () => this.dispatchEvent(new CustomEvent('hass-more-info', {
        detail: { entityId: el.dataset.entity }, bubbles: true, composed: true })));
    });
    // animation state: meters and fans keep their own angle so speed changes are smooth
    this._spin = { meters: {}, fans: {}, rings: {} };
    this._startAnim();
    if (this._chartEnabled()) this._renderChart();
    if (this._statsEnabled()) this._renderStats();
  }

  connectedCallback() { this._connected = true; this._startAnim(); }
  disconnectedCallback() { this._connected = false; if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; }

  _startAnim() {
    if (this._raf || this._connected === false) return;
    if (!this.config._show_consumers && !this.config._show_ventilation && this.config.home_icon_style === 'classic') return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const sp = this._spin || { meters: {}, fans: {} };
      const root = this.shadowRoot;
      for (const id in sp.meters) {
        const m = sp.meters[id];
        m.a = (m.a + m.rps * dt * Math.PI * 2) % (Math.PI * 2);
        const el = root.getElementById(id);
        if (!el) continue;
        // Ferraris disc seen edge-on: the mark crosses the window on the front half, hidden on the back
        const front = Math.cos(m.a);
        el.style.left = (50 + 46 * Math.sin(m.a)).toFixed(2) + '%';
        el.style.opacity = front > 0 ? (0.25 + 0.75 * front).toFixed(2) : '0';
        el.style.transform = 'scaleX(' + Math.max(0.3, front).toFixed(2) + ')';
      }
      for (const id in (sp.rings || {})) {
        // dashed rings: offset in px/s, so the ring turns faster with more power
        const r = sp.rings[id];
        r.off = (r.off - r.pps * dt) % 1000;
        const el = root.getElementById(id);
        if (el) el.style.strokeDashoffset = r.off.toFixed(1);
      }
      for (const id in sp.fans) {
        const f = sp.fans[id];
        f.a = (f.a + f.rps * dt * 360) % 360;
        const el = root.getElementById(id);
        if (el) el.setAttribute('transform', 'rotate(' + f.a.toFixed(1) + ')');
      }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _updateExtraSections() {
    this._updateCamera();
    const sp = this._spin; if (!sp) return;
    this._maybeLoadHistory();
    this._maybeLoadStats();
    const root = this.shadowRoot;
    const fmtW = (w) => Math.abs(w) >= 1000 ? (w / 1000).toFixed(2) + ' kW' : Math.round(w) + ' W';
    // consumers
    if (this.config._show_consumers) {
      const k = Number(this.config.consumers_meter_speed) || 1;
      let sumW = 0, nOn = 0;
      this._consumers().forEach((c, i) => {
        const w = this._val(c.entity, true);
        const pw = root.getElementById('cnPw' + i);
        if (pw) pw.textContent = w === null ? '--' : fmtW(w);
        const tile = root.getElementById('cn' + i);
        const thr = Number(c.threshold) >= 0 && c.threshold !== '' && c.threshold !== undefined ? Number(c.threshold) : 50;
        if (tile) tile.classList.toggle('on', w !== null && w >= thr);
        if (w !== null && c.chart !== false) sumW += Math.max(0, w);
        if (w !== null && w >= thr) nOn++;
        // 1 kW ≈ 0.6 giri/s; a few watts still turn slowly; capped so it stays readable
        const rps = w === null || w < 1 ? 0 : Math.min(3, Math.max(0.05, (w / 1000) * 0.6 * k));
        const id = 'cnMk' + i;
        if (!sp.meters[id]) sp.meters[id] = { a: Math.random() * Math.PI, rps: 0 };
        sp.meters[id].rps = rps;
      });
      const sumEl = root.getElementById('sum_cons');
      if (sumEl) sumEl.textContent = fmtW(sumW) + ' · ' + (nOn === 1 ? '1 acceso' : nOn + ' accesi');
    }
    // ventilation
    if (this.config._show_ventilation) {
      const st = (eid) => { const s = eid && this._hass.states[eid]; return s && s.state !== 'unavailable' && s.state !== 'unknown' ? String(s.state) : null; };
      const setHTML = (id, v) => { const el = root.getElementById(id); if (el) el.innerHTML = v; };
      const fans = this._ventFans();
      const rpms = fans.map(f => this._val(f.entity));
      const valid = rpms.filter(v => v !== null);
      let avg = this._val(this.config.vent_rpm_avg);
      if (avg === null && valid.length) avg = valid.reduce((a, b) => a + b, 0) / valid.length;
      const pwm = this._val(this.config.vent_pwm);
      const amb = this._val(this.config.vent_ambient_temp);
      const invT = this._val(this.config.vent_inv_temp || this.config.inv_temp);
      const dcT = this._val(this.config.vent_dc_temp);
      const rawState = st(this.config.vent_state_entity);
      const key = rawState !== null ? rawState.toLowerCase().replace(/_/g, ' ').trim() : null;
      const LV = FFlowCard.VENT_LEVELS;
      let lv = key !== null ? LV[key] : null;
      if (!lv) {
        // Unknown vocabulary: fall back to a generic on/off reading
        const on = key !== null ? !/off|idle|stop|spent|inattiv/.test(key) : (avg !== null && avg > 0 && (pwm === null || pwm > 0));
        lv = on ? { ...LV.low, l: rawState || 'In funzione', t: 'Raffreddamento attivo' } : { ...LV.idle, l: rawState || 'Inattiva' };
      }
      const box = root.getElementById('ventBox');
      if (box) box.style.setProperty('--vc', lv.c);
      const stEl = root.getElementById('ventState'); if (stEl) stEl.textContent = lv.l;
      const sumV = root.getElementById('sum_vent');
      if (sumV) { sumV.textContent = lv.l + (avg !== null ? ' · ' + Math.round(avg) + ' rpm' : ''); sumV.style.color = lv.c; }
      const statusTxt = st(this.config.vent_status_entity);
      const sEl = root.getElementById('ventStatus'); if (sEl) sEl.textContent = statusTxt !== null ? statusTxt : lv.t;
      const temps = [];
      if (invT !== null) temps.push('INV ' + invT.toFixed(1) + '°');
      if (dcT !== null) temps.push('DC ' + dcT.toFixed(1) + '°');
      const tEl = root.getElementById('ventTemps'); if (tEl) tEl.textContent = temps.join(' • ');
      setHTML('ventAmb', (amb === null ? '--' : Math.round(amb)) + '<small>°C</small>');
      setHTML('ventPwm', (pwm === null ? '--' : Math.round(pwm)) + '<small>%</small>');
      setHTML('ventRpm', (avg === null ? '--' : Math.round(avg)) + '<small>rpm</small>');
      const main = root.getElementById('ventMainIco');
      if (main) main.className = 'vico' + (lv.p ? ' ' + lv.p : '');
      const isIdle = lv === LV.idle || lv.sp === 0;
      const slash = root.getElementById('ventSlash'); if (slash) slash.style.display = isIdle ? '' : 'none';
      const crit = key === 'critical';
      const alert = root.getElementById('ventAlert'); if (alert) alert.style.display = crit ? '' : 'none';
      const rot = root.getElementById('ventMainRot'); if (rot) rot.parentNode.style.opacity = crit ? '0' : (isIdle ? '.55' : '1');
      // main fan: speed from the thermal level (like the button-card), mini fans: from their real rpm
      const vis = (r) => r === null || r <= 0 ? 0 : Math.min(4, r / 650);
      if (!sp.fans.ventMainRot) sp.fans.ventMainRot = { a: 0, rps: 0 };
      sp.fans.ventMainRot.rps = isIdle ? 0 : lv.sp;
      fans.forEach((f, i) => {
        const r = rpms[i];
        const v = root.getElementById('vfVal' + i); if (v) v.textContent = r === null ? '--' : Math.round(r);
        const ico = root.getElementById('vfIco' + i); if (ico) ico.style.color = r !== null && r > 0 ? 'var(--vc)' : '#8b949e';
        const id = 'vfRot' + i;
        if (!sp.fans[id]) sp.fans[id] = { a: i * 30, rps: 0 };
        sp.fans[id].rps = vis(r);
      });
    }
  }

  // ── v1.5.0: two-slope house, FV1 panels on the left slope and FV2 on the right ──
  _pvName(i) {
    const n = this.config['pv' + i + '_name'];
    return n ? String(n).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) : 'FV' + i;
  }

  // true = on grid, false = off grid, null = unknown / not configured
  _gridOnState() {
    const raw = this._strVal(this.config.grid_status_entity);
    if (!raw || raw === 'unavailable' || raw === 'unknown') return null;
    if (/on.?grid|connected|grid.?tied/.test(raw) && !/dis/.test(raw)) return true;
    if (/off|island|disconnect|fault|backup|outage/.test(raw)) return false;
    if (raw === 'on' || raw === 'true' || raw === '1') return true;
    return null;
  }

  // ── v1.5.0: on-grid / off-grid switch (hold + confirm, like a button-card hold_action) ──
  _gridSwitchEnabled() { return !!(this.config.grid_status_entity && (this.config.grid_switch_to_off || this.config.grid_switch_to_on)); }

  _bindGridSwitch() {
    if (!this._gridSwitchEnabled()) return;
    const root = this.shadowRoot;
    const HOLD = 800;
    [root.getElementById('gridStatusPill'), root.getElementById('gridIconImg')].filter(Boolean).forEach(el => {
      el.style.cursor = 'pointer';
      el.style.touchAction = 'none';
      let timer = null;
      const pill = root.getElementById('gridStatusPill');
      const start = (ev) => {
        if (ev.button > 0 || this._gridPending) return;
        if (pill) pill.classList.add('holding');
        timer = setTimeout(() => { timer = null; if (pill) pill.classList.remove('holding'); this._askGridSwitch(); }, HOLD);
      };
      const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } if (pill) pill.classList.remove('holding'); };
      el.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(e => el.addEventListener(e, cancel));
      el.addEventListener('contextmenu', e => e.preventDefault());
    });
  }

  _askGridSwitch() {
    const on = this._gridOnState();
    if (on === null) return;
    const target = on ? this.config.grid_switch_to_off : this.config.grid_switch_to_on;
    if (!target) return;
    if (this.config.grid_switch_confirm === false) { this._doGridSwitch(on, target); return; }
    const root = this.shadowRoot;
    const modal = root.getElementById('gridModal');
    if (!modal) return;
    root.getElementById('gridModalText').textContent = on
      ? 'Stai per mettere FUORI RETE (OFF GRID) l’impianto, vuoi procedere?'
      : 'Stai per rimettere IN RETE (ON GRID) l’impianto, vuoi procedere?';
    modal.dataset.mode = on ? 'off' : 'on';
    modal.style.display = 'flex';
    const ok = root.getElementById('gridModalOk'), no = root.getElementById('gridModalNo');
    ok.onclick = () => { modal.style.display = 'none'; this._doGridSwitch(on, target); };
    no.onclick = () => { modal.style.display = 'none'; };
  }

  _doGridSwitch(wasOn, entityId) {
    const domain = entityId.split('.')[0];
    const service = (domain === 'button' || domain === 'input_button') ? 'press' : 'turn_on';
    this._gridPending = { wasOn, until: Date.now() + 30000 };
    this._hass.callService(domain, service, { entity_id: entityId })
      .catch(() => { this._gridPending = null; })
      .finally(() => this._updateDynamic());
    this._updateDynamic();
  }

  _buildHouseSVG(pv1Show, pv2Show) {
    const cx = 260;
    const Lq = { a: [cx, 352], b: [184, 410], c: [197, 420], d: [cx, 373] };
    const mir = (p) => [2 * cx - p[0], p[1]];
    const Rq = { a: Lq.a, b: mir(Lq.b), c: mir(Lq.c), d: Lq.d };
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    const P = (Q, u, v) => lerp(lerp(Q.a, Q.b, u), lerp(Q.d, Q.c, u), v);
    const pt = (p) => p[0].toFixed(1) + ',' + p[1].toFixed(1);
    const quad = (Q) => [Q.a, Q.b, Q.c, Q.d].map(pt).join(' ');
    // 4 × 2 solar cells per slope
    const cells = (Q, side) => {
      let h = '';
      const cols = 4, rows = 2, u0 = 0.1, u1 = 0.94, v0 = 0.16, v1 = 0.86, gu = 0.018, gv = 0.07;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const ua = u0 + (u1 - u0) * i / cols + gu, ub = u0 + (u1 - u0) * (i + 1) / cols - gu;
        const va = v0 + (v1 - v0) * j / rows + gv / 2, vb = v0 + (v1 - v0) * (j + 1) / rows - gv / 2;
        h += `<polygon points="${[P(Q, ua, va), P(Q, ub, va), P(Q, ub, vb), P(Q, ua, vb)].map(pt).join(' ')}"/>`;
      }
      return `<g fill="#123a6b" stroke="#2f6fb5" stroke-width=".5">${h}</g>
        <g id="hpGlow${side}" fill="#ffe83c" opacity="0" style="transition:opacity .6s">${h}</g>`;
    };
    return `<g id="homeIconImg" data-modern="1" style="color:#8b949e;transition:color .5s">
      <ellipse cx="${cx}" cy="473" rx="82" ry="7" fill="currentColor" fill-opacity=".10" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
      <ellipse id="homeRing" cx="${cx}" cy="473" rx="82" ry="7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 18" filter="url(#gridNeon)"/>
      <polygon points="${pt(Lq.d)} 206,414 314,414" fill="#0f141a"/>
      <rect x="204" y="412" width="112" height="58" rx="3" fill="#0f141a" stroke="currentColor" stroke-width="1.8" filter="url(#gridNeon)"/>
      <circle cx="${cx}" cy="397" r="6" fill="#0f141a" stroke="currentColor" stroke-width="1.4"/>
      <g id="homeWindows" fill="#1c2128" stroke="currentColor" stroke-width="1.2" style="transition:fill .5s">
        <rect x="215" y="425" width="24" height="18" rx="2"/><rect x="281" y="425" width="24" height="18" rx="2"/>
      </g>
      <path d="M227,425 V443 M215,434 H239 M293,425 V443 M281,434 H305" stroke="currentColor" stroke-width=".8" stroke-opacity=".6"/>
      <rect x="250" y="442" width="20" height="28" rx="2" fill="#161b22" stroke="currentColor" stroke-width="1.4"/>
      <circle cx="265" cy="457" r="1.3" fill="currentColor"/>
      <polygon id="roofL" points="${quad(Lq)}" fill="#1b2230" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" style="transition:stroke .5s,fill .5s"/>
      <polygon id="roofR" points="${quad(Rq)}" fill="#1b2230" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" style="transition:stroke .5s,fill .5s"/>
      ${cells(Lq, 'L')}${cells(Rq, 'R')}
    </g>
    ${pv1Show ? `<text class="sm" id="pv1label" x="210" y="362" text-anchor="end" font-size="10.5" fill="#8b949e" letter-spacing="1">${this._pvName(1)}</text>
    <text id="pv1FlowVal" x="210" y="378" text-anchor="end" font-size="14.5" font-weight="700" fill="#ffe83c">-- W</text>` : ''}
    ${pv2Show ? `<text class="sm" id="pv2label" x="310" y="362" font-size="10.5" fill="#8b949e" letter-spacing="1">${this._pvName(2)}</text>
    <text id="pv2FlowVal" x="310" y="378" font-size="14.5" font-weight="700" fill="#ffe83c">-- W</text>` : ''}
    <text id="fcLoadVal" x="${cx}" y="497" text-anchor="middle" font-size="15.5" font-weight="700" fill="#F7F6D3">-- W</text>`;
  }

  _buildStaticSVG() {
    // the DOM is rebuilt: force the next update to redraw cached parts (sun wave, PV blocks)
    this._prevPvTotal = -1; this._prevSunPos = { bx: -1, by: -1 }; this._prevPvBlocksTotal = -1;
    const dual = !!(this.config._show_battery2);
    const showBatt1 = !!(this.config._show_battery !== false);
    const ev   = !!(this.config._show_ev);
    const showPvExtra = !!(this.config._show_pv_extra);
    const iconPath = '/local/community/f-flow-card';    // icons served from HACS community folder
    const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const cardTitle   = esc(this.config.card_title || 'Flusso Energia');
    const invImage    = this.config.inverter_image ? esc(this.config.inverter_image) : '';
    const showSupply  = !!(this.config._show_energy_supply);
    const showBackup  = !!(this.config._show_backup_panel);
    const showBattStats = this.config._show_battery_stats !== false;
    const tiles6      = !!(this.config._daily_tiles_extended);
    const showGridStatus = !!(this.config.grid_status_entity);
    const showEms     = !!(this.config.ems_mode_entity);
    const invName = String(this.config.inverter_name || '').trim();
    const invSection  = esc(!invName ? 'Inverter' : /inverter/i.test(invName) ? invName : invName + ' Inverter');

    // Battery status badge under the battery icon (battery centre x ≈ 31 after transform)
    const battBadge = showBatt1 ? `<g id="battBadgeGroup">
      <rect id="battBadgeRect" x="-2" y="263" width="76" height="19" rx="9.5" fill="rgba(139,148,158,.10)" stroke="#8b949e" stroke-width="1.2"/>
      <circle id="battBadgeDot" cx="7" cy="272.5" r="3" fill="#8b949e"/>
      <text class="bd" id="battBadgeText" x="40" y="277" text-anchor="middle" font-size="10.5" font-weight="800" letter-spacing="1.2" fill="#8b949e">RIPOSO</text>
    </g>` : '';

    // Inverter: drawn box (default) or user-supplied picture
    const invBlock = invImage ? `
      <rect id="fcInvRect" x="205" y="155" width="110" height="110" rx="18" fill="none" stroke="none"/>
      <image id="invImg" href="${invImage}" x="200" y="140" width="120" height="130" preserveAspectRatio="xMidYMid meet"/>
      <text class="md" id="invTempFlow" x="322" y="238" font-size="13.5" font-weight="700" fill="#58a6ff">-- °C</text>
      <text class="md" id="invLoadPctFlow" x="322" y="257" font-size="14" font-weight="700" fill="#3ce878">--%</text>` : `
      <rect id="fcInvRect" x="205" y="155" width="110" height="110" rx="18" fill="#161b22" stroke="#f4a93b" stroke-width="4"/>
      <text id="invNameLabel" x="260" y="203" text-anchor="middle" font-size="14" font-weight="800" fill="#f4a93b" letter-spacing="1">INV</text>
      <text class="md" id="invTempFlow" x="260" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#58a6ff">-- °C</text>
      <text class="md" id="invLoadPctFlow" x="260" y="244" text-anchor="middle" font-size="14" font-weight="700" fill="#3ce878">--%</text>`;

    // Energy supply stacked bar (right side, between grid and EV/home row)
    const supplyBlock = showSupply ? `<g id="supplyGroup">
      <text class="sm" x="352" y="291" font-size="10" fill="#8b949e" letter-spacing="1.2">FONTI ENERGIA</text>
      <text class="lg" x="364" y="305" text-anchor="middle" font-size="8.5" font-weight="700" fill="#f4d03f">SOLARE</text>
      <text class="lg" x="408" y="305" text-anchor="middle" font-size="8.5" font-weight="700" fill="#3fb950">CARICA</text>
      <text class="lg" x="452" y="305" text-anchor="middle" font-size="8.5" font-weight="700" fill="#58a6ff">SCARICA</text>
      <text class="lg" x="496" y="305" text-anchor="middle" font-size="8.5" font-weight="700" fill="#f85149">RETE</text>
      <rect x="352" y="311" width="158" height="7" rx="3.5" fill="#21262d"/>
      <rect id="supSolar" x="352" y="311" width="0" height="7" fill="#f4d03f"/>
      <rect id="supChg"   x="352" y="311" width="0" height="7" fill="#3fb950"/>
      <rect id="supDis"   x="352" y="311" width="0" height="7" fill="#2b59ff"/>
      <rect id="supGrid"  x="352" y="311" width="0" height="7" fill="#f85149"/>
    </g>` : '';

    // Backup panel (left side, above PV string labels)
    const backupBlock = showBackup ? `<g id="backupGroup">
      <text class="sm" id="backupTimeLbl" x="-1" y="297" font-size="10" fill="#8b949e" letter-spacing="1.2">AUTONOMIA</text>
      <text id="backupTimeVal" x="-1" y="317" font-size="18" font-weight="800" fill="#3fb950">--</text>
      <text class="sm" id="backupTimeSub" x="-1" y="329" font-size="9.5" fill="#3fb950" opacity=".85"></text>
      <text class="sm" x="-1" y="346" font-size="10" fill="#8b949e" letter-spacing="1.2">ENERGIA RESIDUA</text>
      <text id="backupRemVal" x="-1" y="366" font-size="18" font-weight="800" fill="#3fb950">-- kWh</text>
    </g>` : '';

    const pv1Show = !!this.config.pv1_power, pv2Show = !!this.config.pv2_power;
    const modernHome = this.config.home_icon_style !== 'classic';

    const modernHomeX = this.config.home_icon_style !== 'classic';
    const pv3txt = showPvExtra && modernHomeX ? `<text class="sm" id="pv3label" x="180" y="424" text-anchor="end" font-size="10.5" fill="#8b949e" letter-spacing="1">${this._pvName(3)}</text><text id="pv3FlowVal" x="180" y="440" text-anchor="end" font-size="14" font-weight="700" fill="#ffe83c">-- W</text>`
      : showPvExtra ? `<text id="pv3label" x="-1" y="450" font-size="11" fill="#8b949e" letter-spacing="1">FV3</text><text id="pv3FlowVal" x="-1" y="464" font-size="13.5" font-weight="700" fill="#ffe83c">-- W</text>` : '';
    const pv4txt = showPvExtra && modernHomeX ? `<text class="sm" id="pv4label" x="340" y="424" font-size="10.5" fill="#8b949e" letter-spacing="1">${this._pvName(4)}</text><text id="pv4FlowVal" x="340" y="440" font-size="14" font-weight="700" fill="#ffe83c">-- W</text>`
      : showPvExtra ? `<text id="pv4label" x="-1" y="480" font-size="11" fill="#8b949e" letter-spacing="1">FV4</text><text id="pv4FlowVal" x="-1" y="494" font-size="13.5" font-weight="700" fill="#ffe83c">-- W</text>` : '';

    // EV: SVG wallbox + car to the right of the house (x 344–514, y 330–480)
    const carBody = 'M2,34 Q2,24 12,22 L30,20 Q42,6 62,5 L80,5 Q94,6 104,18 L114,22 Q120,24 120,32 L120,38 Q120,40 117,40 L106,40 A11,11 0 0 0 84,40 L36,40 A11,11 0 0 0 14,40 L5,40 Q2,40 2,37 Z';
    // EV drawing: wallbox at x≈398–417, car at x≈420–514 (scaled), info right above the car
    const evtxt = ev ? `<g id="evGroup" style="color:#6e7681;transition:color .5s">
      <path id="flowHomeEV" d="M 316,452 C 350,452 370,452 398,452" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 8" filter="url(#flowGlow)" opacity="0">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <g transform="translate(398,430) scale(.8)">
        <ellipse cx="12" cy="56" rx="13" ry="2.6" fill="currentColor" fill-opacity=".25"/>
        <rect x="10" y="34" width="4" height="22" rx="1" fill="currentColor" fill-opacity=".55"/>
        <rect x="0" y="0" width="24" height="36" rx="5" fill="#0f141a" stroke="currentColor" stroke-width="2" filter="url(#gridNeon)"/>
        <rect x="4" y="5" width="16" height="9" rx="1.5" fill="currentColor" fill-opacity=".28"/>
        <path d="M12.5,6.5 L9.5,10.5 H12 L11,13 L14.5,8.5 H12 Z" fill="currentColor"/>
        <circle id="evLed" cx="12" cy="24" r="2.6" fill="currentColor"><animate attributeName="opacity" values="1;.25;1" dur="1.2s" repeatCount="indefinite"/></circle>
      </g>
      <path id="evCable" d="M407,458 C 412,474 418,472 424,462" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
      <path id="evCableFlow" d="M407,458 C 412,474 418,472 424,462" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 6" opacity="0">
        <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.6s" repeatCount="indefinite"/></path>
      <g transform="translate(420,438) scale(.78)">
        <ellipse cx="61" cy="49" rx="62" ry="3.5" fill="currentColor" fill-opacity=".14"/>
        <path d="${carBody}" fill="#0f141a" stroke="currentColor" stroke-width="2" stroke-linejoin="round" filter="url(#gridNeon)"/>
        <path d="M36,19 Q46,9 62,9 L64,9 L64,19 Z M68,9 L80,9 Q92,10 99,19 L68,19 Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1"/>
        <path d="M112,25 h5 M4,28 h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <g fill="#0f141a" stroke="currentColor" stroke-width="2"><circle cx="25" cy="40" r="8.5"/><circle cx="95" cy="40" r="8.5"/></g>
        <g fill="currentColor"><circle cx="25" cy="40" r="2.6"/><circle cx="95" cy="40" r="2.6"/></g>
      </g>
      <rect x="427" y="482" width="80" height="3.5" rx="1.75" fill="#21262d"/>
      <rect id="evSocBar" x="427" y="482" width="0" height="3.5" rx="1.75" fill="currentColor"/>
      <text id="evPowerVal" x="467" y="390" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">-- W</text>
      <text class="sm" id="evStateVal" x="467" y="405" text-anchor="middle" font-size="10.5" font-weight="700" letter-spacing="1" fill="currentColor">--</text>
      <text class="md" id="evSocVal" x="467" y="421" text-anchor="middle" font-size="12.5" font-weight="700" fill="#e6edf3">-- %</text>
      <text class="sm" id="evEtaVal" x="467" y="434" text-anchor="middle" font-size="11" font-weight="600" fill="#c9d1d9"></text>
    </g>` : '';

    // Battery current/power placed OUTSIDE the transformed group, above/below the flow bar (center y=175)
    const battTextSingle = `
      <text class="md" id="battPwrFlow" x="75" y="164" font-size="13" font-weight="600" fill="#cde">-- W</text>
      <text class="md" id="battCurrFlow" x="75" y="198" font-size="13" font-weight="600" fill="#fff">-- A</text>
    `;
    const battTextDual = `
      <text id="battPwrFlow1" x="75" y="158" font-size="10" font-weight="600" fill="#cde">-- W</text>
      <text id="battPwrFlow2" x="75" y="171" font-size="10" font-weight="600" fill="#cde">-- W</text>
      <text id="battCurrFlow1" x="75" y="196" font-size="10" font-weight="600" fill="#fff">-- A</text>
      <text id="battCurrFlow2" x="75" y="209" font-size="10" font-weight="600" fill="#fff">-- A</text>
    `;

    const batteryTip = `<rect x="75" y="126" width="18" height="4" rx="2" fill="url(#battCapGrad)"/>`;

    // Battery visibility helpers – mirror EV charger pattern
    const battGhostPath = showBatt1
      ? `<path d="M 59,175 C 140,175 120,205 205,205" fill="none" stroke="#1e3a5f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>`
      : '';
    const battFlowPaths = showBatt1 ? `
      <path id="flowBattIn"  d="M 59,175 C 140,175 120,205 205,205" fill="none" stroke="#8b949e" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 6" filter="url(#flowGlow)" opacity="0" style="display:none"><animate attributeName="stroke-dashoffset" from="-24" to="0"   dur="4.0s" repeatCount="indefinite"/></path>
      <path id="flowBattOut" d="M 59,175 C 140,175 120,205 205,205" fill="none" stroke="#8b949e" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 6" filter="url(#flowGlow)" opacity="0" style="display:none"><animate attributeName="stroke-dashoffset" from="0"   to="-24" dur="4.0s" repeatCount="indefinite"/></path>` : '';
    const modernBatt = showBatt1 && !dual && this.config.battery_style !== 'classic';
    let mbSegs = '';
    for (let i = 0; i < 10; i++) {
      const y = (236 - (i + 1) * 8.6 - i * 1.6).toFixed(1);
      mbSegs += `<rect id="mbSeg${i}" x="14" y="${y}" width="40" height="8.6" rx="2.6" fill="#1c2128"/>`;
    }
    const battIconSection = !showBatt1 ? '' : modernBatt ? `
      <g id="battIconWrap">
        <rect x="24" y="123" width="20" height="8" rx="3" fill="url(#mbCapGrad)"/>
        <rect x="8" y="129" width="52" height="113" rx="13" fill="url(#mbShellGrad)" stroke="#3a424d" stroke-width="1.5"/>
        <rect x="11" y="132" width="46" height="107" rx="10" fill="#0b0f14"/>
        ${mbSegs}
        <g clip-path="url(#mbClip)">
          <rect id="mbSheenUp" x="11" y="240" width="46" height="26" fill="url(#mbSheenGrad)" opacity="0"><animate attributeName="y" from="240" to="106" dur="1.8s" repeatCount="indefinite"/></rect>
          <rect id="mbSheenDown" x="11" y="106" width="46" height="26" fill="url(#mbSheenGrad)" opacity="0"><animate attributeName="y" from="106" to="240" dur="1.8s" repeatCount="indefinite"/></rect>
        </g>
        <rect x="13" y="134" width="8" height="103" rx="4" fill="rgba(255,255,255,.07)" style="pointer-events:none"/>
        <text id="fcBattVal" x="34" y="188" text-anchor="middle" font-size="14.5" font-weight="900" fill="#fff" stroke="rgba(0,0,0,.65)" stroke-width="3" paint-order="stroke">--%</text>
        <g id="battBoltGroup" opacity="0"><polygon points="37,196 29,210 34,210 31,222 40,207 35,207 39,196" fill="#fff" stroke="rgba(0,0,0,.5)" stroke-width="0.8"><animate attributeName="opacity" values="0.55;1;0.55" dur="1.2s" repeatCount="indefinite"/></polygon></g>
      </g>
      <text class="md" id="battVoltageFlow" x="34" y="257" text-anchor="middle" font-size="12.5" font-weight="700" fill="#c9d1d9">-- V</text>` : (
      `<g transform="translate(-36.6, 25.4) scale(0.8)">
        <g id="battIconWrap">
          <rect x="49" y="135" width="70" height="132" rx="10" fill="url(#battShellGrad)"/>
          ${batteryTip}
          <rect x="51" y="258" width="66" height="9" rx="4" fill="url(#battCapGrad)"/>
          <rect x="51" y="137" width="66" height="7" rx="4" fill="url(#battCapGrad)"/>
          <rect x="49" y="135" width="70" height="132" rx="10" fill="url(#battGlassBody)" style="pointer-events:none"/>
          <rect x="53" y="145" width="62" height="118" rx="8" fill="#0f1214"/>` +
      (dual ? `
            <rect id="battFillBar1" x="53" y="263" width="30" height="0" rx="0" fill="#3fb950" clip-path="url(#battBodyClipLeft)"/>
            <rect id="battFillHL1" x="53" y="263" width="30" height="0" rx="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClipLeft)" style="pointer-events:none"/>
            <rect id="battFillBar2" x="85" y="263" width="30" height="0" rx="0" fill="#3fb950" clip-path="url(#battBodyClipRight)"/>
            <rect id="battFillHL2" x="85" y="263" width="30" height="0" rx="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClipRight)" style="pointer-events:none"/>
            <g id="battBoltGroup1" opacity="0"><polygon points="72,176 64,195 70,195 66,215 78,193 72,193 80,176" fill="#1a4aff" stroke="rgba(100,150,255,.5)" stroke-width="0.8" filter="url(#battGlowBolt)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/></polygon></g>
            <g id="battBoltGroup2" opacity="0"><polygon points="104,176 96,195 102,195 98,215 110,193 104,193 112,176" fill="#1a4aff" stroke="rgba(100,150,255,.5)" stroke-width="0.8" filter="url(#battGlowBolt)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/></polygon></g>
            <text id="fcBattVal1" x="68" y="208" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">--%</text>
            <text id="fcBattVal2" x="100" y="208" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">--%</text>
            <text id="battVoltageFlow1" x="68" y="278" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">-- V</text>
            <text id="battVoltageFlow2" x="100" y="278" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">-- V</text>
          ` : `
            <rect id="battFillBar" x="53" y="263" width="62" height="0" rx="0" fill="#3fb950" clip-path="url(#battBodyClip)"/>
            <rect id="battFillHL" x="53" y="263" width="62" height="0" rx="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClip)" style="pointer-events:none"/>
            <g id="battBoltGroup" opacity="0"><polygon points="86,176 74,199 82,199 77,223 93,195 85,195 97,176" fill="#1a4aff" stroke="rgba(100,150,255,.5)" stroke-width="0.8" filter="url(#battGlowBolt)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/></polygon></g>
            <text id="fcBattVal" x="84" y="211" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">--%</text>
            <text id="battVoltageFlow" x="84" y="285" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">-- V</text>
          `) +
      `</g>
      </g>`
    );

    this.shadowRoot.innerHTML = `<style>
      :host{display:block} @keyframes svgPulseOrange{0%,100%{filter:drop-shadow(0 0 5px #f39c4b)}50%{filter:drop-shadow(0 0 8px #f5b06a)}}
      .st{background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:7px 9px}
      .st .l{font-size:.64rem;color:#8b949e;letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
      .st .v{font-size:.92rem;font-weight:600;color:#c9d1d9}
      .dv{height:1px;background:#21262d;margin:8px 0}
      .ct{font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8b949e;margin-bottom:10px;display:flex;align-items:center;gap:7px}
      .ct::after{content:'';flex:1;height:1px;background:#21262d}
      .sec-h{cursor:pointer;user-select:none;-webkit-user-select:none;margin-bottom:0}
      .sec-h::after{display:none}
      .sec-h .chev{display:inline-block;width:12px;transition:transform .2s;color:#8b949e}
      .sec.open .sec-h .chev{transform:rotate(90deg)}
      .sec-h .sec-t{white-space:nowrap}
      .sec-h .sec-sum{flex:1;min-width:0;text-align:right;text-transform:none;letter-spacing:0;font-weight:600;color:#c9d1d9;font-size:.74rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .sec.open .sec-h .sec-sum{visibility:hidden}
      .pin{display:inline-flex;align-items:center;gap:3px;padding:2px 7px 2px 5px;border-radius:10px;border:1px solid #30363d;cursor:pointer;opacity:.55;font-size:.72rem;letter-spacing:0}
      .pin.on{opacity:1;border-color:#58a6ff;background:rgba(88,166,255,.12)}
      .pin input{margin:0;width:12px;height:12px;accent-color:#58a6ff;cursor:pointer}
      .sec-b{display:none;padding-top:10px}
      .sec.open .sec-b{display:block}
      .cch-h .hsel{display:inline-flex;gap:3px}
      .hb{font:inherit;font-size:.68rem;font-weight:700;letter-spacing:0;padding:2px 7px;border-radius:8px;border:1px solid #30363d;background:#161b22;color:#8b949e;cursor:pointer}
      .hb.on{color:#0d1117;background:#58a6ff;border-color:#58a6ff}
      .cam{position:relative;border-radius:10px;overflow:hidden;background:#000;aspect-ratio:16/9;border:1px solid #21262d}
      .cam-v,.cam-v img,.cam-v ha-camera-stream{width:100%;height:100%;display:block}
      .cam-v img{object-fit:cover}
      .cam-off{display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:#8b949e;font-size:.8rem}
      .ptz{position:absolute;right:10px;bottom:10px;width:108px;height:108px;border-radius:50%;background:rgba(13,17,23,.45);backdrop-filter:blur(3px);border:1px solid rgba(255,255,255,.12)}
      .pz{position:absolute;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(22,27,34,.75);color:#e6edf3;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;touch-action:none;user-select:none;-webkit-user-select:none;transition:background .15s,transform .1s}
      .pz.on,.pz:active{background:#1f6feb;transform:scale(.92)}
      .pz.up{left:36px;top:2px}.pz.down{left:36px;bottom:2px}.pz.left{left:2px;top:36px}.pz.right{right:2px;top:36px}
      .pz.home{left:36px;top:36px}.pz.dot{width:12px;height:12px;left:48px;top:48px;background:rgba(255,255,255,.25);border:none;cursor:default}
      .stc{background:#0d1117;border:1px solid #21262d;border-radius:10px;padding:8px 8px 6px;margin-bottom:8px}
      .st-info{text-transform:none;letter-spacing:0;color:#c9d1d9;font-weight:600}
      .cch-info{font-size:.7rem;color:#8b949e;text-align:right;margin-top:3px}
      .pvf{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:2px}
      .pvi{text-align:center;background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:6px 2px}
      .pvi .ico{font-size:.95rem;margin-bottom:2px}
      .pvi .lbl{font-size:.6rem;color:#8b949e;letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
      .pvi .val{font-size:.88rem;font-weight:700;color:#c9d1d9}
      .pvi .val.yw{color:#f4d03f} text{font-family:'Segoe UI',Arial,sans-serif}
      .pvi .val.gn{color:#3fb950}
      .pvf.six{grid-template-columns:repeat(6,1fr)}
      .pvi{min-width:0}
      .ffc{container-type:inline-size;container-name:ffc}
      /* narrow card (phones, narrow dashboard columns): fewer columns, bigger SVG labels */
      @container ffc (max-width:440px){
        .pvf.six{grid-template-columns:repeat(3,1fr)}
        svg text.sm{font-size:13.5px}
        svg text.md{font-size:15.5px}
        svg text.lg{font-size:10px}
        svg text.bd{font-size:11.5px}
      }
      .hdr .pill{display:inline-flex;align-items:center;gap:6px;font-size:.64rem;font-weight:700;letter-spacing:1.5px;padding:2px 9px;border-radius:10px;border:1px solid #3fb950;color:#3fb950;background:rgba(63,185,80,.08)}
      .hdr .pill{position:relative;overflow:hidden;user-select:none;-webkit-user-select:none}
      .hdr .pill .hold{position:absolute;left:0;top:0;bottom:0;width:0;background:currentColor;opacity:.25;transition:width .1s}
      .hdr .pill.holding .hold{width:100%;transition:width .8s linear}
      .hdr .pill > span:not(.hold){position:relative}
      .hdr .pill.pending{animation:gpend 1s ease-in-out infinite}
      @keyframes gpend{50%{opacity:.45}}
      .gmodal{display:none;position:absolute;inset:0;z-index:20;align-items:flex-start;justify-content:center;padding-top:70px;box-sizing:border-box;background:rgba(1,4,9,.72);border-radius:12px;backdrop-filter:blur(2px)}
      .gbox{width:min(320px,86%);background:#161b22;border:1px solid #30363d;border-radius:14px;padding:16px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.6)}
      .gmodal[data-mode=off] .gbox{color:#f39c4b;border-color:rgba(243,156,75,.45)}
      .gmodal[data-mode=on] .gbox{color:#3fb950;border-color:rgba(63,185,80,.45)}
      .gmodal[data-mode=on] .gx{display:none}
      .gtitle{font-size:.74rem;letter-spacing:1.5px;text-transform:uppercase;color:#8b949e;margin:6px 0 4px}
      .gtext{font-size:.92rem;font-weight:600;color:#e6edf3;line-height:1.4}
      .gbtns{display:flex;gap:8px;margin-top:14px}
      .gbtns button{flex:1;padding:8px;border-radius:9px;border:1px solid #30363d;background:#0d1117;color:#c9d1d9;font-weight:700;font-size:.88rem;cursor:pointer;font-family:inherit}
      .gbtns button.ok{background:currentColor;border-color:transparent}
      .gmodal[data-mode=off] .gbtns button.ok{background:#f39c4b;color:#0d1117}
      .gmodal[data-mode=on] .gbtns button.ok{background:#3fb950;color:#0d1117}
      .hdr .pill .dot{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 6px currentColor}
      .ems{display:inline-flex;align-items:center;gap:9px;background:#0d1117;border:1px solid #21262d;border-radius:10px;padding:6px 12px 6px 7px;margin:-2px 0 6px}
      .ems-ico{width:26px;height:26px;border-radius:7px;background:rgba(63,185,80,.12);color:#3fb950;display:flex;align-items:center;justify-content:center;font-size:.9rem}
      .ems-l{font-size:.58rem;color:#8b949e;letter-spacing:1.5px;text-transform:uppercase}
      .ems-v{font-size:.8rem;font-weight:700;color:#3fb950}
      .cons{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
      .cn{--c:#58a6ff;position:relative;cursor:pointer;border-radius:16px;padding:12px 8px 10px;text-align:center;
          background:linear-gradient(160deg,color-mix(in srgb,var(--c) 14%,#161b22),#0d1117 75%);
          border:1px solid color-mix(in srgb,var(--c) 22%,#21262d);transition:border-color .4s,box-shadow .4s}
      .cn.on{border-color:color-mix(in srgb,var(--c) 70%,transparent);box-shadow:0 0 14px color-mix(in srgb,var(--c) 30%,transparent)}
      .cn ha-icon{--mdc-icon-size:24px;color:var(--c);display:block;margin:0 auto 6px;height:24px}
      .cn .nm{font-size:.8rem;font-weight:700;color:#e6edf3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .cn .pw{font-size:.78rem;color:#c9d1d9;margin-top:2px;font-variant-numeric:tabular-nums}
      .meter{position:relative;height:8px;margin:9px auto 0;width:78%;border-radius:4px;overflow:hidden;
             background:linear-gradient(180deg,#05070a,#1b2027 45%,#2e353e 50%,#1b2027 55%,#05070a);border:1px solid #2a313a}
      .meter .mk{position:absolute;top:1px;bottom:1px;width:4px;margin-left:-2px;left:50%;border-radius:1px;background:var(--c);box-shadow:0 0 6px var(--c)}
      .cch{margin-top:10px;background:#0d1117;border:1px solid #21262d;border-radius:10px;padding:8px 8px 6px}
      .cch-h{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;font-size:.64rem;letter-spacing:1px;text-transform:uppercase;color:#8b949e;margin-bottom:4px}
      .cch-h #cChartInfo{text-transform:none;letter-spacing:0}
      .cch-w{position:relative;touch-action:pan-y}
      .cch-tip{display:none;position:absolute;top:4px;pointer-events:none;background:rgba(22,27,34,.95);border:1px solid #30363d;border-radius:8px;padding:6px 8px;font-size:.72rem;color:#c9d1d9;min-width:110px;box-shadow:0 4px 14px rgba(0,0,0,.5);z-index:2}
      .cch-tip .tt{font-weight:800;color:#e6edf3;margin-bottom:3px}
      .cch-tip div{display:flex;align-items:center;gap:5px;white-space:nowrap}
      .cch-tip b{margin-left:auto;padding-left:8px;font-variant-numeric:tabular-nums}
      .cch-tip i,.cch-leg i{display:inline-block;width:8px;height:8px;border-radius:2px;flex-shrink:0}
      .cch-tip i.tot,.cch-leg i.tot{background:none;border-top:2px dashed #e6edf3;height:0;border-radius:0;margin-top:2px}
      .cch-leg{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:5px;font-size:.68rem;color:#8b949e}
      .cch-leg span{display:inline-flex;align-items:center;gap:4px}
      .cch-leg b{color:#c9d1d9;font-weight:600}
      .vent{--vc:#8b949e;background:linear-gradient(160deg,color-mix(in srgb,var(--vc) 10%,#0d1117),#0d1117 70%);border:1px solid color-mix(in srgb,var(--vc) 35%,#21262d);border-radius:10px;padding:9px;transition:border-color .5s,background .5s}
      .vrow{display:flex;align-items:center;gap:10px;margin-bottom:8px}
      .vico{position:relative;width:40px;height:40px;flex-shrink:0;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--vc);
            background:color-mix(in srgb,var(--vc) 14%,#161b22);border:1px solid color-mix(in srgb,var(--vc) 30%,#21262d)}
      .vico .vslash{position:absolute;inset:0;margin:auto}
      .vico.vpCool{animation:vpulse 2s ease-in-out infinite}.vico.vpWarm{animation:vpulse 1.6s ease-in-out infinite}.vico.vpHot{animation:vpulse 1.1s ease-in-out infinite}
      @keyframes vpulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--vc) 35%,transparent)}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
      .vtxt{min-width:0;flex:1}
      .vsub{font-size:.78rem;font-weight:700;color:color-mix(in srgb,var(--vc) 55%,#e6edf3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vtmp{font-size:.68rem;color:#8b949e;margin-top:2px}
      .vpill{font-size:.64rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:2px 9px;border-radius:10px;color:var(--vc);border:1px solid color-mix(in srgb,var(--vc) 55%,transparent);background:color-mix(in srgb,var(--vc) 10%,transparent);white-space:nowrap}
      .vgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(58px,1fr));gap:4px}
      .vk{text-align:center;background:#0d1117;border:1px solid #21262d;border-radius:8px;padding:5px 2px}
      .vk .v{font-size:.86rem;font-weight:700;color:#c9d1d9;font-variant-numeric:tabular-nums}
      .vk .v small{font-size:.64rem;color:#8b949e;margin-left:1px}
      .vk .l{font-size:.6rem;color:#8b949e;letter-spacing:1px;text-transform:uppercase;margin-top:1px}
      .vfi{display:flex;align-items:center;justify-content:center;gap:3px;color:#8b949e}
    </style>
    <div class="ffc" style="position:relative;background:#161b22;border:1px solid #21262d;border-radius:12px;padding:13px;box-shadow:0 4px 20px rgba(0,0,0,.4);width:100%;box-sizing:border-box;">
      ${this._gridSwitchEnabled() ? `<div class="gmodal" id="gridModal">
        <div class="gbox">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14,36 L18.5,10 L20,4 L21.5,10 L26,36"/><path d="M8,12 H32 M11,19 H29"/><path class="gx" d="M6,6 L34,34"/></svg>
          <div class="gtitle">Modalità impianto</div>
          <div class="gtext" id="gridModalText"></div>
          <div class="gbtns"><button id="gridModalNo">Annulla</button><button id="gridModalOk" class="ok">Procedi</button></div>
        </div>
      </div>` : ''}
      <div class="ct hdr">⚡ <span id="cardTitle">${cardTitle}</span>
        ${showGridStatus ? `<span id="gridStatusPill" class="pill"><span class="hold"></span><span class="dot"></span><span id="gridStatusText">--</span></span>` : ''}
        <span id="battStatusBadge" style="margin-left:auto;font-size:.64rem;font-weight:700;letter-spacing:1.5px;padding:1px 8px;border-radius:8px;background:#21262d;color:#8b949e;text-transform:uppercase">RIPOSO</span></div>
      ${showEms ? `<div class="ems"><div class="ems-ico">☆</div><div><div class="ems-l">Modalità EMS</div><div class="ems-v" id="emsModeVal">--</div></div></div>` : ''}
      <div style="width:100%;max-width:520px;margin:0 auto"><svg id="flowSvg" viewBox="-16 0 536 508" style="width:100%;display:block">
      <defs>
        <filter id="arcSunF" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="arcSunF2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="moonF"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="dynAuraG" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="rgba(30,100,200,.28)"/><stop offset="55%" stop-color="rgba(30,80,160,.10)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient>
        <radialGradient id="sunCG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="rgba(255,255,220,.98)"/><stop offset="40%" stop-color="rgb(255,125,10)"/><stop offset="100%" stop-color="rgba(255,130,10,.6)"/></radialGradient>
        <linearGradient id="arcDayGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,180,50,0)"/><stop offset="20%" stop-color="rgba(255,200,70,.5)"/><stop offset="50%" stop-color="rgba(255,228,110,.92)"/><stop offset="80%" stop-color="rgba(255,200,70,.5)"/><stop offset="100%" stop-color="rgba(255,180,50,0)"/></linearGradient>
        <linearGradient id="arcNightGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(140,170,255,0)"/><stop offset="30%" stop-color="rgba(155,185,255,.35)"/><stop offset="50%" stop-color="rgba(200,215,255,.7)"/><stop offset="70%" stop-color="rgba(155,185,255,.35)"/><stop offset="100%" stop-color="rgba(140,170,255,0)"/></linearGradient>
        <linearGradient id="battCapGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2d2d2d"/><stop offset="18%" stop-color="#8f8f8f"/><stop offset="50%" stop-color="#ececec"/><stop offset="82%" stop-color="#7a7a7a"/><stop offset="100%" stop-color="#242424"/></linearGradient>
        <linearGradient id="battShellGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#050505"/><stop offset="18%" stop-color="#111"/><stop offset="50%" stop-color="#080808"/><stop offset="82%" stop-color="#111"/><stop offset="100%" stop-color="#030303"/></linearGradient>
        <linearGradient id="battGlassBody" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,255,255,0.03)"/><stop offset="15%" stop-color="rgba(255,255,255,0.22)"/><stop offset="33%" stop-color="rgba(255,255,255,0.05)"/><stop offset="50%" stop-color="rgba(255,255,255,0)"/><stop offset="67%" stop-color="rgba(255,255,255,0.05)"/><stop offset="85%" stop-color="rgba(255,255,255,0.18)"/><stop offset="100%" stop-color="rgba(255,255,255,0.03)"/></linearGradient>
        <linearGradient id="battFillHighlight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,255,255,0.02)"/><stop offset="20%" stop-color="rgba(255,255,255,0.22)"/><stop offset="48%" stop-color="rgba(255,255,255,0.44)"/><stop offset="60%" stop-color="rgba(255,255,255,0.12)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
        ${dual?`<clipPath id="battBodyClipLeft"><rect x="53" y="145" width="30" height="118" rx="6"/></clipPath><clipPath id="battBodyClipRight"><rect x="85" y="145" width="30" height="118" rx="6"/></clipPath>`:`<clipPath id="battBodyClip"><rect x="53" y="145" width="62" height="118" rx="8"/></clipPath>`}
        <filter id="battGlowRed"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="battGlowOrange"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="battGlowGreen"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="battGlowCyan"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="mbShellGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1b2027"/><stop offset="45%" stop-color="#2a313a"/><stop offset="100%" stop-color="#14181d"/></linearGradient>
        <linearGradient id="mbCapGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2d333b"/><stop offset="50%" stop-color="#8b949e"/><stop offset="100%" stop-color="#2d333b"/></linearGradient>
        <linearGradient id="mbSheenGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="rgba(255,255,255,0)"/><stop offset="50%" stop-color="rgba(255,255,255,.35)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
        <clipPath id="mbClip"><rect x="11" y="132" width="46" height="107" rx="10"/></clipPath>
        <clipPath id="skyClip"><rect x="-16" y="0" width="536" height="100"/></clipPath>
        <linearGradient id="shootGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1"><stop id="cloudGradTop" offset="0" stop-color="#e6edf3"/><stop id="cloudGradBot" offset="1" stop-color="#9aa7b8"/></linearGradient>
 <filter id="flowGlow" filterUnits="userSpaceOnUse" x="-20" y="0" width="560" height="520"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="gridNeon" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="battGlowBolt"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="iconGlowOrange" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="rgba(255,140,0,0.6)" result="c"/><feComposite in="c" in2="b" operator="in" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="iconGlowBlue" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="rgba(30,144,255,0.6)" result="c"/><feComposite in="c" in2="b" operator="in" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="iconGlowGreen" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="rgba(46,204,113,0.6)" result="c"/><feComposite in="c" in2="b" operator="in" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="iconGlowYellow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="rgba(255,230,0,0.7)" result="c"/><feComposite in="c" in2="b" operator="in" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse id="skyAura" cx="260" cy="84" rx="230" ry="110" fill="url(#dynAuraG)"/>
      ${this._buildSkySVG()}
      <path d="M 35,78 Q 260,-45 485,78 Z" fill="rgba(30,100,200,.05)"/>
      <line x1="8" y1="78" x2="512" y2="78" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="3,8"/>
      <circle cx="35" cy="78" r="3.5" fill="rgba(255,200,80,.7)"/>
      <circle cx="260" cy="78" r="2.5" fill="rgba(255,255,255,.25)"/>
      <circle cx="485" cy="78" r="3.5" fill="rgba(255,110,55,.7)"/>
      <text class="sm" id="arcRiseLabel" x="35" y="95" fill="rgba(255,255,255,.6)" font-size="12.5" text-anchor="middle">06:00</text>
      <text class="sm" x="260" y="95" fill="rgba(255,255,255,.35)" font-size="12.5" text-anchor="middle">12:00</text>
      <text class="sm" id="arcSetLabel" x="485" y="95" fill="rgba(255,255,255,.6)" font-size="12.5" text-anchor="middle">18:00</text>
      <path d="M 35,78 Q 260,-45 485,78" fill="none" stroke="url(#arcDayGrad)" stroke-width="2.2"/>
      <path d="M 485,78 Q 260,158 35,78" fill="none" stroke="url(#arcNightGrad)" stroke-width="1.5" stroke-dasharray="4,5" opacity=".35"/>
      <g id="arcSunGroup" opacity="1">
        <circle id="arcSunGlow2" cx="260" cy="35" r="28" fill="rgba(255,200,60,.12)" filter="url(#arcSunF)"><animate attributeName="r" values="28;34;28" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;0.9;0.55" dur="2.2s" repeatCount="indefinite"/></circle>
        <circle id="arcSunGlow1" cx="260" cy="35" r="14" fill="rgba(255,200,60,.5)" filter="url(#arcSunF2)"><animate attributeName="r" values="14;17;14" dur="2.2s" repeatCount="indefinite"/></circle>
        <circle id="arcSunDot" cx="260" cy="35" r="7" fill="url(#sunCG)" stroke="rgba(255,255,200,.85)" stroke-width="1.2"><animate attributeName="r" values="7;8;7" dur="2.2s" repeatCount="indefinite"/></circle>
      </g>
      <g id="moonGroup" opacity="0" filter="url(#moonF)">
        <circle id="moonGlow" cx="260" cy="72" r="12" fill="rgba(180,205,255,.18)"/>
        <circle id="moonDot" cx="260" cy="72" r="6" fill="rgba(220,235,255,.92)" stroke="rgba(240,248,255,.9)" stroke-width="1.2"/>
      </g>
      <rect id="arcPvLabelRect" x="162" y="22" width="100" height="28" rx="14" fill="rgba(255,200,50,.22)" stroke="rgba(255,210,60,.5)" stroke-width="1.2"/>
      <text id="arcPvLabelText" x="210" y="39" text-anchor="middle" fill="rgba(255,235,110,.98)" font-size="15" font-weight="800">0 W ⚡</text>
      <g id="pvFlowGroup"></g>

      ${battGhostPath}
      <path d="M 399,175 C 350,175 375,202 315,202" fill="none" stroke="#1e3a5f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
      <path d="M 260,265 V 358" fill="none" stroke="#1e3a5f" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>

      <path id="flowGridIn" d="M 432,175 C 350,175 375,202 315,202" fill="none" stroke="#FF2929" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 6" filter="url(#flowGlow)" opacity="0" style="display:none"><animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.8s" repeatCount="indefinite"/></path>
      <path id="flowGridOut" d="M 432,175 C 350,175 375,202 315,202" fill="none" stroke="#2ecc71" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 6" filter="url(#flowGlow)" opacity="0" style="display:none"><animate attributeName="stroke-dashoffset" from="-24" to="0" dur="0.8s" repeatCount="indefinite"/></path>

      ${battFlowPaths}

      <path id="flowInvLoad" d="M 260,358 V 265" fill="none" stroke="#29c4f6" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="12 6" filter="url(#flowGlow)" opacity="0" style="display:none"><animate attributeName="stroke-dashoffset" from="-24" to="0" dur="0.8s" repeatCount="indefinite"/></path>

      <!-- Battery current/power placed above/below flow bar -->
      ${showBatt1 ? (dual ? battTextDual : battTextSingle) : ''}

      ${battIconSection}

      ${this.config.grid_icon_style === 'classic'
        ? `<g id="gridIconImg" transform="translate(399,133)" style="opacity:1"><image href="${iconPath}/grid-icon.png" x="0" y="0" width="121" height="121" preserveAspectRatio="xMidYMid meet"/></g>`
        : `<g id="gridIconImg" data-modern="1" transform="translate(399,133)" style="color:#8b949e;transition:color .5s">
        <ellipse cx="61" cy="111" rx="42" ry="7" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2"/>
        <ellipse cx="61" cy="111" rx="26" ry="4" fill="currentColor" fill-opacity=".14"/>
        <ellipse cx="61" cy="111" rx="42" ry="7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="6 10" opacity=".8">
          <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="3s" repeatCount="indefinite"/></ellipse>
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" filter="url(#gridNeon)">
          <path d="M45,108 L57,26 L61,10 L65,26 L77,108" stroke-width="2.2"/>
          <path d="M28,34 H94 M36,54 H86" stroke-width="2.2"/>
          <path d="M53,40 L69,54 M69,40 L53,54 M51,62 L71,80 M71,62 L51,80 M48,86 L74,106 M74,86 L48,106 M51,62 H71 M48,86 H74" stroke-width="1.1" stroke-opacity=".75"/>
        </g>
        <g fill="currentColor"><circle cx="30" cy="39" r="2.2"/><circle cx="92" cy="39" r="2.2"/><circle cx="38" cy="59" r="2"/><circle cx="84" cy="59" r="2"/>
          <circle cx="61" cy="10" r="2.4"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle></g>
        <g fill="none" stroke="currentColor" stroke-width="1" stroke-opacity=".55">
          <path d="M92,39 Q106,48 119,43"/><path d="M84,59 Q102,68 119,63"/>
        </g>
        <g id="gridOffMark" style="display:none"><circle cx="61" cy="60" r="34" fill="none" stroke="#f85149" stroke-width="2.5" opacity=".85"/><path d="M37,84 L85,36" stroke="#f85149" stroke-width="2.5" stroke-linecap="round" opacity=".85"/></g>
        <g id="gridWires" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 14" opacity="0">
          <path d="M92,39 Q106,48 119,43"><animate attributeName="stroke-dashoffset" from="0" to="-34" dur="1.2s" repeatCount="indefinite"/></path>
          <path d="M84,59 Q102,68 119,63"><animate attributeName="stroke-dashoffset" from="0" to="-34" dur="1.2s" repeatCount="indefinite"/></path>
        </g>
      </g>`}
      <text id="fcGridVal" x="445" y="271" text-anchor="middle" font-size="15" font-weight="700" fill="#e05c00">-- W</text>
      <text class="md" id="gridImportVal" x="393" y="164" text-anchor="middle" font-size="12" font-weight="600" fill="#cde">-- kWh</text>
      <text class="md" id="gridExportVal" x="393" y="194" text-anchor="middle" font-size="12" font-weight="600" fill="#cde" style="display:none">-- kWh</text>

      ${invBlock}

      ${!modernHome && pv1Show ? `<text id="pv1label" x="-1" y="390" font-size="11" fill="#8b949e" letter-spacing="1">FV1</text>
      <text id="pv1FlowVal" x="-1" y="404" font-size="13.5" font-weight="700" fill="#ffe83c">-- W</text>` : ''}
      ${!modernHome && pv2Show ? `<text id="pv2label" x="-1" y="420" font-size="11" fill="#8b949e" letter-spacing="1">FV2</text>
      <text id="pv2FlowVal" x="-1" y="434" font-size="13.5" font-weight="700" fill="#ffe83c">-- W</text>` : ''}
      ${battBadge}
      ${supplyBlock}
      ${backupBlock}
      ${pv3txt}
      ${pv4txt}

      ${modernHome ? this._buildHouseSVG(pv1Show, pv2Show) : `<g id="homeIconImg" transform="translate(179,339)" style="opacity:1"><image href="${iconPath}/home-icon.png" x="0" y="0" width="160" height="160" preserveAspectRatio="xMidYMid meet"/></g>
      <text id="fcLoadVal" x="174" y="420" text-anchor="end" font-size="13" font-weight="700" fill="#F7F6D3">-- W</text>`}
      ${evtxt}
      </svg></div>`+

      `<div style="display:flex;gap:8px;align-items:center;margin-top:10px">
        <div style="flex:1;display:flex;align-items:center;gap:4px"><span style="font-size:.58rem;color:#8b949e;letter-spacing:1px;text-transform:uppercase">FV</span><div style="flex:1;display:flex;gap:2px;align-items:flex-end;height:10px" id="pvBlocks"></div></div>
        <div style="flex:1;display:flex;align-items:center;gap:4px"><span style="font-size:.58rem;color:#8b949e;letter-spacing:1px;text-transform:uppercase">Pot</span><div style="flex:1;background:#21262d;border-radius:20px;height:9px;overflow:hidden;position:relative"><div id="pwrBar" style="position:absolute;inset:0;right:auto;width:0%;border-radius:20px;background:#3fb950;transition:width .4s,background .4s"></div></div></div>
      </div>
      <div class="dv"></div>
      ${this._orderSections({ bms: !showBattStats ? '' : `<div id="battStatsWrap">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-top:5px">
        <div class="st"><div class="l">${this.config.label_cell_temp_minmax || 'TEMP CELLE MIN/MAX'}</div><div class="v" id="bTemp1">-- °C</div></div>
        <div class="st"><div class="l">${this.config.label_bms_temp || 'TEMP BMS'}</div><div class="v" id="bTemp2">-- °C</div></div>
        <div class="st"><div class="l">${this.config.label_total_pv_gen || 'PRODUZIONE FV TOT.'}</div><div class="v" id="bTotalPvGen">-- kWh</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-top:4px">
        <div class="st"><div class="l">${this.config.label_min_cell || 'Cella Min'}</div><div class="v" id="bMinCell">-- V</div></div>
        <div class="st"><div class="l">${this.config.label_max_cell || 'Cella Max'}</div><div class="v" id="bMaxCell">-- V</div></div>
        <div class="st"><div class="l">${this.config.label_batt_dis || 'Scarica Batt.'}</div><div class="v" id="bBattDis">-- kWh</div></div>
      </div>
      <div style="margin-top:4px">
        <div class="st" style="display:flex;flex-direction:row;align-items:flex-end;justify-content:space-between;gap:8px;padding:4px 9px 5px;width:100%;box-sizing:border-box">
          <div class="l" id="bEnduStatLbl" style="margin-bottom:0;white-space:nowrap;line-height:1.4">${this.config.label_endurance || 'AUTONOMIA'}</div>
          <div style="display:flex;align-items:flex-end;gap:10px;flex-shrink:0">
            <div class="v" id="bEnduranceStat" style="font-size:.88rem;line-height:1.2">--</div>
            <div id="bEnduranceTime" style="font-size:.7rem;color:#8b949e;letter-spacing:.3px;white-space:nowrap;line-height:1.4">Fino a --</div>
          </div>
        </div>
      </div>
      </div>`,
      inv: this._secHTML('inv', '☀️ ' + invSection, tiles6 ? `<div class="pvf six">
        <div class="pvi"><div class="ico">☀️</div><div class="lbl">FV Oggi</div><div class="val yw" id="invTodayPv">-- kWh</div></div>
        <div class="pvi"><div class="ico">🔋</div><div class="lbl">Carica Batt</div><div class="val" id="invTodayBattChg">-- kWh</div></div>
        <div class="pvi"><div class="ico">⚡</div><div class="lbl">Scarica Batt</div><div class="val" id="invTodayBattDis">-- kWh</div></div>
        <div class="pvi"><div class="ico">🗼</div><div class="lbl">Prelievo Rete</div><div class="val" id="invTodayGridImp">-- kWh</div></div>
        <div class="pvi"><div class="ico">📤</div><div class="lbl">Immissione</div><div class="val gn" id="invTodayGridExp">-- kWh</div></div>
        <div class="pvi"><div class="ico">🏡</div><div class="lbl">Consumo Oggi</div><div class="val" id="invTodayLoad">-- kWh</div></div>
      </div>` : `<div class="pvf">
        <div class="pvi"><div class="ico">☀️</div><div class="lbl">FV Oggi</div><div class="val yw" id="invTodayPv">-- kWh</div></div>
        <div class="pvi"><div class="ico">🔋</div><div class="lbl">Carica / Scarica</div><div class="val" id="invTodayBattChg">-- kWh</div><div class="val" id="invTodayBattDis" style="font-size:.74rem;color:#8b949e;margin-top:1px">-- kWh</div></div>
        <div class="pvi"><div class="ico">⚡</div><div class="lbl">Residua</div><div class="val" id="invRemCap">-- Ah</div><div class="val" id="invRemKwh" style="font-size:.74rem;color:#8b949e;margin-top:1px">-- kWh</div></div>
        <div class="pvi"><div class="ico">🏡</div><div class="lbl">Consumo Oggi</div><div class="val" id="invTodayLoad">-- kWh</div></div>
      </div>`),
      cons: this._buildConsumersHTML(esc), vent: this._buildVentHTML(esc), stats: this._buildStatsHTML(esc), cam: this._buildCameraHTML(esc) })}
    </div>`;
    this._bindExtraSections();
    this._bindGridSwitch();
    this._bindSections();
    this._bindChartHours();
    this._bindCamera();
  }

  _updateDynamic() {
    if (!this._hass || !this.config) return;
    const root = this.shadowRoot;
    const getEl = (id) => root.getElementById(id);
    const setText = (id, txt) => { const el = getEl(id); if (el) el.textContent = txt; };
    const setAttr = (id, attr, val) => { const el = getEl(id); if (el) el.setAttribute(attr, val); };
    const setDisplay = (id, visible) => { const el = getEl(id); if (!el) return; el.style.display = visible ? '' : 'none'; };

    // Fix #4: use null-aware helper so unavailable/unknown sensors show '--' not '0'
    const _n = (v, fallback = 0) => (v !== null && !isNaN(v)) ? v : fallback;
    const _nullOr0 = (v) => (v !== null && !isNaN(v)) ? v : 0; // for flow/direction values where 0 is valid

    const pv1 = _n(this._val(this.config.pv1_power, true));
    const pv2 = _n(this._val(this.config.pv2_power, true));
    const pv3 = this.config._show_pv_extra ? _n(this._val(this.config.pv3_power, true)) : 0;
    const pv4 = this.config._show_pv_extra ? _n(this._val(this.config.pv4_power, true)) : 0;
    const totalPvSensor = this._val(this.config.pv_total_power, true);
    const pvTotal = (totalPvSensor !== null && !isNaN(totalPvSensor) && totalPvSensor > 0) ? totalPvSensor : pv1 + pv2 + pv3 + pv4;
    const _gridPrimary = this._val(this.config.grid_active_power, true);
    let gridActive = _gridPrimary !== null ? _gridPrimary : _nullOr0(this._val(this.config.grid_power_alt, true));
    if (this.config.invert_grid_power) gridActive = -gridActive;
    const gridImport = _n(this._val(this.config.grid_import_energy));
    const gridExport = _n(this._val(this.config.grid_export_energy));
    const load = _n(this._val(this.config.consump, true));
    // Fix #9: store raw null so we can show '--' and use toFixed(2) to avoid float artefacts
    const _todayPvRaw = this._val(this.config.today_pv);
    const _todayBattChgRaw = this._val(this.config.today_batt_chg);
    const _todayLoadRaw = this._val(this.config.today_load);
    const todayPv = _n(_todayPvRaw);
    const todayBattChg = _n(_todayBattChgRaw);
    const todayLoad = _n(_todayLoadRaw);
    const battSoc1 = _n(this._val(this.config.battery_soc) ?? this._val(this.config.goodwe_battery_soc));
    let battPwr1 = _nullOr0(this._val(this.config.battery_power, true));
    if (this.config.invert_battery_power) battPwr1 = -battPwr1;
    let battCurr1 = _nullOr0(this._val(this.config.battery_current) ?? this._val(this.config.goodwe_battery_curr));
    if (this.config.invert_battery_power) battCurr1 = -battCurr1;
    const battVolt1 = _n(this._val(this.config.battery_voltage));
    const temp1_1 = _n(this._val(this.config.battery_temp1));
    const temp2_1 = _n(this._val(this.config.battery_temp2));
    const mos1 = _n(this._val(this.config.battery_mos));
    const minCell1 = _n(this._val(this.config.battery_min_cell));
    const maxCell1 = _n(this._val(this.config.battery_max_cell));
    const battDis1Raw = this._val(this.config.batt_dis);
    const battDis1 = _n(battDis1Raw);
    const invTemp = _n(this._val(this.config.inv_temp));

    // System limits – direct numbers
    // battery_cap_unit: 'ah' uses battery_full_ah; 'kwh' uses battery_full_wh (stored as kWh, converted to Wh internally)
    const capUnit = this.config.battery_cap_unit || 'ah';
    const fullAh  = capUnit === 'ah'  ? (Number(this.config.battery_full_ah)  || 0) : 0;
    // battery_full_wh entered in kWh (×1000 for internal Wh). In Ah mode, derive Wh from Ah × live voltage.
    // battVolt1 is read below — forward-declare safe because JS hoists var, but we use const so we
    // must read voltage first. We re-read it inline here before battVolt1 is const-declared.
    const _voltForCap = _n(this._val(this.config.battery_voltage));
    const fullWh  = capUnit === 'kwh' ? (Number(this.config.battery_full_wh) || 0) * 1000
                                      : (fullAh > 0 && _voltForCap > 0 ? fullAh * _voltForCap : 0);
    const invMax = Number(this.config.inverter_max_power) || 6000;
    const pvMax  = Number(this.config.pv_max_power)       || 7500;

    const remCap1 = fullAh > 0 ? (battSoc1 / 100) * fullAh : 0;
    // Fix #14: dual-battery charging ETA — battery2_full_wh entered in kWh, ×1000 for internal Wh
    const fullWh2 = Number(this.config.battery2_full_wh) > 0 ? Number(this.config.battery2_full_wh) * 1000 : fullWh;

    const dual = !!(this.config._show_battery2);
    const battSoc2 = dual ? _n(this._val(this.config.battery2_soc)) : 0;
    let battPwr2 = dual ? _nullOr0(this._val(this.config.battery2_power, true)) : 0;
    let battCurr2 = dual ? _nullOr0(this._val(this.config.battery2_current)) : 0;
    if (dual && this.config.invert_battery_power) { battPwr2 = -battPwr2; battCurr2 = -battCurr2; }
    const battVolt2 = dual ? _n(this._val(this.config.battery2_voltage)) : 0;
    const mos2 = dual ? _n(this._val(this.config.battery2_mos)) : 0;

    const chargerPower = _n(this._val(this.config.charger_power, true));
    const chargerCurrent = _n(this._val(this.config.charger_current));
    const chargerSoc = _n(this._val(this.config.charger_soc));
    const chargerEtaSensor = this._val(this.config.charger_eta);
    const chargerBattCapWh = Number(this.config.charger_battery_capacity_wh) || 0;
    const chargerStateStr = this._strVal(this.config.charger_state);

    const sun = this._sunData();
    const auraEl = getEl('skyAura');
    if (auraEl) auraEl.setAttribute('cy', (94 - Math.round((sun.bell || 0.5) * 22)).toString());
    ['arcSunDot', 'arcSunGlow1', 'arcSunGlow2'].forEach(id => { const e = getEl(id); if (e) { e.setAttribute('cx', sun.bx); e.setAttribute('cy', sun.by); } });
    getEl('arcSunGroup')?.setAttribute('opacity', sun.night ? '0' : '1');
    this._updateSky(sun);
    const moonGroup = getEl('moonGroup');
    if (sun.night) {
      ['moonGlow', 'moonDot'].forEach(id => { const e = getEl(id); if (e) { e.setAttribute('cx', sun.mx || 260); e.setAttribute('cy', sun.my || 72); } });
      if (moonGroup) moonGroup.setAttribute('opacity', '1');
    } else { if (moonGroup) moonGroup.setAttribute('opacity', '0'); }

    const pvTxt = (pvTotal >= 1000 ? (pvTotal / 1000).toFixed(2) + ' kW' : pvTotal.toFixed(0) + ' W') + ' ⚡';
    const pvLabelRect = getEl('arcPvLabelRect');
    const pvLabelText = getEl('arcPvLabelText');
    if (pvLabelRect) { pvLabelRect.setAttribute('x', sun.t < 0.5 ? Math.max(4, sun.bx - 108) : Math.min(sun.bx + 14, 420)); pvLabelRect.setAttribute('y', Math.max(2, sun.by - 28)); }
    if (pvLabelText) { pvLabelText.setAttribute('x', sun.t < 0.5 ? Math.max(52, sun.bx - 60) : Math.min(sun.bx + 62, 468)); pvLabelText.setAttribute('y', Math.max(19, sun.by - 11)); pvLabelText.textContent = pvTxt; }
    setText('arcRiseLabel', sun.rise);
    setText('arcSetLabel', sun.set);

    if (pvTotal !== this._prevPvTotal || sun.bx !== this._prevSunPos.bx || sun.by !== this._prevSunPos.by) {
      this._prevPvTotal = pvTotal; this._prevSunPos = { bx: sun.bx, by: sun.by };
      const pvGroup = getEl('pvFlowGroup');
      if (pvGroup) pvGroup.innerHTML = this._buildPvWaveHTML(sun.bx, sun.by, pvTotal);
    }

    const flowDur = (w) => Math.max(0.5, 3.0 - (Math.min(Math.abs(w), 8000) / 8000) * 2.5).toFixed(2) + 's';
    const setFlow = (id, show, watts, durStr, color) => {
      const el = getEl(id); if (!el) return;
      el.setAttribute('opacity', show ? '1' : '0'); el.style.display = show ? '' : 'none';
      if (show && durStr !== undefined) { const anim = el.querySelector('animate'); if (anim) anim.setAttribute('dur', durStr); }
      if (color !== undefined) el.setAttribute('stroke', color);
    };

    const absPwr1 = Math.abs(battPwr1);
    const isCharging1 = battPwr1 > 10;
    const showBattIn = battPwr1 > 10;
    const showBattOut = battPwr1 < -10;
    let battLineColor = '#8b949e', battDur = '4.0s', battShowIn = false, battShowOut = false;
    if (absPwr1 < 10) { battShowIn = false; battShowOut = false; }
    else if (absPwr1 < 50) { battShowIn = showBattIn; battShowOut = showBattOut; battLineColor = '#8b949e'; }
    else { battShowIn = showBattIn; battShowOut = showBattOut; battDur = flowDur(absPwr1);
      battLineColor = '#00c8ff'; }  // v1.8.0: battery flow always in the battery blue
    setFlow('flowBattIn', battShowIn, absPwr1, battDur, battLineColor);
    setFlow('flowBattOut', battShowOut, absPwr1, battDur, battLineColor);
    setFlow('flowGridIn', gridActive > 10, gridActive, flowDur(gridActive), '#FF2929');
    setFlow('flowGridOut', gridActive < -10, Math.abs(gridActive), flowDur(Math.abs(gridActive)), '#2ecc71');

    // flowInvLoad color — matches the dominant source feeding the home load
    // PV    → #ffe83c  (yellow,  matches PV flow lines)
    // Batt  → #f39c4b / #e67e22 / #f85149  (orange→red, matches battLineColor)
    // Grid  → #FF2929  (red,     matches flowGridIn)
    const absGrid = Math.abs(gridActive > 10 ? gridActive : 0);  // only count grid import
    const absBattOut = battPwr1 < -10 ? Math.abs(battPwr1) : 0;  // only count discharge
    const absPvLoad = pvTotal > 10 ? pvTotal : 0;
    // v1.9.0: house colour = mix of its sources, weighted by how much each one supplies:
    //   solar  = PV left after charging the battery and exporting  → yellow
    //   battery = discharge power                                  → battery blue
    //   grid    = import power                                     → red
    const pvToLoad = Math.max(0, absPvLoad - Math.max(0, battPwr1 + battPwr2) - (gridActive < -10 ? -gridActive : 0));
    const battToLoad = Math.max(0, -(battPwr1 + battPwr2));
    const srcSum = pvToLoad + battToLoad + absGrid;
    const SRC = { pv: [255, 232, 60], batt: [0, 200, 255], grid: [255, 41, 41] };
    let loadFlowColor = '#ffe83c';
    this._loadMix = { pv: 1, batt: 0, grid: 0 };
    if (srcSum > 10) {
      const w = { pv: pvToLoad / srcSum, batt: battToLoad / srcSum, grid: absGrid / srcSum };
      const rgb = [0, 1, 2].map(k => Math.round(w.pv * SRC.pv[k] + w.batt * SRC.batt[k] + w.grid * SRC.grid[k]));
      // keep mixes bright: scale up so the strongest channel reaches at least 230
      const mx = Math.max(...rgb), f = mx > 0 && mx < 230 ? 230 / mx : 1;
      loadFlowColor = '#' + rgb.map(v => Math.min(255, Math.round(v * f)).toString(16).padStart(2, '0')).join('');
      this._loadMix = w;
    }
    setFlow('flowInvLoad', load > 10, load, flowDur(load), loadFlowColor);

    // Icon glows
    const battIconWrap = getEl('battIconWrap');
    if (battIconWrap) { battIconWrap.setAttribute('filter', absPwr1 >= 50 ? 'url(#iconGlowBlue)' : ''); }
    const gridImg = getEl('gridIconImg');
    if (gridImg && gridImg.dataset.modern) {
      const offGrid = this._gridOnState() === false;
      const gCol = offGrid ? '#6e7681' : gridActive > 10 ? '#FF2929' : gridActive < -10 ? '#2ecc71' : '#8b949e';
      gridImg.style.color = gCol;
      const offMark = getEl('gridOffMark'); if (offMark) offMark.style.display = offGrid ? '' : 'none';
      const wires = getEl('gridWires');
      if (wires) {
        wires.setAttribute('opacity', Math.abs(gridActive) > 10 ? '1' : '0');
        // dots run toward the tower when importing, away from it when exporting
        wires.querySelectorAll('animate').forEach(a => { a.setAttribute('from', gridActive > 10 ? '-34' : '0'); a.setAttribute('to', gridActive > 10 ? '0' : '-34'); });
      }
    } else if (gridImg) { gridImg.style.opacity = Math.abs(gridActive) < 10 ? '0.4' : '1'; gridImg.setAttribute('filter', Math.abs(gridActive) >= 50 ? 'url(#iconGlowOrange)' : ''); }
    const homeImg = getEl('homeIconImg');
    if (homeImg && homeImg.dataset.modern) {
      homeImg.style.color = load > 10 ? loadFlowColor : '#8b949e';
      const win = getEl('homeWindows'); if (win) win.setAttribute('fill', load > 10 ? 'rgba(255,214,102,.55)' : '#1c2128');
      // each slope glows with its own string: full glow at half of the PV array max
      const half = Math.max(100, pvMax / 2);
      // ring under the house: ~25 px/s per kW of load, stopped below 10 W
      if (this._spin) {
        if (!this._spin.rings) this._spin.rings = {};
        if (!this._spin.rings.homeRing) this._spin.rings.homeRing = { off: 0, pps: 0 };
        this._spin.rings.homeRing.pps = load > 10 ? Math.min(180, 8 + load / 1000 * 25) : 0;
      }
      const gl = getEl('hpGlowL'), gr = getEl('hpGlowR');
      const glow = (w) => w > 10 ? (0.25 + 0.65 * Math.min(1, w / half)).toFixed(2) : '0';
      if (gl) gl.setAttribute('opacity', glow(pv1 + pv3));   // left slope: FV1 (+ FV3)
      if (gr) gr.setAttribute('opacity', glow(pv2 + pv4));   // right slope: FV2 (+ FV4)
      // v1.9.0: a producing slope turns PV-yellow, like the sun → inverter flow
      [['roofL', pv1 + pv3], ['roofR', pv2 + pv4]].forEach(([id, w]) => {
        const r = getEl(id); if (!r) return;
        const on = w > 10;
        r.setAttribute('stroke', on ? '#ffe83c' : 'currentColor');
        r.setAttribute('fill', on ? 'rgba(255,232,60,.18)' : '#1b2230');
        r.setAttribute('filter', on ? 'url(#gridNeon)' : '');
      });
    } else if (homeImg) { homeImg.style.opacity = load > 10 ? '1' : '0.7'; homeImg.setAttribute('filter', load > 10 ? 'url(#iconGlowOrange)' : ''); }

    // Battery fill & stats
    if (dual) {
      const fill1 = this._battFill(battSoc1); const fill2 = this._battFill(battSoc2);
      const bf1 = getEl('battFillBar1'); if (bf1) { bf1.setAttribute('y', fill1.y); bf1.setAttribute('height', fill1.height); bf1.setAttribute('fill', fill1.color); bf1.setAttribute('filter', fill1.filter); }
      const bh1 = getEl('battFillHL1'); if (bh1) { bh1.setAttribute('y', fill1.y); bh1.setAttribute('height', fill1.height); }
      const bf2 = getEl('battFillBar2'); if (bf2) { bf2.setAttribute('y', fill2.y); bf2.setAttribute('height', fill2.height); bf2.setAttribute('fill', fill2.color); bf2.setAttribute('filter', fill2.filter); }
      const bh2 = getEl('battFillHL2'); if (bh2) { bh2.setAttribute('y', fill2.y); bh2.setAttribute('height', fill2.height); }
      setText('fcBattVal1', battSoc1 + '%'); setAttr('fcBattVal1', 'fill', fill1.textColor);
      setText('fcBattVal2', battSoc2 + '%'); setAttr('fcBattVal2', 'fill', fill2.textColor);
      setText('battVoltageFlow1', battVolt1.toFixed(1) + ' V'); setText('battVoltageFlow2', battVolt2.toFixed(1) + ' V');
      // Current & power placed outside battery group
      setText('battPwrFlow1', Math.abs(battPwr1).toFixed(0) + ' W');
      setText('battCurrFlow1', battCurr1.toFixed(1) + ' A');
      setText('battPwrFlow2', Math.abs(battPwr2).toFixed(0) + ' W');
      setText('battCurrFlow2', battCurr2.toFixed(1) + ' A');
      const bolt1 = getEl('battBoltGroup1'), bolt2 = getEl('battBoltGroup2');
      if (bolt1) bolt1.setAttribute('opacity', battPwr1 > 10 ? '1' : '0');
      if (bolt2) bolt2.setAttribute('opacity', battPwr2 > 10 ? '1' : '0');
      // Fix #16: bTemp1/bTemp2 written once below in the label override block — skip early write
      // bMinCell, bMaxCell, bBattDis handled by label override block below
    } else {
      const fill = this._battFill(battSoc1);
      const bf = getEl('battFillBar'); if (bf) { bf.setAttribute('y', fill.y); bf.setAttribute('height', fill.height); bf.setAttribute('fill', fill.color); bf.setAttribute('filter', fill.filter); }
      const bh = getEl('battFillHL'); if (bh) { bh.setAttribute('y', fill.y); bh.setAttribute('height', fill.height); }
      setText('fcBattVal', battSoc1 + '%'); setAttr('fcBattVal', 'fill', fill.textColor);
      setText('battVoltageFlow', battVolt1.toFixed(1) + ' V');
      setText('battPwrFlow', absPwr1.toFixed(0) + ' W');
      setText('battCurrFlow', battCurr1.toFixed(1) + ' A');
      const bolt = getEl('battBoltGroup'); if (bolt) bolt.setAttribute('opacity', battPwr1 > 10 ? '1' : '0');
      if (getEl('mbSeg0')) {
        const soc = Math.max(0, Math.min(100, battSoc1));
        const col = soc <= 20 ? '#f85149' : soc <= 40 ? '#f39c4b' : soc <= 75 ? '#3fb950' : '#00c8ff';
        for (let i = 0; i < 10; i++) {
          const frac = Math.max(0, Math.min(1, soc / 10 - i));
          const seg = getEl('mbSeg' + i);
          if (!seg) continue;
          seg.setAttribute('fill', frac > 0 ? col : '#1c2128');
          seg.setAttribute('opacity', frac > 0 ? (0.35 + 0.65 * frac).toFixed(2) : '1');
        }
        setAttr('fcBattVal', 'fill', '#fff');
        // sheen runs upward while charging (filling) and downward while discharging (draining)
        setAttr('mbSheenUp', 'opacity', battPwr1 >= 50 ? '1' : '0');
        setAttr('mbSheenDown', 'opacity', battPwr1 <= -50 ? '1' : '0');
      }
      // Fix #16: bTemp1/bTemp2 written once below in the label override block — skip early write
      // bMinCell, bMaxCell, bBattDis handled by label override block below
    }

    // Color and value for cell tiles — handled by label override block below

    // Endurance — works in both Ah mode (needs voltage to get Wh) and kWh mode (direct)
    let endHours = null, endText = '--', endColor = '#8b949e', isETA = false;
    const _socPct = battSoc1;  // use SOC directly for colour
    // v1.7.0: autonomy down to a reserve SOC, charge time up to a target SOC
    const socMin = Math.max(0, Math.min(95, Number(this.config.battery_reserve_soc) || 0));
    const socMax = Math.max(socMin + 5, Math.min(100, Number(this.config.battery_target_soc) || 100));
    const usable = (soc) => Math.max(0, soc - socMin) / 100;   // fraction above the reserve
    const missing = (soc) => Math.max(0, socMax - soc) / 100;  // fraction up to the target
    if (dual) {
      const totalRemWh = usable(battSoc1) * fullWh + usable(battSoc2) * fullWh2;
      const totalCapWh = fullWh + fullWh2;
      const totalPower = battPwr1 + battPwr2;
      if (totalCapWh > 0) {
        if (totalPower < -10) {
          endHours = totalRemWh / Math.abs(totalPower);
          endText = this._fmtEndurance(endHours); endColor = this._remCapColor(_socPct);
        } else if (totalPower > 10) {
          const missingWh = missing(battSoc1) * fullWh + missing(battSoc2) * fullWh2;
          endHours = Math.max(0, missingWh / totalPower);
          endText = this._fmtEndurance(endHours); endColor = '#00d7ff'; isETA = true;
        }
      }
    } else {
      // simpler: remWh from SOC × fullWh; if fullWh=0 (not configured), try Ah×V fallback
      const capWh = fullWh > 0 ? fullWh : (fullAh > 0 && battVolt1 > 0 ? fullAh * battVolt1 : 0);
      const remWhFinal = usable(battSoc1) * capWh;
      if (battPwr1 < -10 && capWh > 0) {
        endHours = remWhFinal / Math.abs(battPwr1);
        endText = this._fmtEndurance(endHours); endColor = this._remCapColor(_socPct);
      } else if (battPwr1 > 10) {
        if (capWh > 0) {
          const missingWh = missing(battSoc1) * capWh;
          endHours = Math.max(0, missingWh / Math.abs(battPwr1));
          endText = this._fmtEndurance(endHours); endColor = '#00d7ff'; isETA = true;
        }
      }
    }
    // Total PV Generation stat tile
    const _totalPvGenEl = getEl('bTotalPvGen');
    if (_totalPvGenEl) {
      const totalPvGenEntity = this.config.total_pv_gen_entity || 'sensor.goodwe_total_pv_generation';
      const totalPvGenState = this._hass && this._hass.states[totalPvGenEntity];
      if (totalPvGenState && totalPvGenState.state !== 'unavailable' && totalPvGenState.state !== 'unknown') {
        const val = parseFloat(totalPvGenState.state);
        const unit = totalPvGenState.attributes?.unit_of_measurement || 'kWh';
        _totalPvGenEl.textContent = isNaN(val) ? '--' : val.toFixed(2) + ' ' + unit;
        _totalPvGenEl.style.color = '#f4d03f';
      } else {
        _totalPvGenEl.textContent = '-- kWh';
        _totalPvGenEl.style.color = '#8b949e';
      }
    }
    const pwrBar = getEl('pwrBar');
    if (pwrBar) {
      pwrBar.style.width = Math.min(absPwr1 / invMax * 100, 100).toFixed(1) + '%';
      pwrBar.style.background = absPwr1 < 50 ? '#8b949e' : isCharging1 ? '#2b59ff' :
        'linear-gradient(to right, #f4d03f, #f39c4b ' + ((absPwr1 / invMax * 100) * 0.5).toFixed(0) + '%, #f85149)';
    }
    const badge = getEl('battStatusBadge');
    if (badge) { badge.textContent = absPwr1 < 50 ? 'RIPOSO' : isCharging1 ? 'CARICA' : 'SCARICA'; badge.style.color = absPwr1 < 50 ? '#8b949e' : isCharging1 ? '#00d7ff' : '#3ce878'; }

    // ── v1.2.0: battery badge under the battery icon ──
    const _bState = absPwr1 < 50 ? 'RIPOSO' : isCharging1 ? 'CARICA' : 'SCARICA';
    const _bCol = absPwr1 < 50 ? '#8b949e' : isCharging1 ? '#00d7ff' : '#3ce878';
    setText('battBadgeText', _bState); setAttr('battBadgeText', 'fill', _bCol);
    setAttr('battBadgeRect', 'stroke', _bCol); setAttr('battBadgeDot', 'fill', _bCol);
    // When the battery badge is drawn, the header badge is redundant
    if (badge && getEl('battBadgeGroup')) badge.style.display = 'none';

    // ── v1.2.0: grid status pill ──
    const gsPill = getEl('gridStatusPill');
    if (gsPill) {
      const raw = this._strVal(this.config.grid_status_entity);
      let txt, col;
      if (!raw || raw === 'unavailable' || raw === 'unknown') { txt = '--'; col = '#8b949e'; }
      else if (/on.?grid|connected|grid.?tied/.test(raw) && !/dis/.test(raw)) { txt = 'IN RETE'; col = '#3fb950'; }
      else if (/off|island|disconnect|fault|backup|outage/.test(raw)) { txt = 'FUORI RETE'; col = '#f85149'; }
      else if (raw === 'on' || raw === 'true' || raw === '1') { txt = 'IN RETE'; col = '#3fb950'; }
      else { txt = raw.toUpperCase(); col = '#f39c4b'; }
      const gOn = this._gridOnState();
      if (this._gridPending && (gOn !== this._gridPending.wasOn || Date.now() > this._gridPending.until)) this._gridPending = null;
      if (this._gridPending) { txt = 'COMMUTAZIONE…'; col = '#f39c4b'; }
      gsPill.classList.toggle('pending', !!this._gridPending);
      if (this._gridSwitchEnabled()) gsPill.title = gOn === true ? 'Tieni premuto per passare FUORI RETE (OFF GRID)' : gOn === false ? 'Tieni premuto per tornare IN RETE (ON GRID)' : '';
      setText('gridStatusText', txt);
      gsPill.style.color = col; gsPill.style.borderColor = col;
      gsPill.style.background = col === '#3fb950' ? 'rgba(63,185,80,.08)' : col === '#f85149' ? 'rgba(248,81,73,.08)' : 'rgba(139,148,158,.08)';
    }

    // ── v1.2.0: EMS mode chip (keeps original casing of the state) ──
    if (getEl('emsModeVal')) {
      const st = this._hass.states[this.config.ems_mode_entity];
      const v = st && st.state !== 'unavailable' && st.state !== 'unknown' ? String(st.state) : '--';
      setText('emsModeVal', v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    }

    // ── v1.2.0: energy supply bar — share of current power by source/sink ──
    if (getEl('supplyGroup')) {
      const sSolar = Math.max(0, pvTotal);
      const bSum = battPwr1 + battPwr2;
      const sChg = bSum > 10 ? bSum : 0;
      const sDis = bSum < -10 ? -bSum : 0;
      const sGrid = gridActive > 10 ? gridActive : 0;
      const tot = sSolar + sChg + sDis + sGrid;
      let x = 352; const W = 158;
      [['supSolar', sSolar], ['supChg', sChg], ['supDis', sDis], ['supGrid', sGrid]].forEach(([id, v]) => {
        const w = tot > 0 ? (v / tot) * W : 0;
        setAttr(id, 'x', x.toFixed(1)); setAttr(id, 'width', w.toFixed(1)); x += w;
      });
    }

    setText('invTempFlow', invTemp.toFixed(1) + ' °C');
    setText('invNameLabel', this.config.inverter_name || 'INV');
    setAttr('invTempFlow', 'fill', invTemp <= 45 ? '#58a6ff' : invTemp <= 55 ? '#f39c4b' : '#f85149');
    const invLoadPct = Math.min(load / invMax * 100, 100).toFixed(0);
    // Fix #8: toFixed() returns a string; use Number() for the colour comparison
    setText('invLoadPctFlow', invLoadPct + '%'); setAttr('invLoadPctFlow', 'fill', Number(invLoadPct) <= 50 ? '#3fb950' : '#f39c4b');

    const gridDir = gridActive > 10 ? '▼ ' : gridActive < -10 ? '▲ ' : '';
    // Fix #7: grid power now auto-switches to kW like load/PV (was always showing W)
    const absGrid2 = Math.abs(gridActive);
    setText('fcGridVal', gridDir + (absGrid2 >= 1000 ? (absGrid2 / 1000).toFixed(2) + ' kW' : absGrid2.toFixed(0) + ' W'));
    setAttr('fcGridVal', 'fill', gridActive > 10 ? '#FF2929' : gridActive < -10 ? '#2ecc71' : '#8b949e');
    setText('gridImportVal', '▼ ' + gridImport.toFixed(2) + ' kWh');
    setDisplay('gridExportVal', gridExport > 0);
    if (gridExport > 0) setText('gridExportVal', '▲ ' + gridExport.toFixed(2) + ' kWh');

    setText('fcLoadVal', load >= 1000 ? (load / 1000).toFixed(2) + ' kW' : load.toFixed(0) + ' W');
    setAttr('fcLoadVal', 'fill', load > 10 ? loadFlowColor : '#8b949e');

    setText('pv1FlowVal', pv1 >= 1000 ? (pv1 / 1000).toFixed(2) + ' kW' : pv1.toFixed(0) + ' W');
    setText('pv2FlowVal', pv2 >= 1000 ? (pv2 / 1000).toFixed(2) + ' kW' : pv2.toFixed(0) + ' W');
    setDisplay('pv3label', this.config._show_pv_extra);
    setDisplay('pv3FlowVal', this.config._show_pv_extra);
    if (this.config._show_pv_extra) setText('pv3FlowVal', pv3 >= 1000 ? (pv3 / 1000).toFixed(2) + ' kW' : pv3.toFixed(0) + ' W');
    setDisplay('pv4label', this.config._show_pv_extra);
    setDisplay('pv4FlowVal', this.config._show_pv_extra);
    if (this.config._show_pv_extra) setText('pv4FlowVal', pv4 >= 1000 ? (pv4 / 1000).toFixed(2) + ' kW' : pv4.toFixed(0) + ' W');

    // Fix #9: use toFixed(2) to prevent floating-point artefacts; show '--' when sensor unavailable
    setText('invTodayPv',      _todayPvRaw      !== null ? todayPv.toFixed(2)      + ' kWh' : '-- kWh');
    setText('invTodayBattChg', _todayBattChgRaw !== null ? todayBattChg.toFixed(2) + ' kWh' : '-- kWh');
    setText('invTodayBattDis', battDis1Raw      !== null ? battDis1.toFixed(2)     + ' kWh' : '-- kWh');
    setText('invTodayLoad',    _todayLoadRaw    !== null ? todayLoad.toFixed(2)    + ' kWh' : '-- kWh');
    setText('sum_inv', 'FV ' + (_todayPvRaw !== null ? todayPv.toFixed(1) : '--') + ' · Consumo ' + (_todayLoadRaw !== null ? todayLoad.toFixed(1) : '--') + ' kWh');
    if (getEl('invTodayGridImp')) {
      const gi = this._val(this.config.grid_import_energy), ge = this._val(this.config.grid_export_energy);
      setText('invTodayGridImp', gi !== null ? gi.toFixed(2) + ' kWh' : '-- kWh');
      setText('invTodayGridExp', ge !== null ? ge.toFixed(2) + ' kWh' : '-- kWh');
    }
    // ── Remaining Ah + kWh ──
    // Each battery uses its OWN Ah capacity; battery2_full_ah defaults to fullAh if not set
    const fullAh2 = capUnit === 'ah'
      ? (Number(this.config.battery2_full_ah) > 0 ? Number(this.config.battery2_full_ah) : fullAh)
      : 0;
    const remCap2 = fullAh2 > 0 ? (battSoc2 / 100) * fullAh2 : 0;
    const totalRemAh = fullAh > 0 ? remCap1 + (dual ? remCap2 : 0) : null;
    // kWh remaining: always SOC-based from configured capacity — never voltage-dependent
    const totalRemKwh = fullWh > 0
      ? ((battSoc1 / 100) * fullWh + (dual ? (battSoc2 / 100) * fullWh2 : 0)) / 1000
      : null;
    const invRemCapEl = getEl('invRemCap');
    const invRemKwhEl = getEl('invRemKwh');
    const remColor = this._remCapColor(battSoc1);
    if (capUnit === 'ah') {
      // Ah mode: integer, no decimal, left-padded with plain spaces to 3 chars wide
      if (invRemCapEl) {
        const ahInt = totalRemAh !== null ? Math.round(totalRemAh) : null;
        invRemCapEl.textContent = ahInt !== null ? String(ahInt).padStart(3, ' ') + ' Ah' : '-- Ah';
        invRemCapEl.style.color = remColor;
        invRemCapEl.style.display = '';
        invRemCapEl.style.fontVariantNumeric = 'tabular-nums';
      }
      if (invRemKwhEl) invRemKwhEl.style.display = 'none';
    } else {
      // kWh mode: always 2 decimal places, e.g. "15.92 kWh"
      if (invRemCapEl) invRemCapEl.style.display = 'none';
      if (invRemKwhEl) {
        invRemKwhEl.textContent = totalRemKwh !== null ? totalRemKwh.toFixed(2) + ' kWh' : '-- kWh';
        invRemKwhEl.style.color = remColor;
        invRemKwhEl.style.display = '';
        invRemKwhEl.style.fontSize = '.88rem';
        invRemKwhEl.style.fontWeight = '700';
        invRemKwhEl.style.marginTop = '0';
      }
    }

    // ── Label entity overrides for stat tiles ──
    // Per-row: override active only when global gate ON AND label text ≠ its default
    const labelsOn = !!(this.config._labels_custom_entities);
    const _rowActive = (labelKey, def) => labelsOn && (this.config[labelKey] || def) !== def;

    // Read value from a custom entity key.
    // Returns {val: number, text: string, isText: false} for numeric entities.
    // Returns {val: null, text: stateString, isText: true} for text-state entities (e.g. "idle", "charging").
    // Returns null when entity is unavailable/unknown/missing.
    const _readVal = (entityKey) => {
      const eid = this.config[entityKey];
      if (!eid) return null;
      const s = this._hass && this._hass.states[eid];
      if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
      const v = parseFloat(s.state);
      if (!isNaN(v)) return { val: v, text: null, isText: false };
      // Non-numeric state (e.g. "idle", "charging", "on grid backup mode")
      return { val: null, text: String(s.state), isText: true };
    };
    // Keep _readNum as numeric-only shortcut (returns number or null)
    const _readNum = (entityKey) => {
      const r = _readVal(entityKey);
      return (r && !r.isText) ? r.val : null;
    };

    // Read the HA unit_of_measurement for a custom entity key.
    const _readUnit = (entityKey) =>
      this._hass?.states[this.config[entityKey]]?.attributes?.unit_of_measurement || '';

    // Smart value formatter: respects the entity's own unit.
    //   W / kW  → auto-range to kW at ≥1000 W
    //   V       → 3 decimal places
    //   °C / °F → 1 decimal place
    //   %       → 1 decimal place
    //   kWh / Wh / MWh → 2 decimal places
    //   anything else  → 2 decimal places
    // Also returns a colour appropriate for the unit.
    const _fmtCustom = (val, unit) => {
      const u = (unit || '').trim();
      let text, color;
      if (u === 'W') {
        if (Math.abs(val) >= 1000) { text = (val / 1000).toFixed(2) + ' kW'; }
        else                        { text = val.toFixed(0) + ' W'; }
        color = '#58a6ff';
      } else if (u === 'kW') {
        text = val.toFixed(2) + ' kW';
        color = '#58a6ff';
      } else if (u === 'V') {
        text = val.toFixed(3) + ' V';
        color = this._cellVoltColor(val);
      } else if (u === '°C' || u === '°F' || u === 'C' || u === 'F') {
        text = val.toFixed(1) + ' ' + (u.startsWith('°') ? u : '°' + u);
        color = this._cellTempColor(val);
      } else if (u === '%') {
        text = val.toFixed(1) + ' %';
        color = this._socColor(val);
      } else if (u === 'kWh' || u === 'Wh' || u === 'MWh') {
        text = val.toFixed(2) + ' ' + u;
        color = '#f4d03f';
      } else if (u === 'A') {
        text = val.toFixed(1) + ' A';
        color = '#cde';
      } else {
        // Unknown unit — show value + unit as-is
        text = val.toFixed(2) + (u ? ' ' + u : '');
        color = '#cde';
      }
      return { text, color };
    };

    // Cell temp tile
    const cellTempCustom = _rowActive('label_cell_temp_minmax', 'TEMP CELLE MIN/MAX') && this.config.label_entity_cell_temp;
    const _cellTempRaw = cellTempCustom ? _readVal('label_entity_cell_temp') : null;
    const temp1Final = (_cellTempRaw && !_cellTempRaw.isText) ? _cellTempRaw.val : temp1_1;
    const cellTempUnit = cellTempCustom ? _readUnit('label_entity_cell_temp') : '°C';

    // BMS temp tile
    const bmsTempCustom = _rowActive('label_bms_temp', 'TEMP BMS') && this.config.label_entity_bms_temp;
    const _bmsTempRaw = bmsTempCustom ? _readVal('label_entity_bms_temp') : null;
    const mosFinal = (_bmsTempRaw && !_bmsTempRaw.isText) ? _bmsTempRaw.val : mos1;
    const bmsTempUnit = bmsTempCustom ? _readUnit('label_entity_bms_temp') : '°C';

    // Min cell tile
    const minCellCustom = _rowActive('label_min_cell', 'Cella Min') && this.config.label_entity_min_cell;
    const _minCellRaw = minCellCustom ? _readVal('label_entity_min_cell') : null;
    const minCellFinal = (_minCellRaw && !_minCellRaw.isText) ? _minCellRaw.val : minCell1;
    const minCellUnit  = minCellCustom ? _readUnit('label_entity_min_cell') : 'V';

    // Max cell tile
    const maxCellCustom = _rowActive('label_max_cell', 'Cella Max') && this.config.label_entity_max_cell;
    const _maxCellRaw = maxCellCustom ? _readVal('label_entity_max_cell') : null;
    const maxCellFinal = (_maxCellRaw && !_maxCellRaw.isText) ? _maxCellRaw.val : maxCell1;
    const maxCellUnit  = maxCellCustom ? _readUnit('label_entity_max_cell') : 'V';

    // Batt dis tile
    const battDisCustom = _rowActive('label_batt_dis', 'Scarica Batt.') && this.config.label_entity_batt_dis;
    const _battDisRaw = battDisCustom ? _readVal('label_entity_batt_dis') : null;
    const battDisFinal = (_battDisRaw && !_battDisRaw.isText) ? _battDisRaw.val : battDis1;
    const battDisUnit  = battDisCustom ? _readUnit('label_entity_batt_dis') : 'kWh';

    // ── Apply overrides to stat tiles ──
    const _bT1o = getEl('bTemp1');
    if (_bT1o) {
      if (cellTempCustom) {
        if (!_cellTempRaw) { _bT1o.textContent = '--'; _bT1o.style.color = '#8b949e'; }
        else if (_cellTempRaw.isText) { _bT1o.textContent = _cellTempRaw.text; _bT1o.style.color = '#c9d1d9'; }
        else { const fmt = _fmtCustom(_cellTempRaw.val, cellTempUnit); _bT1o.textContent = fmt.text; _bT1o.style.color = fmt.color; }
      } else {
        const t1 = this._val(this.config.battery_temp1), t2 = this._val(this.config.battery_temp2);
        const okT = [t1, t2].filter(v => v !== null);
        _bT1o.textContent = okT.length ? [t1, t2].map(v => v === null ? '--' : v.toFixed(1)).join(' / ') + ' °C' : '-- °C';
        _bT1o.style.color = okT.length ? this._cellTempColor(Math.max(...okT)) : '#8b949e';
      }
    }
    const _bT2o = getEl('bTemp2');
    if (_bT2o) {
      if (bmsTempCustom) {
        if (!_bmsTempRaw) { _bT2o.textContent = '--'; _bT2o.style.color = '#8b949e'; }
        else if (_bmsTempRaw.isText) { _bT2o.textContent = _bmsTempRaw.text; _bT2o.style.color = '#c9d1d9'; }
        else { const fmt = _fmtCustom(_bmsTempRaw.val, bmsTempUnit); _bT2o.textContent = fmt.text; _bT2o.style.color = fmt.color; }
      } else {
        const m1 = this._val(this.config.battery_mos);
        _bT2o.textContent = m1 === null ? '-- °C' : m1.toFixed(1) + (dual ? ' / ' + mos2.toFixed(1) : '') + ' °C';
        _bT2o.style.color = m1 === null ? '#8b949e' : this._cellTempColor(dual ? Math.max(mos1, mos2) : mos1);
      }
    }
    const _bMno = getEl('bMinCell');
    if (_bMno) {
      if (minCellCustom) {
        if (!_minCellRaw) { _bMno.textContent = '--'; _bMno.style.color = '#8b949e'; }
        else if (_minCellRaw.isText) { _bMno.textContent = _minCellRaw.text; _bMno.style.color = '#c9d1d9'; }
        else { const fmt = _fmtCustom(_minCellRaw.val, minCellUnit); _bMno.textContent = fmt.text; _bMno.style.color = fmt.color; }
      } else {
        const cMin = this._val(this.config.battery_min_cell);
        _bMno.textContent = cMin === null ? '-- V' : cMin.toFixed(3) + ' V';
        _bMno.style.color = cMin === null ? '#8b949e' : this._cellVoltColor(cMin);
      }
    }
    const _bMxo = getEl('bMaxCell');
    if (_bMxo) {
      if (maxCellCustom) {
        if (!_maxCellRaw) { _bMxo.textContent = '--'; _bMxo.style.color = '#8b949e'; }
        else if (_maxCellRaw.isText) { _bMxo.textContent = _maxCellRaw.text; _bMxo.style.color = '#c9d1d9'; }
        else { const fmt = _fmtCustom(_maxCellRaw.val, maxCellUnit); _bMxo.textContent = fmt.text; _bMxo.style.color = fmt.color; }
      } else {
        const cMax = this._val(this.config.battery_max_cell);
        _bMxo.textContent = cMax === null ? '-- V' : cMax.toFixed(3) + ' V';
        _bMxo.style.color = cMax === null ? '#8b949e' : this._cellVoltColor(cMax);
      }
    }
    const _bDiso = getEl('bBattDis');
    if (_bDiso) {
      if (battDisCustom) {
        if (!_battDisRaw) { _bDiso.textContent = '--'; _bDiso.style.color = '#8b949e'; }
        else if (_battDisRaw.isText) { _bDiso.textContent = _battDisRaw.text; _bDiso.style.color = '#c9d1d9'; }
        else { const fmt = _fmtCustom(_battDisRaw.val, battDisUnit); _bDiso.textContent = fmt.text; _bDiso.style.color = fmt.color; }
      } else {
        _bDiso.textContent = battDis1Raw !== null ? battDis1.toFixed(2) + ' kWh' : '-- kWh';
        _bDiso.style.color = '';
      }
    }

    // ── HTML stat tile — endurance ──
    // Fix #13: remove ETA duplication — label says ETA, value shows only the duration
    const _tillStr = this._fmtTill(endHours);
    const _bEnduStat = getEl('bEnduranceStat');
    if (_bEnduStat) { _bEnduStat.textContent = endText; _bEnduStat.style.color = endColor; }
    const _bEnduStatLbl = getEl('bEnduStatLbl');
    if (_bEnduStatLbl) _bEnduStatLbl.textContent = isETA ? 'TEMPO ALLA RICARICA' : (this.config.label_endurance || 'AUTONOMIA');
    const _bEnduTimeEl = getEl('bEnduranceTime');
    if (_bEnduTimeEl) { _bEnduTimeEl.textContent = _tillStr; _bEnduTimeEl.style.color = endHours !== null ? endColor : '#8b949e'; }

    // ── v1.2.0: backup panel (time + remaining energy) ──
    if (getEl('backupGroup')) {
      setText('backupTimeVal', endHours !== null ? endText : '--');
      setAttr('backupTimeVal', 'fill', endHours !== null ? endColor : '#8b949e');
      // discharging → autonomy down to the reserve; charging → time to the target SOC
      setText('backupTimeLbl', isETA ? 'TEMPO ALLA RICARICA' : 'AUTONOMIA');
      setText('backupTimeSub', endHours === null ? (Math.abs(battPwr1) < 10 ? 'batteria a riposo' : '')
        : isETA ? 'fino al ' + socMax + '%' : 'fino al ' + socMin + '%');
      setAttr('backupTimeSub', 'fill', endHours !== null ? endColor : '#8b949e');
      let remKwh = totalRemKwh;
      if (remKwh === null && fullAh > 0 && battVolt1 > 0) remKwh = (totalRemAh * battVolt1) / 1000;
      setText('backupRemVal', remKwh !== null ? remKwh.toFixed(1) + ' kWh' : '-- kWh');
      setAttr('backupRemVal', 'fill', remKwh !== null ? this._remCapColor(battSoc1) : '#8b949e');
    }

    const pvBlocks = getEl('pvBlocks');
    // Fix #11: guard pvBlocks rebuild (was regenerating 20 divs on every state update)
    if (pvBlocks && pvTotal !== this._prevPvBlocksTotal) {
      this._prevPvBlocksTotal = pvTotal;
      const lit = Math.round((pvTotal / pvMax) * 20); const heights = [20, 35, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]; let html = ''; for (let i = 0; i < 20; i++) html += `<div style="flex:1;background:${i < lit ? 'rgba(255,255,255,0.55)' : '#21262d'};height:${i < lit ? heights[i] : 100}%;opacity:${i < lit ? 1 : 0.35};border-radius:2px;"></div>`; pvBlocks.innerHTML = html;
    }

    // EV (v1.6.0): state from the charger entity, or from the power when no state entity is set
    const evGroup = getEl('evGroup');
    if (evGroup) {
      const evRaw = chargerStateStr;
      const hasEvState = !!this.config.charger_state && evRaw && evRaw !== 'unavailable' && evRaw !== 'unknown';
      const pRaw = this._val(this.config.charger_power, true);
      let mode;
      if (hasEvState) {
        if (/complet|finish|full|termin|piena/.test(evRaw)) mode = 'done';
        else if (/charg|ricaric|in carica/.test(evRaw) && !/dis|not|non |no_|stop|unplug/.test(evRaw)) mode = 'charging';
        else if (evRaw === 'on' || evRaw === 'true') mode = chargerPower > 50 ? 'charging' : 'connected';
        else if (/connect|plug|wait|ready|paus|suspend|collegat|attesa/.test(evRaw) && !/disconn|unplug|scollegat|not_conn/.test(evRaw)) mode = 'connected';
        else mode = 'idle';
      } else mode = chargerPower > 50 ? 'charging' : 'idle';
      const EVM = {
        charging:  { c: '#29c4f6', t: 'IN CARICA' },
        done:      { c: '#3fb950', t: 'CARICA COMPLETA' },
        connected: { c: '#f4d03f', t: 'COLLEGATA' },
        idle:      { c: '#6e7681', t: hasEvState ? 'SCOLLEGATA' : 'IN ATTESA' },
      };
      const m = EVM[mode];
      evGroup.style.color = m.c;
      const evFlow = getEl('flowHomeEV');
      if (evFlow) evFlow.setAttribute('opacity', mode === 'charging' ? '0.9' : '0');
      setAttr('evCable', 'opacity', mode === 'idle' && hasEvState ? '0' : '.7');
      setAttr('evCableFlow', 'opacity', mode === 'charging' ? '.9' : '0');
      setText('evPowerVal', pRaw === null ? '-- W' : (chargerPower >= 1000 ? (chargerPower / 1000).toFixed(2) + ' kW' : chargerPower.toFixed(0) + ' W'));
      setText('evStateVal', m.t);
      const socRaw = this._val(this.config.charger_soc);
      const curRaw = this._val(this.config.charger_current);
      const socTxt = socRaw === null ? '' : 'SOC ' + socRaw.toFixed(0) + '%';
      const curTxt = curRaw === null || mode !== 'charging' ? '' : chargerCurrent.toFixed(1) + ' A';
      setText('evSocVal', [socTxt, curTxt].filter(Boolean).join('  ·  ') || ' ');
      setAttr('evSocBar', 'width', socRaw === null ? '0' : (Math.max(0, Math.min(100, socRaw)) / 100 * 80).toFixed(1));
      let evEta = '';
      if (mode === 'charging') {
        if (chargerEtaSensor !== null && !isNaN(chargerEtaSensor)) evEta = 'piena tra ' + this._fmtTime(chargerEtaSensor / 60);
        else if (chargerBattCapWh && socRaw !== null && chargerPower > 0) evEta = 'piena tra ' + this._fmtTime(chargerBattCapWh * (100 - chargerSoc) / 100 / chargerPower);
      } else if (mode === 'done') evEta = 'Auto carica';
      setText('evEtaVal', evEta);
    }
  }
}
console.info('%c F-FLOW-CARD %c v' + FFC_VERSION + ' ', 'color:#0d1117;background:#f4d03f;font-weight:700', 'color:#f4d03f;background:#161b22;font-weight:700');
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'f-flow-card',
  name: 'F-Flow Card',
  description: 'Card dei flussi energetici in tempo reale (fotovoltaico, batteria, rete) con percorsi animati, doppia batteria, wallbox per auto elettrica ed etichette personalizzabili.',
  preview: true,
  version: FFC_VERSION,
});
customElements.define('f-flow-card', FFlowCard);