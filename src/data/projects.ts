export interface SelectedProject {
  id: string;
  name: string;
  tags: string[];
  description: string;
  ctaLabel: string;
  url?: string;
  mediaType: 'dual-device' | 'single-visual';
  desktopLabel: string;
  phoneLabel?: string;
  phoneImage?: string;
  desktopImage?: string;
  desktopAlt: string;
  phoneAlt?: string;
}

export interface WorkNicheGroup {
  id: string;
  name: string;
}

export interface ArchiveProject {
  id: string;
  nicheId: string;
  niche: string;
  name: string;
  tags: string[];
  url: string;
  thumbnailLabel: string;
  thumbnailAlt: string;
  thumbnailImage?: string;
}

export interface ServiceItem {
  id: string;
  index: number;
  name: string;
  description: string;
  tags: string[];
}

export interface StackRow {
  label: string;
  items: string;
}

export const SITE_IDENTITY = {
  navName: 'Alyan',
  heroName: 'ALYAN',
  fullName: 'Alyan Hassan',
  footerName: 'ALYAN HASSAN',
  pageTitle: 'Alyan Hassan | Full Stack Developer & Software Builder, Karachi',
  heroPitchLines: [
    'I build websites, software, and AI automation',
    'for businesses that want to work smarter',
    'and grow faster.',
  ],
  location: 'Karachi, Pakistan',
  availability: 'Available for projects',
  email: 'alyan.automations@gmail.com',
  selectedWorkIntro: [
    "A few concept projects I've designed and built end to end —",
    'from layout and interface to the code that runs them.',
  ],
  contactHeading: 'Have a project in mind?',
  contactSubline: "Send a message and let's talk about what you're building.",
  workPageHeading: 'All Work',
  workPageIntro: 'Every concept project, grouped by industry.',
};

export const SELECTED_PROJECTS: SelectedProject[] = [
  {
    id: 'sukoon',
    name: 'SUKOON',
    tags: ['Full Stack Development', 'Concept'],
    description:
      'A premium furniture flagship concept for a Karachi-based maker, presenting five signature pieces with WhatsApp reservations.',
    ctaLabel: 'View live',
    url: 'https://furniture-new-ten.vercel.app/',
    mediaType: 'dual-device',
    desktopLabel: 'Desktop screenshot',
    phoneLabel: 'Phone screenshot',
    desktopImage: '/sukoon-desktop.svg',
    phoneImage: '/sukoon-mobile.svg',
    desktopAlt: 'SUKOON desktop screenshot',
    phoneAlt: 'SUKOON mobile phone screenshot',
  },
  {
    id: 'atlas-architects',
    name: 'ATLAS ARCHITECTS',
    tags: ['Full Stack Development', 'Concept'],
    description: 'A studio website concept for an architecture practice.',
    ctaLabel: 'View live',
    url: 'https://atlas-architects.vercel.app/',
    mediaType: 'dual-device',
    desktopLabel: 'Desktop screenshot',
    phoneLabel: 'Phone screenshot',
    desktopImage: '/atlas-desktop.svg',
    phoneImage: '/atlas-mobile.svg',
    desktopAlt: 'ATLAS ARCHITECTS desktop screenshot',
    phoneAlt: 'ATLAS ARCHITECTS mobile phone screenshot',
  },
  {
    id: 'pyntflow',
    name: 'Pyntflow',
    tags: ['Software Development', 'Product'],
    description:
      'Point-of-sale and inventory software for paint shops and dealers: fast counter billing, gallon and drum stock, painter credit ledgers, supplier purchases and returns, AI invoice scanning and paint-token tracking. Co-built for a paint retailer ahead of launch and being demonstrated to other shops.',
    ctaLabel: 'Visit pyntflow.com',
    url: 'https://pyntflow.com/',
    mediaType: 'dual-device',
    desktopLabel: 'POS counter screenshot',
    phoneLabel: 'Second screenshot',
    desktopImage: '/pyntflow-desktop.svg',
    phoneImage: '/pyntflow-mobile.svg',
    desktopAlt: 'Pyntflow POS counter screenshot',
    phoneAlt: 'Pyntflow mobile screenshot',
  },
  {
    id: 'forge-athletic',
    name: 'FORGE.ATHLETIC',
    tags: ['Full Stack Development', 'Concept'],
    description:
      'A high-performance gym website concept, built around strength and conditioning training.',
    ctaLabel: 'View live',
    url: 'https://gym-eight-murex-73.vercel.app/',
    mediaType: 'dual-device',
    desktopLabel: 'Desktop screenshot',
    phoneLabel: 'Phone screenshot',
    desktopImage: '/forge-desktop.png',
    phoneImage: '/forge-mobile.png',
    desktopAlt: 'FORGE.ATHLETIC desktop screenshot',
    phoneAlt: 'FORGE.ATHLETIC mobile phone screenshot',
  },
];

