import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ImageIcon, Send, Video, X } from "lucide-react";
import { usePostCreator } from "../hooks/use-post-creator";

export interface IPostCreatorProps {
  onCreatePost?: (post: any) => void;
}

const PostCreator = ({ onCreatePost }: IPostCreatorProps) => {
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
        <Textarea
          placeholder="What do you want to talk about?"
          className="flex-1 mb-3 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isCreating}
        />

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
                    <FileText className="w-4 h-4" />
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
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
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
            <Video className="w-5 h-5 text-muted-foreground" />
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
            <FileText className="w-5 h-5 text-muted-foreground" />
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
