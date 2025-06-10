import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useGetPersonal } from "@/features/user_profile";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useState } from "react";
import { useGetCommunityPosts, useGetSavedPosts } from "../hooks/use-community";
import type { IPost } from "../utils/types";
import MiniProfile from "./mini-profile";
import { NetworkSuggestions } from "./network-suggestions";
import PostCreator from "./post-creator";
import PostList from "./post-list";

export const Community = () => {
  const { user } = useAuth();
  const { data: userProfile } = useGetPersonal();

  const [currentView, setCurrentView] = useState<"feed" | "saved">("feed");
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set());

  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useGetCommunityPosts(1, 20);

  const {
    data: savedPosts = [],
    isLoading: savedLoading,
    error: savedError,
    refetch: refetchSavedPosts,
  } = useGetSavedPosts(1, 20);

  const handleShowSavedPosts = () => {
    setCurrentView("saved");
    refetchSavedPosts();
  };

  const handleShowFeed = () => {
    setCurrentView("feed");
  };

  const handleHidePost = (postId: string) => {
    setHiddenPosts((prev) => new Set([...prev, postId]));
  };

  const visiblePosts = posts.filter((post: IPost) => !hiddenPosts.has(post.id));
  const visibleSavedPosts = savedPosts.filter(
    (post: IPost) => !hiddenPosts.has(post.id)
  );

  if (postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (postsError) {
    const errorMessage =
      postsError instanceof Error ? postsError.message : "Lỗi kết nối";

    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{errorMessage}</p>
        <button
          onClick={() => refetchPosts()}
          className="bg-primary mt-2 px-4 py-2 rounded-md text-white"
          disabled={postsLoading}
        >
          {postsLoading ? "Đang tải..." : "Thử lại"}
        </button>
      </div>
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
      {/* Left Sidebar */}
      <div className="hidden md:block lg:col-span-3">
        <div className="top-20 sticky">
          {user && userProfile && (
            <MiniProfile
              userData={user}
              profile={userProfile}
              onShowSavedPosts={handleShowSavedPosts}
              currentView={currentView}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-6">
        <div className="flex flex-col gap-6">
          {currentView === "feed" ? (
            <>
              <PostCreator />
              <PostList posts={visiblePosts} onHidePost={handleHidePost} />
            </>
          ) : (
            <>
              {/* Header cho Saved Posts */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShowFeed}
                    className="mr-3"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="size-4" />
                    Saved Posts ({visibleSavedPosts.length})
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Saved Posts Content */}
              {savedLoading ? (
                <div className="flex justify-center py-8">
                  <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
                </div>
              ) : savedError ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="mb-4 text-red-500">
                      {savedError instanceof Error
                        ? savedError.message
                        : "Không thể tải bài viết đã lưu"}
                    </p>
                    <Button
                      onClick={() => refetchSavedPosts()}
                      variant="outline"
                      disabled={savedLoading}
                    >
                      {savedLoading ? "Đang tải..." : "Thử lại"}
                    </Button>
                  </CardContent>
                </Card>
              ) : visibleSavedPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Bookmark className="mx-auto mb-4 size-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Chưa có bài viết nào được lưu
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <PostList
                  posts={visibleSavedPosts}
                  onHidePost={handleHidePost}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block space-y-6 lg:col-span-3">
        <NetworkSuggestions />
      </div>
    </div>
  );
};
