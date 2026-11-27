import { createContext, useContext, useState } from "react";
import {
    connexion as serviceConnexion,
    deconnexion as serviceDeconnexion,
    getUtilisateur,
    estConnecte as serviceEstConnecte
} from "../services/authService";

// ─────────────────────────────────────────────────────────────
// 1. Définition du type du contexte
//    C'est le "contrat" : ce que le contexte fournit à l'app
// ─────────────────────────────────────────────────────────────
interface Utilisateur {
    id: number;
    nom: string;
    email: string;
}

interface AuthContextType {
    utilisateur: Utilisateur | null;    // infos de l'utilisateur connecté (ou null)
    estConnecte: boolean;               // true si connecté
    connexion: (email: string, motDePasse: string) => Promise<void>;
    deconnexion: () => void;
}

// ─────────────────────────────────────────────────────────────
// 2. Création du contexte
//    On lui donne une valeur par défaut "undefined"
//    Le vrai contenu sera fourni par AuthProvider ci-dessous
// ─────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// 3. AuthProvider — le composant qui "fournit" le contexte
//    Il enveloppera toute l'app dans main.tsx
//    { children } = tout ce qui est à l'intérieur du provider
// ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {

    // On initialise l'état depuis le localStorage
    // Ainsi, si l'utilisateur rafraîchit la page, il reste connecté
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(
        getUtilisateur()
    );
    const [estConnecte, setEstConnecte] = useState<boolean>(
        serviceEstConnecte()
    );

    // Fonction connexion : appelle authService, puis met à jour l'état React
    async function connexion(email: string, motDePasse: string) {
        const data = await serviceConnexion(email, motDePasse);
        setUtilisateur(data.utilisateur);
        setEstConnecte(true);
    }

    // Fonction déconnexion : vide le localStorage et remet l'état à null
    function deconnexion() {
        serviceDeconnexion();
        setUtilisateur(null);
        setEstConnecte(false);
    }

    // On expose toutes ces valeurs aux composants enfants
    return (
        <AuthContext.Provider value={{ utilisateur, estConnecte, connexion, deconnexion }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────────────────────
// 4. Hook personnalisé useAuth()
//    Plutôt qu'écrire useContext(AuthContext) partout,
//    on crée un raccourci : const { utilisateur } = useAuth()
// ─────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    // Sécurité : si useAuth() est appelé hors du Provider, on le signale
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }

    return context;
}
