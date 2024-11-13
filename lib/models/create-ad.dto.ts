import { PropertyType, RentalType } from "./ad";

export enum PriceUnit {
  NIGHT = "night",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum PriceSymbol {
  EUR = "€",
  USD = "$",
  GBP = "£",
  JPY = "¥",
}

export enum MeasureSymbol {
  SQUARE_METER = "m²",
  SQUARE_FEET = "ft²",
  ACRE = "acre",
  HECTARE = "ha",
}

export enum MeasureUnit {
  SQUARE_METER = "square_meter",
  SQUARE_FEET = "square_feet",
  ACRE = "acre",
  HECTARE = "hectare",
}

export interface PriceDto {
  amount: number;
  currency?: string;
  unit?: PriceUnit;
}

export interface MeasureDto {
  value: number;
  unit?: MeasureUnit;
  symbol?: MeasureSymbol;
}

export interface AmenitiesDto {
  wifi?: boolean;
  kitchen?: boolean;
  tv?: boolean;
  airConditioning?: boolean;
  heating?: boolean;
  parking?: boolean;
  pool?: boolean;
  gym?: boolean;
  petFriendly?: boolean;
  smokingAllowed?: boolean;
}

export interface GuestsDto {
  adults: number;
  children: number;
}

export interface CapacityDto {
  rooms: number;
  beds: number;
  bathrooms: number;
  guests: GuestsDto;
}

export interface AddressDto {
  country: string;
  city: string;
  street: string;
  postal_code: number;
  region: string;
  additionalInfo?: string;
}

export interface CreatePropertyDto {
  price: PriceDto;
  capacity: CapacityDto;
  address: AddressDto;
  livingArea: MeasureDto;
  landArea?: MeasureDto;
  type: PropertyType;
  amenities: AmenitiesDto;
}

export interface CreateAdDto {
  title: string;
  description: string;
  property: CreatePropertyDto;
  rentalType: RentalType;
}
