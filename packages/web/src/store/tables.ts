export const RESUME_PROJECTS_TABLE = "resume_projects";
export const RESUMES_TABLE = "resumes";
export const RESUME_RENDERS_TABLE = "resume_renders";

export const RESUME_PROJECT_CELLS = {
  version: "version",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const RESUME_CELLS = {
  fullName: "fullName",
  careerName: "careerName",
  aboutMe: "aboutMe",
  contact: "contact",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
} as const;

export const RESUME_RENDER_CELLS = {
  projectId: "projectId",
  markup: "markup",
  createdAt: "createdAt",
} as const;
