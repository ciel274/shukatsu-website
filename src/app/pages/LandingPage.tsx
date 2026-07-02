import { useRef, useState, useEffect, ReactNode, memo } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FeatureShowcase from '../components/FeatureShowcase';
import KanbanShowcase from '../components/KanbanShowcase';
import Story from '../components/Story';
import Security from '../components/Security';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import CTA from '../components/CTA';
import FloatingCTA from '../components/FloatingCTA';

// Safe Viewport Wrapper: Prevents rendering until visible to save CPU/Memory
const LazySection = memo(({ children, id }: { children: ReactNode; id?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={ref} className="min-h-[100px]">
      {isVisible ? children : <div className="h-40" />}
    </div>
  );
});

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] transition-colors duration-500 overflow-x-hidden">
      <Hero />
      <Features />
      
      {/* 
        High-Safety Lightweighting: 
        Design is kept 100%, but components only "exist" when scrolled.
        This avoids Chrome Extension dynamic import errors.
      */}
      <LazySection><FeatureShowcase /></LazySection>
      <LazySection><KanbanShowcase /></LazySection>
      <LazySection><Story /></LazySection>
      <LazySection id="security"><Security /></LazySection>
      <LazySection id="faq"><FAQ /></LazySection>
      <LazySection id="contact"><Contact /></LazySection>
      <LazySection><CTA /></LazySection>
      <LazySection><FloatingCTA /></LazySection>
    </div>
  );
}
