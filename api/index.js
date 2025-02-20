const express = require("express");
const app = express(); // Instanciation d'Express déplacée ici
const Book = require("./models/book");
const User = require("./models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware de protection des routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès non autorisé" });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide" });
  }
};

// Endpoints pour les livres
app.get("/books", authenticate, async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SPECIFIC
app.get("/books/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.getBookById(req.params.id);
    book
      ? res.status(200).json(book)
      : res.status(404).json({ message: "Pas trouvé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST BOOK
app.post("/books", authenticate, async (req, res) => {
  try {
    const newBook = await Book.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT BOOK
app.put("/books/:id", authenticate, async (req, res) => {
  try {
    const updatedBook = await Book.updateBook(req.params.id, req.body);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE BOOK
app.delete("/books/:id", authenticate, async (req, res) => {
  try {
    await Book.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE : Inscription
app.post("/register", async (req, res) => {
  try {
    const { email, password, full_name, birth_date } = req.body;
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    const user = await User.createUser({
      email,
      password,
      full_name,
      birth_date,
    });
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: error.message });
  }
});

// ROUTE : Connexion
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
