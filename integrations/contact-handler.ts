// Framework-neutral server contract for a separately deployed service. Not a Next route.
import { contactSchema, type Contact } from "../lib/contact.ts";
import { receiptSchema, type Receipt } from "../lib/contact-delivery.ts";
export type BackendDependencies = {
  allowedOrigins: string[];
  allowRequest: (request: Request) => Promise<boolean>;
  verifySpam: (request: Request, body: unknown) => Promise<boolean>;
  acceptDurably: (quote: Contact, key: string) => Promise<Receipt>;
};
export async function handleContact(
  request: Request,
  deps: BackendDependencies,
): Promise<Response> {
  const origin = request.headers.get("origin") || "";
  const allowed = deps.allowedOrigins.includes(origin);
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (allowed) headers["Access-Control-Allow-Origin"] = origin;
  const respond = (body: unknown, status: number) =>
    Response.json(body, { status, headers });
  if (!allowed) return respond({ error: "Origin not allowed" }, 403);
  if (request.method === "OPTIONS") {
    if (request.headers.get("access-control-request-method") !== "POST")
      return respond({ error: "Method not allowed" }, 405);
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
      },
    });
  }
  if (request.method !== "POST")
    return respond({ error: "Method not allowed" }, 405);
  if (!deps.allowedOrigins.includes(request.headers.get("origin") || ""))
    return respond({ error: "Origin not allowed" }, 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return respond({ error: "Expected JSON" }, 415);
  const key = request.headers.get("idempotency-key") || "";
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      key,
    )
  )
    return respond({ error: "Invalid request identifier" }, 400);
  try {
    if (!(await deps.allowRequest(request)))
      return respond({ error: "Rate limited" }, 429);
    const reader = request.body?.getReader();
    if (!reader) return respond({ error: "Body required" }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 128000) {
        await reader.cancel();
        return respond({ error: "Request too large" }, 413);
      }
      chunks.push(value);
    }
    let raw: unknown;
    try {
      raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }
    const result = contactSchema.safeParse(raw);
    if (!result.success)
      return respond(
        { error: "Invalid enquiry", fields: result.error.flatten() },
        400,
      );
    if (!(await deps.verifySpam(request, raw)))
      return respond({ error: "Request could not be verified" }, 403);
    const receipt = await deps.acceptDurably(result.data, key);
    const verified = receiptSchema.safeParse(receipt);
    if (!verified.success)
      return respond({ error: "Acceptance was not confirmed" }, 502);
    return respond(verified.data, 202);
  } catch {
    return respond(
      {
        error: "Unable to confirm receipt. Keep your enquiry and retry later.",
      },
      503,
    );
  }
}

// Use this entry point for the private upstream behind the WHC bridge.
export async function handleAuthenticatedContact(
  request: Request,
  deps: BackendDependencies,
  secret: string,
): Promise<Response> {
  const { timingSafeEqual } = await import("node:crypto");
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (
    secret.length < 32 ||
    Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  )
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  return handleContact(request, deps);
}
