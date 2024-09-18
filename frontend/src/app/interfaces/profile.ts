export interface Profile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
  