import dotenv from "dotenv";

dotenv.config();

const config = {
  DB_ADDRESS: process.env.DB_ADDRESS || "mongodb://localhost:27017/mydatabase",
  PORT: process.env.PORT || 3000,
  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY || "",
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY || "",
  AUTH_REFRESH_TOKEN_EXPIRY: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
  AUTH_ACCESS_TOKEN_EXPIRY: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
  UPLOAD_DIR: process.env.UPLOAD_DIR || "/uploads",
  PUBLIC_IMAGES_DIR: process.env.PUBLIC_IMAGES_DIR || "/public/images"
};

export default config;
