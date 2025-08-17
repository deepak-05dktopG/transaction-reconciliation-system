// Simple calculation helpers + issue flags (as per assignment document)
export function computeStatus(total: number, txnAmount: number): string {
  if (total < 0) return "REFUNDED";
  if (total === 0) return "PENDING";
  if (total < txnAmount) return "PARTIAL";
  if (total === txnAmount) return "FULLY_SETTLED";
  return "OVER_SETTLED";
}

export type IssueFlag = "CRITICAL" | "WARNING" | "NONE";

export function detectIssueFlag(
  totalSettled: number,
  txnAmount: number,
  transactionDateISO: string,
  lastSettlementDateISO: string | null
): IssueFlag {
  if (totalSettled > txnAmount) return "CRITICAL";

  if (
    (lastSettlementDateISO == null || totalSettled === 0) &&
    olderThanDays(transactionDateISO, 7)
  ) {
    return "CRITICAL";
  }

  if (totalSettled > 0 && totalSettled < txnAmount) return "WARNING";

  return "NONE";
}

export function olderThanDays(dateISO: string, days: number): boolean {
  const base = new Date(dateISO + "T00:00:00Z").getTime();
  const now = Date.now();
  const diffDays = (now - base) / (1000 * 60 * 60 * 24);
  return diffDays > days;
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + "T00:00:00Z").getTime();
  const b = new Date(bISO + "T00:00:00Z").getTime();
  return Math.abs((b - a) / (1000 * 60 * 60 * 24));
}
