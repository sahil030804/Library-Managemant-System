import errorCodes from "../../errorCodes.js";

const errorHandler = (err, req, res, next) => {
  const errorNames = Object.keys(errorCodes);

  const error = err.message;

  const errorMatch = errorNames.includes(error);

  if (err.name === "ValidationError") {
    res.status(400).json({
      code: "DB_ERROR",
      message: err.message,
    });
  }

  if (errorMatch) {
    const status = errorCodes[error].httpStatusCode;
    const code = errorCodes[error].body.code;
    const message = errorCodes[error].body.message;

    res.status(status).json({
      code: code,
      message: message,
    });
  } else {
    res.status(500).json({
      code: err.code || "server_crashed",
      message: err.message || "Server crashed",
    });
  }
};

export default errorHandler;
