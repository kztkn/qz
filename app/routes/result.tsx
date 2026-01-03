import { useLocation, Link } from "react-router";

export default function Result() {
    const location = useLocation();
    // stateがない場合の初期値
    const { score, total } = location.state || { score: 0, total: 0 };
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // スコアに応じたメッセージ
    const getMessage = () => {
        if (percentage === 100) return "完璧です！全問正解！";
        if (percentage >= 70) return "すごい！あともう少し！";
        if (percentage >= 40) return "いい感じですね！";
        return "次はもっと頑張りましょう！";
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
                    <Link to="/quiz" style={primaryButtonStyle}>
                        もう一度挑戦する
                    </Link>
                    <Link to="/create" style={secondaryButtonStyle}>
                        新しいクイズを作る
                    </Link>
                    <Link to="/" style={textLinkStyle}>
                        トップページに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (Quiz/Createと共通) ---

const containerStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    display: "flex",
    alignItems: "center",
};

const cardStyle: React.CSSProperties = {
    maxWidth: "500px",
    width: "100%",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    textAlign: "center",
};

const titleStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "30px",
};

const resultSectionStyle: React.CSSProperties = {
    marginBottom: "30px",
};

const percentageCircleStyle: React.CSSProperties = {
    fontSize: "4rem",
    fontWeight: "800",
    color: "#007bff",
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
};

const percentageNumberStyle: React.CSSProperties = {
    lineHeight: "1",
};

const percentageUnitStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    marginLeft: "4px",
};

const scoreTextStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    color: "#555",
    marginTop: "10px",
};

const messageStyle: React.CSSProperties = {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "40px",
};

const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const primaryButtonStyle: React.CSSProperties = {
    padding: "16px",
    backgroundColor: "#007bff",
    color: "#white",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 4px 6px rgba(0,123,255,0.2)",
};

const secondaryButtonStyle: React.CSSProperties = {
    padding: "16px",
    backgroundColor: "#f0f7ff",
    color: "#007bff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    border: "1px solid #cce5ff",
};

const textLinkStyle: React.CSSProperties = {
    marginTop: "10px",
    color: "#999",
    textDecoration: "none",
    fontSize: "14px",
};