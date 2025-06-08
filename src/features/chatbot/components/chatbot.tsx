import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PlusIcon,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNewThread, useThreadsList } from "../hooks/use-chatbot";
import { ChatInterface } from "./chat-interface";
import { ThreadList } from "./thread-list";

interface IChatbotProps {
  userId: string;
  initialThreadId?: string;
}

export function Chatbot({ userId, initialThreadId }: IChatbotProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(
    initialThreadId
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { mutateAsync: createNewThread } = useNewThread();
  const { data: threads, isLoading: isLoadingThreads } = useThreadsList({
    user_id: userId,
  });

  const handleNewThread = async () => {
    if (!userId) return;
    try {
      const newThreadId = await createNewThread({ user_id: userId });
      if (newThreadId) {
        setActiveThreadId(newThreadId);
        navigate({
          to: "/chatbot/$threadId",
          params: { threadId: newThreadId },
        });
      }
    } catch (error) {
      console.error("Failed to create new thread:", error);
    }
  };

  // Reset activeThreadId if current thread was deleted
  useEffect(() => {
    if (activeThreadId && threads) {
      const currentThreadExists = threads.some(
        (thread) => thread.thread_id === activeThreadId
      );

      if (!currentThreadExists) {
        if (threads.length > 0) {
          const firstThreadId = threads[0].thread_id;
          setActiveThreadId(firstThreadId);
          navigate({
            to: "/chatbot/$threadId",
            params: { threadId: firstThreadId },
          });
        } else {
          setActiveThreadId(undefined);
          navigate({ to: "/chatbot" });
        }
      }
    }
  }, [threads, activeThreadId, navigate]);

  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId]);

  useEffect(() => {
    if (!activeThreadId && threads && threads?.length > 0) {
      const firstThreadId = threads[0].thread_id;
      setActiveThreadId(firstThreadId);
      navigate({
        to: "/chatbot/$threadId",
        params: { threadId: firstThreadId },
      });
    }
  }, [activeThreadId, threads, navigate]);

  return (
    <div className="mx-auto px-4 py-6 container">
      <div className="bg-background border rounded-lg h-[calc(100vh-12rem)] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300  ${
              isSidebarOpen ? "w-80 border-r" : "w-0"
            } overflow-hidden`}
          >
            <Card className="border-0 rounded-none h-full">
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold">ScholarHub AI</h2>
                      <p className="text-muted-foreground text-sm">
                        Scholarship Assistant
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleNewThread} className="gap-2 w-full">
                    <PlusIcon className="size-4" />
                    New Conversation
                  </Button>
                </div>

                {/* Thread List */}
                <div className="flex-1 overflow-hidden">
                  <ThreadList
                    userId={userId}
                    threads={threads || []}
                    activeThreadId={activeThreadId}
                    onSelectThread={(threadId) => {
                      setActiveThreadId(threadId);
                      navigate({
                        to: "/chatbot/$threadId",
                        params: { threadId },
                      });
                    }}
                    onNewThread={handleNewThread}
                    isLoading={isLoadingThreads}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="size-4" />
                  ) : (
                    <PanelLeftOpen className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                userId={userId}
                threadId={activeThreadId}
                onNewThread={handleNewThread}
                hasThreads={Boolean(threads?.length)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
