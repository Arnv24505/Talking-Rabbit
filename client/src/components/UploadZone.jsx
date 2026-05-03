import { useRef, useState } from "react";
import { uploadCSV } from "../api/upload";

export default function UploadZone({ sessionId, onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await uploadCSV(file, sessionId);
      onUploadSuccess(result.dataset);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.logo}>🐰 Talking Rabbitt</div>
      <p style={styles.sub}>Upload a CSV to get started</p>

      <div
        style={{ ...styles.zone, borderColor: dragging ? "#f59e0b" : "#27272a" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <div style={styles.icon}>📊</div>
        <p style={styles.zoneText}>
          {loading ? "Parsing..." : "Drop CSV here or click to browse"}
        </p>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "sans-serif" },
  logo: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  sub: { color: "#71717a", marginBottom: 40, fontSize: 14 },
  zone: { border: "2px dashed", borderRadius: 12, padding: "52px 80px", textAlign: "center", cursor: "pointer", background: "#111113", transition: "border-color 0.2s", minWidth: 340 },
  icon: { fontSize: 36, marginBottom: 12 },
  zoneText: { fontSize: 15, color: "#a1a1aa", margin: 0 },
  error: { color: "#f87171", fontSize: 13, marginTop: 16 },
};