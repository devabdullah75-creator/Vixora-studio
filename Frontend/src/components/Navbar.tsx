import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X, Mail } from 'lucide-react';
import { siteConfig } from '../config/site';

interface NavbarProps {
  onNavigateStore: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateStore }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isIslandOpen, setIsIslandOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('work');
  const [brandWidth, setBrandWidth] = useState(165);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const brandRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuTrigger = mobileMenuTriggerRef.current;
    const getFocusableElements = () => Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
        mobileMenuRef.current?.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      menuTrigger?.focus();
    };
  }, [isMobileOpen]);

  // Hover blob state inside floating nav
  const [blobStyle, setBlobStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (brandRef.current) {
        setBrandWidth(brandRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = target.getBoundingClientRect();
      setBlobStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  };

  const handleNavLeave = () => {
    setBlobStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const scrollTo = (id: string) => {
    setActiveLink(id);
    setIsMobileOpen(false);
    setIsIslandOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  // Expanded Island width calculation matching OlafMotion
  const expandedWidth = Math.min(410, Math.max(0, windowWidth - 32));

  return (
    <>
      <header className={`om-top ${isScrolled ? 'is-scrolled' : ''}`}>
        {/* Left: Brand Group with Morphing Dynamic Island */}
        <div className="om-brand-group relative flex items-center">
          {/* Static Brand Link */}
          <a
            ref={brandRef}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('top');
            }}
            className="om-brand select-none"
            aria-label="Vixora Studio home"
          >
            <img className="om-avatar" src={siteConfig.about.portraitImage} alt="" />
            <span className="om-wordmark-sm">
              Vixora<span> Studio</span>
            </span>
          </a>

          {/* Dummy In-flow Placeholder so surrounding navigation never shifts */}
          <div className="om-island-placeholder w-[124px] h-[44px] pointer-events-none opacity-0 ml-2.5" />

          {/* Morphing availability pill */}
          <motion.div
            initial={false}
            animate={{
              left: isIslandOpen ? 0 : brandWidth + 10,
              top: isIslandOpen ? -2 : 0,
              width: isIslandOpen ? expandedWidth : 124,
              height: isIslandOpen ? 66 : 44,
              borderRadius: isIslandOpen ? 33 : 999,
              backgroundColor: '#292929',
              boxShadow: isIslandOpen
                ? '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)'
                : '0 0 0 1px rgba(255, 255, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.18)',
            }}
            transition={{
              type: 'tween',
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setIsIslandOpen(true)}
            onMouseLeave={() => setIsIslandOpen(false)}
            onClick={() => setIsIslandOpen((prev) => !prev)}
            className="om-island-morph"
            role="status"
            aria-label="Booking new projects — show status details"
          >
            <AnimatePresence mode="wait">
              {!isIslandOpen ? (
                /* Compact Pill State */
                <motion.div
                  key="collapsed-pill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center px-4 py-8 bg-green text-white cursor-pointer"
                >
                  <span className="om-pill-dot w-4 h-4"></span> 
                  <span className="font-mono text-xs p-5 uppercase tracking-wider font-semibold">
                    Available
                  </span>
                </motion.div>
              ) : (
                /* Expanded Dynamic Island State */
                <motion.div
                  key="expanded-island"
                  initial={{ opacity: 0, scale: 0.10 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.10 }}
                  transition={{ duration: 0.1, delay: 0.01 }}
                  className="flex items-center justify-between w-full h-full px-3 gap-3 text-white cursor-default"
                >
                  {/* Left: Glowing Avatar + Status */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={siteConfig.about.portraitImage}
                      alt=""
                      className="w-10 h-10 rounded-full bg-white object-cover flex-shrink-0 shadow-[0_0_0_2px_#292929,0_0_0_3px_rgba(255,255,255,0.28),0_0_14px_rgba(255,255,255,0.12)]"
                    />
                    <div className="min-w-0 flex flex-col justify-center">
                      <strong className="text-sm font-bold tracking-tight text-white leading-tight truncate">
                        Booking new projects
                      </strong>
                      <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 leading-tight mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 inline-block animate-pulse" />
                        Reply within 24 hours
                      </span>
                    </div>
                  </div>

                  {/* Right: Direct CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollTo('contact');
                    }}
                    className="om-island-cta "
                  >
                    <span className='text-red'>Start a project</span>
                    <ArrowUpRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Center / Right: Floating Nav with Spring Blob */}
        <nav
          ref={navRef}
          onMouseLeave={handleNavLeave}
          className="om-nav"
          aria-label="Main navigation"
        >
          {/* Sliding Spring Blob */}
          <div
            className="om-nav-hover"
            style={{
              transform: `translateX(${blobStyle.left}px)`,
              width: `${blobStyle.width}px`,
              opacity: blobStyle.opacity,
            }}
          />

          <a
            href="#work"
            onMouseEnter={handleLinkHover}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('work');
            }}
            className={`om-nav-link ${activeLink === 'work' ? 'is-active' : ''}`}
          >
            Selected Work
          </a>
          <a
            href="#stage"
            onMouseEnter={handleLinkHover}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('stage');
            }}
            className={`om-nav-link ${activeLink === 'stage' ? 'is-active' : ''}`}
          >
            Showcase
          </a>
          <a
            href="#services"
            onMouseEnter={handleLinkHover}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('services');
            }}
            className={`om-nav-link ${activeLink === 'services' ? 'is-active' : ''}`}
          >
            Services
          </a>
          <a
            href="#process"
            onMouseEnter={handleLinkHover}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('process');
            }}
            className={`om-nav-link ${activeLink === 'process' ? 'is-active' : ''}`}
          >
            Process
          </a>
          <a
            href="#about"
            onMouseEnter={handleLinkHover}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about');
            }}
            className={`om-nav-link ${activeLink === 'about' ? 'is-active' : ''}`}
          >
            About
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="om-nav-cta items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            className="om-btn"
          >
            <span>Start a project</span>
            <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="om-menu-toggle items-center gap-2">
          <button
            ref={mobileMenuTriggerRef}
            onClick={() => setIsMobileOpen(true)}
            className="min-h-11 min-w-11 p-2.5 rounded-full bg-white shadow-[0_2px_10px_rgba(10,10,11,0.08)] border border-[rgba(10,10,11,0.08)] text-[#0a0a0b]"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {isMobileOpen && (
        <motion.div
          ref={mobileMenuRef}
          id="mobile-navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
          className="om-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between border-b border-[rgba(10,10,11,0.08)] pb-4">
            <div className="flex items-center gap-3">
              <img src={siteConfig.about.portraitImage} alt="" className="h-9 w-9 rounded-full object-cover" />
              <span className="font-bold text-lg">Vixora<span> Studio</span></span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="min-h-11 min-w-11 p-2 rounded-full border border-[rgba(10,10,11,0.1)]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <motion.nav
            className="my-auto py-8 flex flex-col"
            aria-label="Mobile navigation"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.035, staggerDirection: -1 } },
              visible: { transition: { delayChildren: shouldReduceMotion ? 0 : 0.08, staggerChildren: shouldReduceMotion ? 0 : 0.06 } },
            }}
          >
            {['work', 'stage', 'services', 'process', 'about', 'contact'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item);
                }}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="block min-h-14 py-3 border-b border-[rgba(10,10,11,0.05)] text-3xl font-bold tracking-tight text-[#0a0a0b] uppercase"
              >
                <span className="font-mono text-xs text-[#747475] mr-3">0{idx + 1}</span>
                {item}
              </motion.a>
            ))}
          </motion.nav>

          <div className="pt-4 border-t border-[rgba(10,10,11,0.08)]">
            <a
              href={`mailto:${siteConfig.email}`}
              className="w-full om-btn text-center"
            >
              <span>Get in touch</span>
              <Mail size={16} />
            </a>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <a
        href="/store"
        onClick={(event) => {
          event.preventDefault();
          onNavigateStore();
        }}
        className="om-store-launcher"
      >
        <span>Visit store</span>
        <ArrowUpRight size={16} />
      </a>
    </>
  );
};
