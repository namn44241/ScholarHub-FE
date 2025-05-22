export interface IAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface IReactions {
  likes: number;
  comments: number;
  reposts: number;
}

export interface IPost {
  id: string;
  author: IAuthor;
  content: string;
  image?: string;
  timestamp: string;
  reactions: IReactions;
  userReacted: boolean;
  tags: string[];
  postType: string;
}

export interface IComment {
  id: string;
  author: IAuthor;
  content: string;
  timestamp: string;
  likes: number;
}

export interface IConnection {
  id: string;
  name: string;
  role: string;
  avatar: string;
  mutualConnections: number;
  expertise?: string[];
  programs?: string[];
}

export interface IPostListProps {
  posts: IPost[]
  onReaction: (postId: string) => void
  loadMorePosts?: () => void
}