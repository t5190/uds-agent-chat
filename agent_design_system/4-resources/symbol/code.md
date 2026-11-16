---
id: SYM-GUIDE-12
type: spec
title: 심볼 모션 적용 코드
status: draft
version: 0.2.0
summary: 심볼 원본과 모션 4종의 파일 형식, 용량, 캔버스, 프레임레이트, 적용 코드 예제를 정합니다.
stage: 4
audience: ui
---

# 심볼 모션 적용 코드

AI 심볼 · 모션 리소스의 파일, 형식, 용량, 코드 예제를 모았습니다. 화면에서 쓰는 구조와 규칙은 [4-9. AI 심볼 · 모션](../4-9-symbol.md)에 있습니다.

- 상태: 초안. 이 프로젝트에는 Lottie JSON · SVG · PNG만 포함. 다른 형식은 디자인 팀 원본에만 있음
- 구현: 웹(lottie-web)과 Android(Java) 예제 코드 제공

## 구조

| 요소 | 클래스 | 역할 |
| --- | --- | --- |
| 원본 심볼 | 없음 | 마젠타 · 블랙 · 화이트 심볼(SVG · PNG) |
| 모션 4종 | `data-motion` | 시그니처 · 생각 중 · 생각 끝 · 작업 중 Lottie |

| 모션 | 길이 · 프레임 | 용도 · 재생 |
| --- | --- | --- |
| 시그니처 `agent_signature` | 2.01초 · 67프레임 | 최초 진입 · 온보딩 빈 화면에서 시작해 1회 재생, 마지막 심볼에서 정지 |
| 생각 중 `agent_thinking_loop` | 1.08초 · 36프레임 | 생각하는 동안 반복. 원 세 개가 한 바퀴 돌고 살짝 멈춤 |
| 생각 끝 `agent_thinking_end` | 1.14초 · 38프레임 | 생각이 끝날 때 1회. 원 세 개가 원으로 합쳐지며 작업 중으로 연결 |
| 작업 중 `agent_working` | 3.84초 · 128프레임 | 작업 · 응답하는 동안 반복. 원 → 원 세 개 → 심볼 → 원, 시계 방향 회전 |

재생 순서는 생각 중 → 생각 끝 → 작업 중입니다. 텍스트 시머와 작업 완료는 리소스 없이 코드로 구현합니다([Text Shimmer](text-shimmer.md)).

## 크기

| 요소 | 속성 | 값 | 비고 |
| --- | --- | --- | --- |
| 캔버스 | 크기 | 600 × 600 | 모든 모션이 같은 중심 · 같은 배율이라 한 자리에서 바꿔 끼워도 튀지 않음 |
| 심볼 영역 | 크기 | 355 × 353 | 캔버스 = 심볼의 1.69배 |
| 애니메이션 뷰 | 계산 | 심볼 크기 × 1.69 | 심볼 자리 중앙에 맞추고 clip을 해제. 예: 심볼 44pt는 뷰 약 74 × 74pt |
| 프레임레이트 | 값 | 33.33fps | 프레임당 30ms |

회전은 모두 시계 방향입니다. 뷰가 100을 넘으면 600px 리소스(PNG 시퀀스 · WebM · HEVC)로 바꿔야 합니다.

## 에셋

| 파일 | 형식 | 경로 |
| --- | --- | --- |
| 모션 4종 | Lottie JSON | [assets/symbol/resources/motion/](../../assets/symbol/resources/motion/) `{모션 이름}/lottie/{모션 이름}.json` |
| 원본 심볼 | SVG · PNG | [assets/symbol/resources/source/](../../assets/symbol/resources/source/) |
| 적용 예제 코드 | JS · Java | [assets/symbol/code/](../../assets/symbol/code/) |

디자인 팀 원본은 아래 형식을 더 제공합니다. 이 프로젝트에는 포함하지 않습니다.

| 형식 | 파일 | 크기 | 쓰는 곳 |
| --- | --- | --- | --- |
| Lottie | `lottie/{이름}.json` | 300 × 300 이미지 시퀀스 내장 | Web(lottie-web), Android(lottie-android), iOS(lottie-ios), React Native |
| PNG 시퀀스 | `png_sequence/{이름}_000.png..` | 600 × 600 · 투명 | 원본 프레임 |
| WebP 애니메이션 | `webp/{이름}.webp` | 300 × 300 · 투명 | Web `<img>`, Android(Coil · Glide) |
| WebM(VP9 + 알파) | `webm/{이름}.webm` | 600 × 600 · 투명 | Web `<video>`(Chrome · Edge · Firefox) |
| HEVC + 알파 | `ios_hevc/{이름}.mov` | 600 × 600 · 투명 | iOS · macOS `AVPlayer`, Safari `<video>` |
| GIF · MP4 | `gif_mp4/{이름}.gif · .mp4` | 600 × 600 GIF 투명 · MP4 흰 배경 | 문서 · 리뷰 · 공유용 |

| 형식 \ 모션 | 시그니처 | 생각 중 | 생각 끝 | 작업 중 |
| --- | --- | --- | --- | --- |
| Lottie JSON | 2.0MB | 1.0MB | 956KB | 4.0MB |
| PNG 시퀀스 | 67장 · 4.5MB | 36장 · 2.4MB | 38장 · 2.1MB | 128장 · 7.9MB |
| WebP | 508KB | 308KB | 220KB | 780KB |
| WebM | 352KB | 288KB | 208KB | 660KB |
| HEVC(.mov) | 668KB | 504KB | 364KB | 1.2MB |
| GIF | 1.7MB | 740KB | 744KB | 2.9MB |
| MP4 | 136KB | 100KB | 84KB | 212KB |
| 재생 | 1회 · 정지 | 반복 | 1회 | 반복 |

## 참고

```js
// Web (lottie-web)
const agent = AgentMotion.state(slotEl, "./");
agent.think();   // 요청을 보냈을 때
agent.work();    // 첫 응답이 올 때 → 바퀴를 마저 돌고 → 원으로 합쳐짐 → 작업 중 반복
```

```java
// Android (Java)
agentMotionView.playSignature();
agentMotionView.think();
agentMotionView.work();
```

디자인 팀 원본 `code_examples.zip`에는 Python(`agent_motion.py`)과 사양 파일(`motion_spec.json`)도 있습니다.
