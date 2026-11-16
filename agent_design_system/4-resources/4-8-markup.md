---
id: SPEC-4-8
type: spec
title: HTML 구조 · 고정 CSS
status: stable
version: 1.9.0
summary: 대화의 HTML 구조 계약, 마크다운 변환 규칙, 대화 파일 형식, 고정 구조 CSS를 정합니다.
stage: 4
audience: ui
---

# 4-8. HTML 구조 · 고정 CSS

대화가 어떤 HTML로 그려져야 하는지(구조 계약), 마크다운을 어떻게 바꾸는지(변환 규칙), 그리고 스타일 표로 표현하지 않는 **고정 구조 CSS**를 정의합니다. 색 · 크기 · 여백은 여기 두지 않고 각 문서의 스타일 표에 둡니다.

## 대화 → HTML

```html
<div class="chat" data-theme="light">
  <div class="markdown">
    <div class="thread">

      <!-- 요청 영역 -->
      <div class="msg user">
        <div class="col">
          <div class="attach">…</div>                       <!-- 첨부가 있을 때만 -->
          <div class="bubble is-clamped">
            <p>사용자가 쓴 텍스트</p>
            <button class="more">전체보기</button>          <!-- 5줄 초과일 때만 -->
          </div>
        </div>
        <div class="actions">
          <button class="act" data-act="copy" aria-label="복사">…</button>
        </div>
      </div>

      <!-- 응답 영역 -->
      <div class="msg ai">
        <div class="content"><!-- 마크다운 블록 --></div>
        <div class="actions">
          <button class="act" data-act="copy" aria-label="복사">…</button>
          <button class="act" data-act="like" aria-label="좋아요">…</button>
          <button class="act" data-act="dislike" aria-label="싫어요">…</button>
          <button class="act" data-act="share" aria-label="공유">…</button>
          <button class="act" data-act="regenerate" aria-label="다시 생성">…</button>
        </div>
      </div>

    </div>
  </div>
</div>
```

입력창을 쓰면 `.markdown` 다음, `.chat` 맨 끝에 `.composer`가 붙습니다([4-7. 입력창](4-7-input.md)).

```html
<div class="chat" data-theme="light">
  <div class="markdown">…</div>

  <div class="composer">
    <div class="composer-scrim"></div>
    <button class="scroll-bottom" aria-label="맨 아래로 이동" hidden>…</button>   <!-- 위로 스크롤했을 때만 -->
    <div class="composer-box is-collapsed">                                        <!-- 첫 전송 뒤 is-collapsed 제거 -->
      <textarea class="composer-input" rows="1" placeholder="Exaone에게 메세지 보내기"></textarea>
      <div class="composer-tools">
        <button class="composer-btn" data-tool="plus" aria-label="메뉴 열기">…</button>
        <button class="composer-btn" data-tool="voice" aria-label="음성 입력">…</button>
        <button class="composer-btn composer-send" aria-label="전송" disabled>…</button>   <!-- 답변 중: .is-stop -->
      </div>
    </div>
    <p class="composer-note">AI는 실수를 할 수 있어요. 중요한 정보는 재차 확인하세요.</p>
  </div>
</div>
```

- 이름 라벨 · 아바타는 없다
- 다크 모드는 `.chat`(또는 그 상위 요소)에 `data-theme="dark"`를 붙인다
- 액션 아이콘은 서비스의 디자인 시스템 아이콘(copy-line, like-line, disLike-line, share-line, refresh-line)을 쓴다

## 클래스 목록

이 표에 있는 클래스만 씁니다. 접두어를 붙인 패키지는 아직 없습니다(`## 미정`).

