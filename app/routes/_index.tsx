import { Link } from "react-router";

export default function Index() {
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={iconContainerStyle}>🐢</div>
                <h1 style={titleStyle}>みんなのクイズ</h1>
                <p style={descriptionStyle}>
                    何問正解できるかな？<br />
                    オリジナルクイズの作成もできるよ
                </p>

                <div style={buttonGroupStyle}>
                    <h3 style={{ fontSize: "16px", color: "#888", marginBottom: "5px", textAlign: "center" }}>クイズに挑戦</h3>
                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                        <Link to="/quiz?limit=5" style={{ ...primaryButtonStyle, flex: 1 }}>5問</Link>
                        <Link to="/quiz?limit=10" style={{ ...primaryButtonStyle, flex: 1 }}>10問</Link>
                        <Link to="/quiz" style={{ ...primaryButtonStyle, flex: 1, backgroundColor: "#333", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>全問</Link>
                    </div>

                    <hr style={{ width: "100%", border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

                    <Link to="/create" style={secondaryButtonStyle}>
                        クイズを作成する
                    </Link>
                </div>

                <div style={footerStyle}>
                    Powered by Supabase & React Router<br />
                    <Link to="/admin" style={{ color: "#999", fontSize: "12px", marginTop: "10px", display: "inline-block" }}>
                        管理画面
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (ワンライナー化 & 中央寄せ是正) ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 15px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "500px", backgroundColor: "#fff", padding: "40px 24px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" };
const iconContainerStyle: React.CSSProperties = { fontSize: "60px", marginBottom: "10px", display: "block" };
const titleStyle: React.CSSProperties = { fontSize: "2.2rem", color: "#333", margin: "0 0 15px 0", fontWeight: "800", letterSpacing: "-0.5px" };
const descriptionStyle: React.CSSProperties = { fontSize: "1rem", color: "#666", lineHeight: "1.7", marginBottom: "40px" };
const buttonGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "15px", width: "100%", alignItems: "center" };
const primaryButtonStyle: React.CSSProperties = { padding: "16px 0", backgroundColor: "#007bff", color: "#fff", textDecoration: "none", borderRadius: "14px", fontWeight: "bold", fontSize: "18px", boxShadow: "0 4px 15px rgba(0,123,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" };
const secondaryButtonStyle: React.CSSProperties = { width: "100%", padding: "18px 0", backgroundColor: "#fff", color: "#28a745", textDecoration: "none", borderRadius: "14px", fontWeight: "bold", fontSize: "18px", border: "2px solid #28a745", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" };
const footerStyle: React.CSSProperties = { marginTop: "50px", fontSize: "12px", color: "#bbb", letterSpacing: "0.5px", textAlign: "center" };