---
id: IDX-OPEN-ISSUES
type: index
title: 미정 목록
status: stable
version: 1.0.0
summary: 각 문서의 "## 미정"과 문서 틀 예외를 자동으로 모은 목록입니다.
---

# 미정 목록

각 문서의 `## 미정`과 `<!-- 예외: … -->`를 모은 목록입니다. `node scripts/build-docs.mjs`가 만들므로 직접 고치지 않습니다. 결정이 나면 원래 문서에서 그 줄을 지우고 [CHANGELOG](../CHANGELOG.md)에 적습니다.

## 문서별 미정

### [UI 원칙](../agent_design_system/1-principles/1-2-ui.md)

- P-UI-03 · P-UI-05가 값(gap 8, 720)을 직접 적음. 값은 4단계에만 두는 프로필 "값 표기"와 맞지 않음

### [답변 규칙](../agent_design_system/2-rules/2-1-answer.md)

- ANS-36 적용 범위: EX-00 ~ 12는 시그니처로 시작하지 않음. 규칙 범위를 좁힐지 시연을 고칠지
- P-ANS-01과 ANS-01 등 원칙과 규칙 문장이 겹침
- 결과 파일 표기가 ANS-26 · 3-3 · 4-8에서 다름
- 상담형 골격과 EX-10에 제목과 구분선이 함께 있어 ANS-25와 충돌

### [UI 규칙](../agent_design_system/2-rules/2-2-ui.md)

- UI-SYM-02 강도가 금지인데 내용은 하라는 지시
- 2-2는 stable인데 "(초안)" 규칙이 29개 있음

### [화면](../agent_design_system/3-composition/3-1-page.md)

- `## 스타일` 표에 `.chat`의 `background`가 `.chat` 행과 `&` 행으로 두 번 적혀 있음. 같은 값이라 화면 차이는 없으나 한 행으로 줄일지 정해야 함

### [턴](../agent_design_system/3-composition/3-2-turn.md)

- Mobile 3fr 열 폭이 이 문서는 271.5, [4-3. 메시지](../agent_design_system/4-resources/4-3-message.md)와 [4-5. 이미지](../agent_design_system/4-resources/4-5-image.md)는 272로 다름. 어느 값을 정본으로 할지 정해야 함

### [블록](../agent_design_system/3-composition/3-3-block.md)

- 결과 카드 표기가 문서마다 다름. 이 문서는 `[결과 파일: 이름 · 종류]`, [2-1. 답변 규칙](../agent_design_system/2-rules/2-1-answer.md)의 ANS-26은 `[결과 파일: 이름.확장자 · 종류]`, [4-8. HTML 구조 · 고정 CSS](../agent_design_system/4-resources/4-8-markup.md)는 `[결과 파일: 이름.xlsx · 설명]`. 하나로 정해야 함

### [디자인 토큰](../agent_design_system/4-resources/4-1-tokens.md)

- 간격 12의 Figma 변수 이름이 네 가지로 섞여 있음: 이 문서의 `spacing/component/y/scale-04`(표 셀 상하 패딩) · `spacing/gap/12`(액션 아이콘 사이 등), 4-6의 `spacing/content/gap/12`(`.files` gap) · `spacing/component/x/scale-04`(`.file` gap). 용도별로 다른 변수인지, 하나로 맞춰야 하는지 확인 필요
- Dark 값: Figma에 다크 모드 값이 생기면 바꿈

### [출처](../agent_design_system/4-resources/4-10-source.md)

- 칩 배경 불투명도 6% · 5%와 호버 12%, 카드 그림자(아래 4 · 번짐 16 · 8%)는 피그마에 토큰이 없어 4-1에 로컬 토큰(`chat/source/bg`, `chat/source/bg-hover`, `chat/search/bg`, `chat/shadow/popover`)으로 임시 정의함. 프리미티브 불투명도는 4 · 8 · 16 · 24 · 40 · 64 · 80뿐
- 출처 칩 오른쪽 패딩 6인 변형이 있음(기본은 8)
- 칩을 눌러 원문 링크로 이동한다는 설명(`708-3729`)과 Mobile에서 누르면 미리보기가 뜬다는 설명(`767-3180`)이 겹침. 두 동작을 어떻게 나누는지 확인 필요
- 칩과 카드의 Dark 값(`#FFFFFF`의 불투명도를 라이트의 1.5배로 맞춘 임시 값)
- 칩에서 카드로 마우스를 옮길 때 사이 8이 비어 카드가 사라짐
- 검색 단계 칩 묶음 간격(8은 임시), 검색 단계 칩이 놓이는 줄(웹 검색 완료 문구와의 배치)
- 피그마 `738-12526`의 파비콘 대체는 사이트마다 색과 첫 글자가 다르지만, 요청에 따라 모두 검은 원 + "U"로 통일함
- 리서치 작업 상태 줄을 펼친 화면(단계 목록, 단계별 시간 · 설명 · 칩)은 피그마에 없어 일반적인 AI 서비스 형태(세로선으로 이은 단계 목록)로 임시 정의함. 디자이너 시안이 나오면 교체
- 검색 단계가 여러 개일 때의 간격(앞 블록과 24를 그대로 씀)
- "계산에 쓴 가정 보기"(접히는 상자, `738:12568`)를 어느 문서에서 다룰지(4-4 또는 4-10)
- 2-2 규칙화(문장당 최대 3개, 호버 미리보기 등)
- 미리보기 카드 안 글자별 쓰임

