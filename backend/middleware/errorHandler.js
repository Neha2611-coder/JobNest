export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message || "Server error";

  if (error.name === "CastError") {
    status = 404;
    message = "Resource not found";
  }
  if (error.code === 11000) {
    status = 409;
    message = "A record with that value already exists";
  }
  if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors).map((item) => item.message).join(". ");
  }

  res.status(status).json({ message });
}
