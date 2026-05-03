import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UploadZone from "./components/UploadZone";
import ChatWindow from "./components/ChatWindow";

const SESSION_ID = uuidv4();

export default function App() {
  const [dataset, setDataset] = useState(null);

  return dataset
    ? <ChatWindow dataset={dataset} sessionId={SESSION_ID} />
    : <UploadZone sessionId={SESSION_ID} onUploadSuccess={setDataset} />;
}