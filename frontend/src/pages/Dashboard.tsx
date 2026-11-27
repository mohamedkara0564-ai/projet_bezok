import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getStatistiques, getCandidats } from "../services/candidatService";
import { useAuth } from "../context/AuthContext";
import type { Candidat } from "../types/candidat";

interface Statistiques {
    total: number;
    preselectionnes: number;
    retenus: number;
    non_retenus: number;
}

// Couleurs des statuts — cohérentes avec CandidatTable
const COULEURS_STATUT: Record<string, string> = {
    "candidature reçue": "#2563eb",
    "présélectionné":    "#22c55e",
    "convoqué":          "#f59e0b",
    "test effectué":     "#06b6d4",
    "retenu":            "#16a34a",
    "non retenu":        "#ef4444"
};

// ── Composant Donut SVG ───────────────────────────────────────
function DonutChart({ stats }: { stats: Statistiques }) {
    const total = stats.total || 1;

    const segments = [
        { label: "Candidature reçue", valeur: total - stats.preselectionnes - stats.retenus - stats.non_retenus, couleur: "#2563eb" },
        { label: "Présélectionné",    valeur: stats.preselectionnes, couleur: "#22c55e" },
        { label: "Retenu",            valeur: stats.retenus,         couleur: "#f59e0b" },
        { label: "Non retenu",        valeur: stats.non_retenus,     couleur: "#ef4444" }
    ].filter(s => s.valeur > 0);

    // Calcul des arcs SVG
    const rayon = 70;
    const cx = 90;
    const cy = 90;
    const epaisseur = 28;

    let angleDebut = -Math.PI / 2;
    const arcs = segments.map(seg => {
        const fraction = seg.valeur / total;
        const angleFin = angleDebut + fraction * 2 * Math.PI;
        const x1 = cx + rayon * Math.cos(angleDebut);
        const y1 = cy + rayon * Math.sin(angleDebut);
        const x2 = cx + rayon * Math.cos(angleFin);
        const y2 = cy + rayon * Math.sin(angleFin);
        const grand = fraction > 0.5 ? 1 : 0;
        const path = `M ${x1} ${y1} A ${rayon} ${rayon} 0 ${grand} 1 ${x2} ${y2}`;
        const arc = { ...seg, path, fraction };
        angleDebut = angleFin;
        return arc;
    });

    return (
        <div style={stylesD.donutZone}>
            <svg width="180" height="180" viewBox="0 0 180 180">
                {arcs.map((arc, i) => (
                    <path
                        key={i}
                        d={arc.path}
                        fill="none"
                        stroke={arc.couleur}
                        strokeWidth={epaisseur}
                    />
                ))}
                {/* Texte central */}
                <text x="90" y="85" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#1a3c6e">{total}</text>
                <text x="90" y="103" textAnchor="middle" fontSize="11" fill="#888">Total</text>
            </svg>

            {/* Légende */}
            <div style={stylesD.legende}>
                {segments.map((seg, i) => (
                    <div key={i} style={stylesD.legendeItem}>
                        <span style={{ ...stylesD.legendePuce, backgroundColor: seg.couleur }} />
                        <span style={stylesD.legendeTexte}>
                            {seg.label} — {seg.valeur} ({Math.round(seg.valeur / total * 100)} %)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Composant carte stat ──────────────────────────────────────
function CarteStat({ icone, label, valeur, couleur, bordure }: {
    icone: string; label: string; valeur: number; couleur: string; bordure: string;
}) {
    return (
        <div style={{ ...stylesD.carte, borderLeft: `4px solid ${bordure}` }}>
            <div style={{ ...stylesD.carteIcone, backgroundColor: couleur }}>
                <span style={{ fontSize: "1.4rem" }}>{icone}</span>
            </div>
            <div>
                <p style={stylesD.carteLabel}>{label}</p>
                <p style={{ ...stylesD.carteValeur, color: bordure }}>{valeur}</p>
            </div>
        </div>
    );
}

// ── Page Dashboard ────────────────────────────────────────────
function Dashboard() {
    const { utilisateur } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // écoute les changements d'URL
    const [stats, setStats]           = useState<Statistiques | null>(null);
    const [candidats, setCandidats]   = useState<Candidat[]>([]);
    const [erreur, setErreur]         = useState("");
    const [page, setPage]             = useState(1);
    const parPage = 5;

    // Se déclenche à chaque fois que le Dashboard devient actif
    // (montage initial + retour depuis une autre page)
    useEffect(() => {
        charger();
    }, [location.pathname]);

    async function charger() {
        setErreur("");
        try {
            const [s, c] = await Promise.all([getStatistiques(), getCandidats()]);
            setStats(s);
            setCandidats(c);
        } catch {
            setErreur("Impossible de charger les données.");
        }
    }

    const totalPages = Math.ceil(candidats.length / parPage);
    const candidatsPage = candidats.slice((page - 1) * parPage, page * parPage);

    return (
        <div style={stylesD.page}>

            {/* ── Bannière hero ── */}
            <div style={stylesD.hero}>
                <div style={stylesD.heroGauche}>
                    <div style={stylesD.heroTitreZone}>
                        <span style={{ fontSize: "2.5rem" }}>👥</span>
                        <div>
                            <h1 style={stylesD.heroTitre}>Tableau de bord</h1>
                            <p style={stylesD.heroSous}>Suivi des candidatures – Groupe BEZOK</p>
                        </div>
                    </div>
                    
                </div>
                {/* Décoration droite */}
                <div style={stylesD.heroDeco}>
                    <span style={stylesD.heroDecoTexte}>BEZOK BTP</span>
                </div>
            </div>

            {/* ── Cartes stats ── */}
            {erreur && <p style={stylesD.erreur}>⚠ {erreur}</p>}

            {stats && (
                <div style={stylesD.grille4}>
                    <CarteStat icone="👥" label="Total candidatures"  valeur={stats.total}           couleur="#dbeafe" bordure="#2563eb" />
                    <CarteStat icone="✅" label="Présélectionnés"      valeur={stats.preselectionnes} couleur="#dcfce7" bordure="#22c55e" />
                    <CarteStat icone="🏆" label="Retenus"              valeur={stats.retenus}         couleur="#fef9c3" bordure="#f59e0b" />
                    <CarteStat icone="❌" label="Non retenus"           valeur={stats.non_retenus}     couleur="#fee2e2" bordure="#ef4444" />
                </div>
            )}

            {/* ── Bas : tableau + donut ── */}
            <div style={stylesD.basZone}>

                {/* Tableau candidatures récentes */}
                <div style={stylesD.tableauZone}>
                    <div style={stylesD.tableauEntete}>
                        <h2 style={stylesD.tableauTitre}>≡ Candidatures récentes</h2>
                    </div>

                    <table style={stylesD.table}>
                        <thead>
                            <tr style={stylesD.thead}>
                                <th style={stylesD.th}>Candidat</th>
                                <th style={stylesD.th}>Poste recherché</th>
                                <th style={stylesD.th}>Date</th>
                                <th style={stylesD.th}>Statut</th>
                                <th style={stylesD.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatsPage.length > 0 ? candidatsPage.map((c, i) => (
                                <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                    <td style={stylesD.td}>
                                        <div style={stylesD.candidatCell}>
                                            <div style={stylesD.avatarMini}>
                                                {c.nom_prenoms.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{c.nom_prenoms}</span>
                                        </div>
                                    </td>
                                    <td style={stylesD.td}>{c.poste_recherche}</td>
                                    <td style={stylesD.td}>
                                        {c.date_candidature
                                            ? new Date(c.date_candidature).toLocaleDateString("fr-FR")
                                            : c.created_at
                                                ? new Date(c.created_at).toLocaleDateString("fr-FR")
                                                : "—"}
                                    </td>
                                    <td style={stylesD.td}>
                                        <span style={{
                                            ...stylesD.badge,
                                            backgroundColor: COULEURS_STATUT[c.statut] + "22",
                                            color: COULEURS_STATUT[c.statut] || "#555",
                                            border: `1px solid ${COULEURS_STATUT[c.statut] || "#ccc"}`
                                        }}>
                                            • {c.statut}
                                        </span>
                                    </td>
                                    <td style={stylesD.td}>
                                        <div style={stylesD.actions}>
                                            <Link to="/candidats" style={stylesD.icoBtn} title="Voir">👁</Link>
                                            <Link to="/candidats" style={{ ...stylesD.icoBtn, color: "#2563eb" }} title="Modifier">✏</Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={stylesD.vide}>Aucun candidat.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {candidats.length > 0 && (
                        <div style={stylesD.pagination}>
                            <span style={stylesD.paginationInfo}>
                                Affichage de {(page - 1) * parPage + 1} à {Math.min(page * parPage, candidats.length)} sur {candidats.length} entrées
                            </span>
                            <div style={stylesD.paginationBtns}>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={stylesD.pagBtn}>‹</button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                    <button key={n} onClick={() => setPage(n)} style={{ ...stylesD.pagBtn, ...(page === n ? stylesD.pagBtnActif : {}) }}>{n}</button>
                                ))}
                                {totalPages > 5 && <span style={stylesD.pagBtn}>...</span>}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={stylesD.pagBtn}>›</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Donut */}
                {stats && (
                    <div style={stylesD.donutCarte}>
                        <h2 style={stylesD.donutTitre}>📊 Répartition des statuts</h2>
                        <DonutChart stats={stats} />
                    </div>
                )}

            </div>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const stylesD: Record<string, React.CSSProperties> = {
    page: { display: "flex", flexDirection: "column", gap: "1.25rem", fontFamily: "Segoe UI, Arial, sans-serif" },
    // Hero
    hero: {
        background: "linear-gradient(135deg, #0f2044 0%, #1a3c6e 60%, #2563eb 100%)",
        borderRadius: "12px",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        minHeight: "110px",
        overflow: "hidden",
        position: "relative"
    },
    heroGauche: { display: "flex", flexDirection: "column", gap: "1rem" },
    heroTitreZone: { display: "flex", alignItems: "center", gap: "1rem" },
    heroTitre: { fontSize: "1.7rem", fontWeight: "bold", margin: 0, color: "#fff" },
    heroSous: { margin: 0, color: "#93c5fd", fontSize: "0.9rem" },
    heroBouton: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "0.6rem 1.2rem",
        fontWeight: "600",
        fontSize: "0.9rem",
        cursor: "pointer",
        alignSelf: "flex-start"
    },
    heroDeco: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "1rem 1.5rem"
    },
    heroDecoTexte: { color: "rgba(255,255,255,0.5)", fontWeight: "bold", fontSize: "1.4rem", letterSpacing: "0.1em" },
    // Stats
    grille4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" },
    carte: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
    },
    carteIcone: {
        width: "48px", height: "48px", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
    },
    carteLabel: { margin: 0, fontSize: "0.8rem", color: "#666", fontWeight: 500 },
    carteValeur: { margin: 0, fontSize: "2rem", fontWeight: "bold", lineHeight: 1.2 },
    // Bas
    basZone: { display: "flex", gap: "1.25rem", alignItems: "flex-start" },
    tableauZone: {
        flex: 1, backgroundColor: "#fff", borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden"
    },
    tableauEntete: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9"
    },
    tableauTitre: { margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1a3c6e" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" },
    thead: { backgroundColor: "#f8fafc" },
    th: { padding: "0.75rem 1rem", textAlign: "left", fontWeight: "600", color: "#555", borderBottom: "1px solid #e2e8f0" },
    td: { padding: "0.7rem 1rem", color: "#333", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
    candidatCell: { display: "flex", alignItems: "center", gap: "0.6rem" },
    avatarMini: {
        width: "30px", height: "30px", borderRadius: "50%",
        backgroundColor: "#1a3c6e", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.8rem", fontWeight: "bold", flexShrink: 0
    },
    badge: {
        display: "inline-block", padding: "0.2rem 0.6rem",
        borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap"
    },
    actions: { display: "flex", gap: "0.4rem" },
    icoBtn: {
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "28px", height: "28px", borderRadius: "6px",
        backgroundColor: "#f1f5f9", textDecoration: "none",
        fontSize: "0.85rem", cursor: "pointer", color: "#555"
    },
    vide: { textAlign: "center", padding: "2rem", color: "#aaa", fontStyle: "italic" },
    // Pagination
    pagination: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.75rem 1.25rem", borderTop: "1px solid #f1f5f9"
    },
    paginationInfo: { fontSize: "0.8rem", color: "#888" },
    paginationBtns: { display: "flex", gap: "0.3rem" },
    pagBtn: {
        minWidth: "30px", height: "30px", padding: "0 0.4rem",
        border: "1px solid #e2e8f0", borderRadius: "6px",
        backgroundColor: "#fff", fontSize: "0.82rem",
        cursor: "pointer", color: "#555", display: "flex", alignItems: "center", justifyContent: "center"
    },
    pagBtnActif: { backgroundColor: "#1a3c6e", color: "#fff", borderColor: "#1a3c6e" },
    // Donut
    donutCarte: {
        width: "280px", flexShrink: 0, backgroundColor: "#0f2044",
        borderRadius: "10px", padding: "1.25rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
    },
    donutTitre: { margin: "0 0 1rem 0", fontSize: "0.95rem", fontWeight: "700", color: "#fff" },
    donutZone: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
    legende: { width: "100%", display: "flex", flexDirection: "column", gap: "0.4rem" },
    legendeItem: { display: "flex", alignItems: "center", gap: "0.5rem" },
    legendePuce: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
    legendeTexte: { fontSize: "0.75rem", color: "#93c5fd" },
    erreur: { color: "#ef4444", backgroundColor: "#fef2f2", padding: "0.75rem", borderRadius: "6px" }
};

export default Dashboard;
