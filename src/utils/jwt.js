import jwt from "jsonwebtoken";

export function generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`⛔ : ${error}`);
    }
}

export function authenticate(req, res, next) {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({
            error: "Token no proporcionado",
        });
    }

    try {
        const decoded = verifyToken(token);

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error: "Token inválido",
        });
    }
}
