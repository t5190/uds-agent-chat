---
id: IDX-SYMBOL
type: index
title: 심볼 리소스 색인
status: stable
version: 1.1.0
summary: AI Agent 심볼 모션 문서의 목록과, 상황에 맞는 모션을 고르는 기준입니다.
audience: ui
---

# 심볼 리소스 색인

AI Agent 심볼 모션 전체의 진입 문서입니다. 지금 상황에 맞는 모션을 고르고 해당 문서로 이동하는 데 필요한 정보만 담습니다. 세부 값(시간 · 색 · 이징)은 각 모션 문서에만 둡니다. 값이 다르면 모션 문서가 우선합니다. 화면 구조와 재생 순서는 [4-9. AI 심볼 · 모션](../4-9-symbol.md)에 있습니다.

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [Signature](signature.md) | ui | 시그니처. 최초 진입에서 1회 재생 |
| [Thinking](thinking.md) | ui | 생각 중, 생각 끝 전환, 빠른 응답 |
| [Working](working.md) | ui | 작업 중, 작업 완료 전환, 완료 문구 · `>` |
| [Text Shimmer](text-shimmer.md) | ui | 문구에 입히는 빛 효과와 문구 교체 · 퇴장 값 |
| [적용 코드](code.md) | ui | 파일 형식, 용량, 캔버스, 코드 예제 |

## 모션 3분류

먼저 분류를 정하면 어느 문서를 볼지 정해집니다.

| 분류 | 의미 | 해당 모션 | 동시 재생 |
| --- | --- | --- | --- |
| 상태 | 심볼 자리에서 재생되는 메인 모션. 지금 AI가 무엇을 하는지 보여 줌 | Signature · Thinking · Working | 한 자리에 1개만 |
| 레이어 | 상태 위에 덧붙는 효과. 혼자 쓰지 않음 | Text Shimmer | 상태와 함께 |
| 전환 | 상태와 상태 사이를 잇는 1회 재생 | 생각 끝 · 사라짐 · 작업 완료 | 앞뒤 상태 사이 |

## 어떤 모션을 쓸까

위에서부터 순서대로 확인하고 처음 "예"가 나오는 곳으로 갑니다.

```
Q1. AI를 처음 만나는 순간인가? (세션 첫 메인 진입 · 온보딩)
    └ 예 → Signature ............ signature.md
Q2. 요청을 보냈고 아직 첫 응답 전인가?
    └ 예 → Thinking ............. thinking.md
Q3. 첫 응답이 와서 생각 중에서 넘어가는 순간인가?
    └ 예 → 생각 끝 (전환) ....... thinking.md
Q4. 응답 · 작업(도구 호출 · 리서치 포함)이 진행 중인가?
    └ 예 → Working .............. working.md
Q5. 생각 중에 바로 답이 나왔는가? (간단한 질문)
    └ 예 → 즉시 사라짐, 페이드 없음 (전환) ... thinking.md
Q6. 작업이 끝났는가?
    └ 예 → 작업 완료: 완료 문구 + `>` ......... working.md
그 외 (입력 대기 · 정지) → 정지 심볼, 모션 없음

+ Q2 ~ Q6에서 심볼 옆에 상태 문구가 있는가?
    └ 예 → Text Shimmer 레이어 추가 ... text-shimmer.md
```

## 상태 흐름

```
[진입] ─▶ Signature ─(재생 완료)─▶ Idle (정지 심볼)

[요청] ─▶ Thinking ─(첫 응답 · 돌던 한 바퀴 마저)─▶ 생각 끝 ─▶ Working ─(finish)─▶ 작업 완료 (완료 문구 + >)
              └──(finish · 간단한 질문, 즉시)──▶ 사라짐 ─▶ 비움
```

생각 끝 구간에서 심볼은 자연스럽게 바뀌고 문구는 사라지지 않고 교체됩니다. Signature를 Thinking · Working으로 같은 자리에서 이어 재생하지 않습니다. 대화 작업 상태 줄에서 새로 시작합니다.

| API | 시작되는 것 |
| --- | --- |
| `playSignature()` | Signature |
| `think(문구?)` | Thinking |
| `work(문구?)` | 생각 끝 → Working |
| `setStep(문구)` | Working 안에서 문구 교체 |
| `finish(onDone?)` | 생각 중: 사라짐 / 작업 중: 작업 완료 |

## 모션 카탈로그

| 모션 | 분류 | 언제 | 재생 | 리소스 | 문서 |
| --- | --- | --- | --- | --- | --- |
| Signature | 상태 | 세션 첫 메인 진입 · 온보딩 | 1회 · 마지막 프레임 정지 | `agent_signature` | [Signature](signature.md) |
| Thinking | 상태 | 요청 전송 후 첫 응답 전 | 반복 | `agent_thinking_loop` | [Thinking](thinking.md) |
| 생각 끝 | 전환 | 첫 응답 도착 | 1회 | `agent_thinking_end` | [Thinking](thinking.md) |
| Working | 상태 | 응답 · 작업 중 | 반복 | `agent_working` | [Working](working.md) |
| 사라짐 | 전환 | 생각 중 `finish()` (간단한 질문) | 즉시 (페이드 없음) | 없음 (앱에서 바로 지움) | [Thinking](thinking.md) |
| 작업 완료 | 전환 | 작업 중 `finish()` | 240ms 그룹 페이드 + 완료 문구 이동, 완료 문구 유지 | 없음 (앱에서 처리) | [Working](working.md) |
| Text Shimmer | 레이어 | Thinking · 생각 끝 · Working + 문구 | 상태 주기에 맞춰 반복 | 없음 (코드 구현) | [Text Shimmer](text-shimmer.md) |

## 조합

| 상태 | Text Shimmer | 인사말 | 끝날 때 | 쓰는 크기 |
| --- | --- | --- | --- | --- |
| Signature | 금지 | 사용 | 없음 | 시그니처 크기만 |
| Thinking | 사용 | 없음 | 페이드 없이 즉시 지움 | 대화 작업 상태 줄 |
| Working | 사용 | 없음 | 완료 문구 + `>` | 대화 작업 상태 줄 |

## 공통 규칙

모든 모션이 지킵니다. 규칙 정본은 [2-2. UI 규칙](../../2-rules/2-2-ui.md#심볼-ui-sym)입니다.

- 한 자리에서 상태 모션은 동시에 1개만 재생(UI-SYM-06)
- 모든 모션은 같은 캔버스(600 × 600) · 같은 중심 · 같은 배율이라 바꿔 끼워도 튀지 않음(UI-SYM-06)
- 애니메이션 뷰는 심볼 크기 × 1.69, 심볼 자리 중앙에 맞추고 clip을 해제(UI-SYM-10)
- 재생 속도 배율은 1.0. 속도 · 길이 · 색을 바꾸지 않음(UI-SYM-11)
- 움직임 줄이기가 켜지면 정지 심볼 · 정적 텍스트(UI-SYM-08)
- 심볼과 시머는 스크린리더에서 장식으로 처리하고 문구만 읽음(UI-SYM-25)
- 모션 재생 중에도 입력 · 스크롤을 막지 않음(UI-SYM-26)
- 프레임레이트 33.33fps(프레임당 30ms), 회전은 모두 시계 방향
