---
id: EX-18
type: demo
title: 결과 카드 상태
status: draft
version: 0.1.0
summary: 도구가 파일을 만드는 동안의 실행 중 카드, 끝난 뒤의 완료 카드, 읽지 못했을 때의 실패 카드를 차례로 보여 주는 예시입니다.
template: 파일 응답형
elements: 결과 카드 · 실행 중 · 실패 · 첨부 파일
rules: [ANS-01, ANS-02, ANS-17, ANS-21, ANS-22, ANS-26]
ui: [UI-FILE-21, UI-FILE-24, UI-FILE-25, UI-FILE-26, UI-FILE-27, UI-FILE-28]
figma: https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=247-153846
---
@user
[파일: 상담 기록.docx]
상담 기록을 분석해서 요약 보고서로 만들어줘

@assistant
상담 기록을 분석해서 보고서를 만들고 있어요.

[결과 실행 중: 문서 비교 분석표 만드는 중… · 표 3개를 정리하고 있어요 | 데이터 분석 실행]

@user
완성됐어?

@assistant
네, 요약 보고서가 완성됐어요. 핵심 항목 12개를 정리했습니다.

[결과 파일: 상담 요약 보고서.docx · 워드프로세서 | 데이터 분석 실행]

@user
이번엔 용량이 큰 원본 파일로 분석표도 만들어줘

@assistant
원본 파일이 너무 커서 분석표를 만들지 못했어요. 파일을 나눠서 다시 올려 주세요.

[결과 실패: 분석표를 만들지 못했어요 · 파일이 20MB를 넘어 읽지 못했습니다. | 데이터 분석 실행]
