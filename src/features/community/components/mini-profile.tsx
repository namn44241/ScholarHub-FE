import bannerMock from "@/assets/images/banner_mock.jpg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { IUserProfile } from "@/features/user_profile"
import type { IUser } from "@/types/user"
import { useNavigate } from "@tanstack/react-router"
import { ArrowUpRight, Bookmark, GraduationCap, Navigation, Users } from 'lucide-react'
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useEffect, useState } from "react"
import { communityApi } from "../services/community-api"

const MiniProfile = ({ 
  userData, 
  profile, 
  onShowSavedPosts, 
  onShowFeed,
  currentView 
}: { 
  userData: IUser, 
  profile: IUserProfile,
  onShowSavedPosts: () => void,
  onShowFeed: () => void,
  currentView: 'feed' | 'saved'
}) => {
  const navigate = useNavigate()
  const [savedPostsCount, setSavedPostsCount] = useState(0)

  // Load saved posts count
  useEffect(() => {
    const loadSavedPostsCount = async () => {
      try {
        const response = await communityApi.getSavedPostsCount()
        if (response.success) {
          setSavedPostsCount(response.payload.count)
        }
      } catch (error) {
        console.error('Load saved posts count error:', error)
      }
    }
    
    loadSavedPostsCount()
  }, [])

  const navigationItems = [
    {
      icon: <Bookmark className="size-4" />,
      label: "Saved Posts",
      onClick: onShowSavedPosts,
      count: savedPostsCount,
      active: currentView === 'saved'
    },
    { 
      icon: <Users className="size-4" />, 
      label: "Groups", 
      onClick: () => {}, 
      active: false 
    },
    { 
      icon: <GraduationCap className="size-4" />, 
      label: "My Scholarships", 
      onClick: () => {},
      active: false 
    },
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      <Card className="shadow-sm pt-0 border border-muted-foreground/20 overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background h-24 sm:h-28">
            {bannerMock && (
              <LazyLoadImage
                src={"/placeholder.svg"}
                alt="Profile banner"
                className="absolute inset-0 dark:brightness-[0.8] rounded-t-xl w-full h-full object-cover"
              />
            )}
          </div>

          {/* Avatar - positioned to overlap the banner */}
          <div className="bottom-0 left-4 absolute translate-y-1/2 transform">
            <div className="border-4 border-mute rounded-full overflow-hidden">
              <Avatar className="size-16 sm:size-20">
                <AvatarImage src={userData.avatar} alt={userData.email} className="object-cover" />
                <AvatarFallback className="font-bold text-4xl">
                  {profile.first_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Profile info - with padding to accommodate the overlapping avatar */}
        <CardContent className="pt-6">
          <div className="flex flex-col">
            <p className="font-semibold text-xl">
              {profile.first_name}
              {profile.middle_name ? ` ${profile.middle_name} ` : " "}
              {profile.last_name}
            </p>
            <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3 text-muted-foreground">
              <Badge className="w-fit">{profile.job_title}</Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate({ to: "/profile/$userId", params: { userId: "1" } })}>
            View Profile
            <ArrowUpRight className="size-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm border border-muted-foreground/20">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Navigation className="size-4" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-0.5">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`group flex items-center justify-between hover:bg-muted/80 px-2 py-1.5 rounded-md font-medium text-sm transition-all w-full text-left ${item.active ? 'bg-muted text-primary' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-muted-foreground group-hover:text-foreground transition-colors ${item.active ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="transition-transform group-hover:translate-x-0.5">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}

export default MiniProfile
