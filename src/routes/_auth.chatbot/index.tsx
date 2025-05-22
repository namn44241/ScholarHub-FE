import { useAuth } from "@/contexts/auth-context"
import { Chatbot } from "@/features/chatbot"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/chatbot/")({
  component: ChatbotPage,
})

function ChatbotPage() {
  const { user} = useAuth()
  const userId = user?.id || ""

  return (
    <div className="h-[calc(100vh-64px)]">
      <Chatbot userId={userId} />
    </div>
  )
}
