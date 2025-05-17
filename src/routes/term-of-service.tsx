import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/term-of-service')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-screen flex flex-col container">
    <div className='container'>
      Hello "/term-of-service"!
    </div>
  </div>
}
