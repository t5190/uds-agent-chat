---
name: uds-chat-build
description: 채팅 영역(대화 화면, 말풍선, 답변 본문, 입력창, AI 심볼 모션)을 HTML로 만들거나 시안·목업에 적용할 때 쓴다. 정해진 디자인 시스템의 구조·스타일만 써서 단독 HTML을 만든다. 채팅 UI, 챗봇 화면, 대화 시안 요청에 해당한다.
---

# uds-chat-build

채팅 영역을 **같은 구조 · 같은 스타일**로 만드는 스킬입니다. 스타일의 정본은 `agent_design_system/`의 md이고, 이 폴더는 오프라인에서 그대로 동작합니다(라이브러리와 폰트가 `lib/vendor/`에 들어 있습니다).

## 용도별 시작점

| 요청 | 시작점 |
| --- | --- |
| 채팅 화면 HTML 만들기 (기본) | 아래 "화면 만드는 순서" |
| 답변을 스펙 형식으로 쓰기 | `agent_design_system/2-rules/2-1-answer.md`, `agent_design_system/5-templates/5-1-patterns.md` |
| 출처 · 리서치 · 작업 중 요소가 있는 화면 | 아래 "출처 · 리서치 · 작업 중 요소" |

## 화면 만드는 순서

1. 용어를 `GLOSSARY.md`에서 확인하고, 문서 목록은 `agent_design_system/index.md`에서 본다. 화면을 만들 때는 `audience`가 `ui`나 `both`인 문서를 읽는다.
2. 구조는 `agent_design_system/4-resources/4-8-markup.md`의 "대화 → HTML"과 "클래스 목록"을 따른다.
3. `lib/design-system.css`가 최신이어야 한다. 스펙을 고쳤다면 `npm run build`를 먼저 실행한다.
4. **결과물은 스킬 폴더가 아니라 사용자가 작업 중인 프로젝트에 만든다.** 스킬 폴더(`.claude/skills/uds-chat-build/`)에는 파일을 쓰지 않는다. 스킬을 새로 설치하면 지워지고, 숨김 폴더라 브라우저가 막을 수 있다. 프로젝트 폴더(현재 작업 폴더)에서 다음을 실행한다.

   ```
   node <스킬 폴더>/scripts/export-assets.mjs uds-chat
   ```

   `uds-chat/assets/`에 CSS, 폰트, Lottie, 심볼 모션, 순차 재생 스크립트(`stream-play.js`)가 복사되고, `uds-chat/serve.mjs`(결과물을 띄우는 서버)도 함께 놓인다. HTML은 `uds-chat/<이름>.html`로 만든다. 사용자가 다른 위치를 말하면 그곳을 쓴다. 이미 `uds-chat/assets/`가 있으면 덮어쓴다.
5. 기준 사례 `samples/example.html`의 구조를 따라 HTML을 쓴다. 링크는 `assets/` 기준으로 쓴다: `<link rel="stylesheet" href="assets/design-system.css">`, `<script src="assets/vendor/lottie.min.js">`, `<script src="assets/agent-motion.js">`. 예시 파일의 `../lib/…` 경로는 스킬 폴더 안에서만 맞으므로 그대로 옮기지 않는다.
6. **심볼 모션은 필수이고 누락하면 안 된다.** 응답이 진행 중인 줄(`.status`)에는 `.symbol.is-status`를, 첫 진입 화면(`.landing`)에는 `.symbol.is-landing`을 넣고 `AgentMotion`으로 재생한다. 텍스트만 있는 상태 줄은 누락이다. **진행 중인 답변 메시지(`.msg.ai`)에는 `data-stream`을 달고 `<script src="assets/stream-play.js" defer></script>`를 넣는다.** 생각 중 한 바퀴 뒤 답변이 chat.html처럼 순서대로 이어 붙는다(움직임 줄이기가 켜져 있거나 `?play=0`이면 바로 보임). 마크업은 정적 그대로 둔다. 재생 코드는 `samples/example.html`(정적 마크업)이나 `samples/ipad-purchase.html`(턴 재생)을 따르고, 모션 경로 `BASE`는 `assets/motion/`으로 바꾼다. 점검 스크립트가 누락을 오류로 잡는다.
7. 정의에 없는 값이나 요소는 만들지 않고 사용자에게 "미정"으로 알린다.
8. `node <스킬 폴더>/scripts/check-mockup.mjs uds-chat/<이름>.html`이 통과해야 한다. 심볼 누락, 정의 밖 클래스와 값, `<body>` 바로 아래가 `.chat`이 아닌 구조, 없는 CSS 경로를 오류로 잡는다.
9. 점검이 통과하면 **서버로 띄워 브라우저로 바로 연다**("결과물 열기"). 사용자에게 열라고 시키지 않는다. 열고 나서 주소를 한 줄로 알린다.

## 결과물 열기 (서버)

결과물은 `file://`가 아니라 서버 주소로 연다. 서버가 없으면 폰트 · 모션 파일이 막혀 화면이 깨질 수 있다. 의존 패키지 없이 Node 20 이상만 있으면 된다.

