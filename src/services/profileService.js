import { getToken } from "../models/token";

const API_URL = "https://auth.emilfolino.se";
const API_KEY = import.meta.env.VITE_API_KEY;

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/data?api_key=${API_KEY}`, {
    headers: {
      "x-access-token": getToken(),
    },
  });

  const data = await response.json();

  return data.data;
};

export const saveProfile = async (artefact) => {
  const existing = await getProfile();

  if (existing.length > 0) {
    return fetch(`${API_URL}/data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": getToken(),
      },
      body: JSON.stringify({
        id: existing[0].id,
        artefact: JSON.stringify(artefact),
        api_key: API_KEY,
      }),
    });
  }

  return fetch(`${API_URL}/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getToken(),
    },
    body: JSON.stringify({
      artefact: JSON.stringify(artefact),
      api_key: API_KEY,
    }),
  });
};
