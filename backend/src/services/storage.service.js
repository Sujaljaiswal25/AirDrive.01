const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit
 * @param {Buffer} fileBuffer - multer buffer
 * @param {string} fileName - file name
 * @returns {Object} - uploaded file details (url, fileId, etc.)
 */
const uploadFileToImageKit = async (fileBuffer, fileName) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"), // ✅ buffer ko base64 me convert
      fileName,
    });

    // Explicitly return only required fields
    return {
      url: result.url,
      fileId: result.fileId,   // 🔑 ye zaroor save hoga ab
      name: result.name,
      size: result.size,
      type: result.fileType,
    };
  } catch (err) {
    console.error("❌ ImageKit Upload Error:", err.message);
    throw new Error("Image upload failed: " + err.message);
  }
};

/**
 * Delete file from ImageKit
 * @param {string} fileId 
 */
const deleteFileFromImageKit = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("Missing fileId for delete request");
    }

    console.log(`🗑️ Attempting to delete file from ImageKit: ${fileId}`);
    const result = await imagekit.deleteFile(fileId);
    console.log(`✅ Successfully deleted from ImageKit: ${fileId}`);
    return result;
  } catch (err) {
    console.error("❌ ImageKit Delete Error:", err.message);
    console.error("FileId attempted:", fileId);
    throw new Error("Image delete failed: " + err.message);
  }
};

module.exports = { uploadFileToImageKit, deleteFileFromImageKit };
