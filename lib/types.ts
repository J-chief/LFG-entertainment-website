export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'LKR';
  perks: string[];
  quantityTotal: number;
  quantitySold: number;
  isMain: boolean; // exactly one per event gets highlighted (the silver-border tier)
  sortOrder: number;
};

export type Artist = {
  id: string;
  name: string;
  photoUrl: string;
  role: 'Headliner' | 'Support' | 'Opener';
};

export type ScheduleItem = {
  time: string;
  act: string;
  stage?: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Event = {
  slug: string;
  title: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  doorsOpen: string; // e.g., "6:00 PM"
  venue: {
    name: string;
    address: string;
  };
  posterImage: string; // grayscale poster aspect-ratio 3:4
  heroBanner: string; // full resolution hero image
  heroVideo?: string; // loops inside the hero overlay
  shortDescription: string;
  fullDescription: string;
  atmosphere: string;
  quickFacts: string[];
  lineup: Artist[];
  schedule: ScheduleItem[];
  ticketTiers: TicketTier[];
  faqs: FAQ[];
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  event: string;
};

export type GalleryMedia = {
  id: string;
  type: 'image' | 'video';
  url: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  caption?: string;
};

export type GalleryItem = {
  eventSlug: string;
  eventName: string;
  year: number;
  date: string;
  venueName: string;
  oneLiner: string;
  tags: string[];
  coverImage: string;
  media: GalleryMedia[];
};

export type OfficeAddress = {
  country: string;
  name: string;
  address: string;
};

export type SiteSettings = {
  socialUrls: {
    whatsapp: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    email: string;
    linkedin?: string;
  };
  offices: OfficeAddress[];
};
