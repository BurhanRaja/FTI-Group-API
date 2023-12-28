const nodemailer = require("nodemailer");
const {
  emailHost,
  emailPassword,
  emailPort,
  emailUsername,
} = require("../config/config");

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false,
  auth: {
    user: emailUsername,
    pass: emailPassword,
  },
});

module.exports = transporter;
