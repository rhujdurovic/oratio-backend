// index.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Endpoint for absence reporting
app.post("/send-absence", async (req, res) => {
  try {
    const { email, date, time, project, reason } = req.body;

    const admins = (process.env.ADMIN_EMAILS || "").split(",");
    const subject = `Absence Notification: ${email}`;
    const text = `
Absence Report:

Employee: ${email}
Date: ${date}
Time: ${time}
Project: ${project}
Reason: ${reason}
    `;

    await transporter.
