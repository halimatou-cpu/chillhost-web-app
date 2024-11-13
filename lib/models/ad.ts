export enum RentalType {
  ENTIRE_HOME = "entire_home",
  PRIVATE_ROOM = "private_room",
  SHARED_ROOM = "shared_room",
  SHARED_HOME = "shared_home",
}

export enum PropertyType {
  HOUSE = "house",
  APARTMENT = "apartment",
  VILLA = "villa",
  GUEST_HOUSE = "guest_house",
  HOTEL = "hotel",
  COTTAGE = "cottage",
  MOTORHOME = "motorhome",
}

export enum AdStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  ARCHIVED = "archived",
}

export enum SortBy {
  PRICE_ASC = "priceAsc",
  PRICE_DESC = "priceDesc",
  DATE_ASC = "dateAsc",
  DATE_DESC = "dateDesc",
  RELEVANCE = "relevance",
  AREA_ASC = "areaAsc",
  AREA_DESC = "areaDesc",
}

export interface MediaInfo {
  url: string;
  key: string;
  name?: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  property: {
    price: {
      amount: number;
      currency: string;
      unit: string;
    };
    capacity: {
      rooms: number;
      beds: number;
      bathrooms: number;
      guests: {
        adults: number;
        children: number;
      };
    };
    address: {
      country: string;
      city: string;
      street: string;
      postal_code: number;
      region: string;
      additionalInfo: string;
    };
    livingArea: {
      value: number;
      unit: string;
      symbol: string;
    };
    landArea: {
      value: number;
      unit: string;
      symbol: string;
    };
    type: string;
    amenities: {
      wifi: boolean;
      kitchen: boolean;
      tv: boolean;
      airConditioning: boolean;
      heating: boolean;
      parking: boolean;
      pool: boolean;
      gym: boolean;
      petFriendly: boolean;
      smokingAllowed: boolean;
    };
    ownerInfo: {
      id: string;
      email: string;
      fullname: string;
      profilePicture: string;
    };
  };
  rentalType: string;
  documents: MediaInfo[];
  pictures: MediaInfo[];
  videos: MediaInfo[];
  isVerified: boolean;
  active: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
