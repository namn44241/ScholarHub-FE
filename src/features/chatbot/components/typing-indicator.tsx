import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="group flex items-start gap-3">
      <Avatar className="border-2 border-primary/20 w-8 h-8">
        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%] sm:max-w-[70%]">
        <div className="bg-muted/50 shadow-sm px-4 py-3 border rounded-2xl rounded-tl-md">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="bg-muted-foreground/40 rounded-full w-2 h-2 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="bg-muted-foreground/40 rounded-full w-2 h-2 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="bg-muted-foreground/40 rounded-full w-2 h-2 animate-bounce"></div>
            </div>
            <span className="ml-2 text-muted-foreground text-sm">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
