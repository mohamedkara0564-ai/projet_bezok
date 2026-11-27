# Livrable — Test pratique INFO-02
## Groupe BEZOK BTP SARL — Service RH

---

## 1. Présentation des technologies utilisées

### Architecture générale

L'application suit une architecture **client-serveur** classique :

```
Navigateur (React)  ←──HTTP/JSON──►  Serveur (Express)  ←──SQL──►  PostgreSQL
     Frontend                            Backend                     Base de données
  localhost:5173                      localhost:5000
```

### Backend — Node.js + Express + PostgreSQL

**Node.js** est l'environnement qui permet d'exécuter du JavaScript côté serveur.  
**Express** est le framework utilisé pour créer l'API REST — il gère les routes HTTP (GET, POST, PUT, DELETE).  
**PostgreSQL** est la base de données relationnelle qui stocke les candidats et les comptes utilisateurs.  
**bcryptjs** transforme les mots de passe en hash irréversible avant de les stocker — même si la base est compromise, les mots de passe restent protégés.  
**jsonwebtoken (JWT)** génère un token signé après connexion. Ce token est envoyé dans chaque requête pour prouver l'identité de l'utilisateur sans retourner en base à chaque fois.

### Frontend — React + TypeScript + Vite

**React** est la bibliothèque JavaScript utilisée pour construire l'interface. L'application est découpée en composants réutilisables.  
**TypeScript** ajoute un typage statique au JavaScript — il détecte les erreurs avant l'exécution du code.  
**Vite** est l'outil de développement qui compile et sert le code React très rapidement.  
**react-router-dom** gère la navigation entre les pages sans rechargement du navigateur.

---

## 2. Fonctionnalités réalisées

### Module 1 — Authentification et sécurité (8 pts)
- Page de connexion avec validation des champs
- Page d'inscription pour créer un compte RH
- Mots de passe hachés avec **bcryptjs** (jamais stockés en clair)
- Token **JWT** généré à la connexion, valable 8 heures
- Toutes les routes de l'API sont protégées par un middleware de vérification du token
- Routes React protégées par `PrivateRoute` — redirection automatique vers `/login` si non connecté
- Bouton de déconnexion qui vide le token et redirige

### Module 2 — Enregistrement des candidats (10 pts)
- Formulaire avec 6 champs : nom et prénoms, téléphone, email, poste recherché, niveau d'études, statut
- 6 statuts disponibles : candidature reçue, présélectionné, convoqué, test effectué, retenu, non retenu
- Validation côté frontend (format email, format téléphone, champs obligatoires)
- Validation côté backend (double protection)
- Contrainte d'unicité sur l'email (impossible d'enregistrer deux candidats avec le même email)
- Formulaire accessible via une **modale** (fenêtre pop-up) pour ne pas quitter la liste

### Module 3 — Gestion des candidatures (12 pts)
- Affichage de la liste complète des candidats dans un tableau
- Badges colorés pour visualiser le statut au premier coup d'œil
- Bouton **Modifier** qui ouvre une modale pré-remplie avec les données du candidat
- Bouton **Supprimer** avec confirmation obligatoire avant suppression
- Mise à jour en temps réel de la liste après chaque action (sans rechargement)

### Module 4 — Recherche et filtrage (5 pts)
- Recherche par nom (recherche partielle, insensible à la casse)
- Filtre par poste recherché
- Filtre par statut
- Filtre combiné poste + statut simultanément
- Bouton réinitialiser pour revenir à la liste complète
- Compteur de résultats affiché dynamiquement

### Module 5 — Tableau de bord (5 pts)
- 4 compteurs automatiques : total, présélectionnés, retenus, non retenus
- Graphique donut (camembert) représentant la répartition des statuts
- Taux de sélection calculé automatiquement en pourcentage
- Tableau des candidatures récentes avec pagination
- Lien d'accès rapide vers la gestion des candidatures

### Module 6 — Base de données et validation (8 pts)
- Toutes les données sont persistées dans **PostgreSQL**
- Contraintes en base : `UNIQUE` sur les emails, `CHECK` sur les statuts autorisés, `DEFAULT` sur le statut et les dates
- Validation des saisies côté backend sur chaque route (POST et PUT)
- Protection contre les injections SQL grâce aux **requêtes paramétrées** (`$1`, `$2`...)
- Les mots de passe ne sont jamais stockés en clair

### Module 7 — Interface et qualité du code (7 pts)
- Interface professionnelle inspirée d'un vrai outil RH
- Sidebar de navigation avec logo, liens actifs et déconnexion
- Topbar avec fil d'Ariane, barre de recherche, avatar utilisateur
- Modales animées pour les formulaires d'ajout et de modification
- Badges colorés pour les statuts
- Avatars lettrés pour les candidats
- Pagination sur le tableau et le dashboard
- Code organisé par couches : types → services → composants → pages
- Composants réutilisables (Modal, CandidatForm, CandidatTable)

---

## 3. Déclaration des outils d'IA utilisés

**Outil utilisé : Kiro (assistant IA de développement)**

L'intelligence artificielle **Kiro** a été utilisée comme assistant tout au long du développement de cette application.

### Contribution de l'IA

| Domaine | Contribution |
|---------|-------------|
| Architecture | Proposition et mise en place de la structure backend (routes, middlewares, config) |
| Authentification | Implémentation de bcryptjs et JWT (hachage, génération et vérification des tokens) |
| API REST | Écriture des routes Express avec validation et gestion des erreurs |
| Frontend React | Création des composants, gestion du Context, routing avec react-router-dom |
| Interface utilisateur | Mise en page inspirée de la maquette (sidebar, topbar, modales, badges) |
| Documentation | Génération des fichiers DOCUMENTATION_BACKEND.md et DOCUMENTATION_FRONTEND.md |

### Rôle du candidat

Conformément aux conditions du test, j'ai :
- Dirigé et supervisé chaque étape du développement
- Défini les besoins et validé chaque fonctionnalité produite
- Testé l'application manuellement à chaque étape
- Corrigé les erreurs identifiées lors des tests
- Compris le fonctionnement de chaque fichier de code produit
- Été en mesure d'expliquer et de modifier le code lors de la soutenance

L'IA a servi d'accélérateur technique, à l'image d'un collègue senior qui aide à coder — la compréhension, la direction et la validation du travail restent entièrement de ma responsabilité.

---

## 4. Déclaration sur l'honneur

Je certifie sur l'honneur que :
- Le travail présenté est personnel
- L'utilisation de l'intelligence artificielle a été déclarée ci-dessus
- Je suis en mesure d'être interrogé sur tout le code source remis
- Je suis en mesure de modifier l'application devant l'évaluateur

**Nom et prénoms :** ...................................................................

**Date :** ...............................

**Signature :**

---

*Groupe BEZOK BTP SARL — Test pratique INFO-02 — Application de gestion des candidatures*
