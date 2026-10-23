import { IconButton } from "./IconButton";

export type MoveButtonsProps = {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  label: string;
};

function Chevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d={direction === "up" ? "m5 12 5-5 5 5" : "m5 8 5 5 5-5"} />
    </svg>
  );
}

export function MoveButtons({ index, count, onMove, label }: MoveButtonsProps) {
  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={`Reorder ${label}`}>
      <IconButton
        size="sm"
        disabled={index === 0}
        aria-label={`Move ${label} up`}
        onClick={() => onMove(index, index - 1)}
      >
        <Chevron direction="up" />
      </IconButton>
      <IconButton
        size="sm"
        disabled={index >= count - 1}
        aria-label={`Move ${label} down`}
        onClick={() => onMove(index, index + 1)}
      >
        <Chevron direction="down" />
      </IconButton>
    </div>
  );
}