<!-- 예외: is-open, is-focus, is-running은 스타일 표가 아직 없는 클래스(## 미정) -->

| 클래스 | 역할 |
| --- | --- |
| `chat` | 채팅 영역 바깥 래퍼 |
| `markdown` | 콘텐츠 패널 (스타일 루트) |
| `thread` | 대화 세로 스택 |
| `msg` | 턴의 한 영역 |
| `user` | 요청 영역 (`msg`와 함께) |
| `ai` | 응답 영역 (`msg`와 함께) |
| `col` | 요청 영역의 3fr 열 |
| `content` | 응답 마크다운 블록 스택 |
| `bubble` | 요청 말풍선 |
| `more` | 전체보기 · 접기 · 더보기 텍스트 버튼 |
| `actions` | 액션 줄 |
| `act` | 액션 아이콘 버튼 |
| `status` | 작업 상태 표시 |
| `symbol` | AI 심볼 · 모션 슬롯 ([4-9](4-9-symbol.md)) |
| `landing` | 첫 진입 빈 화면 (패널 가운데 심볼) |
| `is-landing` | 첫 진입 빈 화면의 심볼 슬롯 (`symbol`과 함께) |
| `is-status` | 응답 영역 작업 상태의 심볼 슬롯 (`symbol`과 함께) |
| `is-working` | 작업 중인 작업 상태 줄 — 텍스트 시머 (`status`와 함께, [4-9](4-9-symbol.md)) |
| `status-label` | 작업 상태 줄의 텍스트 |
| `is-research` | 리서치 작업 상태 줄 (`status`와 함께, [4-10](4-10-source.md)) |
| `is-done` | 끝난 리서치 작업 상태 줄 — 펼침 화살표 (`status`와 함께) |
| `status-chevron` | 리서치 작업 상태 줄의 펼침 화살표 |
| `is-thinking` | 생각 중인 작업 상태 줄 — 텍스트 시머 1.08초 (`status`와 함께, [4-9](4-9-symbol.md)) |
| `is-thinking-end` | 생각 끝인 작업 상태 줄 — 텍스트 시머 1.14초 1회 (`status`와 함께) |
| `is-complete` | 작업이 끝나 완료 문구 + `>`만 남은 작업 상태 줄 — 심볼 없음 (`status`와 함께, 클래스 이름은 임시) |
| `is-fading` | 작업 완료 때 그룹 페이드 아웃하는 심볼 · 시머 문구 (`symbol` · `status-label`과 함께) |
| `is-complete-label` | 작업 완료 때 시머 문구 자리에서 나타나 심볼 자리로 이동하는 완료 문구 (`status-label`과 함께) |
| `is-shown` | 나타난 완료 문구 (`is-complete-label`과 함께) |
| `is-swapping` | 문구를 교체하는 중인 작업 상태 텍스트 (`status-label`과 함께) |
| `search-step` | 검색 단계 한 번(검색어 줄 + 칩) |
| `step-head` | 검색 단계의 검색어 줄 |
| `step-results` | 검색 단계의 세로선과 칩 묶음 |
| `process` | 펼친 리서치 과정 단계 목록 (임시, [4-10](4-10-source.md)) |
| `process-step` | 리서치 과정 단계 하나 |
| `process-mark` | 단계의 완료 표시(원 + 체크) |
| `process-body` | 단계의 제목 · 설명 · 칩 묶음 |
| `process-head` | 단계 제목 줄 |
| `process-title` | 단계 제목 |
| `process-time` | 단계 소요 시간 |
| `process-desc` | 단계 설명 |
| `sources` | 출처 목록 |
| `favicon` | 칩 · 미리보기 카드 앞의 원형 사이트 아이콘 슬롯 |
| `source-chip` | 출처 칩(문장 끝, 링크) |
| `search-chips` | 검색 단계 칩 묶음 |
| `search-chip` | 검색 단계 칩(링크) |
| `source-pop` | 출처 칩과 미리보기 카드를 묶는 래퍼 |
| `source-preview` | 출처 미리보기 카드 |
| `source-site` | 미리보기 카드의 사이트 줄(파비콘 + 사이트 이름) |
| `source-title` | 미리보기 카드 제목 |
| `source-summary` | 미리보기 카드 요약 |
| `source-date` | 미리보기 카드 날짜 |
| `attach` | 요청 첨부 묶음 |
| `thumbs` | 첨부 이미지 격자 |
| `thumb` | 첨부 이미지 한 장 |
| `files` | 첨부 파일 카드 목록 |
| `file` | 첨부 파일 카드 |
| `file-icon` | 파일 종류 타일 |
| `file-text` | 파일 이름 · 종류 묶음 |
| `file-name` | 파일 이름 |
| `file-type` | 파일 종류 라벨 |
| `pw` | 코드 블록 래퍼 |
| `code` | 코드 블록 상자 |
| `lang` | 코드 언어 표시 |
| `tw` | 표 래퍼 |
| `bw` | 인용문 래퍼 |
| `hw` | 구분선 래퍼 |
| `iw` | 응답 이미지 래퍼 |
| `ph` | 이미지 자리 표시 (예시용) |
| `rw` | 결과 카드 래퍼 |
| `result` | 결과 카드 묶음 |
| `result-label` | 결과 카드 위 실행 라벨 ("파일 생성") |
| `result-card` | 결과 카드 상자 |
| `result-title` | 결과 파일 이름 |
| `result-sub` | 결과 파일 보조 설명 |
| `result-btn` | 결과 카드 버튼 |
| `result-spin` | 결과 카드 실행 중 스피너 |
| `kw` | 도구 사용 줄 래퍼 |
| `tool-line` | 도구 사용 줄 (문구 + `>`) |
| `gw` | 작업 목록 카드 래퍼 |
| `todo` | 작업 목록 카드 |
| `todo-item` | 작업 목록 항목 (`.is-done` = 끝냄) |
| `landing-title` | 첫 진입 인사말 타이틀 |
| `task` | 체크리스트 항목 |
| `tk` | 코드 키워드 |
| `ts` | 코드 문자열 · 숫자 |
| `tf` | 코드 함수 |
| `tc` | 코드 주석 |
| `composer` | 입력창 영역 |
| `composer-box` | 입력 상자 |
| `composer-input` | 입력 글자 영역 |
| `composer-tools` | 입력창 도구 줄 |
| `composer-btn` | 입력창 아이콘 버튼 |
| `composer-send` | 전송 버튼 |
| `composer-note` | 입력창 아래 안내 문구 |
| `composer-scrim` | 입력창 뒤 그라디언트 |
| `scroll-bottom` | 맨 아래로 이동 버튼 |
| `info-bar` | 입력창 위 안내 바 |
| `size-s` · `size-m` · `size-l` | 첨부 썸네일 크기 (64 · 96 · 124) |
| `type-ppt` · `type-doc` · `type-pdf` · `type-xls` · `type-etc` | 파일 종류 |
| `is-clamped` · `is-open` · `is-done` · `is-collapsed` · `is-stop` · `is-focus` · `is-error` · `is-running` · `is-pressed` | 상태 |

## 마크다운 → 블록

| 마크다운 | HTML | 비고 |
| --- | --- | --- |
| 문단 | `<p>` | 문단 안의 **한 줄 개행은 `<br>`** 로 유지 |
| `#` – `######` | `<h1>` – `<h6>` | |
| `- 항목` · `1. 항목` | `<ul>` · `<ol>` + `<li>` | `<li>` 안에 `<p>`를 두지 않음 |
| `- [ ]` · `- [x]` | `<li class="task"><input type="checkbox">텍스트</li>` | 체크된 항목은 `class="task is-done"` |
| ```` ```언어 ```` | `<div class="pw"><div class="code"><div class="lang">언어</div><pre><code>…</code></pre></div></div>` | 언어가 없으면 `.lang` 생략. 토큰을 `.tk` `.ts` `.tf` `.tc`로 감쌈 |
| 표 | `<div class="tw"><table>…</table></div>` | `<thead>` + `<tbody>` |
| `> 인용` | `<div class="bw"><blockquote>텍스트</blockquote></div>` | `<blockquote>` 안에 `<p>`를 두지 않음. 여러 문단은 `<br><br>` |
| `---` | `<div class="hw"><hr></div>` | |
| `![설명](url)` 만 있는 문단 | `<div class="iw"><img src alt></div>` | `placeholder:16x9`처럼 쓰면 회색 자리 표시(`.ph`)로 그림 |
| `[결과 파일: 이름.xlsx · 설명]` 만 있는 문단 | `<div class="rw"><div class="result">…</div></div>` | [4-6. 파일](4-6-file.md) 결과 카드(완료) |
| `[도구: 문구]` 만 있는 문단 | `<div class="kw"><div class="tool-line">문구 + 오른쪽 화살표</div></div>` | 도구 사용 줄 ([3-3. 블록](../3-composition/3-3-block.md)) |
| `[작업 완료: 항목]` · `[작업 예정: 항목]` 줄만 있는 문단 | `<div class="gw"><div class="todo">…</div></div>` | 작업 목록 카드. 줄마다 항목 하나, 줄 순서 그대로 |
| `[결과 실행 중: 제목 · 진행 문구]` · `[결과 실패: 제목 · 이유]` 만 있는 문단 | 같은 구조, `.result.is-running` · `.result.is-failed` | 실행 중 · 실패 결과 카드 |
| `**굵게**` `*기울임*` `~~취소~~` `` `코드` `` `[링크](url)` | `<strong>` `<em>` `<del>` `<code>` `<a>` | |

래퍼(`.pw` `.tw` `.bw` `.hw` `.iw` `.rw` `.kw` `.gw`)는 **응답 콘텐츠의 바로 아래 블록에만** 붙습니다. 래퍼가 블록 앞 간격을 갖고, `.래퍼 + p` 규칙으로 블록 뒤 문단 간격을 늘립니다([3-3. 블록](../3-composition/3-3-block.md)).

### 한국어 강조 보정

CommonMark 규칙상 `**호프(HOPE)**는`, `**"결과물이 문서로 남는가"**입니다`처럼 **닫는 `**` 앞이 문장부호이고 바로 뒤에 한글이 붙으면** 굵게가 풀립니다. 렌더러는 파싱 전에 한 줄 안의 `**…**` / `~~…~~` 짝을 먼저 HTML로 바꿔 이 문제를 막습니다(코드 안은 제외).

### 문법 강조

언어와 무관한 단순 규칙입니다. 앞에서부터 처음 맞는 규칙이 적용됩니다.

| 순서 | 패턴 | 클래스 |
| --- | --- | --- |
| 1 | `#` 또는 `//` 부터 줄 끝 (문자열 밖) | `.tc` |
| 2 | `"…"` `'…'` 문자열 (앞의 `f` `r` `b` 접두 포함) | `.ts` |
| 3 | 숫자 | `.ts` |
| 4 | 키워드 목록 | `.tk` |
| 5 | 바로 뒤에 `(`가 오는 이름 | `.tf` |

키워드: `def return import from as if elif else for while in not and or is class try except finally with lambda yield pass break continue raise True False None async await const let var function new this export default print`

## 대화 파일 형식

시연(`5-templates/examples/`), 시나리오(`conversations/`), 미리보기의 "직접 입력"은 아래 형식을 씁니다. 이 절이 대화 본문 문법의 정본이고, frontmatter 키(`id`, `type`, `title`, `template`, `rules` 등)는 [chat-ui 프로필](../../standard/profile/chat-ui-profile.md)의 "추가 선택 키"가 정본입니다. 파서는 `lib/chat-ui.js`의 `parseConversation`, `splitAttachments`, `SYMBOL_LINE`입니다.

```text
---
title: 대화 제목
template: 답변 유형
---
@user
[이미지 2장]
[파일: 견적서.pdf]
사용자 메시지 (일반 텍스트, 줄바꿈 유지)

@assistant
[심볼: 작업 중]
답변 마크다운

[결과 파일: 견적 비교표.xlsx · 스프레드시트]
```

### frontmatter

- 파일 맨 앞 `---` 두 줄 사이에 한 줄 `key: value`로 쓴다. 배열은 한 줄 `[A, B]`
- 어떤 키를 쓰는지는 프로필이 정한다. 칩 이름과 화면 제목은 `title`

### 턴

| 줄 | 뜻 |
| --- | --- |
| `@user` | 단독 줄. 요청 영역 턴을 시작 |
| `@assistant` | 단독 줄. 응답 영역 턴을 시작. 아래는 마크다운으로 그림 |

- 코드 블록(```` ``` ````, `~~~`) 안의 `@user` · `@assistant`는 턴으로 읽지 않는다
- 첫 턴 줄 앞에 내용이 있으면 응답 영역 턴으로 읽는다

### 요청 첨부

`@user` 블록 안에 한 줄씩 씁니다. 글 앞 · 뒤 · 사이 어디에 써도 첨부로 빼서 말풍선 위에 카드로 보여 주고, 첨부 줄이 아닌 줄만 말풍선에 남습니다.

| 줄 | 보여 주는 것 |
| --- | --- |
| `[이미지 N장]` | 이미지 자리 N장 |
| `[이미지: src]` | 이미지 한 장. `src`는 공백 없는 경로나 URL |
| `[파일: 이름.확장자]` | 첨부 파일 카드 하나. 확장자로 파일 종류를 정함([4-6. 파일](4-6-file.md)) |

### 심볼

답변 첫 줄에 `[심볼: 시그니처|생각 중|생각 끝|작업 중]` 중 하나를 쓰면 AI 심볼을 보여 줍니다. 콜론 앞뒤와 낱말 사이 공백은 있어도 없어도 됩니다(`[심볼:생각중]`도 같음). 모션과 표시 방식은 [4-9. AI 심볼 · 모션](4-9-symbol.md)이 정본입니다.

| 줄 | 보여 주는 것 |
| --- | --- |
| `[심볼: 시그니처]` | 첫 진입 빈 화면(`.landing`). 줄 아래에 글을 쓰면 심볼 아래 인사말 타이틀(`.landing-title`)로 그림. `[입력창]` 줄을 쓰면 인사말 아래에 한 줄형 입력창을 함께 그림. 그 밖의 내용은 그리지 않음 |
| `[심볼: 생각 중]` | 답변 맨 위 작업 상태 줄(`.status`). 액션 줄 없음 |
| `[심볼: 생각 끝]` | 답변 맨 위 작업 상태 줄. 액션 줄 없음 |
| `[심볼: 작업 중]` | 답변 맨 위 작업 상태 줄(`.status.is-working`). 액션 줄 없음 |

답변 첫 줄에 `|`로 상태 문구를 붙이면 그 문구를 씁니다. 리서치처럼 단계를 알릴 때 씁니다.

| 줄 | 보여 주는 것 |
| --- | --- |
| `[심볼: 작업 중 \| 웹에서 찾는 중 · 출처 3개]` | 작업 상태 줄(`.status.is-working.is-research`)에 "작업하는 중" 대신 이 문구 |
| `[상태: 리서치 과정 · 4단계 완료 · 32초]` | 끝난 리서치 작업 상태 줄(`.status.is-research.is-done`). 로고 + 문구 + 펼침 화살표. 액션 줄은 있음. 줄 끝에 `\| 열림`을 붙이면 처음부터 펼쳐 보임 |
| `[완료: 문구]` | 작업 완료(`.status.is-research.is-complete`). 심볼 없이 완료 문구와 `>`(접힘)만 남고 시머는 없음. 눌러서 `.process`(단계 목록)를 펼침. 재생할 때는 마지막 단계 문구가 완료 문구로 교체되고, 심볼이 즉시 삭제된 뒤 문구가 왼쪽으로 이동함 |
| `[완료: 문구 \| 단계 → 단계]` | 위와 같고, `\|` 뒤는 재생 중에 작업 중 문구가 차례로 바뀌는 단계이면서 `>`를 눌렀을 때 펼치는 작업 내용(단계 목록) |
| `[심볼: 작업 중 \| 단계 → 단계]` | 진행 중인 작업 상태 줄. 재생하면 단계 문구가 차례로 교체되고 마지막 단계에서 멈춤. 재생이 아닌 화면은 마지막 단계만 보임 |
| `[심볼: 상태]`에 시머 | 생각 중 · 생각 끝 · 작업 중 문구에는 텍스트 시머가 자동으로 붙음([4-9](4-9-symbol.md#텍스트-시머)) |
| `[단계: 제목 · 시간 \| 설명 \| a.org, b.org]` | 작업 상태 줄 바로 아래에 두는 리서치 과정 단계(임시). 여러 줄을 붙여 쓰면 한 목록이 되고, 작업 상태 줄을 누르면 펼쳐짐. 설명과 도메인은 생략 가능. 줄 묶음 뒤에 빈 줄을 둠 |

### 출처

문장 끝 칩, 출처 목록, 검색 단계는 아래 줄로 씁니다. 구조와 스타일은 [4-10. 출처](4-10-source.md)가 정본입니다.

| 줄 | 보여 주는 것 |
| --- | --- |
| `문장 끝 [출처: id]` | 문장 끝 출처 칩(`.source-chip`)과 미리보기 카드. 문장당 최대 3개까지, 넘으면 그리지 않음 |
| `[출처 id: 사이트 \| 제목 \| 요약 \| 날짜 \| URL]` | 칩의 미리보기 카드 내용. 줄은 화면에 나오지 않음. 순서는 사이트 · 제목 · 요약 · 날짜이고 `http`로 시작하는 칸은 URL. 뒤 칸은 생략 가능 |
| `[출처 목록]` | 그 자리에 출처 목록(`.sources`: 제목 "출처" + 번호 + 파비콘 + 링크)을 그림. 정의 줄이 있어야 하고, 목록 순서는 본문에 처음 나온 순서. 줄을 쓰지 않으면 목록은 그리지 않음 |
| `[검색: 검색어 \| a.org, b.org]` | 검색 단계(`.search-step`): 지구본 + 검색어 한 줄, 아래 세로선과 칩. 검색어 없이 칩만 쓰는 경우는 없고, 검색이 끝난 답변에는 쓰지 않음(`[상태: 웹 검색 완료 · 출처 3개]`로 알림) |

- `[검색: …]` 줄은 앞뒤를 빈 줄로 띄워 그 줄만 있는 문단으로 쓴다(`[결과 파일]`과 같음)
- 코드 블록 안의 `[출처: id]`는 칩으로 바꾸지 않는다
- 정의가 없는 `[출처: id]`는 글자 그대로 둔다
- Desktop은 칩에 마우스를 올리면, Mobile은 칩을 누르면 미리보기 카드가 뜬다(`.is-open`)

### 결과 파일

`[결과 파일: 이름 · 보조 문구]`만 있는 문단은 결과 카드로 그립니다([4-6. 파일](4-6-file.md)). 이름의 확장자로 파일 종류 아이콘을 정하고, `· 보조 문구`를 빼면 확장자에 맞는 파일 종류 라벨을 보조 문구로 씁니다. 표기가 문서마다 다른 점은 `## 미정`에 있습니다.

`[결과 실행 중: 제목 · 진행 문구]`는 실행 중 카드(스피너 라벨 · 회색 타일 · 버튼 없음), `[결과 실패: 제목 · 이유]`는 실패 카드(경고 타일 · "다시 시도" 버튼)로 그립니다. 세 줄 모두 끝에 ` | 실행 라벨`을 붙여 라벨을 바꿀 수 있고, 없으면 "파일 생성"입니다. 실행 중 카드의 라벨에는 " 중"이 붙습니다(예: `데이터 분석 실행` → `데이터 분석 실행 중`).

### 그 밖의 마크다운

답변 본문은 위 "마크다운 → 블록"을 따릅니다.

## 고정 구조 CSS

아래 CSS는 렌더러가 그대로 불러옵니다. `{토큰}`은 [4-1. 디자인 토큰](4-1-tokens.md) 값으로 바뀝니다. 스타일 표의 규칙은 루트 클래스를 두 번 쓴 셀렉터(`.markdown.markdown …`)로 생성되어 이 CSS보다 항상 우선합니다.

```css
/* 서체 */
@font-face{ font-family:'Pretendard'; font-weight:400; font-display:swap;
  src:url('lib/vendor/fonts/Pretendard-Regular.woff2') format('woff2'); }
@font-face{ font-family:'Pretendard'; font-weight:500; font-display:swap;
  src:url('lib/vendor/fonts/Pretendard-Medium.woff2') format('woff2'); }
@font-face{ font-family:'Pretendard'; font-weight:600; font-display:swap;
  src:url('lib/vendor/fonts/Pretendard-SemiBold.woff2') format('woff2'); }
@font-face{ font-family:'Pretendard'; font-weight:700; font-display:swap;
  src:url('lib/vendor/fonts/Pretendard-Bold.woff2') format('woff2'); }
@font-face{ font-family:'Nanum Gothic Coding'; font-weight:400; font-display:swap;
  src:url('lib/vendor/fonts/nanum-gothic-coding-400.woff2') format('woff2'); }
@font-face{ font-family:'Nanum Gothic Coding'; font-weight:700; font-display:swap;
  src:url('lib/vendor/fonts/nanum-gothic-coding-700.woff2') format('woff2'); }

/* 레이아웃 */
.chat{ position:relative; width:100%; min-height:100vh; min-height:100dvh; box-sizing:border-box; }   /* 배경이 첫 화면부터 뷰포트 끝까지 */
body:has(> .chat){ margin:0; background:{color/frame/base/high}; }
.markdown{ box-sizing:border-box; padding:0 20px; }
.markdown *{ box-sizing:border-box; }
.thread{ display:flex; flex-direction:column; margin:0 auto; }

/* 요청 영역 */
.msg.user{ display:grid; }
@media (hover:none){ .markdown.markdown .msg .actions{ opacity:1 !important; } }   /* 호버가 없는 터치 화면은 액션 줄을 항상 보임 (4-3) */
.msg.user .col{ grid-column:2; display:flex; flex-direction:column; align-items:flex-end; gap:12px; min-width:0; }
.msg.user .actions{ grid-column:1 / -1; }
.bubble{ display:flex; flex-direction:column; align-items:flex-start; max-width:100%; text-align:left; }
.bubble p{ margin:0; white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; }
.bubble.is-clamped p{ display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:5; overflow:hidden; }
.more{ margin:0; padding:0; border:0; background:none; cursor:pointer; font-family:inherit; text-align:left; }

/* 응답 영역 */
.msg.ai{ display:flex; flex-direction:column; min-width:0; }
.content{ display:flex; flex-direction:column; min-width:0; }
.status{ display:flex; align-items:center; gap:1px; }   /* 심볼 뷰 34(심볼 20)의 안쪽 여백 7 + 1 = 문구와 보이는 간격 8 (4-9) */
@keyframes result-spin{ to{ transform:rotate(360deg); } }

/* 액션 줄 */
.actions{ display:flex; align-items:center; }
.act{ display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px;
  margin:0; padding:0; border:0; background:none; color:inherit; cursor:pointer; }
.act svg{ width:20px; height:20px; display:block; }

/* 입력창 (4-resources/components/input-field.md) */
.chat:has(> .composer){ display:flex; flex-direction:column; overflow-x:clip; }   /* 대화가 짧아도 입력창이 맨 아래 */
.chat:has(> .composer) > .markdown{ flex:1 0 auto; }
.composer-btn,.scroll-bottom{ margin:0; font:inherit; }
.composer-btn svg,.scroll-bottom svg{ width:20px; height:20px; display:block; }

/* 블록 기본 */
.markdown h1,.markdown h2,.markdown h3,.markdown h4,.markdown h5,.markdown h6,
.markdown p,.markdown ul,.markdown ol,.markdown li,.markdown pre,.markdown blockquote,.markdown table{ margin:0; }
.markdown :not(pre) > code{ color:inherit; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
.markdown .code{ display:flex; flex-direction:column; min-width:0; }
.markdown pre{ margin:0; padding:0; border:0; background:none; overflow-x:auto; white-space:pre; }
.markdown pre code{ background:none; color:inherit; padding:0; font:inherit; }
.markdown img{ max-width:100%; height:auto; display:block; }
.markdown .ph{ background:{color/container/base/higher}; }
.markdown .iw .ph{ width:75%; border-radius:{radius/large}; }

/* 표 */
.markdown .tw{ width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
.markdown table{ border-collapse:separate; border-spacing:0; width:100%; border-width:1px; border-style:solid; overflow:hidden; }
.markdown th,.markdown td{ text-align:left; vertical-align:middle; border:0; border-right:1px solid; border-bottom:1px solid; }
.markdown th:last-child,.markdown td:last-child{ border-right-width:0; }
.markdown tbody tr:last-child td{ border-bottom-width:0; }

/* 구분선 */
.markdown hr{ border:none; margin:0; }

/* 체크리스트 */
.markdown li.task{ list-style:none; margin-left:-26px; display:flex; }
.markdown .task input[type=checkbox]{ appearance:none; -webkit-appearance:none; flex:0 0 auto;
  border-style:solid; background:transparent; margin:0; position:relative; }
.markdown .task input:checked::after{ content:''; position:absolute; left:5px; top:1.5px; width:4px; height:8px;
  border:solid #FFFFFF; border-width:0 2px 2px 0; transform:rotate(45deg); }

/* 반응형 — 페이지 구조 (3-composition/page.md) */
@media (min-width:768px){
  .markdown{ padding:0 32px; }
}
@media (min-width:1024px){
  .thread{ width:720px; }
}
```

## 미정

- `cui-` 접두어 패키지: 문서에는 `chat-ui.js`에서 모든 클래스에 `cui-` 접두가 붙는다고 했으나 실제로 없음. `chat-ui.js`의 기본 `prefix`는 `cui-`이지만 함께 넣을 CSS(`ChatUI.css`)가 빈 값이고 이를 채우는 빌드가 없음. `chat.html`은 `prefix: ''`로 씀
- 결과 파일 표기: 이 문서의 "마크다운 → 블록"은 `[결과 파일: 이름.xlsx · 설명]`, 2-1의 ANS-26은 `[결과 파일: 이름.확장자 · 종류]`, 3-3은 `[결과 파일: 이름 · 종류]`. 파서는 셋 모두 읽음
- 스타일이 없는 클래스: `is-open`, `is-focus`, `is-running`은 클래스 목록에 있으나 스타일 표가 없어 생성 CSS에 없음(`is-open`은 4-10의 `.source-pop.is-open` 규칙에서만 쓰임)
