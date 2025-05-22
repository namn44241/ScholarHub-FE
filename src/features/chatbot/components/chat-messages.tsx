import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { BotIcon, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { IMessage } from "../utils/types";

const chatBubbleVariants = cva("relative p-3 rounded-lg text-sm break-words", {
  variants: {
    isUser: {
      true: "bg-primary text-primary-foreground",
      false: "bg-muted text-foreground",
    },
    animation: {
      none: "",
      scale: "duration-300 animate-in fade-in-0 zoom-in-75",
    },
  },
  compoundVariants: [
    {
      isUser: true,
      animation: "scale",
      class: "origin-bottom-right",
    },
    {
      isUser: false,
      animation: "scale",
      class: "origin-bottom-left",
    },
  ],
});

type Animation = VariantProps<typeof chatBubbleVariants>["animation"];

interface IChatMessageProps {
  message: IMessage;
  animation?: Animation;
}

export function ChatMessage({
  message,
  animation = "scale",
}: IChatMessageProps) {
  const hasQuestion = Boolean(message.question);
  const hasAnswer = Boolean(message.answer);

  if (hasQuestion && hasAnswer) {
    return (
      <div className="space-y-6">
        {/* User Message */}
        <div className="flex justify-end gap-4">
          <div className="flex flex-col items-end">
            <div
              className={cn(
                chatBubbleVariants({ isUser: true, animation }),
                "max-w-[85%] md:max-w-[75%]"
              )}
            >
              <ReactMarkdown>{message.question}</ReactMarkdown>
            </div>
            <div className="mt-1 text-muted-foreground text-xs">
              {format(new Date(message.created_at), "MMM d, yyyy • h:mm a")}
            </div>
          </div>
          <Avatar>
            <AvatarImage />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Bot Message */}
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage />
            <AvatarFallback className="bg-primary/30">
              <BotIcon className="size-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div
              className={cn(
                chatBubbleVariants({ isUser: false, animation }),
                "max-w-[85%] md:max-w-[75%]"
              )}
            >
              <ReactMarkdown>{message.answer}</ReactMarkdown>
            </div>
            <div className="mt-1 text-muted-foreground text-xs">
              {format(new Date(message.created_at), "MMM d, yyyy • h:mm a")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasQuestion) {
    return (
      <div className="flex justify-end gap-4 mb-6">
        <div className="flex flex-col items-end">
          <div
            className={cn(
              chatBubbleVariants({ isUser: true, animation }),
              "max-w-[85%] md:max-w-[75%]"
            )}
          >
            <ReactMarkdown>{message.question}</ReactMarkdown>
          </div>
          <div className="mt-1 text-muted-foreground text-xs">
            {format(new Date(message.created_at), "MMM d, yyyy • h:mm a")}
          </div>
        </div>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (hasAnswer) {
    return (
      <div className="flex gap-4 mb-6">
        <Avatar>
          <AvatarImage />
          <AvatarFallback className="bg-primary/30">
            <BotIcon className="size-4 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div
            className={cn(
              chatBubbleVariants({ isUser: false, animation }),
              "max-w-[85%] md:max-w-[75%]"
            )}
          >
            <ReactMarkdown>{message.answer}</ReactMarkdown>
          </div>
          <div className="mt-1 text-muted-foreground text-xs">
            {format(new Date(message.created_at), "MMM d, yyyy • h:mm a")}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
