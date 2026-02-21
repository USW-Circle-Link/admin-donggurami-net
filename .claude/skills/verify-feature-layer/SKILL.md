---
name: verify-feature-layer
description: Feature layer(Domain → API → Hooks) 구조 일관성을 검증합니다. 새 feature 추가 또는 기존 feature 수정 후 사용.
---

# Feature Layer 일관성 검증

## Purpose

각 feature 모듈이 Domain → API → Hooks 3계층 아키텍처를 준수하는지 검증합니다:

1. **계층 구조 완전성** — 각 feature에 domain/, api/, hooks/ 디렉토리가 있는지
2. **Import 방향성** — Domain ← API ← Hooks 단방향 의존성 준수
3. **네이밍 규칙** — 파일명, 함수명, 타입명이 프로젝트 규칙을 따르는지
4. **Zod 스키마 연동** — API 레이어가 domain 스키마를 사용하여 런타임 검증하는지
5. **Query Key Factory** — hooks가 일관된 query key factory 패턴을 사용하는지

## When to Run

- 새로운 feature 모듈을 추가한 후
- 기존 feature의 schema 또는 API 함수를 수정한 후
- feature 간 import 관계를 변경한 후
- PR 전 아키텍처 규칙 준수 확인 시

## Related Files

| File | Purpose |
|------|---------|
| `src/features/auth/domain/authSchemas.ts` | 스키마 패턴 레퍼런스 |
| `src/features/auth/api/authApi.ts` | API 레이어 패턴 레퍼런스 |
| `src/features/auth/hooks/useLogin.ts` | Hook 레이어 패턴 레퍼런스 |
| `src/features/club/hooks/useClubs.ts` | Query key factory 패턴 레퍼런스 |
| `src/features/form-management/api/formApi.ts` | safeParse() 검증 패턴 레퍼런스 |
| `src/features/auth/store/authStore.ts` | Zustand store 패턴 (auth 전용) |

## Workflow

### Step 1: Feature 디렉토리 구조 검증

**도구:** Glob, Bash

각 feature 디렉토리에 필수 하위 디렉토리가 있는지 확인합니다.

```bash
for feature in src/features/*/; do
  name=$(basename "$feature")
  missing=""
  [ ! -d "$feature/domain" ] && missing="$missing domain"
  [ ! -d "$feature/api" ] && missing="$missing api"
  [ ! -d "$feature/hooks" ] && missing="$missing hooks"
  [ -n "$missing" ] && echo "FAIL: $name — missing:$missing"
done
```

**PASS:** 모든 feature에 domain/, api/, hooks/ 존재.
**FAIL:** 하위 디렉토리 누락 시 — 누락된 디렉토리를 생성하고 해당 레이어 파일을 추가.

### Step 2: 네이밍 규칙 검증

**도구:** Glob

각 feature 레이어의 파일 네이밍 규칙을 확인합니다.

| 레이어 | 패턴 | 예시 |
|--------|------|------|
| Domain | `{feature}Schemas.ts` | `clubSchemas.ts` |
| API | `{feature}Api.ts` | `clubApi.ts` |
| Hooks | `use{Feature}.ts` | `useClubs.ts` |

```bash
for feature in src/features/*/; do
  name=$(basename "$feature")
  # Domain schema file check
  ls "$feature/domain/${name}Schemas.ts" 2>/dev/null || \
    ls "$feature/domain/"*Schemas.ts 2>/dev/null || \
    echo "WARN: $name — no *Schemas.ts in domain/"
  # API file check
  ls "$feature/api/${name}Api.ts" 2>/dev/null || \
    ls "$feature/api/"*Api.ts 2>/dev/null || \
    echo "WARN: $name — no *Api.ts in api/"
  # Hook file check
  ls "$feature/hooks/use"*.ts 2>/dev/null || \
    echo "WARN: $name — no use*.ts in hooks/"
done
```

**PASS:** 각 레이어에 규칙에 맞는 파일이 존재.
**FAIL:** 파일명이 규칙과 불일치 — 파일명을 수정하거나 누락된 파일을 생성.

