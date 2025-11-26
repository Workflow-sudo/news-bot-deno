import { JSDOM } from "https://esm.sh/jsdom@22.1.0";
import { Readability } from "https://esm.sh/@mozilla/readability@0.4.4";

export async function extract(url: string) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.warn("extract: non-OK response", res.status, url);
      return "";
    }
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    return article?.textContent?.trim() ?? "";
  } catch (e) {
    console.error("extract error", e, url);
    return "";
  }
}
