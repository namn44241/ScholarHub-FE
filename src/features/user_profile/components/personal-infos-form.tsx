import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DefaultDateInput } from "@/components/common/date-typer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  convertToISODate,
  formatDateFromISO,
  validateDateFormat,
} from "@/utils/functions";
import { useState } from "react";
import { usePutPersonal } from "../hooks/use-personal";
import { GENDER_TYPE } from "../utils/constants";
import type { IPersonalInfoFormProps } from "../utils/types";

const personalFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  job_title: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional(),
  nationality: z.string().optional(),
  country_of_residence: z.string().optional(),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => !val || validateDateFormat(val), {
      message: "Date must be in format DD/MM/YYYY",
    }),
  gender: z.nativeEnum(GENDER_TYPE).optional(),
  self_introduction: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalFormSchema>;

export function PersonalInfoForm({
  initialData,
  onCancel,
  onSuccess,
}: IPersonalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: updatePersonal } = usePutPersonal();

  const defaultValues: Partial<PersonalFormValues> = {
    first_name: initialData?.first_name || "",
    middle_name: initialData?.middle_name || "",
    last_name: initialData?.last_name || "",
    job_title: initialData?.job_title || "",
    contact_email: initialData?.contact_email || "",
    nationality: initialData?.nationality || "",
    country_of_residence: initialData?.country_of_residence || "",
    date_of_birth: initialData?.date_of_birth
      ? formatDateFromISO(initialData.date_of_birth)
      : "",
    gender: initialData?.gender || GENDER_TYPE.PREFER_NOT_TO_SAY,
    self_introduction: initialData?.self_introduction || "",
  };

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalFormSchema),
    defaultValues,
  });

  async function onSubmit(data: PersonalFormValues) {
    try {
      setIsSubmitting(true);

      //@ts-ignore
      const formattedData: IPersonalInfo = {
        ...data,
        date_of_birth: data.date_of_birth
          ? convertToISODate(data.date_of_birth)?.toString()
          : undefined,
      };
      await updatePersonal(formattedData);

      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Middle Name */}
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your middle name (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Title */}
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your job title (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nationality */}
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your nationality (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country of Residence */}
          <FormField
            control={form.control}
            name="country_of_residence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Residence</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your country of residence (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth - Using the new DateInput component */}
          <DefaultDateInput
            control={form.control}
            name="date_of_birth"
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={GENDER_TYPE.MALE}>Male</SelectItem>
                    <SelectItem value={GENDER_TYPE.FEMALE}>Female</SelectItem>
                    <SelectItem value={GENDER_TYPE.PREFER_NOT_TO_SAY}>
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Self Introduction */}
        <FormField
          control={form.control}
          name="self_introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Self Introduction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself (optional)"
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share a brief introduction about yourself, your background,
                interests, or anything else you'd like others to know.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
