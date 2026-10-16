import { type ResumeProject, uuidFromString } from "@resume-optimzer-app/common";
import { Heading, ThemeSwitcher } from "@/ui";
import { ResumeProjectTile } from "./ResumeProjectTile";

const demoProject: ResumeProject = {
  id: uuidFromString("3f1a9c2e-5b7d-4e8f-9a1b-2c3d4e5f6a7b"),
  version: "v1",
  name: "Senior Frontend Engineer",
  createdAt: new Date("2025-01-12T09:30:00Z"),
  updatedAt: new Date("2025-03-04T16:45:00Z"),
};

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-ui bg-primary text-[10px] font-semibold text-primary-foreground">
            R
          </span>
          <span className="text-sm font-medium">Resume Optimizer</span>
        </div>
        <ThemeSwitcher />
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl">
          <Heading level={3} className="mb-4">
            Your resumes
          </Heading>
          <div className="flex flex-wrap gap-4">
            <ResumeProjectTile project={demoProject} />
          </div>
        </div>
      </main>
    </div>
  );
}
