---
id: SPEC-4-1
type: spec
title: 디자인 토큰
status: stable
version: 1.4.0
summary: 채팅 화면에 쓰는 색 · 모서리 · 그림자 · 서체 토큰입니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=111-62447]
base: Figma v1.0.0 (26.02.27)
---

# 4-1. 디자인 토큰

채팅 화면에 쓰는 색 · 모서리 · 그림자 · 서체 토큰을 정합니다. 다른 문서의 스타일 표는 값을 직접 쓰지 않고 `{토큰 이름}`으로 이 표를 참조하며, 글자 크기 · 굵기 · 행간 조합은 [4-2. 타이포그래피](4-2-typography.md)에 있습니다.

- 상태: 스타일 · 조합 · 로컬 토큰의 Dark 값은 임시

## 출처와 Dark 값

토큰 표의 `출처`와 `Dark` 칸은 아래 뜻입니다.

- **Figma 변수**: Figma에 변수로 등록된 토큰. 이름을 Figma와 똑같이 씀
- **Figma 스타일**: 디자인 파일의 효과 · 글자 스타일. 이름을 Figma와 똑같이 씀. 모드가 없어 Dark는 Figma에서 읽을 수 없음
- **프리미티브 조합**: 변수 이름이 따로 없고 프리미티브 색과 프리미티브 불투명도(Primitive/ Opacity)를 합친 값. 괄호 안이 합친 두 값
- **로컬 토큰**: Figma에서 hex로 직접 칠해져 있어 변수가 없는 값. `chat/` 접두로 이름을 붙였고, Figma 변수로 등록되면 이름을 바꿈
- **Dark**: `Figma 변수` 행의 Dark 값은 토큰 라이브러리 H-Foundation의 Dark 모드 값(2026-11-13 대조). `Figma 스타일` · `프리미티브 조합` · `로컬 토큰` 행의 Dark 값은 Figma에서 읽을 수 없어 이전 스펙에서 옮긴 **임시 값**. `—`는 Light와 같다는 뜻

## 색 — 면

| 토큰 | Light | Dark | 용도 | 출처 |
| --- | --- | --- | --- | --- |
| `color/frame/base/high` | `#F7F7F7` | `#0A0A0A` | 채팅 화면 배경 | Figma 변수 |
| `color/background/base/high` | `#F7F7F7` | `#0A0A0A` | 헤더 배경 | Figma 변수 |
| `color/background/base/low-level1` | `#FCFCFC` | `#1F1F1F` | 입력창 배경 | Figma 변수 |
| `color/container/base/higher` | `#E5E5E5` | `#262626` | 요청 말풍선 | Figma 변수 |
| `color/container/base/high` | `#F7F7F7` | `#1F1F1F` | 첨부 파일 카드 · 결과 카드 | Figma 변수 |
| `color/container/brand/secondary` | `#1A1A1A` | `#474747` | 전송 버튼, 체크된 체크박스 | Figma 변수 |
| `alpha/black-4` | `#1A1A1A0A` | `#FFFFFF0F` | 표 머리글 배경 | 프리미티브 조합 (`color/bw/light/black` · 불투명도 4) |
| `alpha/black-8` | `#1A1A1A14` | `#FFFFFF1F` | 인라인 코드 배경, 그림자 | Figma 변수 |
| `alpha/white-80` | `#FFFFFFCC` | `#262626CC` | 맨 아래로 이동 버튼 | 프리미티브 조합 (`color/bw/white` · 불투명도 80) |
| `chat/code/bg` | `#1A1A1A` | — | 코드 블록 배경 (다크 모드에서도 동일) | 로컬 |
| `chat/table/bg` | `#FFFFFF` | `#141414` | 표 · 출처 미리보기 카드 · 결과 카드 동작 버튼 배경 | 로컬 |
| `chat/source/bg` | `#1A1A1A0F` | `#FFFFFF17` | 출처 칩 배경(불투명도 6%). 임시 | 로컬 |
| `chat/source/bg-hover` | `#1A1A1A1F` | `#FFFFFF2E` | 출처 칩 호버 · 열림(불투명도 12%). 임시 | 로컬 |
| `chat/search/bg` | `#1A1A1A0D` | `#FFFFFF14` | 검색 단계 칩 배경(불투명도 5%). 임시 | 로컬 |

## 색 — 글자 · 아이콘

