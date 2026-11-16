---
id: SPEC-4-9
type: spec
title: AI 심볼 · 모션
status: draft
version: 0.9.0
summary: AI Agent 심볼과 모션 4종(시그니처, 생각 중, 생각 끝, 작업 중)의 채팅 화면 구조, 재생 순서, 표시 크기, 규칙을 정합니다. 에셋 자체의 값은 심볼 리소스 문서에 둡니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=722-165, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=722-1768, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=716-38630]
---

# 4-9. AI 심볼 · 모션

AI Agent 심볼과 모션이 채팅 화면의 어디에, 어떤 순서로 쓰이고 어떻게 바뀌는지 정합니다. 에셋 자체(원본 심볼, 모션 4종)의 정의, 길이, 파일, 적용 코드는 [심볼 리소스 색인](symbol/index.md)의 문서에 있습니다.

- 상태: 초안. 작업 상태 줄 문구는 임시
- 구현: 일부 지원(`chat-ui.js`가 대화 파일의 `[심볼: 상태]` · `[완료: 문구]` 줄을 그리고 `chat.html`이 단계적으로 재생. lottie-web 필요. 입력창 연동은 서비스가 구현)
- 규칙: [2-2 심볼](../2-rules/2-2-ui.md#심볼-ui-sym) UI-SYM-01 ~ 34

## 구조

심볼은 두 자리에 쓰입니다. 심볼은 상태를 알리는 표시이고 답변의 아바타가 아닙니다(UI-SYM-07).

```
첫 진입 빈 화면 = 콘텐츠 패널            ← 3-1. 화면
└─ .landing
   ├─ .symbol.is-landing             시그니처
   ├─ .landing-title                 인사말 타이틀 (심볼 아래 16)
   └─ .composer                      한 줄형 입력창 (타이틀 아래 32, [4-7](4-7-input.md))

응답 영역 (.msg.ai)                   ← 4-3. 메시지
└─ .status                           작업 상태 줄
   ├─ .symbol.is-status              생각 중 → 생각 끝 → 작업 중
   └─ .status-label                  작업 상태 줄 텍스트
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 첫 진입 빈 화면 | `.landing` | 대화가 없는 화면에서 심볼을 패널 가운데에 놓음 |
| 시그니처 심볼 | `.symbol.is-landing` | 시그니처 모션 슬롯 |
| 인사말 타이틀 | `.landing-title` | 시그니처 아래 인사말 한 줄 |
| 첫 진입 입력창 | `.landing .composer` | 인사말 아래 한 줄형 입력창과 안내 문구. 하단에 붙이지 않고 묶음 안에 둠(UI-INPUT-13) |
| 작업 상태 줄 | `.status` | 응답 영역 맨 위의 심볼과 텍스트 줄 |
| 작업 상태 심볼 | `.symbol.is-status` | 생각 중 · 생각 끝 · 작업 중 모션 슬롯 |
| 작업 상태 텍스트 | `.status-label` | 진행 상황 문구 |

모션 4종은 원본 심볼에서 만든 것입니다. 상황별 선택 기준은 [AI Agent 모션 색인](symbol/index.md)에 있습니다.

| 요소 | 이름 | 쓰는 곳 | 재생 | 문서 |
| --- | --- | --- | --- | --- |
| 시그니처 | `agent_signature` | 최초 진입 · 온보딩 빈 화면 | 1회 재생 후 마지막 심볼에서 멈춤 | [Signature](symbol/signature.md) |
| 생각 중 | `agent_thinking_loop` | 요청을 보낸 뒤 생각하는 동안 | 반복 | [Thinking](symbol/thinking.md) |
| 생각 끝 | `agent_thinking_end` | 생각이 끝날 때, 작업 중으로 연결 | 1회 | [Thinking](symbol/thinking.md) |
| 작업 중 | `agent_working` | 응답 · 작업하는 동안 | 반복 | [Working](symbol/working.md) |

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 시그니처 심볼 · 인사말 타이틀 · 입력창 | 콘텐츠 패널 | 한 묶음으로 가로 · 세로 가운데. 위에서부터 심볼, 타이틀, 입력창 |
| 작업 상태 줄 | 응답 영역 | 맨 위 |
| 작업 상태 심볼 | 작업 상태 줄 | 텍스트 왼쪽. 심볼 왼쪽 가장자리를 본문 왼쪽 선에 맞춤 |

- 심볼(로고)은 첫 진입 화면과 답변 진행 상태 두 곳에만 쓴다

- 생각 중 · 생각 끝 · 작업 중은 같은 슬롯에서 바꿔 끼운다. 캔버스와 중심이 같아 바뀔 때 튀지 않는다(UI-SYM-06)

## 크기

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 시그니처 심볼 | 표시 크기 | 심볼 48 × 48 | 뷰 약 81 × 81 |
| 작업 상태 심볼 | 표시 크기 | 심볼 20 × 20 | 뷰 약 34 × 34. 생각 중 · 생각 끝 · 작업 중 공통. 피그마 `716-38630` |
| 인사말 타이틀 ↔ 입력창 | 간격 | 32 | 피그마 `722-1768` |
| 시그니처 심볼 ↔ 인사말 타이틀 | 간격 | 16 | 심볼 48 기준 보이는 간격. 뷰 안쪽 여백 16.5 + 간격 0. 피그마 `722-1768` |
| 작업 상태 심볼 ↔ 문구 | 간격 | 8 | 심볼 20 기준(뷰 안쪽 여백 7 + 간격 1). 피그마 `716-38630` |
| 첫 진입 빈 화면 | 최소 높이 | 480 | 임시 |

시그니처는 Mobile · Desktop 모두 심볼 48(뷰 81)로 정했습니다. 디자인 팀 원본의 Mobile 44(뷰 74) · Desktop 56(뷰 95)은 따르지 않습니다.

뷰 크기는 심볼 크기에 캔버스 비율 1.69를 곱한 값입니다. 계산 방법, 프레임레이트, 캔버스, 파일 형식, 용량은 [심볼 모션 적용 코드](symbol/code.md)에 있습니다.

## 상태

| 상태 | 언제 | 바뀌는 것 |
| --- | --- | --- |
| 시그니처 | 첫 진입, 대화가 없는 화면 | `.landing`에 `agent_signature` + 인사말 타이틀(`.landing-title`). 작업 상태 줄 없음 |
| 생각 중 | 요청을 보낸 뒤 생각하는 동안 | `.status.is-thinking`에 `agent_thinking_loop` + "생각하는 중". 텍스트 시머 1.08초 반복 |
| 생각 끝 | 첫 응답이 와서 생각이 끝날 때 | `.status.is-thinking-end`에 `agent_thinking_end` + "생각 끝". 텍스트 시머 1.14초 1회. 문구는 작업 중 첫 문구로 교체 |
| 작업 중 | 응답 · 작업하는 동안 | `.status.is-working`에 `agent_working` + "작업하는 중". 텍스트 시머 3.84초 반복 |
| 빠른 응답 | 한 바퀴를 끝내기 전에 답변이 준비됨 | 페이드 없이 심볼과 문구를 즉시 지우고 본문을 띄움. 이력 없음 |
| 사라짐 | 작업 중이 끝남(`finish()`) 직후 0 ~ 240ms | 심볼과 시머 문구가 한 그룹으로 페이드 아웃(`.is-fading`. 투명도 100 → 0%, 크기 100 → 92%). 사라지는 동안 모션과 시머는 계속 재생 |
| 이동 | 0 ~ 240ms(임시, 사라짐과 동시) | 완료 문구(`.status-label.is-complete-label`)가 시머 문구 자리에서 투명도 0 → 100%로 나타나며 심볼이 있던 자리(왼쪽 끝)로 이동 |
| 안착 | 240ms 이후 | 심볼과 시머 문구는 비움. 완료 문구가 심볼 자리에 멈추고(`.status.is-complete`) 오른쪽에 `>`가 접힌 상태로 나타남 |

- 작업 완료는 두 가지로 나눈다. 일반 작업은 완료 문구 + `>`만 남기고(`.status.is-complete`, 심볼 없음, [Working](symbol/working.md)), 리서치는 피그마 `738-12526` · `767-3180`처럼 로고 + 문구 + `>`를 남긴다(`.status.is-research.is-done`, [4-10. 출처](4-10-source.md))
- 작업 상태 줄 문구("생각하는 중" 등)는 임시. 대화 파일에서 `[심볼: 작업 중 | 문구]`로 문구를 바꿀 수 있고, 리서치처럼 단계를 알리는 작업 상태 줄은 [4-10. 출처](4-10-source.md)가 정함
- 진행 중인 상태(생각 중 · 생각 끝 · 작업 중)에서는 액션 줄을 그리지 않는다(UI-MSG-17)

## 동작

생각 중 → 생각 끝 → 작업 중이 재생 순서 1 ~ 3이고, 시그니처는 이 순서와 별개입니다.

1. 첫 진입(대화 없음) → 시그니처를 1회 재생하고 마지막 심볼에서 멈춤. 심볼 · 인사말 · 입력창 묶음은 콘텐츠 패널 세로 가운데에 놓임
   - 입력창에 글자를 쓰면 전송 버튼이 켜지고(UI-INPUT-18), 두 줄 이상이 되면 입력창이 여러 줄형으로 바뀐다(UI-INPUT-18 ~ 19 · [4-7](4-7-input.md)). 입력창이 커져도 묶음은 세로 가운데를 유지해 심볼과 인사말이 위로 올라간다. 입력을 모두 지우면 한 줄형으로 돌아온다(UI-SYM-34)
2. 첫 메시지 전송 → 시그니처를 멈추고 생각 중(재생 순서 1)을 반복
3. 첫 응답 도착 → 지금 돌던 한 바퀴를 마저 돈 뒤 생각 끝(재생 순서 2)을 1회 재생
4. 생각 끝 재생이 끝남 → 작업 중(재생 순서 3)을 응답 · 작업하는 동안 반복
5. 생각 중 · 생각 끝 · 작업 중 → 작업 상태 텍스트에 밝은 띠(하이라이트)가 왼쪽에서 오른쪽으로 한 번 지나가는 텍스트 시머를 건다. 한 번 지나가는 시간은 상태 주기와 같다(생각 중 1.08초 반복, 생각 끝 1.14초 1회, 작업 중 3.84초 반복). 띠 폭은 보이는 글자 폭의 40%이고 속도는 일정하다. 바탕색은 `chat/text/shimmer`, 띠 색은 불투명도 50%의 흰색(`chat/text/shimmer-sweep`)이고, 바탕색 글자 위에 겹쳐 비친다(바탕색 레이어 + 투명한 띠 레이어 두 겹. 띠만 있으면 글자가 비쳐 보이지 않고 화면 배경과 섞인다). 시그니처, 인사말, 문구 없는 심볼, 완료 문구에는 없음. 값과 규칙은 [Text Shimmer](symbol/text-shimmer.md)(UI-SYM-14 ~ 19)
6. 생각 끝 구간 시작 0.45초에 문구 교체가 시작되어 0.57초에 작업 중 첫 문구로 바뀐다. 사라짐 120ms + 나타남 120ms, 폭 240ms 전환이고 심볼과 문구는 사라지지 않는다(UI-SYM-19)
7. 작업 중 → 단계가 바뀔 때마다 문구만 교체한다(120ms + 120ms). 심볼 모션과 시머는 처음부터 다시 시작하지 않는다(UI-SYM-17, 19). 문구가 한 줄을 넘으면 끝을 말줄임한다
8. 작업 중이 끝남 → 즉시 시작한다. 0 ~ 240ms에 심볼과 시머 문구를 한 그룹으로 페이드 아웃하고(투명도 100 → 0%, 크기 100 → 92%, 중심은 심볼 중앙, `cubic-bezier(0.4, 0, 1, 1)`, 사라지는 동안 모션과 시머는 계속 재생), 같은 시간에 완료 문구가 시머 문구와 같은 위치 · 크기에서 투명도 0 → 100%로 나타나며 심볼 자리(왼쪽 끝)로 이동한다(임시). 이동 중에는 문구를 자르지 않는다. 안착하면 문구 오른쪽에 `>`를 접힌 상태로 보이고 눌렀을 때만 펼친다(UI-SYM-09, 18, 24, 27 ~ 29)
9. 한 바퀴를 끝내기 전에 답변이 준비됨(빠른 응답) → 페이드 없이 즉시 지움(UI-SYM-23)
10. 움직임 줄이기 켜짐 → 시머를 멈추고 작업 상태 줄의 글자색으로 보임. 문구 교체는 즉시, 완료 문구는 이동 없이 심볼 자리에 바로 보임(UI-SYM-08)

시그니처 에셋은 빈 캔버스에서 시작해 심볼에서 끝나는 1회용(`loop: false`)입니다. 서비스도 1회 재생한 뒤 마지막 심볼에서 멈춥니다.

## 에셋

| 파일 | 형식 | 경로 |
| --- | --- | --- |
| 모션 4종 | Lottie JSON | [assets/symbol/resources/motion/](../assets/symbol/resources/motion/) `{모션 이름}/lottie/{모션 이름}.json` |
| 원본 심볼 | SVG · PNG | [assets/symbol/resources/source/](../assets/symbol/resources/source/) |
| 적용 예제 코드 | JS · Java | [assets/symbol/code/](../assets/symbol/code/) |

## 참고

- 대화 파일에서는 답변 첫 줄에 `[심볼: 시그니처|생각 중|생각 끝|작업 중]`을 씁니다. 문법의 정본은 [4-8. HTML 구조 · 고정 CSS](4-8-markup.md#대화-파일-형식)의 "대화 파일 형식"입니다
- 대화 파일처럼 정지된 화면에서는 생각 끝이 한 번 재생되고 끝나 버리므로, 마지막 모습에서 머문 뒤 다시 재생합니다. 이 반복은 예시 화면용 표시이고 실제 서비스에서는 1회입니다(UI-SYM-04)
- 시연: [EX-13](../5-templates/examples/13-symbol.md), 전체 요소 [EX-00](../5-templates/examples/00-catalog.md)

## 규칙

동작 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md#심볼-ui-sym)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 시그니처 (첫 진입, 세션 1회, 인사말) | UI-SYM-01 ~ UI-SYM-02, UI-SYM-12 ~ UI-SYM-13, UI-SYM-30, UI-SYM-32 ~ UI-SYM-34 |
| 생각 중 → 생각 끝 → 작업 중 | UI-SYM-03 ~ UI-SYM-06, UI-SYM-20 |
| 뷰 크기 · 재생 속도 | UI-SYM-10 ~ UI-SYM-11, UI-SYM-31 |
| 텍스트 시머 · 문구 교체 | UI-SYM-14 ~ UI-SYM-17, UI-SYM-19 |
| 작업 완료 · 그룹 페이드 · 빠른 응답 | UI-SYM-09, UI-SYM-18, UI-SYM-23 ~ UI-SYM-24, UI-SYM-27 ~ UI-SYM-29 |
| 호출 순서 · 화면이 보이지 않을 때 | UI-SYM-21 ~ UI-SYM-22 |
| 표시 방식 · 접근성 | UI-SYM-07 ~ UI-SYM-08, UI-SYM-25 ~ UI-SYM-26 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요. 크기는 심볼 기준 48(시그니처) · 20(작업 상태)에 캔버스 비율 1.69를 곱한 뷰 크기입니다. 빈 화면 높이는 **임시 값**입니다.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.symbol` | `display` | `block` | |
| `.symbol` | `aspect-ratio` | `1 / 1` | 캔버스 600 × 600 |
| `.symbol` | `flex-shrink` | `0` | |
| `.symbol` | `pointer-events` | `none` | |
| `.landing` | `display` | `flex` | |
| `.landing` | `align-items` | `center` | |
| `.landing` | `justify-content` | `center` | |
| `.landing` | `flex` | `1` | 콘텐츠 패널(세로 flex)의 남는 높이를 채워, 묶음이 패널 세로 가운데에 놓임 |
| `.landing` | `min-height` | `480px` | 임시. 패널이 이보다 낮을 때만 적용 |
| `.landing` | `flex-direction` | `column` | |
| `.landing` | `gap` | `0` | 심볼 뷰 안쪽 여백 16.5가 보이는 간격 16(spacing/gap/16)이 됨 |
| `.landing-title` | `font-size` | `32px` | guide-H2 (피그마 [Text Set Title] xxLarge) |
| `.landing-title` | `font-weight` | `700` | fontWeight/strong |
| `.landing-title` | `line-height` | `1.5` | 48 |
| `.landing-title` | `letter-spacing` | `-0.02em` | −2% |
| `.landing-title` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.landing-title` | `text-align` | `center` | |
| `.landing .composer` | `position` | `static` | 첫 진입에서는 하단에 붙이지 않고 인사말 아래에 둠 |
| `.landing .composer` | `margin-top` | `32px` | spacing/gap/32. 인사말 타이틀 ↔ 입력창 (피그마 `722-1768`) |
| `.landing .composer` | `padding` | `0` | 가로 20 · 32는 하단 입력창용 |
| `.landing .composer` | `max-width` | `720px` | 입력창 폭 = 콘텐츠 폭 (Desktop 720, Mobile은 화면 폭 − 40) |
| `.landing .composer-scrim` | `display` | `none` | 하단 스크림은 첫 진입에서 필요 없음 |
| `.symbol.is-landing` | `width` | `81px` | 심볼 48 |
| `.symbol.is-landing` | `height` | `81px` | 심볼 48 |
| `.symbol.is-landing` | `margin-top` | `-16.5px` | 심볼 뷰 위쪽 여백(81 − 48)/2를 빼서, 보이는 묶음이 세로 가운데에 놓이게 함 |
| `.status` | `display` | `flex` | |
| `.status` | `align-items` | `center` | |
| `.symbol.is-status` | `width` | `34px` | 심볼 20 |
| `.symbol.is-status` | `height` | `34px` | 심볼 20 |
| `.symbol.is-status` | `margin` | `0 0 0 -7px` | 심볼 왼쪽 가장자리를 본문 왼쪽 선에 맞춤. 위아래는 겹치지 않도록 보정하지 않음 |
| `.status` | `overflow-x` | `visible` | 심볼 뷰가 왼쪽으로 7px 나가 있어 가로는 자르지 않음 (원이 퍼지는 모션이 잘림) |
| `.status` | `overflow-y` | `clip` | 사라질 때 높이가 줄어드는 동안 세로 넘침만 가림 |
| `.status` | `max-height` | `48px` | 줄 높이(뷰 34 + 위 8 = 42)보다 넉넉히 |
| `.status-label` | `transition` | `opacity 120ms ease` | 문구 교체: 사라짐 120ms + 나타남 120ms |
| `.status-label` | `min-width` | `0` | 한 줄 · 넘치면 말줄임 |
| `.status-label` | `overflow` | `hidden` | |
| `.status-label` | `text-overflow` | `ellipsis` | |
| `.status-label` | `white-space` | `nowrap` | |
| `.status` | `min-width` | `0` | 긴 문구가 영역을 넘지 않게 |
| `.status-label.is-swapping` | `opacity` | `0` | 교체 중 사라진 상태 |
| `.status.is-complete` | `cursor` | `pointer` | 완료 문구와 `>` 전체를 누름(임시) |
| `.status.is-complete .status-label` | `color` | `{chat/text/shimmer-highlight}` | 완료 문구는 시머 없는 정적 글자 |
| `.status` | `position` | `relative` | 완료 문구를 심볼 · 시머 문구 위에 겹쳐 놓는 기준 |
| `.status .symbol.is-fading` | `transition` | `opacity 240ms cubic-bezier(0.4, 0, 1, 1), transform 240ms cubic-bezier(0.4, 0, 1, 1)` | 작업 완료 그룹 페이드(UI-SYM-18) |
| `.status .symbol.is-fading` | `opacity` | `0` | |
| `.status .symbol.is-fading` | `transform` | `scale(0.92)` | 중심은 심볼 중앙. 크기 100 → 92%는 임시 |
| `.status .status-label.is-fading` | `transition` | `opacity 240ms cubic-bezier(0.4, 0, 1, 1), transform 240ms cubic-bezier(0.4, 0, 1, 1)` | 심볼과 같은 그룹. 시머는 멈추지 않음 |
| `.status .status-label.is-fading` | `opacity` | `0` | |
| `.status .status-label.is-fading` | `transform` | `scale(0.92)` | 중심(`transform-origin`)은 화면에서 재서 심볼 중앙에 맞춤 |
| `.status-label.is-complete-label` | `position` | `absolute` | 시머 문구와 같은 자리에서 나타남 |
| `.status-label.is-complete-label` | `top` | `0` | |
| `.status-label.is-complete-label` | `bottom` | `0` | |
| `.status-label.is-complete-label` | `display` | `flex` | |
| `.status-label.is-complete-label` | `align-items` | `center` | |
| `.status-label.is-complete-label` | `overflow` | `visible` | 이동 중에는 자르지 않음(UI-SYM-28) |
| `.status-label.is-complete-label` | `color` | `{chat/text/shimmer-highlight}` | 시머 없는 정적 글자 |
| `.status-label.is-complete-label` | `opacity` | `0` | 나타나기 전 |
| `.status-label.is-complete-label` | `transition` | `opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)` | 이동 시간과 곡선은 임시. 출발 위치(`translateX`)는 화면에서 재서 정함 |
| `.status-label.is-complete-label.is-shown` | `opacity` | `1` | 나타난 상태 |


### 텍스트 시머

생각 중 · 생각 끝 · 작업 중 문구(`.status-label`)에 거는 시머입니다(동작 5, 9). 주기는 상태별로 다르고 띠 폭 40%, 직선 속도는 원본에서 **임시 값**입니다.

```css
/* 텍스트 시머 (4-9) */
.status.is-thinking .status-label,
.status.is-thinking-end .status-label,
.status.is-working .status-label{
  background:linear-gradient(90deg, #FFFFFF00 0%, #FFFFFF00 43%, {chat/text/shimmer-sweep} 50%, #FFFFFF00 57%, #FFFFFF00 100%), linear-gradient({chat/text/shimmer}, {chat/text/shimmer});
  background-size:300% 100%; background-position:100% 0;
  -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
  animation:status-shimmer 3.84s linear infinite;
}
.status.is-thinking .status-label{ animation-duration:1.08s; }
.status.is-thinking-end .status-label{ animation-duration:1.14s; animation-iteration-count:1; animation-fill-mode:forwards; }
@keyframes status-shimmer{ from{ background-position:100% 0; } to{ background-position:0 0; } }
@media (prefers-reduced-motion: reduce){
  .status.is-thinking .status-label, .status.is-thinking-end .status-label, .status.is-working .status-label{ animation:none; background:none; color:inherit; -webkit-text-fill-color:currentColor; }
}
```

## 미정

- 첫 진입 화면의 좌측 메뉴(LNB) · 상단 헤더는 서비스 영역이라 이 문서가 그리지 않음. 입력창은 화면 폭에 맞춰 Desktop 720, Mobile 화면 폭 − 40이며 여러 줄 입력으로 커지는 동작은 서비스가 구현
- LNB 로고: 피그마 `722-1768` Desktop 표에 LNB(ONB) 로고 24 · 문구 간격 8이 있으나 채팅 영역 밖이라 다루지 않음. "두 곳에만 쓴다"와의 관계 확인 필요
- 도구 사용 줄 · 작업 목록 카드는 [3-3. 블록](../3-composition/3-3-block.md)에서 정의함. 작업 목록 항목의 "진행 중" 상태(피그마에는 끝냄 · 예정만 있음)는 미정
- 작업 상태 줄 문구("생각하는 중", "생각 끝", "작업하는 중"). 원본은 생각 중 문구를 서비스가 전달하고 작업 중 문구는 단계별(`setStep()`)로 바꾼다고만 정함
- 임시 값: 첫 진입 빈 화면 최소 높이 480. 시머의 다크 하이라이트 `#B8B8BD`, 직선 속도, 띠 폭 40%(최소 48px은 CSS로 지키지 못함), 문구 교체 곡선 `cubic-bezier(0.4, 0, 0.2, 1)`, 사라질 때 크기 100 → 92%는 원본에서 임시
- 작업 완료 문구의 내용과 전달 방식, `>`의 등장 연출 · 펼침 모션 · 펼친 내용의 구성(원본 미정). 클래스 이름(`.status.is-complete`, `.is-fading`, `.is-complete-label`)은 임시
- 완료 문구 이동 시간 0 ~ 240ms와 투명도 0 → 100%, 완료 문구 색(다크 `#B8B8BD`)은 원본에서 임시
- 움직임 줄이기의 정적 글자색: 원본은 `#1C1C1E`(다크 `#B8B8BD`)이나 CSS 규칙 블록은 라이트 · 다크가 다른 토큰을 쓸 수 없어 작업 상태 줄의 글자색을 그대로 씀
