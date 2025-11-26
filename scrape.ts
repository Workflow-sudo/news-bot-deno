import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

export async function scrape(search = "world news") {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const url = `https://news.google.com/search?q=${encodeURIComponent(
    search,
  )}&hl=en-US&gl=US&ceid=US:en`;

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const results = await page.$$eval("article", (nodes) =>
    nodes
      .map((a) => {
        const header = a.querySelector("h3, h4");
        const anchor = a.querySelector("a[href]");
        const title = header?.textContent?.trim() ?? null;
        let link = anchor ? (anchor as HTMLAnchorElement).href : null;
        if (link && link.startsWith("./")) link = "https://news.google.com" + link.slice(1);
        return title && link ? { title, link } : null;
      })
      .filter(Boolean)
  );

  await browser.close();
  // TS: results is (Array<any>) — normalize types:
  return (results as any[]) ?? [];
}
