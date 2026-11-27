import { useEffect } from "react";

interface Props {
    titre: string;
    onFermer: () => void;
    children: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────
// Modal
// Fenêtre modale générique avec overlay sombre
// - Fermeture en cliquant sur l'overlay ou sur la croix
// - Fermeture avec la touche Échap
// - Scroll bloqué sur le body quand la modale est ouverte
// ─────────────────────────────────────────────────────────────
function Modal({ titre, onFermer, children }: Props) {

    // Fermeture avec Échap + blocage du scroll du body
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onFermer();
        }
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onFermer]);

    return (
        // Overlay sombre — clic dessus ferme la modale
        <div style={styles.overlay} onClick={onFermer}>

            {/* Carte modale — stopPropagation empêche la fermeture en cliquant dedans */}
            <div
                style={styles.carte}
                onClick={e => e.stopPropagation()}
            >
                {/* En-tête */}
                <div style={styles.entete}>
                    <h2 style={styles.titre}>{titre}</h2>
                    <button onClick={onFermer} style={styles.boutonFermer} title="Fermer">
                        ✕
                    </button>
                </div>

                {/* Contenu */}
                <div style={styles.corps}>
                    {children}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,                          // top/right/bottom/left = 0
        backgroundColor: "rgba(15,32,68,0.55)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
    },
    carte: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "680px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        animation: "modalEntree 0.2s ease-out"
    },
    entete: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0
    },
    titre: {
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "#0f2044",
        margin: 0
    },
    boutonFermer: {
        background: "none",
        border: "none",
        fontSize: "1.1rem",
        color: "#94a3b8",
        cursor: "pointer",
        lineHeight: 1,
        padding: "0.2rem 0.4rem",
        borderRadius: "4px"
    },
    corps: {
        padding: "1.5rem",
        overflowY: "auto"   // scroll interne si le formulaire est long
    }
};

export default Modal;
