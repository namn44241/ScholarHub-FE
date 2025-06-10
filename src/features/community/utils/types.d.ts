export interface IAuthor {
  id?: string; 
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
  video?: string;
  files?: string[];
  post_type: string;
  tags: string[];
  timestamp: string;
  reactions: IReactions;
  userReacted: boolean;
  userReposted: boolean;
  userSaved: boolean;
}

export interface IComment {
  id: string;
  author: IAuthor;
  content: string;
  timestamp: string;
  likes: number;
  userLiked: boolean;
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

interface IAttachments {
  images: string[];
  videos: string[];
  files: string[];
}
