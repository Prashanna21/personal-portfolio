/**
 * The flat mark. Also the pre-paint fallback the hero's 3D monogram upgrades
 * from, so both must sit on the same optical square.
 */
export function Monogram({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-[8px] bg-ink font-display leading-none text-paper transition-colors duration-500 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden
    >
      <span style={{ transform: 'translateY(0.04em)', letterSpacing: '-0.02em' }}>PM</span>
    </span>
  );
}
