import { createContext } from "react";

export interface ResumeInfo {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  themeColor?: string;
  summery?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  [key: string]: unknown;
}

export interface Experience {
  id?: number;
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  workSummery?: string;
}

export interface Education {
  id?: number;
  universityName?: string;
  degree?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id?: number;
  name?: string;
  rating?: number;
}

interface ResumeInfoContextType {
  resumeInfo: ResumeInfo | null;
  setResumeInfo: React.Dispatch<React.SetStateAction<ResumeInfo | null>>;
}

export const ResumeInfoContext = createContext<ResumeInfoContextType>({
  resumeInfo: null,
  setResumeInfo: () => {},
});