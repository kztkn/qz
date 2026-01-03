import { useState } from "react";
import { useNavigate } from "react-router";

const QUESTIONS = [
    { q: "React Router v7 のベースとなったフレームワークは？", a: ["Next.js", "Remix", "Vue.js"], correct: 1 },
    { q: "GitHub Pages でSPAを公開する際に必要なファイルは？", a: ["404.html", "500.html", "index.php"], correct: 0 },
    { q: "React で状態を管理するための Hook は？", a: ["useEffect", "useContext", "useState"], correct: 2 },
];

export default function Quiz() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    const handleAnswer = (choiceIdx: number) => {
        const nextScore = choiceIdx === QUESTIONS[currentIdx].correct ? score + 1 : score;

        if (currentIdx + 1 < QUESTIONS.length) {
            setScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            // 全問終了したら結果ページへ（スコアを state で渡す）
            navigate("/result", { state: { score: nextScore, total: QUESTIONS.length } });
        }
    };

    const currentQuestion = QUESTIONS[currentIdx];

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h2>第 {currentIdx + 1} 問</h2>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{currentQuestion.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentQuestion.a.map((choice, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} style={{ padding: "10px", cursor: "pointer" }}>
                        {choice}
                    </button>
                ))}
            </div>
        </div>
    );
}