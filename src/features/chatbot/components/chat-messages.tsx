import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { IMessage } from "../utils/types"

interface IChatMessageProps {
  message: IMessage
}

export function ChatMessage({ message }: IChatMessageProps) {
  const hasQuestion = Boolean(message.question)
  const hasAnswer = Boolean(message.answer)
  const timestamp = format(new Date(message.created_at), "HH:mm")

  if (!hasQuestion && !hasAnswer) return null

  return (
    <div className="space-y-4">
      {hasQuestion && (
        <div className="flex justify-end items-start gap-3">
          <div className="flex flex-col items-end gap-2">
            <div className="bg-primary px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] text-primary-foreground">
              <ReactMarkdown>{message.question}</ReactMarkdown>
            </div>
            <span className="text-muted-foreground text-xs">{timestamp}</span>
          </div>
          <Avatar className="bg-primary/10 w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {hasAnswer && (
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10">
              <Bot className="size-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%]">
              <ReactMarkdown>{message.answer}</ReactMarkdown>
            </div>
            <span className="text-muted-foreground text-xs">{timestamp}</span>
          </div>
        </div>
      )}
    </div>
  )
}
