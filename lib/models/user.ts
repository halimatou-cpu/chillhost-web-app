export interface ImageInfo {
  url: string;
  key: string;
  name?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePicture?: ImageInfo;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = "admin", // The company's admin
  LANDLORD = "landlord", // A landlord
  TRAVELER = "traveler", // A traveler
  SERVICE_PROVIDER = "service_provider", // A service provider, like a cleaner, a plumber, etc.
}
