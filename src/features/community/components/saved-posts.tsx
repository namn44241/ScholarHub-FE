import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useState } from "react";
import { useGetSavedPosts, useToggleReaction } from "../hooks/use-community";
import type { IPost } from "../utils/types";
import Post from "./post";

const SavedPosts = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: savedPosts = [],
    isLoading,
    error,
    refetch,
  } = useGetSavedPosts(page, limit);

  const toggleReactionMutation = useToggleReaction();

  const handleReaction = async (postId: string) => {
    try {
      await toggleReactionMutation.mutateAsync({
        postId,
        reactionType: "like",
      });
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
    refetch();
  };

  // Xử lý trạng thái loading ban đầu
  if (isLoading && page === 1) {
    return (
      <div className="space-y-4 mx-auto max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: "/community" })}
              className="mr-3"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Saved Posts
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="flex justify-center py-8">
          <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      </div>
    );
  }

  // Xử lý trạng thái lỗi
  if (error) {
    return (
      <div className="space-y-4 mx-auto max-w-2xl">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-500">
              Có lỗi xảy ra khi tải bài viết đã lưu
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/community" })}
            className="mr-3"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Posts ({savedPosts.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {savedPosts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Bookmark className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Chưa có bài viết nào được lưu
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {savedPosts.map((post: IPost) => (
              <Post key={post.id} post={post} onReaction={handleReaction} />
            ))}
          </div>

          <div className="flex justify-center py-4">
            <Button variant="outline" onClick={loadMore} disabled={isLoading}>
              {isLoading ? "Đang tải..." : "Tải thêm"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedPosts;
