const TOKEN_KEY = "token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();

  if (!token) {
    return false;
  }
  // Get the payload of the token, which is the second part of the token string, and decode it
  const payload = JSON.parse(atob(token.split(".")[1]));
  // It is expired if multiplying the exp property by 1000 results in a value that is less than the current time
  const isExpired = payload.exp * 1000 < Date.now();

  if (isExpired) {
    removeToken();
    return false;
  }

  return true;
};

export const getCurrentUserEmail = () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.email;
};
