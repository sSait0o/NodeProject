const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Token manquant ou invalide",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload contient { id, username, role, iat, exp }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      status: "error",
      message: "Token invalide ou expiré",
    });
  }
}

module.exports = authMiddleware;
