import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { communityApi } from "../services/community-api"
import { profileApi } from "@/features/user_profile/services/profile-api"
import type { IPost } from "../utils/types"
import type { IUserProfile } from "@/features/user_profile/utils/types"
import FeedSuggestion from "./feed-suggesstion"
import MiniProfile from "./mini-profile"
import { NetworkSuggestions } from "./network-suggestions"
import PostCreator from "./post-creator"
import PostList from "./post-list"

export const Community = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load posts và profile
  useEffect(() => {
    loadPosts()
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await profileApi.getCurrentUserProfile()
      if (response.success && response.payload?.profile) {
        setUserProfile(response.payload.profile)
      } else {
        // Tạo profile mặc định nếu không có
        setUserProfile({
          id: user?.id || '',
          fullName: user?.username || 'User',
          avatar: null,
          coverImage: null,
          bio: '',
          location: '',
          university: '',
          major: '',
          yearOfStudy: null,
          gpa: null,
          skills: [],
          interests: [],
          socialLinks: {},
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      // Tạo profile mặc định khi có lỗi
      setUserProfile({
        id: user?.id || '',
        fullName: user?.username || 'User',
        avatar: null,
        coverImage: null,
        bio: '',
        location: '',
        university: '',
        major: '',
        yearOfStudy: null,
        gpa: null,
        skills: [],
        interests: [],
        socialLinks: {},
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

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

  const handleCreatePost = async (newPost: any) => {
    // PostCreator đã tạo post rồi, chỉ cần refresh danh sách
    loadPosts()
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
          {user && userProfile && (
            <MiniProfile userData={user} profile={userProfile} />
          )}
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="flex flex-col gap-6">
          <PostCreator onCreatePost={handleCreatePost} userData={userProfile} />
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
