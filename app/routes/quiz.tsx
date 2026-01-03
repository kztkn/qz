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
    const [selectedId, setSelectedId] = useState<number | null>(null); // 選択された選択肢のインデックス
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [combo, setCombo] = useState(0); // 現在のコンボ
    const [maxCombo, setMaxCombo] = useState(0); // 最大コンボ
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
    const playSound = (url: string) => {
        const audio = new Audio(url);
        audio.currentTime = 0;
        // 音量を少し下げておく（突然の大音量を防ぐUX）
        audio.volume = 0.2;

        // play() は Promise を返すので、エラーをキャッチして無視する（コンソールを汚さない）
        audio.play().catch(e => {
            console.warn("音声を再生できませんでした。ユーザーの操作が必要です:", e);
        });
    };

    const handleAnswer = (choiceIdx: number) => {
        if (selectedId !== null) return; // 連打防止
        setSelectedId(choiceIdx); // 選択した瞬間、ボタンの色を変える

        const isCorrect = choiceIdx === currentQuestion.correct_index;
        const nextScore = isCorrect ? score + 1 : score;

        let nextCombo = isCorrect ? combo + 1 : 0;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);

        // 回答履歴を保存
        const newHistory = [
            ...history,
            {
                question: currentQuestion.content,
                choices: currentQuestion.choices,
                correctIndex: currentQuestion.correct_index,
                userIndex: choiceIdx,
                isCorrect: isCorrect
            }
        ];
        setHistory(newHistory);
        setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
                setScore(nextScore);
                setCurrentIdx(currentIdx + 1);
                setSelectedId(null); // 選択状態をリセット
            } else {
                navigate("/result", {
                    state: {
                        score: nextScore,
                        total: questions.length,
                        limit: questions.length,
                        history: newHistory,
                        maxCombo: nextCombo > maxCombo ? nextCombo : maxCombo,
                    }
                });
            }
        }, 500); // 0.5秒だけ「正解・不正解」の余韻を作る
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {/* コンボ表示：2コンボ以上で表示 */}
                <div style={{ height: "40px" }}>
                    {combo >= 2 && (
                        <div style={comboBadgeStyle}>
                            {combo} COMBO {"🔥".repeat(Math.min(combo, 5))}
                        </div>
                    )}
                </div>
                {/* 進捗表示 */}
                <div style={progressStyle}>
                    Question {currentIdx + 1} of {questions.length}
                </div>

                {/* 問題文 */}
                <h2 style={questionTitleStyle}>{currentQuestion.content}</h2>

                {/* 選択肢リスト */}
                <div style={choicesContainerStyle}>
                    {currentQuestion.choices.map((choice: string, i: number) => {
                        // 状態に応じたスタイル決定
                        const isSelected = selectedId === i;
                        const isCorrectAnswer = i === currentQuestion.correct_index;

                        let bgColor = "#fff";
                        let borderColor = "#eee";
                        let icon = (i + 1).toString();

                        if (selectedId !== null && isSelected) {
                            if (isCorrectAnswer) {
                                bgColor = "#e6fffa"; // 正解の緑
                                borderColor = "#38b2ac";
                                if (isSelected) icon = "◯";
                                playSound("/sounds/correct.mp3");
                                navigator.vibrate?.([50, 30, 50]);
                            } else {
                                bgColor = "#fff5f5"; // 不正解の赤
                                borderColor = "#e53e3e";
                                icon = "×";
                                playSound("/sounds/incorrect.mp3");
                                navigator.vibrate?.(400);
                            }
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={selectedId !== null}
                                style={{ ...choiceButtonStyle, backgroundColor: bgColor, borderColor: borderColor }}
                            >
                                <span style={{ ...choiceNumberStyle, backgroundColor: isSelected || (selectedId !== null && isCorrectAnswer) ? "transparent" : "#f0f0f0" }}>
                                    {icon}
                                </span>
                                {choice}
                            </button>
                        );
                    })}
                </div>

                {/* 作成者情報 */}
                <div style={authorInfoStyle}>by {currentQuestion.author_name}</div>

                {/* 中断リンク */}
                <div style={{ marginTop: "40px" }}>
                    <Link to="/" style={exitLinkStyle}>
                        クイズを中断して戻る
                    </Link>
                </div>
            </div>
        </div >
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
const comboBadgeStyle: React.CSSProperties = { backgroundColor: "#ff4757", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "900", display: "inline-block", animation: "bounce 0.4s infinite alternate" };