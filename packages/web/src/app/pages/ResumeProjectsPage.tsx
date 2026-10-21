import type { ResumeProject } from "@resume-optimzer-app/common";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  createResumeProjectFromImport,
  DEFAULT_RESUME_PROJECT_NAME,
  deleteResumeProject,
  nextResumeProjectName,
  useResumeProjects,
  useStoreReady,
} from "@/store";
import { Button, ConfirmDialog, Heading, Text } from "@/ui";
import { CreateResumeProjectDialog } from "../resume/CreateResumeProjectDialog";
import { ImportResumeDialog } from "../resume/ImportResumeDialog";
import { ResumeProjectTile } from "../resume/ResumeProjectTile";

export function ResumeProjectsPage() {
  const [createName, setCreateName] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ResumeProject | null>(null);
  const projects = useResumeProjects();
  const ready = useStoreReady();
  const [, navigate] = useLocation();

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Heading level={3}>Your resumes</Heading>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            Import
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              setCreateName(nextResumeProjectName(projects.map((project) => project.name)))
            }
          >
            New resume
          </Button>
        </div>
      </div>

      {!ready ? (
        <Text variant="muted">Loading resumes…</Text>
      ) : projects.length === 0 ? (
        <Text variant="muted">No resumes yet. Create one to get started.</Text>
      ) : (
        <div className="flex flex-wrap gap-4">
          {projects.map((project) => (
            <ResumeProjectTile
              key={project.id}
              project={project}
              href={`/resume/${project.id}/edit`}
              onDelete={setProjectToDelete}
            />
          ))}
        </div>
      )}

      <CreateResumeProjectDialog
        open={createName !== null}
        defaultName={createName ?? DEFAULT_RESUME_PROJECT_NAME}
        onOpenChange={(open) => {
          if (!open) setCreateName(null);
        }}
      />

      <ImportResumeDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={(resume) => {
          const project = createResumeProjectFromImport({
            name: nextResumeProjectName(
              projects.map((project) => project.name),
              resume.fullName.trim() ? `${resume.fullName.trim()} Resume` : "Imported resume",
            ),
            resume,
          });
          navigate(`/resume/${project.id}/edit`);
        }}
      />

      <ConfirmDialog
        open={projectToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null);
        }}
        title="Delete resume?"
        description={
          projectToDelete
            ? `“${projectToDelete.name}” will be permanently deleted from this device. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (projectToDelete) deleteResumeProject(projectToDelete.id);
        }}
      />
    </>
  );
}
