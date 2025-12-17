# USW Circle Link Server API v1

## 서버 정보
- Base URL : `https://api.donggurami.net`
- API 버전: OAS 3.1

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

### 1. Club Leader (동아리 회장 기능 API)

#### 1.1 동아리 소개 관리

##### GET `/club-leader/{clubUUID}/intro`
동아리 소개 정보 조회

**Potential Errors:**
*   `CINT-201`: 해당 동아리 소개글이 존재하지 않습니다.
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "동아리 소개 조회 성공",
  "data": {
    "clubUUID": "uuid",
    "clubIntro": "string",
    "clubRecruitment": "string",
    "recruitmentStatus": "OPEN",
    "googleFormUrl": "string",
    "introPhotos": ["url1", "url2"]
  }
}
```

##### PUT `/club-leader/{clubUUID}/intro`
동아리 소개 정보 수정

**Request Body:**
```json
{
  "clubIntroRequest": {
    "clubIntro": "string",
    "recruitmentStatus": "OPEN",
    "clubRecruitment": "string",
    "googleFormUrl": "string",
    "orders": [1, 2],
    "deletedOrders": [3]
  },
  "introPhotos": ["file"]
}
```

**Constraints (`clubIntroRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `clubIntro` | String | No | Max 3000 chars | 동아리 소개글 |
| `recruitmentStatus` | String | **Yes** | `OPEN`, `CLOSED` | 모집 상태 (Enum) |
| `clubRecruitment` | String | No | Max 3000 chars | 모집 공고글 |
| `googleFormUrl` | String | No | Valid HTTPS URL | 구글 폼 링크 |
| `orders` | List | No | - | 기존 사진 순서 유지 목록 |
| `deletedOrders` | List | No | - | 삭제할 사진 순서 목록 |

**Potential Errors:**
*   `CINT-201`: 해당 동아리 소개글이 존재하지 않습니다.
*   `CINT-303`: 모집 상태가 올바르지 않습니다.
*   `FILE-308`: 업로드 가능한 갯수를 초과했습니다 (사진).
*   `FILE-311`: 지원하지 않는 파일 확장자입니다.
*   `CLP-201`: 범위를 벗어난 사진 순서 값입니다.

**Response (200):**
```json
{
  "message": "동아리 소개 수정 성공",
  "data": null
}
```

#### 1.2 동아리 정보 관리

##### GET `/club-leader/{clubUUID}/info`
동아리 정보 조회

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "동아리 정보 조회 성공",
  "data": {
    "mainPhotoUrl": "url",
    "clubName": "string",
    "leaderName": "string",
    "leaderHp": "string",
    "clubInsta": "string",
    "clubRoomNumber": "string",
    "clubHashtag": ["string"],
    "clubCategoryName": ["string"],
    "department": "학술"
  }
}
```

##### PUT `/club-leader/{clubUUID}/info`
동아리 정보 수정

**Request Body (Multipart):**
```json
{
  "mainPhoto": "file",
  "clubInfoRequest": {
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
  }
}
```

**Constraints (`clubInfoRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderName` | String | **Yes** | 2~30 chars, Kor/Eng only | 회장 이름 |
| `leaderHp` | String | **Yes** | 11 digits, starts with 01 | 회장 전화번호 (하이픈 제외) |
| `clubInsta` | String | No | Instagram URL regex | 인스타그램 링크 |
| `clubRoomNumber` | String | **Yes** | Valid Format | 동아리방 호수 |
| `clubHashtag` | List | No | Max 2 items, each 1~6 chars | 해시태그 목록 |
| `clubCategoryName` | List | No | Max 3 items, each 1~20 chars | 카테고리 목록 |

**Constraints (`leaderUpdatePwRequest`):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderPw` | String | **Yes** | - | 현재 비밀번호 |
| `newPw` | String | No | 8~20 chars, Eng+Num+Special | 새 비밀번호 |
| `confirmNewPw` | String | No | Match `newPw` | 새 비밀번호 확인 |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CLUB-204`: 동아리 사진이 존재하지 않습니다.
*   `CLDR-202`: 동아리 회장 비밀번호가 일치하지 않습니다.
*   `USR-202`: 두 비밀번호(새 비밀번호)가 일치하지 않습니다.
*   `USR-217`: 현재 비밀번호와 같은 비밀번호로 변경할 수 없습니다.
*   `CTG-201`: 존재하지 않는 카테고리입니다.

**Response (200):**
```json
{
  "message": "동아리 정보 수정 성공",
  "data": null
}
```

##### GET `/club-leader/{clubUUID}/summary`
동아리 요약 정보 조회

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "동아리 요약 조회 완료",
  "data": {
    "clubUUID": "uuid",
    "clubName": "string",
    "leaderName": "string",
    "leaderHp": "string",
    "clubInsta": "string",
    "clubRoomNumber": "string",
    "clubHashtag": ["string"],
    "clubCategories": ["string"],
    "clubIntro": "string",
    "clubRecruitment": "string",
    "recruitmentStatus": "OPEN",
    "googleFormUrl": "string",
    "mainPhoto": "string",
    "introPhotos": ["string"]
  }
}
```

