import { apiUrl } from "@/environment";
import { getToken } from "@/lib/auth";
import { Ad, RentalType, PropertyType, SortBy } from "@/lib/models/ad";
import { ReportReason } from "../models/report";
import { CreateAdDto } from "../models/create-ad.dto";
import { UpdateAdDto } from "../models/update-ad.dto";

interface GetAdsParams {
  page?: number;
  limit?: number;
  sort?: SortBy;
  search?: string;
  rentalType?: RentalType;
  active?: boolean;
  deleted?: boolean;
  isVerified?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minLivingArea?: number;
  maxLivingArea?: number;
  rooms?: number;
  beds?: number;
  bathrooms?: number;
  adults?: number;
  children?: number;
  type?: PropertyType;
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

interface GetAdsResponse {
  results: Ad[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export async function getAds(
  params: GetAdsParams = {}
): Promise<GetAdsResponse> {
  const queryParams = new URLSearchParams();

  params.deleted = false;
  params.active = true;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${apiUrl}/ads?${queryParams.toString()}`);

  if (!response.ok) throw new Error("Failed to fetch ads");

  return response.json();
}

export async function getAdById(adId: string): Promise<Ad> {
  // const token = getToken();
  // if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}`, {
    headers: {
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch ad");

  return response.json();
}

export async function verifyAd(adId: string): Promise<Ad> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/validate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to verify ad");

  return response.json();
}

export async function toggleAdActive(
  adId: string,
  active: boolean
): Promise<Ad> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/activation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) throw new Error("Failed to toggle ad active status");

  return response.json();
}

export async function contactOwner(
  adId: string,
  data: { subject: string; message: string }
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to send message");
}

export async function reportAnAd(
  adId: string,
  report: {
    reason: ReportReason;
    description: string;
  }
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) throw new Error("Failed to report ad");
}

export async function createAd(ad: CreateAdDto): Promise<Ad> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ad),
  });

  if (!response.ok) throw new Error("Failed to create ad");

  return response.json();
}

export async function updateAd(adId: string, ad: UpdateAdDto): Promise<Ad> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ad),
  });

  if (!response.ok) throw new Error("Failed to update ad");

  return response.json();
}

export async function deleteAd(adId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete ad");
}

export async function uploadAdImage(adId: string, file: File): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${apiUrl}/ads/${adId}/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload image");
}

export async function uploadAdImages(
  adId: string,
  files: File[]
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(`${apiUrl}/ads/${adId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload images");
}

export async function deleteAdImage(
  adId: string,
  imageKey: string
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/image/${imageKey}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete image");
}

export async function uploadAdDocument(
  adId: string,
  file: File
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(`${apiUrl}/ads/${adId}/document`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload document");
}

export async function uploadAdDocuments(
  adId: string,
  files: File[]
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("documents", file);
  });

  const response = await fetch(`${apiUrl}/ads/${adId}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload documents");
}

export async function deleteAdDocument(
  adId: string,
  documentKey: string
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${apiUrl}/ads/${adId}/document/${documentKey}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to delete document");
}

export async function uploadAdVideo(adId: string, file: File): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch(`${apiUrl}/ads/${adId}/video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload video");
}

export async function deleteAdVideo(
  adId: string,
  videoKey: string
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/video/${videoKey}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete video");
}

export async function toggleAdActivation(
  adId: string,
  active: boolean
): Promise<Ad> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/ads/${adId}/activation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) throw new Error("Failed to toggle ad activation");

  return response.json();
}
