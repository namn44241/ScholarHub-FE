export const COMMUNITY_ENDPOINTS = {
  // upload endpoints
  UPLOAD_FILE: "/community/upload",
  UPLOAD_MULTIPLE_FILES: "/community/upload/multiple",

  // posts endpoints
  POSTS: "/community/posts",
  POST_REACTION: (postId: string) => `/community/posts/${postId}/reaction`,
  POST_REPOST: (postId: string) => `/community/posts/${postId}/repost`,
  POST_SAVE: (postId: string) => `/community/posts/${postId}/save`,
  POST_DELETE: (postId: string) => `/community/posts/${postId}/delete`,

  // comments endpoints
  POST_COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
  COMMENT_REACTION: (postId: string, commentId: string) =>
    `/community/posts/${postId}/comments/${commentId}/reaction`,

  // connections endpoints
  CONNECTIONS: "/community/connections",

  // utilities endpoints
  SAVED_POSTS: "/community/saved-posts",
  SAVED_POSTS_COUNT: "/community/saved-posts/count",

  FOLLOW: "/community/follow",
  FOLLOWERS: (userId: string) => `/community/followers?user_id=${userId}`,
  FOLLOWING: (userId: string) => `/community/following?user_id=${userId}`,
  FOLLOW_USER: (userId: string) => `/community/follow?user_id=${userId}`,
  UNFOLLOW_USER: (userId: string) => `/community/follow?user_id=${userId}`,
};
