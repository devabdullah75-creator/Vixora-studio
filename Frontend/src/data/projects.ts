export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  role: string;
  duration: string;
  tools: string[];
  description: string;
  approach: string;
  outcome: string;
  tags: string[];
  accentColor: string;
  aspectRatio: 'cinematic' | 'portrait' | 'landscape';
  thumbnailUrl: string;
  stills: string[];
  stats?: { label: string; value: string }[];
}

export const projectsData: Project[] = [
  {
    id: 'visual-identity-in-motion',
    number: '01',
    title: 'Visual Identity in Motion',
    subtitle: 'Kinetic rebrand system for next-gen synthetic architecture',
    category: 'Brand Motion & System',
    year: '2025',
    client: 'Kinetix Studio (Concept)',
    role: 'Motion Director & Animator',
    duration: '0:45 Reel',
    tools: ['After Effects', 'Illustrator', 'Cinema 4D'],
    description:
      'A comprehensive dynamic identity system exploring how rigid geometric logomarks behave under algorithmic physical tension. Every letterform transforms organically while maintaining structural recognition.',
    approach:
      'We dissected traditional brand guidelines into kinetic rules—velocity parameters, spring damping constants, and spatial choreography guidelines for cross-platform deployment.',
    outcome:
      'Delivered a modular motion toolkit with 14 kinetic logo states, 8 UI transitions, and an editorial promo video.',
    tags: ['Kinetic Identity', 'Vector Choreography', 'Brand System', '2D/3D Hybrid'],
    accentColor: '#ccff00',
    aspectRatio: 'cinematic',
    thumbnailUrl: '/assets/images/project-01.jpg',
    stills: [
      '/assets/images/project-01-still-1.jpg',
      '/assets/images/project-01-still-2.jpg',
      '/assets/images/project-01-still-3.jpg',
    ],
    stats: [
      { label: 'Asset Modules', value: '14 States' },
      { label: 'Render Pipeline', value: '4K 60fps' },
      { label: 'Easing Style', value: 'Overshoot 1.2' },
    ],
  },
  {
    id: 'abstract-dimensions',
    number: '02',
    title: 'Abstract Dimensions',
    subtitle: 'Procedural chromatic distortions in non-Euclidean space',
    category: 'Experimental 3D',
    year: '2025',
    client: 'Self-Initiated R&D',
    role: 'Visual Artist & Technical Director',
    duration: 'Looping Installation',
    tools: ['Cinema 4D', 'Octane Render', 'After Effects'],
    description:
      'An audiovisual exploration into high-refraction glass, liquid chrome metallurgy, and volumetric light scattering. Investigating how pure light diffraction evokes tactile emotion.',
    approach:
      'Simulated complex caustic light paths through deformed prism geometries, synchronized with sub-bass ambient audio frequencies.',
    outcome:
      'Selected for digital exhibition showcase and featured in multiple design community curation reels.',
    tags: ['Procedural 3D', 'Caustics & Glass', 'Lighting Study', 'Abstract Motion'],
    accentColor: '#93c5fd',
    aspectRatio: 'portrait',
    thumbnailUrl: '/assets/images/project-02.jpg',
    stills: [
      '/assets/images/project-02-still-1.jpg',
      '/assets/images/project-02-still-2.jpg',
    ],
    stats: [
      { label: 'Samples per Frame', value: '4096' },
      { label: 'Color Space', value: 'ACEScg' },
      { label: 'Frame Count', value: '1800 Loops' },
    ],
  },
  {
    id: 'product-motion-study',
    number: '03',
    title: 'Product Motion Study',
    subtitle: 'Kinetic industrial design commercial for stealth audio gear',
    category: 'Product Animation',
    year: '2024',
    client: 'AURA Acoustics (Concept)',
    role: 'Lead 3D Animator',
    duration: '0:30 Commercial',
    tools: ['Cinema 4D', 'Redshift', 'After Effects', 'Premiere Pro'],
    description:
      'Macro-lens product choreography showcasing the inner acoustic chambers, matte ceramic unibody, and magnetic tactile latch of high-fidelity wireless listening devices.',
    approach:
      'Combined extreme macro focal lengths with sweeping orbital camera moves, revealing microscopic surface textures under dramatic edge-lighting.',
    outcome:
      'Created a turnkey cinematic commercial spot, social vertical cuts, and an interactive e-commerce product turn loop.',
    tags: ['Industrial Design', 'Macro Lighting', 'Commercial Spot', 'Exploded View'],
    accentColor: '#f97316',
    aspectRatio: 'landscape',
    thumbnailUrl: '/assets/images/project-03.jpg',
    stills: [
      '/assets/images/project-03-still-1.jpg',
      '/assets/images/project-03-still-2.jpg',
    ],
    stats: [
      { label: 'Mesh Polycount', value: '1.8M Tris' },
      { label: 'Shot Count', value: '7 Angles' },
      { label: 'Render Time', value: '48h Cluster' },
    ],
  },
  {
    id: 'typography-experiments',
    number: '04',
    title: 'Typography Experiments',
    subtitle: 'Brutalist kinetic type loops and variable font deconstruction',
    category: 'Kinetic Type & Poster',
    year: '2024',
    client: 'TypeLab Berlin (Collaborative R&D)',
    role: 'Type Choreographer & Animator',
    duration: 'Series of 10 Loops',
    tools: ['After Effects', 'Expressions / ExtendScript', 'Illustrator'],
    description:
      'Testing the tensile limits of heavy grotesque letterforms through kinetic shearing, staggered variable axes, kinetic marquee ribbons, and retro-futuristic CRT scanline treatments.',
    approach:
      'Programmed custom mathematical easing curves directly in After Effects expressions to trigger ripples and elastic wave propagation across typographic grids.',
    outcome:
      'A viral series of 10 infinite looping kinetic posters, downloaded by over 20,000 design enthusiasts and featured in type publications.',
    tags: ['Kinetic Type', 'Brutalist Editorial', 'Math Easing', 'Poster Design'],
    accentColor: '#e11d48',
    aspectRatio: 'portrait',
    thumbnailUrl: '/assets/images/project-04.jpg',
    stills: [
      '/assets/images/project-04-still-1.jpg',
      '/assets/images/project-04-still-2.jpg',
    ],
    stats: [
      { label: 'Poster Series', value: '10 Unique Pieces' },
      { label: 'Font Weight Range', value: '100 - 900' },
      { label: 'Code Driven', value: '100% Expressions' },
    ],
  },
  {
    id: 'digital-campaign',
    number: '05',
    title: 'Digital Campaign',
    subtitle: 'High-energy kinetic motion package for neo-banking platform launch',
    category: 'Commercial & UI Motion',
    year: '2024',
    client: 'Vault Finance (Concept)',
    role: 'Senior Motion Designer',
    duration: '0:60 Hero Film + 6 Cutdowns',
    tools: ['After Effects', 'Premiere Pro', 'Figma'],
    description:
      'Crafted a high-octane launch campaign juxtaposing rapid metric data visualizations, floating glass payment cards, and tactile UI interactions into a synchronized visual symphony.',
    approach:
      'Collaborated closely with product designers to translate real product micro-interactions into exaggerated, high-energy cinematic commercials for web and billboard display.',
    outcome:
      'Complete launch campaign kit delivered across 16:9 widescreen, 9:16 mobile feeds, and 1:1 square advertising formats.',
    tags: ['UI Animation', 'Commercial Campaign', 'Fintech', 'Kinetic Rhythm'],
    accentColor: '#10b981',
    aspectRatio: 'cinematic',
    thumbnailUrl: '/assets/images/project-05.jpg',
    stills: [
      '/assets/images/project-05-still-1.jpg',
      '/assets/images/project-05-still-2.jpg',
    ],
    stats: [
      { label: 'Campaign Reach', value: 'Launch Kit' },
      { label: 'Deliverables', value: '12 Formats' },
      { label: 'Audio Sync', value: '128 BPM Lock' },
    ],
  },
  {
    id: 'motion-exploration',
    number: '06',
    title: 'Motion Exploration',
    subtitle: 'Subtle physics, fluid simulations and meditative particle ecosystems',
    category: 'Experimental Simulation',
    year: '2023',
    client: 'Personal Archive',
    role: 'Creative Technologist',
    duration: 'Ambient Video Reel',
    tools: ['Blender', 'After Effects', 'Photoshop'],
    description:
      'An introspective research initiative studying organic cloth draping, magnetic particle clusters, and zero-gravity fluid dynamics in minimal monochrome environments.',
    approach:
      'Developed low-friction particle fields influenced by custom vector turbulence fields, exploring how silence and weightlessness feel when animated.',
    outcome:
      'Foundation for future commercial art direction styles and featured as background visualizers for ambient music productions.',
    tags: ['Fluid Physics', 'Particle Systems', 'Zero-G', 'Atmospheric Art'],
    accentColor: '#a855f7',
    aspectRatio: 'landscape',
    thumbnailUrl: '/assets/images/project-06.jpg',
    stills: [
      '/assets/images/project-06-still-1.jpg',
      '/assets/images/project-06-still-2.jpg',
    ],
    stats: [
      { label: 'Particle Count', value: '2.5 Million' },
      { label: 'Physics Solver', value: 'Vellum / FLIP' },
      { label: 'Palette', value: 'Monochrome High-Key' },
    ],
  },
];
