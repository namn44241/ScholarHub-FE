import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, MoreHorizontal, Repeat, Send, FileText } from "lucide-react"
import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import CommentSection from "./comment-section"
import type { IPost } from "../utils/types"
import { communityApi } from "../services/community-api"

interface IPostProps {
    post: IPost
    onReaction: (postId: string) => void
}

const Post = ({ post, onReaction }: IPostProps) => {
    const [showComments, setShowComments] = useState(false)
    const [isReposting, setIsReposting] = useState(false)

    const handleRepost = async () => {
        try {
            setIsReposting(true)
            await communityApi.createRepost(post.id)
            // Reload posts để thấy repost mới
            window.location.reload()
        } catch (error) {
            console.error('Repost error:', error)
        } finally {
            setIsReposting(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-start space-y-0 pb-3">
                <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage 
                            src={post.author.avatar || undefined} 
                            alt={post.author.name} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {post.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-medium text-sm">{post.author.name}</p>
                        <p className="text-muted-foreground text-xs">{post.author.role}</p>
                        <p className="text-muted-foreground text-xs">{post.timestamp}</p>
                    </div>
                </div>
                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save post</DropdownMenuItem>
                            <DropdownMenuItem>Hide post</DropdownMenuItem>
                            <DropdownMenuItem>Report post</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="mb-4 text-sm">{post.content}</p>
                
                {/* Render Image */}
                {post.image && (
                    <div className="relative rounded-md w-full aspect-video overflow-hidden mb-3">
                        <LazyLoadImage 
                            src={post.image || "/placeholder.svg"} 
                            alt="Post image" 
                            className="object-cover w-full h-full" 
                        />
                    </div>
                )}

                {/* Render Video */}
                {post.video && (
                    <div className="relative rounded-md w-full aspect-video overflow-hidden mb-3">
                        <video 
                            src={post.video} 
                            controls 
                            className="w-full h-full object-cover"
                            preload="metadata"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* Render Files */}
                {post.files && post.files.length > 0 && (
                    <div className="space-y-2 mb-3">
                        {post.files.map((fileUrl, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                <FileText className="w-4 h-4" />
                                <a 
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="text-sm flex-1 text-blue-600 hover:underline"
                                >
                                    {fileUrl.split('/').pop()}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col pt-0">
                <div className="flex justify-between items-center pb-2 w-full text-muted-foreground text-xs">
                    <p>{post.reactions.likes} reactions</p>
                    <div className="flex gap-2">
                        <p>{post.reactions.comments} comments</p>
                        <p>{post.reactions.reposts} reposts</p>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between pt-1 w-full">
                    <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => onReaction(post.id)}>
                        <Heart className={`h-4 w-4 ${post.userReacted ? "fill-primary text-primary" : ""}`} />
                        <span className="text-xs">Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => setShowComments(!showComments)}>
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">Comment</span>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={handleRepost}
                        disabled={isReposting}
                    >
                        <Repeat className={`w-4 h-4 ${post.userReposted ? "text-green-600" : ""}`} />
                        <span className="text-xs">Repost</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-2">
                        <Send className="w-4 h-4" />
                        <span className="text-xs">Send</span>
                    </Button>
                </div>
                {showComments && <CommentSection postId={post.id} />}
            </CardFooter>
        </Card>
    )
}

export default Post
