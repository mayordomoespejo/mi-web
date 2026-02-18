/**
 * Chevron/arrow pointing right (e.g. for wheel picker selector).
 * Color via currentColor so parent can control it.
 */
export default function ChevronRightIcon({ className, ...props }) {
  return (
    <svg
      className={className}
      width="6"
      height="10"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M1 13L7 7L1 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
