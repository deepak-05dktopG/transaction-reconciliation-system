import { Request, Response } from "express";
import { db } from "../models/db";
import { detectIssueFlag, daysBetween } from "../utils/calc";

export default {
  async summary(_req: Request, res: Response) {
    try {
      const totals = await getSingle(`
        SELECT
          COUNT(*) as total_transactions,
          SUM(CASE WHEN settlement_status='PENDING' THEN 1 ELSE 0 END) as pending_count,
          SUM(CASE WHEN settlement_status='PARTIAL' THEN 1 ELSE 0 END) as partial_count,
          SUM(CASE WHEN settlement_status='FULLY_SETTLED' THEN 1 ELSE 0 END) as fully_count,
          SUM(CASE WHEN settlement_status='OVER_SETTLED' THEN 1 ELSE 0 END) as over_count,
          SUM(CASE WHEN settlement_status='REFUNDED' THEN 1 ELSE 0 END) as refunded_count,
          SUM(total_settled_amount) as total_settled_sum,
          SUM(transaction_amount) as total_txn_sum
        FROM transactions
      `);

      const settlementsTotal = await getSingle(`SELECT COUNT(*) as total_settlements FROM settlement_history`);

      const outstandingAmount = Number(totals.total_txn_sum || 0) - Number(totals.total_settled_sum || 0);

      //issue counts critical or warning
      const allTxns = await getAllTxnsQuick();
      let critical = 0, warning = 0, settledDays: number[] = [], settledCount = 0;

      for (const t of allTxns) {
        const flag = detectIssueFlag(
          Number(t.total_settled_amount || 0),
          Number(t.transaction_amount),
          t.transaction_date,
          t.last_settlement_date
        );
        if (flag === "CRITICAL") critical++;
        if (flag === "WARNING") warning++;

        if (t.last_settlement_date) {
          settledDays.push(daysBetween(t.transaction_date, t.last_settlement_date));
          settledCount++;
        }
      }

      const avgDaysToSettle = settledCount ? (settledDays.reduce((a, b) => a + b, 0) / settledCount) : 0;
      const settlementRate = Number(totals.total_transactions)
        ? (Number(totals.total_transactions) - Number(totals.pending_count)) / Number(totals.total_transactions)
        : 0;

      res.json({
        totals: {
          total_transactions: Number(totals.total_transactions || 0),
          total_settlements: Number(settlementsTotal.total_settlements || 0),
          status_breakdown: {
            PENDING: Number(totals.pending_count || 0),
            PARTIAL: Number(totals.partial_count || 0),
            FULLY_SETTLED: Number(totals.fully_count || 0),
            OVER_SETTLED: Number(totals.over_count || 0),
            REFUNDED: Number(totals.refunded_count || 0),
          },
        },
        issues: { critical, warning },
        metrics: {
          outstanding_amount: Number(outstandingAmount.toFixed(2)),
          avg_days_to_settle: Number(avgDaysToSettle.toFixed(2)),
          settlement_rate: Number(settlementRate.toFixed(2))
        }
      });
    } catch (e) {
      console.error("summary error:", e);
      res.status(500).json({ error: "Failed to compute summary" });
    }
  }
};

function getSingle(sql: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, (e, row) => (e ? reject(e) : resolve(row || {})));
  });
}
function getAllTxnsQuick(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM transactions", (e, rows) => (e ? reject(e) : resolve(rows || [])));
  });
}
