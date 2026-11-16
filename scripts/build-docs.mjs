#!/usr/bin/env node
// 문서의 자동 생성 부분을 만든다 (의존성 없음). 사용: node scripts/build-docs.mjs [--check]
// 1) 5-3 "프롬프트 본문": "서비스 지시" 블록 + 5-1 답변 유형 + 2-1 규칙 표(대화 파일 영역 제외)
// 2) docs/open-issues.md: 모든 문서의 "## 미정"과 <!-- 예외: … --> 모음
// --check는 파일이 최신인지만 확인한다(다르면 종료 코드 1).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { ROOT, rel, docFiles, parseFm, stripFences, sections, tables } from './shared.mjs';

const check = process.argv.includes('--check');
const outputs = [];

// ---------- 1) 5-3 프롬프트 본문 ----------
const RULES = join(ROOT, 'agent_design_system/2-rules/2-1-answer.md');
const PROMPT = join(ROOT, 'agent_design_system/5-templates/5-3-system-prompt.md');
const PATTERNS = join(ROOT, 'agent_design_system/5-templates/5-1-patterns.md');
const NOT_TYPES = ['', '유형 고르기', '후속 답변', '참고', '미정'];
const START = '<!-- generated:rules:start -->', END = '<!-- generated:rules:end -->';

const plain = s => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
function promptFrom(rulesMd, promptMd, patternsMd) {
  const service = promptMd.match(/^## 서비스 지시\n[\s\S]*?^```text\n([\s\S]*?)^```$/m);
  if (!service) throw new Error('5-3에 "## 서비스 지시"의 ```text 블록이 없습니다');
  const groups = [];
  for (const s of sections(parseFm(rulesMd).body)) {
    const area = s.title.replace(/\s*\([^)]*\)\s*$/, '');
    if (area === '대화 파일') continue;
    for (const tb of tables(stripFences(s.text))) {
      if (tb.head[0] !== 'ID') continue;
      const iStrength = tb.head.indexOf('강도'), iRule = tb.head.indexOf('규칙');
      const lines = tb.rows.map(r => `- ${r[0]} (${r[iStrength]}) ${plain(r[iRule])}`);
      if (lines.length) groups.push(`[${area}]\n${lines.join('\n')}`);
    }
  }
  if (!groups.length) throw new Error('2-1에서 규칙 표를 찾지 못했습니다');
  const types = sections(stripFences(parseFm(patternsMd).body)).map(s => s.title).filter(t => !NOT_TYPES.includes(t));
  const head = '강도: 필수는 꼭 지키고, 권장은 이유가 있을 때만 달리 하고, 금지는 하지 않는다.';
  const text = `${service[1].trimEnd()}\n\n[답변 유형]\n질문이 어느 유형인지 먼저 판단하고 그 유형의 구조로 답한다: ${types.join(', ')}.\n\n[답변 규칙]\n${head}\n\n${groups.join('\n\n')}\n`;
  return `${START}\n\n\`\`\`text\n${text}\`\`\`\n\n${END}`;
}
{
  const promptMd = readFileSync(PROMPT, 'utf8');
  const block = promptFrom(readFileSync(RULES, 'utf8'), promptMd, readFileSync(PATTERNS, 'utf8'));
  const i = promptMd.indexOf(START), j = promptMd.indexOf(END);
  if (i < 0 || j < 0) throw new Error(`5-3에 ${START} … ${END} 구간이 없습니다`);
  outputs.push([PROMPT, promptMd.slice(0, i) + block + promptMd.slice(j + END.length)]);
}

// ---------- 2) docs/open-issues.md ----------
const ISSUES = join(ROOT, 'docs/open-issues.md');
{
  const open = [], excepts = [];
  for (const f of docFiles()) {
    if (f === ISSUES || /\/templates\//.test(rel(f))) continue;
    const fm = parseFm(readFileSync(f, 'utf8'));
    if (!fm || ['demo', 'example'].includes(fm.meta.type)) continue;
    const link = relative(dirname(ISSUES), f).split('\\').join('/');
    const name = `[${fm.meta.title || rel(f)}](${link})`;
    const body = stripFences(fm.body);
    const todo = sections(body).find(s => s.title === '미정');
    // 항목 안의 상대 링크는 미정 목록 위치 기준으로 다시 씀
    const relink = l => l.replace(/\]\(([^)\s]+)\)/g, (all, href) => /^([a-z][\w+.-]*:|#|\/)/i.test(href) ? all
      : `](${relative(dirname(ISSUES), join(dirname(f), href.split('#')[0])).split('\\').join('/')}${href.includes('#') ? '#' + href.split('#')[1] : ''})`);
    const items = todo ? todo.text.split('\n').filter(l => /^\s*- /.test(l)).map(l => relink(l.trim())) : [];
    if (items.length) open.push(`### ${name}\n\n${items.join('\n')}`);
    for (const m of body.matchAll(/<!--\s*예외:\s*([\s\S]*?)-->/g)) excepts.push(`| ${name} | ${m[1].trim().replace(/\|/g, '\\|')} |`);
  }
  const text = [
    '---', 'id: IDX-OPEN-ISSUES', 'type: index', 'title: 미정 목록', 'status: stable', 'version: 1.0.0',
    'summary: 각 문서의 "## 미정"과 문서 틀 예외를 자동으로 모은 목록입니다.', '---', '',
    '# 미정 목록', '',
    '각 문서의 `## 미정`과 `<!-- 예외: … -->`를 모은 목록입니다. `node scripts/build-docs.mjs`가 만들므로 직접 고치지 않습니다. 결정이 나면 원래 문서에서 그 줄을 지우고 [CHANGELOG](../CHANGELOG.md)에 적습니다.', '',
    '## 문서별 미정', '', open.length ? open.join('\n\n') : '없음', '',
    '## 문서 틀 예외', '', excepts.length ? ['| 문서 | 이유 |', '| --- | --- |', ...excepts].join('\n') : '없음', '',
  ].join('\n');
  outputs.push([ISSUES, text]);
}

// ---------- 쓰기 / 확인 ----------
let stale = 0;
for (const [file, text] of outputs) {
  const same = existsSync(file) && readFileSync(file, 'utf8') === text;
  if (check) { if (!same) { stale++; console.error(`${rel(file)}가 최신이 아닙니다. node scripts/build-docs.mjs 를 실행하세요.`); } }
  else if (!same) { writeFileSync(file, text); console.log(`${rel(file)} 생성`); }
}
if (check) { if (stale) process.exit(1); console.log('생성 문서 최신'); }
