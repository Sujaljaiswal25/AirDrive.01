const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log(
          "Too many Redis connection attempts, stopping reconnection"
        );
        return new Error("Redis connection failed");
      }
      return retries * 100; // Retry after 100ms, 200ms, 300ms, etc.
    },
  },
});

// Error handling
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Connection event
redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

// Ready event
redisClient.on("ready", () => {
  console.log("Redis Client Ready to use");
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
    // Don't crash the app if Redis fails - graceful degradation
  }
};

module.exports = { redisClient, connectRedis };
