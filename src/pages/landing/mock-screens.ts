/** SVG data URI mock screens for landing page device mockups */

/** Mobile browser showing donggurami.net */
export const mobileAppScreen = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="#ffffff"/>

  <!-- Status bar -->
  <text x="20" y="24" fill="#333" font-size="13" font-family="sans-serif" font-weight="600">9:41</text>
  <rect x="352" y="16" width="22" height="10" rx="2" stroke="#333" stroke-width="1" fill="none"/>
  <rect x="354" y="18" width="14" height="6" rx="1" fill="#333"/>

  <!-- Browser URL bar -->
  <rect x="16" y="40" width="358" height="36" rx="10" fill="#f0f0f0"/>
  <text x="115" y="63" fill="#666" font-size="13" font-family="sans-serif">donggurami.net</text>
  <!-- Lock icon -->
  <rect x="96" y="52" width="10" height="8" rx="2" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <path d="M98 52 V49 A3 3 0 0 1 104 49 V52" fill="none" stroke="#34d399" stroke-width="1.5"/>

  <!-- Hero section - golden gradient banner -->
  <defs>
    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect x="0" y="88" width="390" height="200" fill="url(#heroGrad)"/>
  <text x="30" y="145" fill="#ffffff" font-size="26" font-family="sans-serif" font-weight="800">동아리 구하는</text>
  <text x="30" y="178" fill="#ffffff" font-size="26" font-family="sans-serif" font-weight="800">사람 모여라!</text>
  <text x="30" y="210" fill="rgba(255,255,255,0.8)" font-size="14" font-family="sans-serif">수원대학교 중앙동아리를 쉽게 찾고 지원하세요</text>

  <!-- Floating search card -->
  <rect x="20" y="268" width="350" height="48" rx="14" fill="#ffffff" stroke="#e5e5e5" stroke-width="1"/>
  <circle cx="44" cy="292" r="10" stroke="#a3a3a3" stroke-width="1.5" fill="none"/>
  <line x1="51" y1="299" x2="55" y2="303" stroke="#a3a3a3" stroke-width="1.5"/>
  <text x="64" y="297" fill="#a3a3a3" font-size="14" font-family="sans-serif">동아리 검색</text>

  <!-- Section title -->
  <text x="20" y="350" fill="#171717" font-size="18" font-family="sans-serif" font-weight="700">모집 중인 동아리</text>
  <text x="310" y="350" fill="#f59e0b" font-size="13" font-family="sans-serif">전체보기</text>

  <!-- Club card 1 -->
  <rect x="20" y="368" width="350" height="88" rx="14" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="36" y="384" width="56" height="56" rx="12" fill="#fef3c7"/>
  <text x="52" y="420" fill="#f59e0b" font-size="22" font-family="sans-serif" font-weight="700">C</text>
  <text x="108" y="404" fill="#171717" font-size="15" font-family="sans-serif" font-weight="600">코딩클럽</text>
  <text x="108" y="424" fill="#737373" font-size="12" font-family="sans-serif">프로그래밍 학습 동아리</text>
  <rect x="108" y="432" width="48" height="18" rx="9" fill="#fef3c7"/>
  <text x="117" y="444" fill="#d97706" font-size="10" font-family="sans-serif" font-weight="500">학술</text>
  <rect x="162" y="432" width="48" height="18" rx="9" fill="#dcfce7"/>
  <text x="168" y="444" fill="#16a34a" font-size="10" font-family="sans-serif" font-weight="500">모집중</text>

  <!-- Club card 2 -->
  <rect x="20" y="468" width="350" height="88" rx="14" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="36" y="484" width="56" height="56" rx="12" fill="#ede9fe"/>
  <text x="52" y="520" fill="#7c3aed" font-size="22" font-family="sans-serif" font-weight="700">M</text>
  <text x="108" y="504" fill="#171717" font-size="15" font-family="sans-serif" font-weight="600">뮤직밴드</text>
  <text x="108" y="524" fill="#737373" font-size="12" font-family="sans-serif">밴드 음악 동아리</text>
  <rect x="108" y="532" width="48" height="18" rx="9" fill="#ede9fe"/>
  <text x="117" y="544" fill="#7c3aed" font-size="10" font-family="sans-serif" font-weight="500">문화</text>
  <rect x="162" y="532" width="48" height="18" rx="9" fill="#dcfce7"/>
  <text x="168" y="544" fill="#16a34a" font-size="10" font-family="sans-serif" font-weight="500">모집중</text>

  <!-- Club card 3 -->
  <rect x="20" y="568" width="350" height="88" rx="14" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="36" y="584" width="56" height="56" rx="12" fill="#d1fae5"/>
  <text x="50" y="620" fill="#059669" font-size="22" font-family="sans-serif" font-weight="700">FC</text>
  <text x="108" y="604" fill="#171717" font-size="15" font-family="sans-serif" font-weight="600">FC 수원</text>
  <text x="108" y="624" fill="#737373" font-size="12" font-family="sans-serif">축구 동아리</text>
  <rect x="108" y="632" width="56" height="18" rx="9" fill="#d1fae5"/>
  <text x="115" y="644" fill="#059669" font-size="10" font-family="sans-serif" font-weight="500">스포츠</text>
  <rect x="170" y="632" width="48" height="18" rx="9" fill="#dcfce7"/>
  <text x="176" y="644" fill="#16a34a" font-size="10" font-family="sans-serif" font-weight="500">모집중</text>

  <!-- Club card 4 (partial) -->
  <rect x="20" y="668" width="350" height="88" rx="14" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="36" y="684" width="56" height="56" rx="12" fill="#fce7f3"/>
  <text x="52" y="720" fill="#db2777" font-size="22" font-family="sans-serif" font-weight="700">V</text>
  <text x="108" y="704" fill="#171717" font-size="15" font-family="sans-serif" font-weight="600">봉사단</text>
  <text x="108" y="724" fill="#737373" font-size="12" font-family="sans-serif">지역사회 봉사 동아리</text>

  <!-- Bottom navigation -->
  <rect x="0" y="780" width="390" height="64" fill="#ffffff"/>
  <line x1="0" y1="780" x2="390" y2="780" stroke="#e5e5e5" stroke-width="1"/>
  <!-- Home -->
  <rect x="52" y="794" width="18" height="14" rx="2" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
  <path d="M52 800 L61 792 L70 800" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
  <text x="50" y="825" fill="#f59e0b" font-size="10" font-family="sans-serif" font-weight="500">홈</text>
  <!-- Applications -->
  <rect x="150" y="794" width="14" height="14" rx="2" stroke="#a3a3a3" stroke-width="1.5" fill="none"/>
  <text x="139" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">지원현황</text>
  <!-- Notifications -->
  <circle cx="256" cy="801" r="7" stroke="#a3a3a3" stroke-width="1.5" fill="none"/>
  <text x="241" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">알림</text>
  <!-- My page -->
  <circle cx="340" cy="799" r="6" stroke="#a3a3a3" stroke-width="1.5" fill="none"/>
  <text x="318" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">마이페이지</text>

  <!-- Home indicator -->
  <rect x="140" y="836" width="110" height="4" rx="2" fill="#e0e0e0"/>
