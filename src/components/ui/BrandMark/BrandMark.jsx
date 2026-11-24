// The Juniper Lane mark: a juniper sprig with one berry. Decorative, so hidden from screen readers.
export default function BrandMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#0f6b62" />
      <g fill="none" stroke="#e9f2ef" strokeWidth="1.8" strokeLinecap="round">
        <path d="M16 26V13" />
        <path d="M16 23l-5-3.5M16 23l5-3.5M16 18.5l-6-4M16 18.5l6-4" />
      </g>
      <circle cx="16" cy="9" r="3" fill="#b8b2ff" />
    </svg>
  );
}
