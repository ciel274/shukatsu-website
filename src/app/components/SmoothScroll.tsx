import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    let current = 0;
    let target = 0;
    let ease = 0.075;

    const smoothScroll = () => {
      target = window.scrollY;
      current += (target - current) * ease;

      if (Math.abs(target - current) < 0.1) {
        current = target;
      }

      document.documentElement.style.setProperty('--scroll', `${current}px`);

      requestAnimationFrame(smoothScroll);
    };

    smoothScroll();

    return () => {
      document.documentElement.style.removeProperty('--scroll');
    };
  }, []);

  return null;
}
