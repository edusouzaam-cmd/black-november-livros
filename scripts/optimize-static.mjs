import { countdownBootstrap, optimizeHtml } from "../src/lib/static-html.mjs";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";

// KingHost serves the prerendered HTML directly. Every interaction except the
// countdown is native HTML (anchors and details); React remains in the editor.
export function optimizeStatic(root) {
  const countdown = countdownBootstrap;
  const name = `countdown-${createHash("sha256").update(countdown).digest("hex").slice(0, 12)}.js`;
  const pages = ["index.html", "termos-de-uso/index.html", "politica-de-privacidade/index.html"];
  for (const page of pages) {
    let html = readFileSync(`${root}/${page}`, "utf8");
    html = optimizeHtml(html, `<script defer src="/black-livros/assets/${name}"></script>`);
    writeFileSync(`${root}/${page}`, html);
  }
  writeFileSync(`${root}/assets/${name}`, countdown);

  // Keep all assets referenced by HTML, CSS or the tiny runtime, including
  // responsive srcsets, local fonts and social images. Exclude unused clones.
  const walk = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = `${dir}/${name}`;
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
  const used = new Set();
  for (const file of [
    ...pages.map((page) => `${root}/${page}`),
    ...walk(`${root}/assets`).filter((file) => file.endsWith(".css")),
  ]) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\/black-livros\/assets\/[^\s"'<>),;]+/g)) {
      used.add(match[0].slice("/black-livros/".length));
    }
  }
  for (const file of walk(`${root}/assets`)) {
    const relative = file.slice(root.length + 1);
    if (!used.has(relative)) rmSync(file);
  }
  console.log(
    `HTML estático otimizado: sem hidratação React; contador ${Buffer.byteLength(countdown)} bytes.`,
  );
}
