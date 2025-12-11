export interface BannerSpec {
  headline: string;
  subheadline: string;
  cta: string;
  body: string;
  visualDirection: {
    colorPalette: string[];
    layoutDescription: string;
    imageryDescription: string;
    typography: string;
    backgroundColorHex: string;
    textColorHex: string;
  };
  rationale: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppTab {
  GENERATOR = 'GENERATOR',
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER',
}

export interface BannerRequest {
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  dimensions: string; // e.g., "300x250"
  tone: string;
}