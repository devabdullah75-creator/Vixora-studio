export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  tools: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'motion-graphics',
    number: '01',
    title: 'Motion Graphics',
    tagline: 'Brand systems in kinetic motion',
    description:
      'Designing sophisticated 2D and 3D kinetic design systems, brand launch anthems, logo animations, and design assets engineered for high-impact visual retention.',
    deliverables: ['Brand Motion Guidelines', 'Logo Reveals', 'Product Explanations', 'UI Motion Systems'],
    tools: ['After Effects', 'Cinema 4D', 'Illustrator'],
  },
  {
    id: '2d-animation',
    number: '02',
    title: '2D Animation',
    tagline: 'Vector choreography & expressive narratives',
    description:
      'Expressive vector-based character and asset choreography with nuanced easing, anticipation, and rhythm. Transforming abstract concepts into relatable kinetic storytelling.',
    deliverables: ['Explainer Sequences', 'Vector Storytelling', 'Micro-Interactions', 'Editorial Illustrations in Motion'],
    tools: ['After Effects', 'Animate', 'Lottie / Rive'],
  },
  {
    id: 'video-editing',
    number: '03',
    title: 'Video Editing',
    tagline: 'Pacing, montage & sonic synchronization',
    description:
      'Editorial commercial and showreel cutting with hyper-disciplined pacing, sound design integration, dynamic match cuts, and color balance that evokes strong visceral emotion.',
    deliverables: ['Commercial Spot Edits', 'Showreels & Promos', 'Social Reels & Shorts', 'Sound Design Integration'],
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Audition'],
  },
  {
    id: 'visual-design',
    number: '04',
    title: 'Visual Design',
    tagline: 'Graphic architecture & spatial composition',
    description:
      'Foundational art direction, spatial composition, typography selection, color theory, and bespoke style frames that serve as the indestructible bedrock before motion begins.',
    deliverables: ['Style Frames', 'Visual Direction Decks', 'Editorial Layouts', 'Key Visual Art'],
    tools: ['Photoshop', 'Illustrator', 'Figma'],
  },
  {
    id: 'typography-animation',
    number: '05',
    title: 'Typography Animation',
    tagline: 'Letterforms as emotional instruments',
    description:
      'Experimental kinetic type, variable font distortion, kinetic poetry, brutalist posters in movement, and editorial titling for cinematic campaigns and visual identities.',
    deliverables: ['Kinetic Titles', 'Broadcast Lower Thirds', 'Variable Font R&D', 'Experimental Poster Loops'],
    tools: ['After Effects', 'Cavely / Expressions', 'Glyphs'],
  },
];
