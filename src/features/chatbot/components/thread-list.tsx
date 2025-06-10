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
    return <ThreadListSkeleton />;
  }

  if (threads.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 h-full">
        <div className="text-center">
          <MessageSquare className="mx-auto mb-2 size-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No conversations yet</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Start a new conversation to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3">
        {threads.map((thread) => (
          <div
            key={thread.thread_id}
            className={`
              group relative rounded-lg p-3 cursor-pointer transition-all duration-200
              border border-transparent hover:border-border
              ${
                activeThreadId === thread.thread_id
                  ? "bg-primary/10 border-primary/20 shadow-sm"
                  : "hover:bg-muted/50"
              }
            `}
            onClick={() => onSelectThread(thread.thread_id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1 min-w-0">
                {/* Thread Title */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                    {thread.latest_question || "New Conversation"}
                  </h3>

                  {/* Delete Button */}
                  <AlertDialog
                    open={threadToDelete === thread.thread_id}
                    onOpenChange={(open) => !open && setThreadToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 hover:bg-destructive/10 opacity-0 group-hover:opacity-100 w-6 h-6 hover:text-destructive transition-opacity duration-200"
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

                {/* Latest Answer Preview */}
                {thread.latest_answer && (
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                    {thread.latest_answer.length > 80
                      ? thread.latest_answer.substring(0, 80) + "..."
                      : thread.latest_answer}
                  </p>
                )}

                {/* Thread Metadata */}
                <div className="flex justify-between items-center pt-1">
                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 h-auto font-normal text-xs"
                  >
                    {thread.message_count}{" "}
                    {thread.message_count === 1 ? "message" : "messages"}
                  </Badge>

                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(thread.last_message), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

const ThreadListSkeleton = () => {
  return (
    <div className="p-3">
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="p-3 border rounded-lg">
            <Skeleton className="mb-2 w-full h-4" />
            <Skeleton className="mb-2 w-3/4 h-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="w-12 h-3" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
