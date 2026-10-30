import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
const directory = resolve(process.argv[2]);
mkdirSync(directory, { recursive: true });
// Pin tslib: some registry mirrors advertised a tarball not yet available.
writeFileSync(
  `${directory}/package.json`,
  JSON.stringify({ private: true, overrides: { tslib: "2.8.1" } }),
);
const result = spawnSync(
  "npm",
  [
    "install",
    "--no-audit",
    "--no-fund",
    "--prefix",
    directory,
    "playwright@1.58.2",
    "lighthouse@12.8.2",
  ],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
