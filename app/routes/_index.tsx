import { Link } from "react-router";

export default function Index() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
            <h1>🚀 React Quiz</h1>
            <p>全3問のクイズに挑戦しましょう！</p>
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