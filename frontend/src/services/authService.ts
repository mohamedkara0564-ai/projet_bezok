import { API_URL } from "../config";

const BASE_AUTH = `${API_URL}/api/auth`;

// Clé utilisée pour stocker le token dans le localStorage
const TOKEN_KEY = "bezok_token";
const USER_KEY = "bezok_user";

// ─────────────────────────────────────────────────────────────
// connexion()
// Envoie les identifiants au backend, reçoit un token JWT
// et le stocke dans le localStorage
// ─────────────────────────────────────────────────────────────
export async function connexion(email: string, mot_de_passe: string) {
    const response = await fetch(`${BASE_AUTH}/connexion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, mot_de_passe })
    });

    // Si le serveur répond avec une erreur (401, 400...), on lit le message
    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Identifiants incorrects");
    }

    const data = await response.json();

    // On stocke le token et les infos utilisateur dans le navigateur
    // Ils survivent au rechargement de la page
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.utilisateur));

    return data;
}

// ─────────────────────────────────────────────────────────────
// deconnexion()
// Supprime le token et les infos utilisateur du localStorage
// ─────────────────────────────────────────────────────────────
export function deconnexion() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// ─────────────────────────────────────────────────────────────
// getToken()
// Lit le token stocké — utilisé par candidatService pour
// ajouter le header Authorization sur chaque requête
// ─────────────────────────────────────────────────────────────
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

// ─────────────────────────────────────────────────────────────
// getUtilisateur()
// Lit les infos de l'utilisateur connecté
// ─────────────────────────────────────────────────────────────
export function getUtilisateur() {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data) as { id: number; nom: string; email: string };
}

// ─────────────────────────────────────────────────────────────
// estConnecte()
// Retourne true si un token est présent dans le localStorage
// ─────────────────────────────────────────────────────────────
export function estConnecte(): boolean {
    return getToken() !== null;
}
