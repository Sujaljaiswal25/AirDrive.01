const crypto = require("crypto");

// Special folder names that should be treated as root level
const SPECIAL_FOLDERS = [
  "root",
  "images",
  "videos",
  "audio",
  "documents",
  "folders",
  "starred",
  "trash",
];

// File type constants
const FILE_TYPE = {
  FOLDER: "folder",
};

// Generate unique folder ID
const generateFolderId = () => {
  return `folder_${crypto.randomBytes(4).toString("hex")}`;
};

// Generate share ID
const generateShareId = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Check if folder name is special
const isSpecialFolder = (folderName) => {
  return SPECIAL_FOLDERS.includes(folderName);
};

// Determine folder value for storage
const resolveFolderValue = (folderId) => {
  if (!folderId || isSpecialFolder(folderId)) {
    return "root";
  }
  return folderId;
};

// Build file query filter
const buildFileFilter = (userId, options = {}) => {
  const { folder, starred, trashed, search } = options;
  const filter = { owner: userId };

  // Handle special views
  if (starred) {
    filter.isStarred = true;
    filter.isTrashed = { $ne: true };
  } else if (trashed) {
    filter.isTrashed = true;
  } else if (folder && !isSpecialFolder(folder)) {
    filter.folder = folder;
    filter.isTrashed = { $ne: true };
  } else {
    // Root level view
    filter.$or = [{ folder: "root" }, { folder: { $exists: false } }];
    filter.isTrashed = { $ne: true };
  }

  // Add search if provided
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  return filter;
};

// Check if file ID is for a folder
const isFolderFileId = (fileId) => {
  return fileId && fileId.startsWith("folder_");
};

module.exports = {
  SPECIAL_FOLDERS,
  FILE_TYPE,
  generateFolderId,
  generateShareId,
  isSpecialFolder,
  resolveFolderValue,
  buildFileFilter,
  isFolderFileId,
};