export const WORK_NICHES: WorkNicheGroup[] = [
  { id: 'niche-real-estate', name: 'Real Estate' },
  {
    id: 'niche-architecture-construction',
    name: 'Architecture and Construction',
  },
  {
    id: 'niche-retail-furniture-automotive',
    name: 'Retail, Furniture and Automotive',
  },
  { id: 'niche-hospitality-travel', name: 'Hospitality and Travel' },
  { id: 'niche-health-wellness', name: 'Health and Wellness' },
  { id: 'niche-fitness', name: 'Fitness' },
  { id: 'niche-professional-services', name: 'Professional Services' },
];

export const ALL_WORK_PROJECTS: ArchiveProject[] = [
  // Real Estate
  {
    id: 'work-aurelia-estates',
    nicheId: 'niche-real-estate',
    niche: 'Real Estate',
    name: 'Aurelia Estates',
    tags: ['Real Estate', 'Concept'],
    url: 'https://real-state-peach-beta.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Aurelia Estates screenshot',
    thumbnailImage: '/aurelia-estates.png',
  },

  // Architecture and Construction
  {
    id: 'work-atlas-architects',
    nicheId: 'niche-architecture-construction',
    niche: 'Architecture and Construction',
    name: 'Atlas Architects',
    tags: ['Architecture', 'Concept'],
    url: 'https://atlas-architects.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Atlas Architects screenshot',
    thumbnailImage: '/atlas-desktop.svg',
  },
  {
    id: 'work-titan-build-group',
    nicheId: 'niche-architecture-construction',
    niche: 'Architecture and Construction',
    name: 'Titan Build Group',
    tags: ['Construction', 'Concept'],
    url: 'https://titan-build-group.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Titan Build Group screenshot',
    thumbnailImage: '/titan-build-group.png',
  },

  // Retail, Furniture and Automotive
  {
    id: 'work-sukoon',
    nicheId: 'niche-retail-furniture-automotive',
    niche: 'Retail, Furniture and Automotive',
    name: 'SUKOON',
    tags: ['Furniture', 'Concept'],
    url: 'https://furniture-new-ten.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'SUKOON screenshot',
    thumbnailImage: '/sukoon-desktop.svg',
  },
  {
    id: 'work-the-atelier-showcase',
    nicheId: 'niche-retail-furniture-automotive',
    niche: 'Retail, Furniture and Automotive',
    name: 'The Atelier Showcase',
    tags: ['Furniture', 'Concept'],
    url: 'https://furniture-showcase-brown.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'The Atelier Showcase screenshot',
    thumbnailImage: '/the-atelier-showcase.png',
  },

  // Hospitality and Travel
  {
    id: 'work-ember-and-oak',
    nicheId: 'niche-hospitality-travel',
    niche: 'Hospitality and Travel',
    name: 'Ember & Oak',
    tags: ['Restaurant', 'Concept'],
    url: 'https://resturant-five-gamma.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Ember & Oak screenshot',
    thumbnailImage: '/ember-and-oak.png',
  },
  {
    id: 'work-azure-cove-resort',
    nicheId: 'niche-hospitality-travel',
    niche: 'Hospitality and Travel',
    name: 'Azure Cove Resort',
    tags: ['Hospitality', 'Concept'],
    url: 'https://azure-cove-resort.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Azure Cove Resort screenshot',
    thumbnailImage: '/azure-cove-resort.png',
  },
  {
    id: 'work-nomadly',
    nicheId: 'niche-hospitality-travel',
    niche: 'Hospitality and Travel',
    name: 'Nomadly',
    tags: ['Travel', 'Concept'],
    url: 'https://nomadly-travels.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Nomadly screenshot',
    thumbnailImage: '/nomadly.png',
  },

  // Health and Wellness
  {
    id: 'work-luxora-dental',
    nicheId: 'niche-health-wellness',
    niche: 'Health and Wellness',
    name: 'Luxora Dental',
    tags: ['Dental', 'Concept'],
    url: 'https://luxora-dental.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Luxora Dental screenshot',
    thumbnailImage: '/luxora-dental.png',
  },
  {
    id: 'work-solara-retreat',
    nicheId: 'niche-health-wellness',
    niche: 'Health and Wellness',
    name: 'Solara Retreat',
    tags: ['Wellness and Spa', 'Concept'],
    url: 'https://solara-retreat.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Solara Retreat screenshot',
    thumbnailImage: '/solara-retreat.png',
  },

  // Fitness
  {
    id: 'work-forge-athletic',
    nicheId: 'niche-fitness',
    niche: 'Fitness',
    name: 'FORGE.ATHLETIC',
    tags: ['Full Stack Development', 'Concept'],
    url: 'https://gym-eight-murex-73.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'FORGE.ATHLETIC screenshot',
    thumbnailImage: '/forge-desktop.png',
  },

  // Professional Services
  {
    id: 'work-harrison-and-rowe',
    nicheId: 'niche-professional-services',
    niche: 'Professional Services',
    name: 'Harrison & Rowe',
    tags: ['Legal', 'Concept'],
    url: 'https://law-firm-mu-umber.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Harrison & Rowe screenshot',
    thumbnailImage: '/harrison-and-rowe.png',
  },
  {
    id: 'work-northridge-advisors',
    nicheId: 'niche-professional-services',
    niche: 'Professional Services',
    name: 'Northridge Advisors',
    tags: ['Accounting and Tax', 'Concept'],
    url: 'https://northridge-advisors.vercel.app/',
    thumbnailLabel: '16:10 thumbnail',
    thumbnailAlt: 'Northridge Advisors screenshot',
    thumbnailImage: '/northridge-advisors.png',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'service-full-stack-development',
    index: 1,
    name: 'Full Stack Development',
    description:
      'Fast, well-built websites and web applications for businesses, from the interface to the database, including booking systems and admin dashboards.',
    tags: [
      'Business websites',
      'Web applications',
      'Booking systems',
      'Admin dashboards',
      'Basic SEO',
    ],
  },
  {
    id: 'service-ai-automation',
    index: 2,
    name: 'AI Automation',
    description:
      'Chatbots, voice agents, and custom workflows that take repeat work off your team — automated email replies, lead scraping, document processing, and even automatic video uploads to platforms like YouTube.',
    tags: [
      'Chatbots',
      'Voice agents',
      'Workflow automation',
      'Lead generation',
    ],
  },
  {
    id: 'service-software-development',
    index: 3,
    name: 'Software Development',
    description:
      'Custom software built around how a specific industry actually works, from point of sale to inventory and ledgers.',
    tags: [
      'Point of sale',
      'Inventory systems',
      'Ledgers and reporting',
      'Industry-specific software',
    ],
  },
];

