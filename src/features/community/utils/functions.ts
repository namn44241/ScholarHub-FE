import type { IUserProfile } from "@/features/user_profile"
import type { IPost } from "./types"

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

export const formatPostData = (content: string, author: IUserProfile): IPost => {
  return {
    id: generateUniqueId(),
    author: {
      name: author.last_name + " " + author.middle_name + " " + author.first_name, 
      role: author.job_title || "",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content,
    timestamp: "Just now",
    reactions: {
      likes: 0,
      comments: 0,
      reposts: 0
    },
    userReacted: false,
    tags: [],
    postType: "default"
  }
}
