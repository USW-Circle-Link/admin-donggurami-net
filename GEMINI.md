# GEMINI.md

This file provides context and guidance for the Gemini CLI agent when working on the **admin-donggurami-net** project.

## Project Overview

This project is an **Admin Dashboard Application** for `donggurami.net`, built to manage club activities. It is a modern **React 19** Single Page Application (SPA) powered by **Vite 7** and configured as a Progressive Web App (PWA).

The development philosophy emphasizes **Test-Driven Development (TDD)**, prioritizing robust data layers and API integrations before UI implementation.

## Tech Stack

*   **Core:** React 19, TypeScript, Vite 7
*   **State Management:** Zustand, TanStack Query (React Query)
*   **Routing:** React Router 7
*   **Styling:** Tailwind CSS 4, Class Variance Authority (CVA), clsx, tailwind-merge
*   **Forms & Validation:** React Hook Form, Zod
*   **HTTP Client:** Axios
*   **Testing:** Vitest, React Testing Library, MSW (Mock Service Worker), JSDOM
*   **Icons:** Lucide React, Hugeicons
*   **PWA:** vite-plugin-pwa

## Architecture

The project follows a **Feature-Based Architecture** (inspired by Feature-Sliced Design), organized within `src/`:

### Directory Structure

*   `src/features/`: Contains business logic grouped by domain (e.g., `admin`, `auth`, `club`, `user`).
    *   Each feature typically contains:
        *   `api/`: API request functions (using Axios).
        *   `domain/`: Zod schemas and TypeScript interfaces.
        *   `hooks/`: Custom React hooks (often wrapping React Query).
        *   `ui/`: Feature-specific components (optional/if needed).
        *   `index.ts`: Public API for the feature (exports domain, api, hooks).
        *   `__tests__/`: Feature-specific tests.
*   `src/shared/`: Reusable code across features.
    *   `api/`: Core API client setup (`apiClient.ts`) and types.
    *   `lib/`: Shared utilities (e.g., `queryClient.ts`).
    *   `ui/`: Generic UI components (likely shadcn/ui inspired).
*   `src/pages/`: Page components that compose features and shared UI.
*   `src/test/`: Global test setup (`setup.ts`), mocks (`handlers.ts`, `server.ts`), and utilities.

### Path Aliases

Defined in `vite.config.ts`:
*   `@`: `src/`
*   `@features`: `src/features/`
*   `@shared`: `src/shared/`
*   `@test`: `src/test/`

## Development Workflow

### Key Commands

*   `npm run dev`: Start the development server.
*   `npm run build`: Type-check and build for production.
*   `npm run test`: Run tests using Vitest (watch mode).
*   `npm run test:run`: Run tests once.
*   `npm run test:coverage`: Run tests with coverage reporting.
*   `npm run lint`: Lint the codebase.

### Conventions

1.  **TDD First:** Write tests before implementing logic.
    *   Use **MSW** to mock API responses.
    *   Test hooks and API functions in isolation where possible.
    *   Use `src/test/mocks/handlers.ts` to define global request handlers.
2.  **API & Data Layer:**
    *   Define Zod schemas in `domain/` to validate API responses.
    *   Use React Query for data fetching and caching.
    *   Centralize API calls in `api/` modules.
3.  **Styling:**
    *   Use Tailwind CSS for styling.
    *   Use `cn` (clsx + tailwind-merge) utility for conditional classes.
4.  **Strict Typing:**
    *   Avoid `any`. Use generic types for API responses (e.g., `ApiResponse<T>`).
    *   Ensure Zod schemas match backend expectations.

## Configuration Highlights

*   **Vite:** Configured with `vite-plugin-pwa` for offline capabilities and asset caching.
*   **Vitest:** Uses `jsdom` environment. Setup file at `src/test/setup.ts` ensures MSW server lifecycle is managed (listen/reset/close).
*   **ESLint:** Configured in `eslint.config.js` with React and TypeScript rules.
