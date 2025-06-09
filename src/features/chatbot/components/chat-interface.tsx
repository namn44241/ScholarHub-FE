import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useGetPersonal } from "@/features/user_profile"
import { ArrowUp, Loader2, Square, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useGetChat, usePostChat } from "../hooks/use-chatbot"
import { ChatMessage } from "./chat-messages"

interface IChatInterfaceProps {
  userId: string
  threadId?: string
  onNewThread: () => void
  hasThreads: boolean
}

export function ChatInterface({ userId, threadId, onNewThread, hasThreads }: IChatInterfaceProps) {
  const { data: personalData } = useGetPersonal() 
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: messages, isLoading: isLoadingChat } = useGetChat({
    user_id: userId,
    thread_id: threadId || "",
  })

  const { mutateAsync: postChat } = usePostChat()

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!message.trim() || !threadId || !userId || isSubmitting) return

    setIsSubmitting(true)

    try {
      await postChat({
        user_id: userId,
        thread_id: threadId,
        question: message.trim(),
      })

      setMessage("")

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.style.height = "auto"
        }
      }, 100)
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    e.target.style.height = "auto"
    const newHeight = Math.min(e.target.scrollHeight, 200)
    e.target.style.height = `${newHeight}px`
  }

  if (!threadId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-1 justify-center items-center p-8">
          <div className="max-w-md text-center">
            <div className="bg-primary/10 mx-auto mb-6 p-6 rounded-full w-fit">
              <Sparkles className="size-12 text-primary" />
            </div>

            <h2 className="mb-3 font-semibold text-2xl">
              {hasThreads ? "Select a conversation" : `Welcome, ${personalData?.last_name || "Scholar"}!`}
            </h2>

            <p className="mb-6 text-muted-foreground leading-relaxed">
              {hasThreads
                ? "Choose an existing conversation from the sidebar or start a new one."
                : "Get scholarship information and application guidance with ScholarHub's AI assistant."}
            </p>

            <Button onClick={onNewThread} size="lg" className="gap-2">
              <Sparkles className="size-4" />
              Start new conversation
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const sortedMessages = messages
    ? [...messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : []

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {isLoadingChat ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <Loader2 className="mb-2 w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Loading messages...</p>
              </div>
            </div>
          ) : !sortedMessages?.length ? (
            <div className="flex justify-center items-center p-8 h-full">
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 p-6 rounded-full w-fit">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 font-medium text-lg">How can I help you today?</h3>
                <p className="max-w-md text-muted-foreground text-sm">
                  Ask me about scholarships, application processes, or any academic guidance you need.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-6 mx-auto max-w-4xl">
                {sortedMessages.map((msg, index) => (
                  <ChatMessage key={`${threadId}-${index}`} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about scholarships, applications, or academic guidance..."
              className={cn(
                "w-full resize-none rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                "min-h-[52px] max-h-[200px]",
              )}
              disabled={isSubmitting}
              rows={1}
            />

            <div className="right-2 bottom-2 absolute">
              {isSubmitting ? (
                <Button type="button" size="icon" variant="ghost" className="w-8 h-8">
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button type="submit" size="icon" className="w-8 h-8" disabled={!message.trim()}>
                  <ArrowUp className="size-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2 text-muted-foreground text-xs text-center">
            Press Enter to send • Shift + Enter for new line
          </div>
        </form>
      </div>
    </div>
  )
}
