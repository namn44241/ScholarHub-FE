import { useAuth } from "@/contexts/auth-context"
import { Chatbot } from "@/features/chatbot"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/chatbot/$threadId")({
  component: ChatbotThreadPage,
})

function ChatbotThreadPage() {
  const { threadId } = Route.useParams()
  const { user } = useAuth()
  const userId = user?.id || ""
  
  return (
    <div className="h-[calc(100vh-64px)]">
      <Chatbot userId={userId} initialThreadId={threadId} />
    </div>
  )
}
