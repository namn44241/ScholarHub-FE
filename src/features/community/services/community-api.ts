import { apiClient } from "@/lib/fetch"
import type { IPost, IComment } from "../utils/types"

export interface CreatePostRequest {
  content: string
  image?: string
  video?: string
  files?: string[]
  post_type?: string
  tags?: string[]
}

export interface CreateCommentRequest {
  content: string
}

export interface ReactionRequest {
  reaction_type?: string
}

export const communityApi = {
  // Posts API
  async getPosts(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(`/community/posts?page=${page}&limit=${limit}`)
    return response
  },

  async createPost(data: CreatePostRequest) {
    const response = await apiClient.post('/community/posts', data)
    return response
  },

  async toggleReaction(postId: string, reactionType: string = "like") {
    const response = await apiClient.post(`/community/posts/${postId}/reaction`, {
      reaction_type: reactionType
    })
    return response
  },

  // Comments API
  async getComments(postId: string) {
    const response = await apiClient.get(`/community/posts/${postId}/comments`)
    return response
  },

  async createComment(postId: string, data: CreateCommentRequest) {
    const response = await apiClient.post(`/community/posts/${postId}/comments`, data)
    return response
  },

  async toggleCommentReaction(postId: string, commentId: string, reactionType: string = "like") {
    const response = await apiClient.post(`/community/posts/${postId}/comments/${commentId}/reaction`, {
      reaction_type: reactionType
    })
    return response
  },

  // Connections API
  async getConnectionSuggestions() {
    const response = await apiClient.get('/community/connections')
    return response
  },

  async createPostWithMedia(data: CreatePostRequest) {
    const response = await apiClient.post('/community/posts', data)
    return response
  },

  async createRepost(postId: string) {
    const response = await apiClient.post(`/community/posts/${postId}/repost`)
    return response
  },

  async toggleSavePost(postId: string) {
    const response = await apiClient.post(`/community/posts/${postId}/save`)
    return response
  },

  async getSavedPosts(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(`/community/saved-posts?page=${page}&limit=${limit}`)
    return response
  },

  async getSavedPostsCount() {
    const response = await apiClient.get(`/community/saved-posts/count`)
    return response
  }
} 