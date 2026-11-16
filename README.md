# uds-chat-build

> AI는 [AGENTS.md](AGENTS.md)부터 읽습니다. 전체 문서 목록은 [INDEX.md](INDEX.md), 용어는 [GLOSSARY.md](GLOSSARY.md)에 있습니다.

입력한 대화를 **md 스펙대로** 우리 스타일 채팅 화면으로 그리는 작업 폴더입니다.

## 설치

zip을 풀어 `uds-chat-build/` 폴더를 `.claude/skills/`에 둡니다(전체 적용은 `~/.claude/skills/`). Claude Code에서 `/uds-chat-build`로 부릅니다.

## 구조

```
uds-chat-build/
├─ SKILL.md                스킬 진입 (이 폴더를 스킬로 쓸 때 가장 먼저 읽음)
├─ README.md · AGENTS.md · CLAUDE.md   사람 · AI 진입
├─ INDEX.md · GLOSSARY.md · CHANGELOG.md   전체 문서 목록 · 용어집 · 변경 이력
├─ agent_design_system/    스펙 1~5단계 (목록: index.md)
│  └─ assets/symbol/       심볼 이미지, 모션(Lottie), 적용 예제 코드
├─ conversations/          시나리오 대화 파일
├─ standard/               문서 표준 (core: 전사 공통, profile: 이 프로젝트)
├─ docs/                   계획, 미정 목록
├─ samples/                시안 HTML
├─ lib/                    렌더러 코드, vendor/(marked · lottie · 폰트, 오프라인용)
├─ scripts/                생성 · 검사 스크립트
├─ chat.html               채팅 화면 (스펙을 읽어 대화를 그림). **제작자용**: 스펙과 대화 파일을 확인하는 도구이고 배포 대상이 아님
```

| 위치 | 역할 | 만드는 방법 | 담당 |
| --- | --- | --- | --- |
| `agent_design_system/` | 스펙. 값과 규칙의 정본 | 직접 작성 | 디자인시스템팀 (미정) |
| `agent_design_system/5-templates/5-3-system-prompt.md`의 생성 구간 | 2-1에서 만든 프롬프트 규칙 | `npm run build` | 자동 |
| `conversations/`, `5-templates/examples/` | 시나리오, 시연 | 직접 작성 | 기여자 |
| `standard/` | 문서 표준과 양식 | 직접 작성 | 표준 담당 (미정) |
| `docs/open-issues.md` | 각 문서의 `## 미정` 모음 | `npm run build` | 자동 |
| `samples/` | 시안 | 직접 작성 | 기여자 |
| `lib/chat-ui.js`, `lib/spec-css.js` | 렌더러, 스펙 → CSS 변환 | 직접 작성 | 기여자 |
| `lib/design-system.css` | 시안용 CSS. **직접 고치지 않음** | `npm run build` | 자동 |
| `dist/` | 서버 없이 여는 화면 묶음. 저장소에 넣지 않음 | `npm run build` | 자동 |
| `scripts/` | 생성 · 검사 스크립트 | 직접 작성 | 기여자 |

스펙의 값과 규칙을 바꾸려면 디자인시스템팀과 정합니다. 문서 구조, 용어, 링크 정리는 누구나 고치고 `npm run check`로 확인합니다.

## 쓰는 법

1. 서버를 띄웁니다: `npm run dev` (Node만 있으면 됨) → http://127.0.0.1:8765/chat.html. `python3 -m http.server`는 `.env` 같은 숨김 파일까지 내보내므로 쓰지 않습니다
2. **직접 입력** 탭에 대화를 넣습니다. 형식은 [4-8](agent_design_system/4-resources/4-8-markup.md)의 "대화 파일 형식"입니다.
3. 시나리오는 `chat.html?src=conversations/movie.md`처럼 엽니다.
4. 화면은 실제 응답처럼 단계적으로 재생됩니다. 요청 → 생각 중 → 생각 끝 → 작업 중과 글자가 이어짐 → 끝나면 액션 줄 순서입니다. 위 막대의 "다시 재생"으로 처음부터 다시 보고, "바로 보기"로 재생 없이 한 번에 봅니다(`?play=0`도 같음).

`chat.html`은 서버에서 만든 화면으로만 열립니다. `file://`로 열면 `npm run dev` 안내만 나옵니다. 서버 없이 보려면 `npm run build`로 만든 `dist/chat.html`을 엽니다.

## 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run build` | `lib/design-system.css`, 5-3 생성 구간, `docs/open-issues.md`, `dist/`를 만듦 |
| `npm run check` | 문서 표준, 생성 파일 최신 여부, 시안을 검사함 |

## 스타일 바꾸기

`agent_design_system/`의 3 · 4단계 문서를 고치고 `chat.html`을 새로고침하면 바로 반영됩니다. 시안에도 반영하려면 `npm run build`를 실행합니다.
