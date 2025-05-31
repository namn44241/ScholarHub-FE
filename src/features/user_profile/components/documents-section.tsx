import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, FileText, PackageOpen, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type { IDocumentsSectionProps } from "../utils/types"
import DocumentForm from "./deocuments-form"
import type { DocumentFormValues } from "../hooks/use-document"

const DocumentsSection = ({ documents, isCurrentUser }: IDocumentsSectionProps) => {
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)

  const handleOpenNewDocumentDialog = () => {
    setIsDocumentDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDocumentDialogOpen(false)
  }

  const saveDocument = (values: DocumentFormValues) => {
    const newDocuments = documents
      ? JSON.parse(JSON.stringify(documents))
      : {
        items: [],
      }

    if (!newDocuments.items) {
      newDocuments.items = []
    }

    newDocuments.items.push(values)
    handleCloseDialog()
  }

  const deleteDocument = (index: number) => {
    const newDocuments = JSON.parse(JSON.stringify(documents))
    newDocuments.items.splice(index, 1)
  }


  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Documents</CardTitle>
          <CardDescription>Upload and manage your documents</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">All Documents</p>
          {isCurrentUser && (
            <Button
              onClick={handleOpenNewDocumentDialog}
              size="sm"
            >
              <Plus className="size-4" />
              Add Document
            </Button>
          )}
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document, index) => (
              <Card key={index} className="bg-muted border border-muted-foreground/20 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 border rounded-lg">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="max-w-[150px] sm:max-w-[200px] font-medium truncate">
                          {document.file_name || document?.file_path?.split("/").pop() || `Document ${index + 1}`}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : "No upload date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isCurrentUser && (
                        <>
                          <Button variant="destructive" size="icon" onClick={() => deleteDocument(index)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="icon">
                        <a
                          href={document.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Eye className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted py-6 border border-muted-foreground/20 rounded-lg text-center">
            <PackageOpen className="mx-auto mb-4 size-6" />
            <p className="mb-4 text-muted-foreground">
              {isCurrentUser
                ? "No documents added yet. Upload documents to enhance your profile."
                : "This user has not added any documents yet."}
            </p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Upload your document</DialogDescription>
          </DialogHeader>

          <DocumentForm
            onSubmit={saveDocument}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DocumentsSection