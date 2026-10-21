import type { Resume } from "@resume-optimzer-app/common";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Heading, Text } from "@/ui";
import { FloatingStepIndicator } from "./FloatingStepIndicator";
import { PreviewStep } from "./PreviewStep";
import { RenderStep, type RenderStepValue } from "./RenderStep";
import { BasicsSection } from "./sections/BasicsSection";
import { ContactSection } from "./sections/ContactSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";

const STEPS = ["Details", "Render", "Preview"] as const;

export type ResumeEditFormProps = {
  projectName: string;
  resume: Resume;
};

export function ResumeEditForm({ projectName, resume }: ResumeEditFormProps) {
  const [draft, setDraft] = useState<Resume>(() => structuredClone(resume));
  const [renderDraft, setRenderDraft] = useState<RenderStepValue>({
    aiInstructions: "",
    targetJobDescription: "",
  });
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return (
    <>
      <div className="pb-28">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to resumes
          </Link>
          <Heading level={2} className="mt-2">
            {projectName}
          </Heading>
          <Text variant="muted" className="mt-1">
            These details are the source for every version of this resume.
          </Text>
        </div>

        <div className="grid gap-6">
          {currentStep === 0 ? (
            <>
              <BasicsSection
                value={draft}
                onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
              />
              <ContactSection
                value={draft.contact}
                onChange={(contact) => setDraft((current) => ({ ...current, contact }))}
              />
              <ExperienceSection
                value={draft.experience}
                onChange={(experience) => setDraft((current) => ({ ...current, experience }))}
              />
              <EducationSection
                value={draft.education}
                onChange={(education) => setDraft((current) => ({ ...current, education }))}
              />
              <SkillsSection
                value={draft.skills}
                onChange={(skills) => setDraft((current) => ({ ...current, skills }))}
              />
              <ProjectsSection
                value={draft.projects}
                onChange={(projects) => setDraft((current) => ({ ...current, projects }))}
              />
            </>
          ) : currentStep === 1 ? (
            <RenderStep
              value={renderDraft}
              onChange={(patch) =>
                setRenderDraft((current) => ({ ...current, ...patch }))
              }
            />
          ) : (
            <PreviewStep
              projectId={resume.id}
              projectName={projectName}
              resume={draft}
              aiInstructions={renderDraft.aiInstructions}
              targetJobDescription={renderDraft.targetJobDescription}
            />
          )}
        </div>
      </div>

      <FloatingStepIndicator
        steps={STEPS}
        currentStepIndex={currentStep}
        onBack={() => setCurrentStep((step) => Math.max(step - 1, 0))}
        onNext={() => setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1))}
      />
    </>
  );
}
