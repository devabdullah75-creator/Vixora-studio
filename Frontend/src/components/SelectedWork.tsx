import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/projects';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';
import { TiltCard } from './TiltCard';
import { ProjectModal } from './ProjectModal';

export const SelectedWork: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    'ALL',
    'Brand Motion & System',
    'Experimental 3D',
    'Product Animation',
    'Kinetic Type & Poster',
    'Commercial & UI Motion',
  ];

  const filteredProjects =
    activeCategory === 'ALL'
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-[#747475] sm:flex-row sm:items-center sm:justify-between">
          <span>03 // PORTFOLIO ARCHIVE</span>
          <div className="flex items-center gap-1.5 text-[#1e5eff]">
            <Sparkles size={12} />
            <span>SELECTED WORK 2024—2026</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[rgba(10,10,11,0.08)] pb-8">
          <div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0a0a0b] uppercase">
              Selected Work
            </h2>
            <p className="mt-3 text-lg text-[#747475] font-normal max-w-xl">
              A curated collection of visual experiments, motion studies and client commercials.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-11 px-3.5 py-2 rounded-full text-xs font-mono transition-all duration-300 ${activeCategory === cat
                    ? 'bg-[#1e5eff] text-white font-semibold shadow-[0_2px_10px_rgba(30,94,255,0.35)] scale-105'
                    : 'bg-white text-[#747475] hover:text-[#0a0a0b] border border-[rgba(10,10,11,0.08)] shadow-sm'
                  }`}
              >
                {cat === 'ALL' ? 'All Archive' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 3D Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {filteredProjects.map((project) => (
          <TiltCard
            key={project.id}
            maxTilt={6}
            onClick={() => setSelectedProject(project)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${project.title}`}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedProject(project);
              }
            }}
            className="group cursor-pointer rounded-2xl bg-white p-4 sm:p-5 border border-[rgba(10,10,11,0.08)] shadow-[0_10px_30px_rgba(10,10,11,0.05)] hover:shadow-[0_20px_50px_rgba(10,10,11,0.1)] transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            {/* Visual Screen Container */}
            <div className="w-full aspect-[3/2] h-auto lg:aspect-auto lg:h-80 rounded-xl overflow-hidden relative bg-[#0b0b0d]">
              <ProjectVisual project={project} isHovered={false} />
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-start justify-between pt-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#1e5eff]">
                    [{project.number}]
                  </span>
                  <span className="font-mono text-xs text-[#747475] uppercase tracking-wider">
                    {project.category} · {project.year}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a0a0b] group-hover:text-[#1e5eff] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[#747475] mt-1 font-normal line-clamp-1">
                  {project.subtitle}
                </p>
              </div>

              <div className="p-2.5 rounded-full bg-[#f0f2f7] group-hover:bg-[#1e5eff] text-[#0a0a0b] group-hover:text-white transition-all transform group-hover:scale-110 flex-shrink-0">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        allProjects={projectsData}
      />
    </section>
  );
};
