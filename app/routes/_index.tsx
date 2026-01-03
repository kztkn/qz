import { Link } from "react-router";

export default function Index() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
            <h1>🚀 かずとクイズ</h1>
            <p>クイズに挑戦しましょう！</p>
            <Link to="/quiz" style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px"
            }}>
                スタート！
            </Link>
        </div>
    );
}