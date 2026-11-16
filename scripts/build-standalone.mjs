#!/usr/bin/env node
// 서버 없이 열 수 있는 화면을 dist/에 만든다 (의존성 없음). 사용: node scripts/build-standalone.mjs
// dist/chat.html 을 더블클릭(file://)으로 열면 됩니다.
// 화면 코드는 원본 그대로이고, md 파일과 심볼 모션(Lottie JSON)은 dist/embed.js에 담아 fetch를 대신합니다.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { join, sep } from 'node:path';
import { ROOT, rel, walk } from './shared.mjs';

const OUT = join(ROOT, 'dist');

// 1) 담을 파일: 모든 md + 심볼 모션 Lottie JSON
const files = [
  ...['agent_design_system', 'conversations'].flatMap(d => walk(join(ROOT, d), p => p.endsWith('.md'))),
  ...walk(join(ROOT, 'agent_design_system/assets/symbol'), p => (p.endsWith('.json') && p.includes(`${sep}lottie${sep}`)) || (p.endsWith('.svg') && p.includes(`${sep}source${sep}`))),
];
const embed = {};
for (const f of files) embed[rel(f)] = readFileSync(f, 'utf8');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 2) embed.js — fetch와 Lottie 불러오기를 내장 데이터로 대신한다
const shim = `/* 자동 생성: node scripts/build-standalone.mjs */
window.__EMBED = ${JSON.stringify(embed)};
(function () {
  const key = u => decodeURIComponent(String(u).split('?')[0]).replace(/^\\.\\//, '');
  const realFetch = window.fetch;
  window.fetch = function (u, o) {
    const k = key(u);
    if (k in window.__EMBED) return Promise.resolve(new Response(window.__EMBED[k], { status: 200 }));
    return realFetch ? realFetch.apply(this, arguments) : Promise.reject(new Error('fetch 없음: ' + u));
  };
  const parsed = {};
  window.__lottiePatch = function () {
    const L = window.lottie; if (!L || L.__patched) return;
    const load = L.loadAnimation.bind(L);
    L.loadAnimation = function (o) {
      const k = o && o.path && key(o.path);
      if (k && k in window.__EMBED) { o = Object.assign({}, o, { animationData: parsed[k] || (parsed[k] = JSON.parse(window.__EMBED[k])) }); delete o.path; }
      return load(o);
    };
    L.__patched = true;
  };
})();
`;
writeFileSync(join(OUT, 'embed.js'), shim);

// 3) html — 로컬 스크립트는 안에 넣고, embed.js를 맨 앞에 붙인다
const inline = html => html
  .replace(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g, (all, src) =>
    /^https?:/.test(src) ? all : `<script>\n${readFileSync(join(ROOT, src), 'utf8').replace(/<\/script>/gi, '<\\/script>')}\n</script>` + (/lottie\.min\.js$/.test(src) ? '\n<script>__lottiePatch()</script>' : ''))
  .replace(/<head>/, '<head>\n<script src="embed.js"></script>');
// 폰트는 화면이 lib/vendor/fonts/ 상대 경로로 읽으므로 같은 자리에 복사한다
cpSync(join(ROOT, 'lib/vendor/fonts'), join(OUT, 'lib/vendor/fonts'), { recursive: true });
for (const n of ['chat.html']) {
  const html = inline(readFileSync(join(ROOT, n), 'utf8'));
  writeFileSync(join(OUT, n), html);
}
console.log(`dist/ 생성: md ${files.filter(f => f.endsWith('.md')).length}개 + 모션 ${files.filter(f => f.endsWith('.json')).length}개 + 정지 심볼 ${files.filter(f => f.endsWith('.svg')).length}개`);
