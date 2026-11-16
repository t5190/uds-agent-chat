#!/usr/bin/env node
// 시안 HTML이 정의한 스타일만 쓰는지 검사한다 (의존성 없음). 사용: node scripts/check-mockup.mjs <파일.html …>
// 위반이 있으면 종료 코드 1. 규칙의 정본은 standard/profile/chat-ui-profile.md의 "시안 규칙"입니다.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = process.argv.slice(2);
if (!files.length) { console.error('사용: node scripts/check-mockup.mjs <파일.html …>'); process.exit(2); }

// 허용 클래스: 4-8 "클래스 목록" 표의 첫 열에 있는 이름
const markup = readFileSync(join(ROOT, 'agent_design_system/4-resources/4-8-markup.md'), 'utf8');
const section = markup.split(/^## 클래스 목록$/m)[1].split(/^## /m)[0];
const allowed = new Set();
for (const line of section.split('\n')) {
  if (!line.startsWith('|')) continue;
  const first = line.split('|')[1] || '';
  for (const m of first.matchAll(/`([^`]+)`/g)) allowed.add(m[1]);
}
allowed.delete('클래스');

const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\(/;
const LENGTH = /(?<![\w.#-])-?\d*\.?\d+(?:px|rem|em|vh|vw|vmin|vmax|pt)\b/;

let bad = 0;
for (const f of files) {
  const html = readFileSync(resolve(f), 'utf8');
  const errs = [];
  const err = m => errs.push(m);

  // (a) 생성 CSS 링크
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  const css = links.find(l => /design-system\.css/.test(l));
  if (!css) err('lib/design-system.css 링크가 없습니다');
  else {
    const href = (css.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    if (!/^https?:/.test(href) && !existsSync(resolve(dirname(resolve(f)), href.split('?')[0]))) err(`design-system.css 경로가 맞지 않습니다: ${href}`);
  }

  // (b) 클래스는 4-8 목록만
  const used = new Set();
  for (const m of html.matchAll(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi))
    for (const c of (m[1] ?? m[2]).split(/\s+/).filter(Boolean)) used.add(c);
  for (const c of used) if (!allowed.has(c)) err(`4-8 클래스 목록에 없는 클래스: ${c}`);

  // (c) 직접 쓴 색·크기 값
  const inline = [...html.matchAll(/\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map(m => m[1] ?? m[2]);
  const blocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  for (const t of [...inline, ...blocks]) {
    const c = t.match(COLOR), l = t.match(LENGTH);
    if (c) err(`직접 쓴 색: ${c[0]}`);
    if (l) err(`직접 쓴 크기: ${l[0]}`);
  }

  // (c-2) SVG 속성: 색은 currentColor · none만, <svg> 자체의 크기는 CSS로
  for (const m of html.matchAll(/\s(fill|stroke|stop-color|color)\s*=\s*["']([^"']*)["']/gi))
    if (COLOR.test(m[2]) || /^[a-z]+$/i.test(m[2]) && !['none', 'currentcolor', 'transparent', 'inherit'].includes(m[2].toLowerCase())) err(`SVG 속성에 직접 쓴 색: ${m[1]}="${m[2]}"`);
  for (const m of html.matchAll(/<svg\b[^>]*>/gi))
    for (const a of m[0].matchAll(/\s(width|height)\s*=\s*["']([^"']*)["']/gi)) err(`<svg>에 직접 쓴 크기: ${a[1]}="${a[2]}"`);

  // (d) 테마
  const theme = (html.match(/<html\b[^>]*\sdata-theme\s*=\s*["']([^"']*)["']/i) || [])[1];
  if (theme && !['light', 'dark'].includes(theme)) err(`data-theme은 light 또는 dark만: ${theme}`);

  // (e) 심볼 모션 필수: 작업 상태 줄(.status)에는 .symbol.is-status, 첫 진입(.landing)에는 .symbol.is-landing
  const hasClass = c => new RegExp(`\\sclass\\s*=\\s*["'][^"']*\\b${c}\\b`).test(html);
  if (hasClass('status') && !/\bsymbol\b[^"']*\bis-status\b/.test(html)) err('.status에 심볼이 없습니다: .symbol.is-status 필수 (4-9)');
  if (hasClass('landing') && !/\bsymbol\b[^"']*\bis-landing\b/.test(html)) err('.landing에 심볼이 없습니다: .symbol.is-landing 필수 (4-9)');
  if ((hasClass('status') || hasClass('landing')) && !/AgentMotion\./.test(html)) err('심볼 재생 코드(AgentMotion.play/state)가 없습니다. samples/ipad-purchase.html을 따르세요');

  // (f) 배경은 뷰포트 끝까지: <body>의 바로 아래 자식이 .chat이어야 고정 CSS가 맞는다
  if (!/<body\b[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*<div\b[^>]*class\s*=\s*["'][^"']*\bchat\b/i.test(html)) err('<body>의 바로 아래 자식은 .chat 하나여야 합니다(배경이 화면을 채우는 조건)');

  if (errs.length) { bad += errs.length; console.log(`✗ ${f}`); errs.forEach(e => console.log(`  - ${e}`)); }
  else console.log(`✓ ${f}`);
}
process.exit(bad ? 1 : 0);
