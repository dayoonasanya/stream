import { SocialMediaLink } from "./social";

export interface InvestorProfile {
  id: string;
  userId: string;
  investmentBudget?: number;
  interests: string[];
  socialMedia: SocialMediaLink[];
  createdAt: Date;
  updatedAt: Date;
}
