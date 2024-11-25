import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react-swc";
import DOMPurify from "dompurify";
import fs from "fs";
import { JSDOM } from "jsdom";
import { marked } from "marked";
import { createRequire } from "node:module";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { z } from "zod";

import { treeShakeCareIcons } from "./plugins/treeShakeCareIcons";

const pdfWorkerPath = path.join(
  path.dirname(
    createRequire(import.meta.url).resolve("pdfjs-dist/package.json"),
  ),
  "build",
  "pdf.worker.min.mjs",
);

// Convert goal description markdown to HTML
function getDescriptionHtml(description: string) {
  // note: escaped description causes issues with markdown parsing
  const html = marked.parse(description, {
    async: false,
    gfm: true,
    breaks: true,
  });
  const purify = DOMPurify(new JSDOM("").window);
  const sanitizedHtml = purify.sanitize(html);
  return JSON.stringify(sanitizedHtml);
}

function getPluginAliases() {
  const pluginsDir = path.resolve(__dirname, "apps");
  // Make sure the `apps` folder exists
  if (!fs.existsSync(pluginsDir)) {
    return {};
  }
  const pluginFolders = fs.readdirSync(pluginsDir);

  const aliases = {};

  pluginFolders.forEach((pluginFolder) => {
    const pluginSrcPath = path.join(pluginsDir, pluginFolder, "src");
    if (fs.existsSync(pluginSrcPath)) {
      aliases[`@apps/${pluginFolder}`] = pluginSrcPath;
      aliases[`@app-manifest/${pluginFolder}`] = path.join(
        pluginSrcPath,
        "manifest.ts",
      );
    }
  });

  return aliases;
}

function getPluginDependencies(): string[] {
  const pluginsDir = path.resolve(__dirname, "apps");
  // Make sure the `apps` folder exists
  if (!fs.existsSync(pluginsDir)) {
    return [];
  }
  const pluginFolders = fs.readdirSync(pluginsDir);

  const dependencies = new Set<string>();

  pluginFolders.forEach((pluginFolder) => {
    const packageJsonPath = path.join(pluginsDir, pluginFolder, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const pluginDependencies = packageJson.dependencies
        ? Object.keys(packageJson.dependencies)
        : [];
      pluginDependencies.forEach((dep) => dependencies.add(dep));
    }
  });

  return Array.from(dependencies);
}

/** @type {import('vite').UserConfig} */

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const cdnUrls =
    env.REACT_CDN_URLS ||
    [
      "https://egov-s3-facility-10bedicu.s3.amazonaws.com",
      "https://egov-s3-patient-data-10bedicu.s3.amazonaws.com",
      "http://localhost:4566",
    ].join(" ");

  return {
    envPrefix: "REACT_",
    define: {
      __CUSTOM_DESCRIPTION_HTML__: getDescriptionHtml(
        env.REACT_CUSTOM_DESCRIPTION || "",
      ),
    },
    plugins: [
      federation({
        name: "host",
        remotes: {
          care_livekit: {
            external:
              "http://ohcnetwork.github.io/care_livekit_fe/assets/remoteEntry.js",
            format: "esm",
            from: "vite",
          },
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: "^18.0.0",
          },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: "^18.0.0",
          },
        },
      }),
      ValidateEnv({
        validator: "zod",
        schema: {
          REACT_CARE_API_URL: z.string().url(),

          REACT_SENTRY_DSN: z.string().url().optional(),
          REACT_SENTRY_ENVIRONMENT: z.string().optional(),

          REACT_PLAUSIBLE_SITE_DOMAIN: z
            .string()
            .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,}$/)
            .optional()
            .describe("Domain name without protocol (e.g., sub.domain.com)"),

          REACT_PLAUSIBLE_SERVER_URL: z.string().url().optional(),
          REACT_CDN_URLS: z
            .string()
            .optional()
            .transform((val) => val?.split(" "))
            .pipe(z.array(z.string().url()).optional())
            .describe("Optional: Space-separated list of CDN URLs"),
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: pdfWorkerPath,
            dest: "",
          },
        ],
      }),
      react(),
      checker({ typescript: true }),
      treeShakeCareIcons({
        iconWhitelist: ["default"],
      }),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "service-worker.ts",
        injectRegister: "script-defer",
        devOptions: {
          enabled: true,
          type: "module",
        },
        injectManifest: {
          maximumFileSizeToCacheInBytes: 7000000,
        },
        manifest: {
          name: "Care",
          short_name: "Care",
          theme_color: "#0e9f6e",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "images/icons/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "images/icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "images/icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "images/icons/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        ...getPluginAliases(),
        "@": path.resolve(__dirname, "./src"),
        "@careConfig": path.resolve(__dirname, "./care.config.ts"),
        "@core": path.resolve(__dirname, "src/"),
      },
    },
    optimizeDeps: {
      include: getPluginDependencies(),
    },
    build: {
      outDir: "build",
      assetsDir: "bundle",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (/tiny-invariant/.test(id)) {
                return "vendor";
              }
              const chunks = id.toString().split("node_modules/")[1];
              if (chunks) {
                const [name] = chunks.split("/");
                return `vendor-${name}`;
              }
            }
          },
        },
      },
      target: "esnext",
      modulePreload: {
        polyfill: false,
      },
    },
    server: {
      port: 4000,
    },
    preview: {
      headers: {
        "Content-Security-Policy-Report-Only": `default-src 'self';\
        script-src 'self' blob: 'nonce-f51b9742' https://plausible.10bedicu.in;\
        style-src 'self' 'unsafe-inline';\
        connect-src 'self' https://plausible.10bedicu.in;\
        img-src 'self' https://cdn.ohc.network ${cdnUrls};\
        object-src 'self' ${cdnUrls};`,
      },
      port: 4000,
    },
  };
});
