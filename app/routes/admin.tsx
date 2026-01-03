import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { supabase } from "app/lib/supabase";
import { useAuthor } from "app/hooks/useAuthor"
import { AuthorGuard } from "app/components/AuthorGuard";

export async function clientLoader() {
    const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw new Error("取得に失敗しました");
    return { questions: data || [] };
}

export default function Admin() {
    const { questions } = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();
    const { authorName, saveName, logout } = useAuthor();

    // モーダル管理用のステート
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<{ id: number, content: string } | null>(null);
    // トースト用ステート
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    // 画面リロードをなしで削除反映させるためのステート
    const { questions: initialQuestions } = useLoaderData<typeof clientLoader>();
    const [currentQuestions, setCurrentQuestions] = useState(initialQuestions);

    // トーストを表示して自動で消す関数
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); // 3秒後に消える
    };

    // 削除ボタンが押された時
    const openDeleteModal = (id: number, content: string) => {
        setSelectedQuiz({ id, content });
        setIsModalOpen(true);
    };

    // 実際の削除処理
    const confirmDelete = async () => {
        if (!selectedQuiz) return;

        const { error } = await supabase.from("questions").delete().eq("id", selectedQuiz.id);

        if (error) {
            showToast("削除に失敗しました");
        } else {
            setIsModalOpen(false);
            showToast("クイズを削除しました");
            setCurrentQuestions(prev => prev.filter(q => q.id !== selectedQuiz.id));
        }
    };


    if (!authorName) {
        return <AuthorGuard onSave={saveName} />;
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                    <button style={{ color: "#999", fontSize: "12px", marginTop: "10px" }} onClick={() => navigate("/")} >
                        トップページへ戻る
                    </button><br />
                    <span style={{ fontSize: "14px", color: "#666" }}>🙋ログイン中: <b>{authorName}</b></span>
                    <button onClick={logout} style={{ marginLeft: "10px", border: "none", background: "none", cursor: "pointer", color: "#007bff", textDecoration: "underline" }}>変更</button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                    <h1 style={{ margin: 0, fontSize: "1.5rem" }}>クイズ管理</h1>
                    <Link to="/create" style={createButtonStyle}>＋ 新規作成</Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {currentQuestions.map((q: any) => (
                        <div key={q.id} style={listItemStyle}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "bold" }}>{q.content}</div>
                                <div style={{ fontSize: "12px", color: "#888" }}>作成者: {q.author_name}</div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
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
                    ))}
                </div>
            </div>

            {/* --- トースト通知 --- */}
            {toastMessage && (
                <div style={toastContainerStyle}>
                    <div style={toastStyle}>
                        {toastMessage}
                    </div>
                </div>
            )}
            {/* --- カスタムモーダル --- */}
            {isModalOpen && selectedQuiz && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={{ marginTop: 0 }}>削除の確認</h2>
                        <p>以下のクイズを削除してもよろしいですか？<br /><small>この操作は取り消せません。</small></p>
                        <div style={targetQuizBoxStyle}>
                            「{selectedQuiz.content}」
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                            <button onClick={() => setIsModalOpen(false)} style={cancelButtonStyle}>キャンセル</button>
                            <button onClick={confirmDelete} style={confirmDeleteButtonStyle}>削除する</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// --- トースト用のスタイル ---

const toastContainerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)", // 中央寄せ
    zIndex: 2000,
    animation: "fadeInUp 0.3s ease-out", // ふわっと出るアニメーション（CSSで定義が必要）
};

const toastStyle: React.CSSProperties = {
    backgroundColor: "#333",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "50px", // 丸っこいデザイン
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

// アニメーションを適用するために、HTMLの head にスタイルを注入する
if (typeof document !== "undefined") {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translate(-50%, 20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
    document.head.appendChild(styleTag);
}
// --- 追加・修正したスタイル ---

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#fff", padding: "30px", borderRadius: "12px",
    maxWidth: "400px", width: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const cancelButtonStyle: React.CSSProperties = {
    padding: "10px 20px", border: "1px solid #ddd", borderRadius: "8px",
    backgroundColor: "#fff", cursor: "pointer", fontWeight: "bold"
};

const confirmDeleteButtonStyle: React.CSSProperties = {
    padding: "10px 20px", border: "none", borderRadius: "8px",
    backgroundColor: "#dc3545", color: "#fff", cursor: "pointer", fontWeight: "bold"
};

// ... (他、既存のスタイル)
const containerStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" };
const cardStyle: React.CSSProperties = { maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const listItemStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#fafafa" };
const createButtonStyle: React.CSSProperties = { padding: "8px 16px", backgroundColor: "#28a745", color: "#fff", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "bold" };
const editButtonStyle: React.CSSProperties = { padding: "6px 12px", backgroundColor: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer" };
const deleteButtonStyle: React.CSSProperties = { padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const disabledButtonStyle: React.CSSProperties = { ...deleteButtonStyle, backgroundColor: "#e9ecef", color: "#adb5bd", cursor: "not-allowed", border: "1px solid #dee2e6" };
const targetQuizBoxStyle: React.CSSProperties = { backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #dc3545", textAlign: "left", fontSize: "14px", fontWeight: "bold", marginBottom: "15px", color: "#333", wordBreak: "break-all" };