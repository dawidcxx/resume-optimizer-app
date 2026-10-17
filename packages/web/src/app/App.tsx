import { useState } from "react";
import { useResumeProjects } from "@/store";
import { Button, Heading, Text, ThemeSwitcher } from "@/ui";
import { CreateResumeProjectDialog } from "./CreateResumeProjectDialog";
import { ResumeProjectTile } from "./ResumeProjectTile";

export function App() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const projects = useResumeProjects();

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
          <div className="mb-4 flex items-center justify-between gap-4">
            <Heading level={3}>Your resumes</Heading>
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              New resume
            </Button>
          </div>

          {projects.length === 0 ? (
            <Text variant="muted">No resumes yet. Create one to get started.</Text>
          ) : (
            <div className="flex flex-wrap gap-4">
              {projects.map((project) => (
                <ResumeProjectTile key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateResumeProjectDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
