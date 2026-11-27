// ─────────────────────────────────────────────────────────────
// config.ts — Configuration globale du frontend
//
// L'URL de l'API est définie ici une seule fois.
// Pour changer d'environnement (dev → prod), on modifie
// uniquement ce fichier ou la variable VITE_API_URL dans .env
// ─────────────────────────────────────────────────────────────

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