export const ABOUT_DATA = {
  photo: '/alyan-portrait.jpg',
  photoAlt: 'Alyan Hassan portrait',
  paragraph:
    "I'm Alyan Hassan, a full stack developer and AI automation specialist based in Karachi. I'm currently completing Aptech's ACCP-AI diploma in software engineering alongside my intermediate studies, and I've been building real projects since I started, most recently Pyntflow, a point-of-sale system I co-built for the paint industry.",
  paragraphs: [
    // Block 1 (existing)
    "I'm Alyan Hassan, a full stack developer and AI automation specialist based in Karachi. I'm currently completing Aptech's ACCP-AI diploma in software engineering alongside my intermediate studies, and I've been building real projects since I started, most recently Pyntflow, a point-of-sale system I co-built for the paint industry.",
    // Block 2 [PLACEHOLDER]
    "I'm self-taught at the core of it, and what pulls me into this field is genuine curiosity — I like taking a business's actual problem and figuring out exactly what needs to be built, then building it properly.",
    // Block 3 [PLACEHOLDER]
    "I care about work that's fast, clear, and easy for a business to use, whether that's a small concept site or a full piece of software running a shop's daily operations.",
  ],
  stack: [
    {
      label: 'Frontend',
      items: 'HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS',
    },
    {
      label: 'Backend',
      items: 'PHP, Laravel, Java, C#, .NET, Node.js',
    },
    {
      label: 'Data',
      items: 'SQL, MySQL, Supabase (PostgreSQL)',
    },
    {
      label: 'AI and automation',
      items: 'Gemini API, n8n and other automation tools, REST APIs',
    },
    {
      label: 'Tools and deployment',
      items: 'Git, GitHub, Vercel',
    },
  ] as StackRow[],
  facts: ['Based in Karachi', 'Self-taught', 'Working remotely'],
  counters: [
    {
      value: '13',
      label: '13 concept websites',
    },
    {
      value: '1',
      label: '1 software product built',
    },
  ],
};

export const CONTACT_DATA = {
  projectEnquiries: [
    {
      label: 'alyan.automations@gmail.com',
      href: 'mailto:alyan.automations@gmail.com',
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/923365976444',
    },
  ],
};
