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

```bash
psql -U postgres -d bezok_db -f database/schema.sql
```

Ou depuis pgAdmin : clic droit sur `bezok_db` → **Query Tool** → ouvrir `database/schema.sql` → Exécuter.

---

### Étape 2 — Configurer le backend

Dans le dossier `backend/`, copier `.env.example` en `.env` :

```bash
cd backend
copy .env.example .env   # Windows
cp .env.example .env     # Mac / Linux
```

Ouvrir `.env` et renseigner les informations de connexion PostgreSQL :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bezok_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRES
JWT_SECRET=CHOISIR_UNE_CHAINE_SECRETE_LONGUE
FRONTEND_URL=http://localhost:5173
```

---

### Étape 3 — Installer et lancer le backend

```bash
cd backend
npm install
npm run dev
```

Message attendu : `Serveur lancé sur le port 5000`

---

### Étape 4 — Installer et lancer le frontend

Ouvrir un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

---

### Étape 5 — Accéder à l'application

Ouvrir le navigateur sur `http://localhost:5173`

Se connecter avec :
- Email : `admin@bezok.com`
- Mot de passe : `bezok123`

---

## Structure du projet

```
Groupe BEZOK/
├── backend/
│   ├── config/db.js              ← Connexion PostgreSQL (Pool)
│   ├── middlewares/auth.js       ← Vérification token JWT
│   ├── routes/
│   │   ├── auth.js               ← Inscription et connexion
│   │   ├── candidats.js          ← CRUD candidats + recherche/filtrage
│   │   └── dashboard.js          ← Statistiques tableau de bord
│   ├── server.js                 ← Configuration Express + sécurité
│   ├── .env                      ← Variables d'environnement (non versionné)
│   └── .env.example              ← Modèle du fichier .env
├── frontend/src/
│   ├── config.ts                 ← URL de l'API centralisée
│   ├── context/AuthContext.tsx   ← État global d'authentification
│   ├── services/
│   │   ├── fetchAuth.ts          ← Wrapper fetch avec token + gestion 401
│   │   ├── authService.ts        ← Appels API auth
│   │   └── candidatService.ts    ← Appels API candidats
│   ├── components/
│   │   ├── CandidatForm.tsx      ← Formulaire ajout / modification
│   │   ├── CandidatTable.tsx     ← Tableau avec actions
│   │   ├── DossierCandidat.tsx   ← Vue consultation dossier
│   │   ├── Layout.tsx            ← Sidebar + topbar + footer
│   │   ├── Modal.tsx             ← Fenêtre modale réutilisable
│   │   ├── PrivateRoute.tsx      ← Protection des routes React
│   │   └── Sidebar.tsx           ← Navigation principale
│   └── pages/
│       ├── Login.tsx             ← Page de connexion
│       ├── Register.tsx          ← Page de création de compte
│       ├── Dashboard.tsx         ← Tableau de bord + statistiques
│       └── Candidats.tsx         ← Gestion complète des candidatures
├── database/
│   └── schema.sql                ← Script SQL (tables + données démo)
├── README.md                     ← Ce fichier
├── DOCUMENTATION_BACKEND.md      ← Documentation technique backend
├── DOCUMENTATION_FRONTEND.md     ← Documentation technique frontend
└── LIVRABLE.md                   ← Présentation + déclaration IA
```

---

## Fonctionnalités réalisées

| Module | Description | Points |
|--------|-------------|--------|
| **M1 — Authentification** | Connexion JWT, bcrypt, routes protégées, déconnexion | 8 pts |
| **M2 — Enregistrement** | Formulaire 7 champs, validation, unicité email | 10 pts |
| **M3 — Gestion** | Liste, consultation dossier, modification, suppression | 12 pts |
| **M4 — Recherche/filtrage** | Recherche nom, filtre poste + statut, filtre combiné | 5 pts |
| **M5 — Tableau de bord** | 4 compteurs + donut SVG, rafraîchissement automatique | 5 pts |
| **M6 — Base de données** | PostgreSQL, contraintes UNIQUE + CHECK, requêtes paramétrées | 8 pts |
| **M7 — Interface** | Sidebar, modales animées, badges colorés, pagination | 7 pts |

---

## Technologies utilisées

### Backend
| Technologie | Rôle |
|-------------|------|
| Node.js 18+ | Environnement d'exécution |
| Express 5 | Framework API REST |
| PostgreSQL 14+ | Base de données |
| bcryptjs | Hachage des mots de passe |
| jsonwebtoken | Tokens JWT |
| helmet | Sécurisation des headers HTTP |
| express-rate-limit | Limitation des tentatives de connexion |

### Frontend
| Technologie | Rôle |
|-------------|------|
| React 19 | Interface utilisateur |
| TypeScript | Typage statique |
| Vite | Bundler |
| react-router-dom | Navigation |

---

*Groupe BEZOK BTP SARL — Test pratique INFO-02*
