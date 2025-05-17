import SiteFooter from '@/components/layout/site-footer'
import SiteHeader from '@/components/layout/site-header'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


export const Route = createRootRoute({
  component: () => (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <TanStackRouterDevtools />
    </>
  ),
})
