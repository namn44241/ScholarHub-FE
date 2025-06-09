import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateText } from "@/utils/functions";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  useDeletePublication,
  useGetPublication,
  usePostPublication,
  usePutPublication,
} from "../hooks/use-publication";
import { PUBLICATION_TYPE } from "../utils/constants";
import type { IPublication, IPublicationsSectionProps } from "../utils/types";
import type { PublicationFormValues } from "./publications-form";
import PublicationForm from "./publications-form";

const PublicationsSection = ({ isCurrentUser }: IPublicationsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<Record<PUBLICATION_TYPE, boolean>>({
    journal: false,
    conference: false,
    other: false,
  });

  const { data: publicationsData = [], isLoading } = useGetPublication();
  const { mutate: createPublication, isPending: isCreating } =
    usePostPublication();
  const { mutate: updatePublication, isPending: isUpdating } =
    usePutPublication();
  const { mutate: deletePublication, isPending: isDeleting } =
    useDeletePublication();

  const isDataArray = Array.isArray(publicationsData);
  const publications = isDataArray ? publicationsData : [publicationsData];

  const openAddDialog = () => {
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id: string) => {
    if (!id) {
      console.error("Attempted to edit publication with invalid ID");
      return;
    }

    setEditingId(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const savePublication = (values: PublicationFormValues) => {
    if (editingId) {
      // Update existing publication
      const updatedPublication = {
        id: editingId,
        ...values,
      };

      updatePublication(updatedPublication as IPublication);
    } else {
      // Create new publication
      const newPublication = {
        ...values,
      };

      createPublication(newPublication);
    }

    setIsDialogOpen(false);
  };

  const handleDeletePublication = (id: string) => {
    if (!id) {
      console.error("Attempted to delete publication with invalid ID");
      return;
    }

    deletePublication(id);
  };

  const toggleShowAll = (type: PUBLICATION_TYPE) => {
    setShowAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getTypeLabel = (type: PUBLICATION_TYPE): string => {
    switch (type) {
      case "journal":
        return "Journal Articles";
      case "conference":
        return "Conference Papers";
      case "other":
        return "Other Publications";
      default:
        return "Publications";
    }
  };

  const getPublicationsByType = (type: PUBLICATION_TYPE): IPublication[] => {
    return publications.filter((pub) => pub.type === type);
  };

  const renderPublicationCard = (pub: IPublication) => (
    <Card
      key={pub.id}
      className="bg-muted border border-muted-foreground/20 overflow-hidden"
    >
      <CardContent className="p-4">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
          <div className="space-y-1 w-full">
            <div className="flex items-center">
              <p className="font-medium break-words">
                {truncateText(pub.title || "", 40)}
              </p>
            </div>
            {pub.venue_name && (
              <p className="text-muted-foreground text-sm break-words">
                {truncateText(pub.venue_name, 40)}
              </p>
            )}
            {pub.publication_date && (
              <p className="text-muted-foreground text-sm">
                {pub.publication_date}
              </p>
            )}
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-primary text-sm hover:underline"
              >
                View publication
              </a>
            )}
          </div>
          {isCurrentUser && (
            <div className="flex self-end sm:self-start gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(pub.id)}
              >
                <Pencil className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePublication(pub.id)}
              >
                <Trash2 className="size-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTypeSection = (type: PUBLICATION_TYPE) => {
    const typeItems = getPublicationsByType(type);
    if (typeItems.length === 0) return null;

    const isShowingAll = showAll[type];
    const displayItems = isShowingAll ? typeItems : typeItems.slice(0, 2);
    const hasMore = typeItems.length > 2;

    return (
      <div className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
          <p className="font-medium text-lg">{getTypeLabel(type)}</p>
        </div>

        <div className="gap-4 grid grid-cols-1">
          {displayItems.map((pub) => renderPublicationCard(pub))}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => toggleShowAll(type)}
          >
            {isShowingAll ? (
              <>
                <ChevronUp className="size-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Show All ({typeItems.length})
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <PublicationsSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Publications</CardTitle>
          <CardDescription>
            Your journal articles, conference papers, and other publications
          </CardDescription>
        </div>
        {isCurrentUser && (
          <Button onClick={() => openAddDialog()} className="w-full sm:w-auto" size="sm">
            <Plus className="size-4" />
            Add Publication
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Journals */}
        {renderTypeSection(PUBLICATION_TYPE.JOURNAL)}

        {/* Conferences */}
        {renderTypeSection(PUBLICATION_TYPE.CONFERENCE)}

        {/* Other Publications */}
        {renderTypeSection(PUBLICATION_TYPE.OTHER)}

        {/* Empty state */}
        {publications.length === 0 && (
          <div className="flex flex-col justify-center items-center bg-muted py-6 border border-muted-foreground/20 rounded-lg text-cente">
            <FileText className="mx-auto mb-4 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">No publications added yet</p>
          </div>
        )}
      </CardContent>

      {/* Publication Dialog with Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <PublicationForm
            initialValues={
              editingId
                ? publications.find((pub) => pub.id === editingId) || null
                : null
            }
            isLoading={isCreating || isUpdating || isDeleting}
            onSubmit={savePublication}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const PublicationsSkeleton = ({
  isCurrentUser,
}: {
  isCurrentUser: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="space-y-2">
          <CardTitle className="text-xl">Publications</CardTitle>
          <CardDescription>
            Your journal articles, conference papers, and other publications
          </CardDescription>
        </div>
        {isCurrentUser && <Skeleton className="w-full sm:w-auto h-10" />}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Type section skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-48 h-7" />
          <div className="gap-4 grid grid-cols-1">
            <Card className="bg-muted border border-muted-foreground/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                  <div className="space-y-3 w-full">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                  {isCurrentUser && (
                    <div className="flex self-end sm:self-start gap-1">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted border border-muted-foreground/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                  <div className="space-y-3 w-full">
                    <Skeleton className="w-2/3 h-5" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-28 h-4" />
                  </div>
                  {isCurrentUser && (
                    <div className="flex self-end sm:self-start gap-1">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Another type section skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-44 h-7" />
          <div className="gap-4 grid grid-cols-1">
            <Card className="bg-muted border border-muted-foreground/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                  <div className="space-y-3 w-full">
                    <Skeleton className="w-4/5 h-5" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-36 h-4" />
                  </div>
                  {isCurrentUser && (
                    <div className="flex self-end sm:self-start gap-1">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationsSection;