</svg>
`)}`

/** Dashboard mock - admin panel screen (matches actual UI) */
export const dashboardScreen = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
  <rect width="1200" height="700" fill="#171717"/>

  <!-- Sidebar -->
  <rect x="0" y="0" width="220" height="700" fill="#1a1a1a"/>
  <rect x="0" y="0" width="220" height="700" stroke="#262626" stroke-width="1" fill="none"/>

  <!-- Sidebar logo -->
  <circle cx="36" cy="32" r="14" fill="#fbbf24" opacity="0.2"/>
  <text x="30" y="38" fill="#fbbf24" font-size="14" font-family="sans-serif" font-weight="700">D</text>
  <text x="58" y="38" fill="#fbbf24" font-size="16" font-family="sans-serif" font-weight="700">동구라미</text>

  <!-- Sidebar menu label -->
  <text x="16" y="72" fill="#525252" font-size="11" font-family="sans-serif" font-weight="500">메뉴</text>

  <!-- Active: 대시보드 -->
  <rect x="12" y="80" width="196" height="36" rx="8" fill="#fbbf24" opacity="0.1"/>
  <circle cx="28" cy="98" r="3" fill="#fbbf24"/>
  <text x="44" y="103" fill="#fbbf24" font-size="13" font-family="sans-serif" font-weight="500">대시보드</text>

  <!-- 동아리 관리 -->
  <circle cx="28" cy="134" r="3" fill="#404040"/>
  <text x="44" y="139" fill="#a3a3a3" font-size="13" font-family="sans-serif">동아리 관리</text>
  <text x="56" y="160" fill="#525252" font-size="12" font-family="sans-serif">기본정보 수정</text>
  <text x="56" y="180" fill="#525252" font-size="12" font-family="sans-serif">모집 정보 수정</text>

  <!-- 지원자 관리 -->
  <circle cx="28" cy="206" r="3" fill="#404040"/>
  <text x="44" y="211" fill="#a3a3a3" font-size="13" font-family="sans-serif">지원자 관리</text>
  <text x="56" y="232" fill="#525252" font-size="12" font-family="sans-serif">지원서 검토</text>
  <text x="56" y="252" fill="#525252" font-size="12" font-family="sans-serif">합격자 확정</text>

  <!-- 공지사항 -->
  <circle cx="28" cy="278" r="3" fill="#404040"/>
  <text x="44" y="283" fill="#a3a3a3" font-size="13" font-family="sans-serif">공지사항</text>

  <!-- Main content area -->
  <text x="248" y="42" fill="#f5f5f5" font-size="20" font-family="sans-serif" font-weight="700">대시보드</text>
  <text x="248" y="62" fill="#737373" font-size="13" font-family="sans-serif">동아리 현황을 한눈에 확인하세요</text>

  <!-- Club info card -->
  <rect x="248" y="80" width="928" height="260" rx="12" fill="#262626"/>

  <!-- Club avatar & name -->
  <circle cx="290" cy="122" r="28" fill="#fbbf24" opacity="0.15"/>
  <text x="278" y="130" fill="#fbbf24" font-size="20" font-family="sans-serif" font-weight="700">C</text>
  <text x="330" y="118" fill="#f5f5f5" font-size="18" font-family="sans-serif" font-weight="700">코딩클럽</text>
  <rect x="410" y="104" width="52" height="22" rx="11" fill="#fbbf24" opacity="0.15"/>
  <text x="419" y="120" fill="#fbbf24" font-size="11" font-family="sans-serif">모집중</text>

  <!-- Edit button -->
  <rect x="1080" y="100" width="76" height="30" rx="6" fill="none" stroke="#404040" stroke-width="1"/>
  <text x="1088" y="120" fill="#a3a3a3" font-size="11" font-family="sans-serif">기본 정보 수정</text>

  <!-- Info grid: 대표자, 연락처, 동아리방, 인스타그램 -->
  <text x="272" y="174" fill="#737373" font-size="11" font-family="sans-serif">대표자</text>
  <text x="272" y="194" fill="#f5f5f5" font-size="14" font-family="sans-serif" font-weight="500">김동구</text>

  <text x="502" y="174" fill="#737373" font-size="11" font-family="sans-serif">연락처</text>
  <text x="502" y="194" fill="#f5f5f5" font-size="14" font-family="sans-serif" font-weight="500">010-1234-5678</text>

  <text x="732" y="174" fill="#737373" font-size="11" font-family="sans-serif">동아리방</text>
  <text x="732" y="194" fill="#f5f5f5" font-size="14" font-family="sans-serif" font-weight="500">미래혁신관 301호</text>

  <text x="962" y="174" fill="#737373" font-size="11" font-family="sans-serif">인스타그램</text>
  <text x="962" y="194" fill="#f5f5f5" font-size="14" font-family="sans-serif" font-weight="500">@coding_club_usw</text>

  <!-- Hashtags -->
  <rect x="272" y="218" width="72" height="24" rx="12" fill="none" stroke="#404040" stroke-width="1"/>
  <text x="282" y="234" fill="#a3a3a3" font-size="11" font-family="sans-serif">#프로그래밍</text>
  <rect x="352" y="218" width="56" height="24" rx="12" fill="none" stroke="#404040" stroke-width="1"/>
  <text x="362" y="234" fill="#a3a3a3" font-size="11" font-family="sans-serif">#코딩</text>
  <rect x="416" y="218" width="56" height="24" rx="12" fill="none" stroke="#404040" stroke-width="1"/>
  <text x="426" y="234" fill="#a3a3a3" font-size="11" font-family="sans-serif">#개발</text>

  <!-- Club intro photo area -->
  <text x="272" y="272" fill="#737373" font-size="11" font-family="sans-serif">동아리 소개 사진</text>
  <rect x="272" y="280" width="880" height="46" rx="8" fill="#333"/>
  <rect x="276" y="284" width="60" height="38" rx="4" fill="#404040"/>
  <rect x="342" y="284" width="60" height="38" rx="4" fill="#404040"/>
  <rect x="408" y="284" width="60" height="38" rx="4" fill="#404040"/>

  <!-- Members table card -->
  <rect x="248" y="356" width="928" height="330" rx="12" fill="#262626"/>

  <text x="272" y="388" fill="#f5f5f5" font-size="16" font-family="sans-serif" font-weight="600">동아리 명단</text>
  <text x="272" y="408" fill="#737373" font-size="12" font-family="sans-serif">총 25명</text>

  <!-- Export button -->
  <rect x="1056" y="376" width="96" height="30" rx="6" fill="none" stroke="#404040" stroke-width="1"/>
  <text x="1068" y="396" fill="#a3a3a3" font-size="11" font-family="sans-serif">25명 내보내기</text>

  <!-- Search bar -->
  <rect x="272" y="420" width="880" height="36" rx="8" fill="#333"/>
  <text x="300" y="443" fill="#525252" font-size="12" font-family="sans-serif">이름, 학번, 학과로 검색...</text>

  <!-- Table header -->
  <rect x="272" y="468" width="880" height="32" rx="0" fill="#1f1f1f"/>
  <rect x="284" y="480" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="489" fill="#737373" font-size="12" font-family="sans-serif" font-weight="500">이름</text>
  <text x="460" y="489" fill="#737373" font-size="12" font-family="sans-serif" font-weight="500">학번</text>
  <text x="610" y="489" fill="#737373" font-size="12" font-family="sans-serif" font-weight="500">학과</text>
  <text x="790" y="489" fill="#737373" font-size="12" font-family="sans-serif" font-weight="500">연락처</text>
  <text x="980" y="489" fill="#737373" font-size="12" font-family="sans-serif" font-weight="500">회원 유형</text>

  <!-- Row 1 -->
  <line x1="272" y1="500" x2="1152" y2="500" stroke="#333" stroke-width="1"/>
  <rect x="284" y="512" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="523" fill="#e5e5e5" font-size="13" font-family="sans-serif" font-weight="500">김민수</text>
  <text x="460" y="523" fill="#a3a3a3" font-size="13" font-family="sans-serif">20241234</text>
  <text x="610" y="523" fill="#a3a3a3" font-size="13" font-family="sans-serif">컴퓨터학부</text>
  <text x="790" y="523" fill="#a3a3a3" font-size="13" font-family="sans-serif">010-1111-2222</text>
  <rect x="980" y="509" width="52" height="22" rx="11" fill="#fbbf24" opacity="0.15"/>
  <text x="990" y="525" fill="#fbbf24" font-size="11" font-family="sans-serif">정회원</text>

  <!-- Row 2 -->
  <line x1="272" y1="536" x2="1152" y2="536" stroke="#333" stroke-width="1"/>
  <rect x="284" y="548" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="559" fill="#e5e5e5" font-size="13" font-family="sans-serif" font-weight="500">이지은</text>
  <text x="460" y="559" fill="#a3a3a3" font-size="13" font-family="sans-serif">20245678</text>
  <text x="610" y="559" fill="#a3a3a3" font-size="13" font-family="sans-serif">경영학과</text>
  <text x="790" y="559" fill="#a3a3a3" font-size="13" font-family="sans-serif">010-3333-4444</text>
  <rect x="980" y="545" width="52" height="22" rx="11" fill="#fbbf24" opacity="0.15"/>
  <text x="990" y="561" fill="#fbbf24" font-size="11" font-family="sans-serif">정회원</text>

  <!-- Row 3 -->
  <line x1="272" y1="572" x2="1152" y2="572" stroke="#333" stroke-width="1"/>
  <rect x="284" y="584" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="595" fill="#e5e5e5" font-size="13" font-family="sans-serif" font-weight="500">박서준</text>
  <text x="460" y="595" fill="#a3a3a3" font-size="13" font-family="sans-serif">20239012</text>
  <text x="610" y="595" fill="#a3a3a3" font-size="13" font-family="sans-serif">전자공학과</text>
  <text x="790" y="595" fill="#a3a3a3" font-size="13" font-family="sans-serif">010-5555-6666</text>
  <rect x="980" y="581" width="52" height="22" rx="11" fill="none" stroke="#525252" stroke-width="1"/>
  <text x="990" y="597" fill="#a3a3a3" font-size="11" font-family="sans-serif">비회원</text>

  <!-- Row 4 -->
  <line x1="272" y1="608" x2="1152" y2="608" stroke="#333" stroke-width="1"/>
  <rect x="284" y="620" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="631" fill="#e5e5e5" font-size="13" font-family="sans-serif" font-weight="500">최유진</text>
  <text x="460" y="631" fill="#a3a3a3" font-size="13" font-family="sans-serif">20240345</text>
  <text x="610" y="631" fill="#a3a3a3" font-size="13" font-family="sans-serif">디자인학과</text>
  <text x="790" y="631" fill="#a3a3a3" font-size="13" font-family="sans-serif">010-7777-8888</text>
  <rect x="980" y="617" width="52" height="22" rx="11" fill="#fbbf24" opacity="0.15"/>
  <text x="990" y="633" fill="#fbbf24" font-size="11" font-family="sans-serif">정회원</text>

  <!-- Row 5 -->
  <line x1="272" y1="644" x2="1152" y2="644" stroke="#333" stroke-width="1"/>
  <rect x="284" y="656" width="12" height="12" rx="2" fill="none" stroke="#525252" stroke-width="1.5"/>
  <text x="316" y="667" fill="#e5e5e5" font-size="13" font-family="sans-serif" font-weight="500">정하늘</text>
  <text x="460" y="667" fill="#a3a3a3" font-size="13" font-family="sans-serif">20246789</text>
  <text x="610" y="667" fill="#a3a3a3" font-size="13" font-family="sans-serif">체육학과</text>
  <text x="790" y="667" fill="#a3a3a3" font-size="13" font-family="sans-serif">010-9999-0000</text>
  <rect x="980" y="653" width="52" height="22" rx="11" fill="#fbbf24" opacity="0.15"/>
  <text x="990" y="669" fill="#fbbf24" font-size="11" font-family="sans-serif">정회원</text>
