---
name: verify-e2e-tests
description: E2E 테스트 패턴 일관성을 검증합니다 (helpers, page objects, hybrid 전략). E2E 테스트 추가/수정 후 사용.
---

# E2E 테스트 패턴 검증

## Purpose

E2E 테스트 스위트가 프로젝트의 하이브리드 테스트 전략(Real Reads + Mocked Writes)을 일관되게 따르는지 검증합니다:

1. **인증 패턴** — 모든 테스트가 `realLogin()` 또는 적절한 auth helper를 사용하는지
2. **Write 보호** — 데이터 변경 테스트가 `mockWriteEndpoints()`로 프로덕션 데이터를 보호하는지
3. **네비게이션 패턴** — SPA 네비게이션에 `navigateTo()` 사용, AuthInitializer 우회 패턴 준수
4. **Page Object 사용** — 테스트가 raw locator 대신 page object 메서드를 사용하는지
5. **설정 일관성** — playwright.config.ts 설정이 올바른지

## When to Run

- 새 E2E 테스트 파일을 추가한 후
- 기존 E2E 헬퍼(auth.ts, write-mocks.ts)를 수정한 후
- page object를 추가하거나 수정한 후
- playwright.config.ts 설정을 변경한 후
- PR 전 E2E 테스트 품질 확인 시

## Related Files

| File | Purpose |
|------|---------|
| `e2e/helpers/auth.ts` | 인증 헬퍼 — realLogin(), navigateTo(), seedMockAuth() |
| `e2e/helpers/write-mocks.ts` | Write 차단 — mockWriteEndpoints(), mockSpecificWrite() |
| `e2e/helpers/constants.ts` | API_BASE, ROUTES, CREDENTIALS, AUTH_STORAGE_KEY |
| `e2e/helpers/api-mocks.ts` | 선택적 엔드포인트 모킹 — mockApi(), mockApiError() |
| `e2e/helpers/api-client.ts` | API 레벨 테스트용 클라이언트 (캐싱 포함) |
| `e2e/helpers/test-data/club-leader-fixtures.ts` | 테스트 픽스처 데이터 |
| `e2e/global-setup.ts` | 테스트 전 토큰 사전 캐싱 (rate limit 방지) |
| `e2e/playwright.config.ts` | Playwright 설정 (timeout, retries, projects, globalSetup) |
| `e2e/page-objects/LoginPage.ts` | 로그인 페이지 오브젝트 |
| `e2e/page-objects/club/*.ts` | Club feature 페이지 오브젝트 |
| `e2e/page-objects/union/*.ts` | Union feature 페이지 오브젝트 |
| `e2e/tests/auth/*.spec.ts` | 인증 관련 테스트 |
| `e2e/tests/club/*.spec.ts` | Club LEADER 역할 테스트 |
| `e2e/tests/union/*.spec.ts` | Union ADMIN 역할 테스트 |
| `e2e/tests/api/*.spec.ts` | API 레벨 테스트 |

## Workflow

### Step 1: realLogin() 사용 검증

**도구:** Grep

UI 테스트 파일(auth/ 제외)이 `realLogin()`을 사용하여 인증하는지 확인합니다.

```bash
# club/, union/ 테스트에서 realLogin 사용 확인
for test_file in e2e/tests/club/*.spec.ts e2e/tests/union/*.spec.ts; do
  has_real_login=$(grep -c "realLogin" "$test_file" 2>/dev/null)
  [ "$has_real_login" = "0" ] && echo "FAIL: $test_file — realLogin() 미사용"
done
```

**PASS:** 모든 club/, union/ 테스트가 `realLogin()` 사용.
**FAIL:** `realLogin()` 누락 — `beforeEach`에서 `await realLogin(page, 'LEADER'|'ADMIN')` 호출 추가.

### Step 2: mockWriteEndpoints() 사용 검증

**도구:** Grep

데이터를 변경하는 테스트가 `mockWriteEndpoints()`로 프로덕션 보호를 하는지 확인합니다.

```bash
# club/, union/ 테스트에서 mockWriteEndpoints 사용 확인
for test_file in e2e/tests/club/*.spec.ts e2e/tests/union/*.spec.ts; do
  has_write_mock=$(grep -c "mockWriteEndpoints" "$test_file" 2>/dev/null)
  has_write_action=$(grep -c "click.*submit\|click.*delete\|click.*save\|toggle\|Send.*notification" "$test_file" 2>/dev/null)
  if [ "$has_write_action" -gt 0 ] && [ "$has_write_mock" = "0" ]; then
    echo "WARN: $test_file — write 동작이 있으나 mockWriteEndpoints() 미사용"
  fi
done
```

