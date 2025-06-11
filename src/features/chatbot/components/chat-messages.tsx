import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { IMessage } from "../utils/types";

interface IChatMessageProps {
  message: IMessage;
  isOptimistic?: boolean;
}

export function ChatMessage({
  message,
  isOptimistic = false,
}: IChatMessageProps) {
  const hasQuestion = Boolean(message.question);
  const hasAnswer = Boolean(message.answer);
  const timestamp = format(new Date(message.created_at), "HH:mm");

  if (!hasQuestion && !hasAnswer) return null;

  return (
    <div className="space-y-6">
      {hasQuestion && (
        <div className="group flex justify-end items-start gap-3">
          <div className="flex flex-col items-end gap-1 max-w-[80%] sm:max-w-[70%]">
            <div
              className={`
                bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-md 
                shadow-sm transition-all duration-200 
                ${isOptimistic ? "opacity-70" : "opacity-100"}
              `}
            >
              <ReactMarkdown>
                {message.question}
              </ReactMarkdown>
            </div>
            <span className="opacity-0 group-hover:opacity-100 px-1 text-muted-foreground text-xs transition-opacity">
              {timestamp}
            </span>
          </div>
          <Avatar className="border-2 border-primary/20 w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {hasAnswer && (
        <div className="group flex items-start gap-3">
          <Avatar className="border-2 border-primary/20 w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 max-w-[80%] sm:max-w-[70%]">
            <div className="bg-muted/50 shadow-sm px-4 py-3 border rounded-2xl rounded-tl-md">
              <ReactMarkdown>
                {message.answer}
              </ReactMarkdown>
            </div>
            <span className="opacity-0 group-hover:opacity-100 px-1 text-muted-foreground text-xs transition-opacity">
              {timestamp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
