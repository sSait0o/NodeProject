function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Accès réservé aux administrateurs",
    });
  }
  next();
}

module.exports = isAdmin;
