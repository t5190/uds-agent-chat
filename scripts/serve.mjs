#!/usr/bin/env node
// 시안 폴더를 서버로 띄운다(의존성 없음). 사용: node serve.mjs [포트]  — 이 파일이 있는 폴더를 보여 주고, 숨김 파일은 내보내지 않는다.
// export-assets.mjs가 이 파일을 uds-chat/에 복사한다. 포트가 쓰이고 있으면 다음 포트로 넘어간다.
import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join, extname, normalize, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const BLOCKED = p => p.split(sep).some(seg => seg.startsWith('.')) || p === 'serve.mjs';

const server = createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(ROOT, rel));
    if (!file.startsWith(ROOT + sep) || BLOCKED(file.slice(ROOT.length + 1))) { res.writeHead(403).end('forbidden'); return; }
    if (!(await stat(file)).isFile()) throw new Error('not file');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('not found'); }
});

let port = Number(process.argv[2]) || Number(process.env.PORT) || 8800;
server.on('error', e => { if (e.code === 'EADDRINUSE') server.listen(++port, '127.0.0.1'); else throw e; });
server.on('listening', async () => {
  const base = `http://127.0.0.1:${port}`;
  console.log(`서버 시작: ${base}  (끄기: Ctrl+C)`);
  for (const f of (await readdir(ROOT)).filter(f => f.endsWith('.html')).sort()) console.log(`${base}/${f}`);
});
server.listen(port, '127.0.0.1');