##### GET `/club-leader/category`
모든 카테고리 조회

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

##### PATCH `/club-leader/{clubUUID}/recruitment`
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

#### 1.3 동아리 회원 관리

##### GET `/club-leader/{clubUUID}/members`
동아리 회원 목록 조회

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
      "memberType": "REGULARMEMBER" // or NONMEMBER
    }
  ]
}
```

##### DELETE `/club-leader/{clubUUID}/members`
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

##### GET `/club-leader/{clubUUID}/members/export`
동아리 회원 목록 엑셀 내보내기

**Response (200):**
```json
{
  "message": "동아리 회원 엑셀 파일 내보내기 완료",
  "data": null // File download
}
```

##### POST `/club-leader/{clubUUID}/members/import`
기존 동아리 회원 엑셀 업로드

**Request Body (Multipart):**
- `clubMembersFile`: file (Excel)

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `FILE-301`: 파일 이름 인코딩 실패.
*   `FILE-311`: 지원하지 않는 파일 확장자입니다.
*   `FILE-312`: 파일 유효성 검사 실패.

**Response (200):**
```json
{
  "message": "엑셀 파일 업로드 성공",
  "data": {
    "addClubMembers": [
      {
        "userName": "string",
        "studentNumber": "string",
        "userHp": "string"
      }
    ],
    "duplicateClubMembers": [
       {
        "userName": "string",
        "studentNumber": "string",
        "userHp": "string"
      }
    ]
  }
}
```

##### POST `/club-leader/{clubUUID}/members`
엑셀 데이터로 기존 동아리 회원 추가

**Request Body:**
```json
{
  "clubMembersAddFromExcelRequestList": [
    {
      "userName": "string",
      "major": "string",
      "studentNumber": "string",
      "userHp": "string"
    }
  ]
}
```

**Constraints (`clubMembersAddFromExcelRequestList` Item):**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `major` | String | **Yes** | 1~20 chars | 학과 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits | 전화번호 |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CMEM-202`: 동아리 회원이 이미 존재합니다.
*   `PFL-204`: 이미 존재하는 회원입니다 (중복 프로필).

**Response (200):**
```json
{
  "message": "엑셀로 추가된 기존 동아리 회원 저장 완료",
  "data": null
}
```

##### POST `/club-leader/{clubUUID}/members/duplicate-profiles`
중복 프로필 회원 조회

**Request Body:**
```json
{
  "userName": "string",
  "studentNumber": "string",
  "userHp": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits | 전화번호 |

**Response (200):**
```json
{
  "message": "중복 프로필 회원 조회 성공",
  "data": null
}
```

##### PATCH `/club-leader/{clubUUID}/members/{clubMemberUUID}/non-member`
비회원 프로필 수정

**Request Body:**
```json
{
  "userName": "string",
  "studentNumber": "string",
  "userHp": "string",
  "major": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits | 전화번호 |
| `major` | String | **Yes** | 1~20 chars | 학과 |

**Potential Errors:**
*   `CMEM-201`: 동아리 회원이 존재하지 않습니다.
*   `PFL-206`: 비회원만 수정할 수 있습니다.
*   `PFL-209`: 프로필 값이 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "비회원 프로필 수정 성공",
  "data": null
}
```

#### 1.4 가입 신청 관리

##### GET `/club-leader/{clubUUID}/members/sign-up`
기존 동아리 회원 가입 요청 조회

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "가입 요청 목록 조회 성공",
  "data": [
    {
      "clubMemberAccountStatusUUID": "uuid",
      "profileTempName": "string",
      "profileTempStudentNumber": "string",
      "profileTempMajor": "string",
      "profileTempHp": "string"
    }
  ]
}
```

