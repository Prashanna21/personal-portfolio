'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Project } from '@/data/projects';
import { AuthSyncMock } from './home/AuthSyncMock';
import { ArrowUpRight, Close, Play } from './icons';
import shots from '@/data/shot-placeholders.json';

const blurFor = (slug: string) =>
  (shots as Record<string, { blurDataURL?: string }>)[slug]?.blurDataURL;

/**
 * A project's visual. Browser chrome wrapping one of three states:
 *
 *   1. a static screenshot  — the default; fast, and always correct
 *   2. a live iframe        — opt-in, and ONLY when `embeddable` was verified
 *                             against the site's real X-Frame-Options / CSP
 *   3. a designed mock      — when there is nothing honest to screenshot
 *
 * The point of gating (2) is that a denied frame renders as a silent blank box,
 * which looks like a bug in this site rather than a policy on theirs.
 */
export function ProjectFrame({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const [live, setLive] = useState(false);
  const canGoLive = project.embeddable && !project.offline && Boolean(project.href);

  return (
    <figure className="group/frame m-0">
      <div className="overflow-clip rounded-[14px] border border-rule bg-surface shadow-[0_30px_60px_-40px_rgb(var(--shadow-color)/0.35)] transition-colors duration-500">
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
          <span className="flex gap-[6px]" aria-hidden>
            <span className="h-[9px] w-[9px] rounded-full bg-[#e25b4d]" />
            <span className="h-[9px] w-[9px] rounded-full bg-[#e9b949]" />
            <span className="h-[9px] w-[9px] rounded-full bg-[#3fb27f]" />
          </span>
          <span className="ml-2 min-w-0 flex-1 truncate font-mono text-[10.5px] tracking-[0.06em] text-ink-3">
            {project.shotCaption}
          </span>

          {canGoLive ? (
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-rule px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-rule-2 hover:text-ink"
              aria-pressed={live}
            >
              {live ? (
                <>
                  <Close width={10} height={10} /> Close
                </>
              ) : (
                <>
                  <Play width={9} height={9} /> Live
                </>
              )}
            </button>
          ) : project.href && !project.offline ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-rule px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-rule-2 hover:text-ink"
              // this site refuses to be framed, so the only honest affordance
              // is to leave
              title="This site does not allow embedding"
            >
              Open <ArrowUpRight width={10} height={10} />
            </a>
          ) : null}
        </div>

        {/* body */}
        <div className="relative aspect-[16/10] w-full bg-paper-2">
          {live && project.href ? (
            <iframe
              src={project.href}
              title={`${project.title} — live preview`}
              loading="lazy"
              // scaled down so a desktop layout reads correctly in the frame
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{ width: '175%', height: '175%', transform: 'scale(0.5714)' }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          ) : project.shot ? (
            <picture>
              <source srcSet={`/work/${project.shot}.avif`} type="image/avif" />
              <Image
                src={`/work/${project.shot}.webp`}
                alt={project.shotAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={priority}
                {...(blurFor(project.shot)
                  ? { placeholder: 'blur' as const, blurDataURL: blurFor(project.shot) }
                  : {})}
                className="object-cover object-top"
              />
            </picture>
          ) : (
            <AuthSyncMock />
          )}
        </div>
      </div>

      {project.offline && (
        <figcaption className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3">
          Desktop application · interface representation
        </figcaption>
      )}
    </figure>
  );
}
