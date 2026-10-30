import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAllowedAnalyticsAsset,
  analyticsAssetResponse,
  useWorkerAnalytics,
} from "@/lib/analytics-worker";

afterEach(() => vi.unstubAllGlobals());

describe("Analytics worker asset boundary", () => {
  it.each([
    "http://connect.facebook.net/en_US/fbevents.js",
    "https://connect.facebook.net.evil.example/en_US/fbevents.js",
    "https://user:password@connect.facebook.net/en_US/fbevents.js",
    "https://connect.facebook.net:8443/en_US/fbevents.js",
    "https://connect.facebook.net/arbitrary-path",
    "https://127.0.0.1/en_US/fbevents.js",
  ])("rejects unapproved asset %s", (url) =>
    expect(isAllowedAnalyticsAsset(new URL(url))).toBe(false),
  );
  it.each([
    "https://connect.facebook.net/en_US/fbevents.js",
    "https://connect.facebook.net/signals/config/3018542305084132?v=2.9.432",
  ])("allows only Meta library/config assets: %s", (url) =>
    expect(isAllowedAnalyticsAsset(new URL(url))).toBe(true),
  );
  it("rejects invalid input before making any upstream request", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect(
      (
        await analyticsAssetResponse(
          new Request("https://example.com/_analytics/script?url=https://evil.example"),
        )
      ).status,
    ).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("serves allowed JavaScript without relaying vendor cookies or redirects", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response("/* Meta library */", { headers: { "Set-Cookie": "vendor=private" } }),
      );
    vi.stubGlobal("fetch", fetcher);
    const result = await analyticsAssetResponse(
      new Request(
        "https://example.com/_analytics/script?url=" +
          encodeURIComponent("https://connect.facebook.net/en_US/fbevents.js"),
      ),
    );
    expect(result.status).toBe(200);
    expect(result.headers.get("Set-Cookie")).toBeNull();
    expect(fetcher.mock.calls[0]?.[1]?.redirect).toBe("error");
  });
});

describe("Opt-in worker HTML", () => {
  it("preserves the GTM loader and page markup while offloading Meta", () => {
    const result = useWorkerAnalytics(
      "<html><head><script>/* GTM-W327944 */</script></head><body><main>Oferta</main></body></html>",
    );
    expect(result).toContain("<main>Oferta</main>");
    expect(result).toContain('type="text/partytown"');
    expect(result).toContain("analytics-worker-bootstrap");
    expect(result).toContain("__metaOriginalStub");
  });
  it("generates valid browser scripts and cannot install a second worker bootstrap", () => {
    const result = useWorkerAnalytics(
      "<html><head><script>/* GTM-W327944 */</script></head><body>Oferta</body></html>",
    );
    for (const match of result.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))
      expect(() => new Function(match[1] || "")).not.toThrow();
    expect(useWorkerAnalytics(result)).toBe(result);
  });
  it("requires one unambiguous container before changing analytics", () => {
    expect(() => useWorkerAnalytics("<html><body>Sem tags</body></html>")).toThrow();
  });
});
