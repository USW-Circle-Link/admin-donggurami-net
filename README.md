# 동구라미 관리자 — admin.donggurami.net

수원대학교 동아리 연합회 공식 플랫폼 **동구라미**의 관리자 시스템입니다.
동아리 회장과 연합회가 동아리 정보·모집 신청서·회원을 관리합니다.

**[admin.donggurami.net](https://admin.donggurami.net)** · 사용자 서비스: [donggurami.net](https://donggurami.net) · 앱: [USW-Circle-Link-APP](https://github.com/USW-Circle-Link/USW-Circle-Link-APP)

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite 7](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)

---

## 왜 이렇게 만들었나

관리자 화면은 도메인이 계속 불어납니다. 동아리 정보에서 시작해 모집 신청서, 회원, 공지, 층별 안내도, 카테고리로 늘어났습니다.
그래서 **화면이 아니라 도메인 단위로** 코드를 나누고, 그 규칙이 지켜지는지를 **사람이 아니라 도구가** 검사하게 했습니다.

### 1. Feature Layer — 도메인 단위 구조

```
src/features/<도메인>/
  ├── domain/   타입·스키마 (Zod)
  ├── api/      서버 통신
  └── hooks/    TanStack Query 훅
```

`admin` `application` `auth` `category` `club` `club-leader`
`floor-maps` `form-management` `mypage` `notice` `profile` `user`

의존 방향은 항상 **Domain → API → Hooks** 한 방향입니다. 새 관리 기능을 붙일 때 기존 코드를 건드리는 범위가 도메인 폴더 하나로 갇힙니다.

### 2. 테스트 먼저 — 백엔드를 기다리지 않는다

**MSW로 API를 가상화**해 UI보다 테스트를 먼저 씁니다. 핸들러는 4개에서 50개 이상으로 늘어났고, 현재 **178개의 테스트**가 배포를 지킵니다.
서버 응답은 **Zod**로 런타임 검증해, 명세와 다른 데이터가 화면까지 흘러오지 못하게 막습니다.
핵심 흐름은 **Playwright E2E**로 한 번 더 검증합니다.

### 3. 규칙을 문서가 아니라 실행 가능한 검사로

프로젝트 규칙을 문서에만 적어두면 아무도 읽지 않습니다. `.claude/skills/`에 **검증 스킬**로 넣어 매번 자동으로 확인합니다.

| Skill | 하는 일 |
|---|---|
| `verify-feature-layer` | Feature layer(Domain → API → Hooks) 구조 일관성 검증 |
| `verify-e2e-tests` | E2E 테스트 패턴 일관성 검증 (helpers · page objects) |
| `verify-implementation` | 모든 verify 스킬을 순차 실행해 통합 검증 보고서 생성 |
| `manage-skills` | 세션 변경사항을 분석해 검증 스킬을 생성·갱신 |

UI도 마찬가지입니다. shadcn/ui 컴포넌트 45개를 설치한 뒤 **무엇이 이미 있는지 알기 어려워져** 중복 컴포넌트가 생겼습니다.
그래서 `shadcn-ui-standards` 스킬에 **컴포넌트 카탈로그**와 **코드 리뷰 체크리스트**를 넣어, 새 UI를 만들기 전에 먼저 읽도록 했습니다.

---

## 기술 스택

| 영역 | 사용 |
|---|---|
| 코어 | React 19 · TypeScript · Vite 7 · React Router 7 |
| 서버 상태 | TanStack Query · Axios (JWT 인터셉터) |
| 화면 상태 | Zustand |
| 폼·검증 | React Hook Form · Zod |
| UI | shadcn/ui · Base UI · Tailwind CSS 4 · Framer Motion |
| 테스트 | Vitest · Testing Library · MSW · Playwright |
| 모니터링 | Sentry · GA4 |
| 배포 | GitHub Actions → GitHub Pages (커스텀 도메인) |

## 인증

- Access Token은 localStorage, Refresh Token은 httpOnly 쿠키
- Axios 인터셉터가 만료 시 자동 갱신
- `ProtectedRoute` + `AuthInitializer`로 앱 시작 시 토큰 검증 후 라우팅
- 역할 기반 접근 제어: `USER` · `LEADER` · `ADMIN`

## 실행

```bash
npm install
npm run dev          # 개발 서버 (HMR)
npm run test         # 단위·통합 테스트
npm run e2e          # E2E 테스트
npm run build        # 타입 체크 + 프로덕션 빌드
```
