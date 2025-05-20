import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { truncateText } from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { REFERENCE_TYPE } from "../utils/constants";
import type { IReference, IReferencesSectionProps } from "../utils/types";

const referenceFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Reference name is required"),
  type: z.nativeEnum(REFERENCE_TYPE),
  job_title: z.string().min(1, "Job title is required"),
  organization: z.string().min(1, "Organization is required"),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Please enter a valid email"),
});

type FormValues = z.infer<typeof referenceFormSchema>;

const ReferencesSection = ({
  references = [],
  isCurrentUser,
}: IReferencesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<IReference | null>(null);
  const [showAll, setShowAll] = useState<Record<REFERENCE_TYPE, boolean>>({
    academic: false,
    professional: false,
    other: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(referenceFormSchema),
    defaultValues: {
      id: "",
      name: "",
      job_title: "",
      organization: "",
      relationship: "",
      email: "",
      type: REFERENCE_TYPE.ACADEMIC,
    },
  });

  const openAddDialog = (type: REFERENCE_TYPE = REFERENCE_TYPE.ACADEMIC) => {
    form.reset({
      id: "",
      name: "",
      job_title: "",
      organization: "",
      relationship: "",
      email: "",
      type,
    });
    setEditingRef(null);
    setIsDialogOpen(true);
  };

  const handleSaveReference = (values: FormValues) => {
    const updatedReference: IReference = {
      id: values.id,
      name: values.name,
      type: values.type,
      job_title: values.job_title,
      organization: values.organization,
      relationship: values.relationship,
      email: values.email,
    };

    const newReferences = [...references];

    if (editingRef) {
      const index = newReferences.findIndex((ref) => ref.id === editingRef.id);
      if (index !== -1) {
        newReferences[index] = updatedReference;
      }
    } else {
      newReferences.push(updatedReference);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteReference = (id: string) => {
    console.log("Delete reference with ID:", id);
  };

  const editReference = (reference: IReference) => {
    form.reset({
      id: reference.id,
      name: reference.name,
      type: reference.type,
      job_title: reference.job_title || "",
      organization: reference.organization || "",
      relationship: reference.relationship || "",
      email: reference.email || "",
    });
    setEditingRef(reference);
    setIsDialogOpen(true);
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
      <CardContent>
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
                onClick={() => editReference(ref)}
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
                <ChevronUp className="mr-1 size-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 size-4" />
                Show All ({typeItems.length})
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const hasReferences = references.length > 0;

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
          <Button onClick={() => openAddDialog()} className="w-full sm:w-auto">
            <Plus className="mr-1 size-4" />
            Add Reference
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {renderTypeSection(REFERENCE_TYPE.ACADEMIC)}
        {renderTypeSection(REFERENCE_TYPE.PROFESSIONAL)}
        {renderTypeSection(REFERENCE_TYPE.OTHER)}

        {!hasReferences && (
          <div className="py-10 text-center">
            <Users className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">No references added yet</p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRef ? "Edit Reference" : "Add Reference"}
            </DialogTitle>
            <DialogDescription>
              Enter the details of your reference
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveReference)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reference name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title / Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Professor, Manager"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization / Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. University of Example"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Thesis Advisor, Supervisor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex sm:flex-row flex-col gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-1 size-4" />
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReferencesSection;
