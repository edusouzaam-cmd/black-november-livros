import { createHash } from "node:crypto";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";

// KingHost serves the prerendered HTML directly. Every interaction except the
// countdown is native HTML (anchors and details); React remains in Lovable.
export function optimizeStatic(root) {
  const countdown = `(()=>{const timer=document.querySelector('[data-offer-deadline]');if(!timer)return;const deadline=Number(timer.dataset.offerDeadline),parts=timer.querySelectorAll('[data-countdown-part]');let interval;function update(){const left=Math.max(0,deadline-Date.now());if(!left){const ended=document.createElement('p');ended.className='font-semibold text-[#00aeef]';ended.textContent='Oferta encerrada';timer.replaceWith(ended);clearInterval(interval);return}const values=[Math.floor(left/86400000),Math.floor(left/3600000)%24,Math.floor(left/60000)%60,Math.floor(left/1000)%60];parts.forEach((part,i)=>{const value=String(values[i]).padStart(2,'0');if(part.textContent!==value)part.textContent=value})}update();if(timer.isConnected)interval=setInterval(update,1000);document.addEventListener('visibilitychange',()=>{clearInterval(interval);if(!document.hidden&&timer.isConnected){update();if(timer.isConnected)interval=setInterval(update,1000)}})})();`;
  const name = `countdown-${createHash("sha256").update(countdown).digest("hex").slice(0, 12)}.js`;
  const pages = ["index.html", "termos-de-uso/index.html", "politica-de-privacidade/index.html"];
  for (const page of pages) {
    let html = readFileSync(`${root}/${page}`, "utf8");
    html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?\s*>/g, "");
    html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (tag, attrs, body) => {
      if (body.includes("GTM-W327944")) return tag; // Preserve analytics and event timing.
      if (/type="application\/ld\+json"/.test(attrs)) return tag;
      if (
        /type="module"/.test(attrs) ||
        /data-tsr-stream-part/.test(attrs) ||
        body.includes("tsr-scroll-restoration") ||
        body.includes("$tsr-stream-boundary")
      )
        return "";
      throw new Error(`Script desconhecido em ${page}; revisar antes de remover.`);
    });
    if (page === "index.html") {
      if (!html.includes("data-offer-deadline")) throw new Error("Contador não encontrado.");
      html = html.replace(
        "</body>",
        `<script defer src="/black-livros/assets/${name}"></script></body>`,
      );
    }
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
