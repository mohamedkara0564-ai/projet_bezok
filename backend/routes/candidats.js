import express from "express";
import pool from "../config/db.js";
import verifierToken from "../middlewares/auth.js";

const router = express.Router();

const STATUTS_AUTORISES = [
    "candidature reçue", "présélectionné", "convoqué",
    "test effectué", "retenu", "non retenu"
];

// Validation d'un entier positif pour les :id
function idValide(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// ─────────────────────────────────────────────────────────────
// GET /api/candidats
// Liste tous les candidats avec filtres optionnels :
//   ?nom=    recherche partielle ILIKE
//   ?poste=  filtre exact
//   ?statut= filtre exact
// ─────────────────────────────────────────────────────────────
router.get("/", verifierToken, async (req, res) => {
    try {
        const { nom, poste, statut } = req.query;
        const conditions = [];
        const params = [];

        if (nom?.trim()) {
            params.push(`%${nom.trim()}%`);
            conditions.push(`nom_prenoms ILIKE $${params.length}`);
        }
        if (poste?.trim()) {
            params.push(poste.trim());
            conditions.push(`poste_recherche = $${params.length}`);
        }
        if (statut?.trim()) {
            params.push(statut.trim());
            conditions.push(`statut = $${params.length}`);
        }

        const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
        const result = await pool.query(
            `SELECT * FROM candidats ${where} ORDER BY id DESC`,
            params
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des candidats" });
    }
});

// ─────────────────────────────────────────────────────────────
// POST /api/candidats — Enregistrer un candidat
// ─────────────────────────────────────────────────────────────
router.post("/", verifierToken, async (req, res) => {
    try {
        const { nom_prenoms, telephone, email, poste_recherche, niveau_etudes, statut, date_candidature } = req.body;

        // Champs obligatoires
        if (!nom_prenoms?.trim() || !telephone?.trim() || !email?.trim() || !poste_recherche?.trim() || !niveau_etudes?.trim()) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
        }

        // Longueur maximale (cohérent avec les VARCHAR en base)
        if (nom_prenoms.trim().length > 150) return res.status(400).json({ message: "Nom trop long (max 150 caractères)" });
        if (poste_recherche.trim().length > 100) return res.status(400).json({ message: "Poste trop long (max 100 caractères)" });

        // Format email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Format de l'email invalide" });
        }

        // Format téléphone : + optionnel, 8 à 15 chiffres
        const telNettoye = telephone.replace(/[\s\-]/g, "");
        if (!/^\+?\d{8,15}$/.test(telNettoye)) {
            return res.status(400).json({ message: "Format du téléphone invalide (8 à 15 chiffres)" });
        }

        // Unicité email
        const emailExistant = await pool.query("SELECT id FROM candidats WHERE email = $1", [email]);
        if (emailExistant.rows.length > 0) {
            return res.status(409).json({ message: "Un candidat avec cet email existe déjà" });
        }

        const statutFinal = statut && STATUTS_AUTORISES.includes(statut) ? statut : "candidature reçue";

        const result = await pool.query(`
            INSERT INTO candidats (nom_prenoms, telephone, email, poste_recherche, niveau_etudes, statut, date_candidature)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [nom_prenoms.trim(), telNettoye, email.trim(), poste_recherche.trim(), niveau_etudes.trim(), statutFinal, date_candidature || new Date()]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({ message: "Erreur lors de l'enregistrement" });
    }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/candidats/:id — Modifier un candidat
// ─────────────────────────────────────────────────────────────
router.put("/:id", verifierToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Valider que :id est un entier
        if (!idValide(id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }

        const { nom_prenoms, telephone, email, poste_recherche, niveau_etudes, statut, date_candidature } = req.body;

        if (!nom_prenoms?.trim() || !telephone?.trim() || !email?.trim() || !poste_recherche?.trim() || !niveau_etudes?.trim() || !statut) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
        }

        if (!STATUTS_AUTORISES.includes(statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Format de l'email invalide" });
        }

        const telNettoye = telephone.replace(/[\s\-]/g, "");
        if (!/^\+?\d{8,15}$/.test(telNettoye)) {
            return res.status(400).json({ message: "Format du téléphone invalide (8 à 15 chiffres)" });
        }

        // Unicité email (exclure le candidat lui-même)
        const emailExistant = await pool.query(
            "SELECT id FROM candidats WHERE email = $1 AND id != $2",
            [email, id]
        );
        if (emailExistant.rows.length > 0) {
            return res.status(409).json({ message: "Un autre candidat utilise déjà cet email" });
        }

        const result = await pool.query(`
            UPDATE candidats
            SET nom_prenoms = $1, telephone = $2, email = $3,
                poste_recherche = $4, niveau_etudes = $5, statut = $6, date_candidature = $7
            WHERE id = $8
            RETURNING *
        `, [nom_prenoms.trim(), telNettoye, email.trim(), poste_recherche.trim(), niveau_etudes.trim(), statut, date_candidature || new Date(), id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Candidat introuvable" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({ message: "Erreur lors de la modification" });
    }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/candidats/:id — Supprimer un candidat
// ─────────────────────────────────────────────────────────────
router.delete("/:id", verifierToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValide(id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }

        const result = await pool.query(
            "DELETE FROM candidats WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Candidat introuvable" });
        }

        res.json({ message: "Candidat supprimé avec succès" });
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
});

export default router;
