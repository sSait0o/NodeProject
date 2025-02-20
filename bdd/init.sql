-- Suppression des tables existantes avec CASCADE
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS watchlists CASCADE;
DROP TABLE IF EXISTS watch_history CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Création des tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) DEFAULT 'active', -- Remplacé ENUM par VARCHAR
    role VARCHAR(10) DEFAULT 'user' -- Remplacé ENUM par VARCHAR
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT,
    amount DECIMAL(6,2),
    payment_date TIMESTAMP,
    status VARCHAR(10), -- Remplacé ENUM par VARCHAR
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INT,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    last_active TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT,
    amount DECIMAL(6,2),
    payment_date TIMESTAMP,
    status VARCHAR(10), -- Remplacé ENUM par VARCHAR
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    user_id INT,
    genre_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    description TEXT,
    release_year INTEGER, -- Remplacé YEAR par INTEGER
    last_active TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    release_year INTEGER, -- Remplacé YEAR par INTEGER
    rating DECIMAL(2,1),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    series_id INT,
    season INTEGER,
    episode INTEGER,
    title VARCHAR(255),
    duration INTEGER,
    release_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

CREATE TABLE watch_history (
    id SERIAL PRIMARY KEY,
    profile_id INT,
    content_id INT,
    watched_at TIMESTAMP,
    progress INTEGER,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    profile_id INT,
    content_id INT,
    added_at TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT,
    plan VARCHAR(50),
    price DECIMAL(6,2),
    status VARCHAR(10), -- Remplacé ENUM par VARCHAR
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT,
    message TEXT,
    status VARCHAR(10), -- Remplacé ENUM par VARCHAR
    sent_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données exemple
INSERT INTO users (email, password) VALUES
('admin@example.com', 'password123'), -- Remplace par les mots de passe cryptés si nécessaire
('user@example.com', 'password123');

-- Insérer les autres données de test dans les tables nécessaires
