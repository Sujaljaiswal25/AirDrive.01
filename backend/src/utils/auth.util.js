const jwt = require("jsonwebtoken");

// Constants
const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Generate JWT tokens
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || "user",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY,
  });
};

const generateTokenPair = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user._id),
  };
};

// Cookie helpers
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TOKEN_CONFIG.COOKIE_MAX_AGE,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

// Remove sensitive data
const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...userWithoutPassword } = userObject;
  return userWithoutPassword;
};

module.exports = {
  TOKEN_CONFIG,
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  sanitizeUser,
};
