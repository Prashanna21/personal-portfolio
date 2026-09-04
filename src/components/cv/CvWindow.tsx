'use client';

import { useState } from 'react';
import { site } from '@/lib/site';
import { Doc, Download } from '@/components/icons';

/**
 * Browser-window chrome around the résumé, with an HTML/PDF switch.
 *
 * The PDF `<iframe>` is only created once someone asks for it — mounting it
 * eagerly would cost a 122KB download and a plugin instantiation on a page most
 * visitors will read as HTML.
 */
export function CvWindow({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'html' | 'pdf'>('html');

  return (
    <div className="overflow-clip rounded-2xl border border-rule bg-surface shadow-[0_40px_90px_-60px_rgb(var(--shadow-color)/0.4)] transition-colors duration-500">
      <div className="flex items-center gap-3 border-b border-rule bg-[color-mix(in_srgb,var(--ink)_3%,var(--surface))] px-4 py-3">
        <span className="hidden gap-[6px] sm:flex" aria-hidden>
          <span className="h-[11px] w-[11px] rounded-full bg-[#e25b4d]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#e9b949]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#3fb27f]" />
        </span>

        <span className="flex min-w-0 flex-1 items-center justify-center gap-2 truncate text-meta text-ink-2">
          <Doc width={13} height={13} className="shrink-0 opacity-60" />
          <span className="truncate">Prashanna-Maharjan-CV</span>
        </span>

        <div
          className="flex shrink-0 items-center rounded-lg border border-rule p-[3px]"
          role="group"
          aria-label="Résumé format"
        >
          {(['html', 'pdf'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className="rounded-[6px] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors duration-200"
              style={{
                background: mode === m ? 'var(--ink)' : 'transparent',
                color: mode === m ? 'var(--paper)' : 'var(--ink-3)',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <a
          href={site.cv}
          download
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rule px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-rule-2 hover:text-ink"
        >
          <Download width={11} height={11} />
          <span className="hidden sm:inline">PDF</span>
        </a>
      </div>

      {mode === 'html' ? (
        children
      ) : (
        <iframe
          src={`${site.cv}#view=FitH&toolbar=0&navpanes=0`}
          title={`${site.name} — résumé (PDF)`}
          className="block h-[min(80vh,900px)] w-full bg-white"
        />
      )}
    </div>
  );
}
