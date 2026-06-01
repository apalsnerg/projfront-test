import { getToken, isAuthenticated } from "../models/token";

const API_URL = "https://docket.emilfolino.se";
const API_KEY = import.meta.env.VITE_API_KEY;

export const getFiles = async (project_uid) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/projects/${project_uid}?api_key=${API_KEY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.data?.errors?.message || "Failed to fetch files");
  }

  return data.data.files;
};

// File will automatically be associated with authenticated user via token
export const createFile = async (payload) => {
  if (!isAuthenticated()) {
    throw new Error("User not authenticated");
  }

  const token = getToken();

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      ...payload,
      api_key: API_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create file");
  }

  const data = await response.json();
  return data;
};

export const deleteFile = async (file_uid) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/files`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      uid: file_uid,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }

  return true;
};
