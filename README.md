# Application de Gestion des Candidatures — Groupe BEZOK BTP

Application web interne développée dans le cadre du test pratique **INFO-02** du service RH du Groupe BEZOK BTP SARL.

---

## Identifiants de démonstration

> Ces identifiants sont **fictifs**, créés uniquement pour la démonstration.

| Champ | Valeur |
|-------|--------|
| Email | `admin@bezok.com` |
| Mot de passe | `bezok123` |

---

## Instructions d'installation et de lancement

### Prérequis

- [Node.js](https://nodejs.org) version 18 ou supérieure
- [PostgreSQL](https://www.postgresql.org) version 14 ou supérieure
- Un terminal (PowerShell, cmd, bash)

---

### Étape 1 — Créer la base de données

Ouvrir **pgAdmin** ou **psql** et exécuter :

```sql
CREATE DATABASE bezok_db;
```

Ensuite exécuter le script de création des tables et des données de démonstration :

```
Ouvrir le fichier : database/schema.sql
Exécuter dans pgAdmin (clic droit sur bezok_db → Query Tool → ouvrir le fichier → Exécuter)
```

---

### Étape 2 — Configurer le backend

Aller dans le dossier `backend/` et copier le fichier `.env.example` en `.env` :

```bash
cd backend
copy .env.example .env
```

Ouvrir `.env` et renseigner les informations de connexion PostgreSQL :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bezok_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRES
JWT_SECRET=bezok_btp_secret_2026
```

---

### Étape 3 — Installer les dépendances et lancer le backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur **http://localhost:5000**  
Message attendu : `Serveur lancé sur le port 5000`

---

### Étape 4 — Installer les dépendances et lancer le frontend

Ouvrir un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

---

### Étape 5 — Accéder à l'application

Ouvrir le navigateur et aller sur :

```
http://localhost:5173
```

Se connecter avec les identifiants de démonstration :
- Email : `admin@bezok.com`
- Mot de passe : `bezok123`

---

## Structure du projet

```
Groupe BEZOK/
├── backend/                  ← API REST Node.js + Express
│   ├── config/db.js          ← Connexion PostgreSQL
│   ├── middlewares/auth.js   ← Vérification token JWT
│   ├── routes/auth.js        ← Inscription et connexion
│   ├── server.js             ← Serveur principal + toutes les routes
│   ├── .env                  ← Variables d'environnement (non versionné)
│   └── .env.example          ← Modèle du fichier .env
├── frontend/                 ← Interface React + TypeScript
│   └── src/
│       ├── context/          ← Contexte d'authentification global
│       ├── services/         ← Appels HTTP vers l'API
│       ├── components/       ← Composants réutilisables
│       ├── pages/            ← Pages de l'application
│       └── types/            ← Types TypeScript
├── database/
│   └── schema.sql            ← Script SQL de création des tables
├── README.md                 ← Ce fichier
├── DOCUMENTATION_BACKEND.md  ← Documentation du backend
├── DOCUMENTATION_FRONTEND.md ← Documentation du frontend
└── LIVRABLE.md               ← Présentation et déclaration IA
```

---

## Technologies utilisées

### Backend
| Technologie | Rôle |
|-------------|------|
| Node.js 18+ | Environnement d'exécution JavaScript |
| Express 5 | Framework API REST |
| PostgreSQL 14+ | Base de données relationnelle |
| bcryptjs | Hachage sécurisé des mots de passe |
| jsonwebtoken | Authentification par token JWT |
| dotenv | Variables d'environnement |

### Frontend
| Technologie | Rôle |
|-------------|------|
| React 19 | Interface utilisateur |
| TypeScript | Typage statique |
| Vite | Bundler et serveur de développement |
| react-router-dom | Navigation entre pages |

---

## Fonctionnalités réalisées

- ✅ **Module 1** — Authentification : connexion, JWT, protection des routes, déconnexion, inscription
- ✅ **Module 2** — Enregistrement des candidats avec validation complète
- ✅ **Module 3** — Gestion : liste, consultation, modification, suppression avec confirmation
- ✅ **Module 4** — Recherche par nom, filtres par poste et par statut, filtre combiné
- ✅ **Module 5** — Tableau de bord avec compteurs en temps réel et graphique de répartition
- ✅ **Module 6** — Base de données persistante, contraintes d'unicité, validation backend et frontend
- ✅ **Module 7** — Interface professionnelle avec sidebar, topbar, modales, badges colorés

---

*Groupe BEZOK BTP SARL — Test pratique INFO-02*
