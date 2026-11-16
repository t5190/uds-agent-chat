---
id: STD-PROFILE-CHECK
type: standard
title: chat-ui 전용 점검 항목
status: stable
version: 1.3.0
summary: core 점검에 더해 이 프로젝트에서만 확인하는 항목입니다.
refs: [STD-CORE-CHECK]
---

# chat-ui 전용 점검 항목

[core 점검](../core/checklist.md)에 더해 확인합니다. 기준은 [chat-ui 프로필](chat-ui-profile.md)입니다.

## 필수

- [ ] 파서 계약을 깨지 않음(스펙 `index.md` 링크 목록, css 블록, `토큰`/`셀렉터` 표, 4-8 클래스 목록)
- [ ] demo 파일을 추가하거나 지웠으면 5-2의 `](examples/…md)` 링크와 일치함
- [ ] 스타일 표를 고쳤으면 `node scripts/build-css.mjs`를 실행함
- [ ] 2-1을 고쳤으면 `node scripts/build-docs.mjs`를 실행함
- [ ] 시안이 `node scripts/check-mockup.mjs`를 통과함
- [ ] 시안에 진행 중인 응답이나 첫 진입 화면이 있으면 심볼 모션이 들어 있음

## 권장

- [ ] 문서가 해당 종류의 문서 틀(H2 항목과 순서)을 따름
- [ ] 값은 4단계에만 있고 다른 곳에서는 토큰 이름이나 링크로 씀
- [ ] EX-NN, CV-NN이 연속임

## 사람이 확인

- [ ] 수정 후 `chat.html`에서 칩, 스타일, 콘솔 오류를 확인함