##### POST `/club-leader/{clubUUID}/members/sign-up`
기존 동아리 회원 가입 요청 수락

**Request Body:**
```json
{
  "signUpProfileRequest": {
    "uuid": "uuid",
    "userName": "string",
    "studentNumber": "string",
    "userHp": "string",
    "major": "string"
  },
  "clubNonMemberProfileRequest": {
    "uuid": "uuid",
    "userName": "string",
    "studentNumber": "string",
    "userHp": "string",
    "major": "string"
  }
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `uuid` | UUID | **Yes** | Valid UUID | 회원/프로필 ID |
| `userName` | String | **Yes** | - | 이름 |
| `studentNumber` | String | **Yes** | - | 학번 |
| `userHp` | String | **Yes** | - | 전화번호 |
| `major` | String | **Yes** | - | 학과 |

**Potential Errors:**
*   `CMEMT-201`: 회원 가입 요청이 존재하지 않습니다.
*   `PFL-204`: 이미 존재하는 회원입니다.
*   `PFL-209`: 프로필 값이 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "가입 요청 수락 성공",
  "data": null
}
```

##### DELETE `/club-leader/{clubUUID}/members/sign-up/{clubMemberAccountStatusUUID}`
기존 동아리 회원 가입 요청 삭제(거절)

**Potential Errors:**
*   `CMEMT-201`: 회원 가입 요청이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "가입 요청 삭제 성공",
  "data": null
}
```

#### 1.5 지원자 관리

##### GET `/club-leader/{clubUUID}/applicants`
최초 지원자 목록 조회

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
      "userHp": "string"
    }
  ]
}
```

##### POST `/club-leader/{clubUUID}/applicants/notifications`
최초 합격자 알림 (지원 결과 처리)

**Request Body:**
```json
[
  {
    "aplictUUID": "uuid",
    "aplictStatus": "WAIT"
  }
]
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `aplictUUID` | UUID | **Yes** | Valid UUID | 지원 ID |
| `aplictStatus` | String | **Yes** | `WAIT`, `PASS`, `FAIL` | 변경할 상태 |

**Potential Errors:**
*   `APT-202`: 유효한 지원자가 존재하지 않습니다.
*   `APT-204`: 선택한 지원자 수와 전체 지원자 수가 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "지원 결과 처리 완료",
  "data": null
}
```

##### GET `/club-leader/{clubUUID}/failed-applicants`
불합격자 목록 조회

**Response (200):**
```json
{
  "message": "불합격자 목록 조회 성공",
  "data": [
    {
      "aplictUUID": "uuid",
      "userName": "string",
      "major": "string",
      "studentNumber": "string",
      "userHp": "string"
    }
  ]
}
```

##### POST `/club-leader/{clubUUID}/failed-applicants/notifications`
지원자 추가 합격 알림

**Request Body:**
```json
[
  {
    "aplictUUID": "uuid",
    "aplictStatus": "WAIT"
  }
]
```

**Constraints:** Same as `POST /applicants/notifications`

**Potential Errors:**
*   `APT-203`: 유효한 추합 대상자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "추합 결과 처리 완료",
  "data": null
}
```

#### 1.6 기타

##### PATCH `/club-leader/terms/agreement`
약관 동의 완료 업데이트

**Response (200):**
```json
{
  "message": "약관 동의 완료",
  "data": null
}
```

##### PATCH `/club-leader/fcmtoken`
FCM 토큰 갱신

**Request Body:**
```json
{
  "fcmToken": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `fcmToken` | String | **Yes** | - | Firebase Cloud Messaging Token |

**Response (200):**
```json
{
  "message": "fcm token 갱신 완료",
  "data": null
}
```

---

### 2. Admin Notice (공지사항 관리)

##### GET `/notices`
공지사항 목록 조회

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
        "adminName": "string",
        "thumbnailUrl": "url"
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
    "adminName": "string"
  }
}
```

##### PUT `/notices/{noticeUUID}`
공지사항 수정

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

**Constraints:** Same as `POST /notices`

**Potential Errors:**
*   `NOT-201`: 공지사항이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "공지사항 수정 성공",
  "data": ["presigned_url"]
}
```

