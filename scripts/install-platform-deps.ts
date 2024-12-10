import { execSync } from "child_process";
import os from "os";

const platform = os.platform();
const arch = os.arch();

const deps: Record<string, Record<string, string[]>> = {
  darwin: {
    arm64: ["@rollup/rollup-darwin-arm64"],
    x64: ["@rollup/rollup-darwin-x64"],
  },
  linux: {
    arm64: ["@rollup/rollup-linux-arm64-gnu"],
    x64: ["@rollup/rollup-linux-x64-gnu"],
  },
};

const platformDeps = deps[platform]?.[arch] || [];

if (platformDeps.length > 0) {
  console.log(
    `Installing platform-specific dependencies for ${platform}-${arch}`,
  );
  try {
    execSync(`npm install --no-save ${platformDeps.join(" ")}`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Failed to install platform-specific dependencies:", error);
    process.exit(1);
  }
}
