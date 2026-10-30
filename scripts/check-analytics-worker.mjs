import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.ANALYTICS_TEST_ORIGIN || "http://127.0.0.1:4181";
let server;
if (!process.env.ANALYTICS_TEST_ORIGIN) {
  server = spawn(process.execPath, [".output/server/index.mjs"], {
    env: { ...process.env, PORT: "4181", HOST: "127.0.0.1" },
    stdio: ["ignore", "inherit", "inherit"],
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(origin)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const mode of ["main", "worker"]) {
    const context = await browser.newContext();
    const events = [];
    const failures = [];
    context.on("request", (request) => {
      const u = new URL(request.url());
      const data = new URLSearchParams(request.postData() || "");
      const event =
        u.searchParams.get("en") || u.searchParams.get("ev") || data.get("en") || data.get("ev");
      if (event && /google-analytics.com|facebook.com/.test(u.hostname))
        events.push({
          host: u.hostname,
          event,
          id: u.searchParams.get("tid") || u.searchParams.get("id"),
        });
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => failures.push(e.message));
    page.on("console", (message) => {
      if (message.type() === "error") failures.push(message.text().slice(0, 250));
    });
    await page.goto(`${origin}${mode === "worker" ? "/_analytics/preview" : "/?analytics=main"}`, {
      waitUntil: "load",
      timeout: 60000,
    });
    for (let attempt = 0; attempt < 120; attempt++) {
      if (
        events.some((e) => e.event === "page_view" && e.id === "G-JPL447HFSS") &&
        events.some((e) => e.event === "PageView" && e.id === "3018542305084132")
      )
        break;
      await page.waitForTimeout(500);
    }
    const mainGa4 = await page
      .locator('script[src*="/gtag/js?id=G-"]:not([type="text/partytown"])')
      .count();
    const summary = { mode, events, mainGa4, workers: page.workers().length, errors: failures };
    results.push(summary);
    mkdirSync("audit-results", { recursive: true });
    writeFileSync("audit-results/analytics-worker.json", JSON.stringify(results, null, 2));
    console.log(JSON.stringify(summary));
    assert(
      events.some((e) => e.event === "page_view" && e.id === "G-JPL447HFSS"),
      `GA4 page_view missing in ${mode}`,
    );
    assert(
      events.some((e) => e.event === "PageView" && e.id === "3018542305084132"),
      `Meta PageView missing in ${mode}`,
    );
    if (mode === "worker") {
      assert(mainGa4 > 0, "GA4 must remain on the main thread for page-exit tracking");
      assert(summary.workers > 0, "Worker must initialize");
    }
    await context.close();
  }
} finally {
  await browser.close();
  server?.kill();
}
