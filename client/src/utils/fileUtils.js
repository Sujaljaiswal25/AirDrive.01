export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getFileIcon = (mimeType) => {
  if (!mimeType) return "File";

  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Music";
  if (mimeType.includes("pdf")) return "FileText";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "FileText";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "Sheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "Presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("archive")
  )
    return "Archive";

  return "File";
};

export const getFileCategory = (mimeType) => {
  if (!mimeType) return "other";

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  )
    return "document";

  return "other";
};

export const truncateFileName = (name, maxLength = 30) => {
  if (name.length <= maxLength) return name;

  const extension = name.split(".").pop();
  const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
  const truncated =
    nameWithoutExt.substring(0, maxLength - extension.length - 4) + "...";

  return `${truncated}.${extension}`;
};

export const isImageFile = (mimeType) => {
  return mimeType && mimeType.startsWith("image/");
};

export const isVideoFile = (mimeType) => {
  return mimeType && mimeType.startsWith("video/");
};

export const isAudioFile = (mimeType) => {
  return mimeType && mimeType.startsWith("audio/");
};

export const isPdfFile = (mimeType) => {
  return mimeType && mimeType.includes("pdf");
};
