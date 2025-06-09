import { Button } from "@/components/ui/button";
import {
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { REFERENCE_TYPE } from "../utils/constants";
import type { IReference } from "../utils/types";

export const referenceSchema = z.object({
  name: z.string().min(1, "Reference name is required"),
  type: z.nativeEnum(REFERENCE_TYPE),
  job_title: z.string().min(1, "Job title is required"),
  organization: z.string().min(1, "Organization is required"),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Please enter a valid email"),
});

export type ReferenceFormValues = z.infer<typeof referenceSchema>;

interface IReferenceFormProps {
  initialValues?: IReference | null;
  isLoading?: boolean;
  onSubmit: (values: ReferenceFormValues) => void;
  onCancel: () => void;
}

const ReferenceForm = ({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: IReferenceFormProps) => {
  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name || "",
          type: initialValues.type || REFERENCE_TYPE.ACADEMIC,
          job_title: initialValues.job_title || "",
          organization: initialValues.organization || "",
          relationship: initialValues.relationship || "",
          email: initialValues.email || "",
        }
      : {
          name: "",
          type: REFERENCE_TYPE.ACADEMIC,
          job_title: "",
          organization: "",
          relationship: "",
          email: "",
        },
  });

  const isEditing = !!initialValues?.id;

  const handleSubmit = (data: ReferenceFormValues) => {
    onSubmit(data);
  };

  const getJobTitlePlaceholder = (type: REFERENCE_TYPE) => {
    switch (type) {
      case REFERENCE_TYPE.ACADEMIC:
        return "Professor, Research Supervisor";
      case REFERENCE_TYPE.PROFESSIONAL:
        return "Manager, Team Lead";
      case REFERENCE_TYPE.OTHER:
        return "Mentor, Colleague";
      default:
        return "Job title";
    }
  };

  const getOrganizationPlaceholder = (type: REFERENCE_TYPE) => {
    switch (type) {
      case REFERENCE_TYPE.ACADEMIC:
        return "University of Example";
      case REFERENCE_TYPE.PROFESSIONAL:
        return "Company Name";
      case REFERENCE_TYPE.OTHER:
        return "Organization Name";
      default:
        return "Organization";
    }
  };

  const getRelationshipPlaceholder = (type: REFERENCE_TYPE) => {
    switch (type) {
      case REFERENCE_TYPE.ACADEMIC:
        return "Thesis Advisor, Course Instructor";
      case REFERENCE_TYPE.PROFESSIONAL:
        return "Direct Supervisor, Project Manager";
      case REFERENCE_TYPE.OTHER:
        return "Mentor, Collaborator";
      default:
        return "Relationship";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Reference" : "Add Reference"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of your reference
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
          <div className="space-y-4 p-1">
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
                      <SelectItem value={REFERENCE_TYPE.ACADEMIC}>
                        Academic
                      </SelectItem>
                      <SelectItem value={REFERENCE_TYPE.PROFESSIONAL}>
                        Professional
                      </SelectItem>
                      <SelectItem value={REFERENCE_TYPE.OTHER}>
                        Other
                      </SelectItem>
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
                      placeholder={getJobTitlePlaceholder(form.watch("type"))}
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
                      placeholder={getOrganizationPlaceholder(
                        form.watch("type")
                      )}
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
                      placeholder={getRelationshipPlaceholder(
                        form.watch("type")
                      )}
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
          </div>
        </ScrollArea>

        <DialogFooter className="flex sm:flex-row flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
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

export default ReferenceForm;
