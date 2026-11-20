export interface SiteConfig {
  brandName: string;
  designerName: string;
  profession: string;
  location: string;
  coordinates: string;
  timezone: string;
  availability: string;
  isAvailable: boolean;
  email: string;
  navLinks: { name: string; href: string }[];
  tagline: string;
  headline: {
    line1: string;
    line2: string;
  };
  heroBio: string;
  about: {
    title: string;
    lead: string;
    bioParagraphs: string[];
    philosophy: string;
    software: string[];
    disciplines: string[];
    portraitImage: string;
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'Vixora Studio®',
  designerName: 'Abdullah',
  profession: 'Motion Designer & Visual Artist',
  location: 'Based in Pakistan',
  coordinates: '31.5204° N, 74.3587° E',
  timezone: 'PKT (UTC+5)',
  availability: 'AVAILABLE FOR SELECT PROJECTS',
  isAvailable: true,
  email: 'devabdullah75@gmail.com',
  tagline: 'Designing Motion. Creating Impact.',
  headline: {
    line1: 'DESIGNING MOTION.',
    line2: 'CREATING IMPACT.',
  },
  heroBio:
    "I'm Abdullah, an independent motion designer crafting expressive visuals, animations and digital experiences.",
  navLinks: [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ],
  about: {
    title: 'THE PERSON BEHIND THE MOTION.',
    lead: 'Bridging pure aesthetic instinct with kinetic discipline to build identities that transcend static boundaries.',
    bioParagraphs: [
      "I'm Abdullah, an independent motion designer and visual artist from Pakistan. Over the years, I've immersed myself in the language of timing, spatial rhythm, and expressive movement.",
      'My work is driven by curiosity—deconstructing complex narratives and distilling them into hypnotic, purpose-led motion systems. Whether collaborating with ambitious startups or established global brands, I approach every frame as a canvas for visual distinction.',
      'Beyond client engagements, I actively explore generative typography, procedural textures, and cinematic physics, continuously seeking the emotional resonance that only motion can unlock.',
    ],
    philosophy:
      'Motion is not merely decoration—it is the pulse of communication. Every acceleration curve, pause, and frame holds emotional weight.',
    software: [
      'Adobe After Effects',
      'Web Designer',
      'Adobe Illustrator',
      'Figma',
      'Maxon Cinema 4D',
      'Blender 3D',
    ],
    disciplines: [
      'Kinetic Identity',
      'Broadcast & Brand Motion',
      'Art Direction',
      'Procedural Typography',
      'Editorial Video Editing',
      'UI Choreography',
    ],
    portraitImage: '/assets/images/abdullah-avatar.png',
  },
};
