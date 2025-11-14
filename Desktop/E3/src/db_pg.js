const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });
  }
  return pool;
}

async function migrate(p) {
  await p.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).catch(() => {});

  await p.query(`
    CREATE TABLE IF NOT EXISTS depots (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nom TEXT NOT NULL,
      adresse TEXT NOT NULL
    );
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS produits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nom TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
      depot_id UUID NOT NULL REFERENCES depots(id) ON DELETE CASCADE
    );
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS mouvements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL CHECK (type IN ('IN','OUT')),
      quantite INTEGER NOT NULL CHECK (quantite > 0),
      produit_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function connectPG() {
  const p = getPool();
  await p.connect();
  await migrate(p);
  console.log("PostgreSQL connecté + migrations OK");
  return p;
}

module.exports = { getPool, connectPG };
