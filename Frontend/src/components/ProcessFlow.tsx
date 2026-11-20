import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, Compass, Play, Sliders, CheckCircle2, FileCode } from 'lucide-react';

const STEP_DURATION = 6;

interface FlowStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  file: string;
  icon: React.ReactNode;
  specs: string[];
}

const steps: FlowStep[] = [
  {
    number: '01',
    title: 'Discover',
    tagline: 'Understanding the idea and objective',
    description:
      'We deconstruct the creative brief, clarify the emotional core, dissect target demographics, and establish explicit benchmarks for what motion must achieve.',
    file: '01_brief_and_moodboard.pdf',
    icon: <Search size={18} className="text-[#1e5eff]" />,
    specs: ['Visual Direction Deck', 'Reference Moodboard', 'Pacing Benchmark'],
  },
  {
    number: '02',
    title: 'Explore',
    tagline: 'Developing visual concepts and directions',
    description:
      'Sketching visual trajectories through style frames, typographic hierarchies, color palettes, and preliminary kinetic animatics before committing to final production.',
    file: '02_styleframes_and_animatic.ai',
    icon: <Compass size={18} className="text-[#1e5eff]" />,
    specs: ['Vector Choreography', '3D Style Frames', 'Color & Lighting Test'],
  },
  {
    number: '03',
    title: 'Animate',
    tagline: 'Bringing the visual direction to life',
    description:
      'Full-scale choreography. Setting up keyframe curves, procedural physics solvers, 2D/3D lighting, and synchronizing visual cadence with custom audio scoring.',
    file: '03_motion_choreography_4k.aep',
    icon: <Play size={18} className="text-[#1e5eff]" />,
    specs: ['60fps Kinetic Renders', 'Custom Easing Curves', 'Audio Synchronization'],
  },
  {
    number: '04',
    title: 'Refine',
    tagline: 'Polishing movement, timing and details',
    description:
      'Obsessive frame-by-frame scrutiny: fine-tuning easing curves, color grading, motion blur, asset optimization, and exporting master renders across required delivery specs.',
    file: '04_final_commercial_master.mov',
    icon: <Sliders size={18} className="text-[#1e5eff]" />,
    specs: ['ProRes 4444 Master', 'Social Multi-Formats', 'Brand Motion Toolkit'],
  },
];

export const ProcessFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const shouldAutoAdvance = isAuto && !shouldReduceMotion;

  const selectStep = (idx: number) => {
    setIsAuto(false);
    setCurrentStep(idx);
  };

  const active = steps[currentStep];

  return (
    <section id="process" className="om-flow" aria-label="Creative process flow">
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-[#747475] mb-8 sm:flex-row sm:items-center sm:justify-between">
        <span>04 // METHODOLOGY & PRODUCTION</span>
        <span>STEP {currentStep + 1} OF 4</span>
      </div>

      <div className="om-flow-grid">
        {/* Left: Step Buttons */}
        <div className="space-y-3">
          {steps.map((s, idx) => {
            const isActive = idx === currentStep;
            return (
              <motion.button
                type="button"
                key={s.number}
                onClick={() => selectStep(idx)}
                layout
                animate={{ x: isActive ? 8 : 0 }}
                transition={{
                  layout: shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 280, damping: 32, mass: 0.8 },
                  x: shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 280, damping: 32, mass: 0.8 },
                }}
                className={`om-flow-step ${isActive ? 'is-active' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1e5eff]">
                        {s.number}
                      </span>
                      <h3 className="text-xl font-bold text-[#0a0a0b] tracking-tight">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-[#747475] mt-1">{s.tagline}</p>
                  </div>
                  <div className="p-2 rounded-full bg-black/5">{s.icon}</div>
                </div>

                <AnimatePresence initial={false} mode="popLayout">
                  {isActive && (
                    <motion.p
                      key="description"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
                      className="text-xs text-[#515154] font-normal leading-relaxed mt-3 pt-3 border-t border-[rgba(10,10,11,0.06)]"
                    >
                      {s.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Progress bar on active card */}
                {isActive && (
                  <motion.div
                    className="om-flow-bar"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: shouldAutoAdvance ? STEP_DURATION : 0,
                      ease: 'linear',
                    }}
                    onAnimationComplete={() => {
                      if (shouldAutoAdvance) {
                        setCurrentStep((current) => (current + 1) % steps.length);
                      }
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right: Studio Monitor Showcase Window */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0b0d] text-white shadow-[0_20px_60px_rgba(10,10,11,0.14)] border border-white/10 space-y-6 flex flex-col justify-between min-h-[440px]">
          {/* Top Window bar */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 border-b border-white/10 pb-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3154]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc107]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e09a]" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active.file}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                  className="ml-1 min-w-0 max-w-[38vw] truncate font-mono text-[10px] sm:text-xs text-zinc-400 flex items-center gap-1.5 sm:ml-3 sm:max-w-none"
                >
                  <FileCode size={13} className="text-[#3b74ff]" />
                  {active.file}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="whitespace-nowrap font-mono text-[10px] sm:text-xs text-[#ccff00]">PIPELINE ACTIVE</span>
          </div>

          {/* Center Graphic */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="my-auto text-center space-y-4 py-8"
            >
              <span className="font-mono text-5xl font-black text-[#1e5eff]">
                {active.number}
              </span>
              <h4 className="text-3xl font-bold tracking-tight text-white">{active.title}</h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
                {active.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Specs List */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.number}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
              className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              {active.specs.map((spec) => (
                <div
                  key={spec}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                >
                  <CheckCircle2 size={11} className="text-[#00e09a]" />
                  <span>{spec}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
