---
name: make-mockup
description: 시안, 목업, 화면 적용 요청을 받았을 때 이 프로젝트가 정의한 스타일만 써서 HTML을 만든다.
---

규칙의 정본은 standard/profile/chat-ui-profile.md의 "시안 규칙"이다. 아래는 절차다.

1. 구조를 읽는다: agent_design_system/4-resources/4-8-markup.md의 "대화 → HTML"과 "클래스 목록", 필요한 요소의 4단계 문서.
2. `npm run build`로 `lib/design-system.css`를 최신으로 만든다.
3. HTML을 쓴다. 기준 사례 samples/example.html의 구조를 따른다.
4. 진행 중인 응답(`.status`)이나 첫 진입 화면(`.landing`)이 있으면 심볼 모션을 넣는다. 누락하지 않는다.
5. 정의에 없는 값이나 요소는 만들지 않고 사용자에게 "미정"으로 알린다.
6. `node scripts/check-mockup.mjs <파일>`이 통과하는지 확인하고, INDEX.md의 "시안"에 등록한다.
7. 진행 중인 답변 `.msg.ai`에는 `data-stream`을 달고 `lib/stream-play.js`를 넣어 답변이 순서대로 나오게 한다. 상태 줄 문구(`.status-label`)는 모든 상태에서 14px로 고정이다.
8. 점검 뒤 `npm run dev` 서버(또는 `node uds-chat/serve.mjs`)로 띄워 브라우저로 연다. `file://`로 열지 않는다.
