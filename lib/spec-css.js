/* 스펙 md → CSS 변환 (브라우저와 Node 공용). chat.html · scripts/build-css.mjs가 같은 코드를 씁니다.
   읽는 규칙은 standard/profile/chat-ui-profile.md의 "파서 계약"입니다. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SpecCSS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const MEDIA = { '@mobile': '(max-width:767px)', '@tablet': '(min-width:768px) and (max-width:1023px)', '@desktop': '(min-width:1024px)' };

  const unq = s => s.trim().replace(/^`+|`+$/g, '').trim();
  function tables(md) {
    const out = []; let cur = null;
    for (const line of md.split('\n')) {
      const t = line.trim();
      if (t.startsWith('|')) {
        const cells = t.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
        if (!cur) { cur = { head: cells.map(unq), rows: [] }; out.push(cur); }
        else if (!/^:?-{3,}/.test(cells[0])) cur.rows.push(cells.map(unq));
      } else cur = null;
    }
    return out;
  }
  const stripFences = md => md.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
  // 스펙 색인(index.md)에 링크된 3·4단계 스타일 문서 (위에서부터 순서대로, 이름이 `단계-순번-`으로 시작하는 문서만)
  const styleFiles = readme => [...new Set([...readme.matchAll(/\]\(((?:3-composition|4-resources)\/\d-\d+-[^)#\s/]+\.md)\)/g)].map(m => m[1]))];

  // read(path): 스펙 폴더(agent_design_system/) 기준 경로의 텍스트를 돌려주는 async 함수
  async function load(read) {
    const tokens = {}, rules = [], files = []; let baseCss = '';
    const names = styleFiles(await read('index.md'));
    const docs = await Promise.all(names.map(f => read(f)));   // 한꺼번에 읽되 처리는 위에서부터 순서대로
    for (let i = 0; i < names.length; i++) {
      const f = names[i], md = docs[i];
      files.push(f);
      for (const m of md.matchAll(/^```css\s*\n([\s\S]*?)^```\s*$/gm)) baseCss += m[1] + '\n';
      for (const tb of tables(stripFences(md))) {
        if (tb.head[0] === '토큰') {
          for (const r of tb.rows) { const light = r[1], dark = (!r[2] || r[2] === '—') ? light : r[2]; tokens[r[0]] = { light, dark }; }
        } else if (tb.head[0] === '셀렉터') {
          for (const r of tb.rows) rules.push({ sel: r[0], prop: r[1], val: r[2] });
        }
      }
    }
    return { tokens, rules, baseCss, files };
  }

  const resolve = (v, tokens, mode) => v.replace(/\{([A-Za-z][\w./-]*)\}/g, (all, k) => tokens[k] ? tokens[k][mode] : all);
  const scope = sel => sel.split(',').map(s => {
    s = s.trim();
    if (s === '&') return '.markdown.markdown';
    if (s.startsWith('.chat')) return '.chat.chat' + s.slice(5);
    return '.markdown.markdown ' + s;
  }).join(', ');

  // 다크 모드 선택자: data-theme="dark"가 조상(html 등)에 있거나 .chat 자신에 있는 경우 모두 맞춤 (4-8 "다크 모드")
  const darkSel = sel => sel.split(',').map(x => x.trim()).flatMap(x => {
    const own = x.match(/^\.chat(?:\.chat)?/);
    return own ? [`[data-theme="dark"] ${x}`, own[0] + '[data-theme="dark"]' + x.slice(own[0].length)] : [`[data-theme="dark"] ${x}`];
  }).join(', ');

  // 한 모드(light | dark)의 CSS. dark이면 모든 선택자를 다크 모드 선택자로 바꿈
  function css(spec, mode) {
    const order = [], decl = {};
    for (const r of spec.rules) {
      const m = r.sel.match(/^(@\w+)\s+(.+)$/), key = r.sel;
      if (!decl[key]) { decl[key] = { media: m ? MEDIA[m[1]] : null, sel: m ? m[2] : r.sel, body: [] }; order.push(key); }
      decl[key].body.push(`${r.prop}:${resolve(r.val, spec.tokens, mode)};`);
    }
    const pre = s => mode === 'dark' ? darkSel(s) : s;
    return {
      base: resolve(spec.baseCss, spec.tokens, mode),
      rules: order.map(k => {
        const d = decl[k], rule = `${pre(scope(d.sel))}{${d.body.join('')}}`;
        return d.media ? `@media ${d.media}{${rule}}` : rule;
      }).join('\n'),
    };
  }

  // 최상위 규칙 단위로 자름 (주석 제거 후, 중괄호 깊이로 구분)
  function statements(cssText) {
    const src = cssText.replace(/\/\*[\s\S]*?\*\//g, ''), out = []; let depth = 0, start = 0;
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}' && --depth === 0) { out.push(src.slice(start, i + 1).trim()); start = i + 1; }
    }
    return out;
  }

  // 시안용 CSS 파일 전체: 고정 구조 + 라이트 + 다크([data-theme="dark"] 선택자)
  function build(spec) {
    const light = css(spec, 'light'), dark = css(spec, 'dark');
    // 고정 구조 CSS 중 토큰 값이 라이트/다크에서 다른 규칙만 다크 덮어쓰기로 추가
    const darkBase = [];
    for (const st of statements(spec.baseCss)) {
      const l = resolve(st, spec.tokens, 'light'), d = resolve(st, spec.tokens, 'dark');
      if (l === d) continue;
      if (st.startsWith('@')) throw new Error('다크 값이 다른 토큰을 쓰는 at-규칙은 지원하지 않습니다: ' + st.slice(0, 40));
      const i = d.indexOf('{');
      darkBase.push(darkSel(d.slice(0, i)) + d.slice(i));
    }
    return [
      '/* 자동 생성: node scripts/build-css.mjs — 직접 고치지 마세요. 원천은 agent_design_system/ 의 스펙 md입니다. */',
      light.base.trim(), '', '/* 라이트 */', light.rules, '', '/* 다크 */', darkBase.join('\n'), dark.rules, '',
    ].join('\n');
  }

  return { MEDIA, tables, stripFences, styleFiles, load, resolve, scope, css, build };
});
