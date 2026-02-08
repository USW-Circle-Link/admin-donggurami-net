---
name: usw-api-reference
description: "Complete reference for USW Circle Link Server API (v1). Use this when you need to: (1) Reference API endpoints and their methods (GET, POST, PUT, DELETE, PATCH), (2) Understand request/response structures and data types, (3) Check field constraints, validation rules, and required parameters, (4) Look up HTTP error codes and custom error codes (COM, TOK, USR, CLUB, CLDR, CMEM, APT, FILE, etc.), (5) Verify role-based access control requirements (USER, LEADER, ADMIN), (6) Navigate API structure by feature (Auth, Club Leader, Admin, Applications, Forms, etc.). Base URL: https://api.donggurami.net"
---

# USW Circle Link Server API Reference

## Quick Navigation

The USW API is organized into **13 feature domains**. Use this guide to quickly find what you need.

### API Domains

| Domain | Purpose | Example Endpoints |
|--------|---------|------------------|
| **1. Auth** | Unified authentication (login, signup, password reset, withdrawal) | `POST /auth/login`, `POST /auth/signup`, `POST /auth/withdrawal/code` |
| **2. Clubs** | Club listing, info, members, management | `GET /clubs`, `GET /clubs/{clubUUID}/info`, `PUT /clubs/{clubUUID}`, `PATCH /clubs/{clubUUID}/recruit-status` |
| **3. Club Leader** | Leader-specific: intro, summary, application review | `GET /clubs/{clubUUID}/leader/intro`, `GET /clubs/{clubUUID}/leader/summary` |
| **4. Applications** | Handle club applications (submit, review, status) | `POST /clubs/{clubUUID}/applications`, `GET /clubs/{clubUUID}/applicants` |
| **5. Notices** | Create and manage notices | `POST /notices`, `GET /notices/{noticeUUID}` |
| **6. Categories** | Manage club categories | `GET /categories`, `POST /categories`, `DELETE /categories/{uuid}` |
| **7. Floor Maps** | Manage floor photos (B1, F1, F2) | `GET /floor-maps`, `PUT /floor-maps`, `DELETE /floor-maps/{floor}` |
| **8. User Profile** | User's personal info, clubs, applications, floor photos | `GET /users/me`, `PATCH /users/me`, `GET /users/me/clubs`, `GET /users/me/applications` |
| **9. Forms** | Application forms & questions | `POST /clubs/{clubUUID}/forms`, `GET /clubs/forms/{clubUUID}` |
| **10. Event Verification** | Event code verification | `POST /users/event/verify`, `GET /users/event/status` |
| **11. Health Check** | Server status | `GET /health-check` |

## Finding Endpoints

### By HTTP Method
- **GET**: Retrieve data (queries, retrievals, checks)
- **POST**: Create new resources (signup, login, applications)
- **PUT**: Replace/update resources (edit profiles, upload photos)
- **PATCH**: Partial updates (toggle recruitment, change status)
- **DELETE**: Remove resources (delete clubs, exit/withdraw)

### By Role
- **USER**: Regular user (signup, apply to clubs, view clubs)
- **LEADER**: Club leader (manage club info, members, applications)
- **ADMIN**: Administrator (manage clubs, notices, categories)

### By Feature
- **Authentication**: `/auth/login`, `/auth/signup`, `/auth/refresh`, `/auth/logout`
- **Club Management**: `/clubs/*`, `/clubs/{clubUUID}/leader/*`
- **Recruitment**: `/clubs/{clubUUID}/applications`, `/clubs/{clubUUID}/applicants`
- **User Profile**: `/users/me`, `/users/me/clubs`, `/users/me/applications`, `/users/profile/duplication-check`
- **Public Info**: `/clubs/*`, `/categories` (no auth required for some)

## Request/Response Structures

### Common Request Pattern
```json
{
  "fieldName": "value",
  "list": [{"item": "value"}]
}
```

### Common Response Pattern
```json
{
  "message": "Korean status message",
  "data": {
    "field": "value"
  }
}
```

