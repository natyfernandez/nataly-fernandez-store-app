import { config } from 'dotenv';

config();

export const CONFIG = {

    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE || PERSISTENCE.MEMORY,
    MAIL: {
        FROM: process.env.NODEMAILER_FROM,
        USER: process.env.NODEMAILER_USER,
        HOST: process.env.NODEMAILER_HOST,
        PORT: process.env.NODEMAILER_PORT || 587,
        PASSWORD: process.env.NODEMAILER_PASSWORD,
    }
}