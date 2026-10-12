import { quoteSchema } from "@/lib/quote";
// Delivery integration seam. Enable only with a durable queue, rate limiting,
// verified destination, retention policy and success acknowledgement.
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "Expected JSON" }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "Request body required" }, { status: 400 });
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > 24000) {
      await reader.cancel();
      return Response.json({ error: "Request too large" }, { status: 413 });
    }
    chunks.push(value);
  }
  try {
    const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const result = quoteSchema.safeParse(payload);
    if (!result.success)
      return Response.json(
        { error: "Check request fields", fields: result.error.flatten() },
        { status: 400 },
      );
    return Response.json(
      {
        error:
          "Use the RFQ download to retain your request. Online delivery is unavailable.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
