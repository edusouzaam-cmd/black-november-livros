import { spawn } from "node:child_process";
const port = "4178";
const server = spawn(process.execPath, [".output/server/index.mjs"], {
  env: { ...process.env, PORT: port, HOST: "127.0.0.1" },
  stdio: ["ignore", "inherit", "inherit"],
});
process.env["SITE_ORIGIN"] = `http://127.0.0.1:${port}`;
process.env["CHECK_BASE"] = "/";
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(process.env["SITE_ORIGIN"])).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) throw new Error("Servidor de produção não iniciou.");
  await import("./check-browser-kinghost.mjs");
} finally {
  server.kill();
}
