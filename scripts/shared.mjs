// 생성 · 검사 스크립트가 함께 쓰는 함수 (의존성 없음).
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SpecCSS = createRequire(import.meta.url)('../lib/spec-css.js');
export const rel = p => relative(ROOT, p).split(sep).join('/');

// 폴더를 돌며 ok(path)가 참인 파일 경로를 모은다. 점으로 시작하는 이름은 건너뛴다.
export function walk(dir, ok, out = []) {
  for (const n of readdirSync(dir)) {
    if (n.startsWith('.') || n === 'node_modules') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, ok, out);
    else if (ok(p)) out.push(p);
  }
  return out;
}

// 표준 검사 대상 md: 루트의 진입 · 조망 문서와 표준 · 스펙 · 대화 · 기록 폴더
export const DOC_ROOTS = ['AGENTS.md', 'INDEX.md', 'GLOSSARY.md', 'CHANGELOG.md', 'standard', 'agent_design_system', 'conversations', 'docs'];
export const docFiles = () => DOC_ROOTS.map(n => join(ROOT, n)).filter(existsSync)
  .flatMap(p => statSync(p).isDirectory() ? walk(p, f => f.endsWith('.md')) : [p]);

// frontmatter: 한 줄 key: value, 배열은 [A, B]
export function parseFm(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const meta = {}, bad = [], keys = [];
  for (const l of m[1].split('\n')) {
    if (!l.trim()) continue;
    const k = l.match(/^(\w+):\s*(.*)$/);
    if (!k) { bad.push(l); continue; }
    keys.push(k[1]);
    const a = k[2].trim().match(/^\[(.*)\]$/);
    meta[k[1]] = a ? a[1].split(',').map(x => x.trim()).filter(Boolean) : k[2].trim();
  }
  return { meta, bad, keys, body: text.replace(/\r\n/g, '\n').slice(m[0].length) };
}

// 코드 블록을 비운 본문. 들여쓴 울타리도 블록으로 본다(문서 검사용. 스타일 파서는 SpecCSS.stripFences).
export const stripFences = body => body.replace(/^\s*(`{3,}|~{3,})[\s\S]*?^\s*\1\s*$/gm, '');

// H2 단위로 본문을 나눈다: [{ title, text }]
export function sections(body) {
  const out = []; let cur = { title: '', text: '' };
  for (const line of body.split('\n')) {
    const m = line.match(/^## (.+)$/);
    if (m) { out.push(cur); cur = { title: m[1].trim(), text: '' }; }
    else cur.text += line + '\n';
  }
  out.push(cur);
  return out;
}

export const tables = md => SpecCSS.tables(md);
