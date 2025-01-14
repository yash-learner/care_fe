import * as Sentry from "@sentry/browser";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "@/App";
import "@/i18n";
import "@/style/index.css";

// Extend Window interface to include CARE_API_URL
declare global {
  interface Window {
    CARE_API_URL: string;
  }
}

// Set API URL from environment variable
window.CARE_API_URL = import.meta.env.REACT_CARE_API_URL;

if ("serviceWorker" in navigator) {
  registerSW({ immediate: false });
}

if (import.meta.env.PROD) {
  Sentry.init({
    environment: import.meta.env.MODE,
    dsn: "https://8801155bd0b848a09de9ebf6f387ebc8@sentry.io/5183632",
  });
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
