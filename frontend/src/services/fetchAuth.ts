import { getToken, deconnexion } from "./authService";

// ─────────────────────────────────────────────────────────────
// fetchAuth()
// Wrapper autour de fetch() qui :
//   1. Ajoute automatiquement le header Authorization: Bearer <token>
//   2. Sur réponse 401 (token expiré ou invalide) → déconnecte
//      l'utilisateur et le redirige vers /login
//
// Usage — remplace fetch() partout dans les services :
//   const res = await fetchAuth("/api/candidats");
//   const res = await fetchAuth("/api/candidats", { method: "POST", body: ... });
// ─────────────────────────────────────────────────────────────
export async function fetchAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();

    // Fusion des headers : on ajoute le token aux headers existants
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };

    const response = await fetch(url, { ...options, headers });

    // Si le serveur répond 401 → token expiré ou invalide
    // On déconnecte proprement et on redirige vers /login
    if (response.status === 401) {
        deconnexion();
        window.location.href = "/login";
    }

    return response;
}