### Step 3: Import 방향성 검증

**도구:** Grep

feature 내부에서 역방향 import가 없는지 확인합니다.

```bash
# Domain이 API/Hooks를 import하면 안 됨
grep -rn "from.*['\"]\.\.\/api\|from.*['\"]\.\.\/hooks" src/features/*/domain/ 2>/dev/null

# API가 Hooks를 import하면 안 됨
grep -rn "from.*['\"]\.\.\/hooks" src/features/*/api/ 2>/dev/null
```

**PASS:** 역방향 import 없음.
**FAIL:** 역방향 import 발견 — 의존성 방향을 수정 (Domain ← API ← Hooks).

### Step 4: Feature 간 직접 import 검증

**도구:** Grep

feature 모듈이 다른 feature를 직접 import하지 않는지 확인합니다 (shared/ 통해서만 허용).

```bash
# 각 feature가 다른 feature를 직접 import하는지 검사
for feature in src/features/*/; do
  name=$(basename "$feature")
  grep -rn "from.*features/" "$feature" 2>/dev/null | grep -v "features/$name" | grep -v "__tests__"
done
```

**PASS:** feature 간 직접 import 없음 (또는 테스트 파일만).
**FAIL:** feature 간 직접 의존성 발견 — shared/ 레이어로 추출하거나 의존성을 제거.

### Step 5: Zod 스키마 사용 검증

**도구:** Grep

API 레이어에서 domain 스키마를 import하여 사용하는지 확인합니다.

```bash
# API 파일에서 schema import 확인
for api_file in src/features/*/api/*Api.ts; do
  feature=$(echo "$api_file" | sed 's|src/features/\([^/]*\)/.*|\1|')
  has_schema_import=$(grep -c "from.*domain\|from.*Schemas" "$api_file" 2>/dev/null)
  [ "$has_schema_import" = "0" ] && echo "WARN: $api_file — domain schema import 없음"
done
```

**PASS:** API 파일이 domain 스키마 타입을 import.
**FAIL:** API가 스키마 없이 raw 타입만 사용 — domain 스키마에서 타입을 import하도록 수정.

### Step 6: Query Key Factory 패턴 검증

**도구:** Grep

hooks 파일에 query key factory가 정의되어 있는지 확인합니다.

```bash
# useQuery를 사용하는 hooks 파일에 queryKey factory가 있는지 확인
for hook_file in src/features/*/hooks/use*.ts; do
  uses_query=$(grep -c "useQuery\|useMutation" "$hook_file" 2>/dev/null)
  if [ "$uses_query" -gt 0 ]; then
    has_keys=$(grep -c "Keys\s*=" "$hook_file" 2>/dev/null)
    [ "$has_keys" = "0" ] && echo "WARN: $hook_file — query key factory 없음"
  fi
done
```

**PASS:** useQuery를 사용하는 hooks에 query key factory가 정의됨.
**FAIL:** query key factory 누락 — `{feature}Keys` 객체를 추가.

## Output Format

```markdown
## Feature Layer 검증 결과

| Feature | 구조 | 네이밍 | Import 방향 | 스키마 연동 | Query Keys | 상태 |
|---------|------|--------|------------|------------|------------|------|
| auth    | OK   | OK     | OK         | OK         | N/A (store) | PASS |
| club    | OK   | OK     | OK         | OK         | OK         | PASS |
```

## Exceptions

1. **auth feature의 store/ 레이어** — auth만 유일하게 `store/` 디렉토리를 가짐 (Zustand). 이는 설계상 의도된 것임
2. **테스트 파일의 cross-feature import** — `__tests__/` 내 파일에서 다른 feature를 import하는 것은 허용 (테스트 fixture 공유)
3. **shared/ 디렉토리** — `src/shared/`는 feature가 아닌 공통 유틸리티이므로 검증 대상이 아님
4. **type-only import** — `import type`은 런타임 의존성이 아니므로 cross-feature import 검사에서 면제 가능
