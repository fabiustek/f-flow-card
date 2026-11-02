#!/usr/bin/env node
// Regenerates the README pictures in docs/images/ from tools/screenshots/demo.html.
//
//   node tools/screenshots/shoot.js
//
// Needs Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`
// if it is not already available). Run it after every version bump, then commit docs/images/.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'docs', 'images');
const DEMO = 'file://' + path.join(__dirname, 'demo.html');
const MDI = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf8'));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 4200 }, deviceScaleFactor: 2 });
  await page.addInitScript((icons) => { window.MDI = icons; }, MDI);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  const open = async (scene) => {
    await page.goto(DEMO + '#' + scene);
    await page.reload();
    await page.waitForTimeout(1500); // history mock + animations settle
  };
  // Screenshot of the card, optionally cropped to the part between two element ids (inclusive)
  const shot = async (file, fromSel, toSel) => {
    const host = await page.$('#host');
    const hb = await host.boundingBox();
    let clip = hb;
    if (fromSel) {
      const box = async (sel) => (await page.evaluateHandle((s) => window._card.shadowRoot.querySelector(s), sel)).asElement().boundingBox();
      const a = await box(fromSel), b = await box(toSel || fromSel);
      const y0 = Math.max(hb.y, a.y - 10), y1 = Math.min(hb.y + hb.height, b.y + b.height + 10);
      clip = { x: hb.x, y: y0, width: hb.width, height: y1 - y0 };
    }
    await page.screenshot({ path: path.join(OUT, file), clip });
    console.log('✓', file);
  };

  await open('overview');
  await shot('card-overview.png');
  await shot('flow.png', '.hdr', '#pvBlocks');
  await shot('consumers-chart.png', '.cons', '.cch');

  // hover the chart around 20:00 to show the tooltip
  const svg = (await page.evaluateHandle(() => window._card.shadowRoot.getElementById('cChartSvg'))).asElement();
  const sb = await svg.boundingBox();
  await page.mouse.move(sb.x + sb.width * 0.62, sb.y + sb.height * 0.5);
  await page.waitForTimeout(200);
  await shot('chart-tooltip.png', '.cch');
  await page.mouse.move(0, 0);

  await shot('ventilation.png', '#ventBox');

  // grid switch confirmation dialog
  await page.evaluate(() => window._card._askGridSwitch());
  await page.waitForTimeout(150);
  await shot('grid-switch.png', '.hdr', '.gbox');
  await page.evaluate(() => { window._card.shadowRoot.getElementById('gridModal').style.display = 'none'; });

  // statistics section, with the tooltip on the PV chart around 11:00
  const pvSvg = (await page.evaluateHandle(() => window._card.shadowRoot.getElementById('stSvg_pv'))).asElement();
  if (pvSvg) {
    const pb = await pvSvg.boundingBox();
    await page.mouse.move(pb.x + pb.width * 0.52, pb.y + pb.height * 0.5);
    await page.waitForTimeout(200);
    await shot('statistics.png', '#stBox_pv', '#stBox_batt');
    await page.mouse.move(0, 0);
  }

  // wallbox + car (horizontal band around the EV drawing)
  await shot('wallbox.png', '#evPowerVal', '#evSocBar');

  // collapsed sections with their one-line summary
  await page.evaluate(() => {
    const r = window._card.shadowRoot;
    ['inv', 'cons', 'vent'].forEach(k => r.querySelector(`.sec[data-sec=${k}] .sec-t`).click());
    r.querySelector('.sec[data-sec=cons] .pin input').click(); // show both pinned and unpinned looks
  });
  await page.waitForTimeout(150);
  await shot('sections-closed.png', '.sec[data-sec=inv]', '.sec[data-sec=vent]');

  await open('bms');
  await shot('card-bms.png');

  // same card in a phone-sized column (container query: 3 tile columns, bigger labels)
  await open('phone');
  await shot('phone.png', '.hdr', '.pvf');

  await browser.close();
  if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
})();
