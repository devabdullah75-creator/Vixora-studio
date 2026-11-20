import React from 'react';
import type { Project } from '../data/projects';
import { Play } from 'lucide-react';

interface ProjectVisualProps {
  project: Project;
  isHovered?: boolean;
  className?: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  project,
  isHovered = false,
  className = '',
}) => {
  const { id, title, category, year } = project;

  // Render a bespoke, artistic generative kinetic composition for each project ID
  const renderVisualContent = () => {
    switch (id) {
      case 'visual-identity-in-motion':
        return (
          <div className="relative w-full h-full bg-[#0d0d0f] flex items-center justify-center overflow-hidden">
            {/* Geometric kinetic wireframe & typographic abstraction */}
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <svg className="w-full h-full opacity-60" viewBox="0 0 600 400" fill="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ccff00" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#09090b" stopOpacity="0.1" />
                  </linearGradient>
                  <pattern id="gridPattern1" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern1)" />
                <circle cx="300" cy="200" r="130" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="4 8" className={isHovered ? 'animate-spin' : ''} style={{ animationDuration: '30s' }} />
                <circle cx="300" cy="200" r="85" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
                <polygon points="300,110 380,250 220,250" stroke="#ccff00" strokeWidth="2" fill="none" />
                <text x="300" y="205" textAnchor="middle" fill="#ffffff" fontFamily="Space Grotesk" fontSize="32" fontWeight="700" letterSpacing="4">
                  KINETIX
                </text>
                <line x1="120" y1="200" x2="480" y2="200" stroke="rgba(204,255,0,0.3)" strokeWidth="1" />
                <line x1="300" y1="60" x2="300" y2="340" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        );

      case 'abstract-dimensions':
        return (
          <div className="relative w-full h-full bg-[#0a0c14] flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <defs>
                  <radialGradient id="caustics" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#818cf8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0a0c14" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#caustics)" />
                {/* 3D Glass refraction ribbons */}
                <path
                  d="M100 280 C 200 120, 400 320, 500 140"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                <path
                  d="M120 290 C 220 130, 420 330, 520 150"
                  stroke="#c084fc"
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.6"
                />
                <path
                  d="M80 270 C 180 110, 380 310, 480 130"
                  stroke="#ffffff"
                  strokeWidth="1"
                  fill="none"
                  strokeOpacity="0.4"
                />
                {/* Refraction mesh */}
                <ellipse cx="300" cy="200" rx="160" ry="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" transform="rotate(-15 300 200)" />
                <ellipse cx="300" cy="200" rx="120" ry="60" stroke="rgba(56,189,248,0.2)" strokeWidth="1" transform="rotate(-15 300 200)" />
              </svg>
            </div>
          </div>
        );

      case 'product-motion-study':
        return (
          <div className="relative w-full h-full bg-[#100d0a] flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <defs>
                  <radialGradient id="prodGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#100d0a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#prodGlow)" />
                {/* Acoustic diaphragm rings */}
                <circle cx="300" cy="200" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <circle cx="300" cy="200" r="110" stroke="#f97316" strokeOpacity="0.5" strokeWidth="1.5" />
                <circle cx="300" cy="200" r="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="300" cy="200" r="50" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" />
                <circle cx="300" cy="200" r="20" fill="#f97316" fillOpacity="0.8" />
                {/* Precision alignment ticks */}
                <line x1="300" y1="40" x2="300" y2="70" stroke="#f97316" strokeWidth="2" />
                <line x1="300" y1="330" x2="300" y2="360" stroke="#f97316" strokeWidth="2" />
                <line x1="140" y1="200" x2="170" y2="200" stroke="#f97316" strokeWidth="2" />
                <line x1="430" y1="200" x2="460" y2="200" stroke="#f97316" strokeWidth="2" />
                <text x="300" y="380" textAnchor="middle" fill="#8e8e93" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="3">
                  ACOUSTIC CHAMBER // SPEC. 98.4dB
                </text>
              </svg>
            </div>
          </div>
        );

      case 'typography-experiments':
        return (
          <div className="relative w-full h-full bg-[#14080a] flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <div className="w-full h-full flex flex-col justify-between p-8 font-display select-none">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">
                  <span>VARIABLE AXES [100—900]</span>
                  <span className="text-[#e11d48]">KINETIC TYPE LAB</span>
                </div>
                <div className="space-y-1">
                  <div className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-700 transition-all duration-500">
                    MOTION
                  </div>
                  <div className="text-5xl lg:text-7xl font-light tracking-tight text-white/40 italic pl-8">
                    TENSION
                  </div>
                  <div className="text-5xl lg:text-7xl font-black tracking-widest text-[#e11d48] pl-16">
                    RHYTHM
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500 pt-2 border-t border-white/10">
                  <span>BERLIN // 2024</span>
                  <span>10 INFINITE LOOPS</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'digital-campaign':
        return (
          <div className="relative w-full h-full bg-[#091310] flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <defs>
                  <linearGradient id="fintechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#091310" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#fintechGrad)" />
                {/* Floating translucent cards */}
                <rect x="180" y="90" width="240" height="150" rx="16" fill="rgba(255,255,255,0.04)" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" transform="rotate(-6 300 165)" />
                <rect x="210" y="140" width="240" height="150" rx="16" fill="rgba(16,185,129,0.06)" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" transform="rotate(4 330 215)" />
                {/* Dynamic waveform / metrics line */}
                <path d="M 60 320 Q 180 260, 260 300 T 420 220 T 540 270" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <circle cx="420" cy="220" r="5" fill="#ccff00" />
                <text x="435" y="215" fill="#ccff00" fontFamily="JetBrains Mono" fontSize="12" fontWeight="500">
                  +342.8%
                </text>
              </svg>
            </div>
          </div>
        );

      case 'motion-exploration':
        return (
          <div className="relative w-full h-full bg-[#0e0915] flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <defs>
                  <radialGradient id="particles" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0e0915" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#particles)" />
                {/* Harmonic wave lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M 50 ${160 + i * 14} Q 200 ${100 + i * 20}, 300 ${200 - i * 10} T 550 ${160 + i * 14}`}
                    stroke={i % 2 === 0 ? '#a855f7' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={1 + i * 0.2}
                    fill="none"
                    strokeOpacity={0.7 - i * 0.05}
                  />
                ))}
                <circle cx="300" cy="190" r="4" fill="#ffffff" />
                <circle cx="280" cy="170" r="2" fill="#a855f7" />
                <circle cx="340" cy="210" r="3" fill="#a855f7" />
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600 font-mono text-sm">{title}</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-sm group ${className}`}>
      {renderVisualContent()}

      {/* Subtle vignette border */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none transition-colors duration-500 group-hover:border-white/25" />

      {/* Top corner index and year badge */}
      <div className="project-visual-meta absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-white/70 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <span className="project-visual-index">[{project.number}]</span>{' '}
          <span className="project-visual-category">{category}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          {year}
        </span>
      </div>

      {/* Bottom overlay: subtle reel / play badge on hover */}
      <div className="project-visual-reel absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono transition-all duration-300 ${
            isHovered ? 'scale-105 border-[#ccff00]/60 text-[#ccff00]' : 'text-zinc-400'
          }`}
        >
          <Play size={12} className={isHovered ? 'fill-[#ccff00]' : ''} />
          <span>REEL // 60FPS</span>
        </div>
      </div>

      {/* Interactive Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
        }}
      />
    </div>
  );
};
