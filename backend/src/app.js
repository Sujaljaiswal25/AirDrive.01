require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// Import routes
const authRoute = require("./routes/auth.route");
const fileRoutes = require("./routes/file.route");
const profileRoutes = require("./routes/profile.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://air-drive-01.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Add additional origins from environment variable if provided
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(",").map((origin) =>
    origin.trim()
  );
  allowedOrigins.push(...envOrigins);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AirDrive API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/files", fileRoutes);
app.use("/api/profile", profileRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
