import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { supabase } from "app/lib/supabase";
import { useAuthor } from "app/hooks/useAuthor"
import { AuthorGuard } from "app/components/AuthorGuard";

export async function clientLoader() {
    const { data, error } = await supabase.from("questions").select("*").order("created_at", { ascending: false });
    if (error) throw new Error("取得に失敗しました");
    return { questions: data || [] };
}

export default function Admin() {
    const { questions: initialQuestions } = useLoaderData<typeof clientLoader>();
    const [currentQuestions, setCurrentQuestions] = useState(initialQuestions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<{ id: number, content: string } | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const { authorName, saveName, logout } = useAuthor();

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const openDeleteModal = (id: number, content: string) => {
        setSelectedQuiz({ id, content });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedQuiz) return;
        const { error } = await supabase.from("questions").delete().eq("id", selectedQuiz.id);

        if (error) {
            showToast("⚠️ 削除に失敗しました");
        } else {
            setIsModalOpen(false);
            // 削除完了はトーストで通知（画面が切り替わらないため）
            showToast("✅ クイズを削除しました");
            // Stateを更新して即座に画面から消す
            setCurrentQuestions(prev => prev.filter(q => q.id !== selectedQuiz.id));
        }
    };

    if (!authorName) return <AuthorGuard onSave={saveName} />;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerNavStyle}>
                    <button style={textLinkButtonStyle} onClick={() => navigate("/")}>← トップページへ戻る</button>
                    <div style={loginInfoStyle}>
                        <span>🙋<b>{authorName}</b></span>
                        <button onClick={logout} style={logoutButtonStyle}>変更</button>
                    </div>
                </div>

                <div style={titleRowStyle}>
                    <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>クイズ管理</h1>
                    <Link to="/create" style={createButtonStyle}>＋ 新規作成</Link>
                </div>

                <div style={listContainerStyle}>
                    {currentQuestions.length === 0 ? (
                        <p style={{ color: "#999", marginTop: "20px" }}>まだクイズがありません</p>
                    ) : (
                        currentQuestions.map((q: any) => (
                            <div key={q.id} style={listItemStyle}>
                                <div style={{ flex: 1, textAlign: "left" }}>
                                    <div style={quizContentStyle}>{q.content}</div>
                                    <div style={authorLabelStyle}>by {q.author_name}</div>
                                </div>
                                <div style={actionGroupStyle}>
                                    {q.is_admin_only ? (
                                        <span style={disabledButtonStyle}>編集</span>
                                    ) : (
                                        <button onClick={() => navigate(`/edit/${q.id}`)} style={editButtonStyle}>編集</button>
                                    )}
                                    {q.is_admin_only ? (
                                        <span style={disabledButtonStyle}>削除</span>
                                    ) : (
                                        <button onClick={() => openDeleteModal(q.id, q.content)} style={deleteButtonStyle}>削除</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* トースト通知 (削除完了時などに表示) */}
            {toastMessage && (
                <div style={toastContainerStyle}>
                    <div style={toastStyle}>{toastMessage}</div>
                </div>
            )}

            {/* 削除確認モーダル */}
            {isModalOpen && selectedQuiz && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>削除の確認</h2>
                        <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>このクイズを完全に削除しますか？<br />この操作は取り消せません。</p>
                        <div style={targetQuizBoxStyle}>「{selectedQuiz.content}」</div>
                        <div style={modalActionStyle}>
                            <button onClick={() => setIsModalOpen(false)} style={cancelButtonStyle}>キャンセル</button>
                            <button onClick={confirmDelete} style={confirmDeleteButtonStyle}>削除する</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- スタイル定義 ---
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px 15px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: "600px", backgroundColor: "#fff", padding: "25px 20px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", boxSizing: "border-box", textAlign: "center" };
const headerNavStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" };
const loginInfoStyle: React.CSSProperties = { fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "5px" };
const textLinkButtonStyle: React.CSSProperties = { border: "none", background: "none", color: "#999", fontSize: "12px", cursor: "pointer", padding: 0 };
const logoutButtonStyle: React.CSSProperties = { border: "none", background: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", fontSize: "12px", padding: 0 };
const titleRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const createButtonStyle: React.CSSProperties = { padding: "10px 18px", backgroundColor: "#28a745", color: "#fff", textDecoration: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(40,167,69,0.2)" };
const listContainerStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px" };
const listItemStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid #eee", borderRadius: "16px", backgroundColor: "#fafafa", gap: "12px", boxSizing: "border-box" };
const quizContentStyle: React.CSSProperties = { fontWeight: "bold", fontSize: "15px", marginBottom: "4px", color: "#333", wordBreak: "break-all", lineHeight: "1.4" };
const authorLabelStyle: React.CSSProperties = { fontSize: "11px", color: "#bbb", letterSpacing: "0.5px" };
const actionGroupStyle: React.CSSProperties = { display: "flex", gap: "8px", flexShrink: 0 };
const editButtonStyle: React.CSSProperties = { padding: "8px 14px", backgroundColor: "#ffc107", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", color: "#333" };
const deleteButtonStyle: React.CSSProperties = { padding: "8px 14px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" };
const disabledButtonStyle: React.CSSProperties = { padding: "8px 14px", backgroundColor: "#eee", color: "#bbb", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "not-allowed" };
const toastContainerStyle: React.CSSProperties = { position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", zIndex: 4000 };
const toastStyle: React.CSSProperties = { backgroundColor: "#333", color: "#fff", padding: "12px 24px", borderRadius: "50px", fontSize: "14px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)", fontWeight: "bold" };
const modalOverlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(4px)" };
const modalContentStyle: React.CSSProperties = { backgroundColor: "#fff", padding: "30px", borderRadius: "24px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", boxSizing: "border-box" };
const targetQuizBoxStyle: React.CSSProperties = { backgroundColor: "#fff5f5", padding: "15px", borderRadius: "14px", borderLeft: "5px solid #dc3545", textAlign: "left", fontSize: "14px", fontWeight: "bold", margin: "15px 0", color: "#333" };
const modalActionStyle: React.CSSProperties = { display: "flex", justifyContent: "stretch", gap: "10px", marginTop: "20px" };
const cancelButtonStyle: React.CSSProperties = { flex: 1, padding: "14px", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "14px" };
const confirmDeleteButtonStyle: React.CSSProperties = { flex: 1, padding: "14px", border: "none", borderRadius: "12px", backgroundColor: "#dc3545", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "14px" };