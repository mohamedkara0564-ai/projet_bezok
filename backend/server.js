import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRouter from "./routes/auth.js";
import verifierToken from "./middlewares/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ── Routes d'authentification (publiques, pas de token requis) ──
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.json({
        message: "API BEZOK opérationnelle"
    });
});

app.get("/api/candidats", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query("SELECT * FROM candidats ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération des candidats"
        });
    }
});

app.get("/api/candidats/total", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query("SELECT COUNT(*) AS total FROM candidats")
        res.json({
            total: Number(result.rows[0].total)
        });
    } catch (error) {
        console.error("Erreur : ", error.message);
        res.status(500).json({message: "Erreur lors de la récupération du total"});
    }
});

app.get("/api/candidats/statistiques", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query("SELECT statut, COUNT(*) AS total FROM candidats GROUP BY statut")
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur : ", error.message);
        res.status(500).json({
            message: "Erreur lors de la recupération"
        });
    }
});

app.get("/api/candidats/retenus", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query(`
            SELECT * 
            FROM candidats 
            WHERE statut = 'retenu'
        `)
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({message: "Erreur lors de la recuperation"})
    }
});

app.get("/api/candidats/poste/:poste", verifierToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM candidats
            WHERE poste_recherche = $1
        `, [req.params.poste]);

        res.json(result.rows);

    } catch (error) {
        console.error("Erreur :", error.message);

        res.status(500).json({
            message: "Erreur lors de la récupération"
        });
    }
});

app.get("/api/candidats/recherche", verifierToken, async (req, res) => {
    try {
        const nom = req.query.nom?.trim();
        if (!nom) {
            return res.status(400).json({
                message: "Veuillez renseigner un nom"
            });
        }
        const result = await pool.query(`
            SELECT *
            FROM candidats
            WHERE nom_prenoms ILIKE $1
        `, [`%${nom}%`]);

        res.json(result.rows);

    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération"
        });
    }
});

app.post("/api/candidats", verifierToken, async(req, res)=>{
    try {
        const {nom_prenoms, telephone, email, poste_recherche, niveau_etudes, statut} = req.body;
        if (!nom_prenoms || !telephone || !email || !poste_recherche || !niveau_etudes){
           return res.status(400).json({message: "Veuiller remplir les champs obligatoires"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Votre email est invalide"
            });
        }
        const telephoneRegex = /^[0-9]+$/;

        if (!telephoneRegex.test(telephone)) {
            return res.status(400).json({
                message: "Le numéro de téléphone doit contenir uniquement des chiffres"
            });
        }

        // Vérifier qu'un candidat avec cet email n'existe pas déjà
        const emailExistant = await pool.query(
            "SELECT id FROM candidats WHERE email = $1",
            [email]
        );
        if (emailExistant.rows.length > 0) {
            return res.status(409).json({
                message: "Un candidat avec cet email existe déjà"
            });
        }

        const statutsAutorises = [
            "candidature reçue", "présélectionné", "convoqué",
            "test effectué", "retenu", "non retenu"
        ];
        // Si statut fourni et invalide → erreur. Sinon on force "candidature reçue"
        const statutFinal = statut && statutsAutorises.includes(statut)
            ? statut
            : "candidature reçue";

        const result = await pool.query(`
            INSERT INTO candidats(
            nom_prenoms,
            telephone,
            email,
            poste_recherche,
            niveau_etudes,
            statut
            )
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *
       `,[
            nom_prenoms,
            telephone,
            email,
            poste_recherche,
            niveau_etudes,
            statutFinal
        ]);
       res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur :", error.message)
        res.status(500).json({message: "Erreur lors de l'enregistrement"})
    }
})

app.put("/api/candidats/:id", verifierToken, async (req, res) => {
    try {
        const id = req.params.id;

        const {
            nom_prenoms,
            telephone,
            email,
            poste_recherche,
            niveau_etudes,
            statut
        } = req.body;

        if (!nom_prenoms || !telephone || !email || !poste_recherche || !niveau_etudes || !statut) {
            return res.status(400).json({
                message: "Veuillez remplir les champs obligatoires"
            });
        }
        const statutsAutorises = [
            "candidature reçue",
            "présélectionné",
            "convoqué",
            "test effectué",
            "retenu",
            "non retenu"
        ];

        if (!statutsAutorises.includes(statut)) {
            return res.status(400).json({
                message: "Statut invalide"
            });
        }

        // Vérifier qu'aucun AUTRE candidat n'utilise déjà cet email
        const emailExistant = await pool.query(
            "SELECT id FROM candidats WHERE email = $1 AND id != $2",
            [email, id]
        );
        if (emailExistant.rows.length > 0) {
            return res.status(409).json({
                message: "Un autre candidat utilise déjà cet email"
            });
        }
        const result = await pool.query(`
            UPDATE candidats
            SET
                nom_prenoms = $1,
                telephone = $2,
                email = $3,
                poste_recherche = $4,
                niveau_etudes = $5,
                statut = $6
            WHERE id = $7
            RETURNING *
        `, [
            nom_prenoms,
            telephone,
            email,
            poste_recherche,
            niveau_etudes,
            statut,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Candidat introuvable"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({
            message: "Erreur lors de la modification"
        });
    }
});

app.delete("/api/candidats/:id", verifierToken, async(req, res)=>{
    try {
        const id = req.params.id;
        const result = await pool.query(`
        DELETE FROM candidats
        WHERE id = $1
        RETURNING *
        `, [id]);
        if(result.rows.length === 0){
            return res.status(404).json({message: "Candidat introuvable"})
        }
        res.json({message: "Candidat supprimé"})
    } catch (error) {
        console.error("Erreur :", error.message)
        res.status(500).json({message: "Erreur lors de la suppression"})
    }
});

app.get("/api/candidats/statut/:statut", verifierToken, async (req, res) => {
    try {
        const statut = req.params.statut;

        const result = await pool.query(`
            SELECT *
            FROM candidats
            WHERE statut = $1
        `, [statut]);

        res.json(result.rows);

    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération"
        });
    }
});

app.get("/api/candidats/filtre", verifierToken, async (req, res) => {
    try {
        const poste = req.query.poste;
        const statut = req.query.statut;

        const result = await pool.query(`
            SELECT *
            FROM candidats
            WHERE poste_recherche = $1
            AND statut = $2
        `, [poste, statut]);

        res.json(result.rows);

    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération"
        });
    }
});

app.get("/api/dashboard", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query(`
            SELECT COUNT(*) AS total
            FROM candidats
        `);
        res.json({
            total: Number(result.rows[0].total)
        })
    } catch (error) {
        console.error("Erreur :", error.message)
        res.status(500).json({message: "Erreur lors de la récupération"})
    }
});

app.get("/api/dashboard/statistiques", verifierToken, async(req, res)=>{
    try {
        const result = await pool.query(`
            SELECT COUNT(*) AS total, 
            COUNT(*) FILTER (WHERE statut = 'présélectionné') AS preselectionnes,
            COUNT(*) FILTER (WHERE statut = 'retenu') AS retenus,
            COUNT(*) FILTER (WHERE statut = 'non retenu') AS non_retenus
            FROM candidats
        `);
        res.json({
            total: Number(result.rows[0].total),
            preselectionnes: Number(result.rows[0].preselectionnes),
            retenus: Number(result.rows[0].retenus),
            non_retenus: Number(result.rows[0].non_retenus)
        });
    } catch (error) {
        console.error("Erreur :", error.message)
        res.status(500).json({message: "Erreur lors de la récupération"})   
    }
})

app.get("/api/test-db", verifierToken, async(req, res)=>{
    try{
        const result = await pool.query("SELECT NOW() AS date_actuelle");
        res.json({
            message:"Connexion PostgreSQL réussie",
            date: result.rows[0].date_actuelle
        });
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Erreur de connexion à la base de données"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});

