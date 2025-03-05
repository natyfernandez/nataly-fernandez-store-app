import multer from "multer";
import path from 'path';
import { __dirname } from '../dirname.js';
import { timeEnd } from "console";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.split("/")[0] !== "image") {
            return cb(new Error("Solo se aceptan imágenes"));
        }
    
        cb(null, path.resolve(__dirname, "../public/assets/images"));
    },
    filename: function (req, file, cb) {
        const { title } = req.body;
    
        if (!title) return cb("El campo title es requerido");
    
        const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    
        cb(null, 
            `${sanitizedTitle}.${
                file.mimetype.split("/")[1]
            }`
        );
    },    
});

export const uploader = multer({ storage });