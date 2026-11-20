import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/site';
import { socialLinks } from '../data/socialLinks';

const currentYear = new Date().getFullYear();

export const Footer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="om-footer" role="contentinfo">
      <div className="om-ft-inner space-y-16">
        {/* Top Pitch Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-[rgba(10,10,11,0.08)]">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#0a0a0b] text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
              <img src="../public/Group 3.png" alt="Vixora Studio" />
            </div>
            <div>
              <span className="font-bold text-xl text-[#0a0a0b] block">
                Vixora<span className='text-blue'> Studio</span>
              </span>
              <p className="text-sm text-[#747475] mt-0.5">
                Abdullah — Independent Motion Designer & Visual Artist
              </p>
            </div>
          </div>

          {/* Social Balloons that float on hover */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="om-balloon"
                aria-label={s.name}
                title={s.name}
              >
                {s.id === 'instagram' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ) : s.id === 'linkedin' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="om-balloon"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono uppercase tracking-wider text-[#747475]">
          <div className="space-y-3">
            <h5 className="font-bold text-[#0a0a0b]">Navigation</h5>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo('work'); }} className="block hover:text-[#1e5eff] transition-colors">
              Selected Work
            </a>
            <a href="#stage" onClick={(e) => { e.preventDefault(); scrollTo('stage'); }} className="block hover:text-[#1e5eff] transition-colors">
              Featured Stage
            </a>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="block hover:text-[#1e5eff] transition-colors">
              What I Do
            </a>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-[#0a0a0b]">Specializations</h5>
            <span className="block">Brand Motion</span>
            <span className="block">2D/3D Animation</span>
            <span className="block">Kinetic Type</span>
            <span className="block">Video Editing</span>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-[#0a0a0b]">Specifications</h5>
            <span className="block">4K 60fps Renders</span>
            <span className="block">ProRes 4444 Master</span>
            <span className="block">ACEScg Color Pipeline</span>
            <span className="block">Social Cuts (9:16)</span>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-[#0a0a0b]">Location & Time</h5>
            <span className="block">{siteConfig.location}</span>
            <span className="block">{siteConfig.coordinates}</span>
            <span className="block text-[#00e09a] font-semibold">Q1/Q2 BOOKINGS OPEN</span>
          </div>
        </div>

        {/* Colophon */}
        <div className="pt-8 border-t border-[rgba(10,10,11,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#747475]">
          <div>
            © {currentYear} {siteConfig.brandName}. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#1e5eff]" />
            <span>INSPIRED BY OLAFMOTION KINETIC DESIGN & SPRING BEHAVIOR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
