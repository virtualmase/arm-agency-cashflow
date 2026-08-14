import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import superjson from "superjson";
import viteConfig from "../../vite.config";
import { buildSsrPrefetch } from "./ssrCaller";
import type { HeadMeta } from "../../client/src/ssr/prefetch";

const CANONICAL_ORIGIN = (process.env.CANONICAL_ORIGIN || "https://armcashflow-gw96qvq2.manus.space").replace(/\/$/, "");
const SITE_NAME = process.env.SITE_NAME || "ARM Agency";
const FRESH_STATIC_FILES = new Set(["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt", "AGENTS.md"]);

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const clamp = (value: string, limit: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= limit ? normalized : `${normalized.slice(0, limit - 1).trimEnd()}…`;
};

function buildHeadTags(head: HeadMeta) {
  const title = escapeHtml(clamp(head.title || SITE_NAME, 70));
  const description = escapeHtml(clamp(head.description, 200));
  const canonicalUrl = head.canonicalPath ? `${CANONICAL_ORIGIN}${head.canonicalPath}` : "";
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];
  if (canonicalUrl) {
    const escapedUrl = escapeHtml(canonicalUrl);
    tags.push(`<meta property="og:url" content="${escapedUrl}" />`, `<link rel="canonical" href="${escapedUrl}" />`);
  }
  if (head.imagePath) {
    const imageUrl = escapeHtml(head.imagePath.startsWith("http") ? head.imagePath : `${CANONICAL_ORIGIN}${head.imagePath}`);
    const imageAlt = escapeHtml(head.imageAlt || title);
    tags.push(`<meta property="og:image" content="${imageUrl}" />`, `<meta property="og:image:alt" content="${imageAlt}" />`, `<meta name="twitter:image" content="${imageUrl}" />`, `<meta name="twitter:image:alt" content="${imageAlt}" />`);
  }
  if (head.noindex || head.notFound) tags.push(`<meta name="robots" content="noindex, follow" />`);
  return tags.join("\n");
}

function composeHtml(template: string, appHtml: string, head: HeadMeta, dehydratedState: unknown) {
  const serializedState = JSON.stringify(superjson.serialize(dehydratedState)).replace(/</g, "\\u003c");
  const stateScript = `<script>window.__RQ_STATE__ = ${serializedState}</script>`;
  return template
    .replace("</body>", () => `${stateScript}</body>`)
    .replace("<!--app-head-->", () => buildHeadTags(head))
    .replace("<!--app-html-->", () => appHtml);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: { middlewareMode: true, hmr: { server }, allowedHosts: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/entry-client.tsx"`, `src="/src/entry-client.tsx?v=${nanoid()}"`);
      template = await vite.transformIndexHtml(req.originalUrl, template);
      template = template.replace("</head>", `<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>`);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const prefetch = await buildSsrPrefetch(req, res);
      const result = await render(req.originalUrl, prefetch);
      if (result.head.noindex || result.head.notFound) res.set("X-Robots-Tag", "noindex, follow");
      res.status(result.head.notFound ? 404 : 200).set("Cache-Control", "no-cache").type("html").end(
        composeHtml(template, result.html, result.head, result.dehydratedState)
      );
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error("[SSR] dev render failed:", error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  const serverEntryPath = path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");
  const templatePath = path.resolve(distPath, "index.html");

  app.use((req, res, next) => {
    if (req.path === "/index.html") return res.redirect(301, "/");
    if (req.path !== "/" && /\/+$/ .test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(301, `${req.path.replace(/\/+$/, "")}${query}`);
    }
    next();
  });
  app.use(express.static(distPath, {
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      if (FRESH_STATIC_FILES.has(path.basename(filePath))) {
        res.setHeader("Cache-Control", "no-cache");
        return;
      }
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }));
  app.use("*", async (req, res) => {
    const template = await fs.promises.readFile(templatePath, "utf-8");
    try {
      const { render } = await import(serverEntryPath);
      const prefetch = await buildSsrPrefetch(req, res);
      const result = await render(req.originalUrl, prefetch);
      if (result.head.noindex || result.head.notFound) res.set("X-Robots-Tag", "noindex, follow");
      res.status(result.head.notFound ? 404 : 200).set("Cache-Control", "no-cache").type("html").end(
        composeHtml(template, result.html, result.head, result.dehydratedState)
      );
    } catch (error) {
      console.error("[SSR] render failed, serving client shell:", error);
      const fallbackHead: HeadMeta = {
        title: SITE_NAME,
        description: "ARM Agency helps accountable teams design, deploy, and govern reliable AI workflows and agent infrastructure.",
      };
      res.status(200).set("Cache-Control", "no-cache").type("html").end(
        template.replace("<!--app-head-->", () => buildHeadTags(fallbackHead)).replace("<!--app-html-->", "")
      );
    }
  });
}
