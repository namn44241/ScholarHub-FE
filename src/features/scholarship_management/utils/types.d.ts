import type { IScholarship } from "@/features/scholarship_search";
import type { IUserProfile } from "@/features/user_profile";
import type { IUser } from "@/types/User";

export interface IScholarshipFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  form: any;
  formType: FormType;
  scholarshipId: string;
  isSubmitting: boolean;
  isLoading: boolean;
  onSubmit: (data: CreateScholarshipDTO | IUpdateScholarshipDTO) => void;
  handleDelete: () => void;
}

export interface IScholarshipActionBarProps {
  table: Table<IScholarship>
}

export interface IScholarshipApplication {
  id: number;
  profile: IUserProfile;
  status: ApplicationStatusType;
  submission_date: string;
  feedback: string;
}

export type ApplicationStatusType = "pending" | "approved" | "rejected";
export type StatusType = "pending" | "processing" | "success" | "failed";

export type FormType = "read" | "create" | "update" | "delete";

