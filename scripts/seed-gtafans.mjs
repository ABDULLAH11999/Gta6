import fs from 'fs/promises'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { Pool } from 'pg'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')

const categories = [
  {
    id: 'cat-trailers',
    slug: 'trailers',
    name: 'Trailers',
    description: 'Trailer breakdowns, scene analysis, and hidden detail coverage.',
    accent: 'from-fuchsia-500 to-violet-500',
    order: 1,
    icon: 'play',
  },
  {
    id: 'cat-gameplay',
    slug: 'gameplay',
    name: 'Gameplay',
    description: 'Mechanics, systems, features, and open-world speculation.',
    accent: 'from-sky-500 to-cyan-400',
    order: 2,
    icon: 'joystick',
  },
  {
    id: 'cat-characters',
    slug: 'characters',
    name: 'Characters',
    description: 'Jason, Lucia, and every supporting cast breakdown.',
    accent: 'from-rose-500 to-orange-400',
    order: 3,
    icon: 'users',
  },
  {
    id: 'cat-locations',
    slug: 'locations',
    name: 'Locations',
    description: 'Vice City mapping, district guides, and Florida-inspired spots.',
    accent: 'from-emerald-500 to-teal-400',
    order: 4,
    icon: 'map',
  },
  {
    id: 'cat-resources',
    slug: 'resources',
    name: 'Resources',
    description: 'Downloads, release guides, timelines, and reference lists.',
    accent: 'from-amber-400 to-orange-500',
    order: 5,
    icon: 'book-open',
  },
]

const hero = {
  city: '/blog/images/Jason_and_Lucia_01_landscape.BqEIrjBG.jpg',
  beach: '/blog/images/Vice_City_01.DHWuy4Y4_2lVEv9.webp',
  car: '/blog/images/Vice_City_02.B1Vlj2_O_22RAyG.webp',
  neon: '/blog/images/Real_Dimez_03.CcpVFPll_1vpoSg.webp',
  skyline: '/blog/images/Vice_City_03.BRMlqOUP_1OuDut.webp',
  palm: '/blog/images/Vice_City_04.8wq_uFny_24g4F0.webp',
}

