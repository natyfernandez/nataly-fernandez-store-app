import jwt from "jsonwebtoken";

export function generateToken(payload) {
    // "jwt.sign" crea un token JWT firmado
    // "payload" Los datos que deseas incluir en el token.
    // JWT_SECRET: Una clave secreta utilizada para firmar el token y garantizar su integridad.
    // ({ expiresIn: "2m" }): Configuración adicional, como el tiempo de expiración del token, 2 minutos.
    // ⛔ Payload no debe incluir información sensible como contraseñas, ya que el token puede ser decodificado por cualquier persona

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15s' });
    return token;
}

// 👆 El token resultante es una cadena codificada en tres partes separadas por puntos, header.payload.signature
// SI Hay tiempo ver DL react jwt

export function verifyToken(token) {
    try {
        // 👇 jwt.verify para asegurarte de que es válido el token
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`⛔ : ${error}`);
    }
}

// Middleware para validar el token
export function authenticate(req, res, next) {
    const token =
        req.headers.authorization.split(" ")[1] || // [1] Accede al segundo elemento del array (índice 1), que es el token
        // split= Divide el valor de la cabecera en un array de cadenas utilizando el espacio
        req.headers["authorization"].split(" ")[1];

    try {
        const decoded = verifyToken(token);

        // Validación de que el usuario exista

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error: "Token inválido",
        });
    }
}
