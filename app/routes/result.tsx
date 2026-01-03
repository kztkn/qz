import { useLocation, Link, useNavigate } from "react-router";

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();

    // stateがない場合の初期値
    const { score, total, limit } = location.state || { score: 0, total: 0, limit: 10 };
    const retryPath = limit ? `/quiz?limit=${limit}` : "/quiz";
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // スコアに応じたメッセージ
    const getMessage = () => {
        if (percentage === 100) return "やるじゃん！全問正解！";
        if (percentage >= 70) return "悪くない";
        if (percentage >= 40) return "まだまだだね";
        return "チーン・・・！";
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>結果発表</h1>

                <div style={resultSectionStyle}>
                    <div style={percentageCircleStyle}>
                        <span style={percentageNumberStyle}>{percentage}</span>
                        <span style={percentageUnitStyle}>%</span>
                    </div>
                    <p style={scoreTextStyle}>{total}問中 {score}問正解</p>
                </div>

                <p style={messageStyle}>{getMessage()}</p>

                <div style={buttonGroupStyle}>
                    <button onClick={() => navigate(retryPath)} style={primaryButtonStyle}>
                        もう一度挑戦する
                    </button>
                    <Link to="/" style={textLinkStyle}>
                        トップページに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (最新スタイル基準) ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 15px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "500px", backgroundColor: "#fff", padding: "40px 24px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" };
const titleStyle: React.CSSProperties = { fontSize: "1rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "30px", fontWeight: "bold" };
const resultSectionStyle: React.CSSProperties = { marginBottom: "30px", display: "flex", flexDirection: "column", alignItems: "center" };
const percentageCircleStyle: React.CSSProperties = { fontSize: "5rem", fontWeight: "900", color: "#007bff", display: "flex", justifyContent: "center", alignItems: "baseline", margin: "10px 0", lineHeight: "1" };
const percentageNumberStyle: React.CSSProperties = { letterSpacing: "-2px" };
const percentageUnitStyle: React.CSSProperties = { fontSize: "1.8rem", marginLeft: "4px", fontWeight: "700" };
const scoreTextStyle: React.CSSProperties = { fontSize: "1.2rem", color: "#666", marginTop: "10px", fontWeight: "600" };
const messageStyle: React.CSSProperties = { fontSize: "1.5rem", fontWeight: "800", color: "#333", marginBottom: "40px", lineHeight: "1.4" };
const buttonGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "14px", width: "100%" };

const primaryButtonStyle: React.CSSProperties = { width: "100%", padding: "18px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "16px", fontWeight: "bold", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,123,255,0.3)", transition: "transform 0.1s active" };
const textLinkStyle: React.CSSProperties = { marginTop: "20px", color: "#999", textDecoration: "none", fontSize: "14px", borderBottom: "1px solid #eee", paddingBottom: "2px" };