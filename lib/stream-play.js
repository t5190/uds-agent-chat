// 시안의 답변을 chat.html처럼 순서대로 보여 준다(의존성 없음). 마크업은 그대로 두고 화면에서만 글자를 이어 붙인다.
// 쓰는 법: <div class="msg ai" data-stream> … </div> 에 data-stream을 달고 이 파일을 불러온다. 움직임 줄이기가 켜져 있으면 바로 보인다.
// 시안 HTML에 style 속성을 쓰지 않는 규칙 때문에, 가리고 보이는 것은 이 스크립트가 런타임에 처리한다.
(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]play=0\b/.test(location.search);

  // 답변 본문 조각: 상태 줄 · 액션 줄 · 모션 자리는 빼고, 글자(text node)만 모은다
  function textNodes(root){
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeValue.trim() && !n.parentElement.closest('.status, .actions, script, style') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    for (let n; (n = w.nextNode());) out.push(n);
    return out;
  }
  const hide = (el, on) => { el.style.display = on ? 'none' : ''; };

  async function play(msg){
    const content = msg.querySelector('.content') || msg;
    const blocks = [...content.children].filter(el => !el.matches('.status'));
    const actions = msg.querySelector('.actions');
    const nodes = textNodes(content), full = nodes.map(n => n.nodeValue);
    if (reduce || !nodes.length) return;
    nodes.forEach(n => { n.nodeValue = ''; });
    blocks.forEach(b => hide(b, true));
    if (actions) hide(actions, true);
    const status = content.querySelector('.status');
    if (status) await sleep(1080);   // 생각 중 한 바퀴(1.08초)
    const total = full.reduce((a, s) => a + s.length, 0), per = Math.max(3, Math.ceil(total / 150));   // 6초 안에 끝나도록 조각 크기를 키움
    for (let i = 0; i < nodes.length; i++){
      const block = blocks.find(b => b.contains(nodes[i]));
      if (block) hide(block, false);
      const s = full[i];
      for (let p = 0; p < s.length;){
        let q = Math.min(s.length, p + per + Math.floor(Math.random() * 3));
        while (q < s.length && !/\s/.test(s[q])) q++;   // 낱말 중간에서 끊지 않음
        nodes[i].nodeValue = s.slice(0, q); p = q;
        window.scrollTo({ top: document.documentElement.scrollHeight });
        await sleep(28 + Math.floor(Math.random() * 22));
      }
      nodes[i].nodeValue = s;
      if (i + 1 < nodes.length && !blocks.some(b => b.contains(nodes[i]) && b.contains(nodes[i + 1]))) await sleep(220);   // 문단이 바뀔 때 쉼
    }
    blocks.forEach(b => hide(b, false));
    if (actions) hide(actions, false);
  }

  const run = () => { document.querySelectorAll('[data-stream]').forEach(play); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
