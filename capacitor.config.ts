import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Debug APK loads the patient portal over HTTP (emulator → host).
 * Override with CAPACITOR_SERVER_URL, e.g. http://192.168.1.10:4000
 * or a hosted CARE origin. Always opens /patient/login, not staff EMR.
 */
const liveOrigin = (
  process.env.CAPACITOR_SERVER_URL || "http://10.0.2.2:4000"
).replace(/\/$/, "");

const config: CapacitorConfig = {
  appId: "network.ohc.carepatient",
  appName: "CARE",
  webDir: "build",
  server: {
    url: `${liveOrigin}/patient/login`,
    cleartext: liveOrigin.startsWith("http://"),
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
