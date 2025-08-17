//issue flags based on doc rules
export function detectIssue(
  settlementStatus: string,
  transactionAmount: number,
  totalSettledAmount: number,
  transactionDate: string,
  lastSettlementDate: string | null
): "CRITICAL" | "WARNING" | "NONE" {
  const txnDate = new Date(transactionDate);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));

  // Over-settled OR no settlement after 7 days
  if (totalSettledAmount > transactionAmount) return "CRITICAL";
  if (settlementStatus === "PENDING" && daysDiff > 7) return "CRITICAL";

  // Warning: Partially settled
  if (settlementStatus === "PARTIAL") return "WARNING";

  return "NONE";
}
