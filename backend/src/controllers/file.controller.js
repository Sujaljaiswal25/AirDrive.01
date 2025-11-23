const fileModel = require("../models/file.model");
const {
  uploadFileToImageKit,
  deleteFileFromImageKit,
} = require("../services/storage.service");
const crypto = require("crypto");

// Helper Functions
const validateOwnership = (file, userId) => {
  if (!file) return { error: "File not found", code: 404 };
  if (file.owner.toString() !== userId.toString()) {
    return { error: "Not authorized", code: 403 };
  }
  return null;
};

// 📌 Upload file (with folder support)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { folderId } = req.body; // Get folderId from request

    // Define special folder values that should be treated as root
    const specialFolders = [
      "root",
      "images",
      "videos",
      "audio",
      "documents",
      "folders",
      "starred",
      "trash",
    ];

    // If folderId provided and not a special value, verify folder exists and belongs to user
    if (folderId && !specialFolders.includes(folderId)) {
      const folder = await fileModel.findOne({
        _id: folderId,
        owner: req.user._id,
        type: "folder",
      });

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
    }

    // ✅ Upload to ImageKit
    const result = await uploadFileToImageKit(buffer, originalname);

    if (!result || !result.fileId) {
      return res.status(500).json({ message: "ImageKit upload failed" });
    }

    // ✅ Save in MongoDB with folder reference
    // If folderId is a special value or not provided, use "root"
    const folderValue =
      folderId && !specialFolders.includes(folderId) ? folderId : "root";

    const file = await fileModel.create({
      name: originalname,
      type: mimetype,
      size,
      url: result.url,
      fileId: result.fileId,
      owner: req.user._id,
      folder: folderValue,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 📌 Get all files of logged-in user (with pagination + folder filter)
const getUserFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      folder,
    } = req.query;

    let filter = { owner: req.user._id };

    // Define special folder values that should be treated as root
    const specialFolders = [
      "root",
      "images",
      "videos",
      "audio",
      "documents",
      "folders",
      "starred",
      "trash",
    ];

    // Handle special views
    if (folder === "starred") {
      filter.isStarred = true;
      filter.isTrashed = { $ne: true }; // Explicitly check for not true (handles undefined)
      console.log("Fetching starred files");
    } else if (folder === "trash") {
      filter.isTrashed = true; // Only get explicitly trashed items
      console.log("Fetching trashed files");
    } else if (folder && !specialFolders.includes(folder)) {
      // Regular folder - show non-trashed items only
      filter.folder = folder;
      filter.isTrashed = { $ne: true }; // Explicitly check for not true (handles undefined)
      console.log("Fetching files in folder:", folder);
    } else {
      // Show root level: items with folder="root" or no folder field (for backwards compatibility)
      // Exclude trashed items from normal views
      filter.$or = [{ folder: "root" }, { folder: { $exists: false } }];
      filter.isTrashed = { $ne: true }; // Explicitly check for not true (handles undefined)
      console.log("Fetching root-level files and folders");
    }

    const files = await fileModel
      .find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    console.log(
      `Found ${files.length} items (${
        files.filter((f) => f.type === "folder").length
      } folders)`
    );

    const totalFiles = await fileModel.countDocuments(filter);

    return res.json({
      success: true,
      count: files.length,
      totalFiles,
      currentPage: Number(page),
      totalPages: Math.ceil(totalFiles / limit),
      files,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};

// 📌 Delete file (ImageKit + MongoDB)
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await fileModel.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // If it's a folder, delete all files inside it first
    if (file.type === "folder") {
      const filesInFolder = await fileModel.find({
        owner: userId,
        folder: fileId,
      });

      // Delete each file in the folder from ImageKit and MongoDB
      for (const childFile of filesInFolder) {
        if (
          childFile.type !== "folder" &&
          childFile.fileId &&
          !childFile.fileId.startsWith("folder_")
        ) {
          try {
            await deleteFileFromImageKit(childFile.fileId);
          } catch (imagekitError) {
            console.warn(
              `ImageKit deletion failed for ${childFile.name}:`,
              imagekitError.message
            );
          }
        }
        await fileModel.findByIdAndDelete(childFile._id);
      }
    } else {
      // Only delete from ImageKit if it's not a folder and has a valid fileId
      if (file.fileId && !file.fileId.startsWith("folder_")) {
        try {
          await deleteFileFromImageKit(file.fileId);
        } catch (imagekitError) {
          console.warn(
            "ImageKit deletion failed (file may not exist):",
            imagekitError.message
          );
          // Continue with MongoDB deletion even if ImageKit fails
        }
      }
    }

    // Delete from MongoDB
    await fileModel.findByIdAndDelete(fileId);

    return res.json({
      success: true,
      message:
        file.type === "folder"
          ? "Folder deleted successfully"
          : "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Preview file (return URL)
const previewFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json({
      message: "File preview fetched",
      file,
    });
  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Download file (redirect to ImageKit URL)
const downloadFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.redirect(file.url);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Create Folder
const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName?.trim()) {
      return res.status(400).json({ message: "Folder name required" });
    }

    const normalizedName = folderName.trim();

    // Check if folder already exists for this user
    const exists = await fileModel.findOne({
      owner: req.user._id,
      name: normalizedName,
      type: "folder",
    });

    if (exists) {
      return res.status(400).json({ message: "Folder already exists" });
    }

    // Create folder entry in database
    const folder = await fileModel.create({
      name: normalizedName,
      type: "folder",
      size: 0,
      url: "#",
      fileId: `folder_${crypto.randomBytes(4).toString("hex")}`,
      owner: req.user._id,
      folder: "root", // Folders are created at root level
    });

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.error("Folder creation error:", error);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

// 📌 Share File
const shareFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const shareId = crypto.randomBytes(8).toString("hex");
    file.shareId = shareId;
    file.isShared = true;
    await file.save();

    const shareLink = `${process.env.FRONTEND_URL}/shared/${shareId}`;

    res.json({
      message: "File shared successfully",
      shareLink,
      shareId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to share file", error: error.message });
  }
};

// Add a new route to get shared file
const getSharedFile = async (req, res) => {
  try {
    const file = await fileModel.findOne({ shareId: req.params.shareId });
    if (!file || !file.isShared) {
      return res.status(404).json({ message: "Shared file not found" });
    }

    res.json({ file });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get shared file", error: error.message });
  }
};

// 📌 Search / Filter Files
const searchFiles = async (req, res) => {
  try {
    const { query, folder } = req.query;
    let filter = { owner: req.user._id, isTrashed: false }; // Exclude trashed files from search

    if (folder) filter.folder = folder;
    if (query) filter.name = { $regex: query, $options: "i" };

    const files = await fileModel.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: files.length, files });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Toggle Star/Unstar File
const toggleStar = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    file.isStarred = !file.isStarred;
    await file.save();

    res.json({
      success: true,
      message: file.isStarred ? "File starred" : "File unstarred",
      isStarred: file.isStarred,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Move File to Trash (Soft Delete)
const moveToTrash = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    file.isTrashed = true;
    file.trashedAt = new Date();
    await file.save();

    console.log(`File ${file.name} moved to trash by user ${req.user._id}`);

    res.json({
      success: true,
      message: "File moved to trash",
    });
  } catch (error) {
    console.error("Move to trash error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Restore File from Trash
const restoreFromTrash = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!file.isTrashed) {
      return res.status(400).json({ message: "File is not in trash" });
    }

    file.isTrashed = false;
    file.trashedAt = null;
    await file.save();

    res.json({
      success: true,
      message: "File restored from trash",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Permanently Delete File (from trash)
const permanentDelete = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log(`Permanently deleting file: ${file.name} (ID: ${file._id})`);

    // Delete from ImageKit if it's a file (not folder)
    if (
      file.type !== "folder" &&
      file.fileId &&
      !file.fileId.startsWith("folder_")
    ) {
      try {
        console.log(`Deleting from ImageKit: ${file.fileId}`);
        await deleteFileFromImageKit(file.fileId);
        console.log(`Successfully deleted from ImageKit: ${file.fileId}`);
      } catch (imagekitError) {
        console.warn("ImageKit deletion failed:", imagekitError.message);
      }
    }

    // If it's a folder, delete all files inside
    if (file.type === "folder") {
      const filesInFolder = await fileModel.find({
        owner: req.user._id,
        folder: file._id,
      });

      console.log(`Deleting ${filesInFolder.length} files from folder`);

      for (const childFile of filesInFolder) {
        if (
          childFile.type !== "folder" &&
          childFile.fileId &&
          !childFile.fileId.startsWith("folder_")
        ) {
          try {
            console.log(`Deleting child file from ImageKit: ${childFile.fileId}`);
            await deleteFileFromImageKit(childFile.fileId);
          } catch (imagekitError) {
            console.warn(
              `ImageKit deletion failed for ${childFile.name}:`,
              imagekitError.message
            );
          }
        }
        await fileModel.findByIdAndDelete(childFile._id);
      }
    }

    // Delete from MongoDB
    await fileModel.findByIdAndDelete(file._id);
    console.log(`Successfully deleted from MongoDB: ${file._id}`);

    res.json({
      success: true,
      message: "File permanently deleted",
    });
  } catch (error) {
    console.error("Permanent delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
  deleteFile,
  previewFile,
  downloadFile,
  createFolder,
  shareFile,
  getSharedFile,
  searchFiles,
  toggleStar,
  moveToTrash,
  restoreFromTrash,
  permanentDelete,
};
