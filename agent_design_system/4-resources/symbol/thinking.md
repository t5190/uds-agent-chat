---
id: SYM-GUIDE-09
type: spec
title: Thinking
status: draft
version: 0.2.0
summary: 요청을 보낸 뒤 첫 응답 전까지의 생각 중 모션과, 생각 끝 전환, 빠른 응답의 즉시 지움을 정합니다.
stage: 4
audience: ui
---

# Thinking

요청을 보낸 뒤 첫 응답이 오기 전까지 "생각하고 있다"를 보여 주는 상태 모션입니다. 첫 응답이 오면 생각 끝 전환으로 [Working](working.md)에 넘깁니다. 화면 구조와 표시 크기는 [4-9. AI 심볼 · 모션](../4-9-symbol.md)에 있습니다.

- 상태: 초안. 상태 문구와 표시 크기는 임시
- 규칙: [2-2 심볼](../../2-rules/2-2-ui.md#심볼-ui-sym) UI-SYM-03 ~ 06, UI-SYM-19 ~ 21, UI-SYM-23

## 구조

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 작업 상태 심볼 | `.symbol.is-status` | `agent_thinking_loop` → `agent_thinking_end` 슬롯 |
| 작업 상태 텍스트 | `.status-label` | 고정 문구 1종(서비스가 전달). 텍스트 시머가 붙음([Text Shimmer](text-shimmer.md)) |

## 배치

| 요소 | 기준 | 위치 · 정렬 |
| --- | --- | --- |
| 작업 상태 줄 | 응답 영역 | 맨 위 |
| 작업 상태 심볼 | 작업 상태 줄 | 텍스트 왼쪽 |

- 쓰는 곳: 대화 중 작업 상태 줄(요청 전송 ~ 첫 응답)
- 쓰지 않는 곳: 최초 진입 · 온보딩(→ [Signature](signature.md)), 응답 · 작업 진행 중(→ [Working](working.md))

## 크기

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 작업 상태 심볼 | 표시 크기 | 심볼 18 × 18 | 뷰 약 30 × 30. [4-9](../4-9-symbol.md)의 크기를 따름 |

## 상태

| 상태 | 언제 | 바뀌는 것 |
| --- | --- | --- |
| 생각 중 | `think()` · 요청을 보낸 직후 | `agent_thinking_loop`(1.08초 · 36프레임)을 0프레임부터 반복. 원 세 개가 시계 방향으로 한 바퀴 돌고 살짝 멈춤 |
| 생각 끝 | `work()` · 첫 응답 도착 | 돌던 한 바퀴를 마저 돈 뒤 `agent_thinking_end`(1.14초 · 38프레임)를 1회 재생. 원 세 개가 하나의 원으로 합쳐지며 작업 중 첫 프레임으로 이어짐 |
| 사라짐 | 생각 중에 `finish()` · 간단한 질문 | 페이드 없이 즉시 심볼과 문구를 함께 지움(0ms). 모션이 중간에 잘려도 됨. 완료 문구 · `>` 없음 |
| 생각 끝 중 종료 | 생각 끝 재생 중 `finish()` | 전환을 마친 뒤 작업 완료로 처리(임시, [Working](working.md)) |

## 동작

1. `think()` → 생각 중을 0프레임부터 반복. 어느 상태에서든 처음부터 시작하고, 사라지는 중이면 취소
2. 첫 응답 도착(`work()`) → 돌던 한 바퀴를 마저 돈 뒤 생각 끝을 1회 재생. 중간에 끊지 않음
3. 생각 끝 재생이 끝남 → [Working](working.md)의 `agent_working`을 0프레임으로 이어 재생. 문구는 교체된 채 유지
4. 생각 끝 구간 안에서 문구가 작업 중 첫 문구로 교체됨. 생각 중에서 작업 중으로 넘어갈 때 심볼과 문구를 사라지게 하지 않음([Text Shimmer](text-shimmer.md))
5. 간단한 질문이라 생각 중에 `finish()` → 돌던 한 바퀴를 기다리지 않고 즉시 지움
6. 생각 끝은 생각 중에서만 시작. 다른 상태에서 `agent_thinking_end`를 재생하지 않음
7. 잘못된 순서의 호출(생각 중이 아닐 때 `work()` 등)은 오류 없이 무시
8. 같은 화면에서 Signature와 동시에 재생하지 않음. Signature → Thinking을 같은 자리에서 이어 재생하지 않음
9. 움직임 줄이기가 켜지면 정지 프레임으로 보이고 생각 끝 전환은 건너뜀. 상태 시작 시점에 문구를 읽음

## 에셋

| 파일 | 형식 | 경로 |
| --- | --- | --- |
| `agent_thinking_loop` | Lottie JSON | [assets/symbol/resources/motion/agent_thinking_loop/lottie/](../../assets/symbol/resources/motion/agent_thinking_loop/lottie/agent_thinking_loop.json) |
| `agent_thinking_end` | Lottie JSON | [assets/symbol/resources/motion/agent_thinking_end/lottie/](../../assets/symbol/resources/motion/agent_thinking_end/lottie/agent_thinking_end.json) |

플랫폼별 구현: 웹은 lottie-web(`agent.think()` → `agent.work()`), Android는 lottie-android(`agentMotionView.think()` → `work()`), iOS는 lottie-ios(미정). 형식 · 용량 · 코드 예제는 [적용 코드](code.md)에 있습니다.

## 규칙

| 범위 | 규칙 ID |
| --- | --- |
| 생각 중 → 생각 끝 → 작업 중 | UI-SYM-03 ~ UI-SYM-06, UI-SYM-20 |
| 문구 교체 | UI-SYM-19 |
| 빠른 응답 · 호출 순서 | UI-SYM-21, UI-SYM-23 |
| 접근성 | UI-SYM-08, UI-SYM-25 |

## 미정

- 상태 문구. "생각하는 중"은 임시 문구이고 길어질 때 바꿀 문구도 정해지지 않음
- 생각 끝 재생 중에 `finish()`가 올 때의 처리. 지금은 전환을 마친 뒤 종료함
- 빠른 응답(UI-SYM-23)의 기준 시간. 어느 정도까지를 "바로 준비됨"으로 볼지 정해지지 않음
- iOS 구현
