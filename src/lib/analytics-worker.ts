import { partytownSnippet } from "@qwik.dev/partytown/integration";

// Keep GTM/Google/GA4 on their original thread. Only Meta is offloaded, so
// GA4 configuration, conversions and page-exit events keep their native state.
const snippet = partytownSnippet({
  lib: "/~partytown/v1.0.3/",
  forward: ["__metaCommand"],
  resolveUrl(url, location, type) {
    if (type === "script" && url.hostname === "connect.facebook.net") {
      const proxy = new URL("/_analytics/script", location.href);
      proxy.searchParams.set("url", url.href);
      return proxy;
    }
    return url;
  },
});

// The original Meta API queue is retained for Partytown's automatic fallback.
// GTM still issues the same init/track calls. The worker only hosts the runtime.
const mainSetup = `(function(w,d){if(w.__metaWorkerActive)return;w.__metaWorkerActive=true;var n=w.fbq;if(!n){n=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.push=n;n.loaded=true;n.version='2.0';n.queue=[];w.fbq=n;w._fbq=n}w.__metaOriginalStub=n;function rewrite(node){if(w.__metaWorkerActive&&node&&node.nodeName==='SCRIPT'&&node.src){try{var u=new URL(node.src,d.baseURI);if(u.hostname==='connect.facebook.net'&&/^\\/[a-z]{2}_[A-Z]{2}\\/fbevents\\.js$/.test(u.pathname))node.src='/_analytics/meta-placeholder.js'}catch(e){}}}var append=Node.prototype.appendChild,insert=Node.prototype.insertBefore;Node.prototype.appendChild=function(node){rewrite(node);return append.call(this,node)};Node.prototype.insertBefore=function(node,before){rewrite(node);return insert.call(this,node,before)}})(window,document);`;
const restoreApiAttributes = `(function(w){var q=w.__metaOriginalStub.queue,push=Array.prototype.push;q.push=function(command){var result=push.call(q,command);if(w.__metaWorkerActive)w.__metaCommand(Array.prototype.slice.call(command));return result}})(window);`;
const metaRuntime = `(function(w,d){var inWorker=d.currentScript&&d.currentScript.type.indexOf('partytown')>=0;if(!inWorker){w.__metaWorkerActive=false;if(w.__metaOriginalStub){w.fbq=w.__metaOriginalStub;w._fbq=w.fbq}}var n=w.fbq;if(inWorker||!n||typeof n!=='function'){n=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.push=n;n.loaded=true;n.version='2.0';n.queue=[];w.fbq=n;w._fbq=n}w.__metaCommand=function(command){w.fbq.apply(w,command)};if(n.callMethod)return;var s=d.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';d.head.appendChild(s)})(window,document);`;

export function useWorkerAnalytics(html: string): string {
  if (html.includes('id="analytics-worker-bootstrap"')) return html;
  let count = 0;
  const result = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (tag, _attrs, body) => {
    if (!body.includes("GTM-W327944")) return tag;
    count++;
    return `<script id="analytics-worker-bootstrap">${mainSetup}${snippet}${restoreApiAttributes}</script><script type="text/partytown">${metaRuntime}</script>${tag}`;
  });
  if (count !== 1) throw new Error("Expected exactly one GTM bootstrap");
  return result;
}

export function isAllowedAnalyticsAsset(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    url.hostname === "connect.facebook.net" &&
    !url.username &&
    !url.password &&
    !url.port &&
    (/^\/[a-z]{2}_[A-Z]{2}\/fbevents\.js$/.test(url.pathname) ||
      /^\/signals\/config\/\d+$/.test(url.pathname))
  );
}

export async function analyticsAssetResponse(request: Request): Promise<Response> {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const raw = new URL(request.url).searchParams.get("url");
  let url: URL;
  try {
    url = new URL(raw || "");
  } catch {
    return new Response("Invalid asset", { status: 400 });
  }
  if (!isAllowedAnalyticsAsset(url) || url.href.length > 8000)
    return new Response("Invalid asset", { status: 400 });
  try {
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: { Accept: "application/javascript" },
    });
    if (!response.ok) return new Response("Asset unavailable", { status: 502 });
    const body = await response.arrayBuffer();
    if (body.byteLength > 2_000_000) return new Response("Asset too large", { status: 502 });
    return new Response(body, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Asset unavailable", { status: 502 });
  }
}
