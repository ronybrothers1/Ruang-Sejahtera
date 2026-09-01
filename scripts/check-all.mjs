import { spawnSync } from "node:child_process";

const auditTasks = [
  "integrity",
  "auth:audit",
  "responsive:audit",
  "color:audit",
  "typography:audit",
  "components:audit",
  "media:audit",
  "footer:audit",
  "ux:audit",
  "accessibility:audit",
  "accessibility:runtime",
  "components:runtime",
  "performance:audit",
  "design:audit",
  "competition:remediation",
];

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

for (const task of auditTasks) {
  const result = spawnSync(npmCommand, ["run", task], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(`Tidak dapat menjalankan audit ${task}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Seluruh ${auditTasks.length} kontrak audit kompetisi lulus.`);
