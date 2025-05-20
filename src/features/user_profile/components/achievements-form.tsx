import { DefaultDateInput } from "@/components/common/date-typer"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { convertToISODate, formatDateFromISO, validateDateFormat } from "@/utils/functions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Trash2, Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

export const achievementSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  description: z.string().optional(),
  issuer: z.string().min(1, "Issuer is required"),
  award_date: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  image_path: z.string().optional(),
})

export type AchievementsFormValues = z.infer<typeof achievementSchema>

export interface IAchievement {
  id: string
  title: string
  description?: string
  issuer: string
  award_date?: string
  image_path?: string
}

interface AchievementsFormProps {
  initialValues?: IAchievement
  onSubmit: (values: AchievementsFormValues) => void
  onCancel: () => void
}

const AchievementsForm = ({ initialValues, onSubmit, onCancel }: AchievementsFormProps) => {
  const [achievementFiles, setAchievementFiles] = useState<File[] | undefined>(undefined)

  const form = useForm<AchievementsFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: initialValues
      ? {
        title: initialValues.title || "",
        description: initialValues.description || "",
        issuer: initialValues.issuer || "",
        award_date: initialValues.award_date ? formatDateFromISO(initialValues.award_date) : undefined,
        image_path: initialValues.image_path || "",
      }
      : {
        title: "",
        description: "",
        issuer: "",
        award_date: undefined,
        image_path: "",
      },
  })

  const isEditing = !!initialValues?.id

  const handleFileChange = useCallback(
    (files: File[]) => {
      setAchievementFiles(files)
      if (files.length > 0) {
        const file = files[0]
        form.setValue("image_path", URL.createObjectURL(file))
      } else {
        form.setValue("image_path", "")
      }
    },
    [form],
  )

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    })
  }, [])

  const handleSubmit = (data: AchievementsFormValues) => {
    // Convert DD/MM/YYYY dates to ISO format before submitting
    const formattedData = {
      ...data,
      award_date: data.award_date ? convertToISODate(data.award_date)?.toString() : undefined,
    }

    onSubmit(formattedData as AchievementsFormValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Award" : "Add Award"}</DialogTitle>
          <DialogDescription>Enter the details of your award or honor</DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
          <div className="space-y-4 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="award_date"
              render={() => (
                <DefaultDateInput
                  control={form.control}
                  name="award_date"
                  label="Date Received"
                  placeholder="DD/MM/YYYY"
                  required={false}
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_path"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      accept="image/*"
                      maxSize={1024 * 1024 * 10}
                      maxFiles={1}
                      value={achievementFiles || []}
                      onValueChange={handleFileChange}
                      onFileReject={onFileReject}
                      className="w-full"
                    >
                      <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="flex justify-center items-center p-2.5 border rounded-full">
                            <Upload className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">Drag & drop image here</p>
                          <p className="text-muted-foreground text-xs">PNG, JPG, JPEG, or GIF (max 10MB)</p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Browse files
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {(achievementFiles || []).map((file, index) => (
                          <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button variant="ghost" size="icon" className="size-7">
                                <Trash2 className="size-4" />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="flex sm:flex-row flex-col gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default AchievementsForm