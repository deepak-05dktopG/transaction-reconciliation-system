import { Request, Response } from "express";
import TransactionModel from "../models/transactionModel";
import { detectIssue } from "../utils/issueHelper";

export const getTransactions = async (_req: Request, res: Response) => {
  try {
    const txns = await TransactionModel.getAllTxns();
    const enriched = txns.map(t => ({
      ...t,
      issue: detectIssue(
        t.settlement_status,
        t.transaction_amount,
        t.total_settled_amount,
        t.transaction_date,
        t.last_settlement_date
      )
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getTransactionDetail = async (req: Request, res: Response) => {
  try {
    const txn = await TransactionModel.getTxnById(req.params.id);
    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    const settlements = await TransactionModel.getSettlementsForTxn(req.params.id);

    res.json({
      ...txn,
      settlements,
      issue: detectIssue(
        txn.settlement_status,
        txn.transaction_amount,
        txn.total_settled_amount,
        txn.transaction_date,
        txn.last_settlement_date
      )
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transaction detail" });
  }
};

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const txns = await TransactionModel.getAllTxns();

    const totalTransactions = txns.length;
    const totalSettlements = txns.reduce((sum, t) => sum + t.total_settled_amount, 0);
    const byStatus: Record<string, number> = {};
    let critical = 0,
      warning = 0,
      outstanding = 0;

    txns.forEach(t => {
      byStatus[t.settlement_status] = (byStatus[t.settlement_status] || 0) + 1;
      const issue = detectIssue(
        t.settlement_status,
        t.transaction_amount,
        t.total_settled_amount,
        t.transaction_date,
        t.last_settlement_date
      );
      if (issue === "CRITICAL") critical++;
      if (issue === "WARNING") warning++;
      if (t.total_settled_amount < t.transaction_amount)
        outstanding += t.transaction_amount - t.total_settled_amount;
    });

    res.json({
      totalTransactions,
      totalSettlements,
      byStatus,
      criticalIssues: critical,
      warningIssues: warning,
      outstandingAmount: outstanding
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};
