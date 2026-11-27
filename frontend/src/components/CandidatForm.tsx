import { useState, useEffect } from "react";
import type { Candidat } from "../types/candidat";
import { ajouterCandidat, modifierCandidat } from "../services/candidatService";

// Statuts autorisés — identiques au backend
const STATUTS = [
    "candidature reçue",
    "présélectionné",
    "convoqué",
    "test effectué",
    "retenu",
    "non retenu"
];

interface Props {
    // Mode ajout
    onAjout: (candidat: Candidat) => void;

    // Mode modification (optionnels — absents = mode ajout)
    candidatAModifier?: Candidat | null;
    onModificationTerminee?: (candidat: Candidat) => void;
    onAnnuler?: () => void;
}

function CandidatForm({ onAjout, candidatAModifier, onModificationTerminee, onAnnuler }: Props) {

    // Si candidatAModifier est fourni, on est en mode modification
    const modeModification = !!candidatAModifier;

    const [nom_prenoms, setNom]               = useState("");
    const [telephone, setTelephone]           = useState("");
    const [email, setEmail]                   = useState("");
    const [poste_recherche, setPoste]         = useState("");
    const [niveau_etudes, setNiveau]          = useState("");
    const [statut, setStatut]                 = useState("candidature reçue");
    const [date_candidature, setDateCand]     = useState(
        new Date().toISOString().split("T")[0] // date du jour au format YYYY-MM-DD
    );

    const [erreur, setErreur]             = useState("");
    const [succes, setSucces]             = useState(false);
    const [chargement, setChargement]     = useState(false);

    // ── Pré-remplissage en mode modification ─────────────────
    // useEffect se déclenche quand candidatAModifier change
    // Il remplit les champs avec les données existantes du candidat
    useEffect(() => {
        if (candidatAModifier) {
            setNom(candidatAModifier.nom_prenoms);
            setTelephone(candidatAModifier.telephone);
            setEmail(candidatAModifier.email);
            setPoste(candidatAModifier.poste_recherche);
            setNiveau(candidatAModifier.niveau_etudes);
            setStatut(candidatAModifier.statut);
            // Convertir la date ISO en YYYY-MM-DD pour le champ date
            setDateCand(
                candidatAModifier.date_candidature
                    ? candidatAModifier.date_candidature.split("T")[0]
                    : new Date().toISOString().split("T")[0]
            );
        } else {
            setNom("");
            setTelephone("");
            setEmail("");
            setPoste("");
            setNiveau("");
            setStatut("candidature reçue");
            setDateCand(new Date().toISOString().split("T")[0]);
        }
        setErreur("");
        setSucces(false);
    }, [candidatAModifier]);

    function validerFormulaire(): string {
        if (!nom_prenoms.trim())     return "Le nom et prénoms est obligatoire.";
        if (!telephone.trim())       return "Le téléphone est obligatoire.";
        if (!/^\+?[\d\s\-]{6,15}$/.test(telephone))
                                     return "Format du téléphone invalide.";
        if (!email.trim())           return "L'email est obligatoire.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                     return "Format de l'email invalide.";
        if (!poste_recherche.trim()) return "Le poste recherché est obligatoire.";
        if (!niveau_etudes.trim())   return "Le niveau d'études est obligatoire.";
        if (!date_candidature)       return "La date de candidature est obligatoire.";
        return "";
    }

    // ── Soumission du formulaire ──────────────────────────────
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErreur("");
        setSucces(false);

        const messageErreur = validerFormulaire();
        if (messageErreur) {
            setErreur(messageErreur);
            return;
        }

        setChargement(true);

        const donnees = {
            nom_prenoms:      nom_prenoms.trim(),
            telephone:        telephone.trim(),
            email:            email.trim(),
            poste_recherche:  poste_recherche.trim(),
            niveau_etudes:    niveau_etudes.trim(),
            statut,
            date_candidature
        };

        try {
            if (modeModification && candidatAModifier) {
                // ── Mode modification : PUT /api/candidats/:id
                const candidatMaj = await modifierCandidat(candidatAModifier.id, donnees);
                setSucces(true);
                onModificationTerminee?.(candidatMaj);

            } else {
                // ── Mode ajout : POST /api/candidats
                const nouveauCandidat = await ajouterCandidat(donnees);
                setSucces(true);
                onAjout(nouveauCandidat);

                // On vide le formulaire après ajout
                setNom(""); setTelephone(""); setEmail("");
                setPoste(""); setNiveau("");
                setStatut("candidature reçue");
                setDateCand(new Date().toISOString().split("T")[0]);
            }

        } catch (error) {
            setErreur(
                error instanceof Error
                    ? error.message
                    : "Une erreur inattendue est survenue."
            );
        } finally {
            setChargement(false);
        }
    }

    return (
        <div>
            <h2 style={styles.titre}>
                {modeModification && "✏ Modifier le candidat"}
            </h2>

            {/* Message d'erreur */}
            {erreur && (
                <div style={styles.alerte} role="alert">⚠ {erreur}</div>
            )}

            {/* Message de succès */}
            {succes && (
                <div style={styles.succes} role="status">
                    ✓ {modeModification ? "Candidat modifié avec succès !" : "Candidat ajouté avec succès !"}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={styles.formulaire}>

                <div style={styles.grille}>

                    {/* Nom et prénoms */}
                    <div style={styles.champ}>
                        <label htmlFor="nom_prenoms" style={styles.label}>
                            Nom et prénoms <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="nom_prenoms"
                            type="text"
                            value={nom_prenoms}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Ex : Kouassi Jean"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Téléphone */}
                    <div style={styles.champ}>
                        <label htmlFor="telephone" style={styles.label}>
                            Téléphone <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="telephone"
                            type="tel"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="Ex : 0789185555"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div style={styles.champ}>
                        <label htmlFor="email" style={styles.label}>
                            Email <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ex : jean.kouassi@email.com"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Poste recherché */}
                    <div style={styles.champ}>
                        <label htmlFor="poste_recherche" style={styles.label}>
                            Poste recherché <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="poste_recherche"
                            type="text"
                            value={poste_recherche}
                            onChange={(e) => setPoste(e.target.value)}
                            placeholder="Ex : Développeur web"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Niveau d'études */}
                    <div style={styles.champ}>
                        <label htmlFor="niveau_etudes" style={styles.label}>
                            Niveau d'études <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="niveau_etudes"
                            type="text"
                            value={niveau_etudes}
                            onChange={(e) => setNiveau(e.target.value)}
                            placeholder="Ex : Bac+2, Licence"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Date de candidature */}
                    <div style={styles.champ}>
                        <label htmlFor="date_candidature" style={styles.label}>
                            Date de candidature <span style={styles.obligatoire}>*</span>
                        </label>
                        <input
                            id="date_candidature"
                            type="date"
                            value={date_candidature}
                            onChange={(e) => setDateCand(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Statut */}
                    <div style={styles.champ}>
                        <label htmlFor="statut" style={styles.label}>
                            Statut <span style={styles.obligatoire}>*</span>
                        </label>
                        <select
                            id="statut"
                            value={statut}
                            onChange={(e) => setStatut(e.target.value)}
                            style={styles.input}
                        >
                            {STATUTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Boutons */}
                <div style={styles.boutons}>
                    <button
                        type="submit"
                        disabled={chargement}
                        style={{
                            ...styles.boutonSoumettre,
                            opacity: chargement ? 0.7 : 1,
                            cursor: chargement ? "not-allowed" : "pointer"
                        }}
                    >
                        {chargement
                            ? "Enregistrement..."
                            : modeModification ? "✓ Enregistrer les modifications" : "➕ Ajouter le candidat"
                        }
                    </button>

                    {/* Bouton annuler — uniquement en mode modification */}
                    {modeModification && onAnnuler && (
                        <button
                            type="button"
                            onClick={onAnnuler}
                            style={styles.boutonAnnuler}
                        >
                            Annuler
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    titre: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: "#1a3c6e",
        marginBottom: "1rem"
    },
    alerte: {
        backgroundColor: "#fdecea",
        color: "#c0392b",
        border: "1px solid #f5c6c6",
        borderRadius: "6px",
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        fontSize: "0.9rem"
    },
    succes: {
        backgroundColor: "#eafaf1",
        color: "#1e8449",
        border: "1px solid #a9dfbf",
        borderRadius: "6px",
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        fontSize: "0.9rem"
    },
    formulaire: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    },
    grille: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem"
    },
    champ: {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem"
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#333"
    },
    obligatoire: {
        color: "#e74c3c"
    },
    input: {
        padding: "0.6rem 0.8rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "0.9rem",
        outline: "none"
    },
    boutons: {
        display: "flex",
        gap: "0.75rem",
        marginTop: "0.5rem"
    },
    boutonSoumettre: {
        backgroundColor: "#1a3c6e",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "0.7rem 1.4rem",
        fontSize: "0.95rem",
        fontWeight: "600"
    },
    boutonAnnuler: {
        backgroundColor: "#ecf0f1",
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "0.7rem 1.2rem",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default CandidatForm;
