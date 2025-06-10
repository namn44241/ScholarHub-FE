import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownPreview } from "@/components/ui/markdown-preview";
import { FileText, ImageIcon, Send, Video, X, Eye, Edit } from "lucide-react";
import { usePostCreator } from "../hooks/use-post-creator";
import { useState } from "react";

export interface IPostCreatorProps {
  onCreatePost?: (post: any) => void;
}

const PostCreator = ({ onCreatePost }: IPostCreatorProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const {
    content,
    setContent,
    attachments,
    imageInputRef,
    videoInputRef,
    fileInputRef,
    handleFileUpload,
    removeAttachment,
    handleSubmit,
    triggerImageUpload,
    triggerVideoUpload,
    triggerFileUpload,
    isDisabled,
    isCreating,
    isUploading,
    getButtonText,
  } = usePostCreator(onCreatePost);

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-3">
          {/* Toggle buttons */}
          <div className="flex gap-1">
            <Button
              variant={!isPreviewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreviewMode(false)}
              className="h-7 px-3 text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant={isPreviewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreviewMode(true)}
              className="h-7 px-3 text-xs"
              disabled={!content.trim()}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>

          {/* Content input/preview */}
          {!isPreviewMode ? (
            <Textarea
              placeholder="What do you want to talk about? (Supports Markdown: # ## ``` ---)"
              className="flex-1 mb-3 resize-none min-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isCreating}
            />
          ) : (
            <div className="min-h-[100px] p-3 border rounded-md bg-muted/30">
              {content.trim() ? (
                <MarkdownPreview content={content} />
              ) : (
                <p className="text-muted-foreground text-sm">Nothing to preview</p>
              )}
            </div>
          )}
        </div>

        {/* Preview attachments */}
        {(attachments.images.length > 0 ||
          attachments.videos.length > 0 ||
          attachments.files.length > 0) && (
          <div className="space-y-2 mb-3">
            {attachments.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="Preview"
                      className="border rounded w-20 h-20 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="-top-2 -right-2 absolute p-0 rounded-full w-6 h-6"
                      onClick={() => removeAttachment(url, "images")}
                      disabled={isCreating}
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
                      className="border rounded w-20 h-20 object-cover"
                      controls={false}
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.currentTime = 1;
                      }}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="-top-2 -right-2 absolute p-0 rounded-full w-6 h-6"
                      onClick={() => removeAttachment(url, "videos")}
                      disabled={isCreating}
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
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <FileText className="size-4" />
                    <span className="flex-1 text-sm">
                      {url.split("/").pop()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-0 w-6 h-6"
                      onClick={() => removeAttachment(url, "files")}
                      disabled={isCreating}
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

      <CardFooter className="flex justify-between pt-4 border-muted-foreground/10 border-t">
        <div className="flex gap-1">
          {/* Image upload */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={triggerImageUpload}
            disabled={isUploading || isCreating}
          >
            <ImageIcon className="size-4 text-muted-foreground" />
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "image")}
          />

          {/* Video upload */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={triggerVideoUpload}
            disabled={isUploading || isCreating}
          >
            <Video className="size-4 text-muted-foreground" />
          </Button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "video")}
          />

          {/* File upload */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={triggerFileUpload}
            disabled={isUploading || isCreating}
          >
            <FileText className="size-4 text-muted-foreground" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "file")}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="rounded-full"
          size="sm"
        >
          {getButtonText()}
          <Send className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCreator;
