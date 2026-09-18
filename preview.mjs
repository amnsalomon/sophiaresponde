/* Prévia local opcional. O GitHub Pages serve os arquivos sem executar este script. */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const option = (key, fallback) => { const at = args.indexOf(key); return at >= 0 ? args[at + 1] : fallback; };
const host = option('--host', '127.0.0.1');
const port = Number(option('--port', '4173'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const publicFiles = new Set(['index.html', 'styles.css', 'app.js', 'config.js', 'assets/sophia.webp']);
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html'; }
  catch { res.writeHead(400); res.end(); return; }
  if (pathname === 'preview-mobile') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Prévia local de celular — SophIA</title><style>body{margin:0;background:#e9e7f0;font:16px Arial;text-align:center}p{margin:15px}iframe{display:block;width:390px;height:844px;border:1px solid #c6bedb;margin:0 auto;background:white}</style><p>Prévia local · largura de 390 px</p><iframe src="/preview-repo/" title="Central de ajuda em tela de celular"></iframe></html>');
    return;
  }
  // Caminhos aninhados permitem conferir o comportamento de um repositório Pages.
  if (pathname.startsWith('preview-repo/')) pathname = pathname.slice('preview-repo/'.length) || 'index.html';
  if (!publicFiles.has(pathname)) { res.writeHead(404); res.end('Arquivo não encontrado.'); return; }
  try {
    const bytes = await readFile(path.join(root, pathname));
    res.writeHead(200, { 'Content-Type': types[path.extname(pathname)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404); res.end('Arquivo não encontrado.'); }
});
server.on('error', (error) => { console.error('Não foi possível iniciar a prévia:', error.code); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Prévia da SophIA em http://${host}:${port}/`));