1. 프로젝트 폴더에서 백그라운드로 실행한다: `node uds-chat/serve.mjs` (기본 포트 8800, 쓰고 있으면 다음 포트로 넘어간다. 출력에 실제 주소가 나온다)
2. 출력된 주소 `http://127.0.0.1:<포트>/<이름>.html`을 연다. macOS `open <주소>`, Linux `xdg-open <주소>`, Windows `start "" <주소>`
3. 이미 서버가 떠 있으면 새로 띄우지 않고 같은 주소의 새 파일만 연다. 숨김 파일(`.`으로 시작)은 내보내지 않고 `127.0.0.1`에서만 열린다
4. 끄는 법: 서버를 띄운 터미널에서 `Ctrl+C`. 다른 사람에게 보여 줄 때는 `uds-chat/` 폴더째 전달하고 같은 명령으로 띄운다

## 출처 · 리서치 · 작업 중 요소

HTML을 직접 쓸 때의 구조와 값은 `agent_design_system/4-resources/4-10-source.md`(출처 칩 · 검색 단계 · 리서치 작업 상태 줄), `4-9-symbol.md`(심볼 · 텍스트 시머 · 작업 완료)가 정본이고, 클래스는 `4-8-markup.md`의 "클래스 목록"에 있는 것만 씁니다. 기준 사례는 아래 시안입니다.

| 만들 것 | 기준 사례 |
| --- | --- |
| 문장 끝 출처 칩, 호버 · 탭 미리보기 카드, 출처 목록 | `samples/source-answer.html` |
| 검색 단계, 펼치는 리서치 과정, 표 · 목록이 섞인 긴 답변 | `samples/source-complex.html` |
| 작업 중 단계 문구 교체, 작업 완료(완료 문구 + `>`), 긴 문구 말줄임 | `samples/working-cases.html` |

- 상태 줄 문구(`.status-label`)는 어떤 상태에서도 14px로 고정이다. 크기를 직접 바꾸지 않는다
- 텍스트 시머(띠 색은 불투명도 50%의 흰색)는 작업 상태 줄에 `.is-thinking` · `.is-thinking-end` · `.is-working` 클래스만 붙이면 CSS가 처리한다. 문구를 바꿀 때는 `.status-label`에 `.is-swapping`을 120ms 붙였다 뗀다
- 출처 칩의 미리보기 카드는 Desktop에서 CSS 호버로 열리고, Mobile 탭용으로 `.source-pop`에 `.is-open`을 토글하는 스크립트가 필요하다(기준 사례에 있음)
- 파비콘은 이미지를 넣지 않고 `.favicon`에 글자 `U`를 쓴다. 작업이 끝나 완료 문구만 남길 때는 심볼 없이 `.status.is-research.is-complete`에 `>`(`.status-chevron`)를 붙인다. 완료 문구로 교체한 뒤 심볼을 즉시 지우고 문구를 제자리에서 왼쪽으로 옮기는 예는 `samples/ipad-purchase.html`
- 기준 사례에 없는 조합(예: 검색이 끝난 답변 위에 검색 칩 묶음)은 만들지 않고 "미정"으로 알린다

## 핸드오프 수준 HTML

개발자가 그대로 받아 쓸 수 있어야 한다.

- 대화 내용은 JS로 만들지 않고 **정적 마크업**으로 쓴다. JS는 심볼 모션 재생 등 동작에만 쓴다. 턴을 순서대로 붙이는 연출이 요청일 때만 `ipad-purchase.html` 방식을 쓴다.
- 들여쓰기 2칸, 섹션마다 한 줄 주석(요청, 응답, 입력창 등), 의미 있는 태그(`button`, `ul`, `table`), `aria-label`을 단다.
- `<head>`에 `<title>`과 필요한 파일 목록 주석을 둔다. 경로는 파일 위치 기준 상대 경로(`assets/…`)이고, `uds-chat/` 폴더째 옮겨도 깨지지 않아야 한다.
- 색과 크기는 직접 쓰지 않는다. 정의된 클래스만 쓴다. 더미 문구(lorem ipsum)와 임시 값을 남기지 않는다.

## 배경

채팅 영역의 회색 배경은 첫 화면부터 뷰포트에 꽉 찬다. `<body>` 바로 아래에 `.chat` 하나만 두면 `assets/design-system.css`가 처리한다(`body` 여백 0, `.chat` 높이 100dvh 이상). 배경색을 `body`나 `.chat`에 직접 따로 쓰지 않는다.

규칙의 정본은 `standard/profile/chat-ui-profile.md`의 "시안 규칙"이다. `style` 속성, `<style>`, SVG 속성에 색과 크기 값을 직접 쓰지 않는다.

## 소비자가 읽지 않는 것

스펙을 고치는 사람용입니다. 화면을 만들 때는 열지 않습니다: `standard/`(문서 표준, 단 "시안 규칙"은 위에서 가리킴), `docs/`, `CHANGELOG.md`, `scripts/validate.mjs`, `scripts/build-docs.mjs`, `.claude/`, `dist/`(재생성 가능), 그리고 제작자용인 `chat.html` · `conversations/` · `lib/chat-ui.js`(스펙을 확인하는 도구라 사용자에게 배포하는 결과물이 아님).

## 오프라인

- `lib/vendor/marked.min.js`, `lib/vendor/lottie.min.js`, `lib/vendor/fonts/`를 쓴다. 외부 네트워크가 필요 없다.
- 시안 HTML은 `uds-chat/serve.mjs` 서버로 연다(위 "결과물 열기").
- Node 20 이상이 필요하다(빌드와 점검 스크립트용, 의존 패키지 없음).
