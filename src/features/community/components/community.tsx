import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useGetPersonal } from "@/features/user_profile";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
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
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
        <div className="hidden md:block lg:col-span-3">
          <div className="top-20 sticky">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="rounded-full w-12 h-12" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-8" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-6">
          <div className="flex flex-col gap-6">
            <PostListSkeleton />
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:block space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="w-32 h-5" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="rounded-full w-10 h-10" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                  <Skeleton className="w-16 h-8" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state with improved UI
  if (postsError) {
    const errorMessage =
      postsError instanceof Error
        ? postsError.message
        : "Connection error occurred";

    return (
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-4">
          <Alert variant="destructive" className="mb-6">
            <WifiOff className="w-4 h-4" />
            <AlertTitle>Unable to load community posts</AlertTitle>
            <AlertDescription>
              <p className="mb-3">{errorMessage}</p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Try the following:</p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Try again in a few moments</li>
                </ul>
              </div>
              <Button
                onClick={() => refetchPosts()}
                className="mt-4"
                variant="outline"
                size="sm"
                disabled={postsLoading}
              >
                <RefreshCw
                  className={`mr-2 w-4 h-4 ${
                    postsLoading ? "animate-spin" : ""
                  }`}
                />
                {postsLoading ? "Retrying..." : "Try Again"}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
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
              {/* Header for Saved Posts */}
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
                <PostListSkeleton />
              ) : savedError ? (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Unable to load saved posts</AlertTitle>
                  <AlertDescription>
                    <p className="mb-3">
                      {savedError instanceof Error
                        ? savedError.message
                        : "Failed to retrieve your saved posts"}
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Possible solutions:</p>
                      <ul className="space-y-1 text-sm list-disc list-inside">
                        <li>Check your network connection</li>
                        <li>Verify your account permissions</li>
                        <li>Try refreshing the page</li>
                      </ul>
                    </div>
                    <Button
                      onClick={() => refetchSavedPosts()}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      disabled={savedLoading}
                    >
                      <RefreshCw
                        className={`mr-2 w-4 h-4 ${
                          savedLoading ? "animate-spin" : ""
                        }`}
                      />
                      {savedLoading ? "Loading..." : "Try Again"}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : visibleSavedPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-muted p-4 rounded-full">
                        <Bookmark className="mx-auto size-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">
                          No saved posts yet
                        </h3>
                        <p className="max-w-sm text-muted-foreground text-sm">
                          Posts you save will appear here. Start exploring and
                          save interesting content!
                        </p>
                      </div>
                      <Button
                        onClick={handleShowFeed}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Wifi className="mr-2 w-4 h-4" />
                        Explore Feed
                      </Button>
                    </div>
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

const PostListSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
};

const PostSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start space-y-0 pb-3">
        <div className="flex flex-1 gap-3">
          <Skeleton className="rounded-full w-10 h-10" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
        <Skeleton className="rounded-full w-8 h-8" />
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 mb-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-3/5 h-4" />
        </div>
        <Skeleton className="mb-3 rounded-md w-full aspect-video" />
      </CardContent>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-2 pb-2">
          <Skeleton className="w-20 h-3" />
          <div className="flex gap-4">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>

        <div className="mb-2 border-t" />
        <div className="flex justify-between">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-1 justify-center items-center gap-2"
            >
              <Skeleton className="rounded w-4 h-4" />
              <Skeleton className="w-12 h-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
