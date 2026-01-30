export type TalkCategory =
  | "conference"
  | "live stream"
  | "podcast"
  | "video"
  | "workshop";

export interface Talk {
  title: string;
  event: string;
  date: string;
  category: TalkCategory;
  url: string | null;
  recordingUrl: string | null;
  featured: boolean;
}

export const talks: Talk[] = [];
