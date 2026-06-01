import { getToken } from "../models/token";
import { getAllUsers } from "../models/auth";

const API_URL = "https://docket.emilfolino.se";
const API_KEY = import.meta.env.VITE_API_KEY;

export const getProjects = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/projects?api_key=${API_KEY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.data?.errors?.message || "Failed to fetch projects");
  }

  return data.data;
};

export const getProjectById = async (uid) => {
  const token = getToken();

  const response = await fetch(
    `https://docket.emilfolino.se/projects/${uid}?api_key=${import.meta.env.VITE_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return data.data;
};

export const createProject = async (projectName) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const existingProjects = await getProjects();

  let nameExists = false;
  for (let i = 0; i < existingProjects.length; i++) {
    if (existingProjects[i].name.toLowerCase() === projectName.toLowerCase()) {
      nameExists = true;
      break;
    }
  }

  if (nameExists) {
    throw new Error("Project name already exists");
  }

  const response = await fetch(`${API_URL}/projects`, {
    body: JSON.stringify({
      name: projectName,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return result.data;
};

export const addUserToProject = async (uid, email) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const existingProject = await getProjectById(uid);
  const allUsers = await getAllUsers();

  let userExists = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email.toLowerCase() === email.toLowerCase()) {
      userExists = true;
      break;
    }
  }
  if (!userExists) {
    throw new Error("User with this email does not exist");
  }

  if (!existingProject) {
    throw new Error("Project not found");
  }

  for (let i = 0; i < existingProject.users.length; i++) {
    if (existingProject.users[i].email.toLowerCase() === email.toLowerCase()) {
      throw new Error("User is already a member of the project");
    }
  }

  const response = await fetch(`${API_URL}/projects/add_user`, {
    body: JSON.stringify({
      uid: uid,
      email: email,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to add user to project");
  }
  return result.data;
};

export const removeUserFromProject = async (uid, email) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const existingProject = await getProjectById(uid);

  if (!existingProject) {
    throw new Error("Project not found");
  }

  const response = await fetch(`${API_URL}/projects/remove_user`, {
    body: JSON.stringify({ uid, email }),
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove user from project");
  }
};

export const deleteProject = async (uid) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/projects`, {
    body: JSON.stringify({ uid }),
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
};