### [메시지](../agent_design_system/4-resources/4-3-message.md)

- 응답 영역의 작업 상태 줄 · 출처는 초안
- 스크림 높이가 이 문서는 140, [4-7. 입력창](../agent_design_system/4-resources/4-7-input.md)은 158로 다름
- 맨 아래로 이동 버튼 배경이 이 문서와 [4-1. 디자인 토큰](../agent_design_system/4-resources/4-1-tokens.md)은 `alpha/white-80`, 4-7은 `#FCFCFC`로 다름
- Mobile 3fr 열 폭이 이 문서는 272, [3-2. 턴](../agent_design_system/3-composition/3-2-turn.md)은 271.5로 다름
- 말풍선을 접는 기준: 피그마(111-64801)는 5줄 초과 시 4번째 줄 끝에 말줄임표와 전체보기, 이 문서와 `lib/chat-ui.js`(`CLAMP_LINES = 5`)는 5줄 초과 시 말줄임표 없이 전체보기만 둠. 피그마의 "4번째 줄"이 맞는지 디자이너 확인 중

### [파일](../agent_design_system/4-resources/4-6-file.md)

- 실패 타일 경고 아이콘 색 `#D92D20`(다크 `#FF6B60`)과 실행 중 · 실패 타일의 다크 배경, 스피너 속도 0.8초는 피그마에 값이 없어 임시로 정함
- 확장자 목록의 프레젠테이션에 `slide`가 있으나 UI-INPUT-59의 형식 목록에는 없음
- 간격 12의 토큰 이름이 섞여 있음: `spacing/gap/12`(4-1) · `spacing/content/gap/12`(`.files` gap) · `spacing/component/x/scale-04`(`.file` gap) · `spacing/component/y/scale-04`(4-1, 4-4)
- 시나리오의 결과 카드 종류 "PDF 문서"(`conversations/movie.md`), "플레이리스트"(`conversations/playlist.md`)가 이 문서의 유형 목록에 없음
- 결과 카드 실행 중 · 실패 상태의 클래스가 아직 HTML 계약에 없음
- 결과 카드 전체가 초안(Figma 프레임이 반투명 상태)

### [입력창](../agent_design_system/4-resources/4-7-input.md)

- 스크림 높이: 이 문서는 158(스타일 표 `158px`), 4-3은 140
- 맨 아래로 이동 버튼 배경: 이 문서 스타일 표는 `#FCFCFC`(토큰 없음), 4-1 · 4-3은 `alpha/white-80`. 4-3의 배경 흐림 2px는 이 문서 스타일 표에 없음
- 첨부 영역은 Figma에서 제작 중이라 값이 바뀔 수 있고, 클래스와 스타일 표가 없음
- 메뉴 항목 레이블이 Figma에 아직 "레이블"로만 들어 있어 아이콘으로 항목을 추정함
- 인포 바 상황 표의 상태 칸과 실제 색이 서로 어긋남

### [HTML 구조 · 고정 CSS](../agent_design_system/4-resources/4-8-markup.md)

- `cui-` 접두어 패키지: 문서에는 `chat-ui.js`에서 모든 클래스에 `cui-` 접두가 붙는다고 했으나 실제로 없음. `chat-ui.js`의 기본 `prefix`는 `cui-`이지만 함께 넣을 CSS(`ChatUI.css`)가 빈 값이고 이를 채우는 빌드가 없음. `chat.html`은 `prefix: ''`로 씀
- 결과 파일 표기: 이 문서의 "마크다운 → 블록"은 `[결과 파일: 이름.xlsx · 설명]`, 2-1의 ANS-26은 `[결과 파일: 이름.확장자 · 종류]`, 3-3은 `[결과 파일: 이름 · 종류]`. 파서는 셋 모두 읽음
- 스타일이 없는 클래스: `is-open`, `is-focus`, `is-running`은 클래스 목록에 있으나 스타일 표가 없어 생성 CSS에 없음(`is-open`은 4-10의 `.source-pop.is-open` 규칙에서만 쓰임)

### [AI 심볼 · 모션](../agent_design_system/4-resources/4-9-symbol.md)

