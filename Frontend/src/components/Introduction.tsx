import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Activity, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Introduction: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      ({ conditions }) => {
        if (conditions?.reduceMotion) return;

        const distance = conditions?.isMobile ? 28 : 60;
        const stagger = conditions?.isMobile ? 0.1 : 0.15;

        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
          y: distance,
          opacity: 0,
          duration: conditions?.isMobile ? 0.85 : 1.1,
          ease: 'power3.out',
        });

        gsap.from(textRef.current, {
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
          },
          y: conditions?.isMobile ? 22 : 40,
          opacity: 0,
          duration: conditions?.isMobile ? 0.8 : 1,
          ease: 'power3.out',
        });

        if (cardsRef.current) {
          gsap.from(Array.from(cardsRef.current.children), {
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 90%',
            },
            y: conditions?.isMobile ? 20 : 40,
            opacity: 0,
            duration: conditions?.isMobile ? 0.65 : 0.8,
            stagger,
            ease: 'power2.out',
          });
        }
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      {/* Editorial Index Header */}
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-12 sm:mb-16 sm:flex-row sm:items-center sm:justify-between">
        <span>02 // PHILOSOPHY & ETHOS</span>
        <span>THE KINETIC PERSPECTIVE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Monumental Statement */}
        <div className="lg:col-span-8">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.05]"
          >
            I TURN IDEAS INTO{' '}
            <span className="text-[#ccff00] underline decoration-1 underline-offset-8">
              VISUAL
            </span>{' '}
            EXPERIENCES.
          </h2>

          <p
            ref={textRef}
            className="mt-8 sm:mt-10 text-xl sm:text-2xl lg:text-3xl font-light text-zinc-300 leading-relaxed max-w-3xl"
          >
            I explore the intersection of{' '}
            <span className="text-white font-normal">design</span>,{' '}
            <span className="text-white font-normal">movement</span> and{' '}
            <span className="text-white font-normal">storytelling</span> to create visuals that
            communicate with purpose and resonate with unforgettable velocity.
          </p>
        </div>

        {/* Right Column: Key Tenets / Decorative Technical Metrics */}
        <div ref={cardsRef} className="lg:col-span-4 space-y-6 pt-4 lg:pt-0">
          <div className="p-6 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#ccff00]/40 transition-colors">
            <div className="flex items-center gap-3 text-sm font-mono text-[#ccff00] mb-2">
              <Activity size={16} />
              <span>CHOREOGRAPHED PACING</span>
            </div>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Every frame is calibrated for emotional retention, utilizing tension, release, and harmonic easing curves.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#ccff00]/40 transition-colors">
            <div className="flex items-center gap-3 text-sm font-mono text-[#ccff00] mb-2">
              <Layers size={16} />
              <span>TACTILE FIDELITY</span>
            </div>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Combining 2D graphical rigor with 3D physical behaviors, refractive surfaces, and procedural grain.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#ccff00]/40 transition-colors">
            <div className="flex items-center gap-3 text-sm font-mono text-[#ccff00] mb-2">
              <Eye size={16} />
              <span>CINEMATIC INTENT</span>
            </div>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Translating brand propositions into kinetic metaphors that captivate audiences within seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
