import pool from "../config/database";
import redis from "../config/redis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const userResolver = {
  Query: {
    async getUser(_: any, { id }: { id: String }): Promise<User | null> {
      const cacheKey = `user:${id}`;

      // Check Redis cache
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        console.log("Returning cached user");
        return JSON.parse(cachedUser);
      }

      // If not cached, query the database
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

      if (result.rowCount === 0) return null;

      // Cache the result in Redis for 1 hour
      const user = result.rows[0];
      await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);

      return user;
    },
  },

  Mutation: {
    async register(_: any, { email, password }: { email: string; password: string }): Promise<string> {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);


      return "User registered successfully";
    },

    async login(_: any, { email, password }: { email: string; password: string }): Promise<string> {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rowCount === 0) throw new Error("User not found");
      else console.log("User found in DB");

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Invalid password");

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      return token;
    },
  },
};
