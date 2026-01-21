---
name: usw-api-reference
description: "Complete reference for USW Circle Link Server API (v1). Use this when you need to: (1) Reference API endpoints and their methods (GET, POST, PUT, DELETE, PATCH), (2) Understand request/response structures and data types, (3) Check field constraints, validation rules, and required parameters, (4) Look up HTTP error codes and custom error codes (COM, TOK, USR, CLUB, CLDR, CMEM, APT, FILE, etc.), (5) Verify role-based access control requirements (USER, LEADER, ADMIN), (6) Navigate API structure by feature (Club Leader, Admin, Applicants, Forms, etc.). Base URL: https://api.donggurami.net"
---

# USW Circle Link Server API Reference

## Quick Navigation

The USW API is organized into **16 feature domains**. Use this guide to quickly find what you need.

### API Domains

| Domain | Purpose | Example Endpoints |
|--------|---------|------------------|
| **1. Club Leader** | Manage club intro, info, members, recruitment | `/club-leader/{clubUUID}/intro`, `/club-leader/{clubUUID}/info` |
| **2. Admin Notice** | Create and manage notices | `POST /notices`, `GET /notices/{noticeUUID}` |
| **3. Admin Floor Photo** | Manage floor photos (B1, F1, F2) | `PUT /admin/floor/photo/{floor}` |
| **4. Admin Club** | Manage clubs (admin only) | `POST /admin/clubs`, `DELETE /admin/clubs/{clubUUID}` |
| **5. Admin Category** | Manage club categories | `POST /admin/clubs/category` |
| **6. Club Leader Login** | Leader authentication | `POST /club-leader/login` |
| **7. Admin Login** | Admin authentication | `POST /admin/login` |
| **8. Application** | Handle club applications | `GET /apply/can-apply/{clubUUID}`, `POST /apply/{clubUUID}` |
| **9. My Page** | User's personal info | `GET /mypages/my-clubs`, `GET /mypages/aplict-clubs` |
| **10. My Notice** | User's notices | `GET /my-notices` |
| **11. Club** | Public club info | `GET /clubs`, `GET /clubs/filter` |
| **12. Integration Auth** | Login/logout/token refresh | `POST /integration/logout`, `POST /integration/refresh-token` |
| **13. User** | User management (signup, login, profile) | `POST /users/signup`, `POST /users/login` |
| **14. Profile** | Profile management | `PATCH /profiles/change`, `GET /profiles/me` |
| **15. Form Management** | Application forms & submissions | `POST /api/clubs/{clubId}/forms` |
| **16. Health Check** | Server status | `GET /health-check` |

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
- **Authentication**: `/club-leader/login`, `/admin/login`, `/users/login`, `/users/signup`
- **Club Management**: `/admin/clubs/*`, `/club-leader/*`
- **Recruitment**: `/apply/*`, `/club-leader/*/applicants`
- **User Profile**: `/profiles/*`, `/users/*`
- **Public Info**: `/clubs/*` (no auth required)

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
| **Names** | 2~30 chars, Korean/English | `userName` |
| **Passwords** | 8~20 chars, Eng+Num+Special | `newPw` |
| **Phone** | 11 digits, format `010XXXXXXXX` | `userHp` |
| **Student ID** | 8 digits | `studentNumber` |
| **URLs** | Valid HTTPS URL | `googleFormUrl` |
| **UUID** | Valid UUID format | `clubUUID` |
| **Hashtags** | Max 2 items, 1~6 chars each | `clubHashtag` |
| **Categories** | Max 3 items, 1~20 chars each | `clubCategoryName` |

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

## Access Control

### Public Endpoints (no auth required)
- `GET /clubs` - Browse clubs
- `GET /clubs/categories` - Browse categories
- `POST /users/signup` - Register
- `POST /users/login` - Login
- `POST /admin/login` - Admin login
- `POST /club-leader/login` - Leader login
- Email verification, password reset endpoints

### Protected by Role
- **USER**: My page, apply, profile management
- **LEADER**: Club management (with role verification via clubUUID)
- **ADMIN**: Admin functions (notices, categories, clubs, floors)

### Token Handling
- **Access Token**: JWT persisted in localStorage (recovered on app refresh), synced with in-memory storage
- **Refresh Token**: JWT in httpOnly cookies
- **Refresh Endpoint**: `POST /integration/refresh-token`
- **Client-Side Implementation**:
  - Zustand store persists `isAuthenticated` and `accessToken`
  - apiClient initializes token from localStorage on app start
  - Automatic token validation on app startup via `AuthInitializer` component
  - Protected routes redirect unauthenticated users to `/login`
  - Valid token → auto-redirect to dashboard; Invalid/expired → auto-redirect to login

## Working with Specific Features

### Managing Club Information
- **Get**: `GET /club-leader/{clubUUID}/info`
- **Update**: `PUT /club-leader/{clubUUID}/info` (multipart: mainPhoto + clubInfoRequest)
- **Fields**: leaderName, leaderHp, clubInsta, clubRoomNumber, hashtags, categories

### Handling Applications
- **Submit**: `POST /apply/{clubUUID}` (user applies to club)
- **Review**: `GET /club-leader/{clubUUID}/applicants` (leader views)
- **Update Status**: `POST /club-leader/{clubUUID}/applicants/notifications` (accept/reject)

### File Uploads
- **Photos**: JPEG/PNG only, max 5 files per request
- **Excel**: XLS/XLSX for member imports
- **Response**: Includes presigned URLs for uploaded files

### Forms Management
- **Create**: `POST /api/clubs/{clubId}/forms` (all at once: form + questions + options)
- **Status**: `PATCH /api/clubs/{clubId}/forms/{formId}/status` (DRAFT → PUBLISHED → CLOSED)
- **Submit**: `POST /api/clubs/{clubId}/forms/{formId}/applications` (user submits)
- **Review**: `GET /api/clubs/{clubId}/applications/{applicationId}` (leader reviews, auto-marks read)

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
grep -A50 "^### 1\. Club Leader"
grep -A50 "^### 13\. User"
```

**Find all 404 errors:**
```bash
grep "| 404 |"
```

**Find constraints table:**
```bash
grep -B2 "Constraints:"
```
