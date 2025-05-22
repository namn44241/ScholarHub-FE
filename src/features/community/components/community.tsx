import { useAuth } from "@/contexts/auth-context"
import { SAMPLE_USER_PROFILE } from "@/features/user_profile/utils/constants"
import { useState } from "react"
import { SAMPLE_POSTS } from "../utils/constants"
import type { IPost } from "../utils/types"
import FeedSuggestion from "./feed-suggesstion"
import MiniProfile from "./mini-profile"
import { NetworkSuggestions } from "./network-suggestions"
import PostCreator from "./post-creator"
import PostList from "./post-list"

export const Community = () => {
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const { user } = useAuth()

  const handleCreatePost = (newPost: IPost) => {
    setPosts([newPost, ...posts])
  }

  const handleReaction = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            userReacted: !post.userReacted,
            reactions: {
              ...post.reactions,
              likes: post.userReacted ? post.reactions.likes - 1 : post.reactions.likes + 1,
            },
          }
          : post,
      ),
    )
  }

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
      <div className="hidden md:block lg:col-span-3">
        <div className="top-20 sticky">
          {
            user && (
              <MiniProfile userData={user} profile={SAMPLE_USER_PROFILE} />
            )
          }
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="flex flex-col gap-6">
          <PostCreator onCreatePost={handleCreatePost} userData={SAMPLE_USER_PROFILE} />
          <PostList posts={posts} onReaction={handleReaction} />
        </div>
      </div>

      <div className="hidden lg:block space-y-6 lg:col-span-3">
        <FeedSuggestion />
        <NetworkSuggestions />
      </div>
    </div>
  )
}
