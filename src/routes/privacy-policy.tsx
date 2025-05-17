import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-screen flex flex-col container-wrapper py-6">
    <div className='container'>
      Hello "/privacy-policy"!
    </div>
  </div>
}
