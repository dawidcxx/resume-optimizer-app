export type ResumeFontFallback = "sans" | "serif" | "mono";

export type ResumeFontCategory = "sans" | "serif" | "display" | "mono";

export type ResumeFontCatalogEntry = {
  family: string;
  cssFamily: string;
  category: ResumeFontCategory;
  fallback: ResumeFontFallback;
  bodySafe: boolean;
  description: string;
};

export const RESUME_FONT_CATALOG = {
  inter: {
    family: "Inter",
    cssFamily: "Inter Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "neutral, highly readable interface sans",
  },
  "inter-tight": {
    family: "Inter Tight",
    cssFamily: "Inter Tight Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "compact, confident sans for dense layouts",
  },
  manrope: {
    family: "Manrope",
    cssFamily: "Manrope Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "rounded geometric sans with a friendly modern feel",
  },
  "dm-sans": {
    family: "DM Sans",
    cssFamily: "DM Sans Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "clean geometric sans with low contrast",
  },
  "public-sans": {
    family: "Public Sans",
    cssFamily: "Public Sans Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "plain, civic, no-nonsense sans",
  },
  "source-sans-3": {
    family: "Source Sans 3",
    cssFamily: "Source Sans 3 Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "friendly workhorse sans with a technical edge",
  },
  "ibm-plex-sans": {
    family: "IBM Plex Sans",
    cssFamily: "IBM Plex Sans Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "engineered corporate sans with distinctive details",
  },
  "space-grotesk": {
    family: "Space Grotesk",
    cssFamily: "Space Grotesk Variable",
    category: "sans",
    fallback: "sans",
    bodySafe: true,
    description: "technical geometric sans with quirky character",
  },
  "source-serif-4": {
    family: "Source Serif 4",
    cssFamily: "Source Serif 4 Variable",
    category: "serif",
    fallback: "serif",
    bodySafe: true,
    description: "readable contemporary serif with an editorial feel",
  },
  newsreader: {
    family: "Newsreader",
    cssFamily: "Newsreader Variable",
    category: "serif",
    fallback: "serif",
    bodySafe: true,
    description: "newsy, literary serif with crisp details",
  },
  lora: {
    family: "Lora",
    cssFamily: "Lora Variable",
    category: "serif",
    fallback: "serif",
    bodySafe: true,
    description: "warm, brushy serif suited to expressive resumes",
  },
  literata: {
    family: "Literata",
    cssFamily: "Literata Variable",
    category: "serif",
    fallback: "serif",
    bodySafe: true,
    description: "bookish screen serif with strong readability",
  },
  "crimson-pro": {
    family: "Crimson Pro",
    cssFamily: "Crimson Pro Variable",
    category: "serif",
    fallback: "serif",
    bodySafe: true,
    description: "classic book serif with a refined, understated tone",
  },
  fraunces: {
    family: "Fraunces",
    cssFamily: "Fraunces Variable",
    category: "display",
    fallback: "serif",
    bodySafe: false,
    description: "expressive soft serif with strong personality",
  },
  "playfair-display": {
    family: "Playfair Display",
    cssFamily: "Playfair Display Variable",
    category: "display",
    fallback: "serif",
    bodySafe: false,
    description: "high-contrast editorial display serif",
  },
  "bricolage-grotesque": {
    family: "Bricolage Grotesque",
    cssFamily: "Bricolage Grotesque Variable",
    category: "display",
    fallback: "sans",
    bodySafe: false,
    description: "playful contemporary display sans with irregular details",
  },
  "ibm-plex-mono": {
    family: "IBM Plex Mono",
    cssFamily: "IBM Plex Mono",
    category: "mono",
    fallback: "mono",
    bodySafe: false,
    description: "technical mono with a precise, engineered feel",
  },
  "jetbrains-mono": {
    family: "JetBrains Mono",
    cssFamily: "JetBrains Mono Variable",
    category: "mono",
    fallback: "mono",
    bodySafe: false,
    description: "developer-flavoured mono with a compact rhythm",
  },
} as const satisfies Record<string, ResumeFontCatalogEntry>;

export type ResumeFontId = keyof typeof RESUME_FONT_CATALOG;

export const RESUME_FONT_IDS = [
  "inter",
  "inter-tight",
  "manrope",
  "dm-sans",
  "public-sans",
  "source-sans-3",
  "ibm-plex-sans",
  "space-grotesk",
  "source-serif-4",
  "newsreader",
  "lora",
  "literata",
  "crimson-pro",
  "fraunces",
  "playfair-display",
  "bricolage-grotesque",
  "ibm-plex-mono",
  "jetbrains-mono",
] as const satisfies readonly ResumeFontId[];

export const RESUME_BODY_FONT_IDS = [
  "sans",
  "serif",
  "mono",
  "inter",
  "inter-tight",
  "manrope",
  "dm-sans",
  "public-sans",
  "source-sans-3",
  "ibm-plex-sans",
  "space-grotesk",
  "source-serif-4",
  "newsreader",
  "lora",
  "literata",
  "crimson-pro",
] as const;

export const RESUME_HEADING_FONT_IDS = [
  "sans",
  "serif",
  "mono",
  ...RESUME_FONT_IDS,
] as const;
