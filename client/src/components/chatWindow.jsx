import { useState, useRef, useEffect } from "react";
import { sendQuery } from "../api/query";

export default function ChatWindow({ dataset, sessionId }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "system",
      text: `${dataset.filename} · ${dataset.rows.toLocaleString()} rows · ${dataset.columns.length} columns`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: question },
    ]);
    setLoading(true);

    try {
      const result = await sendQuery(question, sessionId);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", insight: result.insight, chart: result.chart },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", insight: "Something went wrong. Please try again.", chart: null },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* Messages */}
      <div style={styles.feed}>
        {messages.map((msg) => {
          if (msg.role === "system") return (
            <div key={msg.id} style={styles.systemMsg}>{msg.text}</div>
          );
          if (msg.role === "user") return (
            <div key={msg.id} style={styles.userBubble}>{msg.text}</div>
          );
          if (msg.role === "ai") return (
            <div key={msg.id} style={styles.aiBubble}>
              {msg.insight?.split("\n\n").map((p, i) => (
                <p key={i} style={{ margin: "0 0 10px" }}>{p}</p>
              ))}
              {msg.chart && (
                <div style={styles.chartPlaceholder}>
                  📊 {msg.chart.title} ({msg.chart.type} · {msg.chart.data.length} points)
                </div>
              )}
            </div>
          );
          return null;
        })}

        {loading && (
          <div style={styles.aiBubble}>
            <span style={{ color: "#f59e0b" }}>Analysing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about your data…"
        />
        <button
          style={{ ...styles.btn, opacity: loading || !input.trim() ? 0.5 : 1 }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Ask →
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "sans-serif" },
  feed: { flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 },
  systemMsg: { textAlign: "center", background: "#18181b", border: "1px solid #27272a", borderRadius: 100, padding: "5px 16px", fontSize: 12, color: "#71717a", alignSelf: "center" },
  userBubble: { alignSelf: "flex-end", background: "#f59e0b", color: "#09090b", borderRadius: "14px 14px 3px 14px", padding: "10px 16px", maxWidth: "60%", fontSize: 14, fontWeight: 500 },
  aiBubble: { alignSelf: "flex-start", background: "#111113", border: "1px solid #27272a", borderRadius: "3px 14px 14px 14px", padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.7, color: "#e4e4e7" },
  chartPlaceholder: { marginTop: 10, background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#71717a" },
  inputRow: { padding: "14px 20px", borderTop: "1px solid #27272a", display: "flex", gap: 10 },
  input: { flex: 1, background: "#111113", border: "1px solid #27272a", borderRadius: 10, padding: "11px 16px", color: "#fafafa", fontSize: 14, fontFamily: "sans-serif" },
  btn: { background: "#f59e0b", color: "#09090b", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" },
};