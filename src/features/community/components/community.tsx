import { useAuth } from "@/contexts/auth-context"
import { SAMPLE_USER_PROFILE } from "@/features/user_profile/utils/constants"
import { useEffect, useState } from "react"
import { communityApi } from "../services/community-api"
import type { IPost } from "../utils/types"
import FeedSuggestion from "./feed-suggesstion"
import MiniProfile from "./mini-profile"
import { NetworkSuggestions } from "./network-suggestions"
import PostCreator from "./post-creator"
import PostList from "./post-list"

export const Community = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load posts từ API
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await communityApi.getPosts(1, 20)
      if (response.success) {
        setPosts(response.payload.posts)
      } else {
        setError("Không thể tải bài viết")
      }
    } catch (err) {
      setError("Lỗi kết nối")
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (newPost: IPost) => {
    try {
      const response = await communityApi.createPost({
        content: newPost.content,
        image: newPost.image,
        post_type: newPost.postType,
        tags: newPost.tags
      })
      
      if (response.success) {
        // Reload posts để có post mới
        loadPosts()
      }
    } catch (err) {
      console.error('Error creating post:', err)
    }
  }

  const handleReaction = async (postId: string) => {
    try {
      await communityApi.toggleReaction(postId, "like")
      
      // Update local state optimistically
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
    } catch (err) {
      console.error('Error toggling reaction:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadPosts}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
        >
          Thử lại
        </button>
      </div>
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
