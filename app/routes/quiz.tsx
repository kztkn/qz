import { useState } from "react";
import { useNavigate, useLoaderData, Link } from "react-router";
import { supabase } from "app/lib/supabase";

export async function clientLoader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limitCount = limitParam ? parseInt(limitParam, 10) : 100;
    // RPCを使用してランダムな問題を取得
    const { data, error } = await supabase.rpc('get_random_questions', { limit_count: limitCount });

    if (error) throw new Error("データの取得に失敗しました");
    return { questions: data };
}

clientLoader.hydrate = true;

export default function Quiz() {
    const { questions } = useLoaderData<{ questions: any[] }>();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    if (!questions || questions.length === 0) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={{ fontSize: "50px", marginBottom: "20px" }}>🔍</div>
                    <p style={{ color: "#666", marginBottom: "20px" }}>クイズが見つかりませんでした。</p>
                    <Link to="/create" style={primaryButtonStyle}>クイズを作ってみる</Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];

    const handleAnswer = (choiceIdx: number) => {
        const isCorrect = choiceIdx === currentQuestion.correct_index;
        const nextScore = isCorrect ? score + 1 : score;

        if (currentIdx + 1 < questions.length) {
            setScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            navigate("/result", { state: { score: nextScore, total: questions.length, limit: questions.length } });
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {/* 進捗表示 */}
                <div style={progressStyle}>
                    Question {currentIdx + 1} of {questions.length}
                </div>

                {/* 問題文 */}
                <h2 style={questionTitleStyle}>{currentQuestion.content}</h2>

                {/* 選択肢リスト */}
                <div style={choicesContainerStyle}>
                    {currentQuestion.choices.map((choice: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            style={choiceButtonStyle}
                        >
                            <span style={choiceNumberStyle}>{i + 1}</span>
                            <span style={{ flex: 1 }}>{choice}</span>
                        </button>
                    ))}
                </div>

                {/* 作成者情報 */}
                <div style={authorInfoStyle}>作成者: {currentQuestion.author_name}</div>

                {/* 中断リンク */}
                <div style={{ marginTop: "40px" }}>
                    <Link to="/" style={exitLinkStyle}>
                        クイズを中断して戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (最新スタイル基準) ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 15px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "500px", backgroundColor: "#fff", padding: "40px 24px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" };
const progressStyle: React.CSSProperties = { color: "#888", fontSize: "13px", fontWeight: "bold", marginBottom: "15px", letterSpacing: "1px", textTransform: "uppercase" };
const questionTitleStyle: React.CSSProperties = { fontSize: "1.6rem", color: "#333", marginBottom: "35px", lineHeight: "1.5", fontWeight: "800", wordBreak: "break-word" };
const choicesContainerStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "12px", width: "100%" };
const choiceButtonStyle: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", padding: "18px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#fff", border: "2px solid #eee", borderRadius: "16px", transition: "all 0.2s ease", color: "#444", fontWeight: "600", boxSizing: "border-box", textAlign: "left", outline: "none" };
const choiceNumberStyle: React.CSSProperties = { backgroundColor: "#f0f0f0", color: "#888", width: "30px", height: "30px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: "15px", fontSize: "14px", flexShrink: 0, fontWeight: "bold" };
const authorInfoStyle: React.CSSProperties = { marginTop: "30px", color: "#bbb", fontSize: "12px", fontStyle: "italic" };
const exitLinkStyle: React.CSSProperties = { color: "#999", textDecoration: "none", fontSize: "14px", borderBottom: "1px solid #eee", paddingBottom: "2px" };
const primaryButtonStyle: React.CSSProperties = { padding: "16px 30px", backgroundColor: "#007bff", color: "#fff", textDecoration: "none", borderRadius: "14px", fontWeight: "bold", display: "inline-flex", justifyContent: "center", alignItems: "center" };