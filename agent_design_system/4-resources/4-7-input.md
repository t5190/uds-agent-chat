---
id: SPEC-4-7
type: spec
title: 입력창
status: stable
version: 1.1.0
summary: 입력창의 구조, 배치, 크기, 유형, 상태, 동작, 스타일을 정합니다.
stage: 4
audience: ui
figma: [https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=112-11606]
base: Figma v1.0.0 (26.02.27)
---

# 4-7. 입력창

사용자가 메시지를 입력하고 보내는 입력창을 정합니다. 입력창은 입력 상자 · 툴바 · 안내 문구로 이루어지고, 위쪽과 첨부 영역에 인포 바와 첨부 파일이 들어갑니다. 채팅 화면 맨 아래에 붙어 있고, 대화 내용(`.markdown`) 바깥에 놓입니다. 맨 아래로 이동 버튼은 [4-3. 메시지](4-3-message.md), 전송한 첨부의 배치는 [4-5. 이미지](4-5-image.md) · [4-6. 파일](4-6-file.md)에서 다룹니다.

- 상태: 첨부 영역은 Figma에서 제작 중
- 구현: 일부 지원(`chat-ui.js`: 입력 상자 · 늘어남 · 전송/비활성/중지 · 안내 문구 · 스크림 · 맨 아래로 이동. + 메뉴 · 도구 칩 · 인포 바 · 첨부 · 펼침은 스펙만)
- 규칙: [2-2 입력창](../2-rules/2-2-ui.md#입력창-ui-input) UI-INPUT-01 ~ 60

## 구조

입력창은 입력 상자(입력 영역 + 툴바)와 그 아래 안내 문구로 이루어집니다. 뒤에는 대화 내용이 비치지 않도록 그라디언트 스크림을 깝니다.

```
.chat
└─ .composer                 하단 영역 전체 (세로 정렬, 가운데, 간격 12)
   ├─ .composer-scrim        ⑤ 그라디언트 스크림 (입력창 뒤, 위쪽으로 투명)
   ├─ .scroll-bottom         맨 아래로 이동 버튼 (필요할 때만, 36 × 36)
   ├─ .info-bar              인포 바 (필요할 때만, 입력 상자 위에 겹쳐 붙음)
   ├─ .composer-box          ① 입력 상자 (.is-collapsed = 첫 진입 한 줄형)
   │  ├─ 첨부 영역           첨부 파일 (제작 중 — 아래 "참고"의 첨부 영역)
   │  ├─ .composer-input     ② 입력 영역 (textarea)
   │  └─ .composer-tools     ③ 툴바
   │     ├─ .composer-btn          + 버튼 (메뉴 열기)
   │     ├─ 도구 칩 영역           선택한 도구 · 모드 칩 (남은 폭 채움)
   │     ├─ .composer-btn          음성 입력
   │     └─ .composer-btn.composer-send   전송
   └─ .composer-note         ④ 안내 문구
```

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 입력창 영역 | `.composer` | 하단 영역 전체. 스크림 · 인포 바 · 입력 상자 · 안내 문구를 담는다 |
| 스크림 | `.composer-scrim` | 스크롤된 대화가 입력창과 겹쳐 보이지 않게 입력창 뒤 대화 내용을 가린다 |
| 맨 아래로 이동 버튼 | `.scroll-bottom` | 필요할 때만 보인다. 정본은 4-3 |
| 인포 바 | `.info-bar` | 입력 상자 위에 겹쳐 붙는 한 줄 알림 |
| 입력 상자 | `.composer-box` | 입력 영역과 툴바를 감싼다 |
| 첨부 영역 | — | 입력 상자 안 입력 영역 위. 업로드 중인 첨부 파일 |
| 입력 영역 | `.composer-input` | 글자를 입력하는 textarea |
| 툴바 | `.composer-tools` | + 버튼 · 도구 칩 영역 · 음성 · 전송 |
| 툴바 버튼 | `.composer-btn` | + 버튼 · 음성 입력 등 아이콘 버튼 |
| 전송 버튼 | `.composer-send` | `.composer-btn`의 크기를 그대로 쓰고 색만 더한다 |
| 도구 칩 영역 | — | 선택한 도구 · 모드 칩. 남은 폭을 채운다 |
| + 메뉴 | — | + 버튼을 누르면 열리는 메뉴 |
| 안내 문구 | `.composer-note` | 입력 상자 아래 안내 |
| 드래그 오버레이 | — | 파일을 끌어 올 때 화면을 덮는 안내 |

## 배치

입력창 폭은 콘텐츠 폭과 같습니다. 배치 동작(하단 고정 · 첫 진입 가운데 · 키보드 위)은 UI-INPUT-12 ~ UI-INPUT-15를 따르고, 첫 진입 화면의 가운데 배치는 화면 레이아웃이 맡습니다. 화면별 폭은 "반응형"에 있습니다.

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 입력창 영역 | 채팅 화면 | 맨 아래. 대화 내용(`.markdown`) 바깥 |
| 입력창 영역의 자식 | 입력창 영역 | 세로 정렬, 가운데 |
| 스크림 | 입력창 | 뒤 |
| 맨 아래로 이동 버튼 | 입력창 | 위 가운데 |
| 인포 바 | 입력 상자 | 위에 겹쳐 붙음 |
| 첨부 영역 | 입력 상자 | 안, 입력 영역 위 |
| 툴바 버튼 | 툴바 | 왼쪽 + 버튼 · 가운데 서브 버튼(도구 칩 영역) · 오른쪽 음성 · 전송 |
| 안내 문구 | 입력 상자 | 아래, 가운데 정렬 |

## 크기

### 입력 상자

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 입력 상자 | 배경 · 테두리 · 모서리 | #FCFCFC (`{color/background/base/low-level1}`) · #E5E5E5 (`{color/border/base/high}`) · radius 12 | Figma 표 |
| 입력 상자 | 그림자 | blur 12 · y 2 · 8% | |

- 한 줄형 · 여러 줄형의 높이는 "유형"에 있습니다

### 입력 영역

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 입력 영역 | 높이 | 52 · 늘어남 | 한 줄에서 시작해 입력이 길어지면 늘어난다 (Behavior) |
| 입력 영역 | 최대 높이 | 5줄 = 14 + 24 × 5 + 14 = 148 | 넘으면 안에서 스크롤 |
| 입력 영역 | 패딩 | 위 · 아래 14, 왼쪽 20, 오른쪽 32 | 오른쪽은 스크롤바 · 펼침 아이콘 자리 |
| 입력 영역 | 글자 | Pretendard Medium 16 / 행간 1.5 | 한 줄 = 24, 입력 영역 한 줄 높이 = 52 |
| 펼침 아이콘 · 스크롤바 | 위치 | 입력 영역 안 위 8 · 오른쪽 8 · 아래 8 | |
| 펼침 아이콘 | 크기 | 16 | 위쪽 |
| 스크롤바 | 폭 | 4, 원형 끝 | 아래쪽 |

### 툴바

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 툴바 | 높이 | 56 | 패딩 10, 버튼 36 → 높이 56 |
| 툴바 | 패딩 | 10 | |
| 툴바 버튼 | 크기 | 36 × 36 (패딩 8 + 아이콘 20), 원형 | + 버튼 · 서브 버튼 · 음성 · 전송 각 36 |

### 도구 칩 영역

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 도구 칩 | 배경 · 모서리 | `{color/container/base/higher}` · 원형 모서리 | |
| 도구 칩 | 패딩 · 간격 | 왼쪽 12 · 오른쪽 10 · 위아래 6, 간격 4 → 높이 32 | |
| 도구 칩 | 내용 | 앞 아이콘 20 + 라벨 Medium 14 + 닫기(X) 20 | |
| 칩 영역 끝 그라디언트 | 폭 | 40 | 음성 버튼 앞 |

### + 메뉴

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 메뉴 | 폭 | 232 (최소 124) | |
| 메뉴 | 최대 높이 | 464 | |
| 메뉴 | 패딩 | 위아래 8, 좌우 16 | |
| 메뉴 | 배경 · 테두리 · 모서리 | #FCFCFC · 테두리 1 #EBEBEB · `{radius/medium}` | |
| 메뉴 | 그림자 | y 1 · blur 8 · 8% | |
| 메뉴 항목 | 패딩 · 아이콘 | 위아래 10, 아이콘 24 · 간격 8 | |
| 메뉴 항목 | 글자 | Medium 16 / 1.5, 한 줄 말줄임 | |
| 메뉴 항목 | 선택 표시 | 체크 아이콘 24 (파랑 #1A5DE5) | |
| "N회 남음" 배지 | 배경 · 글자 · 모서리 | 배경 #EDF2FD, 글자 #1A5DE5, `{radius/small}` | |

### 인포 바

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 인포 바 | 높이 · 배경 · 패딩 | 48 · #F7F7F7 · 14 / 20 | |
| 인포 바 | 모서리 · 테두리 | 위 모서리만 12 · 위 · 좌 · 우 테두리 1 | |
| 인포 바 | 겹침 | 배경이 입력 상자 뒤로 26 더 내려감 | 상자 밑에 끼워진 것처럼 보인다 |
| 인포 바 | 글자 | Medium 14, 넘치면 말줄임 | |
| 인포 바 | 끝 버튼 | 닫기(X, 20) 또는 글자 버튼(밑줄) | |
| 인포 바 | 앞 아이콘 | 꺾인 화살표 20 | 심층 리서치 안내에만 붙인다 |

### 안내 문구

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 안내 문구 | 글자 | 12 · #747474 (`{color/text/base/quaternary}`) · Pretendard Medium 12 | 가운데 정렬, 한 줄. 첫 진입 화면에서도 보인다 |

### 스크림

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 스크림 | 폭 | 채팅 폭 전체 | |
| 스크림 | 높이 | 158 | 4-3 값과 다름 ("미정") |
| 스크림 | 색 | 채팅 배경색에서 위로 투명해짐 | 입력창 뒤 · 위쪽으로 투명 |

### 맨 아래로 이동 버튼

정본은 [4-3. 메시지](4-3-message.md)입니다. 이 문서의 값은 아래와 같습니다.

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 맨 아래로 이동 버튼 | 크기 | 36 × 36, 원형 | |
| 맨 아래로 이동 버튼 | 아이콘 | 20 (아래 화살표) | |

### 드래그 오버레이

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 뒤 화면 | 덮개 | 흰색 60%로 흐리게 덮음 | |
| 안내 | 일러스트 · 글자 | 아이콘 88, 간격 16, 글자 Bold 24 / 1.3 | |

## 간격

| 사이 | 값 | 비고 |
| --- | --- | --- |
| 입력창 영역의 자식 사이 | 12 | `.composer`의 간격 |
| 입력 상자 ↔ 안내 문구 | 12 | 안내 문구가 입력 상자 아래 12 |
| 맨 아래로 이동 버튼 ↔ 입력창 | 12 | 입력창 위 가운데 |
| 음성 ↔ 전송 | 8 | |
| 입력창 ↔ 화면 아래 | 20 | 입력창(안내 문구 포함) 아래. Mobile 예시 화면의 측정값 |

## 유형

### 입력 상자

| 유형 | 값 | 언제 | 차이 |
| --- | --- | --- | --- |
| 한 줄형 (collapsed) | `state=collapsed` · `.composer-box.is-collapsed` | 첫 진입 화면 | 알약 모양(모서리 끝까지 둥글게) 한 줄. 왼쪽 + 버튼 · 가운데 입력 · 오른쪽 음성 · 전송. 패딩 10 → 높이 58 (테두리 포함) |
| 여러 줄형 (expanded) | `state=expanded` | 대화가 시작되거나 입력이 두 줄 이상일 때 | 모서리 12 상자. 위에 입력 영역(52~148), 아래에 툴바(56) |

안내 문구 "AI는 실수를 할 수 있어요. 중요한 정보는 재차 확인하세요."는 두 형태 모두에 보입니다. 입력 영역의 안내 글(placeholder)은 대화 중에는 "Exaone에게 메세지 보내기", 첫 진입 화면에서는 "무엇이든 물어보세요"입니다(피그마 `722-1768` · `723-464`).

Figma 컴포넌트 속성은 아래와 같습니다.

| 유형 | Figma 기본값 | 뜻 |
| --- | --- | --- |
| `state` | `collapsed` | `collapsed`(한 줄형) · `expanded`(여러 줄형) |
| `hasAlert` | 꺼짐 | 인포 바 표시 |
| `hasAttachments` | 꺼짐 | 첨부 영역 표시 |
| `hasDisclaimer` | 켜짐 | 안내 문구 표시 |
| `hasGradientScrim` | 켜짐 | 스크림 표시 |
| `hasScrollBar` | 꺼짐 | 입력 영역 스크롤바 · 펼침 아이콘 표시 |
| `hasScrollBottom` | 꺼짐 | 맨 아래로 이동 버튼 표시 |

### 인포 바

| 유형 | 값 | 차이 |
| --- | --- | --- |
| 회색 모양 | `.info-bar` | 배경 `{color/container/base/high}` · 테두리 `{color/border/base/high}` · 글자 `{color/text/base/secondary}` |
| 빨간 모양 | `.info-bar.is-error` | 배경 #FDF1F1 · 테두리 #F9C8C8 · 글자와 글자 버튼 #DA0707 |

## 상태

### 전송 버튼

언제 어떤 상태가 되는지는 UI-INPUT-18 ~ UI-INPUT-21 · UI-INPUT-55 · UI-INPUT-56을 따릅니다.

| 상태 | 클래스 | 바뀌는 것 |
| --- | --- | --- |
| 활성 | `.composer-send` | 검은 원 + 흰 위쪽 화살표 |
| 비활성 | `.composer-send[disabled]` | 회색 원 + 흐린 화살표 |
| 중지 | `.composer-send.is-stop` | 검은 원 + 네모(■) 아이콘 |

### 입력 영역

| 상태 | 언제 | 바뀌는 것 |
| --- | --- | --- |
| 포커스 | 입력 영역을 누름 | Figma에 별도 포커스 모양이 없음 |
| 입력 중 | 글자를 입력함 | 입력 글자는 `{color/text/base/primary}`, 안내 글(placeholder)은 `{color/text/base/quaternary}` |

### 인포 바

상황별 입력 · 전송 가능 여부와 인포 바 공통 동작은 UI-INPUT-34 ~ UI-INPUT-44를 따릅니다. 문구의 `/`는 줄바꿈(두 줄)입니다.

| 상태 | Figma 상태 | 문구 | 버튼 |
| --- | --- | --- | --- |
| 입력 글자수 초과 | error | "최대 5,000자 까지 입력 가능해요." | - |
| 토큰 모두 소진 | error | "사용량을 모두 소진했습니다. / 내일 오전 HH:MM 이후에 다시 시도해 주세요." | - |
| 토큰 사용량 80% 이상 | error | "사용 한도에 거의 다 도달했어요" | 닫기 |
| 오프라인 | default | "인터넷 연결을 확인 한 후 다시 시도해 주세요" | 재시도 |
| 컨텍스트 초과 | default | "대화가 너무 길어져 답변을 할 수 없어요 / 새대화에서 질문해 주세요" | 새 채팅 |
| 심층 리서치 | deepResearch | "리서치 타이틀…" 리서치 계획에 반영 | 있음 |

## 동작

### 입력 영역

늘어남 · 펼침 동작은 UI-INPUT-01 ~ UI-INPUT-11을 따릅니다(펼침 버튼 3줄 기준은 UI-INPUT-07).

1. 입력이 길어짐 → 입력 영역이 52(한 줄)부터 148(5줄)까지 늘어남

### + 메뉴

메뉴 · 도구 칩 동작은 UI-INPUT-23 ~ UI-INPUT-33을 따릅니다.

1. + 버튼을 누름 → 메뉴가 열리고, 열린 동안 + 버튼에 연한 회색 원 배경(`.composer-btn.is-pressed`)

메뉴 구성(위→아래): 보조 문구 "한 번에 최대 20개 업로드" → 첨부 항목 3개(카메라 · 사진 · 링크 아이콘) → 구분선 → 심층 리서치("N회 남음" 배지, 선택 시 파란 체크) → 구분선 → 도구 3개(웹 검색 · 학술 자료 검색 · 영상 소스)

### 드래그 오버레이

드래그 앤 드롭 동작은 UI-INPUT-45 ~ UI-INPUT-50을 따릅니다.

1. 파일을 끌어 옴 → 뒤 화면을 흰색 60%로 흐리게 덮고, 일러스트 + "첨부할 파일을 여기에 놓으세요." 안내를 보여 줌

## 반응형

| 요소 | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| 입력창 폭 | 화면 폭 − 40 | 패널 폭 − 64 (LNB 제외한 채팅 패널 기준) | 720 고정 |
| 좌우 여백 | 20씩 | 32씩 | 콘텐츠 영역 가운데 · 하단 고정 |

- 스타일 표의 폭은 Mobile 기준(`100% − 40px`, 최대 720px)입니다. Tablet은 `@tablet` 행이 `calc(100% - 64px)`로 바꿉니다

## 참고

### 첨부 영역

이 부분은 Figma에서 제작 중이라 값이 바뀔 수 있습니다. 입력창에 첨부한 문서와 이미지가 업로드되고 전송되기 전까지의 모습입니다. 동작은 UI-INPUT-51 ~ UI-INPUT-60을 따릅니다.

| 부분 | 값 |
| --- | --- |
| 첨부 영역 | 입력 상자 안, 입력 영역 위. 패딩 왼쪽 20 · 위 12, 아이템 간격 6, 가로 스크롤, 오른쪽 끝 그라디언트 40 |
| 아이템 | 124 × 124, 모서리 `{radius/large}`, 테두리 1 `{color/border/base/high}` |
| 문서 타일 | 패딩 12, 간격 8. 위에 형식 태그(예: DOCX — 배경 #EBEBEB, 높이 24, 글자 Medium 14), 아래에 파일 이름 Medium 14 `{color/text/base/secondary}` |
| 이미지 타일 | 이미지를 꽉 채워 자름 |
| 닫기(X) | 오른쪽 위, 24 |

| 상태 | 표시 | 설명 |
| --- | --- | --- |
| 완료 | 썸네일 · 파일 정보 | 이미지는 썸네일, 문서는 유형 · 파일명 · 날짜 |
| 업로드 중 | 흐림 + 로딩 | 흰색 80% + 흐림 2 위에 로딩 원(56) |
| 업로드 실패 | 오류 표시 + "다시하기" | 배경 `{color/container/base/high}`, 파일 이름 Bold 16 `{color/text/base/tertiary}`, 새로고침 아이콘 16 + "다시하기" |
| 파일 오류 | 빨간 오류 표시 | 배경 #FDF1F1 · 테두리 #F9C8C8, 파일 이름 Bold 16 #DA0707, 경고 아이콘 16 + "파일 오류". 지원하지 않는 형식 · 용량 초과 등 |

## 규칙

동작 규칙은 [2-2. UI 규칙](../2-rules/2-2-ui.md#입력창-ui-input)을 따릅니다.

| 범위 | 규칙 ID |
| --- | --- |
| 입력 영역 늘어남 · 펼침 | UI-INPUT-01 ~ UI-INPUT-11 |
| 배치 | UI-INPUT-12 ~ UI-INPUT-15 |
| 안내 문구 · 스크림 | UI-INPUT-16 ~ UI-INPUT-17 |
| 전송 버튼 | UI-INPUT-18 ~ UI-INPUT-21 |
| 포커스 | UI-INPUT-22 |
| + 메뉴 · 도구 칩 | UI-INPUT-23 ~ UI-INPUT-33 |
| 인포 바 | UI-INPUT-34 ~ UI-INPUT-44 |
| 드래그 오버레이 | UI-INPUT-45 ~ UI-INPUT-50 |
| 첨부 영역 | UI-INPUT-51 ~ UI-INPUT-60 |

## 스타일

> 표 읽는 법은 [4-1. 디자인 토큰](4-1-tokens.md)의 "스타일 표 읽는 법"을 보세요.

입력창은 `.markdown` 바깥에 있으므로 모든 셀렉터를 `.chat`으로 시작합니다. 상태는 `.is-…` 클래스로, 비활성은 `[disabled]`로 씁니다.

| 셀렉터 | 속성 | 값 | Figma 토큰 |
| --- | --- | --- | --- |
| `.chat .composer` | `position` | `sticky` | 하단 고정 |
| `.chat .composer` | `bottom` | `0` | |
| `.chat .composer` | `z-index` | `10` | |
| `.chat .composer` | `isolation` | `isolate` | 스크림을 입력창 뒤에 두기 위함 |
| `.chat .composer` | `display` | `flex` | |
| `.chat .composer` | `flex-direction` | `column` | |
| `.chat .composer` | `align-items` | `center` | |
| `.chat .composer` | `gap` | `12px` | spacing/gap/12 |
| `.chat .composer` | `box-sizing` | `border-box` | |
| `.chat .composer` | `width` | `100%` | 영역은 채팅 폭 전체 (스크림이 화면 끝까지 깔리도록) |
| `.chat .composer` | `margin` | `0` | |
| `.chat .composer` | `padding` | `0 20px 20px` | Mobile 좌우 20 (화면 − 40) · 아래 20 측정값 |
| `@tablet .chat .composer` | `padding` | `0 32px 20px` | Tablet 좌우 32 (패널 − 64) |
| `@desktop .chat .composer` | `padding` | `0 32px 20px` | Desktop 최소 마진 32 |
| `.chat .composer-box, .chat .info-bar` | `max-width` | `720px` | 입력 상자 · 인포 바는 콘텐츠 폭(Desktop 720)에 맞춤 |
| `.chat .composer-scrim` | `position` | `absolute` | |
| `.chat .composer-scrim` | `left` | `0` | 채팅 폭 전체 |
| `.chat .composer-scrim` | `right` | `0` | |
| `.chat .composer-scrim` | `bottom` | `0` | |
| `.chat .composer-scrim` | `height` | `158px` | |
| `.chat .composer-scrim` | `z-index` | `-1` | |
| `.chat .composer-scrim` | `pointer-events` | `none` | |
| `.chat .composer-scrim` | `background` | `linear-gradient(to top, {color/frame/base/high} 40%, transparent)` | 채팅 배경과 같은 색 — 경계가 보이지 않음 (Figma #FCFCFC 하드코딩) |
| `.chat .composer-scrim` | `opacity` | `1` | Figma 레이어 투명도 변수 alpha/16 — 설명("가린다")과 Message 예시(85%)에 맞춰 불투명 |
| `.chat .scroll-bottom` | `display` | `inline-flex` | |
| `.chat .scroll-bottom` | `align-items` | `center` | |
| `.chat .scroll-bottom` | `justify-content` | `center` | |
| `.chat .scroll-bottom` | `width` | `36px` | |
| `.chat .scroll-bottom` | `height` | `36px` | |
| `.chat .scroll-bottom` | `padding` | `8px` | |
| `.chat .scroll-bottom` | `box-sizing` | `border-box` | |
| `.chat .scroll-bottom` | `background` | `#FCFCFC` | color/container/base/low — 토큰 없음 |
| `.chat .scroll-bottom` | `border-width` | `1px` | |
| `.chat .scroll-bottom` | `border-style` | `solid` | |
| `.chat .scroll-bottom` | `border-color` | `#EBEBEB` | color/border/base/low — 토큰 없음 |
| `.chat .scroll-bottom` | `border-radius` | `{radius/full}` | radius/full |
| `.chat .scroll-bottom` | `box-shadow` | `0 1px 8px #1A1A1A14` | shadow-level1 — 토큰 없음 |
| `.chat .scroll-bottom` | `color` | `{color/icon/base/primary}` | |
| `.chat .scroll-bottom` | `cursor` | `pointer` | |
| `.chat .scroll-bottom[hidden]` | `display` | `none` | 맨 아래를 보고 있을 때 숨김 |
| `.chat .info-bar` | `display` | `flex` | |
| `.chat .info-bar` | `align-items` | `center` | |
| `.chat .info-bar` | `gap` | `8px` | |
| `.chat .info-bar` | `width` | `100%` | |
| `.chat .info-bar` | `box-sizing` | `border-box` | |
| `.chat .info-bar` | `min-height` | `48px` | |
| `.chat .info-bar` | `padding` | `14px 20px 40px` | spacing/component/y/scale-05 · x/scale-08, 아래 14 + 상자 뒤로 26 |
| `.chat .info-bar` | `margin-bottom` | `-38px` | 상자 뒤 26 + 간격 12 상쇄 |
| `.chat .info-bar` | `background` | `{color/container/base/high}` | color/container/base/high-level1 |
| `.chat .info-bar` | `border-width` | `1px 1px 0` | |
| `.chat .info-bar` | `border-style` | `solid` | |
| `.chat .info-bar` | `border-color` | `{color/border/base/high}` | |
| `.chat .info-bar` | `border-top-left-radius` | `{radius/large}` | radius/large |
| `.chat .info-bar` | `border-top-right-radius` | `{radius/large}` | radius/large |
| `.chat .info-bar` | `font-family` | `{fontFamily/pretendard}` | |
| `.chat .info-bar` | `font-size` | `14px` | size/scale-02 |
| `.chat .info-bar` | `font-weight` | `500` | |
| `.chat .info-bar` | `line-height` | `normal` | |
| `.chat .info-bar` | `color` | `{color/text/base/secondary}` | |
| `.chat .info-bar[hidden]` | `display` | `none` | |
| `.chat .info-bar.is-error` | `background` | `#FDF1F1` | color/status/container/negative — 토큰 없음 |
| `.chat .info-bar.is-error` | `border-color` | `#F9C8C8` | color/status/border/negative-low — 토큰 없음 |
| `.chat .info-bar.is-error` | `color` | `#DA0707` | color/status/text/negative — 토큰 없음 |
| `.chat .composer-box` | `position` | `relative` | |
| `.chat .composer-box` | `z-index` | `1` | 인포 바 위에 겹침 |
| `.chat .composer-box` | `display` | `flex` | |
| `.chat .composer-box` | `flex-direction` | `column` | |
| `.chat .composer-box` | `width` | `100%` | |
| `.chat .composer-box` | `box-sizing` | `border-box` | |
| `.chat .composer-box` | `background` | `{color/background/base/low-level1}` | |
| `.chat .composer-box` | `border-width` | `1px` | |
| `.chat .composer-box` | `border-style` | `solid` | |
| `.chat .composer-box` | `border-color` | `{color/border/base/high}` | |
| `.chat .composer-box` | `border-radius` | `{radius/large}` | radius/large |
| `.chat .composer-box` | `box-shadow` | `{shadow-level2}` | shadow-level2 |
| `.chat .composer-box.is-collapsed` | `flex-direction` | `row` | |
| `.chat .composer-box.is-collapsed` | `align-items` | `center` | |
| `.chat .composer-box.is-collapsed` | `padding` | `10px` | spacing/component/y/scale-03 |
| `.chat .composer-box.is-collapsed` | `border-radius` | `{radius/full}` | radius/full |
| `.chat .composer-box.is-collapsed .composer-tools` | `display` | `contents` | 툴바 버튼을 한 줄에 펼침 |
| `.chat .composer-box.is-collapsed .composer-tools > *` | `order` | `2` | 음성 · 전송을 오른쪽에 |
| `.chat .composer-box.is-collapsed .composer-tools > :first-child` | `order` | `0` | + 버튼을 왼쪽에 |
| `.chat .composer-box.is-collapsed .composer-input` | `order` | `1` | |
| `.chat .composer-box.is-collapsed .composer-input` | `flex` | `1` | |
| `.chat .composer-box.is-collapsed .composer-input` | `padding` | `0` | |
| `.chat .composer-box.is-collapsed .composer-input` | `min-height` | `24px` | 한 줄 |
| `.chat .composer-box.is-collapsed .composer-input` | `max-height` | `24px` | 한 줄형은 늘어나지 않음 |
| `.chat .composer-input` | `display` | `block` | |
| `.chat .composer-input` | `width` | `100%` | |
| `.chat .composer-input` | `box-sizing` | `border-box` | |
| `.chat .composer-input` | `min-height` | `52px` | 한 줄 = 14 + 24 + 14 |
| `.chat .composer-input` | `max-height` | `148px` | 5줄 = 14 + 24 × 5 + 14 |
| `.chat .composer-input` | `field-sizing` | `content` | 입력에 따라 높이가 늘어남 (미지원 브라우저는 스크립트로 높이 조정) |
| `.chat .composer-input` | `overflow-y` | `auto` | 5줄 넘으면 안에서 스크롤 |
| `.chat .composer-input` | `padding` | `14px 32px 14px 20px` | y/scale-05 · 오른쪽 scale-11 · 왼쪽 scale-08 |
| `.chat .composer-input` | `margin` | `0` | |
| `.chat .composer-input` | `border` | `0` | |
| `.chat .composer-input` | `outline` | `none` | 포커스 모양 없음 |
| `.chat .composer-input` | `resize` | `none` | |
| `.chat .composer-input` | `background` | `transparent` | |
| `.chat .composer-input` | `font-family` | `{fontFamily/pretendard}` | font-M/body/medium |
| `.chat .composer-input` | `font-size` | `16px` | size/scale-03 |
| `.chat .composer-input` | `font-weight` | `500` | |
| `.chat .composer-input` | `line-height` | `1.5` | |
| `.chat .composer-input` | `color` | `{color/text/base/primary}` | 입력 글자 |
| `.chat .composer-input` | `scrollbar-width` | `thin` | |
| `.chat .composer-input` | `scrollbar-color` | `#BDBDBD transparent` | color/icon/base/quaternary — 토큰 없음 |
| `.chat .composer-input::placeholder` | `color` | `{color/text/base/quaternary}` | |
| `.chat .composer-tools` | `display` | `flex` | |
| `.chat .composer-tools` | `align-items` | `center` | |
| `.chat .composer-tools` | `min-height` | `56px` | 10 + 36 + 10 |
| `.chat .composer-tools` | `box-sizing` | `border-box` | |
| `.chat .composer-tools` | `padding` | `10px` | spacing/component/y/scale-03 |
| `.chat .composer-tools > .composer-btn:first-child` | `margin-right` | `auto` | + 버튼 왼쪽, 나머지 오른쪽 |
| `.chat .composer-btn` | `display` | `inline-flex` | |
| `.chat .composer-btn` | `align-items` | `center` | |
| `.chat .composer-btn` | `justify-content` | `center` | |
| `.chat .composer-btn` | `flex-shrink` | `0` | |
| `.chat .composer-btn` | `width` | `36px` | |
| `.chat .composer-btn` | `height` | `36px` | |
| `.chat .composer-btn` | `padding` | `8px` | 아이콘 20 |
| `.chat .composer-btn` | `box-sizing` | `border-box` | |
| `.chat .composer-btn` | `border` | `0` | |
| `.chat .composer-btn` | `border-radius` | `{radius/full}` | radius/full |
| `.chat .composer-btn` | `background` | `transparent` | |
| `.chat .composer-btn` | `color` | `{color/icon/base/secondary}` | 음성 아이콘 기준 |
| `.chat .composer-btn` | `cursor` | `pointer` | |
| `.chat .composer-btn.is-pressed` | `background` | `{alpha/black-8}` | color/state/stateLayer/pressed-inverseBlack (같은 값) |
| `.chat .composer-send` | `margin-left` | `8px` | 음성 ↔ 전송 spacing/gap/8 |
| `.chat .composer-send` | `background` | `{color/container/brand/secondary}` | |
| `.chat .composer-send` | `color` | `{color/icon/base/white}` | |
| `.chat .composer-send[disabled]` | `background` | `#EBEBEB` | color/status/container/disabled — 토큰 없음 |
| `.chat .composer-send[disabled]` | `color` | `#1A1A1A29` | color/status/icon/disabled-inverseBlack — 토큰 없음 |
| `.chat .composer-send[disabled]` | `cursor` | `default` | |
| `.chat .composer-send.is-stop` | `background` | `{color/container/brand/secondary}` | 아이콘만 ■로 바뀜 |
| `.chat .composer-note` | `margin` | `0` | |
| `.chat .composer-note` | `font-family` | `{fontFamily/pretendard}` | font-M/label/small |
| `.chat .composer-note` | `font-size` | `12px` | size/scale-01 |
| `.chat .composer-note` | `font-weight` | `500` | |
| `.chat .composer-note` | `line-height` | `normal` | |
| `.chat .composer-note` | `color` | `{color/text/base/quaternary}` | |
| `.chat .composer-note` | `text-align` | `center` | |
| `.chat .composer-note` | `white-space` | `nowrap` | |

## 미정

- 스크림 높이: 이 문서는 158(스타일 표 `158px`), 4-3은 140
- 맨 아래로 이동 버튼 배경: 이 문서 스타일 표는 `#FCFCFC`(토큰 없음), 4-1 · 4-3은 `alpha/white-80`. 4-3의 배경 흐림 2px는 이 문서 스타일 표에 없음
- 첨부 영역은 Figma에서 제작 중이라 값이 바뀔 수 있고, 클래스와 스타일 표가 없음
- 메뉴 항목 레이블이 Figma에 아직 "레이블"로만 들어 있어 아이콘으로 항목을 추정함
- 인포 바 상황 표의 상태 칸과 실제 색이 서로 어긋남
