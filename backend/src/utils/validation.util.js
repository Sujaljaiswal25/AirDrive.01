// Common validation helpers

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

const isOwner = (resource, userId) => {
  return resource.owner.toString() === userId.toString();
};

const sanitizeFileName = (filename) => {
  return filename.trim();
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isOwner,
  sanitizeFileName,
};
