/**
 * Auth Sync is a desktop app whose UI sits behind a login, and true2fa.com is
 * currently serving no site — so there is nothing honest to screenshot. This is
 * a designed representation of the product built from the tokens, not a
 * screenshot pretending to be one. It is theme-aware, weighs nothing, and stays
 * crisp at any size.
 */
const ENTRIES = [
  { issuer: 'GitHub', account: 'prashanna21', code: '481 902', pct: 0.72 },
  { issuer: 'AWS', account: 'root@vrit', code: '236 574', pct: 0.72 },
  { issuer: 'Vercel', account: 'team', code: '905 118', pct: 0.72 },
];

function Ring({ pct }: { pct: number }) {
  const C = 2 * Math.PI * 9;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0 -rotate-90">
      <circle cx="11" cy="11" r="9" fill="none" stroke="var(--rule)" strokeWidth="2" />
      <circle
        cx="11"
        cy="11"
        r="9"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${(C * pct).toFixed(2)} ${C.toFixed(2)}`}
      />
    </svg>
  );
}

export function AuthSyncMock() {
  return (
    <div className="flex aspect-[16/10] w-full flex-col bg-paper-2 p-[4%]">
      <div className="flex items-center justify-between">
        <span className="eyebrow eyebrow-accent">Encrypted vault</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-ink-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e6b]" />
          <span className="font-mono uppercase tracking-[0.12em]">Synced</span>
        </span>
      </div>

      <div className="mt-[3.5%] flex flex-1 flex-col justify-center gap-[2.5%]">
        {ENTRIES.map((e) => (
          <div
            key={e.issuer}
            className="flex items-center gap-[3%] rounded-lg border border-rule bg-surface px-[3.5%] py-[2.6%]"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-wash font-display text-[13px] leading-none text-accent">
              {e.issuer[0]}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[12px] font-medium text-ink">{e.issuer}</span>
              <span className="block truncate text-[10px] text-ink-3">{e.account}</span>
            </span>
            <span className="font-mono text-[15px] font-medium tracking-[0.06em] text-ink tabular">
              {e.code}
            </span>
            <Ring pct={e.pct} />
          </div>
        ))}
      </div>

      <div className="mt-[3%] flex items-center gap-2 border-t border-rule pt-[2.5%]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" aria-hidden>
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">
          AES-256-GCM · client-side only
        </span>
      </div>
    </div>
  );
}