##### DELETE `/notices/{noticeUUID}`
공지사항 삭제

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

### 3. Admin Floor Photo (층별 사진 관리)

##### GET `/admin/floor/photo/{floor}`
층별 사진 조회 (`B1`, `F1`, `F2`)

**Potential Errors:**
*   `PHOTO-505`: 해당 사진이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "해당 층 사진 조회 성공",
  "data": {
    "floor": "F1",
    "presignedUrl": "url"
  }
}
```

##### PUT `/admin/floor/photo/{floor}`
층별 사진 업로드

**Request Body (Multipart):**
- `photo`: file

**Potential Errors:**
*   `PHOTO-504`: 사진 파일이 비어있습니다.

**Response (200):**
```json
{
  "message": "해당 층 사진 업로드 성공",
  "data": {
    "floor": "F1",
    "presignedUrl": "url"
  }
}
```

##### DELETE `/admin/floor/photo/{floor}`
층별 사진 삭제

**Potential Errors:**
*   `PHOTO-505`: 해당 사진이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "해당 층 사진 삭제 성공",
  "data": "Floor: F1"
}
```

---

### 4. Admin Club (관리자 동아리 관리)

##### GET `/admin/clubs`
모든 동아리 목록 조회

**Response (200):**
```json
{
  "message": "동아리 리스트 조회 성공",
  "data": {
    "content": [
      {
        "clubUUID": "uuid",
        "clubName": "string",
        "leaderName": "string",
        "department": "학술",
        "leaderHp": "string"
      }
    ],
    "totalPages": 1,
    "totalElements": 1,
    "currentPage": 0
  }
}
```

##### POST `/admin/clubs`
동아리 추가

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
| `department` | String | **Yes** | Enum | 학부/분과 |
| `adminPw` | String | **Yes** | - | 관리자 PW 확인 |
| `clubRoomNumber` | String | **Yes** | Valid Format | 동아리방 호수 |

