/**
 * Every section opens the same way: a numbered chapter mark, a rule, the
 * display heading, and an optional aside pinned to the baseline on the right.
 * Keeping this in one place is what makes the page read as one document.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  aside,
  children,
  rule = true,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  rule?: boolean;
}) {
  return (
    <div
      className={`reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-6 ${
        rule ? 'border-b border-rule pb-7' : ''
      }`}
    >
      <div className="max-w-[42ch]">
        <p className="flex items-center gap-2.5">
          <span className="section-mark">{index}</span>
          <span className="h-px w-5 bg-rule-2" />
          <span className="eyebrow">{eyebrow}</span>
        </p>
        <h2 className="mt-5 font-display text-d2">{title}</h2>
        {children}
      </div>
      {aside && <div className="max-w-[36ch] text-meta leading-relaxed text-ink-2">{aside}</div>}
    </div>
  );
}
