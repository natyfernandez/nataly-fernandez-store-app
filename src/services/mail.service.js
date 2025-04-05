import { createTransport } from "nodemailer";

import { CONFIG } from "../config/config.js";
import { EMAIL_TYPES } from "../common/constants/email-types.js";

class MailService {
  constructor() {
    this.transporter = createTransport({
      host: CONFIG.MAIL.HOST,
      port: CONFIG.MAIL.PORT,
      auth: {
        user: CONFIG.MAIL.USER,
        pass: CONFIG.MAIL.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Desactiva la verificación del certificado
      },
    });
  }

  async getMessageTemplate({ type, email }) {
    let message = `<h2> Hola, ${email}! </h2>`;
    switch (type) {
      // 👇 TIPOS DE EMAILS
      case EMAIL_TYPES.WELCOME:
        message += `
          <h3 style="color: darkblue">
            Bienvenido a nuestra App de Coder Eats!
          </h3>
          <br>
          Gracias por registrarte en nuestra app.
        `;
        break;
    }

    message += `
      <br>
      <img
        src="cid:logo"
        alt="Logo de Coder Eats"
        style="margin-top: 30px; width: 100px; height: 100px; object-fit: cover; border-radius: 50%;"
      />
      </body>
    `;

    return message;
  }
// 👇 A QUIEN VA ENVIADO - ASUNTO - CUERPO DEL MAIL
  async sendMail({ to, subject, type }) {
    try {
      const html = await this.getMessageTemplate({ type, email: to });

      // INFORMACION DEL ENVÍO DEL MAIL
      const info = await this.transporter.sendMail({
        from: CONFIG.MAIL.FROM,
        to,
        subject,
        html,

        // CARPETA PUBLIC ESTA FUERA DE SRC Y NO HACE FALTA COLOCAR ./src 👇
        attachments: [
          {
            filename: "beagle.jpg",
            path: "./public/beagle.jpg",
            // Content ID
            cid: "logo",
          },
        ],
      });

      console.log("Message sent: ", info.messageId);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}

export const mailService = new MailService();
