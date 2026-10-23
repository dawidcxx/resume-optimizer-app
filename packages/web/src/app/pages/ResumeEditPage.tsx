import { isUuid } from "@resume-optimzer-app/common";
import { useParams } from "wouter";
import { createEmptyResume, useResumeBundle, useStoreReady } from "@/store";
import { ResumeEditForm } from "../resume/edit/ResumeEditForm";
import { ResumeLoading } from "../resume/ResumeLoading";
import { ResumeNotFound } from "../resume/ResumeNotFound";

export function ResumeEditPage() {
  const { id } = useParams<"/resume/:id/edit">();
  const ready = useStoreReady();
  const bundle = useResumeBundle(isUuid(id) ? id : "");

  if (!bundle) return ready ? <ResumeNotFound /> : <ResumeLoading />;

  return (
    <ResumeEditForm
      key={bundle.project.id}
      projectName={bundle.project.name}
      resume={bundle.resume ?? { id: bundle.project.id, ...createEmptyResume() }}
    />
  );
}