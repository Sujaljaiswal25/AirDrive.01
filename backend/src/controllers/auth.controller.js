const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateTokenPair,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  sanitizeUser,
  generateAccessToken,
} = require("../utils/auth.util");
const {
  badRequest,
  created,
  success,
  unauthorized,
  notFound,
  forbidden,
  error,
} = require("../utils/response.util");

// Default avatar URL
const DEFAULT_AVATAR =
  "https://i.pinimg.com/1200x/4e/7c/53/4e7c53e7d136ab654ec3b004eeec3e72.jpg";

// ================== REGISTER ==================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return badRequest(res, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar: DEFAULT_AVATAR,
    });

    // Generate tokens
    const tokens = generateTokenPair(newUser);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return created(
      res,
      {
        user: sanitizeUser(newUser),
        accessToken: tokens.accessToken,
      },
      "User registered successfully"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return badRequest(res, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return badRequest(res, "Invalid credentials");
    }

    // Generate tokens
    const tokens = generateTokenPair(user);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return success(
      res,
      {
        user: sanitizeUser(user),
        accessToken: tokens.accessToken,
      },
      "Login successful"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ================== LOGOUT ==================
const logout = async (req, res) => {
  try {
    clearRefreshTokenCookie(res);
    return success(res, {}, "Logged out successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

// ================== REFRESH TOKEN ==================
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return unauthorized(res, "No refresh token found");
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return notFound(res, "User not found");
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return success(res, { accessToken }, "Token refreshed");
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return forbidden(res, "Invalid refresh token");
    }
    return error(res, err.message);
  }
};

module.exports = { register, login, logout, refreshToken };