const posts = [
  {
    title: 'Rockstar Just Invented a New Aesthetic: Florida-Core',
    slug: 'rockstar-florida-core-aesthetic',
    categoryId: 'cat-characters',
    excerpt: 'Florida-core is doing more narrative work than most scripts, and Rockstar knows exactly what it is building.',
    summary: 'A style-first breakdown of the Vice City wardrobe language, body language, and visual tone.',
    content: [
      { type: 'heading', level: 2, text: 'The new visual language' },
      { type: 'paragraph', text: 'Rockstar is using fashion, color, and posture to tell story before the characters even speak.' },
      { type: 'image', src: hero.neon, alt: 'Fashion-heavy neon city scene', caption: 'The aesthetic is part of the storytelling.' },
      { type: 'list', items: ['Warm coastal color grading', 'Streetwear and luxury collide', 'Lucia sets the tone for the entire era'] },
    ],
    tags: ['fashion', 'style', 'lucia'],
    heroImage: hero.neon,
    heroImageAlt: 'Fashion-forward neon city scene',
    heroVideoUrl: '',
    galleryImages: [hero.neon, hero.city],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2026-04-20T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
    readTime: '7 min read',
    seoTitle: 'Rockstar Just Invented a New Aesthetic: Florida-Core',
    seoDescription: 'A style-focused breakdown of GTA 6 Florida-core fashion, tone, and Vice City identity.',
    canonicalPath: '/blog/rockstar-florida-core-aesthetic',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 Could Ruin Your Life (And You\'ll Love It)',
    slug: 'gta6-could-ruin-your-life',
    categoryId: 'cat-gameplay',
    excerpt: 'GTA Online already eats time. GTA 6 is shaping up to make that loop even harder to escape.',
    summary: 'A psychology-heavy look at immersion, addiction loops, and why the next game may be even more absorbing.',
    content: [
      { type: 'heading', level: 2, text: 'Why the loop gets stronger' },
      { type: 'paragraph', text: 'The more reactive the world becomes, the easier it is for players to turn one more mission into three more hours.' },
      { type: 'image', src: hero.car, alt: 'Fast-moving city highway', caption: 'Speed, systems, and social pressure all feed the loop.' },
      { type: 'list', items: ['Living world pacing', 'Quest chains that keep escalating', 'Social systems that pull players back in'] },
    ],
    tags: ['GTA 6 addiction', 'GTA Online', 'psychology'],
    heroImage: hero.car,
    heroImageAlt: 'City highway motion blur',
    heroVideoUrl: '',
    galleryImages: [hero.car],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2026-04-18T10:00:00.000Z',
    updatedAt: '2026-04-18T10:00:00.000Z',
    readTime: '8 min read',
    seoTitle: 'GTA 6 Could Ruin Your Life (And You\'ll Love It)',
    seoDescription: 'Why GTA 6 may become an even bigger time sink than GTA Online.',
    canonicalPath: '/blog/gta6-could-ruin-your-life',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 PC Release Date: Is February 2027 Real? Full Breakdown',
    slug: 'gta6-pc-release-date-february-2027',
    categoryId: 'cat-resources',
    excerpt: 'Console launches first, but the PC question is already dominating fan speculation.',
    summary: 'A straightforward guide to the PC window, platform timing, and what the community can realistically expect.',
    content: [
      { type: 'heading', level: 2, text: 'The PC question never goes away' },
      { type: 'paragraph', text: 'Rockstar launches on console first, so the real discussion is not if there will be a PC version, but when.' },
      { type: 'list', items: ['Console first, PC later', 'February 2027 is only a fan estimate', 'No official PC date has been announced'] },
    ],
    tags: ['PC', 'release date', 'platform'],
    heroImage: hero.skyline,
    heroImageAlt: 'Skyline at dusk',
    heroVideoUrl: '',
    galleryImages: [hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2026-04-17T10:00:00.000Z',
    updatedAt: '2026-04-17T10:00:00.000Z',
    readTime: '7 min read',
    seoTitle: 'GTA 6 PC Release Date: Is February 2027 Real? Full Breakdown',
    seoDescription: 'Fan analysis of the likely GTA 6 PC release timing and platform strategy.',
    canonicalPath: '/blog/gta6-pc-release-date-february-2027',
    sourceLinks: [],
  },
  {
    title: 'RAGE 9 Engine Explained: What It Means for GTA 6 (vs Genie 3 AI)',
    slug: 'rage-9-engine-explained',
    categoryId: 'cat-gameplay',
    excerpt: 'Rockstar\'s engine stack is where most of the long-term GTA 6 magic will live.',
    summary: 'An engine-focused article about world detail, physics, AI behavior, and why the tech matters.',
    content: [
      { type: 'heading', level: 2, text: 'Why the engine matters' },
      { type: 'paragraph', text: 'The engine determines how dense the world feels, how the AI reacts, and how far Rockstar can push simulation.' },
      { type: 'image', src: hero.city, alt: 'Dense city tech mood', caption: 'The rendering stack sells the illusion.' },
      { type: 'list', items: ['Procedural interiors', 'More convincing crowd systems', 'Physics that push the open world forward'] },
    ],
    tags: ['gameplay', 'technology', 'RAGE engine'],
    heroImage: hero.city,
    heroImageAlt: 'Dark city skyline',
    heroVideoUrl: '',
    galleryImages: [hero.city],
    author: 'Ammo',
    status: 'published',
    featured: true,
    featuredOrder: 4,
    publishedAt: '2025-12-18T10:00:00.000Z',
    updatedAt: '2025-12-18T10:00:00.000Z',
    readTime: '9 min read',
    seoTitle: 'RAGE 9 Engine Explained: What It Means for GTA 6 (vs Genie 3 AI)',
    seoDescription: 'How the GTA 6 engine stack may shape physics, AI, interiors, and world detail.',
    canonicalPath: '/blog/rage-9-engine-explained',
    sourceLinks: [],
  },
  {
    title: '10 GTA 6 Trailer Clips the Internet Is Obsessed With',
    slug: 'gta6-trailer-clips-internet-obsessed',
    categoryId: 'cat-trailers',
    excerpt: 'These moments from both trailers keep getting shared, remixed, and argued over.',
    summary: 'A clip-driven recap of the trailer moments that dominated TikTok, Reddit, and YouTube.',
    content: [
      { type: 'heading', level: 2, text: 'The clips that kept spreading' },
      { type: 'paragraph', text: 'The community latches onto tiny details when the footage is this dense, and Rockstar knows it.' },
      { type: 'image', src: hero.neon, alt: 'Viral trailer still', caption: 'Small moments become the biggest talking points.' },
      { type: 'list', items: ['Lucia close-ups', 'Crowded street scenes', 'Fast-cut action beats and social media shots'] },
    ],
    tags: ['trailer', 'viral moments', 'social media'],
    heroImage: hero.neon,
    heroImageAlt: 'Neon trailer still',
    heroVideoUrl: 'https://www.youtube.com/embed/QdBZY2fkU-0',
    galleryImages: [hero.neon],
    author: 'Ammo',
    status: 'published',
    featured: true,
    featuredOrder: 5,
    publishedAt: '2025-11-12T10:00:00.000Z',
    updatedAt: '2025-11-12T10:00:00.000Z',
    readTime: '6 min read',
    seoTitle: '10 GTA 6 Trailer Clips the Internet Is Obsessed With',
    seoDescription: 'A viral clip roundup from the GTA 6 trailers and the community reactions around them.',
    canonicalPath: '/blog/gta6-trailer-clips-internet-obsessed',
    sourceLinks: ['https://www.youtube.com/embed/QdBZY2fkU-0'],
  },
  {
    title: 'GTA 6 Trailer 1 Breakdown: Vice City is Back and It Is Wild',
    slug: 'gta6-trailer-1-breakdown',
    categoryId: 'cat-trailers',
    excerpt: 'Every major shot from Trailer 1, what Rockstar quietly telegraphed, and why the Vice City return feels so different.',
    summary: 'A frame-by-frame breakdown of Trailer 1 with notes on Lucia, Jason, the social media satire, and the new Vice City mood.',
    content: [
      { type: 'heading', level: 2, text: 'Why Trailer 1 landed so hard' },
      { type: 'paragraph', text: 'The first GTA 6 trailer did more than confirm Vice City. It established a modern crime-world tone built around smartphones, social feeds, and a city that feels alive in every frame.' },
      { type: 'image', src: hero.city, alt: 'Vice City skyline at night', caption: 'A neon-heavy cityscape that sets the new tone.' },
      { type: 'list', items: ['Modern Vice City replaces the 80s nostalgia angle', 'Lucia and Jason are positioned as equals', 'The social media satire is baked into the world design'] },
      { type: 'video', src: 'https://www.youtube.com/embed/QdBZY2fkU-0', title: 'GTA 6 Trailer 1', caption: 'Official trailer reference.' },
      { type: 'quote', text: 'Rockstar used Trailer 1 to say the series is still the loudest cultural mirror in games.', by: 'GtaFans editorial' },
    ],
    tags: ['trailer', 'vice city', 'announcement', 'rockstar', 'lucia', 'jason'],
    heroImage: hero.neon,
    heroImageAlt: 'Neon city lights reflecting on the street',
    heroVideoUrl: 'https://www.youtube.com/embed/QdBZY2fkU-0',
    galleryImages: [hero.city, hero.car],
    author: 'Ammo',
    status: 'published',
    featured: true,
    featuredOrder: 1,
    publishedAt: '2025-06-15T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '11 min read',
    seoTitle: 'GTA 6 Trailer 1 Breakdown: Vice City is Back and It Is Wild',
    seoDescription: 'Frame-by-frame Trailer 1 breakdown with Lucia, Jason, Vice City, social satire, and Rockstar easter eggs.',
    canonicalPath: '/blog/gta6-trailer-1-breakdown',
    sourceLinks: ['https://www.youtube.com/embed/QdBZY2fkU-0'],
  },
  {
    title: 'GTA 6 Trailer 2: Everything We Learned About Vice City',
    slug: 'gta6-trailer-2-analysis',
    categoryId: 'cat-trailers',
    excerpt: 'A tighter look at the second trailer, the new locations, and the gameplay hints that matter most.',
    summary: 'Trailer 2 expanded the world, the cast, and the tone, while giving the community more to decode in every frame.',
    content: [
      { type: 'heading', level: 2, text: 'Trailer 2 widened the map' },
      { type: 'paragraph', text: 'The second trailer made the world feel broader and more confident, with a stronger sense of place and a clearer view of the game’s scale.' },
      { type: 'image', src: hero.beach, alt: 'Florida-style beach coastline', caption: 'Beachfront visuals that reinforce the Leonida vibe.' },
      { type: 'list', items: ['More districts and coastal scenes', 'Better look at mission pacing', 'A stronger sense of character chemistry'] },
    ],
    tags: ['trailer', 'analysis', 'vice city', 'rockstar'],
    heroImage: hero.beach,
    heroImageAlt: 'Sunlit beach and ocean horizon',
    heroVideoUrl: 'https://www.youtube.com/embed/QdBZY2fkU-0',
    galleryImages: [hero.beach, hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: true,
    featuredOrder: 2,
    publishedAt: '2025-06-22T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '9 min read',
    seoTitle: 'GTA 6 Trailer 2: Everything We Learned About Vice City',
    seoDescription: 'Trailer 2 analysis covering locations, cast changes, and gameplay clues for GTA 6.',
    canonicalPath: '/blog/gta6-trailer-2-analysis',
    sourceLinks: ['https://www.youtube.com/embed/QdBZY2fkU-0'],
  },
  {
    title: 'GTA 6 Gameplay Mechanics: Every Confirmed Feature So Far',
    slug: 'gta6-gameplay-mechanics',
    categoryId: 'cat-gameplay',
    excerpt: 'Dual-character switching, improved AI, and vehicle handling are just the start of the confirmed gameplay stack.',
    summary: 'A roundup of the mechanics Rockstar has teased or shown, with notes on how they could change mission design.',
    content: [
      { type: 'heading', level: 2, text: 'The systems that matter' },
      { type: 'paragraph', text: 'GTA 6 looks like it is building on GTA 5 while pushing more simulation and stronger world reactivity into the loop.' },
      { type: 'image', src: hero.car, alt: 'Performance car on the highway', caption: 'Vehicle handling and chase scenes still matter a lot.' },
      { type: 'list', items: ['Character swapping with more mission integration', 'Reactive crowds and better AI memory', 'Weather and vehicle physics that affect gameplay'] },
    ],
    tags: ['gameplay', 'mechanics', 'official', 'features'],
    heroImage: hero.car,
    heroImageAlt: 'Sports car at speed on an open highway',
    heroVideoUrl: '',
    galleryImages: [hero.car, hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: true,
    featuredOrder: 3,
    publishedAt: '2025-07-20T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '10 min read',
    seoTitle: 'GTA 6 Gameplay Mechanics: Every Confirmed Feature So Far',
    seoDescription: 'Gameplay deep dive covering dual-character switching, AI, combat, and vehicle handling.',
    canonicalPath: '/blog/gta6-gameplay-mechanics',
    sourceLinks: [],
  },
  {
    title: 'Who Is Lucia Caminos? GTA 6’s Female Lead',
    slug: 'who-is-lucia-caminos',
    categoryId: 'cat-characters',
    excerpt: 'Lucia is more than a co-lead. This is the clearest look at her role, style, and place in the story.',
    summary: 'Lucia’s backstory, prison history, relationship with Jason, and why she feels built to carry the story.',
    content: [
      { type: 'heading', level: 2, text: 'The first true co-lead energy' },
      { type: 'paragraph', text: 'Lucia’s screen time makes it obvious that Rockstar is not treating her like a side character. She is central to the game’s emotional and criminal tension.' },
      { type: 'image', src: hero.neon, alt: 'Stylized neon portrait scene', caption: 'Lucia-led framing needs a distinct visual language.' },
      { type: 'list', items: ['Built as an equal partner to Jason', 'Prison history shapes her worldview', 'Fashion, movement, and presence all feel intentional'] },
    ],
    tags: ['lucia', 'characters', 'main character', 'story'],
    heroImage: hero.neon,
    heroImageAlt: 'Woman in a neon-lit city scene',
    heroVideoUrl: '',
    galleryImages: [hero.neon],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-07-06T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '8 min read',
    seoTitle: 'Who Is Lucia Caminos? GTA 6 Female Lead Breakdown',
    seoDescription: 'Lucia Caminos background, role, and why she matters to the GTA 6 story.',
    canonicalPath: '/blog/who-is-lucia-caminos',
    sourceLinks: [],
  },
  {
    title: 'Who Is Jason Duval? GTA 6’s Male Lead',
    slug: 'who-is-jason-duval',
    categoryId: 'cat-characters',
    excerpt: 'Jason’s military and criminal hints make him feel more grounded than a typical GTA wildcard.',
    summary: 'Everything we know about Jason’s background, how he fits with Lucia, and the story energy he brings.',
    content: [
      { type: 'heading', level: 2, text: 'Jason is the grounded half of the duo' },
      { type: 'paragraph', text: 'Jason’s presence suggests a character with restraint, planning, and a history that will shape the game’s early missions and emotional beats.' },
      { type: 'list', items: ['Military-adjacent background hints', 'Strong partner chemistry with Lucia', 'More measured than classic chaos-first protagonists'] },
    ],
    tags: ['jason', 'characters', 'male lead', 'story'],
    heroImage: hero.skyline,
    heroImageAlt: 'City skyline in dusk light',
    heroVideoUrl: '',
    galleryImages: [hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-07-27T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '7 min read',
    seoTitle: 'Who Is Jason Duval? GTA 6 Male Lead Breakdown',
    seoDescription: 'Jason Duval background, role, and story analysis for GTA 6.',
    canonicalPath: '/blog/who-is-jason-duval',
    sourceLinks: [],
  },
  {
    title: 'Vice City Locations: Every District Confirmed So Far',
    slug: 'vice-city-locations',
    categoryId: 'cat-locations',
    excerpt: 'A running guide to the districts, beaches, and roadways that seem locked in from the trailer footage.',
    summary: 'An organized look at the Vice City geography, map hints, and districts fans keep circling back to.',
    content: [
      { type: 'heading', level: 2, text: 'The map is doing a lot of work' },
      { type: 'paragraph', text: 'Rockstar’s world-building is already telling a story through urban density, highways, beaches, and wetland edges that hint at a much larger map.' },
      { type: 'image', src: hero.palm, alt: 'Palm beach coastline', caption: 'Florida-inspired geography gives the game its identity.' },
      { type: 'list', items: ['Beachfront zones and nightlife strips', 'Suburban sprawl and highway interchanges', 'Wetlands, rural roads, and scenic detours'] },
    ],
    tags: ['vice city', 'locations', 'map', 'districts'],
    heroImage: hero.palm,
    heroImageAlt: 'Palm trees over a tropical shoreline',
    heroVideoUrl: '',
    galleryImages: [hero.palm, hero.city],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-06-29T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '8 min read',
    seoTitle: 'Vice City Locations: Every District Confirmed So Far',
    seoDescription: 'Guide to Vice City districts, beaches, highways, and map theories.',
    canonicalPath: '/blog/vice-city-locations',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 Trailer 3: Release Date, Clues, and What Might Come Next',
    slug: 'gta6-trailer-3-release-date-clues',
    categoryId: 'cat-trailers',
    excerpt: 'A speculation-heavy trailer watchlist built around timing, teaser cadence, and hidden clues.',
    summary: 'Where the community thinks Trailer 3 fits into Rockstar’s release pattern and what it might reveal.',
    content: [
      { type: 'heading', level: 2, text: 'How Rockstar usually plays this game' },
      { type: 'paragraph', text: 'Trailer timing matters because Rockstar often uses long gaps to build anticipation before dropping a new wave of details.' },
      { type: 'quote', text: 'The best trailer theories are about pattern recognition, not wishful thinking.', by: 'Community notes' },
    ],
    tags: ['trailer 3', 'release date', 'rockstar'],
    heroImage: hero.city,
    heroImageAlt: 'Dark city skyline with lights',
    heroVideoUrl: '',
    galleryImages: [hero.city],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-11-16T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '6 min read',
    seoTitle: 'GTA 6 Trailer 3: Release Date, Clues, and What Might Come Next',
    seoDescription: 'Trailer 3 timing theories, clue tracking, and release speculation.',
    canonicalPath: '/blog/gta6-trailer-3-release-date-clues',
    sourceLinks: [],
  },
  {
    title: 'How Long Is GTA 6 Story Mode? 75 Hours Across 5 Chapters',
    slug: 'gta6-story-length-speculation',
    categoryId: 'cat-resources',
    excerpt: 'A clean breakdown of the rumored campaign structure and why the number is still debated.',
    summary: 'Story length rumors, chapter breakdowns, and the range of estimates fans are discussing.',
    content: [
      { type: 'heading', level: 2, text: 'The rumor everyone keeps revisiting' },
      { type: 'paragraph', text: 'The 75-hour story length claim keeps resurfacing because it sounds plausible enough to keep people arguing for months.' },
      { type: 'list', items: ['Rumored prologue plus five chapters', 'Chapters may vary in length substantially', 'No official confirmation from Rockstar'] },
    ],
    tags: ['story length', 'speculation', 'campaign'],
    heroImage: hero.skyline,
    heroImageAlt: 'Skyline at dusk with layered atmosphere',
    heroVideoUrl: '',
    galleryImages: [hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-08-07T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '9 min read',
    seoTitle: 'How Long Is GTA 6 Story Mode? 75 Hours Across 5 Chapters',
    seoDescription: 'Rumored GTA 6 story length breakdown with chapter speculation and comparison notes.',
    canonicalPath: '/blog/gta6-story-length-speculation',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 Delay Timeline: Every Release Date Change',
    slug: 'gta6-delay-timeline',
    categoryId: 'cat-resources',
    excerpt: 'A quick historical record of how the release date moved and why the launch countdown matters so much.',
    summary: 'Timeline of release-date shifts and the current date fans are watching.',
    content: [
      { type: 'heading', level: 2, text: 'Every delay tells a story' },
      { type: 'paragraph', text: 'Tracking the release timeline makes it easier to understand why the countdown is central to the entire fan site.' },
      { type: 'list', items: ['Original rumors and shifting windows', 'Official November 19, 2026 launch date', 'Why the countdown belongs in the header'] },
    ],
    tags: ['release date', 'delays', 'timeline'],
    heroImage: hero.city,
    heroImageAlt: 'Dark neon skyline with a countdown feel',
    heroVideoUrl: '',
    galleryImages: [hero.city],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-11-03T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '6 min read',
    seoTitle: 'GTA 6 Delay Timeline: Every Release Date Change',
    seoDescription: 'Release date timeline and current launch countdown context for GTA 6.',
    canonicalPath: '/blog/gta6-delay-timeline',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 Hidden Websites Found: Ride Sharing, Banking, and Dating',
    slug: 'gta6-hidden-websites-found',
    categoryId: 'cat-gameplay',
    excerpt: 'The in-world internet is back, and the hidden domain list says Rockstar is satirizing modern life again.',
    summary: 'A speculative list of in-game websites and what they could mean for side activities and mission design.',
    content: [
      { type: 'heading', level: 2, text: 'The fake internet is one of Rockstar’s best tricks' },
      { type: 'paragraph', text: 'The in-world web turns Vice City into more than a backdrop. It becomes another satirical system for players to explore.' },
      { type: 'image', src: hero.neon, alt: 'Neon reflections and social feed vibes', caption: 'UI-heavy satire feels central to the setting.' },
    ],
    tags: ['hidden websites', 'discovery', 'features'],
    heroImage: hero.neon,
    heroImageAlt: 'Neon reflections and city lights',
    heroVideoUrl: '',
    galleryImages: [hero.neon],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-09-20T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '8 min read',
    seoTitle: 'GTA 6 Hidden Websites Found: Ride Sharing, Banking, and Dating',
    seoDescription: 'A fan guide to rumored GTA 6 in-world websites and what they might do.',
    canonicalPath: '/blog/gta6-hidden-websites-found',
    sourceLinks: [],
  },
  {
    title: 'Best GTA 6 Content Creators: Who to Follow for Reliable News',
    slug: 'best-gta6-content-creators',
    categoryId: 'cat-resources',
    excerpt: 'A curated shortlist of channels and creators that focus on analysis, not just clickbait.',
    summary: 'A resource page that points people toward useful channels, breakdowns, and leak analysis habits.',
    content: [
      { type: 'heading', level: 2, text: 'Who is worth following?' },
      { type: 'paragraph', text: 'The best creators explain what they know, where the evidence comes from, and where the line between fact and speculation begins.' },
      { type: 'list', items: ['Frame-by-frame analysts', 'Lore-focused breakdown channels', 'Technical breakdown specialists'] },
    ],
    tags: ['content creators', 'youtube', 'news', 'analysis'],
    heroImage: hero.skyline,
    heroImageAlt: 'City skyline and bright lights',
    heroVideoUrl: '',
    galleryImages: [hero.skyline],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-08-05T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '7 min read',
    seoTitle: 'Best GTA 6 Content Creators: Who to Follow for Reliable News',
    seoDescription: 'Curated GTA 6 creator list for analysis, lore, and reliable news coverage.',
    canonicalPath: '/blog/best-gta6-content-creators',
    sourceLinks: [],
  },
  {
    title: 'GTA 6 vs Real Miami: How Accurate Is Rockstar’s Vice City?',
    slug: 'gta6-vs-real-miami',
    categoryId: 'cat-locations',
    excerpt: 'A comparison guide that looks at the real-world Miami inspirations and how far Rockstar is pushing the city design.',
    summary: 'Miami comparisons, scene recreation notes, and how the modern Vice City aesthetic is being built.',
    content: [
      { type: 'heading', level: 2, text: 'Reality is just a reference point' },
      { type: 'paragraph', text: 'Rockstar has always borrowed from real cities, but Vice City is clearly aiming for a stylized version of Miami rather than a direct replica.' },
      { type: 'image', src: hero.beach, alt: 'Coastal city edge', caption: 'The coastline matters as much as the skyline.' },
    ],
    tags: ['vice city', 'miami', 'locations', 'comparison'],
    heroImage: hero.beach,
    heroImageAlt: 'Sunny coastal city and beach',
    heroVideoUrl: '',
    galleryImages: [hero.beach],
    author: 'Ammo',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt: '2025-08-10T10:00:00.000Z',
    updatedAt: '2025-11-07T10:00:00.000Z',
    readTime: '8 min read',
    seoTitle: 'GTA 6 vs Real Miami: How Accurate Is Rockstar’s Vice City?',
    seoDescription: 'Miami vs Vice City comparison guide for GTA 6 fans.',
    canonicalPath: '/blog/gta6-vs-real-miami',
    sourceLinks: [],
  },
]

for (const post of posts) {
  if (!post.id) {
    post.id = post.slug
  }
}

const settings = {
  title: 'GtaFans',
  description: 'GtaFans is a neon GTA 6 news hub for trailer breakdowns, gameplay analysis, character deep-dives, location guides, and fan resources.',
  keywords: ['GTA 6 news', 'GTA 6 trailer breakdowns', 'Vice City analysis', 'Jason Duval', 'Lucia Caminos', 'GTA 6 release date', 'GTA 6 gameplay', 'GTA 6 locations', 'GTA 6 resources', 'GtaFans'],
  games: ['All News', 'Trailers', 'Gameplay', 'Characters', 'Locations', 'Resources'],
  scheduledSlots: [],
  canonicalUrl: 'https://gtafans.online',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico',
  launchDate: '2026-11-19T00:00:00.000Z',
  brandMark: 'GTAFANS',
  brandTagline: 'Trailer breakdowns, character deep-dives, and Vice City coverage.',
  headerLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Trailers', href: '/?category=Trailers' },
    { label: 'Gameplay', href: '/?category=Gameplay' },
    { label: 'Characters', href: '/?category=Characters' },
    { label: 'Locations', href: '/?category=Locations' },
    { label: 'Resources', href: '/?category=Resources' },
  ],
  footerLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Contact', href: '/contact' },
  ],
  socialLinks: [
    { label: 'Reddit', href: 'https://www.reddit.com' },
    { label: 'X', href: 'https://x.com' },
  ],
  contactEmail: 'hello@gtafans.online',
  smtpEnabled: true,
  otpRequired: true,
  smtpHost: 'smtp.resend.net',
  smtpPort: '587',
  smtpSender: 'noreply@gtafans.online',
  adminReceivers: ['admin@gtafans.online'],
}

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true })
}

async function writeJson(name, value) {
  await fs.writeFile(path.join(dataDir, name), JSON.stringify(value, null, 2), 'utf8')
}

async function readEnvDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim()
  }

  const envPath = path.join(rootDir, '.env')
  if (!existsSync(envPath)) return ''
  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (key === 'DATABASE_URL' && value) return value
  }
  return ''
}

async function ensureSchema(pool) {
  await pool.query('SELECT pg_advisory_lock(620061)')
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );
    `)
  } finally {
    await pool.query('SELECT pg_advisory_unlock(620061)')
  }
}

async function upsertRows(pool, table, rows) {
  for (const row of rows) {
    await pool.query(
      `INSERT INTO ${table} (id, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [row.id, JSON.stringify(row)],
    )
  }
}

async function main() {
  await ensureDir()
  await writeJson('categories.json', categories)
  await writeJson('post.json', posts)
  await writeJson('settings.json', settings)

  const connectionString = await readEnvDatabaseUrl()
  if (!connectionString) {
    console.log('Seeded local JSON files. DATABASE_URL not set, skipping Postgres sync.')
    return
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await ensureSchema(pool)
    await upsertRows(pool, 'categories', categories)
    await upsertRows(pool, 'posts', posts)
    await pool.query(
      `INSERT INTO site_settings (id, data)
       VALUES ('default', $1::jsonb)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [JSON.stringify(settings)],
    )
    console.log('Seeded local JSON and synchronized Postgres content.')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
