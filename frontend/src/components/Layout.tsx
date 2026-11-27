import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: React.ReactNode;
}

// Correspondance URL → titre affiché dans le fil d'Ariane
const titresPages: Record<string, string> = {
    "/dashboard": "Tableau de bord",
    "/candidats": "Candidatures"
};

function Layout({ children }: Props) {
    const location = useLocation();
    const { utilisateur } = useAuth();

    const titrePage = titresPages[location.pathname] || "Page";
    // Initiales de l'utilisateur pour l'avatar
    const initiales = utilisateur?.nom
        ? utilisateur.nom.split(" ").map(m => m[0]).join("").slice(0, 2).toUpperCase()
        : "RH";

    return (
        <div style={styles.conteneur}>

            {/* ── Sidebar gauche ── */}
            <Sidebar />

            {/* ── Colonne droite ── */}
            <div style={styles.droite}>

                {/* Topbar */}
                <header style={styles.topbar}>

                    {/* Fil d'Ariane */}
                    <div style={styles.filAriane}>
                        <span style={styles.filParent}>Espace RH</span>
                        <span style={styles.filSep}>/</span>
                        <span style={styles.filActif}>{titrePage}</span>
                    </div>

                    {/* Droite topbar : cloche + avatar */}
                    <div style={styles.topbarDroite}>
                        {/* Avatar utilisateur */}
                        <div style={styles.avatar}>
                            <span style={styles.avatarInitiales}>{initiales}</span>
                        </div>
                        <div style={styles.avatarInfo}>
                            <span style={styles.avatarNom}>{utilisateur?.nom || "Service RH"}</span>
                        </div>

                    </div>
                </header>

                {/* Contenu de la page */}
                <main style={styles.main}>
                    {children}
                </main>

                {/* Footer */}
                <footer style={styles.footer}>
                    <span>© 2026 Groupe BEZOK BTP SARL – Application de gestion des candidatures</span>
                </footer>

            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    conteneur: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    droite: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0
    },
    // ── Topbar ──
    topbar: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "#ffffff",
        padding: "0 1.5rem",
        height: "56px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    filAriane: {
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        whiteSpace: "nowrap",
        marginRight: "0.5rem"
    },
    filParent: {
        fontSize: "0.85rem",
        color: "#888"
    },
    filSep: {
        color: "#ccc",
        fontSize: "0.85rem"
    },
    filActif: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#1a3c6e"
    },
    topbarDroite: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginLeft: "auto"
    },
    avatar: {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        backgroundColor: "#1a3c6e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
    },
    avatarInitiales: {
        color: "#ffffff",
        fontSize: "0.75rem",
        fontWeight: "bold"
    },
    avatarInfo: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
    },
    avatarNom: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#333"
    },
    // ── Contenu ──
    main: {
        flex: 1,
        padding: "1.5rem",
        overflowY: "auto"
    },
    // ── Footer ──
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        fontSize: "0.75rem",
        color: "#888"
    },
    footerDroite: {
        fontSize: "0.75rem",
        color: "#888"
    }
};

export default Layout;
