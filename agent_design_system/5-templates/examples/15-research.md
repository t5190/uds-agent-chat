---
id: EX-15
type: demo
title: 리서치 답변
status: draft
version: 0.1.1
summary: 리서치를 마친 답변(작업 상태 줄, 문장 끝 출처 칩, 출처 목록)과 그다음 턴의 검색 진행 화면(검색 단계)을 이어서 보여 주는 예시입니다.
template: 정보 비교형
elements: 리서치 작업 상태 줄 · 출처 칩 · 출처 목록 · 검색 단계 · 검색 단계 칩 · 제목
rules: [ANS-01, ANS-02, ANS-12, ANS-17]
---
@user
1인 가구 첫 집, 월세랑 전세 중 뭐가 나을까?

@assistant
[상태: 리서치 과정 · 4단계 완료 · 32초]
초기 자금이 적다면 월세로 시작하는 편이 부담이 적어요. [출처: kostat]

### 전세가 유리한 경우

대출 이자가 월세보다 낮으면 매달 나가는 돈이 적어요. [출처: hug]

### 월세가 유리한 경우

2년 안에 이사할 계획이라면 목돈이 묶이지 않아 편해요. [출처: kostat]

---

[출처 목록]

[출처 kostat: 통계청 | 1인 가구 주거 실태 조사 — 통계청 | https://kostat.go.kr]
[출처 hug: HUG | 전세보증금 반환보증 안내 — HUG | https://hug.or.kr]

@user
그럼 보증금 1억 이하로 구할 수 있는 동네도 찾아 줘.

@assistant
[심볼: 작업 중 | 웹에서 찾는 중 · 출처 3개]
역과 가까우면서 보증금 시세가 낮은 동네를 찾아볼게요.

[검색: 서울 보증금 1억 이하 전세 시세 검색 | land.example.co.kr, news.example.com, map.example.com]
