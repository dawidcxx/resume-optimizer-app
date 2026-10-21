import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type StarsProps = ResumeComponentProps<"Stars">;

const STAR_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
} as const;

const STAR_PATH =
  "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52 6.12 20.6l1.12-6.55L2.48 9.42l6.58-.96L12 2.5z";

type StarIconProps = {
  size: number;
  filled: boolean;
};

function StarIcon({ size, filled }: StarIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="block"
      style={filled ? undefined : { opacity: 0.3 }}
    >
      <path
        d={STAR_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stars({ value, max, color, label, size, format }: StarsProps) {
  const theme = useResumeTheme();
  const starSize = STAR_SIZES[size];
  const total = Math.min(Math.max(Number.parseInt(max, 10), 1), 10);
  const numericValue = Number.parseFloat(value);
  const rating = Math.min(Math.max(Number.isFinite(numericValue) ? numericValue : 0, 0), total);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] print:break-inside-avoid">
      {label ? (
        <span className="min-w-0 [overflow-wrap:anywhere]" style={{ color: theme.text }}>
          {label}
        </span>
      ) : null}
      <span
        className="flex shrink-0 items-center gap-0.5"
        role="img"
        aria-label={`${rating} out of ${total}`}
        style={{ color: color ?? theme.accent }}
      >
        {Array.from({ length: total }, (_, index) => {
          const fill = Math.min(Math.max(rating - index, 0), 1);

          return (
            <span
              key={index}
              className="relative inline-block shrink-0"
              data-star-fill={fill}
              style={{ width: starSize, height: starSize }}
            >
              <StarIcon size={starSize} filled={false} />
              {fill > 0 ? (
                <span
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <StarIcon size={starSize} filled />
                </span>
              ) : null}
            </span>
          );
        })}
      </span>
      {format === "stars-value" ? (
        <span className="shrink-0 tabular-nums" style={{ color: theme.muted }}>
          {rating}/{total}
        </span>
      ) : null}
    </div>
  );
}
