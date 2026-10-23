import type {
  RenderTurnResponse,
  Resume,
  ResumeAnnotations,
} from "@resume-optimzer-app/common";
import { useState } from "react";
import { renderResume } from "@/api/render";
import { saveResumeRender, updateResumeRender, useResumeRenders } from "@/store";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from "@/ui";
import { validateResumeMarkup } from "@/ui/resume";
import { PrintIcon } from "../print/PrintIcon";
import { ResumePrintPreview } from "../print/ResumePrintPreview";
import { RenderedResume } from "../render/RenderedResume";
import { RenderChatPanel } from "./RenderChatPanel";

export type PreviewStepProps = {
  projectId: string;
  projectName: string;
  resume: Resume;
  annotations: ResumeAnnotations;
  aiInstructions: string;
  targetJobDescription: string;
};

export function PreviewStep({
  projectId,
  projectName,
  resume,
  annotations,
  aiInstructions,
  targetJobDescription,
}: PreviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renders = useResumeRenders(projectId);
  const latest = renders[0];

  async function handleGenerate(): Promise<void> {
    if (isGenerating || isChatting) return;

    setIsGenerating(true);
    setError(null);

    try {
      const render = await renderResume({
        resume,
        annotations,
        aiInstructions,
        targetJobDescription,
      });
      const validationError = validateResumeMarkup(render.markup);
      if (validationError) {
        setError(validationError);
        return;
      }
      saveResumeRender({
        projectId: resume.id,
        chatId: render.chatId,
        markup: render.markup,
      });
    } catch (renderError) {
      setError(renderError instanceof Error ? renderError.message : "Could not render the resume.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleChatTurn(turn: RenderTurnResponse): void {
    const validationError = validateResumeMarkup(turn.markup);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!latest || latest.chatId !== turn.chatId) return;
    updateResumeRender({ id: latest.id, markup: turn.markup });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Generate a rendered version from your resume, instructions, and target job
                description.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {latest ? (
                <Button variant="outline" size="sm" onClick={() => setIsPrinting(true)}>
                  <PrintIcon className="h-4 w-4" />
                  Print
                </Button>
              ) : null}
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleGenerate()}
                disabled={isGenerating || isChatting}
              >
                {isGenerating ? "Rendering…" : latest ? "Regenerate" : "Generate render"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          {error ? (
            <Text variant="subtle" className="text-danger">
              {error}
            </Text>
          ) : null}

          {latest ? (
            <div
              className={
                latest.chatId
                  ? "grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"
                  : "grid gap-4"
              }
            >
              <div className="grid min-w-0 gap-4">
                <Text variant="subtle">Rendered {latest.createdAt.toLocaleString()}</Text>
                <RenderedResume markup={latest.markup} />
              </div>
              {latest.chatId ? (
                <RenderChatPanel
                  key={latest.chatId}
                  chatId={latest.chatId}
                  onTurn={handleChatTurn}
                  onBusyChange={setIsChatting}
                />
              ) : null}
            </div>
          ) : (
            <div className="grid min-h-52 place-items-center rounded-ui border border-dashed border-border-strong bg-subtle p-6 text-center">
              <Text variant="muted" className="max-w-sm">
                {isGenerating
                  ? "Generating your resume preview…"
                  : "No render yet. Generate one to preview it here."}
              </Text>
            </div>
          )}
        </CardContent>
      </Card>

      {isPrinting && latest ? (
        <ResumePrintPreview
          title={projectName}
          markup={latest.markup}
          onClose={() => setIsPrinting(false)}
        />
      ) : null}
    </>
  );
}