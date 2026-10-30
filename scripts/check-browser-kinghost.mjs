import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env["PLAYWRIGHT_MODULE"] || "playwright");
const root = resolve("kinghost-package");
const base = process.env["CHECK_BASE"] || "/black-livros/";
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (!url.pathname.startsWith("/black-livros/")) {
    res.writeHead(404).end();
    return;
  }
  let file = resolve(root, decodeURIComponent(url.pathname.slice("/black-livros/".length)));
  if (file !== root && !file.startsWith(root + "/")) {
    res.writeHead(403).end();
    return;
  }
  try {
    if (statSync(file).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(301, { Location: url.pathname + "/" + url.search }).end();
        return;
      }
      file += "/index.html";
    }
    const type =
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ico": "image/x-icon",
        ".woff2": "font/woff2",
      }[extname(file)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type }).end(readFileSync(file));
  } catch {
    res.writeHead(404).end();
  }
});
if (!process.env["SITE_ORIGIN"]) await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = process.env["SITE_ORIGIN"] || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ["--remote-debugging-port=9222"] });
try {
  const page = await browser.newPage();
  const errors = [],
    missing = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(origin) && r.status() >= 400) missing.push(r.url());
  });
  // Third-party services remain external; avoid depending on them for this check.
  await page.route(/https:\/\/.*/, (route) => route.abort());
  await page.goto(`${origin}${base}`, { waitUntil: "networkidle" });
  const html = await (await page.request.get(`${origin}${base}`)).text();
  assert(!/type="module"|rel="modulepreload"/.test(html), "Página pública não deve baixar React");
  assert(html.includes("GTM-W327944"), "GTM deve ser preservado");
  for (const [path, title] of [
    ["termos-de-uso", "Termos de Uso"],
    ["politica-de-privacidade", "Política de Privacidade"],
  ]) {
    await page.getByRole("link", { name: title, exact: true }).click();
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
    assert(new URL(page.url()).pathname.startsWith(`${base}${path}`));
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      `https://engeteles.com.br/black-livros/${path}`,
    );
  }
  await page.getByRole("link", { name: "Voltar para a oferta" }).click();
  await page.waitForURL(`${origin}${base}`);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => document.fonts.check("800 16px Montserrat")));
    assert(await page.evaluate(() => document.fonts.check("700 16px Poppins")));
    const timer = page.getByRole("timer");
    if (await timer.count())
      assert(!(await timer.innerText()).includes("--"), "Contador deve iniciar sem React");
    else assert(await page.getByText("Oferta encerrada", { exact: true }).isVisible());
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      "Sem overflow horizontal",
    );
    await page.getByText("Por que está tão barato?", { exact: true }).click();
    assert((await page.locator("details").first().getAttribute("open")) !== null, "FAQ deve abrir");
    await page.getByText("Por que está tão barato?", { exact: true }).click();
    await page.getByRole("link", { name: "Comprar combo", exact: true }).click();
    assert(new URL(page.url()).hash === "#oferta");
    await page.evaluate(async () => {
      for (const img of document.images) {
        img.loading = "eager";
        await img.decode().catch(() => {});
      }
    });
    assert.deepEqual(
      await page
        .locator("img")
        .evaluateAll((imgs) => imgs.filter((img) => !img.naturalWidth).map((img) => img.src)),
      [],
    );
    assert.equal(
      (await page.locator('a[href="https://pay.hotmart.com/F102672953E?off=ryyv0785"]').count()) >
        0,
      true,
    );
  }
  mkdirSync("audit-results", { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}${base}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `audit-results/page-${width}.png`, fullPage: true });
  }
  assert.deepEqual(errors, [], "Erros JavaScript");
  assert.deepEqual(missing, [], "Recursos locais com erro HTTP");
  console.log(
    "OK: navegação, atualização direta das subpáginas, canonical, imagens e checkout em desktop/mobile.",
  );
  if (process.env["LIGHTHOUSE_MODULE"]) {
    const { default: lighthouse } = await import(process.env["LIGHTHOUSE_MODULE"]);
    const { default: desktopConfig } = await import(
      new URL("./config/desktop-config.js", pathToFileURL(process.env["LIGHTHOUSE_MODULE"]))
    );
    for (const mode of ["mobile", "desktop"]) {
      const result = await lighthouse(
        `${origin}${base}`,
        {
          port: 9222,
          output: ["json", "html"],
          logLevel: "error",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        },
        mode === "desktop" ? desktopConfig : undefined,
      );
      writeFileSync(`audit-results/lighthouse-${mode}.json`, result.report[0]);
      writeFileSync(`audit-results/lighthouse-${mode}.html`, result.report[1]);
      console.log(
        `Lighthouse ${mode}:`,
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
      );
      console.log(
        "Auditorias pendentes:",
        Object.values(result.lhr.audits)
          .filter((audit) => audit.score !== null && audit.score < 1)
          .map((audit) => ({ id: audit.id, value: audit.displayValue })),
      );
    }
  }
} finally {
  await browser.close();
  if (server.listening) server.close();
}
