import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidats from "./pages/Candidats";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

// ─────────────────────────────────────────────────────────────
// App — point d'entrée du routing
//
// BrowserRouter  : active le routeur React pour toute l'app
// Routes         : conteneur de toutes les routes
// Route          : associe une URL à un composant
// Navigate       : redirection automatique
//
// Structure :
//   /            → redirige vers /login
//   /login       → page publique (pas de PrivateRoute)
//   /dashboard   → page protégée (PrivateRoute + Layout)
//   /candidats   → page protégée (PrivateRoute + Layout)
// ─────────────────────────────────────────────────────────────
function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Redirection de la racine vers /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Page de connexion — publique */}
                <Route path="/login" element={<Login />} />

                {/* Pages internes — protégées par PrivateRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/candidats"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Candidats />
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* Route inconnue → retour login */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
