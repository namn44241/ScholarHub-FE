import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useGetPersonal } from "@/features/user_profile";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2, PlusIcon, Square } from "lucide-react";
import { useGetChat, usePostChat } from "../hooks/use-chatbot";
import { ChatMessage } from "./chat-messages";
import { EmptyState } from "./empty-state";

interface IChatInterfaceProps {
  userId: string;
  threadId?: string;
  onNewThread: () => void;
  hasThreads: boolean;
}

export function ChatInterface({
  userId,
  threadId,
  onNewThread,
  hasThreads,
}: IChatInterfaceProps) {
  const { data: personalData } = useGetPersonal();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: isLoadingChat } = useGetChat({
    user_id: userId,
    thread_id: threadId || "",
  });

  const { mutateAsync: postChat } = usePostChat();

  // auto-scroll messsages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!message.trim() || !threadId || !userId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await postChat({
        user_id: userId,
        thread_id: threadId,
        question: message.trim(),
      });

      setMessage("");

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.style.height = "auto";
        }
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    e.target.style.height = "auto";

    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
  };

  if (!threadId) {
    return (
      <EmptyState
        title={
          hasThreads
            ? "Select a conversation"
            : `Hello ${personalData?.last_name}`
        }
        description={
          hasThreads
            ? "Choose an existing conversation from the sidebar or start a new one."
            : "Start your first conversation with ScholarHub's AI assistant."
        }
        action={
          <Button onClick={onNewThread}>
            <PlusIcon className="mr-2 w-4 h-4" />
            New Conversation
          </Button>
        }
      />
    );
  }

  const sortedMessages = messages
    ? [...messages].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto"
      >
        {isLoadingChat ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        ) : !sortedMessages?.length ? (
          <div className="flex flex-col justify-center items-center p-4 h-full text-center">
            <h3 className="font-medium text-lg">New Conversation</h3>
            <p className="mt-2 text-muted-foreground">
              Send a message to start chatting with ScholarHub's AI assistant.
            </p>
          </div>
        ) : (
          <>
            {sortedMessages.map((msg, index) => (
              <ChatMessage key={`${threadId}-${index}`} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="relative flex w-full">
          <div className="relative flex items-center space-x-2 w-full">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI..."
                className={cn(
                  "z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={isSubmitting}
                aria-label="Write your message here"
              />
            </div>
          </div>

          <div className="top-4 right-3 z-20 absolute flex gap-2">
            {isSubmitting ? (
              <Button
                type="button"
                size="icon"
                className="size-8"
                aria-label="Stop generating"
                onClick={() => {
                  // stop
                }}
              >
                <Square className="w-3 h-3 animate-pulse" fill="currentColor" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="size-8 transition-opacity"
                aria-label="Send message"
                disabled={!message.trim()}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
