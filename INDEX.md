---
id: IDX-ROOT
type: index
title: 문서 색인
status: stable
version: 2.0.0
summary: 프로젝트 전체 문서 목록입니다. 스펙 문서는 스펙 색인으로 이어집니다.
---

# 문서 색인

프로젝트의 모든 문서를 찾는 곳입니다. 스펙 1~5단계 문서 목록은 중복을 피하려고 [스펙 색인](agent_design_system/index.md)에만 둡니다.

## 진입과 조망

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [README.md](README.md) | 사람 | 프로젝트 구조, 담당, 쓰는 법 |
| [AGENTS.md](AGENTS.md) | AI | 읽는 순서, 작업별 정본 |
| [GLOSSARY.md](GLOSSARY.md) | 모두 | 쓰는 말과 쓰지 않는 말 |
| [CHANGELOG.md](CHANGELOG.md) | 모두 | 변경 이력 |
| [docs/open-issues.md](docs/open-issues.md) | 모두 | 각 문서의 미정 항목 모음(자동 생성) |

## 스펙

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [스펙 색인](agent_design_system/index.md) | 모두 | 1~5단계 문서 목록과 읽는 법 |
| [심볼 리소스 색인](agent_design_system/4-resources/symbol/index.md) | ui | 심볼 모션 문서와 적용 코드 목록 |

## 표준

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [AI Readable 문서 표준 (core)](standard/core/doc-standard.md) | 모두 | 전사 공통 규칙 |
| [공통 점검 항목](standard/core/checklist.md) | 모두 | core 점검표 |
| [core 양식 안내](standard/core/templates/index.md) | 모두 | 일반 문서 · 규칙 문서 양식 |
| [chat-ui 프로필](standard/profile/chat-ui-profile.md) | 모두 | 이 프로젝트의 문서 틀, 파서 계약, 시안 규칙 |
| [chat-ui 전용 점검 항목](standard/profile/checklist.md) | 모두 | 프로필 점검표 |
| [프로필 양식 안내](standard/profile/templates/index.md) | 모두 | 컴포넌트 · 리소스 · 대화 파일 양식 |

## 시나리오

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [CV-01 영화 예매](conversations/movie.md) | 모두 | 표 비교, 결과 카드, 후속 답변 |
| [CV-02 플레이리스트](conversations/playlist.md) | 모두 | 결과 카드가 있는 복합형 |
| [CV-03 맛집 리스트](conversations/restaurant.md) | 모두 | 정보 비교형 |
| [CV-04 주말 근교 여행](conversations/weekend-trip.md) | 모두 | 심볼 전환이 있는 여러 턴 대화 |
| [CV-05 첫 집 구하기 리서치](conversations/home-research.md) | 모두 | 출처 · 검색 단계 · 첨부 · 표 · 코드 · 결과 파일이 모두 나오는 긴 대화 |

화면에서 여는 법: `chat.html?src=conversations/movie.md`

## 시안

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| [samples/example.html](samples/example.html) | ui | 시안 기준 사례. 같은 상황의 케이스: EX-13 |
| [samples/meeting-minutes.html](samples/meeting-minutes.html) | ui | 회의록 화면 시안 |
| [samples/ipad-purchase.html](samples/ipad-purchase.html) | ui | 아이패드 구매 대화 시안. 심볼 모션 전체 흐름 포함 |
| [samples/product-launch.html](samples/product-launch.html) | ui | 신제품 출시 준비 대화 시안. 첨부 · 표 · 코드 · 이미지 · 결과 카드 등 블록 종합 |
| [samples/source-answer.html](samples/source-answer.html) | ui | 출처가 있는 답변 시안(같은 질문의 케이스: EX-14 · EX-16). 문장 끝 출처 칩, 미리보기 카드(호버 · 탭으로 열림), 출처 목록. 파비콘은 검은 원 + 흰색 U |
| [samples/working-cases.html](samples/working-cases.html) | ui | 작업 중 케이스 시안(같은 질문의 케이스: EX-17). 단계 문구 교체, 작업 완료(완료 문구 + `>`), 긴 문구 말줄임 |
| [samples/text-shimmer.html](samples/text-shimmer.html) | ui | 텍스트 시머 시안. 생각 중 · 생각 끝 · 작업 중 · 긴 문구
| [samples/complex-chat.html](samples/complex-chat.html) | ui | 복합 채팅 유형 시안. 3턴: 빠른 응답, 작업 단계(표 · 코드), 작업 단계(목록 · 인용). 시머 · 작업 완료 연출 포함 |
| [samples/source-complex.html](samples/source-complex.html) | ui | 출처가 있는 복합 대화 시안. 3턴: 출처 1건 답변, 검색 단계 칩 · 열린 미리보기 카드 · 표 · 목록 · 인용 · 체크리스트 · 출처 4건 답변, 검색 중 진행 상태. 파비콘은 회색 자리 표시 |
| [setup-guide.html](setup-guide.html) | 사람 | zip 설치와 첫 사용 안내. CSS와 폰트를 담아 어디서든 열림 |

## 기록

| 문서 | 대상 | 역할 |
| --- | --- | --- |
