import Navbar from "./Navbar";

interface Props {
    children: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────
// Layout
// Enveloppe les pages internes avec la Navbar + zone de contenu
// Usage dans App.tsx :
//   <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
// ─────────────────────────────────────────────────────────────
function Layout({ children }: Props) {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
            <Navbar />
            <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                {children}
            </main>
        </div>
    );
}

export default Layout;
