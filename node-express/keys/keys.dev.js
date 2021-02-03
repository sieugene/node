require("dotenv").config();

module.exports = {
  MONGODB_URI: process.env.APP_MONGO_URI,
  SESSION_SECRET: "some secret value",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  BASE_URL: "http://localhost:3000",
};
