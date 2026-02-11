# USW Circle Link Server API v1

## 서버 정보
- Base URL : `https://api.donggurami.net`
- API 버전: OAS 3.1
- 최신 업데이트: 2026-02-11 (v3 api-docs 동기화)

## ⚠️ Error Response Structure (공통)

모든 API는 에러 발생 시 아래와 같은 JSON 형식을 반환합니다.

```json
{
  "exception": "UserException",
  "code": "USR-201",
  "message": "사용자가 존재하지 않습니다.",
  "status": 400,
  "error": "Bad Request",
  "additionalData": null // 유효성 검사 실패 시 필드별 에러 정보 포함
}
```

---

## 📚 API 엔드포인트 목록

### 1. Auth (통합 인증 API)

#### 1.1 로그인/로그아웃

##### POST `/auth/login`
통합 로그인 (USER, LEADER, ADMIN 지원)

**Request Body:**
```json
{
  "account": "string",
  "password": "string",
  "fcmToken": "string",
  "clientId": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `account` | String | **Yes** | 5~20 chars, Alphanumeric | 계정 ID |
| `password` | String | **Yes** | 8~20 chars, Eng+Num+Special | 비밀번호 |
| `fcmToken` | String | No | - | FCM 토큰 |
| `clientId` | String | No | - | 클라이언트 ID |

**Potential Errors:**
*   `USR-211`: 아이디 혹은 비밀번호가 일치하지 않습니다.
*   `USR-201`: 사용자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "로그인 성공",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token",
    "role": "USER | LEADER | ADMIN",
    "clubuuid": "uuid",
    "isAgreedTerms": true
  }
}
```

##### POST `/auth/logout`
로그아웃

**Response (200):**
```json
{
  "message": "로그아웃 성공",
  "data": null
}
```

##### POST `/auth/refresh`
토큰 갱신

**Potential Errors:**
*   `TOK-202`: 유효하지 않은 토큰입니다.

