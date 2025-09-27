// src/App.jsx
import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED = ["image/png","image/jpeg","text/plain","application/pdf"];

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) { setFile(null); return; }
    if (f.size > MAX_SIZE) { setStatus("File too large (max 5MB)"); return; }
    if (!ALLOWED.includes(f.type)) { setStatus("File type not allowed"); return; }
    setStatus("");
    setFile(f);
  };

  const upload = async () => {
    if (!file) return setStatus("Choose a file first.");
    setStatus("Getting upload URL...");
    const res = await fetch("/api/generate-presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, fileType: file.type })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:res.statusText}));
      return setStatus("Error: " + (err.error || res.statusText));
    }
    const { uploadUrl, publicUrl } = await res.json();
    setStatus("Uploading file...");
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });
    if (!putRes.ok) return setStatus("Upload failed");
    setStatus("Upload successful!");
    setPublicUrl(publicUrl);
  };

  return (
    <div style={{maxWidth:600, margin:"2rem auto", fontFamily:"sans-serif"}}>
      <h1>Simple File Uploader</h1>
      <input type="file" onChange={onFile} />
      <div style={{marginTop:10}}>
        <button onClick={upload}>Upload</button>
      </div>
      <p>{status}</p>
      {publicUrl && <p>File URL: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>}
    </div>
  );
}

export default App;
