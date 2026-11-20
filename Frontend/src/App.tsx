import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLenis } from './hooks/useLenis';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StageShowcase } from './components/StageShowcase';
import { Tagline } from './components/Tagline';
import { SelectedWork } from './components/SelectedWork';
import { ProcessFlow } from './components/ProcessFlow';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { projectsData } from './data/projects';
import type { Project } from './data/projects';
import { StorePage } from './store/StorePage';
import { AdminPage } from './admin/AdminPage';
import './store/Store.css';
import './admin/Admin.css';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isStoreRoute = pathname === '/store' || pathname.startsWith('/store/');
  const isAdminRoute = pathname === '/admin' || pathname === '/admin/';
  useLenis(!isStoreRoute && !isAdminRoute);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(() => (
    !window.location.pathname.startsWith('/store') && !/^\/admin\/?$/.test(window.location.pathname)
  ));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<HTMLDivElement>(null);
  const transitionLockRef = useRef(false);
  const queuedPathRef = useRef<string | null>(null);
  const handlePreloaderComplete = useCallback(() => setIsLoading(false), []);

  const transitionTo = useCallback((destination: string, updateHistory = true) => {
    if (transitionLockRef.current || (updateHistory && destination === window.location.pathname)) return;
    transitionLockRef.current = true;
    setIsTransitioning(true);

    const curtain = transitionRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!curtain) {
      if (updateHistory) window.history.pushState(null, '', destination);
      setPathname(destination);
      transitionLockRef.current = false;
      setIsTransitioning(false);
      return;
    }

    const mark = curtain.querySelector('.abx-transition-mark');
    const duration = reducedMotion ? 0.01 : 0.72;
    gsap.set(curtain, { autoAlpha: 1, pointerEvents: 'auto', clipPath: 'circle(0% at 50% 50%)' });
    gsap.set(mark, { autoAlpha: 0, scale: 0.72, rotate: -7 });

    gsap.timeline({
      onComplete: () => {
        transitionLockRef.current = false;
        setIsTransitioning(false);
      },
    })
      .to(mark, {
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        duration: reducedMotion ? 0.01 : 0.32,
        ease: 'back.out(1.7)',
      })
      .to(curtain, {
        clipPath: 'circle(150% at 50% 50%)',
        duration,
        ease: reducedMotion ? 'none' : 'power3.inOut',
      }, '-=0.08')
      .call(() => {
        const nextPath = queuedPathRef.current ?? destination;
        queuedPathRef.current = null;
        if (updateHistory && nextPath === destination) {
          window.history.pushState(null, '', destination);
        }
        setPathname(nextPath);
        window.scrollTo({ top: 0, behavior: 'auto' });
      })
      .to(mark, {
        autoAlpha: 0,
        scale: 1.15,
        duration: reducedMotion ? 0.01 : 0.18,
        ease: 'power2.in',
      }, '+=0.08')
      .to(curtain, {
        clipPath: 'circle(0% at 50% 50%)',
        duration,
        ease: reducedMotion ? 'none' : 'power4.inOut',
        onComplete: () => gsap.set(curtain, { autoAlpha: 0, pointerEvents: 'none' }),
      }, '<');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname;
      if (transitionLockRef.current) {
        queuedPathRef.current = nextPath;
        return;
      }
      transitionTo(nextPath, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [transitionTo]);

  useLayoutEffect(() => {
    if (isLoading) return;
    const page = document.querySelector<HTMLElement>('.page-motion');
    if (!page) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.fromTo(page, { y: reducedMotion ? 0 : 18, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: reducedMotion ? 0.01 : 0.6,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
    });
  }, [pathname, isLoading]);

  return (
    <>
      <div
        ref={transitionRef}
        className="abx-route-transition"
        aria-hidden="true"
        data-transitioning={isTransitioning}
      >
        <div className="abx-transition-mark">
          <img src="/Group%203.png" alt="" />
        </div>
      </div>
      {isStoreRoute ? (
        <StorePage pathname={pathname} navigate={transitionTo} />
      ) : isAdminRoute ? (
        <AdminPage navigate={transitionTo} />
      ) : (
      <div className="page-motion relative min-h-screen bg-[#f7f9fc] text-[#0a0a0b] font-body selection:bg-[#1e5eff] selection:text-white">
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Top Floating Navigation with Dynamic Island & Spring Hover Blob */}
      <Navbar onNavigateStore={() => transitionTo('/store')} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <StageShowcase onSelectProject={setActiveProject} />
        <Tagline />
        <SelectedWork />
        <ProcessFlow />
        <Services />
        <About />
        <Contact />
      </main>

      {/* Footer with Floating Social Balloons */}
      <Footer />

      {/* Project Detail Modal Overlay */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectProject={setActiveProject}
        allProjects={projectsData}
      />
      </div>
      )}
    </>
  );
};

export default App;
