// Standardized API response helpers

const success = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const error = (res, message = "Something went wrong", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const created = (res, data, message = "Created successfully") => {
  return success(res, data, message, 201);
};

const badRequest = (res, message = "Bad request") => {
  return error(res, message, 400);
};

const unauthorized = (res, message = "Unauthorized") => {
  return error(res, message, 401);
};

const forbidden = (res, message = "Forbidden") => {
  return error(res, message, 403);
};

const notFound = (res, message = "Not found") => {
  return error(res, message, 404);
};

module.exports = {
  success,
  error,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
};
