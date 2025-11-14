const Zone = require("../models/ZoneMongo");

// GET /depots/:id/zones
exports.get = async (req, res, next) => {
  try {
    const depotId = req.params.id;
    const doc = await Zone.findOne({ depot_id: depotId }).lean();
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Structure introuvable pour ce dépôt",
      });
    }
    res.json({ status: "ok", data: doc });
  } catch (e) {
    next(e);
  }
};

// POST /depots/:id/zones
exports.create = async (req, res, next) => {
  try {
    const depotId = req.params.id;
    const { structure } = req.body || {};

    if (!structure) {
      return res.status(400).json({
        status: "error",
        message: "structure est requise",
      });
    }

    const exists = await Zone.findOne({ depot_id: depotId }).lean();
    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "Structure déjà existante, utilisez PUT pour la mettre à jour",
      });
    }

    const doc = await Zone.create({ depot_id: depotId, structure });
    res.status(201).json({ status: "ok", data: doc });
  } catch (e) {
    next(e);
  }
};

// PUT /depots/:id/zones
exports.update = async (req, res, next) => {
  try {
    const depotId = req.params.id;
    const { structure } = req.body || {};

    if (!structure) {
      return res.status(400).json({
        status: "error",
        message: "structure est requise",
      });
    }

    const doc = await Zone.findOneAndUpdate(
      { depot_id: depotId },
      { structure },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Structure inexistante, utilisez POST d'abord",
      });
    }

    res.json({ status: "ok", data: doc });
  } catch (e) {
    next(e);
  }
};