**Potential Errors:**
*   `CLDR-203`: 이미 존재하는 동아리 회장 계정입니다.
*   `CLUB-203`: 이미 존재하는 동아리 이름입니다.
*   `CLDR-202`: 동아리 회장 비밀번호가 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리 생성 성공",
  "data": "동아리 생성 성공"
}
```

##### GET `/admin/clubs/{clubUUID}`
동아리 소개/모집글 페이지 조회

**Response (200):**
```json
{
  "message": "동아리 소개/모집글 페이지 조회 성공",
  "data": {
    "clubUUID": "uuid",
    "mainPhoto": "url",
    "introPhotos": ["url"],
    "clubName": "string",
    "leaderName": "string",
    "leaderHp": "string",
    "clubInsta": "string",
    "clubIntro": "string",
    "recruitmentStatus": "OPEN",
    "googleFormUrl": "string",
    "clubHashtags": ["string"],
    "clubCategoryNames": ["string"],
    "clubRoomNumber": "string",
    "clubRecruitment": "string"
  }
}
```

##### DELETE `/admin/clubs/{clubUUID}`
동아리 삭제

**Request Body:**
```json
{
  "adminPw": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `adminPw` | String | **Yes** | - | 관리자 PW 확인 |

**Potential Errors:**
*   `ADM-202`: 관리자 비밀번호가 일치하지 않습니다.
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "동아리 삭제 성공",
  "data": null
}
```

##### GET `/admin/clubs/leader/check`
동아리 회장 아이디 중복 확인

**Potential Errors:**
*   `CLDR-203`: 이미 존재하는 동아리 회장 계정입니다.

**Response (200):**
```json
{
  "message": "사용 가능한 동아리 회장 아이디입니다.",
  "data": null
}
```

##### GET `/admin/clubs/name/check`
동아리 이름 중복 확인

**Potential Errors:**
*   `CLUB-203`: 이미 존재하는 동아리 이름입니다.

**Response (200):**
```json
{
  "message": "사용 가능한 동아리 이름입니다.",
  "data": null
}
```

---

### 5. Admin Club Category (동아리 카테고리 관리)

##### GET `/admin/clubs/category`
카테고리 조회

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

##### POST `/admin/clubs/category`
카테고리 추가

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

##### DELETE `/admin/clubs/category/{clubCategoryUUID}`
카테고리 삭제

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

### 6. Club Leader Login

##### POST `/club-leader/login`
회장 로그인

**Request Body:**
```json
{
  "leaderAccount": "string",
  "leaderPw": "string",
  "loginType": "LEADER"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `leaderAccount` | String | **Yes** | - | 회장 ID |
| `leaderPw` | String | **Yes** | - | 회장 PW |
| `loginType` | String | No | `LEADER` | 로그인 타입 |

**Potential Errors:**
*   `USR-211`: 아이디 혹은 비밀번호가 일치하지 않습니다.
*   `USR-201`: 사용자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리 회장 로그인 성공",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token",
    "role": "LEADER",
    "clubUUID": "uuid",
    "isAgreedTerms": true
  }
}
```

---

### 7. Admin Login

##### POST `/admin/login`
관리자 로그인

**Request Body:**
```json
{
  "adminAccount": "string",
  "adminPw": "string",
  "clientId": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `adminAccount` | String | **Yes** | - | 관리자 ID |
| `adminPw` | String | **Yes** | - | 관리자 PW |

**Potential Errors:**
*   `USR-211`: 아이디 혹은 비밀번호가 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "운영팀 로그인 성공",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token",
    "role": "ADMIN"
  }
}
```

---

### 8. Application (지원 관련)

##### GET `/apply/can-apply/{clubUUID}`
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

##### GET `/apply/{clubUUID}`
구글 폼 URL 조회

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CINT-201`: 해당 동아리 소개글이 존재하지 않습니다.
*   `CINT-202`: 구글 폼 URL이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "구글 폼 URL 조회 성공",
  "data": "https://docs.google.com/..."
}
```

##### POST `/apply/{clubUUID}`
동아리 지원서 제출

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `APT-205`: 이미 지원한 동아리입니다.
*   `APT-206`: 이미 해당 동아리 회원입니다.
*   `APT-207`: 이미 등록된 전화번호입니다.
*   `APT-208`: 이미 등록된 학번입니다.

**Response (200):**
```json
{
  "message": "지원서 제출 성공",
  "data": null
}
```

---

### 9. My Page (마이페이지)

##### GET `/mypages/my-clubs`
소속된 동아리 조회

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

##### GET `/mypages/aplict-clubs`
지원한 동아리 조회

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
      "clubRoomNumber": "string",
      "aplictStatus": "WAIT" // or PASS, FAIL
    }
  ]
}
```

##### GET `/mypages/clubs/{floor}/photo`
동아리방 층별 사진 조회

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

---

### 10. My Notice (내 공지사항)

##### GET `/my-notices`
내 공지사항 목록 조회

**Response (200):**
```json
{
  "message": "공지사항 조회 성공",
  "data": [
    {
      "noticeUUID": "uuid",
      "noticeTitle": "string",
      "adminName": "string",
      "noticeCreatedAt": "2023-01-01T00:00:00"
    }
  ]
}
```

##### GET `/my-notices/{noticeUUID}/details`
공지사항 상세 조회

