const { connectPG } = require("./src/db_pg");
const produitsRoutes = require("./src/routes/produitsRoutes");
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

const PORT = process.env.PORT || 5050;
(async () => {
  await connectPG();
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () =>
    console.log(`Server running on http://127.0.0.1:${PORT}`)
  );
})();
