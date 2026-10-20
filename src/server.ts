import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

import * as composicionesApi from "../functions/api/composiciones";
import * as jugadoresApi from "../functions/api/jugadores";
import * as draftsApi from "../functions/api/drafts";
import * as rosterApi from "../functions/api/roster";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Router directo para las APIs de base de datos D1 y Drafter en el entorno de servidor
async function handleApiRequest(request: Request, rawEnv: any): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  const env =
    rawEnv && typeof rawEnv === "object" && "DB" in rawEnv
      ? rawEnv
      : (request as any).runtime?.cloudflare?.env ??
        (request as any).env ??
        (globalThis as any).__env__ ??
        rawEnv ??
        {};

  if (path === "/api/composiciones") {
    if (method === "GET") return await composicionesApi.onRequestGet({ env });
    if (method === "POST" || method === "PUT") return await composicionesApi.onRequestPost({ request, env });
  }

  if (path === "/api/jugadores") {
    if (method === "GET") return await jugadoresApi.onRequestGet({ env });
    if (method === "POST" || method === "PUT") return await jugadoresApi.onRequestPost({ request, env });
  }

  if (path === "/api/drafts") {
    if (method === "GET") return await draftsApi.onRequestGet({ env });
    if (method === "POST" || method === "PUT") return await draftsApi.onRequestPost({ request, env });
    if (method === "DELETE") return await draftsApi.onRequestDelete({ request, env });
  }



  if (path === "/api/roster") {
    if (method === "GET") return await rosterApi.onRequestGet({ env });
    if (method === "POST" || method === "PUT") return await rosterApi.onRequestPost({ request, env });
    if (method === "DELETE") return await rosterApi.onRequestDelete({ request, env });
  }

  return null;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        const apiResponse = await handleApiRequest(request, env);
        if (apiResponse) return apiResponse;
      } catch (apiError: any) {
        console.error("API error:", apiError);
        return new Response(JSON.stringify({ error: apiError?.message || String(apiError) }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
