import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  communityService,
  type ICreateCommentRequest,
} from "../services/community";
import type { IComment } from "../utils/types";

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (postId: string) => [...commentKeys.lists(), postId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (commentId: string) => [...commentKeys.details(), commentId] as const,
};

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: async () => {
      const response = await communityService.getComments(postId);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải bình luận");
      }
      return response.payload.comments;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: ICreateCommentRequest;
    }) => communityService.createComment(postId, data),
    onMutate: async ({ postId, data }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData(
        commentKeys.list(postId)
      );

      queryClient.setQueryData(
        commentKeys.list(postId),
        (old: IComment[] = []) => {
          const optimisticComment: IComment = {
            id: "temp-id-" + Date.now(),
            content: data.content,
            author: {
              name: "",
              role: "user",
              avatar: "",
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            userLiked: false,
          };
          return [...old, optimisticComment];
        }
      );

      return { previousComments };
    },
    onError: (_error, { postId }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(postId),
          context.previousComments
        );
      }
    },
    onSuccess: (response, { postId }) => {
      queryClient.setQueryData(
        commentKeys.list(postId),
        (old: IComment[] = []) => {
          return old.map((comment) =>
            comment.id.startsWith("temp-id-")
              ? response.payload.comment
              : comment
          );
        }
      );
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
};

export const useToggleCommentReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      reactionType,
    }: {
      postId: string;
      commentId: string;
      reactionType: string;
    }) =>
      communityService.toggleCommentReaction(postId, commentId, reactionType),
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData(
        commentKeys.list(postId)
      );

      queryClient.setQueryData(
        commentKeys.list(postId),
        (old: IComment[] = []) =>
          old.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  userLiked: !comment.userLiked,
                  likes: comment.userLiked
                    ? comment.likes - 1
                    : comment.likes + 1,
                }
              : comment
          )
      );

      return { previousComments };
    },
    onError: (_error, { postId }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(postId),
          context.previousComments
        );
      }
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
};
