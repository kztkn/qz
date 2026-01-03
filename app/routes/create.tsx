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

    // トースト用ステート
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // ★追加: フォームをリセットする関数（続けて作成用）
    const resetForm = () => {
        setContent("");
        setChoices(["", "", "", ""]);
        setCorrectIndex(0);
        setIsSuccessModalOpen(false);
    };

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
            showToast("エラーが発生しました..." + error.message);
        } else {
            showToast(id ? "クイズを更新しました！" : "新しいクイズを投稿しました！");
            setIsSuccessModalOpen(true);
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
                {/* --- トースト通知 --- */}
                {toastMessage && (
                    <div style={toastContainerStyle}>
                        <div style={toastStyle}>
                            <span style={{ marginRight: "8px" }}>✅</span>
                            {toastMessage}
                        </div>
                    </div>
                )}
            </div>
            {/* ★追加: 投稿成功モーダル --- */}
            {isSuccessModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
                        <h2 style={{ marginTop: 0 }}>{id ? "更新完了！" : "投稿完了！"}</h2>
                        <p style={{ color: "#666", marginBottom: "30px" }}>
                            クイズが正常に保存されました。<br />次はどうしますか？
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {!id && (
                                <button onClick={resetForm} style={continueButtonStyle}>
                                    続けて別のクイズを作る
                                </button>
                            )}
                            <button onClick={() => navigate("/admin")} style={backButtonStyle}>
                                管理画面（一覧）に戻る
                            </button>
                            <button onClick={() => navigate("/")} style={homeButtonStyle}>
                                トップページへ戻る
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
const modalOverlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 3000, backdropFilter: "blur(4px)",
};

const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#fff", padding: "40px", borderRadius: "20px",
    maxWidth: "400px", width: "90%", textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

const continueButtonStyle: React.CSSProperties = {
    padding: "14px", backgroundColor: "#28a745", color: "#fff",
    border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer"
};

const backButtonStyle: React.CSSProperties = {
    padding: "14px", backgroundColor: "#f0f7ff", color: "#007bff",
    border: "1px solid #cce5ff", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer"
};

const homeButtonStyle: React.CSSProperties = {
    padding: "10px", backgroundColor: "transparent", color: "#999",
    border: "none", fontSize: "14px", cursor: "pointer", textDecoration: "underline"
};

// スタイル注入部分に popIn を追加
if (typeof document !== "undefined") {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;
    document.head.appendChild(styleTag);
}
const toastContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: "30px", // 上からふわっと出すパターン
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2000,
    animation: "fadeInDown 0.4s ease-out",
};

const toastStyle: React.CSSProperties = {
    backgroundColor: "#28a745", // 成功時は緑色にする
    color: "#fff",
    padding: "12px 30px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(40,167,69,0.3)",
    display: "flex",
    alignItems: "center",
};

// head へのスタイル注入（fadeInDown: 上から下に降りてくるアニメーション）
if (typeof document !== "undefined") {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
    document.head.appendChild(styleTag);
}
const headerStyle: React.CSSProperties = { textAlign: "center", marginBottom: "30px" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "24px" };
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" };
const cardStyle: React.CSSProperties = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: "bold", marginBottom: "8px", color: "#555" };
const textareaStyle: React.CSSProperties = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", minHeight: "100px", boxSizing: "border-box" };
const choiceInputWrapperStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#fafafa" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" };
const buttonStyle = (loading: boolean): React.CSSProperties => ({
    padding: "16px", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer"
});