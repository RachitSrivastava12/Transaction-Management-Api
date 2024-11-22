"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
// Create Redis client
const redis = new ioredis_1.default({
    host: 'redis-12260.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com', // Your Redis host (default: localhost)
    port: 12260, // Your Redis port (default: 6379)
    password: "ZCLfUiE8ZDh6sSg4rMLtN5Kj4QKH0rXZ", // Password if needed
});
redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.error('Redis error:', err);
});
exports.default = redis;
