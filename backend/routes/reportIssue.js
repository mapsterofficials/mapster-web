import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { description, name, email } = req.body;
  if (!description || !name || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REPORT_EMAIL_USER,
        pass: process.env.REPORT_EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.REPORT_EMAIL_USER,
      to: process.env.REPORT_EMAIL_TO || process.env.REPORT_EMAIL_USER,
      subject: "New Issue Reported",
      text: `Name: ${name}\nEmail: ${email}\n\nIssue:\n${description}`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "Report sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send report", error: err.message });
  }
});

export default router;
