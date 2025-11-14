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

  // Table dépôts
  await p.query(`
    CREATE TABLE IF NOT EXISTS depots (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nom TEXT NOT NULL,
      adresse TEXT NOT NULL
    );
  `);
  // Table produits
  await p.query(`
    CREATE TABLE IF NOT EXISTS produits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nom TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
      depot_id UUID NOT NULL REFERENCES depots(id) ON DELETE CASCADE
    );
  `);
  // Table mouvements
  await p.query(`
    CREATE TABLE IF NOT EXISTS mouvements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL CHECK (type IN ('IN','OUT')),
      quantite INTEGER NOT NULL CHECK (quantite > 0),
      produit_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Table users
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin'))
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

/**
 * Applique un mouvement de stock transactionnellement.
 * - type: 'IN' ou 'OUT'
 * - quantite: > 0
 * - produitId: UUID du produit
 */
async function applyMovement({ produitId, type, quantite }) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");

    // Verrouille le produit
    const { rows: prodRows } = await client.query(
      `SELECT id, quantite FROM produits WHERE id = $1 FOR UPDATE`,
      [produitId]
    );

    if (prodRows.length === 0) {
      throw new Error("Produit introuvable");
    }

    const current = Number(prodRows[0].quantite);
    let newQty = current;

    if (type === "IN") {
      newQty = current + quantite;
    } else if (type === "OUT") {
      if (quantite > current) {
        throw new Error("Quantité OUT supérieure au stock disponible");
      }
      newQty = current - quantite;
    } else {
      throw new Error("Type de mouvement invalide (IN ou OUT attendu)");
    }

    await client.query(`UPDATE produits SET quantite = $1 WHERE id = $2`, [
      newQty,
      produitId,
    ]);

    const { rows: mov } = await client.query(
      `INSERT INTO mouvements (type, quantite, produit_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [type, quantite, produitId]
    );

    await client.query("COMMIT");

    return {
      mouvement: mov[0],
      stock: newQty,
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { getPool, connectPG, applyMovement };
