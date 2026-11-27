import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { utilisateur, deconnexion } = useAuth();
    const navigate = useNavigate();

    function handleDeconnexion() {
        // On vide le localStorage et remet l'état du contexte à null
        deconnexion();
        // On redirige vers la page de connexion
        navigate("/login");
    }

    return (
        <nav style={styles.nav}>

            {/* Nom de l'application */}
            <div style={styles.logo}>
                <span style={styles.logoTexte}>BEZOjK BTP</span>
                <span style={styles.logoSous}>Service RH</span>
            </div>

            {/* Liens de navigation */}
            <div style={styles.liens}>
                <Link to="/dashboard" style={styles.lien}>
                    Tableau de bord
                </Link>
                <Link to="/candidats" style={styles.lien}>
                    Candidats
                </Link>
            </div>

            {/* Infos utilisateur + déconnexion */}
            <div style={styles.utilisateurZone}>
                {utilisateur && (
                    <span style={styles.nomUtilisateur}>
                        👤 {utilisateur.nom}
                    </span>
                )}
                <button onClick={handleDeconnexion} style={styles.boutonDeconnexion}>
                    Déconnexion
                </button>
            </div>

        </nav>
    );
}

// ─── Styles inline ───────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1a3c6e",
        color: "#ffffff",
        padding: "0 2rem",
        height: "60px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    logo: {
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.1"
    },
    logoTexte: {
        fontWeight: "bold",
        fontSize: "1.1rem",
        letterSpacing: "0.05em"
    },
    logoSous: {
        fontSize: "0.7rem",
        color: "#a8c0e0"
    },
    liens: {
        display: "flex",
        gap: "1.5rem"
    },
    lien: {
        color: "#ffffff",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: "500",
        padding: "0.3rem 0.5rem",
        borderRadius: "4px",
        transition: "background-color 0.2s"
    },
    utilisateurZone: {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    },
    nomUtilisateur: {
        fontSize: "0.9rem",
        color: "#a8c0e0"
    },
    boutonDeconnexion: {
        backgroundColor: "transparent",
        color: "#ffffff",
        border: "1px solid #ffffff",
        borderRadius: "5px",
        padding: "0.35rem 0.9rem",
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "background-color 0.2s"
    }
};

export default Navbar;
