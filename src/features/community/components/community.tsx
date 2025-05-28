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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bookmark } from "lucide-react"

export const Community = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Thêm state cho current view
  const [currentView, setCurrentView] = useState<'feed' | 'saved'>('feed')
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [savedLoading, setSavedLoading] = useState(false)
  
  // Thêm state cho hidden posts
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set())
  
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

  // Thêm function load saved posts
  const loadSavedPosts = async () => {
    try {
      setSavedLoading(true)
      const response = await communityApi.getSavedPosts(1, 20)
      if (response.success) {
        setSavedPosts(response.payload.posts)
      }
    } catch (error) {
      console.error('Load saved posts error:', error)
    } finally {
      setSavedLoading(false)
    }
  }

  // Function để switch view
  const handleShowSavedPosts = () => {
    setCurrentView('saved')
    loadSavedPosts()
  }

  const handleShowFeed = () => {
    setCurrentView('feed')
  }

  // Thêm function để hide post
  const handleHidePost = (postId: string) => {
    setHiddenPosts(prev => new Set([...prev, postId]))
  }

  // Filter posts để loại bỏ hidden posts
  const visiblePosts = posts.filter(post => !hiddenPosts.has(post.id))
  const visibleSavedPosts = savedPosts.filter(post => !hiddenPosts.has(post.id))

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
            <MiniProfile 
              userData={user} 
              profile={userProfile}
              onShowSavedPosts={handleShowSavedPosts}
              onShowFeed={handleShowFeed}
              currentView={currentView}
            />
          )}
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="flex flex-col gap-6">
          {currentView === 'feed' ? (
            <>
              <PostCreator onCreatePost={handleCreatePost} userData={userProfile} />
              <PostList 
                posts={visiblePosts} 
                onReaction={handleReaction} 
                onHidePost={handleHidePost}
              />
            </>
          ) : (
            <>
              {/* Header cho Saved Posts */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShowFeed}
                    className="mr-3"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    Saved Posts ({visibleSavedPosts.length})
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Saved Posts Content */}
              {savedLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : visibleSavedPosts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Chưa có bài viết nào được lưu</p>
                  </CardContent>
                </Card>
              ) : (
                <PostList 
                  posts={visibleSavedPosts} 
                  onReaction={handleReaction} 
                  onHidePost={handleHidePost}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:block space-y-6 lg:col-span-3">
        <FeedSuggestion />
        <NetworkSuggestions />
      </div>
    </div>
  )
}
