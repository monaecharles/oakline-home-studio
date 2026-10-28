export function LogoMark({ size = 32 }: { size?: number }) {
  // Open-corner floor plan: three walls meet, one corner left open as a doorway.
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" fill="none">
      <path d="M4 14V4h22" stroke="currentColor" strokeWidth="2.5" />
      <path d="M36 4v32H14" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 22v14h4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M20 4v14h16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 36a10 10 0 0 0-4-8" stroke="var(--brass)" strokeWidth="1.2" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-3 text-primary">
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-[21px] tracking-[0.04em]">Oakline</span>
        <span className="mt-1 block text-[10.5px] font-semibold uppercase tracking-[0.32em] text-walnut">Custom Homes</span>
      </span>
    </span>
  );
}
