const { getPool } = require("../db_pg");

// GET /produits
exports.list = async (_req, res, next) => {
  try {
    const { rows } = await getPool().query(`
      SELECT p.id, p.nom, p.code, p.quantite, p.depot_id, d.nom AS depot_nom
      FROM produits p 
      JOIN depots d ON d.id = p.depot_id
      ORDER BY p.nom ASC;
    `);
    res.json({ status: "ok", data: rows });
  } catch (e) {
    next(e);
  }
};

// POST /produits
exports.create = async (req, res, next) => {
  try {
    const { nom, code, quantite = 0, depot_id } = req.body;

    if (!nom || !code || !depot_id) {
      return res.status(400).json({
        status: "error",
        message: "nom, code et depot_id sont requis",
      });
    }

    if (quantite < 0) {
      return res.status(400).json({
        status: "error",
        message: "quantite doit être >= 0",
      });
    }

    const { rows } = await getPool().query(
      `INSERT INTO produits (nom, code, quantite, depot_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nom, code, quantite, depot_id]
    );

    res.status(201).json({ status: "ok", data: rows[0] });
  } catch (e) {
    next(e);
  }
};

// PUT /produits/:id
exports.update = async (req, res, next) => {
  try {
    const { nom, code, quantite, depot_id } = req.body;

    const fields = [];
    const values = [];
    let i = 1;

    const push = (col, val) => {
      fields.push(`${col} = $${i++}`);
      values.push(val);
    };

    if (nom !== undefined) push("nom", nom);
    if (code !== undefined) push("code", code);
    if (quantite !== undefined) {
      if (quantite < 0)
        return res.status(400).json({
          status: "error",
          message: "quantite doit être >=0",
        });
      push("quantite", quantite);
    }
    if (depot_id !== undefined) push("depot_id", depot_id);

    if (fields.length === 0) {
      return res.json({
        status: "ok",
        message: "Aucune modification",
      });
    }

    values.push(req.params.id);

    const { rows } = await getPool().query(
      `UPDATE produits SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );

    if (!rows[0])
      return res
        .status(404)
        .json({ status: "error", message: "Produit introuvable" });

    res.json({ status: "ok", data: rows[0] });
  } catch (e) {
    next(e);
  }
};

// DELETE /produits/:id
exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await getPool().query(
      `DELETE FROM produits WHERE id = $1`,
      [req.params.id]
    );

    if (rowCount === 0)
      return res
        .status(404)
        .json({ status: "error", message: "Produit introuvable" });

    res.json({ status: "ok", message: "Produit supprimé" });
  } catch (e) {
    next(e);
  }
};
