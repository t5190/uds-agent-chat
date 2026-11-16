#!/usr/bin/env node
// 스펙 md에서 시안용 CSS를 만든다 (의존성 없음). 사용: node scripts/build-css.mjs [--check]
// 결과: lib/design-system.css. --check는 파일이 스펙과 맞는지만 확인한다(다르면 종료 코드 1).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SpecCSS = createRequire(import.meta.url)('../lib/spec-css.js');
const OUT = join(ROOT, 'lib/design-system.css');

const spec = await SpecCSS.load(async p => readFileSync(join(ROOT, 'agent_design_system', p), 'utf8'));
// 스펙의 폰트 경로는 화면(루트) 기준이고, 이 CSS는 lib/ 안에 있으므로 lib/ 기준으로 바꾼다
const css = SpecCSS.build(spec).replaceAll("url('lib/vendor/", "url('vendor/");

if (process.argv.includes('--check')) {
  if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== css) {
    console.error('lib/design-system.css가 스펙과 다릅니다. node scripts/build-css.mjs 를 실행하세요.');
    process.exit(1);
  }
  console.log('lib/design-system.css 최신');
} else {
  writeFileSync(OUT, css);
  console.log(`lib/design-system.css 생성: 규칙 ${spec.rules.length}개, 토큰 ${Object.keys(spec.tokens).length}개, ${(css.length / 1024).toFixed(1)}KB`);
}
