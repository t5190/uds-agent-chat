/*!
 * ChatUI — 채팅 UI 가이드(agent_design_system/)대로 AI 채팅 영역을 그리는 렌더러
 *
 *   const chat = ChatUI.mount(document.getElementById('chat'), { theme: 'auto' });
 *   chat.add('user', '질문');
 *   const reply = chat.add('assistant', '');
 *   reply.append(chunk);            // 스트리밍 응답을 받을 때마다
 *   reply.done();                   // 응답이 끝나면 (액션 줄 표시)
 *
 *   // 입력창까지 쓰려면 (agent_design_system/4-resources/4-7-input.md)
 *   ChatUI.mount(el, { composer: true, onSend(text) { const r = chat.add('assistant', ''); … } });
 *
 * 대화 텍스트의 출처 · 리서치 문법(`[출처: id]` 칩, `[출처 목록]`, `[검색: 검색어 | a.org]`, `[상태: …]`, `[단계: …]`)은
 * agent_design_system/4-resources/4-8-markup.md의 "대화 파일 형식"이 정본입니다.
 *
 * 마크다운 파서(marked)가 없으면 이 파일 옆의 vendor/marked.min.js를 자동으로 불러옵니다.
 */
(function (global) {
  'use strict';

  const SELF_SRC = document.currentScript && document.currentScript.src;
  const MARKED_SRC = SELF_SRC ? new URL('vendor/marked.min.js', SELF_SRC).href : 'lib/vendor/marked.min.js';
  const DEFAULTS = { prefix: 'cui-', theme: 'light', css: true, actions: true, symbolBase: 'agent_design_system/assets/symbol/resources/motion/' };
  const KEYWORDS = new Set(('def return import from as if elif else for while in not and or is class try except ' +
    'finally with lambda yield pass break continue raise True False None async await const let var function new this export default print').split(' '));
  const CLAMP_LINES = 5;            // 요청 말풍선 접기 기준 (agent_design_system/4-resources/4-3-message.md)
  const FILES_VISIBLE = 3;          // 첨부 파일 기본 노출 수 (agent_design_system/4-resources/4-6-file.md)
  const MAX_IMAGES = 20;
  const EXAMPLE_REPLAY = 3000;      // 생각 끝을 예시 화면에서 다시 재생하기 전 머무는 시간 ms (표시용, 임시값). 시그니처는 1회 재생 후 멈춤(UI-SYM-01)

  // AI 심볼 (agent_design_system/4-resources/4-9-symbol.md) — 답변 맨 앞 `[심볼: 상태]` 줄
  const SYMBOLS = {
    '시그니처': { motion: 'agent_signature', label: 'AI Agent' },
    '생각 중': { motion: 'agent_thinking_loop', label: '생각하는 중' },
    '생각 끝': { motion: 'agent_thinking_end', label: '생각 끝' },
    '작업 중': { motion: 'agent_working', label: '작업하는 중' },
  };
  const CHEVRON_R = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';
  const PENDING = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/></svg>';
  const TOOL_LINE = /^\[도구\s*:\s*([^\]]+?)\s*\]$/;           // 도구 사용 줄 (3-3)
  const TODO_LINE = /^\[작업\s*(완료|예정)\s*:\s*([^\]]+?)\s*\]$/;   // 작업 목록 카드 항목 (3-3)
  const CHEVRON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>';
  const SYMBOL_LINE = /^\s*\[심볼\s*:\s*(시그니처|생각\s*중|생각\s*끝|작업\s*중)\s*(?:\|\s*([^\]]+?)\s*)?\][ \t]*(?:\n|$)/;   // 공백은 있어도 없어도 됨: [심볼:시그니처] · [심볼: 생각 중]
  const symbolKey = k => k.replace(/\s+/g, '').replace(/^(생각|작업)(중|끝)$/, '$1 $2');
  const STATUS_LINE = /^\s*\[상태\s*:\s*([^\]|]+?)\s*(?:\|\s*(열림)\s*)?\][ \t]*(?:\n|$)/;   // `[상태: 리서치 과정 · 4단계 완료 · 32초]` 끝난 작업 상태 줄 (4-10)
  const COMPLETE_LINE = /^\s*\[완료\s*:\s*([^\]|]+?)\s*(?:\|\s*([^\]]+?)\s*)?\][ \t]*(?:\n|$)/;   // `| 단계 → 단계`는 재생할 때 거쳐 가는 작업 문구(보기에는 안 나옴)   // `[완료: 문구]` 작업 이력 — 심볼 없이 문구만 남음 (4-9, UI-SYM-24)
  const stripSymbol = text => text.replace(SYMBOL_LINE, '').replace(STATUS_LINE, '').replace(COMPLETE_LINE, '');

  // 파일 유형 (agent_design_system/4-resources/4-6-file.md)
  const FILE_TYPES = [
    { cls: 'ppt', label: '프레젠테이션', ext: ['ppt', 'pptx', 'slide'] },
    { cls: 'doc', label: '워드프로세서', ext: ['hwp', 'docx', 'txt'] },
    { cls: 'pdf', label: '문서 뷰어', ext: ['pdf'] },
    { cls: 'xls', label: '스프레드시트', ext: ['xlsx'] },
  ];
  const fileType = name => {
    const ext = String(name).split('.').pop().toLowerCase();
    return FILE_TYPES.find(t => t.ext.includes(ext)) || { cls: 'etc', label: '문서' };
  };

  // 액션 아이콘 (자리 표시용 선 아이콘 — 서비스 DS 아이콘으로 교체 권장)
  const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const THUMB = '<path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3zm0 0 4-8a2.2 2.2 0 0 1 3 2.4L13 9h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.6 21H7"/>';
  const ICONS = {
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
    like: svg(THUMB),
    dislike: svg(`<g transform="rotate(180 12 12)">${THUMB}</g>`),
    share: svg('<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>'),
    regenerate: svg('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
    warn: svg('<path d="M12 4 2.8 20h18.4zM12 10v5M12 17.6v.2"/>'),
    file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    voice: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    send: svg('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    stop: svg('<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none"/>'),
    down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  };
  const ACT_LABEL = { copy: '복사', like: '좋아요', dislike: '싫어요', share: '공유', regenerate: '다시 생성' };
  // 입력창 기본 문구 (agent_design_system/4-resources/4-7-input.md, UI-INPUT-16)
  const COMPOSER = { placeholder: 'Exaone에게 메세지 보내기', note: 'AI는 실수를 할 수 있어요. 중요한 정보는 재차 확인하세요.' };
  const LANDING_COMPOSER = { placeholder: '무엇이든 물어보세요' };   // 첫 진입 입력창 안내 글 (4-7)
  const SCROLL_GAP = 48;            // 이만큼 위로 올라가 있으면 맨 아래로 이동 버튼 표시
  const USER_ACTS = ['copy'];
  const AI_ACTS = ['copy', 'like', 'dislike', 'share', 'regenerate'];

  // ---------- 준비 ----------
  let markedPromise = null;
  function ready() {
    if (global.marked) return Promise.resolve(global.marked);
    if (!markedPromise) markedPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = MARKED_SRC;
      s.onload = () => resolve(global.marked);
      s.onerror = () => reject(new Error('ChatUI: 마크다운 파서를 불러오지 못했습니다 (' + MARKED_SRC + ')'));
      document.head.appendChild(s);
    });
    return markedPromise;
  }

  function injectCSS() {
    if (!ChatUI.css || document.getElementById('cui-style')) return;
    const st = document.createElement('style');
    st.id = 'cui-style';
    st.textContent = ChatUI.css;
    document.head.insertBefore(st, document.head.firstChild);   // 호스트 CSS가 뒤에 오도록 맨 앞에
  }

  // ---------- 텍스트 유틸 ----------
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const optsOf = o => Object.assign({}, DEFAULTS, o);
  const classer = prefix => name => name.split(' ').map(n => prefix + n).join(' ');

  // 한국어 강조 보정: `**호프(HOPE)**는`처럼 닫는 ** 앞이 문장부호이고 뒤에 한글이 붙으면 CommonMark에서
  // 굵게가 풀리므로, 한 줄 안의 **…** / ~~…~~ 를 먼저 HTML로 바꾼다 (코드 펜스 · 인라인 코드 제외)
  function fixEmphasis(md) {
    let fence = null;
    return md.split('\n').map(line => {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (f) { fence = fence ? null : f[1]; return line; }
      if (fence) return line;
      return line.split(/(`+[^`]*`+)/).map((seg, i) => i % 2 ? seg :
        seg.replace(/\*\*(?=\S)([^*\n]*?\S)\*\*/g, '<strong>$1</strong>')
           .replace(/~~(?=\S)([^~\n]*?\S)~~/g, '<del>$1</del>')).join('');
    }).join('\n');
  }

  function highlight(code, c) {
    const re = /(#[^\n]*|\/\/[^\n]*)|([fFrRbB]?"(?:\\.|[^"\\\n])*"|[fFrRbB]?'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index)); last = re.lastIndex;
      const [tok, cm, str, num, id] = m;
      if (cm) out += `<span class="${c('tc')}">${esc(cm)}</span>`;
      else if (str) out += `<span class="${c('ts')}">${esc(str)}</span>`;
      else if (num) out += `<span class="${c('ts')}">${num}</span>`;
      else if (KEYWORDS.has(id)) out += `<span class="${c('tk')}">${id}</span>`;
      else if (/^\s*\(/.test(code.slice(last))) out += `<span class="${c('tf')}">${id}</span>`;
      else out += esc(tok);
    }
    return out + esc(code.slice(last));
  }

  function sanitize(root) {
    root.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(n => n.remove());
    root.querySelectorAll('*').forEach(n => {
      for (const a of [...n.attributes]) {
        if (/^on/i.test(a.name)) n.removeAttribute(a.name);
        if (/^(href|src)$/i.test(a.name) && /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
      }
    });
  }

  function unwrapParagraphs(el) {
    const ps = [...el.children].filter(ch => ch.tagName === 'P');
    ps.forEach((p, i) => {
      const frag = document.createDocumentFragment();
      while (p.firstChild) frag.appendChild(p.firstChild);
      if (i < ps.length - 1 && el.tagName === 'BLOCKQUOTE') {
        frag.appendChild(document.createElement('br'));
        frag.appendChild(document.createElement('br'));
      }
      p.replaceWith(frag);
    });
  }

  const wrapIn = (el, cls) => { const w = document.createElement('div'); w.className = cls; el.replaceWith(w); w.appendChild(el); return w; };
  const htmlEl = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  // 결과 카드 (4-6): 완료 `[결과 파일: 이름 · 설명]` · 실행 중 `[결과 실행 중: 제목 · 진행 문구]` · 실패 `[결과 실패: 제목 · 이유]`, 끝에 ` | 실행 라벨`
  const RESULT_LINE = /^\[결과\s*(파일|실행\s*중|실패)\s*:\s*([^\]·|]+?)\s*(?:·\s*([^\]|]+?))?\s*(?:\|\s*([^\]]+?)\s*)?\]$/;
  function resultCard(kind, name, sub, label, c) {
    const run = /^실행/.test(kind), fail = kind === '실패', t = fileType(name);
    const lab = label || '파일 생성';
    const head = run ? `<div class="${c('result-label is-running')}"><span class="${c('result-spin')}" aria-hidden="true"></span>${esc(lab)} 중</div>` : `<div class="${c('result-label')}">${esc(lab)}</div>`;
    const tile = run ? `${c('file-icon')} ${c('type-wait')}` : fail ? `${c('file-icon')} ${c('type-fail')}` : `${c('file-icon')} ${c('type-' + t.cls)}`;
    const btn = run ? '' : `<button type="button" class="${c('result-btn')}">${fail ? '다시 시도' : '열기'}</button>`;
    return `<div class="${c('rw')}"><div class="${c('result' + (run ? ' is-running' : fail ? ' is-failed' : ''))}">` + head +
      `<div class="${c('result-card')}"><div class="${tile}">${fail ? ICONS.warn : ICONS.file}</div>` +
      `<div class="${c('file-text')}"><div class="${c('result-title')}">${esc(name)}</div><div class="${c('result-sub')}">${esc(sub || (run || fail ? '' : t.label))}</div></div>` +
      btn + `</div></div></div>`;
  }

  // ---------- 출처 (agent_design_system/4-resources/4-10-source.md) ----------
  // 대화 텍스트: `[출처: id]` 문장 끝 칩, `[출처 id: 사이트 | 제목 | 요약 | 날짜 | URL]` 정의 줄, `[검색: a.org, b.org]` 검색 단계 줄
  const SOURCE_DEF = /^\[출처\s+([^\]\s:]+)\s*:\s*(.+)\]\s*$/;
  const SOURCE_MAX_CHIPS = 3;       // 문장 끝 칩은 문장당 최대 3개 (4-10)
  const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };

  function extractSources(md) {
    const defs = new Map(); let fence = null;
    const kept = String(md || '').split('\n').filter(line => {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (f) fence = fence ? null : f[1];
      const m = !fence && line.match(SOURCE_DEF);
      if (!m) return true;
      const parts = m[2].split('|').map(x => x.trim()).filter(Boolean);
      const url = parts.find(x => /^https?:\/\//i.test(x)) || '';
      const rest = parts.filter(x => x !== url);
      const host = url ? hostOf(url) : '';
      defs.set(m[1], { url, site: rest[0] || host, title: rest[1] || rest[0] || host, summary: rest[2] || '', date: rest[3] || '', host: host || rest[0] || '' });
      return false;
    });
    return { md: kept.join('\n'), defs };
  }

  // 파비콘 대체: 검은 원 + 흰색 U (4-10). 실제 파비콘 이미지 연결은 서비스가 함
  const faviconHTML = c => `<span class="${c('favicon')}" aria-hidden="true">U</span>`;

  function chipHTML(d, c) {
    const href = d.url ? ` href="${esc(d.url)}" target="_blank" rel="noopener"` : '';
    const card = `<span class="${c('source-preview')}" role="tooltip"><span class="${c('source-site')}">${faviconHTML(c)}${esc(d.site)}</span>` +
      `<span class="${c('source-title')}">${esc(d.title)}</span>` + (d.summary ? `<span class="${c('source-summary')}">${esc(d.summary)}</span>` : '') +
      (d.date ? `<span class="${c('source-date')}">${esc(d.date)}</span>` : '') + '</span>';
    return `<span class="${c('source-pop')}"><a class="${c('source-chip')}"${href}>${faviconHTML(c)}${esc(d.host)}</a>${card}</span>`;
  }

  function applySourceChips(box, defs, c) {
    const used = [];
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('pre,code') ? NodeFilter.FILTER_REJECT : /\[출처\s*:\s*[^\]\s]+\s*\]/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const parts = n.nodeValue.split(/(\[출처\s*:\s*[^\]\s]+\s*\])/);
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        const id = (part.match(/^\[출처\s*:\s*([^\]\s]+)\s*\]$/) || [])[1];
        const d = id && defs.get(id);
        if (!d) { frag.appendChild(document.createTextNode(part)); return; }
        if (!used.includes(id)) used.push(id);
        const prev = frag.lastChild;
        if (prev && prev.nodeType === 1 && prev.classList.contains(c('source-pop')) && prev.__cuiN >= SOURCE_MAX_CHIPS) return;   // 문장당 최대 3개
        const chip = htmlEl(chipHTML(d, c));
        chip.__cuiN = prev && prev.__cuiN ? prev.__cuiN + 1 : 1;
        frag.appendChild(chip);
      });
      n.replaceWith(frag);
    }
    return used;
  }

  function sourcesHTML(ids, defs, c) {
    if (!ids.length) return '';
    return `<div class="${c('sources')}"><h4>출처</h4><ol>` + ids.map(id => {
      const d = defs.get(id), link = d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.title)}</a>` : esc(d.title);
      return `<li>${faviconHTML(c)}${link}</li>`;
    }).join('') + '</ol></div>';
  }

  const GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/></svg>';
  // `[검색: 검색어 | a.org, b.org]` 검색어 아래 칩 (검색어 없이 칩만 쓰는 경우는 없음)
  function searchChipsHTML(hosts, c) {
    return `<div class="${c('search-chips')}">` + hosts.map(h => `<a class="${c('search-chip')}" href="https://${esc(h)}" target="_blank" rel="noopener">${faviconHTML(c)}${esc(h)}</a>`).join('') + '</div>';
  }
  function searchBlockHTML(body, c) {
    const [q, rest] = body.includes('|') ? [body.slice(0, body.indexOf('|')).trim(), body.slice(body.indexOf('|') + 1)] : ['', body];
    const chips = searchChipsHTML(rest.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean), c);
    return `<div class="${c('search-step')}"><div class="${c('step-head')}">${GLOBE}<span>${esc(q)}</span></div><div class="${c('step-results')}">${chips}</div></div>`;
  }

  // 펼친 리서치 과정(임시, 4-10): `[단계: 제목 · 시간 | 설명 | a.org, b.org]` 줄 묶음
  const STEP_LINE = /^\[단계\s*:\s*([^\]]+?)\s*\]$/;
  const CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 8.5l2.3 2.3 4.7-5"/></svg>';
  function processHTML(lines, c) {
    return `<div class="${c('process')}">` + lines.map(l => {
      const [head, desc, hosts] = l.match(STEP_LINE)[1].split('|').map(x => x.trim());
      const [title, time] = head.split('·').map(x => x.trim());
      const chips = hosts ? `<div class="${c('search-chips')}">` + hosts.split(/\s*,\s*/).filter(Boolean).map(h => `<a class="${c('search-chip')}" href="https://${esc(h)}" target="_blank" rel="noopener">${faviconHTML(c)}${esc(h)}</a>`).join('') + '</div>' : '';
      return `<div class="${c('process-step')}"><span class="${c('process-mark')}">${CHECK}</span><div class="${c('process-body')}">` +
        `<div class="${c('process-head')}"><span class="${c('process-title')}">${esc(title)}</span>${time ? `<span class="${c('process-time')}">${esc(time)}</span>` : ''}</div>` +
        (desc ? `<div class="${c('process-desc')}">${esc(desc)}</div>` : '') + chips + '</div></div>';
    }).join('') + '</div>';
  }

  // ---------- 마크다운 → HTML (agent_design_system/4-resources/4-8-markup.md 규칙) ----------
  function renderMarkdown(md, opts) {
    if (!global.marked) throw new Error('ChatUI: marked가 아직 로드되지 않았습니다. ChatUI.ready()를 먼저 기다리세요.');
    const c = classer(optsOf(opts).prefix);
    const box = document.createElement('div');
    const src = extractSources(md);
    box.innerHTML = global.marked.parse(fixEmphasis(src.md), { gfm: true, breaks: true })
      .replace(/src="placeholder:(\d+x\d+)"/g, 'data-ph="$1"');   // 예시용 자리 표시는 불러오지 않음
    sanitize(box);
    box.querySelectorAll('li').forEach(li => {
      unwrapParagraphs(li);
      const cb = li.firstElementChild;
      if (cb && cb.tagName === 'INPUT' && cb.type === 'checkbox') {
        li.className = c(cb.checked ? 'task is-done' : 'task');
        cb.removeAttribute('disabled');
        if (cb.nextSibling && cb.nextSibling.nodeType === 3) cb.nextSibling.textContent = cb.nextSibling.textContent.replace(/^\s+/, '');
      }
    });
    box.querySelectorAll('blockquote').forEach(unwrapParagraphs);
    box.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });

    for (const el of [...box.children]) {
      const t = el.tagName;
      if (t === 'PRE') {
        const code = el.querySelector('code');
        const lang = code && (code.className.match(/language-([\w+-]+)/) || [])[1];
        if (code) code.innerHTML = highlight(code.textContent.replace(/\n$/, ''), c);
        code && code.removeAttribute('class');
        const inner = wrapIn(el, c('code'));
        if (lang) inner.insertBefore(htmlEl(`<div class="${c('lang')}">${esc(lang)}</div>`), el);
        wrapIn(inner, c('pw'));
      } else if (t === 'TABLE') wrapIn(el, c('tw'));
      else if (t === 'BLOCKQUOTE') wrapIn(el, c('bw'));
      else if (t === 'HR') wrapIn(el, c('hw'));
      else if (t === 'P') {
        const kids = [...el.childNodes].filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
        const srcList = el.textContent.trim() === '[출처 목록]';
        const stepLines = el.innerHTML.split(/<br\s*\/?>/).map(x => x.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        const steps = stepLines.length && stepLines.every(l => STEP_LINE.test(l)) ? stepLines : null;
        const search = el.textContent.trim().match(/^\[검색:\s*([^\]]+?)\s*\]$/);
        const result = el.textContent.trim().match(RESULT_LINE);
        const tool = el.textContent.trim().match(TOOL_LINE);
        const todo = stepLines.length && stepLines.every(l => TODO_LINE.test(l)) ? stepLines : null;
        if (kids.length === 1 && kids[0].tagName === 'IMG') {
          const img = kids[0];
          const ph = (img.getAttribute('data-ph') || '').match(/^(\d+)x(\d+)$/);
          const node = ph ? htmlEl(`<div class="${c('ph')}" role="img" aria-label="${esc(img.alt)}" style="aspect-ratio:${ph[1]}/${ph[2]}"></div>`) : img;
          const w = htmlEl(`<div class="${c('iw')}"></div>`); w.appendChild(node); el.replaceWith(w);
        } else if (result) {
          el.replaceWith(htmlEl(resultCard(result[1].replace(/\s+/g, ''), result[2], result[3], result[4], c)));
        } else if (tool) {
          el.replaceWith(htmlEl(`<div class="${c('kw')}"><div class="${c('tool-line')}"><span>${esc(tool[1])}</span>${CHEVRON_R}</div></div>`));
        } else if (todo) {
          el.replaceWith(htmlEl(`<div class="${c('gw')}"><div class="${c('todo')}">` + todo.map(l => { const [, st, tx] = l.match(TODO_LINE); return `<div class="${c('todo-item' + (st === '완료' ? ' is-done' : ''))}">${st === '완료' ? CHECK : PENDING}<span>${esc(tx)}</span></div>`; }).join('') + '</div></div>'));
        } else if (steps) {
          el.replaceWith(htmlEl(processHTML(steps, c)));
        } else if (srcList) {
          el.replaceWith(htmlEl('<div data-sources></div>'));   // 칩이 정해진 뒤 채움
        } else if (search && search[1].includes('|')) {   // 검색어 없는 칩 묶음은 피그마에 없는 경우라 그리지 않는다
          el.replaceWith(htmlEl(searchBlockHTML(search[1], c)));
        }
      }
    }
    if (src.defs.size) {
      const used = applySourceChips(box, src.defs, c);
      box.querySelectorAll('[data-sources]').forEach(ph => {
        const list = sourcesHTML(used.length ? used : [...src.defs.keys()], src.defs, c);
        list ? ph.replaceWith(htmlEl(list)) : ph.remove();
      });
    } else box.querySelectorAll('[data-sources]').forEach(ph => ph.remove());
    return box.innerHTML;
  }

  // ---------- 메시지 → HTML ----------
  const roleOf = m => m.role === 'user' ? 'user' : 'assistant';
  const textOf = m => m.content != null ? String(m.content) : (m.text || '');

  // 요청 메시지 맨 앞의 `[이미지 N장]` · `[이미지: url]` · `[파일: 이름]` 줄을 첨부로 분리
  function splitAttachments(m) {
    const list = (m.attachments || []).slice(), keep = [];
    for (const raw of textOf(m).split('\n')) {   // 첨부 줄은 메시지 어디에 써도 첨부로 뺀다(글 앞 · 뒤 · 사이)
      const l = raw.trim(); let r;
      if ((r = l.match(/^\[이미지\s*(\d+)\s*장\]$/))) { for (let i = 0; i < +r[1]; i++) list.push({ type: 'image' }); }
      else if ((r = l.match(/^\[이미지:\s*(\S+)\s*\]$/))) list.push({ type: 'image', src: r[1] });
      else if ((r = l.match(/^\[파일:\s*(.+?)\s*\]$/))) list.push({ type: 'file', name: r[1] });
      else keep.push(raw);
    }
    return { text: keep.join('\n').trim(), attachments: list };
  }

  function thumbSize(count) {
    const mobile = (global.innerWidth || 1024) < 768;
    if (count >= 7) return 'size-s';
    if (mobile && (count === 3 || count >= 5)) return 'size-m';
    return 'size-l';
  }

  function attachHTML(atts, c) {
    if (!atts.length) return '';
    const files = atts.filter(a => a.type === 'file'), imgs = atts.filter(a => a.type === 'image').slice(0, MAX_IMAGES);
    let out = `<div class="${c('attach')}">`;
    if (files.length) {
      const many = files.length > FILES_VISIBLE;
      out += `<div class="${c('files')}${many ? ' ' + c('is-collapsed') : ''}">` + files.map(f => {
        const t = fileType(f.name);
        return `<div class="${c('file')}" title="${esc(f.name)}"><div class="${c('file-icon')} ${c('type-' + t.cls)}">${ICONS.file}</div>` +
          `<div class="${c('file-text')}"><div class="${c('file-name')}">${esc(f.name)}</div><div class="${c('file-type')}">${t.label}</div></div></div>`;
      }).join('') + (many ? `<button type="button" class="${c('more')}" data-more="files">더보기</button>` : '') + '</div>';
    }
    if (imgs.length) {
      const size = c(thumbSize(imgs.length));
      out += `<div class="${c('thumbs')}">` + imgs.map(i => i.src
        ? `<img class="${c('thumb')} ${size}" src="${esc(i.src)}" alt="">`
        : `<div class="${c('thumb')} ${size} ${c('ph')}"></div>`).join('') + '</div>';
    }
    return out + '</div>';
  }

  function actionsHTML(acts, c) {
    return `<div class="${c('actions')}">` + acts.map(a =>
      `<button type="button" class="${c('act')}" data-act="${a}" aria-label="${ACT_LABEL[a]}" title="${ACT_LABEL[a]}">${ICONS[a]}</button>`).join('') + '' + '</div>';
  }

  function messageInner(m, opts) {
    const o = optsOf(opts), c = classer(o.prefix);
    if (roleOf(m) === 'user') {
      const { text, attachments } = splitAttachments(m);
      const bubble = text ? `<div class="${c('bubble')}"><p>${esc(text)}</p></div>` : '';
      return `<div class="${c('col')}">${attachHTML(attachments, c)}${bubble}</div>` + (o.actions ? actionsHTML(USER_ACTS, c) : '');
    }
    const sym = textOf(m).match(SYMBOL_LINE), key = sym && symbolKey(sym[1]), info = sym && SYMBOLS[key];
    if (info && key === '시그니처')   // 첫 진입 빈 화면 — 패널 가운데 심볼
    {   // 줄 아래 글은 인사말 타이틀 (4-9)
      const rest = stripSymbol(textOf(m)).trim(), box = /^\[입력창\]\s*$/m.test(rest), greet = rest.replace(/^\[입력창\]\s*$/m, '').trim();   // `[입력창]` 줄이 있으면 인사말 아래에 한 줄형 입력창
      return `<div class="${c('landing')}"><div class="${c('symbol is-landing')}" role="img" aria-label="${info.label}" data-motion="${info.motion}"></div>` + (greet ? `<div class="${c('landing-title')}">${esc(greet)}</div>` : '') + (box ? composerHTML(Object.assign({}, COMPOSER, LANDING_COMPOSER), c) : '') + '</div>';
    }
    const done = m.done !== false && !info;   // 생각 중 · 생각 끝 · 작업 중은 진행 중 — 액션 줄은 끝난 뒤 (UI-MSG-17)
    const STATE_CLS = { '생각 중': ' is-thinking', '생각 끝': ' is-thinking-end', '작업 중': ' is-working' };   // 상태별 텍스트 시머 주기 (4-9)
    const working = info ? STATE_CLS[key] || '' : '';
    const custom = sym && sym[2], done0 = textOf(m).match(STATUS_LINE), comp = textOf(m).match(COMPLETE_LINE);
    const status = info ? `<div class="${c('status' + working + (custom ? ' is-research' : ''))}"><div class="${c('symbol is-status')}" role="img" aria-label="${info.label}" data-motion="${info.motion}"></div><span class="${c('status-label')}">${esc(custom ? custom.split(/\s*→\s*/).pop() : info.label)}</span></div>`
      : comp ? `<div class="${c('status is-research is-complete')}"><span class="${c('status-label')}">${esc(comp[1])}</span><span class="${c('status-chevron')}" aria-hidden="true">${CHEVRON}</span></div>`   // 작업 완료: 심볼 없이 완료 문구 + `>`(접힘) (UI-SYM-09, 27)
      : done0 ? `<div class="${c('status is-research is-done' + (done0[2] ? ' is-open' : ''))}"><div class="${c('symbol is-status')}" role="img" aria-label="AI Agent" data-motion="agent_signature"></div><span class="${c('status-label')}">${esc(done0[1])}</span><span class="${c('status-chevron')}" aria-hidden="true">${CHEVRON}</span></div>` : '';
    const compSteps = comp && comp[2] ? comp[2].split(/\s*→\s*/).filter(Boolean) : [];   // `>`를 누르면 펼치는 작업 내용
    const proc = compSteps.length ? `<div class="${c('process')}">` + compSteps.map(t => `<div class="${c('process-step')}"><span class="${c('process-mark')}">${CHECK}</span><div class="${c('process-body')}"><div class="${c('process-head')}"><span class="${c('process-title')}">${esc(t)}</span></div></div></div>`).join('') + '</div>' : '';
    return `<div class="${c('content')}">${status}${proc}${renderMarkdown(stripSymbol(textOf(m)), o)}</div>` + (o.actions && done ? actionsHTML(AI_ACTS, c) : '');
  }
  const messageClass = (m, c) => c(roleOf(m) === 'user' ? 'msg user' : 'msg ai');

  function renderMessages(list, opts) {
    const c = classer(optsOf(opts).prefix);
    return (list || []).map(m => `<div class="${messageClass(m, c)}">${messageInner(m, opts)}</div>`).join('');
  }

  // ---------- 동작: 전체보기 · 더보기 · 액션 (렌더 후 한 번 호출) ----------
  function measureClamp(root, c) {
    root.querySelectorAll('.' + c('bubble')).forEach(b => {
      const p = b.querySelector('p'); if (!p || b.dataset.measured) return;
      const lh = parseFloat(getComputedStyle(p).lineHeight) || 24;
      if (p.scrollHeight > lh * CLAMP_LINES + 2) {
        b.classList.add(c('is-clamped'));
        b.appendChild(htmlEl(`<button type="button" class="${c('more')}" data-more="bubble">전체보기</button>`));
      }
      b.dataset.measured = '1';
    });
  }

  // 심볼 모션 재생 — lottie-web이 있을 때만 (없으면 자리만 비워 둠)
  const motionData = new Map();   // 모션 JSON(0.3 ~ 1MB)을 경로마다 한 번만 읽는다
  const loadMotion = path => {
    if (!motionData.has(path)) motionData.set(path, fetch(path).then(r => { if (!r.ok) throw new Error(r.status + ' ' + path); return r.json(); }).catch(e => { motionData.delete(path); throw e; }));
    return motionData.get(path);
  };
  // 화면에서 사라진 심볼의 lottie를 정리한다 (다시 재생 · 케이스 전환 때 쌓이지 않게)
  function stopMotions(root) {
    root.querySelectorAll('[data-motion]').forEach(el => { if (el.__anim) { el.__anim.destroy(); el.__anim = null; } });
  }
  function startMotions(root, o) {
    const lottie = global.lottie;
    if (!lottie) return;
    root.querySelectorAll('[data-motion]:not([data-motion-ready])').forEach(el => {
      el.dataset.motionReady = '1';
      const name = el.dataset.motion, loop = name === 'agent_thinking_loop' || name === 'agent_working';
      const path = `${o.symbolBase}${name}/lottie/${name}.json`;
      loadMotion(path).then(data => {
        if (!el.isConnected) return;
        const anim = lottie.loadAnimation({ container: el, renderer: 'svg', loop, autoplay: true, animationData: JSON.parse(JSON.stringify(data)) });
        el.__anim = anim;
        // 시그니처는 1회 재생하고 마지막 심볼에서 멈춘다(UI-SYM-01). 생각 끝은 예시 화면에서 모션을 볼 수 있게 머문 뒤 다시 재생하는 표시용(서비스에서는 1회)
        if (name === 'agent_thinking_end') anim.addEventListener('complete', () => setTimeout(() => { if (el.isConnected && el.__anim === anim) anim.goToAndPlay(0, true); }, EXAMPLE_REPLAY));
      }).catch(() => {});
    });
  }
  // 첫 진입 화면(.landing)의 입력창 동작 (4-9, 4-7): 두 줄 이상이면 여러 줄형, 글자가 있으면 전송 활성, 묶음은 세로 가운데 유지
  function landingComposers(root, c) {
    root.querySelectorAll('.' + c('landing') + ' .' + c('composer')).forEach(cp => {
      if (cp.__cuiBound) return;
      cp.__cuiBound = true;
      const box = cp.querySelector('.' + c('composer-box')), ta = cp.querySelector('textarea'), send = cp.querySelector('.' + c('composer-send'));
      const fit = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
      const sync = () => {
        if (!ta.value) box.classList.add(c('is-collapsed'));   // 모두 지우면 한 줄형으로 돌아옴
        else if (box.classList.contains(c('is-collapsed')) && (/\n/.test(ta.value) || ta.scrollHeight > 28)) box.classList.remove(c('is-collapsed'));   // 한 줄 높이(24)를 넘으면 여러 줄형
        box.classList.contains(c('is-collapsed')) ? (ta.style.height = '') : fit();
        send.disabled = !ta.value.trim();
      };
      ta.addEventListener('input', sync);
      ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) e.preventDefault(); });   // 보기 화면이라 전송은 하지 않음
    });
  }

  function enhance(root, opts) {
    const o = optsOf(opts), c = classer(o.prefix);
    measureClamp(root, c);
    startMotions(root, o);
    landingComposers(root, c);
    if (root.__cuiBound) return;
    root.__cuiBound = true;
    root.addEventListener('click', e => {
      const more = e.target.closest('[data-more]');
      if (more && root.contains(more)) {
        if (more.dataset.more === 'bubble') {
          const b = more.closest('.' + c('bubble')), open = b.classList.toggle(c('is-open'));
          b.classList.toggle(c('is-clamped'), !open);
          more.textContent = open ? '접기' : '전체보기';
          if (!open && b.getBoundingClientRect().top < 0) b.scrollIntoView({ block: 'start' });
        } else {
          const f = more.closest('.' + c('files')), open = f.classList.toggle(c('is-open'));
          f.classList.toggle(c('is-collapsed'), !open);
          more.textContent = open ? '접기' : '더보기';
        }
        return;
      }
      const done = e.target.closest('.' + c('status') + '.' + c('is-done') + ', .' + c('status') + '.' + c('is-complete'));
      if (done && root.contains(done)) { done.classList.toggle(c('is-open')); return; }   // 리서치 과정 펼침 · 접힘
      const chip = e.target.closest('.' + c('source-chip'));
      if (chip && root.contains(chip)) {   // Mobile 탭: 미리보기 카드 열고 닫기 (Desktop은 CSS 호버)
        e.preventDefault();
        const pop = chip.closest('.' + c('source-pop')), open = !pop.classList.contains(c('is-open'));
        root.querySelectorAll('.' + c('source-pop') + '.' + c('is-open')).forEach(p => p.classList.remove(c('is-open')));
        pop.classList.toggle(c('is-open'), open);
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act || !root.contains(act)) return;
      const msgEl = act.closest('.' + c('msg'));
      const name = act.dataset.act;
      const text = msgEl && (msgEl.__cuiText != null ? msgEl.__cuiText
        : (msgEl.querySelector('.' + c('bubble') + ' p, .' + c('content')) || {}).innerText || '');
      if (name === 'copy' && text && global.navigator && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      const detail = { action: name, role: msgEl && msgEl.classList.contains(c('user')) ? 'user' : 'assistant', content: text, element: msgEl };
      if (typeof o.onAction === 'function') o.onAction(detail);
      root.dispatchEvent(new CustomEvent('chatui:action', { detail, bubbles: true }));
    });
  }

  // `@user` / `@assistant` 줄로 턴을 나눈 대화 텍스트 → { name, template, messages }
  function parseConversation(text) {
    const meta = {};
    text = String(text || '').replace(/\r\n/g, '\n');
    const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (fm) {
      text = text.slice(fm[0].length);
      for (const l of fm[1].split('\n')) {
        const m = l.match(/^(\w+):\s*(.*)$/);
        if (!m) continue;
        const v = m[2].trim();
        const arr = v.match(/^\[(.*)\]$/);   // 인라인 배열 [A, B]
        meta[m[1]] = arr ? arr[1].split(',').map(x => x.trim()).filter(Boolean) : v.replace(/^"(.*)"$/, '$1');
      }
    }
    const turns = []; let cur = null, fence = null;
    for (const line of text.split('\n')) {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (f) { if (!fence) fence = f[1]; else if (line.trim().startsWith(fence) && line.trim().replace(/[`~]/g, '') === '') fence = null; }
      const role = !fence && line.trim().match(/^@(user|assistant)$/);
      if (role) { cur = { role: role[1], lines: [] }; turns.push(cur); continue; }
      if (!cur) { if (!line.trim()) continue; cur = { role: 'assistant', lines: [] }; turns.push(cur); }
      cur.lines.push(line);
    }
    return Object.assign({ name: '', template: '' }, meta,
      { messages: turns.map(t => ({ role: t.role, content: t.lines.join('\n').trim() })) });
  }

  // ---------- 입력창 (agent_design_system/4-resources/4-7-input.md) ----------
  function composerHTML(cfg, c) {
    const btn = (tool, label) => `<button type="button" class="${c('composer-btn')}" data-tool="${tool}" aria-label="${label}" title="${label}">${ICONS[tool]}</button>`;
    return `<div class="${c('composer')}">` +
      `<div class="${c('composer-scrim')}"></div>` +
      `<button type="button" class="${c('scroll-bottom')}" aria-label="맨 아래로 이동" title="맨 아래로 이동" hidden>${ICONS.down}</button>` +
      `<div class="${c('composer-box is-collapsed')}">` +
        `<textarea class="${c('composer-input')}" rows="1" placeholder="${esc(cfg.placeholder)}" aria-label="메시지 입력"></textarea>` +
        `<div class="${c('composer-tools')}">${btn('plus', '메뉴 열기')}${btn('voice', '음성 입력')}` +
          `<button type="button" class="${c('composer-btn composer-send')}" aria-label="전송" title="전송" disabled>${ICONS.send}</button></div>` +
      `</div>` +
      (cfg.note ? `<p class="${c('composer-note')}">${esc(cfg.note)}</p>` : '') +
    `</div>`;
  }

  // 가장 가까운 스크롤 영역 (없으면 null = 창)
  function scrollerOf(node) {
    for (let n = node.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement)
      if (/(auto|scroll|overlay)/.test(getComputedStyle(n).overflowY)) return n;
    return null;
  }

  // ---------- 마운트 (드롭인 컴포넌트) ----------
  function mount(el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) throw new Error('ChatUI.mount: 대상 요소가 없습니다');
    const o = optsOf(opts), c = classer(o.prefix);
    if (o.css) injectCSS();

    el.innerHTML = `<div class="${c('chat')}"><div class="${c('markdown')}"><div class="${c('thread')}"></div></div></div>`;
    const root = el.firstElementChild, thread = root.querySelector('.' + c('thread'));
    const items = [];
    let mq = null;
    const cmp = o.composer ? setupComposer() : null;

    function applyTheme(t) {
      o.theme = t;
      if (mq) { mq.removeEventListener('change', onScheme); mq = null; }
      if (t === 'auto' && global.matchMedia) {
        mq = global.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', onScheme);
        root.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      } else root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    }
    function onScheme(e) { root.setAttribute('data-theme', e.matches ? 'dark' : 'light'); }

    function paint(item) {
      item.raf = 0;
      if (!global.marked && roleOf(item.msg) === 'assistant') { ready().then(() => paint(item)); return; }
      const follow = cmp && cmp.atBottom();   // 맨 아래를 보고 있었으면 스트리밍 중에도 따라 내려감
      item.el.innerHTML = messageInner(item.msg, o);
      item.el.__cuiText = stripSymbol(splitAttachments(item.msg).text);
      measureClamp(item.el, c);
      startMotions(item.el, o);
      if (follow) cmp.toBottom(false);
      if (cmp) cmp.sync();
    }
    // 스트리밍 조각은 프레임 단위로 모아 다시 그린다. 백그라운드 탭처럼 프레임이 멈춰도 타이머로 반영
    function schedule(item) {
      if (item.raf) return;
      item.raf = 1;
      const run = () => { if (item.raf) paint(item); };
      requestAnimationFrame(run);
      setTimeout(run, 50);
    }

    function add(role, content) {
      const msg = typeof role === 'object' ? Object.assign({}, role) : { role, content: content || '' };
      if (typeof role !== 'object' && roleOf(msg) === 'assistant' && !content) msg.done = false;   // 빈 답변 = 스트리밍 시작
      const node = document.createElement('div');
      node.className = messageClass(msg, c);
      thread.appendChild(node);
      const item = { msg, el: node, raf: 0 };
      items.push(item); paint(item);
      return {
        element: node,
        get content() { return textOf(item.msg); },
        set(text) { item.msg.content = text; schedule(item); return this; },
        append(chunk) { item.msg.content = textOf(item.msg) + chunk; schedule(item); return this; },
        done() { item.msg.done = true; schedule(item); if (cmp) cmp.sync(); return this; },
        remove() { node.remove(); items.splice(items.indexOf(item), 1); if (cmp) cmp.sync(); },
      };
    }

    // 입력창: 한 줄형(첫 진입) → 첫 전송 뒤 여러 줄형, 5줄까지 늘어남, 전송 · 비활성 · 중지 버튼, 맨 아래로 이동
    function setupComposer() {
      const cfg = Object.assign({}, COMPOSER, typeof o.composer === 'object' ? o.composer : {});
      root.insertAdjacentHTML('beforeend', composerHTML(cfg, c));
      const box = root.querySelector('.' + c('composer-box')), ta = box.querySelector('textarea');
      const sendBtn = box.querySelector('.' + c('composer-send')), downBtn = root.querySelector('.' + c('scroll-bottom'));
      const autoSize = !(global.CSS && CSS.supports && CSS.supports('field-sizing', 'content'));
      let pinned = true;   // 마지막 스크롤 때 맨 아래였는지 — 입력창이 커져도 맨 아래를 유지
      let scroller;   // 첫 사용 때 찾음 (마운트 뒤에 호스트가 스타일을 바꿀 수 있으므로)
      const sc = () => scroller === undefined ? (scroller = scrollerOf(root)) : scroller;

      const streaming = () => items.some(i => roleOf(i.msg) === 'assistant' && i.msg.done === false);
      const fire = (name, detail, cb) => {
        if (typeof cb === 'function') cb(detail.text != null ? detail.text : detail.tool);
        root.dispatchEvent(new CustomEvent('chatui:' + name, { detail, bubbles: true }));
      };
      function expand() { box.classList.remove(c('is-collapsed')); size(); }
      function size() {
        if (box.classList.contains(c('is-collapsed')) && ta.scrollHeight > ta.clientHeight + 1) return expand();   // 두 줄이 되면 여러 줄형
        if (!autoSize) return;
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';   // max-height(5줄)를 넘으면 안에서 스크롤
      }
      function sync() {
        const stop = streaming();
        if (sendBtn.classList.contains(c('is-stop')) !== stop) {
          sendBtn.classList.toggle(c('is-stop'), stop);
          sendBtn.innerHTML = stop ? ICONS.stop : ICONS.send;
          sendBtn.setAttribute('aria-label', stop ? '답변 중지' : '전송');
          sendBtn.title = stop ? '답변 중지' : '전송';
        }
        sendBtn.disabled = !stop && !ta.value.trim();
      }
      function gap() {
        const s = sc(), bottom = s ? s.getBoundingClientRect().bottom : global.innerHeight;
        return root.getBoundingClientRect().bottom - bottom;
      }
      const atBottom = () => gap() <= SCROLL_GAP;
      function toBottom(smooth) {
        const s = sc(), d = gap(), opt = { top: d, behavior: smooth ? 'smooth' : 'auto' };
        if (d > 0) (s || global).scrollBy(opt);
      }
      const onScroll = () => { downBtn.hidden = pinned = atBottom(); };
      const onResize = () => { scroller = undefined; onScroll(); };

      function send() {
        const text = ta.value.trim();
        if (!text || streaming()) return;
        ta.value = '';
        expand();
        add('user', text);
        toBottom(false);
        sync();
        fire('send', { text }, o.onSend);
        ta.focus();
      }
      function stop() {
        items.forEach(i => { if (roleOf(i.msg) === 'assistant' && i.msg.done === false) { i.msg.done = true; schedule(i); } });
        sync();
        fire('stop', {}, o.onStop);
      }

      ta.addEventListener('input', () => { size(); sync(); if (pinned) toBottom(false); });
      ta.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.keyCode === 229) return;   // 한글 조합 중 Enter는 무시
        e.preventDefault();
        send();
      });
      sendBtn.addEventListener('click', () => sendBtn.classList.contains(c('is-stop')) ? stop() : send());
      downBtn.addEventListener('click', () => toBottom(true));
      box.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => fire('tool', { tool: b.dataset.tool }, o.onTool)));
      document.addEventListener('scroll', onScroll, { capture: true, passive: true });
      global.addEventListener('resize', onResize);
      if (autoSize) size();

      return {
        atBottom, toBottom, sync, expand,
        reset() { if (!ta.value) box.classList.add(c('is-collapsed')); size(); sync(); },
        update: onScroll,
        api: {
          element: root.querySelector('.' + c('composer')),
          get value() { return ta.value; },
          set value(v) { ta.value = v; size(); sync(); },
          focus() { ta.focus(); },
          send,
        },
        destroy() { document.removeEventListener('scroll', onScroll, { capture: true }); global.removeEventListener('resize', onResize); },
      };
    }

    applyTheme(o.theme);
    enhance(root, o);
    if (o.messages) o.messages.forEach(m => add(m));
    if (cmp && items.length) cmp.expand();   // 이어지는 대화는 여러 줄형으로 시작

    return {
      element: root,
      composer: cmp ? cmp.api : null,
      add,
      setMessages(list) {
        thread.innerHTML = ''; items.length = 0; (list || []).forEach(m => add(m));
        if (cmp) { if (items.length) cmp.expand(); else cmp.reset(); cmp.update(); }
      },
      clear() { thread.innerHTML = ''; items.length = 0; if (cmp) { cmp.reset(); cmp.update(); } },   // 새 대화 = 첫 진입 (한 줄형)
      setTheme: applyTheme,
      get messages() { return items.map(i => Object.assign({}, i.msg)); },
      destroy() { if (mq) mq.removeEventListener('change', onScheme); if (cmp) cmp.destroy(); el.innerHTML = ''; },
    };
  }

  const ChatUI = {
    version: '2.3.1',
    css: '',            // 빌드 시 agent_design_system/의 완성 CSS가 들어감
    systemPrompt: '',   // 빌드 시 모델용 답변 지침이 들어감
    ready, mount, renderMarkdown, renderMessages, parseConversation, enhance, stopMotions, injectCSS,
  };
  global.ChatUI = ChatUI;
})(typeof window !== 'undefined' ? window : this);
