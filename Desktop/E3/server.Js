const { connectPG } = require("./src/db_pg");
const { connectMongo } = require("./src/db_mongo");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const produitsRoutes = require("./src/routes/produitsRoutes");
const mouvementsRoutes = require("./src/routes/mouvementsRoutes");
const zonesRoutes = require("./src/routes/zonesRoutes");
const authRoutes = require("./src/routes/authRoutes");
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Front autorisé
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gestion des erreurs JSON invalides
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ status: "error", message: "JSON invalide" });
  }
  next(err);
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Erreur interne",
  });
});

const PORT = process.env.PORT || 5050;
(async () => {
  await connectPG(); // PostgreSQL : dépôts/produits/mouvements
  await connectMongo(); // MongoDB : zones

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () =>
    console.log(`Server running on http://127.0.0.1:${PORT}`)
  );
})();
