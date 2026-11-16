---
id: SPEC-4-6
type: spec
title: 파일
status: stable
version: 1.3.0
summary: 요청 영역 첨부 파일 카드와 응답 영역 결과 카드의 구조, 크기, 상태, 스타일을 정합니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=112-11605, https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=247-153846]
base: Figma v1.0.0 (26.02.27)
---

# 4-6. 파일

채팅에 나오는 파일 두 가지를 정합니다. **요청 영역 첨부 파일 카드**는 사용자가 보낸 문서를 말풍선 위에 카드로 보여 주고, **응답 영역 결과 카드**는 AI가 도구를 실행해 만든 파일을 답변 안에 보여 줍니다. 첨부 이미지는 [4-5. 이미지](4-5-image.md), 입력창에 올리는 중인 첨부는 [4-7. 입력창](4-7-input.md)에서 다룹니다.

- 상태: 응답 영역 결과 카드는 초안(Figma 프레임이 반투명 상태)
- 구현: 지원(`chat-ui.js`가 `[결과 파일]` · `[결과 실행 중]` · `[결과 실패]` 줄을 그림)
- 규칙: [2-2 파일](../2-rules/2-2-ui.md#파일-ui-file) UI-FILE-01 ~ 28

## 구조

### 요청 영역 · 첨부 파일 카드

```text
.msg.user                        ← 1fr(비워 둠) : 3fr(내용)
└─ 3fr 열 (오른쪽 정렬)
   ├─ .attach                    ← 첨부 묶음, 말풍선과 12
   │  ├─ .files                  ← 문서 묶음, 카드 사이 12, 오른쪽 정렬
   │  │  ├─ .file                ← 카드 (높이 62 고정, 누르면 파일을 연다)
   │  │  │  ├─ .file-icon.type-… ← 유형 타일 32 × 32, 흰색 아이콘 20
   │  │  │  └─ .file-text        ← 파일명 + 유형 라벨, 사이 4
   │  │  │     ├─ .file-name     ← 확장자까지 포함한 파일명, 1줄 끝 말줄임
   │  │  │     └─ .file-type     ← 유형 이름 (예: 문서 뷰어)
   │  │  └─ .more                ← '더보기' / '접기' (4개 이상일 때만, 묶음의 마지막 자식)
   │  └─ .thumbs                 ← 이미지 묶음 (이미지 문서 참고)
   └─ .bubble                    ← 요청 말풍선
```

### 응답 영역 · 결과 카드

결과 카드는 실행 라벨과 카드로 이루어집니다. 카드 안에는 유형 타일 · 파일명 · 유형 라벨 · 동작 버튼이 한 줄로 놓입니다.

```text
.rw                              ← 결과 카드 블록, 위 여백 8
└─ .result                       ← 실행 라벨 ↔ 카드 12
   ├─ .result-label              ← 실행 라벨 (예: 파일 생성, 데이터 분석 실행)
   └─ .result-card               ← 응답 영역 폭을 채우는 카드, 요소 사이 16
      ├─ .file-icon.type-…       ← 유형 타일 44 × 44
      ├─ .file-text              ← 파일명 + 유형 라벨, 사이 4
      │  ├─ .result-title        ← 파일명 (chat/H4 · 18 Bold), 1줄 끝 말줄임
      │  └─ .result-sub          ← 유형 라벨 (14 Medium)
      └─ .result-btn             ← 테두리형 버튼, 오른쪽 고정
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 요청 영역 · 첨부 묶음 | `.attach` | 첨부 파일 카드 묶음과 이미지 묶음을 담는다. 정본은 4-5 |
| 요청 영역 · 첨부 파일 카드 묶음 | `.files` | 카드를 오른쪽 정렬로 쌓는다 |
| 요청 영역 · 첨부 파일 카드 | `.file` | 파일 하나. 카드 전체를 누르면 파일을 연다 |
| 요청 영역 · 유형 타일 | `.file-icon` | 유형별 색 배경에 흰색 file-line 아이콘 |
| 요청 영역 · 파일 텍스트 | `.file-text` | 파일명과 유형 라벨 묶음 |
| 요청 영역 · 파일명 | `.file-name` | 확장자까지 포함한 원래 파일명 |
| 요청 영역 · 유형 라벨 | `.file-type` | 확장자 대신 유형 이름을 보여 준다 |
| 요청 영역 · 더보기 버튼 | `.more` | '더보기' / '접기' 텍스트 버튼. `.files`의 마지막 자식 |
| 응답 영역 · 결과 카드 블록 | `.rw` | 결과 카드를 감싸는 블록 |
| 응답 영역 · 결과 묶음 | `.result` | 실행 라벨과 결과 카드 묶음 |
| 응답 영역 · 실행 라벨 | `.result-label` | 어떤 도구를 실행했는지 알린다 (예: 데이터 분석 실행) |
| 응답 영역 · 결과 카드 | `.result-card` | 응답 영역 폭을 채우는 카드 |
| 응답 영역 · 유형 타일 | `.file-icon` | 파일 유형별 색 배경 + 흰색 아이콘. 실행 중 · 실패는 상태 타일로 바뀐다 |
| 응답 영역 · 파일명 | `.result-title` | 확장자까지 표시 |
| 응답 영역 · 유형 라벨 | `.result-sub` | 파일 유형 이름. 실행 중 · 실패에서는 진행 · 실패 이유 문구로 바뀐다 |
| 응답 영역 · 실행 중 스피너 | `.result-spin` | 실행 중 실행 라벨 앞 16 스피너 |
| 응답 영역 · 동작 버튼 | `.result-btn` | 완료 = 열기, 실패 = 다시 시도, 실행 중 = 없음 |

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 요청 영역 · 첨부 파일 카드 묶음 | `.msg.user`의 3fr 열 | 오른쪽 정렬. 이미지 묶음 · 말풍선 위 |
| 요청 영역 · 더보기 버튼 | 첨부 파일 카드 묶음 | 카드 묶음 아래, 한 줄을 모두 차지, 오른쪽 정렬 텍스트 버튼 |
| 응답 영역 · 실행 라벨 | 결과 묶음 | 결과 카드 위 |
| 응답 영역 · 결과 카드 | 응답 영역 | 응답 영역 폭을 채움 |
| 응답 영역 · 동작 버튼 | 결과 카드 | 오른쪽 고정 |

## 크기

### 요청 영역 · 첨부 파일 카드

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 첨부 파일 카드 | 높이 | 62 고정 | |
| 첨부 파일 카드 | 최대 폭 | Mobile 240 · Tablet · Desktop 320 | 스타일 표에는 Tablet · Desktop 값(320)을 적고, Mobile 240은 화면 너비 규칙에서 처리한다 |
| 첨부 파일 카드 | 패딩 | 10 / 16 | |
| 첨부 파일 카드 | 모서리 | 12 | |
| 유형 타일 | 크기 · 모서리 | 32 × 32 · 4 | |
| 유형 타일 | 아이콘 | file-line 20 (흰색) | |
| 파일명 | 글자 | chat/H5 · 16 Bold | 1줄을 넘으면 끝을 말줄임(…) 처리 |
| 유형 라벨 | 글자 | chat/label · 14 Medium | |
| 더보기 버튼 | 글자 | 14 Medium · 회색 글자 | |

### 응답 영역 · 결과 카드

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 실행 라벨 | 글자 | 16 Medium · 회색 | 피그마 `247-153846` 기준 |
| 결과 카드 | 패딩 | 16 / 18 | 상하 16, 좌우 18 |
| 결과 카드 | 모서리 | 12 | |
| 유형 타일 | 크기 | 44 | 구조 트리는 44 × 44 |
| 파일명 | 글자 | chat/H4 · 18 Bold | 1줄을 넘으면 끝 말줄임 |
| 유형 라벨 | 글자 | chat/label · 14 Medium · 회색 | |
| 동작 버튼 | 모양 | 테두리형 · 모서리 8 · 16 Medium | |

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 묶음 간격 | 12 | 문서 묶음 · 이미지 묶음 · 말풍선 사이 |
| 첨부 파일 카드 사이 | 12 | 세로 · 가로 2열 모두 |
| 유형 타일 ↔ 파일 텍스트 | 12 | 요청 영역 |
| 파일명 ↔ 유형 라벨 | 4 | |
| 카드 묶음 ↔ 더보기 버튼 | 8 | 더보기 버튼의 위 간격 |
| 앞 문단 ↔ 결과 카드 블록 | 8 | 결과 카드 블록 위 여백 |
| 실행 라벨 ↔ 결과 카드 | 12 | |
| 결과 카드 안 요소 사이 | 16 | |
| 결과 카드 ↔ 뒤 문단 | 16 | 뒤 문단 padding-top |

## 유형

### 요청 영역 · 유형 타일

확장자를 다섯 가지 유형으로 묶어 타일 색과 라벨을 정합니다. 목록에 없는 확장자는 문서(회색)로 보여 줍니다. 응답 영역 유형 타일도 같은 클래스를 씁니다.

| 유형 | 확장자 | 타일 색 | 라벨 | 클래스 |
| --- | --- | --- | --- | --- |
| 프레젠테이션 | ppt · pptx · slide | `#DB423C` | 프레젠테이션 | `.file-icon.type-ppt` |
| 워드프로세서 | hwp · docx · txt | `#4556B6` | 워드프로세서 | `.file-icon.type-doc` |
| 문서 뷰어 | pdf | `#B53127` | 문서 뷰어 | `.file-icon.type-pdf` |
| 스프레드시트 | xlsx | `#1E9362` | 스프레드시트 | `.file-icon.type-xls` |
| 문서 | 그 외 확장자 | `#585A5E` | 문서 (그 외 모든 확장자) | `.file-icon.type-etc` |

## 상태

### 응답 영역 · 결과 카드

결과 카드는 실행 중 → 완료 또는 실패로 바뀝니다. 상태마다 실행 라벨 · 타일 · 문구 · 버튼이 정해져 있습니다.

| 상태 | 실행 라벨 | 타일 | 문구 | 버튼 |
| --- | --- | --- | --- | --- |
| 실행 중 | 스피너(16) + "… 실행 중" | 44 × 44 · 배경 `#F2F2F2` · 회색 file 아이콘 24 | "… 만드는 중…" · 진행 문구 (예: 표 3개를 정리하고 있어요) | 없음 |
| 완료 | "… 실행" | 유형별 색 · 흰 아이콘 | 파일명 · 유형 라벨 | 열기 |
| 실패 | "… 실행" | 44 × 44 · 배경 `#FDECEA` · 빨간 경고 아이콘 24 | 실패 제목 · 이유 한 줄 (예: 파일이 20MB를 넘어 읽지 못했습니다.) | 다시 시도 |

실행 중 · 실패의 제목은 18 Bold(행간 1.4), 문구는 15 Medium(행간 1.5)입니다.

## 동작

### 요청 영역 · 첨부 파일 카드 묶음

1. 첨부 1~3개 → 카드를 모두 노출하고 버튼은 없음
2. 첨부 4개 이상 · 접힘(`.files.is-collapsed`) → 위에서부터 3개를 노출하고 '더보기' 버튼을 둠
3. 첨부 4개 이상 · 펼침(`.files.is-open`) → 전체를 노출하고 버튼 문구를 '접기'로 바꿈
4. 카드 전체를 누름 → 파일을 연다

## 반응형

Desktop은 Tablet과 같은 규칙을 따릅니다.

| 요소 | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| 첨부 파일 카드 최대 폭 | 240 | 320 | 320 |
| 첨부 파일 카드 열 수 | 1열. 3fr 폭이 492 이상(가로 화면 · 넓은 창)이면 2열 | 항상 1열 | 항상 1열 |

- 2열 전환 폭: 3fr ≥ 카드 최대 폭 × 2 + 12 (Mobile 492 이상)
- Tablet · Desktop이 항상 1열인 이유: 3fr 최대 폭 540 < 320 × 2 + 12 = 652
- 3fr이 아무리 넓어도 3열 이상으로 늘리지 않는다. 2열에서 마지막 줄에 카드가 1개면 오른쪽 칸에 둔다

## 참고

### 색

| 요소 | 속성 | 값 |
| --- | --- | --- |
| 첨부 파일 카드 | 배경 | `{color/container/base/high}` |
| 첨부 파일 카드 | 테두리 | `{color/border/base/high}` |
| 결과 카드 | 배경 | `{color/container/base/high}` |
| 결과 카드 | 테두리 | `{color/border/base/high}` |
| 유형 타일 | 배경 | 유형별 색 ("유형") |

## 규칙

동작 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md#파일-ui-file)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 첨부 파일 카드 (파일명 · 유형 라벨 · 카드) | UI-FILE-01 ~ UI-FILE-08 |
| 첨부 개수 · 더보기 | UI-FILE-09 ~ UI-FILE-12 |
| 카드 배치 · 열 수 | UI-FILE-13 ~ UI-FILE-17 |
| 혼합 메시지 | UI-FILE-18 ~ UI-FILE-20 |
| 응답 영역 · 결과 카드 | UI-FILE-21 ~ UI-FILE-28 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.files` | `display` | `flex` | |
| `.files` | `flex-wrap` | `wrap` | |
| `.files` | `justify-content` | `flex-end` | 오른쪽 정렬 → ↓ |
| `.files` | `align-content` | `flex-start` | |
| `.files` | `gap` | `12px` | spacing/content/gap/12 |
| `.files` | `max-width` | `100%` | 3fr 열 폭 |
| `.files.is-collapsed .file:nth-child(n+4)` | `display` | `none` | 접힘 = 3개만 노출 |
| `.file` | `display` | `flex` | |
| `.file` | `align-items` | `center` | |
| `.file` | `gap` | `12px` | spacing/component/x/scale-04 |
| `.file` | `box-sizing` | `border-box` | |
| `.file` | `width` | `320px` | Tablet · PC 최대 폭 (Mobile 240) |
| `.file` | `max-width` | `100%` | 3fr 폭이 좁으면 맞춤 |
| `@mobile .file` | `width` | `240px` | Mobile 최대 폭 |
| `.file` | `height` | `62px` | |
| `.file` | `padding` | `10px 16px` | spacing/component/y/scale-03 · x/scale-06 |
| `.file` | `background` | `{color/container/base/high}` | color/container/base/high |
| `.file` | `border` | `1px solid {color/border/base/high}` | color/border/base/high |
| `.file` | `border-radius` | `{radius/large}` | radius/large |
| `.file` | `cursor` | `pointer` | |
| `.file-icon` | `display` | `flex` | |
| `.file-icon` | `align-items` | `center` | |
| `.file-icon` | `justify-content` | `center` | |
| `.file-icon` | `flex` | `none` | |
| `.file-icon` | `width` | `32px` | Thumbnail Box · square · small |
| `.file-icon` | `height` | `32px` | |
| `.file-icon` | `border-radius` | `{radius/small}` | radius/small |
| `.file-icon` | `background` | `#585A5E` | 토큰 없음 (기본 = 문서) |
| `.file-icon` | `color` | `{color/icon/base/white}` | color/icon/base/white |
| `.file-icon svg` | `width` | `20px` | icon/20 |
| `.file-icon svg` | `height` | `20px` | |
| `.file-icon.type-ppt` | `background` | `#DB423C` | 토큰 없음 |
| `.file-icon.type-doc` | `background` | `#4556B6` | 토큰 없음 |
| `.file-icon.type-pdf` | `background` | `#B53127` | 토큰 없음 |
| `.file-icon.type-xls` | `background` | `#1E9362` | 토큰 없음 |
| `.file-icon.type-etc` | `background` | `#585A5E` | 토큰 없음 |
| `.file-text` | `display` | `flex` | |
| `.file-text` | `flex-direction` | `column` | |
| `.file-text` | `flex` | `1` | |
| `.file-text` | `min-width` | `0` | 말줄임이 되도록 |
| `.file-text` | `gap` | `4px` | spacing/content/gap/4 |
| `.file-name` | `font-size` | `16px` | chat/H5 |
| `.file-name` | `font-weight` | `700` | fontWeight/strong |
| `.file-name` | `line-height` | `1.3` | |
| `.file-name` | `letter-spacing` | `-0.32px` | −2% |
| `.file-name` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.file-name` | `white-space` | `nowrap` | |
| `.file-name` | `overflow` | `hidden` | |
| `.file-name` | `text-overflow` | `ellipsis` | |
| `.file-type` | `font-size` | `14px` | chat/label |
| `.file-type` | `font-weight` | `500` | fontWeight/base |
| `.file-type` | `line-height` | `1` | 100% |
| `.file-type` | `letter-spacing` | `0` | |
| `.file-type` | `color` | `{color/text/base/tertiary}` | color/text/base/tertiary |
| `.file-type` | `white-space` | `nowrap` | |
| `.files .more` | `flex-basis` | `100%` | 한 줄 전체, 묶음 아래 |
| `.files .more` | `margin-top` | `-4px` | 묶음 gap 12 − 4 = 위 간격 8 (spacing/layout/y/8) |
| `.files .more` | `text-align` | `right` | |
| `.result` | `display` | `flex` | |
| `.result` | `flex-direction` | `column` | |
| `.result` | `gap` | `12px` | 실행 라벨 ↔ 카드 |
| `.result-label` | `font-size` | `16px` | chat/P · 피그마 `247-153846` |
| `.result-label` | `font-weight` | `500` | fontWeight/base |
| `.result-label` | `line-height` | `1.5` | |
| `.result-label` | `letter-spacing` | `-0.01em` | −1% |
| `.result-label` | `color` | `{chat/text/status}` | 로컬 (#7F7F7F) |
| `.result-card` | `display` | `flex` | |
| `.result-card` | `align-items` | `center` | |
| `.result-card` | `gap` | `16px` | |
| `.result-card` | `padding` | `16px 18px` | 상하 16, 좌우 18 |
| `.result-card` | `background` | `{color/container/base/high}` | color/container/base/high (Figma #F7F7F7) |
| `.result-card` | `border` | `1px solid {color/border/base/high}` | color/border/base/high |
| `.result-card` | `border-radius` | `{radius/large}` | radius/large |
| `.result-card .file-icon` | `width` | `44px` | |
| `.result-card .file-icon` | `height` | `44px` | |
| `.result-card .file-icon` | `border-radius` | `5.5px` | 피그마 Anatomy 3번 (44 타일 · 모서리 5.5) |
| `.result-card .file-icon svg` | `width` | `24px` | icon/24 |
| `.result-card .file-icon svg` | `height` | `24px` | |
| `.result-title` | `font-size` | `18px` | chat/H4 |
| `.result-title` | `font-weight` | `700` | fontWeight/strong |
| `.result-title` | `line-height` | `1.3` | |
| `.result-title` | `letter-spacing` | `-0.36px` | −2% |
| `.result-title` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.result-title` | `white-space` | `nowrap` | |
| `.result-title` | `overflow` | `hidden` | |
| `.result-title` | `text-overflow` | `ellipsis` | |
| `.result-sub` | `font-size` | `14px` | chat/label |
| `.result-sub` | `font-weight` | `500` | fontWeight/base |
| `.result-sub` | `line-height` | `1` | 100% |
| `.result-sub` | `color` | `{chat/text/status}` | 로컬 (#7F7F7F) |
| `.result-btn` | `flex` | `none` | 오른쪽 고정 |
| `.result-btn` | `margin-left` | `auto` | |
| `.result-btn` | `padding` | `10px 16px` | |
| `.result-btn` | `background` | `{chat/table/bg}` | 로컬 (다크에서 카드 배경과 같음) |
| `.result-btn` | `border` | `1px solid {chat/border/button}` | 로컬 |
| `.result-btn` | `border-radius` | `{radius/medium}` | radius/medium |
| `.result-btn` | `font-size` | `16px` | |
| `.result-btn` | `font-weight` | `500` | fontWeight/base |
| `.result-btn` | `line-height` | `1.5` | |
| `.result-btn` | `color` | `{color/text/base/primary}` | color/text/base/primary |
| `.result-btn` | `cursor` | `pointer` | |
| `.result-spin` | `display` | `inline-block` | 실행 중 라벨 앞 스피너 |
| `.result-spin` | `width` | `16px` | 피그마 status / running |
| `.result-spin` | `height` | `16px` | |
| `.result-spin` | `border` | `2px solid currentColor` | |
| `.result-spin` | `border-top-color` | `transparent` | |
| `.result-spin` | `border-radius` | `50%` | |
| `.result-spin` | `animation` | `result-spin 0.8s linear infinite` | 고정 CSS의 `@keyframes result-spin`. 속도는 임시 |
| `.result-label.is-running` | `display` | `flex` | 스피너 + 문구 |
| `.result-label.is-running` | `align-items` | `center` | |
| `.result-label.is-running` | `gap` | `6px` | 피그마 스피너 16 · 문구 시작 22 |
| `.file-icon.type-wait` | `background` | `{chat/result/tile-wait}` | 로컬 |
| `.file-icon.type-wait` | `color` | `{chat/text/status}` | 회색 file 아이콘 |
| `.file-icon.type-fail` | `background` | `{chat/result/tile-fail}` | 로컬 |
| `.file-icon.type-fail` | `color` | `{chat/result/icon-fail}` | 로컬 (임시) |

## 미정

- 실패 타일 경고 아이콘 색 `#D92D20`(다크 `#FF6B60`)과 실행 중 · 실패 타일의 다크 배경, 스피너 속도 0.8초는 피그마에 값이 없어 임시로 정함
- 확장자 목록의 프레젠테이션에 `slide`가 있으나 UI-INPUT-59의 형식 목록에는 없음
- 간격 12의 토큰 이름이 섞여 있음: `spacing/gap/12`(4-1) · `spacing/content/gap/12`(`.files` gap) · `spacing/component/x/scale-04`(`.file` gap) · `spacing/component/y/scale-04`(4-1, 4-4)
- 시나리오의 결과 카드 종류 "PDF 문서"(`conversations/movie.md`), "플레이리스트"(`conversations/playlist.md`)가 이 문서의 유형 목록에 없음
- 결과 카드 실행 중 · 실패 상태의 클래스가 아직 HTML 계약에 없음
- 결과 카드 전체가 초안(Figma 프레임이 반투명 상태)