**Potential Errors:**
*   `NOT-201`: 공지사항이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "공지사항 세부 조회 성공",
  "data": {
    "noticeUUID": "uuid",
    "noticeTitle": "string",
    "noticeContent": "string",
    "noticePhotos": ["url"],
    "noticeCreatedAt": "2023-01-01T00:00:00",
    "adminName": "string"
  }
}
```

---

### 11. Club (동아리 공개 정보)

##### GET `/clubs`
전체 동아리 조회 (모바일)

**Response (200):**
```json
{
  "message": "전체 동아리 조회 완료",
  "data": [
    {
      "clubUUID": "uuid",
      "clubName": "string",
      "mainPhoto": "url",
      "departmentName": "string",
      "clubHashtags": ["string"]
    }
  ]
}
```

##### GET `/clubs/list`
모든 동아리 정보 출력 (모바일 기존회원가입시)

**Response (200):**
```json
{
  "message": "동아리 리스트 조회 성공",
  "data": [
    {
      "clubUUID": "uuid",
      "clubName": "string",
      "mainPhoto": "url"
    }
  ]
}
```

##### GET `/clubs/filter`
카테고리별 전체 동아리 조회

**Response (200):**
```json
{
  "message": "카테고리별 전체 동아리 조회 완료",
  "data": [
    {
      "clubCategoryUUID": "uuid",
      "clubCategoryName": "string",
      "clubs": [
        {
          "clubUUID": "uuid",
          "clubName": "string",
          "mainPhoto": "url",
          "departmentName": "string",
          "clubHashtags": ["string"]
        }
      ]
    }
  ]
}
```

##### GET `/clubs/open`
모집 중인 전체 동아리 조회

**Response (200):**
```json
{
  "message": "모집 중인 동아리 조회 완료",
  "data": [
    // ClubListResponse list
  ]
}
```

##### GET `/clubs/open/filter`
카테고리별 모집 중인 동아리 조회

**Response (200):**
```json
{
  "message": "카테고리별 모집 중인 동아리 조회 완료",
  "data": [
    // ClubListByClubCategoryResponse list
  ]
}
```

##### GET `/clubs/categories`
카테고리 리스트 조회

**Response (200):**
```json
{
  "message": "카테고리 조회 완료",
  "data": [
    {
      "clubCategoryUUID": "uuid",
      "clubCategoryName": "string"
    }
  ]
}
```

##### GET `/clubs/intro/{clubUUID}`
동아리 소개글 조회

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.
*   `CINT-201`: 해당 동아리 소개글이 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "동아리 소개글 조회 성공",
  "data": {
    // AdminClubIntroResponse structure
  }
}
```

---

### 12. Integration Auth (통합 인증)

##### POST `/integration/logout`
로그아웃

**Response (200):**
```json
{
  "message": "로그아웃 성공",
  "data": null
}
```

##### POST `/integration/refresh-token`
토큰 갱신

**Potential Errors:**
*   `TOK-202`: 유효하지 않은 토큰입니다.

