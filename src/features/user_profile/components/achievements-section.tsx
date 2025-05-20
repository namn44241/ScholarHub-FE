import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { truncateText } from "@/utils/functions"
import { Award, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useDeleteAchievement, useGetAchievement, usePostAchievement, usePutAchievement } from "../hooks/useAchievement"
import type { IAchievement, IAchievementsSectionProps } from "../utils/types"
import AchievementsForm, { type AchievementsFormValues } from "./achievements-form"

const AchievementsSection = ({ isCurrentUser }: IAchievementsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: achievementsData = [], isLoading } = useGetAchievement()
  const { mutate: createAchievement } = usePostAchievement()
  const { mutate: updateAchievement } = usePutAchievement()
  const { mutate: deleteAchievement } = useDeleteAchievement()

  const isDataArray = Array.isArray(achievementsData)
  const achievements = isDataArray ? achievementsData : [achievementsData]

  const openAddDialog = () => {
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (id: string) => {
    if (!id) {
      console.error("Attempted to edit achievement with invalid ID")
      return
    }

    setEditingId(id)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
  }

  const saveAchievement = (values: AchievementsFormValues) => {
    if (editingId) {
      // Update existing achievement
      const updatedAchievement = {
        id: editingId,
        ...values,
      }

      updateAchievement(updatedAchievement as IAchievement)
    } else {
      // Create new achievement
      const newAchievement = {
        ...values,
      }

      createAchievement(newAchievement)
    }

    setIsDialogOpen(false)
  }

  const handleDeleteAchievement = (id: string) => {
    if (!id) {
      console.error("Attempted to delete achievement with invalid ID")
      return
    }

    deleteAchievement(id)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const showExpandButton = achievements && achievements.length > 2
  const displayedAchievements = achievements && showExpandButton && !isExpanded
    ? achievements.slice(0, 2)
    : achievements

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
          <div>
            <CardTitle className="text-xl">Awards & Honors</CardTitle>
            <CardDescription>Loading achievement data...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 w-full animate-pulse">
            <div className="bg-muted-foreground/20 rounded w-1/4 h-8"></div>
            <div className="bg-muted-foreground/20 rounded w-full h-24"></div>
            <div className="bg-muted-foreground/20 rounded w-full h-24"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Awards & Honors</CardTitle>
          <CardDescription>Achievements and recognitions</CardDescription>
        </div>
        {isCurrentUser && (
          <Button size="sm" onClick={openAddDialog} className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" />
            Add Award
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {displayedAchievements.length > 0 ? (
          <div className="space-y-4">
            <div className="gap-4 grid grid-cols-1">
              {displayedAchievements.map((achievement) => (
                <Card key={achievement.id} className="bg-muted border border-muted-foreground/20 overflow-hidden">
                  <div className="flex sm:flex-row flex-col h-full">
                    <div className="flex justify-center items-center p-4 w-full sm:w-1/5">
                      {achievement.image_path ? (
                        <div className="relative size-24">
                          <LazyLoadImage
                            src={achievement.image_path || "/placeholder.svg"}
                            alt={achievement.title || "Award"}
                            className="rounded-lg object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative flex justify-center items-center bg-muted-foreground/50 rounded-lg size-24">
                          <Award className="size-16" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 w-full sm:w-4/5">
                      <div className="flex sm:flex-row flex-col justify-between gap-2">
                        <p className="font-medium break-words">{truncateText(achievement.title || "", 80)}</p>
                        {isCurrentUser && (
                          <div className="flex self-end sm:self-start gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(achievement.id)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAchievement(achievement.id)}>
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm break-words">
                        {truncateText(achievement.issuer || "", 30)} • {truncateText(achievement.award_date || "", 30)}
                      </p>
                      <p className="mt-2 text-sm break-words line-clamp-3">{achievement.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {showExpandButton && (
              <Button variant="outline" size="sm" className="w-full" onClick={toggleExpand}>
                {isExpanded ? (
                  <>
                    <ChevronUp className="mr-1 size-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 size-4" />
                    Show All ({achievements.length})
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="py-10 text-center">
            <Award className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <p className="text-muted-foreground">No awards or honors added yet</p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AchievementsForm
            //@ts-ignore
            initialValues={editingId ? achievements.find(achievement => achievement.id === editingId) || null : null}
            onSubmit={saveAchievement}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AchievementsSection