---
id: SPEC-3-3
type: spec
title: 블록
status: stable
version: 1.1.0
summary: 응답 본문의 블록 구성과 블록 사이 간격을 정합니다.
stage: 3
audience: both
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=111-67516, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=111-66151, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=111-66614]
base: Figma v1.0.0 (26.02.27)
---

# 3-3. 블록

응답 본문은 블록이 세로로 쌓인 것입니다. 어떤 블록이 있고, 블록과 블록 사이를 얼마나 띄우는지 정합니다. 블록 하나하나의 모양은 [4-4. 마크다운 요소](../4-resources/4-4-markdown.md)에 있습니다.

## 구조

```
본문  = 블록+
블록  = 문단 | 제목 | 목록 | 체크리스트 | 표 | 코드 블록 | 인용문 | 구분선 | 이미지 | 결과 카드
```

블록은 모두 마크다운으로 씁니다. 답변을 쓰는 AI는 `마크다운`과 `언제 쓰나` 열만 알면 되고, 화면은 `클래스`와 `모양` 열로 그립니다.

| 요소 | 클래스 | 역할 | 마크다운 | 언제 쓰나 | 모양 |
| --- | --- | --- | --- | --- | --- |
| 본문 | `.content` | 블록 세로 스택 | — | — | — |
| 문단 | — | 본문 문장 | 빈 줄로 구분 | ANS-06 ~ 11 | [4-4](../4-resources/4-4-markdown.md) |
| 제목 | — | 섹션 이름 | `##` · `###` · `####` | ANS-12 ~ 14 | 4-4 |
| 목록 | — | 항목 나열 | `- 항목` · `1. 항목` | ANS-17 ~ 19 | 4-4 |
| 체크리스트 | `.task` | 체크 항목 나열 | `- [ ]` · `- [x]` | ANS-20 | 4-4 |
| 표 | `.tw` | 행과 열로 된 블록 | `\| a \| b \|` | ANS-21 ~ 22 | 4-4 |
| 코드 블록 | `.pw` | 여러 줄의 코드나 명령어 | ```` ```언어 ```` | ANS-23 | 4-4 |
| 인용문 | `.bw` | 본문과 구분해 강조하는 블록 | `>` | ANS-24 | 4-4 |
| 구분선 | `.hw` | 주제 전환 | `---` | ANS-25 | 4-4 |
| 이미지 | `.iw` | 응답 이미지 | `![설명](주소)` | ANS-22 | [4-5](../4-resources/4-5-image.md) |
| 결과 카드 | `.rw` | AI가 만든 파일 | `[결과 파일: 이름 · 종류]` | ANS-26 | [4-6](../4-resources/4-6-file.md) |
| 도구 사용 줄 | `.kw` | 어떤 도구를 쓰는지 알림. 끝에 `>` | `[도구: 문구]` | — | 이 문서 "스타일" |
| 작업 목록 카드 | `.gw` | 해야 할 일과 끝낸 일을 세로로 보여 줌 | `[작업 완료: 항목]` · `[작업 예정: 항목]` 줄 묶음 | — | 이 문서 "스타일" |

규칙 번호는 [2-1. 답변 규칙](../2-rules/2-1-answer.md)에 있습니다. 표 · 코드 블록 · 인용문 · 구분선 · 이미지 · 결과 카드의 클래스는 블록을 감싸는 래퍼입니다.

## 배치

블록은 본문 폭 전체를 쓰고 세로로만 쌓입니다. 코드 · 표 · 인용문 · 구분선 · 이미지 · 결과 카드는 래퍼(`.pw` `.tw` `.bw` `.hw` `.iw` `.rw` `.kw` `.gw`)로 감싸고, 블록 앞 간격을 래퍼가 갖습니다([4-8. HTML 구조 · 고정 CSS](../4-resources/4-8-markup.md)).

| 요소 | 순서 |
| --- | --- |
| 본문 처음 · 끝 | 결론 문단이 맨 앞 (ANS-01), 후속 질문이 맨 끝 (ANS-04) |
| 블록 앞뒤 | 표 · 목록 · 코드 · 인용문 · 이미지 앞에는 소개 문장 (ANS-18 · ANS-23), 뒤에는 해석 (ANS-22) |

## 간격

블록은 gap 8로 쌓고, **뒤에 오는 블록**이 위 여백을 가져 전환의 무게만큼 더 띄웁니다. 앞 블록은 아래 여백을 두지 않습니다.

```
블록 사이 거리 = gap 8 + 뒤 블록의 위 여백
```

전환의 무게가 클수록 위 여백이 커집니다 — **줄바꿈 < 문단 < 블록 전환 < 섹션**. 본문의 첫 블록은 위 여백 0입니다.

| 사이 | 마크다운 | gap | 위 여백 | 실제 거리 | 쓰는 때 |
| --- | --- | --- | --- | --- | --- |
| 문단 안 줄바꿈 | 줄 끝에서 줄만 바꿈 | — | — | 행간 1.5 | 같은 문단에서 문장이 끝날 때 |
| 문단 → 문단 | 빈 줄 1개 | 8 | 8 | 16 | 의미 단위가 바뀔 때 |
| 문단 → 표 · 코드 · 인용문 · 목록 · 이미지 | 빈 줄 + 블록 | 8 | 8 | 16 | 본문에서 블록이 시작될 때 |
| 표 · 코드 · 인용문 · 이미지 · 결과 카드 → 문단 | 블록 뒤 빈 줄 | 8 | 16 | 24 | 블록이 끝나고 본문으로 돌아올 때 |
| → H3 · H4 | `###` · `####` | 8 | 20 | 28 | 하위 섹션이 시작될 때 |
| → H2 | `##` | 8 | 24 | 32 | 주요 섹션이 시작될 때 |
| → H1 | `#` | 8 | 32 | 40 | 문서 제목 (드묾) |
| → H5 · H6 | `#####` · `######` | 8 | 16 | 24 | 거의 안 씀 |
| → 구분선 | `---` | 8 | 24 | 32 | 제목 없이 주제가 완전히 바뀔 때. 뒤 문단은 다시 8 |

