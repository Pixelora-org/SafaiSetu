export type Category =
  | "river"
  | "road_pothole"
  | "pond"
  | "trash_bin"
  | "public_space";

export type SpotStatus = "dirty" | "in_progress" | "cleaned";
export type SpotSource = "cpcb" | "user" | "curated";

export type LayerId =
  | "cpcb"
  | "live-water"
  | "cleanups"
  | "events"
  | "orgs"
  | "satellite";

export type MapFeature = {
  id: string;
  layer: LayerId;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  body?: string;
  asOf?: string;
  sourceLabel: string;
  sourceUrl: string;
  href?: string;
  feedItemId?: string;
  orgSlug?: string;
  category?: Category;
  status?: SpotStatus;
  cpcbPriority?: 1 | 2 | 3 | 4 | 5;
  dashboardUrl?: string;
  copernicusUrl?: string;
  color: string;
  fresh?: boolean;
};

export type FeedKind = "user_upload" | "youtube" | "curated_embed";
export type ModerationStatus = "pending" | "approved" | "rejected";

export type SourceCitation = {
  label: string;
  url: string;
  date: string;
};

export type Spot = {
  id: string;
  name: string;
  nameHi?: string;
  category: Category;
  status: SpotStatus;
  source: SpotSource;
  lat: number;
  lng: number;
  state: string;
  city?: string;
  description?: string;
  cpcbPriority?: 1 | 2 | 3 | 4 | 5;
  sourceCitation: SourceCitation;
  photoUrl?: string;
  updatedAt: string;
  feedItemId?: string;
};

export type Organization = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  coverage: string[];
  website?: string;
  howToJoin: string;
  verified: boolean;
  category: "ngo" | "collective" | "govt" | "citizen";
};

export type FeedItem = {
  id: string;
  kind: FeedKind;
  title: string;
  story: string;
  place: string;
  state: string;
  sourceLabel: string;
  youtubeVideoId?: string;
  embedUrl?: string;
  imageUrl?: string;
  spotId?: string;
  orgSlug?: string;
  publishedAt: string;
  featured: boolean;
};

export type WeekendEvent = {
  id: string;
  title: string;
  orgSlug: string;
  orgName: string;
  startsAt: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  whatToBring: string;
  confirmNote: string;
  website?: string;
};

export type Stat = {
  key: string;
  label: string;
  labelHi?: string;
  value: number;
  display?: string;
  unit?: string;
  asOf: string;
  sourceName: string;
  sourceUrl: string;
  notes?: string;
  live?: boolean;
};

export type Submission = {
  id: string;
  userId?: string;
  displayName: string;
  category: Category;
  status: SpotStatus;
  lat: number;
  lng: number;
  city?: string;
  story: string;
  mediaType: "photo" | "video";
  mediaUrl: string;
  moderationStatus: ModerationStatus;
  featured: boolean;
  createdAt: string;
  spotId?: string;
};
