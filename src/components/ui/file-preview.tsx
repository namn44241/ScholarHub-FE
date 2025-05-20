import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { FileIcon, X } from "lucide-react"

interface FilePreviewProps {
  file: File
  onRemove?: () => void
}

export const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  (props, ref) => {
    if (props.file.type.startsWith("image/")) {
      return <ImageFilePreview {...props} ref={ref} />
    }

    if (
      props.file.type.startsWith("text/") ||
      props.file.name.endsWith(".txt") ||
      props.file.name.endsWith(".md")
    ) {
      return <TextFilePreview {...props} ref={ref} />
    }

    return <GenericFilePreview {...props} ref={ref} />
  }
)
FilePreview.displayName = "FilePreview"

const ImageFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative flex p-1.5 pr-2 border rounded-md max-w-[200px] text-xs"
        layout
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
      >
        <div className="flex items-center space-x-2 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`Attachment ${file.name}`}
            className="place-items-center grid bg-muted border rounded-sm w-10 h-10 object-cover shrink-0"
            src={URL.createObjectURL(file)}
          />
          <span className="w-full text-muted-foreground truncate">
            {file.name}
          </span>
        </div>

        {onRemove ? (
          <button
            className="-top-2 -right-2 absolute flex justify-center items-center bg-background border rounded-full w-4 h-4"
            type="button"
            onClick={onRemove}
            aria-label="Remove attachment"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        ) : null}
      </motion.div>
    )
  }
)
ImageFilePreview.displayName = "ImageFilePreview"

const TextFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    const [preview, setPreview] = React.useState<string>("")

    useEffect(() => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setPreview(text.slice(0, 50) + (text.length > 50 ? "..." : ""))
      }
      reader.readAsText(file)
    }, [file])

    return (
      <motion.div
        ref={ref}
        className="relative flex p-1.5 pr-2 border rounded-md max-w-[200px] text-xs"
        layout
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
      >
        <div className="flex items-center space-x-2 w-full">
          <div className="place-items-center grid bg-muted p-0.5 border rounded-sm w-10 h-10 shrink-0">
            <div className="w-full h-full overflow-hidden text-[6px] text-muted-foreground leading-none">
              {preview || "Loading..."}
            </div>
          </div>
          <span className="w-full text-muted-foreground truncate">
            {file.name}
          </span>
        </div>

        {onRemove ? (
          <button
            className="-top-2 -right-2 absolute flex justify-center items-center bg-background border rounded-full w-4 h-4"
            type="button"
            onClick={onRemove}
            aria-label="Remove attachment"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        ) : null}
      </motion.div>
    )
  }
)
TextFilePreview.displayName = "TextFilePreview"

const GenericFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative flex p-1.5 pr-2 border rounded-md max-w-[200px] text-xs"
        layout
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
      >
        <div className="flex items-center space-x-2 w-full">
          <div className="place-items-center grid bg-muted border rounded-sm w-10 h-10 shrink-0">
            <FileIcon className="w-6 h-6 text-foreground" />
          </div>
          <span className="w-full text-muted-foreground truncate">
            {file.name}
          </span>
        </div>

        {onRemove ? (
          <button
            className="-top-2 -right-2 absolute flex justify-center items-center bg-background border rounded-full w-4 h-4"
            type="button"
            onClick={onRemove}
            aria-label="Remove attachment"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        ) : null}
      </motion.div>
    )
  }
)
GenericFilePreview.displayName = "GenericFilePreview"
