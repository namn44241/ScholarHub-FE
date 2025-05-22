import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

export const SortableCriteria = ({
    id,
    label,
    form,
    isReadOnly,
}: {
    id: string
    label: string
    form: any
    isReadOnly: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card>
                <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div {...attributes} {...listeners} className="cursor-grab">
                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <FormLabel className="m-0 font-medium text-sm">{label}</FormLabel>
                    </div>
                    <FormField
                        control={form.control}
                        name={id}
                        render={({ field }) => (
                            <FormItem className="space-y-1 m-0">
                                <FormControl>
                                    <Textarea
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                        className="bg-background min-h-[80px] resize-none"
                                        {...field}
                                        readOnly={isReadOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    )
}