
import SiteFooter from '@/components/layout/site-footer'
import SiteHeader from '@/components/layout/site-header'
import type { IAuthContextType } from '@/types/auth-context'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface MyRouterContext {
  auth: IAuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})
