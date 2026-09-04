import { SectionHeader } from '@/components/SectionHeader';
import { StackGraph } from '@/components/stack/StackGraph';
import { StackGraphSVG } from '@/components/stack/StackGraphSVG';

export function Stack() {
  return (
    <section id="stack" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeader
        index="04"
        eyebrow="Technology ecosystem"
        title={<>How it all connects.</>}
        rule={false}
        aside={
          <>
            Not a list of skill bars — a living map of the tools I reach for, and how they actually
            depend on each other. Isolate a domain, or follow a single node to see what it touches.
          </>
        }
      />

      <div className="mt-10">
        <StackGraph fallback={<StackGraphSVG className="max-h-full" />} />
      </div>
    </section>
  );
}
