---
id: SPEC-4-4
type: spec
title: 마크다운 요소
status: stable
version: 1.3.0
summary: 응답 영역에 나올 수 있는 마크다운 요소입니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=1-1474]
base: Figma v1.0.0 (26.02.27)
---

# 4-4. 마크다운 요소

응답 영역에 나올 수 있는 마크다운 요소마다 **어떻게 보이는지(값 · 스타일)**를 정합니다. 글자 스타일은 [4-2. 타이포그래피](4-2-typography.md), 위 여백은 [3-3. 블록](../3-composition/3-3-block.md), 답변에서 각 요소를 언제 · 어떻게 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md#요소-사용-ans-12--26)(ANS-12 ~ 26)에 있습니다.

- 구현: 지원(chat-ui.js)
- 규칙: [2-2 마크다운 요소 표시](../2-rules/2-2-ui.md#마크다운-요소-표시-ui-md) UI-MD-01 ~ 05

## 구조

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 제목 | — | h1 ~ h6 |
| 문단 | — | 본문 p와 강조 strong |
| 인라인 서식 | — | 문장 안의 굵게 · 취소선 · 링크 · 인라인 코드 |
| 목록 | — | 순서 있는 목록 · 순서 없는 목록 |
| 체크리스트 | `.task` | 체크 상자가 있는 목록 항목 |
| 코드 블록 | `.pw` · `.code` · `.lang` | 여러 줄의 코드나 명령어를 보여 주는 블록 |
| 인용문 | `.bw` | 본문과 구분해 강조하는 블록 |
| 표 | `.tw` | 행과 열로 된 블록 |
| 구분선 | `.hw` | 실선 한 줄 |
| 이미지 | `.iw` | 응답 이미지([4-5. 이미지](4-5-image.md)) |

### 코드 블록

```
.pw
└─ .code              배경 #1A1A1A · radius 12 · 패딩 20 22 · gap 12
   ├─ .lang           언어 표시 (chat/label 14 · #9E9E9E) — 예: python
   └─ pre > code      chat/coding 13 · 행간 1.5
```

## 크기

요소별 글자 · 위 여백 · 모양을 한눈에 봅니다.

| 요소 | 마크다운 | 글자 | 위 여백 | 모양 |
| --- | --- | --- | --- | --- |
| 제목 H1–H6 | `#` – `######` | chat/H1–H6 | 32 · 24 · 20 · 20 · 16 · 16 | — |
| 문단 | 빈 줄로 구분 | chat/P | 8 (블록 뒤 16) | — |
| 굵게 · 취소선 · 링크 | `**굵게**` `~~취소~~` `[텍스트](url)` | P-strong · #747474 · #064AD0 밑줄 | — | — |
| 인라인 코드 | `` `코드` `` | chat/coding Bold 13 · #FD312E | — | 배경 alpha/black-8 · radius 4 · 패딩 4 8 |
| 목록 | `- 항목` · `1. 항목` | chat/P | 8 · 항목 4 | 들여쓰기 26 |
| 체크리스트 | `- [ ]` · `- [x]` | chat/P-strong | 8 · 항목 8 | 상자 18 · radius 4 |
| 코드 블록 | ```` ```언어 ```` | chat/coding 13 · #C8CDD6 | 8 | 배경 #1A1A1A · radius 12 · 패딩 20 22 |
| 인용문 | `>` | chat/P · #747474 | 8 | 왼쪽 세로선 3px #BDBDBD |
| 표 | `\| a \| b \|` | 머리글 P-strong · 본문 P #333 | 8 | 테두리 1px · radius 8 · 셀 48 |
| 구분선 | `---` | — | 24 | 1px #EBEBEB |
| 이미지 | `![설명](url)` | — | 8 | [4-5. 이미지](4-5-image.md) 참고 |

### 제목

제목 h1–h6입니다. 글자 스타일은 chat/H1–H6, 위 여백은 [크기](#크기) 표를 따릅니다. 어떤 레벨을 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

### 문단

본문 p와 강조 strong입니다. 문단 · 목록 · 인용문 · 표 본문에 공통으로 씁니다. 같은 문단 안 줄바꿈은 행간 1.5, 문단을 나눌 때(빈 줄 1개)는 16px입니다. 문단을 나누는 기준은 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

### 인라인 서식

문장 안에서 쓰는 강조와 인라인 코드입니다. 언제 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

| 요소 | 마크다운 | 모양 |
| --- | --- | --- |
| Strong | `**굵게**` | font-weight 700 |
| Delete | `~~취소~~` | 취소선 · #747474 |
| Link | `[텍스트](url)` | 밑줄 · `color/status/text/informative` |
| Inline Code | `` `코드` `` | Nanum Gothic Coding Bold 13 · #FD312E · 회색 칩 |

### 목록

순서 있는 목록 · 순서 없는 목록 · 체크리스트입니다. 언제 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

- 하위 목록 기호는 `◦`, 색 #747474, 크기 0.9em

### 코드 블록

여러 줄의 코드나 명령어를 보여 주는 블록입니다. 배경 고정 · 언어 표시 · 구문 색은 UI-MD-01 ~ UI-MD-03, 앞뒤에 쓰는 문장은 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다. 구문 색은 아래와 같습니다.

| 요소 | 색 | 예 |
| --- | --- | --- |
| Keyword | #C3A6E8 | `import` `as` `def` `return` `False` |
| Value | #E5C07B | `"data.csv"` `0` |
| Function · 기본 | #C8CDD6 | `read_csv` `print` |
| Comment | #7FA88A | `# 설치` |

### 인용문

본문과 구분해 강조하는 블록입니다. 글자 chat/P · #747474, 왼쪽 세로선 3px #BDBDBD입니다. 언제 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

### 표

행과 열로 된 블록입니다. 머리글은 chat/P-strong과 옅은 배경, 본문은 chat/P로 쓰고 셀 높이 48 · 셀 패딩 12/16을 지킵니다. 가로 스크롤은 UI-MD-04, 언제 · 어떻게 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

### 구분선

#EBEBEB 실선 한 줄로 표시합니다. 위 여백은 24입니다. 언제 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 목록 항목 → 항목 | 4 | |
| 목록 항목 → 하위 목록 | 4 | |
| 하위 목록 들여쓰기 | 26 | |
| 체크리스트 항목 → 항목 | 8 | |

블록 앞 위 여백은 [3-3. 블록](../3-composition/3-3-block.md)의 `## 간격`을 따릅니다.

## 상태

### 체크리스트

체크 상태별 모양입니다. 체크된 항목을 흐리게 하는 규칙은 UI-MD-05, 언제 쓰는지는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)을 따릅니다.

