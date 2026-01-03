import { useState } from "react";

export function AuthorGuard({ onSave }: { onSave: (name: string) => void }) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) onSave(input.trim());
    };

    return (
        <div style={overlayStyle} >
            <div style={modalStyle}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>👋</div>
                < h2 style={{ margin: "0 0 10px 0" }
                }> ニックネームを教えて！</h2>
                < p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                    クイズの作成者名として表示されます。
                </p>
                < form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
                    <input
                        autoFocus
                        required
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="かずと"
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle} > 決定 </button>
                </form>
            </div>
        </div>
    );
}

// --- リッチなスタイル ---
const overlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
};
const modalStyle: React.CSSProperties = {
    backgroundColor: "#fff", padding: "40px", borderRadius: "24px",
    textAlign: "center", width: "90%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
};
const inputStyle: React.CSSProperties = {
    flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid #eee", fontSize: "16px"
};
const buttonStyle: React.CSSProperties = {
    padding: "12px 24px", backgroundColor: "#007bff", color: "#fff",
    border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};