import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 1101px)');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('preloader-active');

    const mm = gsap.matchMedia();
    let completed = false;
    let activeTimeline: gsap.core.Timeline | null = null;
    let fallbackTimer: number | undefined;
    const complete = () => {
      if (completed) return;
      completed = true;
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      activeTimeline?.kill();
      activeTimeline = null;
      setPercent(100);
      if (containerRef.current) {
        gsap.set(containerRef.current, { yPercent: -100 });
        containerRef.current.style.display = 'none';
      }
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove('preloader-active');
      onComplete();
    };

    mm.add(
      {
        isMobile: '(max-width: 1100px)',
        isDesktop: '(min-width: 1101px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      ({ conditions }) => {
        const isMobile = Boolean(conditions?.isMobile);
        const reduceMotion = Boolean(conditions?.reduceMotion);
        const duration = reduceMotion ? 0.6 : isMobile ? 1.8 : 3.5;
        const exitDuration = reduceMotion ? 0.25 : isMobile ? 0.55 : 0.8;
        const startAnimation = () => {
          if (completed || activeTimeline) return;

          setPercent(0);
          const counter = { value: 0 };
          activeTimeline = gsap.timeline({ onComplete: complete });

          activeTimeline
            .to(counter, {
              value: 100,
              duration,
              ease: reduceMotion ? 'none' : 'power2.inOut',
              onUpdate: () => setPercent(Math.floor(counter.value)),
            })
            .to(containerRef.current, {
              yPercent: -100,
              duration: exitDuration,
              ease: reduceMotion ? 'none' : 'power4.inOut',
            });

          fallbackTimer = window.setTimeout(
            complete,
            (duration + exitDuration + 1) * 1000,
          );
        };

        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            activeTimeline?.pause();
            return;
          }

          activeTimeline?.resume();
          startAnimation();
          if (activeTimeline && fallbackTimer === undefined) {
            fallbackTimer = window.setTimeout(
              complete,
              (duration + exitDuration + 1) * 1000,
            );
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        startAnimation();

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          activeTimeline?.kill();
          activeTimeline = null;
          if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
        };
      },
    );

    return () => {
      mm.revert();
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove('preloader-active');
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden bg-black text-white select-none"
      aria-label="Loading website"
      role="status"
    >
      {isDesktop && (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/images/Comp%201_1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-end gap-3 p-6 text-right sm:p-10 md:p-14">
            <span className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.2em] text-white/80 sm:text-sm">
              Loading
            </span>
            <span
              className="font-['Montserrat'] text-5xl font-semibold leading-none tracking-tight sm:text-7xl md:text-8xl"
              aria-live="off"
            >
              {percent}%
            </span>
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      {!isDesktop && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src="/Group%203.png"
            alt="Vixora Studio"
            className="h-44 w-44 object-contain sm:h-52 sm:w-52"
          />
          <span
            className="mt-6 font-['Montserrat'] text-5xl font-semibold leading-none tracking-tight text-white"
            aria-live="off"
          >
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
};