**PASS:** write 동작이 있는 테스트에 `mockWriteEndpoints()` 적용.
**FAIL:** write 보호 누락 — `beforeEach`에서 `await mockWriteEndpoints(page)` 호출 추가.

### Step 3: navigateTo() SPA 네비게이션 검증

**도구:** Grep

dashboard 이외 페이지로 이동 시 `navigateTo()`를 사용하는지 확인합니다 (AuthInitializer 우회).

```bash
# club/, union/ 테스트에서 page.goto() 직접 사용 검사 (login 제외)
grep -rn "page\.goto(" e2e/tests/club/ e2e/tests/union/ 2>/dev/null | grep -v "login"
```

**PASS:** `page.goto()` 직접 사용 없음 (login 페이지 제외).
**FAIL:** `page.goto()` 직접 사용 발견 — `navigateTo(page, ROUTES.XXX)`로 교체. AuthInitializer가 항상 dashboard로 리다이렉트하므로 SPA 네비게이션 필수.

### Step 4: Page Object 패턴 검증

**도구:** Grep

테스트 파일에서 raw locator를 과도하게 사용하지 않는지 확인합니다.

```bash
# 테스트 파일에서 page.locator() 직접 사용 횟수 검사
for test_file in e2e/tests/club/*.spec.ts e2e/tests/union/*.spec.ts; do
  raw_count=$(grep -c "page\.locator\|page\.getByRole\|page\.getByText\|page\.getByLabel" "$test_file" 2>/dev/null)
  if [ "$raw_count" -gt 5 ]; then
    echo "WARN: $test_file — raw locator $raw_count회 사용 (page object 활용 권장)"
  fi
done
```

**PASS:** raw locator 사용이 5회 이하.
**FAIL:** raw locator 과다 사용 — page object에 메서드를 추가하고 테스트에서 호출하도록 리팩토링.

### Step 5: Page Object 파일 커버리지 검증

**도구:** Glob

각 테스트 파일에 대응하는 page object가 존재하는지 확인합니다.

```bash
# club 테스트에 대응하는 page object 확인
for test_file in e2e/tests/club/*.spec.ts; do
  page_name=$(basename "$test_file" .spec.ts | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | tr -d ' ')
  ls e2e/page-objects/club/${page_name}Page.ts 2>/dev/null || \
    echo "WARN: $test_file — 대응 page object 미존재"
done

# union 테스트에 대응하는 page object 확인
for test_file in e2e/tests/union/*.spec.ts; do
  page_name=$(basename "$test_file" .spec.ts | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | tr -d ' ')
  ls e2e/page-objects/union/${page_name}Page.ts 2>/dev/null || \
    echo "WARN: $test_file — 대응 page object 미존재"
done
```

**PASS:** 각 테스트에 대응 page object 존재.
**FAIL:** page object 누락 — 해당 페이지의 page object 클래스를 생성.

### Step 6: Playwright 설정 검증

**도구:** Read

playwright.config.ts의 핵심 설정이 올바른지 확인합니다.

```bash
# 필수 설정 확인
grep -n "timeout:" e2e/playwright.config.ts
grep -n "retries:" e2e/playwright.config.ts
grep -n "fullyParallel:" e2e/playwright.config.ts
grep -n "screenshot:" e2e/playwright.config.ts
grep -n "locale:" e2e/playwright.config.ts
```

**검증 기준:**
- `timeout` ≥ 30000 (실서버 응답 대기)
- `retries` ≥ 1 (rate limiting 대응)
- chromium 프로젝트에 `fullyParallel: false` (rate limiting 방지)
- `screenshot: 'only-on-failure'`
- `locale: 'ko-KR'`

**PASS:** 모든 설정이 기준 충족.
**FAIL:** 설정 불일치 — 해당 값을 수정.

### Step 7: globalSetup 설정 검증

**도구:** Grep

playwright.config.ts에 `globalSetup`이 설정되어 있고, `global-setup.ts` 파일이 존재하는지 확인합니다.

