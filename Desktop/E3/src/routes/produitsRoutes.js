const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/produitsController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const { body } = require("express-validator");
const { validationResult } = require("express-validator");

// 🔎 VALIDATION POUR CREATION & MODIFICATION
const validateProduit = [
  body("nom").notEmpty().withMessage("Le nom est requis"),
  body("code").notEmpty().withMessage("Le code est requis"),
  body("quantite").isInt({ min: 0 }).withMessage("La quantité doit être >= 0"),
  body("depot_id").notEmpty().withMessage("depot_id est requis"),
];

// GET /produits → libre
router.get("/", ctrl.list);

// POST /produits → auth + validation
router.post("/", auth, validateProduit, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }
  ctrl.create(req, res, next);
});

// PUT /produits/:id → auth + validation
router.put("/:id", auth, validateProduit, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }
  ctrl.update(req, res, next);
});

// DELETE /produits/:id → admin
router.delete("/:id", auth, isAdmin, ctrl.remove);

module.exports = router;
