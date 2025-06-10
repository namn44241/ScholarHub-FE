import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = ({ content, className }: MarkdownPreviewProps) => {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mt-2 mb-1">{children}</h3>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code className="text-sm font-mono">{children}</code>
              </pre>
            )
          ),
          hr: () => <hr className="my-4 border-muted-foreground/20" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 