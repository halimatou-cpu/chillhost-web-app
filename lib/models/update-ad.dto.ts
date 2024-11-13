import { MediaInfo } from "./ad";
import { CreateAdDto } from "./create-ad.dto";

export interface UserBasicInfo {
  id: string;
  fullname: string;
  email?: string;
  presentation?: string;
  profilePicture?: MediaInfo;
}

export interface Review {
  rating: number;
  comment: string;
  reviewerInfo: UserBasicInfo;
  date: Date; // date de la publication de l'avis
}

export interface Rating {
  average: number;
  count: number;
  reviews: Review[];
}

export interface UpdateAdDto extends CreateAdDto {
  active?: boolean;
  deleted?: boolean;
  rating?: Rating;
}
