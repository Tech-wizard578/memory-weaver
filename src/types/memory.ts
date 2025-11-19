export interface PhotoMetadata {
  date?: Date;
  location?: string;
  camera?: string;
  latitude?: number;
  longitude?: number;
}

export interface Memory {
  id: string;
  title: string;
  narrative: string;
  date: Date;
  photos: MemoryPhoto[];
  location?: string;
  people?: string[];
  emotions?: string[];
  category?: string;
  userNotes?: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata: PhotoMetadata;
  aiAnalysis?: {
    description: string;
    detectedObjects: string[];
    detectedPeople: string[];
    emotions: string[];
    confidence: number;
  };
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  metadata?: PhotoMetadata;
}

export interface TimelineEvent {
  year: number;
  month: number;
  memories: Memory[];
}
