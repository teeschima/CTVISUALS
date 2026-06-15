export enum EventType {
  WEDDING = "Wedding",
  BIRTHDAY = "Birthday",
  GRADUATION = "Graduation",
  CORPORATE = "Corporate Show",
  CHURCH = "Church Thanksgiving",
  CONCERT = "Concert/Gig",
  OWAMBE = "Owambe Party",
  NAMING_CEREMONY = "Naming Ceremony",
  TRADITIONAL_WEDDING = "Traditional Wedding",
  BURIAL = "Remembrance/Burial",
  OTHER = "Other Celebration"
}

export enum EventPrivacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PASSWORD_PROTECTED = "PASSWORD_PROTECTED"
}

export enum EventStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED"
}

export enum PhotobookStyle {
  CLASSIC = "Classic Legacy",
  LUXURY = "Luxury Bronze",
  MODERN = "Modern Chic",
  MINIMALIST = "Studio Minimalist",
  WEDDING_PREMIUM = "Royal Wedding Premium",
  CORPORATE = "Corporate Clean",
  MAGAZINE = "Lagos Vogue Magazine",
  STORYTELLING = "Sunset Narrative"
}

export enum PhotobookSize {
  A4 = "A4 Landscape (11.7 x 8.3 in)",
  A3 = "A3 Premium Square (12 x 12 in)",
  A5 = "A5 Compact Pocketbook (5.8 x 8.3 in)",
  SQUARE_8X8 = "Square Portrait (8 x 8 in)"
}

export enum VideoStyle {
  CINEMATIC = "Cinematic Elegance",
  PARTY_VIBES = "Owambe Party Energy",
  LOVE_STORY = "Romantic Storybook",
  BEAT_SYNC = "Afrobeats Beat Sync",
  TIKTOK_CUTS = "Modern TikTok Cuts",
  DOCUMENTARY = "Verite Documentary"
}

export interface Photo {
  id: string;
  eventId: string;
  guestName: string;
  url: string;
  thumbnailUrl: string;
  originalUrl?: string; // for restored photos
  likes: number;
  comments: Comment[];
  createdAt: string;
  isRestored?: boolean;
  restorationMode?: string;
  labels?: string[]; // Face clustering label
}

export interface Comment {
  id: string;
  photoId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Video {
  id: string;
  eventId: string;
  guestName: string;
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  likes: number;
  createdAt: string;
}

export interface HighlightVideo {
  id: string;
  eventId: string;
  title: string;
  style: VideoStyle;
  musicTrack: string;
  duration: number; // target in seconds
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  outputUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface RestoredPhoto {
  id: string;
  originalId: string;
  restoredUrl: string;
  mode: string;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  createdAt: string;
}

export interface Photobook {
  id: string;
  eventId: string;
  title: string;
  style: PhotobookStyle;
  size: PhotobookSize;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  downloadUrl?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  code: string;
  name: string;
  description: string;
  date: string;
  type: EventType;
  coverPhoto: string;
  privacy: EventPrivacy;
  status: EventStatus;
  photos: Photo[];
  videos: Video[];
  photobooks: Photobook[];
  highlights: HighlightVideo[];
  storageUsed: number; // in MB
}
