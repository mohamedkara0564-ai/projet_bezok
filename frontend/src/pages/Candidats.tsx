import { useEffect, useState } from "react";
import type { Candidat } from "../types/candidat";
import {
    getCandidats,
    rechercherParNom,
    filtrerParStatut,
    filtrerParPoste,
    filtrerCombine,
    supprimerCandidat
} from "../services/candidatService";
import CandidatTable from "../components/CandidatTable";
import CandidatForm from "../components/CandidatForm";

// Statuts autorisés — identiques à ceux du backend
const STATUTS = [
    "candidature reçue",
    "présélectionné",
    "convoqué",
    "test effectué",
    "retenu",
    "non retenu"
];

function Candidats() {
    const [candidats, setCandidats] = useState<Candidat[]>([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");

    // États des filtres
    const [recherche, setRecherche] = useState("");
    const [filtreStatut, setFiltreStatut] = useState("");
    const [filtrePoste, setFiltrePoste] = useState("");

    // Afficher ou cacher le formulaire d'ajout
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);

    // Candidat en cours de modification (null = aucun)
    const [candidatAModifier, setCandidatAModifier] = useState<Candidat | null>(null);

    // Chargement initial — liste complète
    useEffect(() => {
        chargerTous();
    }, []);

    async function chargerTous() {
        setChargement(true);
        setErreur("");
        try {
            const data = await getCandidats();
            setCandidats(data);
        } catch (error) {
            setErreur("Impossible de charger les candidats.");
            console.error(error);
        } finally {
            setChargement(false);
        }
    }

    // ── Logique de recherche / filtrage ──────────────────────
    // Appelée quand on clique sur "Rechercher"
    async function handleRechercher() {
        setChargement(true);
        setErreur("");

        try {
            let resultats: Candidat[];

            const nomSaisi = recherche.trim();
            const posteSaisi = filtrePoste.trim();

            if (nomSaisi) {
                // Priorité à la recherche par nom
                resultats = await rechercherParNom(nomSaisi);

            } else if (posteSaisi && filtreStatut) {
                // Filtre combiné poste + statut
                resultats = await filtrerCombine(posteSaisi, filtreStatut);

            } else if (filtreStatut) {
                // Filtre par statut seul
                resultats = await filtrerParStatut(filtreStatut);

            } else if (posteSaisi) {
                // Filtre par poste seul
                resultats = await filtrerParPoste(posteSaisi);

            } else {
                // Aucun filtre → liste complète
                resultats = await getCandidats();
            }

            setCandidats(resultats);

        } catch (error) {
            setErreur(
                error instanceof Error ? error.message : "Erreur lors de la recherche."
            );
        } finally {
            setChargement(false);
        }
    }

    // Réinitialise tous les filtres et recharge la liste complète
    function handleReinitialiser() {
        setRecherche("");
        setFiltreStatut("");
        setFiltrePoste("");
        chargerTous();
    }

    // ── Suppression avec confirmation ────────────────────────
    async function handleSupprimer(id: number) {
        const confirme = window.confirm("Confirmer la suppression de ce candidat ?");
        if (!confirme) return;

        try {
            await supprimerCandidat(id);
            // On retire le candidat de la liste sans recharger toute la page
            setCandidats((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            setErreur(
                error instanceof Error ? error.message : "Erreur lors de la suppression."
            );
        }
    }

    // ── Ajout d'un candidat ──────────────────────────────────
    function handleAjout(nouveau: Candidat) {
        setCandidats((prev) => [nouveau, ...prev]);
        setAfficherFormulaire(false);
    }

    return (
        <div>
            {/* En-tête */}
            <div style={styles.entete}>
                <h1 style={styles.titre}>Gestion des candidatures</h1>
                <button
                    onClick={() => {
                        setAfficherFormulaire(!afficherFormulaire);
                        setCandidatAModifier(null);
                    }}
                    style={styles.boutonAjouter}
                >
                    {afficherFormulaire ? "✕ Annuler" : "+ Ajouter un candidat"}
                </button>
            </div>

            {/* Formulaire d'ajout */}
            {afficherFormulaire && (
                <div style={styles.section}>
                    <CandidatForm onAjout={handleAjout} />
                </div>
            )}

            {/* Barre de recherche et filtres */}
            <div style={styles.filtresZone}>
                <h2 style={styles.sousTitre}>Recherche et filtres</h2>

                <div style={styles.filtresGrille}>

                    {/* Recherche par nom */}
                    <div style={styles.champ}>
                        <label style={styles.label}>Rechercher par nom</label>
                        <input
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRechercher()}
                            placeholder="Ex : Kouassi"
                            style={styles.input}
                        />
                    </div>

                    {/* Filtre par poste */}
                    <div style={styles.champ}>
                        <label style={styles.label}>Filtrer par poste</label>
                        <input
                            type="text"
                            value={filtrePoste}
                            onChange={(e) => setFiltrePoste(e.target.value)}
                            placeholder="Ex : Développeur web"
                            style={styles.input}
                        />
                    </div>

                    {/* Filtre par statut */}
                    <div style={styles.champ}>
                        <label style={styles.label}>Filtrer par statut</label>
                        <select
                            value={filtreStatut}
                            onChange={(e) => setFiltreStatut(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">— Tous les statuts —</option>
                            {STATUTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Boutons d'action */}
                <div style={styles.boutonsFiltres}>
                    <button onClick={handleRechercher} style={styles.boutonRechercher}>
                        🔍 Rechercher
                    </button>
                    <button onClick={handleReinitialiser} style={styles.boutonReinitialiser}>
                        ↺ Réinitialiser
                    </button>
                </div>
            </div>

            {/* Messages */}
            {erreur && <p style={styles.erreur}>⚠ {erreur}</p>}
            {chargement && <p style={styles.info}>Chargement...</p>}

            {/* Résultat */}
            {!chargement && (
                <div style={styles.section}>
                    <p style={styles.compteur}>
                        {candidats.length} candidat{candidats.length !== 1 ? "s" : ""} trouvé{candidats.length !== 1 ? "s" : ""}
                    </p>
                    <CandidatTable
                        candidats={candidats}
                        onSupprimer={handleSupprimer}
                        onModifier={(candidat) => {
                            setCandidatAModifier(candidat);
                            setAfficherFormulaire(false);
                        }}
                    />
                </div>
            )}

            {/* Zone de modification — s'affiche sous le tableau */}
            {candidatAModifier && (
                <div style={styles.section}>
                    <h2 style={styles.sousTitre}>Modifier le candidat</h2>
                    <CandidatForm
                        onAjout={() => {}}
                        candidatAModifier={candidatAModifier}
                        onModificationTerminee={(candidatMaj) => {
                            setCandidats((prev) =>
                                prev.map((c) => (c.id === candidatMaj.id ? candidatMaj : c))
                            );
                            setCandidatAModifier(null);
                        }}
                        onAnnuler={() => setCandidatAModifier(null)}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    entete: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem"
    },
    titre: {
        fontSize: "1.6rem",
        fontWeight: "bold",
        color: "#1a3c6e",
        margin: 0
    },
    sousTitre: {
        fontSize: "1rem",
        fontWeight: "600",
        color: "#1a3c6e",
        marginBottom: "1rem"
    },
    section: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
    },
    filtresZone: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
    },
    filtresGrille: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1rem"
    },
    champ: {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem"
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#444"
    },
    input: {
        padding: "0.6rem 0.8rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "0.9rem"
    },
    boutonsFiltres: {
        display: "flex",
        gap: "0.75rem",
        marginTop: "0.5rem"
    },
    boutonAjouter: {
        backgroundColor: "#1a3c6e",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "0.6rem 1.2rem",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.9rem"
    },
    boutonRechercher: {
        backgroundColor: "#2980b9",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "0.6rem 1.2rem",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.9rem"
    },
    boutonReinitialiser: {
        backgroundColor: "#ecf0f1",
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "0.6rem 1.2rem",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.9rem"
    },
    compteur: {
        color: "#666",
        fontSize: "0.9rem",
        marginBottom: "1rem"
    },
    erreur: {
        color: "#c0392b",
        backgroundColor: "#fdecea",
        border: "1px solid #f5c6c6",
        borderRadius: "6px",
        padding: "0.75rem 1rem",
        marginBottom: "1rem"
    },
    info: {
        color: "#666",
        fontStyle: "italic"
    }
};

export default Candidats;