| 토큰 | Light | Dark | 용도 | 출처 |
| --- | --- | --- | --- | --- |
| `color/text/base/primary` | `#1A1A1A` | `#FAFAFA` | 본문, 제목, 말풍선 글자 | Figma 변수 |
| `color/text/base/secondary` | `#474747` | `#FAFAFA` | 보조 본문 (출처 라벨, 목록 보조 설명) | Figma 변수 |
| `color/text/base/tertiary` | `#696969` | `#D1D1D1` | 파일 종류 라벨 | Figma 변수 |
| `color/text/base/quaternary` | `#747474` | `#ADADAD` | 인용문, 취소선, 전체보기, 안내 문구 | Figma 변수 |
| `color/status/text/informative` | `#064AD0` | `#72A0FE` | 링크 | Figma 변수 |
| `color/icon/base/primary` | `#1A1A1A` | `#FAFAFA` | 주요 아이콘 | Figma 변수 |
| `color/icon/base/secondary` | `#747474` | `#8A8A8A` | 액션 아이콘 (복사 등), 하위 목록 기호 | Figma 변수 |
| `color/icon/base/white` | `#FFFFFF` | — | 어두운 면 위 아이콘 | Figma 변수 |
| `chat/text/cell` | `#333333` | `#D4D4D4` | 표 본문 셀 | 로컬 |
| `chat/text/done` | `#9E9E9E` | `#6B6B6B` | 완료된 체크리스트 항목, 코드 언어 라벨 | 로컬 |
| `chat/text/status` | `#7F7F7F` | `#8A8A8A` | 작업 상태 표시, 결과 카드 보조 글자 | 로컬 |
| `chat/text/shimmer` | `#8E8E93` | `#6B6B70` | 텍스트 시머 재생 중 글자 바탕색 | 로컬 |
| `chat/text/shimmer-highlight` | `#1C1C1E` | `#B8B8BD` | 완료 문구와 동작 줄이기의 정적 글자색. 다크 값은 임시 | 로컬 |
| `chat/text/shimmer-sweep` | `#FFFFFF80` | `#FFFFFF80` | 텍스트 시머 하이라이트(문구 위를 지나가는 흰 띠, 불투명도 50%) | 로컬 |
| `chat/code/inline` | `#FD312E` | `#FF6B69` | 인라인 코드 글자 | 로컬 |
| `chat/code/text` | `#C8CDD6` | — | 코드 블록 기본 글자 · 함수 | 로컬 |
| `chat/syntax/keyword` | `#C3A6E8` | — | 코드 키워드 | 로컬 |
| `chat/syntax/value` | `#E5C07B` | — | 코드 문자열 · 숫자 | 로컬 |
| `chat/syntax/comment` | `#7FA88A` | — | 코드 주석 | 로컬 |

## 색 — 선

| 토큰 | Light | Dark | 용도 | 출처 |
| --- | --- | --- | --- | --- |
| `color/border/base/high` | `#E5E5E5` | `#474747` | 표 · 파일 카드 · 입력창 테두리, 인용문 세로선 | Figma 변수 |
| `chat/border/control` | `#747474` | `#8A8A8A` | 체크박스 테두리 (미체크) | 로컬 |
| `chat/border/button` | `#CCCCCC` | `#5C5C5C` | 결과 카드 동작 버튼 테두리 | 로컬 |
| `chat/result/tile-wait` | `#F2F2F2` | `#2E2E2E` | 결과 카드 실행 중 타일 배경 (다크는 임시) | 로컬 |
| `chat/result/tile-fail` | `#FDECEA` | `#3D2220` | 결과 카드 실패 타일 배경 (다크는 임시) | 로컬 |
| `chat/todo/pending` | `#ABABAB` | `#6E6E6E` | 작업 목록 카드의 예정 항목 글자 · 원 (다크는 임시) | 로컬 |
| `chat/result/icon-fail` | `#D92D20` | `#FF6B60` | 결과 카드 실패 타일의 경고 아이콘 (임시) | 로컬 |
| `chat/divider` | `#EBEBEB` | `#333333` | 구분선 | 로컬 |

## 모서리 · 그림자

