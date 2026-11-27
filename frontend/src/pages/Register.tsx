import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [nom, setNom]               = useState("");
    const [email, setEmail]           = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [erreur, setErreur]         = useState("");
    const [succes, setSucces]         = useState(false);
    const [chargement, setChargement] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErreur("");

        // Validations côté client
        if (!nom.trim() || !email.trim() || !motDePasse || !confirmation) {
            setErreur("Tous les champs sont obligatoires.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErreur("Format de l'email invalide.");
            return;
        }
        if (motDePasse.length < 6) {
            setErreur("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        if (motDePasse !== confirmation) {
            setErreur("Les mots de passe ne correspondent pas.");
            return;
        }

        setChargement(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth/inscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom: nom.trim(), email: email.trim(), mot_de_passe: motDePasse })
            });

            const data = await response.json();

            if (!response.ok) {
                setErreur(data.message || "Erreur lors de la création du compte.");
                return;
            }

            setSucces(true);
            // Redirection vers la connexion après 2 secondes
            setTimeout(() => navigate("/login"), 2000);

        } catch {
            setErreur("Impossible de contacter le serveur.");
        } finally {
            setChargement(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.carte}>

                {/* En-tête */}
                <div style={styles.entete}>
                    <h1 style={styles.titre}>Créer un compte</h1>
                    <p style={styles.sousTitre}>Groupe BEZOK — Service RH</p>
                </div>

                {/* Message succès */}
                {succes && (
                    <div style={styles.succes}>
                        ✅ Compte créé avec succès ! Redirection vers la connexion...
                    </div>
                )}

                {/* Message erreur */}
                {erreur && (
                    <div style={styles.alerte} role="alert">⚠ {erreur}</div>
                )}

                {/* Formulaire */}
                {!succes && (
                    <form onSubmit={handleSubmit} noValidate style={styles.formulaire}>

                        <div style={styles.champ}>
                            <label htmlFor="nom" style={styles.label}>
                                Nom complet <span style={styles.requis}>*</span>
                            </label>
                            <input
                                id="nom"
                                type="text"
                                value={nom}
                                onChange={e => setNom(e.target.value)}
                                placeholder="Ex : Admin BEZOK"
                                style={styles.input}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div style={styles.champ}>
                            <label htmlFor="email" style={styles.label}>
                                Adresse email <span style={styles.requis}>*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@bezok.com"
                                style={styles.input}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div style={styles.champ}>
                            <label htmlFor="motDePasse" style={styles.label}>
                                Mot de passe <span style={styles.requis}>*</span>
                            </label>
                            <input
                                id="motDePasse"
                                type="password"
                                value={motDePasse}
                                onChange={e => setMotDePasse(e.target.value)}
                                placeholder="Min. 6 caractères"
                                style={styles.input}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div style={styles.champ}>
                            <label htmlFor="confirmation" style={styles.label}>
                                Confirmer le mot de passe <span style={styles.requis}>*</span>
                            </label>
                            <input
                                id="confirmation"
                                type="password"
                                value={confirmation}
                                onChange={e => setConfirmation(e.target.value)}
                                placeholder="Répéter le mot de passe"
                                style={{
                                    ...styles.input,
                                    borderColor: confirmation && confirmation !== motDePasse ? "#ef4444" : ""
                                }}
                                autoComplete="new-password"
                                required
                            />
                            {confirmation && confirmation !== motDePasse && (
                                <span style={styles.indicateur}>Les mots de passe ne correspondent pas</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={chargement}
                            style={{ ...styles.bouton, opacity: chargement ? 0.7 : 1 }}
                        >
                            {chargement ? "Création en cours..." : "Créer le compte"}
                        </button>

                    </form>
                )}

                {/* Lien retour connexion */}
                <p style={styles.lienRetour}>
                    Déjà un compte ?{" "}
                    <Link to="/login" style={styles.lien}>Se connecter</Link>
                </p>

            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1f5f9",
        fontFamily: "Segoe UI, Arial, sans-serif",
        padding: "1rem"
    },
    carte: {
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "440px"
    },
    entete: { textAlign: "center", marginBottom: "1.75rem" },
    logoZone: { display: "flex", justifyContent: "center", marginBottom: "0.75rem" },
    titre: { fontSize: "1.5rem", fontWeight: "bold", color: "#0f2044", margin: 0 },
    sousTitre: { color: "#64748b", fontSize: "0.85rem", marginTop: "0.3rem" },
    alerte: {
        backgroundColor: "#fef2f2", color: "#b91c1c",
        border: "1px solid #fca5a5", borderRadius: "8px",
        padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.875rem"
    },
    succes: {
        backgroundColor: "#f0fdf4", color: "#15803d",
        border: "1px solid #86efac", borderRadius: "8px",
        padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.875rem",
        textAlign: "center"
    },
    formulaire: { display: "flex", flexDirection: "column", gap: "1.1rem" },
    champ: { display: "flex", flexDirection: "column", gap: "0.35rem" },
    label: { fontSize: "0.875rem", fontWeight: "600", color: "#334155" },
    requis: { color: "#ef4444" },
    input: {
        padding: "0.65rem 0.9rem",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "0.9rem",
        outline: "none",
        transition: "border-color 0.2s"
    },
    indicateur: { fontSize: "0.75rem", color: "#ef4444" },
    bouton: {
        marginTop: "0.5rem",
        padding: "0.75rem",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer"
    },
    lienRetour: {
        textAlign: "center",
        marginTop: "1.5rem",
        fontSize: "0.875rem",
        color: "#64748b"
    },
    lien: { color: "#2563eb", fontWeight: "600", textDecoration: "none" }
};

export default Register;
