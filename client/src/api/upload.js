import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export async function uploadCSV(file, sessionId) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-session-id": sessionId,
    },
  });

  return data;
}