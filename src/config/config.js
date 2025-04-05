import { config } from 'dotenv';

config();

export const CONFIG = {

    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE || PERSISTENCE.MEMORY,
    MAIL: {
        USER: process.env.NODEMAILER_USER,
        PASSWORD: process.env.NODEMAILER_PASSWORD,
        HOST: process.env.NODEMAILER_HOST,
        PORT: process.env.NODEMAILER_PORT,
        FROM: process.env.NODEMAILER_FROM,
    },
    SMS: {
        ACCOUNT_SID: process.env.TWILIO_SID,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    },

}