import { memo, useEffect, useRef, useState } from "react";
import { useToggleReaction } from "../hooks/use-community";
import type { IPost } from "../utils/types";
import Post from "./post";

export interface IPostListProps {
  posts: IPost[];
  loadMorePosts?: () => void;
  onHidePost?: (postId: string) => void;
}

const MemoizedPost = memo(Post);

const PostList = ({ posts, loadMorePosts, onHidePost }: IPostListProps) => {
  const [visiblePosts, setVisiblePosts] = useState<IPost[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { isPending, mutateAsync, variables } = useToggleReaction();

  const handleReaction = async (postId: string) => {
    try {
      await mutateAsync({
        postId,
        reactionType: "like",
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  useEffect(() => {
    setVisiblePosts(posts.slice(0, 10));

    if (!loadMorePosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, posts]);

  // post observer to lazy load posts
  useEffect(() => {
    const postObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postElement = entry.target as HTMLDivElement;

          if (entry.isIntersecting) {
            postElement.classList.add("post-visible");
          }

          if (!entry.isIntersecting) {
            const videos = postElement.querySelectorAll("video");
            videos.forEach((video) => {
              if (!video.paused) video.pause();
            });
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    postRefs.current.forEach((element) => {
      postObserver.observe(element);
    });

    return () => postObserver.disconnect();
  }, [visiblePosts]);

  return (
    <div className="flex flex-col gap-4">
      {visiblePosts.map((post) => (
        <div
          key={post.id}
          ref={(el) => {
            if (el) postRefs.current.set(post.id, el);
          }}
          className="post-container"
        >
          <MemoizedPost
            post={post}
            onReaction={handleReaction}
            onHidePost={onHidePost}
            isReactionLoading={isPending && variables?.postId === post.id}
          />
        </div>
      ))}

      {loadMorePosts && (
        <div ref={loaderRef} className="py-4 text-center">
          <div
            className="inline-block border-4 border-current border-r-transparent border-solid rounded-full w-8 h-8 animate-spin"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PostList);
