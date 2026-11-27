import { useEffect, useState } from "react";
import type { Candidat } from "../types/candidat";
import {
    getCandidats, rechercherCandidats,
    supprimerCandidat
} from "../services/candidatService";
import CandidatTable from "../components/CandidatTable";
import CandidatForm from "../components/CandidatForm";
import Modal from "../components/Modal";
import DossierCandidat from "../components/DossierCandidat";

const STATUTS = [
    "candidature reçue", "présélectionné", "convoqué",
    "test effectué", "retenu", "non retenu"
];

// ── Icônes ────────────────────────────────────────────────────
const IcoFiltre = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
);
const IcoRecherche = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

function Candidats() {
    const [candidats, setCandidats]                   = useState<Candidat[]>([]);
    const [chargement, setChargement]                 = useState(false);
    const [erreur, setErreur]                         = useState("");
    const [recherche, setRecherche]                   = useState("");
    const [filtreStatut, setFiltreStatut]             = useState("");
    const [filtrePoste, setFiltrePoste]               = useState("");
    const [page, setPage]                             = useState(1);
    const parPage = 8;

    // ── États des modales ─────────────────────────────────────
    const [modaleAjout, setModaleAjout]               = useState(false);
    const [candidatAModifier, setCandidatAModifier]   = useState<Candidat | null>(null);
    const [candidatAVoir, setCandidatAVoir]           = useState<Candidat | null>(null);

    useEffect(() => { chargerTous(); }, []);

    async function chargerTous() {
        setChargement(true); setErreur("");
        try { setCandidats(await getCandidats()); }
        catch { setErreur("Impossible de charger les candidats."); }
        finally { setChargement(false); }
    }

    async function handleRechercher() {
        setChargement(true); setErreur(""); setPage(1);
        try {
            const res = await rechercherCandidats({
                nom: recherche,
                poste: filtrePoste,
                statut: filtreStatut
            });
            setCandidats(res);
        } catch (e) {
            setErreur(e instanceof Error ? e.message : "Erreur de recherche.");
        } finally { setChargement(false); }
    }

    function handleReinitialiser() {
        setRecherche(""); setFiltreStatut(""); setFiltrePoste(""); setPage(1);
        chargerTous();
    }

    async function handleSupprimer(id: number) {
        if (!window.confirm("Confirmer la suppression de ce candidat ?")) return;
        try {
            await supprimerCandidat(id);
            setCandidats(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            setErreur(e instanceof Error ? e.message : "Erreur suppression.");
        }
    }

    // Après ajout : on ajoute en tête de liste et on ferme la modale
    function handleAjout(nouveau: Candidat) {
        setCandidats(prev => [nouveau, ...prev]);
        setModaleAjout(false);
    }

    // Après modification : on met à jour la ligne et on ferme la modale
    function handleModificationTerminee(maj: Candidat) {
        setCandidats(prev => prev.map(c => c.id === maj.id ? maj : c));
        setCandidatAModifier(null);
    }

    // Pagination
    const totalPages = Math.ceil(candidats.length / parPage);
    const candidatsPage = candidats.slice((page - 1) * parPage, page * parPage);

    return (
        <div style={s.page}>

            {/* ── En-tête page ── */}
            <div style={s.entete}>
                <div>
                    <h1 style={s.titre}>Candidatures</h1>
                    <p style={s.sousTitre}>
                        {candidats.length} candidat{candidats.length !== 1 ? "s" : ""} enregistré{candidats.length !== 1 ? "s" : ""}
                    </p>
                </div>
                {/* Bouton qui ouvre la modale d'ajout */}
                <button onClick={() => setModaleAjout(true)} style={s.boutonAjouter}>
                    + Ajouter un candidat
                </button>
            </div>

            {/* ── Tableau avec filtres intégrés ── */}
            <div style={s.carteBlanche}>

                {/* Header du tableau */}
                <div style={s.tableauHeader}>
                    <h2 style={s.tableauTitre}>≡ Liste des candidatures</h2>

                    <div style={s.filtresLigne}>
                        {/* Filtre poste dynamique */}
                        <select value={filtrePoste} onChange={e => setFiltrePoste(e.target.value)} style={s.select}>
                            <option value="">Tous les postes</option>
                            {[...new Set(candidats.map(c => c.poste_recherche))].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        {/* Filtre statut */}
                        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={s.select}>
                            <option value="">Tous les statuts</option>
                            {STATUTS.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>

                        {/* Recherche par nom */}
                        <div style={s.rechercheZone}>
                            <IcoRecherche />
                            <input
                                type="text"
                                value={recherche}
                                onChange={e => setRecherche(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleRechercher()}
                                placeholder="Rechercher par nom..."
                                style={s.rechercheInput}
                            />
                        </div>

                        <button onClick={handleRechercher} style={s.btnFiltrer}>
                            <IcoFiltre /> Filtrer
                        </button>
                        <button onClick={handleReinitialiser} style={s.btnReset}>↺</button>
                    </div>
                </div>

                {/* Messages */}
                {erreur && <div style={s.erreur}>⚠ {erreur}</div>}
                {chargement && <p style={s.chargement}>Chargement...</p>}

                {/* Tableau */}
                {!chargement && (
                    <CandidatTable
                        candidats={candidatsPage}
                        onSupprimer={handleSupprimer}
                        onModifier={c => setCandidatAModifier(c)}
                        onVoir={c => setCandidatAVoir(c)}
                    />
                )}

                {/* Pagination */}
                {!chargement && candidats.length > parPage && (
                    <div style={s.pagination}>
                        <span style={s.paginationInfo}>
                            Affichage de {(page - 1) * parPage + 1} à {Math.min(page * parPage, candidats.length)} sur {candidats.length} entrées
                        </span>
                        <div style={s.paginationBtns}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={s.pagBtn}>‹</button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setPage(n)} style={{ ...s.pagBtn, ...(page === n ? s.pagBtnActif : {}) }}>{n}</button>
                            ))}
                            {totalPages > 5 && <span style={s.pagBtn}>...</span>}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={s.pagBtn}>›</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ══ MODALE CONSULTATION ═══════════════════════════════ */}
            {candidatAVoir && (
                <Modal
                    titre={`👁 Dossier — ${candidatAVoir.nom_prenoms}`}
                    onFermer={() => setCandidatAVoir(null)}
                >
                    <DossierCandidat
                        candidat={candidatAVoir}
                        onModifier={(c) => {
                            setCandidatAVoir(null);     // ferme la modale consultation
                            setCandidatAModifier(c);    // ouvre la modale modification
                        }}
                    />
                </Modal>
            )}

            {/* ══ MODALE AJOUT ══════════════════════════════════════ */}
            {modaleAjout && (
                <Modal
                    titre="➕ Ajouter un candidat"
                    onFermer={() => setModaleAjout(false)}
                >
                    <CandidatForm
                        onAjout={handleAjout}
                        onAnnuler={() => setModaleAjout(false)}
                    />
                </Modal>
            )}

            {/* ══ MODALE MODIFICATION ═══════════════════════════════ */}
            {candidatAModifier && (
                <Modal
                    titre={`✏ Modifier — ${candidatAModifier.nom_prenoms}`}
                    onFermer={() => setCandidatAModifier(null)}
                >
                    <CandidatForm
                        onAjout={() => {}}
                        candidatAModifier={candidatAModifier}
                        onModificationTerminee={handleModificationTerminee}
                        onAnnuler={() => setCandidatAModifier(null)}
                    />
                </Modal>
            )}

        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: { display: "flex", flexDirection: "column", gap: "1.25rem", fontFamily: "Segoe UI, Arial, sans-serif" },
    entete: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    titre: { fontSize: "1.6rem", fontWeight: "bold", color: "#0f2044", margin: 0 },
    sousTitre: { color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem", marginBottom: 0 },
    boutonAjouter: {
        backgroundColor: "#2563eb", color: "#fff", border: "none",
        borderRadius: "8px", padding: "0.6rem 1.2rem",
        fontWeight: "600", fontSize: "0.9rem", cursor: "pointer"
    },
    carteBlanche: {
        backgroundColor: "#fff", borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden"
    },
    tableauHeader: {
        display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: "0.75rem", padding: "1rem 1.25rem",
        borderBottom: "1px solid #f1f5f9"
    },
    tableauTitre: { margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0f2044", marginRight: "auto" },
    filtresLigne: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
    select: {
        padding: "0.45rem 0.75rem", border: "1px solid #e2e8f0",
        borderRadius: "6px", fontSize: "0.82rem", color: "#334155",
        backgroundColor: "#f8fafc", cursor: "pointer", outline: "none"
    },
    rechercheZone: {
        display: "flex", alignItems: "center", gap: "0.4rem",
        border: "1px solid #e2e8f0", borderRadius: "6px",
        padding: "0.4rem 0.75rem", backgroundColor: "#f8fafc"
    },
    rechercheInput: {
        border: "none", outline: "none", backgroundColor: "transparent",
        fontSize: "0.82rem", color: "#334155", width: "160px"
    },
    btnFiltrer: {
        display: "flex", alignItems: "center", gap: "0.4rem",
        backgroundColor: "#0f2044", color: "#fff", border: "none",
        borderRadius: "6px", padding: "0.45rem 0.9rem",
        fontSize: "0.82rem", fontWeight: "600", cursor: "pointer"
    },
    btnReset: {
        backgroundColor: "#f1f5f9", color: "#555", border: "1px solid #e2e8f0",
        borderRadius: "6px", padding: "0.45rem 0.6rem",
        fontSize: "0.9rem", cursor: "pointer"
    },
    pagination: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.75rem 1.25rem", borderTop: "1px solid #f1f5f9"
    },
    paginationInfo: { fontSize: "0.8rem", color: "#94a3b8" },
    paginationBtns: { display: "flex", gap: "0.3rem" },
    pagBtn: {
        minWidth: "30px", height: "30px", padding: "0 0.4rem",
        border: "1px solid #e2e8f0", borderRadius: "6px",
        backgroundColor: "#fff", fontSize: "0.82rem",
        cursor: "pointer", color: "#555",
        display: "flex", alignItems: "center", justifyContent: "center"
    },
    pagBtnActif: { backgroundColor: "#0f2044", color: "#fff", borderColor: "#0f2044" },
    erreur: {
        margin: "1rem 1.25rem", backgroundColor: "#fef2f2", color: "#b91c1c",
        border: "1px solid #fca5a5", borderRadius: "6px", padding: "0.75rem 1rem"
    },
    chargement: { textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic" }
};

export default Candidats;
