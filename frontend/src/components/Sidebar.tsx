import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Icônes SVG inline ─────────────────────────────────────────
const IcoDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
    </svg>
);
const IcoCandidats = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
const IcoDeconnexion = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);




function Sidebar() {
    const { deconnexion } = useAuth();
    const navigate = useNavigate();

    function handleDeconnexion() {
        deconnexion();
        navigate("/login");
    }

    const lienActif: React.CSSProperties = {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        borderRadius: "8px"
    };

    return (
        <aside style={styles.sidebar}>

            {/* Logo */}
            <div style={styles.logoZone}>
                <div style={styles.logoTextes}>
                    <span style={styles.logoNom}>BEZOK BTP</span>
                    <span style={styles.logoSous}>SARL</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({ ...styles.lien, ...(isActive ? lienActif : {}) })}
                >
                    <IcoDashboard />
                    <span>Tableau de bord</span>
                </NavLink>

                <NavLink
                    to="/candidats"
                    style={({ isActive }) => ({ ...styles.lien, ...(isActive ? lienActif : {}) })}
                >
                    <IcoCandidats />
                    <span>Candidatures</span>
                </NavLink>
            </nav>

            {/* Bas de la sidebar */}
            <div style={styles.bas}>
                <button onClick={handleDeconnexion} style={styles.boutonDeconnexion}>
                    <IcoDeconnexion />
                    <span>Déconnexion</span>
                </button>
                
            </div>

        </aside>
    );
}

const styles: Record<string, React.CSSProperties> = {
    sidebar: {
        width: "220px",
        minWidth: "220px",
        backgroundColor: "#0f2044",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    logoZone: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1.5rem 1rem 1rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        marginBottom: "1rem"
    },
    logoTextes: {
        display: "flex",
        flexDirection: "column"
    },
    logoNom: {
        fontWeight: "bold",
        fontSize: "1rem",
        color: "#ffffff",
        letterSpacing: "0.05em"
    },
    logoSous: {
        fontSize: "0.7rem",
        color: "#93c5fd"
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        padding: "0 0.75rem",
        flex: 1
    },
    lien: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.7rem 0.9rem",
        color: "#93c5fd",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: "500",
        borderRadius: "8px",
        transition: "background-color 0.15s, color 0.15s"
    },
    bas: {
        padding: "1rem 0.75rem",
        borderTop: "1px solid rgba(255,255,255,0.1)"
    },
    boutonDeconnexion: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: "0.7rem 0.9rem",
        backgroundColor: "transparent",
        color: "#93c5fd",
        border: "none",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: "500",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: "1rem"
    },
    slogan: {
        fontSize: "0.72rem",
        color: "rgba(255,255,255,0.4)",
        textAlign: "center",
        lineHeight: "1.5",
        margin: 0
    }
};

export default Sidebar;