| 토큰 | Light | Dark | 용도 | 출처 |
| --- | --- | --- | --- | --- |
| `radius/small` | `4px` | — | 인라인 코드, 체크박스 | Figma 변수 |
| `radius/medium` | `8px` | — | 표 | Figma 변수 |
| `radius/large` | `12px` | — | 말풍선, 코드 블록, 이미지, 파일 카드, 입력창 | Figma 변수 |
| `radius/full` | `999px` | — | 버튼, 칩 | Figma 변수 |
| `shadow-level2` | `0 2px 12px #1A1A1A14` | `0 2px 12px #00000066` | 입력창 | Figma 스타일 |
| `chat/shadow/popover` | `0 4px 16px #1A1A1A14` | `0 4px 16px #00000066` | 출처 미리보기 카드. 임시 | 로컬 |

## 서체

| 토큰 | Light | Dark | 용도 | 출처 |
| --- | --- | --- | --- | --- |
| `fontFamily/pretendard` | `'Pretendard', system-ui, sans-serif` | — | 화면 전체 | Figma 변수 |
| `chat/font/coding` | `'Nanum Gothic Coding', monospace` | — | 인라인 코드, 코드 블록 | 로컬 |

글자 크기 · 굵기 · 행간 조합(`chat/H1`, `chat/P` 등)은 4-2에 있습니다.

## 간격 토큰

간격은 토큰이 아니라 숫자로 씁니다. 이 표는 참고용이고, 스타일 표의 `Figma 토큰` 칸에 대응하는 Figma 변수를 함께 적어 둡니다. 자주 쓰는 변수는 다음과 같습니다.

| Figma 변수 | 값 | 쓰는 곳 |
| --- | --- | --- |
| `spacing/layout/y/40` | 40 | 턴 간격 (요청 영역 위 여백) |
| `spacing/layout/x/32` | 32 | Tablet · Desktop 최소 좌우 여백 |
| `spacing/content/gap/8` | 8 | 응답 블록 사이 gap, 말풍선 안 본문 ↔ 전체보기 |
| `spacing/component/x/scale-06` | 16 | 말풍선 · 표 셀 · 파일 카드 좌우 패딩 |
| `spacing/component/y/scale-03` | 10 | 말풍선 · 파일 카드 상하 패딩 |
| `spacing/component/y/scale-04` | 12 | 표 셀 상하 패딩 |
| `spacing/gap/12` | 12 | 액션 아이콘 사이, 첨부 ↔ 말풍선 |

## 스타일 표 읽는 법

헤더 첫 칸이 `셀렉터`인 표는 그대로 CSS가 됩니다(미리보기 `chat.html`과 `chat-ui.js`가 이 표로 화면을 그림).

```markdown
| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.bubble` | `padding` | `10px 16px` | spacing/component/y/scale-03 · x/scale-06 |
| `.bubble` | `background` | `{color/container/base/higher}` | |
| `@mobile .file` | `width` | `240px` | |
```

| 칸 | 뜻 |
| --- | --- |
| 셀렉터 | 채팅 루트(`.markdown`) 안의 CSS 셀렉터. `&`는 루트 자신, `.chat`으로 시작하면 바깥 래퍼. 앞에 `@mobile` · `@tablet` · `@desktop`을 붙이면 그 화면 폭에서만 적용. 폭 구분은 [3-1. 화면](../3-composition/3-1-page.md#반응형)이 정본 |
| 속성 · 값 | CSS 그대로. `{토큰 이름}`은 이 문서의 토큰 값 (Light · Dark 자동) |
| Figma 토큰 | 사람이 보는 참고. 대응하는 Figma 변수 |

- 클래스 이름은 [4-8. HTML 구조 · 고정 CSS](4-8-markup.md)의 "클래스 목록"에 있는 것만 쓴다. `cui-` 접두어 패키지는 아직 없음(4-8 `## 미정`)
- 웹이 아닌 플랫폼(iOS · Android · Flutter)은 같은 값을 플랫폼 상수로 옮긴다. 정확한 최종 값은 3 · 4단계 문서의 스타일 표에 있음

## 미정

- 간격 12의 Figma 변수 이름이 네 가지로 섞여 있음: 이 문서의 `spacing/component/y/scale-04`(표 셀 상하 패딩) · `spacing/gap/12`(액션 아이콘 사이 등), 4-6의 `spacing/content/gap/12`(`.files` gap) · `spacing/component/x/scale-04`(`.file` gap). 용도별로 다른 변수인지, 하나로 맞춰야 하는지 확인 필요
- Dark 값: Figma에 다크 모드 값이 생기면 바꿈
