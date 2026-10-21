import {
  RENDER_AI_INSTRUCTIONS_MAX_LENGTH,
  RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH,
} from "@resume-optimzer-app/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from "@/ui";
import { Field } from "@/ui/form";

export type RenderStepValue = {
  aiInstructions: string;
  targetJobDescription: string;
};

export type RenderStepProps = {
  value: RenderStepValue;
  onChange: (patch: Partial<RenderStepValue>) => void;
};

export function RenderStep({ value, onChange }: RenderStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Render</CardTitle>
        <CardDescription>
          Describe the feel you want and, optionally, the role to target.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field
          id="ai-instructions"
          label="AI instructions"
          description={
            <span className="flex justify-between gap-3">
              <span>
                Describe the tone, mood, layout, colours, or anything else that should shape
                this version.
              </span>
              <span className="shrink-0">
                {value.aiInstructions.length}/{RENDER_AI_INSTRUCTIONS_MAX_LENGTH}
              </span>
            </span>
          }
        >
          <Textarea
            id="ai-instructions"
            rows={5}
            maxLength={RENDER_AI_INSTRUCTIONS_MAX_LENGTH}
            value={value.aiInstructions}
            onChange={(event) => onChange({ aiInstructions: event.target.value })}
            placeholder="Warm and welcoming, with an artsy editorial layout, soft pink accents, and clean typography."
          />
        </Field>

        <Field
          id="target-job-description"
          label="Target job description"
          description={
            <span className="flex justify-between gap-3">
              <span>
                Optional. Paste the job description to focus this version on a specific
                position.
              </span>
              <span className="shrink-0">
                {value.targetJobDescription.length}/{RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH}
              </span>
            </span>
          }
        >
          <Textarea
            id="target-job-description"
            rows={5}
            maxLength={RENDER_TARGET_JOB_DESCRIPTION_MAX_LENGTH}
            value={value.targetJobDescription}
            onChange={(event) => onChange({ targetJobDescription: event.target.value })}
            placeholder="Paste the role, responsibilities, and requirements here."
          />
        </Field>
      </CardContent>
    </Card>
  );
}
