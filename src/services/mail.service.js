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
        rejectUnauthorized: false,
      },
    });
  }

  async getMessageTemplate({ type, email, resetLink }) {
    let message = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Luxwel</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 0; margin: 0;">
        <!-- HEADER CON LOGO -->
        <div style="background-color: #111111; padding: 20px; text-align: center;">
          <img src="cid:logo" alt="Logo de Luxwel" style="width: 120px; height: auto;" />
        </div>

        <!-- CONTENIDO PRINCIPAL -->
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center;">
    `;

    // Lógica para el tipo de correo
    switch (type) {
      case EMAIL_TYPES.WELCOME:
        message += `
          <h2 style="color: #333;">Hola, ${email}!</h2>
          <h3 style="color: darkblue;">¡Bienvenido a Luxwel!</h3>
          <p style="color: #555;">Gracias por registrarte en nuestra tienda.</p>
        `;
        break;
      
      case EMAIL_TYPES.RESTORE_PASSWORD:
        message += `
          <h2 style="color: #333;">Hola, ${email}!</h2>
          <h3 style="color: darkblue;">Se ha solicitado restaurar su contraseña</h3>
          <button><a href="${resetLink}">Haz clic aquí para cambiar tu contraseña</a></button>
          <p style="color: #555;">Este enlace expirará en 1 hora, si no solicitó la restauración ignore el mail.</p>
        `;
        break;
    }

    message += `
        </div>
      </body>
    </html>
    `;

    return message;
  }
  
  // 👇 A QUIEN VA ENVIADO - ASUNTO - CUERPO DEL MAIL
  async sendMail({ to, subject, type, resetLink }) {
    try {
      const html = await this.getMessageTemplate({ type, email: to, resetLink });

      // INFORMACION DEL ENVÍO DEL MAIL
      const info = await this.transporter.sendMail({
        from: CONFIG.MAIL.FROM,
        to,
        subject,
        html,

        // CARPETA PUBLIC ESTA FUERA DE SRC Y NO HACE FALTA COLOCAR ./src 👇
        attachments: [
          {
            filename: "logo.svg",
            path: "./public/assets/images/logo.svg",
            cid: "logo",
          },
        ],
      });

      console.log("Message sent: ", info.messageId);
    } catch (error) {
      console.log("Error sending email: ", error);
    }
  }
}

export const mailService = new MailService();
