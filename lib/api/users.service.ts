import { apiUrl } from "@/environment";
import { getToken } from "@/lib/auth";
import { User } from "@/lib/models/user";
// import { jwtDecode } from "jwt-decode";

export const fetchUserData = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      return data as User;
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
  return null;
};

export async function updateUserProfile(
  userData: Partial<User>
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Failed to update profile");
}

export async function changePassword(
  //   currentPassword: string,
  newPassword: string
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ currentPassword, newPassword }),
    body: JSON.stringify({ password: newPassword }), // hahaa this is cheating girl. you can't just change the password without checking the current password 🤪
    // fix that in the API
  });

  if (!response.ok) throw new Error("Failed to change password");
}

export async function verifyEmail(verificationCode: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ verificationCode }),
  });

  if (!response.ok) throw new Error("Failed to verify email");
}

export async function resendVerificationCode(): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(
    `${apiUrl}/auth/resend-email-verification-code`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to send verification code");
}

export async function uploadProfilePicture(file: File): Promise<User> {
  const token = getToken();
  if (!token) throw new Error("Aucun jeton trouvé"); // bad bad bad 🤪

  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await fetch(`${apiUrl}/users/profile-img`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok)
    throw new Error("Échec du téléchargement de la photo de profil");

  //   do something with the response : like show a success message and return the image url, so you can display the image on the page
  // the API responses with the whole user object, so you can extract the profilePicture from it which is an object {url, key}
  const data = await response.json();
  return data as User;
  //   return data.profilePicture.url;
}

export async function deleteProfilePicture(): Promise<User> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${apiUrl}/users/profile-img`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete profile picture");

  const data = await response.json();
  return data as User;
}

/*
export async function deleteMyAccount(): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No token found");

  let myId: string;
  try {
    const decoded = jwtDecode(token) as DecodedToken;
    if (decoded.role === "admin")
      throw new Error("Admin accounts cannot be deleted");
    myId = decoded.id;
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  const response = await fetch(`${apiUrl}/users/${myId!}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete account");
}
*/
