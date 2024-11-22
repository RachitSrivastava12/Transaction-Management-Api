"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const database_1 = __importDefault(require("../config/database"));
const redis_1 = __importDefault(require("../config/redis"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userResolver = {
    Query: {
        async getUser(_, { id }) {
            const cacheKey = `user:${id}`;
            // Check Redis cache
            const cachedUser = await redis_1.default.get(cacheKey);
            if (cachedUser) {
                console.log("Returning cached user");
                return JSON.parse(cachedUser);
            }
            // If not cached, query the database
            const result = await database_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
            if (result.rowCount === 0)
                return null;
            // Cache the result in Redis for 1 hour
            const user = result.rows[0];
            await redis_1.default.set(cacheKey, JSON.stringify(user), "EX", 3600);
            return user;
        },
    },
    Mutation: {
        async register(_, { email, password }) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            console.log(hashedPassword);
            await database_1.default.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
            return "User registered successfully";
        },
        async login(_, { email, password }) {
            const result = await database_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            if (result.rowCount === 0)
                throw new Error("User not found");
            else
                console.log("User found in DB");
            const user = result.rows[0];
            const isValidPassword = await bcrypt_1.default.compare(password, user.password);
            if (!isValidPassword)
                throw new Error("Invalid password");
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return token;
        },
    },
};
