import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { analyticsBootstrap } from "@/lib/analytics";

function setup(readyState = "loading", withIdle = true) {
  const listeners = new Map<string, () => void>();
  const scripts: { src?: string; async?: boolean }[] = [];
  let idle: (() => void) | undefined;
  const window = {
    dataLayer: [{ event: "existing-event" }],
    addEventListener: (name: string, handler: () => void) => listeners.set(name, handler),
    removeEventListener: (name: string) => listeners.delete(name),
    requestIdleCallback: withIdle ? (handler: () => void) => (idle = handler) : undefined,
    setTimeout: (handler: () => void) => (idle = handler),
  };
  const context = {
    window,
    document: {
      readyState,
      createElement: () => ({}),
      head: { appendChild: (script: (typeof scripts)[number]) => scripts.push(script) },
    },
  };
  const boot = () => runInNewContext(analyticsBootstrap, context);
  boot();
  return {
    window,
    scripts,
    boot,
    fire: (event: string) => listeners.get(event)?.(),
    idle: () => idle?.(),
  };
}

describe("Analytics scheduling", () => {
  it("keeps queued events and starts GTM after load in an idle slot", () => {
    const app = setup();
    expect(app.window.dataLayer.map((event) => event.event)).toEqual(["existing-event", "gtm.js"]);
    expect(app.scripts).toHaveLength(0);
    app.fire("load");
    expect(app.scripts).toHaveLength(0);
    app.idle();
    expect(app.scripts).toEqual([
      { async: true, src: "https://www.googletagmanager.com/gtm.js?id=GTM-W327944" },
    ]);
  });

  it.each(["pointerdown", "keydown"])("starts immediately on %s and never loads twice", (event) => {
    const app = setup();
    app.fire(event);
    app.fire("load");
    app.idle();
    app.boot();
    expect(app.scripts).toHaveLength(1);
    expect(app.window.dataLayer).toHaveLength(2);
  });

  it.each([true, false])("also starts on an already loaded page, idle API: %s", (withIdle) => {
    const app = setup("complete", withIdle);
    app.idle();
    expect(app.scripts).toHaveLength(1);
  });
});
