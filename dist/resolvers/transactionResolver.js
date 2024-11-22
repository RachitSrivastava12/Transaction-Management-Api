"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionResolver = void 0;
const database_1 = __importDefault(require("../config/database"));
const redis_1 = __importDefault(require("../config/redis"));
exports.transactionResolver = {
    Query: {
        async getTransactions(_, { userId }) {
            const cacheKey = `transactions:${userId}`;
            // Check Redis cache
            const cachedTransactions = await redis_1.default.get(cacheKey);
            if (cachedTransactions) {
                console.log("Returning cached transactions");
                return JSON.parse(cachedTransactions);
            }
            // If not cached, query the database
            const result = await database_1.default.query("SELECT * FROM transactions WHERE user_id = $1", [userId]);
            // Cache the result in Redis for 1 hour
            await redis_1.default.set(cacheKey, JSON.stringify(result.rows), "EX", 3600);
            return result.rows;
        },
    },
    Mutation: {
        async createTransaction(_, { userId, amount, type, currency }) {
            // Validate input
            if (amount <= 0) {
                throw new Error("Amount must be positive");
            }
            // Fetch the user's current balance from the database
            const result = await database_1.default.query("SELECT balance FROM users WHERE id = $1", [userId]);
            if (!result.rowCount)
                throw new Error("User not found");
            // Safely parse balance, defaulting to empty object if invalid
            let userBalance;
            try {
                userBalance = JSON.parse(result.rows[0].balance || '{}');
            }
            catch {
                userBalance = {};
            }
            // Handle different transaction types
            switch (type) {
                case "withdrawal":
                    if (!userBalance[currency] || userBalance[currency] < amount) {
                        throw new Error(`Insufficient ${currency} funds`);
                    }
                    userBalance[currency] -= amount;
                    break;
                case "deposit":
                    userBalance[currency] = (userBalance[currency] || 0) + amount;
                    break;
                default:
                    throw new Error("Invalid transaction type");
            }
            // Update the user's balance in the database
            await database_1.default.query("UPDATE users SET balance = $1 WHERE id = $2", [
                JSON.stringify(userBalance),
                userId
            ]);
            // Log the transaction
            await database_1.default.query("INSERT INTO transactions (user_id, amount, type, currency) VALUES ($1, $2, $3, $4)", [userId, amount, type, currency]);
            // Update Redis cache
            await redis_1.default.set(`balance:${userId}`, JSON.stringify(userBalance));
            return {
                message: "Transaction processed successfully",
                newBalance: userBalance
            };
        }
    },
};
