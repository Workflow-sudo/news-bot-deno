const APY_KEY = Deno.env.get("APY_KEY") || "";
const PROVIDER = Deno.env.get("SUMMARIZER_PROVIDER") || "apyhub";

export async function summarize(text: string) {
  if (!text || text.length < 20) return "No content to summarize.";

  if (PROVIDER === "apyhub") {
    if (!APY_KEY) return "No APY_KEY configured.";
    try {
      const r = await fetch("https://api.apyhub.com/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apy-token": APY_KEY,
        },
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      return j?.data ?? j?.summary ?? "No summary returned.";
    } catch (e) {
      console.error("summarize error", e);
      return "Summary API failed.";
    }
  }

  // fallback simple extractive
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  return sentences.slice(0, 3).join(" ").trim();
}
