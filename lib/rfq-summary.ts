import type { Quote } from "./quote.ts";
import { lineTitle } from "./line-items.ts";
export function rfqSummary(d: Quote) {
  return [
    "BEARTRAPS.CA — EQUIPMENT REQUEST",
    "Prepared locally. Not submitted.",
    "Intended recipient: info@beartraps.ca",
    "",
    ...d.items.flatMap((i, n) => [
      `${n + 1}. ${lineTitle(i)} — Quantity: ${i.quantity}`,
      `Request type: ${i.kind}${i.productSlug ? " / Product: " + i.productSlug : ""}${i.variantId ? " / Variant: " + i.variantId : ""}`,
      `Line specifications: ${i.specifications || "To be confirmed"}`,
      "",
    ]),
    `Contact: ${d.name}`,
    `Organization: ${d.organization}`,
    `Buyer type: ${d.buyerType}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone}`,
    `Province: ${d.province}`,
    `Delivery destination: ${d.destination}`,
    `Delivery deadline: ${d.desiredDate || "To be confirmed"}`,
    `Tender reference: ${d.tenderReference || "None"}`,
    `Closing date/time: ${[d.closingDate, d.closingTime, d.closingTimezone].filter(Boolean).join(" ") || "Not specified"}`,
    `Procurement document reference: ${d.procurementReference || "None"}`,
    `Technical requirements: ${d.requirements}`,
    `Freight needs: ${d.freightNeeds}`,
    `Installation needs: ${d.installationNeeds}`,
    `Notes: ${d.notes}`,
    "",
    "Product selection, compatibility, delivery, buyer authorization and jurisdiction eligibility require human review. This request does not submit a tender bid.",
  ].join("\n");
}
