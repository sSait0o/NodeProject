const mongoose = require("mongoose");

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn(
      "MONGODB_URI non défini : la partie zones (Mongo) ne sera pas disponible."
    );
    return null;
  }

  await mongoose.connect(uri, { autoIndex: true });
  console.log("MongoDB connecté");
  return mongoose.connection;
}

module.exports = { connectMongo };
