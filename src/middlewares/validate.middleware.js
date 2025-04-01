import mongoose from 'mongoose';
import { validate as uuidValidate } from "uuid";

import { CONFIG } from "../config/config.js";
import { PERSISTENCE } from "../common/constants/persistence.js";

export function validate(dto) {
    return async (req, res, next) => {
        const { error } = dto.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message, body: req.body });
        }

        next();
    };
}

export function validateId(req, res, next) {
    const { cid, pid, id } = req.params;

    switch (CONFIG.PERSISTENCE) {
        case PERSISTENCE.MONGODB: {
            if (cid && !mongoose.isValidObjectId(cid)) {
                return res.status(400).json({ error: "ID de carrito (cid) inválido" });
            }
            if (pid && !mongoose.isValidObjectId(pid)) {
                return res.status(400).json({ error: "ID de producto (pid) inválido" });
            }
            if (id && !mongoose.isValidObjectId(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            break;
        }

        case PERSISTENCE.MEMORY: {
            if (cid && !uuidValidate(cid)) {
                return res.status(400).json({ error: "ID de carrito (cid) inválido" });
            }
            if (pid && !uuidValidate(pid)) {
                return res.status(400).json({ error: "ID de producto (pid) inválido" });
            }
            if (id && !uuidValidate(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            break;
        }

        default:
            return res.status(500).json({ error: "Error de configuración de persistencia" });
    }

    next();
}
