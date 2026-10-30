import { partytownSnippet } from "@qwik.dev/partytown/integration";

// Experimental URL mode only until network checks confirm the existing tags.
// GA4 stays on the main thread so page-exit/user_engagement events remain native.
const snippet = partytownSnippet({
  lib: "/~partytown/v1.0.3/",
  forward: [["dataLayer.push", { preserveBehavior: true }], "gtag", "fbq"],
  loadScriptsOnMainThread: [/googletagmanager\.com\/gtag\/js\?.*id=G-/],
  resolveUrl(url, location, type) {
    if (type === "script" && url.hostname === "connect.facebook.net") {
      const proxy = new URL("/_analytics/script", location.href);
      proxy.searchParams.set("url", url.href);
      return proxy;
    }
    return url;
  },
});

const container = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j)})(window,document,'script','dataLayer','GTM-W327944');`;

export function useWorkerAnalytics(html: string): string {
  let count = 0;
  const result = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (tag, _attrs, body) => {
    if (!body.includes("GTM-W327944")) return tag;
    count++;
    return `<script id="analytics-worker-bootstrap">${snippet}</script><script type="text/partytown">${container}</script>`;
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