| 상태 | 언제 | 상자 | 글자 |
| --- | --- | --- | --- |
| 미체크 | `- [ ]` | 18 · 테두리 1.5px #747474 · radius 4 | chat/P-strong #1A1A1A |
| 체크 | `- [x]` | 18 · 배경 #1A1A1A + 흰 체크 | chat/P-strong #9E9E9E (흐리게) |

## 규칙

표시 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md#마크다운-요소-표시-ui-md)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 코드 블록 (배경 고정 · 언어 표시 · 구문 색) | UI-MD-01 ~ UI-MD-03 |
| 표 (가로 스크롤) | UI-MD-04 |
| 체크리스트 (체크된 항목 흐리게) | UI-MD-05 |

## 스타일


> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

### 인라인 코드

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `p > code, li > code, td > code` | `background` | `{alpha/black-8}` | alpha/black-8 |
| `p > code, li > code, td > code` | `border-radius` | `{radius/small}` | radius/small |
| `p > code, li > code, td > code` | `padding` | `4px 8px` | |

### 목록

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.content ul` | `list-style-type` | `disc` | |
| `.content ol` | `list-style-type` | `decimal` | |
| `.content li > ul` | `list-style-type` | `circle` | |
| `li > ul > li::marker, li > ol > li::marker` | `color` | `{color/icon/base/secondary}` | color/icon/base/secondary |
| `li > ul > li::marker, li > ol > li::marker` | `font-size` | `0.9em` | |
| `.content ul, .content ol` | `padding-left` | `26px` | |
| `li + li` | `padding-top` | `4px` | spacing/gap/4 |
| `.content li > ul, .content li > ol` | `padding-top` | `4px` | |
| `.content li > ul, .content li > ol` | `padding-left` | `26px` | |

### 체크리스트

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `li.task` | `align-items` | `flex-start` | |
| `.task input` | `width` | `18px` | |
| `.task input` | `height` | `18px` | |
| `.task input` | `margin-top` | `3px` | |
| `.task input` | `border-width` | `1.5px` | |
| `.task input` | `border-color` | `{chat/border/control}` | |
| `.task input` | `border-radius` | `{radius/small}` | radius/small |
| `.task input:checked` | `background` | `{color/container/brand/secondary}` | color/container/brand/secondary |
| `.task input:checked` | `border-color` | `{color/container/brand/secondary}` | color/container/brand/secondary |
| `li.task + li.task` | `padding-top` | `8px` | |
| `li.task` | `gap` | `8px` | |

### 코드 블록

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.code` | `background` | `{chat/code/bg}` | |
| `.code` | `border-radius` | `{radius/large}` | radius/large |
| `.tk` | `color` | `{chat/syntax/keyword}` | |
| `.ts` | `color` | `{chat/syntax/value}` | |
| `.tf` | `color` | `{chat/code/text}` | |
| `.tc` | `color` | `{chat/syntax/comment}` | |
| `.code` | `padding` | `20px 22px` | |
| `.code` | `gap` | `12px` | |

### 인용문

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `blockquote` | `border-left-width` | `3px` | |
| `blockquote` | `border-left-style` | `solid` | |
| `blockquote` | `border-left-color` | `{color/border/base/high}` | color/border/base/high |
| `blockquote` | `margin-left` | `8px` | |
| `blockquote` | `padding` | `2px 0 2px 18px` | |

### 표

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `table` | `border-color` | `{color/border/base/high}` | color/border/base/high |
| `table` | `border-radius` | `{radius/medium}` | radius/medium |
| `table` | `background` | `{chat/table/bg}` | |
| `th, td` | `border-right-color` | `{color/border/base/high}` | |
| `th, td` | `border-bottom-color` | `{color/border/base/high}` | |
| `th` | `background` | `{alpha/black-4}` | alpha/black-4 |
| `th, td` | `padding` | `12px 16px` | spacing/component/y/scale-04 · x/scale-06 |
| `th, td` | `height` | `48px` | |

### 구분선

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `hr` | `border-top-width` | `1px` | |
| `hr` | `border-top-style` | `solid` | |
| `hr` | `border-top-color` | `{chat/divider}` | |
