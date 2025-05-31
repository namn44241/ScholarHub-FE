import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, ImageIcon, Send, Video, X } from 'lucide-react'
import { useState, useRef } from "react"
import { communityApi } from "../services/community-api"
import { uploadService } from "../services/upload-service"
import type { IUserProfile } from "@/features/user_profile"

const PostCreator = ({ onCreatePost, userData }: {
    onCreatePost: (post: any) => void
    userData: IUserProfile
}) => {
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [attachments, setAttachments] = useState<{
        images: string[]
        videos: string[]
        files: string[]
    }>({
        images: [],
        videos: [],
        files: []
    })
    
    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (files: FileList | null, type: 'image' | 'video' | 'file') => {
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            const uploadPromises = Array.from(files).map(file => {
                const validation = uploadService.validateFile(file)
                if (!validation.valid) {
                    throw new Error(validation.error)
                }
                return uploadService.uploadFile(file)
            })

            const results = await Promise.all(uploadPromises)
            const urls = results.map(result => result.payload.file_url)

            setAttachments(prev => ({
                ...prev,
                [type === 'image' ? 'images' : type === 'video' ? 'videos' : 'files']: [
                    ...prev[type === 'image' ? 'images' : type === 'video' ? 'videos' : 'files'],
                    ...urls
                ]
            }))
        } catch (error) {
            console.error('Upload error:', error)
            alert(`Upload failed: ${error}`)
        } finally {
            setUploading(false)
        }
    }

    const removeAttachment = (url: string, type: 'images' | 'videos' | 'files') => {
        setAttachments(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item !== url)
        }))
    }

    const handleSubmit = async () => {
        if (!content.trim() && attachments.images.length === 0 && attachments.videos.length === 0 && attachments.files.length === 0) {
            return
        }

        setIsSubmitting(true)
        try {
            const postData = {
                content: content.trim(),
                image: attachments.images[0] || undefined, // Backend expects single image
                video: attachments.videos[0] || undefined, // Backend expects single video  
                files: attachments.files.length > 0 ? attachments.files : undefined,
                post_type: "general",
                tags: []
            }

            const response = await communityApi.createPostWithMedia(postData)
            
            if (response.success) {
                // Reset form
                setContent("")
                setAttachments({ images: [], videos: [], files: [] })
                
                // Call parent callback to refresh posts
                onCreatePost(response.payload.post)
            }
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full">
            <CardContent>
                <Textarea
                    placeholder="What do you want to talk about?"
                    className="resize-none flex-1 mb-3"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Preview attachments */}
                {(attachments.images.length > 0 || attachments.videos.length > 0 || attachments.files.length > 0) && (
                    <div className="space-y-2 mb-3">
                        {/* Image previews */}
                        {attachments.images.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {attachments.images.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img src={url} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                            onClick={() => removeAttachment(url, 'images')}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Video previews */}
                        {attachments.videos.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {attachments.videos.map((url, index) => (
                                    <div key={index} className="relative">
                                        <video 
                                            src={url} 
                                            className="w-20 h-20 object-cover rounded border"
                                            controls={false}
                                            muted
                                            preload="metadata"
                                            onLoadedMetadata={(e) => {
                                                // Seek to 1 second to show preview frame
                                                const video = e.target as HTMLVideoElement;
                                                video.currentTime = 1;
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                            onClick={() => removeAttachment(url, 'videos')}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* File previews */}
                        {attachments.files.length > 0 && (
                            <div className="space-y-1">
                                {attachments.files.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm flex-1">{url.split('/').pop()}</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-6 h-6 p-0"
                                            onClick={() => removeAttachment(url, 'files')}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-muted-foreground/10 pt-4">
                <div className="flex gap-1">
                    {/* Image upload */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'image')}
                    />

                    {/* Video upload */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'video')}
                    />

                    {/* File upload */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'file')}
                    />
                </div>
                
                <Button
                    onClick={handleSubmit}
                    disabled={(!content.trim() && attachments.images.length === 0 && attachments.videos.length === 0 && attachments.files.length === 0) || isSubmitting || uploading}
                    className="rounded-full"
                    size="sm"
                >
                    {isSubmitting ? 'Posting...' : uploading ? 'Uploading...' : 'Post'}
                    <Send className="size-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PostCreator