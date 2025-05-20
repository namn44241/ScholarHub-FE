import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { truncateText } from "@/utils/functions"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, FileText, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { IPublication, IPublicationsSectionProps, } from "../utils/types"
import { PUBLICATION_TYPE } from "../utils/constants"

const publicationFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Publication title is required"),
  type: z.enum(["journal", "conference", "other"]),
  venue_name: z.string().min(1, "Venue name is required"),
  publication_date: z.date().optional(),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
})

type PublicationFormValues = z.infer<typeof publicationFormSchema>

const PublicationsSection = ({ publications = [], isCurrentUser }: IPublicationsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState<Record<PUBLICATION_TYPE, boolean>>({
    journal: false,
    conference: false,
    other: false,
  })

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      id: "",
      title: "",
      type: "journal",
      venue_name: "",
      publication_date: undefined,
      url: "",
    },
  })

  const openAddDialog = (type: PUBLICATION_TYPE  = PUBLICATION_TYPE.JOURNAL) => {
    form.reset({
      id: crypto.randomUUID(),
      title: "",
      type,
      venue_name: "",
      publication_date: undefined,
      url: "",
    })
    setEditingIndex(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (index: number) => {
    if (publications && publications[index]) {
      const publication = publications[index]
      form.reset({
        id: publication.id,
        title: publication.title || "",
        type: publication.type,
        venue_name: publication.venue_name || "",
        publication_date: publication.publication_date ? new Date(publication.publication_date) : undefined,
        url: publication.url || "",
      })
      setEditingIndex(index)
      setIsDialogOpen(true)
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingIndex(null)
    form.reset()
  }

  const onSubmit = (data: PublicationFormValues) => {
    const newPublications: IPublication[] = [...publications]
    const formattedPublication: IPublication = {
      id: data.id || crypto.randomUUID(),
      title: data.title,
      type: data.type,
      venue_name: data.venue_name,
      publication_date: data.publication_date ? format(data.publication_date, "MMMM yyyy") : undefined,
      url: data.url,
    }

    if (editingIndex !== null) {
      newPublications[editingIndex] = formattedPublication
    } else {
      newPublications.push(formattedPublication)
    }

    closeDialog()
  }

  const deletePublication = (index: number) => {
    const newPublications = [...publications]
    newPublications.splice(index, 1)

  }

  const toggleShowAll = (type: PUBLICATION_TYPE) => {
    setShowAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const getTypeLabel = (type: PUBLICATION_TYPE): string => {
    switch (type) {
      case "journal":
        return "Journal Articles"
      case "conference":
        return "Conference Papers"
      case "other":
        return "Other Publications"
      default:
        return "Publications"
    }
  }

  const getPublicationsByType = (type: PUBLICATION_TYPE): IPublication[] => {
    return publications.filter(pub => pub.type === type)
  }

  const renderPublicationCard = (pub: IPublication, index: number) => (
    <Card key={pub.id} className="bg-muted border border-muted-foreground/20 overflow-hidden">
      <CardContent className=" ">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
          <div className="space-y-1 w-full">
            <div className="flex items-center">
              <p className="font-medium break-words">{truncateText(pub.title || "", 40)}</p>
            </div>
            {pub.venue_name && (
              <p className="text-muted-foreground text-sm break-words">{truncateText(pub.venue_name, 40)}</p>
            )}
            {pub.publication_date && (
              <p className="text-muted-foreground text-sm">{pub.publication_date}</p>
            )}
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-primary text-sm hover:underline"
              >
                View publication
              </a>
            )}
          </div>
          {isCurrentUser && (
            <div className="flex self-end sm:self-start gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(index)}>
                <Pencil className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deletePublication(index)}>
                <Trash2 className="size-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderTypeSection = (type: PUBLICATION_TYPE) => {
    const typeItems = getPublicationsByType(type)
    if (typeItems.length === 0) return null

    const isShowingAll = showAll[type]
    const displayItems = isShowingAll ? typeItems : typeItems.slice(0, 2)
    const hasMore = typeItems.length > 2

    return (
      <div className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
          <p className="font-medium text-lg">{getTypeLabel(type)}</p> 
        </div>

        <div className="gap-4 grid grid-cols-1">
          {displayItems.map((pub) => renderPublicationCard(pub, publications.indexOf(pub)))}
        </div>

        {hasMore && (
          <Button variant="ghost" className="mt-2 w-full" onClick={() => toggleShowAll(type)}>
            {isShowingAll ? (
              <>
                <ChevronUp className="mr-1 size-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 size-4" />
                Show All ({typeItems.length})
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  const hasPublications = publications.length > 0

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Publications</CardTitle>
          <CardDescription>Your journal articles, conference papers, and other publications</CardDescription>
        </div>
        {isCurrentUser && (
          <Button onClick={() => openAddDialog()} className="w-full sm:w-auto">
            <Plus className="mr-1 size-4" />
            Add Publication
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Journals */}
        {renderTypeSection(PUBLICATION_TYPE.JOURNAL)}

        {/* Conferences */}
        {renderTypeSection(PUBLICATION_TYPE.CONFERENCE)}

        {/* Other Publications */}
        {renderTypeSection(PUBLICATION_TYPE.OTHER)}

        {/* Empty state */}
        {!hasPublications && (
          <div className="py-10 text-center">
            <FileText className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">No publications added yet</p>
          </div>
        )}
      </CardContent>

      {/* Publication Dialog with Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Publication" : "Add Publication"}</DialogTitle>
            <DialogDescription>Enter the details of your publication</DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="journal">Journal Article</SelectItem>
                          <SelectItem value="conference">Conference Paper</SelectItem>
                          <SelectItem value="other">Other Publication</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter publication title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venue_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("type") === "journal"
                          ? "Journal Name"
                          : form.watch("type") === "conference"
                            ? "Conference Name"
                            : "Publication Venue"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            form.watch("type") === "journal"
                              ? "e.g. Journal of Computer Science"
                              : form.watch("type") === "conference"
                                ? "e.g. ACM SIGCHI Conference"
                                : "e.g. Technical Report"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publication_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {field.value ? format(field.value, "MMMM yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/publication" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={closeDialog} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 size-4" />
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PublicationsSection