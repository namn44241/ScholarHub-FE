import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { communityApi } from "../services/community-api"
import type { IComment } from "../utils/types"

interface ICommentSectionProps {
    postId: string
}

const CommentSection = ({ postId }: ICommentSectionProps) => {
    const [comments, setComments] = useState<IComment[]>([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(true)

    const currentUser = {
        name: "John Doe",
        role: "Frontend Developer",
        avatar: "/placeholder.svg?height=32&width=32",
    }

    // Load comments từ API
    useEffect(() => {
        loadComments()
    }, [postId])

    const loadComments = async () => {
        try {
            setLoading(true)
            const response = await communityApi.getComments(postId)
            if (response.success) {
                setComments(response.payload.comments)
            }
        } catch (err) {
            console.error('Error loading comments:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return

        try {
            const response = await communityApi.createComment(postId, {
                content: newComment
            })
            
            if (response.success) {
                setNewComment("")
                // Reload comments để có comment mới
                loadComments()
            }
        } catch (err) {
            console.error('Error creating comment:', err)
        }
    }

    const handleLikeComment = (commentId: string) => {
        // TODO: Implement comment like API
        setComments(
            comments.map((comment) => 
                comment.id === commentId 
                    ? { ...comment, likes: comment.likes + 1 } 
                    : comment
            )
        )
    }

    if (loading) {
        return (
            <div className="space-y-4 mt-2 pt-3 border-muted-foreground/10 border-t">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 mt-2 pt-3 border-muted-foreground/10 border-t">
            <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 gap-2">
                    <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 h-9"
                    />
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        Post
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="bg-muted/50 p-2 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-xs">{comment.author.name}</p>
                                        <p className="text-muted-foreground text-xs">{comment.author.role}</p>
                                    </div>
                                    <p className="text-muted-foreground text-xs">{comment.timestamp}</p>
                                </div>
                                <p className="mt-1 text-sm">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 h-6 text-xs"
                                    onClick={() => handleLikeComment(comment.id)}
                                >
                                    <Heart className="mr-1 w-3 h-3" />
                                    {comment.likes > 0 && comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="px-2 h-6 text-xs">
                                    Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentSection