import jwt from "jsonwebtoken";

export const authenticate = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    throw new Error("Authentication failed");
  }
};
