import { Request, Response } from "express";
import { parseCsvFile } from "../utils/csvHelper";
import { db } from "../models/db";
import TransactionModel from "../models/transactionModel";

const importTransactions = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "CSV file is required" });

  try {
    const rows = await parseCsvFile(req.file.path);
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO transactions
      (transaction_id, lifecycle_id, account_id, merchant_name, transaction_date, transaction_amount, currency, status, settlement_status, total_settled_amount, last_settlement_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 0.0, NULL)
    `);

    rows.forEach((r: any) => {
      stmt.run([
        r.transaction_id,
        r.lifecycle_id,
        r.account_id,
        r.merchant_name,
        r.transaction_date,
        parseFloat(r.transaction_amount),
        r.currency,
        r.status
      ]);
    });
    stmt.finalize();

    res.json({ message: "Transactions imported", count: rows.length });
  } catch (err) {
    console.error("importTransactions error", err);
    res.status(500).json({ error: "Failed to import transactions" });
  }
};

const importSettlements = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "CSV file is required" });

  try {
    const rows = await parseCsvFile(req.file.path);
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO settlement_history
      (settlement_id, transaction_id, lifecycle_id, settlement_date, settlement_amount, settlement_type, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    rows.forEach((r: any) => {
      stmt.run([
        r.settlement_id,
        r.transaction_id,
        r.lifecycle_id,
        r.settlement_date,
        parseFloat(r.settlement_amount),
        r.settlement_type,
        r.currency
      ]);
    });
    stmt.finalize();

    //reconcilee after insert settlement
    await TransactionModel.recalcOne(rows[0].transaction_id);

    res.json({ message: "Settlements imported & reconciled", count: rows.length });
  } catch (err) {
    console.error("importSettlements error", err);
    res.status(500).json({ error: "Failed to import settlements" });
  }
};

export default { importTransactions, importSettlements };
