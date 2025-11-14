# MediTrack Core — API Back-End (Node.js, Express, PostgreSQL, MongoDB)

Projet développé pour la gestion des dépôts hospitaliers : produits, mouvements de stock et cartographie interne des dépôts.

## Technologies utilisées
- Node.js / Express  
- PostgreSQL (dépôts, produits, mouvements)  
- MongoDB (zones internes des dépôts)  
- Mongoose  
- pg (node-postgres)  
- Architecture MVC  
- API REST JSON

---

# Installation

## 1. Installer les dépendances
```bash
npm install
```

## 2. Configurer les bases de données

### PostgreSQL
Créer la base :
```bash
createdb meditrack
```

Les tables sont créées automatiquement au lancement :
- `depots`
- `produits`
- `mouvements`

### MongoDB
Démarrer MongoDB (macOS) :
```bash
brew services start mongodb-community
```

La base `meditrack` sera créée automatiquement.

---

# 🔐 Fichier `.env`

Créer un fichier `.env` avec :

```
PORT=5050

# PostgreSQL
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=meditrack
PGUSER=postgres
PGPASSWORD=yourpassword

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/meditrack
```

---

# ▶ Lancement de l’API

```bash
npm start
```

L'API démarre sur :

```
http://127.0.0.1:5050
```

---

# Endpoints REST

## DEPOTS (PostgreSQL)
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | /depots               | Liste dépôts |
| POST   | /depots               | Créer dépôt |
| GET    | /depots/:id           | Obtenir un dépôt |

---

## PRODUITS (PostgreSQL)
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | /produits           | Liste produits |
| POST   | /produits           | Ajouter produit |
| PUT    | /produits/:id       | Modifier produit |
| DELETE | /produits/:id       | Supprimer produit |

---

## MOUVEMENTS (PostgreSQL, transactionnel)
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | /mouvements        | Liste mouvements |
| POST   | /mouvements        | Applique IN/OUT + MAJ stock |

---

## ZONES (MongoDB)
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | /depots/:id/zones | Récupère la structure interne |
| POST   | /depots/:id/zones | Crée la structure |
| PUT    | /depots/:id/zones | Met à jour la structure |

---

# Exemples de requêtes

## Ajouter un produit
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"nom":"Paracetamol","code":"P500","quantite":50,"depot_id":"UUID"}' \
http://127.0.0.1:5050/produits
```

## Mouvement IN
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"produit_id":"UUID","type":"IN","quantite":10}' \
http://127.0.0.1:5050/mouvements
```

## Zones d’un dépôt
```bash
curl http://127.0.0.1:5050/depots/UUID/zones
```

---

# Structure du projet

```
meditrack-core/
│── server.js
│── package.json
│── .env.example
│── src/
│   ├── db_pg.js              # PostgreSQL + migrations
│   ├── db_mongo.js           # Connexion MongoDB
│   ├── controllers/
│   │     ├── produitsController.js
│   │     ├── mouvementsController.js
│   │     └── zonesController.js
│   ├── models/
│   │     └── zoneMongo.js
│   └── routes/
│         ├── produitsRoutes.js
│         ├── mouvementsRoutes.js
│         └── zonesRoutes.js
```

---

# Fichier reponses.txt

Voir fichier `reponses.txt` inclus dans ce projet.

---

# commits_log.txt

Liste des commits anonymisés générée via :

```
git log --pretty=format:"%h - %s - %ad" > commits_log.txt
```

---