턴과 턴 사이(40)는 [3-2. 턴](3-2-turn.md), 목록 · 표 · 코드 블록 안쪽 여백은 [4-4. 마크다운 요소](../4-resources/4-4-markdown.md)에 있습니다.

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](../4-resources/4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.content` | `gap` | `8px` | spacing/content/gap/8 |
| `.msg.ai .content > :first-child` | `padding-top` | `0` | |
| `.content p` | `padding-top` | `8px` | |
| `.content .pw + p, .content .tw + p, .content .bw + p, .content .iw + p, .content .rw + p, .content .kw + p, .content .gw + p` | `padding-top` | `16px` | |
| `h1` | `padding-top` | `32px` | |
| `h2` | `padding-top` | `24px` | spacing/component/y/scale-09 |
| `h3, h4` | `padding-top` | `20px` | |
| `h5, h6` | `padding-top` | `16px` | |
| `.content ul, .content ol` | `padding-top` | `8px` | |
| `.pw, .tw, .bw, .iw, .rw` | `padding-top` | `8px` | spacing/component/y/scale-02 |
| `.hw` | `padding-top` | `24px` | |
| `.kw` | `padding-top` | `16px` | spacing/gap/16. 피그마 `716-38630` blk · tool |
| `.gw` | `padding-top` | `12px` | spacing/gap/12. blk · tasks |
| `.tool-line` | `display` | `flex` | |
| `.tool-line` | `align-items` | `center` | |
| `.tool-line` | `gap` | `4px` | spacing/gap/4 |
| `.tool-line` | `font-size` | `14px` | chat/label |
| `.tool-line` | `font-weight` | `500` | fontWeight/base |
| `.tool-line` | `line-height` | `1.4` | |
| `.tool-line` | `color` | `{chat/text/status}` | 로컬 (#7F7F7F) |
| `.tool-line svg` | `width` | `16px` | |
| `.tool-line svg` | `height` | `16px` | |
| `.tool-line svg` | `flex` | `none` | |
| `.todo` | `display` | `flex` | |
| `.todo` | `flex-direction` | `column` | |
| `.todo` | `gap` | `12px` | spacing/gap/12 |
| `.todo` | `padding` | `20px` | spacing/component/y/scale-08 |
| `.todo` | `background` | `{chat/table/bg}` | 로컬 |
| `.todo` | `border` | `1px solid {color/border/base/high}` | color/border/base/high |
| `.todo` | `border-radius` | `{radius/large}` | radius/large |
| `.todo-item` | `display` | `flex` | |
| `.todo-item` | `align-items` | `center` | |
| `.todo-item` | `gap` | `8px` | spacing/gap/8 |
| `.todo-item` | `font-size` | `14px` | font/body/small |
| `.todo-item` | `font-weight` | `500` | fontWeight/base |
| `.todo-item` | `line-height` | `1.5` | |
| `.todo-item` | `color` | `{chat/todo/pending}` | 로컬. 예정 항목 |
| `.todo-item.is-done` | `color` | `{color/text/base/primary}` | 끝낸 항목 |
| `.todo-item svg` | `width` | `16px` | |
| `.todo-item svg` | `height` | `16px` | |
| `.todo-item svg` | `flex` | `none` | |

## 미정

- 결과 카드 표기가 문서마다 다름. 이 문서는 `[결과 파일: 이름 · 종류]`, [2-1. 답변 규칙](../2-rules/2-1-answer.md)의 ANS-26은 `[결과 파일: 이름.확장자 · 종류]`, [4-8. HTML 구조 · 고정 CSS](../4-resources/4-8-markup.md)는 `[결과 파일: 이름.xlsx · 설명]`. 하나로 정해야 함
