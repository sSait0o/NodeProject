const { connectPG } = require("./src/db_pg");
const { connectMongo } = require("./src/db_mongo");

const produitsRoutes = require("./src/routes/produitsRoutes");
const mouvementsRoutes = require("./src/routes/mouvementsRoutes");
const zonesRoutes = require("./src/routes/zonesRoutes");
const authRoutes = require("./src/routes/authRoutes");

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({
    name: "MediTrack Core",
    status: "ok",
  });
});

app.use("/produits", produitsRoutes);
app.use("/mouvements", mouvementsRoutes);
app.use("/depots/:id/zones", zonesRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5050;
(async () => {
  await connectPG(); // PostgreSQL : dépôts/produits/mouvements
  await connectMongo(); // MongoDB : zones

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () =>
    console.log(`Server running on http://127.0.0.1:${PORT}`)
  );
})();
