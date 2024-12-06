import type { PluginManifest } from "@/pluginTypes";

// Declare the remote entry module
declare module "http://localhost:5173/assets/remoteEntry.js" {
  const manifest: PluginManifest;
  export default manifest;
}

// Declare the shorthand import
declare module "livekit/manifest" {
  const manifest: PluginManifest;
  export default manifest;
}

declare module "livekit" {
  export * from "livekit/manifest";
}