### Pagination Response Pattern
```json
{
  "message": "List retrieved",
  "data": {
    "content": [{...}, {...}],
    "totalPages": 1,
    "totalElements": 10,
    "currentPage": 0
  }
}
```

### Error Response Pattern
```json
{
  "exception": "UserException",
  "code": "USR-201",
  "message": "사용자가 존재하지 않습니다.",
  "status": 400,
  "error": "Bad Request",
  "additionalData": null
}
```

## Common Validation Constraints

| Type | Constraint | Example |
|------|-----------|---------|
| **Account** | 5~20 chars, alphanumeric | `account` |
| **Names** | 2~30 chars, Korean/English | `userName` |
| **Passwords** | 8~20 chars, Eng+Num+Special | `password` |
| **Phone** | 11 digits, format `010XXXXXXXX` | `telephone` |
| **Student ID** | 8 digits | `studentNumber` |
| **URLs** | Valid HTTPS URL | `googleFormUrl` |
| **UUID** | Valid UUID format | `clubUUID` |
| **Hashtags** | Max 2 items, 1~6 chars each | `clubHashtag` |
| **Categories** | Max 3 items, 1~20 chars each | `clubCategoryName` |
| **Club Name** | 1~10 chars, Kor/Eng/Num | `clubName` |

## Error Code Categories

Error codes follow a prefix pattern. Use `error-codes.md` for full lookup:

| Prefix | Domain | Example |
|--------|--------|---------|
| `COM` | Common/Server | `COM-501` (Server Error) |
| `TOK` | Token/Authentication | `TOK-202` (Invalid Token) |
| `USR` | User Management | `USR-201` (User Not Found) |
| `PFL` | Profile | `PFL-204` (Duplicate Profile) |
| `CLUB` | Club | `CLUB-201` (Club Not Found) |
| `CLDR` | Club Leader | `CLDR-202` (Wrong Password) |
| `CMEM` | Club Member | `CMEM-201` (Member Not Found) |
| `APT` | Applicant | `APT-205` (Already Applied) |
| `FILE` | File Upload | `FILE-311` (Unsupported Format) |
| `NOT` | Notice | `NOT-201` (Notice Not Found) |
| `CTG` | Category | `CTG-201` (Category Not Found) |
| `CINT` | Club Intro | `CINT-201` (Intro Not Found) |
| `EMAIL_TOKEN` | Email | `EMAIL_TOKEN-002` (Token Expired) |
| `AC` | Auth Code | `AC-101` (Code Mismatch) |
| `WT` | Withdrawal Token | `WT-102` (Token Not Found) |

## Access Control

### Public Endpoints (no auth required)
- `GET /clubs` - Browse clubs
- `GET /clubs/open` - Browse recruiting clubs
- `GET /categories` - Browse categories
- `POST /auth/login` - Unified login
- `POST /auth/signup` - Register
- `POST /auth/signup/verification-mail` - Send verification email
- `POST /auth/signup/verify` - Verify email
- `POST /auth/find-id` - Find account
- `POST /auth/password/*` - Password reset flow
- `GET /auth/check-Id` - Check ID duplication
- `GET /health-check` - Server status

### Protected by Role
- **USER**: Profile management, my clubs/applications, event verification
- **LEADER**: Club intro/summary, application review via `/clubs/{clubUUID}/leader/*`
- **ADMIN**: Admin functions (notices, categories, clubs CRUD, floor maps)

### Token Handling
- **Access Token**: JWT in Authorization header (`Bearer {token}`)
- **Refresh Token**: JWT in httpOnly cookies
- **Refresh Endpoint**: `POST /auth/refresh`
- **Unified Login**: `POST /auth/login` returns role-specific response (USER/LEADER/ADMIN)
- **Client-Side Implementation**:
  - Zustand store persists `isAuthenticated` and `accessToken`
  - apiClient initializes token from localStorage on app start
  - Automatic token validation on app startup via `AuthInitializer` component
  - Protected routes redirect unauthenticated users to `/login`

## Working with Specific Features

