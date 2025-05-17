import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/scholarship-search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-screen flex flex-col container-wrapper py-6">
    <div className='container overflow-x-clip'>
      a
    </div>
  </div>
}
