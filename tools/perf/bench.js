#!/usr/bin/env node
// Performance benchmark of the card on a simulated low-end device.
//
//   node tools/perf/bench.js [label]
//
// Loads tools/screenshots/demo.html (real card, mocked hass) in headless Chromium with the CPU
// slowed down 6× (CDP Emulation.setCPUThrottlingRate) and feeds it 20 hass updates per second,
// like a busy Home Assistant (most updates concern entities the card does not use).
// For each scenario it reports frames per second and how busy the main thread is.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DEMO = 'file://' + path.join(__dirname, '..', 'screenshots', 'demo.html');
const MDI = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'screenshots', 'icons.json'), 'utf8'));
const SECONDS = 6;
const SCENARIOS = [
  { name: 'giorno, tutte le sezioni aperte', hash: 'overview', cfg: { sections_layout: 'stack' } },
  { name: 'giorno, pioggia, menu a schede chiuso', hash: 'overview', cfg: { sections_layout: 'tabs', weather_entity: 'weather.casa' }, states: { 'weather.casa': { state: 'rainy', attributes: {} } } },
  { name: 'notte stellata, menu a schede chiuso', hash: 'night', cfg: { sections_layout: 'tabs' } },
  { name: 'card fuori dallo schermo', hash: 'overview', cfg: { sections_layout: 'stack' }, offscreen: true },
];

(async () => {
  const label = process.argv[2] || '';
  const extra = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  const browser = await chromium.launch();
  const rows = [];
  for (const sc of SCENARIOS) {
    const page = await browser.newPage({ viewport: { width: 540, height: 1400 } });
    await page.addInitScript((icons) => { window.MDI = icons; }, MDI);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(DEMO + '#' + sc.hash);
    await page.waitForTimeout(800);
    await page.evaluate(([cfg, states, off]) => {
      const c = window._card;
      Object.assign(window._hass.states, states || {});
      c.setConfig({ ...c.config, ...cfg });
      c.hass = { ...window._hass };
      if (off) { const sp = document.createElement('div'); sp.style.height = '4000px'; document.body.insertBefore(sp, document.body.firstChild); }
    }, [{ ...sc.cfg, ...extra }, sc.states, !!sc.offscreen]);
    await page.waitForTimeout(1500);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    const m0 = await cdp.send('Performance.getMetrics');
    const frames = await page.evaluate((secs) => new Promise((res) => {
      // 20 hass updates/s: 19 unrelated entities + 1 card sensor (the house load) per second
      let n = 0, frames = 0, running = true;
      const flood = setInterval(() => {
        const h = window._hass; n++;
        const states = { ...h.states, ['sensor.other_' + (n % 300)]: { state: String(Math.random()), attributes: {} } };
        if (n % 20 === 0) states['sensor.load_power'] = { state: String(4000 + Math.round(Math.random() * 900)), attributes: { unit_of_measurement: 'W' } };
        window._hass = { ...h, states };
        window._card.hass = window._hass;
      }, 50);
      const raf = () => { frames++; if (running) requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      setTimeout(() => { running = false; clearInterval(flood); res(frames); }, secs * 1000);
    }), SECONDS);
    const m1 = await cdp.send('Performance.getMetrics');
    const get = (m, k) => (m.metrics.find(x => x.name === k) || {}).value || 0;
    const d = (k) => get(m1, k) - get(m0, k);
    rows.push({
      scenario: sc.name,
      fps: +(frames / SECONDS).toFixed(1),
      'cpu %': Math.round(d('TaskDuration') / SECONDS * 100),
      'script ms/s': Math.round(d('ScriptDuration') / SECONDS * 1000),
      'stile+layout ms/s': Math.round((d('RecalcStyleDuration') + d('LayoutDuration')) / SECONDS * 1000),
      errori: errors.length,
    });
    await page.close();
  }
  await browser.close();
  console.log(label ? '== ' + label + ' ==' : '');
  console.table(rows);
})();
