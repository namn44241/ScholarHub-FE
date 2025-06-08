"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteThread } from "../hooks/use-chatbot";
import type { IThread } from "../utils/types";

interface IThreadListProps {
  userId: string;
  threads: IThread[];
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onNewThread: () => void;
  isLoading: boolean;
}

export function ThreadList({
  userId,
  threads,
  activeThreadId,
  onSelectThread,
  isLoading,
}: IThreadListProps) {
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const { mutate: deleteThread } = useDeleteThread();

  const handleDeleteThread = (threadId: string) => {
    deleteThread({ thread_id: threadId, user_id: userId });
    setThreadToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-3 border rounded-lg">
              <Skeleton className="mb-2 w-full h-4" />
              <Skeleton className="mb-2 w-3/4 h-3" />
              <div className="flex justify-between">
                <Skeleton className="w-12 h-3" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="space-y-2">
          {threads.map((thread) => (
            <div
              key={thread.thread_id}
              className={`
                group relative rounded-lg p-3 cursor-pointer transition-colors border
                ${
                  activeThreadId === thread.thread_id
                    ? "bg-primary/10 border-primary/20"
                    : "hover:bg-muted border-transparent"
                }
              `}
              onClick={() => onSelectThread(thread.thread_id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="mb-1 font-medium text-sm truncate">
                    {thread.latest_question || "New Conversation"}
                  </p>
                  {thread.latest_answer && (
                    <p className="mb-2 text-muted-foreground text-xs line-clamp-2">
                      {thread.latest_answer.length > 60
                        ? thread.latest_answer.substring(0, 60) + "..."
                        : thread.latest_answer}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {thread.message_count} msg
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(thread.last_message), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <AlertDialog
                  open={threadToDelete === thread.thread_id}
                  onOpenChange={(open) => !open && setThreadToDelete(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 opacity-0 group-hover:opacity-100 w-6 h-6 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThreadToDelete(thread.thread_id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete conversation</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this conversation and all
                        its messages. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteThread(thread.thread_id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
