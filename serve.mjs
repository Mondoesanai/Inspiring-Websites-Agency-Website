import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Try the path as-is first; if it's a directory, append index.html
  let filePath = path.join(__dirname, urlPath);

  // If no extension and doesn't end with .html, try appending /index.html
  const tryIndexHtml = () => {
    const withIndex = path.join(filePath, 'index.html');
    const ext2 = '.html';
    fs.readFile(withIndex, (err2, data2) => {
      if (err2) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[ext2] });
      res.end(data2);
    });
  };

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // No extension → try as a directory index
      if (!ext) { tryIndexHtml(); return; }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Server running at http://localhost:${PORT}\n  Press Ctrl+C to stop.\n`);
});
