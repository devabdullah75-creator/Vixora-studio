import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Compass, Play, Sliders } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  deliverable: string;
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    tagline: 'Understanding the idea and objective',
    description:
      'We deconstruct the creative brief, clarify the emotional core, dissect target demographics, and establish explicit benchmarks for what motion must achieve.',
    icon: <Search size={20} className="text-[#ccff00]" />,
    deliverable: 'Creative Brief & Reference Moodboard',
  },
  {
    number: '02',
    title: 'Explore',
    tagline: 'Developing visual concepts and directions',
    description:
      'Sketching visual trajectories through style frames, typographic hierarchies, color palettes, and preliminary kinetic animatics before committing to final production.',
    icon: <Compass size={20} className="text-[#ccff00]" />,
    deliverable: 'Style Frames & Motion Animatics',
  },
  {
    number: '03',
    title: 'Animate',
    tagline: 'Bringing the visual direction to life',
    description:
      'Full-scale choreography. Setting up keyframe curves, procedural physics solvers, 2D/3D lighting, and synchronizing visual cadence with custom audio scoring.',
    icon: <Play size={20} className="text-[#ccff00]" />,
    deliverable: 'Full Kinetic Renders & 60fps Drafts',
  },
  {
    number: '04',
    title: 'Refine',
    tagline: 'Polishing movement, timing and details',
    description:
      'Obsessive frame-by-frame scrutiny: fine-tuning easing curves, color grading, motion blur, asset optimization, and exporting master renders across required delivery specs.',
    icon: <Sliders size={20} className="text-[#ccff00]" />,
    deliverable: 'Final Multi-Format Master Package',
  },
];

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      ({ conditions }) => {
        if (conditions?.reduceMotion) return;

        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
          y: conditions?.isMobile ? 24 : 40,
          opacity: 0,
          duration: conditions?.isMobile ? 0.8 : 1,
          ease: 'power3.out',
        });

        if (stepsContainerRef.current) {
          gsap.from(Array.from(stepsContainerRef.current.children), {
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: 'top 85%',
            },
            y: conditions?.isMobile ? 24 : 50,
            opacity: 0,
            duration: conditions?.isMobile ? 0.7 : 0.9,
            stagger: conditions?.isMobile ? 0.1 : 0.18,
            ease: 'power2.out',
          });
        }
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      {/* Header */}
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-12 sm:mb-16 sm:flex-row sm:items-center sm:justify-between">
        <span>06 // METHODOLOGY & STAGES</span>
        <span>HOW WORK GETS MADE</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 sm:mb-20">
        <div>
          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white uppercase"
          >
            CREATIVE PROCESS
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-zinc-400 font-light max-w-2xl">
            A disciplined, four-phase kinetic pipeline engineered to take complex ideas from abstract intention to unforgettable screen execution.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500 uppercase">
          LINEAR 4-STAGE PIPELINE
        </div>
      </div>

      {/* 4-Step Cards Grid */}
      <div
        ref={stepsContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {steps.map((step) => (
          <div
            key={step.number}
            className="group relative p-8 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#ccff00]/40 transition-all duration-300 flex flex-col justify-between space-y-8"
          >
            {/* Top Bar with Number & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-display font-black text-zinc-600 group-hover:text-[#ccff00] transition-colors">
                {step.number}
              </span>
              <div className="p-2.5 rounded-full bg-white/[0.03] border border-white/5 group-hover:bg-[#ccff00]/10 transition-colors">
                {step.icon}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-display font-bold text-white group-hover:text-[#ccff00] transition-colors">
                {step.title}
              </h3>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                {step.tagline}
              </p>
              <p className="text-sm text-zinc-300 font-light leading-relaxed pt-2">
                {step.description}
              </p>
            </div>

            {/* Deliverable Badge */}
            <div className="pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                KEY DELIVERABLE
              </span>
              <span className="text-xs font-mono text-zinc-300 font-medium">
                {step.deliverable}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
