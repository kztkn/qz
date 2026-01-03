import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { supabase } from "app/lib/supabase";
import { useAuthor } from "app/hooks/useAuthor"
import { AuthorGuard } from "app/components/AuthorGuard";

export default function CreateOrEditQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authorName, saveName, logout } = useAuthor();
    const [content, setContent] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const resetForm = () => {
        setContent("");
        setChoices(["", "", "", ""]);
        setCorrectIndex(0);
        setIsSuccessModalOpen(false);
    };

    useEffect(() => {
        if (id) {
            const fetchQuiz = async () => {
                const { data, error } = await supabase.from("questions").select("*").eq("id", id).single();
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
        const quizData = { content, choices, correct_index: correctIndex, author_name: authorName };

        let error;
        if (id) {
            const result = await supabase.from("questions").update(quizData).eq("id", id);
            error = result.error;
        } else {
            const result = await supabase.from("questions").insert([quizData]);
            error = result.error;
        }

        setLoading(false);
        if (error) {
            showToast("エラーが発生しました: " + error.message);
        } else {
            setIsSuccessModalOpen(true);
        }
    };

    if (fetching) return <div style={containerStyle}>読み込み中...</div>;
    if (!authorName) return <AuthorGuard onSave={saveName} />;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerNavStyle}>
                    <button style={textLinkButtonStyle} onClick={() => navigate("/admin")}>← 一覧へ戻る</button>
                    <div style={loginInfoStyle}>
                        <span>🙋<b>{authorName}</b></span>
                        <button onClick={logout} style={logoutButtonStyle}>変更</button>
                    </div>
                </div>

                <h1 style={titleStyle}>{id ? "クイズを編集" : "クイズを作成"}</h1>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={warningBoxStyle}>
                        <strong>⚠️ 投稿に関するご注意</strong><br />
                        このクイズはインターネット上に公開されます。個人情報、公序良俗に反する内容は入力しないでください。
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>問題文</label>
                        <textarea required value={content} onChange={(e) => setContent(e.target.value)} style={textareaStyle} placeholder="問題文を入力してください" />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>選択肢 (正解にチェック)</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {choices.map((choice, i) => (
                                <div key={i} style={choiceInputWrapperStyle}>
                                    <input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} style={radioStyle} />
                                    <input required type="text" value={choice} onChange={(e) => handleChoiceChange(i, e.target.value)} style={inputStyle} placeholder={`選択肢 ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                            {loading ? "保存中..." : id ? "更新を保存する" : "クイズを保存する"}
                        </button>
                        <p style={helperTextStyle}>「保存」を押すことで、インターネット上に公開されます。</p>
                    </div>
                </form>
            </div>

            {/* 成功モーダル */}
            {isSuccessModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎉</div>
                        <h2 style={{ marginTop: 0 }}>{id ? "更新完了！" : "投稿完了！"}</h2>
                        <p style={{ color: "#666", marginBottom: "30px", lineHeight: "1.6" }}>クイズが正常に保存されました。</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                            {!id && <button onClick={resetForm} style={continueButtonStyle}>続けて別のクイズを作る</button>}
                            <button onClick={() => navigate("/admin")} style={backButtonStyle}>管理画面に戻る</button>
                            <button onClick={() => navigate("/")} style={homeButtonStyle}>トップページへ戻る</button>
                        </div>
                    </div>
                </div>
            )}

            {/* トースト */}
            {toastMessage && <div style={toastContainerStyle}><div style={toastStyle}>✅ {toastMessage}</div></div>}
        </div>
    );
}

// --- スタイル定義 (リファクタリング版) ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px 15px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "600px", backgroundColor: "#fff", padding: "30px 20px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", boxSizing: "border-box" };
const headerNavStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #eee", paddingBottom: "10px" };
const loginInfoStyle: React.CSSProperties = { fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "5px" };
const textLinkButtonStyle: React.CSSProperties = { border: "none", background: "none", color: "#999", fontSize: "13px", cursor: "pointer", padding: 0 };
const logoutButtonStyle: React.CSSProperties = { border: "none", background: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", fontSize: "13px", padding: 0 };
const titleStyle: React.CSSProperties = { textAlign: "center", color: "#333", marginBottom: "30px", fontSize: "1.6rem", fontWeight: "800" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "25px" };
const warningBoxStyle: React.CSSProperties = { backgroundColor: "#fff3cd", color: "#856404", padding: "15px", borderRadius: "14px", border: "1px solid #ffeeba", fontSize: "13px", lineHeight: "1.5" };
const inputGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" };
const labelStyle: React.CSSProperties = { fontWeight: "bold", color: "#555", fontSize: "14px", paddingLeft: "4px" };
const textareaStyle: React.CSSProperties = { width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #ddd", fontSize: "16px", minHeight: "120px", boxSizing: "border-box", outline: "none", backgroundColor: "#fafafa" };
const choiceInputWrapperStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px", padding: "10px 15px", border: "1px solid #eee", borderRadius: "14px", backgroundColor: "#fafafa", boxSizing: "border-box" };
const radioStyle: React.CSSProperties = { width: "22px", height: "22px", cursor: "pointer" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };
const helperTextStyle: React.CSSProperties = { textAlign: "center", fontSize: "12px", color: "#bbb", marginTop: "10px" };
const buttonStyle = (l: boolean): React.CSSProperties => ({ width: "100%", padding: "18px", backgroundColor: l ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "16px", fontSize: "18px", fontWeight: "bold", cursor: l ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: l ? "none" : "0 4px 15px rgba(0,123,255,0.2)" });
const modalOverlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(4px)" };
const modalContentStyle: React.CSSProperties = { backgroundColor: "#fff", padding: "40px 24px", borderRadius: "24px", maxWidth: "400px", width: "90%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", boxSizing: "border-box" };
const continueButtonStyle: React.CSSProperties = { width: "100%", padding: "16px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const backButtonStyle: React.CSSProperties = { width: "100%", padding: "16px", backgroundColor: "#f0f7ff", color: "#007bff", border: "1px solid #cce5ff", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const homeButtonStyle: React.CSSProperties = { backgroundColor: "transparent", color: "#999", border: "none", fontSize: "14px", cursor: "pointer", textDecoration: "underline", marginTop: "10px" };
const toastContainerStyle: React.CSSProperties = { position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 4000 };
const toastStyle: React.CSSProperties = { backgroundColor: "#28a745", color: "#fff", padding: "12px 30px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", boxShadow: "0 8px 20px rgba(40,167,69,0.2)" };