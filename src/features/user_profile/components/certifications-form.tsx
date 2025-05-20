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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertToISODate, formatDateFromISO, validateDateFormat } from "@/utils/functions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Trash2, Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { CERTIFICATION_TYPE } from "../utils/constants"

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification title is required"),
  type: z.nativeEnum(CERTIFICATION_TYPE),
  provider: z.string().min(1, "Issuing organization is required"),
  certification_date: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  expiry_date: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  image_path: z.string().optional(),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

export type CertificationFormValues = z.infer<typeof certificationSchema>

export interface ICertification {
  id: string;
  name?: string;
  type: CERTIFICATION_TYPE;
  provider?: string;
  certification_date?: string;
  expiry_date?: string;
  image_path?: string;
  url?: string;
}

interface CertificationFormProps {
  initialValues?: ICertification | null
  onSubmit: (values: CertificationFormValues) => void
  onCancel: () => void
}

const CertificationForm = ({ initialValues, onSubmit, onCancel }: CertificationFormProps) => {
  const [certificationFiles, setCertificationFiles] = useState<File[] | undefined>(undefined)

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name || "",
          type: initialValues.type || CERTIFICATION_TYPE.OTHER,
          provider: initialValues.provider || "",
          certification_date: initialValues.certification_date ? formatDateFromISO(initialValues.certification_date) : undefined,
          expiry_date: initialValues.expiry_date ? formatDateFromISO(initialValues.expiry_date) : undefined,
          image_path: initialValues.image_path || "",
          url: initialValues.url || "",
        }
      : {
          name: "",
          type: CERTIFICATION_TYPE.LANGUAGE,
          provider: "",
          certification_date: undefined,
          expiry_date: undefined,
          image_path: "",
          url: "",
        },
  })

  const isEditing = !!initialValues?.id

  const handleFileChange = useCallback(
    (files: File[]) => {
      setCertificationFiles(files)
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

  const handleSubmit = (data: CertificationFormValues) => {
    // Convert DD/MM/YYYY dates to ISO format before submitting
    const formattedData = {
      ...data,
      certification_date: data.certification_date ? convertToISODate(data.certification_date)?.toString() : undefined,
      expiry_date: data.expiry_date ? convertToISODate(data.expiry_date)?.toString() : undefined,
    }

    onSubmit(formattedData as CertificationFormValues)
  }

  const getPlaceholderByType = (type: string) => {
    switch (type) {
      case CERTIFICATION_TYPE.LANGUAGE:
        return "e.g. IELTS Academic"
      case CERTIFICATION_TYPE.STANDARDIZED_TEST:
        return "e.g. SAT Score Report"
      default:
        return "e.g. AWS Certified Solutions Architect"
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Certification" : "Add Certification"}</DialogTitle>
          <DialogDescription>Enter the details of your certification</DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
          <div className="space-y-4 p-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CERTIFICATION_TYPE.LANGUAGE}>Language Certification</SelectItem>
                      <SelectItem value={CERTIFICATION_TYPE.STANDARDIZED_TEST}>Standardized Test</SelectItem>
                      <SelectItem value={CERTIFICATION_TYPE.OTHER}>Other Certification</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name</FormLabel>
                  <FormControl>
                    <Input placeholder={getPlaceholderByType(form.watch("type"))} {...field} />
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
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Amazon Web Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certification_date"
              render={() => (
                <DefaultDateInput
                  control={form.control}
                  name="certification_date"
                  label="Date Issued"
                  placeholder="DD/MM/YYYY"
                  required={false}
                />
              )}
            />

            <FormField
              control={form.control}
              name="expiry_date"
              render={() => (
                <DefaultDateInput
                  control={form.control}
                  name="expiry_date"
                  label="Expiration Date (optional)"
                  placeholder="DD/MM/YYYY"
                  required={false}
                />
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                      value={certificationFiles || []}
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
                        {(certificationFiles || []).map((file, index) => (
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

export default CertificationForm