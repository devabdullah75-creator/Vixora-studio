import React, { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { socialLinks } from '../data/socialLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#070709]/98 backdrop-blur-2xl p-6 sm:p-10 text-white transition-opacity duration-300">
      {/* Top Bar inside Menu */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            {siteConfig.availability}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white transition-colors border border-white/10 rounded-full"
          aria-label="Close navigation menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="my-auto py-8 flex flex-col space-y-4">
        {siteConfig.navLinks.map((link, idx) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(link.href);
              onClose();
            }}
            className="group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-[#ccff00]/40 transition-colors"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-zinc-600 group-hover:text-[#ccff00] transition-colors">
                0{idx + 1}
              </span>
              <span className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-zinc-300 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                {link.name}
              </span>
            </div>
            <ArrowUpRight
              size={20}
              className="text-zinc-600 group-hover:text-[#ccff00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
            />
          </a>
        ))}
      </nav>

      {/* Footer Info inside Menu */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ccff00] transition-colors"
            >
              {social.name}
            </a>
          ))}
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-600">
          <span>{siteConfig.designerName} // {siteConfig.location}</span>
          <span>{siteConfig.coordinates}</span>
        </div>
      </div>
    </div>
  );
};
