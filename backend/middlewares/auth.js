import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────────────────────
// Middleware verifierToken
// Vérifie que la requête contient un token JWT valide
// Usage : ajouter verifierToken avant le handler d'une route
//   ex : app.get("/api/candidats", verifierToken, async (req, res) => { ... })
// ─────────────────────────────────────────────────────────────
const verifierToken = (req, res, next) => {
    // Le token est envoyé dans le header sous la forme :
    // Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Accès refusé : token manquant" });
    }

    // On sépare "Bearer" du token lui-même
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé : format du token invalide" });
    }

    try {
        // jwt.verify() décode le token et vérifie sa signature
        // Si le token a expiré ou a été falsifié, il lève une erreur
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // On attache les infos de l'utilisateur à la requête
        // Les routes suivantes peuvent y accéder via req.utilisateur
        req.utilisateur = decoded;

        // On passe au handler suivant
        next();

    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

export default verifierToken;
