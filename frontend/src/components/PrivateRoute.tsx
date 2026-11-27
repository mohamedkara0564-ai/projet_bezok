import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: React.ReactNode; // la page à afficher si connecté
}

// ─────────────────────────────────────────────────────────────
// PrivateRoute
// Enveloppe une page pour la protéger.
// Usage dans App.tsx :
//   <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
// ─────────────────────────────────────────────────────────────
function PrivateRoute({ children }: Props) {
    const { estConnecte } = useAuth();

    // Si l'utilisateur n'est pas connecté, on le renvoie vers /login
    // "replace" évite que /dashboard reste dans l'historique du navigateur
    if (!estConnecte) {
        return <Navigate to="/login" replace />;
    }

    // Sinon on affiche normalement la page demandée
    return <>{children}</>;
}

export default PrivateRoute;
