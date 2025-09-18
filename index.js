// index.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Oratio Backend is running!");
});

// Send email route
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Transporter (using your mail server)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. pl6.fakat.net
      port: process.env.SMTP_PORT, // usually 587
      secure: false, // use TLS, not SSL
      auth: {
        user: process.env.SMTP_USER, // noreply@oratio.ba
        pass: process.env.SMTP_PASS, // 77oratio77
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed certificates
      },
    });

    await transporter.sendMail({
      from: `"Oratio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    res.json({ success: true, message: "📧 Email sent successfully" });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
