const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPool } = require("../db_pg");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { username, password, role = "user" } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "username et password sont requis",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "role doit être 'user' ou 'admin'",
      });
    }

    const pool = getPool();

    // vérifier si username existe déjà
    const existing = await pool.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Nom d'utilisateur déjà utilisé",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role`,
      [username, hash, role]
    );

    const user = rows[0];

    // génération JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: "ok",
      data: {
        user,
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "username et password sont requis",
      });
    }

    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, username, password, role FROM users WHERE username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Utilisateur ou mot de passe invalide",
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        status: "error",
        message: "Utilisateur ou mot de passe invalide",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ne pas renvoyer le hash de password
    delete user.password;

    res.json({
      status: "ok",
      data: {
        user,
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};
