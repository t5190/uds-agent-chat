#!/usr/bin/env node
// 시안 HTML이 쓰는 파일을 대상 프로젝트로 복사한다 (의존성 없음). 사용: node scripts/export-assets.mjs [대상 폴더]
// 대상 폴더 기본값은 현재 폴더의 uds-chat/ 입니다. 결과는 <대상>/assets/ 아래에 만들고, HTML은 <대상>/ 바로 아래에 둡니다.
import { cpSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] || 'uds-chat');
const assets = join(out, 'assets');

// [원본, assets 안의 위치]. CSS의 폰트 경로(vendor/fonts/)와 맞춰 둡니다.
const COPY = [
  ['lib/design-system.css', 'design-system.css'],
  ['lib/vendor/fonts', 'vendor/fonts'],
  ['lib/vendor/lottie.min.js', 'vendor/lottie.min.js'],
  ['agent_design_system/assets/symbol/code/web/agent-motion.js', 'agent-motion.js'],
  ['lib/stream-play.js', 'stream-play.js'],
  ['agent_design_system/assets/symbol/resources/motion', 'motion'],
];

if (resolve(out).startsWith(ROOT + '/') || resolve(out) === ROOT) {
  console.error('대상 폴더가 스킬 폴더 안입니다. 사용자 프로젝트 안의 폴더를 지정하세요.');
  process.exit(1);
}
for (const [from, to] of COPY) {
  const src = join(ROOT, from);
  if (!existsSync(src)) { console.error(`원본이 없습니다: ${from}`); process.exit(1); }
  mkdirSync(dirname(join(assets, to)), { recursive: true });
  cpSync(src, join(assets, to), { recursive: true });
}
copyFileSync(join(ROOT, 'scripts/serve.mjs'), join(out, 'serve.mjs'));   // 결과물을 서버로 여는 파일(SKILL.md "결과물 열기")
console.log(`복사 완료: ${assets}\nHTML은 ${out}/ 아래에 만들고 assets/ 경로로 링크하세요. 서버: node ${out}/serve.mjs`);
