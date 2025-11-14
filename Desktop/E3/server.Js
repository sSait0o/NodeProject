// ...existing code...
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectPG } = require("./src/db_pg");
const { connectMongo } = require("./src/db_mongo");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const produitsRoutes = require("./src/routes/produitsRoutes");
const mouvementsRoutes = require("./src/routes/mouvementsRoutes");
const zonesRoutes = require("./src/routes/zonesRoutes");
const authRoutes = require("./src/routes/authRoutes");
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

const app = express();

// config CORS (une seule fois)
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
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

async function startServer() {
  try {
    // Connexions DB uniquement quand on démarre réellement le serveur
    await connectPG();
    await connectMongo();

    const PORT = process.env.PORT || 5050;
    return app.listen(PORT, () =>
      console.log(`Server running on http://127.0.0.1:${PORT}`)
    );
  } catch (err) {
    console.error("Impossible de démarrer le serveur :", err);
    process.exit(1);
  }
}

// si le fichier est exécuté directement (node server.js), démarrer le serveur
if (require.main === module) {
  startServer();
}

// exporter l'app pour les tests et la fonction de démarrage
module.exports = { app, startServer };
