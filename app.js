const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

const user = require("./Routes/user.route");
const app = express();
const dotenv = require("dotenv");

dotenv.config();



// Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/", user);

const enviarMail = async (nombre, email, consulta) => {
    const config = {
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  
    const htmlBody = `
    <p><strong>Nueva consulta de usuario:</strong></p>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Consulta:</strong></p>
    <p>${consulta}</p>
  `;

  const mail = {
    from: "moonit.mail@gmail.com",
    to: process.env.TO_EMAIL,
    subject: "Nueva consulta de usuario",
    html: htmlBody,
  };
  
    const transporter = nodemailer.createTransport(config);
  
    const info = await transporter.sendMail(mail);
    console.log(info);
  };
  
  app.post("/enviar-consulta", (req, res) => {
    const { nombre, email, consulta } = req.body;
  
    enviarMail(nombre, email, consulta)
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Correo enviado con éxito' });
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
      res.status(500).json({ status: 'error', message: error.toString() });
    });
  });

module.exports = app;
