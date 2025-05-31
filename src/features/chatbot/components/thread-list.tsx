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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { PlusIcon, Trash2 } from 'lucide-react'
import { useState } from "react"
import { useDeleteThread } from "../hooks/use-chatbot"
import type { IThread } from "../utils/types"

interface IThreadListProps {
    userId: string
    threads: IThread[]
    activeThreadId?: string
    onSelectThread: (threadId: string) => void
    onNewThread: () => void
    isLoading: boolean
}

export function ThreadList({
    userId,
    threads,
    activeThreadId,
    onSelectThread,
    onNewThread,
    isLoading,
}: IThreadListProps) {
    const [threadToDelete, setThreadToDelete] = useState<string | null>(null)
    const { mutate: deleteThread } = useDeleteThread()

    const handleDeleteThread = (threadId: string) => {
        deleteThread({ thread_id: threadId, user_id: userId })
        setThreadToDelete(null)
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-4 border-b border-border">
                <Button onClick={onNewThread} className="w-full" variant="default">
                    <PlusIcon className="mr-2 w-4 h-4" />
                    New Chat
                </Button>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
                {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="mb-2 p-2">
                            <Skeleton className="mb-1 w-3/4 h-5" />
                            <Skeleton className="w-1/2 h-4" />
                        </div>
                    ))
                ) : threads.length > 0 && (
                    // Thread list
                    threads.map((thread) => (
                        <div
                            key={thread.thread_id}
                            className={`
                relative group rounded-md p-3 mb-1 cursor-pointer transition-colors
                ${activeThreadId === thread.thread_id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
              `}
                            onClick={() => onSelectThread(thread.thread_id)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-medium text-sm truncate">
                                        {thread.latest_question || "New Conversation"}
                                    </h3>
                                    <p className="mt-2 text-muted-foreground text-xs truncate">
                                        {thread.latest_answer
                                            ? thread.latest_answer.substring(0, 60) + (thread.latest_answer.length > 60 ? "..." : "")
                                            : "No messages yet"}
                                    </p>
                                </div>

                                <AlertDialog
                                    open={threadToDelete === thread.thread_id}
                                    onOpenChange={(open) => !open && setThreadToDelete(null)}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="top-2 right-2 absolute opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setThreadToDelete(thread.thread_id)
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete conversation</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete this conversation and all its messages. This action cannot be
                                                undone.
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

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-muted-foreground text-xs">
                                    {thread.message_count} {thread.message_count === 1 ? "message" : "messages"}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(thread.last_message), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
