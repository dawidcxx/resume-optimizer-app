export type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="7" fill="#1a73e8" />
      <path d="M8 5h9l7 7v15H8z" fill="#fff" />
      <path d="M17 5v7h7" fill="#d2e3fc" />
      <path
        d="M12 13h5M12 16.5h4"
        stroke="#1a73e8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".55"
      />
      <path
        d="m11 21 2 2 4-5"
        stroke="#188038"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}