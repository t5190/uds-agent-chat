#!/usr/bin/env node
// AI Readable 표준 검증 (의존성 없음). 사용: node scripts/validate.mjs
// 필수 위반은 오류(종료 코드 1), 권장 위반은 경고. 기준은 standard/core/doc-standard.md와 standard/profile/chat-ui-profile.md입니다.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, rel, walk, docFiles, parseFm, stripFences, sections, tables } from './shared.mjs';

const TYPES = ['index', 'standard', 'principle', 'rule', 'spec', 'template', 'example', 'document', 'demo'];
const STATUS = ['draft', 'stable', 'deprecated'];
const REQUIRED = ['id', 'type', 'title', 'status', 'version', 'summary'];
const AUDIENCE = ['answer', 'ui', 'both'];
const ID_FORM = /^(P-ANS-\d+|P-UI-\d+|SPEC-\d-\d+|SYM-GUIDE-\d+|EX-\d+|CV-\d+|IDX-[A-Z][A-Z-]*|STD-[A-Z][A-Z-]*|DOC-[A-Z][A-Z-]*)$/;
const RULE_ID = /^(P-ANS|P-UI|ANS|UI-(MSG|MD|IMG|FILE|INPUT|SYM))-\d+$/;
// 구성 · 컴포넌트 · 리소스 문서의 H2 항목과 순서, 항목별 표의 첫 열 (프로필 "H2 항목")
const ITEMS = ['구조', '배치', '크기', '간격', '유형', '상태', '동작', '반응형', '에셋', '참고', '규칙', '스타일', '미정'];
const FIRST_COL = { 구조: '요소', 배치: '요소', 크기: '요소', 간격: '사이', 유형: '유형', 상태: '상태', 반응형: '요소', 에셋: '파일', 규칙: '범위' };
const NO_H3_CHECK = ['참고', '규칙', '스타일', '미정'];
const DIALOG_KEYS = ['id', 'type', 'title', 'status', 'version', 'summary', 'template', 'elements', 'rules', 'ui', 'figma'];
const RULE_HEAD = { rule: ['ID', '강도', '규칙', '근거', '예'], principle: ['ID', '원칙', '뜻'] };

const errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const isTemplate = name => /^standard\/[^/]+\/templates\//.test(name);

// ---------- 읽기 ----------
const docs = [];
for (const f of docFiles()) {
  const name = rel(f), text = readFileSync(f, 'utf8'), fm = parseFm(text);
  if (!fm) { err(name, 'frontmatter 없음'); continue; }
  fm.bad.forEach(l => err(name, `frontmatter가 한 줄 key: value가 아님: ${l}`));
  docs.push({ file: f, name, meta: fm.meta, keys: fm.keys, body: fm.body, template: isTemplate(name) });
}
const real = docs.filter(d => !d.template);
const dialog = d => ['demo', 'example'].includes(d.meta.type);

function kind(d) {
  const n = d.name, t = d.meta.type;
  if (dialog(d)) return '대화';
  if (t === 'index') return '색인';
  if (t === 'principle' || t === 'rule') return '원칙 · 규칙';
  if (t === 'template') return '템플릿';
  if (/^agent_design_system\/3-composition\/3-\d+-/.test(n) || /^agent_design_system\/4-resources\/4-[3-79]-/.test(n)) return '컴포넌트';
  if (/^agent_design_system\/4-resources\/symbol\/(?!index\.md|code\.md)/.test(n)) return '리소스';
  return '참조';
}

// 경고: 그 섹션(또는 문서 머리)에 <!-- 예외: … -->가 있으면 예외로 넘긴다
const hasExcept = s => /<!--\s*예외:/.test(s || '');
function warnIn(d, section, m) {
  const secs = sections(d.body);
  const s = section == null ? secs[0] : secs.find(x => x.title === section);
  if (hasExcept(s && s.text)) return;
  warnings.push(`${d.name}: ${m}`);
}

