import express from "express";
import pool from "../config/db.js";
import verifierToken from "../middlewares/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/statistiques
// Retourne les 4 compteurs du tableau de bord en une requête
// ─────────────────────────────────────────────────────────────
router.get("/statistiques", verifierToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*)                                            AS total,
                COUNT(*) FILTER (WHERE statut = 'présélectionné')  AS preselectionnes,
                COUNT(*) FILTER (WHERE statut = 'retenu')          AS retenus,
                COUNT(*) FILTER (WHERE statut = 'non retenu')      AS non_retenus
            FROM candidats
        `);
        res.json({
            total:          Number(result.rows[0].total),
            preselectionnes: Number(result.rows[0].preselectionnes),
            retenus:        Number(result.rows[0].retenus),
            non_retenus:    Number(result.rows[0].non_retenus)
        });
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
});

export default router;
