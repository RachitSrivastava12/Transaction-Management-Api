import pool from "../config/database";
import redis from "../config/redis";
import { Transaction } from "../models/transaction";

export const transactionResolver = {
  Query: {
    async getTransactions(_: any, { userId }: { userId: number }): Promise<Transaction[]> {
      const cacheKey = `transactions:${userId}`;

      // Check Redis cache
      const cachedTransactions = await redis.get(cacheKey);
      if (cachedTransactions) {
        console.log("Returning cached transactions");
        return JSON.parse(cachedTransactions);
      }

      // If not cached, query the database
      const result = await pool.query("SELECT * FROM transactions WHERE user_id = $1", [userId]);

      // Cache the result in Redis for 1 hour
      await redis.set(cacheKey, JSON.stringify(result.rows), "EX", 3600);

      return result.rows;
    },
  },

  Mutation: {
    async createTransaction(
      _: any,
      { userId, amount, type, currency }: { 
        userId: number; 
        amount: number; 
        type: string; 
        currency: string 
      }
    ) {
      // Validate input
      if (amount <= 0) {
        throw new Error("Amount must be positive");
      }
    
      // Fetch the user's current balance from the database
      const result = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
      if (!result.rowCount) throw new Error("User not found");
    
      // Safely parse balance, defaulting to empty object if invalid
      let userBalance: Record<string, number>;
      try {
        userBalance = JSON.parse(result.rows[0].balance || '{}');
      } catch {
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
      await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [
        JSON.stringify(userBalance),
        userId
      ]);
    
      // Log the transaction
      await pool.query(
        "INSERT INTO transactions (user_id, amount, type, currency) VALUES ($1, $2, $3, $4)",
        [userId, amount, type, currency]
      );
    
      // Update Redis cache
      await redis.set(`balance:${userId}`, JSON.stringify(userBalance));
    
      return {
        message: "Transaction processed successfully",
        newBalance: userBalance
      };
    }
  
  },
};
