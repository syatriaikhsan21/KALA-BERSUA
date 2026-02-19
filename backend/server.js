require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* -------------------------
   FORM KONTAK (MAP SECTION)
---------------------------*/
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Pesan Baru dari Website Kala Bersua",
      text: `
Nama  : ${name}
Email : ${email || "-"}
WA    : ${phone}

Pesan:
${message}
      `,
    });

    res.status(200).json({ message: "Pesan berhasil dikirim." });
  } catch (error) {
    console.error("ERROR CONTACT:", error);
    res.status(500).json({ message: "Terjadi kesalahan." });
  }
});

/* -------------------------
       FORM RESERVASI
---------------------------*/
app.post("/api/booking", async (req, res) => {
  const { name, phone, email, date, time, guests, notes, menu } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Reservasi Baru - Kala Bersua",
      text: `
Reservasi Baru Dari Website

Nama          : ${name}
Nomor WA      : ${phone}
Email         : ${email || "-"}

Tanggal       : ${date}
Jam           : ${time}
Jumlah Orang  : ${guests}

Menu Dipesan  : ${menu.length > 0 ? menu.join(", ") : "-"}

Catatan :
${notes || "-"}

Terkirim otomatis dari sistem reservasi website Kala Bersua.
      `,
    });

    res.json({ message: "Reservasi berhasil dikirim!" });
  } catch (err) {
    console.error("ERROR BOOKING:", err);
    res.status(500).json({ message: "Gagal mengirim reservasi." });
  }
});

/* -------------------------
            SERVER
---------------------------*/
app.get("/", (req, res) => {
  res.send("Backend aktif.");
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
