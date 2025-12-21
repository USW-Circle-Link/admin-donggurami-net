import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { BasicInfoEditPage } from '@/pages/BasicInfoEditPage'
import { RecruitmentEditPage } from '@/pages/RecruitmentEditPage'
import { ApplicationReviewPage } from '@/pages/ApplicationReviewPage'
import { FinalizePage } from '@/pages/FinalizePage'
import { NoticesPage } from '@/pages/NoticesPage'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes with sidebar layout */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/club/basic-info" element={<BasicInfoEditPage />} />
        <Route path="/club/recruitment" element={<RecruitmentEditPage />} />
        <Route path="/applicants/review" element={<ApplicationReviewPage />} />
        <Route path="/applicants/finalize" element={<FinalizePage />} />
        <Route path="/notices" element={<NoticesPage />} />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)
