---
id: EX-21
type: demo
title: 이미지 첨부 그리드
status: draft
version: 0.1.0
summary: 요청 영역에 이미지를 1장부터 20장까지 보낼 때 개수에 따라 썸네일 크기와 배열이 바뀌는 모습을 차례로 보여 주는 예시입니다.
template: 이미지 응답형
elements: 첨부 이미지 · 썸네일 그리드
rules: [ANS-01, ANS-22]
ui: [UI-IMG-01, UI-IMG-02, UI-IMG-03, UI-IMG-04, UI-IMG-05, UI-IMG-06, UI-IMG-07]
figma: https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=143-85774
---
@user
[이미지 1장]
사진 1장 보낼게요

@assistant
1장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (1장 · 124)

@user
[이미지 2장]
사진 2장 보낼게요

@assistant
2장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (2장 · 124 · 2열)

@user
[이미지 3장]
사진 3장 보낼게요

@assistant
3장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (3장 · Mobile 96 · Tablet 이상 124)

@user
[이미지 4장]
사진 4장 보낼게요

@assistant
4장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (4장 · 124 · 2열 2행)

@user
[이미지 5장]
사진 5장 보낼게요

@assistant
5장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (5장 · Mobile 96 · 빈 칸은 왼쪽)

@user
[이미지 6장]
사진 6장 보낼게요

@assistant
6장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (6장 · Mobile 96 · Tablet 이상 124)

@user
[이미지 7장]
사진 7장 보낼게요

@assistant
7장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (7장 · 64 · 3열)

@user
[이미지 12장]
사진 12장 보낼게요

@assistant
12장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (12장 · 64 · 3열 4행)

@user
[이미지 20장]
사진 20장 보낼게요

@assistant
20장을 받았어요. 첨부 개수별 배열은 이렇게 보여요. (20장 · 64 · 3열 7행 (최대))
