import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { supabase } from "app/lib/supabase";

export default function CreateOrEditQuiz() {
    const { id } = useParams(); // URLに id があれば「編集モード」
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id); // 読み込み中フラグ

    // --- 編集モードの場合：既存データの取得 ---
    useEffect(() => {
        if (id) {
            const fetchQuiz = async () => {
                const { data, error } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (data && !error) {
                    setContent(data.content);
                    setChoices(data.choices);
                    setCorrectIndex(data.correct_index);
                }
                setFetching(false);
            };
            fetchQuiz();
        }
    }, [id]);

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const quizData = {
            content,
            choices,
            correct_index: correctIndex,
        };

        let error;
        if (id) {
            // 編集モード：UPDATE
            const result = await supabase
                .from("questions")
                .update(quizData)
                .eq("id", id);
            error = result.error;
        } else {
            // 新規作成モード：INSERT
            const result = await supabase
                .from("questions")
                .insert([quizData]);
            error = result.error;
        }

        setLoading(false);

        if (error) {
            alert("エラーが発生しました: " + error.message);
        } else {
            alert(id ? "クイズを更新しました！" : "クイズを投稿しました！");
            navigate("/");
        }
    };

    if (fetching) return <div style={containerStyle}>読み込み中...</div>;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
                    {id ? "クイズを編集" : "クイズを作成"}
                </h1>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* 問題文セクション */}
                    <div>
                        <label style={labelStyle}>問題文</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={textareaStyle}
                            placeholder="問題文を入力してください"
                        />
                    </div>

                    {/* 選択肢セクション */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <label style={labelStyle}>選択肢 (正解にチェック)</label>
                        {choices.map((choice, i) => (
                            <div key={i} style={choiceInputWrapperStyle}>
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={correctIndex === i}
                                    onChange={() => setCorrectIndex(i)}
                                    style={{ width: "20px", height: "20px" }}
                                />
                                <input
                                    required
                                    type="text"
                                    value={choice}
                                    onChange={(e) => handleChoiceChange(i, e.target.value)}
                                    style={inputStyle}
                                    placeholder={`選択肢 ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                        {loading ? "保存中..." : id ? "更新を保存する" : "クイズを保存する"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link to="/" style={{ color: "#666", textDecoration: "none" }}>← 戻る</Link>
                </div>
            </div>
        </div>
    );
}

// --- スタイル (デザインを維持) ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" };
const cardStyle: React.CSSProperties = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: "bold", marginBottom: "8px", color: "#555" };
const textareaStyle: React.CSSProperties = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", minHeight: "100px", boxSizing: "border-box" };
const choiceInputWrapperStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#fafafa" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" };
const buttonStyle = (loading: boolean): React.CSSProperties => ({
    padding: "16px", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer"
});