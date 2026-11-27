import type { Candidat } from "../types/candidat";

interface Props {
    candidat: Candidat;
    onModifier: (candidat: Candidat) => void;
}

const COULEURS: Record<string, { bg: string; texte: string; bord: string }> = {
    "candidature reçue": { bg: "#dbeafe", texte: "#1d4ed8", bord: "#93c5fd" },
    "présélectionné":    { bg: "#dcfce7", texte: "#15803d", bord: "#86efac" },
    "convoqué":          { bg: "#fef9c3", texte: "#a16207", bord: "#fde047" },
    "test effectué":     { bg: "#cffafe", texte: "#0e7490", bord: "#67e8f9" },
    "retenu":            { bg: "#d1fae5", texte: "#065f46", bord: "#6ee7b7" },
    "non retenu":        { bg: "#fee2e2", texte: "#b91c1c", bord: "#fca5a5" }
};

function couleurAvatar(nom: string): string {
    const palettes = ["#1a3c6e", "#2563eb", "#0e7490", "#065f46", "#7c3aed", "#b45309"];
    return palettes[nom.charCodeAt(0) % palettes.length];
}

function formaterDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "long", year: "numeric"
    });
}

// ─────────────────────────────────────────────────────────────
// DossierCandidat
// Vue en lecture seule du dossier complet d'un candidat.
// S'affiche dans une Modal depuis Candidats.tsx
// ─────────────────────────────────────────────────────────────
function DossierCandidat({ candidat, onModifier }: Props) {
    const couleur = COULEURS[candidat.statut] || { bg: "#f1f5f9", texte: "#555", bord: "#cbd5e1" };

    return (
        <div style={s.conteneur}>

            {/* ── En-tête : avatar + nom + statut ── */}
            <div style={s.entete}>
                <div style={{ ...s.avatar, backgroundColor: couleurAvatar(candidat.nom_prenoms) }}>
                    {candidat.nom_prenoms.charAt(0).toUpperCase()}
                </div>
                <div style={s.enteteInfos}>
                    <h3 style={s.nom}>{candidat.nom_prenoms}</h3>
                    <span style={{ ...s.badge, backgroundColor: couleur.bg, color: couleur.texte, border: `1px solid ${couleur.bord}` }}>
                        • {candidat.statut}
                    </span>
                </div>
            </div>

            <hr style={s.separateur} />

            {/* ── Grille d'informations ── */}
            <div style={s.grille}>

                <InfoLigne icone="📋" label="Poste recherché" valeur={candidat.poste_recherche} />
                <InfoLigne icone="🎓" label="Niveau d'études"  valeur={candidat.niveau_etudes} />
                <InfoLigne icone="📞" label="Téléphone"        valeur={candidat.telephone} />
                <InfoLigne icone="✉️" label="Email"            valeur={candidat.email} />
                <InfoLigne
                    icone="📅"
                    label="Date de candidature"
                    valeur={formaterDate(candidat.date_candidature)}
                />
                <InfoLigne
                    icone="🕐"
                    label="Enregistré le"
                    valeur={formaterDate(candidat.created_at)}
                />

            </div>

            <hr style={s.separateur} />

            {/* ── Bouton modifier ── */}
            <div style={s.pied}>
                <button
                    onClick={() => onModifier(candidat)}
                    style={s.boutonModifier}
                >
                    ✏ Modifier ce dossier
                </button>
            </div>

        </div>
    );
}

// ── Composant local : une ligne d'information ─────────────────
function InfoLigne({ icone, label, valeur }: { icone: string; label: string; valeur: string }) {
    return (
        <div style={s.infoLigne}>
            <div style={s.infoGauche}>
                <span style={s.infoIcone}>{icone}</span>
                <span style={s.infoLabel}>{label}</span>
            </div>
            <span style={s.infoValeur}>{valeur || "—"}</span>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    conteneur: {
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    entete: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1.25rem"
    },
    avatar: {
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "1.4rem",
        fontWeight: "700",
        flexShrink: 0
    },
    enteteInfos: {
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem"
    },
    nom: {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "#0f2044",
        margin: 0
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "600",
        alignSelf: "flex-start"
    },
    separateur: {
        border: "none",
        borderTop: "1px solid #e2e8f0",
        margin: "1.25rem 0"
    },
    grille: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem"
    },
    infoLigne: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.6rem 0.75rem",
        backgroundColor: "#f8fafc",
        borderRadius: "8px"
    },
    infoGauche: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
    },
    infoIcone: {
        fontSize: "1rem",
        width: "20px",
        textAlign: "center"
    },
    infoLabel: {
        fontSize: "0.85rem",
        color: "#64748b",
        fontWeight: "500"
    },
    infoValeur: {
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#1e293b",
        textAlign: "right",
        maxWidth: "60%",
        wordBreak: "break-word"
    },
    pied: {
        display: "flex",
        justifyContent: "flex-end"
    },
    boutonModifier: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "0.6rem 1.2rem",
        fontWeight: "600",
        fontSize: "0.9rem",
        cursor: "pointer"
    }
};

export default DossierCandidat;
