CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  adresse TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  depot_id UUID NOT NULL REFERENCES depots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mouvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('IN','OUT')),
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  produit_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin'))
);
