import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export async function sendQuery(question, sessionId) {
  const { data } = await axios.post(`${BASE_URL}/query`, {
    question,
    session_id: sessionId,
  });
  return data;   // { insight, chart }
}