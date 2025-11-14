const { getPool, applyMovement } = require("../db_pg");

// GET /mouvements
exports.list = async (_req, res, next) => {
  try {
    const { rows } = await getPool().query(`
      SELECT m.id, m.type, m.quantite, m.produit_id, m.date,
             p.nom AS produit_nom, p.code
      FROM mouvements m
      JOIN produits p ON p.id = m.produit_id
      ORDER BY m.date DESC;
    `);
    res.json({ status: "ok", data: rows });
  } catch (e) {
    next(e);
  }
};

// POST /mouvements
exports.create = async (req, res, next) => {
  try {
    const { produit_id, type, quantite } = req.body || {};

    if (!produit_id || !type || typeof quantite !== "number") {
      return res.status(400).json({
        status: "error",
        message: "produit_id, type et quantite sont requis",
      });
    }

    if (!["IN", "OUT"].includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "type doit être IN ou OUT",
      });
    }

    if (quantite <= 0) {
      return res.status(400).json({
        status: "error",
        message: "quantite doit être > 0",
      });
    }

    const result = await applyMovement({
      produitId: produit_id,
      type,
      quantite,
    });

    res.status(201).json({
      status: "ok",
      data: result,
    });
  } catch (e) {
    // Erreur métier (ex: OUT > stock)
    if (e.message && e.message.includes("Quantité OUT")) {
      return res.status(400).json({
        status: "error",
        message: e.message,
      });
    }
    next(e);
  }
};
