import { useLocation, Link } from "react-router";

export default function Result() {
    const location = useLocation();
    const { score, total } = location.state || { score: 0, total: 0 };

    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
            <h1>結果発表</h1>
            <p style={{ fontSize: "2rem" }}>{total}問中 {score}問正解！</p>
            <Link to="/" style={{ color: "#007bff" }}>トップに戻る</Link>
        </div>
    );
}