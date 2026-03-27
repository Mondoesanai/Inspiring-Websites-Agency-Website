import puppeteer from 'puppeteer';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME = (() => {
  const candidates = [
    'C:/Users/mondo/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
    'C:/Users/nateh/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
    process.env.PUPPETEER_EXECUTABLE_PATH,
  ].filter(Boolean);
  return candidates.find(p => fs.existsSync(p)) || null;
})();

const animFile = path.resolve(__dirname, 'hero-animation.html');
const outFile  = path.resolve(__dirname, 'hero-bg.webm');
const DURATION = 10_500; // ms — slightly over one loop for clean trim

console.log('Launching Chrome…');
const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME || undefined,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu-sandbox',
    '--allow-file-access-from-files',
    '--window-size=1920,1080',
    '--force-color-profile=srgb',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

console.log('Loading animation…');
await page.goto(`file:///${animFile.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200)); // let grain pre-compute

/* ── Start MediaRecorder inside the page ── */
console.log(`Recording ${DURATION / 1000}s…`);
await page.evaluate(() => {
  const mimeType = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ].find(m => MediaRecorder.isTypeSupported(m));

  if (!mimeType) throw new Error('No supported webm mime type found');
  console.log('[recorder] using', mimeType);

  const stream   = window.__canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 10_000_000, // 10 Mbps
  });

  window.__recChunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) window.__recChunks.push(e.data); };
  recorder.onstop = () => {
    const blob   = new Blob(window.__recChunks, { type: 'video/webm' });
    const reader = new FileReader();
    reader.onload = () => { window.__videoDataUrl = reader.result; };
    reader.readAsDataURL(blob);
  };

  recorder.start(100); // collect every 100 ms
  window.__recorder = recorder;
});

await new Promise(r => setTimeout(r, DURATION));

await page.evaluate(() => window.__recorder.stop());

console.log('Waiting for encoding…');
await page.waitForFunction(() => typeof window.__videoDataUrl === 'string', { timeout: 20_000 });

const dataUrl = await page.evaluate(() => window.__videoDataUrl);
const base64  = dataUrl.split(',')[1];
fs.writeFileSync(outFile, Buffer.from(base64, 'base64'));

await browser.close();

const mb = (fs.statSync(outFile).size / 1048576).toFixed(1);
console.log(`\n✓  Saved: hero-bg.webm  (${mb} MB)`);
console.log('   → Drop this file into your hero section background.');
