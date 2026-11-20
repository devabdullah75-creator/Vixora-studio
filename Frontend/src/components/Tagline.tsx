import React, { useEffect, useRef, useState } from 'react';

export const Tagline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text =
    'I explore the intersection of design, movement and digital storytelling to create visuals that communicate with unmistakable purpose and visceral momentum.';

  const words = text.split(' ');
  const [litIndices, setLitIndices] = useState<number[]>([]);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        if (!containerRef.current) return;

        const spans = containerRef.current.querySelectorAll<HTMLSpanElement>('.om-tagline-word');
        const triggerY = window.innerHeight * 0.65;
        const newLit: number[] = [];

        spans.forEach((span, idx) => {
          if (span.getBoundingClientRect().top < triggerY) {
            newLit.push(idx);
          }
        });

        setLitIndices((current) =>
          current.length === newLit.length && current.every((value, idx) => value === newLit[idx])
            ? current
            : newLit,
        );
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="om-tagline" ref={containerRef}>
      <div className="font-mono text-xs text-[#1e5eff] uppercase tracking-widest mb-6">
        02 // PHILOSOPHY & STATEMENT
      </div>
      <p className="om-tagline-text">
        {words.map((word, idx) => {
          const isLit = litIndices.includes(idx);
          return (
            <span
              key={idx}
              className={`om-tagline-word mr-[0.25em] ${isLit ? 'is-lit' : ''}`}
            >
              {word}
            </span>
          );
        })}
      </p>
    </section>
  );
};
