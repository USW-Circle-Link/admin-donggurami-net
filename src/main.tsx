import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './index.css'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { UnionLayout } from '@/components/layout/UnionLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthInitializer } from '@/components/auth/AuthInitializer'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { BasicInfoEditPage } from '@/pages/BasicInfoEditPage'
import { RecruitmentEditPage } from '@/pages/RecruitmentEditPage'
import { ApplicationReviewPage } from '@/pages/ApplicationReviewPage'
import { FinalizePage } from '@/pages/FinalizePage'
import { NoticesPage } from '@/pages/NoticesPage'
import { UnionDashboardPage } from '@/pages/union/UnionDashboardPage'
import { RoomInfoEditPage } from '@/pages/union/RoomInfoEditPage'
import { CategoryEditPage } from '@/pages/union/CategoryEditPage'
import { UnionNoticesPage } from '@/pages/union/UnionNoticesPage'
import { ClubAddPage } from '@/pages/union/ClubAddPage'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthInitializer>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Club admin routes with sidebar layout */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/club/basic-info" element={<BasicInfoEditPage />} />
            <Route path="/club/recruitment" element={<RecruitmentEditPage />} />
            <Route path="/applicants/review" element={<ApplicationReviewPage />} />
            <Route path="/applicants/finalize" element={<FinalizePage />} />
            <Route path="/notices" element={<NoticesPage />} />
          </Route>

          {/* Union admin routes with union layout */}
          <Route element={<ProtectedRoute><UnionLayout /></ProtectedRoute>}>
            <Route path="/union/dashboard" element={<UnionDashboardPage />} />
            <Route path="/union/clubs/add" element={<ClubAddPage />} />
            <Route path="/union/clubs/rooms" element={<RoomInfoEditPage />} />
            <Route path="/union/clubs/categories" element={<CategoryEditPage />} />
            <Route path="/union/notices" element={<UnionNoticesPage />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        </AuthInitializer>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  </QueryClientProvider>
)
