import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Heart, Loader2 } from "lucide-react";
import { useGetComments } from "../hooks/use-comment";
import { useCommentForm } from "../hooks/use-comment-form";
import type { IComment } from "../utils/types";

interface ICommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: ICommentSectionProps) => {
  const { user } = useAuth();
  const { data: comments = [], isLoading, error } = useGetComments(postId);

  const {
    newComment,
    setNewComment,
    replyingTo,
    replyContent,
    setReplyContent,

    handleAddComment,
    handleLikeComment,
    handleReply,
    handleSubmitReply,
    handleCancelReply,
    handleCommentKeyDown,
    handleReplyKeyDown,

    isCreatingComment,
    isTogglingReaction,
    canSubmitComment,
    canSubmitReply,
  } = useCommentForm(postId);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-2 pt-3 border-muted-foreground/10 border-t">
        <div className="flex justify-center items-center py-4">
          <Loader2 className="size-4 animate-spin" />
          <span className="ml-2 text-muted-foreground text-sm">
            Loading comments...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 mt-2 pt-3 border-muted-foreground/10 border-t">
        <div className="py-4 text-center">
          <p className="text-red-500 text-sm">
            Failed to load comments. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2 pt-3 border-muted-foreground/10 border-t">
      {/* Add comment input */}
      <div className="flex gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar || undefined} alt={user?.email} />
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {user?.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 h-9"
            onKeyDown={handleCommentKeyDown}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!canSubmitComment}
          >
            {isCreatingComment ? (
              <>
                <Loader2 className="mr-1 w-3 h-3 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((comment: IComment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={comment.author.avatar || undefined}
                alt={comment.author?.name}
              />
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                {comment.author?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted/50 p-2 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">
                      {comment.author?.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {comment.author.role}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {comment.timestamp}
                  </p>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>

              {/* Comment actions */}
              <div className="flex items-center gap-4 mt-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 h-6 text-xs ${
                    comment.userLiked ? "text-red-500" : ""
                  }`}
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={isTogglingReaction}
                >
                  <Heart
                    className={`mr-1 w-3 h-3 ${
                      comment.userLiked ? "fill-current" : ""
                    }`}
                  />
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

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="flex gap-2 mt-2 ml-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={user?.avatar || undefined}
                      alt={user?.email}
                    />
                    <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                      {user?.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 gap-2">
                    <Input
                      placeholder={`Reply to ${comment.author?.name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="flex-1 h-8 text-xs"
                      autoFocus
                      onKeyDown={handleReplyKeyDown}
                    />
                    <Button
                      size="sm"
                      onClick={handleSubmitReply}
                      disabled={!canSubmitReply}
                      className="px-3 h-8 text-xs"
                    >
                      {isCreatingComment ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Reply"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelReply}
                      className="px-3 h-8 text-xs"
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

      {/* Empty state */}
      {comments.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-muted-foreground text-sm">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
