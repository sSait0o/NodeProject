const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema(
  {
    depot_id: { type: String, required: true }, // UUID du dépôt (Postgres)
    structure: {
      type: Object,
      required: true,
      /*
      Exemple:
      {
        zones: [
          { name: "A", bins: ["A1","A2","A3"] },
          { name: "B", bins: ["B1","B2"] }
        ]
      }
      */
    },
  },
  { timestamps: true }
);

// 1 document par dépôt
ZoneSchema.index({ depot_id: 1 }, { unique: true });

module.exports = mongoose.model("Zone", ZoneSchema);
