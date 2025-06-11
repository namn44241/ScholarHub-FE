export const USER_PROFILE_ENDPOINTS = {
  DEFAULT: `/user`,
  PERSONAL: `/user/personal`,
  EDUCATION: `/user/education`,
  EXPERIENCE: `/user/experience`,
  ACHIEVEMENT: `/user/achievement`,
  CERTIFICATION: `/user/certification`,
  PUBLICATION: `/user/publication`,
  REFERENCE: `/user/reference`,
};

export const endpoints = {
  profile: {
    documents: {
      get: "/profile/document",
      create: "/profile/document", 
      update: "/profile/document",
      delete: "/profile/document",
    },
  },
};