// ---------- frontmatter ----------
for (const d of docs) {
  const m = d.meta;
  for (const k of REQUIRED) if (!m[k]) err(d.name, `필수 키 없음: ${k}`);
  if (m.type && !TYPES.includes(m.type)) err(d.name, `type 허용 값 아님: ${m.type}`);
  if (m.status && !STATUS.includes(m.status)) err(d.name, `status 허용 값 아님: ${m.status}`);
  if (d.template) continue;
  if (m.version && !/^\d+\.\d+\.\d+$/.test(m.version)) err(d.name, `version이 MAJOR.MINOR.PATCH가 아님: ${m.version}`);
  if (m.id && !ID_FORM.test(m.id)) err(d.name, `ID 접두어가 프로필에 없음: ${m.id}`);
  if (m.type === 'demo' && !/^EX-/.test(m.id || '')) err(d.name, 'demo의 id는 EX-NN');
  if (m.type === 'example' && !/^CV-/.test(m.id || '')) err(d.name, 'example의 id는 CV-NN');
  if (m.audience && !AUDIENCE.includes(m.audience)) err(d.name, `audience 허용 값 아님: ${m.audience}`);
  if (m.stage && !/^[1-5]$/.test(m.stage)) err(d.name, `stage는 1~5: ${m.stage}`);
  if (m.stage && m.type === 'index') err(d.name, '색인 문서에는 stage를 쓰지 않음');
  if (dialog(d)) {
    const order = d.keys.filter(k => DIALOG_KEYS.includes(k));
    if (order.join() !== DIALOG_KEYS.filter(k => d.keys.includes(k)).join()) warnIn(d, null, `frontmatter 키 순서: ${DIALOG_KEYS.join(', ')}`);
  }
}

// ---------- ID ----------
const defined = new Map(), ruleOwner = new Map();
for (const d of docs) {
  const id = d.meta.id;
  if (!id || d.template) continue;
  if (defined.has(id)) err(d.name, `id 중복: ${id} (${defined.get(id)})`);
  defined.set(id, d.name);
}
for (const d of real) if (['principle', 'rule'].includes(d.meta.type)) for (const r of d.meta.rules || []) {
  if (!RULE_ID.test(r)) err(d.name, `규칙 ID 형식이 아님: ${r}`);
  if (ruleOwner.has(r)) err(d.name, `규칙 ID를 두 문서에서 정의: ${r} (${ruleOwner.get(r)})`);
  ruleOwner.set(r, d.name);
}
const known = id => defined.has(id) || ruleOwner.has(id);
for (const d of real) {
  const refs = [...(d.meta.refs || [])];
  if (dialog(d)) refs.push(...(d.meta.rules || []), ...(d.meta.ui || []));
  for (const r of refs) if (!known(r)) err(d.name, `정의되지 않은 ID 참조: ${r}`);
}

