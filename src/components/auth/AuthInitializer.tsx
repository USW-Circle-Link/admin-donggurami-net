import { useAuthInitialization } from '@features/auth'

/**
 * Component that initializes authentication on app startup.
 *
 * This component should be placed inside the Router context,
 * typically as a direct child of BrowserRouter.
 *
 * It runs the authentication initialization logic to validate
 * stored tokens and redirect if necessary.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInitialization()
  return <>{children}</>
}
