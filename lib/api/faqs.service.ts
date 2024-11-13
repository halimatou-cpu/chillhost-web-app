import { apiUrl } from "@/environment";
import { getToken } from "../auth";
import { Faq } from "../models/faq";

export async function getFaqs(): Promise<Faq[]> {
  const token = getToken();
  const response = await fetch(`${apiUrl}/faq`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }

  return response.json();
}

export async function getFaqById(faqId: string): Promise<Faq> {
  const token = getToken();
  const response = await fetch(`${apiUrl}/faq/${faqId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch FAQ");
  }

  return response.json();
}
