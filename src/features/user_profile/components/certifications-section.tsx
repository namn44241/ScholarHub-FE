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
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  useDeleteCertification,
  useGetCertification,
  usePostCertification,
  usePutCertification,
} from "../hooks/use-certification";
import { CERTIFICATION_TYPE } from "../utils/constants";
import type {
  ICertification,
  ICertificationsSectionProps,
} from "../utils/types";
import CertificationForm, {
  type CertificationFormValues,
} from "./certifications-form";

const CertificationsSection = ({
  isCurrentUser,
}: ICertificationsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<Record<CERTIFICATION_TYPE, boolean>>({
    language: false,
    standardized_test: false,
    other: false,
  });

  const { data: certificationsData = [], isLoading } = useGetCertification();
  const { mutate: createCertification, isPending: isCreating } = usePostCertification();
  const { mutate: updateCertification, isPending: isUpdating } = usePutCertification();
  const { mutate: deleteCertification, isPending: isDeleting } = useDeleteCertification();

  const isDataArray = Array.isArray(certificationsData);
  const certifications = isDataArray
    ? certificationsData
    : [certificationsData];

  const openAddDialog = () => {
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id: string) => {
    if (!id) {
      console.error("Attempted to edit certification with invalid ID");
      return;
    }

    setEditingId(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const saveCertification = (values: CertificationFormValues) => {
    if (editingId) {
      // Update existing certification
      const updatedCertification = {
        id: editingId,
        ...values,
      };

      updateCertification(updatedCertification as ICertification);
    } else {
      // Create new certification
      const newCertification = {
        ...values,
      };

      createCertification(newCertification);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteCertification = (id: string) => {
    if (!id) {
      console.error("Attempted to delete certification with invalid ID");
      return;
    }

    deleteCertification(id);
  };

  const toggleShowAll = (type: CERTIFICATION_TYPE) => {
    setShowAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getTypeLabel = (type: CERTIFICATION_TYPE): string => {
    switch (type) {
      case "language":
        return "Language Certifications";
      case "standardized_test":
        return "Standardized Tests";
      case "other":
        return "Other Certifications";
      default:
        return "Certifications";
    }
  };

  const getCertificationsByType = (
    type: CERTIFICATION_TYPE
  ): ICertification[] => {
    return certifications.filter((cert) => cert.type === type);
  };

  const renderCertificationCard = (cert: ICertification) => (
    <Card
      key={cert.id}
      className="bg-muted border border-muted-foreground/20 overflow-hidden"
    >
      <div className="flex sm:flex-row flex-col h-full">
        <div className="flex justify-center items-center p-4 w-full sm:w-1/5">
          {cert.image_path ? (
            <div className="relative size-24">
              <LazyLoadImage
                src={cert.image_path || "/placeholder.svg"}
                alt={cert.name || "Certification"}
                className="rounded-lg w-full h-full object-contain"
              />
            </div>
          ) : (
            <FileText className="size-16 text-muted-foreground" />
          )}
        </div>
        <div className="p-4 w-full sm:w-4/5">
          <div className="flex sm:flex-row flex-col justify-between gap-2">
            <p className="font-medium break-words">
              {truncateText(cert.name || "", 30)}
            </p>
            {isCurrentUser && (
              <div className="flex self-end sm:self-start gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(cert.id)}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCertification(cert.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm break-words">
            {truncateText(cert.provider || "", 30)} •{" "}
            {truncateText(cert.certification_date || "", 30)}
            {cert.expiry_date && ` - ${truncateText(cert.expiry_date, 30)}`}
          </p>
          {cert.url && (
            <p className="mt-1 text-primary text-sm hover:underline">
              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                View Certificate
              </a>
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  const renderCategorySection = (type: CERTIFICATION_TYPE) => {
    const categoryItems = getCertificationsByType(type);
    if (categoryItems.length === 0) return null;

    const isShowingAll = showAll[type];
    const displayItems = isShowingAll
      ? categoryItems
      : categoryItems.slice(0, 2);
    const hasMore = categoryItems.length > 2;

    return (
      <div className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
          <p className="font-medium text-lg">{getTypeLabel(type)}</p>
        </div>

        <div className="gap-4 grid grid-cols-1">
          {displayItems.map((cert) => renderCertificationCard(cert))}
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
                Show All ({categoryItems.length})
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <CertificationsSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Certifications</CardTitle>
          <CardDescription>Certifications and test scores</CardDescription>
        </div>
        {isCurrentUser && (
          <Button
            size="sm"
            onClick={() => openAddDialog()}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Add Certification
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {renderCategorySection(CERTIFICATION_TYPE.LANGUAGE)}
        {renderCategorySection(CERTIFICATION_TYPE.STANDARDIZED_TEST)}
        {renderCategorySection(CERTIFICATION_TYPE.OTHER)}

        {certifications.length === 0 && (
          <div className="flex flex-col justify-center items-center bg-muted py-6 border border-muted-foreground/20 rounded-lg text-center">
            <FileText className="mx-auto mb-4 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">No certifications added yet</p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <CertificationForm
            //@ts-ignore
            initialValues={
              editingId
                ? certifications.find((cert) => cert.id === editingId) || null
                : null
            }
            isLoading={isCreating || isUpdating || isDeleting}
            onSubmit={saveCertification}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const CertificationsSkeleton = ({
  isCurrentUser,
}: {
  isCurrentUser: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Certifications</CardTitle>
          <CardDescription>Loading certification data...</CardDescription>
        </div>
        {isCurrentUser && <Skeleton className="w-full sm:w-32 h-9" />}
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {[...Array(3)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
              <Skeleton className="w-48 h-7" />
            </div>
            <div className="gap-4 grid grid-cols-1">
              {[...Array(2)].map((_, index) => (
                <Card
                  key={index}
                  className="bg-muted border border-muted-foreground/20 overflow-hidden"
                >
                  <div className="flex sm:flex-row flex-col h-full">
                    <div className="flex justify-center items-center p-4 w-full sm:w-1/5">
                      <Skeleton className="rounded-lg size-24" />
                    </div>
                    <div className="p-4 w-full sm:w-4/5">
                      <div className="flex sm:flex-row flex-col justify-between gap-2">
                        <Skeleton className="w-3/4 h-6" />
                        {isCurrentUser && (
                          <div className="flex self-end sm:self-start gap-1">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <Skeleton className="mt-2 w-1/2 h-4" />
                      <Skeleton className="mt-1 w-1/3 h-4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