### Authentication Flow (New Unified Auth)
- **Login**: `POST /auth/login` (supports USER, LEADER, ADMIN roles)
- **Signup**: `POST /auth/signup/verification-mail` → `POST /auth/signup/verify` → `POST /auth/signup`
- **Password Reset**: `POST /auth/password/reset-code` → `POST /auth/password/verify` → `PATCH /auth/password/reset`
- **Withdrawal**: `POST /auth/withdrawal/code` → `DELETE /users/me` (with authCode)
- **Token Refresh**: `POST /auth/refresh`
- **Logout**: `POST /auth/logout`

### Managing Club Information
- **Get Info**: `GET /clubs/{clubUUID}/info`
- **Update Info**: `PUT /clubs/{clubUUID}` (multipart: mainPhoto + clubInfoRequest + leaderUpdatePwRequest)
- **Get Intro** (Leader): `GET /clubs/{clubUUID}/leader/intro`
- **Update Intro** (Leader): `PUT /clubs/{clubUUID}/leader/intro` (multipart: introPhotos + clubIntroRequest)
- **Get Summary** (Leader): `GET /clubs/{clubUUID}/leader/summary`
- **Toggle Recruitment**: `PATCH /clubs/{clubUUID}/recruit-status`
- **Fields**: leaderName, leaderHp, clubInsta, clubRoomNumber, hashtags, categories

### Handling Applications
- **Check Eligibility**: `GET /clubs/{clubUUID}/applications/eligibility`
- **Submit**: `POST /clubs/{clubUUID}/applications` (with answers array)
- **List Applicants**: `GET /clubs/{clubUUID}/applicants?status=WAIT|PASS|FAIL`
- **Get Detail** (User): `GET /clubs/{clubUUID}/applications/{aplictUUID}`
- **Get Detail** (Leader): `GET /clubs/{clubUUID}/leader/applications/{applicationUUID}` (marks as read)
- **Update Status** (Leader): `PATCH /clubs/{clubUUID}/leader/applications/{applicationUUID}/status`
- **Send Notifications**: `POST /clubs/{clubUUID}/applicants/notifications`

### File Uploads
- **Photos**: JPEG/PNG only, max 5 files per request
- **Excel**: XLS/XLSX for member imports
- **Floor Maps**: Binary upload via `PUT /floor-maps`
- **Response**: Includes presigned URLs for uploaded files

### Categories (New Endpoints)
- **List**: `GET /categories`
- **Create**: `POST /categories` (admin only)
- **Delete**: `DELETE /categories/{clubCategoryUUID}` (admin only)

### Floor Maps (New Endpoints)
- **Get**: `GET /floor-maps?floor=B1|F1|F2`
- **Upload**: `PUT /floor-maps` (multipart: B1, F1, F2 files)
- **Delete**: `DELETE /floor-maps/{floorEnum}`

### Forms Management
- **Create Form**: `POST /clubs/{clubUUID}/forms` (all at once: form + questions + options)
- **Get Active Form**: `GET /clubs/forms/{clubUUID}`
- **Submit Application**: `POST /clubs/{clubUUID}/applications` (with answers referencing questionId)

### Event Verification (New)
- **Verify Code**: `POST /users/event/verify` (with event code)
- **Check Status**: `GET /users/event/status`

## Reference Files

- **Full API Endpoint Reference**: `references/api-endpoints.md` - Complete endpoint definitions, request/response bodies, all constraints
- **Error Code Lookup**: `references/error-codes.md` - All error codes with messages and HTTP status codes

## Grep Search Patterns

Use these patterns to quickly search the reference files:

**Find endpoint by path:**
```bash
grep "^##### GET /path/to/endpoint"
grep "^##### POST /path/to/endpoint"
```

**Find error by code:**
```bash
grep "| \`ERROR-XXX\`"
```

**Find all endpoints in a domain:**
```bash
grep -A50 "^### 1\. Auth"
grep -A50 "^### 4\. Applications"
```

**Find all 404 errors:**
```bash
grep "| 404 |"
```

**Find constraints table:**
```bash
grep -B2 "Constraints:"
```
