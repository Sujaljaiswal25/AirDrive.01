const { redisClient } = require("../config/redis");

/**
 * Redis Service - Simple wrapper for Redis operations
 * Provides easy-to-use functions for caching data
 */

class RedisService {
  /**
   * Set a value in Redis with expiration time
   * @param {string} key - Redis key
   * @param {any} value - Value to store (will be JSON stringified)
   * @param {number} ttl - Time to live in seconds (default: 1 hour)
   */
  async set(key, value, ttl = 3600) {
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis not connected, skipping cache set");
        return false;
      }

      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await redisClient.setEx(key, ttl, stringValue);
      console.log(`✅ Cached: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (err) {
      console.error(`Redis SET error for key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Get a value from Redis
   * @param {string} key - Redis key
   * @returns {Promise<any>} - Parsed value or null if not found
   */
  async get(key) {
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis not connected, skipping cache get");
        return null;
      }

      const value = await redisClient.get(key);
      if (!value) {
        console.log(`❌ Cache miss: ${key}`);
        return null;
      }

      console.log(`✅ Cache hit: ${key}`);

      // Try to parse as JSON, return as string if parsing fails
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (err) {
      console.error(`Redis GET error for key "${key}":`, err.message);
      return null;
    }
  }

  /**
   * Delete a value from Redis
   * @param {string} key - Redis key
   */
  async delete(key) {
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis not connected, skipping cache delete");
        return false;
      }

      await redisClient.del(key);
      console.log(`🗑️ Deleted cache: ${key}`);
      return true;
    } catch (err) {
      console.error(`Redis DELETE error for key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Delete all keys matching a pattern
   * @param {string} pattern - Pattern to match (e.g., "user:*")
   */
  async deletePattern(pattern) {
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis not connected, skipping pattern delete");
        return false;
      }

      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(
          `🗑️ Deleted ${keys.length} keys matching pattern: ${pattern}`
        );
      }
      return true;
    } catch (err) {
      console.error(
        `Redis DELETE PATTERN error for "${pattern}":`,
        err.message
      );
      return false;
    }
  }

  /**
   * Check if a key exists in Redis
   * @param {string} key - Redis key
   */
  async exists(key) {
    try {
      if (!redisClient.isOpen) {
        return false;
      }

      const result = await redisClient.exists(key);
      return result === 1;
    } catch (err) {
      console.error(`Redis EXISTS error for key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   * @param {string} key - Redis key
   * @returns {Promise<number>} - TTL in seconds, -1 if no expiry, -2 if key doesn't exist
   */
  async getTTL(key) {
    try {
      if (!redisClient.isOpen) {
        return -2;
      }

      return await redisClient.ttl(key);
    } catch (err) {
      console.error(`Redis TTL error for key "${key}":`, err.message);
      return -2;
    }
  }

  /**
   * Clear all cache (use carefully!)
   */
  async clearAll() {
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis not connected, cannot clear cache");
        return false;
      }

      await redisClient.flushAll();
      console.log("🗑️ All cache cleared");
      return true;
    } catch (err) {
      console.error("Redis FLUSH error:", err.message);
      return false;
    }
  }
}

module.exports = new RedisService();
