import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

router.post("/inscription", async (req, res) => {
    try {
        const { nom, email, mot_de_passe } = req.body;

        if (!nom || !email || !mot_de_passe) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email invalide" });
        }

        if (mot_de_passe.length < 6) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
        }

        const emailExistant = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );
        if (emailExistant.rows.length > 0) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }

        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

        const result = await pool.query(
            `INSERT INTO users (nom, email, mot_de_passe)
             VALUES ($1, $2, $3)
             RETURNING id, nom, email, created_at`,
            [nom, email, motDePasseHache]
        );

        res.status(201).json({
            message: "Compte créé avec succès",
            utilisateur: result.rows[0]
        });

    } catch (error) {
        console.error("Erreur inscription :", error.message);
        res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
});


router.post("/connexion", async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        // 2. Chercher l'utilisateur par son email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const utilisateur = result.rows[0];

        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

        if (!motDePasseValide) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const token = jwt.sign(
            {
                id: utilisateur.id,
                email: utilisateur.email,
                nom: utilisateur.nom
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token,
            utilisateur: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                email: utilisateur.email
            }
        });

    } catch (error) {
        console.error("Erreur connexion :", error.message);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
});

export default router;