// ---------- 링크 ----------
const linkTargets = new Map();
function checkLinks(file, name, body, report = true) {
  const set = new Set();
  for (const m of stripFences(body).replace(/`[^`\n]*`/g, '').matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^([a-z][\w+.-]*:|#)/i.test(href)) continue;
    if (href.startsWith('/')) { if (report) err(name, `절대 경로 링크: ${href}`); continue; }
    const target = resolve(dirname(file), decodeURIComponent(href.split('#')[0]));
    set.add(target);
    if (report && !existsSync(target)) err(name, `깨진 링크: ${href}`);
  }
  return set;
}
for (const d of docs) linkTargets.set(d.file, checkLinks(d.file, d.name, d.body, !d.template && !dialog(d)));
for (const f of ['README.md', ...walk(join(ROOT, '.claude'), p => p.endsWith('.md')).map(rel)]) {
  const p = join(ROOT, f);
  if (existsSync(p)) checkLinks(p, f, readFileSync(p, 'utf8'));
}

// ---------- 색인 ----------
const linked = new Set();
for (const d of real) if (d.meta.type === 'index') (linkTargets.get(d.file) || []).forEach(t => linked.add(t));
for (const d of real) if (d.name !== 'AGENTS.md' && d.name !== 'INDEX.md' && !linked.has(d.file)) err(d.name, '어느 색인에도 등록되어 있지 않음');
const specIndex = linkTargets.get(join(ROOT, 'agent_design_system/index.md')) || new Set();
const ex52 = linkTargets.get(join(ROOT, 'agent_design_system/5-templates/5-2-examples.md')) || new Set();
for (const d of real) {
  if (/^agent_design_system\/(3-composition|4-resources)\/\d-\d+-[^/]+\.md$/.test(d.name) && !specIndex.has(d.file)) err(d.name, '스펙 index.md의 3·4단계 목록에 없음 (화면이 읽지 못함)');
  if (d.meta.type === 'demo' && !ex52.has(d.file)) err(d.name, '5-2의 examples 링크 목록에 없음 (칩이 생기지 않음)');
}
for (const [pre, type, from] of [['EX', 'demo', 0], ['CV', 'example', 1]]) {
  const nums = real.filter(d => d.meta.type === type).map(d => +(d.meta.id || '').replace(`${pre}-`, '')).sort((a, b) => a - b);
  if (nums.some((n, i) => n !== i + from)) warnings.push(`${pre}: ${pre}-NN이 연속이 아님: ${nums.join(',')}`);
}

// ---------- 파일 이름 ----------
for (const p of walk(ROOT, f => f.endsWith('.md'))) {
  const n = rel(p), b = basename(n);
  if (n.startsWith('dist/') || b === 'SKILL.md') continue;
  if (/[A-Z]/.test(b) && n.includes('/')) err(n, '대문자 이름 md는 프로젝트 맨 위에만 둠(하위 폴더 목록은 index.md)');
}

// ---------- 용어 ----------
const glossary = existsSync(join(ROOT, 'GLOSSARY.md')) ? readFileSync(join(ROOT, 'GLOSSARY.md'), 'utf8') : '';
const allowedTerms = [], banned = [];
for (const tb of tables(glossary)) {
  const iUse = tb.head.indexOf('쓰는 말'), iBan = tb.head.indexOf('쓰지 않는 말');
  if (iUse < 0 || iBan < 0) continue;
  for (const r of tb.rows) {
    allowedTerms.push(...r[iUse].split(/,|·/).map(s => s.trim()).filter(Boolean));
    banned.push(...r[iBan].split(',').map(s => s.trim()).filter(s => s && !s.includes('(')));
  }
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ascii = s => /^[A-Za-z]+$/.test(s);
const bannedRe = banned.map(w => [w, new RegExp(ascii(w) ? `(?<![A-Za-z])${esc(w)}(?![A-Za-z])` : esc(w))]);
const maskTerms = s => allowedTerms.filter(t => !ascii(t)).sort((a, b) => b.length - a.length).reduce((acc, t) => acc.split(t).join('□'), s);

// ---------- 문서 구성 ----------
const headings = (text, level) => [...text.matchAll(new RegExp(`^${'#'.repeat(level)} (.+)$`, 'gm'))].map(m => m[1].trim());
for (const d of real) {
  if (dialog(d) || d.meta.status === 'deprecated') continue;   // 폐기 문서는 당시 기록이라 구성 검사에서 뺌
  const k = kind(d), body = stripFences(d.body), secs = sections(body);
  // H1
  const h1 = headings(body, 1);
  const num = (d.name.match(/\/(\d-\d+)-[^/]+\.md$/) || [])[1];
  const want = num ? `${num}. ${d.meta.title}` : d.meta.title;
  if (h1.length !== 1) err(d.name, `H1이 ${h1.length}개`);
  else if (h1[0] !== want) err(d.name, `H1은 "${want}"`);
  // 도입 문장
  const head = secs[0].text.split('\n').filter(l => l.trim() && !/^# /.test(l));
  if (!head.length || /^[-|>]/.test(head[0].trim())) warnIn(d, null, 'H1 바로 뒤에 도입 문장이 없음');
  // 제목의 초안 · 제작중 표시
  for (const h of [...headings(body, 2), ...headings(body, 3)]) if (/\((초안|제작중)\)/.test(h)) warnings.push(`${d.name}: 제목에 초안 · 제작중 표시: ${h}`);
  // 미정은 맨 끝
  const h2 = secs.slice(1).map(s => s.title);
  if (h2.includes('미정') && h2[h2.length - 1] !== '미정') warnIn(d, '미정', '`## 미정`이 맨 끝이 아님');
  // 표 칸 끝 마침표
  let dots = 0;
  for (const tb of tables(body)) if (!['토큰', '셀렉터'].includes(tb.head[0])) for (const r of tb.rows) for (const c of r) if (/[^.…]\.$/.test(c)) dots++;
  if (dots) warnIn(d, null, `표 칸 끝 마침표 ${dots}곳`);
  // 용어 (폐기 문서, 용어집, 변경 이력은 빼고)
  if (d.meta.status !== 'deprecated' && !['GLOSSARY.md', 'CHANGELOG.md', 'docs/open-issues.md'].includes(d.name)) {
    const noStyle = secs.filter(s => s.title !== '스타일').map(s => s.text).join('\n');   // 스타일 표는 파서 계약이라 빼고 봄
    const prose = maskTerms(noStyle.replace(/`[^`\n]*`/g, '').replace(/\]\([^)]*\)/g, ']'));
    const found = new Set(bannedRe.filter(([, re]) => re.test(prose)).map(([w]) => w));
    if (found.size) warnIn(d, null, `쓰지 않는 말: ${[...found].join(', ')}`);
  }

  if (k === '원칙 · 규칙') {
    const want = RULE_HEAD[d.meta.type];
    for (const tb of tables(body)) if (tb.head[0] === 'ID' && tb.head.join() !== want.join()) err(d.name, `${d.meta.type === 'rule' ? '규칙' : '원칙'} 표의 열은 ${want.join(' | ')}`);
    if (d.meta.type === 'rule') for (const t of h2) if (t !== '미정' && !/\(.+\)$/.test(t)) warnIn(d, t, `규칙 영역 H2에 ID 범위가 없음: ${t}`);
  }

  if (k === '컴포넌트' || k === '리소스') {
    // 문서 정보 줄
    const info = head.filter(l => /^- /.test(l)).map(l => (l.match(/^- ([^:]+):/) || [])[1]);
    const order = ['상태', '구현', '규칙'];
    if (info.some(x => !order.includes(x)) || info.some((x, i) => i && order.indexOf(x) < order.indexOf(info[i - 1]))) warnIn(d, null, '문서 정보 줄은 상태 · 구현 · 규칙 순서');
    // H2 항목과 순서
    let last = -1;
    for (const t of h2) {
      const i = ITEMS.indexOf(t);
      if (i < 0) { err(d.name, `H2 항목 밖: ${t}`); continue; }
      if (i < last) warnIn(d, t, `H2 순서: ${t}`);
      last = Math.max(last, i);
    }
    // H3는 구조 표의 요소 이름, 항목별 표의 첫 열
    const parts = new Set();
    const struct = secs.find(s => s.title === '구조');
    if (struct) for (const tb of tables(struct.text)) if (tb.head[0] === '요소') tb.rows.forEach(r => parts.add(r[0]));
    for (const s of secs.slice(1)) {
      if (parts.size && !NO_H3_CHECK.includes(s.title)) for (const h of headings(s.text, 3)) {
        const names = h.split(' · ');
        if (!parts.has(h) && !names.some(n => parts.has(n))) warnIn(d, s.title, `H3 이름이 구조 표에 없음: ${s.title} > ${h}`);
      }
      const col = FIRST_COL[s.title];
      if (col) for (const tb of tables(s.text)) if (!['토큰', '셀렉터'].includes(tb.head[0]) && tb.head[0] !== col) warnIn(d, s.title, `${s.title} 표의 첫 열은 "${col}": ${tb.head[0]}`);
      if (s.title === '규칙' && /(?<![\w-])\d{2,}(?![\w-])/.test(s.text.replace(/[A-Z]+(-[A-Z]+)*-\d+/g, ''))) warnIn(d, '규칙', '`## 규칙`에 값이 있음(값은 다른 항목에)');
    }
  }

  if (k === '템플릿' && d.name.endsWith('5-1-patterns.md')) {
    if (h2[0] !== '유형 고르기') warnIn(d, null, '첫 H2는 "유형 고르기"');
    const end = h2.filter(t => t !== '미정').pop();
    if (end !== '후속 답변') warnIn(d, null, '마지막 유형 H2는 "후속 답변"');
  }
}

// ---------- 4-8 클래스 목록과 생성 CSS ----------
{
  const markup = readFileSync(join(ROOT, 'agent_design_system/4-resources/4-8-markup.md'), 'utf8');
  const css = existsSync(join(ROOT, 'lib/design-system.css')) ? readFileSync(join(ROOT, 'lib/design-system.css'), 'utf8') : '';
  const sec = markup.split(/^## 클래스 목록$/m)[1];
  if (!sec) err('agent_design_system/4-resources/4-8-markup.md', '`## 클래스 목록` 절이 없음 (시안 검사가 읽음)');
  else {
    const missing = [];
    for (const line of sec.split(/^## /m)[0].split('\n')) {
      if (!line.startsWith('|')) continue;
      for (const m of (line.split('|')[1] || '').matchAll(/`([^`]+)`/g)) if (m[1] !== '클래스' && /^[\w-]+$/.test(m[1]) && !new RegExp(`\\.${esc(m[1])}(?![\\w-])`).test(css)) missing.push(m[1]);
    }
    const d48 = docs.find(d => d.name === 'agent_design_system/4-resources/4-8-markup.md');
    if (missing.length) warnIn(d48, '클래스 목록', `클래스 목록에 있으나 생성 CSS에 없는 클래스: ${missing.join(', ')}`);
  }
}

// ---------- 생성 파일, 시안 ----------
{
  const run = (script, args) => spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...args], { encoding: 'utf8' });
  if (run('build-css.mjs', ['--check']).status !== 0) err('lib/design-system.css', '스펙과 다릅니다. npm run build 를 실행하세요');
  const docsGen = run('build-docs.mjs', ['--check']);
  if (docsGen.status !== 0) err('생성 문서', (docsGen.stderr || docsGen.stdout).trim().split('\n').join(' / '));
  const mock = walk(join(ROOT, 'samples'), p => p.endsWith('.html')).map(rel);
  if (mock.length) {
    const r = run('check-mockup.mjs', mock);
    if (r.status !== 0) for (const l of r.stdout.split('\n').filter(x => x.trim() && !x.startsWith('✓'))) err('samples', l.trim());
  }
}

console.log(`문서 ${docs.length}개 검사`);
for (const w of warnings) console.log(`경고  ${w}`);
for (const e of errors) console.log(`오류  ${e}`);
console.log(`오류 ${errors.length}건, 경고 ${warnings.length}건`);
process.exit(errors.length ? 1 : 0);
