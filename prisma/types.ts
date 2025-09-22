export interface Tag {
  id: string;
  name: string;
  color?: string;
  url?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string | undefined;
  imageUrl: string;
  startDate?: Date | null;
  endDate?: Date | null;
  organizerList?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  isOnline: boolean;
  isFree: boolean;

  userStatus?: {
    isFavorite: boolean;
    isBookmarked: boolean;
    attendanceStatus: string | null;
  } | null;

  parentEventId?: string | null;
  parentEvent?: Event | null;
  subEvents?: Array<Event> | null;
  
  place?: {
    id: string;
    name: string;
    url?: string | null;
  } | null;
  organizer?: {
    id: string;
    fullName: string;
    organizationName?: string | null;
    organizationCity?: string | null;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    color?: string | null;
    url?: string | null;
  }>;
  timetables?: Array<{
    id: string;
    name?: string | null;
    dateName?: string | null;
    date?: Date | null;
    timestamps: Array<{
      id: string;
      name: string;
      shortDescription?: string;
      startTime?: string | null;
      endTime?: string | null;
      time?: string | null;
    }>;
  }> | null;
  socials?: {
    vk?: string | null;
    instagram?: string | null;
    telegram?: string | null;
    youtube?: string | null;
    facebook?: string | null;
    site?: string | null;
  } | null;
  documents?: Array<{
    id: string;
    name: string;
    fileUrl: string;
  }> | null;
}

export interface Place {
  id: string;
  name: string;
  url?: string;
}

export interface Organizer {
  id: string;
  fullName: string;
  organizationName?: string;
  organizationCity?: string;
}

export interface Timetable {
  id: string;
  name?: string;
  dateName?: string;
  date?: Date;
  timestamps: Timestamp[];
}

export interface Timestamp {
  id: string;
  name: string;
  shortDescription?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
}

export interface Socials {
  id: string;
  vk?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  facebook?: string;
  site?: string;
}

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
}

export interface DanceStyle {
  id: string;
  name: string;
  description?: string;
}
