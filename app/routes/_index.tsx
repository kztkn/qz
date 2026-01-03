import { Link } from "react-router";

export default function Index() {
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={iconContainerStyle}>🐢</div>
                <h1 style={titleStyle}>かずとクイズ</h1>
                <p style={descriptionStyle}>
                    全問正解できるかな？<br />
                    オリジナルクイズの作成もできるよ
                </p>

                <div style={buttonGroupStyle}>
                    <Link to="/quiz" style={primaryButtonStyle}>
                        クイズを始める
                    </Link>

                    <Link to="/create" style={secondaryButtonStyle}>
                        クイズを作成する
                    </Link>
                </div>

                <div style={footerStyle}>
                    Powered by Supabase & React Router
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (他の画面と統一) ---

const containerStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "#fff",
    padding: "50px 30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
};

const iconContainerStyle: React.CSSProperties = {
    fontSize: "50px",
    marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    color: "#333",
    margin: "0 0 10px 0",
    fontWeight: "800",
};

const descriptionStyle: React.CSSProperties = {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "40px",
};

const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const primaryButtonStyle: React.CSSProperties = {
    padding: "18px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "transform 0.2s",
    boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
};

const secondaryButtonStyle: React.CSSProperties = {
    padding: "18px",
    backgroundColor: "#fff",
    color: "#28a745",
    textDecoration: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
    border: "2px solid #28a745",
    transition: "all 0.2s",
};

const footerStyle: React.CSSProperties = {
    marginTop: "40px",
    fontSize: "12px",
    color: "#bbb",
    letterSpacing: "0.5px",
};