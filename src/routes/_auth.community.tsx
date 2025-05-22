 import { Community } from '@/features/community'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/community')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-screen flex flex-col container-wrapper py-6">
    <div className='container'>
    <Community />
    </div>
  </div>
}
