const app = require("./src/app");
const connectDB = require("./src/db/db");
const { connectRedis } = require("./src/config/redis");

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRedis();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
