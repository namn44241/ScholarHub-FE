import { DefaultDateInput } from "@/components/common/date-typer";
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
import {
  convertToISODate,
  formatDateFromISO,
  validateDateFormat,
} from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PUBLICATION_TYPE } from "../utils/constants";
import type { IPublication } from "../utils/types";

export const publicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  type: z.nativeEnum(PUBLICATION_TYPE),
  venue_name: z.string().min(1, "Venue name is required"),
  publish_date: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type PublicationFormValues = z.infer<typeof publicationSchema>;

interface IPublicationFormProps {
  initialValues?: IPublication | null;
  isLoading?: boolean;
  onSubmit: (values: PublicationFormValues) => void;
  onCancel: () => void;
}

const PublicationForm = ({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: IPublicationFormProps) => {
  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: initialValues
      ? {
          title: initialValues.title || "",
          type: initialValues.type || PUBLICATION_TYPE.JOURNAL,
          venue_name: initialValues.venue_name || "",
          publish_date: initialValues.publish_date
            ? formatDateFromISO(initialValues.publish_date)
            : undefined,
          url: initialValues.url || "",
        }
      : {
          title: "",
          type: PUBLICATION_TYPE.JOURNAL,
          venue_name: "",
          publish_date: undefined,
          url: "",
        },
  });

  const isEditing = !!initialValues?.id;

  const handleSubmit = (data: PublicationFormValues) => {
    // Convert DD/MM/YYYY date to ISO format before submitting
    const formattedData = {
      ...data,
      publish_date: data.publish_date
        ? convertToISODate(data.publish_date)?.toString()
        : undefined,
    };

    onSubmit(formattedData as PublicationFormValues);
  };

  const getVenuePlaceholder = (type: PUBLICATION_TYPE) => {
    switch (type) {
      case PUBLICATION_TYPE.JOURNAL:
        return "Journal of Computer Science";
      case PUBLICATION_TYPE.CONFERENCE:
        return "ACM SIGCHI Conference";
      case PUBLICATION_TYPE.OTHER:
        return "Technical Report";
      default:
        return "Publication venue";
    }
  };

  const getVenueLabel = (type: PUBLICATION_TYPE) => {
    switch (type) {
      case PUBLICATION_TYPE.JOURNAL:
        return "Journal Name";
      case PUBLICATION_TYPE.CONFERENCE:
        return "Conference Name";
      case PUBLICATION_TYPE.OTHER:
        return "Publication Venue";
      default:
        return "Venue";
    }
  };

  const getTitlePlaceholder = (type: PUBLICATION_TYPE) => {
    switch (type) {
      case PUBLICATION_TYPE.JOURNAL:
        return "A Novel Approach to Machine Learning";
      case PUBLICATION_TYPE.CONFERENCE:
        return "Improving User Experience in Web Applications";
      case PUBLICATION_TYPE.OTHER:
        return "Technical Documentation Report";
      default:
        return "Enter publication title";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Publication" : "Add Publication"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of your publication
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-2 sm:pr-4 h-[500px]">
          <div className="space-y-4 p-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Type</FormLabel>
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
                      <SelectItem value={PUBLICATION_TYPE.JOURNAL}>
                        Journal Article
                      </SelectItem>
                      <SelectItem value={PUBLICATION_TYPE.CONFERENCE}>
                        Conference Paper
                      </SelectItem>
                      <SelectItem value={PUBLICATION_TYPE.OTHER}>
                        Other Publication
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
                  <FormLabel>Publication Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={getTitlePlaceholder(form.watch("type"))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getVenueLabel(form.watch("type"))}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={getVenuePlaceholder(form.watch("type"))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publish_date"
              render={() => (
                <DefaultDateInput
                  control={form.control}
                  name="publish_date"
                  label="Publication Date (optional)"
                  placeholder="DD/MM/YYYY"
                  required={false}
                />
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/publication"
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

export default PublicationForm;
