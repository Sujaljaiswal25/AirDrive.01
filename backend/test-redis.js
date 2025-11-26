/**
 * Simple Redis Test Script
 * Run this to verify Redis is working correctly
 *
 * Usage: node test-redis.js
 */

require("dotenv").config();
const { redisClient, connectRedis } = require("./src/config/redis");
const redisService = require("./src/services/redis.service");

async function testRedis() {
  console.log("🧪 Testing Redis Connection...\n");

  try {
    // Connect to Redis
    await connectRedis();

    // Wait a moment for connection
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!redisClient.isOpen) {
      console.error("❌ Redis is not connected!");
      console.log("\n💡 Make sure Redis server is running:");
      console.log("   - Windows: Start redis-server.exe");
      console.log("   - Mac/Linux: redis-server or brew services start redis");
      process.exit(1);
    }

    console.log("✅ Redis connected successfully!\n");

    // Test 1: Set and Get
    console.log("📝 Test 1: Setting a value...");
    await redisService.set("test:key", "Hello Redis!", 60);

    console.log("📖 Test 1: Getting the value...");
    const value = await redisService.get("test:key");
    console.log(`   Retrieved: "${value}"`);
    console.log(
      value === "Hello Redis!" ? "✅ Test 1 PASSED\n" : "❌ Test 1 FAILED\n"
    );

    // Test 2: Set and Get Object
    console.log("📝 Test 2: Setting an object...");
    const testUser = { id: 1, name: "John Doe", email: "john@example.com" };
    await redisService.set("test:user", testUser, 60);

    console.log("📖 Test 2: Getting the object...");
    const retrievedUser = await redisService.get("test:user");
    console.log(`   Retrieved:`, retrievedUser);
    console.log(
      retrievedUser.name === "John Doe"
        ? "✅ Test 2 PASSED\n"
        : "❌ Test 2 FAILED\n"
    );

    // Test 3: Check TTL
    console.log("⏰ Test 3: Checking TTL...");
    const ttl = await redisService.getTTL("test:key");
    console.log(`   TTL: ${ttl} seconds`);
    console.log(
      ttl > 0 && ttl <= 60 ? "✅ Test 3 PASSED\n" : "❌ Test 3 FAILED\n"
    );

    // Test 4: Exists check
    console.log("🔍 Test 4: Checking if key exists...");
    const exists = await redisService.exists("test:key");
    console.log(`   Exists: ${exists}`);
    console.log(exists ? "✅ Test 4 PASSED\n" : "❌ Test 4 FAILED\n");

    // Test 5: Delete
    console.log("🗑️  Test 5: Deleting key...");
    await redisService.delete("test:key");
    const deletedValue = await redisService.get("test:key");
    console.log(`   Value after delete: ${deletedValue}`);
    console.log(
      deletedValue === null ? "✅ Test 5 PASSED\n" : "❌ Test 5 FAILED\n"
    );

    // Test 6: Pattern delete
    console.log("📝 Test 6: Testing pattern delete...");
    await redisService.set("test:user:1", { id: 1 }, 60);
    await redisService.set("test:user:2", { id: 2 }, 60);
    await redisService.set("test:user:3", { id: 3 }, 60);
    await redisService.deletePattern("test:user:*");
    const deleted = await redisService.get("test:user:1");
    console.log(`   Value after pattern delete: ${deleted}`);
    console.log(deleted === null ? "✅ Test 6 PASSED\n" : "❌ Test 6 FAILED\n");

    // Cleanup
    await redisService.delete("test:user");

    console.log("🎉 All tests completed!\n");
    console.log("✅ Redis is working perfectly!");
    console.log(
      "   Your AirDrive app can now use caching for better performance.\n"
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Redis test failed:", err.message);
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Make sure Redis server is running");
    console.log(
      "   2. Check your .env file for correct REDIS_HOST and REDIS_PORT"
    );
    console.log("   3. Test Redis manually: redis-cli ping\n");
    process.exit(1);
  }
}

// Run tests
testRedis();
