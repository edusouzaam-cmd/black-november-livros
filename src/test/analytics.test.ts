import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { analyticsBootstrap } from "@/lib/analytics";

function setup(existingQueue?: { event: string }[]) {
  const scripts: { src?: string; async?: boolean; fetchPriority?: string }[] = [];
  const window = { dataLayer: existingQueue };
  const context = {
    window,
    document: {
      createElement: () => ({}),
      head: { appendChild: (script: (typeof scripts)[number]) => scripts.push(script) },
    },
  };
  const boot = () => runInNewContext(analyticsBootstrap, context);
  boot();
  return { window, scripts, boot };
}

describe("Analytics bootstrap", () => {
  it("preserves existing events and the original GTM container", () => {
    const app = setup([{ event: "existing-event" }]);
    expect(app.window.dataLayer?.map((event) => event.event)).toEqual(["existing-event", "gtm.js"]);
    expect(app.scripts).toEqual([
      {
        async: true,
        fetchPriority: "low",
        src: "https://www.googletagmanager.com/gtm.js?id=GTM-W327944",
      },
    ]);
  });
  it("initializes the event queue on a fresh page", () => {
    const app = setup();
    expect(app.window.dataLayer?.[0]?.event).toBe("gtm.js");
    expect(app.scripts).toHaveLength(1);
  });
  it("does not inject duplicate containers or duplicate page initialization events", () => {
    const app = setup();
    app.boot();
    expect(app.scripts).toHaveLength(1);
    expect(app.window.dataLayer).toHaveLength(1);
  });
});
