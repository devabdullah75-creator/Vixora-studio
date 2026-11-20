import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Clock, ShieldCheck, Check } from 'lucide-react';
import { InteractiveText } from './InteractiveText';
import { TiltCard } from './TiltCard';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section className="om-hero" id="top">
      {/* Giant Kinetic Watermark in background */}
      <div className="om-hero-word" aria-hidden="true">
        VIXORA
      </div>

      {/* Floating Lanes of Motion Cards in Background */}
      <div className="om-lanes" aria-hidden="true">
        {/* Left Lane */}
        <div className="om-lane om-lane-l">
          <div className="om-float" style={{ '--rot': '-4deg', '--dur': '6.5s', '--delay': '0s' } as React.CSSProperties}>
            <div className="w-full aspect-square bg-[#0b0b0d] p-4 flex flex-col justify-between text-white rounded-xl">
              <span className="font-mono text-[10px] text-[#ccff00]">[01] KINETIX</span>
              <div className="text-xl font-bold tracking-tight text-white/90">Identity</div>
              <span className="font-mono text-[9px] text-[#747475]">4K 60FPS</span>
            </div>
          </div>
          <div className="om-float" style={{ '--rot': '3deg', '--dur': '7.5s', '--delay': '-2s' } as React.CSSProperties}>
            <div className="w-full aspect-[4/5] bg-[#141418] p-4 flex flex-col justify-between text-white rounded-xl">
              <span className="font-mono text-[10px] text-[#3b74ff]">[02] REFRACTION</span>
              <div className="text-xl font-bold tracking-tight text-white/90">Glass 3D</div>
              <span className="font-mono text-[9px] text-[#747475]">OCTANE</span>
            </div>
          </div>
        </div>

        {/* Right Lane */}
        <div className="om-lane om-lane-r">
          <div className="om-float" style={{ '--rot': '5deg', '--dur': '7s', '--delay': '-1s' } as React.CSSProperties}>
            <div className="w-full aspect-[4/5] bg-[#0d121c] p-4 flex flex-col justify-between text-white rounded-xl">
              <span className="font-mono text-[10px] text-[#00e09a]">[03] TYPE LAB</span>
              <div className="text-xl font-bold tracking-tight text-white/90">Kinetic</div>
              <span className="font-mono text-[9px] text-[#747475]">EXPRESSIONS</span>
            </div>
          </div>
          <div className="om-float" style={{ '--rot': '-3deg', '--dur': '8s', '--delay': '-3s' } as React.CSSProperties}>
            <div className="w-full aspect-square bg-[#1a0e10] p-4 flex flex-col justify-between text-white rounded-xl">
              <span className="font-mono text-[10px] text-[#ff3154]">[04] COMMERCIAL</span>
              <div className="text-xl font-bold tracking-tight text-white/90">Launch</div>
              <span className="font-mono text-[9px] text-[#747475]">128 BPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Center Editorial Content */}
      <div className="om-hero-inner">
        {/* Availability Badge */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('contact');
          }}
          className="om-hero-badge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e09a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e09a]" />
          </span>
          <span>Now booking new projects</span>
        </a>

        {/* Title with Interactive Spring Letter Splitting */}
        <h1 className="om-hero-title">
          <InteractiveText text="Video that stops the scroll." />
        </h1>

        {/* Subtitle */}
        <p className="om-hero-sub">
          Custom motion design, commercial animation and kinetic visual systems for ambitious brands and creators. Made from scratch around your idea and deadline, never squeezed into a template.
        </p>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            className="om-btn"
          >
            <span>Start your project brief</span>
            <ArrowUpRight size={16} />
          </a>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('work');
            }}
            className="om-btn-subtle"
          >
            <span>See the work</span>
            <ArrowDown size={14} />
          </a>
        </div>

        {/* Proof items list */}
        <ul className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-medium text-[#747475]" aria-label="What you can expect">
          <li className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#1e5eff]" />
            <span>Reply within 24 hours</span>
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#00e09a]" />
            <span>Commercial ready delivery</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Check size={14} className="text-[#1e5eff]" />
            <span>Built from scratch</span>
          </li>
        </ul>
      </div>

      {/* 3D Tilt Paths (The Signature Olaf Hero Cards) */}
      <div className="om-paths">
        {/* Path 1: Custom Direction (Dark Obsidian Card) */}
        <TiltCard
          maxTilt={7}
          onClick={() => scrollTo('contact')}
          className="om-path om-path-dark"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="om-path-index">
                <i className="w-1.5 h-1.5 rounded-full bg-[#ccff00] inline-block mr-1" />
                01 / Custom
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono text-[#ccff00]">
                COMMISSION
              </span>
            </div>

            <span className="om-path-eyebrow">I NEED A CREATOR</span>
            <h2 className="om-path-title">
              Make it<br />for me.
            </h2>
            <p className="om-path-desc">
              Custom motion design, commercial animation and 3D visual systems crafted around your brand, idea and deadline.
            </p>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <span className="om-path-action">
              <span>Start a project</span>
              <ArrowUpRight size={16} />
            </span>
            <span className="font-mono text-xs text-zinc-500">2025/2026</span>
          </div>
        </TiltCard>

        {/* Path 2: Archive / Selected Work (Clean Light Surface Card) */}
        <TiltCard
          maxTilt={7}
          onClick={() => scrollTo('work')}
          className="om-path"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="om-path-index">
                <i className="w-1.5 h-1.5 rounded-full bg-[#1e5eff] inline-block mr-1" />
                02 / Archive
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/5 text-[11px] font-mono text-[#1e5eff]">
                PORTFOLIO
              </span>
            </div>

            <span className="om-path-eyebrow" style={{ color: '#1e5eff' }}>
              EXPLORE MY WORK
            </span>
            <h2 className="om-path-title">
              Browse the<br />archive.
            </h2>
            <p className="om-path-desc">
              Curated visual experiments, kinetic identity studies, brand launch commercials and procedural type explorations.
            </p>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-[rgba(10,10,11,0.08)]">
            <span className="om-path-action">
              <span>View selected work</span>
              <ArrowUpRight size={16} />
            </span>
            <span className="font-mono text-xs text-[#747475]">6 Case Studies</span>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
