import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

// Auto-increment screenshot filename
const screenshotsDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

let n = 1;
while (fs.existsSync(path.join(screenshotsDir, label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`))) n++;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath  = path.join(screenshotsDir, filename);

// Puppeteer paths — update if Chrome is installed elsewhere
const executablePath = (() => {
  const candidates = [
    'C:/Users/nateh/.cache/puppeteer/chrome/win64-131.0.6778.85/chrome-win64/chrome.exe',
    'C:/Users/mondo/.cache/puppeteer/chrome/win64-131.0.6778.85/chrome-win64/chrome.exe',
    process.env.PUPPETEER_EXECUTABLE_PATH,
  ].filter(Boolean);
  return candidates.find(p => fs.existsSync(p)) || null;
})();

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath || undefined,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: temporary screenshots/${filename}`);
