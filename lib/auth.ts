import { apiUrl } from "@/environment";
import { jwtDecode } from "jwt-decode";
import { User, UserRole } from "./models/user";

export interface DecodedToken {
  id: string;
  role: string;
  email: string;
  firtsName: string;
  lastName: string;
  exp: number;
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    setToken(data.accessToken);
  } catch {
    return null;
  }
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  role: string = UserRole.TRAVELER
): Promise<User | null> {
  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName, role }),
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
}

export const isAdmin = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.role === "admin";
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
