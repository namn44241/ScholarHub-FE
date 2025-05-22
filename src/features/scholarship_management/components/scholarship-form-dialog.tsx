import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { DIALOG_DESCRIPTIONS, DIALOG_TITLES, SUBMIT_BUTTON_TEXTS } from "../utils/constants"
import type { IScholarshipFormDialogProps } from "../utils/types"
import { SortableCriteria } from "./sortable-criteria"


export const ScholarshipFormDialog = ({
    isOpen,
    setIsOpen,
    form,
    formType,
    isSubmitting,
    isLoading,
    onSubmit,
    handleDelete,
}: IScholarshipFormDialogProps) => {
    const dialogTitle = DIALOG_TITLES[formType] || "Scholarship Form"
    const dialogDescription = DIALOG_DESCRIPTIONS[formType] || "Fill in the details below."
    const submitButtonText = SUBMIT_BUTTON_TEXTS[formType] || "Submit"
    const isReadOnly = formType === "read"

    const [criteriaItems, setCriteriaItems] = useState([
        "education_criteria",
        "personal_criteria",
        "experience_criteria",
        "research_criteria",
        "certification_criteria",
        "achievement_criteria",
    ])

    useEffect(() => {
        const currentWeights = form.getValues("weights")
        const hasValues = currentWeights && Object.values(currentWeights).some((val) => val !== "")

        if (!hasValues) {
            const initialWeights = {} as Record<string, string>
            criteriaItems.forEach((item, index) => {
                initialWeights[index.toString()] = item
            })
            form.setValue("weights", initialWeights as any)
        }
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = criteriaItems.indexOf(active.id)
            const newIndex = criteriaItems.indexOf(over.id)

            const newItems = [...criteriaItems]
            newItems.splice(oldIndex, 1)
            newItems.splice(newIndex, 0, active.id)

            setCriteriaItems(newItems)

            // Update the weights based on the new order
            const newWeights = {} as Record<string, string>
            newItems.forEach((item, index) => {
                newWeights[index.toString()] = item
            })
            form.setValue("weights", newWeights as any)
        }
    }

    if (formType === "delete") {
        return (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete scholarship</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this scholarship? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isSubmitting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center py-6">
                        <Loader2 className="size-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={isReadOnly ? (e) => e.preventDefault() : onSubmit} className="space-y-4">
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid grid-cols-2 w-full">
                                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                                    <TabsTrigger value="criteria">Criteria & Weights</TabsTrigger>
                                </TabsList>

                                {/* Basic Information Tab */}
                                <TabsContent value="basic" className="pt-4">
                                    <ScrollArea className="h-[60vh]">
                                        <div className="space-y-4 p-2">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title*</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Scholarship title" {...field} readOnly={isReadOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="provider"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Provider*</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Scholarship provider" {...field} readOnly={isReadOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="type"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Type</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Scholarship type" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="funding_level"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Funding Level</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Funding level" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="degree_level"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Degree Level</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Degree level" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="major"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Major</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Major" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="region"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Region</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Region" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="country"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Country</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Country" {...field} readOnly={isReadOnly} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="deadline"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Deadline</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground",
                                                                            )}
                                                                            disabled={isReadOnly}
                                                                        >
                                                                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                                            <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0 w-auto" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value ? new Date(field.value) : undefined}
                                                                        onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                                                                        disabled={isReadOnly}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Scholarship description"
                                                                className="min-h-[100px]"
                                                                {...field}
                                                                readOnly={isReadOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="original_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Original URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://example.com/scholarship" {...field} readOnly={isReadOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                {/* Criteria & Weights Tab */}
                                <TabsContent value="criteria" className="pt-4">
                                    <ScrollArea className="pr-4 h-[60vh]">
                                        <div className="space-y-6">
                                            {/* Weights with Drag and Drop - New Implementation */}
                                            <div>
                                                <FormLabel>Criteria Weights (Priority Order)</FormLabel>
                                                <FormDescription>Drag and drop to reorder criteria by importance</FormDescription>

                                                <div className="mt-2">
                                                    <DndContext
                                                        sensors={sensors}
                                                        collisionDetection={closestCenter}
                                                        onDragEnd={handleDragEnd}
                                                        modifiers={[restrictToVerticalAxis]}
                                                    >
                                                        <SortableContext items={criteriaItems} strategy={verticalListSortingStrategy}>
                                                            <SortableCriteria
                                                                id="education_criteria"
                                                                label="Education Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                            <SortableCriteria
                                                                id="personal_criteria"
                                                                label="Personal Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                            <SortableCriteria
                                                                id="experience_criteria"
                                                                label="Experience Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                            <SortableCriteria
                                                                id="research_criteria"
                                                                label="Research Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                            <SortableCriteria
                                                                id="certification_criteria"
                                                                label="Certification Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                            <SortableCriteria
                                                                id="achievement_criteria"
                                                                label="Achievement Criteria"
                                                                form={form}
                                                                isReadOnly={isReadOnly}
                                                            />
                                                        </SortableContext>
                                                    </DndContext>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter className="sm:flex-row flex-col-reverse gap-2 mt-6">
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    variant="outline"
                                    className={isReadOnly ? "w-full" : ""}
                                >
                                    {isReadOnly ? "Close" : "Cancel"}
                                </Button>
                                {!isReadOnly && (
                                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                        {isSubmitting ? (
                                            <>
                                                Submitting...
                                                <Loader2 className="size-4 animate-spin" />
                                            </>
                                        ) : (
                                            submitButtonText
                                        )}
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
