import React, { useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-xl transition-all duration-300">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        data-lenis-prevent
        className="relative w-full max-w-5xl max-h-[92dvh] overflow-y-auto overscroll-contain bg-[#0d0d10] border border-white/15 rounded-xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] z-10 flex flex-col text-white"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 bg-[#0d0d10]/95 backdrop-blur-md border-b border-white/10">
          <div className="min-w-0 flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs text-[#ccff00] font-bold">
              [{project.number}]
            </span>
            <span className="min-w-0 truncate font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400">
              {project.category} // {project.year}
            </span>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => onSelectProject(prevProject)}
              className="min-h-11 min-w-11 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Previous project"
              aria-label="Previous project"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => onSelectProject(nextProject)}
              className="min-h-11 min-w-11 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Next project"
              aria-label="Next project"
            >
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="min-h-11 min-w-11 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-10 space-y-8 sm:space-y-10">
          {/* Main Visual Display */}
          <div className="w-full aspect-[3/2] sm:aspect-auto sm:h-96 md:h-[420px] rounded-lg overflow-hidden border border-white/10 relative">
            <ProjectVisual project={project} isHovered={true} />
          </div>

          {/* Title and Metadata Grid */}
          <div className="border-b border-white/10 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h3 className="text-[clamp(1.75rem,8vw,3rem)] sm:text-5xl font-display font-extrabold tracking-tight text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-lg text-zinc-400 font-light max-w-2xl">
                  {project.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-xs text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 font-mono text-xs">
              <div>
                <span className="text-zinc-500 uppercase block mb-1">Client / Origin</span>
                <span className="text-white font-medium">{project.client}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block mb-1">Role</span>
                <span className="text-white font-medium">{project.role}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block mb-1">Duration / Format</span>
                <span className="text-white font-medium">{project.duration}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block mb-1">Software Stack</span>
                <span className="text-[#ccff00] font-medium">{project.tools.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Detailed Narrative: Challenge, Approach & Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
            <div className="md:col-span-4 space-y-6">
              <div className="p-5 rounded-lg bg-white/[0.02] border border-white/10">
                <span className="text-xs font-mono text-[#ccff00] uppercase tracking-widest block mb-2">
                  PROJECT SCOPE
                </span>
                <p className="text-zinc-300 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.stats && (
                <div className="p-5 rounded-lg bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
                    BENCHMARK METRICS
                  </span>
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-500">{stat.label}</span>
                      <span className="text-white font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="space-y-3">
                <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-[#ccff00]" />
                  Creative & Technical Approach
                </h4>
                <p className="text-zinc-300 font-light leading-relaxed">
                  {project.approach}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#ccff00]" />
                  Verified Outcome & Impact
                </h4>
                <p className="text-zinc-300 font-light leading-relaxed">
                  {project.outcome}
                </p>
              </div>

              {/* Replaceable media notice */}
              <div className="p-4 rounded-md bg-white/[0.02] border border-dashed border-white/20 text-xs font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2">
                <span className="break-all">ASSET PATH: /public{project.thumbnailUrl}</span>
                <span className="text-[#ccff00]">REPLACEABLE LOCAL MEDIA</span>
              </div>
            </div>
          </div>

          {/* Footer Navigation within modal */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => onSelectProject(prevProject)}
              className="min-h-11 flex items-center gap-2 text-left text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Previous: {prevProject.title}</span>
            </button>

            <button
              onClick={() => onSelectProject(nextProject)}
              className="min-h-11 flex items-center gap-2 text-left text-xs font-mono uppercase text-zinc-400 hover:text-[#ccff00] transition-colors sm:justify-end"
            >
              <span>Next: {nextProject.title}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
