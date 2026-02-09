---
name: usw-api-reference
description: "Complete reference for USW Circle Link Server API (v1). Use this when you need to: (1) Reference API endpoints and their methods (GET, POST, PUT, DELETE, PATCH), (2) Understand request/response structures and data types, (3) Check field constraints, validation rules, and required parameters, (4) Look up HTTP error codes and custom error codes (COM, TOK, USR, CLUB, CLDR, CMEM, APT, FILE, etc.), (5) Verify role-based access control requirements (USER, LEADER, ADMIN), (6) Navigate API structure by feature (Auth, Clubs, Applications, Forms, User, Notices, etc.). Base URL: https://api.donggurami.net"
---

# USW Circle Link Server API Reference

## Quick Navigation

The USW API is organized into **8 feature domains**. Use this guide to quickly find what you need.

### API Domains

| Domain | Purpose | Example Endpoints |
|--------|---------|------------------|
| **1. Auth** | Unified authentication (login, signup, password reset, withdrawal) | `POST /auth/login`, `POST /auth/signup`, `POST /auth/withdrawal/code` |
| **2. Clubs** | Club management, info, members, recruitment, applicants, forms, admin CRUD | `GET /clubs`, `GET /clubs/{clubUUID}`, `PUT /clubs/{clubUUID}`, `POST /clubs/{clubUUID}/forms` |
| **3. Club Application** | Submit and view club applications | `POST /clubs/{clubUUID}/applications`, `GET /clubs/{clubUUID}/applications/eligibility` |
| **4. User** | User profile, password, my clubs, my applications | `GET /users/me`, `PATCH /users/me`, `GET /users/me/clubs`, `GET /users/me/applications` |
| **5. Notices** | Create and manage notices | `POST /notices`, `GET /notices/{noticeUUID}`, `PUT /notices/{noticeUUID}` |
| **6. Categories** | Manage club categories | `GET /categories`, `POST /categories`, `DELETE /categories/{uuid}` |
| **7. Floor Maps** | Manage floor photos (B1, F1, F2) | `GET /floor-maps`, `PUT /floor-maps`, `DELETE /floor-maps/{floor}` |
| **8. Health Check** | Server status | `GET /health-check` |

## Finding Endpoints

### By HTTP Method
- **GET**: Retrieve data (queries, retrievals, checks)
- **POST**: Create new resources (signup, login, applications, forms)
- **PUT**: Replace/update resources (edit club info, upload photos, update notices)
- **PATCH**: Partial updates (toggle recruitment, change status, update profile)
- **DELETE**: Remove resources (delete clubs, members, notices, categories)

### By Role
- **USER**: Regular user (signup, apply to clubs, view clubs, manage profile)
- **LEADER**: Club leader (manage club info, members, applications, forms)
- **ADMIN**: Administrator (create/delete clubs, manage notices, categories, floor maps)

### By Feature
- **Authentication**: `/auth/login`, `/auth/signup`, `/auth/refresh`, `/auth/logout`
- **Club Management**: `/clubs`, `/clubs/{clubUUID}` (GET, PUT, DELETE)
- **Recruitment**: `/clubs/{clubUUID}/recruit-status`, `/clubs/{clubUUID}/applicants`, `/clubs/{clubUUID}/applicants/notifications`
- **Forms & Applications**: `/clubs/{clubUUID}/forms`, `/clubs/{clubUUID}/applications`
- **Members**: `/clubs/{clubUUID}/members` (GET, DELETE)
- **User Profile**: `/users/me` (GET, PATCH, DELETE), `/users/me/password`, `/users/profile/duplication-check`
- **User Data**: `/users/me/clubs`, `/users/me/applications`, `/users/clubs/{floor}/photo`
- **Public Info**: `/clubs`, `/categories` (no auth required for some)

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
| **Hashtags** | Array of strings | `clubHashtag` |
| **Categories** | 1~20 chars each | `clubCategoryName` |
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
- **USER**: Profile management (`/users/me`), my clubs/applications
- **LEADER**: Club info update (`PUT /clubs/{clubUUID}`), form management, application review, member management
- **ADMIN**: Club creation/deletion (`POST /clubs`, `DELETE /clubs/{clubUUID}`), notices, categories, floor maps

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

