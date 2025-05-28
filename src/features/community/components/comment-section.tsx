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
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")

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
                loadComments()
            }
        } catch (err) {
            console.error('Error creating comment:', err)
        }
    }

    const handleLikeComment = async (commentId: string) => {
        try {
            const response = await communityApi.toggleCommentReaction(postId, commentId, "like")
            
            if (response.success) {
                loadComments()
            }
        } catch (err) {
            console.error('Error liking comment:', err)
        }
    }

    const handleReply = (comment: IComment) => {
        setReplyingTo(comment.id)
        setReplyContent(`@${comment.author.name} `)
    }

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return

        try {
            const response = await communityApi.createComment(postId, {
                content: replyContent
            })
            
            if (response.success) {
                setReplyContent("")
                setReplyingTo(null)
                loadComments()
            }
        } catch (err) {
            console.error('Error creating reply:', err)
        }
    }

    const handleCancelReply = () => {
        setReplyingTo(null)
        setReplyContent("")
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
                                    className={`px-2 h-6 text-xs ${comment.userLiked ? 'text-red-500' : ''}`}
                                    onClick={() => handleLikeComment(comment.id)}
                                >
                                    <Heart className={`mr-1 w-3 h-3 ${comment.userLiked ? 'fill-current' : ''}`} />
                                    {comment.likes > 0 && comment.likes}
                                </Button>
                                {replyingTo !== comment.id && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="px-2 h-6 text-xs"
                                        onClick={() => handleReply(comment)}
                                    >
                                        Reply
                                    </Button>
                                )}
                            </div>
                            {replyingTo === comment.id && (
                                <div className="flex gap-2 mt-2 ml-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-1 gap-2">
                                        <Input
                                            placeholder={`Reply to ${comment.author.name}...`}
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="flex-1 h-8 text-xs"
                                            autoFocus
                                        />
                                        <Button 
                                            size="sm" 
                                            onClick={handleSubmitReply} 
                                            disabled={!replyContent.trim()}
                                            className="h-8 px-3 text-xs"
                                        >
                                            Reply
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleCancelReply}
                                            className="h-8 px-3 text-xs"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentSection