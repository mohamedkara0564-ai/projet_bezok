import type { Candidat } from "../types/candidat";

interface Props {
    candidats: Candidat[];
    onSupprimer: (id: number) => void;
    onModifier: (candidat: Candidat) => void;
}

// Couleur associée à chaque statut pour le badge visuel
const couleurStatut: Record<string, string> = {
    "candidature reçue": "#2980b9",
    "présélectionné":    "#8e44ad",
    "convoqué":          "#e67e22",
    "test effectué":     "#16a085",
    "retenu":            "#27ae60",
    "non retenu":        "#e74c3c"
};

function CandidatTable({ candidats, onSupprimer, onModifier }: Props) {
    return (
        <div style={styles.conteneur}>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.entete}>
                        <th style={styles.th}>Nom et prénoms</th>
                        <th style={styles.th}>Téléphone</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Poste recherché</th>
                        <th style={styles.th}>Niveau d'études</th>
                        <th style={styles.th}>Statut</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {candidats.length > 0 ? (
                        candidats.map((candidat, index) => (
                            <tr
                                key={candidat.id}
                                style={{
                                    ...styles.ligne,
                                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc"
                                }}
                            >
                                <td style={styles.td}>{candidat.nom_prenoms}</td>
                                <td style={styles.td}>{candidat.telephone}</td>
                                <td style={styles.td}>{candidat.email}</td>
                                <td style={styles.td}>{candidat.poste_recherche}</td>
                                <td style={styles.td}>{candidat.niveau_etudes}</td>

                                {/* Badge coloré selon le statut */}
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: couleurStatut[candidat.statut] || "#95a5a6"
                                    }}>
                                        {candidat.statut}
                                    </span>
                                </td>

                                {/* Boutons d'action */}
                                <td style={styles.tdActions}>
                                    <button
                                        onClick={() => onModifier(candidat)}
                                        style={styles.boutonModifier}
                                        title="Modifier ce candidat"
                                    >
                                        ✏ Modifier
                                    </button>
                                    <button
                                        onClick={() => onSupprimer(candidat.id)}
                                        style={styles.boutonSupprimer}
                                        title="Supprimer ce candidat"
                                    >
                                        🗑 Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={styles.vide}>
                                Aucun candidat trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    conteneur: {
        overflowX: "auto"   // scroll horizontal sur petits écrans
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.9rem",
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    entete: {
        backgroundColor: "#1a3c6e",
        color: "#ffffff"
    },
    th: {
        padding: "0.75rem 1rem",
        textAlign: "left",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },
    ligne: {
        borderBottom: "1px solid #e8ecf0",
        transition: "background-color 0.15s"
    },
    td: {
        padding: "0.7rem 1rem",
        color: "#333",
        verticalAlign: "middle"
    },
    tdActions: {
        padding: "0.7rem 1rem",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center"
    },
    badge: {
        display: "inline-block",
        color: "#ffffff",
        padding: "0.25rem 0.65rem",
        borderRadius: "20px",
        fontSize: "0.78rem",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },
    boutonModifier: {
        backgroundColor: "#2980b9",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        padding: "0.35rem 0.75rem",
        fontSize: "0.8rem",
        cursor: "pointer",
        fontWeight: "500",
        whiteSpace: "nowrap"
    },
    boutonSupprimer: {
        backgroundColor: "#e74c3c",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        padding: "0.35rem 0.75rem",
        fontSize: "0.8rem",
        cursor: "pointer",
        fontWeight: "500",
        whiteSpace: "nowrap"
    },
    vide: {
        textAlign: "center",
        padding: "2rem",
        color: "#999",
        fontStyle: "italic"
    }
};

export default CandidatTable;