```bash
# globalSetup 설정 확인
grep -n "globalSetup" e2e/playwright.config.ts
# global-setup.ts 파일 존재 확인
ls e2e/global-setup.ts 2>/dev/null || echo "FAIL: e2e/global-setup.ts 파일 없음"
```

**PASS:** `globalSetup: './global-setup.ts'` 설정이 있고 파일 존재.
**FAIL:** globalSetup 미설정 — rate limiting 방지를 위해 테스트 전 토큰을 사전 캐싱하는 globalSetup 필요.

### Step 8: API 로그인 캐싱 검증

**도구:** Grep

`apiLogin()` 함수가 파일 기반 캐싱을 사용하여 rate limiting을 방지하는지 확인합니다.

```bash
# apiLogin에 캐시 로직 존재 확인
grep -n "cache\|Cache\|CACHE" e2e/helpers/api-client.ts
# realLogin에 캐시 로직 존재 확인
grep -n "cache\|Cache\|CACHE" e2e/helpers/auth.ts
```

**PASS:** `apiLogin()`과 `realLogin()` 모두 파일 기반 캐싱 사용.
**FAIL:** 캐싱 미적용 — IP 기반 rate limit(5회/5분)으로 인해 병렬 테스트 시 로그인 실패. 파일 캐싱 필수.

### Step 9: Serial 플로우 테스트 cleanup 검증

**도구:** Grep

`test.describe.serial` 패턴을 사용하는 테스트가 마지막에 cleanup(데이터 정리) 단계를 포함하는지 확인합니다.

```bash
# serial 플로우 테스트 파일 찾기
grep -rl "describe\.serial" e2e/tests/ 2>/dev/null | while read f; do
  has_cleanup=$(grep -c "정리\|cleanup\|Cleanup\|삭제\|delete\|revert" "$f" 2>/dev/null)
  [ "$has_cleanup" = "0" ] && echo "WARN: $f — serial 플로우에 cleanup 단계 없음"
done
```

**PASS:** serial 플로우 테스트에 cleanup 단계 존재.
**FAIL:** cleanup 누락 — 테스트 데이터가 축적되어 후속 실행에 영향을 줄 수 있음.

### Step 10: 토큰 캐시 파일 검증

**도구:** Bash

`.auth-cache.json`이 `.gitignore`에 포함되어 있는지 확인합니다.

```bash
# auth cache가 gitignore에 있는지 확인
grep -q "auth-cache" .gitignore 2>/dev/null || \
  grep -q "e2e/" .gitignore 2>/dev/null || \
  echo "FAIL: .auth-cache.json이 .gitignore에 없음"
```

**PASS:** auth cache 파일이 git 추적에서 제외.
**FAIL:** `.gitignore`에 추가 필요.

## Output Format

```markdown
## E2E 테스트 검증 결과

| 검사 항목 | 상태 | 이슈 |
|----------|------|------|
| realLogin() 사용 | PASS/FAIL | 미사용 파일 목록 |
| mockWriteEndpoints() 사용 | PASS/FAIL | 미보호 파일 목록 |
| navigateTo() SPA 네비게이션 | PASS/FAIL | page.goto() 직접 사용 위치 |
| Page Object 패턴 | PASS/WARN | raw locator 과다 사용 파일 |
| Page Object 커버리지 | PASS/WARN | 누락된 page object |
| Playwright 설정 | PASS/FAIL | 불일치 항목 |
| globalSetup 설정 | PASS/FAIL | globalSetup 미설정 또는 파일 누락 |
| API 로그인 캐싱 | PASS/FAIL | 캐싱 미적용 함수 |
| Serial 플로우 cleanup | PASS/WARN | cleanup 누락 파일 |
| 토큰 캐시 gitignore | PASS/FAIL | 추적 여부 |
```

## Exceptions

1. **auth/ 테스트 파일** — 로그인 자체를 테스트하므로 `realLogin()` 대신 직접 UI 로그인 사용 허용
2. **api/ 테스트 파일** — API 레벨 테스트는 브라우저를 사용하지 않으므로 page object, navigateTo(), mockWriteEndpoints() 검사 면제
3. **error state 테스트** — `seedMockAuth()` + `mockApiError()`를 사용하여 의도적으로 실패 시나리오를 테스트하는 케이스는 `realLogin()` 미사용 허용
4. **login 페이지 이동** — `page.goto('login')`은 AuthInitializer 우회가 불필요하므로 `navigateTo()` 미사용 허용
