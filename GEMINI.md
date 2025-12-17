# GEMINI.md

## Project Overview

**Project Name:** `admin-donggurami-net`

This project is an administrative dashboard for `donggurami.net`. It is a Single Page Application (SPA) built using modern web technologies.

**Current Session Focus:** UI Development (React 19, Tailwind CSS).

## Tech Stack

*   **Core:** React 19, TypeScript, Vite 7
*   **State Management:** Zustand (Global store), TanStack Query (Server state/caching)
*   **Routing:** React Router 7
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios (with interceptors for auth)
*   **Validation:** Zod (Schema validation), React Hook Form
*   **Testing:** Vitest, React Testing Library, MSW (Mock Service Worker)

## Architecture

The codebase follows a feature-based architecture, organizing code by domain rather than technical layer.

### Directory Structure

*   `src/features/`: Contains domain-specific logic and UI. Each feature (e.g., `auth`) is self-contained with its own:
    *   `api/`: API calls and service definitions.
    *   `domain/`: Entities, schemas (Zod), and types.
    *   `hooks/`: Custom React hooks.
    *   `store/`: Local or global state stores (Zustand).
    *   `ui/` (implied): Feature-specific React components.
*   `src/shared/`: Reusable utilities, UI components, and generic types used across multiple features.
*   `src/test/`: Global test setup, mocks (MSW handlers), and test utilities.

### Path Aliases

The project uses the following TypeScript/Vite path aliases for cleaner imports:

*   `@` -> `./src`
*   `@features` -> `./src/features`
*   `@shared` -> `./src/shared`
*   `@test` -> `./src/test`

## Building and Running

### scripts

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    npm run build
    ```
    *Compiles TypeScript and bundles with Vite.*
*   **Linting:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **UI Focus:** The primary goal is implementing user interfaces using **React 19** and **Tailwind CSS**.
*   **Authentication:**
    *   Access tokens are stored in memory/localStorage.
    *   Refresh tokens are expected to be in `httpOnly` cookies.
*   **Validation:**
    *   Use **Zod** for schema validation (forms, API responses).
    *   Phone numbers should be in `010XXXXXXXX` format (no hyphens).
*   **Strict Typing:** Maintain high TypeScript coverage. Use specific types rather than `any`.
