import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  communityService,
  type ICreatePostRequest,
} from "../services/community";
import type { IPost } from "../utils/types";

export const communityKeys = {
  all: ["community"] as const,
  posts: () => [...communityKeys.all, "posts"] as const,
  postsList: () => [...communityKeys.posts(), "list"] as const,
  postDetails: () => [...communityKeys.posts(), "detail"] as const,
  postDetail: (id: string) => [...communityKeys.postDetails(), id] as const,
  savedPosts: () => [...communityKeys.all, "saved"] as const,
};

export const useGetCommunityPosts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...communityKeys.postsList(), page, limit],
    queryFn: async () => {
      const response = await communityService.getPosts(page, limit);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải bài viết");
      }
      return response.payload.posts;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useGetSavedPosts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...communityKeys.savedPosts(), page, limit],
    queryFn: async () => {
      const response = await communityService.getSavedPosts(page, limit);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải bài viết đã lưu");
      }
      return response.payload.posts;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: false, // Chỉ fetch khi được gọi manually
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePostRequest) =>
      communityService.createPostWithMedia(data),
    onMutate: async (newPost) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());

      // Optimistically update
      queryClient.setQueryData(
        communityKeys.postsList(),
        (old: IPost[] = []) => {
          const optimisticPost: IPost = {
            ...newPost,
            id: "temp-id",
            reactions: {
              likes: 0,
              comments: 0,
              reposts: 0,
            },
            userReacted: false,
            author: {
              name: "",
              role: "user",
              avatar: "",
            },
            timestamp: new Date().toISOString(),
            userReposted: false,
            userSaved: false,
            post_type: (newPost as any).post_type ?? "",
            tags: (newPost as any).tags ?? [],
          };
          return [optimisticPost, ...old];
        }
      );
      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        communityKeys.postDetail(response.payload.post.id),
        response.payload.post
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
    },
  });
};

export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      reactionType,
    }: {
      postId: string;
      reactionType: string;
    }) => communityService.toggleReaction(postId, reactionType),
    onMutate: async ({ postId }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });
      await queryClient.cancelQueries({ queryKey: communityKeys.savedPosts() });

      // Snapshot previous values
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());
      const previousSavedPosts = queryClient.getQueryData(
        communityKeys.savedPosts()
      );

      // Helper function to update post reaction
      const updatePostReaction = (posts: IPost[] = []) =>
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                userReacted: !post.userReacted,
                reactions: {
                  ...post.reactions,
                  likes: post.userReacted
                    ? post.reactions.likes - 1
                    : post.reactions.likes + 1,
                },
              }
            : post
        );

      // Optimistically update posts list
      queryClient.setQueryData(communityKeys.postsList(), updatePostReaction);

      // Optimistically update saved posts if they exist
      queryClient.setQueryData(communityKeys.savedPosts(), updatePostReaction);

      return { previousPosts, previousSavedPosts };
    },
    onError: (_error, {}, context) => {
      // Revert optimistic updates
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
      if (context?.previousSavedPosts) {
        queryClient.setQueryData(
          communityKeys.savedPosts(),
          context.previousSavedPosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: communityKeys.savedPosts() });
    },
  });
};

export const useGetSavedPostsCount = () => {
  return useQuery({
    queryKey: [...communityKeys.savedPosts(), "count"],
    queryFn: async () => {
      const response = await communityService.getSavedPostsCount();
      if (!response.success) {
        throw new Error(
          response.message || "Không thể tải số lượng bài viết đã lưu"
        );
      }
      return response.payload.count;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useCreateRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityService.createRepost(postId),
    onMutate: async (postId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());

      // Optimistically update repost count
      queryClient.setQueryData(communityKeys.postsList(), (old: IPost[] = []) =>
        old.map((post) =>
          post.id === postId
            ? {
                ...post,
                userReposted: true,
                reactions: {
                  ...post.reactions,
                  reposts: post.reactions.reposts + 1,
                },
              }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
    },
  });
};

export const useToggleSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityService.toggleSavePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });
      await queryClient.cancelQueries({ queryKey: communityKeys.savedPosts() });

      const queryCache = queryClient.getQueryCache();
      const postsQueries = queryCache.findAll({ queryKey: communityKeys.postsList() });
      const savedQueries = queryCache.findAll({ queryKey: communityKeys.savedPosts() });

      const previousData = new Map();
      
      const toggleSaveStatus = (posts: IPost[] = []) =>
        posts.map((post) =>
          post.id === postId ? { ...post, userSaved: !post.userSaved } : post
        );

      postsQueries.forEach((query) => {
        const data = query.state.data as IPost[];
        if (data) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, toggleSaveStatus(data));
        }
      });

      savedQueries.forEach((query) => {
        const data = query.state.data as IPost[];
        if (data) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, toggleSaveStatus(data));
        }
      });

      const savedCountKey = [...communityKeys.savedPosts(), "count"];
      const previousSavedCount = queryClient.getQueryData(savedCountKey);
      
      if (typeof previousSavedCount === "number") {
        let currentPost: IPost | undefined;
        for (const query of postsQueries) {
          const data = query.state.data as IPost[];
          if (data) {
            currentPost = data.find(p => p.id === postId);
            if (currentPost) break;
          }
        }

        if (currentPost) {
          const newCount = currentPost.userSaved
            ? previousSavedCount - 1
            : previousSavedCount + 1;
          queryClient.setQueryData(savedCountKey, newCount);
          previousData.set(savedCountKey, previousSavedCount);
        }
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: communityKeys.postsList(),
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: communityKeys.savedPosts(),
        exact: false
      });
    },
  });
};