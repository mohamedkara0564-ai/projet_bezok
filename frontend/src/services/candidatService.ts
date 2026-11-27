import type { Candidat } from "../types/candidat";
import { API_URL } from "../config";
import { fetchAuth } from "./fetchAuth";

const BASE = `${API_URL}/api/candidats`;

// ─────────────────────────────────────────────────────────────
// getCandidats()
// Récupère tous les candidats, avec filtres optionnels
// Si aucun filtre → renvoie toute la liste
// ─────────────────────────────────────────────────────────────
export async function getCandidats(): Promise<Candidat[]> {
    const response = await fetchAuth(BASE);
    if (!response.ok) throw new Error("Erreur lors de la récupération des candidats");
    return response.json();
}

// ─────────────────────────────────────────────────────────────
// rechercherCandidats()
// Remplace rechercherParNom, filtrerParStatut, filtrerParPoste,
// filtrerCombine — une seule fonction, paramètres optionnels
// ─────────────────────────────────────────────────────────────
export async function rechercherCandidats(filtres: {
    nom?: string;
    poste?: string;
    statut?: string;
}): Promise<Candidat[]> {
    const params = new URLSearchParams();
    Object.entries(filtres).forEach(([cle, val]) => {
        if (val?.trim()) params.set(cle, val.trim());
    });

    const url = params.toString() ? `${BASE}?${params}` : BASE;
    const response = await fetchAuth(url);
    if (!response.ok) throw new Error("Erreur lors de la recherche");
    return response.json();
}

// ─────────────────────────────────────────────────────────────
// ajouterCandidat()
// ─────────────────────────────────────────────────────────────
export async function ajouterCandidat(
    donnee: Omit<Candidat, "id" | "created_at">
): Promise<Candidat> {
    const response = await fetchAuth(BASE, {
        method: "POST",
        body: JSON.stringify(donnee)
    });
    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de l'ajout");
    }
    return response.json();
}

// ─────────────────────────────────────────────────────────────
// modifierCandidat()
// ─────────────────────────────────────────────────────────────
export async function modifierCandidat(
    id: number,
    donnee: Omit<Candidat, "id" | "created_at">
): Promise<Candidat> {
    const response = await fetchAuth(`${BASE}/${id}`, {
        method: "PUT",
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
// ─────────────────────────────────────────────────────────────
export async function supprimerCandidat(id: number): Promise<void> {
    const response = await fetchAuth(`${BASE}/${id}`, { method: "DELETE" });
    if (!response.ok) {
        const erreur = await response.json();
        throw new Error(erreur.message || "Erreur lors de la suppression");
    }
}

// ─────────────────────────────────────────────────────────────
// getStatistiques()
// ─────────────────────────────────────────────────────────────
export async function getStatistiques(): Promise<{
    total: number;
    preselectionnes: number;
    retenus: number;
    non_retenus: number;
}> {
    const response = await fetchAuth(`${API_URL}/api/dashboard/statistiques`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques");
    return response.json();
}
