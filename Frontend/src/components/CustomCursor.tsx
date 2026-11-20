import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouch] = useState<boolean>(() => (
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  ));

  useEffect(() => {
    if (isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        followerX = mouseX;
        followerY = mouseY;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const renderLoop = () => {
      // Smooth lerp follower
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      if (cursorFollowerRef.current) {
        cursorFollowerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Global listener for data-cursor attributes
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      if (target) {
        const text = target.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        const clickable = (e.target as HTMLElement).closest('a, button, input, [role="button"]');
        if (clickable) {
          setIsHovered(true);
          setCursorText('');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleOver);
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isTouch]);

  if (isTouch || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Precision inner center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#ccff00] transition-opacity duration-200 ${
          cursorText ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Smooth trailing outer ring / badge */}
      <div
        ref={cursorFollowerRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          cursorText
            ? 'w-24 h-24 -ml-12 -mt-12 bg-[#ccff00] text-black font-display font-bold text-[11px] tracking-wider uppercase scale-100 shadow-[0_0_30px_rgba(204,255,0,0.4)]'
            : isHovered
            ? 'w-14 h-14 -ml-7 -mt-7 bg-white/10 border border-[#ccff00]/60 backdrop-blur-[2px] scale-110'
            : 'w-10 h-10 border border-white/30 scale-100 opacity-60'
        }`}
      >
        {cursorText && <span className="animate-pulse">{cursorText}</span>}
      </div>
    </div>
  );
};
