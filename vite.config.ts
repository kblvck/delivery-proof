import { HttpsProxyAgent } from "https-proxy-agent";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// The public REST API sends no CORS headers, so the browser reaches it through
// the dev (and preview) server: /lcd/* is forwarded to QORE_REST_PROXY_TARGET.
// In production, serve the app behind a proxy that does the same, or set
// VITE_QORE_REST_URL to an endpoint that allows your origin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const target = env.QORE_REST_PROXY_TARGET || "https://api-testnet.qore.host";
  const proxyUrl = env.QORE_HTTPS_PROXY;
  const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
  const proxy = {
    "/lcd": { target, agent, changeOrigin: true, rewrite: (p: string) => p.replace(/^\/lcd/, "") },
  };
  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { proxy },
  };
});
