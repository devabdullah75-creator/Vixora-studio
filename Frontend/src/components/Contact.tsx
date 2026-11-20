import React, { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import { siteConfig } from '../config/site';
import { InteractiveText } from './InteractiveText';
import { TiltCard } from './TiltCard';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[rgba(10,10,11,0.08)]">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 text-xs font-mono uppercase tracking-widest text-[#747475] mb-12 sm:flex-row sm:items-center sm:justify-between">
        <span>07 // TRANSMISSION & INQUIRY</span>
        <span className="text-[#00e09a] font-semibold">REPLY WITHIN 24 HOURS</span>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-4xl sm:text-7xl font-bold tracking-tight text-[#0a0a0b] leading-[1.05]">
            <InteractiveText text="Have something in mind? Let's make it move." />
          </h2>
          <p className="mt-6 text-xl text-[#747475] font-normal max-w-xl">
            Custom motion design, kinetic visual identities, and 3D visual storytelling crafted around your deadline.
          </p>
        </div>

        {/* Transmission Box */}
        <TiltCard
          maxTilt={4}
          className="p-5 sm:p-12 rounded-3xl bg-white border border-[rgba(10,10,11,0.08)] shadow-[0_20px_60px_rgba(10,10,11,0.06)] space-y-6"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#747475] uppercase">
            <span className="flex items-center gap-2">
              <Mail size={14} className="text-[#1e5eff]" />
              DIRECT TRANSMISSION LINE
            </span>
            <span className="text-[#00e09a] font-semibold">STATUS: ONLINE</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-2xl sm:text-4xl font-bold text-[#0a0a0b] hover:text-[#1e5eff] transition-colors break-all"
            >
              {siteConfig.email}
            </a>

            <div className="flex w-full flex-col items-stretch gap-2 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center sm:flex-shrink-0">
              <button
                onClick={handleCopy}
                className="om-btn-subtle min-h-11 text-xs"
                title="Copy email"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-[#00e09a]" />
                    <span className="text-[#00e09a] font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
