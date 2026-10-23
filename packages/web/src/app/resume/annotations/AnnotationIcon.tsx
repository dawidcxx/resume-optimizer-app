export function AnnotationIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4.25 4.75h11.5v8.5H8.5l-3.25 2.5v-2.5h-1z" />
      <path d="M7 7.75h6M7 10.25h4" />
    </svg>
  );
}