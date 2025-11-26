import fetch from "node-fetch";

const PROVIDER = process.env.SUMMARIZER_PROVIDER || "apyhub";
const KEY = process.env.SUMMARIZER_API_KEY || process.env.SUMMARIZER_KEY;

export default async function summarize(text) {
  if (!text || text.length < 40) return "Too short to summarize.";

  if (PROVIDER === "apyhub") {
    if (!KEY) return "Summarizer key not configured.";
    try {
      const res = await fetch("https://api.apyhub.com/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apy-token": KEY },
        body: JSON.stringify({ text })
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn("ApyHub error", res.status, txt);
        return "Summary API error.";
      }
      const j = await res.json();
      return j?.data ?? j?.summary ?? "No summary returned.";
    } catch (e) {
      console.error("summarize exception", e);
      return "Summary failed.";
    }
  }

  // fallback: simple extractive top 3 sentences
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  return sentences.slice(0, 3).join(" ").trim();
}
