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
