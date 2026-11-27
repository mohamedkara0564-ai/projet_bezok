-- ═══════════════════════════════════════════════════════════
-- Script de création de la base de données — Groupe BEZOK RH
-- PostgreSQL 14+
-- ═══════════════════════════════════════════════════════════

-- Créer la base de données (à exécuter en tant que superutilisateur)
-- CREATE DATABASE bezok_db;

-- ── Table des utilisateurs RH ────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id           SERIAL PRIMARY KEY,
    nom          VARCHAR(100) NOT NULL,
    email        VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table des candidats ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidats (
    id               SERIAL PRIMARY KEY,
    nom_prenoms      VARCHAR(150) NOT NULL,
    telephone        VARCHAR(20)  NOT NULL,
    email            VARCHAR(150) UNIQUE NOT NULL,
    poste_recherche  VARCHAR(100) NOT NULL,
    niveau_etudes    VARCHAR(50)  NOT NULL,
    statut           VARCHAR(50)  NOT NULL DEFAULT 'candidature reçue',
    date_candidature TIMESTAMPTZ  DEFAULT NOW(),
    created_at       TIMESTAMPTZ  DEFAULT NOW(),

    CONSTRAINT statut_valide CHECK (statut IN (
        'candidature reçue',
        'présélectionné',
        'convoqué',
        'test effectué',
        'retenu',
        'non retenu'
    ))
);

-- ── Données fictives de démonstration ────────────────────────
-- Mot de passe : bezok123 (haché avec bcrypt, saltRounds=10)
INSERT INTO users (nom, email, mot_de_passe) VALUES (
    'Admin BEZOK',
    'admin@bezok.com',
    '$2b$10$eSdLFOAeTJouUuwnqZApEusL0.Oa3cMyCh5eCUx8gs591OH8isLKi'
) ON CONFLICT (email) DO NOTHING;

-- Candidats fictifs de démonstration
INSERT INTO candidats (nom_prenoms, telephone, email, poste_recherche, niveau_etudes, statut) VALUES
    ('Kouassi Jean-Marc',   '0102030405', 'jm.kouassi@example.com',   'Développeur web',      'Licence',  'candidature reçue'),
    ('Traoré Aminata',      '0506070809', 'a.traore@example.com',     'Assistante RH',        'BTS',      'présélectionné'),
    ('Koffi Serge',         '0701020304', 's.koffi@example.com',      'Conducteur de travaux','BTS',      'convoqué'),
    ('N''Guessan Marie',    '0102030406', 'm.nguessan@example.com',   'Comptable',            'Licence',  'test effectué'),
    ('Diallo Moussa',       '0708091011', 'd.moussa@example.com',     'Développeur web',      'Master',   'retenu'),
    ('Bamba Fatou',         '0203040507', 'f.bamba@example.com',      'Secrétaire',           'BEP',      'non retenu'),
    ('Yao Rodrigue',        '0506070810', 'r.yao@example.com',        'Conducteur de travaux','Licence',  'candidature reçue'),
    ('Coulibaly Awa',       '0901020304', 'a.coulibaly@example.com',  'Assistante RH',        'BTS',      'présélectionné')
ON CONFLICT (email) DO NOTHING;
