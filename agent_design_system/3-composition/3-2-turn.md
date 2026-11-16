---
id: SPEC-3-2
type: spec
title: 턴
status: stable
version: 1.2.0
summary: 한 턴(사용자 요청과 AI 응답 한 쌍)의 구성과 배치를 정합니다.
stage: 3
audience: both
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=111-63825, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=148-11402]
base: Figma v1.0.0 (26.02.27)
---

# 3-2. 턴

대화는 턴이 반복해서 쌓인 것이고, 한 턴은 사용자 요청과 AI 응답 한 쌍입니다. 이 문서는 턴의 구조와 배치를 정합니다. 응답 안의 본문은 [3-3. 블록](3-3-block.md), 각 영역의 모양은 [4-3. 메시지](../4-resources/4-3-message.md)에서 다룹니다.

## 구조

```
대화       = 턴+
턴         = 요청 영역 + 응답 영역
요청 영역  = [첨부] + 말풍선 + 액션 줄(복사)
첨부       = [파일 카드+] + [이미지 썸네일+]
응답 영역  = [작업 상태] + 본문(블록+) + [출처] + 액션 줄(복사 · 좋아요 · 싫어요 · 공유 · 다시 생성)
```

- `+`는 하나 이상, `[ ]`는 있을 때만입니다.
- 이름 라벨 · 프로필 이미지 · 시간 표시는 없습니다.

```
.thread                     대화
├─ .msg.user                요청 영역 — 1fr : 3fr 그리드
│  ├─ (1fr 열은 비움)
│  ├─ .col                  3fr 열, 오른쪽 정렬: 첨부 → 말풍선
│  └─ .actions              액션 줄, 오른쪽 정렬
└─ .msg.ai                  응답 영역 — 전체 폭, 배경 없음
   ├─ .content              본문 (3-3. 블록)
   └─ .actions              액션 줄, 왼쪽 정렬
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 대화 | `.thread` | 턴을 세로로 쌓는 영역 |
| 요청 영역 | `.msg.user` | 사용자가 보낸 메시지가 놓이는 곳 |
| 3fr 열 | `.col` | 첨부와 말풍선을 담는 열 |
| 첨부 | `.attach` | 첨부 파일 카드와 이미지 썸네일 묶음 |
| 첨부 파일 카드 | `.file` | 사용자가 보낸 파일([4-6. 파일](../4-resources/4-6-file.md)) |
| 이미지 썸네일 | `.thumb` | 사용자가 보낸 이미지([4-5. 이미지](../4-resources/4-5-image.md)) |
| 말풍선 | `.bubble` | 요청 본문을 담는 상자 |
| 응답 영역 | `.msg.ai` | AI 답변이 놓이는 곳 |
| 작업 상태 줄 | `.status` | 응답 맨 위에서 심볼과 진행 상황을 보여 줌 |
| 본문 | `.content` | 블록 스택([3-3. 블록](3-3-block.md)) |
| 출처 | `.sources` | 출처 목록 |
| 액션 줄 | `.actions` | 요청은 복사, 응답은 복사 · 좋아요 · 싫어요 · 공유 · 다시 생성 |

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 요청 영역 | 콘텐츠 폭 | 2열 × 1행 · 1fr : 3fr · 열 간격 0. 1fr 열은 비우고 3fr 열에 오른쪽 정렬. 너비가 바뀌어도 1 : 3 유지 |
| 응답 영역 | 콘텐츠 폭 | 전체 폭. 말풍선 · 배경 없이 화면 위에 바로 놓임 |
| 액션 줄 | 각 영역 | 요청은 오른쪽, 응답은 왼쪽 정렬 |

영역 안의 순서입니다.

| 요소 | 순서 |
| --- | --- |
| 요청 영역 | 첨부(첨부 파일 카드 → 이미지 썸네일) → 말풍선 → 액션 줄 |
| 응답 영역 | 작업 상태 줄 → 본문 → 출처 → 액션 줄 (액션 줄은 응답이 끝난 뒤) |

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 턴 → 턴 (응답 액션 줄 → 다음 요청) | 40 | 요청 영역이 위 여백으로 가짐 |
| 첫 턴 | 0 | 콘텐츠 패널 위 여백 40만 |
| 첨부 → 말풍선 | 12 | |
| 요청 액션 줄 → 응답 | 0 | 응답은 요청 액션 줄 바로 아래에서 시작 |
| 응답 본문 → 응답 액션 줄 | 8 | 아이콘은 줄 안에서 위 10 떨어져 글자에서 18 |

## 반응형

3fr 열(말풍선 · 첨부 최대 폭)의 실제 값입니다. Mobile은 화면 폭 402, Tablet은 LNB를 포함한 화면 폭 768 기준입니다. 화면 폭 구분은 [3-1. 화면](3-1-page.md#반응형)을 따릅니다.

| 요소 | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| 콘텐츠 폭 | 362 | 444 | 720 |
| 1fr 열 | 90.5 | 111 | 180 |
| 3fr 열 | 271.5 | 333 | 540 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](../4-resources/4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.msg.user` | `padding-top` | `40px` | spacing/layout/y/40 |
| `.thread > .msg.user:first-child` | `padding-top` | `0` | |
| `.msg.ai` | `padding-top` | `0` | spacing/component/y/none |
| `.msg.user` | `grid-template-columns` | `minmax(0, 1fr) minmax(0, 3fr)` | |
| `.msg.user .actions` | `justify-content` | `flex-end` | |
| `.msg.ai .actions` | `justify-content` | `flex-start` | |
| `.actions` | `height` | `40px` | |
| `.actions` | `gap` | `12px` | spacing/gap/12 |

## 미정

- Mobile 3fr 열 폭이 이 문서는 271.5, [4-3. 메시지](../4-resources/4-3-message.md)와 [4-5. 이미지](../4-resources/4-5-image.md)는 272로 다름. 어느 값을 정본으로 할지 정해야 함