</svg>
`)}`

/** Mobile browser showing donggurami.net - application status view */
export const mobilePreviewScreen = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="#ffffff"/>

  <!-- Status bar -->
  <text x="20" y="24" fill="#333" font-size="13" font-family="sans-serif" font-weight="600">9:41</text>
  <rect x="352" y="16" width="22" height="10" rx="2" stroke="#333" stroke-width="1" fill="none"/>
  <rect x="354" y="18" width="14" height="6" rx="1" fill="#333"/>

  <!-- Browser URL bar -->
  <rect x="16" y="40" width="358" height="36" rx="10" fill="#f0f0f0"/>
  <text x="115" y="63" fill="#666" font-size="13" font-family="sans-serif">donggurami.net</text>
  <rect x="96" y="52" width="10" height="8" rx="2" fill="none" stroke="#34d399" stroke-width="1.5"/>
  <path d="M98 52 V49 A3 3 0 0 1 104 49 V52" fill="none" stroke="#34d399" stroke-width="1.5"/>

  <!-- Header -->
  <text x="20" y="110" fill="#171717" font-size="20" font-family="sans-serif" font-weight="700">지원 현황</text>

  <!-- Active application card -->
  <rect x="20" y="130" width="350" height="150" rx="16" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="20" y="130" width="350" height="5" rx="2.5" fill="#f59e0b"/>

  <text x="40" y="166" fill="#171717" font-size="16" font-family="sans-serif" font-weight="600">코딩클럽</text>
  <rect x="298" y="150" width="52" height="24" rx="12" fill="#fef3c7"/>
  <text x="307" y="167" fill="#d97706" font-size="11" font-family="sans-serif" font-weight="500">심사중</text>

  <text x="40" y="190" fill="#737373" font-size="13" font-family="sans-serif">프로그래밍 학습 동아리</text>
  <text x="40" y="212" fill="#a3a3a3" font-size="12" font-family="sans-serif">지원일: 2026.02.20</text>

  <!-- Progress bar -->
  <rect x="40" y="228" width="310" height="6" rx="3" fill="#f0f0f0"/>
  <rect x="40" y="228" width="200" height="6" rx="3" fill="#f59e0b"/>
  <text x="40" y="254" fill="#737373" font-size="11" font-family="sans-serif">서류 심사 완료 - 면접 대기중</text>

  <!-- Completed application -->
  <rect x="20" y="280" width="350" height="120" rx="16" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="20" y="280" width="350" height="5" rx="2.5" fill="#22c55e"/>

  <text x="40" y="316" fill="#171717" font-size="16" font-family="sans-serif" font-weight="600">뮤직밴드</text>
  <rect x="298" y="300" width="52" height="24" rx="12" fill="#dcfce7"/>
  <text x="314" y="317" fill="#16a34a" font-size="11" font-family="sans-serif" font-weight="500">합격</text>

  <text x="40" y="342" fill="#737373" font-size="13" font-family="sans-serif">밴드 음악 동아리</text>
  <text x="40" y="372" fill="#16a34a" font-size="12" font-family="sans-serif">축하합니다! 합격하셨습니다.</text>

  <!-- Another card -->
  <rect x="20" y="420" width="350" height="120" rx="16" fill="#ffffff" stroke="#f0f0f0" stroke-width="1"/>
  <rect x="20" y="420" width="350" height="5" rx="2.5" fill="#e5e5e5"/>

  <text x="40" y="456" fill="#a3a3a3" font-size="16" font-family="sans-serif" font-weight="600">독서모임</text>
  <rect x="298" y="440" width="52" height="24" rx="12" fill="#f5f5f5"/>
  <text x="308" y="457" fill="#a3a3a3" font-size="11" font-family="sans-serif">불합격</text>

  <text x="40" y="482" fill="#a3a3a3" font-size="13" font-family="sans-serif">인문학 독서 동아리</text>
  <text x="40" y="512" fill="#d4d4d4" font-size="12" font-family="sans-serif">지원일: 2026.02.15</text>

  <!-- Summary section -->
  <text x="20" y="590" fill="#171717" font-size="16" font-family="sans-serif" font-weight="600">지원 요약</text>

  <rect x="20" y="610" width="108" height="80" rx="12" fill="#f9fafb" stroke="#f0f0f0" stroke-width="1"/>
  <text x="55" y="650" fill="#171717" font-size="24" font-family="sans-serif" font-weight="700">3</text>
  <text x="42" y="674" fill="#a3a3a3" font-size="11" font-family="sans-serif">총 지원</text>

  <rect x="140" y="610" width="108" height="80" rx="12" fill="#f0fdf4" stroke="#dcfce7" stroke-width="1"/>
  <text x="179" y="650" fill="#16a34a" font-size="24" font-family="sans-serif" font-weight="700">1</text>
  <text x="168" y="674" fill="#a3a3a3" font-size="11" font-family="sans-serif">합격</text>

  <rect x="260" y="610" width="108" height="80" rx="12" fill="#fffbeb" stroke="#fef3c7" stroke-width="1"/>
  <text x="299" y="650" fill="#d97706" font-size="24" font-family="sans-serif" font-weight="700">1</text>
  <text x="284" y="674" fill="#a3a3a3" font-size="11" font-family="sans-serif">심사중</text>

  <!-- Bottom navigation -->
  <rect x="0" y="780" width="390" height="64" fill="#ffffff"/>
  <line x1="0" y1="780" x2="390" y2="780" stroke="#e5e5e5" stroke-width="1"/>
  <circle cx="65" cy="805" r="3" fill="#a3a3a3"/>
  <text x="50" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">홈</text>
  <circle cx="162" cy="805" r="3" fill="#f59e0b"/>
  <text x="143" y="825" fill="#f59e0b" font-size="10" font-family="sans-serif" font-weight="500">지원현황</text>
  <circle cx="260" cy="805" r="3" fill="#a3a3a3"/>
  <text x="244" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">알림</text>
  <circle cx="340" cy="805" r="3" fill="#a3a3a3"/>
  <text x="318" y="825" fill="#a3a3a3" font-size="10" font-family="sans-serif">마이페이지</text>

  <!-- Home indicator -->
  <rect x="140" y="836" width="110" height="4" rx="2" fill="#e0e0e0"/>
</svg>
`)}`
