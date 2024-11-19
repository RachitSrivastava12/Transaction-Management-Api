import Redis from 'ioredis';

// Create Redis client
const redis = new Redis({
  host: 'redis-12260.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com',  // Your Redis host (default: localhost)
  port: 12260,  // Your Redis port (default: 6379)
  password: "ZCLfUiE8ZDh6sSg4rMLtN5Kj4QKH0rXZ",  // Password if needed
  
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;
