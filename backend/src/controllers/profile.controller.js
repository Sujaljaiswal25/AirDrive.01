const userModel = require("../models/user.model");
const redisService = require("../services/redis.service");
const { uploadFileToImageKit } = require("../services/storage.service");
const { success, error } = require("../utils/response.util");

// ================== GET PROFILE ==================
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return error(res, "User not found", 404);
    }

    return success(res, { user });
  } catch (err) {
    console.error("Get profile error:", err);
    return error(res, err.message);
  }
};

// ================== UPDATE PROFILE ==================
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updates = {};

    // Update name if provided
    if (name?.trim()) {
      updates.name = name.trim();
    }

    // Upload new avatar if provided
    if (req.file) {
      const avatarResult = await uploadFileToImageKit(
        req.file.buffer,
        `avatar-${req.user._id}`
      );
      updates.avatar = avatarResult.url;
    }

    // Update user
    const user = await userModel
      .findByIdAndUpdate(req.user._id, updates, { new: true })
      .select("-password");

    if (!user) {
      return error(res, "User not found", 404);
    }

    // Clear user cache after profile update
    await redisService.delete(`user:${req.user._id}`);
    console.log(`🗑️ User cache cleared after profile update: ${req.user._id}`);

    return success(res, { user }, "Profile updated successfully");
  } catch (err) {
    console.error("Update profile error:", err);
    return error(res, err.message);
  }
};

module.exports = { getProfile, updateProfile };
