---
id: EX-13
type: demo
title: AI 심볼
status: stable
version: 1.0.1
summary: 첫 진입의 시그니처와 답변 중 생각 중, 생각 끝, 작업 중 심볼을 차례로 보여 주는 예시입니다.
template: 요소 카탈로그
elements: 심볼 · 시그니처 · 생각 중 · 생각 끝 · 작업 중 · 작업 상태
rules: [ANS-01, ANS-02, ANS-36]
ui: [UI-SYM-01, UI-SYM-03, UI-SYM-04, UI-SYM-05, UI-MSG-17]
---
@assistant
[심볼: 시그니처]
무엇을 도와드릴까요?

@user
이번 주말 서울 근교 당일치기 여행지 추천해줘

@assistant
[심볼: 생각 중]

@user
가평이랑 양평 중에 어디가 더 가까워?

@assistant
[심볼: 생각 끝]

@user
대중교통으로 가는 방법도 알려줘

@assistant
[심볼: 작업 중]
경춘선을 타면 **가평역**까지 1시간 20분 안쪽이에요. 양평은 경의중앙선으로 갈 수 있어요.
