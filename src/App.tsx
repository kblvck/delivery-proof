import { useState } from "react";
import { anchor, fingerprint, verify } from "./proof";
import "./style.css";

export function App() {
  const query = new URLSearchParams(location.search);
  const [verifyMode, setVerifyMode] = useState(query.has("tx"));
  const [txHash, setTxHash] = useState(query.get("tx") ?? "");
  const [file, setFile] = useState<File>();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !file) return;
    setBusy(true);
    setStatus("");
    setLink("");
    try {
      const hash = await fingerprint(file);
      if (verifyMode) {
        const receipt = await verify(txHash.trim(), hash);
        const timestamp = receipt.timestamp ? ` Recorded ${new Date(receipt.timestamp).toLocaleString()}.` : "";
        setStatus(receipt.matches ? "File matches the on-chain fingerprint." + timestamp : "This file differs from the one recorded.");
      } else {
        const receipt = await anchor(hash);
        const url = new URL(location.pathname, location.origin);
        url.searchParams.set("tx", receipt.txHash);
        setLink(url.toString());
        setStatus(`QoreX accepted the transaction.${receipt.shield === "shielded" ? " QoreX reported hybrid signing." : ""} The receipt can be verified once indexed.`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The request failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header><strong>Delivery Proof</strong><span>QoreChain Diana testnet</span></header>
      <h1>Give your files a receipt.</h1>
      <p className="intro">Timestamp a file fingerprint and give your client a link to check their copy. Your file stays in your browser.</p>
      <section aria-label="File receipt">
        <nav aria-label="Receipt mode">
          <button type="button" aria-pressed={!verifyMode} disabled={busy} onClick={() => { setVerifyMode(false); setStatus(""); setLink(""); }}>Create receipt</button>
          <button type="button" aria-pressed={verifyMode} disabled={busy} onClick={() => { setVerifyMode(true); setStatus(""); setLink(""); }}>Verify file</button>
        </nav>
        <form onSubmit={submit}>
          {verifyMode && <label>Transaction hash<input value={txHash} disabled={busy} required onChange={event => { setTxHash(event.target.value); setStatus(""); }} /></label>}
          <label className="file">Choose file <small>Up to 50 MB</small><input type="file" required disabled={busy} onChange={event => { setFile(event.target.files?.[0]); setStatus(""); setLink(""); }} /></label>
          {!verifyMode && <p className="hint">QoreX will ask you to approve a testnet self-transfer and fee. The public memo contains only the file fingerprint and receipt format.</p>}
          <button className="primary" disabled={busy || !file}>{busy ? "Working…" : verifyMode ? "Verify fingerprint" : "Sign with QoreX"}</button>
        </form>
        <div role="status">{status}</div>
        {link && <label>Shareable verification link<input readOnly value={link} onFocus={event => event.target.select()} /></label>}
      </section>
      <footer>A receipt records when a fingerprint appeared on testnet. It does not establish who authored or received the file.</footer>
    </main>
  );
}
