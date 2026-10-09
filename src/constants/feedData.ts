export interface FeedItem {
  id: string;
  title: string;
  snippet: string;
  fullContent: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  comments: number;
  readTime: string;
  date: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  accentColor: string;
  gradientColors: [string, string];
  tags: string[];
}

export const CATEGORIES = [
  'All',
  'Trending',
  'Design',
  'Tech',
  'AI & Mobile',
  'Architecture',
  'Productivity',
];

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    title: 'Building Modern Cross-Platform UIs with Expo & React Native 0.76+',
    snippet: 'Explore performance secrets, smooth gesture animations, and clean modular component architecture for 2026 mobile apps.',
    fullContent: 'Building applications with modern React Native and Expo has evolved dramatically. With continuous native generation (CNG), modern layout systems, and native glass effects, creating high-performing mobile and web applications is smoother than ever.\n\nIn this guide, we dive deep into modular state architecture, micro-animations, and fluid design patterns that wows users on both iOS and Android.',
    category: 'AI & Mobile',
    author: {
      name: 'Elena Rostova',
      avatar: 'ER',
      role: 'Lead UI Architect',
    },
    likes: 342,
    comments: 48,
    readTime: '5 min read',
    date: 'Sep 28, 2026',
    accentColor: '#6366F1',
    gradientColors: ['#4F46E5', '#818CF8'],
    tags: ['React Native', 'Expo', 'UI/UX', 'Mobile'],
  },
  {
    id: '2',
    title: 'Design Systems for Next-Gen Mobile Experiences',
    snippet: 'How to structure cohesive design tokens, typography scales, and dark-mode color palettes for maximum visual impact.',
    fullContent: 'A design system is more than just a component UI kit; it is a dynamic language shared across engineering and product design teams.\n\nWe discuss maintaining token parity between iOS, Android, and Web platforms using unified HSL color scales and typography primitives.',
    category: 'Design',
    author: {
      name: 'Marcus Vance',
      avatar: 'MV',
      role: 'Staff Designer',
    },
    likes: 512,
    comments: 89,
    readTime: '7 min read',
    date: 'Sep 29, 2026',
    accentColor: '#EC4899',
    gradientColors: ['#DB2777', '#F472B6'],
    tags: ['Design System', 'Typography', 'Dark Mode'],
  },
  {
    id: '3',
    title: 'Next-Gen On-Device AI Assistants & Micro-Models',
    snippet: 'Leveraging light-weight local LLMs and reactive agentic patterns inside mobile app workflows.',
    fullContent: 'On-device intelligence is revolutionizing mobile interaction models. By integrating local multi-modal inference and background task execution, applications can deliver real-time assistance with total privacy and instant response times.',
    category: 'AI & Mobile',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC',
      role: 'AI Researcher',
    },
    likes: 890,
    comments: 114,
    readTime: '6 min read',
    date: 'Sep 29, 2026',
    accentColor: '#10B981',
    gradientColors: ['#059669', '#34D399'],
    tags: ['AI', 'LLM', 'Edge AI', 'Mobile'],
  },
  {
    id: '4',
    title: 'Architecting Scalable State with React Query & Reanimated',
    snippet: 'Combining optimistic UI updates with 60fps gesture animations for silky smooth interactive feeds.',
    fullContent: 'Fluid user interaction depends on responsive state sync and worklet-driven animations. Learn how to bind React Native Reanimated gestures to local storage cache for zero-latency UI responses.',
    category: 'Tech',
    author: {
      name: 'Alex Rivera',
      avatar: 'AR',
      role: 'Principal Engineer',
    },
    likes: 275,
    comments: 32,
    readTime: '4 min read',
    date: 'Sep 27, 2026',
    accentColor: '#F59E0B',
    gradientColors: ['#D97706', '#FBBF24'],
    tags: ['Reanimated', 'State', 'Performance'],
  },
  {
    id: '5',
    title: 'Minimalist Spatial Interfaces and Glassmorphic Design',
    snippet: 'Creating sleek translucent cards, depth shadows, and elegant glass backdrop blurs.',
    fullContent: 'Glassmorphism brings depth and spatial hierarchy to modern interfaces. Discover techniques for layered blurs, subtle glowing borders, and dark slate backgrounds.',
    category: 'Architecture',
    author: {
      name: 'Sophia Laurent',
      avatar: 'SL',
      role: 'Creative Director',
    },
    likes: 640,
    comments: 76,
    readTime: '8 min read',
    date: 'Sep 26, 2026',
    accentColor: '#8B5CF6',
    gradientColors: ['#7C3AED', '#A78BFA'],
    tags: ['Glassmorphism', 'Spatial', 'UI Layout'],
  },
  {
    id: '6',
    title: 'Deep Focus & Flow State: Engineering Productive Workflows',
    snippet: 'Practical tools and interface patterns designed to reduce cognitive load and enhance focus.',
    fullContent: 'Interface density can either empower or overwhelm users. We explore visual pacing, content chunking, and contextual action menus that foster flow state during deep technical tasks.',
    category: 'Productivity',
    author: {
      name: 'David Kim',
      avatar: 'DK',
      role: 'Product Strategist',
    },
    likes: 410,
    comments: 29,
    readTime: '5 min read',
    date: 'Sep 25, 2026',
    accentColor: '#06B6D4',
    gradientColors: ['#0891B2', '#22D3EE'],
    tags: ['UX', 'Productivity', 'Workflow'],
  },
];
