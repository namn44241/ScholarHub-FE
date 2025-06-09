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
import { EDUCATION_TYPE } from "../utils/constants";
import type { IEducation } from "../utils/types";

export const educationFormSchema = z.object({
  type: z.nativeEnum(EDUCATION_TYPE),
  institution: z.string().min(1, "Institution name is required"),
  major: z.string().optional(),
  degree_type: z.string().optional(),
  graduation_year: z.number().optional(),
  current_study_year: z.number().optional(),
  gpa: z.number().min(0).max(4.0).optional(),
});

export type EducationFormValues = z.infer<typeof educationFormSchema>;

interface IEducationFormProps {
  initialValues?: IEducation | null;
    isLoading?: boolean;
  onSubmit: (values: EducationFormValues) => void;
  onCancel: () => void;
}

const EducationForm = ({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: IEducationFormProps) => {
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: initialValues || {
      type: EDUCATION_TYPE.UNIVERSITY,
      institution: "",
      major: "",
      degree_type: "",
      graduation_year: undefined,
      current_study_year: undefined,
      gpa: undefined,
    },
  });

  const isEditing = !!initialValues?.id;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Education Information"
              : "Add Education Information"}
          </DialogTitle>
          <DialogDescription>Enter your education details</DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EDUCATION_TYPE.UNIVERSITY}>
                    Univeristy
                  </SelectItem>
                  <SelectItem value={EDUCATION_TYPE.HIGH_SCHOOL}>
                    High School
                  </SelectItem>
                  <SelectItem value={EDUCATION_TYPE.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="University of...." required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degree_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree Type</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Bachelor's, Master's, PhD"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major / Field of Study</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Computer Science, Business"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="current_study_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Study Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value ? Number.parseInt(value) : undefined
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="graduation_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2025"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value ? Number.parseInt(value) : undefined
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gpa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPA</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  placeholder="3.5"
                  value={field.value?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value ? Number.parseFloat(value) : undefined
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
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

export default EducationForm;
