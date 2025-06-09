import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDocumentForm } from "../hooks/use-document";
import type { IDocument } from "../utils/types";

export interface IDocumentFormProps {
  onSubmit: (values: IDocument) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const DocumentForm = ({ onSubmit, isLoading, onCancel }: IDocumentFormProps) => {
  const {
    form,
    documentFiles,
    handleDocumentFileChange,
    resetForm,
    submitForm,
  } = useDocumentForm(
    //@ts-ignore
    onSubmit,
    onCancel
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="file_path"
          render={() => (
            <FormItem>
              <FileUpload
                accept=".pdf,.docx"
                maxSize={1024 * 1024 * 10}
                maxFiles={1}
                value={documentFiles || []}
                onValueChange={handleDocumentFileChange}
                onFileReject={onFileReject}
                className="w-full"
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex justify-center items-center p-2.5 border rounded-full">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">
                      Drag & drop files here
                    </p>
                    <p className="text-muted-foreground text-xs">
                      PDF or DOCX (max 10MB)
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {(documentFiles || []).map((file, index) => (
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
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button variant="outline" onClick={resetForm} type="button" size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DocumentForm;
