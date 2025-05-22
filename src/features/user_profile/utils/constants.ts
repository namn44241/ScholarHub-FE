import type { IUserProfile } from "./types";

export enum GENDER_TYPE {
  MALE = "male",
  FEMALE = "female",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export enum EDUCATION_TYPE {
  HIGH_SCHOOL = "high_school",
  UNIVERSITY = "university",
  OTHER = "other",
}

export enum EXPERIENCE_TYPE {
  WORK = "work",
  RESEARCH = "research",
  VOLUNTEER = "volunteer",
  OTHER = "other",
}

export enum CERTIFICATION_TYPE {
  LANGUAGE = "language",
  STANDARDIZED_TEST = "standardized_test",
  OTHER = "other",
}

export enum PUBLICATION_TYPE {
  JOURNAL = "journal",
  CONFERENCE = "conference",
  OTHER = "other",
}

export enum DOCUMENT_TYPE {
  RESUME = "resume",
  COVER_LETTER = "cover_letter",
  OTHER = "other",
}

export enum REFERENCE_TYPE {
  ACADEMIC = "academic",
  PROFESSIONAL = "professional",
  OTHER = "other",
}

export const SAMPLE_USER_PROFILE: IUserProfile = {
  first_name: "Giang",
  middle_name: "Truong",
  last_name: "Nguyen",
  gender: GENDER_TYPE.MALE,
  job_title: "Undergraduate Student",
  contact_email: "giangnt.b23cc055@stu.ptit.edu.vn",
  date_of_birth: "2005-11-14",
  nationality: "Vietnamese",
  country_of_residence: "Vietnam",
  self_introduction:
    "Innovative second-year IT student with extensive experience developing real-world AI applications and frontend systems. Having built multiple AI-powered solutions across business and social sectors, I combine strong technical foundations in Web development with cutting-edge AI implementation skills. My goal is to advance as a Software Engineer creating technologies that drive industrial efficiency and address critical societal challenges.",

  educations: [
    {
      id: "edu-001",
      type: EDUCATION_TYPE.HIGH_SCHOOL,
      graduation_year: 2023,
      institution: "Me Linh Highschool",
    },
    {
      id: "edu-002",
      type: EDUCATION_TYPE.UNIVERSITY,
      current_study_year: 2,
      graduation_year: 2027,
      institution: "Posts and Telecommunications Institute of Technology",
      major: "Applied Information and Technology",
      degree_type: "Bachelor",
      gpa: 3.75,
    },
  ],

  experiences: [
    {
      id: "exp-001",
      type: EXPERIENCE_TYPE.WORK,
      title: "Web developer Intern",
      organization:
        "Digital Technology Research and Development Department - Research Institute of Posts and Telecommunications",
      location: "Hanoi, Vietnam",
      start_date: "01/03/2023",
      end_date: "",
      is_ongoing: true,
      description:
        "Built and maintained frontend modules for large-scale data management projects using React and TypeScript. Designed project architectures, created reusable components, and integrated APIs with backend teams for internal projects",
    },
  ],

  achievements: [
    {
      id: "achv-001",
      title: "Top 3 Vietnam region at Intel Global AI Impact Festival 2024",
      issuer: "Intel",
      award_date: "2024-11-11",
      description: "",
    },
    {
      id: "achv-002",
      title: "Best UG Junior Project at Coding Fest 2024",
      issuer: "Sydney University",
      award_date: "2024-08-23",
      description: "",
    },
    {
      id: "achv-003",
      title: "Top 3 at P-innovation",
      issuer: "Posts and Telecommunications Institute of Technology",
      award_date: "2024-05-15",
      description: "",
    },
  ],

  certifications: [
    {
      id: "cert-001",
      name: "Google UX Design Specialization",
      type: CERTIFICATION_TYPE.OTHER,
      provider: "Google",
      certification_date: "2024-04-28",
      expiry_date: "",
      image_path: "",
      url: "https://coursera.org/share/ec69e32f7ed70ad063fd1f270aa602db",
    },
  ],

  publications: [],

  documents: [
    {
      id: "doc-001",
      type: DOCUMENT_TYPE.RESUME,
      file_name: "resume_giangnt.pdf",
      file_path: "/uploads/resume_giang.pdf",
      uploaded_at: "2025-02-10T09:00:00Z",
    },
    {
      id: "doc-002",
      type: DOCUMENT_TYPE.COVER_LETTER,
      file_name: "cover_letter_giangnt.pdf",
      file_path: "/uploads/cover_letter_giang.pdf",
      uploaded_at: "2025-02-10T09:00:00Z",
    },
  ],

  references: [
    {
      id: "ref-001",
      name: "Phan Ly Huynh",
      type: REFERENCE_TYPE.ACADEMIC,
      job_title: "PhD",
      organization: "Posts and Telecommunications Institute of Technology",
      relationship: "Supervisor",
      email: "huynhpl@ptit.edu.vn ",
    },
  ],
};
