import winston, { format } from "winston";
import expressWinston from "express-winston";

export const requestLogger = expressWinston.logger({
  level: "info",
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
});

export const errorLogger = expressWinston.errorLogger({
  level: "error",
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
});
