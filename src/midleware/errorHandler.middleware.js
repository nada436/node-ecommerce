export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};


