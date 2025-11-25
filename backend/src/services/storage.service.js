const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Upload file to ImageKit storage
const uploadFileToImageKit = async (fileBuffer, fileName) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      type: result.fileType,
    };
  } catch (err) {
    throw new Error("Image upload failed: " + err.message);
  }
};

// Delete file from ImageKit storage
const deleteFileFromImageKit = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("Missing fileId for delete request");
    }

    const result = await imagekit.deleteFile(fileId);
    return result;
  } catch (err) {
    throw new Error("Image delete failed: " + err.message);
  }
};

module.exports = { uploadFileToImageKit, deleteFileFromImageKit };
