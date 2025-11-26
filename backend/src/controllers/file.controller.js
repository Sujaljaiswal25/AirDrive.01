const fileModel = require("../models/file.model");
const redisService = require("../services/redis.service");
const {
  uploadFileToImageKit,
  deleteFileFromImageKit,
} = require("../services/storage.service");
const {
  success,
  created,
  badRequest,
  notFound,
  forbidden,
  error,
} = require("../utils/response.util");
const {
  generateFolderId,
  generateShareId,
  resolveFolderValue,
  buildFileFilter,
  isFolderFileId,
  FILE_TYPE,
} = require("../utils/file.util");
const { isOwner, sanitizeFileName } = require("../utils/validation.util");

// ================== HELPER FUNCTIONS ==================

// Verify file ownership
const verifyOwnership = async (fileId, userId) => {
  const file = await fileModel.findById(fileId);

  if (!file) {
    return { error: "File not found", code: 404 };
  }

  if (!isOwner(file, userId)) {
    return { error: "Not authorized", code: 403 };
  }

  return { file };
};

// Delete file from ImageKit (with error handling)
const deleteFromImageKit = async (fileId, fileName) => {
  if (!fileId || isFolderFileId(fileId)) {
    return; // Skip for folders
  }

  try {
    await deleteFileFromImageKit(fileId);
    console.log(`Deleted from ImageKit: ${fileName}`);
  } catch (err) {
    console.warn(`ImageKit deletion failed for ${fileName}:`, err.message);
  }
};

// Recursively delete folder contents
const deleteFolderContents = async (folderId, userId) => {
  const filesInFolder = await fileModel.find({
    owner: userId,
    folder: folderId,
  });

  for (const file of filesInFolder) {
    await deleteFromImageKit(file.fileId, file.name);
    await fileModel.findByIdAndDelete(file._id);
  }

  return filesInFolder.length;
};

// ================== UPLOAD FILE ==================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return badRequest(res, "No file uploaded");
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { folderId } = req.body;

    // Verify folder exists if provided
    const folderValue = resolveFolderValue(folderId);
    if (folderId && folderValue !== "root") {
      const folder = await fileModel.findOne({
        _id: folderId,
        owner: req.user._id,
        type: FILE_TYPE.FOLDER,
      });

      if (!folder) {
        return notFound(res, "Folder not found");
      }
    }

    // Upload to ImageKit
    const uploadResult = await uploadFileToImageKit(buffer, originalname);
    if (!uploadResult?.fileId) {
      return error(res, "ImageKit upload failed");
    }

    // Save to database
    const file = await fileModel.create({
      name: originalname,
      type: mimetype,
      size,
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      owner: req.user._id,
      folder: folderValue,
    });

    // Invalidate user's file list cache after upload
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated for user: ${req.user._id}`);

    return created(res, { file }, "File uploaded successfully");
  } catch (err) {
    console.error("Upload error:", err);
    return error(res, "Upload failed");
  }
};

// ================== GET USER FILES ==================
const getUserFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      folder,
      search,
    } = req.query;

    // Create cache key based on query parameters
    const cacheKey = `files:${
      req.user._id
    }:page${page}:limit${limit}:sort${sortBy}:${order}:folder${
      folder || "all"
    }:search${search || "none"}`;

    // Check Redis cache first
    const cachedFiles = await redisService.get(cacheKey);
    if (cachedFiles) {
      console.log(`🚀 Files loaded from cache for user: ${req.user._id}`);
      return success(res, cachedFiles);
    }

    // Build filter
    const filter = buildFileFilter(req.user._id, {
      folder,
      starred: folder === "starred",
      trashed: folder === "trash",
      search,
    });

    // Fetch files with pagination
    const files = await fileModel
      .find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalFiles = await fileModel.countDocuments(filter);

    const responseData = {
      files,
      count: files.length,
      totalFiles,
      currentPage: Number(page),
      totalPages: Math.ceil(totalFiles / limit),
    };

    // Cache the response for 5 minutes (300 seconds)
    await redisService.set(cacheKey, responseData, 300);
    console.log(`💾 Files cached for user: ${req.user._id}`);

    return success(res, responseData);
  } catch (err) {
    console.error("Fetch error:", err);
    return error(res, "Failed to fetch files");
  }
};

// ================== DELETE FILE ==================
const deleteFile = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    // Delete folder contents if it's a folder
    if (file.type === FILE_TYPE.FOLDER) {
      await deleteFolderContents(file._id, req.user._id);
    } else {
      await deleteFromImageKit(file.fileId, file.name);
    }

    // Delete the file/folder itself
    await fileModel.findByIdAndDelete(file._id);

    // Invalidate user's file list cache after deletion
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(
      `🗑️ Cache invalidated after deletion for user: ${req.user._id}`
    );

    const message =
      file.type === FILE_TYPE.FOLDER
        ? "Folder deleted successfully"
        : "File deleted successfully";

    return success(res, {}, message);
  } catch (err) {
    console.error("Delete error:", err);
    return error(res, "Failed to delete");
  }
};

// ================== PREVIEW FILE ==================
const previewFile = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    return success(res, { file }, "File preview fetched");
  } catch (err) {
    console.error("Preview error:", err);
    return error(res, "Failed to preview file");
  }
};

// ================== DOWNLOAD FILE ==================
const downloadFile = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    return res.redirect(file.url);
  } catch (err) {
    console.error("Download error:", err);
    return error(res, "Failed to download file");
  }
};

// ================== CREATE FOLDER ==================
const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName?.trim()) {
      return badRequest(res, "Folder name required");
    }

    const name = sanitizeFileName(folderName);

    // Check if folder exists
    const exists = await fileModel.findOne({
      owner: req.user._id,
      name,
      type: FILE_TYPE.FOLDER,
    });

    if (exists) {
      return badRequest(res, "Folder already exists");
    }

    // Create folder
    const folder = await fileModel.create({
      name,
      type: FILE_TYPE.FOLDER,
      size: 0,
      url: "#",
      fileId: generateFolderId(),
      owner: req.user._id,
      folder: "root",
    });

    // Invalidate user's file list cache after creating folder
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated after folder creation: ${folder.name}`);

    return created(res, { folder }, "Folder created successfully");
  } catch (err) {
    console.error("Folder creation error:", err);
    return error(res, "Failed to create folder");
  }
};

