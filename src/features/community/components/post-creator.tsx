import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, ImageIcon, Send, Video } from 'lucide-react'
import { useState } from "react"
import { formatPostData } from "../utils/functions"
import type { IUserProfile } from "@/features/user_profile"


const PostCreator = ({ onCreatePost, userData }: {
    onCreatePost: (post: any) => void
    userData: IUserProfile
}) => {
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = () => {
        if (!content.trim()) return

        setIsSubmitting(true)

        // Create new post
        const newPost = formatPostData(content, userData)

        // Add post to the list
        onCreatePost(newPost)

        // Reset form
        setContent("")
        setIsSubmitting(false)
    }

    return (
        <Card className="w-full">
            <CardContent>
                <Textarea
                    placeholder="What do you want to talk about?"
                    className="resize-none flex-1"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </CardContent>
            <CardFooter className="flex justify-between border-t border-muted-foreground/10 pt-4">
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                    className="rounded-full"
                    size="sm"
                >
                    Post
                    <Send className="size-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PostCreator