import React from 'react';
import { siteConfig } from '../config/site';
import { Terminal } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[rgba(10,10,11,0.08)]">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-[#747475] mb-12 sm:flex-row sm:items-center sm:justify-between">
        <span>06 // BIOGRAPHY & IDENTITY</span>
        <span>{siteConfig.location}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Replaceable Portrait Card with 3D Tilt */}
        <div className="w-full max-w-[560px] mx-auto space-y-6 lg:col-span-5 lg:mx-0 lg:max-w-none">
          <TiltCard
            maxTilt={6}
            className="aspect-[4/5] w-full rounded-3xl bg-[#0b0b0d] p-5 sm:p-8 flex flex-col justify-between text-white shadow-[0_20px_50px_rgba(10,10,11,0.12)] border border-white/10 relative overflow-hidden group"
          >
            <div className="relative z-10 flex justify-between items-center text-xs font-mono text-zinc-400">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono">
                VIXORA // 01
              </span>
              <span className="text-[#00e09a] font-medium">AVAILABLE</span>
            </div>

            <div className="relative z-10 my-auto text-center space-y-2">
              <img
                src={siteConfig.about.portraitImage}
                alt="Illustrated portrait of Abdullah"
                className="w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-6 rounded-full bg-white object-cover border-4 border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.3)]"
              />
              <span className="text-[clamp(2rem,10vw,3rem)] font-black tracking-tight text-white">
                ABDULLAH
              </span>
              <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Motion Designer & Visual Artist
              </p>
            </div>

            <div className="relative z-10 p-3 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-400 text-center border border-white/10">
              <span>ILLUSTRATED PORTRAIT</span>
            </div>
          </TiltCard>

          {/* Software Stack Pills */}
          <div className="p-6 rounded-2xl bg-white border border-[rgba(10,10,11,0.08)] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1e5eff] uppercase tracking-wider font-semibold">
              <Terminal size={14} />
              <span>CORE PRODUCTION PIPELINE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {siteConfig.about.software.map((tool) => (
                <div
                  key={tool}
                  className="p-2.5 rounded-lg bg-[#f7f9fc] border border-[rgba(10,10,11,0.05)] text-[#3a3a40] font-medium"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Biography Narrative */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0a0a0b] leading-tight">
              {siteConfig.about.title}
            </h2>
            <p className="mt-4 text-xl sm:text-2xl text-[#1e5eff] font-medium leading-relaxed">
              "{siteConfig.about.lead}"
            </p>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#515154] font-normal leading-relaxed">
            {siteConfig.about.bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Philosophy Box */}
          <div className="p-8 rounded-2xl bg-white border border-[rgba(10,10,11,0.08)] border-l-4 border-l-[#1e5eff] shadow-sm space-y-2">
            <span className="text-xs font-mono text-[#1e5eff] uppercase tracking-widest font-semibold block">
              CREATIVE PHILOSOPHY
            </span>
            <blockquote className="text-lg text-[#0a0a0b] font-medium italic">
              "{siteConfig.about.philosophy}"
            </blockquote>
          </div>

          {/* Disciplines */}
          <div className="pt-4 border-t border-[rgba(10,10,11,0.08)]">
            <span className="text-xs font-mono text-[#747475] uppercase tracking-widest block mb-4">
              RESEARCH & SPECIALIZATIONS
            </span>
            <div className="flex flex-wrap gap-2">
              {siteConfig.about.disciplines.map((disc) => (
                <span
                  key={disc}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[rgba(10,10,11,0.08)] text-xs font-mono text-[#3a3a40] shadow-sm"
                >
                  {disc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
