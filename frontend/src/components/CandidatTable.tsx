import type { Candidat } from "../types/candidat";

interface Props {
    candidats: Candidat[];
    onSupprimer: (id: number) => void;
    onModifier: (candidat: Candidat) => void;
    onVoir?: (candidat: Candidat) => void;
}

// Couleurs cohérentes avec le Dashboard
const COULEURS: Record<string, { bg: string; texte: string; bord: string }> = {
    "candidature reçue": { bg: "#dbeafe", texte: "#1d4ed8", bord: "#93c5fd" },
    "présélectionné":    { bg: "#dcfce7", texte: "#15803d", bord: "#86efac" },
    "convoqué":          { bg: "#fef9c3", texte: "#a16207", bord: "#fde047" },
    "test effectué":     { bg: "#cffafe", texte: "#0e7490", bord: "#67e8f9" },
    "retenu":            { bg: "#d1fae5", texte: "#065f46", bord: "#6ee7b7" },
    "non retenu":        { bg: "#fee2e2", texte: "#b91c1c", bord: "#fca5a5" }
};

// Couleur de fond de l'avatar selon la première lettre
function couleurAvatar(nom: string): string {
    const palettes = ["#1a3c6e", "#2563eb", "#0e7490", "#065f46", "#7c3aed", "#b45309"];
    return palettes[nom.charCodeAt(0) % palettes.length];
}

// ── Icônes SVG ────────────────────────────────────────────────
const IcoVoir = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const IcoEditer = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IcoSupprimer = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);

function CandidatTable({ candidats, onSupprimer, onModifier, onVoir }: Props) {
    return (
        <div style={styles.conteneur}>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.thead}>
                        <th style={styles.th}>Candidat</th>
                        <th style={styles.th}>Poste recherché</th>
                        <th style={styles.th}>Téléphone</th>
                        <th style={styles.th}>Niveau</th>
                        <th style={styles.th}>Statut</th>
                        <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidats.length > 0 ? (
                        candidats.map((c, i) => {
                            const couleur = COULEURS[c.statut] || { bg: "#f1f5f9", texte: "#555", bord: "#cbd5e1" };
                            return (
                                <tr
                                    key={c.id}
                                    style={{
                                        backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                                        transition: "background-color 0.15s"
                                    }}
                                >
                                    {/* Candidat avec avatar lettré */}
                                    <td style={styles.td}>
                                        <div style={styles.cellCandidat}>
                                            <div style={{
                                                ...styles.avatar,
                                                backgroundColor: couleurAvatar(c.nom_prenoms)
                                            }}>
                                                {c.nom_prenoms.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={styles.nom}>{c.nom_prenoms}</p>
                                                <p style={styles.email}>{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{c.poste_recherche}</td>
                                    <td style={styles.td}>{c.telephone}</td>
                                    <td style={styles.td}>{c.niveau_etudes}</td>

                                    {/* Badge statut */}
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: couleur.bg,
                                            color: couleur.texte,
                                            border: `1px solid ${couleur.bord}`
                                        }}>
                                            • {c.statut}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ ...styles.td, textAlign: "center" }}>
                                        <div style={styles.actions}>
                                            {/* Consulter */}
                                            {onVoir && (
                                                <button
                                                    onClick={() => onVoir(c)}
                                                    style={{ ...styles.icoBtn, color: "#555" }}
                                                    title="Consulter le dossier"
                                                >
                                                    <IcoVoir />
                                                </button>
                                            )}
                                            {/* Modifier */}
                                            <button
                                                onClick={() => onModifier(c)}
                                                style={{ ...styles.icoBtn, color: "#2563eb" }}
                                                title="Modifier"
                                            >
                                                <IcoEditer />
                                            </button>
                                            {/* Supprimer */}
                                            <button
                                                onClick={() => onSupprimer(c.id)}
                                                style={{ ...styles.icoBtn, color: "#ef4444" }}
                                                title="Supprimer"
                                            >
                                                <IcoSupprimer />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} style={styles.vide}>
                                Aucun candidat trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    conteneur: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", fontFamily: "Segoe UI, Arial, sans-serif" },
    thead: { backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
    th: {
        padding: "0.8rem 1rem", textAlign: "left",
        fontWeight: "600", color: "#475569",
        fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em",
        whiteSpace: "nowrap"
    },
    td: { padding: "0.8rem 1rem", color: "#334155", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
    cellCandidat: { display: "flex", alignItems: "center", gap: "0.75rem" },
    avatar: {
        width: "36px", height: "36px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0
    },
    nom: { margin: 0, fontWeight: "600", fontSize: "0.875rem", color: "#1e293b" },
    email: { margin: 0, fontSize: "0.75rem", color: "#94a3b8", marginTop: "1px" },
    badge: {
        display: "inline-flex", alignItems: "center", gap: "0.25rem",
        padding: "0.25rem 0.65rem", borderRadius: "20px",
        fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap"
    },
    actions: { display: "flex", justifyContent: "center", gap: "0.4rem" },
    icoBtn: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "30px", height: "30px", borderRadius: "6px",
        backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0",
        cursor: "pointer", transition: "background-color 0.15s"
    },
    vide: { textAlign: "center", padding: "3rem", color: "#94a3b8", fontStyle: "italic" }
};

export default CandidatTable;
