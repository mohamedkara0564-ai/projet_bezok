import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(false);

    // useAuth() nous donne accès à la fonction connexion() du contexte
    const { connexion } = useAuth();

    // useNavigate() permet de rediriger vers une autre page
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErreur("");

        // Validation basique côté client
        if (!email.trim() || !motDePasse.trim()) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        setChargement(true);

        try {
            // On appelle la fonction du contexte qui appelle authService
            await connexion(email.trim(), motDePasse);

            // Connexion réussie → on redirige vers le tableau de bord
            navigate("/dashboard");

        } catch (error) {
            // Le message vient du backend ("Identifiants incorrects", etc.)
            setErreur(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue. Veuillez réessayer."
            );
        } finally {
            setChargement(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.carte}>

                {/* Logo / Titre */}
                <div style={styles.entete}>
                    <h1 style={styles.titre}>GROUPE BEZOK</h1>
                    <p style={styles.sousTitre}>Gestion des candidatures – Service RH</p>
                </div>

                {/* Message d'erreur */}
                {erreur && (
                    <div style={styles.alerte} role="alert">
                        ⚠ {erreur}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} noValidate style={styles.formulaire}>

                    <div style={styles.champ}>
                        <label htmlFor="email" style={styles.label}>
                            Adresse email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@bezok.com"
                            style={styles.input}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div style={styles.champ}>
                        <label htmlFor="motDePasse" style={styles.label}>
                            Mot de passe
                        </label>
                        <input
                            id="motDePasse"
                            type="password"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="••••••••"
                            style={styles.input}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={chargement}
                        style={{
                            ...styles.bouton,
                            opacity: chargement ? 0.7 : 1,
                            cursor: chargement ? "not-allowed" : "pointer"
                        }}
                    >
                        {chargement ? "Connexion en cours..." : "Se connecter"}
                    </button>

                </form>
            </div>
        </div>
    );
}

// ─── Styles inline ───────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f4f8",
        fontFamily: "Segoe UI, Arial, sans-serif"
    },
    carte: {
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "420px"
    },
    entete: {
        textAlign: "center",
        marginBottom: "2rem"
    },
    titre: {
        fontSize: "1.6rem",
        fontWeight: "bold",
        color: "#1a3c6e",
        margin: 0
    },
    sousTitre: {
        color: "#666",
        fontSize: "0.9rem",
        marginTop: "0.4rem"
    },
    alerte: {
        backgroundColor: "#fdecea",
        color: "#c0392b",
        border: "1px solid #f5c6c6",
        borderRadius: "6px",
        padding: "0.75rem 1rem",
        marginBottom: "1.2rem",
        fontSize: "0.9rem"
    },
    formulaire: {
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem"
    },
    champ: {
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem"
    },
    label: {
        display:"flex",
        flexDirection: "initial",
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#333"
    },
    input: {
        padding: "0.65rem 0.9rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "0.95rem",
        outline: "none",
        transition: "border-color 0.2s"
    },
    bouton: {
        marginTop: "0.5rem",
        padding: "0.75rem",
        backgroundColor: "#1a3c6e",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        fontWeight: "600",
        transition: "background-color 0.2s"
    }
};

export default Login;
