---
id: SPEC-4-10
type: spec
title: 출처
status: draft
version: 0.6.0
summary: 답변의 출처를 보여 주는 요소(출처 칩, 검색 단계, 리서치 작업 상태 줄, 미리보기 카드, 출처 목록)의 구조, 크기, 간격, 동작을 정합니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=708-3729, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=767-3180]
---

# 4-10. 출처

답변이 어떤 사이트를 참고했는지 알리는 요소를 한곳에 정합니다. 문장 끝의 출처 칩, 검색 단계의 칩, 칩에 올리면 뜨는 미리보기 카드, 답변 끝의 출처 목록을 다룹니다.

- 상태: 초안. 칩 배경 불투명도와 카드 그림자는 로컬 토큰으로 임시 정의했고 Dark 값도 임시
- 구현: `chat-ui.js`가 대화 파일 문법([4-8](4-8-markup.md#출처))으로 그림. 예: [리서치 답변](../5-templates/examples/15-research.md) · [출처 미리보기](../5-templates/examples/16-source-preview.md) · [출처 답변 시안](../../samples/source-answer.html)
- 규칙: [2-2. UI 규칙](../2-rules/2-2-ui.md)의 UI-MSG-20 · UI-INPUT-32

## 구조

```
응답 영역
├─ 본문 문장 끝     출처 칩(S)           문장당 최대 3개
│    └─ 호버(Desktop) · 탭(Mobile) → 출처 미리보기 카드 (본문 위에 겹쳐 뜸)
├─ 작업 상태 줄          리서치 작업 상태 줄       "리서치 과정 · 4단계 완료 · 32초" + 펼침 화살표 (.status.is-research)
├─ 검색 단계        검색 단계(.search-step)  검색어 한 줄 + 아래 세로선 + 검색 단계 칩(M)
├─ 답변 끝          출처 제목 + 출처 목록  (.sources)
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 출처 칩 | `.source-chip`(래퍼 `.source-pop`) | 답변 문장 끝에 붙는 작은 칩. 파비콘과 도메인만 보여 근거를 가볍게 알림 |
| 검색 단계 | `.search-step`(`.step-head` · `.step-results`) | 웹 검색 한 번을 보여 줌. 지구본 아이콘과 검색어 한 줄, 그 아래 세로선을 따라 조회한 사이트 칩 |
| 검색 단계 칩 | `.search-chip`(묶음 `.search-chips`) | AI가 웹 검색을 하는 동안 조회한 사이트를 나열. 답변 본문에는 쓰지 않음 |
| 리서치 작업 상태 줄 | `.status.is-research`(`.status-label` · `.status-chevron`) | 응답 맨 위. 진행 중에는 "웹에서 찾는 중 · 출처 3개"를 반짝이는 글자로, 끝나면 "리서치 과정 · 4단계 완료 · 32초"와 펼침 화살표(`.is-done`)로 보여 줌 |
| 출처 미리보기 카드 | `.source-preview`(`.source-site` · `.source-title` · `.source-summary` · `.source-date`) | 출처 칩에 올리거나 누르면 뜨는 카드 |
| 출처 제목 · 출처 목록 | `.sources` | 답변 끝에 모은 출처. 번호, 파비콘(`.favicon`), 링크 |
| 파비콘 | `.favicon` | 칩과 목록 앞에 놓는 원형 사이트 아이콘. 이미지를 못 불러오면 검은 원 + 흰색 "U" |

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 출처 칩 | 답변 문장 | 문장 끝에 이어 붙임. 문장당 최대 3개 |
| 리서치 작업 상태 줄 | 응답 영역 | 맨 위. 아래 본문과 16 떨어짐 |
| 검색 단계 | 응답 | 앞 블록과 24(블록 gap 8 + 16). 검색어 줄 아래 8에 세로선과 칩 |
| 검색 단계 칩 | 검색 단계 | 세로선에서 17 오른쪽, 가로로 나열하고 넘치면 줄바꿈(Mobile) |
| 출처 미리보기 카드 | 출처 칩 | 칩 아래 8에 카드 왼쪽 끝을 칩 왼쪽 끝에 맞춤. 응답 영역 폭을 넘으면 안쪽으로 당김. 본문 위에 겹쳐 뜨고 레이아웃을 밀지 않음 |
| 출처 제목 · 출처 목록 | 답변 | 맨 끝 |

## 크기

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 출처 칩 | 높이 | 22 | |
| 출처 칩 | 패딩 | 위아래 3 · 왼쪽 6 · 오른쪽 8 | 오른쪽 6인 변형이 피그마에 있음(미정) |
| 출처 칩 | 파비콘 | 14 원형 | |
| 출처 칩 | 글자 | `chat/label` 12 · `color/text/base/secondary` | |
| 출처 칩 | 배경 · 모서리 | `#1A1A1A` 불투명도 6% · 원형(`radius/full`) | 토큰 `chat/source/bg`(임시) |
| 출처 칩 | 호버 배경 | `#1A1A1A` 불투명도 12% | 토큰 `chat/source/bg-hover`(임시) |
| 검색 단계 칩 | 높이 | 28 | |
| 검색 단계 칩 | 패딩 | 위아래 4 · 좌우 10 | |
| 검색 단계 칩 | 파비콘 | 16 원형 | |
| 검색 단계 칩 | 글자 | `chat/label` 14 · `color/text/base/secondary` | |
| 검색 단계 칩 | 배경 · 모서리 | `#1A1A1A` 불투명도 5% · 원형(`radius/full`) | 토큰 `chat/search/bg`(임시) |
| 파비콘 | 이미지 | 사이트 파비콘을 이미지 채움(중앙 크롭)으로 넣음 | 원형 14(칩) · 16(검색 단계 칩 · 목록) · 20(출처 버튼) |
| 파비콘 | 대체 | 검은 원 + 흰색 "U" Bold. 14는 글자 8, 16과 20은 글자 10 | 사이트마다 바뀌지 않음 |
| 검색 단계 | 검색어 줄 | 지구본 아이콘 20 + 검색어 16 Medium · 회색(`chat/text/status`) | 간격 8 |
| 검색 단계 | 세로선 | 너비 1 · `color/border/base/high` | 검색어 줄 왼쪽에서 10 안쪽 |
| 리서치 작업 상태 줄 | 글자 | `chat/label` 14 · 회색(`chat/text/status`) | 로고 20 + 글자 간격 8, 펼침 화살표 16은 글자 오른쪽 8 |
| 미리보기 카드 | 폭 | 360 | 높이는 내용에 따름 |
| 미리보기 카드 | 배경 · 모서리 · 테두리 | `#FFFFFF` · radius 12 · 테두리 `#E5E5E5` | |
| 미리보기 카드 | 패딩 | 위 14 · 나머지 16 | |
| 미리보기 카드 | 그림자 | 아래 4 · 번짐 16 · `#1A1A1A` 불투명도 8% | 토큰 `chat/shadow/popover`(임시) |
| 미리보기 카드 | 사이트 줄 | 파비콘 16 + 사이트 이름 `chat/label` 12 · `color/text/base/quaternary`, 간격 4 | |
| 미리보기 카드 | 제목 | `chat/P-strong` 16 · `color/text/base/primary` | |
| 미리보기 카드 | 요약 | 14 Medium · `color/text/base/tertiary` | 제목과 간격 4 |
| 미리보기 카드 | 날짜 | `chat/label` 12 · `color/text/base/quaternary` | |
| 출처 제목 | 글자 | `####` chat/H4 | |
| 출처 목록 | 항목 | 번호(Bold 16) + 파비콘 16 + 링크(16 Medium, `color/status/text/informative`, 밑줄) | 파비콘은 이미지 자리(회색)로 처리. 파비콘과 링크 사이 6은 임시 |

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 출처 칩의 파비콘 ↔ 도메인 | 4 | |
| 검색 단계 칩의 파비콘 ↔ 도메인 | 6 | |
| 출처 칩 ↔ 미리보기 카드 | 8 | |
| 미리보기 카드 안 요소 사이 | 8 | 제목 ↔ 요약은 4 |
| 출처 칩과 칩 사이 | 4 | 같은 문장 끝에서 |
| 검색 단계 칩 사이 | 8 | 임시 |
| 출처 제목 위 | 24 | |
| 출처 목록 | 위 8 · 항목 위 4 · gap 8 | |
| 출처 목록 항목의 파비콘 ↔ 링크 | 8 | 번호와 파비콘 사이도 8 |
| 검색어 줄 ↔ 세로선 칩 | 8 | 칩 위 4 + 칩 묶음 위 4 |

## 상태

| 상태 | 언제 | 바뀌는 것 |
| --- | --- | --- |
| 출처 칩 기본 | 평소 | 배경 불투명도 6% |
| 출처 칩 호버 | Desktop에서 마우스를 올림 | 배경 불투명도 12%로 진해지고 미리보기 카드가 뜸 |
| 출처 칩 누름 | Mobile에서 누름 | 미리보기 카드가 뜸 |
| 파비콘 대체 | 파비콘을 불러오지 못함 | 검은 원 + 흰색 "U"로 바꿈 |
| 리서치 작업 상태 줄 진행 중 | 검색하는 동안 | 로고 모션 + 반짝이는 글자. 액션 줄 없음 |
| 리서치 작업 상태 줄 완료 | 리서치가 끝남 | 로고 + 글자 + 펼침 화살표. 액션 줄은 답변 끝에 있음 |
| 리서치 작업 상태 줄 펼침 (임시) | 작업 상태 줄을 누름 | 화살표가 위로 돌고 단계 목록이 아래에 열림. 다시 누르면 접힘 |

## 동작

1. Desktop에서 출처 칩에 마우스를 올림 → 미리보기 카드가 칩 아래에 뜬다
2. Mobile에서 출처 칩을 누름 → 미리보기 카드가 뜬다
3. 문장 끝에 붙이는 칩은 문장당 최대 3개까지 둔다

## 규칙

동작 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 출처 목록 위치 | UI-MSG-20 |
| 입력창 첨부와 함께 뜨는 출처 칩의 삭제 버튼 | UI-INPUT-32 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요. 칩 배경과 카드 그림자 값은 로컬 토큰이며 임시입니다.

### 출처 칩 · 검색 단계 칩

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.favicon` | `display` | `flex` | 글자를 가운데에 놓음 |
| `.favicon` | `align-items` | `center` | |
| `.favicon` | `justify-content` | `center` | |
| `.favicon` | `flex` | `none` | |
| `.favicon` | `width` | `14px` | |
| `.favicon` | `height` | `14px` | |
| `.favicon` | `border-radius` | `50%` | |
| `.favicon` | `background` | `#000000` | 대체 원 |
| `.favicon` | `color` | `#FFFFFF` | 대체 글자 "U" |
| `.favicon` | `font-size` | `8px` | 대체 글자. 16 이상은 10 |
| `.favicon` | `font-weight` | `700` | |
| `.favicon` | `line-height` | `1` | |
| `.favicon` | `object-fit` | `cover` | 중앙 크롭 |
| `.source-chip` | `display` | `inline-flex` | |
| `.source-chip` | `align-items` | `center` | |
| `.source-chip` | `gap` | `4px` | |
| `.source-chip` | `height` | `22px` | |
| `.source-chip` | `padding` | `3px 8px 3px 6px` | |
| `.source-chip` | `margin-left` | `4px` | |
| `.source-chip` | `border-radius` | `{radius/full}` | radius/full |
| `.source-chip` | `background` | `{chat/source/bg}` | 로컬 |
| `.source-chip` | `color` | `{color/text/base/secondary}` | color/text/base/secondary |
| `.source-chip` | `font-size` | `12px` | chat/label |
| `.source-chip` | `font-weight` | `500` | fontWeight/base |
| `.source-chip` | `line-height` | `16px` | |
| `.source-chip` | `letter-spacing` | `0` | |
| `.source-chip` | `text-decoration` | `none` | |
| `.source-chip:hover` | `background` | `{chat/source/bg-hover}` | 로컬 |
| `.source-pop.is-open .source-chip` | `background` | `{chat/source/bg-hover}` | 로컬 |
| `.search-chips` | `display` | `flex` | |
| `.search-chips` | `flex-wrap` | `wrap` | |
| `.search-chips` | `gap` | `8px` | 임시 |
| `.search-chip` | `display` | `inline-flex` | |
| `.search-chip` | `align-items` | `center` | |
| `.search-chip` | `gap` | `6px` | |
| `.search-chip` | `height` | `28px` | |
| `.search-chip` | `padding` | `4px 10px` | |
| `.search-chip` | `border-radius` | `{radius/full}` | radius/full |
| `.search-chip` | `background` | `{chat/search/bg}` | 로컬 |
| `.search-chip` | `color` | `{color/text/base/secondary}` | color/text/base/secondary |
| `.search-chip` | `font-size` | `14px` | chat/label |
| `.search-chip` | `font-weight` | `500` | fontWeight/base |
| `.search-chip` | `line-height` | `20px` | |
| `.search-chip` | `text-decoration` | `none` | |
| `.search-chip .favicon` | `width` | `16px` | |
| `.search-chip .favicon` | `height` | `16px` | |
| `.search-chip .favicon` | `font-size` | `10px` | |

### 검색 단계 · 리서치 작업 상태 줄

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.search-step` | `margin-top` | `16px` | 앞 블록과 24(블록 gap 8 + 16) |
| `.step-head` | `display` | `flex` | |
| `.step-head` | `align-items` | `center` | |
| `.step-head` | `gap` | `8px` | |
| `.step-head` | `color` | `{chat/text/status}` | chat/text/status |
| `.step-head` | `font-size` | `16px` | chat/P |
| `.step-head` | `font-weight` | `500` | fontWeight/base |
| `.step-head` | `line-height` | `1.5` | |
| `.step-head svg` | `width` | `20px` | |
| `.step-head svg` | `height` | `20px` | |
| `.step-head svg` | `flex` | `none` | |
| `.step-results` | `margin` | `4px 0 0 10px` | |
| `.step-results` | `padding` | `4px 0 4px 17px` | |
| `.step-results` | `border-left` | `1px solid {color/border/base/high}` | 세로선 |
| `.status .status-label` | `font-size` | `14px` | chat/label. 모든 상태(생각 중 · 생각 끝 · 작업 중 · 완료 · 리서치 끝)에서 14px로 고정해 글자 크기가 튀지 않음 |
| `.status .status-label` | `line-height` | `1.4` | |
| `.status-chevron` | `display` | `inline-flex` | |
| `.status-chevron` | `flex` | `none` | |
| `.status-chevron` | `width` | `16px` | |
| `.status-chevron` | `height` | `16px` | |
| `.status-chevron` | `margin-left` | `8px` | |
| `.status-chevron svg` | `width` | `16px` | |
| `.status-chevron svg` | `height` | `16px` | |

### 펼친 리서치 과정 (임시)

> 펼친 화면은 피그마에 없어 일반적인 AI 서비스 형태로 임시 정의했습니다. 모든 값이 임시입니다.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.status.is-done` | `cursor` | `pointer` | 누르면 펼침 · 접힘 |
| `.status.is-open .status-chevron svg` | `transform` | `rotate(180deg)` | 펼치면 화살표가 위로 |
| `.process` | `display` | `none` | 접힌 상태 |
| `.status.is-open + .process` | `display` | `block` | 작업 상태 줄 바로 아래에 펼침 |
| `.process` | `margin-top` | `8px` | |
| `.process-step` | `position` | `relative` | |
| `.process-step` | `display` | `flex` | |
| `.process-step` | `gap` | `12px` | |
| `.process-step` | `padding-bottom` | `16px` | |
| `.process-step:not(:last-child)::before` | `content` | `""` | 단계를 잇는 세로선 |
| `.process-step:not(:last-child)::before` | `position` | `absolute` | |
| `.process-step:not(:last-child)::before` | `left` | `9px` | |
| `.process-step:not(:last-child)::before` | `top` | `24px` | |
| `.process-step:not(:last-child)::before` | `bottom` | `4px` | |
| `.process-step:not(:last-child)::before` | `width` | `1px` | |
| `.process-step:not(:last-child)::before` | `background` | `{color/border/base/high}` | color/border/base/high |
| `.process-mark` | `display` | `flex` | |
| `.process-mark` | `flex` | `none` | |
| `.process-mark` | `align-items` | `center` | |
| `.process-mark` | `justify-content` | `center` | |
| `.process-mark` | `width` | `20px` | |
| `.process-mark` | `height` | `20px` | |
| `.process-mark` | `border-radius` | `50%` | |
| `.process-mark` | `border` | `1px solid {color/border/base/high}` | |
| `.process-mark` | `color` | `{chat/text/status}` | |
| `.process-mark svg` | `width` | `16px` | |
| `.process-mark svg` | `height` | `16px` | |
| `.process-body` | `flex` | `1` | |
| `.process-body` | `min-width` | `0` | |
| `.process-head` | `display` | `flex` | |
| `.process-head` | `align-items` | `center` | |
| `.process-head` | `gap` | `8px` | |
| `.process-title` | `font-size` | `14px` | chat/label |
| `.process-title` | `font-weight` | `500` | fontWeight/base |
| `.process-title` | `line-height` | `20px` | |
| `.process-title` | `color` | `{color/text/base/secondary}` | color/text/base/secondary |
| `.process-time` | `font-size` | `12px` | chat/label |
| `.process-time` | `font-weight` | `500` | fontWeight/base |
| `.process-time` | `line-height` | `16px` | |
| `.process-time` | `color` | `{color/text/base/quaternary}` | color/text/base/quaternary |
| `.process-desc` | `margin-top` | `2px` | |
| `.process-desc` | `font-size` | `14px` | chat/label |
| `.process-desc` | `font-weight` | `500` | fontWeight/base |
| `.process-desc` | `line-height` | `1.5` | |
| `.process-desc` | `color` | `{chat/text/status}` | chat/text/status |
| `.process .search-chips` | `margin-top` | `8px` | |

### 출처 미리보기 카드

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.source-pop` | `position` | `relative` | |
| `.source-pop` | `display` | `inline-block` | |
| `.source-preview` | `position` | `absolute` | 본문 위에 겹쳐 뜸 |
| `.source-preview` | `top` | `calc(100% + 8px)` | 칩 아래 8 |
| `.source-preview` | `left` | `0` | 칩 왼쪽 끝에 맞춤 |
| `.source-preview` | `z-index` | `10` | |
| `.source-preview` | `box-sizing` | `border-box` | |
| `.source-preview` | `display` | `flex` | |
| `.source-preview` | `flex-direction` | `column` | |
| `.source-preview` | `gap` | `8px` | |
| `.source-preview` | `width` | `360px` | |
| `.source-preview` | `max-width` | `calc(100vw - 40px)` | 화면 밖으로 나가지 않게 |
| `.source-preview` | `padding` | `14px 16px 16px` | |
| `.source-preview` | `background` | `{chat/table/bg}` | 로컬 |
| `.source-preview` | `border-width` | `1px` | |
| `.source-preview` | `border-style` | `solid` | |
| `.source-preview` | `border-color` | `{color/border/base/high}` | color/border/base/high |
| `.source-preview` | `border-radius` | `{radius/large}` | radius/large |
| `.source-preview` | `box-shadow` | `{chat/shadow/popover}` | 로컬 |
| `.source-preview` | `visibility` | `hidden` | 호버 · 열림 전에는 숨김 |
| `.source-preview` | `opacity` | `0` | |
| `.source-pop:hover .source-preview` | `visibility` | `visible` | Desktop 호버 |
| `.source-pop:hover .source-preview` | `opacity` | `1` | |
| `.source-pop.is-open .source-preview` | `visibility` | `visible` | Mobile 탭 |
| `.source-pop.is-open .source-preview` | `opacity` | `1` | |
| `.source-site` | `display` | `flex` | |
| `.source-site` | `align-items` | `center` | |
| `.source-site` | `gap` | `4px` | |
| `.source-site` | `font-size` | `12px` | chat/label |
| `.source-site` | `font-weight` | `500` | fontWeight/base |
| `.source-site` | `line-height` | `16px` | |
| `.source-site` | `color` | `{color/text/base/quaternary}` | color/text/base/quaternary |
| `.source-site .favicon` | `width` | `16px` | |
| `.source-site .favicon` | `height` | `16px` | |
| `.source-site .favicon` | `font-size` | `10px` | |
| `.source-title` | `font-size` | `16px` | chat/P-strong |
| `.source-title` | `font-weight` | `700` | fontWeight/strong |
| `.source-title` | `line-height` | `1.5` | |
| `.source-title` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.source-summary` | `margin-top` | `-4px` | 제목과 간격 4 (gap 8 − 4) |
| `.source-summary` | `font-size` | `14px` | font-M/body/small |
| `.source-summary` | `font-weight` | `500` | fontWeight/base |
| `.source-summary` | `line-height` | `1.5` | |
| `.source-summary` | `color` | `{color/text/base/tertiary}` | color/text/base/tertiary |
| `.source-date` | `font-size` | `12px` | chat/label |
| `.source-date` | `font-weight` | `500` | fontWeight/base |
| `.source-date` | `line-height` | `16px` | |
| `.source-date` | `color` | `{color/text/base/quaternary}` | color/text/base/quaternary |

### 출처 목록

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.sources` | `margin-top` | `16px` | 본문과 출처 제목 사이 24(블록 gap 8 + 16) |
| `.sources li::marker` | `font-weight` | `700` | 번호 Bold 16 |
| `.sources .favicon` | `display` | `inline-flex` | 글자를 가운데에 놓음 |
| `.sources .favicon` | `width` | `16px` | |
| `.sources .favicon` | `height` | `16px` | |
| `.sources .favicon` | `font-size` | `10px` | |
| `.sources .favicon` | `margin-right` | `8px` | |
| `.sources .favicon` | `vertical-align` | `2px` | 링크 글자 가운데에 맞춤(화면에서 재서 정함) |

## 미정

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
