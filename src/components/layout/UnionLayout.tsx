import { Outlet } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { UnionSidebar } from './UnionSidebar'

export function UnionLayout() {
  return (
    <SidebarProvider>
      <UnionSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold">메뉴</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
