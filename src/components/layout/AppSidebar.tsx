import { NavLink, useNavigate } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  UserGroupIcon,
  Settings01Icon,
  Megaphone01Icon,
  Logout01Icon,
  ArrowDown01Icon,
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
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function AppSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 실제로는 로그아웃 로직 실행
    navigate('/login')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            동
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            동구라미 관리자
          </span>
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
                  render={<NavLink to="/dashboard" />}
                  tooltip="대시보드"
                >
                  <HugeiconsIcon icon={Home01Icon} />
                  <span>대시보드</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 동아리 관리 - 접었다 폈다 */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton tooltip="동아리 관리">
                        <HugeiconsIcon icon={Settings01Icon} />
                        <span>동아리 관리</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          className="ml-auto transition-transform data-[panel-open]:rotate-180"
                        />
                      </SidebarMenuButton>
                    }
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<NavLink to="/club/basic-info" />}>
                          <span>기본정보 수정</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<NavLink to="/club/recruitment" />}>
                          <span>모집 정보 수정</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* 지원자 관리 - 접었다 폈다 */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton tooltip="지원자 관리">
                        <HugeiconsIcon icon={UserGroupIcon} />
                        <span>지원자 관리</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          className="ml-auto transition-transform data-[panel-open]:rotate-180"
                        />
                      </SidebarMenuButton>
                    }
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<NavLink to="/applicants/review" />}>
                          <span>지원서 검토</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<NavLink to="/applicants/finalize" />}>
                          <span>합격자 확정</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* 공지사항 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<NavLink to="/notices" />}
                  tooltip="공지사항"
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
        <SidebarMenu>
          {/* 로그아웃 */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="로그아웃">
              <HugeiconsIcon icon={Logout01Icon} />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* 하단 링크들 */}
        <div className="flex gap-4 px-2 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <a href="/privacy" className="hover:underline">
            개인정보처리방침
          </a>
          <a href="/terms" className="hover:underline">
            이용약관
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
