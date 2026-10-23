import { Button, Text } from "@/ui";
import { StepFormDots } from "../../components/StepFormDots";

export type FloatingStepIndicatorProps = {
  steps: readonly string[];
  currentStepIndex: number;
  onBack: () => void;
  onNext: () => void;
};

export function FloatingStepIndicator({
  steps,
  currentStepIndex,
  onBack,
  onNext,
}: FloatingStepIndicatorProps) {
  const label = steps[currentStepIndex] ?? "";
  const isLast = currentStepIndex >= steps.length - 1;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-surface/95 py-1.5 ps-4 pe-1.5 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <Text variant="subtle" className="hidden font-medium text-foreground sm:block">
            {label}
          </Text>
          <StepFormDots
            currentStepIndex={currentStepIndex}
            totalStepCount={steps.length}
            labels={steps}
          />
          <Text variant="subtle" className="hidden sm:block">
            {currentStepIndex + 1}/{steps.length}
          </Text>
        </div>

        <div className="flex items-center gap-1">
          {currentStepIndex > 0 ? (
            <Button variant="ghost" size="sm" shape="pill" onClick={onBack}>
              Back
            </Button>
          ) : null}
          <Button variant="primary" size="sm" shape="pill" onClick={onNext} disabled={isLast}>
            {isLast ? "Finish" : "Continue"}
            {isLast ? null : <ArrowRightIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}