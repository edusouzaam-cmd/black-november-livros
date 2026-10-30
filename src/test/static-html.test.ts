import { describe, expect, it } from "vitest";
import { optimizeHtml, countdownBootstrap } from "@/lib/static-html.mjs";

const body =
  '<main><h1>Oferta</h1><a href="/termos-de-uso">Termos</a><details><summary>Dúvida</summary>Resposta</details><div role="timer" data-offer-deadline="1796093999000"><span data-countdown-part="0">--</span></div></main>';

describe("Production HTML", () => {
  it("preserves content, styles, fonts and analytics while removing hydration", () => {
    const html = `<html><head><link rel="modulepreload" href="/assets/react.js"/><link rel="stylesheet" href="/assets/styles.css"/><link rel="preload" as="font" href="/assets/montserrat.woff2"/><script>/* GTM-W327944 */</script></head><body>${body}<script data-tsr-stream-part="">/* router state */</script><script type="module" src="/assets/react.js"></script><script>document.currentScript.remove();/*$tsr-stream-boundary*/</script></body></html>`;
    const result = optimizeHtml(html);
    expect(result).toContain(body);
    expect(result).toContain('href="/assets/styles.css"');
    expect(result).toContain('href="/assets/montserrat.woff2"');
    expect(result).toContain("GTM-W327944");
    expect(result).not.toContain("/assets/react.js");
    expect(result).not.toContain("data-tsr-stream-part");
    expect(result).toContain(countdownBootstrap);
  });
  it("preserves structured data and doesn't add a timer to legal pages", () => {
    const html =
      '<html><body><h1>Termos</h1><script type="application/ld+json">{"@type":"WebPage"}</script></body></html>';
    expect(optimizeHtml(html)).toBe(html);
  });
  it("stops if an unfamiliar interactive script could be required", () => {
    expect(() =>
      optimizeHtml("<html><body><script>startNewWidget()</script></body></html>"),
    ).toThrow();
  });
  it("allows the KingHost packager to reference its hashed external timer", () => {
    const result = optimizeHtml(
      `<html><body>${body}</body></html>`,
      '<script defer src="/black-livros/assets/timer.js"></script>',
    );
    expect(result).toContain('src="/black-livros/assets/timer.js"');
    expect(result).not.toContain(countdownBootstrap);
  });
});
