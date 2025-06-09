import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { useView } from "../../contexts/view-context";

export function ViewToggle({
    className,
}: {
    className?: string;
}) {
    const { view, setView } = useView();

    return (
        <Select value={view} onValueChange={(value) => setView(value as "grid" | "list")}>
            <SelectTrigger
                className={cn(
                    "bg-background border-muted-foreground/20",
                    className
                )}
            >
                <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="list">
                    <div className="flex items-center gap-2">
                        <List className="size-4" strokeWidth={1.5} />
                        <span>View By List</span>
                    </div>
                </SelectItem>
                <SelectItem value="grid">
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="size-4" strokeWidth={1.5} />
                        <span>View By Grid</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}