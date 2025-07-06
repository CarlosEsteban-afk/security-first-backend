const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.decode(token); // También puedes validar con Cognito si prefieres
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error al decodificar el token:", err);
    res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = { authenticate };
