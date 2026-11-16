#!/usr/bin/env node
// setup-guide.html을 만든다 (의존성 없음). 사용: node scripts/build-guide.mjs
// 본문은 scripts/guide-body.html, 스타일은 lib/design-system.css에서 가져온다.
// 서체는 Pretendard CDN에서 받는다(오프라인이면 기본 글꼴). 파일 크기를 줄이려고 base64로 내장하지 않는다. 코드 서체(나눔고딕코딩)는 안내서에 코드 블록이 없어 뺀다.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './shared.mjs';

const read = p => readFileSync(join(ROOT, p), 'utf8');
const version = JSON.parse(read('package.json')).version;
const CDN = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff2/';

const css = read('lib/design-system.css')
  .replace(/@font-face\s*\{[^}]*nanum-gothic-coding[^}]*\}\s*/g, '')
  .replace(/url\('vendor\/fonts\/(Pretendard-[A-Za-z]+\.woff2)'\)/g, `url('${CDN}$1')`);
if (/url\('vendor\/fonts/.test(css)) throw new Error('바꾸지 못한 서체 경로가 남았습니다');

const body = read('scripts/guide-body.html').replaceAll('{{version}}', version);
const html = `<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>시작 가이드</title>
<!-- 자동 생성: node scripts/build-guide.mjs — 직접 고치지 마세요. 본문은 scripts/guide-body.html, 스타일은 lib/design-system.css입니다. 서체는 Pretendard CDN입니다. -->
<style>
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(join(ROOT, 'setup-guide.html'), html);
console.log(`setup-guide.html 생성: ${(html.length / 1048576).toFixed(1)}MB (버전 ${version})`);
