export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain at least one uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain at least one number");
  }

  return errors;
};
