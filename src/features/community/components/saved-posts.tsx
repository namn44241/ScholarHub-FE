import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bookmark } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import Post from "./post"
import type { IPost } from "../utils/types"
import { communityApi } from "../services/community-api"

const SavedPosts = () => {
  const navigate = useNavigate()
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadSavedPosts = async (currentPage: number = 1) => {
    try {
      setLoading(true)
      const response = await communityApi.getSavedPosts(currentPage, 20)
      
      if (response.success) {
        if (currentPage === 1) {
          setSavedPosts(response.payload.posts)
        } else {
          setSavedPosts(prev => [...prev, ...response.payload.posts])
        }
        
        setHasMore(response.payload.pagination.page < response.payload.pagination.total_pages)
      }
    } catch (error) {
      console.error('Load saved posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedPosts()
  }, [])

  const handleReaction = async (postId: string) => {
    try {
      await communityApi.toggleReaction(postId)
      // Refresh posts
      loadSavedPosts()
    } catch (error) {
      console.error('Reaction error:', error)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      loadSavedPosts(nextPage)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/community" })}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Posts ({savedPosts.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {loading && page === 1 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : savedPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có bài viết nào được lưu</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onReaction={handleReaction}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Tải thêm"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SavedPosts 