- 첫 진입 화면의 좌측 메뉴(LNB) · 상단 헤더는 서비스 영역이라 이 문서가 그리지 않음. 입력창은 화면 폭에 맞춰 Desktop 720, Mobile 화면 폭 − 40이며 여러 줄 입력으로 커지는 동작은 서비스가 구현
- LNB 로고: 피그마 `722-1768` Desktop 표에 LNB(ONB) 로고 24 · 문구 간격 8이 있으나 채팅 영역 밖이라 다루지 않음. "두 곳에만 쓴다"와의 관계 확인 필요
- 도구 사용 줄 · 작업 목록 카드는 [3-3. 블록](../agent_design_system/3-composition/3-3-block.md)에서 정의함. 작업 목록 항목의 "진행 중" 상태(피그마에는 끝냄 · 예정만 있음)는 미정
- 작업 상태 줄 문구("생각하는 중", "생각 끝", "작업하는 중"). 원본은 생각 중 문구를 서비스가 전달하고 작업 중 문구는 단계별(`setStep()`)로 바꾼다고만 정함
- 임시 값: 첫 진입 빈 화면 최소 높이 480. 시머의 다크 하이라이트 `#B8B8BD`, 직선 속도, 띠 폭 40%(최소 48px은 CSS로 지키지 못함), 문구 교체 곡선 `cubic-bezier(0.4, 0, 0.2, 1)`, 사라질 때 크기 100 → 92%는 원본에서 임시
- 작업 완료 문구의 내용과 전달 방식, `>`의 등장 연출 · 펼침 모션 · 펼친 내용의 구성(원본 미정). 클래스 이름(`.status.is-complete`, `.is-fading`, `.is-complete-label`)은 임시
- 완료 문구 이동 시간 0 ~ 240ms와 투명도 0 → 100%, 완료 문구 색(다크 `#B8B8BD`)은 원본에서 임시
- 움직임 줄이기의 정적 글자색: 원본은 `#1C1C1E`(다크 `#B8B8BD`)이나 CSS 규칙 블록은 라이트 · 다크가 다른 토큰을 쓸 수 없어 작업 상태 줄의 글자색을 그대로 씀

### [Signature](../agent_design_system/4-resources/symbol/signature.md)

- 인사말 문구. "무엇이든 물어보세요"는 임시 문구
- 인사말을 담는 요소의 클래스. [4-8](../agent_design_system/4-resources/4-8-markup.md)의 클래스 목록에 없음

### [Text Shimmer](../agent_design_system/4-resources/symbol/text-shimmer.md)

- 하이라이트 폭(40% · 최소 48)과 이징, 완료 문구 영역 폭을 넓히는 방식
- 다크 하이라이트와 정적 표시 색
- 시머 색과 [4-1. 디자인 토큰](../agent_design_system/4-resources/4-1-tokens.md)의 관계. 지금은 로컬 토큰 `chat/text/shimmer`, `chat/text/shimmer-highlight`를 임시로 둠
- 완료 문구의 색과 `>`의 연출([Working](../agent_design_system/4-resources/symbol/working.md))
- 줄인 문구의 전체 내용을 Mobile에서 보여 주는 방법
- 퇴장의 크기 100 → 92%

### [Thinking](../agent_design_system/4-resources/symbol/thinking.md)

- 상태 문구. "생각하는 중"은 임시 문구이고 길어질 때 바꿀 문구도 정해지지 않음
- 생각 끝 재생 중에 `finish()`가 올 때의 처리. 지금은 전환을 마친 뒤 종료함
- 빠른 응답(UI-SYM-23)의 기준 시간. 어느 정도까지를 "바로 준비됨"으로 볼지 정해지지 않음
- iOS 구현

### [Working](../agent_design_system/4-resources/symbol/working.md)

- 완료 문구의 내용과 전달 방식(예: `finish()`에 완료 문구와 단계 목록을 함께 전달). 예시는 "작업 완료"
- `>`의 등장 연출(페이드 여부 · 길이), 아이콘 회전과 펼침 모션, 펼친 내용의 구성
- 이동 시간 240ms와 완료 문구 색(라이트 `#1C1C1E` · 다크 `#B8B8BD`)은 원본에서 임시. 완료 문구의 투명도 0 → 100%도 임시
- 이전 답변의 완료 문구 · 아코디언은 그대로 남기고 새 질문은 새 작업 상태 줄에서 시작한다는 처리(원본 미정)
- Android · iOS 구현

### [답변 골격](../agent_design_system/5-templates/5-1-patterns.md)

- 상담형 골격에 제목과 구분선이 함께 있어 ANS-25와 충돌
- 문서 구조형 골격의 H5 · H6이 ANS-12(H4까지)의 예외인지 정하지 않음

### [시연 목록](../agent_design_system/5-templates/5-2-examples.md)

- 피그마 Templates에 "진행 상태 · 생각 중", "진행 상태 · 도구 사용 · 할 일" 2개 장면은 대응하는 시연 파일이 없음(프레임 `738-12334`, `738-12472`)
- "로고 적용 · 리서치 답변"(`738-12526`)의 "계산에 쓴 가정 보기"(접히는 상자)는 어느 문서에서 다룰지 정해지지 않아 EX-15에 넣지 않음
- 피그마의 "로고 적용 · 리서치 답변"은 장면 하나에 작업 상태 줄 · 칩 · 출처 목록 · 검색 단계가 함께 있어 EX-15 한 파일로 만듦

## 문서 틀 예외

| 문서 | 이유 |
| --- | --- |
| [AI Readable 문서 표준 (core)](../standard/core/doc-standard.md) | 이유 |
| [HTML 구조 · 고정 CSS](../agent_design_system/4-resources/4-8-markup.md) | is-open, is-focus, is-running은 스타일 표가 아직 없는 클래스(## 미정) |
