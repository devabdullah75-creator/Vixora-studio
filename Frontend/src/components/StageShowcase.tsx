import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { projectsData } from '../data/projects';
import type { Project } from '../data/projects';

interface StageShowcaseProps {
  onSelectProject: (project: Project) => void;
}

export const StageShowcase: React.FC<StageShowcaseProps> = ({ onSelectProject }) => {
  const p1 = projectsData[0]; // Visual Identity in Motion
  const p2 = projectsData[1]; // Abstract Dimensions
  const p3 = projectsData[2]; // Product Motion Study
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, project: Project) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectProject(project);
    }
  };

  return (
    <section id="stage" className="stage" aria-label="Featured kinetic stage">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-xs font-mono text-[#1e5eff] uppercase tracking-wider">
          <Sparkles size={12} />
          <span>CINEMATIC STAGE // THREE-PIECE FEATURE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0a0a0b]">
          Choreographed for High Visual Retention
        </h2>
      </div>

      <div className="stage__row">
        {/* Left Card */}
        <figure
          onClick={() => onSelectProject(p2)}
          onKeyDown={(event) => handleCardKeyDown(event, p2)}
          className="stage__card stage__card--side group cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`View ${p2.title} project`}
        >
          <div className="w-full h-full relative">
            <video
              className="stage__video"
              src="/assets/Videos/Comp%201.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Kinetic showcase video"
            />
            <figcaption className="om-chip">
              Abstract Dimensions <span>3D Refraction</span>
            </figcaption>
          </div>
        </figure>

        {/* Center Main Stage Card */}
        <figure
          onClick={() => onSelectProject(p1)}
          onKeyDown={(event) => handleCardKeyDown(event, p1)}
          className="stage__card stage__card--center group cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`View ${p1.title} project`}
        >
          <div className="w-full h-full relative">
            <video
              className="stage__video"
              src="/assets/Videos/heart.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Featured heart motion showcase video"
            />
            <figcaption className="om-chip">
              Kinetix <span>Card Launch Reel</span>
            </figcaption>
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 border border-white/15">
              <Play size={11} className="fill-white" />
              <span>4K 60FPS</span>
            </div>
          </div>
        </figure>

        {/* Right Card */}
        <figure
          onClick={() => onSelectProject(p3)}
          onKeyDown={(event) => handleCardKeyDown(event, p3)}
          className="stage__card stage__card--side group cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`View ${p3.title} project`}
        >
          <div className="w-full h-full relative">
            <video
              className="stage__video"
              src="/assets/Videos/Comp%201_1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Alternate motion showcase video"
            />
            <figcaption className="om-chip">
              AURA <span>Acoustic Chamber</span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
};
