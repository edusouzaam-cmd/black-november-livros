import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
const root = "kinghost-package";
const base = "/black-livros/";
const origin = "https://engeteles.com.br";
const pages = ["", "termos-de-uso", "politica-de-privacidade"];
for (const file of [
  "index.html",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "htaccess",
  "assets",
]) {
  assert(existsSync(`${root}/${file}`), `Ausente: ${file}`);
}
assert(statSync(`${root}/assets`).isDirectory());
assert(!existsSync(`${root}/.htaccess`), "Arquivo deve chamar htaccess sem ponto");
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const files = walk(root);
for (const file of files) {
  assert(
    !/(?:^|\/)(?:node_modules|src|server|dist|build|black-livros|\.git|\.env[^/]*)(?:\/|$)/.test(
      file,
    ),
    `Arquivo indevido: ${file}`,
  );
  assert(!/\.(?:map|tsx?|zip)$/.test(file), `Arquivo indevido: ${file}`);
}
for (const file of walk("public")) {
  if (file === "public/robots.txt") continue;
  const target = `${root}/${file.slice(7)}`;
  assert(existsSync(target), `Arquivo público ausente: ${file}`);
  assert.equal(
    readFileSync(target).compare(readFileSync(file)),
    0,
    `Arquivo público alterado: ${file}`,
  );
}
let resourceCount = 0;
function checkUrl(raw, from) {
  if (!raw || /^(?:data:|mailto:|tel:|javascript:|#)/.test(raw)) return;
  const url = new URL(raw.replaceAll("&amp;", "&"), `${origin}${base}${from}`);
  if (url.origin !== origin) return;
  assert(url.pathname.startsWith(base), `Recurso fora do base: ${raw}`);
  assert(!url.pathname.includes(`${base}black-livros/`), `Base duplicado: ${raw}`);
  let path = decodeURIComponent(url.pathname.slice(base.length));
  if (!path || path.endsWith("/")) path += "index.html";
  assert(
    existsSync(`${root}/${path}`) || existsSync(`${root}/${path}/index.html`),
    `Recurso inexistente: ${raw} em ${from}`,
  );
  resourceCount++;
}
for (const page of pages) {
  const path = page ? `${page}/index.html` : "index.html";
  const html = readFileSync(`${root}/${path}`, "utf8");
  assert(/<html[^>]+lang="pt-BR"/.test(html), `Idioma: ${path}`);
  const canonical = `${origin}${base}${page}`;
  assert(
    html.includes(`rel="canonical" href="${canonical}"`) ||
      html.includes(`href="${canonical}" rel="canonical"`),
    `Canonical: ${path}`,
  );
  assert(html.includes(`property="og:url" content="${canonical}"`), `OG URL: ${path}`);
  assert(!/Lovable App|Lovable Generated Project|@Lovable/.test(html));
  assert(html.includes(`${base}favicon.ico`));
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) checkUrl(match[1], path);
  assert(html.includes("GTM-W327944"), "GTM deve ser preservado");
  assert(html.includes("Termos de Uso") && html.includes("Política de Privacidade"));
}
for (const file of files.filter((f) => f.endsWith(".css"))) {
  const relative = file.slice(root.length + 1);
  for (const match of readFileSync(file, "utf8").matchAll(/url\(["']?([^)'"\s]+)["']?\)/g))
    checkUrl(match[1], relative);
}
// Check public asset paths embedded in JS, including deferred/lazy images.
for (const file of files.filter((f) => /\.(?:js|html)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(
    /\/black-livros\/assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|svg|woff2?|ico)/g,
  ))
    checkUrl(match[0], "index.html");
}
const robots = readFileSync(`${root}/robots.txt`, "utf8");
assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${origin}${base}sitemap.xml\n`);
const sitemap = readFileSync(`${root}/sitemap.xml`, "utf8");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]),
  pages.map((p) => `${origin}${base}${p}`),
);
assert(readFileSync(`${root}/htaccess`, "utf8").includes("RewriteBase /black-livros/"));
assert.equal(
  readFileSync(`${root}/favicon.ico`).compare(readFileSync("public/favicon.ico")),
  0,
  "Favicon original preservado",
);
console.log(
  `OK: ${files.length} arquivos públicos; 3 páginas HTML; ${resourceCount} referências locais; metadados, sitemap, favicon e htaccess válidos.`,
);
