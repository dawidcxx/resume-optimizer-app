export const RESUME_PROJECTS_TABLE = "resume_projects";
export const RESUMES_TABLE = "resumes";

export const RESUME_PROJECT_CELLS = {
  version: "version",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const RESUME_CELLS = {
  fullName: "fullName",
  careerName: "careerName",
  contact: "contact",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
} as const;
