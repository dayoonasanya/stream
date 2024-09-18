export interface SocialMediaLink {
    id: string;
    platform: string;
    url: string;
    userId?: string;
    organizationId?: string;
    investorProfileId?: string;
    createdAt: Date;
    updatedAt: Date;
  }