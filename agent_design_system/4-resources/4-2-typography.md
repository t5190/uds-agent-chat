---
id: SPEC-4-2
type: spec
title: 타이포그래피
status: stable
version: 1.3.0
summary: 채팅 답변에 쓰는 텍스트 스타일(chat/*)의 크기, 굵기, 행간, 자간을 정합니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=53-7114]
base: Figma v1.0.0 (26.02.27)
---

# 4-2. 타이포그래피

채팅 답변에 쓰는 텍스트 스타일(`chat/*`)의 크기 · 굵기 · 행간 · 자간을 정합니다. 블록 위 여백은 [3-3. 블록](../3-composition/3-3-block.md)에서, 서체와 색 토큰은 [4-1. 디자인 토큰](4-1-tokens.md)에서 정합니다.

## 스타일 목록

| 스타일 | 크기 | 굵기 | 행간 | 자간 | 쓰는 곳 |
| --- | --- | --- | --- | --- | --- |
| `chat/H1` | 28 | Bold 700 | 130% | -2% | `#` 문서 제목 (드묾) |
| `chat/H2` | 24 | Bold 700 | 130% | -2% | `##` 주요 섹션 (가장 많이 씀) |
| `chat/H3` | 20 | Bold 700 | 130% | -2% | `###` 하위 섹션 (자주 씀) |
| `chat/H4` | 18 | Bold 700 | 130% | -2% | `####` 세부 항목 |
| `chat/H5` | 16 | Bold 700 | 130% | -2% | `#####` 거의 안 씀 |
| `chat/H6` | 14 | Bold 700 | 130% | -2% | `######` 거의 안 씀 |
| `chat/P` | 16 | Medium 500 | 150% | 0% | 문단 · 목록 · 인용문 · 표 본문 · 말풍선 |
| `chat/P-strong` | 16 | Bold 700 | 150% | 0% | `**굵게**`, 표 머리글, 체크리스트 항목 |
| `chat/label` | 14 · 12 | Medium 500 | 140% · 130% | 0% | 한 줄짜리 보조 텍스트. 14: 상태 텍스트 · 출처 · 코드 언어 표시 · 전체보기 · 캡션, 12: 출처 · 각주 · 캡션 · 메타 정보. 여러 줄 본문에는 쓰지 않음 |
| `chat/coding` | 13 | Regular 400 · 인라인 Bold 700 | 150% · 인라인 130% | 0% | 코드 블록, 인라인 코드 |

- 서체는 본문 `Pretendard`, 코드 `Nanum Gothic Coding`(4-1의 [서체](4-1-tokens.md#서체))
- 자간 -2%는 CSS로 `-0.02em`. 새 제목 크기를 추가할 때도 같은 비율을 씀

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

### 화면 기본

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `&` | `font-family` | `{fontFamily/pretendard}` | fontFamily/pretendard |
| `&` | `color` | `{color/text/base/primary}` | color/text/base/primary |

### 제목

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `h1` | `font-size` | `28px` | chat/H1 |
| `h2` | `font-size` | `24px` | chat/H2 |
| `h3` | `font-size` | `20px` | chat/H3 |
| `h4` | `font-size` | `18px` | chat/H4 |
| `h5` | `font-size` | `16px` | chat/H5 |
| `h6` | `font-size` | `14px` | chat/H6 |
| `h1, h2, h3, h4, h5, h6` | `font-weight` | `700` | fontWeight/strong |
| `h1, h2, h3, h4, h5, h6` | `line-height` | `1.3` | |
| `h1, h2, h3, h4, h5, h6` | `letter-spacing` | `-0.02em` | |
| `h1, h2, h3, h4, h5, h6` | `color` | `{color/text/base/primary}` | color/text/base/primary |

### 본문 · 목록 · 인용문

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.content p, .content li, .content blockquote` | `font-size` | `16px` | chat/P |
| `.content p, .content li, .content blockquote` | `font-weight` | `500` | fontWeight/base |
| `.content p, .content li, .content blockquote` | `line-height` | `1.5` | |
| `.content p, .content li, .content blockquote` | `letter-spacing` | `0` | |
| `.content p, .content li` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `blockquote` | `color` | `{color/text/base/quaternary}` | color/text/base/quaternary |
| `li.task` | `font-weight` | `700` | chat/P-strong |
| `li.task.is-done` | `color` | `{chat/text/done}` | |

### 인라인 서식

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `strong` | `font-weight` | `700` | chat/P-strong |
| `em` | `font-style` | `italic` | |
| `del` | `text-decoration` | `line-through` | |
| `del` | `color` | `{color/text/base/quaternary}` | |
| `a` | `color` | `{color/status/text/informative}` | color/status/text/informative |
| `a` | `text-decoration` | `underline` | |
| `p > code, li > code, td > code` | `font-family` | `{chat/font/coding}` | |
| `p > code, li > code, td > code` | `font-size` | `13px` | chat/coding |
| `p > code, li > code, td > code` | `font-weight` | `700` | |
| `p > code, li > code, td > code` | `line-height` | `1.3` | |
| `p > code, li > code, td > code` | `color` | `{chat/code/inline}` | |

### 표

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `th, td` | `font-size` | `16px` | chat/P |
| `th, td` | `line-height` | `1.5` | |
| `th` | `font-weight` | `700` | chat/P-strong |
| `th` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `td` | `font-weight` | `500` | chat/P |
| `td` | `color` | `{chat/text/cell}` | |

### 코드 블록

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `pre` | `font-family` | `{chat/font/coding}` | chat/coding |
| `pre` | `font-size` | `13px` | |
| `pre` | `font-weight` | `400` | |
| `pre` | `line-height` | `1.5` | |
| `pre` | `color` | `{chat/code/text}` | |
| `.lang` | `font-size` | `14px` | chat/label · 14 |
| `.lang` | `font-weight` | `500` | |
| `.lang` | `line-height` | `1.4` | chat/label |
| `.lang` | `color` | `{chat/text/done}` | |

### 요청 말풍선

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.bubble p` | `font-size` | `16px` | chat/P |
| `.bubble p` | `font-weight` | `500` | |
| `.bubble p` | `line-height` | `1.5` | |
| `.bubble p` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.more` | `font-size` | `14px` | font-M/body/small |
| `.more` | `font-weight` | `500` | |
| `.more` | `line-height` | `1.5` | |
| `.more` | `color` | `{color/text/base/quaternary}` | color/text/base/quaternary |
