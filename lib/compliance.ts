export type Eligibility = {
  legalStatus: "unknown" | "restricted" | "permitted";
  buyerVerified: boolean;
  jurisdictionVerified: boolean;
  evidenceVerified: boolean;
};
export function assessEligibility(v: Eligibility): {
  purchaseAllowed: false;
  reviewStatus: "blocked" | "ready-for-quote";
} {
  return {
    purchaseAllowed: false,
    reviewStatus:
      v.legalStatus !== "unknown" &&
      v.buyerVerified &&
      v.jurisdictionVerified &&
      v.evidenceVerified
        ? "ready-for-quote"
        : "blocked",
  };
}

import type { Product } from "./product-schema.ts";
export function reviewProduct(
  p: Product,
  province: string,
  buyerType: string,
  buyerVerified = false,
) {
  const record = p.jurisdictions.find((j) => j.province === province);
  const served = p.provincesServed.includes(
    province as Product["provincesServed"][number],
  );
  const evidence = !!record?.evidence;
  const eligible =
    !!record?.buyerTypes.includes(buyerType) &&
    p.buyerEligibility.includes(buyerType) &&
    buyerVerified;
  return {
    purchaseAllowed: false as const,
    humanReviewRequired: true as const,
    status:
      served &&
      evidence &&
      eligible &&
      (record?.status === "permitted" || record?.status === "restricted")
        ? ("review-required" as const)
        : ("blocked" as const),
    reason: !served
      ? "Destination service scope is unverified"
      : !record || record.status === "unknown"
        ? "Legal status is unknown"
        : record.status === "prohibited"
          ? "Recorded restriction blocks supply"
          : !evidence
            ? "Evidence is missing"
            : !eligible
              ? "Buyer authorization requires verification"
              : "Human review is required before any supply decision",
  };
}
