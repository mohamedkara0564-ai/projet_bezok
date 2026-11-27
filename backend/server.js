import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRouter      from "./routes/auth.js";
import candidatsRouter from "./routes/candidats.js";
import dashboardRouter from "./routes/dashboard.js";

dotenv.config();

// ── Garde : refuser de démarrer sans JWT_SECRET ───────────────
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET est manquant dans le fichier .env");
}

const app = express();

// ── Sécurité HTTP (headers) ───────────────────────────────────
app.use(helmet());

// ── CORS restreint au frontend ────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

// ── Limitation de tentatives sur la connexion ─────────────────
// Max 10 tentatives par IP toutes les 15 minutes
const limiteConnexion = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Trop de tentatives de connexion. Réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false
});
app.use("/api/auth/connexion", limiteConnexion);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",      authRouter);
app.use("/api/candidats", candidatsRouter);
app.use("/api/dashboard", dashboardRouter);

// ── Route de santé (publique) ─────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "API BEZOK opérationnelle" });
});

// ── Démarrage ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
