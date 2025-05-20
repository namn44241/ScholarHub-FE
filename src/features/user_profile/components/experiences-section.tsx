
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { truncateText } from "@/utils/functions"
import { Briefcase, ChevronDown, ChevronUp, FlaskRoundIcon, Heart, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from "react"
import { useDeleteExperience, useGetExperience, usePostExperience, usePutExperience } from "../hooks/useExperience"
import { EXPERIENCE_TYPE } from "../utils/constants"
import { formatDate } from "../utils/functions"
import type { IExperience, IExperiencesSectionProps } from "../utils/types"
import ExperienceForm, { type ExperienceFormValues } from "./experiences-form"

const ExperienceSection = ({ isCurrentUser }: IExperiencesSectionProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const { data: experienceInfo = [], isLoading } = useGetExperience()
    const { mutate: createExperience } = usePostExperience()
    const { mutate: updateExperience } = usePutExperience()
    const { mutate: deleteExperience } = useDeleteExperience()

    const isDataArray = Array.isArray(experienceInfo)

    const [expandedSections, setExpandedSections] = useState<Record<EXPERIENCE_TYPE, boolean>>({
        work: false,
        volunteer: false,
        research: false,
        other: false,
    })

    const openAddDialog = () => {
        setEditingId(null)
        setIsDialogOpen(true)
    }

    const saveExperience = (values: ExperienceFormValues) => {
        if (editingId) {
            // Update existing experience
            const updatedExperience = {
                id: editingId,
                ...values
            }

            updateExperience(updatedExperience)
        } else {
            // Create new experience
            createExperience(values)
        }

        setIsDialogOpen(false)
    }

    const handleDeleteExperience = (id: string) => {
        if (!id) {
            console.error("Attempted to delete experience with invalid ID")
            return
        }

        // Delete from API
        deleteExperience(id)
    }

    const editExperience = (id: string) => {
        if (!id) {
            console.error("Attempted to edit experience with invalid ID")
            return
        }

        const experience = isDataArray ? experienceInfo.find(exp => exp.id === id) : experienceInfo
        if (experience) {
            setEditingId(id)
            setIsDialogOpen(true)
        }
    }

    const toggleExpand = (type: EXPERIENCE_TYPE) => {
        setExpandedSections((prev) => ({
            ...prev,
            [type]: !prev[type],
        }))
    }

    const getExperiencesByType = (type: EXPERIENCE_TYPE) => {
        return isDataArray ? experienceInfo.filter((exp: IExperience) => exp.type === type) : experienceInfo
    }

    const renderExperienceList = (type: EXPERIENCE_TYPE) => {
        const experiencesByType = getExperiencesByType(type)
        const isDataArray = Array.isArray(experiencesByType)
        const showExpandButton = isDataArray && experiencesByType.length > 2
        const displayedExperiences = expandedSections[type] || !showExpandButton
            ? experiencesByType
            : experiencesByType.slice(0, 2)

        const typeLabels: Record<EXPERIENCE_TYPE, string> = {
            work: "Work",
            research: "Research",
            volunteer: "Volunteer",
            other: "Other"
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    {getExperienceIcon(type)}
                    <p className="font-medium text-lg">{typeLabels[type]} Experience</p>
                </div>

                {isDataArray && experiencesByType.length > 0 ? (
                    <div className="space-y-4">
                        {Array.isArray(displayedExperiences) && displayedExperiences.map((exp: IExperience) => (
                            <Card key={exp.id} className="bg-muted border border-muted-foreground/20 overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                                        <div className="w-full">
                                            <p className="font-medium text-lg break-words">{truncateText(exp.title || "", 50)}</p>
                                            <p className="text-muted-foreground break-words">
                                                {truncateText(exp.organization || "", 30)} • {truncateText(exp.location || "", 30)}
                                            </p>
                                            <p className="text-muted-foreground/70 text-sm">
                                                {formatDate(exp.start_date || "")} - {exp.is_ongoing ? "Present" : formatDate(exp.end_date || "")}
                                            </p>
                                            <p className="mt-2 break-words line-clamp-3 sm:line-clamp-2 whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                        {isCurrentUser && (
                                            <div className="flex self-end sm:self-start gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => editExperience(exp.id)}>
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(exp.id)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {showExpandButton && (
                            <Button variant="outline" size="sm" className="w-full" onClick={() => toggleExpand(type)}>
                                {expandedSections[type] ? (
                                    <>
                                        <ChevronUp className="mr-2 size-4" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="mr-2 size-4" />
                                        Show All ({experiencesByType.length})
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center bg-muted py-6 border border-muted-foreground/20 rounded-lg text-center">
                        {getExperienceIcon(type)}
                        <p className="mt-4 text-muted-foreground">No {type} experience added yet</p>
                    </div>
                )}
            </div>
        )
    }

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <Card className="border-muted-foreground/20">
                <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-xl">Experience</CardTitle>
                    <CardDescription>Loading experience data...</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-12">
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
        <Card className="border-muted-foreground/20">
            <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
                <div>
                    <CardTitle className="text-xl">Experience</CardTitle>
                    <CardDescription>Your professional, volunteer, research, and other experience</CardDescription>
                </div>
                {isCurrentUser && (
                    <Button onClick={openAddDialog}>
                        <Plus className="mr-2 size-4" />
                        Add Experience
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
                {renderExperienceList(EXPERIENCE_TYPE.WORK)}
                {renderExperienceList(EXPERIENCE_TYPE.RESEARCH)}
                {renderExperienceList(EXPERIENCE_TYPE.VOLUNTEER)}
                {renderExperienceList(EXPERIENCE_TYPE.OTHER)}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
                    <ExperienceForm
                        //@ts-ignore
                        initialValues={editingId ? Array.isArray(experienceInfo) ? experienceInfo.find(exp => exp.id === editingId) : experienceInfo : null}
                        onSubmit={saveExperience}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default ExperienceSection

export const getExperienceIcon = (type: EXPERIENCE_TYPE) => {
    switch (type) {
        case EXPERIENCE_TYPE.WORK:
            return <Briefcase className="size-6" />
        case EXPERIENCE_TYPE.VOLUNTEER:
            return <Heart className="size-6" />
        case EXPERIENCE_TYPE.RESEARCH:
            return <FlaskRoundIcon className="size-6" />
        default:
            return <Briefcase className="size-6" />
    }
}