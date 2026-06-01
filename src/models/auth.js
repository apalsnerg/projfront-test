import { setToken, removeToken, getToken } from "./token";

const API_URL = "https://auth.emilfolino.se";
const API_KEY = import.meta.env.VITE_API_KEY;

export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      api_key: API_KEY,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Something went wrong";

    const rawError = data?.errors?.detail || "";

    // 👇 här fångar vi SQLite UNIQUE error
    if (rawError.includes("UNIQUE")) {
      message = "User with this email already exists";
    }

    return {
      errors: {
        status: response.status,
        detail: message,
      },
    };
  }

  // Save JWT token om log in om log lyckas
  if (data.data?.token) {
    setToken(data.data.token);
  }

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      api_key: API_KEY,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      errors: {
        status: response.status,
        detail: "Invalid email or password",
      },
    };
  }

  setToken(data.data?.token);

  return data;
};

// logout function clear jwk från localstorage

export const logout = () => {
  removeToken();
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users?api_key=${API_KEY}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return data.data;
};

export const updatePassword = async (email, password) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getToken(),
    },
    body: JSON.stringify({
      email,
      password,
      api_key: API_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update password");
  }

  return true;
};
