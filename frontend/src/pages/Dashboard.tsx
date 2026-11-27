import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStatistiques } from "../services/candidatService";
import { useAuth } from "../context/AuthContext";

interface Statistiques {
    total: number;
    preselectionnes: number;
    retenus: number;
    non_retenus: number;
}

function Dashboard() {
    const { utilisateur } = useAuth();
    const [stats, setStats] = useState<Statistiques | null>(null);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [derniereMaj, setDerniereMaj] = useState<string>("");

    useEffect(() => {
        chargerStatistiques();
    }, []);

    async function chargerStatistiques() {
        setChargement(true);
        setErreur("");
        try {
            const data = await getStatistiques();
            setStats(data);
            // On enregistre l'heure du dernier chargement
            setDerniereMaj(new Date().toLocaleTimeString("fr-FR"));
        } catch (error) {
            setErreur("Impossible de charger les statistiques.");
            console.error(error);
        } finally {
            setChargement(false);
        }
    }

    return (
        <div>

            {/* En-tête avec message de bienvenue */}
            <div style={styles.entete}>
                <div>
                    <h1 style={styles.titre}>Tableau de bord</h1>
                    <p style={styles.sousTitre}>
                        Bonjour{utilisateur ? `, ${utilisateur.nom}` : ""} — Vue d'ensemble des candidatures
                    </p>
                </div>

                <button
                    onClick={chargerStatistiques}
                    disabled={chargement}
                    style={styles.boutonRafraichir}
                >
                    {chargement ? "..." : "↺ Actualiser"}
                </button>
            </div>

            {/* Dernière mise à jour */}
            {derniereMaj && (
                <p style={styles.majInfo}>
                    Dernière mise à jour : {derniereMaj}
                </p>
            )}

            {/* Message d'erreur */}
            {erreur && (
                <div style={styles.alerte}>⚠ {erreur}</div>
            )}

            {/* Grille de compteurs */}
            {chargement && !stats && (
                <p style={styles.chargement}>Chargement des statistiques...</p>
            )}

            {stats && (
                <>
                    <div style={styles.grille}>

                        <CarteCompteur
                            label="Total candidats"
                            valeur={stats.total}
                            couleur="#1a3c6e"
                            icone="👥"
                            description="Toutes candidatures confondues"
                        />

                        <CarteCompteur
                            label="Présélectionnés"
                            valeur={stats.preselectionnes}
                            couleur="#8e44ad"
                            icone="📋"
                            description="En attente de convocation"
                        />

                        <CarteCompteur
                            label="Retenus"
                            valeur={stats.retenus}
                            couleur="#27ae60"
                            icone="✅"
                            description="Candidatures acceptées"
                        />

                        <CarteCompteur
                            label="Non retenus"
                            valeur={stats.non_retenus}
                            couleur="#e74c3c"
                            icone="❌"
                            description="Candidatures refusées"
                        />

                    </div>

                    {/* Taux de réussite si au moins un candidat */}
                    {stats.total > 0 && (
                        <div style={styles.tauxZone}>
                            <p style={styles.tauxTexte}>
                                Taux de sélection :{" "}
                                <strong style={{ color: "#27ae60" }}>
                                    {Math.round((stats.retenus / stats.total) * 100)} %
                                </strong>
                                {" "}({stats.retenus} retenu{stats.retenus > 1 ? "s" : ""} sur {stats.total})
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Accès rapide */}
            <div style={styles.acceRapide}>
                <h2 style={styles.accesTitre}>Accès rapide</h2>
                <div style={styles.accesLiens}>
                    <Link to="/candidats" style={styles.lienAcces}>
                        📁 Gérer les candidatures
                    </Link>
                </div>
            </div>

        </div>
    );
}

// ── Composant local : carte compteur ─────────────────────────
interface CarteProps {
    label: string;
    valeur: number;
    couleur: string;
    icone: string;
    description: string;
}

function CarteCompteur({ label, valeur, couleur, icone, description }: CarteProps) {
    return (
        <div style={{ ...styles.carte, borderTop: `4px solid ${couleur}` }}>
            <div style={styles.carteEntete}>
                <span style={styles.icone}>{icone}</span>
                <p style={styles.carteLabel}>{label}</p>
            </div>
            <p style={{ ...styles.carteValeur, color: couleur }}>{valeur}</p>
            <p style={styles.carteDescription}>{description}</p>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    entete: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "0.25rem"
    },
    titre: {
        fontSize: "1.6rem",
        fontWeight: "bold",
        color: "#1a3c6e",
        margin: 0
    },
    sousTitre: {
        color: "#666",
        fontSize: "0.95rem",
        marginTop: "0.3rem"
    },
    majInfo: {
        color: "#999",
        fontSize: "0.8rem",
        marginBottom: "1.5rem"
    },
    boutonRafraichir: {
        backgroundColor: "transparent",
        color: "#1a3c6e",
        border: "1px solid #1a3c6e",
        borderRadius: "6px",
        padding: "0.4rem 1rem",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "600"
    },
    alerte: {
        backgroundColor: "#fdecea",
        color: "#c0392b",
        border: "1px solid #f5c6c6",
        borderRadius: "6px",
        padding: "0.75rem 1rem",
        marginBottom: "1.5rem"
    },
    chargement: {
        color: "#666",
        fontStyle: "italic"
    },
    grille: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginBottom: "1.5rem"
    },
    carte: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    carteEntete: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.5rem"
    },
    icone: {
        fontSize: "1.3rem"
    },
    carteLabel: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#555",
        margin: 0
    },
    carteValeur: {
        fontSize: "2.8rem",
        fontWeight: "bold",
        margin: "0.25rem 0"
    },
    carteDescription: {
        fontSize: "0.78rem",
        color: "#999",
        margin: 0
    },
    tauxZone: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "1rem 1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "1.5rem"
    },
    tauxTexte: {
        margin: 0,
        fontSize: "0.95rem",
        color: "#444"
    },
    acceRapide: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    accesTitre: {
        fontSize: "1rem",
        fontWeight: "600",
        color: "#1a3c6e",
        marginBottom: "1rem"
    },
    accesLiens: {
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap"
    },
    lienAcces: {
        backgroundColor: "#1a3c6e",
        color: "#ffffff",
        textDecoration: "none",
        padding: "0.6rem 1.2rem",
        borderRadius: "6px",
        fontSize: "0.9rem",
        fontWeight: "600"
    }
};

export default Dashboard;
