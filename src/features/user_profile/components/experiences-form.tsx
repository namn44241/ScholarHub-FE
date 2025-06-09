import { DefaultDateInput } from "@/components/common/date-typer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import {
  convertToISODate,
  formatDateFromISO,
  validateDateFormat,
} from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EXPERIENCE_TYPE } from "../utils/constants";
import type { IExperience } from "../utils/types";

export const experienceFormSchema = z.object({
  type: z.nativeEnum(EXPERIENCE_TYPE),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().refine((val) => validateDateFormat(val), {
    message: "Date must be in format DD/MM/YYYY",
  }),
  end_date: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  is_ongoing: z.boolean().default(false).optional(),
  description: z.string().optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface IExperienceFormProps {
  initialValues?: IExperience | null;
    isLoading?: boolean;
  onSubmit: (values: ExperienceFormValues) => void;
  onCancel: () => void;
}

const ExperienceForm = ({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: IExperienceFormProps) => {
  // Convert ISO dates to DD/MM/YYYY format for display
  const defaultValues = initialValues
    ? {
        ...initialValues,
        start_date: formatDateFromISO(initialValues.start_date),
        end_date: initialValues.end_date
          ? formatDateFromISO(initialValues.end_date)
          : undefined,
      }
    : {
        title: "",
        organization: "",
        location: "",
        start_date: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY format
        end_date: undefined,
        is_ongoing: false,
        description: "",
        type: EXPERIENCE_TYPE.RESEARCH,
      };

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });

  const isEditing = !!initialValues?.id;

  const handleSubmit = (data: ExperienceFormValues) => {
    // Convert DD/MM/YYYY dates to ISO format before submitting
    const formattedData = {
      ...data,
      start_date: convertToISODate(data.start_date)?.toString() || "",
      end_date: data.end_date
        ? convertToISODate(data.end_date)?.toString()
        : undefined,
    };

    onSubmit(formattedData as ExperienceFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of your experience
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 p-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EXPERIENCE_TYPE.WORK}>Work</SelectItem>
                      <SelectItem value={EXPERIENCE_TYPE.RESEARCH}>
                        Research
                      </SelectItem>
                      <SelectItem value={EXPERIENCE_TYPE.VOLUNTEER}>
                        Volunteer
                      </SelectItem>
                      <SelectItem value={EXPERIENCE_TYPE.OTHER}>
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title / Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Research student" required />
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
                  <FormLabel>Organization / Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="University of..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="New York, NY or Remote" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <DefaultDateInput
                control={form.control}
                name="start_date"
                label="Start Date"
                placeholder="DD/MM/YYYY"
                required={true}
              />

              <DefaultDateInput
                control={form.control}
                name="end_date"
                label="End Date"
                placeholder="DD/MM/YYYY"
                required={!form.watch("is_ongoing")}
                disabled={form.watch("is_ongoing")}
              />
            </div>

            <FormField
              control={form.control}
              name="is_ongoing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("end_date", undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Currently working here</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Describe your responsibilities, achievements, and skills used"
                      value={field.value || ""}
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

export default ExperienceForm;
