import { contactSchema, type Contact } from "./contact.ts";

export const formspreeEndpoint = "https://formspree.io/f/xqpedwyv";

export async function submitFormspree(
  contact: Contact,
  fetcher: typeof fetch = fetch,
) {
  const data = contactSchema.parse(contact);
  const response = await fetcher(formspreeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...data, _gotcha: data.website }),
    credentials: "omit",
    signal: AbortSignal.timeout(15000),
    redirect: "error",
  });
  const result: unknown = await response.json();
  if (
    !response.ok ||
    !result ||
    typeof result !== "object" ||
    !("ok" in result) ||
    result.ok !== true
  ) {
    throw new Error(
      response.status === 429
        ? "Too many attempts. Please wait before trying again, or email info@beartraps.ca."
        : "Your message could not be confirmed. Your details are still here; try again or email info@beartraps.ca.",
    );
  }
}