### Authentication Flow (Unified Auth)
- **Login**: `POST /auth/login` (supports USER, LEADER, ADMIN roles)
- **Signup**: `POST /auth/signup/verification-mail` → `POST /auth/signup/verify` → `POST /auth/signup`
- **Password Reset**: `POST /auth/password/reset-code` → `POST /auth/password/verify` → `PATCH /auth/password/reset`
- **Withdrawal**: `POST /auth/withdrawal/code` → `DELETE /users/me` (with authCode)
- **Token Refresh**: `POST /auth/refresh`
- **Logout**: `POST /auth/logout`

### Managing Club Information
- **Get Club Detail**: `GET /clubs/{clubUUID}` (returns AdminClubInfoResponse)
- **Update Club**: `PUT /clubs/{clubUUID}` (multipart: mainPhoto + clubProfileRequest + leaderUpdatePwRequest + clubInfoRequest + infoPhotos)
- **Toggle Recruitment**: `PATCH /clubs/{clubUUID}/recruit-status`
- **Fields**: leaderName, leaderHp, clubInsta, clubRoomNumber, clubHashtag, clubCategoryName, clubInfo, clubRecruitment

### Handling Applications
- **Check Eligibility**: `GET /clubs/{clubUUID}/applications/eligibility`
- **Submit**: `POST /clubs/{clubUUID}/applications` (with answers array)
- **List Applicants**: `GET /clubs/{clubUUID}/applicants?status=WAIT|PASS|FAIL`
- **Get Detail**: `GET /clubs/{clubUUID}/applications/{aplictUUID}`
- **Update Status**: `PATCH /clubs/{clubUUID}/applications/{applicationUUID}/status`
- **Send Notifications**: `POST /clubs/{clubUUID}/applicants/notifications`

### Forms Management
- **Create Form**: `POST /clubs/{clubUUID}/forms` (all at once: description + questions + options)
- **Get Active Form**: `GET /clubs/{clubUUID}/forms`
- **Submit Application**: `POST /clubs/{clubUUID}/applications` (with answers referencing questionId)

### Admin Club Management
- **List Clubs**: `GET /clubs` (with `adminInfo=true` query param for admin data)
- **Create Club**: `POST /clubs` (with admin password verification)
- **Delete Club**: `DELETE /clubs/{clubUUID}` (requires admin password)
- **Check Duplication**: `GET /clubs/check-duplication?type={type}&val={val}`

### User Profile Management
- **Get Profile**: `GET /users/me`
- **Update Profile**: `PATCH /users/me`
- **Change Password**: `PATCH /users/me/password`
- **Delete Account**: `DELETE /users/me` (with authCode from withdrawal flow)
- **My Clubs**: `GET /users/me/clubs`
- **My Applications**: `GET /users/me/applications`

### File Uploads
- **Photos**: JPEG/PNG only, max 5 files per request, max 20MB per file, max 50MB total
- **infoPhotos**: `clubInfoRequest`에 `orders` 배열 필수 (없으면 서버가 무시함)
- **Floor Maps**: Binary upload via `PUT /floor-maps`

### Categories
- **List**: `GET /categories`
- **Create**: `POST /categories` (admin only)
- **Delete**: `DELETE /categories/{clubCategoryUUID}` (admin only)

### Floor Maps
- **Get**: `GET /floor-maps?floor=B1|F1|F2`
- **Upload**: `PUT /floor-maps` (multipart: B1, F1, F2 files)
- **Delete**: `DELETE /floor-maps/{floorEnum}`

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
grep -A50 "^### 3\. Club Application"
```

**Find all 404 errors:**
```bash
grep "| 404 |"
```

**Find constraints table:**
```bash
grep -B2 "Constraints:"
```
