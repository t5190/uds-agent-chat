---
id: SPEC-4-5
type: spec
title: 이미지
status: stable
version: 1.1.0
summary: 요청 영역 첨부 썸네일과 응답 영역 이미지의 구조, 배치, 크기, 스타일을 정합니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=1-1477]
base: Figma v1.0.0 (26.02.27)
---

# 4-5. 이미지

채팅에 나오는 이미지 두 가지를 정합니다. **요청 영역 첨부 썸네일**은 사용자가 보낸 이미지를 말풍선 위에 정사각형으로 모아 보여 주고, **응답 영역 이미지**는 답변 본문 안에 넣는 이미지입니다. 첨부 파일 카드는 [4-6. 파일](4-6-file.md), 말풍선과 턴 배치는 [4-3. 메시지](4-3-message.md)에서 다룹니다.

- 구현: 지원(`chat-ui.js`가 `[이미지 N장]` · `[이미지: src]` 줄과 `![설명](placeholder:비율)`을 그림)
- 규칙: [2-2 이미지](../2-rules/2-2-ui.md#이미지-ui-img) UI-IMG-01 ~ 17

## 구조

### 요청 영역 · 첨부 썸네일

요청 한 줄은 `1fr : 3fr` 두 칸으로 나뉘고, 첨부 묶음은 오른쪽 **3fr 열 안에서만** 오른쪽 정렬로 놓입니다. 말풍선은 묶음 아래 12 간격으로 붙습니다.

```text
.msg.user                      ← 1fr(비워 둠) : 3fr(내용)
└─ 3fr 열 (오른쪽 정렬)
   ├─ .attach                  ← 첨부 묶음, 말풍선과 12
   │  └─ .thumbs               ← 썸네일 묶음, 가로 · 세로 간격 8, 오른쪽부터 채움
   │     ├─ .thumb.size-l      ← 124 × 124 · 모서리 12
   │     ├─ .thumb.size-m      ← 96 × 96 · 모서리 8
   │     └─ .thumb.size-s      ← 64 × 64 · 모서리 8
   └─ .bubble                  ← 요청 말풍선
```

### 응답 영역 · 이미지

```text
응답
├─ p                    ← 본문 문단, 응답 영역 전체 폭
└─ .iw                  ← 이미지 블록, 위 여백 8
   └─ img               ← 최대 3fr 폭, 왼쪽 정렬, 모서리 12 (1fr 열은 비워 둠)
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 요청 영역 · 첨부 묶음 | `.attach` | 첨부 파일 카드 묶음과 썸네일 묶음을 담는 3fr 열 안 묶음 |
| 요청 영역 · 썸네일 묶음 | `.thumbs` | 첨부 썸네일을 오른쪽부터 채우는 격자 |
| 요청 영역 · 첨부 썸네일 | `.thumb` | 이미지 요소(`img`) 하나. 크기는 `.size-l` · `.size-m` · `.size-s` |
| 요청 영역 · 말풍선 | `.bubble` | 요청 말풍선. 정본은 4-3 |
| 응답 영역 · 본문 문단 | — | 응답 영역 전체 폭을 쓰는 문단 |
| 응답 영역 · 이미지 블록 | `.iw` | 응답 이미지를 감싸는 블록 |
| 응답 영역 · 이미지 | — | 블록 안 `img` |

- 첨부 파일 카드가 함께 있으면 `.attach` 안에서 첨부 파일 카드 묶음(`.files`)이 이미지 묶음 위에 옵니다([4-6. 파일](4-6-file.md) 혼합 메시지).

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 요청 영역 · 첨부 묶음 | `.msg.user`의 `1fr : 3fr` 중 3fr 열 | 3fr 열 안에서만 오른쪽 정렬. 말풍선 위 |
| 요청 영역 · 첨부 썸네일 | 썸네일 묶음 | 오른쪽부터 채우고, 마지막 줄 빈 칸은 왼쪽에 남김 |
| 응답 영역 · 본문 문단 | 응답 영역 | 전체 폭 |
| 응답 영역 · 이미지 | 응답 영역 `3fr : 1fr`의 왼쪽 3fr 열 | 왼쪽 정렬. 1fr 열은 비워 둠 |

### 요청 영역 · 첨부 썸네일

첨부 개수에 따라 썸네일 크기와 배열이 정해집니다.

| 요소 | 썸네일 크기 | Mobile 배열 | Tablet · Desktop 배열 | 비고 |
| --- | --- | --- | --- | --- |
| 첨부 1개 | 124 | 단일 | 3fr 영역 너비 안에서 가로 배치 | Mobile은 말풍선 위 오른쪽 정렬 |
| 첨부 2개 | 124 | 2열 1행 | 3fr 영역 너비 안에서 가로 배치 | - |
| 첨부 3개 | Mobile 96 · Tablet · Desktop 124 | 3열 1행 | 3fr 영역 너비 안에서 가로 배치 | Mobile은 한 줄에 모두 보이도록 크기를 줄임 |
| 첨부 4개 | 124 | 2열 2행 | 3fr 영역 너비 안에서 가로 배치 | - |
| 첨부 5~6개 | Mobile 96 · Tablet · Desktop 124 | 2열 · 최대 3행 | 3fr 영역 너비 안에서 가로 배치 | Mobile은 빈 칸을 왼쪽에 남기고 오른쪽 정렬 |
| 첨부 7~20개 | 64 | 3열 · 최대 7행 | 3열 · 최대 7행 | 3열 고정 · 최대 20개 제한 |

- Tablet · Desktop의 1~6개는 이미지 크기를 고정하고, 너비를 넘으면 다음 줄로 줄바꿈합니다(우측 정렬 → ↓)
- 예: 6개를 보내면 Tablet(3fr 약 333)에서는 2개씩 3줄, Desktop(3fr 540)에서는 첫 줄 4개 · 둘째 줄 2개(오른쪽)로 놓입니다

### 응답 영역 · 이미지

응답 영역의 이미지는 요청 영역과 반대로 `3fr : 1fr`의 **왼쪽 3fr 열**에 놓습니다. 본문 문단은 전체 폭을 쓰고, 이미지만 3fr 폭(응답 폭의 75%)을 최대로 합니다.

## 크기

### 응답 영역 · 이미지

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 큰 이미지 (기본) | 폭 | 3fr 폭 · 비율 유지 | 세로만 비율대로 달라짐 |
| 작은 이미지 | 폭 | 원본 크기 · 왼쪽 정렬 | 3fr 폭으로 늘리지 않음 |
| 이미지 | 최대 폭 | 3fr 폭 (응답 폭의 75%) | 화면별 값은 "반응형" |
| 이미지 | 모서리 | 12 (`{radius/large}`) | 모든 비율 같음 |

- 첨부 썸네일 크기는 "유형"에 있습니다

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 요청 영역 · 첨부 묶음 ↔ 말풍선 | 12 | 묶음 아래에 말풍선이 붙음 |
| 요청 영역 · 첨부 파일 카드 묶음 ↔ 썸네일 묶음 | 12 | `.attach`의 gap |
| 요청 영역 · 첨부 썸네일 사이 | 8 | 가로 · 세로 |
| 응답 영역 · 앞 문단 ↔ 이미지 블록 | 8 | 이미지 블록 위 여백 |
| 응답 영역 · 이미지 ↔ 뒤 문단 | 16 | 뒤 문단 padding-top (블록 전환) |

## 유형

### 요청 영역 · 첨부 썸네일

| 유형 | 값 | 차이 |
| --- | --- | --- |
| L (`.thumb.size-l`) | 124 × 124 · 모서리 12 (`{radius/large}`) | 가장 큰 기본 썸네일. Mobile 1 · 2 · 4개, Tablet · Desktop 1~6개 |
| M (`.thumb.size-m`) | 96 × 96 · 모서리 8 (`{radius/medium}`) | Mobile에서만 씀. Mobile 3개 · 5~6개 |
| S (`.thumb.size-s`) | 64 × 64 · 모서리 8 (`{radius/medium}`) | 모든 화면 7~20개. 3열 고정 · 최대 20개 |

### 응답 영역 · 이미지

어떤 비율이든 가로는 3fr 폭에 맞추고 세로만 비율대로 달라집니다.

| 유형 | 값 | 차이 |
| --- | --- | --- |
| 1:1 | 가로 3fr 폭 · 세로 비율대로 | 프로필 · 상품 썸네일 · 아이콘형 이미지 |
| 16:9 | 가로 3fr 폭 · 세로 비율대로 | 화면 캡처 · 영상 썸네일 · 가로 차트 |
| 4:3 | 가로 3fr 폭 · 세로 비율대로 | 일반 사진 · 문서 · 슬라이드 |
| 3:4 | 가로 3fr 폭 · 세로 비율대로 | 세로 사진 · 포스터 · 인물 |
| 9:16 | 가로 3fr 폭 · 세로 비율대로 | Mobile 화면 캡처 · 세로 영상 |

## 반응형

Desktop은 Tablet과 같은 규칙을 따릅니다.

| 요소 | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| 첨부 썸네일 크기 | 1 · 2 · 4개 124, 3개 · 5~6개 96, 7~20개 64 | 1~6개 124, 7~20개 64 | Tablet과 같음 |
| 응답 영역 · 이미지 최대 폭 (3fr 폭) | 272 (402 화면) | — | 540 (본문 720) |
| 16:9 이미지 예 | 272 × 153 | — | 540 × 304 |

- 스타일 표에는 Tablet · Desktop 기본값만 적고, Mobile 크기 전환(3개 · 5~6개 → 96)은 화면 너비 규칙에서 처리합니다

## 참고

### 이미지 쓰는 법

| 하고 싶은 것 | 대화 파일에서 쓰는 줄 | 결과 |
| --- | --- | --- |
| 요청에 이미지 N장 첨부 (자리 표시) | `[이미지 3장]` | 회색 정사각형 3장. 1 ~ 20장 |
| 요청에 실제 이미지 첨부 | `[이미지: 경로나 URL]` 한 줄에 한 장 | 정사각형으로 잘라(`object-fit: cover`) 보임 |
| 응답에 이미지 넣기 | `![설명](url)`만 있는 문단 | 3fr 폭 · 비율 유지 · 모서리 12 |
| 응답에 자리 표시 이미지 | `![설명](placeholder:16x9)` | 비율대로 회색 상자 (1x1 · 16x9 · 4x3 · 3x4 · 9x16) |

- 첨부는 한 요청에 **최대 20장**입니다. 21장째부터는 그리지 않습니다
- 개수가 정하는 것은 썸네일 크기와 열 수입니다. 1 · 2 · 4장은 124, 3장 · 5 ~ 6장은 Mobile 96(Tablet 이상 124), 7장부터는 64 · 3열 고정입니다
- 응답 이미지는 항상 **설명(alt)**을 씁니다. 장식용이 아니면 비워 두지 않습니다
- 요청 이미지는 오른쪽 3fr 열에, 응답 이미지는 왼쪽 3fr 열에 놓입니다. 서로 반대입니다
- 시연: [EX-21 이미지 첨부 그리드](../5-templates/examples/21-image-grid.md) · [EX-22 응답 이미지 비율](../5-templates/examples/22-image-ratio.md) · [EX-08](../5-templates/examples/08-image.md) · [EX-12](../5-templates/examples/12-image-response.md)
- 확인하려면 케이스 목록의 "이미지 첨부 그리드" · "응답 이미지 비율"을 열고, 브라우저 폭을 767px 이하로 줄여 Mobile 배열을 봅니다

## 규칙

동작 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md#이미지-ui-img)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 요청 영역 · 첨부 썸네일 | UI-IMG-01 ~ UI-IMG-11 |
| 응답 영역 · 이미지 | UI-IMG-12 ~ UI-IMG-17 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.msg.user .attach` | `display` | `flex` | |
| `.msg.user .attach` | `flex-direction` | `column` | |
| `.msg.user .attach` | `align-items` | `flex-end` | |
| `.msg.user .attach` | `align-self` | `flex-end` | |
| `.msg.user .attach` | `gap` | `12px` | spacing/gap/12 (문서 묶음 ↔ 이미지 묶음) |
| `.msg.user .attach` | `max-width` | `100%` | 3fr 열 폭 |
| `.thumbs` | `display` | `flex` | |
| `.thumbs` | `flex-wrap` | `wrap` | |
| `.thumbs` | `justify-content` | `flex-end` | 오른쪽 정렬, 마지막 줄 빈 칸은 왼쪽 |
| `.thumbs` | `align-content` | `flex-start` | |
| `.thumbs` | `gap` | `8px` | spacing/gap/8 |
| `.thumbs` | `max-width` | `100%` | |
| `.thumbs:has(.thumb.size-s)` | `max-width` | `208px` | 64 × 3 + 8 × 2 → 3열 고정 |
| `.thumb` | `display` | `block` | |
| `.thumb` | `flex` | `none` | |
| `.thumb` | `width` | `124px` | 기본 = 124 |
| `.thumb` | `height` | `124px` | |
| `.thumb` | `object-fit` | `cover` | |
| `.thumb` | `object-position` | `center` | |
| `.thumb` | `border-radius` | `{radius/large}` | radius/large |
| `.thumb.size-l` | `width` | `124px` | Mobile 1 · 2 · 4개, Tablet · PC 1~6개 |
| `.thumb.size-l` | `height` | `124px` | |
| `.thumb.size-m` | `width` | `96px` | Mobile 3개 · 5~6개 |
| `.thumb.size-m` | `height` | `96px` | |
| `.thumb.size-m` | `border-radius` | `{radius/medium}` | radius/medium |
| `.thumb.size-s` | `width` | `64px` | 모든 화면 7~20개 |
| `.thumb.size-s` | `height` | `64px` | |
| `.thumb.size-s` | `border-radius` | `{radius/medium}` | radius/medium |
| `.iw img` | `display` | `block` | |
| `.iw img` | `max-width` | `75%` | 3fr : 1fr의 3fr 폭 |
| `.iw img` | `width` | `auto` | 작은 이미지는 원본 크기 |
| `.iw img` | `height` | `auto` | 세로는 이미지 비율대로 |
| `.iw img` | `border-radius` | `{radius/large}` | radius/large |