**Response (200):**
```json
{
  "message": "새로운 엑세스 토큰과 리프레시 토큰이 발급됐습니다. 로그인됐습니다.",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

---

### 13. User (일반 사용자)

#### 13.1 회원 정보 관리
##### PATCH `/users/userpw`
비밀번호 변경

**Request Body:**
```json
{
  "userPw": "string",
  "newPw": "string",
  "confirmNewPw": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userPw` | String | **Yes** | - | 현재 비밀번호 |
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

##### GET `/users/find-account/{email}`
아이디 찾기

**Potential Errors:**
*   `USR-201`: 사용자가 존재하지 않습니다.

**Response (200):**
```json
{
  "message": "계정 정보 전송 완료",
  "data": null
}
```

##### POST `/users/auth/send-code`
비밀번호 찾기 - 인증 코드 전송

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
| `email` | String | **Yes** | 1~30 chars | 이메일 |

**Potential Errors:**
*   `USR-209`: 올바르지 않은 이메일 혹은 아이디입니다.

**Response (200):**
```json
{
  "message": "인증코드가 전송 되었습니다",
  "data": "uuid"
}
```

##### POST `/users/auth/verify-token`
인증 코드 검증

**Request Body:**
```json
{
  "authCode": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `authCode` | String | **Yes** | - | 인증 코드 |

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

##### PATCH `/users/reset-password`
비밀번호 재설정

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

#### 13.2 회원가입
##### POST `/users/check/{email}/duplicate`
기존회원 가입시 이메일 중복 확인

**Request Body:**
```json
{
  "email": "string"
}
```
**Response (200):**
```json
{
  "message": "이메일 중복 확인에 성공하였습니다.",
  "data": null
}
```

##### GET `/users/verify-duplicate/{account}`
아이디 중복 체크

**Response (200):**
```json
{
  "message": "사용 가능한 ID 입니다.",
  "data": null
}
```

##### POST `/users/temporary/register`
신규회원가입 요청 - 인증 메일 전송

**Request Body:**
```json
{
  "email": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | **Yes** | - | 인증할 이메일 |

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

##### GET `/users/email/verify-token`
이메일 인증 여부 검증 (링크 클릭 처리)

**Potential Errors:**
*   `EMAIL_TOKEN-001`: 해당 토큰이 존재하지 않습니다.
*   `EMAIL_TOKEN-002`: 토큰이 만료되었습니다.

**Response:** HTML View (success/expired/failure)

##### POST `/users/email/verification`
인증 확인 버튼 클릭

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
  "message": "인증 확인 버튼 클릭 후, 이메일 인증 완료",
  "data": {
    "emailTokenUUID": "uuid",
    "signupUUID": "uuid"
  }
}
```

##### POST `/users/signup`
회원 가입 정보 등록

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
*   `USR-219`: 요청 받은 SIGNUPUUID가 일치하지 않습니다 (이메일 인증 불일치).
*   `USR-206`: 이미 존재하는 회원입니다.
*   `USR-207`: 계정이 중복됩니다.

**Response (200):**
```json
{
  "message": "회원가입이 정상적으로 완료되어 로그인이 가능합니다.",
  "data": null
}
```

##### POST `/users/existing/register`
기존 동아리원 회원가입 (현재 비활성화됨)

**Request Body:**
```json
{
  "account": "string",
  "password": "string",
  "confirmPassword": "string",
  "userName": "string",
  "telephone": "string",
  "studentNumber": "string",
  "major": "string",
  "email": "string",
  "clubs": [
    {
      "clubUUID": "uuid",
      "clubName": "string"
    }
  ]
}
```
**Response (400):**
```json
{
  "message": "현재 기존 동아리원 회원가입이 불가능합니다.",
  "data": null
}
```

#### 13.3 로그인/탈퇴
##### POST `/users/login`
사용자 로그인

**Request Body:**
```json
{
  "account": "string",
  "password": "string",
  "fcmToken": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `account` | String | **Yes** | 5~20 chars, Alphanumeric | 아이디 |
| `password` | String | **Yes** | - | 비밀번호 |
| `fcmToken` | String | No | - | FCM 토큰 |

**Potential Errors:**
*   `USR-211`: 아이디 혹은 비밀번호가 일치하지 않습니다.

**Response (200):**
```json
{
  "message": "로그인 성공",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

##### POST `/users/exit/send-code`
회원 탈퇴 요청 및 메일 전송

**Response (200):**
```json
{
  "message": "탈퇴를 위한 인증 메일이 전송 되었습니다",
  "data": null
}
```

##### DELETE `/users/exit`
회원 탈퇴 인증 및 탈퇴 처리

**Request Body:**
```json
{
  "authCode": "string"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `authCode` | String | **Yes** | - | 인증 코드 |

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

---

### 14. Profile (프로필)

##### PATCH `/profiles/change`
프로필 수정

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

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userPw` | String | **Yes** | - | 비밀번호 확인 |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits | 전화번호 |
| `major` | String | **Yes** | 1~20 chars | 학과 |

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

##### GET `/profiles/me`
내 프로필 조회

**Response (200):**
```json
{
  "message": "프로필 조회 성공",
  "data": {
    "userName": "string",
    "studentNumber": "string",
    "userHp": "string",
    "major": "string"
  }
}
```

##### POST `/profiles/duplication-check`
프로필 중복 확인

**Request Body:**
```json
{
  "userName": "string",
  "studentNumber": "string",
  "userHp": "string",
  "clubUUID": "uuid"
}
```

**Constraints:**

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | String | **Yes** | 2~30 chars, Kor/Eng | 이름 |
| `studentNumber` | String | **Yes** | 8 digits | 학번 |
| `userHp` | String | **Yes** | 11 digits | 전화번호 |
| `clubUUID` | UUID | No | - | 동아리 ID |

**Potential Errors:**
*   `CLUB-201`: 존재하지 않는 동아리입니다.

**Response (200):**
```json
{
  "message": "프로필 중복 확인 결과",
  "data": {
    "exists": true,
    "classification": "SAME_CLUB",
    "inTargetClub": true,
    "clubUUIDs": ["uuid"],
    "targetClubUUID": "uuid",
    "profileId": 1
  }
}
```

---

### 15. Health Check

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
| `ATTEMPT-503` | 최대 시도 횟수를 초과했습니다. 5분 후  다시 시도 하세요 | 400 |
| `PHOTO-504` | 사진 파일이 비어있습니다. | 400 |
| `PHOTO-505` | 해당 사진이 존재하지 않습니다. | 404 |
| `ENUM-401` | 유효하지 않은 Enum 값입니다. | 400 |