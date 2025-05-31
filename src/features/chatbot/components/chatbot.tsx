import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "@tanstack/react-router"
import { Menu } from 'lucide-react'
import { useEffect, useState } from "react"
import { useNewThread, useThreadsList } from "../hooks/use-chatbot"
import { ChatInterface } from "./chat-interface"
import { ThreadList } from "./thread-list"

interface IChatbotProps {
    userId: string
    initialThreadId?: string
}

export function Chatbot({ userId, initialThreadId }: IChatbotProps) {
    const [activeThreadId, setActiveThreadId] = useState<string | undefined>(initialThreadId)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const { mutateAsync: createNewThread } = useNewThread()
    const { data: threads, isLoading: isLoadingThreads } = useThreadsList({ user_id: userId })

    const handleNewThread = async () => {
        if (!userId) return
        try {
            const newThreadId = await createNewThread({ user_id: userId })
            if (newThreadId) {
                setActiveThreadId(newThreadId)
                navigate({ to: "/chatbot/$threadId", params: { threadId: newThreadId } })
                setIsMobileMenuOpen(false)
            }
        } catch (error) {
            console.error("Failed to create new thread:", error)
        }
    }

    // reset activeThreadId if current thread was deleted
    useEffect(() => {
        if (activeThreadId && threads) {
            const currentThreadExists = threads.some(thread => 
                thread.thread_id === activeThreadId || thread.thread_id === activeThreadId
            )
            
            if (!currentThreadExists) {
                if (threads.length > 0) {
                    const firstThreadId = threads[0].thread_id || threads[0].thread_id
                    setActiveThreadId(firstThreadId)
                    navigate({ to: "/chatbot/$threadId", params: { threadId: firstThreadId } })
                } else {
                    setActiveThreadId(undefined)
                    navigate({ to: "/chatbot" })
                }
            }
        }
    }, [threads, activeThreadId, navigate])

    useEffect(() => {
        if (initialThreadId) {
            setActiveThreadId(initialThreadId)
        }
    }, [initialThreadId])

    useEffect(() => {
        if (!activeThreadId && threads && threads?.length > 0) {
            const firstThreadId = threads[0].thread_id || threads[0].thread_id
            setActiveThreadId(firstThreadId)
            navigate({ to: "/chatbot/$threadId", params: { threadId: firstThreadId } })
        }
    }, [activeThreadId, threads, navigate])

    return (
        <div className="flex bg-background h-full">
            {/** Desktop Sidebar **/}
            <div className="hidden md:flex flex-shrink-0 border-r border-border md:w-80 lg:w-96 h-full">
                <ThreadList
                    userId={userId}
                    threads={threads || []}
                    activeThreadId={activeThreadId}
                    onSelectThread={(threadId) => {
                        setActiveThreadId(threadId)
                        navigate({ to: "/chatbot/$threadId", params: { threadId } })
                    }}
                    onNewThread={handleNewThread}
                    isLoading={isLoadingThreads}
                />
            </div>

            {/** Mobile Sidebar **/}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden top-4 left-4 z-10 absolute">
                    <Button variant="outline" size="icon">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                    <ThreadList
                        userId={userId}
                        threads={threads || []}
                        activeThreadId={activeThreadId}
                        onSelectThread={(threadId) => {
                            setActiveThreadId(threadId)
                            navigate({ to: "/chatbot/$threadId", params: { threadId } })
                            setIsMobileMenuOpen(false)
                        }}
                        onNewThread={handleNewThread}
                        isLoading={isLoadingThreads}
                    />
                </SheetContent>
            </Sheet>

            {/** Chat Interface **/}
            <div className="relative flex flex flex-1 h-full col">
                <ChatInterface
                    userId={userId}
                    threadId={activeThreadId}
                    onNewThread={handleNewThread}
                    hasThreads={Boolean(threads?.length)}
                />
            </div>
        </div>
    )
}