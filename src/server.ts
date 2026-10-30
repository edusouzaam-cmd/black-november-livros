import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { optimizeHtml } from "./lib/static-html.mjs";
import { analyticsAssetResponse, useWorkerAnalytics } from "./lib/analytics-worker";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const requestUrl = new URL(request.url);
      if (requestUrl.pathname === "/_analytics/script")
        return await analyticsAssetResponse(request);
      const preview = requestUrl.pathname === "/_analytics/preview";
      const pageUrl = new URL(requestUrl);
      if (preview) {
        pageUrl.pathname = "/";
        pageUrl.search = "analytics=worker";
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(
        preview ? new Request(pageUrl, request) : request,
        env,
        ctx,
      );
      const normalized = await normalizeCatastrophicSsrResponse(response);
      // The public pages are fully rendered on the server and use native links
      // and details. Keep React in the editor, but don't hydrate these pages in
      // production. KingHost has its own packaging pass with the same helper.
      const pathname = pageUrl.pathname.replace(/\/$/, "") || "/";
      if (
        import.meta.env.PROD &&
        import.meta.env.BASE_URL === "/" &&
        request.method === "GET" &&
        normalized.status === 200 &&
        ["/", "/termos-de-uso", "/politica-de-privacidade"].includes(pathname) &&
        normalized.headers.get("content-type")?.includes("text/html")
      ) {
        const html = await normalized.text();
        const headers = new Headers(normalized.headers);
        headers.delete("content-length");
        let body = html;
        try {
          body = optimizeHtml(html);
          if (pageUrl.searchParams.get("analytics") === "worker") {
            body = useWorkerAnalytics(body);
            headers.set("Cache-Control", "no-store");
          }
        } catch (error) {
          // A future interactive component may need hydration. Preserve the
          // original working response if the optimizer doesn't recognize it.
          console.warn("Static optimization skipped:", error);
        }
        return new Response(body, { status: normalized.status, headers });
      }
      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
