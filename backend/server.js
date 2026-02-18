require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Pesan Baru dari Website Kala Bersua",
      text: `
Nama: ${name}
Email: ${email}
Nomor WA: ${phone}

Pesan:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Pesan berhasil dikirim." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan." });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
