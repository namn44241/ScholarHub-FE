import { apiClient } from "@/lib/fetch";
import { COMMUNITY_ENDPOINTS } from "./endpoints";

export interface ICreatePostRequest {
  content: string;
  image?: string;
  video?: string;
  files?: string[];
  post_type?: string;
  tags?: string[];
}

export interface ICreateCommentRequest {
  content: string;
}

export interface IReactionRequest {
  reaction_type?: string;
}

export const communityService = {
  // posts services
  async getPosts(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(
      `${COMMUNITY_ENDPOINTS.POSTS}?page=${page}&limit=${limit}`
    );
    return response;
  },

  async createPost(data: ICreatePostRequest) {
    const response = await apiClient.post(COMMUNITY_ENDPOINTS.POSTS, data);
    return response;
  },

  async toggleReaction(postId: string, reactionType: string = "like") {
    const response = await apiClient.post(
      COMMUNITY_ENDPOINTS.POST_REACTION(postId),
      {
        reaction_type: reactionType,
      }
    );
    return response;
  },

  // comments services
  async getComments(postId: string) {
    const response = await apiClient.get(
      COMMUNITY_ENDPOINTS.POST_COMMENTS(postId)
    );
    return response;
  },

  async createComment(postId: string, data: ICreateCommentRequest) {
    const response = await apiClient.post(
      COMMUNITY_ENDPOINTS.POST_COMMENTS(postId),
      data
    );
    return response;
  },

  async toggleCommentReaction(
    postId: string,
    commentId: string,
    reactionType: string = "like"
  ) {
    const response = await apiClient.post(
      COMMUNITY_ENDPOINTS.COMMENT_REACTION(postId, commentId),
      {
        reaction_type: reactionType,
      }
    );
    return response;
  },

  // connections services
  async getConnectionSuggestions() {
    const response = await apiClient.get(COMMUNITY_ENDPOINTS.CONNECTIONS);
    return response;
  },

  async createPostWithMedia(data: ICreatePostRequest) {
    const response = await apiClient.post(COMMUNITY_ENDPOINTS.POSTS, data);
    return response;
  },

  async createRepost(postId: string) {
    const response = await apiClient.post(
      COMMUNITY_ENDPOINTS.POST_REPOST(postId)
    );
    return response;
  },

  // utilities services
  async toggleSavePost(postId: string) {
    const response = await apiClient.post(
      COMMUNITY_ENDPOINTS.POST_SAVE(postId)
    );
    return response;
  },

  async getSavedPosts(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(
      `${COMMUNITY_ENDPOINTS.SAVED_POSTS}?page=${page}&limit=${limit}`
    );
    return response;
  },

  async getSavedPostsCount() {
    const response = await apiClient.get(COMMUNITY_ENDPOINTS.SAVED_POSTS_COUNT);
    return response;
  },
};
