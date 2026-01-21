# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an admin dashboard application for donggurami.net built with React 19, TypeScript, and Vite 7. Development follows TDD principles, focusing on data layer and API communication without UI work.

## Development Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript compile + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **React Router 7** for client-side routing
- **Zustand** - Lightweight state management with minimal boilerplate
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptor support for JWT auth
- **TanStack Query (React Query)** - Server state management, caching, data fetching
- **React Hook Form** + **Zod** - Form management with schema-based validation

## Architecture

- Entry point: `src/main.tsx` - Sets up BrowserRouter and renders the app
- Routing is configured in `main.tsx` using React Router's `Routes` and `Route` components

## Authentication Strategy

- **Access Token**: Persisted in localStorage (recovered on app refresh)
- **In-Memory Token**: Synced with localStorage via Zustand store
- **Refresh Token**: Stored in httpOnly cookies
- **Token Refresh**: Handled via Axios interceptors using `/integration/refresh-token` endpoint
- **Protected Routes**: All app routes wrapped with `ProtectedRoute` component - unauthorized users redirected to `/login`
- **Auto-Initialization**: `AuthInitializer` component validates token on app startup
  - Valid token → auto-redirect to dashboard
  - Invalid/expired token → auto-redirect to login
- **Bidirectional Sync**: apiClient and authStore stay synchronized across page refreshes
- **Role-based Access Control**: USER, LEADER, ADMIN roles with router-level guards

## Validation Standards

- Phone numbers: `010XXXXXXXX` format (no hyphens), validated client-side with regex
- UUID and other fields validated using Zod schemas with React Hook Form

## Key Components & Features

### Authentication Components
- **ProtectedRoute**: Guards all protected routes - redirects unauthenticated users to login
- **AuthInitializer**: Validates token on app startup, handles auto-redirect logic
- **useAuthInitialization**: Hook that validates persisted tokens with backend

### UI Components & Features
- **Dashboard Carousel**: Photo carousel for intro photos with navigation controls and indicators
- **Sidebar Logo Display**: Dynamic club logo in sidebar (both expanded/collapsed states) with fallback to default image
- **Image Error Handling**: All images have `onError` handlers that fallback to `/v2/circle_default_image.png`
- **Basic Info Editor**: Logo upload with preview, club introduction textarea (max 3000 chars), hashtag management

### API Improvements
- **Multipart FormData**: All file upload endpoints properly use FormData with JSON Blob serialization
  - `updateClubIntro`: Always uses FormData with clubIntroRequest + optional introPhotos
  - `updateClubInfo`: Always uses FormData with clubInfoRequest + optional mainPhoto + optional leaderUpdatePwRequest

## Development Guidelines

- **Always use gitflow strategies when working on certain functions**
- Follow TDD: Write tests first, then implementation
- Focus on data layer and API communication
- Use TypeScript types matching API schemas (e.g., `ClubSummaryResponse`)
- **API Integration**: All FormData requests must serialize JSON objects as Blob with `{ type: 'application/json' }`
- 이 페이지는 동아리 회장 (club leader) 동아리 연합회 (admin or union) 을 위한 서비스 입니다. 일반 사용자(동아리 회원)에 대한 내용은 들어가면 안됨.

## UI Component Guidelines

### Use shadcn/ui for All UI Components
- **MUST use shadcn/ui components** for all new UI elements. No custom components unless absolutely necessary.
- Import from `@/components/ui/` (e.g., `import { Button } from '@/components/ui/button'`)
- Reference: https://ui.shadcn.com/docs/components

### Available shadcn/ui Components (45 installed)
**Form & Input**: Input, Textarea, Select, Radio-Group, Checkbox, Toggle, Toggle-Group, Input-OTP, Input-Group, Combobox, Command, Field, Label, Calendar, Date-Picker

**Layout & Display**: Card, Table, Tabs, Carousel, Sidebar, Sheet, Dialog, Drawer, Popover, Hover-Card, Navigation-Menu, Breadcrumb, Pagination, Separator, Scroll-Area

**Feedback & Status**: Button, Badge, Alert, Alert-Dialog, Progress, Slider, Spinner, Sonner (notifications)

**Content**: Avatar, Accordion, Collapsible, Tooltip, Context-Menu, Dropdown-Menu, Button-Group, Resizable, Kbd, Typography

### Installation for New Components
If you need a component not yet installed, run:
```bash
npx shadcn@latest add [component-name] --yes
```

Common components to consider:
- **Data Table**: For large datasets with sorting/filtering
- **Date Picker**: For date/time inputs
- **Drawer**: For side panels/sidebars
- **Command**: For command palettes/search
- **Context Menu**: For right-click menus

### Styling
- Use Tailwind CSS classes alongside shadcn components
- Leverage Tailwind's utility classes for custom styling
- Never apply inline styles; use className
- Color palette follows shadcn's design system (primary, secondary, muted, destructive, etc.)
