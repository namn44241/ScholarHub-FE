import { GENDER_TYPE } from "@/features/user_profile/utils/constants";
import type { IScholarshipApplication } from "./types";

export const DIALOG_TITLES = {
  read: "Scholarship Details",
  create: "Create Scholarship",
  update: "Update Scholarship",
  delete: "Delete Scholarship",
};

export const DIALOG_DESCRIPTIONS = {
  read: "View the details of this scholarship.",
  create: "Create a new scholarship.",
  update: "Update the details of this scholarship.",
  delete: "Are you sure you want to delete this scholarship?",
};

export const SUBMIT_BUTTON_TEXTS = {
  read: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

export const SAMPLE_APPLICATIONS: IScholarshipApplication[] = [
  {
    id: 1,
    profile: {
      first_name: "Giang",
      middle_name: "Truong",
      last_name: "Nguyen",
      gender: GENDER_TYPE.MALE,
      job_title: "Undergraduate Student",
      contact_email: "giangnt.b23cc055@stu.ptit.edu.vn",
    },
    status: "pending",
    submission_date: "2025-04-15T10:30:00Z",
    feedback: "",
  },
  {
    id: 2,
    profile: {
      first_name: "Jane",
      middle_name: "Marie",
      last_name: "Smith",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Research Assistant",
      contact_email: "jane.smith@example.com",
    },
    status: "approved",
    submission_date: "2025-04-10T09:15:00Z",
    feedback: "Excellent application with strong academic background.",
  },
  {
    id: 3,
    profile: {
      first_name: "Carlos",
      middle_name: "",
      last_name: "Rodriguez",
      gender: GENDER_TYPE.MALE,
      job_title: "Graduate Student",
      contact_email: "carlos.r@example.com",
    },
    status: "rejected",
    submission_date: "2025-04-05T16:45:00Z",
    feedback: "Missing required documentation.",
  },
  {
    id: 4,
    profile: {
      first_name: "Aisha",
      middle_name: "K",
      last_name: "Patel",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Undergraduate Student",
      contact_email: "aisha.p@example.com",
    },
    status: "pending",
    submission_date: "2025-04-18T08:20:00Z",
    feedback: "",
  },
  {
    id: 5,
    profile: {
      first_name: "Michael",
      middle_name: "Thomas",
      last_name: "Chen",
      gender: GENDER_TYPE.MALE,
      job_title: "PhD Candidate",
      contact_email: "michael.c@example.com",
    },
    status: "approved",
    submission_date: "2025-04-02T13:10:00Z",
    feedback: "Outstanding research proposal and qualifications.",
  },
  {
    id: 6,
    profile: {
      first_name: "Sarah",
      middle_name: "Elizabeth",
      last_name: "Johnson",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Master's Student",
      contact_email: "sarah.j@example.com",
    },
    status: "pending",
    submission_date: "2025-04-22T11:45:00Z",
    feedback: "",
  },
  {
    id: 7,
    profile: {
      first_name: "Raj",
      middle_name: "",
      last_name: "Kumar",
      gender: GENDER_TYPE.MALE,
      job_title: "Doctoral Researcher",
      contact_email: "raj.kumar@example.com",
    },
    status: "pending",
    submission_date: "2025-04-21T09:30:00Z",
    feedback: "",
  },
  {
    id: 8,
    profile: {
      first_name: "Elena",
      middle_name: "Maria",
      last_name: "Gonzalez",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Undergraduate Student",
      contact_email: "elena.g@example.com",
    },
    status: "pending",
    submission_date: "2025-04-20T14:15:00Z",
    feedback: "",
  },
  {
    id: 9,
    profile: {
      first_name: "David",
      middle_name: "Lee",
      last_name: "Kim",
      gender: GENDER_TYPE.MALE,
      job_title: "Research Fellow",
      contact_email: "david.kim@example.com",
    },
    status: "approved",
    submission_date: "2025-04-05T10:20:00Z",
    feedback: "Excellent credentials and research proposal.",
  },
  {
    id: 10,
    profile: {
      first_name: "Fatima",
      middle_name: "",
      last_name: "Hassan",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Graduate Student",
      contact_email: "fatima.h@example.com",
    },
    status: "approved",
    submission_date: "2025-04-08T16:30:00Z",
    feedback: "Strong academic background and promising research direction.",
  },
  {
    id: 11,
    profile: {
      first_name: "James",
      middle_name: "Robert",
      last_name: "Wilson",
      gender: GENDER_TYPE.MALE,
      job_title: "PhD Student",
      contact_email: "james.w@example.com",
    },
    status: "approved",
    submission_date: "2025-04-12T11:20:00Z",
    feedback: "Impressive research experience and clear objectives.",
  },
  {
    id: 12,
    profile: {
      first_name: "Lin",
      middle_name: "",
      last_name: "Zhang",
      gender: GENDER_TYPE.FEMALE,
      job_title: "Postgraduate Researcher",
      contact_email: "lin.zhang@example.com",
    },
    status: "approved",
    submission_date: "2025-04-14T08:50:00Z",
    feedback: "Outstanding proposal with innovative approach.",
  },
];
