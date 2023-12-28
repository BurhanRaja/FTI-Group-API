require("dotenv").config();

module.exports = {
  jwtSecretKey: process.env.JSON_SECRET_KEY,
  emailHost: process.env.EMAIL_HOST,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailPort: process.env.EMAIL_PORT,
};
