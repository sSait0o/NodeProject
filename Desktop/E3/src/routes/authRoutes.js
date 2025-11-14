const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validationResult } = require("express-validator");
const { registerValidator } = require("../validators/authValidator");

router.post("/register", registerValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }
  authController.register(req, res, next);
});

// POST /auth/login
router.post("/login", authController.login);

module.exports = router;
