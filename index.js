const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ── Nodemailer transporter ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── POST /api/contact ──
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address." });

  try {
    // To Mary
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: "ayebazibwemaryprecious@gmail.com",
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#06080f;color:#e8eaf0;padding:40px;border-radius:12px">
          <h2 style="color:#6c63ff;font-size:1.4rem;margin-bottom:24px">New message from your portfolio 🎉</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8891aa;font-size:0.8rem;width:80px">FROM</td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#8891aa;font-size:0.8rem">EMAIL</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#6c63ff">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8891aa;font-size:0.8rem">SUBJECT</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <div style="margin-top:24px;padding:20px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #6c63ff">
            <p style="color:#8891aa;font-size:0.78rem;margin-bottom:8px">MESSAGE</p>
            <p style="line-height:1.8;white-space:pre-wrap;color:#e8eaf0">${message}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply
    await transporter.sendMail({
      from: `"Mary Precious Ayebazibwe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Got your message! — Re: ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#06080f;color:#e8eaf0;padding:40px;border-radius:12px">
          <h2 style="color:#6c63ff">Hey ${name}, thanks for reaching out! 👋</h2>
          <p style="color:#8891aa;line-height:1.8;margin-top:16px">I've received your message and will get back to you within 24 hours.</p>
          <p style="color:#8891aa;line-height:1.8">Looking forward to connecting!</p>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(108,99,255,0.2)">
            <strong style="color:#e8eaf0">Mary Precious Ayebazibwe</strong><br>
            <span style="color:#6c63ff;font-size:0.85rem">Backend Software Engineer · Kampala, Uganda</span>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send. Please email directly.",
      });
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html")),
);

app.listen(PORT, () =>
  console.log(`\n  ◆ Portfolio → http://localhost:${PORT}\n`),
);
