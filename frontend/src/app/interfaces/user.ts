import { InvestorProfile } from "./investor-profile";
import { Organization } from "./organization";
import { Profile } from "./profile";
import { SocialMediaLink } from "./social";
import { Startup } from "./startup";
import { Transaction } from "./transaction";

export enum UserRole {
    ADMIN = 'ADMIN',
    INVESTOR = 'INVESTOR',
    ORGANIZATION = 'ORGANIZATION',
    STARTUP = 'STARTUP'
}
  
export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    isActivated: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    profile?: Profile;
    organization?: Organization;
    startup?: Startup;
    investorProfile?: InvestorProfile;
    transactions: Transaction[];
    socialMediaLinks: SocialMediaLink[];
}
  