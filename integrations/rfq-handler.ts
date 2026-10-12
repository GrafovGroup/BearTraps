// Framework-neutral server contract for a separately deployed service. Not a Next route.
import { quoteSchema, type Quote } from "../lib/quote.ts";
import type { Receipt } from "../lib/rfq-delivery.ts";
export type BackendDependencies = {
  allowedOrigins: string[];
  allowRequest: (request: Request) => Promise<boolean>;
  verifySpam: (request: Request, body: unknown) => Promise<boolean>;
  acceptDurably: (quote: Quote, key: string) => Promise<Receipt>;
};
export async function handleRfq(
  request: Request,
  deps: BackendDependencies,
): Promise<Response> {
  const respond = (body: unknown, status: number) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST")
    return respond({ error: "Method not allowed" }, 405);
  if (!deps.allowedOrigins.includes(request.headers.get("origin") || ""))
    return respond({ error: "Origin not allowed" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return respond({ error: "Expected JSON" }, 415);
  const key = request.headers.get("idempotency-key") || "";
  if (!/^[a-f0-9-]{36}$/i.test(key))
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
    const result = quoteSchema.safeParse(raw);
    if (!result.success)
      return respond(
        { error: "Invalid RFQ", fields: result.error.flatten() },
        400,
      );
    if (!(await deps.verifySpam(request, raw)))
      return respond({ error: "Request could not be verified" }, 403);
    const receipt = await deps.acceptDurably(result.data, key);
    if (
      receipt.status !== "accepted" ||
      !receipt.reference ||
      Number.isNaN(Date.parse(receipt.acceptedAt))
    )
      return respond({ error: "Acceptance was not confirmed" }, 502);
    return respond(receipt, 202);
  } catch {
    return respond(
      { error: "Unable to confirm receipt. Keep your RFQ and retry later." },
      503,
    );
  }
}
