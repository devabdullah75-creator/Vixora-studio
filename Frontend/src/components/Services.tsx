import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { servicesData } from '../data/services';
import { Check, ArrowUpRight } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const Services: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="services" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-[#747475] mb-8 sm:flex-row sm:items-center sm:justify-between">
        <span>05 // DISCIPLINE & CAPABILITIES</span>
        <span>SPECIALIZED MOTION ENGINEERING</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
        <div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0a0a0b] uppercase">
            What I Do
          </h2>
          <p className="mt-4 text-lg text-[#747475] font-normal max-w-xl">
            Custom motion design systems, kinetic typography and visual choreography engineered to communicate with emotional retention.
          </p>
        </div>

        <button onClick={scrollToContact} className="om-btn self-start lg:self-auto">
          <span>Inquire about services</span>
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Grid of Service Cards with Tilt and Spring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service) => (
          <TiltCard
            key={service.id}
            maxTilt={5}
            className="group p-8 rounded-2xl bg-white border border-[rgba(10,10,11,0.08)] shadow-[0_4px_20px_rgba(10,10,11,0.04)] hover:shadow-[0_16px_40px_rgba(10,10,11,0.08)] transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-sm font-bold text-[#1e5eff]">
                  {service.number}
                </span>
                <span className="text-[11px] font-mono text-[#747475] uppercase">
                  {service.tools[0]}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#0a0a0b] group-hover:text-[#1e5eff] transition-colors">
                {service.title}
              </h3>
              <p className="font-mono text-xs text-[#747475] mt-1 mb-4">
                {service.tagline}
              </p>
              <p className="text-sm text-[#515154] font-normal leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(10,10,11,0.06)] space-y-3">
              <span className="text-[11px] font-mono text-[#747475] uppercase block">
                Deliverables
              </span>
              <div className="flex flex-wrap gap-1.5">
                {service.deliverables.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#f7f9fc] border border-[rgba(10,10,11,0.05)] text-[11px] font-mono text-[#3a3a40]"
                  >
                    <Check size={10} className="text-[#1e5eff]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
};
