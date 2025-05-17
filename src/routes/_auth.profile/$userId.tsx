
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/profile/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  return <div className='min-h-screen container-wrapper py-6'>
    <div className='container'>
      b
    </div>
  </div>

}
