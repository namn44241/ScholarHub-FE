import type { IConnection, IPost } from "./types";

export const SAMPLE_POSTS: IPost[] = [
  {
    id: "1",
    author: {
      name: "Minh Nguyen",
      role: "3rd Year Student, Foreign Trade University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just completed my Erasmus+ scholarship application for France! The preparation process was challenging but so worth it. Happy to share my experience with personal statements and recommendation letters if anyone needs advice!",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "2h ago",
    reactions: {
      likes: 87,
      comments: 32,
      reposts: 15,
    },
    userReacted: false,
    tags: ["Erasmus+", "StudyAbroad", "ScholarshipTips"],
    postType: "experience",
  },
  {
    id: "2",
    author: {
      name: "Dr. Sarah Johnson",
      role: "Scholarship Advisor, Stanford University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "🚨 NEW SCHOLARSHIP ALERT: Stanford University is now accepting applications for the Global Leaders Scholarship 2025-2026. Full tuition coverage with $15,000 annual stipend. Requirements: 3.5+ GPA, strong leadership background, and community service experience. Application deadline: November 30, 2025. See link in comments for details!",
    timestamp: "5h ago",
    reactions: {
      likes: 412,
      comments: 98,
      reposts: 225,
    },
    userReacted: true,
    tags: ["Stanford", "FullScholarship", "GlobalLeaders"],
    postType: "announcement",
  },
  {
    id: "3",
    author: {
      name: "Emily Rodriguez",
      role: "Fulbright Alumni, Harvard MBA Graduate",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm hosting a free virtual workshop next weekend on 'How to Craft a Winning Fulbright Application.' Will share insider tips from my experience as both a recipient and now a selection committee reviewer. Drop a comment if you're interested, and I'll send you the registration link!",
    timestamp: "1d ago",
    reactions: {
      likes: 156,
      comments: 87,
      reposts: 42,
    },
    userReacted: false,
    tags: ["Fulbright", "ApplicationTips", "Workshop"],
    postType: "event",
  },
  {
    id: "4",
    author: {
      name: "Global Education Foundation",
      role: "International Scholarship Organization",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Applications are now open for our 2026 Merit-Based Global Scholars Program. We're offering 50 full scholarships to outstanding students from developing countries. Fields of study: STEM, Social Sciences, and Environmental Studies. First-round application deadline: January 15, 2026.",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "2d ago",
    reactions: {
      likes: 329,
      comments: 146,
      reposts: 278,
    },
    userReacted: false,
    tags: ["GlobalScholars", "InternationalScholarship", "FullFunding"],
    postType: "announcement",
  },
  {
    id: "5",
    author: {
      name: "Alex Zhang",
      role: "Chevening Scholar, Current LSE Student",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "One year ago today, I received my Chevening Scholarship acceptance letter! Studying at LSE has been life-changing. For those applying this year, focus on connecting your career goals with UK priorities and be authentic in your interviews. Happy to review personal statements - just DM me!",
    timestamp: "3d ago",
    reactions: {
      likes: 241,
      comments: 52,
      reposts: 18,
    },
    userReacted: true,
    tags: ["Chevening", "LSE", "UKScholarship", "SuccessStory"],
    postType: "experience",
  },
  {
    id: "6",
    author: {
      name: "University of Tokyo",
      role: "Official University Account",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "The MEXT Scholarship for international students (2026-2028) is now accepting applications. Full tuition coverage, monthly stipend, and round-trip airfare included. Research students and graduate programs available in all fields. Pre-application webinar scheduled for next Tuesday - register via the link below.",
    timestamp: "4d ago",
    reactions: {
      likes: 387,
      comments: 142,
      reposts: 295,
    },
    userReacted: false,
    tags: ["MEXT", "StudyInJapan", "GraduateScholarship"],
    postType: "announcement",
  },
  {
    id: "7",
    author: {
      name: "David Williams",
      role: "Rhodes Scholar, University of Oxford",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just published my comprehensive guide to Rhodes Scholarship preparation! Includes timeline, essay examples, and interview preparation strategies. It took me three attempts before succeeding, so I've included all the lessons I learned the hard way. Link to the guide in comments!",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "5d ago",
    reactions: {
      likes: 214,
      comments: 76,
      reposts: 112,
    },
    userReacted: false,
    tags: ["RhodesScholarship", "Oxford", "ApplicationGuide"],
    postType: "resource",
  },
  {
    id: "8",
    author: {
      name: "Maria Gonzalez",
      role: "High School Senior, Scholarship Seeker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Need advice! I'm trying to decide between applying for the Gates Millennium Scholarship and the Jack Kent Cooke Foundation Scholarship. I qualify for both but can only focus on one application due to time constraints. Which one offers better long-term support? Anyone with experience with either program?",
    timestamp: "6d ago",
    reactions: {
      likes: 47,
      comments: 83,
      reposts: 5,
    },
    userReacted: false,
    tags: ["ScholarshipAdvice", "GatesMillennium", "JKCF"],
    postType: "question",
  },
  {
    id: "9",
    author: {
      name: "Prof. Robert Chen",
      role: "Scholarship Committee Chair, MIT",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "From a reviewer's perspective: The biggest mistakes I see in scholarship applications: 1) Generic personal statements that could apply to anyone, 2) Focusing only on achievements without showing growth, 3) Unclear career goals, and 4) Poor recommendation letter choices. Happy to elaborate on any of these points if you have questions.",
    timestamp: "1w ago",
    reactions: {
      likes: 576,
      comments: 124,
      reposts: 203,
    },
    userReacted: true,
    tags: ["ApplicationMistakes", "ScholarshipTips", "InsiderAdvice"],
    postType: "advice",
  },
  {
    id: "10",
    author: {
      name: "International Student Network",
      role: "Student Support Organization",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "We've just updated our database with over 500 new scholarships for the 2026-2027 academic year! Includes opportunities for undergraduate, graduate, and doctoral students across all regions and fields of study. Use our advanced search filters to find the perfect match for your academic profile and career goals.",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "1w ago",
    reactions: {
      likes: 823,
      comments: 197,
      reposts: 412,
    },
    userReacted: false,
    tags: ["ScholarshipDatabase", "FundingOpportunities", "ResourceUpdate"],
    postType: "resource",
  },
];

export const SAMPLE_CONNECTIONS: IConnection[] = [
  {
    id: "1",
    name: "Jessica Park",
    role: "Fulbright Scholar, Columbia University",
    avatar: "/placeholder.svg?height=48&width=48",
    mutualConnections: 15,
    expertise: ["Essay Writing", "Interview Preparation", "STEM Scholarships"],
  },
  {
    id: "2",
    name: "Michael Wong",
    role: "Gates Cambridge Scholar, PhD Candidate",
    avatar: "/placeholder.svg?height=48&width=48",
    mutualConnections: 8,
    expertise: ["Research Proposals", "UK Scholarships", "Academic Writing"],
  },
  {
    id: "3",
    name: "Sophia Johnson",
    role: "Scholarship Advisor, Yale University",
    avatar: "/placeholder.svg?height=48&width=48",
    mutualConnections: 23,
    expertise: [
      "University Admissions",
      "Financial Aid",
      "Ivy League Applications",
    ],
  },
];

export const SCHOLARSHIP_CATEGORIES = [
  "Full Scholarships",
  "Partial Scholarships",
  "Merit-Based",
  "Need-Based",
  "Country-Specific",
  "Subject-Specific",
  "Undergraduate",
  "Graduate",
  "PhD",
  "Research Grants",
  "Exchange Programs",
  "Women in STEM",
  "Minority Support",
  "Sports Scholarships",
  "Arts & Humanities",
];

export const POPULAR_DESTINATIONS = [
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "Japan",
  "France",
  "Netherlands",
  "Singapore",
  "South Korea",
];
