import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const documentSchema = z.object({
  id: z.string(),
  type: z.enum(["resume", "cover_letter", "other"]),
  file_name: z.string().optional(),
  file_path: z.string().url("Invalid file URL").optional(),
  uploaded_at: z.string().optional(),
})

export type DocumentFormValues = z.infer<typeof documentSchema>

export function useDocumentForm(
  onSubmit: (values: DocumentFormValues) => void,
  onCancel: () => void,
  initialValues?: DocumentFormValues
) {
  const [documentFiles, setDocumentFiles] = useState<File[]>()

  const form = useForm<DocumentFormValues>({
    defaultValues: initialValues || {
      id: crypto.randomUUID(),
      type: "resume",
      file_name: "",
      file_path: "",
      uploaded_at: new Date().toISOString(),
    },
  })

  const handleDocumentFileChange = (files: File[]) => {
    setDocumentFiles(files)
    if (files.length > 0) {
      const file = files[0]
      form.setValue("file_path", URL.createObjectURL(file))
      form.setValue("uploaded_at", new Date().toISOString())
      form.setValue("file_name", file.name)
    }
  }

  const resetForm = () => {
    form.reset({
      id: crypto.randomUUID(),
      type: "resume",
      file_name: "",
      file_path: "",
      uploaded_at: new Date().toISOString(),
    })
    setDocumentFiles(undefined)
    onCancel()
  }

  const submitForm = (values: DocumentFormValues) => {
    onSubmit(values)
    resetForm()
  }

  return {
    form,
    documentFiles,
    handleDocumentFileChange,
    resetForm,
    submitForm
  }
}