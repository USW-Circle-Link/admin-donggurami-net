# USW API Error Codes Reference

This file contains all custom error codes used in the USW Circle Link Server, organized by domain for quick lookup.

## Table of Contents
- [Common (COM)](#common-com)
- [Authentication & Token (TOK, AC, WT)](#authentication--token-tok-ac-wt)
- [User (USR)](#user-usr)
- [Email Token (EMAIL_TOKEN)](#email-token-email_token)
- [Event (EVT)](#event-evt)
- [Club (CLUB)](#club-club)
- [Club Category (CTG, CG)](#club-category-ctg-cg)
- [Club Intro (CINT)](#club-intro-cint)
- [Admin (ADM)](#admin-adm)
- [Notice (NOT)](#notice-not)
- [Profile (PFL)](#profile-pfl)
- [Club Leader (CLDR)](#club-leader-cldr)
- [Club Member (CMEM)](#club-member-cmem)
- [Applicant (APT)](#applicant-apt)
- [File (FILE)](#file-file)
- [Others](#others)

## Common (COM)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `COM-501` | 서버 오류입니다. 관리자에게 문의해주세요. | 500 |
| `COM-302` | 잘못된 입력 값입니다. | 400 |

## Authentication & Token (TOK, AC, WT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `TOK-201` | 유효하지 않은 role입니다. | 400 |
| `TOK-204` | 인증되지 않은 사용자입니다. | 401 |
| `TOK-202` | 유효하지 않은 토큰입니다. | 401 |
| `AC-101` | 인증번호가 일치하지 않습니다 | 400 |
| `AC-102` | 인증 코드 토큰이 존재하지 않습니다 | 400 |
| `WT-101` | 인증번호가 일치하지 않습니다 | 400 |
| `WT-102` | 탈퇴 토큰이 존재하지 않습니다 | 400 |

## User (USR)
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

## Email Token (EMAIL_TOKEN)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EMAIL_TOKEN-001` | 해당 토큰이 존재하지 않습니다. | 400 |
| `EMAIL_TOKEN-002` | 토큰이 만료되었습니다. 다시 이메일인증 해주세요 | 400 |
| `EMAIL_TOKEN-003` | 이메일 토큰 생성중 오류가 발생했습니다. | 500 |
| `EMAIL_TOKEN-004` | 이메일 토큰의 필드 업데이트 후, 저장하는 과정에서 오류가 발생했습니다. | 500 |
| `EMAIL_TOKEN-005` | 인증이 완료되지 않은 이메일 토큰입니다. | 400 |

## Event (EVT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EVT-101` | 유효하지 않은 이벤트 코드입니다. | 400 |
| `EVT-102` | 이미 인증된 사용자입니다. | 400 |

## Club (CLUB)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CLUB-201` | 존재하지않는 동아리 입니다. | 404 |
| `CLUB-202` | 동아리 조회 중 오류가 발생했습니다. | 500 |
| `CLUB-203` | 이미 존재하는 동아리 이름입니다. | 409 |
| `CLUB-204` | 동아리 사진이 존재하지 않습니다 | 404 |
| `CLUB-205` | 이미 지정된 동아리방입니다. | 409 |

## Club Category (CTG, CG)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CTG-201` | 존재하지 않는 카테고리입니다. | 404 |
| `CG-202` | 카테고리는 최대 3개까지 선택할수 있습니다. | 413 |
| `CTG-203` | 이미 존재하는 카테고리입니다. | 409 |

## Club Intro (CINT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CINT-201` | 해당 동아리 소개글이 존재하지 않습니다. | 404 |
| `CINT-202` | 구글 폼 URL이 존재하지 않습니다. | 400 |
| `CINT-303` | 모집 상태가 올바르지 않습니다. | 400 |

## Admin (ADM)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `ADM-201` | 해당 계정이 존재하지 않습니다. | 404 |
| `ADM-202` | 관리자 비밀번호가 일치하지 않습니다. | 400 |

## Notice (NOT)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `NOT-201` | 공지사항이 존재하지 않습니다. | 404 |
| `NOT-202` | 최대 5개의 사진이 업로드 가능합니다. | 413 |
| `NOT-204` | 사진이 존재하지 않습니다. | 404 |
| `NOT-205` | 사진 순서는 1에서 5 사이여야 합니다. | 400 |
| `NOT-206` | 공지사항 조회 중 에러가 발생했습니다. | 400 |

## Profile (PFL)
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

## Club Leader (CLDR)
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `CLDR-101` | 동아리 접근 권한이 없습니다. | 403 |
| `CLDR-201` | 동아리 회장이 존재하지 않습니다. | 400 |
| `CLDR-202` | 동아리 회장 비밀번호가 일치하지 않습니다 | 400 |
| `CLDR-203` | 이미 존재하는 동아리 회장 계정입니다. | 422 |
| `CLDR-204` | 동아리 회장의 이름은 필수 입력 항목입니다. | 400 |

## Club Member (CMEM)
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

## Applicant (APT)
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

## File (FILE)
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

## Others
| Code | Message | HTTP Status |
| :--- | :--- | :--- |
| `EML-501` | 메일 전송에 실패했습니다. | 500 |
| `UUID-502` | 유효하지 않은 UUID 형식입니다. | 400 |
| `ATTEMPT-503` | 최대 시도 횟수를 초과했습니다. 5분 후  다시 시도 하세요 | 400 |
| `PHOTO-504` | 사진 파일이 비어있습니다. | 400 |
| `PHOTO-505` | 해당 사진이 존재하지 않습니다. | 404 |
| `ENUM-401` | 유효하지 않은 Enum 값입니다. | 400 |

## Search Patterns

Use grep to search this file efficiently:

- **Find error code**: `grep "^| \`CODE-XXX\`"`
- **Find all 404 errors**: `grep "| 404 |"`
- **Find USER domain**: `grep "^### User"`
- **Find specific domain errors**: `grep -A20 "^### DOMAIN_NAME"`
