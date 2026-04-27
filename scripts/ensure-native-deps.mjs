import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

function canResolve(specifier) {
  try {
    require.resolve(specifier)
    return true
  } catch {
    return false
  }
}

function isCiLinuxBuild() {
  return process.platform === "linux" && Boolean(process.env.CI)
}

if (!isCiLinuxBuild()) {
  process.exit(0)
}

const missingPackages = []

if (!canResolve("lightningcss-linux-x64-gnu")) {
  missingPackages.push("lightningcss-linux-x64-gnu@1.32.0")
}

if (!canResolve("@img/sharp-linux-x64")) {
  missingPackages.push("@img/sharp-linux-x64@0.33.5")
}

if (!canResolve("@img/sharp-libvips-linux-x64")) {
  missingPackages.push("@img/sharp-libvips-linux-x64@1.0.4")
}

if (missingPackages.length === 0) {
  process.exit(0)
}

console.log(`Installing missing native packages: ${missingPackages.join(", ")}`)

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const result = spawnSync(
  npmCommand,
  ["install", "--no-save", "--no-package-lock", ...missingPackages],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_optional: "true",
    },
  },
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
