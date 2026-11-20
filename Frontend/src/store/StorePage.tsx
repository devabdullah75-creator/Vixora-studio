import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/site';

interface StorePageProps {
  pathname: string;
  navigate: (destination: string) => void;
}

const currentYear = new Date().getFullYear();

const StoreNavbar: React.FC<{ navigate: (destination: string) => void }> = ({ navigate }) => (
  <header className="store-nav">
    <a className="store-brand" href="/store" onClick={(event) => {
      event.preventDefault();
      navigate('/store');
    }} aria-label="Vixora Studio Store home">
      <img className="store-brand__mark" src={siteConfig.about.portraitImage} alt="" />
      <span className="store-brand__name">VIXORA STUDIO<small>DIGITAL GOODS</small></span>
    </a>
    <span className="store-nav__note">INDEPENDENT TOOLS FOR VISUAL THINKERS</span>
    <button className="store-back-link" onClick={() => navigate('/')} type="button">
      <ArrowLeft size={15} />
      <span>Back to portfolio</span>
    </button>
  </header>
);

const StoreFooter: React.FC<{ navigate: (destination: string) => void }> = ({ navigate }) => (
  <footer className="store-footer">
    <a className="store-footer__brand" href="/store" onClick={(event) => {
      event.preventDefault();
      navigate('/store');
    }}>VIXORA STUDIO</a>
    <p>Original digital tools, made by Abdullah.</p>
    <button type="button" onClick={() => navigate('/')}>Back to portfolio <ArrowUpRight size={14} /></button>
    <small>© {currentYear} VIXORA STUDIO.</small>
  </footer>
);

export const StorePage: React.FC<StorePageProps> = ({ pathname, navigate }) => {
  useEffect(() => {
    document.title = 'Vixora Studio Store — Coming Soon';
    return () => {
      document.title = 'Vixora Studio — Abdullah | Custom Motion Design & Visual Art';
    };
  }, [pathname]);

  return (
    <main className="store-page store-coming-soon page-motion">
      <StoreNavbar navigate={navigate} />
      <section className="store-coming-soon__hero" aria-labelledby="store-coming-soon-title">
        <div className="store-coming-soon__texture" aria-hidden="true" />
        <div className="store-coming-soon__orb store-coming-soon__orb--one" aria-hidden="true" />
        <div className="store-coming-soon__orb store-coming-soon__orb--two" aria-hidden="true" />
        <div className="store-coming-soon__content">
          <p className="store-coming-soon__eyebrow"><span /> VIXORA STUDIO STORE <span>— INDEPENDENT DIGITAL GOODS</span></p>
          <h1 id="store-coming-soon-title">Store<br /><em>coming soon.</em></h1>
          <p className="store-coming-soon__copy">
            A curated collection of motion assets and creative tools is being prepared in the studio.
            Until launch, you can explore Vixora's work and get in touch.
          </p>
          <div className="store-coming-soon__actions">
            <button className="store-primary-button" type="button" onClick={() => navigate('/')}>
              Explore the portfolio <ArrowUpRight size={16} />
            </button>
            <a className="store-coming-soon__contact" href="/#contact">Get in touch <ArrowRight size={15} /></a>
          </div>
        </div>
        <p className="store-coming-soon__side-label">NEW COLLECTION / IN THE WORKS</p>
      </section>
      <StoreFooter navigate={navigate} />
    </main>
  );
};
