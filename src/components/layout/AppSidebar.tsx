import { useNavigate, useLocation } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  UserGroupIcon,
  Settings01Icon,
  Megaphone01Icon,
  Logout01Icon,
  SidebarLeft01Icon,
} from '@hugeicons/core-free-icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useClubSummary } from '@/features/club-leader/hooks/useClubLeader'

import { ModeToggle } from '@/components/mode-toggle'

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar()
  const { clubUUID } = useAuthStore()

  // 클럽 정보 조회
  const { data: clubSummaryData } = useClubSummary(clubUUID || '')
  const clubSummary = clubSummaryData?.data

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const isClubActive = location.pathname.startsWith('/club')
  const isApplicantsActive = location.pathname.startsWith('/applicants')

  // 동아리 회장 정보
  const leaderInfo = {
    name: clubSummary?.leaderName || '동아리 회장',
    clubName: clubSummary?.clubName || '동아리',
    mainPhoto: clubSummary?.mainPhoto || null,
  }

  return (
    <Sidebar collapsible="icon">
      {/* 헤더 */}
      <SidebarHeader>
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center px-2 py-3">
          {/* 펼쳐진 상태: 동구라미 텍스트 */}
          <span
            className="font-bold text-xl group-data-[collapsible=icon]:hidden"
            style={{ fontFamily: 'Juache, sans-serif', color: 'var(--brand-primary)' }}
          >
            동구라미
          </span>

          {/* 접힌 상태: 사이드바 아이콘 (상단) */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="hidden group-data-[collapsible=icon]:flex"
          >
            <HugeiconsIcon icon={SidebarLeft01Icon} className="size-5" />
          </Button>

          {/* 펼쳐진 상태: 사이드바 토글 아이콘 (오른쪽) */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="group-data-[collapsible=icon]:hidden"
          >
            <HugeiconsIcon icon={SidebarLeft01Icon} className="size-5" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* 메인 메뉴 */}
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 대시보드 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/dashboard')}
                  tooltip="대시보드"
                  isActive={location.pathname === '/dashboard'}
                >
                  <HugeiconsIcon icon={Home01Icon} />
                  <span>대시보드</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 동아리 관리 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/club/basic-info')}
                  tooltip="동아리 관리"
                  isActive={isClubActive}
                >
                  <HugeiconsIcon icon={Settings01Icon} />
                  <span>동아리 관리</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/club/basic-info')}
                      isActive={location.pathname === '/club/basic-info'}
                    >
                      <span>기본정보 수정</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/club/recruitment')}
                      isActive={location.pathname === '/club/recruitment'}
                    >
                      <span>모집 정보 수정</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* 지원자 관리 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/applicants/review')}
                  tooltip="지원자 관리"
                  isActive={isApplicantsActive}
                >
                  <HugeiconsIcon icon={UserGroupIcon} />
                  <span>지원자 관리</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/applicants/review')}
                      isActive={location.pathname === '/applicants/review'}
                    >
                      <span>지원서 검토</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/applicants/finalize')}
                      isActive={location.pathname === '/applicants/finalize'}
                    >
                      <span>합격자 확정</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* 공지사항 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/notices')}
                  tooltip="공지사항"
                  isActive={location.pathname === '/notices'}
                >
                  <HugeiconsIcon icon={Megaphone01Icon} />
                  <span>공지사항</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* 펼쳐진 상태: 동아리 회장 정보 */}
        <div className="group-data-[collapsible=icon]:hidden border-t pt-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={leaderInfo.mainPhoto || '/v2/circle_default_image.png'} alt={leaderInfo.clubName} onError={(e: any) => { e.currentTarget.src = '/v2/circle_default_image.png' }} />
              <AvatarFallback>{leaderInfo.clubName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{leaderInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{leaderInfo.clubName} 회장</p>
            </div>
          </div>

          {/* 테마 설정 */}
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm text-muted-foreground">테마 설정</span>
            <ModeToggle />
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <HugeiconsIcon icon={Logout01Icon} />
                <span>로그아웃</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* 하단 링크들 */}
          <div className="flex gap-4 px-2 py-2 text-xs text-muted-foreground">
            <a href="/privacy" className="hover:underline">
              개인정보처리방침
            </a>
            <a href="/terms" className="hover:underline">
              이용약관
            </a>
          </div>
        </div>

        {/* 접힌 상태: 동아리 아이콘 */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={leaderInfo.mainPhoto || '/v2/circle_default_image.png'} alt={leaderInfo.clubName} onError={(e: any) => { e.currentTarget.src = '/v2/circle_default_image.png' }} />
            <AvatarFallback>{leaderInfo.clubName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex justify-center">
            <ModeToggle />
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="로그아웃">
                <HugeiconsIcon icon={Logout01Icon} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
