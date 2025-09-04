require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL, // your email
    pass: process.env.PASS,   // App password from Gmail
  },
});

module.exports = transporter; 
