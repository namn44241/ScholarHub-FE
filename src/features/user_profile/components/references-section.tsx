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
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  useDeleteReference,
  useGetReference,
  usePostReference,
  usePutReference,
} from "../hooks/use-reference";
import { REFERENCE_TYPE } from "../utils/constants";
import type { IReference, IReferencesSectionProps } from "../utils/types";
import type { ReferenceFormValues } from "./references-form";
import ReferenceForm from "./references-form";

const ReferencesSection = ({ isCurrentUser }: IReferencesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<Record<REFERENCE_TYPE, boolean>>({
    academic: false,
    professional: false,
    other: false,
  });

  const { data: referencesData = [], isLoading } = useGetReference();
  const { mutate: createReference, isPending: isCreating } = usePostReference();
  const { mutate: updateReference, isPending: isUpdating } = usePutReference();
  const { mutate: deleteReference, isPending: isDeleting } =
    useDeleteReference();

  const isDataArray = Array.isArray(referencesData);
  const references = isDataArray ? referencesData : [referencesData];

  const openAddDialog = () => {
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id: string) => {
    if (!id) {
      console.error("Attempted to edit reference with invalid ID");
      return;
    }

    setEditingId(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const saveReference = (values: ReferenceFormValues) => {
    if (editingId) {
      // Update existing reference
      const updatedReference = {
        id: editingId,
        ...values,
      };

      updateReference(updatedReference as IReference);
    } else {
      // Create new reference
      const newReference = {
        ...values,
      };

      createReference(newReference);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteReference = (id: string) => {
    if (!id) {
      console.error("Attempted to delete reference with invalid ID");
      return;
    }

    deleteReference(id);
  };

  const toggleShowAll = (type: REFERENCE_TYPE) => {
    setShowAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getTypeLabel = (type: REFERENCE_TYPE): string => {
    switch (type) {
      case "academic":
        return "Academic";
      case "professional":
        return "Professional";
      case "other":
        return "Other";
      default:
        return "References";
    }
  };

  const getReferencesByType = (type: REFERENCE_TYPE): IReference[] => {
    return references.filter((ref) => ref.type === type);
  };

  const renderReferenceCard = (ref: IReference) => (
    <Card
      key={ref.id}
      className="bg-muted border border-muted-foreground/20 overflow-hidden"
    >
      <CardContent className="p-4">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
          <div className="space-y-1 w-full">
            <div className="flex items-center">
              <p className="font-medium break-words">
                {truncateText(ref.name, 40)}
              </p>
            </div>
            <p className="text-muted-foreground text-sm break-words">
              {ref.job_title && truncateText(ref.job_title, 40)}{" "}
              {ref.organization && `• ${truncateText(ref.organization, 40)}`}
            </p>
            <p className="text-muted-foreground text-sm break-words">
              Relationship:{" "}
              {ref.relationship && truncateText(ref.relationship, 40)}
            </p>
            <p className="text-muted-foreground text-sm break-words">
              Email: {ref.email && truncateText(ref.email, 40)}
            </p>
          </div>
          {isCurrentUser && (
            <div className="flex self-end sm:self-start gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(ref.id)}
              >
                <Pencil className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReference(ref.id)}
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

  const renderTypeSection = (type: REFERENCE_TYPE) => {
    const typeItems = getReferencesByType(type);
    if (typeItems.length === 0) return null;

    const isShowingAll = showAll[type];
    const displayItems = isShowingAll ? typeItems : typeItems.slice(0, 2);
    const hasMore = typeItems.length > 2;

    return (
      <div className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <p className="font-medium text-lg">
              {getTypeLabel(type)} References
            </p>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-1">
          {displayItems.map((ref) => renderReferenceCard(ref))}
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
    return <ReferencesSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">References</CardTitle>
          <CardDescription>
            People who can vouch for your skills and experience
          </CardDescription>
        </div>
        {isCurrentUser && (
          <Button
            onClick={() => openAddDialog()}
            className="w-full sm:w-auto"
            size="sm"
          >
            <Plus className="size-4" />
            Add Reference
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {renderTypeSection(REFERENCE_TYPE.ACADEMIC)}
        {renderTypeSection(REFERENCE_TYPE.PROFESSIONAL)}
        {renderTypeSection(REFERENCE_TYPE.OTHER)}

        {references.length === 0 && (
          <div className="flex flex-col justify-center items-center bg-muted py-6 border border-muted-foreground/20 rounded-lg text-cente">
            <Users className="mx-auto mb-4 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">No references added yet</p>
          </div>
        )}
      </CardContent>

      {/* Reference Dialog with Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <ReferenceForm
            initialValues={
              editingId
                ? references.find((ref) => ref.id === editingId) || null
                : null
            }
            isLoading={isCreating || isUpdating || isDeleting}
            onSubmit={saveReference}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const ReferencesSkeleton = ({ isCurrentUser }: { isCurrentUser: boolean }) => {
  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="space-y-2">
          <CardTitle className="text-xl">References</CardTitle>
          <CardDescription>
            People who can vouch for your skills and experience
          </CardDescription>
        </div>
        {isCurrentUser && <Skeleton className="w-full sm:w-auto h-10" />}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Academic References */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <Skeleton className="w-40 h-7" />
          </div>
          <div className="gap-4 grid grid-cols-1">
            <Card className="bg-muted border border-muted-foreground/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-3/5 h-4" />
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
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-4/5 h-5" />
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-1/2 h-4" />
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

        {/* Professional References */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <Skeleton className="w-48 h-7" />
          </div>
          <div className="gap-4 grid grid-cols-1">
            <Card className="bg-muted border border-muted-foreground/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-2/3 h-5" />
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-1/2 h-4" />
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

export default ReferencesSection;
