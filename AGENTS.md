---
id: IDX-AGENTS
type: index
title: AI 진입 안내
status: stable
version: 2.0.0
summary: AI가 이 프로젝트를 읽는 순서와 작업별 정본 문서를 안내하는 진입 파일입니다.
---

# AI 진입 안내

이 프로젝트는 채팅 UI 스펙(md)과, 스펙을 읽어 채팅 화면을 그리는 렌더러(`chat.html`, `lib/`)로 이뤄집니다. 규칙의 내용은 여기에 적지 않고 정본 문서를 가리킵니다.

## 읽는 순서

1. 이 파일
2. [GLOSSARY.md](GLOSSARY.md): 쓰는 말과 쓰지 않는 말
3. [INDEX.md](INDEX.md): 프로젝트 전체 문서 목록
4. [agent_design_system/index.md](agent_design_system/index.md): 스펙 1~5단계 문서 목록과 읽는 법
5. 작업에 맞는 스펙 문서. 답변을 쓰면 `audience`가 `answer`나 `both`인 문서, 화면을 만들면 `ui`나 `both`인 문서

## 배포 구분

| 누가 | 쓰는 것 |
| --- | --- |
| 스킬을 받아 화면을 만드는 사용자 | [SKILL.md](SKILL.md)로 시안 HTML을 만든다. `chat.html` · `conversations/` · `dist/`는 쓰지 않는다 |
| 제작자(스펙을 고치는 사람) | `chat.html`과 대화 파일로 스펙을 확인하고, 배포 전에 `npm run build` · `npm run check`를 통과시킨다 |

## 작업별 정본

| 작업 | 정본 |
| --- | --- |
| 문서를 쓰거나 고칠 때 | [core 표준](standard/core/doc-standard.md), [chat-ui 프로필](standard/profile/chat-ui-profile.md)의 "문서 틀", [양식](standard/profile/templates/index.md) |
| 스펙 문서를 고칠 때 화면이 깨지지 않게 | 프로필의 "파서 계약" |
| 대화 파일(시연 · 시나리오)을 쓸 때 | [4-8](agent_design_system/4-resources/4-8-markup.md)의 "대화 파일 형식", 프로필의 "추가 선택 키" |
| 답변을 쓸 때 | [2-1. 답변 규칙](agent_design_system/2-rules/2-1-answer.md), [5-1. 답변 골격](agent_design_system/5-templates/5-1-patterns.md) |
| 시안을 만들 때 | 프로필의 "시안 규칙", 절차는 [make-mockup 스킬](.claude/skills/make-mockup/SKILL.md) |

## 고친 뒤

`npm run check`를 실행합니다. 오류가 0건이어야 합니다. 스타일 표나 2-1을 고쳤으면 먼저 `npm run build`를 실행합니다. 점검표는 [core](standard/core/checklist.md)와 [chat-ui](standard/profile/checklist.md)입니다.
