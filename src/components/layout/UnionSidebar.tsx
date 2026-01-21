import { useNavigate, useLocation } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  Settings01Icon,
  Megaphone01Icon,
  Logout01Icon,
  SidebarLeft01Icon,
  Building03Icon,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/mode-toggle'

export function UnionSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar()

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const isClubManageActive = location.pathname.startsWith('/union/clubs')

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center px-2 py-3">
          <span
            className="font-bold text-xl group-data-[collapsible=icon]:hidden"
            style={{ fontFamily: 'Juache, sans-serif', color: 'var(--brand-primary)' }}
          >
            동구라미
          </span>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="hidden group-data-[collapsible=icon]:flex"
          >
            <HugeiconsIcon icon={SidebarLeft01Icon} className="size-5" />
          </Button>

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
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 대시보드 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/union/dashboard')}
                  tooltip="대시보드"
                  isActive={location.pathname === '/union/dashboard'}
                >
                  <HugeiconsIcon icon={Home01Icon} />
                  <span>대시보드</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 동아리 관리 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/union/clubs/add')}
                  tooltip="동아리 관리"
                  isActive={isClubManageActive}
                >
                  <HugeiconsIcon icon={Settings01Icon} />
                  <span>동아리 관리</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/union/clubs/add')}
                      isActive={location.pathname === '/union/clubs/add'}
                    >
                      <span>동아리 추가</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/union/clubs/rooms')}
                      isActive={location.pathname === '/union/clubs/rooms'}
                    >
                      <span>동아리방 정보 수정</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={() => handleNavigation('/union/clubs/categories')}
                      isActive={location.pathname === '/union/clubs/categories'}
                    >
                      <span>동아리 카테고리 수정</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* 공지사항 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/union/notices')}
                  tooltip="공지사항"
                  isActive={location.pathname.startsWith('/union/notices')}
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
        {/* 펼쳐진 상태: 연합회 정보 */}
        <div className="group-data-[collapsible=icon]:hidden border-t pt-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                <HugeiconsIcon icon={Building03Icon} className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">동아리 연합회</p>
              <p className="text-xs text-muted-foreground truncate">관리자</p>
            </div>
          </div>

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

          <div className="flex gap-4 px-2 py-2 text-xs text-muted-foreground">
            <a href="/privacy" className="hover:underline">
              개인정보처리방침
            </a>
            <a href="/terms" className="hover:underline">
              이용약관
            </a>
          </div>
        </div>

        {/* 접힌 상태 */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <HugeiconsIcon icon={Building03Icon} className="size-4" />
            </AvatarFallback>
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
