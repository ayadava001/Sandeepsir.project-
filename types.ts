
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  year: string;
  photo: string; // Now supports Base64 strings for persistence
  bio: string;
  marks: Record<string, number>;
  totalMarks: number;
  links?: { title: string; url: string }[];
  isFeatured: boolean;
  isVisible: boolean;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  theme: 'light' | 'dark' | 'amber';
  isVisible: boolean;
}

export interface TeacherProfile {
  name: string;
  photo: string;
  bio: string;
  tagline: string;
  yearsExp: string;
  studentsCount: string;
  successRate: string;
}

export interface AppConfig {
  theme: 'warm' | 'cool' | 'dark';
  adminEmails: string[];
  aiEnabled: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
