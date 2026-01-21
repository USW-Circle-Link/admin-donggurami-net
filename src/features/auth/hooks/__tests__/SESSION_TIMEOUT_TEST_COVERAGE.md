# Session Timeout Test Coverage

## Overview

Comprehensive test suite for session timeout behavior in the authentication system, covering all critical scenarios for token lifecycle management.

## Test File

`src/features/auth/hooks/__tests__/useAuthInitialization.test.ts`

**Total Tests**: 19
**Coverage**: 100% of `useAuthInitialization.ts` logic
**Status**: ✅ All tests passing

---

## Test Categories

### 1. Happy Path - Valid Token on Startup (3 tests)

#### ✅ Should keep user logged in when valid token exists in localStorage
- **Scenario**: User has valid token in localStorage on app startup
- **Expected**: User stays authenticated, no redirect to login
- **Verifies**:
  - Auth store maintains authentication state
  - Token is refreshed successfully
  - User is NOT redirected to login page
  - Auth state includes role, clubUUID, and other metadata

#### ✅ Should verify refresh endpoint is called on app startup
- **Scenario**: App starts with existing token
- **Expected**: `/integration/refresh-token` endpoint is called
- **Verifies**:
  - Token validation happens automatically
  - Refresh mechanism is triggered on startup

#### ✅ Should do nothing when no accessToken is stored
- **Scenario**: No token exists in localStorage (new user or logged out)
- **Expected**: No API calls, no redirects
- **Verifies**:
  - System doesn't attempt unnecessary validation
  - No side effects when starting fresh

---

### 2. Token Expiration - Invalid Token (3 tests)

#### ✅ Should clear auth state when token is invalid/expired
- **Scenario**: Server returns 401 for expired token
- **Expected**: Complete auth state reset
- **Verifies**:
  - `isAuthenticated` → false
  - `accessToken` → null
  - `role` → null
  - `clubUUID` → null
  - `isAgreedTerms` → null

#### ✅ Should redirect to login page when token is invalid
- **Scenario**: Token validation fails with 401
- **Expected**: User redirected to `/login` with `replace: true`
- **Verifies**:
  - Navigation happens with replace (no back button)
  - User cannot access protected routes

#### ✅ Should clear localStorage when token is expired
- **Scenario**: Token expires and refresh fails
- **Expected**: localStorage auth-storage is cleared
- **Verifies**:
  - Persisted state is cleaned up
  - User cannot recover invalid session after page refresh

---

### 3. Token Refresh Success (3 tests)

#### ✅ Should update accessToken when refresh succeeds
- **Scenario**: Refresh endpoint returns new token
- **Expected**: New token replaces old token in store
- **Verifies**:
  - `setAccessToken` called with new token
  - Auth state updated with refreshed token
  - User remains authenticated

#### ✅ Should store new token in both memory and localStorage
- **Scenario**: Token refresh succeeds
- **Expected**: Token synced to both apiClient (memory) and localStorage
- **Verifies**:
  - In-memory token (`apiClient.getAccessToken()`) updated
  - localStorage `auth-storage` contains new token
  - Bidirectional sync works correctly

#### ✅ Should not redirect when refresh succeeds
- **Scenario**: Token refresh completes successfully
- **Expected**: No navigation triggered
- **Verifies**:
  - User stays on current page
  - Session continues seamlessly

---

### 4. Token Refresh Failure (4 tests)

#### ✅ Should logout user when refresh endpoint returns 401
- **Scenario**: Refresh token is expired (401 Unauthorized)
- **Expected**: Complete logout with redirect to login
- **Verifies**:
  - `clearAccessToken` called
  - Auth state cleared
  - Redirect to `/login`

#### ✅ Should logout user when refresh endpoint returns 403
- **Scenario**: Refresh token is forbidden (403 Forbidden)
- **Expected**: Complete logout with redirect to login
- **Verifies**:
  - Handles 403 errors same as 401
  - User cannot bypass security checks

#### ✅ Should logout user when refresh endpoint returns 500
- **Scenario**: Server error during token refresh
- **Expected**: Safe logout (better to log out than leave in inconsistent state)
- **Verifies**:
  - Server errors trigger logout
  - System fails safely

