import { ValidationError } from "apollo-server-express";

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters long");
  }
};
