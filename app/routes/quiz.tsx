import { useState } from "react";
import { useNavigate, useLoaderData, Link } from "react-router";
import { supabase } from "app/lib/supabase";

export async function clientLoader() {
    const { data, error } = await supabase.rpc('get_random_questions', { limit_count: 10 });

    if (error) {
        throw new Error("データの取得に失敗しました");
    }
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
                    <p>クイズが見つかりませんでした。</p>
                    <Link to="/create" style={{ color: "#007bff" }}>クイズを作ってみる</Link>
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
            navigate("/result", { state: { score: nextScore, total: questions.length } });
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
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {currentQuestion.choices.map((choice: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            style={choiceButtonStyle}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                        >
                            <span style={choiceNumberStyle}>{i + 1}</span>
                            {choice}
                        </button>
                    ))}
                </div>

                {/* 中断リンク */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link to="/" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>
                        クイズを中断して戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル定義 (作成フォームと統一) ---

const containerStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const progressStyle: React.CSSProperties = {
    color: "#666",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
};

const questionTitleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "30px",
    lineHeight: "1.4",
};

const choiceButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#fff",
    border: "2px solid #eee",
    borderRadius: "10px",
    textAlign: "left",
    transition: "all 0.2s ease",
    color: "#444",
    fontWeight: "500",
};

const choiceNumberStyle: React.CSSProperties = {
    backgroundColor: "#eee",
    color: "#666",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    fontSize: "14px",
};