#### ✅ Should completely clear auth state on refresh failure
- **Scenario**: Any refresh failure
- **Expected**: All auth state fields reset to null
- **Verifies**:
  - No partial state left behind
  - Clean slate for next login

---

### 5. Network Error During Refresh (3 tests)

#### ✅ Should trigger logout on network error
- **Scenario**: Network request fails (e.g., offline, DNS failure)
- **Expected**: User logged out and redirected to login
- **Verifies**:
  - Network errors handled gracefully
  - User notified via logout + redirect

#### ✅ Should clear auth state on network timeout
- **Scenario**: Request times out
- **Expected**: Auth state cleared after timeout
- **Verifies**:
  - Timeout scenarios don't leave user in limbo
  - Clean error handling

#### ✅ Should allow user to retry login after network recovery
- **Scenario**: Network fails, then recovers
- **Expected**: User can attempt login again
- **Verifies**:
  - Login endpoints remain functional after network error
  - No persistent error state

---

### 6. Session Persistence Across Page Refresh (3 tests)

#### ✅ Should recover token from localStorage after page refresh
- **Scenario**: User refreshes browser page
- **Expected**: Token recovered from localStorage and re-validated
- **Verifies**:
  - Zustand persist middleware works correctly
  - Token survives page reload
  - Re-validation happens automatically

#### ✅ Should sync apiClient with authStore on each request
- **Scenario**: Token updated in authStore
- **Expected**: apiClient always has latest token
- **Verifies**:
  - Request interceptor reads from authStore
  - In-memory and persisted state stay in sync

#### ✅ Should handle multiple page refreshes correctly
- **Scenario**: User refreshes page multiple times
- **Expected**: Each refresh re-validates and updates token
- **Verifies**:
  - No memory leaks or stale state
  - Hook cleanup works correctly
  - Multiple mount/unmount cycles handled

---

## Test Infrastructure

### Mocks Used
- **MSW (Mock Service Worker)**: HTTP interceptors for `/integration/refresh-token`
- **vi.spyOn**: Track calls to `setAccessToken` and `clearAccessToken`
- **vi.mock('react-router')**: Mock `useNavigate` hook
- **localStorage**: In-memory localStorage for Zustand persist

### Test Utilities
- **@testing-library/react**: `renderHook`, `waitFor`
- **createQueryWrapper**: Wraps hooks with QueryClient provider
- **useAuthStore.getState().reset()**: Clean state between tests

---

## Coverage Metrics

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| `useAuthInitialization.ts` | **100%** | **100%** | **100%** | **100%** |
| `authStore.ts` | **100%** | **100%** | **100%** | **100%** |
| `apiClient.ts` | 91.17% | 80% | 100% | 91.17% |
| `authApi.ts` | 25% | 100% | 25% | 25% |

---

## Critical Behaviors Verified

### ✅ Token Lifecycle
- Initial load with existing token
- Token validation on startup
- Token refresh success
- Token refresh failure
- Token expiration handling

### ✅ State Management
- Auth store synchronization
- localStorage persistence
- In-memory token sync
- Complete state cleanup on logout

### ✅ Error Handling
- 401 Unauthorized
- 403 Forbidden
- 500 Internal Server Error
- Network errors
- Timeouts

### ✅ Navigation
- Redirect to login on failure
- No redirect on success
- Replace mode (no back button)

### ✅ Security
- No partial state after errors
- Complete cleanup on logout
- Token sync between memory and storage
- Safe failure modes

---

## Future Enhancements

1. **Token Expiration Time**: Test scenarios where token has explicit expiry (if backend sends expiry metadata)
2. **Concurrent Requests**: Test behavior when multiple API calls trigger refresh simultaneously
3. **Role Changes**: Test token refresh that changes user role (LEADER → ADMIN)
4. **Performance**: Test refresh latency and caching behavior

---

## Related Files

- **Hook**: `src/features/auth/hooks/useAuthInitialization.ts`
- **Store**: `src/features/auth/store/authStore.ts`
- **API Client**: `src/shared/api/apiClient.ts`
- **Auth API**: `src/features/auth/api/authApi.ts`
- **Tests**: `src/features/auth/hooks/__tests__/useAuthInitialization.test.ts`

---

**Last Updated**: 2026-01-21
**Test Suite Version**: 1.0
**Status**: Production Ready ✅
