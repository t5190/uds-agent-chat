---
name: add-doc
description: 이 프로젝트에 새 문서(스펙, 시연 대화, 시나리오 대화)를 표준에 맞게 추가한다.
---

1. standard/profile/chat-ui-profile.md의 "문서 틀"에서 문서 종류를 정하고, "ID 접두어"로 ID를 정한다.
2. 양식을 복사한다: standard/profile/templates/index.md 또는 standard/core/templates/index.md.
3. 색인에 등록한다. 스펙은 agent_design_system/index.md, 시연은 agent_design_system/5-templates/5-2-examples.md, 시나리오와 그 밖의 문서는 INDEX.md.
4. GLOSSARY.md의 용어를 쓴다.
5. `npm run build` 후 `npm run check`가 오류 0건인지 확인한다.
