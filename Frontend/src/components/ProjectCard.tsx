import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenModal,
  featured = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Height and aspect ratio styling based on project layout
  const getContainerHeight = () => {
    if (featured) return 'h-96 sm:h-[480px] lg:h-[540px]';
    if (project.aspectRatio === 'portrait') return 'h-[440px] sm:h-[500px]';
    return 'h-80 sm:h-96 lg:h-[420px]';
  };

  return (
    <article
      onClick={() => onOpenModal(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col space-y-4 focus:outline-none"
      data-cursor="VIEW"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal(project);
        }
      }}
      aria-label={`View details for project ${project.title}`}
    >
      {/* Visual Canvas Container */}
      <div
        className={`w-full ${getContainerHeight()} relative rounded-md overflow-hidden bg-[#111115] border border-white/[0.08] group-hover:border-white/30 transition-all duration-500`}
      >
        <ProjectVisual project={project} isHovered={isHovered} />

        {/* Hover overlay sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Metadata / Editorial Description */}
      <div className="flex items-start justify-between pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#ccff00] font-semibold">
              0{project.number}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {project.category}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-[#ccff00] transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-light line-clamp-1">
            {project.subtitle}
          </p>
        </div>

        {/* Arrow Button */}
        <div className="p-2.5 rounded-full bg-white/[0.03] group-hover:bg-[#ccff00] text-zinc-400 group-hover:text-black border border-white/10 group-hover:border-[#ccff00] transition-all duration-300 transform group-hover:scale-110 flex-shrink-0">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </article>
  );
};
