import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Post from "./post";
import type { IPost, IPostListProps } from "../utils/types";


const MemoizedPost = memo(Post);

const PostList = ({ posts, onReaction, loadMorePosts, onHidePost }: IPostListProps) => {
  const [visiblePosts, setVisiblePosts] = useState<IPost[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleReaction = useCallback((postId: string) => {
    onReaction(postId);
  }, [onReaction]);

  useEffect(() => {
    setVisiblePosts(posts.slice(0, 10));

    if (!loadMorePosts) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMorePosts();
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, posts]);

  // post observer to lazy load posts
  useEffect(() => {
    const postObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const postElement = entry.target as HTMLDivElement;

        if (entry.isIntersecting) {
          postElement.classList.add('post-visible');
        }

        if (!entry.isIntersecting) {
          const videos = postElement.querySelectorAll('video');
          videos.forEach(video => {
            if (!video.paused) video.pause();
          });
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    postRefs.current.forEach(element => {
      postObserver.observe(element);
    });

    return () => postObserver.disconnect();
  }, [visiblePosts]);

  const setPostRef = useCallback((element: HTMLDivElement | null, id: string) => {
    if (element) {
      postRefs.current.set(id, element);
    } else {
      postRefs.current.delete(id);
    }
  }, []);

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
          />
        </div>
      ))}

      {loadMorePosts && (
        <div ref={loaderRef} className="py-4 text-center">
          <div className="inline-block border-4 border-current border-r-transparent border-solid rounded-full w-8 h-8 animate-spin" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PostList);