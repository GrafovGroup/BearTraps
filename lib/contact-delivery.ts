import { z } from "zod";
import { contactSchema, type Contact } from "./contact.ts";
export const receiptSchema = z.object({
  status: z.literal("accepted"),
  reference: z.string().regex(/^[A-Za-z0-9_-]{1,100}$/),
  acceptedAt: z.string().datetime(),
});
export type Receipt = z.infer<typeof receiptSchema>;
export type DeliveryAdapter = {
  submit: (quote: Contact, idempotencyKey: string) => Promise<Receipt>;
};
export function contactDelivery(
  endpoint: string,
  fetcher: typeof fetch = fetch,
): DeliveryAdapter {
  const url = new URL(endpoint);
  if (url.protocol !== "https:")
    throw new Error("An HTTPS contact endpoint is required");
  return {
    async submit(quote, key) {
      contactSchema.parse(quote);
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(quote),
        signal: AbortSignal.timeout(15000),
        credentials: "omit",
        redirect: "error",
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "Too many attempts. Please wait before retrying."
            : "Delivery was not confirmed. Keep your contact download and retry later.",
        );
      return receiptSchema.parse(await response.json());
    },
  };
}
