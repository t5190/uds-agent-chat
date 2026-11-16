// 로컬 서버: 프로젝트 폴더를 정적 파일로 보여 준다(의존성 없음). 사용: npm run dev  (포트는 PORT 환경변수, 기본 8765)
// chat.html은 md를 fetch로 읽고, 시안은 file://에서 CSS가 막힐 수 있어 서버로 연다.
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { ROOT } from './shared.mjs';

const PORT = Number(process.env.PORT) || 8765;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const COMPRESS = /^(text\/|application\/(json|javascript))|svg/;   // 글자 파일만 gzip (서체 · 이미지는 이미 압축됨)
// 서버에 올리지 않는 것: 토큰이 든 파일, 숨김 폴더, 생성물이 아닌 도구 폴더
const BLOCKED = p => p.split(sep).some(seg => seg.startsWith('.') && seg !== '.') || p.split(sep).includes('node_modules');

createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(ROOT, rel));
    if (!file.startsWith(ROOT + sep) || BLOCKED(file.slice(ROOT.length + 1))) { res.writeHead(403).end('forbidden'); return; }
    const st = await stat(file);
    if (!st.isFile()) throw new Error('not file');
    // 매번 다시 확인하되(no-cache) 안 바뀌었으면 304로 답한다. md를 고치면 바로 보이고, 큰 파일(모션 · 서체)은 다시 받지 않는다
    const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const type = TYPES[extname(file)] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', 'ETag': etag };
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers).end(); return; }
    let body = await readFile(file);
    if (COMPRESS.test(type) && body.length > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { body = gzipSync(body); headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding'; }
    res.writeHead(200, headers);
    res.end(body);
  } catch { res.writeHead(404).end('not found'); }
}).listen(PORT, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${PORT}`;
  console.log(`서버 시작: ${base}  (끄기: Ctrl+C)\n`);
  console.log(`채팅 화면  ${base}/chat.html`);
  try { for (const f of (await readdir(join(ROOT, 'samples'))).filter(f => f.endsWith('.html')).sort()) console.log(`시안       ${base}/samples/${f}`); } catch {}
  console.log('\n스펙(md)을 고친 뒤 시안 CSS를 새로 만들려면 다른 터미널에서 npm run build');
});