**Response (200):**
```json
{
  "message": "토큰 갱신 성공",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

#### 1.2 회원가입

##### POST `/auth/signup/verification-mail`
인증 메일 전송

**Request Body:**
```json
{
  "email": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | **Yes** | 영문, 숫자, ., _, - | 이메일 (도메인 없이 ID만 입력) |

**Potential Errors:**
*   `EMAIL_TOKEN-003`: 이메일 토큰 생성중 오류가 발생했습니다.

**Response (200):**
```json
{
  "message": "인증 메일 전송 완료",
  "data": {
    "emailToken_uuid": "uuid",
    "email": "string"
  }
}
```

##### POST `/auth/signup/verify`
이메일 인증 확인

**Request Body:**
```json
{
  "email": "string"
}
```

**Potential Errors:**
*   `EMAIL_TOKEN-005`: 인증이 완료되지 않은 이메일 토큰입니다.

**Response (200):**
```json
{
  "message": "인증 확인 완료",
  "data": {
    "emailTokenUUID": "uuid",
    "signupUUID": "uuid"
  }
}
```

##### POST `/auth/signup`
회원가입 완료

**Request Headers:**
- `emailTokenUUID`: UUID
- `signupUUID`: UUID

**Request Body:**
```json
{
  "account": "string",
  "password": "string",
  "confirmPassword": "string",
  "userName": "string",
  "telephone": "string",
  "studentNumber": "string",
  "major": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `account` | String | **Yes** | 5~20 chars, Alphanumeric | 아이디 |
| `password` | String | **Yes** | 8~20 chars, Eng+Num+Special | 비밀번호 |
| `confirmPassword` | String | **Yes** | Match `password` | 비밀번호 확인 |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `telephone` | String | **Yes** | 11 digits | 전화번호 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `major` | String | **Yes** | 1~20 chars | 학과 |

**Potential Errors:**
*   `USR-219`: 요청 받은 SIGNUPUUID가 일치하지 않습니다.
*   `USR-206`: 이미 존재하는 회원입니다.
*   `USR-207`: 계정이 중복됩니다.

**Response (200):**
```json
{
  "message": "회원가입이 정상적으로 완료되었습니다.",
  "data": null
}
```

##### GET `/auth/check-Id`
아이디 중복 확인

**Query Parameters:**
- `Id`: 확인할 아이디 (required)

**Response (200):**
```json
{
  "message": "사용 가능한 ID 입니다.",
  "data": null
}
```

#### 1.3 비밀번호 찾기/재설정

##### POST `/auth/find-id`
아이디 찾기

**Request Body:**
```json
{
  "email": "string"
}
```

**Potential Errors:**
*   `USR-201`: 사용자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "계정 정보 전송 완료",
  "data": null
}
```

##### POST `/auth/password/reset-code`
비밀번호 재설정 인증코드 전송

**Request Body:**
```json
{
  "userAccount": "string",
  "email": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userAccount` | String | **Yes** | 5~20 chars, Alphanumeric | 아이디 |
| `email` | String | **Yes** | - | 이메일 (학번만 입력) |

**Potential Errors:**
*   `USR-209`: 올바르지 않은 이메일 혹은 아이디입니다.

**Response (200):**
```json
{
  "message": "인증코드가 전송되었습니다",
  "data": "uuid"
}
```

##### POST `/auth/password/verify`
인증 코드 검증

**Request Headers:**
- `uuid`: 인증 UUID

**Request Body:**
```json
{
  "authCode": "string"
}
```

**Potential Errors:**
*   `AC-101`: 인증번호가 일치하지 않습니다.
*   `AC-102`: 인증 코드 토큰이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "인증 코드 검증이 완료되었습니다",
  "data": null
}
```

##### PATCH `/auth/password/reset`
비밀번호 재설정

**Request Headers:**
- `uuid`: 인증 UUID

**Request Body:**
```json
{
  "password": "string",
  "confirmPassword": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `password` | String | **Yes** | 8~20 chars, Eng+Num+Special | 새 비밀번호 |
| `confirmPassword` | String | **Yes** | Match `password` | 새 비밀번호 확인 |

**Potential Errors:**
*   `USR-202`: 두 비밀번호가 일치하지 않습니다.
*   `USR-217`: 현재 비밀번호와 같은 비밀번호로 변경할 수 없습니다.

**Response (200):**
```json
{
  "message": "비밀번호가 변경되었습니다.",
  "data": null
}
```

#### 1.4 회원 탈퇴

##### POST `/auth/withdrawal/code`
탈퇴 인증 메일 전송

**권한:** 인증 필요 (Bearer Token)

**Description:**
회원 탈퇴를 위한 인증 메일을 발송합니다. 이메일로 6자리 인증코드가 전송됩니다.

**Potential Errors:**
*   `TOK-204`: 인증되지 않은 사용자입니다.

**Response (200):**
```json
{
  "message": "탈퇴를 위한 인증 메일이 전송 되었습니다",
  "data": null
}
```

**Flow:**
1. `POST /auth/withdrawal/code` - 인증 메일 전송
2. 이메일에서 6자리 인증코드 수신
3. `DELETE /users/me` - 인증코드로 탈퇴 완료

---

### 2. Clubs (동아리 API)

> **NOTE**: 모든 동아리 관련 API가 `/clubs` 경로로 통합됨.
> - `GET /clubs/{clubUUID}` 하나로 동아리 상세 정보 (info + profile + photos) 모두 조회
> - `PUT /clubs/{clubUUID}` 하나로 프로필 + 소개 + 사진 모두 수정 가능
> - `GET /clubs/{clubUUID}/applications/{aplictUUID}`
> - `GET /clubs` with query parameters (open/filter/adminInfo)
> - `POST /clubs` (admin 동아리 생성)
> - `DELETE /clubs/{clubUUID}` (admin 동아리 삭제)
> - `GET /clubs/check-duplication` (이름/계정 중복 확인)

#### 2.1 동아리 조회

##### GET `/clubs`
동아리 조회

**권한:** 공개 (인증 불필요)

**Query Parameters:**

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `open` | Boolean | No | 모집 중인 동아리만 조회 |
| `filter` | Array of Strings | No | 검색 키워드 배열 |
| `adminInfo` | Boolean | No | 관리자 정보 포함 여부 |

**Response (200):**
```json
{
  "message": "전체 동아리 조회 완료",
  "data": [
    {
      "clubUUID": "uuid",
      "clubName": "string",
      "mainPhotoUrl": "url",
      "department": "string",
      "hashtags": ["string"],
      "leaderName": "string",
      "leaderHp": "string",
      "memberCount": 15,
      "recruitmentStatus": "OPEN"
    }
  ]
}
```

##### GET `/clubs/{clubUUID}`
동아리 상세 조회 (AdminClubInfoResponse)

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "동아리 상세 조회 성공",
  "data": {
    "clubUUID": "uuid",
    "mainPhoto": "url",
    "infoPhotos": ["url"],
    "clubName": "string",
    "leaderName": "string",
    "leaderHp": "string",
    "clubInsta": "string",
    "clubInfo": "string",
    "recruitmentStatus": "OPEN | CLOSE",
    "googleFormUrl": "string",
    "clubHashtags": ["string"],
    "clubCategoryNames": ["string"],
    "clubRoomNumber": "string",
    "clubRecruitment": "string"
  }
}
```

#### 2.2 동아리 관리

##### POST `/clubs`
동아리 생성 (Admin)

**Request Body:**
```json
{
  "leaderAccount": "string",
  "leaderPw": "string",
  "leaderPwConfirm": "string",
  "clubName": "string",
  "department": "학술",
  "adminPw": "string",
  "clubRoomNumber": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderAccount` | String | **Yes** | 5~20 chars, Alphanumeric | 회장 ID |
| `leaderPw` | String | **Yes** | 8~20 chars, Eng+Num+Special | 회장 PW |
| `leaderPwConfirm` | String | **Yes** | Match `leaderPw` | PW 확인 |
| `clubName` | String | **Yes** | 1~10 chars, Kor/Eng/Num | 동아리명 |
| `department` | String | **Yes** | Enum (학술, 종교, 예술, 체육, 공연, 봉사) | 학부/분과 |
| `adminPw` | String | **Yes** | - | 관리자 PW 확인 |
| `clubRoomNumber` | String | **Yes** | Valid Format | 동아리방 호수 |

**Response (200):**
```json
{
  "message": "동아리 생성 성공",
  "data": "uuid"
}
```

##### PUT `/clubs/{clubUUID}`
동아리 통합 수정 (프로필 + 소개 + 사진)

> **NOTE**: 프로필, 소개 정보, 비밀번호 변경, 사진 업로드를 하나의 엔드포인트에서 처리. 각 part는 선택적으로 포함 가능.

**Request Body (Multipart):**
```json
{
  "mainPhoto": "file",
  "clubProfileRequest": {
    "leaderName": "string",
    "leaderHp": "01012345678",
    "clubInsta": "string",
    "clubRoomNumber": "string",
    "clubHashtag": ["string"],
    "clubCategoryName": ["string"]
  },
  "leaderUpdatePwRequest": {
    "leaderPw": "string",
    "newPw": "string",
    "confirmNewPw": "string"
  },
  "clubInfoRequest": {
    "clubInfo": "string",
    "recruitmentStatus": "OPEN",
    "clubRecruitment": "string",
    "googleFormUrl": "string",
    "orders": [1, 2],
    "deletedOrders": [3]
  },
  "infoPhotos": ["file"]
}
```

**Constraints (`clubProfileRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderName` | String | No | 2~30 chars, Kor/Eng only | 회장 이름 |
| `leaderHp` | String | No | 11 digits, starts with 01 | 회장 전화번호 (하이픈 제외) |
| `clubInsta` | String | No | Instagram URL regex: `^(https?://)?(www\.)?instagram\.com/.+$\|^$` | 인스타그램 링크 (빈 문자열 허용) |
| `clubRoomNumber` | String | No | - | 동아리방 호수 |
| `clubHashtag` | List | No | - | 해시태그 목록 |
| `clubCategoryName` | List | No | 1~20 chars each | 카테고리 목록 |

**Constraints (`leaderUpdatePwRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderPw` | String | **Yes** | - | 현재 비밀번호 |
| `newPw` | String | **Yes** | 8~20 chars, Eng+Num+Special | 새 비밀번호 |
| `confirmNewPw` | String | **Yes** | Match `newPw` | 새 비밀번호 확인 |

**Constraints (`clubInfoRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `clubInfo` | String | No | Max 3000 chars | 동아리 소개글 |
| `recruitmentStatus` | String | No | `OPEN`, `CLOSE` | 모집 상태 (Enum) |
| `clubRecruitment` | String | No | Max 3000 chars | 모집 공고글 |
| `googleFormUrl` | String | No | Valid HTTPS URL | 구글 폼 링크 |
| `orders` | List\<int\> | No | - | 기존 사진 순서 유지 목록 |
| `deletedOrders` | List\<int\> | No | - | 삭제할 사진 순서 목록 |

**File Upload Constraints:**
*   단일 파일 최대 20MB, 전체 최대 50MB
*   JPEG/PNG만 지원, 최대 5장
*   `infoPhotos` 업로드 시 `clubInfoRequest`에 `orders` 배열 필수 (없으면 서버가 무시함)
*   `orders`: 새 사진이 배치될 위치 (1-indexed), `infoPhotos` 파일 순서와 대응
*   `deletedOrders`: 삭제할 기존 사진 위치 (1-indexed)

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CLUB-204`: 동아리 사진이 존재하지 않습니다.
*   `CLDR-202`: 동아리 회장 비밀번호가 일치하지 않습니다.
*   `USR-202`: 두 비밀번호(새 비밀번호)가 일치하지 않습니다.
*   `USR-217`: 현재 비밀번호와 같은 비밀번호로 변경할 수 없습니다.
*   `CTG-201`: 존재하지 않는 카테고리입니다.
*   `CINT-303`: 모집 상태가 올바르지 않습니다.
*   `FILE-308`: 업로드 가능한 갯수를 초과했습니다 (사진).
*   `FILE-311`: 지원하지 않는 파일 확장자입니다.

**Response (200):**
```json
{
  "message": "동아리 정보 수정 성공",
  "data": null
}
```

##### DELETE `/clubs/{clubUUID}`
동아리 삭제

**Request Body:**
```json
{
  "adminPw": "string"
}
```

**Potential Errors:**
*   `ADM-201`: 해당 계정이 존재하지 않습니다.
*   `ADM-202`: 관리자 비밀번호가 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리 삭제 성공",
  "data": 1
}
```

#### 2.3 동아리 회원 관리

##### GET `/clubs/{clubUUID}/members`
동아리 회원 목록 조회

**Query Parameters:**
- `sort`: 정렬 기준 (optional, default: "default")

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `PFL-208`: 유효하지 않은 회원 종류입니다 (sort 파라미터 오류).

**Response (200):**
```json
{
  "message": "동아리 회원 목록 조회 완료",
  "data": [
    {
      "clubMemberUUID": "uuid",
      "userName": "string",
      "major": "string",
      "studentNumber": "string",
      "userHp": "string",
      "memberType": "REGULARMEMBER | NONMEMBER"
    }
  ]
}
```

##### DELETE `/clubs/{clubUUID}/members`
동아리 회원 퇴출 (다수)

**Request Body:**
```json
[
  {
    "clubMemberUUID": "uuid"
  }
]
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `clubMemberUUID` | UUID | **Yes** | Valid UUID | 삭제할 회원 ID |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CMEM-201`: 동아리 회원이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리 회원 삭제 완료",
  "data": null
}
```

#### 2.4 지원자 관리

##### GET `/clubs/{clubUUID}/applicants`
지원자 목록 조회

**Query Parameters:**
- `status`: 지원 상태 필터 (`WAIT`, `PASS`, `FAIL`) (optional)
- `isResultPublished`: 결과 발표 여부 필터 (boolean) (optional)

**Response (200):**
```json
{
  "message": "지원자 목록 조회 성공",
  "data": [
    {
      "aplictUUID": "uuid",
      "userName": "string",
      "major": "string",
      "studentNumber": "string",
      "userHp": "string",
      "status": "WAIT | PASS | FAIL"
    }
  ]
}
```

##### GET `/clubs/{clubUUID}/applications/{aplictUUID}`
지원서 상세 조회

**Response (200):**
```json
{
  "message": "지원서 상세 조회 성공",
  "data": {
    "aplictUUID": "uuid",
    "applicantName": "string",
    "studentNumber": "string",
    "department": "string",
    "submittedAt": "2026-03-02T14:00:00",
    "status": "WAIT | PASS | FAIL",
    "qnaList": [
      {
        "question": "질문 내용",
        "answer": "답변 내용",
        "optionId": 123
      }
    ]
  }
}
```

##### PATCH `/clubs/{clubUUID}/applications/{applicationUUID}/status`
지원서 상태 변경

**Request Body:**
```json
{
  "status": "WAIT | PASS | FAIL"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `status` | String | **Yes** | `WAIT`, `PASS`, `FAIL` | 변경할 상태 |

**Response (200):**
```json
{
  "message": "지원서 상태 변경 완료",
  "data": null
}
```

##### POST `/clubs/{clubUUID}/applicants/notifications`
지원 결과 알림 전송

**Request Body:**
```json
[
  {
    "aplictUUID": "uuid"
  },
  {
    "aplictUUID": "uuid"
  }
]
```

**Constraints:**

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `aplictUUID` | UUID | **Yes** | 알림을 전송할 지원자 UUID |

**Potential Errors:**
*   `APT-202`: 유효한 지원자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "지원 결과 알림 전송 완료",
  "data": null
}
```

#### 2.5 모집 상태

##### GET `/clubs/{clubUUID}/recruit-status`
모집 상태 조회

**Response (200):**
```json
{
  "message": "모집 상태 조회 성공",
  "data": {
    "recruitmentStatus": "OPEN | CLOSE"
  }
}
```

##### PATCH `/clubs/{clubUUID}/recruit-status`
모집 상태 토글

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CINT-201`: 해당 동아리 소개글이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "모집 상태 변경 완료",
  "data": null
}
```

#### 2.6 기타

##### PATCH `/clubs/terms/agreement`
약관 동의 완료 업데이트

**Response (200):**
```json
{
  "message": "약관 동의 완료",
  "data": null
}
```

##### PATCH `/clubs/fcmtoken`
FCM 토큰 갱신

**Request Body:**
```json
{
  "fcmToken": "string"
}
```

**Response (200):**
```json
{
  "message": "fcm token 갱신 완료",
  "data": null
}
```

##### GET `/clubs/check-duplication`
중복 확인

> **NOTE**: 기존 `GET /admin/clubs/name/check`과 `GET /admin/clubs/leader/check`이 이 단일 엔드포인트로 통합됨.

**Query Parameters:**
- `type`: 확인 유형 (name, leader)
- `val`: 확인할 값

**Response (200):**
```json
{
  "message": "사용 가능합니다.",
  "data": null
}
```

---

### 3. Club Application (지원 API)

##### GET `/clubs/{clubUUID}/applications/eligibility`
지원 가능 여부 확인

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "지원 가능",
  "data": true
}
```

##### POST `/clubs/{clubUUID}/applications`
지원서 제출

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 101,
      "optionId": 501,
      "answerText": null
    },
    {
      "questionId": 102,
      "optionId": null,
      "answerText": "열심히 하겠습니다!"
    }
  ]
}
```

**Constraints (`answers` Item):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `questionId` | Long | **Yes** | - | 질문 ID |
| `optionId` | Long | No | - | 선택지 ID (RADIO/DROPDOWN/CHECKBOX) |
| `answerText` | String | No | - | 답변 텍스트 (SHORT_TEXT/LONG_TEXT) |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `APT-205`: 이미 지원한 동아리입니다.
*   `APT-206`: 이미 해당 동아리 회원입니다.

**Response (201):**
```json
{
  "message": "지원서 제출 성공",
  "data": null
}
```

##### DELETE `/clubs/{clubUUID}/applications`
지원자 삭제 (다수)

**권한:** 회장 (LEADER)

**Request Body:**
```json
["uuid1", "uuid2"]
```

> **NOTE**: UUID 문자열 배열로 직접 전달 (객체 wrapping 없음)

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| (array item) | UUID | **Yes** | Valid UUID | 삭제할 지원자 UUID |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `APT-201`: 지원서가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "지원자 삭제 완료",
  "data": null
}
```

##### GET `/clubs/{clubUUID}/applications/{aplictUUID}`
지원서 상세 조회 (사용자용)

**Response (200):**
```json
{
  "message": "지원서 상세 조회 성공",
  "data": {
    "aplictUUID": "uuid",
    "applicantName": "string",
    "studentNumber": "string",
    "department": "string",
    "submittedAt": "2026-03-02T14:00:00",
    "status": "WAIT",
    "qnaList": [...]
  }
}
```

---

### 4. Forms (지원서 폼 관리)

#### 4.1 질문 유형 (Question Types)

| TYPE | 설명 |
| :--- | :--- |
| `RADIO` | 단일 선택 (라디오) |
| `CHECKBOX` | 다중 선택 |
| `DROPDOWN` | 단일 선택 (드롭다운) |
| `SHORT_TEXT` | 단답형 |
| `LONG_TEXT` | 서술형 |

#### 4.2 폼 관리 API

##### POST `/clubs/{clubUUID}/forms`
지원서 폼 생성 (통합)

**권한:** 회장 (LEADER)

**설명:** 지원서 기본 정보, 질문, 옵션을 일괄 생성. 기본 상태는 DRAFT

**Request Body:**
```json
{
  "description": "열정 있는 개발자를 찾습니다!",
  "questions": [
    {
      "sequence": 1,
      "type": "RADIO",
      "content": "학년을 선택해주세요.",
      "required": true,
      "options": [
        {"sequence": 1, "content": "1학년", "value": "1"},
        {"sequence": 2, "content": "2학년", "value": "2"}
      ]
    },
    {
      "sequence": 2,
      "type": "CHECKBOX",
      "content": "관심 분야 (다중 선택)",
      "required": false,
      "options": [
        {"sequence": 1, "content": "백엔드"},
        {"sequence": 2, "content": "프론트엔드"}
      ]
    },
    {
      "sequence": 3,
      "type": "LONG_TEXT",
      "content": "지원 동기 및 포부",
      "required": true,
      "options": []
    }
  ]
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `description` | String | No | 0~500 chars | 폼 설명 |
| `questions` | Array | **Yes** | - | 질문 목록 |

**Response (201):**
```json
{
  "message": "지원서 폼 생성 성공",
  "data": {
    "formId": "uuid"
  }
}
```

**Potential Errors:**
*   `400`: 요청 오류
*   `403`: 권한 없음
*   `404`: 동아리 없음

##### GET `/clubs/{clubUUID}/forms`
지원서 폼 조회

**권한:** 인증 필요

**Response (200):**
```json
{
  "message": "지원서 폼 조회 성공",
  "data": {
    "formId": 101,
    "questions": [
      {
        "questionId": 101,
        "sequence": 1,
        "type": "RADIO",
        "content": "학년을 선택해주세요.",
        "required": true,
        "options": [
          { "optionId": 501, "content": "1학년" }
        ]
      }
    ]
  }
}
```

> **NOTE**: OptionResponse는 `optionId`와 `content`만 포함하며, `value`와 `sequence` 필드는 제거됨.

---

### 5. Notices (공지사항 관리)

##### GET `/notices`
공지사항 목록 조회 (페이지네이션)

**권한:** 인증 필요

**Query Parameters:**
- `page`: 페이지 번호 (default: 0)
- `size`: 페이지 크기 (default: 10)

**Response (200):**
```json
{
  "message": "공지사항 리스트 조회 성공",
  "data": {
    "content": [
      {
        "noticeUUID": "uuid",
        "noticeTitle": "string",
        "noticeCreatedAt": "2023-01-01T00:00:00",
        "authorName": "string"
      }
    ],
    "totalPages": 1,
    "totalElements": 10,
    "currentPage": 0
  }
}
```

##### POST `/notices`
공지사항 생성

**권한:** ADMIN

**Request Body (Multipart):**
```json
{
  "request": {
    "noticeTitle": "string",
    "noticeContent": "string",
    "photoOrders": [1, 2]
  },
  "photos": ["file"]
}
```

**Constraints (`request`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `noticeTitle` | String | **Yes** | 1~200 chars | 제목 |
| `noticeContent` | String | **Yes** | 1~3000 chars | 내용 |
| `photoOrders` | List | No | Max 5 items, Value 1~5 | 사진 순서 |

**Potential Errors:**
*   `NOT-202`: 최대 5개의 사진이 업로드 가능합니다.
*   `NOT-205`: 사진 순서는 1에서 5 사이여야 합니다.

**Response (200):**
```json
{
  "message": "공지사항 생성 성공",
  "data": ["presigned_url1", "presigned_url2"]
}
```

##### GET `/notices/{noticeUUID}`
공지사항 상세 조회

**권한:** 인증 필요

**Potential Errors:**
*   `NOT-201`: 공지사항이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "공지사항 조회 성공",
  "data": {
    "noticeUUID": "uuid",
    "noticeTitle": "string",
    "noticeContent": "string",
    "noticePhotos": ["url"],
    "noticeCreatedAt": "2023-01-01T00:00:00",
    "authorName": "string"
  }
}
```

##### PUT `/notices/{noticeUUID}`
공지사항 수정

**권한:** ADMIN

**Request Body (Multipart):** Same as POST

**Response (200):**
```json
{
  "message": "공지사항 수정 성공",
  "data": ["presigned_url"]
}
```

##### DELETE `/notices/{noticeUUID}`
공지사항 삭제

**권한:** ADMIN

**Potential Errors:**
*   `NOT-201`: 공지사항이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "공지사항 삭제 성공",
  "data": "uuid"
}
```

---

### 6. Categories (카테고리 관리)

##### GET `/categories`
카테고리 목록 조회

**권한:** 공개 (인증 불필요)

**Response (200):**
```json
{
  "message": "카테고리 리스트 조회 성공",
  "data": [
    {
      "clubCategoryUUID": "uuid",
      "clubCategoryName": "string"
    }
  ]
}
```

##### POST `/categories`
카테고리 추가

**권한:** ADMIN

**Request Body:**
```json
{
  "clubCategoryName": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `clubCategoryName` | String | **Yes** | 1~20 chars | 카테고리명 |

**Potential Errors:**
*   `CTG-203`: 이미 존재하는 카테고리입니다.

**Response (200):**
```json
{
  "message": "카테고리 추가 성공",
  "data": {
    "clubCategoryUUID": "uuid",
    "clubCategoryName": "string"
  }
}
```

##### DELETE `/categories/{clubCategoryUUID}`
카테고리 삭제

**권한:** ADMIN

**Potential Errors:**
*   `CTG-201`: 존재하지 않는 카테고리입니다.

**Response (200):**
```json
{
  "message": "카테고리 삭제 성공",
  "data": {
    "clubCategoryUUID": "uuid",
    "clubCategoryName": "string"
  }
}
```

---

### 7. Floor Maps (층별 사진 관리)

##### GET `/floor-maps`
층별 사진 조회

**권한:** 인증 필요

**Query Parameters:**
- `floor`: 층 (B1, F1, F2) (optional)

**Potential Errors:**
*   `PHOTO-505`: 해당 사진이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "층별 사진 조회 성공",
  "data": {
    "floor": "F1",
    "presignedUrl": "url"
  }
}
```

##### PUT `/floor-maps`
층별 사진 업로드

**권한:** ADMIN

**Request Body (Multipart):**
- `B1`: file (optional)
- `F1`: file (optional)
- `F2`: file (optional)

**Potential Errors:**
*   `PHOTO-504`: 사진 파일이 비어있습니다.

**Response (200):**
```json
{
  "message": "층별 사진 업로드 성공",
  "data": null
}
```

##### DELETE `/floor-maps/{floorEnum}`
층별 사진 삭제

**권한:** ADMIN

**Path Parameters:**
- `floorEnum`: B1, F1, F2

**Potential Errors:**
*   `PHOTO-505`: 해당 사진이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "층별 사진 삭제 성공",
  "data": "Floor: F1"
}
```

---

### 8. User Profile (사용자 프로필)

##### GET `/users/me`
내 프로필 조회

**권한:** 인증 필요

**Response (200):**
```json
{
  "message": "프로필 조회 성공",
  "data": {
    "userName": "string",
    "studentNumber": "string",
    "userHp": "string",
    "major": "string",
    "fcmToken": "string"
  }
}
```

##### PATCH `/users/me`
프로필 수정

**권한:** 인증 필요

**Request Body:**
```json
{
  "userPw": "string",
  "userName": "string",
  "studentNumber": "string",
  "userHp": "string",
  "major": "string"
}
```

**Potential Errors:**
*   `USR-204`: 현재 비밀번호와 일치하지 않습니다.
*   `PFL-204`: 이미 존재하는 회원입니다.

**Response (200):**
```json
{
  "message": "프로필 수정 성공",
  "data": {
    "userName": "string",
    "studentNumber": "string",
    "userHp": "string",
    "major": "string"
  }
}
```

##### PATCH `/users/me/password`
비밀번호 변경

**권한:** 인증 필요

**Request Body:**
```json
{
  "newPw": "string",
  "confirmNewPw": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `newPw` | String | **Yes** | 8~20 chars, Eng+Num+Special | 새 비밀번호 |
| `confirmNewPw` | String | **Yes** | Match `newPw` | 새 비밀번호 확인 |

**Potential Errors:**
*   `USR-204`: 현재 비밀번호와 일치하지 않습니다.
*   `USR-202`: 두 비밀번호(새 비밀번호)가 일치하지 않습니다.
*   `USR-217`: 현재 비밀번호와 같은 비밀번호로 변경할 수 없습니다.

**Response (200):**
```json
{
  "message": "비밀번호가 성공적으로 업데이트 되었습니다.",
  "data": null
}
```

##### DELETE `/users/me`
회원 탈퇴

**권한:** 인증 필요

**Request Body:**
```json
{
  "authCode": "string"
}
```

**Potential Errors:**
*   `WT-101`: 인증번호가 일치하지 않습니다.
*   `WT-102`: 탈퇴 토큰이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "회원 탈퇴가 완료되었습니다.",
  "data": null
}
```

##### GET `/users/me/clubs`
내가 소속된 동아리 조회

**권한:** 인증 필요

**Response (200):**
```json
{
  "message": "소속된 동아리 목록 조회 성공",
  "data": [
    {
      "clubUUID": "uuid",
      "mainPhotoPath": "url",
      "clubName": "string",
      "leaderName": "string",
      "leaderHp": "string",
      "clubInsta": "string",
      "clubRoomNumber": "string"
    }
  ]
}
```

##### GET `/users/me/applications`
내가 지원한 동아리 조회

**권한:** 인증 필요

**Response (200):**
```json
{
  "message": "지원한 동아리 목록 조회 성공",
  "data": [
    {
      "clubUUID": "uuid",
      "mainPhotoPath": "url",
      "clubName": "string",
      "leaderName": "string",
      "leaderHp": "string",
      "clubInsta": "string",
      "publicStatus": "WAIT | PASS | FAIL",
      "aplictUUID": "uuid",
      "clubRoomNumber": "string"
    }
  ]
}
```

##### GET `/users/clubs/{floor}/photo`
동아리방 층별 사진 조회

**권한:** 인증 필요

**Path Parameters:**
- `floor`: B1, F1, F2

**Potential Errors:**
*   `PHOTO-505`: 해당 사진이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리방 층별 사진 조회 성공",
  "data": {
    "roomFloor": "F1",
    "floorPhotoPath": "url"
  }
}
```

##### POST `/users/profile/duplication-check`
프로필 중복 확인

**권한:** 인증 필요

**Request Body:**
```json
{
  "userName": "string",
  "studentNumber": "string",
  "userHp": "string",
  "clubUUID": "uuid (optional)"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits, 01X format | 전화번호 |
| `clubUUID` | String | No | Valid UUID | 대상 동아리 UUID |

**Response (200):**
```json
{
  "message": "프로필 중복 확인 성공",
  "data": {
    "exists": true,
    "classification": "string",
    "inTargetClub": true,
    "clubuuids": ["uuid"],
    "targetClubuuid": "uuid",
    "profileId": 123
  }
}
```

---

### 9. Health Check

##### GET `/health-check`
서버 상태 확인

**Response (200):**
```
OK
```

---

## ⚠️ Custom Error Codes

This section lists all custom error codes used in the USW Circle Link Server, categorized by domain.

### Common (COM)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `COM-501` | 서버 오류입니다. 관리자에게 문의해주세요. | 500 |
| `COM-302` | 잘못된 입력 값입니다. | 400 |

### Authentication & Token (TOK, AC, WT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `TOK-201` | 유효하지 않은 role입니다. | 400 |
| `TOK-204` | 인증되지 않은 사용자입니다. | 401 |
| `TOK-202` | 유효하지 않은 토큰입니다. | 401 |
| `AC-101` | 인증번호가 일치하지 않습니다 | 400 |
| `AC-102` | 인증 코드 토큰이 존재하지 않습니다 | 400 |
| `WT-101` | 인증번호가 일치하지 않습니다 | 400 |
| `WT-102` | 탈퇴 토큰이 존재하지 않습니다 | 400 |

### User (USR)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `USR-201` | 사용자가 존재하지 않습니다. | 400 |
| `USR-202` | 두 비밀번호가 일치하지 않습니다. | 400 |
| `USR-203` | 비밀번호 값이 빈칸입니다 | 400 |
| `USR-204` | 현재 비밀번호와 일치하지 않습니다 | 400 |
| `USR-205` | 비밀번호 업데이트에 실패했습니다 | 500 |
| `USR-206` | 이미 존재하는 회원입니다. | 409 |
| `USR-207` | 계정이 중복됩니다. | 409 |
| `USR-209` | 올바르지 않은 이메일 혹은 아이디입니다. | 400 |
| `USR-210` | 회원의 uuid를 찾을 수 없습니다. | 400 |
| `USR-211` | 아이디 혹은 비밀번호가 일치하지 않습니다 | 401 |
| `USR-214` | 영문자,숫자,특수문자는 적어도 1개 이상씩 포함되어야합니다 | 400 |
| `USR-216` | 비회원 사용자입니다.인증을 완료해주세요 | 401 |
| `USR-217` | 현재 비밀번호와 같은 비밀번호로 변경할 수 없습니다. | 400 |
| `USR-218` | 회원 생성중 오류 발생 | 500 |
| `USR-219` | 요청 받은 SIGNUPUUID가 일치하지 않습니다 | 401 |
| `USR-220` | 제3자의 로그인 요청 시도 입니다 | 401 |

### Email Token (EMAIL_TOKEN)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EMAIL_TOKEN-001` | 해당 토큰이 존재하지 않습니다. | 400 |
| `EMAIL_TOKEN-002` | 토큰이 만료되었습니다. 다시 이메일인증 해주세요 | 400 |
| `EMAIL_TOKEN-003` | 이메일 토큰 생성중 오류가 발생했습니다. | 500 |
| `EMAIL_TOKEN-004` | 이메일 토큰의 필드 업데이트 후, 저장하는 과정에서 오류가 발생했습니다. | 500 |
| `EMAIL_TOKEN-005` | 인증이 완료되지 않은 이메일 토큰입니다. | 400 |

### Event (EVT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EVT-101` | 유효하지 않은 이벤트 코드입니다. | 400 |
| `EVT-102` | 이미 인증된 사용자입니다. | 400 |

### Club (CLUB)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CLUB-201` | 존재하지않는 동아리 입니다. | 404 |
| `CLUB-202` | 동아리 조회 중 오류가 발생했습니다. | 500 |
| `CLUB-203` | 이미 존재하는 동아리 이름입니다. | 409 |
| `CLUB-204` | 동아리 사진이 존재하지 않습니다 | 404 |
| `CLUB-205` | 이미 지정된 동아리방입니다. | 409 |

### Club Category (CTG, CG)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CTG-201` | 존재하지 않는 카테고리입니다. | 404 |
| `CG-202` | 카테고리는 최대 3개까지 선택할수 있습니다. | 413 |
| `CTG-203` | 이미 존재하는 카테고리입니다. | 409 |

### Club Intro (CINT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CINT-201` | 해당 동아리 소개글이 존재하지 않습니다. | 404 |
| `CINT-202` | 구글 폼 URL이 존재하지 않습니다. | 400 |
| `CINT-303` | 모집 상태가 올바르지 않습니다. | 400 |

### Admin (ADM)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `ADM-201` | 해당 계정이 존재하지 않습니다. | 404 |
| `ADM-202` | 관리자 비밀번호가 일치하지 않습니다. | 400 |

### Notice (NOT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `NOT-201` | 공지사항이 존재하지 않습니다. | 404 |
| `NOT-202` | 최대 5개의 사진이 업로드 가능합니다. | 413 |
| `NOT-204` | 사진이 존재하지 않습니다. | 404 |
| `NOT-205` | 사진 순서는 1에서 5 사이여야 합니다. | 400 |
| `NOT-206` | 공지사항 조회 중 에러가 발생했습니다. | 400 |

### Profile (PFL)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `PFL-201` | 프로필이 존재하지 않습니다. | 404 |
| `PFL-202` | 프로필 업데이트에 실패했습니다. | 500 |
| `PFL-203` | 프로필 입력값은 필수입니다. | 400 |
| `PFL-204` | 이미 존재하는 회원입니다. | 400 |
| `PFL-205` | 학과 정보는 필수 입력 항목입니다. | 400 |
| `PFL-206` | 비회원만 수정할 수 있습니다. | 400 |
| `PFL-207` | 프로필이 이미 존재합니다 | 400 |
| `PFL-208` | 유효하지 않은 회원 종류입니다. | 400 |
| `PFL-209` | 프로필 값이 일치하지 않습니다. | 400 |
| `PFL-210` | 프로필 생성중 오류 발생 | 500 |

### Club Leader (CLDR)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CLDR-101` | 동아리 접근 권한이 없습니다. | 403 |
| `CLDR-201` | 동아리 회장이 존재하지 않습니다. | 400 |
| `CLDR-202` | 동아리 회장 비밀번호가 일치하지 않습니다 | 400 |
| `CLDR-203` | 이미 존재하는 동아리 회장 계정입니다. | 422 |
| `CLDR-204` | 동아리 회장의 이름은 필수 입력 항목입니다. | 400 |

### Club Member (CMEM)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CMEM-201` | 동아리 회원이 존재하지 않습니다. | 404 |
| `CMEM-202` | 동아리 회원이 이미 존재합니다. | 400 |
| `CMEM-TEMP-301` | 기존 회원가입 사용자 생성에 실패했습니다 | 500 |
| `CMEM-TEMP-302` | CLUBMEMBERTEMP 테이블에 존재하는 이메일 입니다. | 400 |
| `CMEM-TEMP-303` | CLUBMEMBERTEMP 에 중복된 프로필이 존재합니다 | 400 |
| `CMEM-ACST-301` | AccountStatus 객체 생성 과정중 오류가 발생했습니다 | 500 |
| `CMEM-ACST-302` | AccountStatus 객체 저장 과정중 오류가 발생했습니다 | 500 |
| `CMEM-ACST-303` | 사용자가 요청한 개수와 실제 요청된 개수가 다릅니다 | 500 |
| `CMEM-ACST-304` | 사용자가 요청한 동아리와 실제 요청값이 다르게 생성되었습니다 | 500 |
| `CMEMT-201` | 회원 가입 요청이 존재하지 않습니다. | 404 |

### Applicant (APT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `APT-201` | 지원서가 존재하지 않습니다. | 404 |
| `APT-202` | 유효한 지원자가 존재하지 않습니다. | 404 |
| `APT-203` | 유효한 추합 대상자가 존재하지 않습니다. | 404 |
| `APT-204` | 선택한 지원자 수와 전체 지원자 수가 일치하지 않습니다. | 400 |
| `APT-205` | 이미 지원한 동아리입니다. | 400 |
| `APT-206` | 이미 해당 동아리 회원입니다. | 400 |
| `APT-207` | 이미 등록된 전화번호입니다. | 400 |
| `APT-208` | 이미 등록된 학번입니다. | 400 |

### File (FILE)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `FILE-301` | 파일 이름 인코딩에 실패했습니다. | 400 |
| `FILE-302` | 파일 생성에 실패했습니다. | 500 |
| `FILE-303` | 사진 또는 순서 정보가 제공되지 않았습니다. | 400 |
| `FILE-304` | 사진의 개수와 순서 정보의 개수가 일치하지 않습니다. | 400 |
| `FILE-305` | 파일 저장에 실패했습니다. | 500 |
| `FILE-306` | 파일 업로드에 실패했습니다. | 400 |
| `FILE-307` | 파일 삭제에 실패했습니다. | 400 |
| `FILE-308` | 업로드 가능한 갯수를 초과했습니다. | 400 |
| `FILE-309` | 파일 이름이 유효하지 않습니다. | 400 |
| `FILE-310` | 파일 확장자가 없습니다. | 400 |
| `FILE-311` | 지원하지 않는 파일 확장자입니다. | 400 |
| `FILE-312` | 파일 유효성 검사 실패 | 400 |

### Others
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EML-501` | 메일 전송에 실패했습니다. | 500 |
| `UUID-502` | 유효하지 않은 UUID 형식입니다. | 400 |
| `ATTEMPT-503` | 최대 시도 횟수를 초과했습니다. 5분 후 다시 시도 하세요 | 400 |
| `PHOTO-504` | 사진 파일이 비어있습니다. | 400 |
| `PHOTO-505` | 해당 사진이 존재하지 않습니다. | 404 |
| `ENUM-401` | 유효하지 않은 Enum 값입니다. | 400 |
| `CLP-201` | 범위를 벗어난 사진 순서 값입니다. | 400 |
