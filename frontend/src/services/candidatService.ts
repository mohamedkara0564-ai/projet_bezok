import type { Candidat } from "../types/candidat";
import { getToken } from "./authService";

const API_URL = "http://localhost:5000/api/candidats";

// ─────────────────────────────────────────────────────────────
// headersAvecToken()
// Construit les headers HTTP avec le token JWT
// Toutes les requêtes vers /api/candidats en ont besoin
// car le backend vérifie le token sur chaque route
// ─────────────────────────────────────────────────────────────
function headersAvecToken(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// ─────────────────────────────────────────────────────────────
// getCandidats()
// Récupère la liste complète des candidats
// ─────────────────────────────────────────────────────────────
export async function getCandidats(): Promise<Candidat[]> {
    const response = await fetch(API_URL, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des candidats");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// ajouterCandidat()
// Enregistre un nouveau candidat
// ─────────────────────────────────────────────────────────────
export async function ajouterCandidat(
    donnee: Omit<Candidat, "id" | "date_candidature" | "created_at">
): Promise<Candidat> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: headersAvecToken(),
        body: JSON.stringify(donnee)
    });

    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de l'ajout du candidat");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// modifierCandidat()
// Met à jour les informations et/ou le statut d'un candidat
// ─────────────────────────────────────────────────────────────
export async function modifierCandidat(
    id: number,
    donnee: Omit<Candidat, "id" | "date_candidature" | "created_at">
): Promise<Candidat> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: headersAvecToken(),
        body: JSON.stringify(donnee)
    });

    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de la modification");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// supprimerCandidat()
// Supprime un candidat par son id
// ─────────────────────────────────────────────────────────────
export async function supprimerCandidat(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: headersAvecToken()
    });

    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de la suppression");
    }
}

// ─────────────────────────────────────────────────────────────
// getStatistiques()
// Récupère les compteurs pour le tableau de bord
// ─────────────────────────────────────────────────────────────
export async function getStatistiques(): Promise<{
    total: number;
    preselectionnes: number;
    retenus: number;
    non_retenus: number;
}> {
    const response = await fetch("http://localhost:5000/api/dashboard/statistiques", {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statistiques");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// rechercherParNom()
// Appelle GET /api/candidats/recherche?nom=...
// Retourne les candidats dont le nom contient la chaîne saisie
// ─────────────────────────────────────────────────────────────
export async function rechercherParNom(nom: string): Promise<Candidat[]> {
    // encodeURIComponent protège les caractères spéciaux (espaces, accents)
    const response = await fetch(`${API_URL}/recherche?nom=${encodeURIComponent(nom)}`, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de la recherche");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// filtrerParStatut()
// Appelle GET /api/candidats/statut/:statut
// ─────────────────────────────────────────────────────────────
export async function filtrerParStatut(statut: string): Promise<Candidat[]> {
    const response = await fetch(`${API_URL}/statut/${encodeURIComponent(statut)}`, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors du filtrage par statut");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// filtrerParPoste()
// Appelle GET /api/candidats/poste/:poste
// ─────────────────────────────────────────────────────────────
export async function filtrerParPoste(poste: string): Promise<Candidat[]> {
    const response = await fetch(`${API_URL}/poste/${encodeURIComponent(poste)}`, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors du filtrage par poste");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// filtrerCombine()
// Appelle GET /api/candidats/filtre?poste=...&statut=...
// Filtre simultanément par poste ET par statut
// ─────────────────────────────────────────────────────────────
export async function filtrerCombine(poste: string, statut: string): Promise<Candidat[]> {
    const params = new URLSearchParams({ poste, statut });
    const response = await fetch(`${API_URL}/filtre?${params.toString()}`, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors du filtrage combiné");
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// getTotal()
// Appelle GET /api/candidats/total
// Retourne uniquement le nombre total de candidats
// ─────────────────────────────────────────────────────────────
export async function getTotal(): Promise<number> {
    const response = await fetch(`${API_URL}/total`, {
        headers: headersAvecToken()
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération du total");
    }

    const data = await response.json();
    return data.total;
}
