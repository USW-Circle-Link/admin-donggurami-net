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

- **Access Token**: Stored in memory or localStorage
- **Refresh Token**: Stored in httpOnly cookies
- Token refresh handled via Axios interceptors using `/integration/refresh-token` endpoint
- Role-based access control (USER, LEADER, etc.) implemented at router level with wrapper components

## Validation Standards

- Phone numbers: `010XXXXXXXX` format (no hyphens), validated client-side with regex
- UUID and other fields validated using Zod schemas with React Hook Form

## Development Guidelines

- Follow TDD: Write tests first, then implementation
- Focus on data layer and API communication, not UI
- Use TypeScript types matching API schemas (e.g., `ClubSummaryResponse`)
