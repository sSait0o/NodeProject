# MediTrack Core — API Back-End (Node.js, Express, PostgreSQL, MongoDB)

Projet développé pour la gestion des dépôts hospitaliers :  
- produits  
- mouvements de stock  
- cartographie interne (MongoDB)  
- authentification & rôles (E4)  
- documentation Swagger  
- sécurisation & tests automatiques  

---

# 🚀 Technologies utilisées
### Back-end
- Node.js / Express  
- Architecture MVC  
- JWT (authentification, E4)  
- CORS, Rate Limiting, Validation  
- Swagger / OpenAPI  
- Tests automatisés (Jest)

### Bases de données
- PostgreSQL (dépôts, produits, mouvements, utilisateurs)  
- MongoDB + Mongoose (zones internes des dépôts)

---

# 📦 Installation

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
- `users`
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

# JWT (E4)
JWT_SECRET=supersecretkey
JWT_EXPIRES=1h

---

# Lancement de l’API

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
# 🔐 E4 — Authentification & Sécurité

Ce module gère l’inscription, la connexion et la génération de JWT pour l’accès sécurisé à l’API.

---

## Table `users`

Table utilisée pour stocker les informations des utilisateurs.

| Colonne   | Type   | Contraintes                | Description                     |
|----------|--------|----------------------------|---------------------------------|
| `id`     | UUID   | PRIMARY KEY                | Identifiant unique de l’utilisateur |
| `username` | string | UNIQUE, NOT NULL         | Nom d’utilisateur               |
| `password` | string | NOT NULL                 | Mot de passe **hashé**          |
| `role`   | string | DEFAULT `user`, NOT NULL   | Rôle : `user` ou `admin`        |


---

# 🔐 E4 — Authentification, Sécurité & Tests  
Documentation complète du projet **Meditrack Core**

---

# 📦 Middlewares (E4)

## 🔑 `authMiddleware`
Vérifie la présence et la validité du **JWT** dans le header `Authorization`.

Usage :
- Protéger les routes privées
- Détecter les tokens expirés
- Injecter `req.user` avec les infos du token

---

## 🛂 `isAdmin`
Vérifie si l’utilisateur possède le rôle `admin`.

Bloque l’accès aux routes sensibles :
- gestion avancée des produits
- exports
- suppression définitive

---

## 🛡️ Rate Limiting
Bloque les abus et protège l'API contre :
- attaques par force brute
- flood de requêtes

Exemple :
- Max 100 requêtes / 15 minutes par IP

---

## ✔️ Validation automatique des inputs
Chaque route valide les données entrantes :
- format
- type
- champs obligatoires

Via des schémas (ex : joi, zod ou middleware maison).

---

# 📘 Documentation Swagger

URL documentation interactive :  
👉 **http://127.0.0.1:5050/docs**

Swagger documente :

- 🔐 Auth  
- 📦 Produits  
- 🔄 Mouvements  
- 🏬 Dépôts  
- 🗂️ Zones  

Le fichier source est disponible dans :  
`src/docs/swagger.yaml`

---

# 🧪 Tests automatisés

## 🧩 Tests unitaires (Jest)

Pour exécuter tous les tests :

```bash
npm install
```
## Tests inclus :

- logique métiers (produits)

- logique mouvements IN/OUT

- sécurité (hash mot de passe)

---

## Tests d’intégration (Postman)

Dossier : tests/postman_collection.json

# Test 1 — Ajout de produit

Login

POST /produits

GET /produits

Captures dans : tests/captures/

---

# ⚡ Test de charge (JMeter)

Un test de charge a été réalisé pour mesurer les performances et la stabilité de l’API sous forte sollicitation.

Le fichier du scénario est disponible ici :  
📁 `tests/Summary Report.jmx`

---

## 🚀 Scénario exécuté

```bash
300 utilisateurs virtuels
10 requêtes chacun
Endpoint : GET /produits
```

# Structure du projet

```
meditrack-core/
│── server.js
│── package.json
│── .env.example
│── .gitignore
│
│── src/
│   ├── db_pg.js
│   ├── db_mongo.js
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   └── docs/
│       └── swagger.yaml
│
│── tests/
│   ├── postman_collection.json
│   ├── load_test.jmx
│   └── captures/
│
└── exports/
    ├── db_export_postgres.sql
    └── mongo_dump/

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
