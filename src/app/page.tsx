import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { Work } from '@/components/home/Work';
import { Experience } from '@/components/home/Experience';
import { Stack } from '@/components/home/Stack';
import { CvSection } from '@/components/home/CvSection';
import { Contact } from '@/components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Stack />
      <CvSection />
      <Contact />
    </>
  );
}
