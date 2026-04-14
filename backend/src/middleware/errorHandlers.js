export const notFoundHandler = (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }

  next();
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (error.name === "MulterError" ? 400 : 500);
  const message =
    error.code === "LIMIT_FILE_SIZE"
      ? "Uploaded file is too large."
      : error.message || "Something went wrong.";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
  });
};
