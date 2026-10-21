import { cn } from "@/lib/cn";

export type StepFormDotsProps = {
  currentStepIndex: number;
  totalStepCount: number;
  labels?: readonly string[];
  className?: string;
};

export function StepFormDots({
  currentStepIndex,
  totalStepCount,
  labels,
  className,
}: StepFormDotsProps) {
  const current = Math.min(Math.max(currentStepIndex, 0), Math.max(totalStepCount - 1, 0));
  const currentLabel = labels?.[current];
  const valueText = `Step ${current + 1} of ${totalStepCount}${
    currentLabel ? `: ${currentLabel}` : ""
  }`;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="progressbar"
      aria-label="Form progress"
      aria-valuemin={1}
      aria-valuemax={totalStepCount}
      aria-valuenow={current + 1}
      aria-valuetext={valueText}
    >
      {Array.from({ length: totalStepCount }, (_, index) => (
        <StepDot key={index} index={index} currentStepIndex={current} />
      ))}
    </div>
  );
}

function StepDot({ index, currentStepIndex }: { index: number; currentStepIndex: number }) {
  const isCompleted = index < currentStepIndex;
  const isCurrent = index === currentStepIndex;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-2 rounded-full transition-all duration-300",
        isCurrent && "w-8 bg-primary",
        isCompleted && "w-2 bg-primary/40",
        !isCurrent && !isCompleted && "w-2 bg-border",
      )}
    />
  );
}
