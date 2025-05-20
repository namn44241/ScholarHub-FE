import {
  Outlet,
  createFileRoute,
  redirect
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  
  beforeLoad: ({ context, location }) => {
     if (context.auth.isLoading) {
      return;
    }

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <Outlet />
  )
}