// Shared by Lovable SSR and the KingHost packager. Native HTML handles links
// and FAQ details; the only page interaction requiring JavaScript is the timer.
export const countdownBootstrap = `(()=>{const timer=document.querySelector('[data-offer-deadline]');if(!timer)return;const deadline=Number(timer.dataset.offerDeadline),parts=timer.querySelectorAll('[data-countdown-part]');let interval;function update(){const left=Math.max(0,deadline-Date.now());if(!left){const ended=document.createElement('p');ended.className='font-semibold text-[#00aeef]';ended.textContent='Oferta encerrada';timer.replaceWith(ended);clearInterval(interval);return}const values=[Math.floor(left/86400000),Math.floor(left/3600000)%24,Math.floor(left/60000)%60,Math.floor(left/1000)%60];parts.forEach((part,i)=>{const value=String(values[i]).padStart(2,'0');if(part.textContent!==value)part.textContent=value})}update();if(timer.isConnected)interval=setInterval(update,1000);document.addEventListener('visibilitychange',()=>{clearInterval(interval);if(!document.hidden&&timer.isConnected){update();if(timer.isConnected)interval=setInterval(update,1000)}})})();`;

export function optimizeHtml(html, countdownTag = `<script>${countdownBootstrap}</script>`) {
  html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?\s*>/g, "");
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (tag, attrs, body) => {
    if (body.includes("GTM-W327944") || /type="application\/ld\+json"/.test(attrs)) return tag;
    if (
      /type="module"/.test(attrs) ||
      /data-tsr-stream-part/.test(attrs) ||
      body.includes("tsr-scroll-restoration") ||
      body.includes("$tsr-stream-boundary")
    )
      return "";
    throw new Error("Script desconhecido; manter hidratação até revisar a nova funcionalidade.");
  });
  if (html.includes("data-offer-deadline"))
    html = html.replace("</body>", `${countdownTag}</body>`);
  return html;
}