// ================== SHARE FILE ==================
const shareFile = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    // Generate share ID
    file.shareId = generateShareId();
    file.isShared = true;
    await file.save();

    const shareLink = `${process.env.FRONTEND_URL}/shared/${file.shareId}`;

    return success(
      res,
      { shareLink, shareId: file.shareId },
      "File shared successfully"
    );
  } catch (err) {
    console.error("Share error:", err);
    return error(res, "Failed to share file");
  }
};

// ================== GET SHARED FILE ==================
const getSharedFile = async (req, res) => {
  try {
    const file = await fileModel.findOne({ shareId: req.params.shareId });

    if (!file || !file.isShared) {
      return notFound(res, "Shared file not found");
    }

    return success(res, { file });
  } catch (err) {
    console.error("Get shared file error:", err);
    return error(res, "Failed to get shared file");
  }
};

// ================== SEARCH FILES ==================
const searchFiles = async (req, res) => {
  try {
    const { query, folder } = req.query;

    const filter = buildFileFilter(req.user._id, {
      folder,
      search: query,
      trashed: false,
    });

    const files = await fileModel.find(filter).sort({ createdAt: -1 });

    return success(res, { files, count: files.length });
  } catch (err) {
    console.error("Search error:", err);
    return error(res, "Search failed");
  }
};

// ================== TOGGLE STAR ==================
const toggleStar = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    file.isStarred = !file.isStarred;
    await file.save();

    // Invalidate user's file list cache after starring/unstarring
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated after star toggle: ${file.name}`);

    const message = file.isStarred ? "File starred" : "File unstarred";
    return success(res, { isStarred: file.isStarred }, message);
  } catch (err) {
    console.error("Toggle star error:", err);
    return error(res, "Failed to toggle star");
  }
};

// ================== MOVE TO TRASH ==================
const moveToTrash = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    file.isTrashed = true;
    file.trashedAt = new Date();
    await file.save();

    // Invalidate user's file list cache after moving to trash
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated after moving to trash: ${file.name}`);

    return success(res, {}, "File moved to trash");
  } catch (err) {
    console.error("Move to trash error:", err);
    return error(res, "Failed to move to trash");
  }
};

// ================== RESTORE FROM TRASH ==================
const restoreFromTrash = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    if (!file.isTrashed) {
      return badRequest(res, "File is not in trash");
    }

    file.isTrashed = false;
    file.trashedAt = null;
    await file.save();

    // Invalidate user's file list cache after restoring from trash
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated after restoring: ${file.name}`);

    return success(res, { file }, "File restored from trash");
  } catch (err) {
    console.error("Restore error:", err);
    return error(res, "Failed to restore file");
  }
};

// ================== PERMANENT DELETE ==================
const permanentDelete = async (req, res) => {
  try {
    const { error: ownershipError, file } = await verifyOwnership(
      req.params.id,
      req.user._id
    );

    if (ownershipError) {
      return ownershipError.code === 404
        ? notFound(res, ownershipError.error)
        : forbidden(res, ownershipError.error);
    }

    console.log(`Permanently deleting: ${file.name}`);

    // Delete folder contents if folder
    if (file.type === FILE_TYPE.FOLDER) {
      await deleteFolderContents(file._id, req.user._id);
    } else {
      await deleteFromImageKit(file.fileId, file.name);
    }

    // Delete from database
    await fileModel.findByIdAndDelete(file._id);
    console.log(`Successfully deleted: ${file.name}`);

    // Invalidate user's file list cache after permanent deletion
    await redisService.deletePattern(`files:${req.user._id}:*`);
    console.log(`🗑️ Cache invalidated after permanent deletion: ${file.name}`);

    return success(res, {}, "File permanently deleted");
  } catch (err) {
    console.error("Permanent delete error:", err);
    return error(res, "Failed to delete permanently");
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
